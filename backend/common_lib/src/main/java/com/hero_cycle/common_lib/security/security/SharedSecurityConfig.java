package com.hero_cycle.common_lib.security.security;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.context.annotation.Bean;

@AutoConfiguration
public class SharedSecurityConfig {

    @Bean
    public AuthUtils authUtils(){return new AuthUtils();}

    @Bean
    public JwtAuthFilter jwtAuthFilter(AuthUtils authUtils){return new JwtAuthFilter(authUtils);}
}
