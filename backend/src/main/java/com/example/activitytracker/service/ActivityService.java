package com.example.activitytracker.service;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.exception.NotFoundException;
import com.example.activitytracker.mapper.ActivityMapper;
import com.example.activitytracker.model.Activity;
import com.example.activitytracker.repository.ActivityRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository repo;
    private final ActivityMapper mapper;

    public ActivityService(ActivityRepository repo, ActivityMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    public List<ActivityResponse> getAll(Sort sort) {
        Sort effective = (sort == null || sort.isUnsorted())
                ? Sort.by(Sort.Direction.DESC, "date", "id")
                : sort;
        return mapper.toResponses(repo.findAll(effective));
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

    public void delete(long id) {
        Activity entity = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Activity with id " + id + " not found"));
        repo.delete(entity);
    }
}
