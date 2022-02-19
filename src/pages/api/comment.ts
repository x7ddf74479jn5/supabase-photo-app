import { NextApiRequest, NextApiResponse } from 'next';

import { createComment, deleteComment, updateComment } from '@/usecases/comments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  if (method === 'POST') {
    const sendData = req.body.value;

    try {
      const data = await createComment(sendData);
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
    }
  }

  if (method === 'PUT') {
    const { id, body } = req.body.value;
    try {
      const data = await updateComment({ id, body });
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
    }
  }

  if (method === 'DELETE') {
    const id = req.body.commentId;

    try {
      const data = await deleteComment(id);
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(401).json({ error: error.message });
      }
    }
  }
}
