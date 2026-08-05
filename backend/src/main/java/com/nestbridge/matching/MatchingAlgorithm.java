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
            double budget = budgetScore(host.getPricePerNight(), request.getMaxBudget());
            double proximity = proximityScore(host.getLat(), host.getLng(), request.getUniversityLat(), request.getUniversityLng());
            double cultural = culturalScore(hostUser, request.getCulturalBackgroundPreference());
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

            List<String> reasons = buildHostReasons(host, hostUser, language, diet, budget, proximity, trust);
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
            double budget = budgetScore(guide.getPricePerSession(), request.getMaxBudget());
            double proximity = proximityScore(guide.getLat(), guide.getLng(), request.getUniversityLat(), request.getUniversityLng());
            double trust = trustScore(guide.getAverageRating(), guide.getReviewCount());
            double service = guide.getServiceTypes() != null && !guide.getServiceTypes().isEmpty() ? 80 : 50;

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
            Set<String> offeredLower = offered.stream().map(String::toLowerCase).collect(Collectors.toSet());
            for (String req : request.getDietaryRequirements()) {
                String lower = req.toLowerCase();
                if (isHardDiet(req) && !offeredLower.contains(lower)) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean isHardDiet(String diet) {
        String d = diet.toLowerCase();
        return d.contains("halal") || d.contains("kosher") || d.contains("allergy");
    }

    private double languageScore(User seeker, User target, List<String> preferred) {
        Set<String> targetLangs = new HashSet<>();
        if (target != null && target.getLanguages() != null) {
            Arrays.stream(target.getLanguages()).map(String::toLowerCase).forEach(targetLangs::add);
        }
        List<String> prefs = preferred != null ? preferred : List.of();
        if (prefs.isEmpty() && seeker != null && seeker.getPreferredLanguage() != null) {
            prefs = List.of(seeker.getPreferredLanguage());
        }
        for (String pref : prefs) {
            if (targetLangs.contains(pref.toLowerCase())) {
                return 100;
            }
        }
        if (!targetLangs.isEmpty() && !prefs.isEmpty()) {
            return 50;
        }
        return targetLangs.isEmpty() ? 50 : 0;
    }

    private double dietScore(HostProfile host, List<String> requirements) {
        if (requirements == null || requirements.isEmpty()) return 80;
        List<String> offered = host.getDietOffered() != null ? host.getDietOffered() : List.of();
        Set<String> offeredLower = offered.stream().map(String::toLowerCase).collect(Collectors.toSet());
        long matched = requirements.stream().map(String::toLowerCase).filter(offeredLower::contains).count();
        if (matched == requirements.size()) return 100;
        if (matched > 0) return 60;
        return 0;
    }

    private double lifestyleScore(HostProfile host, String preference) {
        if (preference == null || host.getHouseRules() == null) return 50;
        String rules = host.getHouseRules().toLowerCase();
        String pref = preference.toLowerCase();
        if (pref.contains("quiet") && rules.contains("quiet")) return 100;
        if (pref.contains("social") && (rules.contains("social") || rules.contains("family"))) return 100;
        if (pref.contains("flexible")) return 70;
        return 40;
    }

    private double budgetScore(BigDecimal price, BigDecimal maxBudget) {
        if (price == null || maxBudget == null || maxBudget.compareTo(BigDecimal.ZERO) <= 0) return 50;
        double ratio = price.doubleValue() / maxBudget.doubleValue();
        if (ratio <= 0.6) return 100;
        if (ratio <= 0.8) return 50;
        if (ratio <= 1.0) return 20;
        return 0;
    }

    private double proximityScore(BigDecimal lat1, BigDecimal lng1, BigDecimal lat2, BigDecimal lng2) {
        if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) return 50;
        double km = haversineKm(lat1.doubleValue(), lng1.doubleValue(), lat2.doubleValue(), lng2.doubleValue());
        if (km < 2) return 100;
        if (km < 5) return 80;
        if (km < 10) return 50;
        return 20;
    }

    private double culturalScore(User hostUser, String preference) {
        if (preference == null || hostUser == null || hostUser.getNationality() == null) return 50;
        return hostUser.getNationality().equalsIgnoreCase(preference) ? 100 : 0;
    }

    private double trustScore(BigDecimal rating, int reviewCount) {
        if (reviewCount == 0) return 50;
        double r = rating != null ? rating.doubleValue() : 0;
        return (r / 5.0) * 100;
    }

    private List<String> buildHostReasons(HostProfile host, User user, double lang, double diet, double budget, double prox, double trust) {
        List<String> reasons = new ArrayList<>();
        if (lang >= 80 && user != null && user.getLanguages() != null && user.getLanguages().length > 0) {
            reasons.add("Speaks " + user.getLanguages()[0] + " natively");
        }
        if (diet >= 80 && host.getDietOffered() != null && !host.getDietOffered().isEmpty()) {
            reasons.add("Offers " + String.join(", ", host.getDietOffered()) + " meals");
        }
        if (budget >= 80) reasons.add("Within your budget");
        if (prox >= 80) reasons.add("Close to your university");
        if (trust >= 70 && host.getReviewCount() > 0) {
            reasons.add(host.getReviewCount() + " verified reviews, " + host.getAverageRating() + " star average");
        }
        if (reasons.size() < 2) {
            reasons.add("Verified host in " + (host.getCity() != null ? host.getCity() : "your city"));
        }
        if (reasons.size() < 2) {
            reasons.add("Flexible cancellation policy");
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
