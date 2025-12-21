package com.example.activitytracker.controller;

import com.example.activitytracker.dto.StatsByCategoryResponse;
import com.example.activitytracker.dto.StatsByDayCategoryResponse;
import com.example.activitytracker.dto.StatsByDayResponse;
import com.example.activitytracker.dto.StatsTotalResponse;
import com.example.activitytracker.service.ActivityStatsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class ActivityStatsController {

    private final ActivityStatsService service;

    public ActivityStatsController(ActivityStatsService service) {
        this.service = service;
    }

    @GetMapping("/total")
    public StatsTotalResponse getStatsTotal(
            @RequestParam (required = false) List<String> categories,
            @RequestParam (required = false) LocalDate from,
            @RequestParam (required = false) LocalDate to) {
        validateDateRange(from, to);
        return service.total(normalizeCategories(categories), from, to);
    }

    @GetMapping("/by-day")
    public List<StatsByDayResponse> getStatsByDay(
            @RequestParam (required = false) List<String> categories,
            @RequestParam (required = false) LocalDate from,
            @RequestParam (required = false) LocalDate to) {
        validateDateRange(from, to);
        return service.byDay(normalizeCategories(categories), from, to);
    }

    @GetMapping("/by-category")
    public List<StatsByCategoryResponse> getStatsByCategory(
            @RequestParam (required = false) List<String> categories,
            @RequestParam (required = false) LocalDate from,
            @RequestParam (required = false) LocalDate to) {
        validateDateRange(from, to);
        return service.byCategory(normalizeCategories(categories), from, to);
    }

    @GetMapping("/by-day-category")
    public List<StatsByDayCategoryResponse> getStatsByDayCategory(
            @RequestParam (required = false) List<String> categories,
            @RequestParam (required = false) LocalDate from,
            @RequestParam (required = false) LocalDate to) {
        validateDateRange(from, to);
        return service.byDayCategory(normalizeCategories(categories), from, to);
    }

    private static List<String> normalizeCategories(List<String> categories) {
        if (categories == null || categories.isEmpty()) return null;

        List<String> normalized = categories.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(String::trim)
                .map(String::toLowerCase)
                .distinct()
                .toList();

        return normalized.isEmpty() ? null : normalized;
    }

    private static void validateDateRange(LocalDate from, LocalDate to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("'from' must be before 'to'");
        }
    }
}
