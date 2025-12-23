import './App.css';
import { useActivities } from './hooks/useActivities';
import { ActivityForm } from './components/ActivityForm';
import { ActivityList } from './components/ActivityList';
import { StatsPanel } from './components/StatsPanel';

function App() {
  const { activities, page, status, reload, create, update, remove, filters, applyFilters, clearFilters, nextPage, prevPage } = useActivities();

  return (
    <div className='page'>
      <header className='header'>
        <h1>Activity Tracker</h1>
      </header>

      <main className='grid'>
        <section className='card'>
          <ActivityForm onCreate={ create }/>
        </section>

        <section className='card'>
          <StatsPanel filters={ filters }/>

          <ActivityList 
            onRemove={ remove }
            onUpdate={ update }

            onReload={ reload }
            activities={ activities }
            status={ status }
          
            filters={ filters }
            onApplyFilters={ applyFilters }
            onClearFilters={ clearFilters }

            page={ page }
            onNextPage={ nextPage }
            onPrevPage={ prevPage }
          />
        </section>
      </main>
    </div>
  );
}

export default App;
