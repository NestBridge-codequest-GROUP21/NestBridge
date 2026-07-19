package com.nestbridge.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reference")
public class ReferenceController {

    @GetMapping("/regions")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> regions() {
        List<Map<String, String>> payload = GhanaReference.regions().stream()
                .map(region -> Map.of(
                        "name", region.name(),
                        "capital", region.capital()
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Regions loaded", payload));
    }

    @GetMapping("/universities")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> universities(
            @RequestParam(required = false) String city
    ) {
        List<GhanaReference.University> source = city == null || city.isBlank()
                ? GhanaReference.universities()
                : GhanaReference.universities().stream()
                .filter(uni -> GhanaReference.universitiesForCity(city).contains(uni.name()))
                .toList();

        List<Map<String, Object>> payload = source.stream()
                .map(uni -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("name", uni.name());
                    row.put("category", uni.category().name());
                    row.put("town", uni.town());
                    row.put("matchDestinations", uni.matchDestinations());
                    if (uni.strengths() != null) {
                        row.put("strengths", uni.strengths());
                    }
                    return row;
                })
                .toList();

        return ResponseEntity.ok(ApiResponse.success("Universities loaded", payload));
    }

    @GetMapping("/destinations")
    public ResponseEntity<ApiResponse<List<String>>> destinations() {
        return ResponseEntity.ok(
                ApiResponse.success("Destinations loaded", GhanaReference.destinationCapitals())
        );
    }
}
