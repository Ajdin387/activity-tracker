package com.example.activitytracker.dto;

public record StatsSummaryResponse(
        long totalMinutes,
        long activityCount,
        long activeDays,
        double averageMinutesPerActivity
) {
}