package com.nestbridge.media;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class MediaContentTypeTest {

    @Test
    void acceptsJpegAndPng() {
        assertEquals("image/jpeg", MediaService.normalizeContentType("image/jpeg"));
        assertEquals("image/jpeg", MediaService.normalizeContentType("image/jpg"));
        assertEquals("image/png", MediaService.normalizeContentType("image/png; charset=utf-8"));
    }

    @Test
    void rejectsNonImages() {
        assertThrows(ResponseStatusException.class, () -> MediaService.normalizeContentType("application/pdf"));
        assertThrows(ResponseStatusException.class, () -> MediaService.normalizeContentType("image/gif"));
        assertThrows(ResponseStatusException.class, () -> MediaService.normalizeContentType(null));
    }
}
