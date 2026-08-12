import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import api from "@/api/axiosInstance";

const ITEMS_PER_PAGE = 10;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1, search = "") => {
    try {
      const params = new URLSearchParams({
        page: page,
        limit: ITEMS_PER_PAGE,
      });
      if (search) params.set("search", search);

      const res = await api.get(`/api/product/all?${params.toString()}`);
      const data = res.data;

      // Safely handle the response structure
      setProducts(Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : []));
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalPages(1);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/product/delete?id=${id}`);
      // Refresh the current page to show the updated list
      fetchProducts(currentPage, searchTerm);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    }
  };

  // Initial load
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, []);

  // When search changes, reset to page 1 and re-fetch
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, searchTerm);
  }, [searchTerm]);

  // When pagination changes, re-fetch
  useEffect(() => {
    fetchProducts(currentPage, searchTerm);
  }, [currentPage]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-10" dir="ltr">
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        
        {/* Header - Title Left, Search + Add Button Right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6 mb-6">
          
          {/* Left: Title */}
          <h2 className="text-xl font-light tracking-wide text-neutral-900">
            All Products
          </h2>

          {/* Right: Search Input + Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto md:justify-end">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 border-b border-neutral-300 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Primary Action: Add Product Button (Far Right) */}
            <Link
              to="/admin/products/add"
              className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap"
            >
              <span className="text-md leading-none font-light">+</span>
              Add Product
            </Link>
          </div>
        </div>

        {/* Table - responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">#</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Product Name</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Code</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Description</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {products.length > 0 ? (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-center font-mono">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-neutral-900">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <span className="inline-block border border-neutral-300 px-2.5 py-0.5 text-[10px] uppercase tracking-widest text-neutral-600">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left text-sm text-neutral-500 max-w-xs truncate" title={p.description}>
                      {p.description || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-start gap-3">
                      {/* Minimal Edit Button */}
                      <Link
                        to={`edit/${p.id}`}
                        className="inline-flex items-center gap-1.5 border border-neutral-900 px-4 py-1.5 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors duration-200 text-xs tracking-wider"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </Link>
                      
                      {/* Minimal Delete Button */}
                      <button
                        onClick={() => handleDelete(p.id)}
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
                  <td colSpan="5" className="px-6 py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-5xl font-light tracking-widest">✦</span>
                      <p className="text-lg font-light tracking-wide">No products found</p>
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
            Showing <span className="font-medium text-neutral-800">{products.length}</span> of <span className="font-medium text-neutral-800">{totalPages * ITEMS_PER_PAGE > 0 ? 'many' : '0'}</span> products
          </span>

          {/* Minimal Luxury Pagination */}
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
        </div>
      </div>
    </div>
  );
};

export default ProductList;