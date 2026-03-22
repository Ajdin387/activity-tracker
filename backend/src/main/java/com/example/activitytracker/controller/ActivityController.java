package com.example.activitytracker.controller;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.dto.UpdateActivityRequest;
import com.example.activitytracker.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    @GetMapping
    public Page<ActivityResponse> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer minDuration,
            @RequestParam(required = false) Integer maxDuration,
            @PageableDefault(size = 20)
            @SortDefault.SortDefaults({
                    @SortDefault(sort = "date", direction = Sort.Direction.DESC),
                    @SortDefault(sort = "id", direction = Sort.Direction.DESC)
            }) Pageable pageable
    ) {
        category = normalizeOptionalString(category);
        q = normalizeOptionalString(q);

        validateDateRange(from, to);
        validateDurationRange(minDuration, maxDuration);

        return service.getAll(category, from, to, q, minDuration, maxDuration, pageable);
    }

    @GetMapping("/{id}")
    public ActivityResponse getById(@PathVariable long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<ActivityResponse> create(@Valid @RequestBody CreateActivityRequest req) {
        ActivityResponse created = service.create(req);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> update(@PathVariable long id, @Valid @RequestBody UpdateActivityRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static void validateDateRange(LocalDate from, LocalDate to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new IllegalArgumentException("'from' must be before 'to'");
        }
    }

    private static void validateDurationRange(Integer minDuration, Integer maxDuration) {
        if (minDuration != null && minDuration < 1) {
            throw new IllegalArgumentException("'minDuration' must be at least 1");
        }
        if (maxDuration != null && maxDuration < 1) {
            throw new IllegalArgumentException("'maxDuration' must be at least 1");
        }
        if (minDuration != null && maxDuration != null && minDuration > maxDuration) {
            throw new IllegalArgumentException("'minDuration' must be less than or equal to 'maxDuration'");
        }
    }

    private static String normalizeOptionalString(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}