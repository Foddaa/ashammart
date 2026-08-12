import { useCategorySidebar } from "@/context/CategorySidebarContext";
import Sidebar from "@/pages/Sidebar"; // Adjust path to your Sidebar

export default function GlobalSidebar() {
  const { isSidebarOpen, selectedCategories, setSelectedCategories, closeSidebar } =
    useCategorySidebar();

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dimming Overlay */}
      <div
        className={`pointer-events-auto fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ visibility: isSidebarOpen ? "visible" : "hidden" }}
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <div
        className={`pointer-events-auto fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto">
          <Sidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            onClose={closeSidebar}
          />
        </div>
      </div>
    </div>
  );
}