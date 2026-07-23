package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.*;
import jakarta.validation.Valid;

import java.util.List;

public interface SubCategoryService {

    String createSubCategory(SubCategoryDTO subCategoryDTO);

    String updateSubCategory(SubCategoryDTO subCategoryDTO);

    List<SubCategoryName> getAllSubCategoryName();

    String updateSubCategoryDetails(UpdateSubCategoryDetails subCategoryDetails);

    String deletedSubCategory(DeleteDTO deleteDTO);
}
