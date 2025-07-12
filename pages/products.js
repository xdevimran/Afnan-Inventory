// pages/products.js
import React, { useState } from "react";
import useStockData from "../hooks/useStockData";

const Products = () => {
  const { products, isLoading, error, addProduct } = useStockData(); // addProduct ফাংশনটি নিন

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        পণ্য তালিকা লোড হচ্ছে...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        পণ্য লোড করতে সমস্যা হয়েছে: {error.message}
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productName || !productPrice || !productStock) {
      alert("অনুগ্রহ করে সকল ঘর পূরণ করুন।");
      return;
    }

    // নিশ্চিত করুন addProduct ফাংশনটি উপলব্ধ
    if (typeof addProduct === "function") {
      if (await addProduct(productName, productPrice, productStock)) {
        setProductName("");
        setProductPrice("");
        setProductStock("");
      } else {
        alert("পণ্য যোগ করতে ব্যর্থ।");
      }
    } else {
      console.error("addProduct ফাংশনটি উপলব্ধ নয়।");
      alert("পণ্য যোগ করার ফাংশনটি পাওয়া যাচ্ছে না।");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        পণ্য ব্যবস্থাপনা
      </h2>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          নতুন পণ্য যোগ করুন
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              পণ্যের নাম
            </label>
            <input
              type="text"
              id="productName"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="productPrice"
              className="block text-sm font-medium text-gray-700"
            >
              মূল্য (টাকা)
            </label>
            <input
              type="number"
              id="productPrice"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label
              htmlFor="productStock"
              className="block text-sm font-medium text-gray-700"
            >
              স্টক পরিমাণ
            </label>
            <input
              type="number"
              id="productStock"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
              required
              min="0"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
          >
            পণ্য যোগ করুন
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                পণ্যের নাম
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                মূল্য
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                স্টক
              </th>
              {/* <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                অ্যাকশন
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200">
                    {product.name}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {product.price.toFixed(2)} টাকা
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {product.stock}
                  </td>
                  {/* <td className="py-3 px-4 border-b border-gray-200">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">এডিট</button>
                    <button className="text-red-600 hover:text-red-800">ডিলিট</button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  কোনো পণ্য পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
