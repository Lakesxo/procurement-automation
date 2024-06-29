import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fsPromises from "fs/promises";
import { PurchaseOrderDetails } from "@/types";

const dataFilePath = path.join(process.cwd(), "src/db/db.json");

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  const selectedOrder = objectData.data.find(
    (order: PurchaseOrderDetails) => order.purchase_order_id === req.query.id
  );
  res.status(200).json(selectedOrder);
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  const updatedData = objectData.data.map((order: PurchaseOrderDetails) => {
    if (order.purchase_order_id === req.query.id) {
      return { ...order, ...JSON.parse(req.body) };
    }
    return order;
  });
  await fsPromises.writeFile(
    dataFilePath,
    JSON.stringify({ data: updatedData })
  );
  res.status(200).json({ message: "Order updated successfully" });
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  const updatedData = objectData.data.filter(
    (order: PurchaseOrderDetails) => order.purchase_order_id !== req.query.id
  );
  console.log(dataFilePath);
  await fsPromises.writeFile(
    dataFilePath,
    JSON.stringify({ data: updatedData })
  );
  res.status(200).json({ message: "Order deleted successfully" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const method = req.method;

    if (method === "GET") {
      return handleGet(req, res);
    }

    if (method === "DELETE") {
      return handleDelete(req, res);
    }

    if (method === "PUT") {
      return handlePut(req, res);
    }
    return res.status(500).json({ message: "Invalid request method" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
