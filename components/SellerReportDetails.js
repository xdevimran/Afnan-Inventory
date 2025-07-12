import React from "react";
import { FaUserCircle, FaMoneyBillWave } from "react-icons/fa";

const SellerReportDetails = ({ seller, transactions, recordPayment }) => {
  if (!seller)
    return (
      <p className="text-center text-gray-500">
        কোনো সেলার নির্বাচন করা হয়নি।
      </p>
    );

  const totalAmountGiven = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalDue = transactions.reduce((sum, t) => sum + t.dueAmount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="flex items-center mb-6 border-b pb-4">
        <FaUserCircle className="text-6xl text-blue-500 mr-4" />
        <div>
          <h3 className="text-3xl font-bold text-gray-800">{seller.name}</h3>
          <p className="text-gray-600">{seller.phone || "ফোন নম্বর নেই"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg flex items-center shadow-sm">
          <FaMoneyBillWave className="text-3xl text-green-600 mr-3" />
          <div>
            <p className="text-lg text-gray-700">মোট মাল নিয়েছে:</p>
            <p className="text-2xl font-bold text-green-700">
              {totalAmountGiven.toFixed(2)} টাকা
            </p>
          </div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg flex items-center shadow-sm">
          <FaMoneyBillWave className="text-3xl text-red-600 mr-3" />
          <div>
            <p className="text-lg text-gray-700">বর্তমান বকেয়া:</p>
            <p className="text-2xl font-bold text-red-700">
              {totalDue.toFixed(2)} টাকা
            </p>
          </div>
        </div>
      </div>

      <h4 className="text-2xl font-semibold text-gray-700 mb-4">
        বিস্তারিত লেনদেন:
      </h4>
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">এই সেলারের কোনো লেনদেন নেই।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {" "}
                {/* Adjusted text-gray-600 to text-gray-700 */}
                <th className="py-3 px-4 border-b border-gray-200">পণ্য</th>
                <th className="py-3 px-4 border-b border-gray-200">পরিমাণ</th>
                <th className="py-3 px-4 border-b border-gray-200">মূল্য</th>
                <th className="py-3 px-4 border-b border-gray-200">তারিখ</th>
                <th className="py-3 px-4 border-b border-gray-200">বকেয়া</th>
                <th className="py-3 px-4 border-b border-gray-200">পেমেন্ট</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                    {t.productName}
                  </td>{" "}
                  {/* Ensured text is visible */}
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                    {t.quantity} পিস
                  </td>{" "}
                  {/* Ensured text is visible */}
                  <td className="py-3 px-4 border-b border-gray-200 text-gray-800">
                    {t.amount.toFixed(2)} টাকা
                  </td>{" "}
                  {/* Ensured text is visible */}
                  <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-600">
                    {t.date}
                  </td>{" "}
                  {/* Slightly darker text-gray-500 to text-gray-600 */}
                  <td className="py-3 px-4 border-b border-gray-200 text-red-600 font-bold">
                    {t.dueAmount.toFixed(2)} টাকা
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200">
                    {t.dueAmount > 0 && (
                      <button
                        onClick={() => {
                          const paymentAmountStr = prompt(
                            `কত টাকা পেমেন্ট নিবেন? (সর্বোচ্চ: ${t.dueAmount.toFixed(
                              2
                            )} টাকা)`
                          );
                          const paymentAmount = parseFloat(paymentAmountStr);
                          if (!isNaN(paymentAmount) && paymentAmount > 0) {
                            recordPayment(t.id, paymentAmount);
                          } else {
                            alert("বৈধ পেমেন্ট পরিমাণ লিখুন।");
                          }
                        }}
                        className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600 transition duration-300"
                      >
                        পেমেন্ট নিন
                      </button>
                    )}
                    {t.dueAmount <= 0 && (
                      <span className="text-green-600 font-semibold text-sm">
                        পরিশোধিত
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerReportDetails;
