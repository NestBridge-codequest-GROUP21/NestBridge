package com.nestbridge.notification;

import lombok.Data;

@Data
public class RegisterDeviceTokenRequest {

    private String expoPushToken;
    private String platform;
}
