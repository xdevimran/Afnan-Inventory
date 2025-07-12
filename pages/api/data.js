import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data.json"); // রুট ফোল্ডারে data.json তৈরি হবে

// ডেটা লোড করার ফাংশন
function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // ফাইল না থাকলে একটি খালি ডেটা স্ট্রাকচার রিটার্ন করুন
      return { products: [], sellers: [], transactions: [] };
    }
    console.error("Error reading data file:", error);
    return { products: [], sellers: [], transactions: [] }; // ত্রুটি হলেও খালি ডেটা রিটার্ন
  }
}

// ডেটা সেভ করার ফাংশন
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export default function handler(req, res) {
  if (req.method === "GET") {
    // ডেটা পড়ার অনুরোধ
    const data = readData();
    res.status(200).json(data);
  } else if (req.method === "POST") {
    // ডেটা আপডেট করার অনুরোধ
    const { products, sellers, transactions } = req.body;
    const currentData = readData();

    const newData = {
      products: products !== undefined ? products : currentData.products,
      sellers: sellers !== undefined ? sellers : currentData.sellers,
      transactions:
        transactions !== undefined ? transactions : currentData.transactions,
    };

    try {
      writeData(newData);
      res.status(200).json({ message: "Data updated successfully!" });
    } catch (error) {
      console.error("Error writing data file:", error);
      res.status(500).json({ message: "Failed to update data." });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
