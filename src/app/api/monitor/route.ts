import { NextRequest, NextResponse } from 'next/server';
import { checkTonTransactions } from '@/lib/tonService';
import { sendSMS } from '@/lib/smsService';

let isMonitoring = false;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const num = searchParams.get('num');

  try {
    const tx = await checkTonTransactions(address);
    if(tx) await sendSMS(tx, num);
  } catch (err) {
    console.error('❌ Initial Monitor Error:', (err as Error).message);
    return NextResponse.json({ status: 'Something went wrong while initializing monitor' });
  }

  if (!isMonitoring) {
    isMonitoring = true;
    console.log('Starting TON wallet monitoring...');

    setInterval(async () => {
      try {
        const tx = await checkTonTransactions(address);
        if (tx) {
          console.log('✅ New Transaction:', tx);
          await sendSMS(tx, num);
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error('❌ Monitor Error:', err.message);
        } else {
          console.error('❌ Monitor Error:', err);
        }
      }

    }, 5000);
  }

  return NextResponse.json({ status: 'Monitoring started' });
}
