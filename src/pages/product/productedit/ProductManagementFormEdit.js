"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import GeneralTab from "../../../components/tabs/edittab/GeneralTab";
import DataTab from "../../../components/tabs/edittab/DataTab";
import LinksTab from "../../../components/tabs/edittab/ProductLinksTab";
import ImagesTab from "../../../components/tabs/edittab/ImagesTab";
import VariationsTab from "../../../components/tabs/edittab/productvariationnew";

const ProductManagementFormEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = parseInt(searchParams.get("per_page") || "1", 10);
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [variantsChanged, setVariantsChanged] = useState(false);

  const [apiResponse, setApiResponse] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    short_description: "",
    description: "",
    video_url: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    status: false,
    new: false,
    featured: false,
    top_selling: false,
    sale: false,
    special_offer: false,
    sku: "",
    hsn: "",
    cost_price: "",
    selling_price: "",
    discount: "",
    gst: "",
    gst_type: "",
    length: "",
    weight: "",
    height: "",
    width: "",
    season_id: "",
    brand_id: "",
    fabric_id: "",
    categories: [],
    head_categories: [],
    sub_categories: [],
    parent_categories: [],
    child_categories: [],
    tags: [],
    product_new_tags: [],
    related_product: [],
    images: [],
    default_image: null,

    sizes: [],
    colors: [],
    color_ids: [],
    size_ids: [],
    default_size: "",
    default_color: "",
    variants: [],
  });

  const [tableData, setTableData] = useState({});

  // Update function for child
  const updateData = useCallback((field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Auto slug generate from name
      if (field === "name") {
        newData.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
      }

      return newData;
    });
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setFetching(false);
          return;
        }

        const url = `https://coombb.com/backend/api/products/${id}/edit`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch product");

        const result = await response.json();
        const resData = result?.data || result;
        console.log("resData", resData);
        console.log("puraData", result);

        setApiResponse(result);

        // Prepare tableData for variants
        const variantsTableData = {};

        (resData.variants || []).forEach((variant) => {
          const colorId = variant.color_id;

          // Variant ID
          variantsTableData[`${colorId}_variant_id`] = variant.id ?? null;

          // Images
          variantsTableData[`${colorId}_image_files`] = [];

          variantsTableData[`${colorId}_image_previews`] = (
            variant.variant_images || []
          ).map((img) => (typeof img === "string" ? img : img.path));

          // SKU / Stock / SKU ID
          (variant.skus || []).forEach((skuItem) => {
            const sizeId = skuItem.product_size_id;

            // SKU ID
            variantsTableData[`${colorId}_${sizeId}_sku_id`] =
              skuItem.id ?? null;

            // SKU
            variantsTableData[`${colorId}_${sizeId}_sku`] = skuItem.sku || "";

            // Stock
            variantsTableData[`${colorId}_${sizeId}_qty`] = skuItem.stock ?? 0;
          });
        });

        setTableData(variantsTableData);

        setTableData(variantsTableData);

        // Map API response to formData
        setFormData({
          id: resData.id || "",
          name: resData.name || "",
          slug: resData.slug || "",
          short_description: resData.short_description || "",
          description: resData.description || "",
          video_url: resData.video_url || "",
          meta_title: resData.meta_title || "",
          meta_description: resData.meta_description || "",
          meta_keywords: resData.meta_keywords || "",

          // Booleans
          status: !!resData.status,
          new: !!resData.new,
          featured: !!resData.featured,
          top_selling: !!resData.top_selling,
          sale: !!resData.sale,
          special_offer: false, // adjust if API has this field

          // Pricing
          sku: resData.sku || "",
          hsn: resData.hsn || "",
          cost_price: resData.cost_price || "",
          selling_price: resData.selling_price || "",
          discount: resData.discount || "",
          gst: resData.gst || "",
          gst_type: resData.gst_type || "",
          length: resData.length || "",
          weight: resData.weight || "",
          height: resData.height || "",
          width: resData.width || "",
          stock: resData.stock || "",

          // Relations
          discount: resData.discount?.id || "",
          season_id: resData.season?.id || "",
          brand_id: resData.brand?.id || "",
          fabric_id: resData.fabric?.id || "",

          // Categories
          // categories: resData.head_categories?.map((c) => c.id) || [],
          // head_categories: resData.head_categories?.map((c) => c.id) || [],
          // new_categories: resData.parent_categories || [],
          // sub_categories:
          //   resData.parent_categories?.map((c) => ({
          //     id: c.product_category_id,
          //   })) || [],
          // parent_categories:
          //   resData.parent_categories?.map((c) => ({
          //     id: c.id,
          //   })) || [],
          // child_categories:
          //   resData.child_categories?.map((c) => ({ id: c.id })) || [],
          head_categories: resData.head_categories?.map((c) => c.id) || [],
          parent_categories:
            resData.parent_categories?.map((c) => c.id || c) || [],
          child_categories:
            resData.child_categories?.map((c) => c.id || c) || [],
          related_product:
            resData.related_products?.map((p) => p.id || p) || [],
          tags: resData.tags?.map((t) => t.id || t) || [],

          // Tags
          product_tags: resData.tags?.map((t) => t.id) || [],
          product_new_tags: resData.tags || [],

          // Related products
          related_products: resData.related_products || [],

          // Images
          images: resData.images || [],
          default_image: resData.default_image || null,

          // Variants
          variants: resData.variants || [],

          // Sizes and Colors
          size_ids: resData.size_ids || [],
          color_ids: resData.color_ids || [],
          default_size: resData.default_size || "",
          default_color: resData.default_color || "",
        });
      } catch (err) {
        console.error("❌ Fetch product error:", err);
        toast.error("❌ Failed to fetch product details.");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id]);

  // FormData builder
  const appendFormData = (form, key, value) => {
    if (value === null || value === undefined) return;

    if (key === "variants" && Array.isArray(value)) {
      // Handle variants specially to include image files
      value.forEach((variant, index) => {
        form.append(`variants[${index}][color_id]`, variant.color_id);
        form.append(`variants[${index}][size_id]`, variant.size_id);
        form.append(`variants[${index}][stock]`, variant.stock);

        if (variant.default_image) {
          form.append(
            `variants[${index}][default_image]`,
            variant.default_image,
          );
        }

        // Handle variant images
        if (variant.image_files && variant.image_files.length > 0) {
          variant.image_files.forEach((file, fileIndex) => {
            if (file instanceof File) {
              form.append(`variants[${index}][images][${fileIndex}]`, file);
            }
          });
        }

        // Handle existing image URLs
        if (variant.images && variant.images.length > 0) {
          console.log("variant.images", variant.images);
          variant.images.forEach((imageUrl, imgIndex) => {
            if (typeof imageUrl === "string" && !imageUrl.startsWith("blob:")) {
              form.append(
                `variants[${index}][existing_images][${imgIndex}]`,
                imageUrl,
              );
            }
          });
        }
      });
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) form.append(`${key}[]`, item);
        else if (typeof item === "object") {
          Object.entries(item).forEach(([subKey, subVal]) => {
            form.append(`${key}[][${subKey}]`, subVal);
          });
        } else form.append(`${key}[]`, item);
      });
    } else if (typeof value === "object" && !(value instanceof File)) {
      Object.entries(value).forEach(([subKey, subVal]) => {
        form.append(`${key}[${subKey}]`, subVal);
      });
    } else if (key === "images") {
      value?.forEach((item) => {
        if (item instanceof File) {
          form.append("images[]", item);
        } else if (typeof item === "object") {
          if (item.id) {
            form.append("images[]", item.id); // send ID for existing image
          } else if (item.path_original) {
            form.append("images[]", item.path_original); // fallback to URL
          }
        } else {
          form.append("images[]", item); // plain string fallback
        }
      });
    } else {
      form.append(key, value);
    }
  };

  // Save handler
  // Save handler
  const handleSave = async () => {
    setLoading(true);

    if (!formData.name?.trim()) {
      toast.error("❌ Product name is required.");
      setLoading(false);
      return;
    }
    console.log("formData.variants", formData.variants, formData);
    debugger;
    // Validate nested variants
    if (formData.variants?.length > 0) {
      const hasInvalidVariants = formData.variants.some((variant) => {
        if (!variant.color_id) {
          return true;
        }

        if (!Array.isArray(variant.skus) || variant.skus.length === 0) {
          return true;
        }

        return variant.skus.some(
          (sku) =>
            !sku.size_id || sku.stock === undefined || Number(sku.stock) < 0,
        );
      });

      if (hasInvalidVariants) {
        toast.error(
          "❌ Please ensure all variants have valid color, size, and stock values.",
        );
        setLoading(false);
        return;
      }
    }

    const form = new FormData();

    const appendFormData = (form, key, value) => {
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        if (key === "variants") {
          value.forEach((variant, colorIndex) => {
            Object.entries(variant).forEach(([vKey, vVal]) => {
              // Nested SKUs
              if (vKey === "skus" && Array.isArray(vVal)) {
                vVal.forEach((sku, skuIndex) => {
                  Object.entries(sku).forEach(([sKey, sVal]) => {
                    form.append(
                      `variants[${colorIndex}][skus][${skuIndex}][${sKey}]`,
                      sVal,
                    );
                  });
                });

                // Variant images
              } else if (vKey === "images" && Array.isArray(vVal)) {
                vVal.forEach((img, imgIndex) => {
                  if (img instanceof File) {
                    form.append(
                      `variants[${colorIndex}][images][${imgIndex}]`,
                      img,
                    );
                  } else {
                    form.append(
                      `variants[${colorIndex}][images][${imgIndex}]`,
                      img,
                    );
                  }
                });

                // Variant image files
              } else if (vKey === "image_files" && Array.isArray(vVal)) {
                vVal.forEach((file, imgIndex) => {
                  if (file instanceof File) {
                    form.append(
                      `variants[${colorIndex}][image_files][${imgIndex}]`,
                      file,
                    );
                  }
                });

                // Default image
              } else if (vKey === "default_image") {
                if (vVal) {
                  form.append(`variants[${colorIndex}][default_image]`, vVal);
                }

                // Other color-level fields
              } else {
                form.append(`variants[${colorIndex}][${vKey}]`, vVal);
              }
            });
          });
        } else {
          value.forEach((item, index) => {
            appendFormData(form, `${key}[${index}]`, item);
          });
        }
      } else if (typeof value === "object" && !(value instanceof File)) {
        Object.entries(value).forEach(([childKey, childValue]) => {
          appendFormData(form, `${key}[${childKey}]`, childValue);
        });
      } else {
        form.append(key, value);
      }
    };

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (
        [
          "status",
          "new",
          "featured",
          "top_selling",
          "sale",
          "special_offer",
        ].includes(key)
      ) {
        form.append(key, value ? 1 : 0);
      } else if (key === "images") {
        value?.forEach((item) => {
          if (item instanceof File) {
            form.append("images[]", item);
          } else if (item?.id) {
            form.append("images[]", item.id);
          } else if (item?.path_original) {
            form.append("images[]", item.path_original);
          } else if (typeof item === "string") {
            form.append("images[]", item);
          }
        });
      } else if (key === "default_image") {
        if (value instanceof File) {
          form.append("default_image", value);
        } else if (value?.id) {
          form.append("default_image", value.id);
        } else if (typeof value === "string") {
          form.append("default_image", value);
        }
      } else {
        appendFormData(form, key, value);
      }
    });

    // Laravel method spoofing
    form.append("_method", "PUT");

    for (const [key, value] of form.entries()) {
      console.log(key, value instanceof File ? `FILE: ${value.name}` : value);
    }

    try {
      const url = `https://coombb.com/backend/api/products/${id}`;

      const response = await fetch(url, {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      console.log("Save result:", result);

      if (response.ok && result?.success) {
        toast.success("✅ Product updated successfully!");

        navigate(`/products?page=${initialPage}&per_page=${itemsPerPage}`);
      } else {
        toast.error(result?.message || "❌ Failed to update product.");
      }
    } catch (error) {
      console.error("❌ Save Error:", error);
      toast.error("❌ Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Tabs
  const tabs = apiResponse
    ? [
        {
          id: "general",
          label: "General",
          content: <GeneralTab data={formData} updateData={updateData} />,
        },
        {
          id: "data",
          label: "Data",
          content: (
            <DataTab
              tags={apiResponse.product_new_tags}
              seasons={apiResponse.seasons}
              fabrics={apiResponse.fabric_types}
              brands={apiResponse.brands}
              discounts={apiResponse.discounts}
              formData={formData}
              updateData={updateData}
            />
          ),
        },
        {
          id: "links",
          label: "Links",
          content: (
            <LinksTab
              categories={apiResponse.new_categories}
              subcategories={apiResponse.sub_categories}
              childcategories={apiResponse.child_categories}
              products={apiResponse.related_products}
              tags={apiResponse.product_new_tags}
              formDatas={formData}
              setFormData={setFormData}
              updateData={updateData}
            />
          ),
        },
        {
          id: "images",
          label: "Images",
          content: <ImagesTab data={formData} updateData={updateData} />,
        },
        {
          id: "variations",
          label: "Variations",
          content: (
            <VariationsTab
              sizes={apiResponse.product_sizes}
              colors={apiResponse.product_colors}
              formData={formData}
              setFormData={setFormData}
              tableData={tableData}
              setTableData={setTableData}
              updateData={updateData}
              setVariantsChanged={setVariantsChanged}
            />
          ),
        },
      ]
    : [];

  const getCurrentTabIndex = () => tabs.findIndex((t) => t.id === activeTab);
  const goToNextTab = () => {
    const idx = getCurrentTabIndex();
    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
  };
  const goToPreviousTab = () => {
    const idx = getCurrentTabIndex();
    if (idx > 0) setActiveTab(tabs[idx - 1].id);
  };

  return (
    <div className="product-form-container dark:bg-gray-900 dark:text-white bg-transparent">
      <div style={{ minWidth: "768px", paddingBottom: "20px" }}>
        <div className="dark:text-white flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
        </div>

        <hr className="border-gray-300 dark:border-gray-700 mt-0" />

        {fetching ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Loading product details...
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 px-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-t ${
                    activeTab === tab.id
                      ? "bg-red-600 text-white font-bold"
                      : "bg-transparent"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <hr className="border-gray-300 dark:border-gray-700 mt-0" />

            <div className="tab-content p-4">
              {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>

            <hr className="border-gray-300 dark:border-gray-700 mt-0" />

            <div className="flex justify-between px-4 pb-4">
              <button
                onClick={goToPreviousTab}
                disabled={getCurrentTabIndex() === 0}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:bg-gray-300"
              >
                ← Previous
              </button>

              {getCurrentTabIndex() === tabs.length - 1 ? (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded font-bold"
                >
                  {loading ? "Saving..." : "Save Product"}
                </button>
              ) : (
                <button
                  onClick={goToNextTab}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                >
                  Next →
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductManagementFormEdit;
