import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/Context/AuthContext";
import { Button, TextField } from "@mui/material";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const UserProfilePage = () => {
  const { Token } = useContext(UserContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openEdit, setOpenEdit] = useState(false);
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [addressId, setAddressId] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!Token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/client/getProfile`, {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        });

        const user = res.data;
        setProfile(user);
        setCity(user.address?.city || "");
        setDescription(user.address?.description || "");
        setAddressId(user.address?.id || "");
      } catch (err) {
        console.error("حدث خطأ أثناء جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [Token, navigate]);

  const handleOpenEdit = () => {
    setOpenEdit((prev) => !prev);
  };

  const handleSave = async () => {
    try {
      const updatedProfile = {
        ...profile,
        address: {
          id: parseInt(addressId) || 0,
          city,
          description,
        },
      };

      const res = await axios.put(`${BASE_URL}/api/client/updateClient`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      setProfile(res.data);
      setOpenEdit(false);
    } catch (err) {
      console.error("حدث خطأ أثناء التحديث:", err);
    }
  };

  if (loading) return <p className="text-center text-lg">جاري التحميل...</p>;
  if (!profile) return <p className="text-center text-red-500">فشل في تحميل البيانات.</p>;

  return (
    <div dir="rtl" className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-xl p-6 text-right">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">البيانات الشخصية</h2>
        {!openEdit && (
          <Button variant="outlined" onClick={handleOpenEdit}>
            تعديل
          </Button>
        )}
      </div>

      {openEdit ? (
        <div className="space-y-4">
          <TextField
            label="الاسم"
            name="name"
            value={profile.name}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ style: { textAlign: "right" } }}
          />
          <TextField
            label="البريد الإلكتروني"
            name="email"
            value={profile.email}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ style: { textAlign: "right" } }}
          />
          <TextField
            label="رقم الهاتف"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ style: { textAlign: "right" } }}
          />

          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-1">
              المحافظة
            </label>
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 border rounded-md max-h-40 text-right"
            >
              <option value="">اختر المحافظة</option>
              {[
                "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية",
                "القليوبية", "الغربية", "كفر الشيخ", "البحيرة", "الفيوم", "بني سويف",
                "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "دمياط",
                "بورسعيد", "الإسماعيلية", "السويس", "شمال سيناء", "جنوب سيناء", "الوادي الجديد",
                "مطروح", "البحر الأحمر"
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <TextField
            label="العنوان بالتفصيل"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            inputProps={{ style: { textAlign: "right" } }}
          />
          <Button variant="contained" color="primary" onClick={handleSave}>
            حفظ
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <span className="font-semibold">الاسم:</span> {profile.name}
          </div>
          <div>
            <span className="font-semibold">البريد الإلكتروني:</span> {profile.email}
          </div>
          <div>
            <span className="font-semibold">رقم الهاتف:</span> {profile.phone}
          </div>
          <div>
            <span className="font-semibold">المحافظة:</span> {city}
          </div>
          <div>
            <span className="font-semibold">العنوان بالتفصيل:</span> {description}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
