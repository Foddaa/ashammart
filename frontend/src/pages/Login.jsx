import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { Token, setToken, userRole, setUserRole } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${BASE_URL}/api/auth/login`, formData);

      if (data?.message === "success") {
        setSuccessMsg("تم تسجيل الدخول بنجاح");
        setUserRole(data?.Role);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data?.Role);
        setToken(data.token);

        const redirectState = location.state || {};

        if (redirectState.redirectReason === "add-to-cart" && redirectState.productId) {
          navigate(redirectState.from || `/product/${redirectState.productId}`, {
            state: {
              productId: redirectState.productId,
              background: redirectState.background,
              autoAddToCart: true,
              comment: redirectState.comment || "",
              quantityToAdd: redirectState.quantityToAdd || 1,
            },
            replace: true,
          });
        } else if (data.Role === "ADMIN") {
          navigate("/admin");
        } else if (data.Role === "EXECUTIVE") {
          navigate("/executive");
        } else {
          navigate(redirectState.from || "/");
        }
      } else {
        const destination =
          redirectState.from && redirectState.from !== "/login" ? redirectState.from : "/";
        navigate(destination);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.response?.data?.message || err.message || "حدث خطأ ما");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="w-full h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl text-center w-[90%] sm:w-[60%] md:w-[500px] h-[60%] flex flex-col justify-center"
      >
        <h2 className="text-2xl font-semibold mb-5">تسجيل الدخول</h2>

        {successMsg && <p className="text-green-700 font-semibold my-4">{successMsg}</p>}
        {errorMsg && <p className="text-red-600 font-semibold my-4">{errorMsg}</p>}

        <input
          placeholder="البريد الإلكتروني"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 rounded mb-4 border border-gray-300 text-right"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 rounded mb-4 border border-gray-300 text-right"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {isLoading ? <i className="fas fa-spinner fa-spin"></i> : "تسجيل الدخول"}
        </button>

        <div className="mt-4">
          <p>ليس لديك حساب؟ اضغط هنا</p>
          <Link className="text-blue-500" to={"/Register"}>
            تسجيل حساب جديد
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
