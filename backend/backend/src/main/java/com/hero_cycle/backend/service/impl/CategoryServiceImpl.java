package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.entity.Assignment;
import com.hero_cycle.backend.entity.Category;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.mapper.CategoryMapper;
import com.hero_cycle.backend.mapper.SubCategoryMapper;
import com.hero_cycle.backend.repository.AssignmentRepository;
import com.hero_cycle.backend.repository.CategoryRepository;
import com.hero_cycle.backend.repository.SubCategoryRepository;
import com.hero_cycle.backend.service.CategoryService;
import com.hero_cycle.common_lib.security.security.AuthUtils;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    CategoryRepository categoryRepository;
    CategoryMapper categoryMapper;
    SubCategoryRepository subCategoryRepository;
    AuthUtils authUtils;
    AssignmentRepository assignmentRepository;
    SubCategoryMapper subCategoryMapper;

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SALESPERSON')")
    public List<CategoryResponse> getAllCategory() {
        log.info("Fetching Current User.");
        UUID adminId = authUtils.getCurrentUserId();
        log.info("User Fetched");
        log.info("Fetching all assignments with current admin id.");
        List<Assignment> assignments = assignmentRepository.findByAdminIdWithRelation(adminId);
        log.info("Found {} assignments.", assignments.size());

        Map<Category, List<SubCategoryDTO>> categoryMap = assignments.stream()
                .filter(a -> a.getCategoryId() != null && a.getSubCategoryId() != null && a.getCategoryId().getDeletedAt() == null && a.getSubCategoryId().getDeletedAt() == null)
                .collect(Collectors.groupingBy(
                        Assignment::getCategoryId,
                        Collectors.mapping(
                                a -> subCategoryMapper.toSubCategoryDTO(a.getSubCategoryId()),
                                Collectors.toList()
                        )
                ));

        return categoryMap.entrySet().stream()
                .map(entry -> CategoryResponse.builder()
                        .categoryDTO(categoryMapper.toCategoryDTO(entry.getKey()))
                        .subCategoryDTOS(entry.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryName> getAllNames() {
        log.info("Fetching all category names.");
        return categoryRepository.findAll().stream()
                .filter(category ->
                    category.getDeletedAt() == null
                )
                .map(category -> {
                    return CategoryName.builder()
                            .name(category.getName())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String createCategory(CategoryDTO categoryDTO) {
        log.info("Attempting to create category with name: {}", categoryDTO.name());
        
        if (categoryRepository.findByName(categoryDTO.name()) != null) {
            log.error("Category creation failed: Category '{}' already exists.", categoryDTO.name());
            throw new IllegalArgumentException("Category already exists with name: " + categoryDTO.name());
        }
        
        Category category = new Category();
        category.setName(categoryDTO.name());
        category.setTotalAmount(0.0F);
        categoryRepository.save(category);
        log.info("Category '{}' created successfully.", categoryDTO.name());
        return "Category Created Successfully";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String updateCategory(UpdateDTO updateDTO) {
        log.info("Fetching the category details to update it.");
        Category category = categoryRepository.findByName(updateDTO.oldName());

        category.setName(updateDTO.name());
        log.info("Updated the name.");
        categoryRepository.save(category);
        log.info("Saved the Category");
        return "Category has been updated.";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String deleteCategory(DeleteDTO deleteCategory) {
        Category category = categoryRepository.findByName(deleteCategory.name());
        if (category != null) {
            category.setDeletedAt(Instant.now());
            categoryRepository.save(category);
            
            List<SubCategory> subCategories = subCategoryRepository.findEntitiesByCategoryId(category.getId());
            for (SubCategory subCategory : subCategories) {
                subCategory.setDeletedAt(Instant.now());
            }
            subCategoryRepository.saveAll(subCategories);
        }
        return "Category deleted Successfully";
    }


}
