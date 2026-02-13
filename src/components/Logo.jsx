export default function Logo({ size = "md" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2 font-bold ${sizes[size]}`}>
      <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white text-sm font-extrabold shadow-md">
        PT
      </div>
      <span className="text-gray-900">
        Placement<span className="text-brand-600">Tracker</span>
      </span>
    </div>
  );
}
