import { useState } from "react";
import { CreateActivityRequest } from "../types/activity";

type Props = {
    onCreate: (payload: CreateActivityRequest) => Promise<void>;
};

export function ActivityForm({ onCreate }: Props) {
    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [newDurationMinutes, setNewDurationMinutes] = useState(30);

    const canSubmit = newName.trim().length > 0 && newCategory.trim().length > 0 && newDate.trim().length > 0 && newDurationMinutes >= 1;

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!canSubmit) return;

        const desc = newDescription.trim();
        const payload: CreateActivityRequest = {
        name: newName.trim(),
        category: newCategory.trim(),
        date: newDate,
        durationMinutes: newDurationMinutes,
        description: desc ? desc : undefined,
        };

        try {
            await onCreate(payload);
            setNewName("")
            setNewDescription("")
            setNewCategory("")
            setNewDate(new Date().toISOString().slice(0, 10))
            setNewDurationMinutes(30)
        } catch (e) {
            console.error("Failed to create activity", e);
            alert("Create failed. Is backend running?");
        }
    }

    return (
        <div>
            <h2>Add activity</h2>
            <form className='form' onSubmit={onSubmit}>
                <label>
                Name *
                <input 
                    placeholder="e.g. Reading" 
                    value={newName} 
                    onChange={e => setNewName(e.target.value)}
                />
                </label>

                <label>
                Category *
                <input 
                    placeholder="e.g. Sport" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                />
                </label>

                <div className='row2'>
                <label>
                    Date *
                    <input 
                    type="date" 
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    />
                </label>

                <label>
                    Duration *
                    <input
                    type="number"
                    min={1}
                    value={newDurationMinutes}
                    onChange={e => setNewDurationMinutes(Math.max(1, Number(e.target.value) || 1))}
                    />
                </label>
                </div>

                <label>
                Description
                <textarea 
                    placeholder="optional" 
                    value={newDescription} 
                    onChange={e => setNewDescription(e.target.value)}
                />
                </label>

                <button className='primary' type="submit" disabled={!canSubmit}>
                Add
                </button>
            </form>
        </div>
    )
}