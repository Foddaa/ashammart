import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { useLocation } from "react-router-dom";

export default function AddToCartButtons({ handleAddToCart, className }) {
  const location = useLocation();

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${location.pathname}${location.search}${location.hash}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="flex gap-4 w-full">
      {/* Add to Cart Button - Receives styling from parent via className */}
      <button
        onClick={handleAddToCart}
        className={className}
      >
        Add To Cart
      </button>

      {/* Minimalist Share Button */}
      {/* <button
        onClick={handleCopy}
        className="w-[30px] h-[56px] bg-white border border-black text-black flex items-center justify-center hover:bg-neutral-50 transition-colors shrink-0"
        aria-label="Share product"
      >
        <ContentCopyIcon fontSize="small" />
      </button> */}
    </div>
  );
}