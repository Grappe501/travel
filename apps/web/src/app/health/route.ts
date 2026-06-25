import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'mileage-expense-copilot',
    slice: 'MEC-V1-S001',
  });
}
