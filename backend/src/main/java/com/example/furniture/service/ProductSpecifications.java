package com.example.furniture.service;

import com.example.furniture.model.Product;
import com.example.furniture.model.Rating;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.*;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> hasSearch(String search) {
        return (root, query, cb) -> search == null ? null :
                cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    // Fix: join category to access its id
    public static Specification<Product> inCategories(List<Long> categoryIds) {
        return (root, query, cb) -> {
            if (categoryIds == null || categoryIds.isEmpty()) return null;
            Join<Object, Object> categoryJoin = root.join("category");
            return categoryJoin.get("id").in(categoryIds);
        };
    }

    public static Specification<Product> priceBetween(Double min, Double max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return null;
            if (min != null && max != null) return cb.between(root.get("price"), min, max);
            if (min != null) return cb.greaterThanOrEqualTo(root.get("price"), min);
            return cb.lessThanOrEqualTo(root.get("price"), max);
        };
    }

    // Fix: use a subquery to compute average rating
    public static Specification<Product> minRating(Double min) {
        return (root, query, cb) -> {
            if (min == null) return null;

            // Subquery to compute average rating for each product
            Subquery<Double> subquery = query.subquery(Double.class);
            Root<Rating> ratingRoot = subquery.from(Rating.class);
            subquery.select(cb.avg(ratingRoot.get("stars")))
                    .where(cb.equal(ratingRoot.get("product"), root));

            // Compare the subquery result with the threshold
            return cb.greaterThanOrEqualTo(subquery, min);
        };
    }
}