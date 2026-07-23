package com.hero_cycle.common_lib.security.security;

import com.hero_cycle.common_lib.security.dto.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Component
public class AuthUtils {

    @Value("${jwt.secret-key}")
    private String secret_key;

    public SecretKey getSecretKey(){
        return Keys.hmacShaKeyFor(secret_key.getBytes(StandardCharsets.UTF_8));
    }

    public String getAccessToken(UserDTO user){
        return Jwts.builder()
                .subject(user.username())
                .claim("adminId", user.adminId().toString())
                .claim("name", user.name())
                .claim("role", user.role())
                .signWith(getSecretKey())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000*60*60))
                .compact();
    }

    public JwtUserPrincipal verifyAccessToken (String token){
        Claims claims =  Jwts.parser()
                .verifyWith(getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        UUID adminId = UUID.fromString(claims.get("adminId", String.class));
        String username = claims.getSubject();
        String name = claims.get("name", String.class);
        String role = claims.get("role", String.class);

        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role)
        );

        return new JwtUserPrincipal(adminId, name , username, null, role, authorities);
    }

    public UUID getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal admin)){
            throw new AuthenticationCredentialsNotFoundException("You are not Authenticated");
        }

        return admin.adminId();

    }
}
