import { useCallback, useEffect, useState } from "react";
import { createActivity, deleteActivity, listActivities } from "../api/activitiesApi";
import { Activity, CreateActivityRequest } from "../api/types";

type LoadStatus = "loading" | "success" | "error";

export function useActivities() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [status, setStatus] = useState<LoadStatus>("loading");

    const reload = useCallback(async () => {
        setStatus("loading");
        try {
        const data = await listActivities();
        setActivities(data);
        setStatus("success");
        } catch(e) {
            console.error("Failed to load activities", e);
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        void reload();
    }, [reload])

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

    return { activities, status, reload, create, remove };
}
