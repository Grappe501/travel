# Queue Recovery Runbook

**OPS-RB-006** · Volume 17 ADM-QUEUE · Volume 13 SM-SYNC

## Symptoms

* OCR queue depth > 200
* Sync jobs stuck in `processing`
* Report jobs timing out

## Procedure

1. Check ADM-QUEUE / Supabase job tables
2. Identify failed job IDs and error messages
3. Verify upstream (OpenAI, storage, DB connectivity)
4. Retry failed jobs **by ID** — idempotent only (Volume 12)
5. If systemic: pause new job intake via feature flag
6. Scale Edge Function concurrency if provider allows
7. Clear dead-letter queue after 7 days retention

## Do not

* Bulk retry without idempotency keys
* Delete jobs without audit log entry
