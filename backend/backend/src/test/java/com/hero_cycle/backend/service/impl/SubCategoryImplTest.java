package com.hero_cycle.backend.service.impl;

import com.hero_cycle.backend.dto.DeleteDTO;
import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryName;
import com.hero_cycle.backend.entity.Category;
import com.hero_cycle.backend.entity.PriceHistory;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.repository.AssignmentRepository;
import com.hero_cycle.backend.repository.CategoryRepository;
import com.hero_cycle.backend.repository.PriceHistoryRepository;
import com.hero_cycle.backend.repository.SubCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubCategoryImplTest {

    @Mock
    private SubCategoryRepository subCategoryRepository;

    @Mock
    private PriceHistoryRepository priceHistoryRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private AssignmentRepository assignmentRepository;

    @InjectMocks
    private SubCategoryImpl subCategoryService;

    private SubCategoryDTO subCategoryDTO;
    private Category category;
    private SubCategory subCategory;

    @BeforeEach
    void setUp() {
        subCategoryDTO = new SubCategoryDTO("SubCat1", 100.0f, "Cat1");
        
        category = new Category();
        category.setId(java.util.UUID.randomUUID());
        category.setName("Cat1");
        category.setTotalAmount(500.0f);

        subCategory = new SubCategory();
        subCategory.setId(java.util.UUID.randomUUID());
        subCategory.setName("SubCat1");
        subCategory.setAmount(100.0f);
        subCategory.setCategoryId(category);
    }

    @Test
    void testCreateSubCategory_Success() {
        when(subCategoryRepository.findByName(subCategoryDTO.name())).thenReturn(null);
        when(categoryRepository.findByName(subCategoryDTO.categoryName())).thenReturn(category);
        when(subCategoryRepository.save(any(SubCategory.class))).thenAnswer(invocation -> {
            SubCategory saved = invocation.getArgument(0);
            saved.setId(java.util.UUID.randomUUID());
            return saved;
        });

        String result = subCategoryService.createSubCategory(subCategoryDTO);

        assertEquals("SubCategory Created Successfully", result);
        verify(subCategoryRepository).save(any(SubCategory.class));
        verify(priceHistoryRepository).save(any(PriceHistory.class));
        verify(categoryRepository).save(category);
        
        // previous total was 500.0f, new amount is 100.0f, so new total should be 600.0f
        assertEquals(600.0f, category.getTotalAmount());
    }

    @Test
    void testCreateSubCategory_SubCategoryAlreadyExists() {
        when(subCategoryRepository.findByName(subCategoryDTO.name())).thenReturn(subCategory);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            subCategoryService.createSubCategory(subCategoryDTO);
        });

        assertEquals("SubCategory already exists with name: SubCat1", exception.getMessage());
        verify(categoryRepository, never()).findByName(anyString());
        verify(subCategoryRepository, never()).save(any(SubCategory.class));
    }

    @Test
    void testUpdateSubCategory_Success() {
        SubCategoryDTO updateDTO = new SubCategoryDTO("SubCat1", 150.0f, "Cat1");
        
        when(subCategoryRepository.findByName(updateDTO.name())).thenReturn(subCategory);
        when(categoryRepository.findByCategoryId(category.getId())).thenReturn(category);
        when(subCategoryRepository.save(any(SubCategory.class))).thenReturn(subCategory);

        String result = subCategoryService.updateSubCategory(updateDTO);

        assertEquals("SubCategory Updated", result);
        verify(subCategoryRepository).save(subCategory);
        verify(priceHistoryRepository).save(any(PriceHistory.class));
        verify(categoryRepository).save(category);
        
        // original total = 500
        // old subcat amount = 100
        // new subcat amount = 150
        // new total = 500 - 100 + 150 = 550
        assertEquals(550.0f, category.getTotalAmount());
    }

    @Test
    void testGetAllSubCategoryName_Success() {
        SubCategory subCat2 = new SubCategory();
        subCat2.setName("SubCat2");
        subCat2.setCategoryId(category);
        
        when(subCategoryRepository.findAll()).thenReturn(List.of(subCategory, subCat2));

        List<SubCategoryName> result = subCategoryService.getAllSubCategoryName();

        assertEquals(2, result.size());
        assertEquals("SubCat1", result.get(0).name());
        assertEquals("Cat1", result.get(0).categoryName());
        assertEquals("SubCat2", result.get(1).name());
        assertEquals("Cat1", result.get(1).categoryName());
    }

    @Test
    void testDeletedSubCategory_Success() {
        DeleteDTO deleteDTO = new DeleteDTO("SubCat1");
        when(subCategoryRepository.findByName(deleteDTO.name())).thenReturn(subCategory);

        String result = subCategoryService.deletedSubCategory(deleteDTO);

        assertEquals("SubCategory deleted successfully", result);
        assertNotNull(subCategory.getDeletedAt());
        verify(subCategoryRepository).save(subCategory);
        verify(categoryRepository).save(category);
        
        // previous total was 500.0f, subcat amount was 100.0f, new total should be 400.0f
        assertEquals(400.0f, category.getTotalAmount());
    }
}
