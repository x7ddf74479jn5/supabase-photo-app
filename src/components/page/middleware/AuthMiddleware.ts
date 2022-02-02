/* eslint-disable @next/next/no-server-import-in-page */
import type { NextApiRequest } from 'next';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getUserByCooke } from '@/usecases/authUser';

export const authMiddleWare = async (req: NextRequest & NextApiRequest) => {
  const { user } = await getUserByCooke(req);

  if (!user) {
    return NextResponse.redirect('/', 307);
  }
};
