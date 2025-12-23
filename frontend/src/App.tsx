import './App.css';
import { useActivities } from './hooks/useActivities';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';

function App() {
  const { activities, status, reload, create, update, remove, filters, applyFilters, clearFilters } = useActivities();

  return (
    <div className='page'>
      <header className='header'>
        <h1>Activity Tracker</h1>
        <p>UI skeleton (loads from API)</p>
      </header>

      <main className='grid'>
        <section className='card'>
          <ActivityForm onCreate={ create }/>
        </section>
        <section className='card'>
          <ActivityList 
            onRemove={ remove }
            onUpdate={ update }
            
            onReload={ reload }
            activities={ activities }
            status={ status }
          
            filters={ filters }
            onApplyFilters={ applyFilters }
            onClearFilters={ clearFilters }
          />
        </section>
      </main>
    </div>
  );
}

export default App;
