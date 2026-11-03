export function Wordmark({ className, onDark = false }: { className: string; onDark?: boolean }) {
  return (
    <span className={`relative block ${className}`}>
      <img
        src="/brand/crue-wordmark-white.png"
        alt="CRUE"
        className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ease-out ${onDark ? "opacity-100" : "opacity-0 dark:opacity-100"}`}
      />
      <img
        src="/brand/crue-wordmark-black.png"
        alt=""
        className={`h-full w-full object-contain transition-opacity duration-300 ease-out ${onDark ? "opacity-0" : "opacity-100 dark:opacity-0"}`}
      />
    </span>
  );
}
