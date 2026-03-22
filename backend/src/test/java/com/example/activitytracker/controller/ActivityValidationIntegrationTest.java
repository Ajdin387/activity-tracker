package com.example.activitytracker.controller;

import com.example.activitytracker.model.Activity;
import com.example.activitytracker.repository.ActivityRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ActivityValidationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ActivityRepository activityRepository;

    @BeforeEach
    void setUp() {
        activityRepository.deleteAll();
    }

    @Test
    void createShouldRejectFutureDateAndTooLargeDuration() throws Exception {
        String payload = """
                {
                  "name": "Reading",
                  "description": "Book",
                  "category": "Hobby",
                  "date": "%s",
                  "durationMinutes": 1500
                }
                """.formatted(LocalDate.now().plusDays(1));

        mockMvc.perform(post("/api/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.date").value("date must not be in the future"))
                .andExpect(jsonPath("$.fieldErrors.durationMinutes").value("durationMinutes must be at most 1440"));
    }

    @Test
    void updateShouldRejectFutureDateAndTooLargeDuration() throws Exception {
        Activity saved = activityRepository.save(
                new Activity("Gym", "Leg day", "Health", LocalDate.now(), 60)
        );

        String payload = """
                {
                  "name": "Gym",
                  "description": "Updated",
                  "category": "Health",
                  "date": "%s",
                  "durationMinutes": 2000
                }
                """.formatted(LocalDate.now().plusDays(2));

        mockMvc.perform(put("/api/activities/{id}", saved.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.date").value("date must not be in the future"))
                .andExpect(jsonPath("$.fieldErrors.durationMinutes").value("durationMinutes must be at most 1440"));
    }
}