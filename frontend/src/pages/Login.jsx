import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "@/Context/AuthContext";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // Declared before the try/catch so it's reachable from both branches
    const redirectState = location.state || {};

    try {

      const data = await login(formData.email, formData.password);
      if (data.body.role === "ADMIN") {
        navigate("/admin");
      } else if (data.body.role === "EXECUTIVE") {
        navigate("/executive");
      } else {
        navigate(redirectState.from || "/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(
        err.response?.status === 401
          ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
          : err.response?.data?.message || err.message || "حدث خطأ ما"      );
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