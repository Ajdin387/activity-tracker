import { useState } from "react";
import { Activity, ActivityFilters, ActivityPage, UpdateActivityRequest } from "../types/activity";
import { ActivityFiltersForm } from "./ActivityFiltersForm";
import { ActivityEditForm } from "./ActivityEditForm";

type LoadStatus = "loading" | "success" | "error";

type Props = {
    onRemove: (id: number) => Promise<void>;
    onUpdate: (id: number, payload: UpdateActivityRequest) => Promise<void>;

    activities: Activity[];
    status: LoadStatus;
    onReload: () => void;

    filters: ActivityFilters;
    onApplyFilters: (f: Omit<ActivityFilters, "sort">) => void;
    onClearFilters: () => void;

    page: ActivityPage | null;
    onNextPage: () => void;
    onPrevPage: () => void;
};

export function ActivityList({ onRemove, onUpdate, activities, status, onReload, filters, onApplyFilters, onClearFilters, page, onNextPage, onPrevPage }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [savingId, setSavingId] = useState<number | null>(null);

    async function remove(id: number) {
    try {
      await onRemove(id);
    } catch(e) {
      console.error("Failed to delete activity", e);
      alert("Delete failed. Is backend running?");
    }
  }

  async function save(id: number, payload: UpdateActivityRequest) {
    try {
      setSavingId(id);
      await onUpdate(id, payload);
      setEditingId(null);
    } catch (e) {
      console.error("Failed to update activity", e);
      alert("Update failed. Is backend running?");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
        <div className='listHeader'>
            <h2>Activities</h2>
            <span className='badge'>{page?.totalElements ?? activities.length}</span>
        </div>

        {page && (
            <div className="pager">
                <button type="button" onClick={onPrevPage} disabled={page.first}>
                    Prev
                </button>

                <span className="pagerInfo">
                    Page {page.number + 1} / {page.totalPages} • Total {page.totalElements}
                </span>

                <button type="button" onClick={onNextPage} disabled={page.last}>
                    Next
                </button>
            </div>
        )}

        <div>
            <ActivityFiltersForm
                initial={ filters }
                onApply={ onApplyFilters }
                onClear={ onClearFilters }
            />
        </div>

        {status === "error" && (
        <div>
            <p>Failed to load activities (API not reachable). Is the backend running?</p>
            <button type='button' onClick={ onReload }>Retry</button>
        </div>
        )}

        {status === "loading" && <p>Loading data...</p>}

        {status === "success" && activities.length === 0 && ( <p>No activities yet.</p> )}

        {status === "success" && activities.length > 0 && (
        <ul className='list'>
            {activities.map((a) => {
                const isEditing = editingId === a.id;
                const isSaving = savingId === a.id;

                return (
                    <li className='item' key={a.id}>
                        {!isEditing && (
                            <div>
                                <div>
                                    <strong>{a.name}</strong>
                                    <span> - {a.category}</span>
                                </div>
                                <div>
                                    {a.date} • {a.durationMinutes} min
                                </div>
                                {a.description && <div>{a.description}</div>}
                            </div>
                        )}

                        {isEditing && (
                            <ActivityEditForm 
                                activity={ a }
                                onSave={ (payload) => save(a.id, payload) }
                                onCancel={ () => setEditingId(null) }
                                saving={ isSaving }
                            />
                        )}

                        <div className="itemActions">
                            {!isEditing ? (
                                <>
                                <button type="button" onClick={() => setEditingId(a.id)}>
                                    Edit
                                </button>
                                <button type="button" onClick={() => remove(a.id)}>
                                    Delete
                                </button>
                                </>
                            ) : (
                                <button type="button" onClick={() => setEditingId(null)} disabled={isSaving}>
                                    Close
                                </button>
                            )}
                        </div>
                    </li>
                )
            })}
        </ul>
        )}
    </div>
  )
}