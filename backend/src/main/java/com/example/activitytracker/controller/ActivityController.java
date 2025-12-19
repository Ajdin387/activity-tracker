package com.example.activitytracker.controller;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.dto.UpdateActivityRequest;
import com.example.activitytracker.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }

    @GetMapping
    public List<ActivityResponse> getAll(Sort sort) {
        return service.getAll(sort);
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
}
