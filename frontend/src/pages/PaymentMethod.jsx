import { motion, AnimatePresence } from "framer-motion";

const PaymentMethod = ({ payment, setPayment }) => {
  const getPaymentNumber = () => {
    if (payment === "INSTAPAY") return "01152433581";
    if (payment === "VODAFONE_CASH") return "01118899959";
    return null;
  };

  return (
    <div className="space-y-4 w-full" dir="ltr">

      {/* Payment options */}
      <div className="flex flex-col gap-2">
        
        {/* Cash on Delivery */}
        <label className="relative flex items-center gap-3 cursor-pointer group p-2 -ml-2 pl-2 hover:bg-neutral-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="CASH_ON_DELEVER"
            checked={payment === "CASH_ON_DELEVER"}
            onChange={(e) => setPayment(e.target.value)}
            className="peer sr-only"
          />
          {/* Unchecked State */}
          <svg
            className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-colors peer-checked:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          {/* Checked State */}
          <svg
            className="w-[18px] h-[18px] text-neutral-900 hidden peer-checked:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <polyline points="9 12 11 14 15 10" stroke="white" />
          </svg>
          <span className="text-sm text-neutral-700 peer-checked:text-neutral-900 font-light tracking-wide">
            Cash on Delivery
          </span>
        </label>

        {/* Instapay */}
        <label className="relative flex items-center gap-3 cursor-pointer group p-2 -ml-2 pl-2 hover:bg-neutral-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="INSTAPAY"
            checked={payment === "INSTAPAY"}
            onChange={(e) => setPayment(e.target.value)}
            className="peer sr-only"
          />
          <svg
            className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-colors peer-checked:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <svg
            className="w-[18px] h-[18px] text-neutral-900 hidden peer-checked:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <polyline points="9 12 11 14 15 10" stroke="white" />
          </svg>
          <span className="text-sm text-neutral-700 peer-checked:text-neutral-900 font-light tracking-wide">
            Instapay
          </span>
        </label>

        {/* Vodafone Cash */}
        <label className="relative flex items-center gap-3 cursor-pointer group p-2 -ml-2 pl-2 hover:bg-neutral-50 transition-colors">
          <input
            type="radio"
            name="payment"
            value="VODAFONE_CASH"
            checked={payment === "VODAFONE_CASH"}
            onChange={(e) => setPayment(e.target.value)}
            className="peer sr-only"
          />
          <svg
            className="w-[18px] h-[18px] text-neutral-400 group-hover:text-neutral-600 transition-colors peer-checked:hidden"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <svg
            className="w-[18px] h-[18px] text-neutral-900 hidden peer-checked:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <polyline points="9 12 11 14 15 10" stroke="white" />
          </svg>
          <span className="text-sm text-neutral-700 peer-checked:text-neutral-900 font-light tracking-wide">
            Vodafone Cash
          </span>
        </label>
      </div>

      {/* Animated number display */}
      <AnimatePresence>
        {getPaymentNumber() && (
          <motion.div
            key={payment}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border border-neutral-200 bg-neutral-50 p-3 mt-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                Payment Number:
              </span>
              <span className="text-sm font-mono text-neutral-800 tracking-wide">
                {getPaymentNumber()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethod;