package com.hero_cycle.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.security.AdminSecurityConfig;
import com.hero_cycle.backend.service.CategoryService;
import com.hero_cycle.common_lib.security.security.JwtAuthFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.security.autoconfigure.SecurityAutoConfiguration;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = CategoryController.class,
    excludeAutoConfiguration = {
        SecurityAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class
    },
    excludeFilters = @ComponentScan.Filter(
        type = org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE,
        classes = {
            AdminSecurityConfig.class,
            JwtAuthFilter.class
        }
    )
)
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CategoryService categoryService;

    @Test
    void getAllCategory_Success() throws Exception {
        CategoryResponse response = new CategoryResponse(new CategoryDTO("categoryName", 0.0f), Collections.emptyList());
        when(categoryService.getAllCategory()).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/category/allCategory"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryDTO.name").value("categoryName"))
                .andExpect(jsonPath("$[0].categoryDTO.totalAmount").value(0.0));
    }

    @Test
    void getAllNames_Success() throws Exception {
        CategoryName response = new CategoryName("categoryName");
        when(categoryService.getAllNames()).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/category/getAllCategoryName"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("categoryName"));
    }

    @Test
    void createCategory_Success() throws Exception {
        CategoryDTO request = new CategoryDTO("categoryName", 0.0f);
        when(categoryService.createCategory(any(CategoryDTO.class))).thenReturn("Category Created Successfully");

        mockMvc.perform(post("/category/createCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Category Created Successfully"));
    }

    @Test
    void updateCategory_Success() throws Exception {
        UpdateDTO request = new UpdateDTO("oldCategoryName", "newCategoryName");
        when(categoryService.updateCategory(any(UpdateDTO.class))).thenReturn("Category Updated Successfully");

        mockMvc.perform(put("/category/updateCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Category Updated Successfully"));
    }

    @Test
    void deleteCategory_Success() throws Exception {
        DeleteDTO deleteDTO = new DeleteDTO("categoryName");
        when(categoryService.deleteCategory(any(DeleteDTO.class))).thenReturn("Category Deleted Successfully");

        mockMvc.perform(delete("/category/deleteCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deleteDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("Category Deleted Successfully"));
    }
}
