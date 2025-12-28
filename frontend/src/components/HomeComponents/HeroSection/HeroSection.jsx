import { RightArrow } from "@/assets/icons/svgs";
import { ImgUrl } from "@/constants";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full">
      {/* First Image Card */}
      <div
        loading="lazy"
        style={{
          backgroundImage: `url(${ImgUrl[0].img})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="w-full aspect-[288/100] rounded-2xl p-6 flex items-center justify-start 
                   bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        
      </div>

      {/* Second Image Card */}
      <div
        loading="lazy"
        style={{
          backgroundImage: `url(${ImgUrl[3].img})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
        className="w-full aspect-[288/100] rounded-2xl p-6 flex items-center justify-start
                   bg-gray-100 shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        
      </div>
    </div>
  );
}
