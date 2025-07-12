// hooks/useStockData.js
import { useState, useEffect, useCallback } from "react";

const useStockData = () => {
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // --- ডামি ডেটা ---
        const fetchedProducts = [
          { id: "p1", name: "Laptop", stock: 50, price: 80000 },
          { id: "p2", name: "Mouse", stock: 200, price: 800 },
          { id: "p3", name: "Keyboard", stock: 150, price: 1500 },
          { id: "p4", name: "Monitor", stock: 30, price: 15000 },
        ];
        const fetchedSellers = [
          {
            id: "s1",
            name: "Rahim Enterprises",
            dues: 2500.0,
            phone: "01711223344",
          },
          {
            id: "s2",
            name: "Karim Traders",
            dues: 750.0,
            phone: "01811223344",
          },
          {
            id: "s3",
            name: "Digital Solutions",
            dues: 0.0,
            phone: "01911223344",
          },
        ];
        const fetchedTransactions = [
          {
            id: "t1",
            productId: "p1",
            productName: "Laptop",
            sellerId: "s1",
            sellerName: "Rahim Enterprises",
            amount: 160000,
            quantity: 2,
            date: "2025-05-10",
            dueAmount: 5000.0,
            type: "sale",
          },
          {
            id: "t2",
            productId: "p2",
            productName: "Mouse",
            sellerId: "s2",
            sellerName: "Karim Traders",
            amount: 8000,
            quantity: 10,
            date: "2025-06-05",
            dueAmount: 0.0,
            type: "sale",
          },
          {
            id: "t3",
            productId: "p1",
            productName: "Laptop",
            sellerId: "s1",
            sellerName: "Rahim Enterprises",
            amount: 80000,
            quantity: 1,
            date: "2025-06-20",
            dueAmount: 1000.0,
            type: "sale",
          },
          {
            id: "t4",
            productId: "p3",
            productName: "Keyboard",
            sellerId: "s3",
            sellerName: "Digital Solutions",
            amount: 3000,
            quantity: 2,
            date: "2025-07-12",
            dueAmount: 0.0,
            type: "sale",
          },
          {
            id: "t5",
            productId: "p4",
            productName: "Monitor",
            sellerId: "s2",
            sellerName: "Karim Traders",
            amount: 30000,
            quantity: 2,
            date: "2025-07-12",
            dueAmount: 1500.0,
            type: "sale",
          },
          {
            id: "t6",
            sellerId: "s1",
            sellerName: "Rahim Enterprises",
            amount: 2500.0,
            quantity: null,
            date: "2025-07-12",
            dueAmount: -2500.0,
            type: "payment",
            productName: "পেমেন্ট গ্রহণ",
          },
        ];
        // --- ডামি ডেটা শেষ ---

        await new Promise((resolve) => setTimeout(resolve, 500));

        setProducts(fetchedProducts);
        setSellers(fetchedSellers);
        setTransactions(fetchedTransactions);
      } catch (err) {
        console.error("ডেটা ফেচ করতে ব্যর্থ:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // addProduct ফাংশন
  const addProduct = useCallback(
    async (name, price, stock) => {
      try {
        // API কল লজিক (যদি থাকে)
        const newProduct = {
          id: `p${products.length + 1}`,
          name,
          price: parseFloat(price),
          stock: parseInt(stock),
        };
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        console.log("পণ্য সফলভাবে যোগ করা হয়েছে:", newProduct);
        return true;
      } catch (err) {
        console.error("পণ্য যোগ করতে ব্যর্থ:", err);
        setError(err);
        return false;
      }
    },
    [products]
  );

  // addSeller ফাংশন
  const addSeller = useCallback(
    async (name, phone) => {
      try {
        // API কল লজিক (যদি থাকে)
        const newSeller = {
          id: `s${sellers.length + 1}`,
          name,
          phone,
          dues: 0.0,
        };
        setSellers((prevSellers) => [...prevSellers, newSeller]);
        console.log("সেলার সফলভাবে যোগ করা হয়েছে:", newSeller);
        return true;
      } catch (err) {
        console.error("সেলার যোগ করতে ব্যর্থ:", err);
        setError(err);
        return false;
      }
    },
    [sellers]
  );

  return {
    products,
    sellers,
    transactions,
    isLoading,
    error,
    addProduct,
    addSeller,
  };
};

export default useStockData;
