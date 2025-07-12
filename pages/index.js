// pages/index.js
import React, { useMemo } from "react";
import useStockData from "../hooks/useStockData";
import ChartComponent from "../components/ChartComponent";
import { FaBoxes, FaUsers, FaMoneyBillWave, FaRupeeSign } from "react-icons/fa";

const Dashboard = () => {
  const { products, sellers, transactions, isLoading } = useStockData();

  // Data for Summary Cards - এই ক্যালকুলেশনগুলো isLoading এর উপর নির্ভর করে না
  // কারণ products, sellers, transactions useStockData থেকে আসছে এবং initial state এ খালি array থাকে।
  const totalProducts = products.length;
  const totalSellers = sellers.length;
  const totalDues = sellers.reduce((sum, seller) => sum + seller.dues, 0);

  // আজকের তারিখ স্থানীয় সময় অনুযায়ী সেট করা
  const today = new Date().toLocaleDateString("en-CA"); // 'en-CA' ensures YYYY-MM-DD format for consistent comparison
  const todaySales = transactions
    .filter((t) => new Date(t.date).toLocaleDateString("en-CA") === today)
    .reduce((sum, t) => sum + t.amount, 0);

  // Data for Charts - এই useMemo হুকগুলো isLoading চেক এর নিচে সরানোর দরকার নেই।
  // এগুলি তাদের নিজস্ব dependencies (transactions, products, sellers) উপর নির্ভর করে।
  // যখন isLoading true থাকে, তখন transactions/products/sellers খালি অ্যারে হবে,
  // এবং useMemo গুলো সে অনুযায়ী খালি ডেটা নিয়ে কাজ করবে, যা এরর সৃষ্টি করবে না।
  const salesByMonthData = useMemo(() => {
    const monthlySales = {};
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const monthYear = `${date.toLocaleString("bn-BD", {
        month: "short",
      })} ${date.getFullYear()}`;
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + t.amount;
    });

    const sortedMonths = Object.keys(monthlySales).sort((a, b) => {
      const monthMap = {
        জানু: 0,
        ফেব্রু: 1,
        মার্চ: 2,
        এপ্রি: 3,
        মে: 4,
        জুন: 5,
        জুলাই: 6,
        আগস্ট: 7,
        সেপ্টে: 8,
        অক্টো: 9,
        নভে: 10,
        ডিসে: 11,
      };
      const [monthAStr, yearA] = a.split(" ");
      const [monthBStr, yearB] = b.split(" ");
      const dateA = new Date(parseInt(yearA), monthMap[monthAStr]);
      const dateB = new Date(parseInt(yearB), monthMap[monthBStr]);
      return dateA - dateB;
    });

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "মাসিক বিক্রি",
          data: sortedMonths.map((month) => monthlySales[month]),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
      ],
    };
  }, [transactions]); // transactions লোড না হওয়া পর্যন্ত খালি থাকবে

  const topSellersData = useMemo(() => {
    const sellerSales = {};
    sellers.forEach((s) => (sellerSales[s.name] = 0));
    transactions.forEach((t) => {
      sellerSales[t.sellerName] = (sellerSales[t.sellerName] || 0) + t.amount;
    });

    const sortedSellers = Object.entries(sellerSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedSellers.map(([name]) => name),
      datasets: [
        {
          label: "বিক্রয় মূল্য",
          data: sortedSellers.map(([, amount]) => amount),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [transactions, sellers]); // transactions and sellers লোড না হওয়া পর্যন্ত খালি থাকবে

  const topProductsData = useMemo(() => {
    const productSales = {};
    products.forEach((p) => (productSales[p.name] = 0));
    transactions.forEach((t) => {
      productSales[t.productName] =
        (productSales[t.productName] || 0) + t.quantity;
    });

    const sortedProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      labels: sortedProducts.map(([name]) => name),
      datasets: [
        {
          label: "বিক্রিত পরিমাণ",
          data: sortedProducts.map(([, quantity]) => quantity),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          hoverBackgroundColor: [
            "rgba(255, 99, 132, 0.9)",
            "rgba(54, 162, 235, 0.9)",
            "rgba(255, 206, 86, 0.9)",
            "rgba(75, 192, 192, 0.9)",
            "rgba(153, 102, 255, 0.9)",
          ],
        },
      ],
    };
  }, [transactions, products]); // transactions and products লোড না হওয়া পর্যন্ত খালি থাকবে

  // এখন isLoading চেকটি UI রেন্ডারের ঠিক আগে হবে, কিন্তু কোনো হুককে শর্তসাপেক্ষে কল করবে না।
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        ডেটা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-8">ড্যাশবোর্ড</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaBoxes className="text-4xl text-blue-500" />
          <div>
            <p className="text-gray-600">মোট পণ্য</p>
            <p className="text-3xl font-bold text-gray-800">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaUsers className="text-4xl text-green-500" />
          <div>
            <p className="text-gray-600">মোট সেলার</p>
            <p className="text-3xl font-bold text-gray-800">{totalSellers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaMoneyBillWave className="text-4xl text-red-500" />
          <div>
            <p className="text-gray-600">মোট বকেয়া</p>
            <p className="text-3xl font-bold text-gray-800">
              {totalDues.toFixed(2)} টাকা
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
          <FaRupeeSign className="text-4xl text-purple-500" />
          <div>
            <p className="text-gray-600">আজকের বিক্রি</p>
            <p className="text-3xl font-bold text-gray-800">
              {todaySales.toFixed(2)} টাকা
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="line"
          data={salesByMonthData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top", labels: { color: "#333" } },
              title: { display: false },
            },
            scales: {
              x: {
                ticks: { color: "#555" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              y: {
                ticks: { color: "#555" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
            },
          }}
          title="মাসিক বিক্রির প্রবণতা"
        />
        <ChartComponent
          type="bar"
          data={topSellersData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              title: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#555" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
              x: {
                ticks: { color: "#555" },
                grid: { color: "rgba(0,0,0,0.05)" },
              },
            },
          }}
          title="শীর্ষ সেলার (বিক্রয় মূল্য অনুযায়ী)"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1">
        <ChartComponent
          type="pie"
          data={topProductsData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "right", labels: { color: "#333" } },
              title: { display: false },
            },
          }}
          title="শীর্ষ বিক্রীত পণ্য (পরিমাণ অনুযায়ী)"
        />
      </div>
    </div>
  );
};

export default Dashboard;
