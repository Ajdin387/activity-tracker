package com.example.activitytracker.repository;

import com.example.activitytracker.dto.StatsByCategoryResponse;
import com.example.activitytracker.dto.StatsByDayCategoryResponse;
import com.example.activitytracker.dto.StatsByDayResponse;
import com.example.activitytracker.model.Activity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityStatsRepository
        extends org.springframework.data.repository.Repository<Activity, Long> {

    @Query("""
            select coalesce(sum(a.durationMinutes), 0L)
                from Activity a
            where (lower(a.category) in (:categories) or :categories is null)
              and (a.date >= coalesce(:from, a.date))
              and (a.date <= coalesce(:to, a.date))
            """)
    long statsTotal(
            @Param("categories") List<String> categories,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
            );

    @Query("""
            select new com.example.activitytracker.dto.StatsByDayResponse(a.date, coalesce(sum(a.durationMinutes), 0L))
                from Activity a
            where (lower(a.category) in (:categories) or :categories is null)
              and (a.date >= coalesce(:from, a.date))
              and (a.date <= coalesce(:to, a.date))
            group by a.date
            order by a.date asc
            """)
    List<StatsByDayResponse> statsByDay(
            @Param("categories") List<String> categories,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    @Query("""
            select new com.example.activitytracker.dto.StatsByCategoryResponse(lower(a.category), coalesce(sum(a.durationMinutes), 0L))
                from Activity a
            where (lower(a.category) in (:categories) or :categories is null)
              and (a.date >= coalesce(:from, a.date))
              and (a.date <= coalesce(:to, a.date))
            group by lower(a.category)
            order by sum(a.durationMinutes) desc, lower(a.category) asc
            """)
    List<StatsByCategoryResponse> statsByCategory(
            @Param("categories") List<String> categories,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    @Query("""
            select new com.example.activitytracker.dto.StatsByDayCategoryResponse(a.date, lower(a.category), coalesce(sum(a.durationMinutes), 0L))
                from Activity a
            where (lower(a.category) in (:categories) or :categories is null)
              and (a.date >= coalesce(:from, a.date))
              and (a.date <= coalesce(:to, a.date))
            group by a.date, lower(a.category)
            order by a.date asc, sum(a.durationMinutes) desc, lower(a.category) asc
            """)
    List<StatsByDayCategoryResponse> statsByDayCategory(
            @Param("categories") List<String> categories,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
