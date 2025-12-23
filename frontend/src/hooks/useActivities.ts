import { useCallback, useEffect, useState } from "react";
import { createActivity, deleteActivity, listActivities, updateActivity } from "../api/activitiesApi";
import { ActivityPage, Activity, ActivityFilters, CreateActivityRequest, UpdateActivityRequest } from "../types/activity";

type LoadStatus = "loading" | "success" | "error";

const DEFAULT_SORT = ["date,desc", "id,desc"];
const DEFAULT_PAGE = 0;
const DEFAULT_SIZE = 20;

export function useActivities() {
    const [status, setStatus] = useState<LoadStatus>("loading");
    const [filters, setFilters] = useState<ActivityFilters>({ 
        sort: DEFAULT_SORT, 
        page: DEFAULT_PAGE,
        size: DEFAULT_SIZE,
    });
    const [page, setPage] = useState<ActivityPage | null>(null);
    const activities = page?.content ?? [];

    const reload = useCallback(async () => {
        setStatus("loading");
        try {
            const data = await listActivities(filters);
            setPage(data);
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
            page: 0
        }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ sort: DEFAULT_SORT, page: 0, size: DEFAULT_SIZE });
    }, []);

    const nextPage = useCallback(() => {
        if (!page || page.last) return;
        setFilters(prev => ({ ...prev, page: (prev.page ?? 0) + 1 }));
    }, [page]);

    const prevPage = useCallback(() => {
        if (!page || page.first) return;
        setFilters(prev => ({ ...prev, page: Math.max(0, (prev.page ?? 0) - 1) }));
    }, [page]);

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

    return { activities, page, status, reload, create, update, remove, filters, applyFilters, clearFilters, nextPage, prevPage };
}
