import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {};

export default function handler(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  res.setHeader('cache-control', 'no-store, no-cache, must-revalidate');
  res.status(200).json({});
}
