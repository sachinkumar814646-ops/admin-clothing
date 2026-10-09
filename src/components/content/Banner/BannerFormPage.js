"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BannerFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Banner ID from route for edit
  const [formData, setFormData] = useState({
    title: "",
    position: "",
    banner_image: null, // For preview
    rawImage: null, // Actual file to upload
    target_url: "",
    is_active: false,
  });
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  // Fetch banner data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios
        .get(`https://coombb.com/backend/api/banners/${id}`)
        .then((res) => {
          const data = res.data.data;

          setFormData({
            title: data.title || "",
            position: data.position || "",
            banner_image: data.banner_image || null,
            rawImage: null,
            target_url: data.target_url || "",
            is_active: !!data.is_active,
          });
        })
        .catch((err) => {
          console.error(err);
          toast.error("❌ Failed to fetch banner data.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditing]);

  // Handle text/select/checkbox change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload + preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        banner_image: URL.createObjectURL(file),
        rawImage: file,
      }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const placementRegex = /^[A-Za-z\s-]+$/;
    const urlRegex =
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;

    if (!formData.title) {
      toast.error("❌ Please enter a title.");
      return false;
    }

    if (!formData.position) {
      toast.error("❌ Please select a banner position.");
      return false;
    }
    if (formData.target_url && !urlRegex.test(formData.target_url)) {
      toast.error("❌ Target URL must be a valid URL.");
      return false;
    }
    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("position", formData.position);
    data.append("target_url", formData.target_url);
    data.append("is_active", formData.is_active ? 1 : 0);
    if (formData.rawImage) data.append("banner_image", formData.rawImage);

    setLoading(true);
    try {
      if (isEditing) {
        const response = await axios.post(
          `https://coombb.com/backend/api/banners/${id}?_method=PUT`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        // ✅ SUCCESS HANDLE
        if (response?.data?.success) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message || "Banner updated successfully!",
            confirmButtonColor: "#d33",
          }).then(() => {
            navigate("/content");
          });
        } else {
          // ⚠️ API responded but success = false
          toast.error(response?.data?.message || "Something went wrong!");
        }
      } else {
        await axios.post("https://coombb.com/backend/api/banners", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire({
          icon: "success",
          title: "Banner created successfully!",
          confirmButtonColor: "#dc2626",
        }).then(() => navigate("/content"));
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to save banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Banner" : "Add Banner"}
      </h1>

      {loading && <p className="mb-4 text-sm text-gray-500">Loading...</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter your title"
            className="w-full"
          />
        </div>
        {/* ✅ Position Dropdown */}
        <div>
          <label className="text-sm font-medium">
            Banner Position<span className="text-red-500">*</span>
          </label>
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full border rounded p-2 focus:outline-none focus:ring focus:ring-red-300 bg-white dark:bg-transparent dark:text-white"
          >
            <option value="">-- Select Position --</option>
            <option value="top_banner">Top Banner</option>
          </select>
        </div>

        {/* Banner Image */}
        <div>
          <label className="text-sm font-medium">Banner Image</label>
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer w-full"
            />
            {formData.banner_image && (
              <img
                src={formData.banner_image}
                alt="Preview"
                className="w-full h-80 object-contain rounded border"
              />
            )}
          </div>
        </div>

        {/* Target URL */}
        <div>
          <label className="text-sm font-medium">Target URL</label>
          <Input
            name="target_url"
            value={formData.target_url}
            onChange={handleInputChange}
            placeholder="Enter target URL"
            className="w-full"
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={formData.is_active}
            onChange={handleInputChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/content")}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 flex justify-center items-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : isEditing ? (
              "Update Banner"
            ) : (
              "Create Banner"
            )}
          </Button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default BannerFormPage;
