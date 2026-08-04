package com.nestbridge.community;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class NearbyCommunityDto {
    private String city;
    private List<CommunityMemberDto> students;
    private List<CommunityHostDto> hosts;
}
