import React, { useEffect, useMemo, useState } from "react";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { invalidateMerchantConfig } from "@/hooks/useMerchantConfig";

// Every setting shown on the page, grouped into sections.
// `key` is the config_key stored in the merchant_configuration table.
const SECTIONS = [
  {
    title: "General",
    fields: [
      { key: "merchant_brand_name", label: "Brand Name", type: "text", required: true },
    ],
  },
  {
    title: "Contact",
    fields: [
      { key: "merchant_contact_phone_1", label: "Phone 1", type: "tel", placeholder: "+20 111 889 9959" },
      { key: "merchant_contact_phone_2", label: "Phone 2", type: "tel", placeholder: "+20 115 888 0605" },
      { key: "merchant_contact_email", label: "Email", type: "email", placeholder: "hello@yourbrand.com", wide: true },
    ],
  },
  {
    title: "Location",
    fields: [
      { key: "merchant_address", label: "Address", type: "text", wide: true },
      { key: "merchant_address_note", label: "Address Note", type: "text", wide: true },
      {
        key: "merchant_maps_url",
        label: "Google Maps Link",
        type: "url",
        wide: true,
        hint: "Leave empty to build the link automatically from the address.",
      },
    ],
  },
  {
    title: "Working Hours & Support",
    fields: [
      { key: "merchant_working_days", label: "Working Days", type: "text", placeholder: "Sat – Thu" },
      { key: "merchant_working_hours", label: "Working Hours", type: "text", placeholder: "10:00 AM – 8:00 PM" },
      { key: "merchant_support_languages", label: "Support Languages", type: "text", placeholder: "English & Arabic", wide: true },
    ],
  },
  {
    title: "Social Media",
    fields: [
      { key: "merchant_facebook_url", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/yourpage" },
      { key: "merchant_instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/yourpage" },
      { key: "merchant_twitter_url", label: "Twitter / X URL", type: "url", placeholder: "https://x.com/yourpage" },
      { key: "merchant_tiktok_url", label: "TikTok URL", type: "url", placeholder: "https://tiktok.com/@yourpage" },
      {
        key: "merchant_whatsapp_number",
        label: "WhatsApp Number",
        type: "tel",
        placeholder: "+201001234567",
        hint: "International format. Leave empty to hide the WhatsApp icon.",
      },
    ],
  },
];

const ALL_FIELDS = SECTIONS.flatMap((s) => s.fields);
const ALL_KEYS = ALL_FIELDS.map((f) => f.key);
const LABELS = Object.fromEntries(ALL_FIELDS.map((f) => [f.key, f.label]));

const emptyValues = () => Object.fromEntries(ALL_KEYS.map((k) => [k, ""]));

const MerchantSettings = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState(emptyValues);
  const [original, setOriginal] = useState(emptyValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load every key (in parallel)
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      let unauthorized = false;
      let failedCount = 0;

      const entries = await Promise.all(
        ALL_KEYS.map(async (key) => {
          try {
            const res = await api.get(`/api/merchant-config/${key}`);
            return [key, res.data?.configValue ?? ""]; // <-- change field name if your entity differs
          } catch (error) {
            const status = error.response?.status;
            if (status === 401) unauthorized = true;
            else if (status !== 404) failedCount += 1; // 404 = key not created yet -> empty
            return [key, ""];
          }
        })
      );

      if (ignore) return;

      if (unauthorized) {
        toast.error("⚠️ Session expired, please log in again");
        navigate("/login");
        return;
      }
      if (failedCount > 0) {
        toast.error(`❌ Failed to load ${failedCount} setting(s)`);
      }

      const loaded = Object.fromEntries(entries);
      setValues(loaded);
      setOriginal(loaded);
      setLoading(false);
    };

    load();
    return () => {
      ignore = true;
    };
  }, [navigate]);

  const changedKeys = useMemo(
    () => ALL_KEYS.filter((key) => values[key] !== original[key]),
    [values, original]
  );

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleReset = () => setValues(original);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.merchant_brand_name.trim()) {
      toast.error("❌ Brand name is required");
      return;
    }
    if (changedKeys.length === 0) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);

    // Only the changed keys are sent, one request per key
    const results = await Promise.all(
      changedKeys.map(async (key) => {
        const value = values[key].trim();
        try {
          await api.post("/api/merchant-config", { key, value });
          return { key, value, ok: true };
        } catch (error) {
          console.error(`Error saving "${key}":`, error);
          return { key, ok: false, error };
        }
      })
    );

    setSaving(false);

    const saved = results.filter((r) => r.ok);
    const failed = results.filter((r) => !r.ok);

    if (saved.length > 0) {
      const savedValues = Object.fromEntries(saved.map((r) => [r.key, r.value]));
      setValues((prev) => ({ ...prev, ...savedValues }));
      setOriginal((prev) => ({ ...prev, ...savedValues }));
      // Make the Footer / Contact page pick up the new values right away
      invalidateMerchantConfig(saved.map((r) => r.key));
    }

    if (failed.some((r) => r.error?.response?.status === 401)) {
      toast.error("⚠️ Session expired, please log in again");
      navigate("/login");
      return;
    }

    if (failed.length > 0) {
      const apiMessage = failed[0].error?.response?.data?.message;
      const names = failed.map((r) => LABELS[r.key]).join(", ");
      toast.error(
        `❌ Failed to save: ${names}${typeof apiMessage === "string" ? ` (${apiMessage})` : ""}`
      );
    } else {
      toast.success("✅ Settings saved successfully!");
    }
  };

  const inputClass =
    "w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400";

  return (
    <div dir="ltr" className="bg-neutral-50 p-4 md:p-8 flex items-start justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 w-full max-w-3xl p-6 md:p-8 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Store Settings
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Contact details shown on the website
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="text-neutral-600 text-sm tracking-wider uppercase mb-2">Loading</div>
            <div className="w-full h-px bg-neutral-200 mt-4 animate-pulse"></div>
            <div className="mt-4 text-neutral-500 text-sm">Fetching store settings...</div>
          </div>
        ) : (
          <>
            {SECTIONS.map((section, index) => (
              <div
                key={section.title}
                className={index > 0 ? "mt-8 pt-8 border-t border-neutral-200" : ""}
              >
                <h3 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mb-4">
                  {section.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.fields.map((field) => {
                    const isDirty = values[field.key] !== original[field.key];
                    return (
                      <div
                        key={field.key}
                        className={`flex flex-col gap-1.5 ${field.wide ? "md:col-span-2" : ""}`}
                      >
                        <label
                          htmlFor={field.key}
                          className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-2"
                        >
                          <span>
                            {field.label}
                            {field.required && <span className="text-neutral-400"> *</span>}
                          </span>
                          {isDirty && (
                            <span className="text-neutral-900 normal-case tracking-normal text-[10px]">
                              • edited
                            </span>
                          )}
                        </label>
                        <input
                          id={field.key}
                          type={field.type}
                          name={field.key}
                          value={values[field.key]}
                          onChange={handleChange}
                          required={field.required}
                          placeholder={field.placeholder}
                          className={inputClass}
                        />
                        {field.hint && (
                          <p className="text-[11px] text-neutral-400">{field.hint}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving || changedKeys.length === 0}
                className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : changedKeys.length > 0
                  ? `Save Changes (${changedKeys.length})`
                  : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={saving || changedKeys.length === 0}
                className="sm:w-40 border border-neutral-200 text-neutral-700 py-3.5 hover:bg-neutral-100 transition-colors duration-200 text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Discard
              </button>
            </div>
          </>
        )}
      </form>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MerchantSettings;