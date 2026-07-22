package com.nestbridge.content;

import com.nestbridge.recommendation.RecommendationItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Bridges package-private content DTOs into recommendation items
 * without exposing content records outside this package.
 */
@Component
@RequiredArgsConstructor
public class ContentRecommendationBridge {

    private final ContentService contentService;

    public List<RecommendationItemDto> sitesNear(String city, int limit) {
        List<RecommendationItemDto> items = new ArrayList<>();
        for (TouristSiteDto site : contentService.getSites(city)) {
            items.add(RecommendationItemDto.builder()
                    .id(site.id())
                    .type("SITE")
                    .title(site.name())
                    .subtitle(site.city() + (site.admission() != null ? " · " + site.admission() : ""))
                    .icon("🏛️")
                    .targetId(site.siteKey())
                    .routeHint("TouristSiteDetail")
                    .build());
            if (items.size() >= limit) {
                break;
            }
        }
        return items;
    }

    public List<RecommendationItemDto> topicsNear(String city, int limit) {
        List<RecommendationItemDto> items = new ArrayList<>();
        for (TopicDto topic : contentService.getTopics(city)) {
            items.add(RecommendationItemDto.builder()
                    .id(topic.id())
                    .type("CULTURE")
                    .title(topic.title())
                    .subtitle(topic.description())
                    .icon(topic.emoji() != null ? topic.emoji() : "👋")
                    .routeHint("LocalTips")
                    .build());
            if (items.size() >= limit) {
                break;
            }
        }
        return items;
    }

    public List<RecommendationItemDto> transportNear(String city, int limit) {
        List<RecommendationItemDto> items = new ArrayList<>();
        for (TransportTabDto tab : contentService.getTransport(city)) {
            String firstRoute = tab.routes() != null && !tab.routes().isEmpty()
                    ? tab.routes().get(0).name()
                    : "Local options";
            items.add(RecommendationItemDto.builder()
                    .id("transport-" + tab.id())
                    .type("TRANSPORT")
                    .title(tab.label())
                    .subtitle(firstRoute)
                    .icon("🚌")
                    .routeHint("TransportGuide")
                    .build());
            if (items.size() >= limit) {
                break;
            }
        }
        return items;
    }
}
