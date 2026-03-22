package com.example.activitytracker.repository;

import com.example.activitytracker.model.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("""
            select a from Activity a
            where (lower(a.category) = lower(:category) or :category is null)
              and (a.date >= coalesce(:from, a.date))
              and (a.date <= coalesce(:to, a.date))
              and (
                    lower(a.name) like lower(concat('%', :q, '%'))
                    or lower(coalesce(a.description, '')) like lower(concat('%', :q, '%'))
                    or :q is null
                  )
              and (a.durationMinutes >= :minDuration or :minDuration is null)
              and (a.durationMinutes <= :maxDuration or :maxDuration is null)
            """)
    Page<Activity> search(
            @Param("category") String category,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("q") String q,
            @Param("minDuration") Integer minDuration,
            @Param("maxDuration") Integer maxDuration,
            Pageable pageable
    );
}