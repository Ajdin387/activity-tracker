package com.example.activitytracker.dto;

import java.time.LocalDate;

public record StatsByDayCategoryResponse(
        LocalDate date,
        String category,
        long totalMinutes
) {}