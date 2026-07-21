package com.hero_cycle.common_lib.security.security;

import com.hero_cycle.common_lib.security.dto.UserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

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
                .claim("userId", user.adminId().toString())
                .claim("name", user.name())
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

        UUID adminId = UUID.fromString(claims.get("userId", String.class));
        String username = claims.getSubject();
        String name = claims.get("name", String.class);

        return new JwtUserPrincipal(adminId, name , username, null,new ArrayList<>());
    }

    public UUID getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !(authentication.getPrincipal() instanceof JwtUserPrincipal user)){
            throw new AuthenticationCredentialsNotFoundException("You are not Authenticated");
        }

        return user.adminId();

    }
}
