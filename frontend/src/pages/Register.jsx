import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link here!
import { UserContext } from '@/context/AuthContext';
import api from '@/api/axiosInstance';

export default function Register() {
    const navigate = useNavigate();
    const { setToken } = useContext(UserContext);
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleRegister(values) {
        setIsLoading(true);
        setApiError('');

        const { confirmPassword, ...payload } = values;

        try {
            const { data } = await api.post('/api/auth/signup', payload);
            if (data?.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setTimeout(() => navigate("/"), 1500);
            } else {
                setApiError(data?.message || 'An unexpected error occurred');
            }
        } catch (error) {
            const serverMessage = error?.response?.data?.message;
            setApiError(serverMessage || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required').min(3, 'Minimum 3 characters').max(20, 'Maximum 20 characters'),
        email: yup.string().required('Email is required').email('Please enter a valid email'),
        password: yup
            .string()
            .required('Password is required')
            .matches(/^[A-Z][a-z]{5,10}$/, 'Must start with an uppercase letter followed by 5-10 lowercase letters'),
        confirmPassword: yup
            .string()
            .required('Confirm password is required')
            .oneOf([yup.ref('password')], 'Passwords do not match'),
        phone: yup
            .string()
            .required('Phone number is required')
            .matches(/^01[1250][0-9]{8}$/, 'Please enter a valid Egyptian phone number'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
            role: "USER",
        },
        validationSchema,
        onSubmit: handleRegister,
    });

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4" dir="ltr">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white border border-neutral-200 w-full max-w-md p-6 md:p-8 flex flex-col"
            >
                {/* Editorial Header */}
                <div className="border-b border-neutral-200 pb-4 mb-6">
                    <h2 className="text-xl font-light tracking-wide text-neutral-900">
                        Create an account
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                        Enter your details to get started
                    </p>
                </div>

                {/* API Error Message */}
                {apiError && (
                    <div className="mb-4 border border-red-400 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-3">
                        <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>{apiError}</span>
                    </div>
                )}

                {/* Name */}
                <div className="flex flex-col gap-1 mb-4">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                        placeholder="Full Name"
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div className="text-xs text-red-500 mt-1 tracking-wide">{formik.errors.name}</div>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1 mb-4">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                        placeholder="Email address"
                    />
                    {formik.errors.email && formik.touched.email && (
                        <div className="text-xs text-red-500 mt-1 tracking-wide">{formik.errors.email}</div>
                    )}
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1 mb-4">
                    <input
                        type="password"
                        name="password"
                        id="password"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                        placeholder="Password"
                    />
                    {formik.errors.password && formik.touched.password && (
                        <div className="text-xs text-red-500 mt-1 tracking-wide">{formik.errors.password}</div>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1 mb-4">
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                        placeholder="Confirm Password"
                    />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                        <div className="text-xs text-red-500 mt-1 tracking-wide">{formik.errors.confirmPassword}</div>
                    )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1 mb-6">
                    <input
                        type="tel"
                        name="phone"
                        id="phone"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className="w-full border-b border-neutral-300 px-4 py-3 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
                        placeholder="Phone number"
                    />
                    {formik.errors.phone && formik.touched.phone && (
                        <div className="text-xs text-red-500 mt-1 tracking-wide">{formik.errors.phone}</div>
                    )}
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
                        'Sign up'
                    )}
                </button>

                {/* Footer Link */}
                <div className="mt-6 text-center text-[10px] uppercase tracking-wider text-neutral-400">
                    <span className="mr-1">Already have an account?</span>
                    <Link to="/login" className="text-neutral-900 underline-offset-2 hover:underline transition-colors">
                        Sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}