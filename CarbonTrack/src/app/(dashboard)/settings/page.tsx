import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-3xl font-bold text-[#333] mb-2">Setting</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-5">
          <h3 className="font-bold text-xl text-[#333]">Personal Information</h3>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#aed9b8] flex items-center justify-center text-3xl">👨🏻</div>
            <h4 className="font-bold text-xl text-[#333]">Nhat 👋</h4>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-16">Name</label>
              <input 
                type="text" 
                defaultValue="Nhat Le" 
                className="flex-1 border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-16">Gmail</label>
              <input 
                type="email" 
                defaultValue="nhat.le@example.com" 
                className="flex-1 border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
          </div>

          <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-2">
            Save change
          </button>
        </div>

        {/* Account Setting */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-5">
          <h3 className="font-bold text-xl text-[#333]">Account Setting</h3>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[#555] text-sm">Current Password</label>
              <input 
                type="password" 
                className="border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#555] text-sm">New Password</label>
              <input 
                type="password" 
                className="border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[#555] text-sm">Submit Password</label>
              <input 
                type="password" 
                className="border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
          </div>

          <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto">
            Change Password
          </button>
        </div>

        {/* Tracking Setting */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-5">
          <h3 className="font-bold text-xl text-[#333]">Tracking Setting</h3>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-32">Year Target</label>
              <input 
                type="text" 
                defaultValue="1.2 ton CO2e" 
                className="flex-1 border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="text-[#555] font-semibold w-32">Family member</label>
              <input 
                type="text" 
                defaultValue="4 people" 
                className="flex-1 border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960]"
              />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <label className="text-[#555] font-semibold">Main Transport</label>
              <select className="border border-[#ccc] rounded-md px-3 py-2 outline-none focus:border-[#0ea960] bg-white">
                <option>Motorbike</option>
                <option>Car</option>
                <option>Public Transit</option>
                <option>Bicycle</option>
              </select>
            </div>
          </div>

          <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto">
            Save Setting
          </button>
        </div>

        {/* Reminder */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-5">
          <h3 className="font-bold text-xl text-[#333]">Reminder</h3>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-[#555]">Reminding challenges and information everyday</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-[#555]">Let me know when done</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 accent-[#0ea960]" />
              <span className="text-[#333] font-bold">Announce for new challenges</span>
            </label>
          </div>

          <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto">
            Save Notifications
          </button>
        </div>

      </div>
    </div>
  );
}
