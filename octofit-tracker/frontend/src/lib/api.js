export function buildApiUrl(path = '/') {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();

  if (codespaceName) {
    return `https://${codespaceName}-8000.app.github.dev${path}`;
  }

  return `http://localhost:8000${path}`;
}
