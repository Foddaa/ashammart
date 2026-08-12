import { useState, useContext } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Rating from "@mui/material/Rating";
import { UserContext } from "@/context/AuthContext";
import api from "@/api/axiosInstance"; // ✅ centralized API client

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddReviewPage() {
  const { Token } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const productTitle = location.state?.productTitle || "this product";

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
      toast.warn("Please rate the product with at least one star.");
      return;
    }
    if (!name.trim()) {
      toast.warn("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      toast.warn("Please enter your phone number.");
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
      // ✅ using api.post (form-data automatically handled by axios)
      const res = await api.post("/api/client/addReview", formData);

      // Since api interceptors return actual data, we check if status is 200 or similar.
      // If successful, usually res.data returns a success string.
      toast.success("Review submitted successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Review error:", error);
      const errorMsg = error.response?.data || "An error occurred while submitting the review.";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="ltr">
      <div className="bg-white border border-neutral-200 w-full max-w-lg p-6 md:p-8">
        
        {/* Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-6">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Add a Review
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Share your experience with {productTitle}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Full Name <span className="text-neutral-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 w-full"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Phone Number <span className="text-neutral-400">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 w-full"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Email (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Email (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 w-full"
              placeholder="example@email.com"
            />
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-1 mb-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Rating <span className="text-neutral-400">*</span>
            </label>
            <Rating
              name="rating"
              value={stars}
              precision={1}
              onChange={(e, value) => setStars(value || 0)}
              className="text-neutral-800"
              sx={{
                '& .MuiRating-iconEmpty': {
                  color: '#d1d5db', // neutral-300
                },
                '& .MuiRating-iconFilled': {
                  color: '#171717', // neutral-900 (black stars for luxury!)
                },
              }}
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Review Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 w-full resize-y"
              placeholder="Write your review here..."
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              Upload Images (Optional)
            </label>
            
            <label className="cursor-pointer border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-colors px-4 py-3 flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:border-neutral-900 hover:text-neutral-900">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {images.length > 0 ? "Change Images" : "Choose Images"}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-3 flex gap-2 flex-wrap">
                {images.map((file, index) => (
                  <div key={index} className="relative border border-neutral-200 bg-neutral-50 w-20 h-20 overflow-hidden group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Optional overlay for luxury effect or just pure sharpness */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide uppercase"
          >
            Submit Review
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide uppercase"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}