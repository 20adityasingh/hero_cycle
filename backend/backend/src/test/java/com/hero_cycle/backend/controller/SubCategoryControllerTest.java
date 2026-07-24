package com.hero_cycle.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hero_cycle.backend.dto.*;
import com.hero_cycle.backend.security.AdminSecurityConfig;
import com.hero_cycle.backend.service.SubCategoryService;
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
import static org.springframework.context.annotation.FilterType.ASSIGNABLE_TYPE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
    controllers = SubCategoryController.class,
    excludeAutoConfiguration = {
        SecurityAutoConfiguration.class,
        UserDetailsServiceAutoConfiguration.class
    },
    excludeFilters = @ComponentScan.Filter(
        type = ASSIGNABLE_TYPE,
        classes = {
            AdminSecurityConfig.class,
            JwtAuthFilter.class
        }
    )
)
public class SubCategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SubCategoryService subCategoryService;

    @Test
    void createSubCategory_Success() throws Exception {
        SubCategoryDTO request = new SubCategoryDTO("subCategoryName", 10.0f, "categoryName");
        when(subCategoryService.createSubCategory(any(SubCategoryDTO.class))).thenReturn("SubCategory Created Successfully");

        mockMvc.perform(post("/subcategory/createSubCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("SubCategory Created Successfully"));
    }

    @Test
    void updateAmount_Success() throws Exception {
        SubCategoryDTO request = new SubCategoryDTO("subCategoryName", 20.0f, "categoryName");
        when(subCategoryService.updateSubCategory(any(SubCategoryDTO.class))).thenReturn("Amount Updated Successfully");

        mockMvc.perform(put("/subcategory/updateAmount")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Amount Updated Successfully"));
    }

    @Test
    void getAllSubCategoryName_Success() throws Exception {
        SubCategoryName response = new SubCategoryName("subCategoryName", "categoryName");
        when(subCategoryService.getAllSubCategoryName()).thenReturn(Collections.singletonList(response));

        mockMvc.perform(get("/subcategory/getAllSubCategoryName"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].categoryName").value("categoryName"))
                .andExpect(jsonPath("$[0].name").value("subCategoryName"));
    }

    @Test
    void updateSubCategory_Success() throws Exception {
        UpdateSubCategoryDetails request = new UpdateSubCategoryDetails("categoryName", "oldSubName", "newSubName");
        when(subCategoryService.updateSubCategoryDetails(any(UpdateSubCategoryDetails.class))).thenReturn("SubCategory Updated Successfully");

        mockMvc.perform(post("/subcategory/updateSubCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("SubCategory Updated Successfully"));
    }

    @Test
    void deleteSubCategory_Success() throws Exception {
        DeleteDTO deleteDTO = new DeleteDTO("subCategoryName");
        when(subCategoryService.deletedSubCategory(any(DeleteDTO.class))).thenReturn("SubCategory Deleted Successfully");

        mockMvc.perform(delete("/subcategory/deleteSubCategory")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deleteDTO)))
                .andExpect(status().isOk())
                .andExpect(content().string("SubCategory Deleted Successfully"));
    }
}
