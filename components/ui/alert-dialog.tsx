export function AlertDialogCancel({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`px-3 py-1 rounded border text-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function AlertDialogAction({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      className={`px-3 py-1 rounded bg-red-600 text-white text-sm ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
