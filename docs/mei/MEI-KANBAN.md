# MEI Execution Kanban

**MEI Section 21** · Five columns only.

Move BUILD-IDs as work progresses. One BUILD slice in **Building** at a time (solo dev).

| Backlog | Ready | Building | Testing | Complete |
|---------|-------|----------|---------|----------|
| BUILD-002+ | BUILD-001 when deps met | — | — | — |

**Rules:**

- **Ready:** dependencies complete, slice doc written, MRIDs listed
- **Building:** active Cursor session
- **Testing:** CI + manual QA per FCT-TEST-001
- **Complete:** merged, INDEX updated, MEI Section 3 % updated

See [BUILD-INDEX.md](BUILD-INDEX.md) for full slice list.
