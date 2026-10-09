import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddShippingMethod() {
  const navigate = useNavigate();
  const { id } = useParams();

  // If id exists -> Edit mode
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [delivery_time, setDeliveryTime] = useState("");
  const [price, setPrice] = useState("");
  const [free_shipping_threshold, setFreeShippingThreshold] = useState("");
  const [is_active, setIsActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Generate code from name
  const generateCode = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==============================
  // Fetch Shipping Method for Edit
  // ==============================
  useEffect(() => {
    if (!isEditMode) return;

    const fetchShippingMethod = async () => {
      setFetching(true);

      try {
        const res = await fetch(
          `https://coombb.com/backend/api/shipping-methods/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();

        console.log("Shipping Method Response:", data);

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch shipping method");
        }

        // Supports either:
        // data.data
        // or directly data
        const shippingMethod = data.data || data;

        setName(shippingMethod.name || "");
        setCode(shippingMethod.code || "");
        setDeliveryTime(shippingMethod.delivery_time || "");
        setPrice(shippingMethod.price ?? "");

        setFreeShippingThreshold(shippingMethod.free_shipping_threshold ?? "");

        // Backend may return true/false OR 1/0
        setIsActive(
          shippingMethod.is_active === true ||
            shippingMethod.is_active === 1 ||
            shippingMethod.is_active === "1",
        );
      } catch (error) {
        console.error("Error fetching shipping method:", error);

        toast.error(error.message || "Failed to load shipping method ❌", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setFetching(false);
      }
    };

    fetchShippingMethod();
  }, [id, isEditMode]);

  // ==============================
  // Submit Add / Edit
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const shippingMethod = {
      name,
      code,
      delivery_time,
      price: Number(price),

      free_shipping_threshold:
        free_shipping_threshold === "" ? null : Number(free_shipping_threshold),

      // Send boolean
      is_active: Boolean(is_active),
    };

    try {
      const url = isEditMode
        ? `https://coombb.com/backend/api/shipping-methods/${id}`
        : "https://coombb.com/backend/api/shipping-methods";

      const res = await fetch(url, {
        method: isEditMode ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(shippingMethod),
      });

      const data = await res.json();

      console.log("API Response:", data);

      if (!res.ok) {
        throw new Error(
          data.message ||
            `Failed to ${isEditMode ? "update" : "save"} shipping method`,
        );
      }

      if (data.success) {
        toast.success(
          data.message ||
            `Shipping method ${isEditMode ? "updated" : "saved"} successfully!`,
          {
            position: "top-right",
            autoClose: 2000,
          },
        );

        setTimeout(() => {
          navigate("/shipping-methods");
        }, 2200);
      } else {
        toast.error(
          data.message ||
            `Failed to ${isEditMode ? "update" : "save"} shipping method ❌`,
          {
            position: "top-right",
            autoClose: 3000,
          },
        );

        // Validation errors
        if (data.errors) {
          Object.values(data.errors).forEach((errArr) => {
            if (Array.isArray(errArr)) {
              errArr.forEach((error) => {
                toast.error(error);
              });
            } else {
              toast.error(errArr);
            }
          });
        }
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "saving"} shipping method:`,
        error,
      );

      toast.error(error.message || "Something went wrong ❌", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Loading State
  // ==============================
  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto mt-6 bg-white dark:bg-gray-900 shadow-md rounded-lg p-6">
        <p className="text-center text-gray-600 dark:text-gray-300">
          Loading shipping method...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto dark:bg-gray-900 shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">
        {isEditMode ? "Edit Shipping Method" : "Add Shipping Method"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Shipping Method Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Shipping Method Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => {
              const value = e.target.value;

              setName(value);

              // Generate code automatically
              setCode(generateCode(value));
            }}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Standard Shipping"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(generateCode(e.target.value))}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. standard"
          />

          <p className="text-xs text-gray-500 mt-1">
            Code will be generated automatically from the name.
          </p>
        </div>

        {/* Delivery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Delivery Time
          </label>

          <input
            type="text"
            value={delivery_time}
            onChange={(e) => setDeliveryTime(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 2-3 days"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Price
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 2.99"
          />
        </div>

        {/* Free Shipping Threshold */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
            Free Shipping Threshold
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={free_shipping_threshold}
            onChange={(e) => setFreeShippingThreshold(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 30"
          />

          <p className="text-xs text-gray-500 mt-1">
            Leave empty if there is no free shipping threshold.
          </p>
        </div>

        {/* Active Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsActive(!is_active)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                is_active ? "bg-green-600" : "bg-gray-400"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  is_active ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            <span
              className={`text-sm font-medium ${
                is_active ? "text-green-600" : "text-gray-500"
              }`}
            >
              {is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium px-5 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {loading
              ? isEditMode
                ? "Updating..."
                : "Saving..."
              : isEditMode
                ? "Update Shipping Method"
                : "Save Shipping Method"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/shipping-method")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-5 py-2 rounded-lg shadow-sm"
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
}
