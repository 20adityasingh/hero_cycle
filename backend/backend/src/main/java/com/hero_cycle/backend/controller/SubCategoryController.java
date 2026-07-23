package com.hero_cycle.backend.controller;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryDTO;
import com.hero_cycle.backend.dto.SubCategoryName;
import com.hero_cycle.backend.service.SubCategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subcategory")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class SubCategoryController {

    SubCategoryService subCategoryService;

    @PostMapping("/createSubCategory")
    public ResponseEntity<String> createCategory(@RequestBody @Valid SubCategoryDTO subCategoryDTO){
        return ResponseEntity.ok(subCategoryService.createSubCategory(subCategoryDTO));
    }

    @PutMapping("/updateAmount")
    public ResponseEntity<String> updateAmount(@RequestBody @Valid SubCategoryDTO subCategoryDTO){
        return ResponseEntity.ok(subCategoryService.updateSubCategory(subCategoryDTO));
    }

    @GetMapping("/getAllSubCategoryName")
    public ResponseEntity<List<SubCategoryName>> getAllSubcategoryName(){
        return ResponseEntity.ok(subCategoryService.getAllSubCategoryName());
    }
}
