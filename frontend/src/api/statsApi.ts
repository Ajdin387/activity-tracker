import { StatsByCategoryResponse, StatsByDayCategoryResponse, StatsByDayResponse, StatsQuery, StatsTotalResponse } from "../types/stats";
import { fetchJson } from "./client";

function buildStatsUrl(path: string, q?: StatsQuery) {
    const url = new URL(path, window.location.origin);

    (q?.categories ?? []).forEach((c) => url.searchParams.append("categories", c));
    if (q?.from) url.searchParams.set("from", q.from);
    if (q?.to) url.searchParams.set("to", q.to);

    return url.pathname + url.search;
}

export function getStatsTotal(q?: StatsQuery) {
    return fetchJson<StatsTotalResponse>(buildStatsUrl("/api/stats/total", q));
}

export function getStatsByCategory(q?: StatsQuery) {
    return fetchJson<StatsByCategoryResponse[]>(buildStatsUrl("/api/stats/by-category", q));
}

export function getStatsByDay(q?: StatsQuery) {
    return fetchJson<StatsByDayResponse[]>(buildStatsUrl("/api/stats/by-day", q));
}

export function getStatsByDayCategory(q?: StatsQuery) {
    return fetchJson<StatsByDayCategoryResponse[]>(buildStatsUrl("/api/stats/by-day-category", q));
}