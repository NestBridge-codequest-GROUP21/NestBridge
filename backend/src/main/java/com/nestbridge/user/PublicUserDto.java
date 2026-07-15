package com.nestbridge.user;

import com.nestbridge.common.PrimaryIntent;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PublicUserDto {
    private String userId;
    private String fullName;
    private String bio;
    private String profilePhotoUrl;
    private PrimaryIntent primaryIntent;
}
