package com.example.furniture.repository;

import com.example.furniture.model.Product;
import com.example.furniture.model.Rating;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CustomProductRepositoryImpl implements CustomProductRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<Product> findAllOrderByAverageRating(Specification<Product> spec, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        // --- 1. Main query: get Product entities sorted by AVG(rating.stars) ---
        CriteriaQuery<Product> query = cb.createQuery(Product.class);
        Root<Product> root = query.from(Product.class);

        // Apply the dynamic specification (search, category, price, minRating, etc.)
        if (spec != null) {
            Predicate predicate = spec.toPredicate(root, query, cb);
            if (predicate != null) {
                query.where(predicate);
            }
        }

        // Subquery: AVG(r.stars) for each product. COALESCE treats "no ratings" as 0.0
        Subquery<Double> avgSub = query.subquery(Double.class);
        Root<Rating> ratingRoot = avgSub.from(Rating.class);
        avgSub.select(cb.coalesce(cb.avg(ratingRoot.get("stars")), 0.0))
                .where(cb.equal(ratingRoot.get("product"), root));

        query.orderBy(cb.desc(avgSub));
        query.distinct(true);

        TypedQuery<Product> typedQuery = entityManager.createQuery(query);
        typedQuery.setFirstResult((int) pageable.getOffset());
        typedQuery.setMaxResults(pageable.getPageSize());

        List<Product> content = typedQuery.getResultList();

        // --- 2. Count query for pagination metadata ---
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Product> countRoot = countQuery.from(Product.class);

        if (spec != null) {
            Predicate countPredicate = spec.toPredicate(countRoot, countQuery, cb);
            if (countPredicate != null) {
                countQuery.where(countPredicate);
            }
        }

        countQuery.select(cb.countDistinct(countRoot));
        long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(content, pageable, total);
    }
}