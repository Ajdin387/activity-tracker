package com.example.activitytracker.controller;

import com.example.activitytracker.model.Activity;
import com.example.activitytracker.repository.ActivityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ActivityDurationFilterIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ActivityRepository activityRepository;

    @BeforeEach
    void setUp() {
        activityRepository.deleteAll();

        activityRepository.save(new Activity("Walk", "Short walk", "Health", LocalDate.now().minusDays(3), 20));
        activityRepository.save(new Activity("Gym", "Workout", "Health", LocalDate.now().minusDays(2), 45));
        activityRepository.save(new Activity("Study", "Algorithms", "School", LocalDate.now().minusDays(1), 90));
        activityRepository.save(new Activity("Deep Work", "Long session", "Work", LocalDate.now(), 180));
    }

    @Test
    void shouldFilterActivitiesByDurationRange() throws Exception {
        mockMvc.perform(get("/api/activities")
                        .param("minDuration", "30")
                        .param("maxDuration", "100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2)))
                .andExpect(jsonPath("$.content[*].name", containsInAnyOrder("Gym", "Study")));
    }

    @Test
    void shouldRejectInvalidDurationRange() throws Exception {
        mockMvc.perform(get("/api/activities")
                        .param("minDuration", "120")
                        .param("maxDuration", "60"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("'minDuration' must be less than or equal to 'maxDuration'"));
    }
}