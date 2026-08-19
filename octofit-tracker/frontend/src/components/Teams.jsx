import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_CODESPACE_NAME
    ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams`
    : 'http://localhost:8000/api/teams';

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeams() {
      try {
        const response = await fetch(apiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.results ?? [];
        setTeams(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load teams.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeams();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="card shadow-sm p-4">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-info text-dark">
        <h2 className="h4 mb-0">Teams</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Members</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {teams.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center text-muted py-4">No teams found.</td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team._id || team.name}>
                  <td>{team.name}</td>
                  <td>{team.members?.join(', ') || '—'}</td>
                  <td>{team.totalPoints}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
