import { fetchJson } from "./client";
import type { Activity, ActivityFilters, CreateActivityRequest, UpdateActivityRequest } from "./types";

export function listActivities(params?: ActivityFilters) {
    const url = new URL("/api/activities", window.location.origin);

    if (params?.category) url.searchParams.set("category", params.category);
    if (params?.from) url.searchParams.set("from", params.from);
    if (params?.to) url.searchParams.set("to", params.to);
    if (params?.q) url.searchParams.set("q", params.q);
    (params?.sort ?? []).forEach(s => url.searchParams.append("sort", s));

    return fetchJson<Activity[]>(url.pathname + url.search);
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