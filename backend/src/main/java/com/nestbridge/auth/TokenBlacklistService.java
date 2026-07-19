package com.nestbridge.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final StringRedisTemplate redisTemplate;

    public void blacklistRefreshToken(String token, long ttlMs) {
        redisTemplate.opsForValue().set(blacklistKey(token), "1", ttlMs, TimeUnit.MILLISECONDS);
    }

    public boolean isBlacklisted(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(blacklistKey(token)));
    }

    public void storeRefreshToken(String userId, String token, long ttlMs) {
        redisTemplate.opsForValue().set(refreshKey(userId), token, ttlMs, TimeUnit.MILLISECONDS);
    }

    public String getStoredRefreshToken(String userId) {
        return redisTemplate.opsForValue().get(refreshKey(userId));
    }

    public void removeRefreshToken(String userId) {
        redisTemplate.delete(refreshKey(userId));
    }

    public void cacheMatchResults(String cacheKey, String json, Duration ttl) {
        redisTemplate.opsForValue().set("match:" + cacheKey, json, ttl);
    }

    public String getCachedMatchResults(String cacheKey) {
        return redisTemplate.opsForValue().get("match:" + cacheKey);
    }

    private String blacklistKey(String token) {
        return "blacklist:" + token.hashCode();
    }

    private String refreshKey(String userId) {
        return "refresh:" + userId;
    }
}
