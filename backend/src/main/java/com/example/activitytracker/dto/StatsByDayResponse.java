package com.example.activitytracker.dto;

import java.time.LocalDate;

public record StatsByDayResponse(
        LocalDate date,
        long totalMinutes
) {}