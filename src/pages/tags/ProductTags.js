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

const ProductTagsPage = () => {
  const navigate = useNavigate();
  const [productTags, setProductTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const token = localStorage.getItem("token");

  // Fetch product tags from API
  const fetchTags = async () => {
    try {
      const res = await axios.get(
        `https://coombb.com/backend/api/tags?page=${page}&perPage=${itemsPerPage}&search=${searchTerm}&sortDir=desc`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log("Tag List API Response:", res.data);
      setProductTags(res.data.data || []);
      if (res.data.meta) {
        setTotalItems(res.data.meta.total || 0);
        setLastPage(res.data.meta.last_page || 1);
      }
    } catch (error) {
      console.error("Error fetching tags:", error.response || error);
      setProductTags([]);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [page, itemsPerPage, searchTerm]);

  // Delete single tag
  const deleteTag = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This tag will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://coombb.com/backend/api/tags/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "The tag has been deleted.", "success");
          fetchTags();
        } catch (error) {
          console.error("Error deleting tag:", error.response || error);
          Swal.fire("Error", "Failed to delete the tag.", "error");
        }
      }
    });
  };

  // Bulk delete
  const handleBulkDelete = () => {
    if (selectedTags.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${selectedTags.length} tags.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await Promise.all(
            selectedTags.map((id) =>
              axios.delete(`https://coombb.com/backend/api/tags/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ),
          );
          Swal.fire("Deleted!", "Selected tags have been deleted.", "success");
          setSelectedTags([]);
          fetchTags();
        } catch (error) {
          console.error("Bulk delete error:", error.response || error);
          Swal.fire("Error", "Failed to delete selected tags.", "error");
        }
      }
    });
  };

  const areAllOnPageSelected =
    productTags.length > 0 &&
    productTags.every((tag) => selectedTags.includes(tag.id));

  const handleSelectAllTags = (e) => {
    if (e.target.checked) {
      const idsOnPage = productTags.map((tag) => tag.id);
      setSelectedTags((prev) => [...new Set([...prev, ...idsOnPage])]);
    } else {
      const idsOnPage = productTags.map((tag) => tag.id);
      setSelectedTags((prev) => prev.filter((id) => !idsOnPage.includes(id)));
    }
  };

  const handleSelectTag = (id) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-4 lg:px-6 py-4">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Product Tags</h1>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Product Tags</CardTitle>
              <CardDescription>Manage your product tags</CardDescription>
            </div>
            <div className="flex gap-2">
              {selectedTags.length > 0 && (
                <PermissionGuard permission="bulk_delete_product_tags">
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Bulk Delete ({selectedTags.length})
                  </Button>
                </PermissionGuard>
              )}
              <PermissionGuard permission="create_product_tags">
                <Button onClick={() => navigate("/add-tag")}>
                  <Plus className="mr-2 h-4 w-4" /> Add New
                </Button>
              </PermissionGuard>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <label>Show</label>
              <select
                value={itemsPerPage}
                style={{ marginBottom: "9px" }}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-gray-300 text-black"
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
                      onChange={handleSelectAllTags}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productTags.length > 0 ? (
                  productTags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.id)}
                          onChange={() => handleSelectTag(tag.id)}
                        />
                      </TableCell>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>
                        {tag.status === true ? (
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
                        {tag.created_at
                          ? new Date(tag.created_at).toLocaleString()
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        <PermissionGuard permission="edit_product_tags">
                          <button
                            onClick={() => navigate(`/edit-tag/${tag.id}`)}
                            className="text-blue-500 mr-3"
                          >
                            <Pencil size={18} />
                          </button>
                        </PermissionGuard>
                        <PermissionGuard permission="delete_product_tags">
                          <Button
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => deleteTag(tag.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </PermissionGuard>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No tags found
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
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span>
              Page {page} of {lastPage}
            </span>
            <Button
              disabled={page === lastPage || lastPage === 0}
              onClick={() => setPage(page + 1)}
              className="bg-red-500 text-white"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTagsPage;
