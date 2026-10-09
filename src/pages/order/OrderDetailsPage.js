"use client";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { ArrowLeft } from "lucide-react";

import Badge from "../../components/ui/Badge";

const variants = {
  default: "bg-red-600 text-white hover:bg-red-700",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "bg-red-500 text-white hover:bg-red-600",
  outline: "text-foreground border border-input",

  pending: "bg-yellow-600  border-yellow-300",
  processing: "bg-blue-100 text-blue-800 border-blue-300",
  shipped: "bg-purple-100 text-purple-800 border-purple-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};
const getPaymentStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-300";

    case "unpaid":
      return "bg-red-100 text-red-800 border-red-300";

    case "pending":
      return "bg-yellow-100 text-black border-yellow-300";

    case "failed":
      return "bg-red-100 text-red-800 border-red-300";

    case "refunded":
      return "bg-blue-100 text-blue-800 border-blue-300";

    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // ✅ page and per_page URL params
  const initialPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const initialPerPage = Number.parseInt(
    searchParams.get("per_page") || "10",
    10,
  );
  const [page, setPage] = useState(initialPage);
  const [entriesPerPage, setEntriesPerPage] = useState(initialPerPage);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `https://coombb.com/backend/api/orders/${id}`,
        );
        setOrder(res.data);
        console.log(res.data);
        console.log(res.data.data.users);
      } catch (err) {
        console.error("❌ Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold">Loading Order Details...</p>
      </div>
    );
  }

  if (!order || !order.data) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-500">Order not found</p>
      </div>
    );
  }

  const orderData = order.data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() =>
          navigate(`/orders?page=${page}&per_page=${entriesPerPage}`)
        }
        className="flex items-center bg-red-500 hover:bg-red-600 gap-2 text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Button>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <p>
            <strong>Order Code:</strong> {orderData.order_code}
          </p>
          <p>
            <strong>Status:</strong> <Badge>{orderData.order_status}</Badge>
          </p>
          <p className="flex items-center gap-2">
            <strong>Payment:</strong>

            <Badge className={getPaymentStatusClass(orderData.payment_status)}>
              {orderData.payment_status}
            </Badge>

            <span>({orderData.payment_type || "-"})</span>
          </p>

          <p>
            <strong>Total:</strong> £{orderData.total_amount}
          </p>
          <p>
            <strong>Shipping Charges:</strong> £{orderData.shipping_charge}
            {orderData.shipping_charge > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                {orderData.shipping_method?.name}
                <span className="text-red-400">
                  ({orderData.shipping_method?.code})
                </span>
              </span>
            )}
          </p>
          <p>
            <strong>Final Amount:</strong> £{orderData.final_amount}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(orderData.order_date).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {orderData?.shipping_detail && (
        <Card className="bg-transparent border border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle>Royal Mail Shipping Details</CardTitle>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <p>
              <strong>Customer Ref #:</strong>{" "}
              {orderData.shipping_detail?.customer_reference_number || "-"}
            </p>

            <p>
              <strong>Order Reference:</strong>{" "}
              {orderData.shipping_detail?.response?.orderReference || "-"}
            </p>

            <p>
              <strong>Tracking Number:</strong>{" "}
              {orderData.shipping_detail?.response?.trackingNumber || "-"}
            </p>

            <p>
              <strong>Consignment #:</strong>{" "}
              {orderData.shipping_detail?.consignment_number || "-"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {orderData.shipping_detail?.status || "-"}
            </p>

            <p>
              <strong>Created On:</strong>{" "}
              {orderData.shipping_detail?.response?.createdOn || "-"}
            </p>

            <p>
              <strong>Printed On:</strong>{" "}
              {orderData.shipping_detail?.response?.printedOn
                ? new Date(
                    orderData.shipping_detail.response.printedOn,
                  ).toLocaleDateString("en-GB")
                : "-"}
            </p>

            <p>
              <strong>Generated Documents:</strong>{" "}
              {orderData.shipping_detail?.response?.generatedDocuments?.join(
                ", ",
              ) || "-"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Customer + Shipping Info (Merged Layout) */}
      <Card>
        <CardHeader>
          <CardTitle>Customer & Shipping Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Customer Info (Table Layout + Centered Image) */}
            <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              {/* Customer Image */}
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center overflow-hidden">
                {orderData.users?.avatar ? (
                  <img
                    src={orderData.users.avatar}
                    alt={orderData.users.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>

              {/* Customer Details in Table */}
              <table className="min-w-full text-sm mt-3">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {orderData.users &&
                  Object.keys(orderData.users).length > 0 ? (
                    <>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Name</td>
                        <td className="py-2">
                          {orderData.users?.name || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Email</td>
                        <td className="py-2">
                          {orderData.users?.email || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Phone</td>
                        <td className="py-2">
                          {orderData.users?.phone || "N/A"}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Name</td>
                        <td className="py-2">
                          {orderData.guest_name || "Guest"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Email</td>
                        <td className="py-2">
                          {orderData.guest_email || "N/A"}
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold pr-4 py-2">Phone</td>
                        <td className="py-2">
                          {orderData.guest_phone || "N/A"}
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Right: Shipping Address (Table Layout) */}
            <div className="border rounded-xl p-4 bg-gray-50 dark:bg-gray-800 overflow-x-auto">
              {orderData.users && Object.keys(orderData.users).length > 0 ? (
                <table className="min-w-full text-sm">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="font-semibold pr-4 py-2">Name</td>
                      <td className="py-2">{orderData.user_address.name}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Email</td>
                      <td className="py-2">{orderData.user_address.email}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Phone</td>
                      <td className="py-2">
                        {orderData.user_address.phone_number}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Address</td>
                      <td className="py-2">
                        {orderData.user_address.street},{" "}
                        {orderData.user_address.apartment_suite}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">City</td>
                      <td className="py-2">
                        {orderData.user_address.city?.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">State</td>
                      <td className="py-2">
                        {orderData.user_address.state?.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Country</td>
                      <td className="py-2">
                        {orderData.user_address.country?.name}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Zip Code</td>
                      <td className="py-2">{orderData.user_address.zipcode}</td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">Address Type</td>
                      <td className="py-2">
                        {orderData.user_address.address_type}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : orderData.guest_shipping_address ||
                orderData.guest_billing_address ? (
                <table className="min-w-full text-sm">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="font-semibold pr-4 py-2">
                        Shipping Address
                      </td>
                      <td className="py-2">
                        {orderData.guest_shipping_address || "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold pr-4 py-2">
                        Billing Address
                      </td>
                      <td className="py-2">
                        {orderData.guest_billing_address || "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No shipping address provided</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product Detail</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="p-2">
              {orderData.order_details?.data?.map((item) => {
                const variant = item.products?.variants?.[0];
                const colorcheckers = item.colors;

                return (
                  <TableRow key={item.id}>
                    <TableCell className="border-r-2">
                      <img
                        src={item.products?.default_image}
                        alt={item.products?.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </TableCell>

                    <TableCell className="border-r-2">
                      <p className="font-semibold mb-0  capitalize">
                        {item.products?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-0">
                        SKU: {item.products?.sku}
                      </p>
                      <p className="text-sm text-muted-foreground mb-0">
                        Fabric: {item.products?.fabric?.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-0">
                        Brand: {item.products?.brand?.name}
                      </p>
                    </TableCell>

                    <TableCell className="border-r-2">
                      {variant ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: colorcheckers.hexa_code }}
                          />
                          <span>{colorcheckers.name}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>

                    <TableCell className="border-r-2">
                      {variant?.size_name || "-"}
                    </TableCell>

                    <TableCell className="border-r-2">
                      {item.quantity}
                    </TableCell>

                    <TableCell className="border-r-2">£{item.price}</TableCell>

                    <TableCell className="border-r-2">
                      £{item.sub_total}
                    </TableCell>

                    <TableCell>
                      <Badge variant={item.delivery_status?.toLowerCase()}>
                        {item.delivery_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
