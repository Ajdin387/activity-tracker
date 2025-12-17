package com.example.activitytracker.mapper;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.model.Activity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    @Named("trimToNull")
    default String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name", qualifiedByName = "trimToNull")
    @Mapping(target = "category", source = "category", qualifiedByName = "trimToNull")
    Activity toEntity(CreateActivityRequest request);

    ActivityResponse toResponse(Activity entity);

    List<ActivityResponse> toResponses(List<Activity> entities);
}
