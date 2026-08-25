import { useBuyNow } from '@/context/BuyNowContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductImageUrl } from '@/utils/productDisplay';
import QuantityControls from '@/components/ProductDetails/QuantityControls';

export default function BuyNowDrawer() {
  const { buyNowProduct, isDrawerOpen, closeBuyNow } = useBuyNow();
  const navigate = useNavigate();
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Reset selection when product changes
  useEffect(() => {
    if (buyNowProduct) {
      if (buyNowProduct.variants && buyNowProduct.variants.length > 0) {
        const inStock = buyNowProduct.variants.find(v => v.quantity > 0 && v.status === 'AVAILABLE');
        const defaultVariant = inStock || buyNowProduct.variants[0];
        setSelectedColorId(defaultVariant.colorId);
        setSelectedSizeId(defaultVariant.sizeId);
        setSelectedVariant(defaultVariant);
      } else {
        setSelectedColorId(null);
        setSelectedSizeId(null);
        setSelectedVariant(null);
      }
      setQuantity(1);
    }
  }, [buyNowProduct]);

  const availableColors = buyNowProduct?.variants
    ? buyNowProduct.variants
        .filter((v, i, self) => self.findIndex(t => t.colorId === v.colorId) === i)
        .map(v => ({ id: v.colorId, name: v.colorName, hex: v.colorHex }))
    : [];

  const availableSizes = buyNowProduct?.variants
    ? buyNowProduct.variants
        .filter((v, i, self) => self.findIndex(t => t.sizeId === v.sizeId) === i)
        .map(v => ({ id: v.sizeId, name: v.sizeName }))
    : [];

  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    if (selectedSizeId !== null) {
      const stillAvailable = buyNowProduct.variants.some(
        v => v.colorId === colorId && v.sizeId === selectedSizeId
      );
      if (!stillAvailable) {
        const firstAvailable = buyNowProduct.variants.find(v => v.colorId === colorId);
        setSelectedSizeId(firstAvailable ? firstAvailable.sizeId : null);
      }
    }
  };

  const handleSizeSelect = (sizeId) => {
    setSelectedSizeId(sizeId);
    if (selectedColorId !== null) {
      const stillAvailable = buyNowProduct.variants.some(
        v => v.sizeId === sizeId && v.colorId === selectedColorId
      );
      if (!stillAvailable) {
        const firstAvailable = buyNowProduct.variants.find(v => v.sizeId === sizeId);
        setSelectedColorId(firstAvailable ? firstAvailable.colorId : null);
      }
    }
  };

  // Update variant when selection changes
  useEffect(() => {
    if (!buyNowProduct?.variants) return;
    if (selectedColorId !== null && selectedSizeId !== null) {
      const match = buyNowProduct.variants.find(
        v => v.colorId === selectedColorId && v.sizeId === selectedSizeId
      );
      setSelectedVariant(match || null);
    } else {
      setSelectedVariant(null);
    }
  }, [selectedColorId, selectedSizeId, buyNowProduct]);

  const handleProceed = () => {
    if (!selectedVariant && buyNowProduct.variants?.length > 0) {
      toast.warning("Please select a color and size combination.");
      return;
    }
    // If no variants, treat product as the "variant"
    const variant = selectedVariant || { 
      id: buyNowProduct.id, 
      price: buyNowProduct.price, 
      canceledPrice: buyNowProduct.canceledPrice, 
      quantity: 999, 
      colorName: null, 
      sizeName: null 
    };
    if (variant.quantity < quantity) {
      toast.error(`Only ${variant.quantity} items in stock.`);
      return;
    }

    const orderItem = {
      variantId: variant.id,
      productId: buyNowProduct.id,
      name: buyNowProduct.name,
      price: variant.price ?? buyNowProduct.price,
      canceledPrice: variant.canceledPrice ?? buyNowProduct.canceledPrice,
      images: buyNowProduct.images,
      quantity: quantity,
      comment: "",
      freeDelivery: buyNowProduct.freeDelivery,
      color: variant.colorName,
      size: variant.sizeName,
    };

    closeBuyNow();
    navigate("/review-order", {
      state: {
        buyNow: true,
        directProduct: orderItem,
        subtotal: (variant.price ?? buyNowProduct.price) * quantity,
        quantity: quantity,
        comment: "",
      },
    });
  };

  if (!isDrawerOpen || !buyNowProduct) return null;

  const effectivePrice = selectedVariant?.price ?? buyNowProduct.price;
  const stock = selectedVariant?.quantity ?? 999;
  const isInStock = stock > 0 && (selectedVariant?.status === 'AVAILABLE' || !selectedVariant);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
        onClick={closeBuyNow}
      />
      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 ease-out translate-y-0">
        <div className="p-6">
          {/* Handle bar */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-neutral-300 rounded-full" />
          </div>

          {/* Product preview */}
          <div className="flex items-center gap-4 mb-6 border-b border-neutral-100 pb-4">
            <img
              src={getProductImageUrl(buyNowProduct)}
              alt={buyNowProduct.name}
              className="w-20 h-20 object-cover rounded border border-neutral-200"
            />
            <div>
              <h3 className="text-base font-normal tracking-wide text-neutral-900">
                {buyNowProduct.name}
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                EGP {effectivePrice}
              </p>
            </div>
          </div>

          {/* Color selector */}
          {/* Color selector (matching product detail style) */}
{availableColors.length > 0 && (
  <div className="flex flex-col gap-2 mb-4">
    <span className="text-sm text-neutral-800 font-medium">
      Color:{" "}
      <span className="font-normal text-neutral-600">
        {availableColors.find(c => c.id === selectedColorId)?.name || "Select"}
      </span>
    </span>
    <div className="flex gap-3 flex-wrap">
      {availableColors.map((c) => (
        <button
          key={c.id}
          onClick={() => handleColorSelect(c.id)}
          className={`w-8 h-8 border ${
            selectedColorId === c.id ? "border-black" : "border-neutral-300"
          } hover:border-black transition-colors p-1.5`}
        >
          <div
            className="w-full h-full"
            style={{ backgroundColor: c.hex || "#cccccc" }}
          />
        </button>
      ))}
    </div>
  </div>
)}
          {/* Size selector */}
          {availableSizes.length > 0 && (
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-800 font-medium">
                  Size:{" "}
                  <span className="font-normal text-neutral-600">
                    {availableSizes.find(s => s.id === selectedSizeId)?.name || "Select"}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => {
                  const isAvailable = buyNowProduct.variants.some(
                    v => v.sizeId === s.id && v.colorId === selectedColorId && v.quantity > 0
                  );
                  const isSelected = selectedSizeId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleSizeSelect(s.id)}
                      disabled={!isAvailable}
                      className={`relative w-12 h-10 border overflow-hidden flex items-center justify-center text-sm transition-colors ${
                        isSelected ? "border-black bg-neutral-50" : "border-neutral-300 bg-white"
                      } ${isAvailable ? "hover:border-black cursor-pointer" : "cursor-not-allowed opacity-50"}`}
                    >
                      <span className={!isAvailable ? "text-neutral-700" : "text-neutral-700"}>
                        {s.name}
                      </span>
                      {!isAvailable && (
                        <span className="absolute left-1/2 top-1/2 w-[140%] h-[1px] bg-neutral-500 -translate-x-1/2 -translate-y-1/2 -rotate-[35deg] pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock indicator – red urgency only when stock <= 5 */}
          <div className="text-sm mb-4">
            {!isInStock ? (
              <span className="text-red-500">Out of stock</span>
            ) : stock <= 5 ? (
              <span className="text-red-500 font-medium">Only {stock} left!</span>
            ) : null}
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-3 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-800 font-medium">Quantity</span>
            </div>
            <QuantityControls value={quantity} onChange={setQuantity} max={stock} />
          </div>

          {/* Proceed button with top margin */}
          <button
            onClick={handleProceed}
            disabled={!isInStock}
            className={`w-full py-4 mt-4 text-white transition-colors duration-200 flex items-center justify-center gap-2 text-[15px] font-normal ${
              isInStock ? "bg-black hover:bg-neutral-900" : "bg-neutral-400 cursor-not-allowed"
            }`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}