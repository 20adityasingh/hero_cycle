package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.dto.CategoryName;
import com.hero_cycle.backend.dto.CategoryResponse;
import com.hero_cycle.backend.dto.UpdateCategory;
import jakarta.validation.Valid;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategory();

    List<CategoryName> getAllNames();

    String createCategory(CategoryDTO categoryDTO);

    String updateCategory(UpdateCategory updateCategory);
}
