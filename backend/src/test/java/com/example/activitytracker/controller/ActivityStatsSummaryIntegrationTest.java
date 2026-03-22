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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ActivityStatsSummaryIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ActivityRepository activityRepository;

    @BeforeEach
    void setUp() {
        activityRepository.deleteAll();

        activityRepository.save(new Activity("Algorithms", "Study session", "Work", LocalDate.now().minusDays(2), 30));
        activityRepository.save(new Activity("Project", "Coding", "Work", LocalDate.now().minusDays(1), 60));
        activityRepository.save(new Activity("Run", "Evening cardio", "Health", LocalDate.now().minusDays(1), 30));
    }

    @Test
    void shouldReturnSummaryForAllActivities() throws Exception {
        mockMvc.perform(get("/api/stats/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMinutes").value(120))
                .andExpect(jsonPath("$.activityCount").value(3))
                .andExpect(jsonPath("$.activeDays").value(2))
                .andExpect(jsonPath("$.averageMinutesPerActivity").value(40.0));
    }

    @Test
    void shouldReturnFilteredSummaryByCategory() throws Exception {
        mockMvc.perform(get("/api/stats/summary")
                        .param("categories", "work"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalMinutes").value(90))
                .andExpect(jsonPath("$.activityCount").value(2))
                .andExpect(jsonPath("$.activeDays").value(2))
                .andExpect(jsonPath("$.averageMinutesPerActivity").value(45.0));
    }
}