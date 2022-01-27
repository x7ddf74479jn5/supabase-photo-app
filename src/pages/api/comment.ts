import { NextApiRequest, NextApiResponse } from 'next';

import { createComment, deleteComment, updateComment } from '@/usecases/comments';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method;

  if (method === 'POST') {
    const sendData = req.body.value;
    const { data, error } = await createComment(sendData);

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (method === 'PUT') {
    const { id, body } = req.body.value;
    const { data, error } = await updateComment({ id, body });

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (method === 'DELETE') {
    const id = req.body.commentId;
    const { data, error } = await deleteComment({ id });

    if (error) return res.status(401).json({ error: error.message });
    return res.status(200).json(data);
  }
}
