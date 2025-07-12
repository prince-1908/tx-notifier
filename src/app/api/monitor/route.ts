import { NextRequest, NextResponse } from 'next/server';
import { checkTonTransactions } from '@/lib/tonService';
import { sendSMS } from '@/lib/smsService';

let isMonitoring = false;
let monitorInterval: NodeJS.Timeout | null = null;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const num = searchParams.get('num');
  const stop = searchParams.get('stop');

  if (stop === 'true') {
    if (monitorInterval) {
      clearInterval(monitorInterval);
      monitorInterval = null;
      isMonitoring = false;
      console.log('🛑 Monitoring stopped.');
    }
    return NextResponse.json({ status: 'Monitoring stopped' });
  }

  if (isMonitoring) {
    return NextResponse.json({ status: 'Monitoring already running' });
  }

  try {
    const tx = await checkTonTransactions(address);
    if (tx) await sendSMS(tx, num);
  } catch (err) {
    console.error('❌ Initial Monitor Error:', (err as Error).message);
    return NextResponse.json({ status: 'Something went wrong while initializing monitor' });
  }

  isMonitoring = true;
  console.log('🚀 Starting TON wallet monitoring...');

  monitorInterval = setInterval(async () => {
    try {
      const tx = await checkTonTransactions(address);
      if (tx) {
        console.log('✅ New Transaction:', tx);
        await sendSMS(tx, num);
      }
    } catch (err) {
      console.error('❌ Monitor Error:', err instanceof Error ? err.message : err);
    }
  }, 5000);

  return NextResponse.json({ status: 'Monitoring started' });
}
