export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="glass-card space-y-3 p-6 text-center">
      <p className="font-semibold text-red-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="brand-button px-5 py-2 text-sm font-semibold">
          Try Again
        </button>
      )}
    </div>
  );
}