export function Wordmark({ className }: { className: string }) {
  return (
    <span className={`relative block ${className}`}>
      <img src="/brand/crue-wordmark-white.png" alt="CRUE" className="hidden h-full w-full object-contain dark:block" />
      <img src="/brand/crue-wordmark-black.png" alt="" className="h-full w-full object-contain dark:hidden" />
    </span>
  );
}
