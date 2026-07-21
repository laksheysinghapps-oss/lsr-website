import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

async function redisCmd(command: (string | number)[]): Promise<{ result: string | number | null }> {
  const res = await fetch(UPSTASH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, otp } = req.body as { phone?: string; otp?: string };
  if (!phone || !otp || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const { result: stored } = await redisCmd(['GET', `otp:${phone}`]);
  if (!stored) {
    return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
  }
  if (stored !== otp) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  await redisCmd(['DEL', `otp:${phone}`]);
  return res.status(200).json({ success: true });
}
