import { useEffect, useState } from "react";
import { Activity, UpdateActivityRequest } from "../types/activity"

type Props = {
    activity: Activity;
    onSave: (payload: UpdateActivityRequest) => Promise<void>;
    onCancel: () => void;
    saving?: boolean;
}

type Draft = {
    name: string;
    category: string;
    date: string;
    durationMinutes: number;
    description: string;
}

export function ActivityEditForm({ activity, onSave, onCancel, saving }: Props) {
    const [draft, setDraft] = useState<Draft>({
        name: activity.name,
        category: activity.category,
        date: activity.date,
        durationMinutes: activity.durationMinutes,
        description: activity.description ?? "",
    })

    useEffect(() => {
        setDraft({
            name: activity.name,
            category: activity.category,
            date: activity.date,
            durationMinutes: activity.durationMinutes,
            description: activity.description ?? "",
        })
    }, [activity.id]);

    const canSave = draft.name.trim().length > 0 && draft.category.trim().length > 0 && draft.date.trim().length > 0 && Number.isFinite(draft.durationMinutes) && draft.durationMinutes >= 1;

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSave || saving) return;

        const payload: UpdateActivityRequest = {
            name: draft.name.trim(),
            category: draft.category.trim(),
            date: draft.date,
            durationMinutes: Math.max(1, Math.floor(draft.durationMinutes)),
            description: draft.description.trim() ? draft.description.trim() : undefined,
        };

        await onSave(payload);
    }

    return (
        <form className="form editForm" onSubmit={submit}>
            <label>
                Name *
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </label>

            <label>
                Category *
                <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </label>

            <div className="row2">
                <label>
                Date *
                <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
                </label>

                <label>
                Duration *
                <input
                    type="number"
                    min={1}
                    value={draft.durationMinutes}
                    onChange={(e) => setDraft({ ...draft, durationMinutes: Math.max(1, Number(e.target.value) || 1) })}
                />
                </label>
            </div>

            <label>
                Description
                <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </label>

            <div className="row2">
                <button className="primary" type="submit" disabled={!canSave || saving}>
                {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={onCancel} disabled={saving}>
                Cancel
                </button>
            </div>
        </form>
    )
}