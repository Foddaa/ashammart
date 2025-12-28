import { useEffect} from "react";
// import Rating from "@mui/material/Rating";
import { AD5 } from "@/assets/images";
import { useDispatch, useSelector } from "react-redux";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "./BestSellers.css"
import Heading from "@/components/shared/Heading";
import { responsive } from "@/constants";
import ViewAll from "@/components/shared/ViewAll";
import { useNavigate } from "react-router-dom";
import actionTables from "@/store/BestSeller/thunk/actionTables";
import Rating from "@mui/material/Rating";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useContext } from "react";
import { UserContext } from "@/Context/AuthContext"; 

function Tables() {

  const {products  , error } = useSelector(state => state.tables);
  const dispatch = useDispatch();
  const { Token, setToken, userRole, setUserRole } = useContext(UserContext);
  const navigate = useNavigate();

function productPopUp(product) {
  navigate(`/product/${product.id}`, { state: { product } });
}


  useEffect(()=> {
    dispatch(actionTables());
  }, [dispatch]);
   

  if(error){
    return(
      <div className="text-red-400 text-3xl">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="py-5">
        <div className="flex justify-between mb-5">
          <Heading 
            header={"الاعلي تقيِما "} 
          text={"لا تفوّت العروض الحالية حتى نهاية شهر أغسطس."}/>
          {/* <ViewAll /> */}
        </div>

        <Carousel 
          autoPlay 
          responsive={responsive} 
          infinite={true}
          containerClass="carousel-container"
          itemClass="px-1"
        >
          {products.map((e) => (
            <div
              key={e.id}
              className="flex flex-col border border-gray-200 rounded-lg overflow-hidden shadow-sm w-full mx-1 "
            >
              <div className="aspect-square w-full flex justify-center items-center bg-gray-50">
                <img
                  src={e.images[0]?.url ? `${BASE_URL}/api${e.images[0].url}` : AD5}
                  alt={e.name}
                  className="w-full h-full object-cover p-1 cursor-pointer"
                  loading="lazy"
                  onClick={() => productPopUp(e)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = AD5;
                  }}
                />
              </div>

              <div className="p-2">
                <h3 className="font-semibold text-sm text-gray-800 truncate">
                  {e.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {e.description?.length > 30 
                    ? `${e.description.substring(0, 30)}...` 
                    : e.description}
                </p>
                <span className="text-xs text-blue-600 mt-1 block">
                  تصميم مخصص
                </span>
              
                <div className="flex items-center mt-0.5 mb-0.5 px-2">
                  <Rating
                    name="read-only"
                    value={e.averageRating || 0}
                    readOnly
                    precision={0.5}
                    size="small"
                  />
                  <span className="text-xs text-gray-600 ml-1">
                    ({e.averageRating?.toFixed(1) || '0.0'})
                  </span>
                </div>

                <div className="p-2 border-t border-gray-100">
                  <p className="text-black-600 font-bold mb-2">
  <span className="text-gray-500 line-through text-base font-normal mr-2">
    {e.canceledPrice
      ? `${e.canceledPrice.toFixed(2)}`
      : `${(e.price * 1.12).toFixed(2)}`}
  </span>
  <span className="text-black-600 font-bold">
    {e.price} جنيه
  </span>
</p>

                </div>
              </div>
            </div>
          ))}
        
        </Carousel>
        <div className="flex justify-center items-center mt-10 px-4">
  <div className="w-full max-w-7xl aspect-[48/9] rounded-xl shadow-md overflow-hidden">
    <img
      src={AD5}
      alt="Advertisement"
      className="w-full h-full object-cover"
      loading="lazy"
    />
  </div>
</div>

      </div>
    </div>
  );
}

export default Tables;