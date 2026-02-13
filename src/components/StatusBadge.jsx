const statusConfig = {
  Applied: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-600/20",
  },
  OA: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    ring: "ring-amber-600/20",
  },
  Interview: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    ring: "ring-purple-600/20",
  },
  Offer: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    ring: "ring-emerald-600/20",
  },
  Rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-600/20",
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Applied;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
    >
      {status}
    </span>
  );
}
