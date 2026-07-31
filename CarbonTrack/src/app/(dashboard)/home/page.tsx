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
import styles from "./home.module.css";

const lineData = [
  { name: '1', value: 10 },
  { name: '2', value: 25 },
  { name: '3', value: 15 },
  { name: '4', value: 50 },
  { name: '5', value: 20 },
  { name: '6', value: 35 },
  { name: '7', value: 25 },
  { name: '8', value: 35 },
  { name: '9', value: 20 },
  { name: '10', value: 45 },
];

const pieData = [
  { name: 'Transport', value: 45, color: '#3182ce' }, // Blue
  { name: 'Food', value: 30, color: '#ed8936' }, // Orange
  { name: 'Energy', value: 25, color: '#ecc94b' }, // Yellow
];

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
      <header className={styles.header}>
        <div className={styles.greeting}>
          <h2>Good morning, Nhat!</h2>
          <p>{currentDate || "\u00A0"}</p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.searchContainer}>
            <MdSearch className={styles.searchIcon} size={20} />
            <input 
              type="text" 
              placeholder="Search" 
              className={styles.searchInput}
            />
          </div>
          <button className={styles.addButton}>
            <MdAdd size={20} /> Log New Activity
          </button>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Total emissions this month</div>
          <div className={styles.cardValue}>
            120.5 kg CO₂e
            <span className={styles.trendUp}>↑ +5%</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Highest activity</div>
          <div className={styles.cardValue}>
            Travel (45%)
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Remaining goal</div>
          <div className={styles.cardValue}>
            25 kg
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Score</div>
          <div className={styles.cardValue}>
            1,200 pts
            <MdStar size={24} className={styles.starIcon} />
          </div>
        </div>
      </section>

      <section className={styles.chartsGrid}>
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Line Chart</h3>
            <p>30-day postpartum recovery trend</p>
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

        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3>Donut Chart</h3>
            <p>Allocation of emission sources</p>
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

      <section className={styles.bottomGrid}>
        <div className={styles.tableContainer}>
          <h3>Recent Activities</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>CO2/kg</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Motorbike (25km)</td>
                <td>19/03/2026</td>
                <td>1.8 kg</td>
                <td><span className={styles.badgeHigh}>High</span></td>
              </tr>
              <tr>
                <td>Veteran (for lunch)</td>
                <td>18/03/2026</td>
                <td>0.5 kg</td>
                <td><span className={styles.badgeLow}>Low</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.tipCard}>
          <div className={styles.tipHeader}>
            <MdLightbulb size={32} className={styles.tipIcon} />
            <h3>Daily Tip</h3>
          </div>
          <p>
            Tip: Taking the bus instead of a motorbike helps you reduce 1.2kg of CO₂ for your commute!
          </p>
        </div>
      </section>
    </div>
  );
}
