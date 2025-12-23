import { Activity } from "../api/types";

type LoadStatus = "loading" | "success" | "error";

type Props = {
    onRemove: (id: number) => Promise<void>;
    activities: Activity[];
    status: LoadStatus;
    onReload: () => void;
};

export function ActivityList({ onRemove, activities, status, onReload }: Props) {
    async function onDelete(id: number) {
    try {
      await onRemove(id);
    } catch(e) {
      console.error("Failed to delete activity", e);
      alert("Delete failed. Is backend running?");
    }
  }

  return (
    <div>
        <div className='listHeader'>
            <h2>Activities</h2>
            <span className='badge'>{activities.length}</span>
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
              {activities.map(a => (
                <li className='item' key={a.id}>
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
                  <button type="button" onClick={() => onDelete(a.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
    </div>
  )
}