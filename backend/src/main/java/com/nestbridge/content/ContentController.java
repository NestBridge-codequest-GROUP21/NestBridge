package com.nestbridge.content;

import com.nestbridge.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;

    @GetMapping("/phrases")
    public ResponseEntity<ApiResponse<List<PhraseDto>>> phrases(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Phrases loaded", contentService.getPhrases(city)));
    }

    @GetMapping("/topics")
    public ResponseEntity<ApiResponse<List<TopicDto>>> topics(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Topics loaded", contentService.getTopics(city)));
    }

    @GetMapping("/transport")
    public ResponseEntity<ApiResponse<List<TransportTabDto>>> transport(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Transport loaded", contentService.getTransport(city)));
    }

    @GetMapping("/sites")
    public ResponseEntity<ApiResponse<List<TouristSiteDto>>> sites(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Sites loaded", contentService.getSites(city)));
    }

    @GetMapping("/sites/{siteKey}")
    public ResponseEntity<ApiResponse<TouristSiteDto>> site(@PathVariable String siteKey) {
        return ResponseEntity.ok(ApiResponse.success("Site loaded", contentService.getSite(siteKey)));
    }

    @GetMapping("/checklist")
    public ResponseEntity<ApiResponse<List<ChecklistItemDto>>> checklist(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Checklist loaded", contentService.getChecklist(city)));
    }

    @GetMapping("/emergency-contacts")
    public ResponseEntity<ApiResponse<List<EmergencyContactDto>>> emergencyContacts() {
        return ResponseEntity.ok(ApiResponse.success("Emergency contacts loaded",
                contentService.getEmergencyContacts()));
    }

    @GetMapping("/map-landmarks")
    public ResponseEntity<ApiResponse<List<MapLandmarkDto>>> mapLandmarks(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(ApiResponse.success("Landmarks loaded", contentService.getMapLandmarks(city)));
    }

    @GetMapping("/videos")
    public ResponseEntity<ApiResponse<List<VideoResourceDto>>> videos(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success("Videos loaded", contentService.getVideos(city, category)));
    }

    @GetMapping("/videos/{videoKey}")
    public ResponseEntity<ApiResponse<VideoResourceDto>> video(@PathVariable String videoKey) {
        return ResponseEntity.ok(ApiResponse.success("Video loaded", contentService.getVideo(videoKey)));
    }
}
