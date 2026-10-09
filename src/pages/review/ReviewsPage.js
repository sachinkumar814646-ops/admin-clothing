// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/Card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/Table";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";
// import Input from "../../components/ui/Input";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../../components/ui/Dialog";
// import StatsCard from "../../components/common/Card";
// import { Star, Eye, MessageSquare, User, ThumbsUp, Search } from "lucide-react";
// import Swal from "sweetalert2";

// const ReviewsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [showViewDialog, setShowViewDialog] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [reviews, setReviews] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [page, setPage] = useState(1);
//   const [meta, setMeta] = useState(null);
//   const token = localStorage.getItem("token");

//   // Fetch reviews with backend pagination
//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const query = new URLSearchParams({
//         page,
//         perPage: entriesPerPage,
//         search: searchTerm,
//         status: statusFilter === "all" ? "" : statusFilter,
//       }).toString();

//       const res = await axios.get(
//         `https://coombb.com/backend/api/product-reviews?${query}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
// console.log(res)
//       if (res.data.success) {
//         const mappedReviews = res.data.data.map((item) => ({
//           id: item.id,
//           product_id: item.product_id,
//           rating_value: item.rating_value,
//           rating_title: item.rating_title || "No Title",
//           rating_desc: item.rating_desc || "No Comment Provided",
//           product: `Product #${item.product_id}`,
//           customer: `User #${item.user_id || "Guest"}`,
//           email: "N/A",
//           rating: parseInt(item.rating_value) || 0,
//           title: item.rating_title || "No Title",
//           comment: item.rating_desc || "No Comment Provided",
//           date: item.created_at,
//           status: item.is_active === 1 ? 1 : 0,
//         }));

//         setReviews(mappedReviews);
//         setMeta(res.data.meta);
//       } else {
//         setReviews([]);
//         setMeta(null);
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, [page, entriesPerPage, searchTerm, statusFilter]);

//   const handleStatusToggle = async (reviewId, currentStatus) => {
//     try {
//       const newStatus = currentStatus === 1 ? 0 : 1;

//       const review = reviews.find((r) => r.id === reviewId);
//       if (!review) return;

//       const payload = {
//         product_id: review.product_id,
//         rating_value: review.rating_value,
//         rating_title: review.rating_title || "",
//         rating_desc: review.rating_desc || "",
//         status: newStatus,
//       };

//       await axios.patch(
//         `https://coombb.com/backend/api/product-reviews/${reviewId}/status`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setReviews((prev) =>
//         prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
//       );

//       Swal.fire(
//         "Updated!",
//         `Review has been ${newStatus === 1 ? "activated" : "deactivated"}`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Failed to update review status:", error);
//       Swal.fire("Error!", "Failed to update review status", "error");
//     }
//   };

//   const handleView = (review) => {
//     setSelectedReview(review);
//     setShowViewDialog(true);
//   };

//   const getStatusBadge = (status) => {
//     return status === 1 ? (
//       <Badge className="bg-green-100 text-green-800">Active</Badge>
//     ) : (
//       <Badge className="bg-red-100 text-red-800">Inactive</Badge>
//     );
//   };

//   const renderStars = (rating) => {
//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`h-4 w-4 ${
//               i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   const getPageNumbers = () => {
//     if (!meta) return [];
//     const totalPages = meta.last_page;
//     const pages = [];
//     for (let i = 1; i <= totalPages; i++) pages.push(i);
//     return pages;
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight dark:text-white">
//           Review Management
//         </h1>
//         <p className="text-muted-foreground">
//           Manage customer reviews and feedback
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           title="Total Reviews"
//           value={meta?.total || 0}
//           icon={<MessageSquare />}
//         />
//         <StatsCard
//           title="Active Reviews"
//           value={reviews.filter((r) => r.status === 1).length}
//           icon={<ThumbsUp />}
//         />
//         <StatsCard
//           title="Inactive Reviews"
//           value={reviews.filter((r) => r.status === 0).length}
//           icon={<User />}
//         />
//         <StatsCard
//           title="Average Rating"
//           value={
//             reviews.length > 0
//               ? (
//                   reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
//                 ).toFixed(1)
//               : 0
//           }
//           icon={<Star />}
//         />
//       </div>

//       {/* Filters & Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Reviews</CardTitle>
//           <CardDescription>
//             Manage and moderate customer reviews
//           </CardDescription>
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
//             <div className="flex items-center gap-2">
//               Show{" "}
//               <select
//                 className="border p-1 rounded bg-transparent text-sm"
//                 value={entriesPerPage}
//                 onChange={(e) => {
//                   setEntriesPerPage(Number(e.target.value));
//                   setPage(1);
//                 }}
//               >
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//                 <option value={100}>100</option>
//               </select>{" "}
//               entries
//             </div>
//             <div className="flex ml-auto gap-2">
//               <Input
//                 placeholder="Search reviews..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setPage(1);
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             <div className="mt-1 sm:mt-0">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="border rounded p-2 bg-white dark:bg-transparent dark:text-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div>
//           </div>
//         </CardHeader>

//         <CardContent className="overflow-x-auto">
//           {loading ? (
//             <div className="text-center py-6 text-muted-foreground">
//               Loading reviews...
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Product</TableHead>
//                   <TableHead>Customer</TableHead>
//                   <TableHead>Rating</TableHead>
//                   <TableHead>Review</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {reviews.length > 0 ? (
//                   reviews.map((review) => (
//                     <TableRow key={review.id}>
//                       <TableCell>{review.product}</TableCell>
//                       <TableCell>
//                         <div>
//                           <div className="font-medium">
//                             {review.user?.name || "N/A"}
//                           </div>
//                           <div className="text-sm text-muted-foreground truncate max-w-[200px]">
//                             {review.user?.email || "N/A"}
//                           </div>
//                         </div>
//                       </TableCell>

//                       <TableCell>{renderStars(review.rating)}</TableCell>
//                       <TableCell className="max-w-xs">
//                         <div>
//                           <div className="font-medium text-sm">
//                             {review.title}
//                           </div>
//                           <div className="text-sm text-muted-foreground truncate">
//                             {review.comment}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {new Date(review.date).toLocaleDateString()}
//                       </TableCell>
//                       <TableCell>{getStatusBadge(review.status)}</TableCell>
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => handleView(review)}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() =>
//                               handleStatusToggle(review.id, review.status)
//                             }
//                             className={
//                               review.status === 1
//                                 ? "text-red-600 border-red-600 hover:bg-red-50"
//                                 : "text-green-600 border-green-600 hover:bg-green-50"
//                             }
//                           >
//                             {review.status === 1 ? "Deactivate" : "Activate"}
//                           </Button>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-4">
//                       No reviews found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}

//           {/* Pagination */}
//           {meta && (
//             <div className="flex justify-between items-center mt-4 dark:text-white">
//               <div>
//                 Showing {meta.from || 0} to {meta.to || 0} of {meta.total || 0}{" "}
//                 entries
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                   disabled={page === 1}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Previous
//                 </button>

//                 {getPageNumbers().map((p) => (
//                   <button
//                     key={p}
//                     className={`px-3 py-1 border rounded ${
//                       page === p
//                         ? "bg-red-600 text-white"
//                         : "bg-transparent dark:text-white"
//                     }`}
//                     onClick={() => setPage(p)}
//                   >
//                     {p}
//                   </button>
//                 ))}

//                 <button
//                   onClick={() =>
//                     setPage((p) => Math.min(p + 1, meta.last_page))
//                   }
//                   disabled={page === meta.last_page}
//                   className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* View Dialog */}
//       <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Review Details</DialogTitle>
//             <DialogDescription>
//               Full details of the selected review
//             </DialogDescription>
//           </DialogHeader>

//           {selectedReview && (
//             <div className="overflow-x-auto">
//               <table className="w-full border border-gray-300 dark:border-gray-700 text-sm">
//                 <tbody>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2 w-1/3">Product</td>
//                     <td className="p-2">{selectedReview.product}</td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Customer</td>
//                     <td className="p-2">{selectedReview.customer}</td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Email</td>
//                     <td className="p-2">{selectedReview.email}</td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Rating</td>
//                     <td className="p-2">
//                       {renderStars(selectedReview.rating)}
//                     </td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Title</td>
//                     <td className="p-2">{selectedReview.title}</td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Comment</td>
//                     <td className="p-2">{selectedReview.comment}</td>
//                   </tr>
//                   <tr className="border-b dark:border-gray-700">
//                     <td className="font-semibold p-2">Status</td>
//                     <td className="p-2">
//                       {getStatusBadge(selectedReview.status)}
//                     </td>
//                   </tr>
//                   <tr>
//                     <td className="font-semibold p-2">Date</td>
//                     <td className="p-2">
//                       {new Date(selectedReview.date).toLocaleString()}
//                     </td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowViewDialog(false)}>
//               Close
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ReviewsPage;

// "use client";

// import { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/Card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../components/ui/Table";
// import Button from "../../components/ui/Button";
// import Badge from "../../components/ui/Badge";
// import Input from "../../components/ui/Input";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "../../components/ui/Dialog";
// import StatsCard from "../../components/common/Card";
// import { Star, Eye, MessageSquare, User, ThumbsUp } from "lucide-react";
// import Swal from "sweetalert2";
// import PermissionGuard from "../../components/auth/PermissionGuard";

// const ReviewsPage = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [selectedReview, setSelectedReview] = useState(null);
//   const [showViewDialog, setShowViewDialog] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [reviews, setReviews] = useState([]);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [page, setPage] = useState(1);
//   const [meta, setMeta] = useState(null);
//   const [selectedReviews, setSelectedReviews] = useState([]);
//   const token = localStorage.getItem("token");

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       const query = new URLSearchParams({
//         page,
//         perPage: entriesPerPage,
//         search: searchTerm,
//         status: statusFilter === "all" ? "" : statusFilter,
//       }).toString();

//       const res = await axios.get(
//         `https://coombb.com/backend/api/product-reviews?${query}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         const mappedReviews = res.data.data.map((item) => ({
//           id: item.id,
//           product_id: item.product_id,
//           rating_value: item.rating_value,
//           rating_title: item.rating_title || "No Title",
//           rating_desc: item.rating_desc || "No Comment Provided",
//           product: item.product?.name || `Product #${item.product_id}`,
//           customer: item.user?.name || "Guest",
//           email: item.user?.email || "N/A",
//           rating: parseInt(item.rating_value) || 0,
//           title: item.rating_title || "No Title",
//           comment: item.rating_desc || "No Comment Provided",
//           date: item.created_at,
//           status: item.is_active === 1 ? 1 : 0,
//         }));

//         setReviews(mappedReviews);
//         setMeta(res.data.meta);
//       } else {
//         setReviews([]);
//         setMeta(null);
//       }
//     } catch (error) {
//       console.error("Error fetching reviews:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReviews();
//   }, [page, entriesPerPage, searchTerm, statusFilter]);

//   const handleStatusToggle = async (reviewId, currentStatus) => {
//     try {
//       const newStatus = currentStatus === 1 ? 0 : 1;
//       const review = reviews.find((r) => r.id === reviewId);
//       if (!review) return;

//       const payload = {
//         product_id: review.product_id,
//         rating_value: review.rating_value,
//         rating_title: review.rating_title || "",
//         rating_desc: review.rating_desc || "",
//         status: newStatus,
//       };

//       await axios.patch(
//         `https://coombb.com/backend/api/product-reviews/${reviewId}/status`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setReviews((prev) =>
//         prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r))
//       );

//       Swal.fire(
//         "Updated!",
//         `Review has been ${newStatus === 1 ? "activated" : "deactivated"}`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Failed to update review status:", error);
//       Swal.fire("Error!", "Failed to update review status", "error");
//     }
//   };

//   const handleView = (review) => {
//     setSelectedReview(review);
//     setShowViewDialog(true);
//   };

//   const getStatusBadge = (status) => {
//     return status === 1 ? (
//       <Badge className="bg-green-100 text-green-800">Active</Badge>
//     ) : (
//       <Badge className="bg-red-100 text-red-800">Inactive</Badge>
//     );
//   };

//   const renderStars = (rating) => {
//     return (
//       <div className="flex items-center">
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             className={`h-4 w-4 ${
//               i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
//             }`}
//           />
//         ))}
//       </div>
//     );
//   };

//   // Bulk delete
//   const handleBulkDelete = async () => {
//     if (selectedReviews.length === 0) {
//       Swal.fire("Warning!", "No reviews selected", "warning");
//       return;
//     }

//     const confirmed = await Swal.fire({
//       title: `Delete ${selectedReviews.length} review(s)?`,
//       text: "This action cannot be undone",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete",
//       cancelButtonText: "Cancel",
//     });

//     if (confirmed.isConfirmed) {
//       try {
//         await axios.post(
//           "https://coombb.com/backend/api/product-review/bulk-delete",
//           { ids: selectedReviews },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         Swal.fire("Deleted!", "Selected reviews have been deleted", "success");
//         setSelectedReviews([]);
//         fetchReviews();
//       } catch (error) {
//         console.error("Bulk delete error:", error);
//         Swal.fire("Error!", "Failed to delete selected reviews", "error");
//       }
//     }
//   };

//   const toggleSelectReview = (id) => {
//     setSelectedReviews((prev) =>
//       prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedReviews.length === reviews.length) {
//       setSelectedReviews([]);
//     } else {
//       setSelectedReviews(reviews.map((r) => r.id));
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight dark:text-white">
//           Review Management
//         </h1>
//         <p className="text-muted-foreground">
//           Manage customer reviews and feedback
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatsCard
//           title="Total Reviews"
//           value={meta?.total || 0}
//           icon={<MessageSquare />}
//         />
//         <StatsCard
//           title="Active Reviews"
//           value={reviews.filter((r) => r.status === 1).length}
//           icon={<ThumbsUp />}
//         />
//         <StatsCard
//           title="Inactive Reviews"
//           value={reviews.filter((r) => r.status === 0).length}
//           icon={<User />}
//         />
//         <StatsCard
//           title="Average Rating"
//           value={
//             reviews.length > 0
//               ? (
//                   reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
//                 ).toFixed(1)
//               : 0
//           }
//           icon={<Star />}
//         />
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Reviews</CardTitle>
//           <CardDescription>
//             Manage and moderate customer reviews
//           </CardDescription>
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
//             <div className="flex items-center gap-2">
//               <PermissionGuard permission="bulk_delete_review">
//                 <Button
//                   size="sm"
//                   variant="destructive"
//                   onClick={handleBulkDelete}
//                   disabled={selectedReviews.length === 0}
//                 >
//                   Delete Selected
//                 </Button>
//               </PermissionGuard>
//             </div>
//             <div className="flex ml-auto gap-2">
//               <Input
//                 placeholder="Search reviews..."
//                 value={searchTerm}
//                 onChange={(e) => {
//                   setSearchTerm(e.target.value);
//                   setPage(1);
//                 }}
//                 className="text-sm"
//               />
//             </div>
//             {/* <div className="mt-1 sm:mt-0">
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="border rounded p-2 bg-white dark:bg-transparent dark:text-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//             </div> */}
//           </div>
//         </CardHeader>

//         <CardContent className="overflow-x-auto">
//           {loading ? (
//             <div className="text-center py-6 text-muted-foreground">
//               Loading reviews...
//             </div>
//           ) : (
//             <Table className="min-w-[800px]">
//               <TableHeader>
//                 <TableRow className="!h-8">
//                   {" "}
//                   {/* smaller row height */}
//                   <TableHead className="w-10 p-1">
//                     <input
//                       type="checkbox"
//                       checked={selectedReviews.length === reviews.length}
//                       onChange={toggleSelectAll}
//                     />
//                   </TableHead>
//                   <TableHead className="p-1">Product</TableHead>
//                   <TableHead className="p-1">Customer</TableHead>
//                   <TableHead className="p-1">Rating</TableHead>
//                   <TableHead className="p-1">Review</TableHead>
//                   <TableHead className="p-1">Status</TableHead>
//                   <TableHead className="p-1">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {reviews.length > 0 ? (
//                   reviews.map((review) => (
//                     <TableRow key={review.id} className="!h-8">
//                       {" "}
//                       {/* smaller row height */}
//                       <TableCell className="p-1">
//                         <input
//                           type="checkbox"
//                           checked={selectedReviews.includes(review.id)}
//                           onChange={() => toggleSelectReview(review.id)}
//                         />
//                       </TableCell>
//                       <TableCell className="p-1">{review.product}</TableCell>
//                       <TableCell className="p-1">{review.customer}</TableCell>
//                       {/* <TableCell
//                         className="max-w-xs truncate p-1"
//                         title={review.email}
//                       >
//                         {review.email}
//                       </TableCell> */}
//                       <TableCell className="p-1">
//                         {renderStars(review.rating)}
//                       </TableCell>
//                       <TableCell className="max-w-xs p-1">
//                         <div>
//                           <div
//                             className="font-medium text-sm truncate"
//                             title={review.title}
//                           >
//                             {review.title}
//                           </div>
//                           <div
//                             className="text-sm text-muted-foreground truncate"
//                             title={review.comment}
//                           >
//                             {review.comment}
//                           </div>
//                         </div>
//                       </TableCell>
//                       <TableCell className="p-1">
//                         {getStatusBadge(review.status)}
//                       </TableCell>
//                       <TableCell className="p-1">
//                         <div className="flex gap-1">
//                           <PermissionGuard permission="view_review">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() => handleView(review)}
//                               className="p-1"
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                           </PermissionGuard>
//                           <PermissionGuard permission="block_review">
//                             <Button
//                               size="sm"
//                               variant="outline"
//                               onClick={() =>
//                                 handleStatusToggle(review.id, review.status)
//                               }
//                               className={`p-1 ${
//                                 review.status === 1
//                                   ? "text-red-600 border-red-600 hover:bg-red-50"
//                                   : "text-green-600 border-green-600 hover:bg-green-50"
//                               }`}
//                             >
//                               {review.status === 1 ? "Deactivate" : "Activate"}
//                             </Button>
//                           </PermissionGuard>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={9} className="text-center py-2">
//                       No reviews found.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>

//       {/* View Dialog */}
//       <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Review Details</DialogTitle>
//           </DialogHeader>
//           {selectedReview && (
//             <div className="space-y-2 mt-2">
//               <p>
//                 <strong>Product:</strong> {selectedReview.product}
//               </p>
//               <p>
//                 <strong>Customer:</strong> {selectedReview.customer}
//               </p>
//               <p>
//                 <strong>Email:</strong> {selectedReview.email}
//               </p>
//               <p>
//                 <strong>Rating:</strong> {selectedReview.rating} / 5
//               </p>
//               <p>
//                 <strong>Title:</strong> {selectedReview.title}
//               </p>
//               <p>
//                 <strong>Comment:</strong> {selectedReview.comment}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(selectedReview.date).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 {selectedReview.status === 1 ? "Active" : "Inactive"}
//               </p>
//             </div>
//           )}
//           <DialogFooter>
//             <Button onClick={() => setShowViewDialog(false)}>Close</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default ReviewsPage;
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/Dialog";
import StatsCard from "../../components/common/Card";
import {
  Star,
  Eye,
  MessageSquare,
  User,
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import PermissionGuard from "../../components/auth/PermissionGuard";

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const token = localStorage.getItem("token");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({
        page,
        perPage: entriesPerPage,
        search: searchTerm,
        sortDir: "desc",
      }).toString();

      const res = await axios.get(
        `https://coombb.com/backend/api/product-reviews?${query}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        const mappedReviews = res.data.data.map((item) => ({
          id: item.id,
          product_id: item.product_id,
          rating_value: item.rating_value,
          rating_title: item.rating_title || "No Title",
          rating_desc: item.rating_desc || "No Comment Provided",
          product: item.product?.name || `Product #${item.product_id}`,
          customer: item.user?.name || "Guest",
          email: item.user?.email || "N/A",
          rating: parseInt(item.rating_value) || 0,
          title: item.rating_title || "No Title",
          comment: item.rating_desc || "No Comment Provided",
          date: item.created_at,
          status: item.is_active === 1 ? 1 : 0,
        }));

        setReviews(mappedReviews);
        setMeta(res.data.meta);
      } else {
        setReviews([]);
        setMeta(null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, entriesPerPage, searchTerm]);

  const handleStatusToggle = async (reviewId, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const review = reviews.find((r) => r.id === reviewId);
      if (!review) return;

      const payload = {
        product_id: review.product_id,
        rating_value: review.rating_value,
        rating_title: review.rating_title || "",
        rating_desc: review.rating_desc || "",
        status: newStatus,
      };

      await axios.patch(
        `https://coombb.com/backend/api/product-reviews/${reviewId}/status`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)),
      );

      Swal.fire(
        "Updated!",
        `Review has been ${newStatus === 1 ? "activated" : "deactivated"}`,
        "success",
      );
    } catch (error) {
      console.error("Failed to update review status:", error);
      Swal.fire("Error!", "Failed to update review status", "error");
    }
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setShowViewDialog(true);
  };

  const getStatusBadge = (status) =>
    status === 1 ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
    );

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) {
      Swal.fire("Warning!", "No reviews selected", "warning");
      return;
    }

    const confirmed = await Swal.fire({
      title: `Delete ${selectedReviews.length} review(s)?`,
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.post(
          "https://coombb.com/backend/api/product-review/bulk-delete",
          { ids: selectedReviews },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        Swal.fire("Deleted!", "Selected reviews have been deleted", "success");
        setSelectedReviews([]);
        fetchReviews();
      } catch (error) {
        console.error("Bulk delete error:", error);
        Swal.fire("Error!", "Failed to delete selected reviews", "error");
      }
    }
  };

  const toggleSelectReview = (id) => {
    setSelectedReviews((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedReviews.length === reviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(reviews.map((r) => r.id));
    }
  };

  // pagination with dots like permissions
  const renderPagination = () => {
    if (!meta) return null;
    const totalPages = meta.last_page || 1;

    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (page <= 3) {
        pageNumbers.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pageNumbers.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, "...", page, "...", totalPages);
      }
    }

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          size="sm"
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        {pageNumbers.map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-2">
              ...
            </span>
          ) : (
            <Button
              key={num}
              onClick={() => setPage(num)}
              size="sm"
              className={`px-3 py-1 border rounded ${
                page === num
                  ? "bg-red-600 text-white"
                  : "bg-transparent dark:text-white"
              }`}
            >
              {num}
            </Button>
          ),
        )}
        <Button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          size="sm"
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight dark:text-white">
          Review Management
        </h1>
        <p className="text-muted-foreground">
          Manage customer reviews and feedback
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Reviews"
          value={meta?.total || 0}
          icon={<MessageSquare />}
        />
        <StatsCard
          title="Active Reviews"
          value={reviews.filter((r) => r.status === 1).length}
          icon={<ThumbsUp />}
        />
        <StatsCard
          title="Inactive Reviews"
          value={reviews.filter((r) => r.status === 0).length}
          icon={<User />}
        />
        <StatsCard
          title="Average Rating"
          value={
            reviews.length > 0
              ? (
                  reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
                ).toFixed(1)
              : 0
          }
          icon={<Star />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Manage and moderate customer reviews
          </CardDescription>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <PermissionGuard permission="bulk_delete_review">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={selectedReviews.length === 0}
                >
                  Delete Selected
                </Button>
              </PermissionGuard>
            </div>
            <div className="flex ml-auto gap-2">
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="text-sm"
              />
            </div>
            <div>
              Show{" "}
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(parseInt(e.target.value, 10));
                  setPage(1);
                }}
                className="border p-1 rounded bg-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>{" "}
              entries
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">
              Loading reviews...
            </div>
          ) : (
            <>
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="!h-8">
                    <TableHead className="w-10 p-1">
                      <input
                        type="checkbox"
                        checked={selectedReviews.length === reviews.length}
                        onChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="p-1">Product</TableHead>
                    <TableHead className="p-1">Customer</TableHead>
                    <TableHead className="p-1">Rating</TableHead>
                    <TableHead className="p-1">Review</TableHead>
                    <TableHead className="p-1">Status</TableHead>
                    <TableHead className="p-1">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <TableRow key={review.id} className="!h-8">
                        <TableCell className="p-1">
                          <input
                            type="checkbox"
                            checked={selectedReviews.includes(review.id)}
                            onChange={() => toggleSelectReview(review.id)}
                          />
                        </TableCell>
                        <TableCell className="p-1">{review.product}</TableCell>
                        <TableCell className="p-1">{review.customer}</TableCell>
                        <TableCell className="p-1">
                          {renderStars(review.rating)}
                        </TableCell>
                        <TableCell className="max-w-xs p-1">
                          <div>
                            <div
                              className="font-medium text-sm truncate"
                              title={review.title}
                            >
                              {review.title}
                            </div>
                            <div
                              className="text-sm text-muted-foreground truncate"
                              title={review.comment}
                            >
                              {review.comment}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="p-1">
                          {getStatusBadge(review.status)}
                        </TableCell>
                        <TableCell className="p-1">
                          <div className="flex gap-1">
                            <PermissionGuard permission="view_review">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(review)}
                                className="p-1"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </PermissionGuard>
                            <PermissionGuard permission="block_review">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleStatusToggle(review.id, review.status)
                                }
                                className={`p-1 ${
                                  review.status === 1
                                    ? "text-red-600 border-red-600 hover:bg-red-50"
                                    : "text-green-600 border-green-600 hover:bg-green-50"
                                }`}
                              >
                                {review.status === 1
                                  ? "Deactivate"
                                  : "Activate"}
                              </Button>
                            </PermissionGuard>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-2">
                        No reviews found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {reviews.length === 0 ? 0 : meta.from} to{" "}
                  {meta.to || reviews.length} of {meta.total || 0} entries
                </div>
                {renderPagination()}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-2 mt-2">
              <p>
                <strong>Product:</strong> {selectedReview.product}
              </p>
              <p>
                <strong>Customer:</strong> {selectedReview.customer}
              </p>
              <p>
                <strong>Email:</strong> {selectedReview.email}
              </p>
              <p>
                <strong>Rating:</strong> {selectedReview.rating} / 5
              </p>
              <p>
                <strong>Title:</strong> {selectedReview.title}
              </p>
              <p>
                <strong>Comment:</strong> {selectedReview.comment}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedReview.date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {selectedReview.status === 1 ? "Active" : "Inactive"}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsPage;
