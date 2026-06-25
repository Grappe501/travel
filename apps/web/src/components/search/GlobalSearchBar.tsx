export function GlobalSearchBar() {
  return (
    <form action="/search" method="get" className="mb-5">
      <label htmlFor="shell-search" className="sr-only">
        Search
      </label>
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          aria-hidden
        >
          🔍
        </span>
        <input
          id="shell-search"
          name="q"
          type="search"
          placeholder="Search trips, receipts, clients…"
          className="input-field pl-10"
        />
      </div>
    </form>
  );
}
