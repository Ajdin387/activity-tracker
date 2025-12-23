import './App.css';
import { useActivities } from './hooks/useActivities';
import { ActivityForm } from './components/ActivityForm';

function App() {
  const { activities, status, reload, create, remove } = useActivities();

  async function onDelete(id: number) {
    try {
      await remove(id);
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
          <ActivityForm onCreate={create}/>
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
              <button type='button' onClick={reload}>Retry</button>
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
