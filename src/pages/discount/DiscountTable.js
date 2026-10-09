// DiscountTable.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/Dropdown";
import Button from "../../components/ui/Button";
import { Edit, MoreVertical, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";
import {
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import PermissionGuard from "../../components/auth/PermissionGuard";

const DiscountTable = () => {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const token = localStorage.getItem("token");

  const fetchDiscounts = async () => {
    try {
      const res = await axios.get(
        `https://coombb.com/backend/api/discounts?page=${currentPage}&perPage=${entriesPerPage}&search=${searchTerm}&sortDir=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      let dataArray = [];
      if (Array.isArray(res.data)) {
        dataArray = res.data;
      } else if (Array.isArray(res.data?.data)) {
        dataArray = res.data.data;
      }
      setDiscounts(dataArray);

      if (res.data.meta) {
        setTotalPages(res.data.meta.last_page || 1);
        setTotalItems(res.data.meta.total || dataArray.length);
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
      setDiscounts([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [currentPage, entriesPerPage, searchTerm]);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this discount!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://coombb.com/backend/api/discounts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Discount has been deleted.", "success");
          fetchDiscounts();
        } catch (error) {
          console.error("Delete Error:", error);
          Swal.fire("Error!", "Failed to delete discount.", "error");
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      Swal.fire("No selection", "Please select at least one discount.", "info");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${selectedIds.length} discount(s)!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // ✅ Use the new bulk delete API
          await axios.post(
            "https://coombb.com/backend/api/discount/bulk-delete",
            { ids: selectedIds },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          Swal.fire(
            "Deleted!",
            `${selectedIds.length} discount(s) deleted.`,
            "success",
          );
          setSelectedIds([]);
          fetchDiscounts();
        } catch (error) {
          console.error("Bulk Delete Error:", error);
          Swal.fire("Error!", "Failed to delete discounts.", "error");
        }
      }
    });
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === discounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(discounts.map((d) => d.id));
    }
  };

  return (
    <div className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center">
          <div className="flex flex-col space-y-2 sm:flex-1">
            <CardTitle className="text-lg sm:text-xl">Discounts</CardTitle>
            <CardDescription className="text-sm">
              Manage your product discounts
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {selectedIds.length > 0 && (
              <PermissionGuard permission="bulk_delete_discounts">
                <Button
                  className="flex-shrink-0 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleBulkDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Bulk Delete ({selectedIds.length})
                </Button>
              </PermissionGuard>
            )}
            <PermissionGuard permission="create_brands">
              <Button
                className="flex-shrink-0 w-full sm:w-auto bg-red-500 hover:bg-red-800 text-white mr-0"
                onClick={() => navigate("/discounts/add")}
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Add Discount</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </PermissionGuard>
          </div>
        </div>
      </CardHeader>

      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div className="flex items-center gap-2 text-sm ml-6">
          Show
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded p-1 dark:bg-gray-700"
          >
            {[10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          entries
        </div>

        <div className="flex items-center px-3 py-2 flex-1 max-w-xs sm:max-w-sm">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border-none p-0 ml-2 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full min-w-0"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[900px] w-full">
          <TableHeader>
            <TableRow>
              <TableHead>
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    discounts.length > 0 &&
                    selectedIds.length === discounts.length
                  }
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {discounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  No discounts found.
                </TableCell>
              </TableRow>
            ) : (
              discounts.map((discount) => (
                <TableRow key={discount.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(discount.id)}
                      onChange={() => toggleSelect(discount.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{discount.name}</TableCell>
                  <TableCell>{discount.type}</TableCell>
                  <TableCell>
                    {discount.type === "PERCENTAGE" ? "%" : "£"}
                    {discount.amount}
                  </TableCell>
                  <TableCell>
                    {discount.start_date
                      ? new Date(discount.start_date).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {discount.end_date
                      ? new Date(discount.end_date).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell
                    className={
                      discount.active ? "text-green-500" : "text-red-500"
                    }
                  >
                    {discount.active ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="text-left p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-2"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="z-50 bg-white border shadow-lg p-2"
                      >
                        <PermissionGuard permission="edit_discounts">
                          <DropdownMenuItem
                            onClick={() =>
                              navigate(`/discounts/edit/${discount.id}`)
                            }
                            className="flex items-center text-sm px-3 py-2"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionGuard>

                        <PermissionGuard permission="delete_discounts">
                          <DropdownMenuItem
                            onClick={() => handleDelete(discount.id)}
                            className="flex items-center text-red-600 text-sm px-3 py-2"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionGuard>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">
          <div className="text-sm text-gray-700 dark:text-gray-300 ml-4 mb-4">
            Showing{" "}
            {discounts.length === 0
              ? 0
              : (currentPage - 1) * entriesPerPage + 1}{" "}
            to {Math.min(currentPage * entriesPerPage, totalItems)} of{" "}
            {totalItems} entries
          </div>

          <div className="flex items-center gap-1 mr-3 mb-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-red-500 hover:bg-gray-300"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountTable;
