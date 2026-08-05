package com.nestbridge.matching;

import com.nestbridge.guide.GuideProfile;
import com.nestbridge.host.HostProfile;
import com.nestbridge.user.User;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class MatchingAlgorithm {

    public record ScoredHost(HostProfile host, User hostUser, double score, Map<String, Double> breakdown, List<String> reasons) {}

    public record ScoredGuide(GuideProfile guide, User guideUser, double score, Map<String, Double> breakdown, List<String> reasons) {}

    public List<ScoredHost> scoreHosts(
            List<HostProfile> hosts,
            Map<UUID, User> usersById,
            MatchFindRequest request,
            User seeker) {
        List<ScoredHost> results = new ArrayList<>();
        for (HostProfile host : hosts) {
            if (!passesHardFilters(host, request)) {
                continue;
            }
            User hostUser = usersById.get(host.getUserId());
            Map<String, Double> breakdown = new LinkedHashMap<>();
            double language = languageScore(seeker, hostUser, request.getPreferredLanguages());
            double diet = dietScore(host, request.getDietaryRequirements());
            double lifestyle = lifestyleScore(host, request.getLifestylePreference());
            double budget = budgetScore(host.getPricePerNight(), request.getMinBudget(), request.getMaxBudget());
            double proximity = proximityScore(host.getLat(), host.getLng(), request.getUniversityLat(), request.getUniversityLng());
            double cultural = culturalScore(host, hostUser, request.getCulturalBackgroundPreference(), request.getReligionPreference());
            double trust = trustScore(host.getAverageRating(), host.getReviewCount());

            double total = language * 0.20 + diet * 0.20 + lifestyle * 0.15 + budget * 0.15
                    + proximity * 0.15 + cultural * 0.10 + trust * 0.05;

            breakdown.put("language", round(language));
            breakdown.put("diet", round(diet));
            breakdown.put("lifestyle", round(lifestyle));
            breakdown.put("budget", round(budget));
            breakdown.put("proximity", round(proximity));
            breakdown.put("cultural", round(cultural));
            breakdown.put("trust", round(trust));

            List<String> reasons = buildHostReasons(
                    host, hostUser, language, diet, lifestyle, budget, proximity, trust, cultural, request);
            results.add(new ScoredHost(host, hostUser, round(total), breakdown, reasons));
        }
        results.sort(Comparator.comparingDouble(ScoredHost::score).reversed());
        return results;
    }

    public List<ScoredGuide> scoreGuides(
            List<GuideProfile> guides,
            Map<UUID, User> usersById,
            MatchFindRequest request,
            User seeker) {
        List<ScoredGuide> results = new ArrayList<>();
        for (GuideProfile guide : guides) {
            if (!guide.isActive()) continue;
            if (request.getCity() != null && guide.getCity() != null
                    && !guide.getCity().equalsIgnoreCase(request.getCity())) {
                continue;
            }
            if (request.getMinBudget() != null && guide.getPricePerSession() != null
                    && guide.getPricePerSession().compareTo(request.getMinBudget()) < 0) {
                continue;
            }
            if (request.getMaxBudget() != null && guide.getPricePerSession() != null
                    && guide.getPricePerSession().compareTo(request.getMaxBudget()) > 0) {
                continue;
            }
            User guideUser = usersById.get(guide.getUserId());
            Map<String, Double> breakdown = new LinkedHashMap<>();
            double language = languageScore(seeker, guideUser, request.getPreferredLanguages());
            double budget = budgetScore(guide.getPricePerSession(), request.getMinBudget(), request.getMaxBudget());
            double proximity = proximityScore(guide.getLat(), guide.getLng(), request.getUniversityLat(), request.getUniversityLng());
            double trust = trustScore(guide.getAverageRating(), guide.getReviewCount());
            double service = guide.getServiceTypes() != null && !guide.getServiceTypes().isEmpty() ? 85 : 45;

            double total = language * 0.30 + budget * 0.20 + proximity * 0.20 + trust * 0.15 + service * 0.15;
            breakdown.put("language", round(language));
            breakdown.put("budget", round(budget));
            breakdown.put("proximity", round(proximity));
            breakdown.put("trust", round(trust));
            breakdown.put("service", round(service));

            List<String> reasons = buildGuideReasons(guide, guideUser, language, budget, trust);
            results.add(new ScoredGuide(guide, guideUser, round(total), breakdown, reasons));
        }
        results.sort(Comparator.comparingDouble(ScoredGuide::score).reversed());
        return results;
    }

    private boolean passesHardFilters(HostProfile host, MatchFindRequest request) {
        if (!host.isActive()) return false;
        if (request.getCity() != null && host.getCity() != null
                && !host.getCity().equalsIgnoreCase(request.getCity())) {
            return false;
        }
        if (request.getMinBudget() != null && host.getPricePerNight() != null
                && host.getPricePerNight().compareTo(request.getMinBudget()) < 0) {
            return false;
        }
        if (request.getMaxBudget() != null && host.getPricePerNight() != null
                && host.getPricePerNight().compareTo(request.getMaxBudget()) > 0) {
            return false;
        }
        if (request.getDietaryRequirements() != null && !request.getDietaryRequirements().isEmpty()) {
            List<String> offered = host.getDietOffered() != null ? host.getDietOffered() : List.of();
            for (String req : request.getDietaryRequirements()) {
                // Halal/Kosher are non-negotiable hard filters. Allergies score soft
                // so sparse host diet tags do not wipe the whole marketplace.
                if (!isHardDiet(req)) {
                    continue;
                }
                if (!dietOfferedMatches(offered, req)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isHardDiet(String diet) {
        String d = diet.toLowerCase(Locale.ROOT);
        if (d.startsWith("allergy:") || d.contains("food allergies")) {
            return false;
        }
        return d.contains("halal") || d.contains("kosher");
    }

    private boolean offersAllergyAwareMeals(List<String> offered) {
        for (String item : offered) {
            String lower = item.toLowerCase(Locale.ROOT);
            if (lower.contains("allerg") || lower.contains("gluten") || lower.contains("sensitive")) {
                return true;
            }
        }
        return false;
    }

    private boolean dietOfferedMatches(List<String> offered, String requirement) {
        String req = normalizeToken(requirement);
        for (String item : offered) {
            String offeredToken = normalizeToken(item);
            if (offeredToken.equals(req)
                    || offeredToken.contains(req)
                    || req.contains(offeredToken)) {
                return true;
            }
        }
        return false;
    }

    private String normalizeToken(String value) {
        return value == null ? "" : value.toLowerCase(Locale.ROOT).trim();
    }

    private double languageScore(User seeker, User target, List<String> preferred) {
        Set<String> targetLangs = new HashSet<>();
        if (target != null && target.getLanguages() != null) {
            Arrays.stream(target.getLanguages())
                    .filter(Objects::nonNull)
                    .map(this::normalizeToken)
                    .filter(s -> !s.isEmpty())
                    .forEach(targetLangs::add);
        }
        List<String> prefs = preferred != null
                ? preferred.stream().map(this::normalizeToken).filter(s -> !s.isEmpty()).toList()
                : List.of();
        if (prefs.isEmpty() && seeker != null && seeker.getPreferredLanguage() != null) {
            prefs = List.of(normalizeToken(seeker.getPreferredLanguage()));
        }
        if (prefs.isEmpty()) {
            return targetLangs.isEmpty() ? 55 : 70;
        }
        long matches = prefs.stream().filter(targetLangs::contains).count();
        if (matches == 0) {
            return targetLangs.isEmpty() ? 45 : 25;
        }
        if (matches >= prefs.size()) {
            return 100;
        }
        return 70 + (30.0 * matches / prefs.size());
    }

    private double dietScore(HostProfile host, List<String> requirements) {
        if (requirements == null || requirements.isEmpty()) return 75;
        List<String> softReqs = requirements.stream()
                .filter(r -> !normalizeToken(r).startsWith("allergy:"))
                .filter(r -> !normalizeToken(r).equals("food allergies"))
                .toList();
        if (softReqs.isEmpty()) {
            List<String> offered = host.getDietOffered() != null ? host.getDietOffered() : List.of();
            return offersAllergyAwareMeals(offered) ? 90 : 55;
        }
        List<String> offered = host.getDietOffered() != null ? host.getDietOffered() : List.of();
        long matched = softReqs.stream().filter(req -> dietOfferedMatches(offered, req)).count();
        if (matched == softReqs.size()) return 100;
        if (matched > 0) return 55 + (40.0 * matched / softReqs.size());
        return 10;
    }

    private double lifestyleScore(HostProfile host, String preference) {
        if (preference == null || preference.isBlank()) return 55;
        String rules = host.getHouseRules() != null ? host.getHouseRules().toLowerCase(Locale.ROOT) : "";
        String amenitiesBlob = host.getAmenities() != null
                ? String.join(" ", host.getAmenities()).toLowerCase(Locale.ROOT)
                : "";
        String haystack = rules + " " + amenitiesBlob;
        String pref = preference.toLowerCase(Locale.ROOT);

        boolean quietSignals = containsAny(haystack, "quiet", "study", "no party", "no parties", "curfew", "silent");
        boolean socialSignals = containsAny(haystack, "social", "family", "lively", "gather", "welcome guests", "shared");

        if (pref.contains("quiet")) {
            if (quietSignals && !socialSignals) return 100;
            if (quietSignals) return 80;
            if (socialSignals) return 25;
            return 45;
        }
        if (pref.contains("social")) {
            if (socialSignals && !quietSignals) return 100;
            if (socialSignals) return 80;
            if (quietSignals) return 30;
            return 50;
        }
        if (pref.contains("flexible")) {
            return 75;
        }
        return 50;
    }

    private boolean containsAny(String haystack, String... needles) {
        for (String needle : needles) {
            if (haystack.contains(needle)) return true;
        }
        return false;
    }

    private double budgetScore(BigDecimal price, BigDecimal minBudget, BigDecimal maxBudget) {
        if (price == null) return 50;
        if (minBudget == null && maxBudget == null) return 55;

        double p = price.doubleValue();
        Double min = minBudget != null ? minBudget.doubleValue() : null;
        Double max = maxBudget != null ? maxBudget.doubleValue() : null;

        if (min != null && max != null && max >= min) {
            if (p < min || p > max) return 0;
            double mid = (min + max) / 2.0;
            double halfSpan = Math.max((max - min) / 2.0, 1);
            double distance = Math.abs(p - mid) / halfSpan;
            return round(100 - distance * 35);
        }
        if (max != null && max > 0) {
            double ratio = p / max;
            if (ratio <= 0.55) return 100;
            if (ratio <= 0.75) return 85;
            if (ratio <= 0.9) return 65;
            if (ratio <= 1.0) return 45;
            return 0;
        }
        if (min != null) {
            if (p < min) return 0;
            double ratio = p / Math.max(min, 1);
            if (ratio <= 1.15) return 95;
            if (ratio <= 1.4) return 75;
            return 55;
        }
        return 55;
    }

    private double proximityScore(BigDecimal lat1, BigDecimal lng1, BigDecimal lat2, BigDecimal lng2) {
        if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return 50;
        double km = haversineKm(lat1.doubleValue(), lng1.doubleValue(), lat2.doubleValue(), lng2.doubleValue());
        if (km < 2) return 100;
        if (km < 5) return 85;
        if (km < 10) return 65;
        if (km < 20) return 40;
        return 20;
    }

    private double culturalScore(
            HostProfile host,
            User hostUser,
            String culturalPreference,
            String religionPreference) {
        double score = 60;
        if (religionPreference != null && !religionPreference.isBlank()) {
            List<String> friendly = host.getReligionFriendly() != null ? host.getReligionFriendly() : List.of();
            String pref = normalizeToken(religionPreference);
            boolean match = friendly.stream().map(this::normalizeToken).anyMatch(item ->
                    item.equals(pref) || item.contains(pref) || pref.contains(item)
                            || (pref.contains("islam") && item.contains("muslim"))
                            || (pref.contains("christian") && item.contains("christian")));
            score = match ? 100 : (friendly.isEmpty() ? 55 : 25);
        }

        if (culturalPreference != null && !culturalPreference.isBlank()) {
            String pref = normalizeToken(culturalPreference);
            if (pref.contains("similar")) {
                // Without seeker nationality on the request, reward hosts that declare cultural openness.
                List<String> friendly = host.getReligionFriendly() != null ? host.getReligionFriendly() : List.of();
                if (!friendly.isEmpty()) {
                    score = Math.max(score, 80);
                } else if (hostUser != null && hostUser.getNationality() != null) {
                    score = Math.max(score, 70);
                }
            }
        }
        return score;
    }

    private double trustScore(BigDecimal rating, int reviewCount) {
        if (reviewCount <= 0) return 48;
        double r = rating != null ? rating.doubleValue() : 0;
        double ratingPoints = (r / 5.0) * 80;
        double volumeBonus = Math.min(20, reviewCount * 2.0);
        return Math.min(100, ratingPoints + volumeBonus);
    }

    private List<String> buildHostReasons(
            HostProfile host,
            User user,
            double lang,
            double diet,
            double lifestyle,
            double budget,
            double prox,
            double trust,
            double cultural,
            MatchFindRequest request) {
        List<String> reasons = new ArrayList<>();
        if (lang >= 80 && user != null && user.getLanguages() != null && user.getLanguages().length > 0) {
            reasons.add("Speaks " + user.getLanguages()[0]);
        }
        if (diet >= 80 && host.getDietOffered() != null && !host.getDietOffered().isEmpty()) {
            reasons.add("Offers " + String.join(", ", host.getDietOffered()) + " meals");
        }
        if (lifestyle >= 80 && request.getLifestylePreference() != null) {
            reasons.add("Household vibe fits your " + request.getLifestylePreference() + " preference");
        }
        if (budget >= 80) reasons.add("Nightly rate fits your budget");
        if (prox >= 80) reasons.add("Close to your campus or city centre");
        if (cultural >= 85 && request.getReligionPreference() != null) {
            reasons.add("Supports " + request.getReligionPreference() + "-friendly hosting");
        }
        if (trust >= 70 && host.getReviewCount() > 0) {
            reasons.add(host.getReviewCount() + " reviews · "
                    + (host.getAverageRating() != null ? host.getAverageRating() : "—") + "★");
        }
        if (reasons.size() < 2) {
            reasons.add("Verified host in " + (host.getCity() != null ? host.getCity() : "your city"));
        }
        if (reasons.size() < 2) {
            reasons.add("Active listing ready for booking requests");
        }
        return reasons.stream().limit(3).collect(Collectors.toList());
    }

    private List<String> buildGuideReasons(GuideProfile guide, User user, double lang, double budget, double trust) {
        List<String> reasons = new ArrayList<>();
        if (lang >= 80 && user != null && user.getLanguages() != null && user.getLanguages().length > 0) {
            reasons.add("Speaks " + user.getLanguages()[0] + " fluently");
        }
        if (guide.getServiceTypes() != null && !guide.getServiceTypes().isEmpty()) {
            reasons.add("Offers " + guide.getServiceTypes().get(0));
        }
        if (budget >= 80) reasons.add("Within your session budget");
        if (trust >= 70 && guide.getReviewCount() > 0) {
            reasons.add(guide.getReviewCount() + " verified reviews");
        }
        if (reasons.size() < 2) {
            reasons.add("Local expert in " + (guide.getCity() != null ? guide.getCity() : "your area"));
        }
        return reasons.stream().limit(3).collect(Collectors.toList());
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private double round(double v) {
        return BigDecimal.valueOf(v).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}
