import { useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/Context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddReviewPage() {
  const { Token } = useContext(UserContext);
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const productTitle = location.state?.productTitle || "هذا المنتج";

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(""); // optional
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(0);
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    if (!stars || stars < 1) {
      toast.warn("يرجى تقييم المنتج بنجمة واحدة على الأقل.");
      return;
    }
    if (!name.trim()) {
      toast.warn("يرجى إدخال الاسم.");
      return;
    }
    if (!phone.trim()) {
      toast.warn("يرجى إدخال رقم الهاتف.");
      return;
    }

    const formData = new FormData();
    formData.append("productId", Number(id));
    formData.append("stars", Math.floor(stars));
    formData.append("comment", comment);
    formData.append("name", name);
    formData.append("phone", phone);
    if (email.trim()) {
      formData.append("email", email);
    }
    images.forEach((img) => formData.append("images", img));

    try {
      const res = await fetch(`${BASE_URL}/api/client/addReview`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
    toast.success("تم إرسال التقييم بنجاح!");
    navigate(-1);
  } else {
    const errorMsg = await res.text(); // get error message from backend
    toast.error(errorMsg || "فشل في إرسال التقييم.");
  }
} catch (error) {
  console.error("Review error:", error);
  toast.error(error.message || "حدث خطأ أثناء إرسال التقييم.");
}
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-right" dir="rtl">
      <h2 className="text-xl font-semibold mb-4">أضف تقييمًا لـ {productTitle}</h2>

      {/* Name */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">الاسم</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="أدخل اسمك"
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">رقم الهاتف</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="أدخل رقم الهاتف"
        />
      </div>

      {/* Email (optional) */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">البريد الإلكتروني (اختياري)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="example@email.com"
        />
      </div>

      {/* Rating */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">التقييم بالنجوم</label>
        <Rating
          name="rating"
          value={stars}
          precision={1}
          onChange={(e, value) => setStars(value || 0)}
        />
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">التعليق</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded"
          placeholder="اكتب تعليقك هنا..."
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label className="block mb-1 text-gray-700 font-medium">رفع الصور (اختياري)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full"
        />
        {images.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {images.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`preview-${index}`}
                className="w-24 h-24 object-cover rounded border cursor-pointer"
                title="اضغط للتكبير"
                onClick={() => window.open(URL.createObjectURL(file), "_blank")}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
      >
        إرسال التقييم
      </button>
    </div>
  );
}
