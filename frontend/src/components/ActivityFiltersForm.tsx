import { useEffect, useState } from "react";
import { ActivityFilters } from "../types/activity";

type Props = {
    initial: ActivityFilters;
    onApply: (filters: Omit<ActivityFilters, "sort">) => void;
    onClear: () => void;
};

export function ActivityFiltersForm({ initial, onApply, onClear }: Props) {
    const [category, setCategory] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [q, setQ] = useState("");
    const [size, setSize] = useState(20);

    useEffect(() => {
        setCategory(initial.category ?? "");
        setFrom(initial.from ?? "");
        setTo(initial.to ?? "");
        setQ(initial.q ?? "");
        setSize(initial.size ?? 20);
    }, [initial.category, initial.from, initial.to, initial.q]);

    const normalize = (s: string) => {
        const t = s.trim();
        return t.length ? t : undefined;
    };

    function submit(e: React.FormEvent) {
        e.preventDefault();

        onApply({
            q: normalize(q),
            category: normalize(category),
            from: normalize(from),
            to: normalize(to),
            size,
        });
    }

    function clear() {
        setQ("");
        setCategory("");
        setFrom("");
        setTo("");
        setSize(20);
        onClear();
    }

    return (
        <div>
            <form className="form" onSubmit={submit}>
                <div className="row2">
                    <label>
                        Search
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="name/description..."
                        />
                    </label>

                    <label>
                        Category
                        <input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g. Sport"
                        />
                    </label>
                </div>

                <div className="row2">
                    <label>
                        From
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    </label>

                    <label>
                        To
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </label>
                </div>

                <div className="row3">
                    <button className="primary" type="submit">Apply</button>
                    <button type="button" onClick={clear}>Clear</button>
                    <label>
                        Page size
                        <select value={size} onChange={(e) => setSize(Number(e.target.value))}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </label>
                </div>
            </form>
        </div>
    )
}