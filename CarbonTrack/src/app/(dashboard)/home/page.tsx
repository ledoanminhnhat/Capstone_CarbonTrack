"use client";

import { useState, useEffect } from "react";
import { 
  MdSearch, 
  MdAdd, 
  MdStar,
  MdLightbulb
} from "react-icons/md";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  ReferenceLine
} from "recharts";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LogActivityModal from "./LogActivityModal";

import { lineData, pieData, recentActivities } from "@/lib/mockData";

// Custom label for PieChart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  return (
    <text x={x} y={y} fill="#666" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="0.75rem">
      <tspan x={x} dy="-0.5em" fontWeight="bold">{name}</tspan>
      <tspan x={x} dy="1.2em">{value}%</tspan>
    </text>
  );
};

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
    const day = now.getDate();
    const month = now.toLocaleDateString('en-US', { month: 'long' });
    const year = now.getFullYear();
    setCurrentDate(`${weekday}, ${day} ${month}, ${year}`);
  }, []);

  return (
    <div>
      <header className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-[1.75rem] font-bold text-[#333] m-0 mb-1">Good morning, Nhat!</h2>
          <p className="text-[#777] m-0 text-[0.9rem]">{currentDate || "\u00A0"}</p>
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
          <Button onClick={() => setIsModalOpen(true)}>
            <MdAdd size={20} className="mr-2" /> Log New Activity
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-[#777] text-[0.85rem] mb-2">Total emissions this month</div>
          <div className="text-[1.25rem] font-bold text-[#333] flex items-center justify-between">
            120.5 kg CO₂e
            <span className="text-[#e53e3e] text-[0.85rem] font-medium">↑ +5%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-[#777] text-[0.85rem] mb-2">Highest activity</div>
          <div className="text-[1.25rem] font-bold text-[#333] flex items-center justify-between">
            Travel (45%)
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-[#777] text-[0.85rem] mb-2">Remaining goal</div>
          <div className="text-[1.25rem] font-bold text-[#333] flex items-center justify-between">
            25 kg
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="text-[#777] text-[0.85rem] mb-2">Score</div>
          <div className="text-[1.25rem] font-bold text-[#333] flex items-center justify-between">
            1,200 pts
            <MdStar size={24} className="text-[#f6ad55] bg-[#feebc8] rounded-full p-1" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="m-0 mb-1 text-[#333] text-[1.1rem]">Line Chart</h3>
            <p className="m-0 text-[#777] text-[0.85rem]">30-day postpartum recovery trend</p>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#48bb78" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#48bb78" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <ReferenceLine y={25} stroke="#a0aec0" strokeDasharray="3 3" />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#48bb78" 
                  strokeWidth={3} 
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="mb-6">
            <h3 className="m-0 mb-1 text-[#333] text-[1.1rem]">Donut Chart</h3>
            <p className="m-0 text-[#777] text-[0.85rem]">Allocation of emission sources</p>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 40, left: 40, bottom: 0 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-[2fr_1fr] gap-6">
        <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <h3 className="m-0 mb-6 text-[#333] text-[1.1rem]">Recent Activities</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[#777] font-semibold text-[0.85rem] pb-4 border-b border-[#f0f0f0]">Activity</th>
                <th className="text-left text-[#777] font-semibold text-[0.85rem] pb-4 border-b border-[#f0f0f0]">Date</th>
                <th className="text-left text-[#777] font-semibold text-[0.85rem] pb-4 border-b border-[#f0f0f0]">CO2/kg</th>
                <th className="text-left text-[#777] font-semibold text-[0.85rem] pb-4 border-b border-[#f0f0f0]">Status</th>
              </tr>
            </thead>
            <tbody className="[&>tr:last-child>td]:border-b-0">
              {recentActivities.slice(0, 2).map((activity) => (
                <tr key={activity.id}>
                  <td className="py-4 border-b border-[#f0f0f0] text-[#555] text-[0.9rem] font-medium">{activity.activity} ({activity.detail})</td>
                  <td className="py-4 border-b border-[#f0f0f0] text-[#555] text-[0.9rem] font-medium">{activity.date}</td>
                  <td className="py-4 border-b border-[#f0f0f0] text-[#555] text-[0.9rem] font-medium">{activity.co2}</td>
                  <td className="py-4 border-b border-[#f0f0f0] text-[#555] text-[0.9rem] font-medium">
                    <span className={`py-1 px-3 rounded-xl text-[0.8rem] font-semibold ${
                      activity.status === 'High' 
                        ? 'bg-[#fed7d7] text-[#c53030]' 
                        : 'bg-[#c6f6d5] text-[#276749]'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 mb-4">
            <MdLightbulb size={32} className="text-[#2b9d5c] bg-[#e3f2e6] rounded-full p-2" />
            <h3 className="m-0 text-[#333] text-[1.1rem]">Daily Tip</h3>
          </div>
          <p className="text-[#666] text-[0.95rem] leading-relaxed m-0">
            Tip: Taking the bus instead of a motorbike helps you reduce 1.2kg of CO₂ for your commute!
          </p>
        </div>
      </section>

      <LogActivityModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
