import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { adminDb } from '@/lib/firebase-admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: 'Unauthorized' });

  const userSnap = await adminDb.collection('users').doc(session.user.email).get();
  if (!userSnap.exists || userSnap.data()?.status !== 'active') {
    return res.status(403).json({ error: 'Akses ditolak.' });
  }

  if (req.method === 'GET') {
    const snap = await adminDb.collection('projects').orderBy('createdAt', 'desc').get();
    const projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ projects });
  }

  if (req.method === 'POST') {
    const { title, type, desc, budget, wa } = req.body;
    if (!title || !type) return res.status(400).json({ error: 'Judul dan jenis wajib diisi' });

    const project = {
      userId: session.user.email,
      postedBy: session.user.name || session.user.email,
      title, type,
      desc: desc || '',
      budget: budget || '',
      wa: wa || '',
      createdAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('projects').add(project);
    return res.status(201).json({ id: docRef.id, ...project });
  }

  return res.status(405).end();
}
