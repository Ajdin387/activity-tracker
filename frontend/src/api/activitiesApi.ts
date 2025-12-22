import { fetchJson } from "./client";
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from "./types";

export function listActivities() {
    return fetchJson<Activity[]>("/api/activities?sort=date,desc&sort=id,desc");
}

export function createActivity(payload: CreateActivityRequest) {
    return fetchJson<Activity>("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(payload),
    })
}

export function updateActivity(id: number, payload: UpdateActivityRequest) {
    return fetchJson<Activity>(`/api/activities/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    })
}

export function deleteActivity(id: number) {
    return fetchJson<void>(`/api/activities/${id}`, 
        { method: "DELETE" }
    );
}