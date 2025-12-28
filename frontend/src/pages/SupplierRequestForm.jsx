import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const SupplierRequestForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "الاسم مطلوب.";
    if (!form.company.trim()) newErrors.company = "اسم الشركة مطلوب.";
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "البريد الإلكتروني غير صالح.";
    if (!/^01[0-9]{9}$/.test(form.phone)) newErrors.phone = "رقم الهاتف يجب أن يكون 11 رقمًا مصريًا صحيحًا.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/supplier/addRequest`, form, {
        headers: { "Content-Type": "application/json" }
      });
      toast.success("تم إرسال الطلب بنجاح!");

      setTimeout(() => {
        navigate("/"); // إعادة التوجيه للصفحة الرئيسية بعد الإشعار
      }, 2000);

    } catch (err) {
      toast.error("فشل في إرسال الطلب. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container} dir="rtl">
      <h2 style={styles.heading}>هل أنت مورد؟</h2>
      <p style={styles.subText}>يرجى ملء جميع الحقول التالية لتقديم طلبك</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label>الاسم الكامل</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.name && <p style={styles.error}>{errors.name}</p>}
        </div>

        <div style={styles.inputGroup}>
          <label>اسم الشركة</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.company && <p style={styles.error}>{errors.company}</p>}
        </div>

        <div style={styles.inputGroup}>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
          />
          {errors.email && <p style={styles.error}>{errors.email}</p>}
        </div>

        <div style={styles.inputGroup}>
          <label>رقم الهاتف</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            style={styles.input}
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && <p style={styles.error}>{errors.phone}</p>}
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "جاري الإرسال..." : "إرسال الطلب"}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
    textAlign: "right"
  },
  heading: {
    textAlign: "center",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "bold",
    fontSize: "22px"
  },
  subText: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#666",
    fontSize: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginTop: "5px"
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginTop: "5px"
  },
  button: {
    padding: "12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px"
  }
};

export default SupplierRequestForm;
