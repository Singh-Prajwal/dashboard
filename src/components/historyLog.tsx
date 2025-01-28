import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ITEMS_PER_PAGE = 8;

const HistoryLog: React.FC = () => {
  const { data } = useSelector((state: RootState) => state.inventory);
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the indices for slicing data
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // Sliced data for the current page
  const currentData = data.slice(startIndex, endIndex);

  // Total pages
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className=" w-100 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Make</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">MSRP</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, idx) => (
            <tr key={idx}>
              <td className="border p-2">{item.condition}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.product_type}</td>
              <td className="border p-2">${item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className=" ms-2 me-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default HistoryLog;
