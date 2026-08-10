import React from "react";
import Link from "next/link";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-[#333]">Recommendation</h2>
        <div className="bg-white border border-[#ccc] rounded-md px-4 py-2 text-sm font-semibold text-[#555] flex items-center gap-2 cursor-pointer">
          Sort By
          <span className="text-xs">▼</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Top Left: Footprint Drivers */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-[#888] tracking-wider mb-4">YOUR FOOTPRINT DRIVERS (THIS MONTH)</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#aed9b8] flex items-center justify-center text-3xl">👨🏻</div>
            <h4 className="font-bold text-xl text-[#333]">Nhat Le</h4>
          </div>

          <div className="flex gap-4 items-center mb-6">
            <div className="w-32 h-16 relative overflow-hidden flex shrink-0">
               {/* Proper semi-circle chart using conic-gradient */}
               <div 
                 className="absolute top-0 left-0 w-32 h-32 rounded-full" 
                 style={{ background: "conic-gradient(from 270deg, #0ea960 0deg 90deg, #fde047 90deg 135deg, #6366f1 135deg 180deg, transparent 180deg 360deg)" }}
               ></div>
               {/* Inner cut-out for donut effect */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 bg-white rounded-t-full"></div>
            </div>
            <div className="flex-1 text-sm font-semibold flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="text-[#0ea960] text-lg leading-none">■</span> Transport</span>
                  <span className="text-[#888]">900 kg CO₂e</span>
                </div>
                <div className="flex items-center justify-between pl-5 text-xs text-[#888]">
                  <span>↳ Motorbike</span>
                  <span>45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="text-[#6366f1] text-lg leading-none">■</span> Energy</span>
                <span className="text-[#888]">13%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="text-[#fde047] text-lg leading-none">■</span> Consumption</span>
                <span className="text-[#888]">10%</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#555] mb-6">
            Motorbike commute: 45% of transport emissions. You set a target of 1.2 tons CO2e
          </p>

          <Link href="/history" className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto text-center block">
            See Data
          </Link>
        </div>

        {/* Top Right: Personalized Plan */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold text-[#888] tracking-wider mb-2">PERSONALIZED REDUCTION ACTION PLAN</h3>
          
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-4xl">🚲</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333]">Commute by Biking</h4>
                <p className="text-sm text-[#555] mb-2">2 days/week</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-[#eee] rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-[#0ea960]"></div>
                  </div>
                  <span className="text-xs text-[#888]">2/8 days</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-[#888]">Save estimate</div>
              <div className="font-bold text-[#333]">15kg CO2e</div>
              <button className="py-2 px-4 bg-[#0ea960] text-white text-sm font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Start Challenge
              </button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-4xl">🚗</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333]">Join a local Carpool Group</h4>
                <div className="h-2 mt-4 bg-[#eee] rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-[#0ea960]"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-[#888]">Save estimate</div>
              <div className="font-bold text-[#333]">1.5kg CO2e</div>
              <button className="py-2 px-4 bg-[#0ea960] text-white text-sm font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Left: Community Challenges */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-6">
          <h3 className="text-sm font-bold text-[#888] tracking-wider mb-2">CARBONTRACK COMMUNITY CHALLENGES</h3>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-[#333]">Global Challenge: Plant 10 Trees Together</h4>
            <div className="flex justify-between text-xs text-[#555]">
              <span>Progress</span>
              <span>100/500</span>
            </div>
            <div className="h-2 w-full bg-[#eee] rounded-full overflow-hidden">
              <div className="w-1/5 h-full bg-[#0ea960]"></div>
            </div>
            <p className="text-sm text-[#666] mt-2">
              User can contribute to mask them to but your community challenges.
            </p>
          </div>

          <div className="border-t border-[#eee] pt-4 flex items-center justify-between">
            <h4 className="font-bold text-[#333] text-sm">Join 'Bike to Work' Day on May 15th</h4>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                 <div className="w-8 h-8 rounded-full bg-[#aed9b8] flex items-center justify-center text-xs border-2 border-white">👨🏻</div>
                 <div className="w-8 h-8 rounded-full bg-[#f0d6e3] flex items-center justify-center text-xs border-2 border-white">👩🏻</div>
                 <div className="w-8 h-8 rounded-full bg-[#d4ebd8] flex items-center justify-center text-xs border-2 border-white">👩🏽</div>
              </div>
              <button className="py-1.5 px-4 bg-[#0ea960] text-white text-xs font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Join Event
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Right: Goal Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-6">
          <h3 className="text-sm font-bold text-[#888] tracking-wider mb-2">GOAL PROGRESS AND NEXT STEPS</h3>
          <p className="text-sm font-semibold text-[#555]">Year target: 1.2 ton CO2e</p>

          <div className="flex items-center gap-6 mt-4">
            <div className="w-16 h-16 rounded-full border-4 border-[#0ea960] border-r-[#eee] flex items-center justify-center shrink-0">
               {/* Circular progress */}
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#333]">1.2 ton target</span>
                <span className="text-[#333]">0.4 tons saved</span>
              </div>
              <div className="h-4 w-full bg-[#eee] rounded-full overflow-hidden">
                 <div className="w-3/4 h-full bg-[#0ea960]"></div>
              </div>
              <div className="flex justify-between text-xs text-[#888]">
                <span>Monthly Progress: 75%</span>
                <span>450 kg CO2e left to save</span>
              </div>
            </div>
          </div>

          <Link href="/history" className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto text-center block">
            View All Stats
          </Link>
        </div>

      </div>
    </div>
  );
}
