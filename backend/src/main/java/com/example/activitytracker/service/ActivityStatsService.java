package com.example.activitytracker.service;

import com.example.activitytracker.dto.StatsByCategoryResponse;
import com.example.activitytracker.dto.StatsByDayCategoryResponse;
import com.example.activitytracker.dto.StatsByDayResponse;
import com.example.activitytracker.dto.StatsSummaryResponse;
import com.example.activitytracker.dto.StatsTotalResponse;
import com.example.activitytracker.repository.ActivityStatsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ActivityStatsService {

    private final ActivityStatsRepository repo;

    public ActivityStatsService(ActivityStatsRepository repo) {
        this.repo = repo;
    }

    public StatsTotalResponse total(List<String> categories, LocalDate from, LocalDate to) {
        long totalMinutes = repo.statsTotal(categories, from, to);
        return new StatsTotalResponse(totalMinutes);
    }

    public StatsSummaryResponse summary(List<String> categories, LocalDate from, LocalDate to) {
        long totalMinutes = repo.statsTotal(categories, from, to);
        long activityCount = repo.countActivities(categories, from, to);
        long activeDays = repo.countActiveDays(categories, from, to);
        double averageMinutesPerActivity = activityCount == 0 ? 0.0 : (double) totalMinutes / activityCount;

        return new StatsSummaryResponse(
                totalMinutes,
                activityCount,
                activeDays,
                averageMinutesPerActivity
        );
    }

    public List<StatsByDayResponse> byDay(List<String> categories, LocalDate from, LocalDate to) {
        return repo.statsByDay(categories, from, to);
    }

    public List<StatsByCategoryResponse> byCategory(List<String> categories, LocalDate from, LocalDate to) {
        return repo.statsByCategory(categories, from, to);
    }

    public List<StatsByDayCategoryResponse> byDayCategory(List<String> categories, LocalDate from, LocalDate to) {
        return repo.statsByDayCategory(categories, from, to);
    }
}