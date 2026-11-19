import { FaArrowTrendUp, FaSeedling } from "react-icons/fa6";
import Badge from "@/components/ui/Badge";
import { HIGH_EMISSION_KG } from "@/constants/app";
import type { Activity } from "../types";

/** Mức phát thải của 1 activity: High (≥ 5 kg) đỏ / Low xanh. Dùng ở History + Recent Activities. */
export default function StatusBadge({ status }: { status: Activity["status"] }) {
  const high = status === "High";
  return (
    <span title={high ? `${HIGH_EMISSION_KG} kg CO₂ or more` : `Under ${HIGH_EMISSION_KG} kg CO₂`}>
      <Badge
        tone={high ? "danger" : "success"}
        variant="outline"
        size="sm"
        icon={high ? <FaArrowTrendUp size={11} /> : <FaSeedling size={11} />}
      >
        {status}
      </Badge>
    </span>
  );
}
