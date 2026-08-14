package com.example.furniture.repository;

import com.example.furniture.model.SearchLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLog, Long> {

    @Query(value = """
        SELECT term_normalized AS term, COUNT(*) AS cnt
        FROM search_log
        WHERE created_at >= :since
        GROUP BY term_normalized
        ORDER BY cnt DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<TrendingTermProjection> findTrendingTerms(
            @Param("since") LocalDateTime since,
            @Param("limit") int limit
    );

    interface TrendingTermProjection {
        String getTerm();
        Long getCnt();
    }
}
