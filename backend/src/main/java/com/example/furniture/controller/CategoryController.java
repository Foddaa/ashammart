package com.example.furniture.controller;

import com.example.furniture.model.Category;
import com.example.furniture.model.Product;
import com.example.furniture.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
public class CategoryController {
    @Autowired
    CategoryService categoryService;
    @GetMapping("/all")
    public List<Category> getAllCategory(){
        return categoryService.getAllCategories();
    }

}
