package com.example.activitytracker.mapper;

import com.example.activitytracker.dto.ActivityResponse;
import com.example.activitytracker.dto.CreateActivityRequest;
import com.example.activitytracker.dto.UpdateActivityRequest;
import com.example.activitytracker.model.Activity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    @Named("trimRequired")
    default String trimRequired(String value) {
        return (value == null) ? null : value.trim();
    }

    @Named("trimToNull")
    default String trimToNull(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name", qualifiedByName = "trimRequired")
    @Mapping(target = "category", source = "category", qualifiedByName = "trimRequired")
    @Mapping(target = "description", source = "description", qualifiedByName = "trimToNull") // v primeru "" postavi na null, lepše za bazo
    Activity toEntity(CreateActivityRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name", qualifiedByName = "trimRequired")
    @Mapping(target = "category", source = "category", qualifiedByName = "trimRequired")
    @Mapping(target = "description", source = "description", qualifiedByName = "trimToNull")
    void updateEntity(UpdateActivityRequest req, @MappingTarget Activity entity);

    ActivityResponse toResponse(Activity entity);

    List<ActivityResponse> toResponses(List<Activity> entities);

}
