# Storage Failure Runbook

**OPS-RB-008** · OPS-INF-STO

## Symptoms

* Receipt upload 5xx
* Signed URL generation fails
* Storage quota exceeded

## Procedure

1. Check Supabase Storage dashboard — quota, error rate
2. If quota: emergency cleanup of temp files (OPS-JOB-001) or tier upgrade
3. If outage: status page; enable offline capture only
4. Verify RLS policies on `receipts` bucket unchanged
5. Re-upload failed blobs from client IndexedDB queue when restored

## Data integrity

Never delete production blobs without backup verification and audit.
