import { useCallback, useEffect, useState } from "react";
import { createActivity, deleteActivity, listActivities, updateActivity } from "../api/activitiesApi";
import { Activity, ActivityFilters, CreateActivityRequest, UpdateActivityRequest } from "../types/activity";

type LoadStatus = "loading" | "success" | "error";

const DEFAULT_SORT = ["date,desc", "id,desc"];

export function useActivities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [status, setStatus] = useState<LoadStatus>("loading");
    const [filters, setFilters] = useState<ActivityFilters>({ sort: DEFAULT_SORT });

    const reload = useCallback(async () => {
        setStatus("loading");
        try {
            const data = await listActivities(filters);
            setActivities(data);
            setStatus("success");
        } catch(e) {
            console.error("Failed to load activities", e);
            setStatus("error");
        }
    }, [filters]);

    useEffect(() => {
        void reload();
    }, [reload])

    const applyFilters = useCallback((next: Omit<ActivityFilters, "sort">) => {
        setFilters(prev => ({
            ...prev,
            ...next,
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ sort: DEFAULT_SORT });
    }, []);

    const create = useCallback(
        async (payload: CreateActivityRequest) => {
        await createActivity(payload);
        await reload();
        },
        [reload]
    );

    const remove = useCallback(
        async (id: number) => {
        await deleteActivity(id);
        await reload();
        },
        [reload]
    );

    const update = useCallback(
        async (id: number, payload: UpdateActivityRequest) => {
            await updateActivity(id, payload);
            await reload();
        },
        [reload]
    );

    return { activities, status, reload, create, update, remove, filters, applyFilters, clearFilters };
}
