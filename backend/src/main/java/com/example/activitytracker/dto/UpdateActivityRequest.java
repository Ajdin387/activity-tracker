package com.example.activitytracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class UpdateActivityRequest {

    @NotBlank
    @Size(max = 255)
    private String name;

    @Size(max = 2000)
    private String description;

    @NotBlank
    @Size(max = 255)
    private String category;

    @NotNull(message = "date is required")
    @PastOrPresent(message = "date must not be in the future")
    private LocalDate date;

    @Min(value = 1, message = "durationMinutes must be at least 1")
    @Max(value = 1440, message = "durationMinutes must be at most 1440")
    private int durationMinutes;

    public UpdateActivityRequest() {
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public LocalDate getDate() {
        return date;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}