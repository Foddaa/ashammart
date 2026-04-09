import React from "react";
import { useNavigate } from "react-router-dom";
import Heading from "@/components/shared/Heading";
import ViewAll from "@/components/shared/ViewAll";
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

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop/${categoryId}`);
  };

  return (
    <section className="container min-h-full py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <Heading header="الأقسام الرئيسية" text="اكتشف تشكيلتنا الواسعة من الأثاث" />
        <ViewAll />
      </div>
      <div className="grid grid-cols-5 gap-4 px-0 md:px-0">
        {categoryImages.map((cat) => (
          <div key={cat.id} className="flex flex-col items-center justify-start">
            <button
              onClick={() => handleCategoryClick(cat.id)}
              className="flex items-center justify-center"
            >
              <div className="p-[2px] rounded-full bg-blue-500">
                <div className="p-[1px] rounded-full bg-white">                  
                  <div className="w-15 h-15 rounded-full overflow-hidden">
                    <img
                      src={cat.image}
                      className="w-full h-full object-cover rounded-full"
                      alt={cat.title}
                    />
                  </div>
                </div>
              </div>
            </button>
            <span className="text-xs text-center mt-1 font-medium text-gray-700">
              {cat.title}
            </span>
          </div>
        ))}
      </div>
      
    </section>
  );
};

export default HomeCategory;
