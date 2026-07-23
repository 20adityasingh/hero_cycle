package com.hero_cycle.backend.service;

import com.hero_cycle.backend.dto.*;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategory();

    List<CategoryName> getAllNames();

    String createCategory(CategoryDTO categoryDTO);

    String updateCategory(UpdateDTO updateDTO);

    String deleteCategory(DeleteDTO deleteCategory);
}
