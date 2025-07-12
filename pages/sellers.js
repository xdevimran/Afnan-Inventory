import React, { useState } from "react";
import useStockData from "../hooks/useStockData";
import {
  FaUserPlus,
  FaUsers,
  FaEdit,
  FaTrash,
  FaPhoneAlt,
  FaBuilding,
  FaDollarSign,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa"; // নতুন এবং উন্নত আইকন
import toast, { Toaster } from "react-hot-toast"; // react-hot-toast ইম্পোর্ট করা হয়েছে

// --- AddSellerForm Component ---
// নতুন সেলার যোগ করার ফর্ম
const AddSellerForm = ({ onAddSeller }) => {
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sellerName || !sellerPhone) {
      toast.error("অনুগ্রহ করে সেলারের নাম ও ফোন নম্বর পূরণ করুন।"); // হট টোস্ট নোটিফিকেশন
      return;
    }

    if (await onAddSeller(sellerName, sellerPhone)) {
      setSellerName("");
      setSellerPhone("");
      toast.success("সেলার সফলভাবে যুক্ত করা হয়েছে!"); // সফল নোটিফিকেশন
    } else {
      toast.error("সেলার যোগ করতে ব্যর্থ।"); // ব্যর্থ নোটিফিকেশন
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 transform hover:scale-105 transition-transform duration-300">
      <h3 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
        <FaUserPlus className="mr-3 text-indigo-600 text-3xl" /> নতুন সেলার যোগ
        করুন
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="sellerName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <FaBuilding className="inline-block mr-2 text-gray-500" /> সেলার নাম
          </label>
          <input
            type="text"
            id="sellerName"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder="যেমন: রহিম এন্টারপ্রাইজ"
            required
          />
        </div>
        <div>
          <label
            htmlFor="sellerPhone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            <FaPhoneAlt className="inline-block mr-2 text-gray-500" /> ফোন নম্বর
          </label>
          <input
            type="text"
            id="sellerPhone"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-gray-800 placeholder-gray-400"
            value={sellerPhone}
            onChange={(e) => setSellerPhone(e.target.value)}
            placeholder="যেমন: ০১৭০০০০০০০০"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          <FaUserPlus className="mr-2" /> সেলার যোগ করুন
        </button>
      </form>
    </div>
  );
};

// --- SellerListTable Component ---
// সেলারদের তালিকা দেখানোর টেবিল
const SellerListTable = ({ sellers }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              সেলার নাম
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              ফোন নম্বর
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              বকেয়া
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              অ্যাকশন
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sellers.length > 0 ? (
            sellers.map((seller) => (
              <tr
                key={seller.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {seller.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 flex items-center">
                    <FaPhoneAlt className="mr-2 text-blue-500 text-xs" />
                    {seller.phone || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                      seller.dues > 0
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    <FaDollarSign className="mr-1 mt-0.5" />
                    {seller.dues !== undefined
                      ? seller.dues.toFixed(2)
                      : "0.00"}{" "}
                    টাকা
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-150 flex items-center justify-center p-2 rounded-md hover:bg-indigo-50">
                    <FaEdit className="mr-1" /> এডিট
                  </button>
                  <button className="text-red-600 hover:text-red-900 transition-colors duration-150 flex items-center justify-center p-2 rounded-md hover:bg-red-50 mt-2 md:mt-0">
                    <FaTrash className="mr-1" /> ডিলিট
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="4"
                className="px-6 py-4 text-center text-gray-500 text-lg"
              >
                <FaExclamationCircle className="inline-block mr-2 text-yellow-500" />{" "}
                কোনো সেলার পাওয়া যায়নি।
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Main Sellers Page Component ---
const Sellers = () => {
  const { sellers, isLoading, error, addSeller } = useStockData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600 animate-pulse">
        <FaUsers className="mr-3 text-4xl" /> সেলার তালিকা লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        <FaExclamationCircle className="mr-3 text-4xl" /> সেলার লোড করতে সমস্যা
        হয়েছে: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen font-sans">
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* হট টোস্ট কন্টেইনার */}
      <div className="mb-10 flex items-center justify-between pb-4 border-b-2 border-indigo-200">
        <h2 className="text-4xl font-extrabold text-gray-800 flex items-center">
          <FaUsers className="mr-4 text-indigo-600 text-5xl" /> সেলার
          ব্যবস্থাপনা
        </h2>
        <div className="text-gray-700 text-xl font-semibold flex items-center px-4 py-2 bg-indigo-100 rounded-full shadow-inner">
          মোট সেলার:{" "}
          <span className="text-indigo-700 ml-2 text-2xl">
            {sellers.length}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ফর্মটি প্রথম কলামে থাকবে */}
        <div className="lg:col-span-1">
          <AddSellerForm onAddSeller={addSeller} />
        </div>

        {/* টেবিলটি বাকি দুটি কলাম জুড়ে থাকবে */}
        <div className="lg:col-span-2">
          <SellerListTable sellers={sellers} />
        </div>
      </div>
    </div>
  );
};

export default Sellers;
