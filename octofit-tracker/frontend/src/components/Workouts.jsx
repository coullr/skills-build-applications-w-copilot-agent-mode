import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkouts() {
      try {
        const response = await fetch(buildApiUrl('/api/workouts'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.results ?? [];
        setWorkouts(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load workouts.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWorkouts();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="card shadow-sm p-4">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-secondary text-white">
        <h2 className="h4 mb-0">Workouts</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Duration</th>
              <th>Exercises</th>
            </tr>
          </thead>
          <tbody>
            {workouts.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">No workouts found.</td>
              </tr>
            ) : (
              workouts.map((workout) => (
                <tr key={workout._id || workout.name}>
                  <td>{workout.name}</td>
                  <td>{workout.category}</td>
                  <td>{workout.difficulty}</td>
                  <td>{workout.durationMinutes} min</td>
                  <td>{workout.exercises?.join(', ') || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
