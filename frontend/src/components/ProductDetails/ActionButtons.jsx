import share from "@/assets/icons/svgs/share.svg";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';
import { toast } from 'react-toastify';

export default function ActionButtons({ handleAddToCart }) {
  const location = useLocation()
  const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
    const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}${location.pathname}${location.search}${location.hash}`);
    toast.success("Copied to clipboard!");
  };
  return (
    <div className="flex  gap-2 xl:gap-3">
      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="bg-blue-800 py-4 flex items-center justify-center gap-2 text-white w-full rounded-sm font-semibold text-base cursor-pointer"
      >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="30" height="30" fill="white"  ><path d="M24 48C10.7 48 0 58.7 0 72C0 85.3 10.7 96 24 96L69.3 96C73.2 96 76.5 98.8 77.2 102.6L129.3 388.9C135.5 423.1 165.3 448 200.1 448L456 448C469.3 448 480 437.3 480 424C480 410.7 469.3 400 456 400L200.1 400C188.5 400 178.6 391.7 176.5 380.3L171.4 352L475 352C505.8 352 532.2 330.1 537.9 299.8L568.9 133.9C572.6 114.2 557.5 96 537.4 96L124.7 96L124.3 94C119.5 67.4 96.3 48 69.2 48L24 48zM208 576C234.5 576 256 554.5 256 528C256 501.5 234.5 480 208 480C181.5 480 160 501.5 160 528C160 554.5 181.5 576 208 576zM432 576C458.5 576 480 554.5 480 528C480 501.5 458.5 480 432 480C405.5 480 384 501.5 384 528C384 554.5 405.5 576 432 576z"/></svg>

        اضف الي السلة
      </button>

      {/* Share Button */}
      <div className="flex flex-wrap gap-2 xl:gap-1">
     
       <IconButton onClick={handleCopy}>
        <ContentCopyIcon />
      </IconButton>
        
     
      </div>
    </div>
  );
}
