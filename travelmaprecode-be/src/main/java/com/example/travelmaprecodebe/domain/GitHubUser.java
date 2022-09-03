package com.example.travelmaprecodebe.domain;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class GitHubUser implements OAuth2User {
    private List<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList("ROLE_USER");
    private Map<String, Object> attributes;
    private Long id;
    private String name;
    private String login;
    private String email;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public Map<String, Object> getAttributes() {
        if (this.attributes == null) {
            this.attributes = new HashMap<>();
            this.attributes.put("id", this.getId());
            this.attributes.put("name", this.getName());
            this.attributes.put("login", this.getLogin());
            this.attributes.put("email", this.getEmail());
        }
        return attributes;
    }

    public static GitHubUser fromTraveler(Traveler traveler) {
        GitHubUser gitHubUser = new GitHubUser();
        gitHubUser.setId(traveler.getId());
        gitHubUser.setName(traveler.getName());
        gitHubUser.setEmail(traveler.getEmail());
        return gitHubUser;
    }
}
