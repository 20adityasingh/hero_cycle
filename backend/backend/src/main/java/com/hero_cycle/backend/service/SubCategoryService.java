package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryName;

import java.util.List;

public interface SubCategoryService {

    String createSubCategory(SubCategoryDTO subCategoryDTO);

    String updateSubCategory(SubCategoryDTO subCategoryDTO);

    List<SubCategoryName> getAllSubCategoryName();
}
