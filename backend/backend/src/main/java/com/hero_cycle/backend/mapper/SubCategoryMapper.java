package com.hero_cycle.backend.mapper;

import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.entity.SubCategory;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SubCategoryMapper {
    SubCategoryDTO toSubCategoryDTO(SubCategory subCategory);
    List<SubCategoryDTO> toSubCategoryDTOList(List<SubCategory> subCategories);
}
