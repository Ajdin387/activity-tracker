package com.example.activitytracker.service;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.dto.UpdateActivityRequest;
import com.example.activitytracker.exception.NotFoundException;
import com.example.activitytracker.mapper.ActivityMapper;
import com.example.activitytracker.model.Activity;
import com.example.activitytracker.repository.ActivityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class ActivityService {

    private final ActivityRepository repo;
    private final ActivityMapper mapper;

    public ActivityService(ActivityRepository repo, ActivityMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public Page<ActivityResponse> getAll(
            String category,
            LocalDate from,
            LocalDate to,
            String q,
            Integer minDuration,
            Integer maxDuration,
            Pageable pageable
    ) {
        return repo.search(category, from, to, q, minDuration, maxDuration, pageable)
                .map(mapper::toResponse);
    }

    public ActivityResponse getById(long id) {
        Activity entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity with id " + id + " not found"));
        return mapper.toResponse(entity);
    }

    public ActivityResponse create(CreateActivityRequest req) {
        Activity entity = mapper.toEntity(req);
        Activity saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public ActivityResponse update(long id, UpdateActivityRequest req) {
        Activity entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity with id " + id + " not found"));

        mapper.updateEntity(req, entity);
        Activity saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public void delete(long id) {
        Activity entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity with id " + id + " not found"));
        repo.delete(entity);
    }
}