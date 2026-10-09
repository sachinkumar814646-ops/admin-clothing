// // import React, { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { toast, ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // export default function RoleTable() {
// //   const [roles, setRoles] = useState([]);
// //   const [page, setPage] = useState(1);
// //   const [lastPage, setLastPage] = useState(1);
// //   const [loading, setLoading] = useState(false);

// //   const navigate = useNavigate();

// //   const fetchRoles = async (pageNum = 1) => {
// //     setLoading(true);
// //     try {
// //       const res = await fetch(
// //         `https://coombb.com/backend/api/roles?page=${pageNum}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       const data = await res.json();
// //       if (Array.isArray(data.data)) {
// //         setRoles(data.data);
// //         if (data.meta?.last_page) {
// //           setLastPage(data.meta.last_page);
// //         }
// //         setPage(pageNum);
// //       } else {
// //         toast.error("Failed to fetch roles.");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching roles:", error);
// //       toast.error("Error fetching roles ❌");
// //     }
// //     setLoading(false);
// //   };

// //   useEffect(() => {
// //     fetchRoles(page);
// //   }, []);

// //   const handleDelete = async (roleId) => {
// //     if (!window.confirm("Are you sure you want to delete this role?")) return;

// //     try {
// //       const res = await fetch(
// //         `https://coombb.com/backend/api/roles/${roleId}`,
// //         {
// //           method: "DELETE",
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       console.log("roleId", roleId);
// //       const data = await res.json();
// //       console.log("data", data);
// //       debugger;
// //       if (data.status) {
// //         toast.success("Role deleted successfully!");
// //         fetchRoles(page);
// //       } else {
// //         toast.error(data.message || "Failed to delete role ❌");
// //       }
// //     } catch (error) {
// //       console.error("Error deleting role:", error);
// //       toast.error("Error deleting role ❌");
// //     }
// //   };

// //   return (
// //     <div className="max-w-5xl mx-auto p-6 dark:bg-gray-900 rounded-lg shadow-md mt-6">
// //       <h2 className="text-2xl font-bold mb-4 dark:text-white">Roles</h2>

// //       <button
// //         onClick={() => navigate("/add-roles")}
// //         className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
// //       >
// //         Add New Role
// //       </button>

// //       {loading ? (
// //         <p className="text-white">Loading roles...</p>
// //       ) : roles.length === 0 ? (
// //         <p className="text-white">No roles found.</p>
// //       ) : (
// //         <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
// //           <thead className="bg-gray-200 dark:bg-gray-700">
// //             <tr>
// //               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
// //                 Name
// //               </th>
// //               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
// //                 Permissions
// //               </th>
// //               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
// //                 Actions
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {roles.map((role) => (
// //               <tr
// //                 key={role.id}
// //                 className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
// //               >
// //                 <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
// //                   {role.name}
// //                 </td>

// //                 <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
// //                   {Array.isArray(role.permissions) &&
// //                   role.permissions.length > 0 ? (
// //                     <div className="grid grid-cols-3 gap-2">
// //                       {role.permissions.map((perm) => (
// //                         <div
// //                           key={perm.id}
// //                           className="overflow-hidden max-w-full"
// //                           style={{ maxWidth: "100%" }}
// //                         >
// //                           <span className="block whitespace-nowrap overflow-hidden text-ellipsis bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border border-blue-500 px-3 py-1 rounded-full text-sm text-center">
// //                             {perm.name}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   ) : (
// //                     "-"
// //                   )}
// //                 </td>

// //                 <td className="py-3 px-6 flex space-x-2">
// //                   <button
// //                     onClick={() => navigate(`/edit-roles/${role.id}`)}
// //                     className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
// //                   >
// //                     Edit
// //                   </button>
// //                   <button
// //                     onClick={() => handleDelete(role.id)}
// //                     className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
// //                   >
// //                     Delete
// //                   </button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       )}

// //       {/* Pagination */}
// //       <div className="mt-4 flex justify-between">
// //         <button
// //           disabled={page <= 1}
// //           onClick={() => fetchRoles(page - 1)}
// //           className={`px-4 py-2 rounded ${
// //             page <= 1
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-red-600 hover:bg-red-700 text-white"
// //           }`}
// //         >
// //           Previous
// //         </button>
// //         <span className="text-white self-center">
// //           Page {page} of {lastPage}
// //         </span>
// //         <button
// //           disabled={page >= lastPage}
// //           onClick={() => fetchRoles(page + 1)}
// //           className={`px-4 py-2 rounded ${
// //             page >= lastPage
// //               ? "bg-gray-400 cursor-not-allowed"
// //               : "bg-red-600 hover:bg-red-700 text-white"
// //           }`}
// //         >
// //           Next
// //         </button>
// //       </div>

// //       <ToastContainer />
// //     </div>
// //   );
// // }

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export default function RoleTable() {
//   const [roles, setRoles] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage, setPerPage] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const fetchRoles = async (pageNum = 1) => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://coombb.com/backend/api/roles?page=${pageNum}&perPage=${perPage}&search=${searchTerm}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (Array.isArray(data.data)) {
//         setRoles(data.data);
//         if (data.meta) {
//           setTotalPages(data.meta.last_page || 1);
//           setTotalItems(data.meta.total || data.data.length);
//         }
//         setCurrentPage(pageNum);
//       } else {
//         setRoles([]);
//         toast.error("Failed to fetch roles.");
//       }
//     } catch (error) {
//       console.error("Error fetching roles:", error);
//       toast.error("Error fetching roles ❌");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchRoles(currentPage);
//   }, [currentPage, perPage, searchTerm]);

//   const handleDelete = async (roleId) => {
//     if (!window.confirm("Are you sure you want to delete this role?")) return;

//     try {
//       const res = await fetch(
//         `https://coombb.com/backend/api/roles/${roleId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const data = await res.json();
//       if (data.status) {
//         toast.success("Role deleted successfully!");
//         fetchRoles(currentPage);
//       } else {
//         toast.error(data.message || "Failed to delete role ❌");
//       }
//     } catch (error) {
//       console.error("Error deleting role:", error);
//       toast.error("Error deleting role ❌");
//     }
//   };

//   const startIndex = (currentPage - 1) * perPage;
//   const endIndex = Math.min(startIndex + perPage, totalItems);

//   return (
//     <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900 rounded-lg shadow-md mt-6">
//       <h2 className="text-2xl font-bold mb-4 dark:text-white">Roles</h2>

//       <div className="flex justify-between mb-4">
//         <button
//           onClick={() => navigate("/add-roles")}
//           className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//         >
//           Add New Role
//         </button>
//       </div>

//       {/* Top controls */}
//       <div className="flex justify-between items-center mb-3 dark:text-white">
//         <div>
//           Show{" "}
//           <select
//             value={perPage}
//             onChange={(e) => {
//               setPerPage(parseInt(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border p-1 rounded bg-transparent"
//           >
//             <option value={10}>10</option>
//             <option value={30}>30</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>{" "}
//           entries
//         </div>
//         <div>
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => {
//               setSearchTerm(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="border p-1 rounded bg-transparent"
//             style={{ width: "310px" }}
//           />
//         </div>
//       </div>

//       {/* Table */}
//       {loading ? (
//         <p className="text-white">Loading roles...</p>
//       ) : roles.length === 0 ? (
//         <p className="text-white">No roles found.</p>
//       ) : (
//         <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border">
//           <thead className="bg-gray-200 dark:bg-gray-700">
//             <tr>
//               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
//                 Name
//               </th>
//               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
//                 Permissions
//               </th>
//               <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {roles.map((role) => (
//               <tr
//                 key={role.id}
//                 className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
//                   {role.name}
//                 </td>

//                 <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
//                   {Array.isArray(role.permissions) &&
//                   role.permissions.length > 0 ? (
//                     <div className="grid grid-cols-3 gap-2">
//                       {role.permissions.map((perm) => (
//                         <div
//                           key={perm.id}
//                           className="overflow-hidden max-w-full"
//                         >
//                           <span className="block whitespace-nowrap overflow-hidden text-ellipsis bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border border-blue-500 px-3 py-1 rounded-full text-sm text-center">
//                             {perm.name}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     "-"
//                   )}
//                 </td>

//                 <td className="py-3 px-6 flex space-x-2">
//                   <button
//                     onClick={() => navigate(`/edit-roles/${role.id}`)}
//                     className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(role.id)}
//                     className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Pagination + Info */}
//       <div className="flex justify-between items-center mt-4 gap-2 dark:text-white">
//         <div>
//           Showing {totalItems === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
//           {totalItems} entries
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Previous Button */}
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           {/* First Page Always */}
//           <button
//             className={`px-3 py-1 border rounded ${
//               currentPage === 1
//                 ? "bg-red-600 text-white"
//                 : "bg-transparent dark:text-white"
//             }`}
//             onClick={() => setCurrentPage(1)}
//           >
//             1
//           </button>

//           {/* Left Dots */}
//           {currentPage > 3 && (
//             <span className="px-2 flex items-center">...</span>
//           )}

//           {/* Dynamic Middle Pages */}
//           {Array.from({ length: 3 }, (_, i) => {
//             const pageNumber = currentPage - 1 + i;
//             if (pageNumber > 1 && pageNumber < totalPages) {
//               return (
//                 <button
//                   key={pageNumber}
//                   onClick={() => setCurrentPage(pageNumber)}
//                   className={`px-3 py-1 border rounded ${
//                     currentPage === pageNumber
//                       ? "bg-red-600 text-white"
//                       : "bg-transparent dark:text-white"
//                   }`}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             }
//             return null;
//           })}

//           {/* Right Dots */}
//           {currentPage < totalPages - 2 && (
//             <span className="px-2 flex items-center">...</span>
//           )}

//           {/* Last Page Always */}
//           {totalPages > 1 && (
//             <button
//               className={`px-3 py-1 border rounded ${
//                 currentPage === totalPages
//                   ? "bg-red-600 text-white"
//                   : "bg-transparent dark:text-white"
//               }`}
//               onClick={() => setCurrentPage(totalPages)}
//             >
//               {totalPages}
//             </button>
//           )}

//           {/* Next Button */}
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import PermissionGuard from "../../components/auth/PermissionGuard";

export default function RoleTable() {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [links, setLinks] = useState([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const navigate = useNavigate();

  const fetchRoles = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://coombb.com/backend/api/roles?page=${pageNum}&perPage=${perPage}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setRoles(data.data);
        if (data.meta) {
          setCurrentPage(data.meta.current_page);
          setTotalPages(data.meta.last_page);
          setTotalItems(data.meta.total);
          setLinks(data.meta.links);
          setFrom(data.meta.from);
          setTo(data.meta.to);
        }
      } else {
        setRoles([]);
        toast.error("Failed to fetch roles.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Error fetching roles ❌");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles(currentPage);
  }, [currentPage, perPage, searchTerm]);

  const handleDelete = async (roleId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This role will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        `https://coombb.com/backend/api/roles/${roleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = await res.json();
      if (data.status) {
        Swal.fire("Deleted!", "Role deleted successfully.", "success");
        fetchRoles(currentPage);
      } else {
        Swal.fire(
          "Error!",
          data.message || "Failed to delete role ❌",
          "error",
        );
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      Swal.fire("Error!", "Error deleting role ❌", "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRoles.length === 0) {
      Swal.fire("Warning", "Please select at least one role!", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Selected roles will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete them!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(
        "https://coombb.com/backend/api/role/bulk-delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ids: selectedRoles }),
        },
      );
      const data = await res.json();
      if (data.status) {
        Swal.fire(
          "Deleted!",
          "Selected roles deleted successfully.",
          "success",
        );
        setSelectedRoles([]);
        fetchRoles(currentPage);
      } else {
        Swal.fire("Error!", data.message || "Bulk delete failed ❌", "error");
      }
    } catch (error) {
      console.error("Error bulk deleting roles:", error);
      Swal.fire("Error!", "Error deleting roles ❌", "error");
    }
  };

  const toggleSelectRole = (id) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedRoles.length === roles.length) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles.map((r) => r.id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 dark:bg-gray-900 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Roles</h2>

      <div className="flex justify-between mb-4 gap-2">
        <PermissionGuard permission="create_role">
          <button
            onClick={() => navigate("/add-roles")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Add New Role
          </button>
        </PermissionGuard>
        <PermissionGuard permission="view_role">
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Bulk Delete
          </button>
        </PermissionGuard>
      </div>

      <div className="flex justify-between items-center mb-3 dark:text-white">
        <div>
          Show{" "}
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(parseInt(e.target.value));
              setCurrentPage(1);
            }}
            className="border p-1 rounded bg-transparent"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{" "}
          entries
        </div>
        <div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-1 rounded bg-transparent"
            style={{ width: "310px" }}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-white">Loading roles...</p>
      ) : roles.length === 0 ? (
        <p className="text-white">No roles found.</p>
      ) : (
        <>
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden border">
            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
                  <input
                    type="checkbox"
                    checked={
                      roles.length > 0 && selectedRoles.length === roles.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
                  Permissions
                </th>
                <th className="py-3 px-6 text-left text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr
                  key={role.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role.id)}
                      onChange={() => toggleSelectRole(role.id)}
                    />
                  </td>
                  <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
                    {role.name}
                  </td>
                  <td className="py-3 px-6 text-gray-800 dark:text-gray-200">
                    {Array.isArray(role.permissions) &&
                    role.permissions.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {role.permissions.map((perm) => (
                          <div
                            key={perm.id}
                            className="overflow-hidden max-w-full"
                          >
                            <span className="block whitespace-nowrap overflow-hidden text-ellipsis bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 border border-blue-500 px-3 py-1 rounded-full text-sm text-center">
                              {perm.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-3 px-6 flex space-x-2">
                    <PermissionGuard permission="edit_role">
                      <button
                        onClick={() => navigate(`/edit-roles/${role.id}`)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Edit
                      </button>
                    </PermissionGuard>
                    <PermissionGuard permission="remove_role">
                      <button
                        onClick={() => handleDelete(role.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination + Info */}
          <div className="flex justify-between items-center mt-4 gap-2 dark:text-white flex-wrap">
            <div>
              Showing {from || 0} to {to || 0} of {totalItems} entries
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {links.map((link, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 border rounded ${
                    link.active
                      ? "bg-red-600 text-white"
                      : "bg-transparent dark:text-white"
                  }`}
                  onClick={() => link.page && setCurrentPage(link.page)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}
