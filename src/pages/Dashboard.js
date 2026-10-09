"use client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatsCard from "../components/common/StatsCard";
import OrderStatusCard from "../components/common/OrderStatusCard";
import ProductCard from "../components/common/ProductCard";
import { PoundSterling, Package, ShoppingCart, Users } from "lucide-react";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://coombb.com/backend/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (!data) {
    return (
      <div className="p-4 text-red-500">Failed to load dashboard data.</div>
    );
  }

  const {
    total_revenue,
    total_orders,
    products,
    active_customers,
    growth,
    order_status,
    top_products,
  } = data;

  const stats = [
    {
      title: "Total Revenue",
      value: `£ ${total_revenue.toLocaleString()}`,
      // change: `${growth.revenue >= 0 ? "+" : ""}${growth.revenue}%`,
      // trend: growth.revenue >= 0 ? "up" : "down",
      icon: PoundSterling,
    },
    {
      title: "Total Orders",
      value: total_orders.toString(),
      change: `${growth.orders >= 0 ? "+" : ""}${growth.orders}%`,
      trend: growth.orders >= 0 ? "up" : "down",
      icon: ShoppingCart,
      link: "/orders",
    },
    {
      title: "Products",
      value: products.toString(),
      change: `${growth.products >= 0 ? "+" : ""}${growth.products}%`,
      trend: growth.products >= 0 ? "up" : "down",
      icon: Package,
      link: "/products",
    },
    {
      title: "Active Customers",
      value: active_customers.toString(),
      change: `${growth.customers >= 0 ? "+" : ""}${growth.customers}`,
      trend: growth.customers >= 0 ? "up" : "down",
      icon: Users,
      link: "/customers",
    },
  ];

  const orderStatus = [
    { status: "Pending", count: order_status.pending, color: "bg-yellow-500" },
    {
      status: "Processing",
      count: order_status.processing,
      color: "bg-blue-500",
    },
    { status: "Shipped", count: order_status.shipped, color: "bg-purple-500" },
    {
      status: "Delivered",
      count: order_status.delivered,
      color: "bg-green-500",
    },
    { status: "Cancelled", count: order_status.returned, color: "bg-red-500" },
  ];

  const maxCount = Math.max(...orderStatus.map((o) => o.count));

  const topProducts = top_products.map((product) => ({
    name: product.product_name,
    sales: parseInt(product.sales),
    revenue: `£${Number(product.revenue).toLocaleString()}`,
  }));

  return (
    <div className="space-y-6 px-4 py-4">
      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground" style={{ marginTop: "5px" }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const content = <StatsCard key={stat.title} stat={stat} />;
          return stat.link ? (
            <Link key={stat.title} to={stat.link}>
              {content}
            </Link>
          ) : (
            content
          );
        })}
      </div>

      {/* Order Status + Top Products */}
      <div className="grid gap-4 lg:grid-cols-7">
        <OrderStatusCard
          title="Order Status Breakdown"
          description="Current status of all orders"
          orderStatus={orderStatus}
          maxCount={maxCount}
        />
        <ProductCard
          title="Top Products"
          description="Best performing products this month"
          topProducts={topProducts}
        />
      </div>
    </div>
  );
};

export default Dashboard;
