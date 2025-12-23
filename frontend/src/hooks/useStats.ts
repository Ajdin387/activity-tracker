import { useCallback, useEffect, useState } from "react";
import { StatsByCategoryResponse, StatsByDayResponse, StatsQuery, StatsTotalResponse } from "../types/stats";
import { getStatsByCategory, getStatsByDay, getStatsTotal } from "../api/statsApi";

type LoadStatus = "loading" | "success" | "error";

export function useStats(query: StatsQuery) {
    const [status, setStatus] = useState<LoadStatus>("loading");
    const [total, setTotal] = useState<StatsTotalResponse | null>(null);
    const [byCategory, setByCategory] = useState<StatsByCategoryResponse[]>([]);
    const [byDay, setByDay] = useState<StatsByDayResponse[]>([]);

    const categoriesKey = (query.categories ?? []).join("|");
    const from = query.from ?? "";
    const to = query.to ?? "";

    const reload = useCallback(async () => {
        setStatus("loading");
        try {
        const q: StatsQuery = {
            categories: query.categories,
            from: query.from,
            to: query.to,
        };

        const [t, bc, bd] = await Promise.all([
            getStatsTotal(q),
            getStatsByCategory(q),
            getStatsByDay(q),
        ]);

        setTotal(t);
        setByCategory(bc);
        setByDay(bd);
        setStatus("success");
        } catch (e) {
        console.error("Failed to load stats", e);
        setStatus("error");
        }
    }, [categoriesKey, from, to]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { status, total, byCategory, byDay, reload };
}