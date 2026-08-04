package com.nestbridge.community;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommunityMemberDto {
    private String userId;
    private String fullName;
    private String initials;
    private String bio;
    private String about;
    private String profilePhotoUrl;
    private String city;
    private String university;
    private String nationality;
    private boolean identityVerified;
}
