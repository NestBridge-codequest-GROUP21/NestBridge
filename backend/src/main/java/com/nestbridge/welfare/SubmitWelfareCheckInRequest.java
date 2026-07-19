package com.nestbridge.welfare;

import lombok.Data;

import java.util.Map;

@Data
public class SubmitWelfareCheckInRequest {

    private Map<String, Boolean> responses;
}
