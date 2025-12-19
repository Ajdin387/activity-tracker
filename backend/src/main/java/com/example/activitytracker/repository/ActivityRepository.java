package com.example.activitytracker.repository;

import com.example.activitytracker.model.Activity;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    @Query("""
        select a from Activity a
        where (:category is null or lower(a.category) = lower(:category))
          and (:from is null or a.date >= :from)
          and (:to is null or a.date <= :to)
          and (
            :q is null or
            lower(a.name) like lower(concat('%', :q, '%')) or
            lower(coalesce(a.description, '')) like lower(concat('%', :q, '%'))
          )
    """)
    List<Activity> search(
            @Param("category") String category,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("q") String q,
            Sort sort);
}
