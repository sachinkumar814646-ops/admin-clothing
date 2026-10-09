"use client";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ViewProductPage() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageFromUrl = parseInt(queryParams.get("page")) || 1;
  const perpageFromUrl = parseInt(queryParams.get("per_page")) || 1;

  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `https://coombb.com/backend/api/products/${id}`,
        );
        setProduct(res.data.data);
      } catch (err) {
        setError("Error fetching product");
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const renderArray1 = (arr) => {
    if (!arr || arr.length === 0) return "null";
    return arr.map((item) => item.name || "null").join(", ");
  };

  const renderArray = (arr) =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((item) => item.name || "null").join(", ")
      : "null";

  if (loading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!product) {
    return (
      <div className="text-center py-10 text-gray-400">No product found</div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto w-full">
      {/* Back Button */}
      <button
        onClick={() =>
          navigate(`/products?page=${pageFromUrl}&per_page=${perpageFromUrl}`)
        }
        className="flex items-center gap-2 mb-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
      >
        <ArrowLeft size={18} /> Back
      </button>

      {/* Product Details */}
      <div className="dark:bg-transparent shadow-lg p-4 sm:p-6 dark:text-white w-full overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4 break-words">
          {product.name || "null"}
        </h1>

        {/* First Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 dark:border-gray-700 table-auto">
            <tbody>
              {/* Normal Fields */}
              <tr>
                <td className="border px-4 py-2 font-semibold w-1/4">Slug</td>
                <td className="border px-4 py-2 break-words">
                  {product.slug || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold w-1/4">
                  Short Description
                </td>
                <td className="border px-4 py-2 break-words">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.short_description || "null",
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold w-1/4">
                  Description
                </td>
                <td className="border px-4 py-2 break-words">
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: product.description || "null",
                    }}
                  />
                </td>
              </tr>

              {/* Stock, Dimensions, Boolean Fields */}
              <tr>
                <td className="border px-4 py-2 font-semibold">Stock</td>
                <td className="border px-4 py-2">{product.stock || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Weight</td>
                <td className="border px-4 py-2">{product.weight || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Length</td>
                <td className="border px-4 py-2">{product.length || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Width</td>
                <td className="border px-4 py-2">{product.width || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Height</td>
                <td className="border px-4 py-2">{product.height || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Status</td>
                <td
                  className={`border px-4 py-2 ${
                    product.status ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.status ? "Active" : "Inactive"}
                </td>
              </tr>

              {/* Boolean Fields */}
              <tr>
                <td className="border px-4 py-2 font-semibold">New</td>
                <td
                  className={`border px-4 py-2 ${
                    product.new ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.new ? "Yes" : "No"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Featured</td>
                <td
                  className={`border px-4 py-2 ${
                    product.featured ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.featured ? "Yes" : "No"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Top Selling</td>
                <td
                  className={`border px-4 py-2 ${
                    product.top_selling ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.top_selling ? "Yes" : "No"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Sale</td>
                <td
                  className={`border px-4 py-2 ${
                    product.sale ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.sale ? "Yes" : "No"}
                </td>
              </tr>

              {/* More Fields */}
              <tr>
                <td className="border px-4 py-2 font-semibold">Video URL</td>
                <td className="border px-4 py-2 break-words">
                  {product.video_url || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Meta Title</td>
                <td className="border px-4 py-2">
                  {product.meta_title || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Meta Description
                </td>
                <td className="border px-4 py-2">
                  {product.meta_description || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Meta Keywords
                </td>
                <td className="border px-4 py-2">
                  {product.meta_keywords || "null"}
                </td>
              </tr>

              {/* ---- Pricing ---- */}
              <tr>
                <td className="border px-4 py-2 font-semibold">SKU</td>
                <td className="border px-4 py-2">{product.sku || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">HSN</td>
                <td className="border px-4 py-2">{product.hsn || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Cost Price</td>
                <td className="border px-4 py-2">{product.price || "null"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Selling Price
                </td>
                <td className="border px-4 py-2">
                  {product.selling_price || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Discount</td>
                <td className="border px-4 py-2">
                  <span>
                    {product.discount?.name
                      ? parseInt(product.discount.name)
                      : "null"}
                  </span>
                  %
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">GST</td>
                <td className="border px-4 py-2">
                  {product.gst_inclusive
                    ? "Inclusive"
                    : product.gst_inclusive === false
                      ? "Exclusive"
                      : "null"}
                </td>
              </tr>

              {/* ---- Relations ---- */}
              <tr>
                <td className="border px-4 py-2 font-semibold">Season</td>
                <td className="border px-4 py-2">
                  {product.season?.name || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Fabric</td>
                <td className="border px-4 py-2">
                  {product.fabric?.name || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Brand</td>
                <td className="border px-4 py-2">
                  {product.brand?.name || "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">Tags</td>
                <td className="border px-4 py-2">
                  {Array.isArray(product.tags) && product.tags.length > 0
                    ? product.tags.map((tag) => tag.name || "null").join(", ")
                    : "null"}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Head Categories
                </td>
                <td className="border px-4 py-2">
                  {renderArray1(product.head_categories)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Parent Categories
                </td>
                <td className="border px-4 py-2">
                  {renderArray1(product.parent_categories)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Child Categories
                </td>
                <td className="border px-4 py-2">
                  {renderArray1(product.child_categories)}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Related Products
                </td>
                <td className="border px-4 py-2">
                  {renderArray(product.related_products)}
                </td>
              </tr>

              {/* ---- Images ---- */}
              <tr>
                <td className="border px-4 py-2 font-semibold">Main Image</td>
                <td className="border px-4 py-2">
                  {product.default_image ? (
                    <img
                      src={product.default_image}
                      alt="Default"
                      className="w-40 h-40 object-cover rounded"
                    />
                  ) : (
                    "null"
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2 font-semibold">
                  Additional Images
                </td>
                <td className="border px-4 py-2 flex gap-2 flex-wrap">
                  {product.images && product.images.length > 0
                    ? product.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.path_original}
                          alt={`Image ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))
                    : "null"}
                </td>
              </tr>

              {/* Continue with same format for all other rows as before */}
              {/* ... Rest of your rows remain unchanged ... */}
            </tbody>
          </table>
        </div>

        {/* Second Table (Variants) */}
        {Array.isArray(product.variants) && product.variants.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <h2 className="text-3xl font-semibold mb-4">Variants</h2>

            <table className="w-full border border-gray-200 dark:border-gray-700 table-auto">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Size</th>
                  <th className="border px-2 py-1">Color</th>
                  <th className="border px-2 py-1">SKU</th>
                  <th className="border px-2 py-1">Stock</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Images</th>
                </tr>
              </thead>

              <tbody>
                {product.variants.flatMap((v) => {
                  // If skus exist, render each size/SKU
                  if (Array.isArray(v.skus) && v.skus.length > 0) {
                    return v.skus.map((sku, idx) => (
                      <tr key={`${v.id}-${sku.id || idx}`}>
                        {/* Size */}
                        <td className="border px-2 py-1">
                          {sku.size_name || sku.product_size_id || "null"}
                        </td>

                        {/* Color */}
                        <td className="border px-2 py-1">
                          <div className="flex items-center gap-2">
                            {(v.color_code || v.color_code_2) && (
                              <span
                                className="inline-block w-6 h-6 rounded-full border"
                                style={{
                                  background: v.color_code_2
                                    ? `linear-gradient(
                                135deg,
                                ${v.color_code} 50%,
                                ${v.color_code_2} 50%
                              )`
                                    : v.color_code,
                                }}
                              />
                            )}

                            {v.color_name || v.color?.name || "null"}
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="border px-2 py-1">
                          {sku.sku || "null"}
                        </td>

                        {/* Stock */}
                        <td className="border px-2 py-1">
                          {sku.stock ?? "null"}
                        </td>

                        {/* Status */}
                        <td className="border px-2 py-1">
                          {v.status === 1 ? (
                            <span className="text-green-600 font-semibold">
                              Active (Default)
                            </span>
                          ) : (
                            <span className="text-red-600">Inactive</span>
                          )}
                        </td>

                        {/* Images */}
                        <td className="border px-2 py-1">
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(v.variant_images) &&
                            v.variant_images.length > 0
                              ? v.variant_images.map((img, imageIdx) => (
                                  <img
                                    key={img.id || imageIdx}
                                    src={img.path}
                                    alt={
                                      img.alt_text || `Image ${imageIdx + 1}`
                                    }
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                ))
                              : "null"}
                          </div>
                        </td>
                      </tr>
                    ));
                  }

                  // Fallback if a variant doesn't have a `skus` array
                  return [
                    <tr key={v.id}>
                      <td className="border px-2 py-1">
                        {v.size?.name || v.size_name || v.size_id || "null"}
                      </td>

                      <td className="border px-2 py-1">
                        <div className="flex items-center gap-2">
                          {(v.color_code || v.color_code_2) && (
                            <span
                              className="inline-block w-6 h-6 rounded-full border"
                              style={{
                                background: v.color_code_2
                                  ? `linear-gradient(
                              135deg,
                              ${v.color_code} 50%,
                              ${v.color_code_2} 50%
                            )`
                                  : v.color_code,
                              }}
                            />
                          )}

                          {v.color_name || v.color?.name || "null"}
                        </div>
                      </td>

                      <td className="border px-2 py-1">{v.sku || "null"}</td>
                      <td className="border px-2 py-1">{v.stock ?? "null"}</td>

                      <td className="border px-2 py-1">
                        {v.status === 1 ? (
                          <span className="text-green-600 font-semibold">
                            Active (Default)
                          </span>
                        ) : (
                          <span className="text-red-600">Inactive</span>
                        )}
                      </td>

                      <td className="border px-2 py-1">
                        <div className="flex flex-wrap gap-2">
                          {v.variant_images?.length > 0
                            ? v.variant_images.map((img, idx) => (
                                <img
                                  key={img.id || idx}
                                  src={img.path}
                                  alt={img.alt_text || `Image ${idx + 1}`}
                                  className="w-20 h-20 object-cover rounded border"
                                />
                              ))
                            : "null"}
                        </div>
                      </td>
                    </tr>,
                  ];
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
