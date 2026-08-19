import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadLeaderboard() {
      try {
        const response = await fetch(buildApiUrl('/api/leaderboard'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.results ?? [];
        setEntries(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load leaderboard.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadLeaderboard();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="card shadow-sm p-4">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-warning text-dark">
        <h2 className="h4 mb-0">Leaderboard</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">No leaderboard entries found.</td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id || entry.username}>
                  <td>{entry.rank}</td>
                  <td>{entry.username}</td>
                  <td>{entry.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
