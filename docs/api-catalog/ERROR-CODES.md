# API Error Code Registry

Canonical list for Volume 12 Ch. 29. Codes are **stable** — never repurpose.

| Code | HTTP | Module | User message (default) |
|------|------|--------|------------------------|
| AUTH_INVALID_CREDENTIALS | 401 | auth | Email or password is incorrect. |
| AUTH_EMAIL_NOT_VERIFIED | 403 | auth | Please verify your email before signing in. |
| AUTH_SESSION_EXPIRED | 401 | auth | Your session expired. Please sign in again. |
| AUTH_EMAIL_TAKEN | 409 | auth | An account with this email already exists. |
| AUTH_WEAK_PASSWORD | 422 | auth | Password must be at least 8 characters. |
| AUTH_TOKEN_EXPIRED | 400 | auth | This reset link has expired. Request a new one. |
| PERMISSION_DENIED | 403 | * | You don't have permission to do that. |
| NOT_FOUND | 404 | * | We couldn't find that record. |
| VALIDATION_FAILED | 422 | * | Please check the highlighted fields. |
| TRIP_ALREADY_ACTIVE | 409 | trip | End your current trip before starting a new one. |
| ODOMETER_INVALID | 422 | trip | Ending odometer must be greater than starting odometer. |
| ODOMETER_DECREASED | 422 | vehicle | Odometer reading cannot be lower than the last recorded value. |
| RECEIPT_TOO_LARGE | 413 | receipt | Receipt image must be under 10 MB. |
| RECEIPT_INVALID_TYPE | 422 | receipt | Please upload a JPEG, PNG, or PDF file. |
| OCR_FAILED | 422 | receipt | We couldn't read this receipt. Enter details manually. |
| OCR_RATE_LIMITED | 429 | receipt | Too many receipt scans. Try again later. |
| SUBSCRIPTION_LIMIT_REACHED | 403 | billing | You've reached your plan limit. Upgrade to continue. |
| REPORT_GENERATION_FAILED | 500 | report | Report generation failed. Please try again. |
| IDEMPOTENCY_CONFLICT | 409 | * | This request was already processed with different data. |
| RATE_LIMIT_EXCEEDED | 429 | * | Too many requests. Please wait and try again. |
| INTERNAL_ERROR | 500 | * | Something went wrong. Please try again. |

See [Volume 12](../blueprint/12-api-architecture.md) for full API specification.
