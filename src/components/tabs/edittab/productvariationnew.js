"use client";

import { useEffect, useState } from "react";

const ProductVariationTab = ({
  sizes = [],
  colors = [],
  formData = {},
  setFormData,
  tableData = {},
  setTableData,
  updateData,
  setVariantsChanged,
}) => {
  console.log("variantffffffs", tableData);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const sampleSizes = Array.isArray(sizes)
    ? sizes
    : Object.entries(sizes).map(([id, label]) => ({
        id: Number(id),
        label,
        name: label,
      }));

  const sampleColors = Array.isArray(colors)
    ? colors.map((c) => ({
        id: c.id,
        name: c.name,
        hexa_code: c.hexa_code || "#ccc",
        hexa_code_2: c.hexa_code_2 || "#ccc",
      }))
    : Object.entries(colors).map(([id, c]) => ({
        id: Number(id),
        name: c.name,
        hexa_code: c.hexa_code || "#ccc",
        hexa_code_2: c.hexa_code_2 || "#ccc",
      }));

  const getColorById = (id) =>
    sampleColors.find((c) => String(c.id) === String(id));

  // ✅ set default size/color
  const setDefault = (field, value) => {
    if (field === "size") {
      setFormData((prev) => ({ ...prev, default_size: value }));
    } else if (field === "color") {
      setFormData((prev) => ({ ...prev, default_color: value }));
    }
  };

  useEffect(() => {
    const loadLibraries = async () => {
      if (!window.jQuery) {
        const jqueryScript = document.createElement("script");
        jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        jqueryScript.onload = () => {
          const select2Script = document.createElement("script");
          select2Script.src =
            "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js";
          document.head.appendChild(select2Script);

          const select2CSS = document.createElement("link");
          select2CSS.rel = "stylesheet";
          select2CSS.href =
            "https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css";
          document.head.appendChild(select2CSS);
        };
        document.head.appendChild(jqueryScript);
      }
    };

    loadLibraries();
  }, []);

  useEffect(() => {
    const initializeSelect2 = () => {
      if (window.jQuery && window.jQuery.fn.select2) {
        const $ = window.jQuery;

        const $sizeSelect = $("#size-select");
        if (
          $sizeSelect.length &&
          !$sizeSelect.hasClass("select2-hidden-accessible")
        ) {
          $sizeSelect
            .select2({
              placeholder: "Select sizes",
              allowClear: true,
              width: "100%",
            })
            .on("change", function () {
              const selectedValues = $(this).val() || [];
              setSelectedSizes(selectedValues);
              setFormData((prev) => ({
                ...prev,
                size_ids: selectedValues.map(Number),
              }));
              setVariantsChanged(true);
            });
        }

        const $colorSelect = $("#color-select");
        if (
          $colorSelect.length &&
          !$colorSelect.hasClass("select2-hidden-accessible")
        ) {
          $colorSelect
            .select2({
              placeholder: "Select colors",
              allowClear: true,
              width: "100%",
              templateResult: (option) => {
                if (!option.id) return option.text;
                const color = sampleColors.find(
                  (c) => String(c.id) === String(option.id),
                );
                if (color) {
                  return $(
                    `<span><span style="display:inline-block;width:16px;height:16px;border:1px solid #ccc;margin-right:8px;border-radius:2px;background:${
                      color.hexa_code_2
                        ? `linear-gradient(135deg, ${color.hexa_code} 50%, ${color.hexa_code_2} 50%)`
                        : color.hexa_code
                    };"></span>${option.text}</span>`,
                  );
                }
                return option.text;
              },
              templateSelection: (option) => {
                if (!option.id) return option.text;
                const color = sampleColors.find(
                  (c) => String(c.id) === String(option.id),
                );
                if (color) {
                  return $(
                    `<span><span style="display:inline-block;width:16px;height:16px;border:1px solid #ccc;margin-right:8px;border-radius:2px;background:${
                      color.hexa_code_2
                        ? `linear-gradient(135deg, ${color.hexa_code} 50%, ${color.hexa_code_2} 50%)`
                        : color.hexa_code
                    };"></span>${option.text}</span>`,
                  );
                }
                return option.text;
              },
            })
            .on("change", function () {
              const selectedValues = $(this).val() || [];
              setSelectedColors(selectedValues);
              setFormData((prev) => ({
                ...prev,
                color_ids: selectedValues.map(Number),
              }));
              setVariantsChanged(true);
            });
        }

        if (formData?.size_ids?.length) {
          const sizeValues = formData.size_ids.map(String);
          $sizeSelect.val(sizeValues).trigger("change.select2");
          setSelectedSizes(sizeValues);
        }

        if (formData?.color_ids?.length) {
          const colorValues = formData.color_ids.map(String);
          $colorSelect.val(colorValues).trigger("change.select2");
          setSelectedColors(colorValues);
        }
      }
    };

    const checkLibraries = setInterval(() => {
      if (window.jQuery && window.jQuery.fn.select2) {
        clearInterval(checkLibraries);
        setTimeout(initializeSelect2, 100);
      }
    }, 100);

    return () => clearInterval(checkLibraries);
  }, [formData?.size_ids, formData?.color_ids, sampleSizes, sampleColors]);

  const buildStructuredData = () => {
    const result = [];

    selectedColors.forEach((color_id) => {
      const imageFiles = tableData[`${color_id}_image_files`] || [];
      const imagePreviews = tableData[`${color_id}_image_previews`] || [];

      // Existing variants for this color
      const existingColorVariants = (formData.variants || []).filter(
        (variant) => String(variant.color_id) === String(color_id),
      );

      const existingColorVariant = existingColorVariants[0];

      // First size for top-level size_id, sku and stock
      const firstSizeId = selectedSizes[0];

      const colorVariant = {
        ...(existingColorVariant?.id ? { id: existingColorVariant.id } : {}),

        color_id: Number(color_id),
        size_id: Number(firstSizeId),

        sku: tableData[`${color_id}_${firstSizeId}_sku`] || "",

        stock: Number(tableData[`${color_id}_${firstSizeId}_qty`] || 0),

        default_image:
          imagePreviews.length > 0
            ? imagePreviews[0]
            : existingColorVariant?.default_image || null,

        images:
          imagePreviews.length > 0
            ? imagePreviews
            : existingColorVariant?.images || [],

        image_files: imageFiles,

        skus: [],
      };

      selectedSizes.forEach((size_id) => {
        const key = `${color_id}_${size_id}`;

        const sku = tableData[`${key}_sku`] ?? "";
        const stock = tableData[`${key}_qty`] ?? 0;

        const existingSku = existingColorVariants
          .flatMap((variant) => variant.skus || [])
          .find(
            (skuItem) =>
              String(skuItem.size_id ?? skuItem.product_size_id) ===
              String(size_id),
          );

        colorVariant.skus.push({
          ...(existingSku?.id ? { id: existingSku.id } : {}),

          size_id: Number(size_id),
          sku: String(sku),
          stock: Number(stock),
        });
      });

      result.push(colorVariant);
    });

    return result;
  };

  const handleInputChange = (color_id, size_id, field, value) => {
    setTableData((prev) => ({
      ...prev,
      [`${color_id}_${size_id}_${field}`]: value,
    }));

    setVariantsChanged(true);
  };

  const handleImageChange = async (color_id, files) => {
    const newFiles = Array.from(files || []);

    if (!newFiles.length) return;

    const previewUrls = await Promise.all(
      newFiles.map((file) => fileToBase64(file)),
    );

    setTableData((prev) => ({
      ...prev,

      [`${color_id}_image_files`]: [
        ...(prev[`${color_id}_image_files`] || []),
        ...newFiles,
      ],

      [`${color_id}_image_previews`]: [
        ...(prev[`${color_id}_image_previews`] || []),
        ...previewUrls,
      ],
    }));

    setVariantsChanged(true);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (color_id, imageIndex) => {
    setTableData((prev) => ({
      ...prev,

      [`${color_id}_image_files`]: (
        prev[`${color_id}_image_files`] || []
      ).filter((_, index) => index !== imageIndex),

      [`${color_id}_image_previews`]: (
        prev[`${color_id}_image_previews`] || []
      ).filter((_, index) => index !== imageIndex),
    }));

    setVariantsChanged(true);
  };

  useEffect(() => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      return;
    }

    const structuredData = buildStructuredData();

    setFormData((prev) => ({
      ...prev,
      variants: structuredData,
    }));
  }, [selectedSizes, selectedColors, tableData]);

  return (
    <div className="p-6">
      {/* Size Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Size</label>
        <select id="size-select" multiple className="w-full">
          {sampleSizes.map((size) => (
            <option key={size.id} value={size.id}>
              {size.name || size.label}
            </option>
          ))}
        </select>

        {/* ✅ Default Size Selector */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedSizes.map((size_id) => {
            const sizeObj = sampleSizes.find((s) => s.id === Number(size_id));
            if (!sizeObj) return null;
            return (
              <div
                key={size_id}
                className="flex gap-2 items-center bg-gray-100 p-2 rounded"
              >
                <span>{sizeObj.name || sizeObj.label}</span>
                <button
                  onClick={() => setDefault("size", Number(size_id))}
                  className={`text-xs px-2 py-0.5 rounded ${
                    formData.default_size === Number(size_id)
                      ? "bg-red-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {formData.default_size === Number(size_id)
                    ? "Default"
                    : "Make Default"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Color</label>
        <select id="color-select" multiple className="w-full">
          {sampleColors.map((color) => (
            <option key={color.id} value={color.id}>
              {color.name}
            </option>
          ))}
        </select>

        {/* ✅ Default Color Selector */}
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedColors.map((color_id) => {
            const color = getColorById(color_id);
            if (!color) return null;
            return (
              <div
                key={color_id}
                className="flex gap-2 items-center bg-gray-100 p-2 rounded"
              >
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{
                    background: color.hexa_code_2
                      ? `linear-gradient(135deg, ${color.hexa_code} 50%, ${color.hexa_code_2} 50%)`
                      : color.hexa_code,
                  }}
                ></span>
                <span>{color.name}</span>
                <button
                  onClick={() => setDefault("color", Number(color_id))}
                  className={`text-xs px-2 py-0.5 rounded ${
                    formData.default_color === Number(color_id)
                      ? "bg-red-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  {formData.default_color === Number(color_id)
                    ? "Default"
                    : "Make Default"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variations Matrix */}
      {selectedSizes.length > 0 && selectedColors.length > 0 && (
        <div className="max-w-full overflow-x-auto border-2 rounded scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          <table className=" w-full table-auto border-collapse bg-yellow-50 ">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-20 bg-gray-50 border-b px-4 py-2 text-left w-48">
                  Color / Size
                </th>

                {selectedSizes.map((s) => {
                  const sizeObj = sampleSizes.find((sz) => sz.id === Number(s));
                  return (
                    <th
                      key={s}
                      className="border-b px-4 py-2 text-center min-w-[120px]"
                    >
                      {sizeObj?.name}
                    </th>
                  );
                })}

                <th className="border-b px-4 py-2 min-w-[250px]">Images</th>
              </tr>
            </thead>

            <tbody>
              {selectedColors.map((c) => {
                const color = getColorById(c);

                return (
                  <tr key={c}>
                    <td className="sticky left-0 z-10 bg-white border-b px-4 py-2 w-48">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded border"
                          style={{
                            background: color.hexa_code_2
                              ? `linear-gradient(135deg, ${color.hexa_code} 50%, ${color.hexa_code_2} 50%)`
                              : color.hexa_code,
                          }}
                        />
                        <span>{color.name}</span>
                      </div>
                    </td>

                    {selectedSizes.map((s) => (
                      <td
                        key={`${c}_${s}`}
                        className="border-b px-4 py-2 min-w-[100px]"
                      >
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">SKU</label>

                          <input
                            type="text"
                            placeholder="Enter SKU"
                            className="w-full border rounded px-2 py-1"
                            value={tableData[`${c}_${s}_sku`] || ""}
                            onChange={(e) =>
                              handleInputChange(c, s, "sku", e.target.value)
                            }
                          />

                          {/* Quantity */}
                          <label className="text-sm font-medium">
                            Quantity
                          </label>

                          <input
                            type="number"
                            min={0}
                            className="w-full text-center border rounded"
                            placeholder="Enter quantity"
                            value={tableData[`${c}_${s}_qty`] || ""}
                            onChange={(e) =>
                              handleInputChange(c, s, "qty", e.target.value)
                            }
                          />
                        </div>
                      </td>
                    ))}

                    <td className="border-b px-4 py-2 min-w-[250px]">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleImageChange(c, e.target.files)}
                        className="text-xs mb-2"
                        accept="image/*"
                      />
                      <div className="flex gap-2 flex-wrap">
                        {(tableData[`${c}_image_previews`] || []).map(
                          (img, i) => (
                            <div key={i} className="relative">
                              <img
                                src={img || "/placeholder.svg"}
                                alt=""
                                className="w-12 h-12 object-cover rounded border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(c, i)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600"
                              >
                                ×
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductVariationTab;
