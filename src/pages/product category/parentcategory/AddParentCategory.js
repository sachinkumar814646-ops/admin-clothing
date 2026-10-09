import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import RichTextEditor from "../../../components/common/RichTextEditor";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2"; // ✅ Added SweetAlert2
import "react-toastify/dist/ReactToastify.css";

const AddParentCategory = () => {
  const navigate = useNavigate();
  const [headCategories, setHeadCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  // ✅ Fetch head categories from API on mount
  useEffect(() => {
    fetch("https://coombb.com/backend/api/product-categories")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch head categories");
        }
        return res.json();
      })
      .then((data) => {
        setHeadCategories(data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error("Failed to load head categories");
      });
  }, []);

  // ✅ Generate slug from name input
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  }, [name]);

  // ✅ Handle form submit with API call
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const nameRegex = /^[A-Za-z0-9]+(?:\s*[,'&/-]?\s*[A-Za-z0-9]+)*$/;
    if (!nameRegex.test(name)) {
      toast.error("Name should only contain letters and spaces!");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (!slug.trim()) {
      toast.error("Slug cannot be empty.");
      return;
    }

    const form = e.target;

    const payload = {
      product_category_id: form.headCategory.value,
      name,
      slug,
      description,
    };

    Swal.fire({
      title: "Saving Category...",
      text: "Please wait while we save your category.",
      allowOutsideClick: false,
      background: "#ffff",
      color: "#dc2626",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch("https://coombb.com/backend/api/product-sub-categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();

        // ❌ HTTP error (4xx / 5xx)
        if (!res.ok) {
          // ✅ Validation errors (422)
          if (res.status === 422 && data?.errors) {
            Object.values(data.errors)
              .flat()
              .forEach((msg) => {
                toast.error(msg);
              });
          } else {
            toast.error(data?.message || "Failed to add parent category");
          }

          throw new Error("API_ERROR");
        }

        return data;
      })
      .then((data) => {
        Swal.close();

        // ✅ Logical success check
        if (data?.success) {
          toast.success(data?.message || "Parent category added successfully!");

          setTimeout(() => {
            navigate("/parentcategory");
          }, 1500);
        } else {
          // ⚠️ API responded but failed logically
          toast.error(data?.message || "Something went wrong!");
        }
      })
      .catch((error) => {
        Swal.close();

        console.error("Error:", error);

        // ✅ Network / unexpected errors
        if (error.message !== "API_ERROR") {
          toast.error("No response from server. Check your internet.");
        }
      });
  };

  return (
    <div className="max-w-3xl mx-auto p-6 dark:text-white">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Parent Category</h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 dark:bg-gray-800 rounded-lg p-6"
      >
        {/* Head Category */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="headCategory"
            className="sm:w-40 font-medium text-gray-700 dark:text-gray-300"
          >
            Head Category
          </label>
          <select
            id="headCategory"
            name="headCategory"
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">Select a Head Category</option>
            {headCategories.map((head) => (
              <option key={head.id} value={head.id}>
                {head.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="parentCategoryName"
            className="sm:w-40 font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <Input
            id="parentCategoryName"
            name="parentCategoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label
            htmlFor="slug"
            className="sm:w-40 font-medium text-gray-700 dark:text-gray-300"
          >
            Slug
          </label>
          <Input
            id="slug"
            name="slug"
            value={slug}
            readOnly
            className="flex-1 bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col sm:flex-row gap-3">
          <label
            htmlFor="description"
            className="sm:w-40 font-medium text-gray-700 dark:text-gray-300 pt-2"
          >
            Description
          </label>
          <div className="flex-1">
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/parentcategory")}
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddParentCategory;
