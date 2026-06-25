import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export class SubscriptionLimitError extends AppError {
  readonly code = 'SUBSCRIPTION_LIMIT_REACHED';

  constructor(message = "You've reached your plan limit. Upgrade to continue.") {
    super(message, 403);
  }
}

export class RateLimitError extends AppError {
  readonly code = 'RATE_LIMIT_EXCEEDED';

  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export function jsonError(error: unknown) {
  if (error instanceof AppError) {
    const body: { error: string; code?: string } = { error: error.message };
    if (error instanceof SubscriptionLimitError) {
      body.code = error.code;
    }
    if (error instanceof RateLimitError) {
      body.code = error.code;
    }
    return NextResponse.json(body, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}
