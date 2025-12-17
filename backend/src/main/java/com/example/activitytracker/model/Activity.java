package com.example.activitytracker.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private int durationMinutes;

    protected Activity() {}

    public Activity(String name, String description, String category, LocalDate date, int durationMinutes) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.date = date;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public LocalDate getDate() { return date; }
    public int getDurationMinutes() { return durationMinutes; }

    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

}
