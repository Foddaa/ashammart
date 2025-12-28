import { useEffect, useContext } from "react";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense } from "react";

import { UserContext } from "@/Context/AuthContext";
import SkeletonLoader from "@/components/skeletonLoading/SkeletonLoader";
import ScrollToTop from "@/components/ScrollToTop";
import "react-toastify/dist/ReactToastify.css";
import {
  Home, Shop, SearchResults, Cart, Checkout, ProductDetails
} from "@components/lazyload/index";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
import AboutUs from "@/pages/AboutUs";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";
import Error from "@/pages/Error";
import MainLayout from "@/UI/MainLayout";
import Register from "@/pages/Register";
import Login from "@/pages/Login";

import AdminDashboard from "@/admin/AdminDashboard";
import ProductList from "@/admin/ProductList";
import CategoryList from "@/admin/CategoryList";
import AddCategory from "@/admin/AddCategory";
import AddProduct from "@/admin/AddProduct";
import EditProduct from "@/admin/EditProduct";
import EditCategory from "@/admin/EditCategory";
import OrderReview from "@/pages/OrderReview";
import AddSupplier from "@/admin/AddSupplier";
import EditSupplier from "@/admin/EditSupplier";
import SupplierList from "@/admin/SupplierList";
import ExecutiveOrdersPage from "@/executive/ExecutiveOrdersPage";
import AddReviewPage from "@/pages/AddReviewPage";
import SupplierRequestForm from "@/pages/SupplierRequestForm";
import PrivacyRules from "@/pages/privacyRules";
import DileveryRules from "@/pages/DileveryRules";
import ReturningAndReplacing from "@/pages/ReturningAndReplacing";
import WhoAreWe from "@/pages/WhoAreWe";
import PaymentMethods from "@/pages/PaymentMethod";
import SupplierRequestList from "@/admin/SupplierRequestList";
import UserProfilePage from "@/pages/UserProfilePage";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'contact', element: <Contact /> },
      { path: 'blog', element: <Blog /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'shop', element: <Shop /> },
      { path: 'shop/:categoryId', element: <Shop /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'search', element: <SearchResults /> },
      { path: 'cart', element: <Cart /> },
      { path:'/review-order' ,element:<OrderReview />},
      { path:'/addReview/:id' ,element:<AddReviewPage />},
      { path:'/supplierRequest' ,element:<SupplierRequestForm/>},
      { path:'/privacyRules' ,element:<PrivacyRules/>},
      { path:'/dileveryRules' ,element:<DileveryRules/>},
      { path:'/returningAndreplacing' ,element:<ReturningAndReplacing/>},
      { path:'/whoAreWe' ,element:<WhoAreWe/>},
      { path:'/paymentMethods' ,element:<PaymentMethods/>},
      { path:"/profile" ,element:<UserProfilePage /> },







{
  path: '/admin',
  element: <AdminDashboard />,
  children: [
    { path: 'products', element: <ProductList /> },
    { path: 'products/add', element: <AddProduct /> },
    { path: 'products/edit/:id', element: <EditProduct /> },
    { path: 'categories', element: <CategoryList /> },
    { path: 'categories/add', element: <AddCategory /> },
    { path: 'categories/edit/:id', element: <EditCategory /> },
    { path: 'supplier/add', element: <AddSupplier /> },
    { path: 'supplier/edit/:id', element: <EditSupplier /> },
    { path: 'suppliers', element: <SupplierList /> },
    { path: 'supplierRequests', element: <SupplierRequestList /> },

  ]
},
{path: '/executive',
  element: <ExecutiveOrdersPage />,
  children: [
    
  ]
}
    ],
  },

  { path: 'login', element: <Login /> },
  { path: 'register', element: <Register /> },
  { path: '/admin/*', element: <AdminDashboard /> },
  { path: '/edit/:id', element: <EditProduct /> },
  { path: '/prouctlist', element: <ProductList /> }
]);

export default function AppRouter() {
  const { setUserRole } = useContext(UserContext); // from context

  useEffect(() => {
    // Clean up app state or memory
    sessionStorage.clear();

    // Load token and fetch user
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BASE_URL}/api/client`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error("Invalid token");
          return res.json();
        })
        .catch(() => {
          localStorage.removeItem("token");
        });
    } else {
      setUserRole(null); // no token at all
    }
  }, []);

  return (
    <Suspense fallback={<SkeletonLoader />}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={2000} />
    </Suspense>
  );
}
