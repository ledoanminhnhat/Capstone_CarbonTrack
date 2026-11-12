"use client";

import { useState, useEffect } from "react";
import {
  MdSearch,
  MdAdd,
  MdStar,
  MdLightbulb,
  MdCloud,
  MdLocalFireDepartment,
  MdFlag
} from "react-icons/md";
import { 
  AreaChart,
  Area,
  XAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  Tooltip
} from "recharts";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import LogActivityModal from "./LogActivityModal";

import { getActivities, type Activity } from "@/lib/activities";
import { getUser } from "@/lib/auth";
import { getProfile } from "@/lib/user";

// Tooltip cho biểu đồ đường: hiện ngày + số kg CO2
const CustomLineTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-[0.8rem]">
      <div className="font-semibold text-[#333]">Day {p.payload.name}</div>
      <div className="text-[#666] mt-0.5">{p.value} kg CO₂</div>
    </div>
  );
};

// Tooltip tùy biến: hiện khi hover vào 1 miếng của biểu đồ tròn
const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-white px-3 py-2 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-[0.8rem]">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
        <span className="font-semibold text-[#333]">{item.name}</span>
      </div>
      <div className="text-[#666] mt-1">
        {item.value}% · {item.co2} kg CO₂
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [userName, setUserName] = useState("");
  const [points, setPoints] = useState(0);
  // Tháng đang chọn cho 2 biểu đồ (mặc định tháng hiện tại), dạng "MM/YYYY"
  const [chartMonth, setChartMonth] = useState(() => {
    const n = new Date();
    return `${String(n.getMonth() + 1).padStart(2, "0")}/${n.getFullYear()}`;
  });

  useEffect(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    setCurrentDate(`${weekday}, ${day} ${month}, ${year}`);
    setUserName(getUser()?.name ?? "");
    loadActivities();
    getProfile()
      .then((p) => setPoints(p.points))
      .catch(() => {});
  }, []);

  const loadActivities = async () => {
    try {
      setActivities(await getActivities());
    } catch {
      // nếu lỗi (vd backend chưa chạy) thì để danh sách rỗng
    }
  };

  // ====== Tính toán cho Dashboard từ data thật ======
  const MONTHLY_GOAL = 150; // mục tiêu phát thải trong tháng (kg CO2)
  const CATEGORY_COLORS: Record<string, string> = {
    Transport: "#3182ce", // xanh dương
    Food: "#ed8936",      // cam
    Energy: "#ecc94b",    // vàng
    Shopping: "#38a169",  // xanh lá
  };

  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const currentMonthKey = `${mm}/${yyyy}`;

  // Lời chào theo giờ trong ngày
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // ----- Các THẺ thống kê: luôn theo THÁNG HIỆN TẠI -----
  const monthly = activities.filter((a) => a.date.endsWith(`/${currentMonthKey}`));
  const totalThisMonth = monthly.reduce((sum, a) => sum + a.co2, 0);

  const byCategoryMonth: Record<string, number> = {};
  monthly.forEach((a) => {
    byCategoryMonth[a.category] = (byCategoryMonth[a.category] ?? 0) + a.co2;
  });
  const highest = Object.entries(byCategoryMonth).sort((a, b) => b[1] - a[1])[0];
  const highestLabel = highest
    ? `${highest[0]} (${Math.round((highest[1] / totalThisMonth) * 100)}%)`
    : "—";
  const remainingGoal = Math.max(0, MONTHLY_GOAL - totalThisMonth);
  const score = points; // điểm thật tích lũy từ challenge

  // ----- Danh sách tháng cho dropdown (gồm tháng hiện tại + các tháng có data) -----
  const monthOptions = Array.from(
    new Set([currentMonthKey, ...activities.map((a) => a.date.slice(3))])
  )
    .sort((a, b) => {
      const [ma, ya] = a.split("/").map(Number);
      const [mb, yb] = b.split("/").map(Number);
      return yb - ya || mb - ma;
    })
    .map((m) => ({ label: m, value: m }));

  // ----- 2 BIỂU ĐỒ: theo THÁNG ĐƯỢC CHỌN (chartMonth) -----
  const selected = activities.filter((a) => a.date.endsWith(`/${chartMonth}`));
  const totalSelected = selected.reduce((sum, a) => sum + a.co2, 0);

  // Biểu đồ tròn
  const byCategorySel: Record<string, number> = {};
  selected.forEach((a) => {
    byCategorySel[a.category] = (byCategorySel[a.category] ?? 0) + a.co2;
  });
  const pieData = Object.entries(byCategorySel).map(([name, val]) => ({
    name,
    value: totalSelected ? Math.round((val / totalSelected) * 100) : 0,
    co2: Math.round(val * 10) / 10,
    color: CATEGORY_COLORS[name] ?? "#a0aec0",
  }));

  // Biểu đồ đường: trục ngày liên tục trong tháng được chọn
  const byDaySel: Record<string, number> = {};
  selected.forEach((a) => {
    const day = a.date.slice(0, 2);
    byDaySel[day] = (byDaySel[day] ?? 0) + a.co2;
  });
  const [cmMonth, cmYear] = chartMonth.split("/").map(Number);
  const isCurrentMonth = chartMonth === currentMonthKey;
  // tháng hiện tại: tới hôm nay; tháng cũ: hết số ngày của tháng đó
  const lastDay = isCurrentMonth ? now.getDate() : new Date(cmYear, cmMonth, 0).getDate();
  const lineData = Array.from({ length: lastDay }, (_, i) => {
    const d = i + 1;
    const key = String(d).padStart(2, "0");
    return { name: String(d), value: Math.round((byDaySel[key] ?? 0) * 10) / 10 };
  });
  // Nhãn tháng đẹp cho phụ đề, ví dụ "November 2026"
  const monthLabel = new Date(cmYear, cmMonth - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const recent = activities.slice(0, 3);

  return (
    <div>
      <header className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[1.75rem] font-extrabold text-ink m-0 mb-1">{greeting}, <span className="text-gradient-brand">{userName || "there"}</span>!</h2>
          <p className="text-muted m-0 text-[0.9rem]">{currentDate || "\u00A0"}</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="w-[250px]">
            <Input 
              type="text" 
              placeholder="Search" 
              icon={<MdSearch size={20} />}
              iconPosition="left"
            />
          </div>
          <Button variant="gradient" onClick={() => setIsModalOpen(true)}>
            <MdAdd size={20} className="mr-2" /> Log New Activity
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-6 mb-6">
        {/* Total — hero gradient */}
        <div className="bg-gradient-brand text-white rounded-2xl p-5 shadow-glow-brand">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-[0.85rem]">Total this month</span>
            <MdCloud size={32} className="text-white/60 bg-white/15 rounded-xl p-1.5" />
          </div>
          <div className="text-2xl font-extrabold">{totalThisMonth.toFixed(1)}</div>
          <div className="text-white/70 text-xs">kg CO₂e</div>
        </div>

        {/* Highest */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-[0.85rem]">Highest activity</span>
            <MdLocalFireDepartment size={32} className="text-rose-500 bg-rose-50 rounded-xl p-1.5" />
          </div>
          <div className="text-2xl font-extrabold text-ink">{highestLabel}</div>
        </div>

        {/* Remaining */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted text-[0.85rem]">Remaining goal</span>
            <MdFlag size={32} className="text-amber-500 bg-amber-50 rounded-xl p-1.5" />
          </div>
          <div className="text-2xl font-extrabold text-ink">{remainingGoal.toFixed(1)}</div>
          <div className="text-muted text-xs">of {MONTHLY_GOAL} kg goal</div>
        </div>

        {/* Score — gradient */}
        <div className="bg-gradient-ocean text-white rounded-2xl p-5 shadow-glow-ocean">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/80 text-[0.85rem]">Score</span>
            <MdStar size={32} className="text-white/70 bg-white/15 rounded-xl p-1.5" />
          </div>
          <div className="text-2xl font-extrabold">{score.toLocaleString()}</div>
          <div className="text-white/70 text-xs">points</div>
        </div>
      </section>

      <section className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="m-0 mb-1 text-ink text-[1.1rem] font-bold">Emissions Trend</h3>
              <p className="m-0 text-muted text-[0.85rem]">Daily CO₂ in {monthLabel}</p>
            </div>
            <div className="w-[140px]">
              <Select value={chartMonth} onChange={setChartMonth} options={monthOptions} />
            </div>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {lineData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#999] text-[0.9rem]">
                No data yet this month
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#999" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={12}
                />
                <ReferenceLine y={Math.round(MONTHLY_GOAL / 30)} stroke="#a0aec0" strokeDasharray="3 3" />
                <Tooltip content={<CustomLineTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="mb-6">
            <h3 className="m-0 mb-1 text-ink text-[1.1rem] font-bold">Emission Sources</h3>
            <p className="m-0 text-muted text-[0.85rem]">By category · {monthLabel}</p>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[#999] text-[0.9rem]">
                No data yet this month
              </div>
            ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>

          {/* Legend: chấm màu chú thích theo category */}
          {pieData.length > 0 && (
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-ink text-[0.8rem]">
                    {entry.name} <span className="text-muted">({entry.value}%)</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="m-0 text-ink text-[1.1rem] font-bold">Recent Activities</h3>
            <Link
              href="/history"
              className="text-brand-600 text-[0.85rem] font-semibold no-underline hover:underline"
            >
              View all →
            </Link>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100">Activity</th>
                <th className="text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100">Date</th>
                <th className="text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100">CO₂</th>
                <th className="text-left text-muted font-semibold text-[0.85rem] pb-4 border-b border-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-muted text-[0.9rem]">
                    No activities yet. Log your first one!
                  </td>
                </tr>
              ) : (
                recent.map((activity) => (
                  <tr key={activity.id}>
                    <td className="py-4 border-b border-gray-100 text-ink text-[0.9rem] font-medium">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[activity.category] ?? "#a0aec0" }}
                        />
                        {activity.activity} <span className="text-muted">({activity.detail})</span>
                      </span>
                    </td>
                    <td className="py-4 border-b border-gray-100 text-muted text-[0.9rem]">{activity.date}</td>
                    <td className="py-4 border-b border-gray-100 text-ink text-[0.9rem] font-semibold">{activity.co2} kg</td>
                    <td className="py-4 border-b border-gray-100">
                      <Badge tone={activity.status === "High" ? "danger" : "success"} dot>
                        {activity.status}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Daily Tip — thẻ gradient */}
        <div className="bg-gradient-ocean text-white rounded-2xl p-6 shadow-glow-ocean flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <MdLightbulb size={36} className="text-white bg-white/20 rounded-xl p-2" />
            <h3 className="m-0 text-white text-[1.1rem] font-bold">Daily Tip</h3>
          </div>
          <p className="text-white/90 text-[0.95rem] leading-relaxed m-0">
            Taking the bus instead of a motorbike helps you cut around{" "}
            <span className="font-bold">1.2 kg</span> of CO₂ on your daily commute. Small
            swaps add up! 🌿
          </p>
        </div>
      </section>

      <LogActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadActivities}
      />
    </div>
  );
}
