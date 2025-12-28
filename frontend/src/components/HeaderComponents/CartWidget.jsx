import { Cart } from "@/assets/icons/svgs";
import { UserContext } from "@/Context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom"




export default function CartWidget({productsCount}) {
const { Token,setToken,userRole,setUserRole } = useContext(UserContext);
  const navigte = useNavigate();

  function navigateToCart(){
    navigte('/Cart');
  }

  return (
    userRole !==( 'ADMIN'||'EXECUTIVE') && (
    <button className="cursor-pointer w-[25px] h-[25px] sm:w-[35px] sm:h-[35px] md:w-[42px] md:h-[42px] bg-[#fff1ee] rounded-full flex items-center justify-center relative" onClick={navigateToCart}>
      <span className="absolute top-[-1px] right-0 bg-[#ea2b0f] text-white w-[10px] h-[10px] sm:w-[17px] sm:h-[17px] rounded-full flex items-center justify-center text-[6px] sm:text-[10px] font-normal">{productsCount}</span>
      <Cart className="relative w-[14px] h-[14px] sm:w-[20px] sm:h-[20px] text-red-500"/>
    </button>)
  )
}
