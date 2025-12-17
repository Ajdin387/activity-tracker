package com.example.activitytracker.dto;

import java.time.LocalDate;

public record ActivityResponse(
        Long id,
        String name,
        String description,
        String category,
        LocalDate date,
        int durationMinutes
) {}