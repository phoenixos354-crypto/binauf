import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { adminDb } from '@/lib/firebase-admin';
import { QUIZ_POOL } from '@/lib/quiz';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });

  const { answers } = req.body as { answers: { id: string; chosen: number }[] };
  if (!Array.isArray(answers) || answers.length < 2) {
    return res.status(400).json({ error: 'Jawaban tidak lengkap' });
  }

  // Validate answers against quiz pool
  let correct = 0;
  for (const ans of answers) {
    const question = QUIZ_POOL.find(q => q.id === ans.id);
    if (question && question.correct === ans.chosen) correct++;
  }

  const passed = correct === answers.length; // must answer ALL correctly

  const userRef = adminDb.collection('users').doc(session.user.email);

  if (passed) {
    await userRef.update({
      status: 'active',
      quizPassedAt: new Date().toISOString(),
    });
    return res.status(200).json({ passed: true, message: 'Alhamdulillah, jawaban kamu benar semua!' });
  } else {
    return res.status(200).json({
      passed: false,
      correct,
      total: answers.length,
      message: `${correct} dari ${answers.length} jawaban benar. Pelajari lagi 29 Karakter Luhur LDII ya.`,
    });
  }
}
