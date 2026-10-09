import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // ✅ Added missing import
import RichTextEditor from "../../../components/common/RichTextEditor"; // adjust path
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { ToastContainer } from "react-toastify";

const API_BASE = "https://coombb.com/backend/api/product-categories";

export default function EditHeadCategoryPage() {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loader state added
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load existing category data
  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;

        setName(data.name || "");
        setSlug(data.slug || "");
        setDescription(data.description || "");
      })
      .catch((err) => {
        toast.error("Failed to load category");
        console.error(err.response?.data || err.message);
      });
  }, [id, token]);

  // Auto-generate slug from name, but allow manual edits as well
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

    // ✅ Empty check first
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    // ✅ Regex validation after empty check
    const namePattern = /^[A-Za-z0-9]+(?:\s*[,'&/-]?\s*[A-Za-z0-9]+)*$/;

    if (!namePattern.test(name.trim())) {
      toast.error(
        "Category name can only contain letters, spaces, commas, &, and hyphens.",
      );
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug cannot be empty.");
      return;
    }

    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Updating Category...",
        text: "Please wait while we update your category.",
        allowOutsideClick: false,
        background: "#ffff",
        color: "#dc2626",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.put(
        `${API_BASE}/${id}`,
        { name, slug, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      Swal.close();
      setLoading(false);

      if (response?.data?.success === true && response.status === 200) {
        toast.success(
          response?.data?.message || "Category updated successfully!",
        );

        setTimeout(() => {
          navigate("/headcategory");
        }, 800);
      } else {
        toast.error(response?.data?.message || "Update failed!");
      }
    } catch (error) {
      Swal.close();
      setLoading(false);

      console.error("PUT error:", error.response?.data || error.message);

      if (error.response) {
        const message =
          error.response.data?.message || "Server error. Please try again.";

        // ✅ Laravel validation errors
        if (error.response.status === 422) {
          // If errors object exists
          if (error.response.data?.errors) {
            const errors = error.response.data.errors;

            Object.keys(errors).forEach((key) => {
              errors[key].forEach((msg) => toast.error(msg));
            });
          } else {
            // ✅ Single message handling
            toast.error(message);
          }
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
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-5 dark:text-white">
          Edit Main Category
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
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block mb-1 font-medium dark:text-gray-300"
            >
              Slug
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Auto-generated slug"
              readOnly
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
              value={description}
              initialContent={description}
              onChange={setDescription}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/headcategory")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
