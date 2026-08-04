package com.nestbridge.media;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PhotoUploadUrlResponse {

    private boolean enabled;
    private String uploadUrl;
    private String publicUrl;
    private String contentType;
    private Long maxBytes;
}
