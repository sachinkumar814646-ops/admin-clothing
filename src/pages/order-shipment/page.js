"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import PermissionGuard from "../../components/auth/PermissionGuard";

const ShippingMethodsPage = () => {
  const navigate = useNavigate();

  const [shippingMethods, setShippingMethods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShippingMethods, setSelectedShippingMethods] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const token = localStorage.getItem("token");

  // Fetch shipping methods from API
  const fetchShippingMethods = async () => {
    try {
      const res = await axios.get(
        "https://coombb.com/backend/api/shipping-methods",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            perPage: itemsPerPage,
            page,
            search: searchTerm || undefined,
          },
        },
      );

      setShippingMethods(res.data.data || []);
      setTotalPages(res.data.meta?.last_page || 1);

      // Remove selected IDs that are no longer available
      setSelectedShippingMethods((prev) =>
        prev.filter((id) =>
          (res.data.data || []).some((method) => method.id === id),
        ),
      );
    } catch (error) {
      console.error(
        "Error fetching shipping methods:",
        error.response || error,
      );
    }
  };

  useEffect(() => {
    fetchShippingMethods();
  }, [page, itemsPerPage, searchTerm]);

  // Delete single shipping method
  const deleteShippingMethod = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This shipping method will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `https://coombb.com/backend/api/shipping-methods/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          Swal.fire(
            "Deleted!",
            "The shipping method has been deleted.",
            "success",
          );

          fetchShippingMethods();
        } catch (error) {
          console.error(
            "Error deleting shipping method:",
            error.response || error,
          );

          Swal.fire("Error", "Failed to delete the shipping method.", "error");
        }
      }
    });
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedShippingMethods.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedShippingMethods.length} shipping methods.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedShippingMethods.map((id) =>
              axios.delete(
                `https://coombb.com/backend/api/shipping-methods/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              ),
            ),
          );

          Swal.fire(
            "Deleted!",
            "Selected shipping methods have been deleted.",
            "success",
          );

          setSelectedShippingMethods([]);
          fetchShippingMethods();
        } catch (error) {
          console.error("Bulk delete error:", error.response || error);

          Swal.fire(
            "Error",
            "Failed to delete selected shipping methods.",
            "error",
          );
        }
      }
    });
  };

  // Check if all methods on current page are selected
  const areAllOnPageSelected =
    shippingMethods.length > 0 &&
    shippingMethods.every((method) =>
      selectedShippingMethods.includes(method.id),
    );

  // Select / deselect all methods on current page
  const handleSelectAllShippingMethods = (e) => {
    if (e.target.checked) {
      const idsOnPage = shippingMethods.map((method) => method.id);

      setSelectedShippingMethods((prev) => [
        ...new Set([...prev, ...idsOnPage]),
      ]);
    } else {
      const idsOnPage = shippingMethods.map((method) => method.id);

      setSelectedShippingMethods((prev) =>
        prev.filter((id) => !idsOnPage.includes(id)),
      );
    }
  };

  // Select / deselect individual method
  const handleSelectShippingMethod = (id) => {
    setSelectedShippingMethods((prev) =>
      prev.includes(id)
        ? prev.filter((methodId) => methodId !== id)
        : [...prev, id],
    );
  };

  const viewShippingMethod = (shippingMethod) => {
    Swal.fire({
      title: "Shipping Method Details",
      width: "650px",
      html: `
      <div style="text-align: left;">

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        ">

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Code</strong>
            <div style="margin-top: 4px;">
              ${shippingMethod.code ?? "N/A"}
            </div>
          </div>

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Name</strong>
            <div style="margin-top: 4px;">
              ${shippingMethod.name ?? "N/A"}
            </div>
          </div>

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Delivery Time</strong>
            <div style="margin-top: 4px;">
              ${shippingMethod.delivery_time ?? "N/A"}
            </div>
          </div>

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Price</strong>
            <div style="margin-top: 4px;">
              $${Number(shippingMethod.price ?? 0).toFixed(2)}
            </div>
          </div>

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Free Shipping Threshold</strong>
            <div style="margin-top: 4px;">
              ${
                shippingMethod.free_shipping_threshold !== null &&
                shippingMethod.free_shipping_threshold !== undefined
                  ? `$${Number(shippingMethod.free_shipping_threshold).toFixed(
                      2,
                    )}`
                  : "No threshold"
              }
            </div>
          </div>

          <div style="
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          ">
            <strong>Status</strong>
            <div style="margin-top: 4px;">
              ${
                shippingMethod.is_active
                  ? `<span style="
                      color: #16a34a;
                      font-weight: 600;
                    ">Active</span>`
                  : `<span style="
                      color: #dc2626;
                      font-weight: 600;
                    ">Inactive</span>`
              }
            </div>
          </div>

        </div>
      </div>
    `,
      confirmButtonText: "Close",
      confirmButtonColor: "#dc2626",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 py-4">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">
        Shipping Methods
      </h1>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Shipping Methods</CardTitle>
              <CardDescription>Manage your shipping methods</CardDescription>
            </div>

            <div className="flex gap-2">
              {selectedShippingMethods.length > 0 && (
                // <PermissionGuard permission="bulk_delete_shipping_methods">
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Bulk Delete ({selectedShippingMethods.length})
                </Button>
                // </PermissionGuard>
              )}

              {/* <PermissionGuard permission="create_shipping_methods"> */}
              <Button onClick={() => navigate("/shipping-method/add")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
              {/* </PermissionGuard> */}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <label>Show</label>

              <select
                className="mb-2 dark:bg-slate-500 border"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>

              <label>entries</label>
            </div>

            <div className="flex items-center px-0 py-2">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="border-none ml-2"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <input
                      type="checkbox"
                      checked={areAllOnPageSelected}
                      onChange={handleSelectAllShippingMethods}
                    />
                  </TableHead>

                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {shippingMethods.length > 0 ? (
                  shippingMethods.map((shippingMethod) => (
                    <TableRow key={shippingMethod.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedShippingMethods.includes(
                            shippingMethod.id,
                          )}
                          onChange={() =>
                            handleSelectShippingMethod(shippingMethod.id)
                          }
                        />
                      </TableCell>

                      <TableCell>{shippingMethod.name}</TableCell>

                      <TableCell>
                        <span className="font-medium">
                          {shippingMethod.code}
                        </span>
                      </TableCell>

                      <TableCell>
                        {shippingMethod.delivery_time || "N/A"}
                      </TableCell>

                      <TableCell>
                        {shippingMethod.is_active ? (
                          <span className="text-green-500 font-semibold">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            Inactive
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <Button
                            className="bg-gray-600 hover:bg-gray-700 text-white"
                            onClick={() => viewShippingMethod(shippingMethod)}
                          >
                            View
                          </Button>
                          {/* <PermissionGuard permission="edit_shipping_methods"> */}
                          <button
                            onClick={() =>
                              navigate(
                                `/shipping-method/${shippingMethod.id}/edit`,
                              )
                            }
                            className="text-blue-500"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                          {/* </PermissionGuard> */}

                          {/* <PermissionGuard permission="delete_shipping_methods"> */}
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() =>
                              deleteShippingMethod(shippingMethod.id)
                            }
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          {/* </PermissionGuard> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No shipping methods found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="bg-red-500 text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <span>
              Page {page} of {totalPages}
            </span>

            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="bg-red-500 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShippingMethodsPage;
