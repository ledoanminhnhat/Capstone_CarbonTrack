import React from "react";

export default function ChallengesPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h2 className="text-3xl font-bold text-[#333] mb-2">Challenges and Hints</h2>
        <p className="font-semibold text-[#555] mb-6">Challenges in progress</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-20 bg-[#0ea960] relative flex justify-center">
              <div className="absolute -bottom-6 w-16 h-16 bg-[#fadcdc] rounded-full flex items-center justify-center border-4 border-white">
                <span className="text-2xl text-red-500 line-through">🐄</span>
              </div>
            </div>
            <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-center mb-4 text-[#333]">1 week no steak</h3>
              <div className="mb-2">
                <div className="flex gap-1 h-2">
                  <div className="w-2/7 h-full bg-[#0ea960] rounded-l-full"></div>
                  <div className="w-5/7 h-full bg-[#e5e7eb] rounded-r-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-6">
                <span className="text-[#555]">2/7 days</span>
                <span className="text-[#a8d5ba]">+500 pts</span>
              </div>
              <button className="mt-auto w-full py-2 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Continues
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-20 bg-[#0ea960] relative flex justify-center">
              <div className="absolute -bottom-6 w-16 h-16 bg-[#e0f2e9] rounded-full flex items-center justify-center border-4 border-white">
                <span className="text-2xl text-[#0ea960]">🚲</span>
              </div>
            </div>
            <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-center mb-4 text-[#333]">Bicycle 3<br/>times/week</h3>
              <div className="mb-2">
                <div className="flex gap-1 h-2">
                  <div className="w-1/3 h-full bg-[#0ea960] rounded-l-full"></div>
                  <div className="w-2/3 h-full bg-[#e5e7eb] rounded-r-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-6">
                <span className="text-[#555]">1/3 days</span>
                <span className="text-[#a8d5ba]">+300 pts</span>
              </div>
              <button className="mt-auto w-full py-2 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Submit
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="h-20 bg-[#0ea960] relative flex justify-center">
              <div className="absolute -bottom-6 w-16 h-16 bg-[#e0f2e9] rounded-full flex items-center justify-center border-4 border-white">
                <span className="text-2xl text-[#0ea960]">💡</span>
              </div>
            </div>
            <div className="pt-10 pb-6 px-6 flex flex-col flex-1">
              <h3 className="font-bold text-lg text-center mb-4 text-[#333]">Turn off light<br/>when not use</h3>
              <div className="mb-2">
                <div className="flex gap-1 h-2">
                  <div className="w-5/7 h-full bg-[#0ea960] rounded-l-full"></div>
                  <div className="w-2/7 h-full bg-[#e5e7eb] rounded-r-full"></div>
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold mb-6">
                <span className="text-[#555]">5/7 days</span>
                <span className="text-[#a8d5ba]">+200 pts</span>
              </div>
              <button className="mt-auto w-full py-2 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#333] mb-6">More Challenges and News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 4 */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e0f2e9] rounded-full flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <h3 className="font-bold text-xl text-[#333]">Personalizations</h3>
            </div>
            <p className="text-[#555] mb-6 flex-1">
              The system detects you use a motorbike often for short distances (&lt;1km). Try walking!
            </p>
            <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto">
              More Information
            </button>
          </div>

          {/* Card 5 */}
          <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#e0f2e9] rounded-full flex items-center justify-center">
                <span className="text-xl">💡</span>
              </div>
              <h3 className="font-bold text-xl text-[#333]">Eco Tips</h3>
            </div>
            <p className="text-[#555] mb-6 flex-1">
              Thur Meat-free Monday save <span className="font-bold">~~0.8kg</span> in progress
            </p>
            <button className="w-full py-3 bg-[#0ea960] text-white font-bold rounded-lg hover:bg-[#0c9052] transition-colors mt-auto">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
