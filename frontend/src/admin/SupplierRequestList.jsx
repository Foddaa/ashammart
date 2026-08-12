import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import Pagination from "@mui/material/Pagination";

const ITEMS_PER_PAGE = 10;

const SupplierRequestList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/api/admin/supplierRequest/all");
      const data = res.data;

      // Safe client-side filtering and pagination handling
      let supplierList = Array.isArray(data) ? data : [];
      if (searchTerm) {
        supplierList = supplierList.filter((sup) =>
          sup.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setSuppliers(supplierList);
      setTotalPages(Math.ceil(supplierList.length / ITEMS_PER_PAGE) || 1);
    } catch (error) {
      console.error("Error fetching supplier requests:", error);
      setSuppliers([]);
      setTotalPages(1);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this supplier request?");
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/supplierRequest/delete?id=${id}`);
      fetchSuppliers(); // refresh the list
    } catch (error) {
      console.error("Error deleting supplier request:", error);
      alert("Failed to delete supplier request.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // When search changes, reset to page 1 and re-fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchSuppliers();
  }, [searchTerm]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSuppliers = suppliers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-10" dir="ltr">
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        
        {/* Header - Title Left, Search Right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Supplier Requests
            </h2>
            <span className="px-2.5 py-0.5 bg-neutral-100 border border-neutral-200 text-[10px] uppercase tracking-wider text-neutral-600">
              Pending
            </span>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border-b border-neutral-300 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
              placeholder="Search by supplier name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table - responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">ID</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Supplier Name</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Company</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Email</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Phone</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {paginatedSuppliers.length > 0 ? (
                paginatedSuppliers.map((sup) => (
                  <tr key={sup.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-center font-mono">
                      {sup.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-neutral-900">
                      {sup.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-neutral-600">
                      {sup.company || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-neutral-600">
                      {sup.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-neutral-600">
                      {sup.phone || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-start gap-3">
                      
                      {/* Minimal Delete Button */}
                      <button
                        onClick={() => handleDelete(sup.id)}
                        className="inline-flex items-center gap-1.5 border border-red-400 px-4 py-1.5 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 text-xs tracking-wider"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-5xl font-light tracking-widest">✦</span>
                      <p className="text-lg font-light tracking-wide">No requests found</p>
                      {searchTerm && (
                        <p className="text-sm mt-1 opacity-70">
                          No results for "<span className="font-semibold text-neutral-600">{searchTerm}</span>"
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer - Minimal count + Pagination */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-500 gap-4">
          <span className="text-left">
            Showing <span className="font-medium text-neutral-800">{paginatedSuppliers.length}</span> of <span className="font-medium text-neutral-800">{suppliers.length}</span> requests
          </span>

          {/* Minimal Luxury Pagination */}
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#444',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  minWidth: '32px',
                  height: '32px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#000',
                  },
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: 'transparent',
                  borderBottom: '1.5px solid #1a1a1a',
                  borderRadius: '0px',
                  color: '#1a1a1a',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#1a1a1a',
                    color: '#1a1a1a',
                  },
                },
                '& .MuiPagination-ul': {
                  gap: '2px',
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierRequestList;