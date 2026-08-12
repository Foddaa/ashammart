import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { Link } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const ITEMS_PER_PAGE = 10;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCategories = async (page = 1, search = "") => {
    try {
      // *Note: If your backend supports pagination for categories, uncomment the params below.
      // const params = new URLSearchParams({ page, limit: ITEMS_PER_PAGE });
      // if (search) params.set("search", search);
      // const res = await api.get(`/api/admin/category/all?${params.toString()}`);

      const res = await api.get("/api/admin/category/all");
      const data = res.data;
      
      // Safe client-side filtering and pagination handling
      let categoryList = Array.isArray(data) ? data : [];
      if (search) {
        categoryList = categoryList.filter((cat) =>
          cat.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setCategories(categoryList);
      setTotalPages(Math.ceil(categoryList.length / ITEMS_PER_PAGE) || 1);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setTotalPages(1);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    try {
      await api.delete(`/api/admin/category/delete?id=${id}`);
      fetchCategories(currentPage, searchTerm); // refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Failed to delete category. It might be linked to products.");
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm);
  }, []);

  // Handle search reset
  useEffect(() => {
    setCurrentPage(1);
    fetchCategories(1, searchTerm);
  }, [searchTerm]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Note: Since client-side filtering is applied above, no new fetch is required here 
    // unless your backend supports server-side category pagination.
  };

  // Calculate the items to display for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-10" dir="ltr">
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        
        {/* Header - Title Left, Search + Add Category Button Right */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6 mb-6">
          
          <h2 className="text-xl font-light tracking-wide text-neutral-900">
            All Categories
          </h2>

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
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Add Category Button */}
            <Link
              to="/admin/categories/add"
              className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-2.5 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Category
            </Link>
          </div>
        </div>

        {/* Table - responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">ID</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Category Name</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-center font-mono">
                      {cat.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-neutral-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-start gap-3">
                      
                      {/* Minimal Edit Button */}
                      <Link
                        to={`/admin/categories/edit/${cat.id}`}
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
                        onClick={() => handleDelete(cat.id)}
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
                  <td colSpan="3" className="px-6 py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-5xl font-light tracking-widest">✦</span>
                      <p className="text-lg font-light tracking-wide">No categories found</p>
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
            Showing <span className="font-medium text-neutral-800">{paginatedCategories.length}</span> of <span className="font-medium text-neutral-800">{categories.length}</span> categories
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

export default CategoryList;