package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.dto.DeleteDTO;
import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryName;
import com.hero_cycle.backend.dto.UpdateSubCategoryDetails;
import com.hero_cycle.backend.entity.Category;
import com.hero_cycle.backend.entity.PriceHistory;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.repository.CategoryRepository;
import com.hero_cycle.backend.repository.PriceHistoryRepository;
import com.hero_cycle.backend.repository.SubCategoryRepository;
import com.hero_cycle.backend.service.SubCategoryService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
public class SubCategoryImpl implements SubCategoryService {

    SubCategoryRepository subCategoryRepository;
    PriceHistoryRepository priceHistoryRepository;
    CategoryRepository categoryRepository;
    com.hero_cycle.backend.repository.AssignmentRepository assignmentRepository;

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String createSubCategory(SubCategoryDTO subCategoryDTO) {
        log.info("Attempting to create subcategory '{}' under category '{}'.", subCategoryDTO.name(), subCategoryDTO.categoryName());

        Category category = categoryRepository.findByName(subCategoryDTO.categoryName());
        if (category == null) {
            log.error("SubCategory creation failed: Category '{}' not found.", subCategoryDTO.categoryName());
            throw new IllegalArgumentException("Category not found: " + subCategoryDTO.categoryName());
        }

        SubCategory subCategory = new SubCategory();
        subCategory.setName(subCategoryDTO.name());
        subCategory.setAmount(subCategoryDTO.amount());
        subCategory.setCategoryId(category);

        subCategory = subCategoryRepository.save(subCategory);
        log.info("SubCategory '{}' saved with id: {}.", subCategory.getName(), subCategory.getId());

        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAmount(subCategory.getAmount());
        priceHistory.setSubCategoryId(subCategory);
        priceHistoryRepository.save(priceHistory);
        log.info("Price history recorded for subcategory '{}' with amount: {}.", subCategory.getName(), subCategory.getAmount());

        // Update Category Total Amount
        float newTotal = (category.getTotalAmount() != null ? category.getTotalAmount() : 0.0f) + subCategoryDTO.amount();
        category.setTotalAmount(newTotal);
        categoryRepository.save(category);
        log.info("Category '{}' total amount updated to: {}.", category.getName(), newTotal);

        return "SubCategory Created Successfully";
    }

    @Override
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public String updateSubCategory(SubCategoryDTO subCategoryDTO) {
        log.info("Attempting to update subcategory with name: '{}'.", subCategoryDTO.name());

        SubCategory subCategory = subCategoryRepository.findByName(subCategoryDTO.name());
        if (subCategory == null) {
            log.error("SubCategory update failed: SubCategory '{}' not found.", subCategoryDTO.name());
            throw new IllegalArgumentException("SubCategory not found: " + subCategoryDTO.name());
        }

        Category category = categoryRepository.findByCategoryId(subCategory.getCategoryId().getId());
        if (category == null) {
            log.error("SubCategory update failed: Parent category not found for subcategory '{}'.", subCategoryDTO.name());
            throw new IllegalArgumentException("Category linked to this SubCategory not found.");
        }

        PriceHistory priceHistory = new PriceHistory();

        float oldAmount = subCategory.getAmount() != null ? subCategory.getAmount() : 0.0f;
        log.info("Updating subcategory '{}' amount from {} to {}.", subCategoryDTO.name(), oldAmount, subCategoryDTO.amount());

        subCategory.setAmount(subCategoryDTO.amount());

        subCategory = subCategoryRepository.save(subCategory);

        priceHistory.setAmount(subCategoryDTO.amount());
        priceHistory.setSubCategoryId(subCategory);
        priceHistoryRepository.save(priceHistory);
        log.info("Price history recorded for subcategory '{}' with new amount: {}.", subCategory.getName(), subCategoryDTO.amount());

        float totalAmount = category.getTotalAmount() != null ? category.getTotalAmount() : 0.0f;

        float newAmount = (totalAmount - oldAmount) + subCategoryDTO.amount();

        category.setTotalAmount(newAmount);
        categoryRepository.save(category);
        log.info("Category '{}' total amount updated to: {}.", category.getName(), newAmount);

        return "SubCategory Updated";
    }

    @Override
    public List<SubCategoryName> getAllSubCategoryName() {
        log.info("Fetching all sub category names.");
        List<SubCategory> subCategories = subCategoryRepository.findAll();
        return subCategories.stream()
                .filter(sb -> sb.getDeletedAt() == null)
                .map( subCategory -> {
                    return SubCategoryName.builder()
                            .name(subCategory.getName())
                            .categoryName(subCategory.getCategoryId() != null ? subCategory.getCategoryId().getName() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String updateSubCategoryDetails(UpdateSubCategoryDetails subCategoryDetails) {
        SubCategory subCategory = subCategoryRepository.findByName(subCategoryDetails.oldName());
        if(subCategoryDetails.categoryName() == null){
            log.warn("Category is still the same");
        }
        Category category = categoryRepository.findByName(subCategoryDetails.categoryName());
        subCategory.setName(subCategoryDetails.name());
        subCategory.setCategoryId(category);
        subCategory = subCategoryRepository.save(subCategory);

        // Fetch assignments for this subCategory and update their category
        List<com.hero_cycle.backend.entity.Assignment> assignments = assignmentRepository.findBySubCategoryId(subCategory);
        for (com.hero_cycle.backend.entity.Assignment assignment : assignments) {
            assignment.setCategoryId(category);
        }
        assignmentRepository.saveAll(assignments);

        return "SubCategory Updated";
    }

    @Override
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Transactional
    public String deletedSubCategory(DeleteDTO deleteDTO) {
        SubCategory subCategory = subCategoryRepository.findByName(deleteDTO.name());
        subCategory.setDeletedAt(Instant.now());
        subCategoryRepository.save(subCategory);
        return "SubCategory deleted successfully";
    }


}
