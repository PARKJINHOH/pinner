package dev.pinner.domain.record;

public record OAuthLoginUserRecord(String serviceName, String email, String nickname, String accessToken) {

}
