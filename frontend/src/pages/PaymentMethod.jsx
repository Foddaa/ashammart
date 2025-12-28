import { motion, AnimatePresence } from "framer-motion";

const PaymentMethod = ({ payment, setPayment }) => {
  const getPaymentNumber = () => {
    if (payment === "INSTAPAY") return "01152433581";
    if (payment === "VODAFONE_CASH") return "01118899959";
    return null;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">طريقة الدفع</h2>

      {/* Payment options */}
      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="CASH_ON_DELEVER"
            checked={payment === "CASH_ON_DELEVER"}
            onChange={(e) => setPayment(e.target.value)}
          />
          الدفع عند الاستلام
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="INSTAPAY"
            checked={payment === "INSTAPAY"}
            onChange={(e) => setPayment(e.target.value)}
          />
          انستاباي
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="VODAFONE_CASH"
            checked={payment === "VODAFONE_CASH"}
            onChange={(e) => setPayment(e.target.value)}
          />
          محفظة
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
            className="overflow-hidden bg-gray-100 p-3 rounded-md shadow"
          >
            <p className="text-gray-800 font-medium">
              رقم الدفع: {getPaymentNumber()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethod;
