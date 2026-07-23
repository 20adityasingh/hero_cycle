package com.hero_cycle.backend.mapper;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryDTO toCategoryDTO(Category category);
}
