import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

type Transaction = {
  hash: string;
  value: number;
  from: string;
  to: string;
};

export async function sendSMS(tx: Transaction, num: string | null) {
  console.log(process.env.TWILIO_PHONE, num)
   if (!process.env.TWILIO_PHONE || !num) {
    throw new Error('Twilio phone numbers not configured.');
  }
  
  await client.messages.create({
    body: `TON TX: ${tx.value} TON from ${tx.from} to ${tx.to}`,
    from: process.env.TWILIO_PHONE,
    to: num
  });
}
