import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/Context/AuthContext';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
            const { data } = await axios.post(`${BASE_URL}/api/auth/signup`, payload);
            if (data?.token) {
                localStorage.setItem("token", data.token);
                setToken(data.token);
                setTimeout(() => navigate("/"), 1500);
            } else {
                setApiError(data?.message || 'حدث خطأ غير متوقع');
            }
        } catch (error) {
            const serverMessage = error?.response?.data?.message;
            setApiError(serverMessage || 'فشل التسجيل');
        } finally {
            setIsLoading(false);
        }
    }

    const validationSchema = yup.object().shape({
        name: yup.string().required('الاسم مطلوب').min(3, 'الحد الأدنى 3 أحرف').max(20, 'الحد الأقصى 20 حرفًا'),
        email: yup.string().required('البريد الإلكتروني مطلوب').email('يرجى إدخال بريد إلكتروني صحيح'),
        password: yup
            .string()
            .required('كلمة المرور مطلوبة')
            .matches(/^[A-Z][a-z]{5,10}$/, 'يجب أن تبدأ بحرف كبير وتتبعها 5-10 أحرف صغيرة'),
        confirmPassword: yup
            .string()
            .required('تأكيد كلمة المرور مطلوب')
            .oneOf([yup.ref('password')], 'كلمتا المرور غير متطابقتين'),
        phone: yup
            .string()
            .required('رقم الهاتف مطلوب')
            .matches(/^01[1250][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        },
        validationSchema,
        onSubmit: handleRegister,
    });

    return (
        <>
            {apiError && (
                <div dir="rtl" className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 w-[90%] max-w-md m-auto mt-6">
                    {apiError}
                </div>
            )}

            <div dir="rtl" className="container py-8 flex justify-center items-center h-screen">
                <form
                    onSubmit={formik.handleSubmit}
                    className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md"
                >
                    <h2 className="text-xl text-blue-500 font-semibold mb-4 text-center">إنشاء حساب جديد</h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 text-right"
                            placeholder="الاسم"
                        />
                        {formik.errors.name && formik.touched.name && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 text-right"
                            placeholder="البريد الإلكتروني"
                        />
                        {formik.errors.email && formik.touched.email && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.email}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 text-right"
                            placeholder="كلمة المرور"
                        />
                        {formik.errors.password && formik.touched.password && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 text-right"
                            placeholder="تأكيد كلمة المرور"
                        />
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            className="w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none py-2 px-1 text-right"
                            placeholder="رقم الهاتف"
                        />
                        {formik.errors.phone && formik.touched.phone && (
                            <div className="text-red-600 text-sm mt-1">{formik.errors.phone}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? <i className="fa fa-spinner fa-spin" /> : 'تسجيل'}
                    </button>
                </form>
            </div>
        </>
    );
}
