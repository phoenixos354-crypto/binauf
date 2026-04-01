import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { pickTwoQuestions } from '@/lib/quiz';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });

  const questions = pickTwoQuestions().map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    category: q.category,
    // NOTE: 'correct' is intentionally NOT sent to client
  }));

  return res.status(200).json({ questions });
}
