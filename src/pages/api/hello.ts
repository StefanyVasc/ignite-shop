import { NextApiRequest, NextApiResponse } from 'next';

// localhost:3000/api/hello
export default function handler(req: NextApiRequest, res: NextApiResponse){
  return res.json({ message: 'Hello World'})
}