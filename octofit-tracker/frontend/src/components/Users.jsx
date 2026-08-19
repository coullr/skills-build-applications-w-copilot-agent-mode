import { useEffect, useState } from 'react';
import { buildApiUrl } from '../lib/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch(buildApiUrl('/api/users'), { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        const data = Array.isArray(payload) ? payload : Array.isArray(payload.data) ? payload.data : payload.results ?? [];
        setUsers(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Unable to load users.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();
    return () => controller.abort();
  }, []);

  if (loading) return <div className="card shadow-sm p-4">Loading users...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white">
        <h2 className="h4 mb-0">Users</h2>
      </div>
      <div className="table-responsive">
        <table className="table table-striped mb-0 align-middle">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id || user.username}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.team || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
