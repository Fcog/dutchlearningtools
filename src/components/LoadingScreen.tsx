interface Props {
  error?: string | null;
}

export function LoadingScreen({ error }: Props) {
  return (
    <div className="loading-screen">
      {error ? (
        <>
          <p className="loading-error">⚠️ {error}</p>
          <button className="loading-retry" onClick={() => window.location.reload()}>
            Retry
          </button>
        </>
      ) : (
        <div className="loading-spinner" aria-label="Loading…" />
      )}
    </div>
  );
}
