package com.hero_cycle.backend.mapper;


import com.hero_cycle.backend.dto.AdminProfileResponse;
import com.hero_cycle.common_lib.security.dto.UserDTO;
import com.hero_cycle.common_lib.security.security.JwtUserPrincipal;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AdminMapper {

    UserDTO toUserDTO(JwtUserPrincipal admin);

    @Mapping(target = "id", source = "adminId")
    AdminProfileResponse toAdminProfileResponse(JwtUserPrincipal admin);
}
