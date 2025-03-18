export function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted animate-pulse">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-75"></div>
          <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}
