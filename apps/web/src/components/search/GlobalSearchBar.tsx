export function GlobalSearchBar() {
  return (
    <form action="/search" method="get" className="mb-4">
      <label htmlFor="shell-search" className="sr-only">
        Search
      </label>
      <input
        id="shell-search"
        name="q"
        type="search"
        placeholder="Search trips, receipts, clients…"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-body text-foreground placeholder:text-muted focus-visible:border-primary focus-visible:outline-none"
      />
    </form>
  );
}
