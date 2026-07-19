package com.nestbridge.common;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

/**
 * Ghana administrative regions, regional capitals, and tertiary institutions.
 * Mirrors {@code frontend/src/data/ghanaReference.ts}.
 */
public final class GhanaReference {

    public record Region(String name, String capital) {}

    public enum UniversityCategory {
        PUBLIC, TECHNICAL, PRIVATE, SPECIALIZED
    }

    public record University(
            String name,
            UniversityCategory category,
            String town,
            List<String> matchDestinations,
            String strengths
    ) {}

    private static final List<Region> REGIONS = List.of(
            new Region("Ahafo", "Goaso"),
            new Region("Ashanti", "Kumasi"),
            new Region("Bono", "Sunyani"),
            new Region("Bono East", "Techiman"),
            new Region("Central", "Cape Coast"),
            new Region("Eastern", "Koforidua"),
            new Region("Greater Accra", "Accra"),
            new Region("North East", "Nalerigu"),
            new Region("Northern", "Tamale"),
            new Region("Oti", "Dambai"),
            new Region("Savannah", "Damongo"),
            new Region("Upper East", "Bolgatanga"),
            new Region("Upper West", "Wa"),
            new Region("Volta", "Ho"),
            new Region("Western", "Sekondi-Takoradi"),
            new Region("Western North", "Sefwi Wiawso")
    );

    private static final Map<String, String> CITY_ALIASES = Map.ofEntries(
            Map.entry("legon", "Accra"),
            Map.entry("east legon", "Accra"),
            Map.entry("cantonments", "Accra"),
            Map.entry("osu", "Accra"),
            Map.entry("labadi", "Accra"),
            Map.entry("madina", "Accra"),
            Map.entry("adenta", "Accra"),
            Map.entry("tema", "Accra"),
            Map.entry("achimota", "Accra"),
            Map.entry("dansoman", "Accra"),
            Map.entry("spintex", "Accra"),
            Map.entry("airport residential", "Accra"),
            Map.entry("north legon", "Accra"),
            Map.entry("berekuso", "Accra"),
            Map.entry("oyibi", "Accra"),
            Map.entry("greater accra", "Accra"),
            Map.entry("ayeduase", "Kumasi"),
            Map.entry("adum", "Kumasi"),
            Map.entry("mampong", "Kumasi"),
            Map.entry("ashanti", "Kumasi"),
            Map.entry("winneba", "Cape Coast"),
            Map.entry("pedu", "Cape Coast"),
            Map.entry("tarkwa", "Sekondi-Takoradi"),
            Map.entry("takoradi", "Sekondi-Takoradi"),
            Map.entry("sekondi", "Sekondi-Takoradi"),
            Map.entry("sekondi-takoradi", "Sekondi-Takoradi"),
            Map.entry("kalpohin", "Tamale")
    );

    private static final List<University> UNIVERSITIES = List.of(
            uni("University of Ghana (UG)", UniversityCategory.PUBLIC, "Legon", List.of("Accra"),
                    "Humanities, Law, Medicine, Business, Social Sciences"),
            uni("Kwame Nkrumah University of Science and Technology (KNUST)", UniversityCategory.PUBLIC, "Kumasi", List.of("Kumasi"),
                    "Engineering, Architecture, Pharmacy, Computer Science"),
            uni("University of Cape Coast (UCC)", UniversityCategory.PUBLIC, "Cape Coast", List.of("Cape Coast"),
                    "Education, Business, Allied Health, Social Sciences"),
            uni("University for Development Studies (UDS)", UniversityCategory.PUBLIC, "Tamale", List.of("Tamale"),
                    "Medicine, Agriculture, Development Studies, Public Health"),
            uni("University of Education, Winneba (UEW)", UniversityCategory.PUBLIC, "Winneba", List.of("Cape Coast"),
                    "Teacher Education, Educational Policy, Creative Arts"),
            uni("University of Mines and Technology (UMaT)", UniversityCategory.PUBLIC, "Tarkwa", List.of("Sekondi-Takoradi"),
                    "Mining Engineering, Geomatic Engineering, Mineral Technology"),
            uni("University of Health and Allied Sciences (UHAS)", UniversityCategory.PUBLIC, "Ho", List.of("Ho"),
                    "Nursing, Public Health, Pharmacy, Medicine"),
            uni("University of Energy and Natural Resources (UENR)", UniversityCategory.PUBLIC, "Sunyani", List.of("Sunyani"),
                    "Forestry, Renewable Energy, Environmental Sciences"),
            uni("University of Professional Studies, Accra (UPSA)", UniversityCategory.PUBLIC, "Accra", List.of("Accra"),
                    "Accounting, Banking & Finance, Marketing, Law"),
            uni("Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development (AAMUSTED)",
                    UniversityCategory.PUBLIC, "Kumasi", List.of("Kumasi"), "TVET, Entrepreneurship"),
            uni("Accra Technical University (ATU)", UniversityCategory.TECHNICAL, "Accra", List.of("Accra"), null),
            uni("Kumasi Technical University (KsTU)", UniversityCategory.TECHNICAL, "Kumasi", List.of("Kumasi"), null),
            uni("Takoradi Technical University (TTU)", UniversityCategory.TECHNICAL, "Takoradi", List.of("Sekondi-Takoradi"), null),
            uni("Koforidua Technical University (KTU)", UniversityCategory.TECHNICAL, "Koforidua", List.of("Koforidua"), null),
            uni("Ho Technical University (HTU)", UniversityCategory.TECHNICAL, "Ho", List.of("Ho"), null),
            uni("Sunyani Technical University (STU)", UniversityCategory.TECHNICAL, "Sunyani", List.of("Sunyani"), null),
            uni("Cape Coast Technical University (CCTU)", UniversityCategory.TECHNICAL, "Cape Coast", List.of("Cape Coast"), null),
            uni("Bolgatanga Technical University (BTU)", UniversityCategory.TECHNICAL, "Bolgatanga", List.of("Bolgatanga"), null),
            uni("Wa Technical University", UniversityCategory.TECHNICAL, "Wa", List.of("Wa"), null),
            uni("Ashesi University", UniversityCategory.PRIVATE, "Berekuso", List.of("Accra"),
                    "Liberal arts, Computer Science, Engineering"),
            uni("Central University", UniversityCategory.PRIVATE, "Tema", List.of("Accra"), "Business, Theology, Law"),
            uni("Valley View University", UniversityCategory.PRIVATE, "Oyibi", List.of("Accra"), "Computer Science, Business"),
            uni("Academic City University College", UniversityCategory.PRIVATE, "Accra", List.of("Accra"),
                    "AI, Robotics, Design Thinking"),
            uni("Pentecost University", UniversityCategory.PRIVATE, "Accra", List.of("Accra"), "Business, IT, Theology"),
            uni("Catholic University of Ghana (CUG)", UniversityCategory.PRIVATE, "Fiapre", List.of("Sunyani"),
                    "Public Health, Education, Business"),
            uni("Presbyterian University, Ghana", UniversityCategory.PRIVATE, "Abetifi", List.of("Koforidua"),
                    "Healthcare, Agriculture, Business"),
            uni("All Nations University", UniversityCategory.PRIVATE, "Koforidua", List.of("Koforidua"),
                    "Space Science, Engineering, Technology"),
            uni("Lancaster University Ghana", UniversityCategory.PRIVATE, "Accra", List.of("Accra"),
                    "International Business, Law"),
            uni("Ghana Institute of Management and Public Administration (GIMPA)", UniversityCategory.SPECIALIZED, "Accra", List.of("Accra"),
                    "Public Administration, Executive Education, Law"),
            uni("University of Media, Arts and Communication (UniMAC)", UniversityCategory.SPECIALIZED, "Accra", List.of("Accra"),
                    "Journalism, Languages, Film & Television"),
            uni("Regional Maritime University (RMU)", UniversityCategory.SPECIALIZED, "Accra", List.of("Accra"),
                    "Maritime Education")
    );

    private GhanaReference() {}

    private static University uni(
            String name,
            UniversityCategory category,
            String town,
            List<String> matchDestinations,
            String strengths
    ) {
        return new University(name, category, town, matchDestinations, strengths);
    }

    public static List<Region> regions() {
        return REGIONS;
    }

    public static List<String> destinationCapitals() {
        return REGIONS.stream()
                .map(Region::capital)
                .sorted(Comparator.naturalOrder())
                .toList();
    }

    public static List<University> universities() {
        return UNIVERSITIES;
    }

    public static List<String> universitiesForCity(String city) {
        String normalized = normalizeToken(normalizeCity(city));
        List<String> names = new ArrayList<>();
        for (University university : UNIVERSITIES) {
            boolean matches = university.matchDestinations().stream()
                    .anyMatch(destination -> normalizeToken(destination).equals(normalized));
            if (matches) {
                names.add(university.name());
            }
        }
        return names;
    }

    public static String normalizeCity(String city) {
        if (city == null || city.isBlank()) {
            return "Accra";
        }
        String firstPart = city.split(",")[0].trim();
        String token = normalizeToken(firstPart);

        String alias = CITY_ALIASES.get(token);
        if (alias != null) {
            return alias;
        }

        Optional<Region> capitalMatch = REGIONS.stream()
                .filter(region -> normalizeToken(region.capital()).equals(token))
                .findFirst();
        return capitalMatch.map(Region::capital).orElse(firstPart);
    }

    public static boolean isKnownPlace(String text) {
        if (text == null || text.isBlank()) {
            return false;
        }
        String token = normalizeToken(text.split(",")[0].trim());
        if (CITY_ALIASES.containsKey(token)) {
            return true;
        }
        return REGIONS.stream().anyMatch(region ->
                normalizeToken(region.capital()).equals(token)
                        || normalizeToken(region.name()).equals(token));
    }

    private static String normalizeToken(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }
}
