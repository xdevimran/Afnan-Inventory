// pages/reports.js
import React, { useState, useMemo } from "react";
import useStockData from "../hooks/useStockData";
import ChartComponent from "../components/ChartComponent"; // ধরে নিলাম এই কম্পোনেন্টটি আছে
import {
  FaChartLine,
  FaChartPie,
  FaChartBar,
  FaExclamationCircle,
  FaUser,
  FaUsers,
} from "react-icons/fa"; // প্রয়োজনীয় আইকন ইম্পোর্ট করুন

const Reports = () => {
  const { products, sellers, transactions, isLoading, error } = useStockData();
  const [selectedSellerId, setSelectedSellerId] = useState("all"); // 'all' মানে সকল সেলার

  // Filtered transactions based on selectedSellerId
  const filteredTransactions = useMemo(() => {
    if (selectedSellerId === "all") {
      return transactions;
    }
    return transactions.filter((t) => t.sellerId === selectedSellerId);
  }, [transactions, selectedSellerId]);

  // Data for Product Stock Distribution Chart (Pie Chart)
  // পণ্যভিত্তিক স্টক ডেটা, সেলার নির্বিশেষে একই থাকবে, তাই এটি ফিল্টার করা হচ্ছে না।
  const productStockData = useMemo(() => {
    const labels = products.map((p) => p.name);
    const data = products.map((p) => p.stock);
    const backgroundColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#E7E9ED",
      "#C9CBCF",
      "#7BC8F6",
      "#8A79F9",
    ];

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: backgroundColors
            .slice(0, labels.length)
            .map((color) => color + "90"),
          hoverBackgroundColor: backgroundColors.slice(0, labels.length),
          borderWidth: 0,
        },
      ],
    };
  }, [products]);

  // Data for Seller Dues Chart (Bar Chart)
  const sellerDuesData = useMemo(() => {
    // যদি একটি নির্দিষ্ট সেলার নির্বাচন করা হয়, তাহলে শুধু তার ডেটা দেখাও
    const currentSellers =
      selectedSellerId === "all"
        ? sellers
        : sellers.filter((s) => s.id === selectedSellerId);

    const labels = currentSellers.map((s) => s.name);
    const data = currentSellers.map((s) => s.dues);
    const backgroundColors = [
      "#FFCD56",
      "#4BC0C0",
      "#FF6384",
      "#36A2EB",
      "#9966FF",
    ];

    return {
      labels,
      datasets: [
        {
          label: "বকেয়া (টাকা)",
          data,
          backgroundColor: backgroundColors
            .slice(0, labels.length)
            .map((color) => color + "90"),
          borderColor: backgroundColors.slice(0, labels.length),
          borderWidth: 1,
        },
      ],
    };
  }, [sellers, selectedSellerId]); // selectedSellerId যোগ করা হয়েছে

  // Data for Monthly Sales Trend (Line Chart)
  const monthlySalesData = useMemo(() => {
    const salesByMonth = {};
    filteredTransactions.forEach((t) => {
      // filteredTransactions ব্যবহার করা হয়েছে
      if (t.type === "sale") {
        const date = new Date(t.date);
        const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M ফরম্যাট
        salesByMonth[`${date.getFullYear()}-${date.getMonth() + 1}`] =
          (salesByMonth[`${date.getFullYear()}-${date.getMonth() + 1}`] || 0) +
          t.amount;
      }
    });

    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => {
      // মাস-বছর ক্রম অনুসারে সাজানো
      const [yearA, monthA] = a.split("-").map(Number);
      const [yearB, monthB] = b.split("-").map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

    return {
      labels: sortedMonths.map((monthYear) => {
        const [year, month] = monthYear.split("-");
        const date = new Date(year, parseInt(month) - 1);
        return date.toLocaleString("bn-BD", {
          month: "short",
          year: "numeric",
        });
      }),
      datasets: [
        {
          label: "মোট বিক্রয় (টাকা)",
          data: sortedMonths.map(
            (month) =>
              salesByMonth[
                `${month.split("-")[0]}-${parseInt(month.split("-")[1])}`
              ]
          ),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.3)",
          tension: 0.4,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    };
  }, [filteredTransactions]); // filteredTransactions এখানে ডিপেন্ডেন্সি হিসেবে যোগ করা হয়েছে

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl text-gray-600">
        <FaChartLine className="mr-3 text-5xl animate-spin text-indigo-500" />{" "}
        রিপোর্ট লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl text-red-600">
        <FaExclamationCircle className="mr-3 text-5xl text-red-700" /> ডেটা লোড
        করতে সমস্যা হয়েছে: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gray-100 min-h-screen font-sans">
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between pb-4 border-b-2 border-gray-300">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4 md:mb-0 flex items-center">
          <FaChartLine className="mr-4 text-indigo-600 text-5xl" /> স্টক রিপোর্ট
          ও বিশ্লেষণ
        </h2>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 text-lg font-semibold px-4 py-2 bg-gray-200 rounded-full shadow-inner">
            আপডেট:{" "}
            {new Date().toLocaleDateString("bn-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <div className="relative">
            <label htmlFor="seller-select" className="sr-only">
              সেলার নির্বাচন করুন
            </label>
            <select
              id="seller-select"
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 cursor-pointer text-lg font-semibold"
              value={selectedSellerId}
              onChange={(e) => setSelectedSellerId(e.target.value)}
            >
              <option value="all">সকল সেলার</option>
              {sellers.map((seller) => (
                <option key={seller.id} value={seller.id}>
                  {seller.name}
                </option>
              ))}
            </select>
            <FaUser className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Product Stock Distribution Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaChartPie className="mr-3 text-pink-500" /> পণ্য স্টক বিতরণ (সকল
            পণ্যের জন্য)
          </h3>
          {products.length > 0 &&
          productStockData.datasets &&
          productStockData.datasets.length > 0 &&
          productStockData.datasets.some(
            (dataset) => dataset.data && dataset.data.some((d) => d > 0)
          ) ? (
            <div className="h-80">
              <ChartComponent
                type="pie"
                data={productStockData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        font: { size: 14, family: "sans-serif" },
                        color: "#555",
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed !== null) {
                            label +=
                              new Intl.NumberFormat("bn-BD", {
                                style: "decimal",
                              }).format(context.parsed) + " ইউনিট";
                          }
                          return label;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-lg flex flex-col items-center justify-center h-full">
              <FaExclamationCircle className="mb-3 text-yellow-500 text-4xl" />
              <span>কোনো স্টক ডেটা উপলব্ধ নেই।</span>
            </div>
          )}
        </div>

        {/* Seller Dues Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
            <FaChartBar className="mr-3 text-green-500" /> সেলারের বকেয়া অবস্থা
            {selectedSellerId !== "all" &&
              sellers.find((s) => s.id === selectedSellerId) && (
                <span className="ml-2 text-sm text-gray-500">
                  ({sellers.find((s) => s.id === selectedSellerId).name})
                </span>
              )}
          </h3>
          {sellerDuesData.labels.length > 0 &&
          sellerDuesData.datasets[0].data.some((d) => d !== 0) ? (
            <div className="h-80">
              <ChartComponent
                type="bar"
                data={sellerDuesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          let label = context.dataset.label || "";
                          if (label) {
                            label += ": ";
                          }
                          if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat("bn-BD", {
                              style: "currency",
                              currency: "BDT",
                            }).format(context.parsed.y);
                          }
                          return label;
                        },
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: "#555",
                        callback: function (value) {
                          return new Intl.NumberFormat("bn-BD", {
                            style: "currency",
                            currency: "BDT",
                          }).format(value);
                        },
                      },
                      grid: { color: "rgba(0,0,0,0.05)" },
                    },
                    x: {
                      ticks: { color: "#555" },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500 text-lg flex flex-col items-center justify-center h-full">
              <FaExclamationCircle className="mb-3 text-yellow-500 text-4xl" />
              <span>নির্বাচিত সেলারের কোনো বকেয়া ডেটা উপলব্ধ নেই।</span>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Sales Trend Chart (Full Width) */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center">
          <FaChartLine className="mr-3 text-blue-500" /> মাসিক বিক্রয়ের প্রবণতা
          {selectedSellerId !== "all" &&
            sellers.find((s) => s.id === selectedSellerId) && (
              <span className="ml-2 text-sm text-gray-500">
                ({sellers.find((s) => s.id === selectedSellerId).name})
              </span>
            )}
        </h3>
        {monthlySalesData.labels.length > 0 &&
        monthlySalesData.datasets[0].data.some((d) => d !== 0) ? (
          <div className="h-96">
            <ChartComponent
              type="line"
              data={monthlySalesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: { font: { size: 14, color: "#555" } },
                  },
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || "";
                        if (label) {
                          label += ": ";
                        }
                        if (context.parsed.y !== null) {
                          label += new Intl.NumberFormat("bn-BD", {
                            style: "currency",
                            currency: "BDT",
                          }).format(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: "#555", font: { size: 12 } },
                    grid: { color: "rgba(0,0,0,0.05)" },
                  },
                  y: {
                    ticks: {
                      color: "#555",
                      font: { size: 12 },
                      callback: function (value) {
                        return new Intl.NumberFormat("bn-BD", {
                          style: "currency",
                          currency: "BDT",
                        }).format(value);
                      },
                    },
                    grid: { color: "rgba(0,0,0,0.05)" },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 text-lg flex flex-col items-center justify-center h-full">
            <FaExclamationCircle className="mb-3 text-yellow-500 text-4xl" />
            <span>নির্বাচিত সেলারের কোনো বিক্রয়ের ডেটা উপলব্ধ নেই।</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
