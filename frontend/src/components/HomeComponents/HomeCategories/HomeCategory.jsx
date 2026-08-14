import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Heading from "@/components/shared/Heading";
import AD1 from "@/assets/images/categories/livingTable.jpg";
import AD2 from "@/assets/images/categories/shoesCase.jpg";
import AD3 from "@/assets/images/categories/coffeTable.jpg";
import AD4 from "@/assets/images/categories/TvCabine.jpg";
import AD5 from "@/assets/images/categories/sideSofaa.jpg";
import AD6 from "@/assets/images/categories/bed.jpg";
import AD7 from "@/assets/images/categories/nightstand.jpg";
import AD8 from "@/assets/images/categories/lights.jpg";
import AD9 from "@/assets/images/categories/carpets.jpg";
import AD10 from "@/assets/images/categories/bigBag.jpg";

// Placeholder images for the two square categories (fallback)
import placeholderFastDelivery from "@/assets/images/categories/bigBag.jpg";
import placeholderRealLife from "@/assets/images/categories/bigBag.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const categoryImages = [
  { id: 4, title: "ترابيزة الانتريه", category: "1", image: AD1 },
  { id: 1, title: "جزامات", category: "2", image: AD2 },
  { id: 3, title: "كوفي كورنر", category: "3", image: AD3 },
  { id: 2, title: "وحدات شاشه", category: "4", image: AD4 },
  { id: 8, title: "ركنات", category: "5", image: AD5 },
  { id: 7, title: "سراير", category: "6", image: AD6 },
  { id: 10, title: "كمود", category: "7", image: AD7 },
  { id: 19, title: "إضاءات", category: "8", image: AD8 },
  { id: 5, title: "سجاد و ستائر", category: "9", image: AD9 },
  { id: 20, title: "بين باج", category: "10", image: AD10 },
];

const HomeCategory = () => {
  const navigate = useNavigate();
  const [fastDeliveryImage, setFastDeliveryImage] = useState(placeholderFastDelivery);
  const [realLifeImage, setRealLifeImage] = useState(placeholderRealLife);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch fast delivery image
        const fastRes = await fetch(`${BASE_URL}/api/public/assets/fastDelivery`);
        if (fastRes.ok) {
          const blob = await fastRes.blob();
          const url = URL.createObjectURL(blob);
          setFastDeliveryImage(url);
        }

        // Fetch real life photos image
        const realRes = await fetch(`${BASE_URL}/api/public/assets/realLifePhotos`);
        if (realRes.ok) {
          const blob = await realRes.blob();
          const url = URL.createObjectURL(blob);
          setRealLifeImage(url);
        }
      } catch (error) {
        console.error("Failed to fetch category images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();

    // Cleanup object URLs when component unmounts
    return () => {
      if (fastDeliveryImage && fastDeliveryImage.startsWith("blob:")) {
        URL.revokeObjectURL(fastDeliveryImage);
      }
      if (realLifeImage && realLifeImage.startsWith("blob:")) {
        URL.revokeObjectURL(realLifeImage);
      }
    };
  }, []);

  // Define square categories with dynamic images
  const squareCategories = [
    {
      id: 101,
      title: "منتجات شحن سريع",
      category: "12",
      image: fastDeliveryImage,
      type: "fastDelivery"
    },
    {
      id: 100,
      title: "المنتجات علي الطبيعة",
      category: "11",
      image: realLifeImage,
      type: "realLife"
    }
  ];

  const handleCategoryClick = (cat) => {
    if (cat.type === "fastDelivery") {
      navigate("/shop/fast-delivery");
    } else if (cat.type === "realLife") {
      navigate("/realLifePhotos");
    } else {
      navigate(`/shop/${cat.id}`);
    }
  };

  return (
    <section className="container min-h-full py-8">
      <div className="relative mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-right w-full sm:w-auto">
            <Heading 
              header="الأقسام الرئيسية" 
              text="اكتشف تشكيلتنا الواسعة من الأثاث" 
            />
          </div>
        </div>
      </div>

      {/* Square Categories - 2 items side by side */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
        {squareCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <div className="relative w-full aspect-square bg-gradient-to-br from-blue-50 to-indigo-100">
              <img
                src={cat.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={cat.title}
                onError={(e) => {
                  // Fallback to placeholder if image fails
                  e.target.src = placeholderFastDelivery;
                }}
              />
              {/* Overlay with gradient - softer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              
              {/* Title - Bottom left aligned with elegant style */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-right">
                <h3 className="text-white font-bold text-md md:text-xl lg:text-2xl drop-shadow-lg mb-1">
                  {cat.title}
                </h3>
                <div className="w-12 h-0.5 bg-gradient-to-l from-white/80 to-transparent rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>

              {/* Hover "تصفح الآن" - subtle and elegant */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-sm font-medium bg-white/15 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  تصفح الآن
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-4 px-0">
        {categoryImages.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center justify-start group">
            <button
              onClick={() => handleCategoryClick(cat)}
              className="flex items-center justify-center transition-transform duration-300 group-hover:scale-105 w-full"
            >
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 relative">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl p-[3px] bg-gradient-to-br from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                    <img
                      src={cat.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      alt={cat.title}
                      onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                </div>
                {/* Default image (without border) */}
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <img
                    src={cat.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={cat.title}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-end justify-center p-2">
                  <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    تصفح
                  </span>
                </div>
              </div>
            </button>
            <span className="text-xs sm:text-sm text-center mt-2 font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 max-w-[90px]">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeCategory;