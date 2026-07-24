package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.dto.CategoryResponse;
import com.hero_cycle.backend.dto.DeleteDTO;
import com.hero_cycle.backend.dto.UpdateDTO;
import com.hero_cycle.backend.entity.Assignment;
import com.hero_cycle.backend.entity.Category;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.mapper.CategoryMapper;
import com.hero_cycle.backend.mapper.SubCategoryMapper;
import com.hero_cycle.backend.repository.AssignmentRepository;
import com.hero_cycle.backend.repository.CategoryRepository;
import com.hero_cycle.backend.repository.SubCategoryRepository;
import com.hero_cycle.common_lib.security.security.AuthUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @Mock
    private SubCategoryRepository subCategoryRepository;

    @Mock
    private AuthUtils authUtils;

    @Mock
    private AssignmentRepository assignmentRepository;

    @Mock
    private SubCategoryMapper subCategoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category category;
    private SubCategory subCategory;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(UUID.randomUUID());
        category.setName("TestCategory");
        category.setTotalAmount(0.0f);

        subCategory = new SubCategory();
        subCategory.setId(UUID.randomUUID());
    }

    @Test
    void testGetAllCategory_Success() {
        // Arrange
        UUID adminId = UUID.randomUUID();
        when(authUtils.getCurrentUserId()).thenReturn(adminId);

        Assignment assignment = new Assignment();
        assignment.setCategoryId(category);
        assignment.setSubCategoryId(subCategory);

        when(assignmentRepository.findByAdminIdWithRelation(adminId)).thenReturn(Collections.singletonList(assignment));
        when(categoryMapper.toCategoryDTO(category)).thenReturn(new CategoryDTO("TestCategory", 0.0f));

        // Act
        List<CategoryResponse> responses = categoryService.getAllCategory();

        // Assert
        assertNotNull(responses);
        assertEquals(1, responses.size());
        verify(authUtils, times(1)).getCurrentUserId();
        verify(assignmentRepository, times(1)).findByAdminIdWithRelation(adminId);
    }

    @Test
    void testCreateCategory_Success() {
        // Arrange
        CategoryDTO categoryDTO = new CategoryDTO("NewCategory", 0.0f);
        when(categoryRepository.findByName("NewCategory")).thenReturn(null);

        // Act
        String result = categoryService.createCategory(categoryDTO);

        // Assert
        assertEquals("Category Created Successfully", result);
        verify(categoryRepository, times(1)).findByName("NewCategory");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void testCreateCategory_ThrowsExceptionWhenAlreadyExists() {
        // Arrange
        CategoryDTO categoryDTO = new CategoryDTO("ExistingCategory", 0.0f);
        when(categoryRepository.findByName("ExistingCategory")).thenReturn(category);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            categoryService.createCategory(categoryDTO);
        });

        assertEquals("Category already exists with name: ExistingCategory", exception.getMessage());
        verify(categoryRepository, times(1)).findByName("ExistingCategory");
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void testUpdateCategory_Success() {
        // Arrange
        UpdateDTO updateDTO = new UpdateDTO("OldCategory", "NewCategoryName");
        when(categoryRepository.findByName("OldCategory")).thenReturn(category);

        // Act
        String result = categoryService.updateCategory(updateDTO);

        // Assert
        assertEquals("Category has been updated.", result);
        assertEquals("NewCategoryName", category.getName());
        verify(categoryRepository, times(1)).findByName("OldCategory");
        verify(categoryRepository, times(1)).save(category);
    }

    @Test
    void testDeleteCategory_Success() {
        // Arrange
        DeleteDTO deleteDTO = new DeleteDTO("TestCategory");
        when(categoryRepository.findByName("TestCategory")).thenReturn(category);
        when(subCategoryRepository.findEntitiesByCategoryId(category.getId())).thenReturn(Collections.singletonList(subCategory));

        // Act
        String result = categoryService.deleteCategory(deleteDTO);

        // Assert
        assertEquals("Category deleted Successfully", result);
        assertNotNull(category.getDeletedAt());
        assertNotNull(subCategory.getDeletedAt());
        verify(categoryRepository, times(1)).findByName("TestCategory");
        verify(categoryRepository, times(1)).save(category);
        verify(subCategoryRepository, times(1)).findEntitiesByCategoryId(category.getId());
        verify(subCategoryRepository, times(1)).saveAll(anyList());
    }
}
