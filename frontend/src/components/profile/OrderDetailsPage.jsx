import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "@/api/axiosInstance";

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    // If we don't have the order in state, fetch it
    if (order && order.items) return; 

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/client/getOrder/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, order]);

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-neutral-400 text-sm tracking-wider">
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-red-500 text-sm">
        Order not found.
      </div>
    );
  }

  const items = order.items || [];

  return (
    <div className="bg-white border border-neutral-200 p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-light tracking-wide text-neutral-900">
            Order #{order.id}
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Placed on {formatDate(order.orderDate)}
          </p>
        </div>
        <Link
          to="/profile/orders"
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          Back
        </Link>
      </div>

      {/* Order Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Status
          </p>
          <p className="text-neutral-800 font-medium">{order.status || "—"}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Est. Delivery
          </p>
          <p className="text-neutral-800">
            {formatDate(order.estimatedDeliveryDate)}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Payment
          </p>
          <p className="text-neutral-800">
            {order.paymentMethod?.replace(/_/g, " ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Shipping To
          </p>
          <p className="text-neutral-800">
            {order.address?.city || "—"}
          </p>
        </div>
      </div>

      {/* Address Details */}
      {order.address && (
        <div className="mb-8 p-4 border border-neutral-200 bg-neutral-50 text-sm">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            Detailed Address
          </p>
          <p className="text-neutral-800">{order.address.description}</p>
        </div>
      )}

      {/* Items List */}
      <div className="border-t border-neutral-200 pt-4 mb-6">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
          Items
        </p>
        {items.length === 0 ? (
          <p className="text-sm text-neutral-400 py-2">No items found in this order.</p>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {items.map((item, idx) => (
              <li
                key={item.id ?? idx}
                className="py-3 flex items-center justify-between text-sm"
              >
                <span className="text-neutral-800">
                  {item.name || item.productName || `Item ${idx + 1}`}
                  {item.quantity ? ` × ${item.quantity}` : ""}
                </span>
                <span className="text-neutral-600 font-medium">
                  {Number(item.price ?? 0).toLocaleString()} EGP
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary Breakdown */}
      <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span>{Number(order.subtotal ?? 0).toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Delivery Cost</span>
          <span>{Number(order.deliveryCost ?? 0).toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between text-base font-medium text-neutral-900 pt-2 border-t border-neutral-200 mt-2">
          <span className="font-light">Total</span>
          <span>{Number(order.totalCost ?? 0).toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;