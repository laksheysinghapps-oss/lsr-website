import type { VercelRequest, VercelResponse } from '@vercel/node';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL!;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;
const FAST2SMS_KEY = process.env.FAST2SMS_API_KEY!;

const INDIAN_MOBILE = /^[6-9]\d{9}$/;

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

  const { phone } = req.body as { phone?: string };
  if (!phone || !INDIAN_MOBILE.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }

  // Rate limit: max 3 OTP sends per phone per 10 minutes
  const rlKey = `otp-rl:${phone}`;
  const { result: count } = await redisCmd(['INCR', rlKey]);
  if (count === 1) await redisCmd(['EXPIRE', rlKey, 600]);
  if ((count as number) > 3) {
    return res.status(429).json({ error: 'Too many attempts. Please try again in 10 minutes.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await redisCmd(['SET', `otp:${phone}`, otp, 'EX', 600]);

  const smsRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      authorization: FAST2SMS_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variables_values: otp,
      route: 'otp',
      numbers: phone,
    }),
  });

  const smsData = (await smsRes.json()) as { return: boolean; message?: string[] };
  if (!smsData.return) {
    return res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
  }

  return res.status(200).json({ success: true });
}
