import { clsx } from "clsx";

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "text-foreground border border-input",
  };

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
};

export default Badge;
