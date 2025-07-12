// pages/transactions.js
import React, { useState } from "react";
import useStockData from "../hooks/useStockData";
import {
  FaExchangeAlt,
  FaSearch,
  FaFilter,
  FaShoppingCart,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaBox,
  FaUserCircle,
  FaDollarSign,
  FaCreditCard,
  FaExclamationCircle,
} from "react-icons/fa"; // নতুন আইকন ইম্পোর্ট করা হয়েছে

const Transactions = () => {
  const { transactions, isLoading, error } = useStockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'sale', 'payment'

  // ডেটা লোডিং স্টেট হ্যান্ডেল করুন
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 animate-pulse">
        <FaExchangeAlt className="mr-3 text-4xl text-blue-500" /> লেনদেনের ডেটা
        লোড হচ্ছে...
      </div>
    );
  }

  // এরর স্টেট হ্যান্ডেল করুন
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        <FaExclamationCircle className="mr-3 text-4xl" /> ডেটা লোড করতে সমস্যা
        হয়েছে: {error.message}
      </div>
    );
  }

  const filteredTransactions = transactions.filter((t) => {
    const productName = t.productName ? t.productName.toLowerCase() : "";
    const sellerName = t.sellerName ? t.sellerName.toLowerCase() : "";
    const date = t.date ? t.date.toLowerCase() : "";
    const type = t.type ? t.type.toLowerCase() : "";

    const matchesSearch =
      productName.includes(searchTerm.toLowerCase()) ||
      sellerName.includes(searchTerm.toLowerCase()) ||
      date.includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === "all" || type === filterType; // সরাসরি type এর সাথে filterType মিলিয়ে চেক করা

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen font-sans">
      <div className="mb-10 flex items-center justify-between pb-4 border-b-2 border-indigo-200">
        <h2 className="text-4xl font-extrabold text-gray-800 flex items-center">
          <FaExchangeAlt className="mr-4 text-indigo-600 text-5xl" /> সকল লেনদেন
        </h2>
        <div className="text-gray-700 text-xl font-semibold flex items-center px-4 py-2 bg-indigo-100 rounded-full shadow-inner">
          মোট লেনদেন:{" "}
          <span className="text-indigo-700 ml-2 text-2xl">
            {filteredTransactions.length}
          </span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-center space-y-5 md:space-y-0 md:space-x-6">
        <div className="relative w-full md:w-2/5">
          <input
            type="text"
            placeholder="পণ্য, সেলার বা তারিখ দিয়ে খুঁজুন..."
            className="pl-12 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-gray-800 placeholder-gray-500 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
        </div>

        <div className="flex space-x-3 w-full md:w-auto justify-center">
          <button
            className={`flex items-center px-5 py-3 rounded-full text-white font-semibold transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md ${
              filterType === "all"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
            onClick={() => setFilterType("all")}
          >
            <FaFilter className="mr-2" /> সকল
          </button>
          <button
            className={`flex items-center px-5 py-3 rounded-full text-white font-semibold transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md ${
              filterType === "sale"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-400 hover:bg-green-500"
            }`}
            onClick={() => setFilterType("sale")}
          >
            <FaShoppingCart className="mr-2" /> বিক্রয়
          </button>
          <button
            className={`flex items-center px-5 py-3 rounded-full text-white font-semibold transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md ${
              filterType === "payment"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-purple-400 hover:bg-purple-500"
            }`}
            onClick={() => setFilterType("payment")}
          >
            <FaMoneyBillWave className="mr-2" /> পেমেন্ট
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <FaCalendarAlt className="inline-block mr-2 text-gray-500" />{" "}
                তারিখ
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <FaBox className="inline-block mr-2 text-gray-500" />{" "}
                পণ্য/পরিষেবা
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <FaUserCircle className="inline-block mr-2 text-gray-500" />{" "}
                সেলার/গ্রাহক
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                পরিমাণ
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <FaDollarSign className="inline-block mr-2 text-gray-500" />{" "}
                মূল্য
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <FaCreditCard className="inline-block mr-2 text-gray-500" />{" "}
                বকেয়া
              </th>
              <th className="py-3 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">
                    {t.date}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">
                    {t.productName}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">
                    {t.sellerName}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">
                    {t.quantity !== undefined && t.quantity !== null
                      ? t.quantity
                      : "-"}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-800">
                    <span className="font-semibold">
                      {t.amount !== undefined && typeof t.amount === "number"
                        ? t.amount.toFixed(2)
                        : "0.00"}
                    </span>{" "}
                    টাকা
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        t.dueAmount > 0
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {t.dueAmount !== undefined &&
                      typeof t.dueAmount === "number"
                        ? t.dueAmount.toFixed(2)
                        : "0.00"}{" "}
                      টাকা
                    </span>
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-sm font-medium">
                    {t.type === "sale" && t.dueAmount > 0 && (
                      <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                        <FaCreditCard className="inline-block mr-2" /> পেমেন্ট
                        করুন
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-6 text-center text-gray-500 text-lg"
                >
                  <FaExclamationCircle className="inline-block mr-2 text-yellow-500" />{" "}
                  কোনো লেনদেন পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
