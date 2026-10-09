import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2"; // ✅ SweetAlert2 import
import RichTextEditor from "../../../components/common/RichTextEditor"; // adjust path
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = "https://coombb.com/backend/api/product-categories";

export default function AddHeadCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loader state added
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    } else {
      setSlug("");
    }
  }, [name]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const namePattern = /^[A-Za-z0-9]+(?:\s*[,'&/-]?\s*[A-Za-z0-9]+)*$/; // ✅ Updated regex to allow commas and hyphens
    if (!namePattern.test(name.trim())) {
      toast.error(
        "Category name can only contain letters, numbers, spaces, and hyphens.",
      );
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Saving Product...",
        text: "Please wait while we save your product.",
        allowOutsideClick: false,
        background: "#ffff",
        color: "#dc2626",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        API_BASE,
        { name, slug, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.close();
      setLoading(false);

      // ✅ Proper success handling
      if (
        response?.data?.success === true &&
        (response.status === 200 || response.status === 201)
      ) {
        toast.success(
          response?.data?.message || "Category added successfully!",
        );

        setTimeout(() => {
          navigate("/headcategory");
        }, 800);
      } else {
        // ⚠️ Logical failure from API
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      Swal.close();
      setLoading(false);

      console.error("Error Response:", error.response?.data || error.message);

      // ✅ Detailed error handling
      if (error.response) {
        const message =
          error.response.data?.message || "Server error. Please try again.";

        // ✅ Validation errors (422)
        if (error.response.status === 422 && error.response.data?.errors) {
          const errors = error.response.data.errors;

          Object.keys(errors).forEach((key) => {
            errors[key].forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(message);
        }
      } else if (error.request) {
        toast.error("No response from server. Check your internet.");
      } else {
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto  dark:bg-gray-800 p-6 rounded-lg ">
        <h1 className="text-2xl font-bold mb-5 dark:text-white">
          Main Head Category
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block mb-1 font-medium dark:text-gray-300"
            >
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              required
              className="dark:text-white"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block mb-1 font-medium dark:text-white"
            >
              Slug
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Auto-generated slug"
              required
              className="dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-1 font-medium dark:text-gray-300"
            >
              Description
            </label>
            <RichTextEditor
              initialContent={description}
              onChange={setDescription}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              className="dark:text-white"
              type="button"
              variant="outline"
              onClick={() => navigate("/headcategory")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={loading} // ✅ Disable when loading
            >
              {loading ? "Saving..." : "Add Category"}
            </Button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
