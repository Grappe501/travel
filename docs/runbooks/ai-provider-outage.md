# AI Provider Outage Runbook

**OPS-RB-007** · Volume 16 · OPS-INC-P2

## Detection

* OpenAI status page degraded
* OCR failure rate > 50%
* ADM-AI alerts

## Customer impact

* Receipt capture still works (local save + queue)
* OCR delayed — manual entry available

## Procedure

1. Confirm outage via status.openai.com
2. Enable degraded mode messaging in app ("AI temporarily unavailable")
3. Queue OCR jobs — do not drop
4. Pause PRM canary deploys
5. Monitor queue depth
6. Resume processing when provider healthy — FIFO drain
7. Customer comms if outage > 2 hours

## Workaround

Users enter receipt fields manually; sync when online.
