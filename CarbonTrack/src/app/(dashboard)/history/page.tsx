"use client";

import { useState, useEffect } from "react";
import { MdSearch, MdKeyboardArrowLeft, MdKeyboardArrowRight, MdFirstPage, MdLastPage } from "react-icons/md";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { recentActivities } from "@/lib/mockData";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActivity, setFilterActivity] = useState("All Activity");
  const [filterStatus, setFilterStatus] = useState("Status");
  const [filterMonth, setFilterMonth] = useState("All Time");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterActivity, filterStatus, filterMonth]);

  const filteredActivities = recentActivities.filter(activity => {
    // 1. Search Query
    const matchesSearch = activity.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.detail.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Filter Category
    let matchesCategory = true;
    if (filterActivity !== "All Activity") {
      if (filterActivity === "Transport") {
        matchesCategory = ["Bus", "Plane", "Train", "Car"].includes(activity.activity);
      } else if (filterActivity === "Food") {
        matchesCategory = ["Lunch", "Dinner", "Breakfast"].includes(activity.activity);
      } else if (filterActivity === "Shopping") {
        matchesCategory = activity.activity.includes("Shopping");
      } else if (filterActivity === "Energy") {
        matchesCategory = ["Electricity", "Water", "Gas"].includes(activity.activity);
      }
    }

    // 3. Filter Status
    let matchesStatus = true;
    if (filterStatus !== "Status") {
      matchesStatus = activity.status === filterStatus;
    }

    // 4. Filter Month
    let matchesMonth = true;
    if (filterMonth !== "All Time") {
      // Check if the date string (DD/MM/YYYY) ends with the MM/YYYY
      matchesMonth = activity.date.endsWith(filterMonth);
    }

    return matchesSearch && matchesCategory && matchesStatus && matchesMonth;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage) || 1;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-[2rem] font-bold text-[#333] m-0">History Activity</h2>
        <Button>
          Export (PDF/Excel)
        </Button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="w-[300px]">
          <Input
            type="text"
            placeholder="Search...."
            icon={<MdSearch size={20} />}
            iconPosition="left"
            className="py-3.5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-[200px]">
          <Select
            value={filterActivity}
            onChange={setFilterActivity}
            options={[
              { label: 'All Activity', value: 'All Activity' },
              { label: 'Transport', value: 'Transport' },
              { label: 'Food', value: 'Food' },
              { label: 'Energy', value: 'Energy' },
              { label: 'Shopping', value: 'Shopping' },
            ]}
          />
        </div>
        <div className="w-[150px]">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { label: 'Status', value: 'Status' },
              { label: 'High', value: 'High' },
              { label: 'Low', value: 'Low' },
            ]}
          />
        </div>
        <div className="w-[150px]">
          <Select
            value={filterMonth}
            onChange={setFilterMonth}
            options={[
              { label: 'All Time', value: 'All Time' },
              { label: '04/2026', value: '04/2026' },
              { label: '03/2026', value: '03/2026' },
              { label: '02/2026', value: '02/2026' },
            ]}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-6 mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0] w-[20%]">Date</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0] w-[20%]">Activity</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0] w-[20%]">Detail</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0] w-[20%]">Rate CO₂e</th>
              <th className="text-left text-[#111] font-bold pb-4 border-b border-[#f0f0f0] w-[20%]">Status</th>
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {currentItems.map((activity) => (
              <tr key={activity.id}>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">{activity.date}</td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">{activity.activity}</td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">{activity.detail}</td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">{activity.co2}</td>
                <td className="py-4 border-b border-[#f0f0f0] text-[#555] font-medium">
                  <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-[0.85rem] font-medium ${activity.status === 'High'
                    ? 'bg-[#fed7d7] text-[#c53030]'
                    : 'bg-[#c6f6d5] text-[#276749]'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${activity.status === 'High' ? 'bg-[#c53030]' : 'bg-[#276749]'}`}></span>
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center gap-4 text-[#555] font-medium">
        <span>Pages {currentPage}/{totalPages}</span>
        <div className="flex gap-2 text-[#333]">
          <MdFirstPage size={24} className={`cursor-pointer hover:text-[#2b9d5c] ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleFirstPage} />
          <MdKeyboardArrowLeft size={24} className={`cursor-pointer hover:text-[#2b9d5c] ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`} onClick={handlePrevPage} />
          <MdKeyboardArrowRight size={24} className={`cursor-pointer hover:text-[#2b9d5c] ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleNextPage} />
          <MdLastPage size={24} className={`cursor-pointer hover:text-[#2b9d5c] ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleLastPage} />
        </div>
      </div>
    </div>
  );
}
