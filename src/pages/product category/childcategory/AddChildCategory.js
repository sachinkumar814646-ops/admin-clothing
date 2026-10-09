import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import RichTextEditor from "../../../components/common/RichTextEditor";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Swal from "sweetalert2";

const AddChildCategory = () => {
  const navigate = useNavigate();

  const [headCategories, setHeadCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [filteredParentCategories, setFilteredParentCategories] = useState([]);
  const [selectedHeadId, setSelectedHeadId] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // Fetch head & parent categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [headsRes, parentsRes] = await Promise.all([
          axios.get(
            "https://coombb.com/backend/api/product-categories?all=true",
          ),
          axios.get(
            "https://coombb.com/backend/api/product-sub-categories?all=true",
          ),
        ]);

        setHeadCategories(headsRes.data?.data || []);
        setParentCategories(parentsRes.data?.data || []);
      } catch (error) {
        toast.error("Failed to load categories. Please try again.");
        console.error("API fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Filter parents when head is selected
  useEffect(() => {
    if (selectedHeadId) {
      setFilteredParentCategories(
        parentCategories.filter(
          (p) => p.product_category_id?.toString() === selectedHeadId,
        ),
      );
    } else {
      setFilteredParentCategories([]);
    }
  }, [selectedHeadId, parentCategories]);

  // Auto-generate slug from name
  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setSlug(generatedSlug);
  }, [name]);

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z0-9]+(?:\s*[,'&/-]?\s*[A-Za-z0-9]+)*$/;

    if (!selectedHeadId) newErrors.head = "Please select a head category.";
    if (!parentCategoryId)
      newErrors.parent = "Please select a parent category.";
    if (!name.trim()) newErrors.name = "Name is required.";
    else if (!nameRegex.test(name))
      newErrors.name = "Name should only contain letters and spaces.";
    if (!slug.trim()) newErrors.slug = "Slug is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((err) => toast.error(err));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newChild = {
      product_category_id: selectedHeadId,
      product_subcategory_id: parentCategoryId,
      name,
      slug,
      description,
    };

    try {
      Swal.fire({
        title: "Saving...",
        text: "Please wait while we add the child category",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        "https://coombb.com/backend/api/product-child-categories",
        newChild,
      );

      Swal.close();

      // ✅ Check API success flag OR status
      if (
        response?.data?.success === true &&
        (response.status === 200 || response.status === 201)
      ) {
        toast.success(
          response?.data?.message || "Child category added successfully!",
        );

        setTimeout(() => {
          navigate("/childcategory");
        }, 1500);
      } else {
        // ⚠️ API responded but not success
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      Swal.close();

      console.error("Submit error:", error);

      // ✅ Handle different error types
      if (error.response) {
        // Server responded with error (4xx / 5xx)
        const message =
          error.response.data?.message || "Server error. Please try again.";

        // ✅ Handle validation errors (422)
        if (error.response.status === 422 && error.response.data?.errors) {
          const errors = error.response.data.errors;

          Object.keys(errors).forEach((key) => {
            errors[key].forEach((msg) => toast.error(msg));
          });
        } else {
          toast.error(message);
        }
      } else if (error.request) {
        // No response received
        toast.error("No response from server. Check your internet.");
      } else {
        // Something else
        toast.error("Unexpected error occurred.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 dark:text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Add Child Category</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 dark:bg-gray-800 rounded-lg p-6"
      >
        {/* Head Category */}
        <div>
          <label
            htmlFor="headCategory"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Head Category <span className="text-red-500">*</span>
          </label>
          <select
            id="headCategory"
            value={selectedHeadId}
            onChange={(e) => setSelectedHeadId(e.target.value)}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 ${
              errors.head ? "border-red-500" : ""
            }`}
          >
            <option value="">Select a Head Category</option>
            {headCategories.map((head) => (
              <option key={head.id} value={head.id}>
                {head.name}
              </option>
            ))}
          </select>
        </div>

        {/* Parent Category */}
        <div>
          <label
            htmlFor="parentCategory"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Parent Category <span className="text-red-500">*</span>
          </label>
          <select
            id="parentCategory"
            value={parentCategoryId}
            onChange={(e) => setParentCategoryId(e.target.value)}
            className={`w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 ${
              errors.parent ? "border-red-500" : ""
            }`}
            disabled={!selectedHeadId || filteredParentCategories.length === 0}
          >
            <option value="">Select a Parent Category</option>
            {filteredParentCategories.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div>
          <label
            htmlFor="childCategoryName"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="childCategoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${errors.name ? "border-red-500" : ""} w-full`}
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Slug <span className="text-red-500">*</span>
          </label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={`${errors.slug ? "border-red-500" : ""} w-full`}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description
          </label>
          <RichTextEditor value={description} onChange={setDescription} />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/childcategory")}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            Save
          </Button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AddChildCategory;
