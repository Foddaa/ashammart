import { createContext, useContext, useState } from 'react';

const CategorySidebarContext = createContext();

export const CategorySidebarProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <CategorySidebarContext.Provider
      value={{
        isSidebarOpen,
        selectedCategories,
        setSelectedCategories,
        openSidebar,
        closeSidebar,
        toggleSidebar,
      }}
    >
      {children}
    </CategorySidebarContext.Provider>
  );
};

export const useCategorySidebar = () => useContext(CategorySidebarContext);