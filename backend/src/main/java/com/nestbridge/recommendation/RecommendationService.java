package com.nestbridge.recommendation;

import com.nestbridge.common.GhanaReference;
import com.nestbridge.common.PrimaryIntent;
import com.nestbridge.common.ProfileStatus;
import com.nestbridge.content.ContentRecommendationBridge;
import com.nestbridge.guide.GuideProfile;
import com.nestbridge.guide.GuideProfileRepository;
import com.nestbridge.host.HostProfile;
import com.nestbridge.host.HostProfileRepository;
import com.nestbridge.lodging.LodgingPartner;
import com.nestbridge.lodging.LodgingPartnerRepository;
import com.nestbridge.user.ProviderSetup;
import com.nestbridge.user.ProviderSetupRepository;
import com.nestbridge.user.SeekerProfile;
import com.nestbridge.user.SeekerProfileRepository;
import com.nestbridge.user.User;
import com.nestbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private static final int SECTION_LIMIT = 4;

    private final UserRepository userRepository;
    private final SeekerProfileRepository seekerProfileRepository;
    private final ProviderSetupRepository providerSetupRepository;
    private final HostProfileRepository hostProfileRepository;
    private final GuideProfileRepository guideProfileRepository;
    private final LodgingPartnerRepository lodgingPartnerRepository;
    private final ContentRecommendationBridge contentBridge;

    @Transactional(readOnly = true)
    public HomeRecommendationsDto homeForUser(
            UUID userId,
            String cityOverride,
            PrimaryIntent intentOverride
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        SeekerProfile seeker = seekerProfileRepository.findById(userId).orElse(null);
        Map<String, Object> profileData = seeker != null && seeker.getProfileData() != null
                ? seeker.getProfileData()
                : Map.of();
        Map<String, Object> quizAnswers = quizAnswers(profileData);

        String city = cityOverride != null
                ? GhanaReference.normalizeCity(cityOverride)
                : GhanaReference.normalizeCity(stringVal(profileData.get("city")));

        PrimaryIntent role = intentOverride != null
                ? intentOverride
                : (user.getPrimaryIntent() != null ? user.getPrimaryIntent() : PrimaryIntent.TOURIST);

        return switch (role) {
            case STUDENT -> studentRecommendations(city, quizAnswers, profileData);
            case TOURIST -> touristRecommendations(city, quizAnswers);
            case HOST -> hostRecommendations(userId, city);
            case GUIDE -> guideRecommendations(userId, city);
        };
    }

    private HomeRecommendationsDto studentRecommendations(
            String city,
            Map<String, Object> quiz,
            Map<String, Object> profileData
    ) {
        List<RecommendationSectionDto> sections = new ArrayList<>();

        sections.add(section(
                "institutions",
                "Nearby institutions",
                "list",
                institutionItems(city, stringVal(profileData.get("university")))));

        sections.add(section(
                "accommodation",
                "Accommodation near " + city,
                "list",
                hostItems(city, quiz)));

        sections.add(section(
                "transport",
                "Getting around " + city,
                "grid",
                transportItems(city)));

        sections.add(section(
                "guides",
                "Local guides",
                "list",
                guideItems(city, quiz, false)));

        sections.add(section(
                "culture",
                "Cultural tips",
                "grid",
                cultureItems(city)));

        sections.add(section(
                "resources",
                "Student resources",
                "grid",
                studentResourceItems(city)));

        return HomeRecommendationsDto.builder()
                .city(city)
                .role("STUDENT")
                .headline("Recommended for you in " + city)
                .sections(nonEmpty(sections))
                .build();
    }

    private HomeRecommendationsDto touristRecommendations(String city, Map<String, Object> quiz) {
        List<RecommendationSectionDto> sections = new ArrayList<>();

        sections.add(section(
                "attractions",
                "Attractions near " + city,
                "list",
                siteItems(city, quiz)));

        sections.add(section(
                "guides",
                "Guides for your trip",
                "list",
                guideItems(city, quiz, true)));

        sections.add(section(
                "food",
                "Food experiences",
                "list",
                foodExperienceItems(city, quiz)));

        sections.add(section(
                "accommodation",
                "Places to stay",
                "list",
                lodgingAndHostItems(city)));

        sections.add(section(
                "culture",
                "Cultural information",
                "grid",
                cultureItems(city)));

        return HomeRecommendationsDto.builder()
                .city(city)
                .role("TOURIST")
                .headline("Recommended for you in " + city)
                .sections(nonEmpty(sections))
                .build();
    }

    private HomeRecommendationsDto hostRecommendations(UUID userId, String city) {
        HostProfile host = hostProfileRepository.findByUserId(userId).orElse(null);
        ProviderSetup setup = providerSetupRepository.findByUserIdAndTrack(userId, "HOST").orElse(null);
        List<RecommendationItemDto> tips = new ArrayList<>();

        if (host == null) {
            tips.add(item(
                    "tip-host-listing",
                    "PROFILE_TIP",
                    "Finish your host listing",
                    "Add your home details so students can find you",
                    "🏠",
                    "Listing incomplete",
                    null,
                    "AccountSetup"));
        } else {
            if (host.getPhotos() == null || host.getPhotos().isEmpty()) {
                tips.add(item(
                        "tip-host-photos",
                        "PROFILE_TIP",
                        "Add listing photos",
                        "Homes with photos get more booking requests",
                        "📸",
                        "Improve visibility",
                        host.getHostId().toString(),
                        "HostListingEditPhotos"));
            }
            if (host.getHouseRules() == null || host.getHouseRules().isBlank()) {
                tips.add(item(
                        "tip-host-rules",
                        "PROFILE_TIP",
                        "Clarify house rules",
                        "Clear rules help the right guests choose you",
                        "✅",
                        "Profile quality",
                        host.getHostId().toString(),
                        "HostListingEditRules"));
            }
            if (!host.isLocationVerified()) {
                tips.add(item(
                        "tip-host-location",
                        "PROFILE_TIP",
                        "Verify your location",
                        "Verified locations build trust with travellers",
                        "📍",
                        "Trust badge",
                        host.getHostId().toString(),
                        "HostListingEdit"));
            }
        }

        if (setup == null || setup.getStatus() != ProfileStatus.COMPLETE) {
            tips.add(item(
                    "tip-host-setup",
                    "PROFILE_TIP",
                    "Complete host onboarding",
                    "Finish KYC and listing steps to go live",
                    "🛡️",
                    "Setup incomplete",
                    null,
                    "AccountSetup"));
        }

        List<RecommendationItemDto> opportunities = new ArrayList<>();
        opportunities.add(item(
                "opp-host-requests",
                "OPPORTUNITY",
                "Review incoming stay requests",
                "Students looking for homes in " + city,
                "📩",
                "Active demand nearby",
                null,
                "HostRequestsTab"));
        opportunities.add(item(
                "opp-host-calendar",
                "OPPORTUNITY",
                "Keep your calendar updated",
                "Open nights in " + city + " attract more matches",
                "📅",
                "Availability",
                null,
                "HostCalendar"));

        List<RecommendationSectionDto> sections = new ArrayList<>();
        sections.add(section("profile-tips", "Improve your host profile", "list", limit(tips)));
        sections.add(section("opportunities", "Relevant opportunities", "list", limit(opportunities)));

        return HomeRecommendationsDto.builder()
                .city(city)
                .role("HOST")
                .headline("Recommended for you")
                .sections(nonEmpty(sections))
                .build();
    }

    private HomeRecommendationsDto guideRecommendations(UUID userId, String city) {
        GuideProfile guide = guideProfileRepository.findByUserId(userId).orElse(null);
        ProviderSetup setup = providerSetupRepository.findByUserIdAndTrack(userId, "GUIDE").orElse(null);
        List<RecommendationItemDto> tips = new ArrayList<>();

        if (guide == null) {
            tips.add(item(
                    "tip-guide-listing",
                    "PROFILE_TIP",
                    "Create your guide profile",
                    "Set tour types and pricing so travellers can book you",
                    "🗺️",
                    "Listing incomplete",
                    null,
                    "AccountSetup"));
        } else {
            if (guide.getServiceTypes() == null || guide.getServiceTypes().isEmpty()) {
                tips.add(item(
                        "tip-guide-tours",
                        "PROFILE_TIP",
                        "Add tour types",
                        "City, food, and heritage tours perform well in " + city,
                        "🎯",
                        "Tour catalogue",
                        guide.getGuideId().toString(),
                        "TourTypesSetup"));
            }
            if (guide.getPhotos() == null || guide.getPhotos().isEmpty()) {
                tips.add(item(
                        "tip-guide-photos",
                        "PROFILE_TIP",
                        "Add a profile photo",
                        "Travellers book guides they can recognise",
                        "📸",
                        "Trust",
                        guide.getGuideId().toString(),
                        "AccountSetup"));
            }
            if (!guide.isExperienceVerified()) {
                tips.add(item(
                        "tip-guide-experience",
                        "PROFILE_TIP",
                        "Build verified experience",
                        "Complete sessions and reviews to unlock Experience Verified",
                        "⭐",
                        "Trust badge",
                        guide.getGuideId().toString(),
                        "GuideBookingsTab"));
            }
        }

        if (setup == null || setup.getStatus() != ProfileStatus.COMPLETE) {
            tips.add(item(
                    "tip-guide-setup",
                    "PROFILE_TIP",
                    "Complete guide onboarding",
                    "Finish setup to appear in trip recommendations",
                    "🛡️",
                    "Setup incomplete",
                    null,
                    "AccountSetup"));
        }

        List<RecommendationItemDto> opportunities = new ArrayList<>();
        opportunities.add(item(
                "opp-guide-sessions",
                "OPPORTUNITY",
                "New tour requests waiting",
                "Session bookings near " + city,
                "📩",
                "Demand nearby",
                null,
                "IncomingSessionRequests"));
        opportunities.add(item(
                "opp-guide-sites",
                "OPPORTUNITY",
                "Pair tours with local attractions",
                "Highlight sites near " + city,
                "🏛️",
                "Local inventory",
                null,
                "SitesDirectory"));

        List<RecommendationSectionDto> sections = new ArrayList<>();
        sections.add(section("profile-tips", "Improve your guide profile", "list", limit(tips)));
        sections.add(section("opportunities", "Relevant opportunities", "list", limit(opportunities)));

        return HomeRecommendationsDto.builder()
                .city(city)
                .role("GUIDE")
                .headline("Recommended for you")
                .sections(nonEmpty(sections))
                .build();
    }

    private List<RecommendationItemDto> institutionItems(String city, String preferredUniversity) {
        List<String> names = GhanaReference.universitiesForCity(city);
        List<RecommendationItemDto> items = new ArrayList<>();
        for (String name : names) {
            boolean nearby = name.startsWith("Nearby · ");
            String display = nearby ? name.substring("Nearby · ".length()) : name;
            boolean preferred = preferredUniversity != null
                    && !preferredUniversity.isBlank()
                    && display.toLowerCase(Locale.ROOT).contains(preferredUniversity.toLowerCase(Locale.ROOT));
            items.add(RecommendationItemDto.builder()
                    .id("inst-" + slug(display))
                    .type("INSTITUTION")
                    .title(display)
                    .subtitle(nearby
                            ? "Nearby hub for students heading to " + city
                            : "Institution near " + city)
                    .icon("🎓")
                    .reason(preferred
                            ? "Matches your selected university"
                            : (nearby ? "Closest campuses for this destination" : "Local to your destination"))
                    .routeHint("UniversitiesDirectory")
                    .build());
            if (items.size() >= SECTION_LIMIT) {
                break;
            }
        }
        return items;
    }

    private List<RecommendationItemDto> hostItems(String city, Map<String, Object> quiz) {
        List<HostProfile> hosts = hostsForCities(GhanaReference.recommendationSearchCities(city));
        Map<UUID, User> users = loadUsers(hosts.stream().map(HostProfile::getUserId).collect(Collectors.toSet()));
        String budget = stringVal(quiz.get("budget"));

        return hosts.stream()
                .sorted(Comparator
                        .comparing((HostProfile h) -> !cityEquals(h.getCity(), city))
                        .thenComparing(h -> h.getAverageRating() == null ? 0 : -h.getAverageRating().doubleValue()))
                .limit(SECTION_LIMIT)
                .map(host -> {
                    User u = users.get(host.getUserId());
                    String name = u != null ? u.getFullName() : "Host home";
                    boolean local = cityEquals(host.getCity(), city);
                    return RecommendationItemDto.builder()
                            .id(host.getHostId().toString())
                            .type("HOST")
                            .title(name)
                            .subtitle((host.getCity() != null ? host.getCity() : city)
                                    + (host.getPricePerNight() != null
                                    ? " · GHS " + host.getPricePerNight().intValue() + "/night"
                                    : ""))
                            .icon("🏡")
                            .reason(local
                                    ? "Homestay in " + city
                                    : "Nearby stay option for " + city)
                            .targetId(host.getHostId().toString())
                            .routeHint("HostProfile")
                            .priceLabel(host.getPricePerNight() != null
                                    ? "GHS " + host.getPricePerNight().intValue() + "/night"
                                    : null)
                            .matchPercentage(budgetScore(budget, host.getPricePerNight() != null
                                    ? host.getPricePerNight().doubleValue()
                                    : null))
                            .build();
                })
                .toList();
    }

    private List<RecommendationItemDto> guideItems(
            String city,
            Map<String, Object> quiz,
            boolean touristMode
    ) {
        List<GuideProfile> guides = guidesForCities(GhanaReference.recommendationSearchCities(city));
        Map<UUID, User> users = loadUsers(guides.stream().map(GuideProfile::getUserId).collect(Collectors.toSet()));
        String travelStyle = stringVal(quiz.get("travelStyle"));
        String languages = stringVal(quiz.get("languages"));

        return guides.stream()
                .sorted(Comparator
                        .comparing((GuideProfile g) -> -interestBoost(g, travelStyle, touristMode))
                        .thenComparing(g -> !cityEquals(g.getCity(), city))
                        .thenComparing(g -> g.getAverageRating() == null ? 0 : -g.getAverageRating().doubleValue()))
                .limit(SECTION_LIMIT)
                .map(guide -> {
                    User u = users.get(guide.getUserId());
                    String name = u != null ? u.getFullName() : "Local guide";
                    String services = guide.getServiceTypes() != null
                            ? String.join(", ", guide.getServiceTypes().stream().limit(2).toList())
                            : "Local tours";
                    boolean local = cityEquals(guide.getCity(), city);
                    return RecommendationItemDto.builder()
                            .id(guide.getGuideId().toString())
                            .type("GUIDE")
                            .title(name)
                            .subtitle(services + (guide.getCity() != null ? " · " + guide.getCity() : ""))
                            .icon("🗺️")
                            .reason(local
                                    ? reasonForGuide(travelStyle, guide)
                                    : "Guide available near " + city)
                            .targetId(guide.getGuideId().toString())
                            .routeHint("GuideProfile")
                            .priceLabel(guide.getPricePerSession() != null
                                    ? "GHS " + guide.getPricePerSession().intValue() + "/session"
                                    : null)
                            .matchPercentage(languageBoost(languages, guide.getLanguagesOffered()))
                            .build();
                })
                .toList();
    }

    private List<RecommendationItemDto> foodExperienceItems(String city, Map<String, Object> quiz) {
        List<RecommendationItemDto> foodGuides = guideItems(city, quiz, true).stream()
                .filter(item -> {
                    String hay = ((item.getSubtitle() != null ? item.getSubtitle() : "")
                            + " " + (item.getTitle() != null ? item.getTitle() : "")).toLowerCase(Locale.ROOT);
                    return hay.contains("food") || hay.contains("market") || hay.contains("culinary");
                })
                .toList();
        if (!foodGuides.isEmpty()) {
            return foodGuides;
        }
        // Fall back to market/food-oriented sites in the destination cluster.
        return siteItems(city, quiz).stream()
                .filter(item -> {
                    String hay = (item.getTitle() + " " + item.getSubtitle()).toLowerCase(Locale.ROOT);
                    return hay.contains("market") || hay.contains("food") || hay.contains("beach");
                })
                .limit(SECTION_LIMIT)
                .toList();
    }

    private List<RecommendationItemDto> lodgingAndHostItems(String city) {
        List<RecommendationItemDto> items = new ArrayList<>();
        for (String searchCity : GhanaReference.recommendationSearchCities(city)) {
            for (LodgingPartner partner : lodgingPartnerRepository.findByCityIgnoreCaseAndActiveTrue(searchCity)) {
                boolean local = cityEquals(partner.getCity(), city);
                items.add(RecommendationItemDto.builder()
                        .id(partner.getPartnerId().toString())
                        .type("LODGING")
                        .title(partner.getName())
                        .subtitle((partner.getCity() != null ? partner.getCity() : searchCity)
                                + (partner.getCategory() != null ? " · " + partner.getCategory() : ""))
                        .icon("🏨")
                        .reason(local ? "Lodging in " + city : "Nearby lodging for " + city)
                        .targetId(partner.getPartnerId().toString())
                        .routeHint("LodgingDetail")
                        .build());
                if (items.size() >= SECTION_LIMIT) {
                    return items;
                }
            }
        }
        if (items.isEmpty()) {
            items.addAll(hostItems(city, Map.of()));
        }
        return items;
    }

    private List<RecommendationItemDto> siteItems(String city, Map<String, Object> quiz) {
        String travelStyle = stringVal(quiz.get("travelStyle"));
        LinkedHashMap<String, RecommendationItemDto> unique = new LinkedHashMap<>();
        for (String searchCity : GhanaReference.recommendationSearchCities(city)) {
            for (RecommendationItemDto site : contentBridge.sitesNear(searchCity, SECTION_LIMIT * 2)) {
                if (!isSiteRelevantToDestination(site, city, searchCity)) {
                    continue;
                }
                unique.putIfAbsent(site.getId(), site.toBuilder()
                        .reason(cityEquals(extractCityFromSubtitle(site.getSubtitle()), city)
                                ? "Attraction in " + city
                                : "Nearby highlight for travellers to " + city)
                        .build());
            }
        }

        return unique.values().stream()
                .sorted(Comparator.comparing((RecommendationItemDto s) -> -siteBoost(s, travelStyle)))
                .limit(SECTION_LIMIT)
                .toList();
    }

    private List<RecommendationItemDto> transportItems(String city) {
        List<RecommendationItemDto> items = contentBridge.transportNear(city, SECTION_LIMIT);
        if (items.isEmpty()) {
            for (String hub : GhanaReference.nearbyHubCities(city)) {
                items = contentBridge.transportNear(hub, SECTION_LIMIT);
                if (!items.isEmpty()) {
                    break;
                }
            }
        }
        if (items.isEmpty()) {
            return List.of(RecommendationItemDto.builder()
                    .id("transport-fallback")
                    .type("TRANSPORT")
                    .title("Transport guide")
                    .subtitle("Tro-tro, ride apps, and safe transfers")
                    .icon("🚌")
                    .reason("Getting around " + city)
                    .routeHint("TransportGuide")
                    .build());
        }
        return items.stream()
                .map(item -> item.toBuilder().reason("Transport guidance for " + city).build())
                .toList();
    }

    private List<RecommendationItemDto> cultureItems(String city) {
        List<RecommendationItemDto> items = contentBridge.topicsNear(city, SECTION_LIMIT);
        if (items.isEmpty()) {
            for (String hub : GhanaReference.nearbyHubCities(city)) {
                items = contentBridge.topicsNear(hub, SECTION_LIMIT);
                if (!items.isEmpty()) {
                    break;
                }
            }
        }
        if (items.isEmpty()) {
            return List.of(RecommendationItemDto.builder()
                    .id("culture-fallback")
                    .type("CULTURE")
                    .title("Local tips")
                    .subtitle("Greetings, customs, and everyday etiquette")
                    .icon("👋")
                    .reason("Cultural orientation for " + city)
                    .routeHint("LocalTips")
                    .build());
        }
        return items.stream()
                .map(item -> item.toBuilder().reason("Cultural tip for " + city).build())
                .toList();
    }

    private List<RecommendationItemDto> studentResourceItems(String city) {
        List<RecommendationItemDto> items = new ArrayList<>();
        items.add(RecommendationItemDto.builder()
                .id("resource-checklist")
                .type("RESOURCE")
                .title("Prep checklist")
                .subtitle("Documents, packing, and arrival tasks for " + city)
                .icon("✅")
                .reason("Student resource")
                .routeHint("PrepChecklist")
                .build());
        items.add(RecommendationItemDto.builder()
                .id("resource-videos")
                .type("RESOURCE")
                .title("Orientation videos")
                .subtitle("Transport, culture, and settling-in guides")
                .icon("🎬")
                .reason("Student resource")
                .routeHint("VideoLibrary")
                .build());
        items.add(RecommendationItemDto.builder()
                .id("resource-sponsors")
                .type("RESOURCE")
                .title("Sponsors & support")
                .subtitle("Scholarships and travel partners")
                .icon("🎓")
                .reason("Student resource")
                .routeHint("SponsorList")
                .build());
        items.add(RecommendationItemDto.builder()
                .id("resource-events")
                .type("RESOURCE")
                .title("Student events")
                .subtitle("Meetups and campus activities near " + city)
                .icon("📅")
                .reason("Student resource")
                .routeHint("StudentEvents")
                .build());
        return items;
    }

    private boolean isSiteRelevantToDestination(
            RecommendationItemDto site,
            String destination,
            String searchCity
    ) {
        String siteCity = extractCityFromSubtitle(site.getSubtitle());
        if (siteCity.isBlank()) {
            return false;
        }
        String normalizedSite = GhanaReference.normalizeCity(siteCity);
        if (cityEquals(normalizedSite, destination) || cityEquals(normalizedSite, searchCity)) {
            return true;
        }
        return GhanaReference.recommendationSearchCities(destination).stream()
                .anyMatch(c -> cityEquals(normalizedSite, c));
    }

    private String extractCityFromSubtitle(String subtitle) {
        if (subtitle == null || subtitle.isBlank()) {
            return "";
        }
        return subtitle.split("·")[0].trim();
    }

    private List<HostProfile> hostsForCities(List<String> cities) {
        LinkedHashMap<UUID, HostProfile> unique = new LinkedHashMap<>();
        for (String c : cities) {
            for (HostProfile host : hostProfileRepository.findByCityIgnoreCaseAndActiveTrue(c)) {
                unique.putIfAbsent(host.getHostId(), host);
            }
        }
        return new ArrayList<>(unique.values());
    }

    private List<GuideProfile> guidesForCities(List<String> cities) {
        LinkedHashMap<UUID, GuideProfile> unique = new LinkedHashMap<>();
        for (String c : cities) {
            for (GuideProfile guide : guideProfileRepository.findByCityIgnoreCaseAndActiveTrue(c)) {
                unique.putIfAbsent(guide.getGuideId(), guide);
            }
        }
        return new ArrayList<>(unique.values());
    }

    private Map<UUID, User> loadUsers(java.util.Set<UUID> ids) {
        if (ids == null || ids.isEmpty()) {
            return Map.of();
        }
        return userRepository.findAllById(ids).stream()
                .collect(Collectors.toMap(User::getUserId, u -> u));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> quizAnswers(Map<String, Object> profileData) {
        Object raw = profileData.get("quizAnswers");
        if (raw instanceof Map<?, ?> map) {
            Map<String, Object> out = new LinkedHashMap<>();
            map.forEach((k, v) -> out.put(String.valueOf(k), v));
            return out;
        }
        return Map.of();
    }

    private String stringVal(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private boolean cityEquals(String a, String b) {
        if (a == null || b == null) {
            return false;
        }
        return GhanaReference.normalizeCity(a).equalsIgnoreCase(GhanaReference.normalizeCity(b));
    }

    private int interestBoost(GuideProfile guide, String travelStyle, boolean touristMode) {
        if (!touristMode || travelStyle.isBlank() || guide.getServiceTypes() == null) {
            return 0;
        }
        String style = travelStyle.toLowerCase(Locale.ROOT);
        int score = 0;
        for (String service : guide.getServiceTypes()) {
            String s = service.toLowerCase(Locale.ROOT);
            if (style.contains("food") && s.contains("food")) score += 3;
            if (style.contains("history") && (s.contains("heritage") || s.contains("history") || s.contains("museum"))) score += 3;
            if (style.contains("adventure") && (s.contains("nature") || s.contains("hike") || s.contains("adventure"))) score += 3;
            if (style.contains("cultural") && (s.contains("cultural") || s.contains("orientation") || s.contains("city"))) score += 2;
            if (style.contains("relax") && (s.contains("beach") || s.contains("city"))) score += 1;
        }
        return score;
    }

    private int siteBoost(RecommendationItemDto site, String travelStyle) {
        if (travelStyle == null || travelStyle.isBlank()) {
            return 0;
        }
        String hay = (site.getTitle() + " " + site.getSubtitle()).toLowerCase(Locale.ROOT);
        String style = travelStyle.toLowerCase(Locale.ROOT);
        int score = 0;
        if (style.contains("history") && (hay.contains("castle") || hay.contains("heritage") || hay.contains("museum"))) score += 3;
        if (style.contains("adventure") && (hay.contains("park") || hay.contains("canopy") || hay.contains("nature") || hay.contains("mole"))) score += 3;
        if (style.contains("food") && (hay.contains("market") || hay.contains("food"))) score += 3;
        if (style.contains("cultural") && (hay.contains("palace") || hay.contains("cultural") || hay.contains("heritage"))) score += 2;
        if (style.contains("relax") && hay.contains("beach")) score += 2;
        return score;
    }

    private String reasonForGuide(String travelStyle, GuideProfile guide) {
        if (travelStyle != null && !travelStyle.isBlank() && interestBoost(guide, travelStyle, true) > 0) {
            return "Matches your " + travelStyle.toLowerCase(Locale.ROOT) + " interests";
        }
        return "Local guide for your destination";
    }

    private Double budgetScore(String budget, Double price) {
        if (price == null || budget == null || budget.isBlank()) {
            return null;
        }
        String b = budget.toLowerCase(Locale.ROOT);
        if (b.contains("under") || b.contains("budget") || b.contains("150")) {
            return price <= 150 ? 92.0 : price <= 220 ? 78.0 : 65.0;
        }
        if (b.contains("premium") || b.contains("250") || b.contains("luxury")) {
            return price >= 180 ? 90.0 : 75.0;
        }
        return 80.0;
    }

    private Double languageBoost(String languages, List<String> offered) {
        if (languages == null || languages.isBlank() || offered == null || offered.isEmpty()) {
            return null;
        }
        String needle = languages.toLowerCase(Locale.ROOT);
        boolean match = offered.stream().anyMatch(lang -> needle.contains(lang.toLowerCase(Locale.ROOT)));
        return match ? 88.0 : 70.0;
    }

    private RecommendationSectionDto section(
            String id,
            String title,
            String layout,
            List<RecommendationItemDto> items
    ) {
        return RecommendationSectionDto.builder()
                .id(id)
                .title(title)
                .layout(layout)
                .items(items != null ? items : List.of())
                .build();
    }

    private RecommendationItemDto item(
            String id,
            String type,
            String title,
            String subtitle,
            String icon,
            String reason,
            String targetId,
            String routeHint
    ) {
        return RecommendationItemDto.builder()
                .id(id)
                .type(type)
                .title(title)
                .subtitle(subtitle)
                .icon(icon)
                .reason(reason)
                .targetId(targetId)
                .routeHint(routeHint)
                .build();
    }

    private List<RecommendationSectionDto> nonEmpty(List<RecommendationSectionDto> sections) {
        return sections.stream()
                .filter(s -> s.getItems() != null && !s.getItems().isEmpty())
                .toList();
    }

    private List<RecommendationItemDto> limit(List<RecommendationItemDto> items) {
        return items.stream().limit(SECTION_LIMIT).toList();
    }

    private String slug(String value) {
        return value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-");
    }
}
