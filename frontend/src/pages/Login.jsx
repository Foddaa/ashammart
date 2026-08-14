import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "@/context/AuthContext";

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
          ? "Invalid email or password"
          : err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="ltr">
      <form
        onSubmit={handleLogin}
        className="bg-white border border-neutral-200 w-full max-w-md p-8 flex flex-col"
      >
        {/* Editorial Header */}
        <div className="border-b border-neutral-200 pb-6 mb-6">
          <h1 className="text-xl font-light tracking-wide text-neutral-900">
            Sign in
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Welcome back. Please enter your details.
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 border border-red-400 bg-red-50 p-3 text-sm text-red-700 flex items-center gap-3">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="flex flex-col gap-1 mb-4">
          <input
            type="text"
            placeholder="Email address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1 mb-6">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 mx-auto text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            "Sign in"
          )}
        </button>

        {/* Footer Link */}
        <div className="mt-6 text-center text-[10px] uppercase tracking-wider text-neutral-400">
          <span className="mr-1">Don't have an account?</span>
          <Link to="/Register" className="text-neutral-900 underline-offset-2 hover:underline transition-colors">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;