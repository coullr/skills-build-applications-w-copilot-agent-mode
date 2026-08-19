import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities`
    : 'http://localhost:8000/api/activities';

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.results ?? [];
        setActivities(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load activities.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadActivities();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="card shadow-sm p-4">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-success text-white">
        <h2 className="h4 mb-0">Activities</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Username</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted py-4">No activities found.</td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity._id || `${activity.username}-${activity.date}`}>
                  <td>{activity.username}</td>
                  <td>{activity.type}</td>
                  <td>{activity.durationMinutes} min</td>
                  <td>{activity.points}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
