package com.hero_cycle.backend.controller;

import com.hero_cycle.backend.dto.CategoryDTO;
import com.hero_cycle.backend.dto.CategoryName;
import com.hero_cycle.backend.dto.CategoryResponse;
import com.hero_cycle.backend.dto.UpdateCategory;
import com.hero_cycle.backend.entity.SubCategory;
import com.hero_cycle.backend.service.CategoryService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class CategoryController {

    CategoryService categoryService;

    @GetMapping("/allCategory")
    public ResponseEntity<List<CategoryResponse>> getAllCategory (){

        return ResponseEntity.ok(categoryService.getAllCategory());

    }

    @GetMapping("/getAllCategoryName")
    public ResponseEntity<List<CategoryName>> getAllNames(){
        return ResponseEntity.ok(categoryService.getAllNames());
    }

    @PostMapping("/createCategory")
    public ResponseEntity<String> createCategory(@RequestBody @Valid CategoryDTO categoryDTO){
        return ResponseEntity.ok(categoryService.createCategory(categoryDTO));
    }

    @PutMapping("/updateCategory")
    public ResponseEntity<String> updateCategory(@RequestBody @Valid UpdateCategory updateCategory){
        return ResponseEntity.ok(categoryService.updateCategory(updateCategory));
    }
}
