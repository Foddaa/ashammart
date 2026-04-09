import { Delivery, Discounts, Facebook, Instagram, Price,Twitter  } from "@/assets/icons/svgs";
import { AD1, AD2, AD3, AD4 } from "@/assets/images";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
// hero section
export const ImgUrl = [
  {
    img : AD1,
  }, 
  {
    img: AD2,
  },
  {
    img : AD3,
  },
  {
    img : AD4,
  },
];

// pages to show pagination 
export  const pages = [
    {
      name: "Home",
      path: '/',
    },
    {
      name: 'Cart',
      path:'/cart',
    },
    {
      name: 'Checkout',
      path: '/checkout',
    }
  ];

// sidebar in Shop
export const fetchCategories = async () => {
  const response = await axios.get("${BASE_URL}/api/category/all");
  return response.data;
};


export const Brands = [
  {
    name: "moustafa  el salab",
    quantity: 8,
  },
  {
    name: "ahmed el salab",
    quantity: 36,
  },
  {
    name: "mfco",
    quantity: 1,
  },
  {
    name: "qabany",
    quantity: 1,
  },
  {
    name: "el maher",
    quantity: 18,
  },
];

export const avalablity = [
  {
    name: "In Stock",
    quantity: 62,
  },
  {
    name: "Out of Stock",
    quantity: 0,
  }
];


// slider break points
export const responsive = {
    superLargeDesktop: {
    breakpoint: { max: 4000, min: 1280 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 4,
  },
  desktop2: {breakpoint: { max: 1024, min: 800 },items: 3},
tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 3,
  },  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,   // 👈 shows 2 products on phones
  },
};

export const VerticalBorder = [
    {
      name: "Beverages",
    },
    {
      name: "Biscuits & Snacks",
    },
    {
      name: "Breads & Bakery",
    },
    {
      name: "Breakfast & Dairy",
    },
    {
      name: "Frozen Foods",
    },
    {
      name: "Grocery & Staples",
    },
    {
      name: "Household Needs",
    },
    {
      name: "Meats & Seafood",
    },
  ];


// Footer section
export const FooterList = [
  {
    title: 'غرف النوم',
    items: [
      'أسرة مزدوجة',
      'أسرة مفردة',
      'دواليب ملابس',
      'تسريحات ومرآة',
      'كومودينو',
      'مفروشات الأسرة'
    ]
  },
  {
    title: 'غرف المعيشة',
    items: [
      'كنب',
      'ركنات',
      'طاولات قهوة',
      'مكتبات تلفزيون',
      'كراسي استرخاء',
      'وحدات تخزين'
    ]
  },
  {
    title: 'غرف الطعام',
    items: [
      'طاولات طعام',
      'كراسي طعام',
      'بوفيه وسيرفرات',
      'دواليب عرض',
      'أطقم طعام كاملة'
    ]
  },
  {
    title: 'مكاتب وأثاث مكتبي',
    items: [
      'مكاتب',
      'كراسي مكتب',
      'مكتبات كتب',
      'وحدات تخزين مكتبية',
      'ملحقات المكتب'
    ]
  },
  {
    title: 'الديكور والإضاءة',
    items: [
      'لوحات حائط',
      'سجاد',
      'مصابيح أرضية',
      'مصابيح طاولة',
      'مرايا',
      'ستائر'
    ]
  }
];


export const footerIcons = [
          { text: "خصومات يومية", icon: Discounts },
          { icon: Price, text: "افضل الأسعار في السوق" }
        ];

export const footerSocial = [
  Facebook,
  Twitter,
  Instagram,
];
