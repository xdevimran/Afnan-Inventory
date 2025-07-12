import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBoxes,
  FaUsers,
  FaExchangeAlt,
  FaChartBar,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsSidebarOpen(false); // Close sidebar on route change for mobile
  }, [router.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">Inventory App</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 bg-gray-800 text-white p-6 w-64 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
        >
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400 hidden md:block">
            Inventory App
          </h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link href="/" passHref>
                  <p
                    className={`flex items-center text-lg hover:text-blue-300 transition duration-200 ${
                      router.pathname === "/"
                        ? "text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <FaHome className="mr-3" /> ড্যাশবোর্ড
                  </p>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/products" passHref>
                  <p
                    className={`flex items-center text-lg hover:text-blue-300 transition duration-200 ${
                      router.pathname === "/products"
                        ? "text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <FaBoxes className="mr-3" /> পণ্য
                  </p>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/sellers" passHref>
                  <p
                    className={`flex items-center text-lg hover:text-blue-300 transition duration-200 ${
                      router.pathname === "/sellers"
                        ? "text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <FaUsers className="mr-3" /> সেলার
                  </p>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/transactions" passHref>
                  <p
                    className={`flex items-center text-lg hover:text-blue-300 transition duration-200 ${
                      router.pathname === "/transactions"
                        ? "text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <FaExchangeAlt className="mr-3" /> লেনদেন
                  </p>
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/reports" passHref>
                  <p
                    className={`flex items-center text-lg hover:text-blue-300 transition duration-200 ${
                      router.pathname === "/reports"
                        ? "text-blue-400 font-semibold"
                        : ""
                    }`}
                  >
                    <FaChartBar className="mr-3" /> রিপোর্ট
                  </p>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
