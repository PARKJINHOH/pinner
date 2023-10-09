package dev.pinner.security.oauth;

public record OAuthLoginAttributes(String serviceName, String email, String nickname, String accessToken) {

}
