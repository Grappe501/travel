import { describe, expect, it } from 'vitest';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from './auth';

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password1',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('requires matching passwords', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'password1',
      confirmPassword: 'password2',
    });
    expect(result.success).toBe(false);
  });

  it('accepts matching passwords', () => {
    const result = signupSchema.safeParse({
      email: 'user@example.com',
      password: 'password1',
      confirmPassword: 'password1',
    });
    expect(result.success).toBe(true);
  });
});

describe('forgotPasswordSchema', () => {
  it('requires a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'bad' }).success).toBe(false);
    expect(forgotPasswordSchema.safeParse({ email: 'a@b.co' }).success).toBe(true);
  });
});

describe('resetPasswordSchema', () => {
  it('requires matching passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'newpassword',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });
});
