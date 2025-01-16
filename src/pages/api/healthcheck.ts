import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  res.status(200).json({});
}
