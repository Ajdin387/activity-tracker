import { useCallback, useEffect, useState } from 'react';
import './App.css';
import type { Activity } from './api/types';
import { deleteActivity, listActivities } from './api/activitiesApi';

type LoadStatus = "loading" | "success" | "error";

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newDurationMinutes, setNewDurationMinutes] = useState(30);

  const canSubmit = newName.trim().length > 0 && newCategory.trim().length > 0 && newDate.trim().length > 0 && newDurationMinutes >= 1

  const loadActivities = useCallback(async () => {
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
    void loadActivities();
  }, [loadActivities])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!canSubmit) return;

    const next: Activity = {
      id: Date.now(),
      name: newName.trim(),
      category: newCategory.trim(),
      date: newDate,
      durationMinutes: newDurationMinutes,
      description: newDescription.trim() ? newDescription.trim() : undefined,
    }

    setActivities(prev => [next, ...prev])
    setNewName("")
    setNewDescription("")
    setNewCategory("")
    setNewDate(new Date().toISOString().slice(0, 10))
    setNewDurationMinutes(30)
  }

  async function onDelete(id: number) {
    try {
      await deleteActivity(id);
      await loadActivities();
    } catch(e) {
      console.error("Failed to delete activity", e);
      alert("Delete failed. Is backend running?");
    }
  }

  return (
    <div className='page'>
      <header className='header'>
        <h1>Activity Tracker</h1>
        <p>UI skeleton (loads from API)</p>
      </header>

      <main className='grid'>
        <section className='card'>
          {/* Input activity */}
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
                  onChange={e => setNewDurationMinutes(Number(e.target.value))}
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
        </section>

        <section className='card'>
          {/* Activities list */}
          <div className='listHeader'>
            <h2>Activities</h2>
            <span className='badge'>{activities.length}</span>
          </div>

          {status === "error" && (
            <div>
              <p>Failed to load activities (API not reachable). Is the backend running?</p>
              <button type='button' onClick={loadActivities}>Retry</button>
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
        </section>
      </main>
    </div>
  );
}

export default App;
