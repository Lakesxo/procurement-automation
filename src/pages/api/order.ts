import { NextApiRequest, NextApiResponse } from "next";
import fsPromises from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/db/db.json");

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  objectData.data.push(JSON.parse(req.body));
  await fsPromises.writeFile(dataFilePath, JSON.stringify(objectData));
  res.status(201).json({ message: "Order created successfully" });
};

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  res.status(200).json({ orders: objectData.data });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const method = req.method;
    if (method === "POST") {
      return handlePost(req, res);
    }

    if (method === "GET") {
      return handleGet(req, res);
    }
    return res.status(500).json({ message: "Invalid request method" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
