package com.example.activitytracker.service;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.exception.NotFoundException;
import com.example.activitytracker.mapper.ActivityMapper;
import com.example.activitytracker.model.Activity;
import com.example.activitytracker.repository.ActivityRepository;
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

    public List<ActivityResponse> getAll () {
        return mapper.toResponses(repo.findAll());
    }

    public ActivityResponse create(CreateActivityRequest req) {
        Activity entity = mapper.toEntity(req);
        Activity saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    public void delete(long id) {
        if (!repo.existsById(id)) {
            throw new NotFoundException("Activity with id " + id + " not found");
        }
        repo.deleteById(id);
    }
}
