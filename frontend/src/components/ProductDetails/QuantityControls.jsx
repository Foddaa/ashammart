export default function QuantityControls({
  value,
  onChange = () => {},
  disabled = false,
}) {
  const handleDecrement = () => {
    if (disabled || value <= 1) return;
    onChange(value - 1);
  };

  const handleIncrement = () => {
    if (disabled) return;
    onChange(value + 1);
  };

  return (
    <div className="bg-[#F3F5F9] flex justify-between items-center gap-4 py-2 px-5 rounded w-full">
      <button
        onClick={handleDecrement}
        className="p-2.5 cursor-pointer"
        disabled={disabled || value <= 1}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" stroke="currentColor" fill="none">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" />
        </svg>
      </button>

      <span className="text-base font-semibold w-12 text-center">{value}</span>

      <button
        onClick={handleIncrement}
        className="p-2.5 cursor-pointer"
        disabled={disabled}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}
