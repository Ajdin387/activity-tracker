package com.example.activitytracker.dto;

public record StatsByCategoryResponse(
        String category,
        long totalMinutes
) {}