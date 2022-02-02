import { NextApiRequest, NextApiResponse } from 'next';

import { setAuthCookie } from '@/usecases/authUser';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  setAuthCookie(req, res);
}
