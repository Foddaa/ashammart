import { useDispatch, useSelector } from "react-redux";
import NavBar from "./NavBar";
import { useEffect } from "react";
import { fetchGateoryProducts } from "@/store/categorySlice/categorySlices";
import { useLocation } from "react-router-dom";

export default function HeaderSection2() {
  const { items } = useSelector(state => state.categoryProducts);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchGateoryProducts());
  }, [dispatch]);

  const isShoppingCartOrCheckout =
    location.pathname === "/cart" || location.pathname === "/checkout";

  return (
    <>
      {!isShoppingCartOrCheckout && (
        <header className="w-full px-4 py-3 bg-white shadow-sm">
          <div className="container mx-auto flex flex-wrap justify-center items-center gap-4">
            <NavBar />
          </div>
        </header>
      )}
    </>
  );
}
