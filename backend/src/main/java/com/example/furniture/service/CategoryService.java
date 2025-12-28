package com.example.furniture.service;

import com.example.furniture.model.Category;
import com.example.furniture.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    CategoryRepository categoryRepository;
    public ResponseEntity<Category> addCategory(Category category){
        categoryRepository.save(category);
        String name = category.getName();
        return  ResponseEntity.ok().body(category);
    }
    public Category getCategoryById(Long id){
        return categoryRepository.findById(id).orElse(null);
    }
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    public ResponseEntity<?> updateCategory(Long id, Category updatedCategory) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            category.setName(updatedCategory.getName());
            categoryRepository.save(category);
            return ResponseEntity.ok(updatedCategory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
