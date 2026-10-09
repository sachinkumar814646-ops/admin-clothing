// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { Eye, Edit, Trash2 } from "lucide-react";
// import { toast } from "react-toastify";
// import Button from "../../components/ui/Button";

// const UsersListPage = () => {
//   const [users, setUsers] = useState([]); // current page users from backend
//   const [allUsers, setAllUsers] = useState([]); // kept for compatibility but not used to filter client-side
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage, setUsersPerPage] = useState(10); // Default per page
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // Fetch users from API (server-side pagination & search)
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `https://coombb.com/backend/api/users?page=${currentPage}&perPage=${usersPerPage}&search=${encodeURIComponent(
//           searchTerm
//         )}`
//       );
//       // Expecting response structure similar to coupons: { data: [...], total: <number> }
//       const data = res.data?.data ?? res.data ?? [];
//       const totalCount =
//         res.data?.total ?? (Array.isArray(data) ? data.length : 0);

//       setUsers(data);
//       setAllUsers(data); // keep as-is so other logic that references allUsers doesn't break
//       setTotal(totalCount);
//       // clear selection for items not on current page
//       setSelectedUsers((prev) =>
//         prev.filter((id) => data.some((u) => u.id === id))
//       );
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//       toast.error("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage, usersPerPage, searchTerm]);

//   // Single delete
//   const handleDelete = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This user will be permanently deleted!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (result.isConfirmed) {
//       try {
//         await axios.delete(
//           `https://coombb.com/backend/api/users/${id}`
//         );
//         toast.success("User deleted successfully");
//         fetchUsers();
//       } catch (error) {
//         console.error("Delete failed", error);
//         toast.error("Failed to delete user");
//       }
//     }
//   };

//   // Bulk Delete with SweetAlert success
//   const handleBulkDelete = async () => {
//     if (selectedUsers.length === 0) {
//       toast.warning("No users selected");
//       return;
//     }

//     const result = await Swal.fire({
//       title: `Delete ${selectedUsers.length} selected users?`,
//       text: "This action cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete them!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       try {
//         const bulkResp = await axios.post(
//           "https://coombb.com/backend/api/users/bulk-delete",
//           { ids: selectedUsers }
//         );
//         if (bulkResp?.data?.success === false) throw new Error("Bulk failed");
//       } catch (bulkError) {
//         // fallback to individual delete
//         await Promise.all(
//           selectedUsers.map((id) =>
//             axios.delete(
//               `https://coombb.com/backend/api/users/${id}`
//             )
//           )
//         );
//       }
//       setSelectedUsers([]);
//       fetchUsers();

//       Swal.fire(
//         "Deleted!",
//         "Selected users have been deleted successfully.",
//         "success"
//       );
//     } catch (error) {
//       console.error("Bulk delete failed", error);
//       Swal.fire("Error!", "Failed to delete selected users.", "error");
//     }
//   };

//   const totalPages = Math.max(1, Math.ceil(total / usersPerPage));

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 3;
//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       if (currentPage <= 2) pages.push(1, 2, 3, "...", totalPages);
//       else if (currentPage >= totalPages - 1)
//         pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
//       else
//         pages.push(
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages
//         );
//     }
//     return pages;
//   };

//   const toggleSelectUser = (id) => {
//     setSelectedUsers((prev) =>
//       prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedUsers.length === users.length && users.length > 0) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(users.map((u) => u.id));
//     }
//   };

//   const areAllOnPageSelected =
//     users.length > 0 && users.every((u) => selectedUsers.includes(u.id));

//   return (
//     <div className="p-4 bg-transparent">
//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
//         <h2 className="text-2xl font-bold dark:text-white">Users</h2>
//         <div className="flex flex-wrap gap-2 items-center">
//           <input
//             type="text"
//             placeholder="Search users..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border rounded px-3 py-1"
//           />
//           <select
//             value={usersPerPage}
//             onChange={(e) => {
//               setUsersPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border rounded px-3 py-1"
//           >
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//           <button
//             onClick={() => navigate("/newuser")}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Add User
//           </button>
//           <button
//             onClick={handleBulkDelete}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Delete Selected
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-white">
//           <thead>
//             <tr className="bg-black text-white">
//               <th className="p-2 border">
//                 <input
//                   type="checkbox"
//                   checked={areAllOnPageSelected}
//                   onChange={toggleSelectAll}
//                 />
//               </th>
//               <th className="p-2 border">Name</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Phone</th>
//               <th className="p-2 border">Role</th>
//               <th className="p-2 border">Status</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="text-center dark:text-white p-4">
//                   Loading...
//                 </td>
//               </tr>
//             ) : users.length > 0 ? (
//               users.map((user) => (
//                 <tr
//                   key={user.id}
//                   className="text-center border-b dark:text-white"
//                 >
//                   <td className="p-2 border">
//                     <input
//                       type="checkbox"
//                       checked={selectedUsers.includes(user.id)}
//                       onChange={() => toggleSelectUser(user.id)}
//                     />
//                   </td>
//                   <td className="p-2 border">{user.name}</td>
//                   <td className="p-2 border">{user.email}</td>
//                   <td className="p-2 border">{user.phone}</td>
//                   <td className="p-2 border">
//                     {user.roles?.length
//                       ? user.roles.map((role) => role.role_name).join(", ")
//                       : "No Roles"}
//                   </td>
//                   <td className="p-2 border">
//                     {user.status === 1 || user.status === "1"
//                       ? "Active"
//                       : "Inactive"}
//                   </td>
//                   <td className="p-2 border space-x-2">
//                     <button
//                       onClick={() => navigate(`/view-user/${user.id}`)}
//                       className="text-green-500 hover:text-green-700"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     <button
//                       onClick={() => navigate(`/edit-user/${user.id}`)}
//                       className="text-yellow-500 hover:text-yellow-700"
//                     >
//                       <Edit size={16} />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(user.id)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center dark:text-white p-4">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
//         <div className="text-sm text-gray-600 dark:text-white ml-3 mb-4">
//           Showing {total === 0 ? 0 : (currentPage - 1) * usersPerPage + 1} to{" "}
//           {currentPage * usersPerPage > total
//             ? total
//             : currentPage * usersPerPage}{" "}
//           of {total} entries
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           {/* Previous */}
//           <Button
//             size="sm"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//           >
//             Previous
//           </Button>

//           {/* First Page Always */}
//           <Button
//             size="sm"
//             variant={currentPage === 1 ? "default" : "outline"}
//             onClick={() => setCurrentPage(1)}
//           >
//             1
//           </Button>

//           {/* Left Dots */}
//           {currentPage > 3 && <span className="px-2 py-1">...</span>}

//           {/* Middle Pages (window of 3 around currentPage) */}
//           {Array.from({ length: 3 }, (_, i) => {
//             const pageNumber = currentPage - 1 + i;
//             if (pageNumber > 1 && pageNumber < totalPages) {
//               return (
//                 <Button
//                   key={pageNumber}
//                   size="sm"
//                   variant={currentPage === pageNumber ? "default" : "outline"}
//                   onClick={() => setCurrentPage(pageNumber)}
//                 >
//                   {pageNumber}
//                 </Button>
//               );
//             }
//             return null;
//           })}

//           {/* Right Dots */}
//           {currentPage < totalPages - 2 && (
//             <span className="px-2 py-1">...</span>
//           )}

//           {/* Last Page Always */}
//           {totalPages > 1 && (
//             <Button
//               size="sm"
//               variant={currentPage === totalPages ? "default" : "outline"}
//               onClick={() => setCurrentPage(totalPages)}
//             >
//               {totalPages}
//             </Button>
//           )}

//           {/* Next */}
//           <Button
//             size="sm"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//           >
//             Next
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersListPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Eye, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Button from "../../components/ui/Button";
import PermissionGuard from "../../components/auth/PermissionGuard";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("asc");
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState(null); // pagination meta
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch users with backend pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://coombb.com/backend/api/users?page=${currentPage}&perPage=${usersPerPage}&search=${encodeURIComponent(
          searchTerm,
        )}&sort=${sortOrder}`,
      );

      setUsers(res.data?.data ?? []);
      setMeta(res.data?.meta ?? null);
      setTotal(res.data?.meta?.total ?? 0);

      // clear selection for items not on current page
      setSelectedUsers((prev) =>
        prev.filter((id) => (res.data?.data ?? []).some((u) => u.id === id)),
      );
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, usersPerPage, searchTerm, sortOrder]);

  // Delete handlers (same as before)
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://coombb.com/backend/api/users/${id}`);
        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Delete failed", error);
        toast.error("Failed to delete user");
      }
    }
  };

  {
    /* Bulk Delete Handler */
  }
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.warning("No users selected");
      return;
    }

    const result = await Swal.fire({
      title: `Delete ${selectedUsers.length} selected users?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.post("https://coombb.com/backend/api/user/bulk-delete", {
        ids: selectedUsers,
      });

      setSelectedUsers([]);
      fetchUsers();

      Swal.fire(
        "Deleted!",
        "Selected users have been deleted successfully.",
        "success",
      );
    } catch (error) {
      console.error("Bulk delete failed", error);
      Swal.fire("Error!", "Failed to delete selected users.", "error");
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length && users.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  const areAllOnPageSelected =
    users.length > 0 && users.every((u) => selectedUsers.includes(u.id));

  return (
    <div className="p-4 bg-transparent">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
        <h2 className="text-2xl font-bold dark:text-white">Users</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          />

          <select
            value={usersPerPage}
            onChange={(e) => {
              setUsersPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            {[10, 20, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded px-3 py-1"
          >
            <option value="asc">Sort Asc</option>
            <option value="desc">Sort Desc</option>
          </select>

          <PermissionGuard permission="create_user">
            <button
              onClick={() => navigate("/newuser")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Add User
            </button>
          </PermissionGuard>

          <PermissionGuard permission="bulk_delete_variants_colors">
            <button
              onClick={handleBulkDelete}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Delete Selected
            </button>
          </PermissionGuard>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-white">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-2 border">
                <input
                  type="checkbox"
                  checked={areAllOnPageSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center dark:text-white p-4">
                  Loading...
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="text-center border-b dark:text-white"
                >
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelectUser(user.id)}
                    />
                  </td>
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.phone}</td>
                  <td className="p-2 border">
                    {user.roles?.length
                      ? user.roles.map((role) => role.role_name).join(", ")
                      : "No Roles"}
                  </td>
                  <td className="p-2 border">
                    {user.status === 1 || user.status === "1"
                      ? "Active"
                      : "Inactive"}
                  </td>
                  <td className="p-2 border space-x-2">
                    <PermissionGuard permission="view_user">
                      <button
                        onClick={() => navigate(`/view-user/${user.id}`)}
                        className="text-green-500 hover:text-green-700"
                      >
                        <Eye size={16} />
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission="edit_user">
                      <button
                        onClick={() => navigate(`/edit-user/${user.id}`)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        <Edit size={16} />
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission="delete_user">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center dark:text-white p-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <div className="text-sm text-gray-600 dark:text-white ml-3 mb-4">
            Showing {meta.from ?? 0} to {meta.to ?? 0} of {meta.total ?? 0}{" "}
            entries
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              disabled={meta.current_page === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>

            {/* First Page */}
            <Button
              size="sm"
              variant={meta.current_page === 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(1)}
            >
              1
            </Button>

            {/* Left ellipsis */}
            {meta.current_page > 3 && <span className="px-2">...</span>}

            {/* Middle Pages */}
            {Array.from({ length: 3 }, (_, i) => {
              const pageNumber = meta.current_page - 1 + i;
              if (pageNumber > 1 && pageNumber < meta.last_page) {
                return (
                  <Button
                    key={pageNumber}
                    size="sm"
                    variant={
                      meta.current_page === pageNumber ? "default" : "outline"
                    }
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              }
              return null;
            })}

            {/* Right ellipsis */}
            {meta.current_page < meta.last_page - 2 && (
              <span className="px-2">...</span>
            )}

            {/* Last Page */}
            {meta.last_page > 1 && (
              <Button
                size="sm"
                variant={
                  meta.current_page === meta.last_page ? "default" : "outline"
                }
                onClick={() => setCurrentPage(meta.last_page)}
              >
                {meta.last_page}
              </Button>
            )}

            <Button
              size="sm"
              disabled={meta.current_page === meta.last_page}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, meta.last_page))
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersListPage;
