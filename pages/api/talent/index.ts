import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { adminDb } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });

  // Must be active (passed quiz)
  const userSnap = await adminDb.collection('users').doc(session.user.email).get();
  const userData = userSnap.data();
  if (!userData || userData.status !== 'active') {
    return res.status(403).json({ error: 'Akses ditolak. Selesaikan kuis verifikasi terlebih dahulu.' });
  }

  // GET — list all talents
  if (req.method === 'GET') {
    const snap = await adminDb.collection('talents').orderBy('createdAt', 'desc').get();
    const talents = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ talents });
  }

  // POST — create talent profile
  if (req.method === 'POST') {
    const { name, wa, loc, cat, skills, bio, portfolio, status } = req.body;

    if (!name || !wa || !loc || !cat) {
      return res.status(400).json({ error: 'Field wajib belum diisi' });
    }

    // Check if user already has a talent profile
    if (userData.talentId) {
      return res.status(409).json({ error: 'Kamu sudah punya profil talent.' });
    }

    const newTalent = {
      userId: session.user.email,
      name,
      wa,
      email: session.user.email,
      photoURL: session.user.image || '',
      loc,
      cat,
      skills: skills || [],
      bio: bio || '',
      portfolio: portfolio || '',
      status: status || 'open',
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('talents').add(newTalent);

    // Link talent to user profile
    await adminDb.collection('users').doc(session.user.email).update({ talentId: docRef.id });

    return res.status(201).json({ id: docRef.id, ...newTalent });
  }

  return res.status(405).end();
}
