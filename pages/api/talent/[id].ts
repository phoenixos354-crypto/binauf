import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { adminDb } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.query as { id: string };
  const docRef = adminDb.collection('talents').doc(id);
  const snap = await docRef.get();

  if (!snap.exists) return res.status(404).json({ error: 'Talent tidak ditemukan' });

  const talent = snap.data()!;

  // Only owner can update/delete
  if (talent.userId !== session.user.email) {
    return res.status(403).json({ error: 'Bukan milikmu' });
  }

  if (req.method === 'PUT') {
    const updates = req.body;
    await docRef.update({ ...updates, updatedAt: new Date().toISOString() });
    return res.status(200).json({ id, ...talent, ...updates });
  }

  if (req.method === 'DELETE') {
    await docRef.delete();
    await adminDb.collection('users').doc(session.user.email).update({ talentId: null });
    return res.status(200).json({ deleted: true });
  }

  return res.status(405).end();
}
