// pages/api/sendRawHtml.ts
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { previous, current } = req.body;

    // Mock server response
    if (previous && current) {
      res.status(200).json({ message: "Successfully received" });
    } else {
      res.status(400).json({ message: "Invalid data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
