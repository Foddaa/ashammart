import { RightArrow } from "@/assets/icons/svgs";
import { useNavigate } from "react-router-dom";

export default function ViewAll() {
    const navigate = useNavigate();

  return (
    <div
      className="flex w-full sm:w-auto mt-2 justify-center items-center text-center gap-2
                 overflow-hidden border-2 border-gray-200 rounded-full px-5 py-2 
                 hover:text-gray-700 hover:border-gray-400 
                 transition-all duration-300 hover:scale-105 cursor-pointer
                 bg-white shadow-sm"
      dir="rtl"
    >
      <button
  className="text-sm font-medium text-gray-500 
             hover:text-gray-700 transition-all duration-300"
  onClick={() => navigate("/shop")}
>
  عرض الكل
</button>

      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
        <RightArrow className="w-3 h-3 text-gray-500" />
      </div>
    </div>
  );
}
