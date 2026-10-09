"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const AddBannerPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    position: "", // ✅ using correct key for backend
    banner_image: null,
    target_url: "",
    is_active: false,
    rawImage: null,
  });

  const [loading, setLoading] = useState(false);

  // Handle text, select, checkbox
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

  // Remove selected image
  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      banner_image: null,
      rawImage: null,
    }));
  };

  // Validation
  const validateForm = () => {
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
      toast.error("❌ The target URL must be a valid URL.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("position", formData.position);
    data.append("target_url", formData.target_url);
    data.append("is_active", formData.is_active ? 1 : 0);

    if (formData.rawImage) {
      data.append("banner_image", formData.rawImage);
    }

    try {
      const response = await axios.post(
        "https://coombb.com/backend/api/banners",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // ✅ SUCCESS HANDLE
      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: response.data.message || "Banner created successfully!",
          confirmButtonColor: "#d33",
        }).then(() => {
          navigate("/content");
        });
      } else {
        // ⚠️ API responded but success = false
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("API Error:", error);

      // ❌ FAILURE HANDLE (IMPORTANT PART)
      if (error.response) {
        // Server responded with error (4xx, 5xx)
        const msg =
          error.response.data?.message ||
          error.response.data?.error ||
          "Server error occurred";

        toast.error(`❌ ${msg}`);

        // Optional: handle validation errors
        if (error.response.data?.errors) {
          Object.values(error.response.data.errors).forEach((errArr) => {
            errArr.forEach((msg) => toast.error(msg));
          });
        }
      } else if (error.request) {
        // No response from server
        toast.error("❌ No response from server. Check your internet.");
      } else {
        // Something else
        toast.error("❌ Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Add Banner</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ✅ Position Dropdown exactly as you asked */}

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
        <div>
          <label className="text-sm font-medium">Banner Position</label>
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
              <div className="relative w-full">
                <img
                  src={formData.banner_image}
                  alt="Preview"
                  className="w-full h-80 object-contain rounded border shadow"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
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

        {/* Is Active */}
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
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
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

export default AddBannerPage;
