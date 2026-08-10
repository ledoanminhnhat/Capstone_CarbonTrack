"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { MdOutlineMoreHoriz, MdFavoriteBorder, MdFavorite, MdOutlineChatBubbleOutline, MdOutlineShare, MdImage, MdVideoLibrary, MdInsertEmoticon } from "react-icons/md";

const FeedPost = ({ avatarIcon, avatarBg, name, time, content, imageIcon, imageBg, imageIconClass, initialLikes = 0, comments = [] }: any) => {
  const [liked, setLiked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayLikes = liked ? initialLikes + 1 : initialLikes;

  const handleCommentClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${avatarBg}`}>
            <span className="text-xl">{avatarIcon}</span>
          </div>
          <div>
            <h4 className="font-bold text-[#333] leading-none">{name}</h4>
            <span className="text-sm text-[#888]">{time}</span>
          </div>
        </div>
        <MdOutlineMoreHoriz className="text-[#888] text-xl cursor-pointer" />
      </div>
      <p className="text-[#444] text-sm mt-1">
        {content}
      </p>
      <div className={`h-40 rounded-lg w-full overflow-hidden flex items-center justify-center ${imageBg}`}>
        <span className={`text-4xl ${imageIconClass}`}>{imageIcon}</span>
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-[#f9f9f9] transition-colors ${liked ? 'border-red-200 text-red-500' : 'border-[#eee] text-[#666]'}`}
          >
            {liked ? <MdFavorite /> : <MdFavoriteBorder />}
            {displayLikes > 0 && <span className="ml-1">{displayLikes}</span>}
          </button>
          <button
            onClick={handleCommentClick}
            className={`flex items-center gap-1 border rounded-md px-3 py-1.5 text-sm hover:bg-[#f9f9f9] transition-colors border-[#eee] text-[#666]`}
          >
            <MdOutlineChatBubbleOutline /> {comments.length > 0 ? comments.length : 'Comment'}
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-[#f0f0f0]">
          {comments.map((c: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${c.avatarBg}`}>
                <span className="text-sm">{c.avatarIcon}</span>
              </div>
              <div className="bg-[#f5f9f5] rounded-xl px-4 py-2 flex-1">
                <h4 className="font-bold text-[#333] text-sm leading-none mb-1">{c.name}</h4>
                <p className="text-[#555] text-sm">{c.text}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 mt-1">
            <div className="w-8 h-8 rounded-full bg-[#aed9b8] flex items-center justify-center shrink-0">
              <span className="text-sm">👨🏻</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Write a comment..."
              className="flex-1 bg-[#f9f9f9] border border-[#eee] rounded-full px-4 py-2 text-sm outline-none focus:border-[#0ea960]"
            />
            <button className="text-[#0ea960] font-bold text-sm px-2 cursor-pointer">Post</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mockLeaderboard = [
  { rank: 1, name: "Anh Thu", avatar: "👩🏻", bg: "bg-[#f0d6e3]", score: "125 kg CO₂e" },
  { rank: 2, name: "Hoang Long", avatar: "👨🏻‍🦱", bg: "bg-[#aed9b8]", score: "118 kg CO₂e" },
  { rank: 3, name: "Tuan Kiet", avatar: "👨🏽", bg: "bg-[#d4ebd8]", score: "105 kg CO₂e" },
  { rank: 4, name: "Bao Ngoc", avatar: "👩🏽", bg: "bg-[#fcd34d]", score: "98 kg CO₂e" },
  { rank: 5, name: "Minh Trang", avatar: "👩🏻", bg: "bg-[#f0d6e3]", score: "95 kg CO₂e" },
  { rank: 6, name: "Duc Dat", avatar: "👨🏻‍🦱", bg: "bg-[#aed9b8]", score: "92 kg CO₂e" },
  { rank: 7, name: "Thanh Tra", avatar: "👩🏽", bg: "bg-[#fcd34d]", score: "90 kg CO₂e" },
  { rank: 8, name: "Hai Dang", avatar: "👨🏽", bg: "bg-[#d4ebd8]", score: "89 kg CO₂e" },
  { rank: 9, name: "Quoc Huy", avatar: "👨🏻", bg: "bg-[#aed9b8]", score: "88 kg CO₂e" },
  { rank: 10, name: "Thu Huong", avatar: "👩🏻", bg: "bg-[#f0d6e3]", score: "87 kg CO₂e" },
  { rank: 11, name: "Ngoc Bich", avatar: "👩🏽", bg: "bg-[#fcd34d]", score: "86.5 kg CO₂e" },
  { rank: 12, name: "Gia Bao", avatar: "👨🏻‍🦱", bg: "bg-[#aed9b8]", score: "86 kg CO₂e" },
  { rank: 13, name: "Yen Nhi", avatar: "👩🏻", bg: "bg-[#f0d6e3]", score: "85.8 kg CO₂e" },
  { rank: 14, name: "Kien Trung", avatar: "👨🏽", bg: "bg-[#d4ebd8]", score: "85.5 kg CO₂e" },
];

export default function CommunityPage() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [showGroups, setShowGroups] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] w-full overflow-hidden">
      <h2 className="text-3xl font-bold text-[#333] mb-6 shrink-0">Green Community</h2>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left Column - Feed */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4 h-full overflow-y-auto pr-2 pb-2">
          {/* Share Input */}
          <div className="bg-white p-4 rounded-xl flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#aed9b8] flex items-center justify-center shrink-0">
                <span className="text-xl">👨🏻</span>
              </div>
              <input
                type="text"
                placeholder="Share your green activity...."
                className="flex-1 bg-[#f9f9f9] border border-[#e0e0e0] rounded-full px-4 py-2.5 outline-none text-[#333] focus:border-[#0ea960]"
              />
            </div>
            <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-3 px-2">
              <div className="flex gap-6">
                <button className="flex items-center gap-2 text-[#666] hover:bg-[#f5f9f5] hover:text-[#0ea960] py-1 px-2 rounded-md transition-colors font-semibold text-sm">
                  <MdImage className="text-xl text-blue-500" /> Photo
                </button>
                <button className="flex items-center gap-2 text-[#666] hover:bg-[#f5f9f5] hover:text-[#0ea960] py-1 px-2 rounded-md transition-colors font-semibold text-sm">
                  <MdVideoLibrary className="text-xl text-green-500" /> Video
                </button>
                <button className="flex items-center gap-2 text-[#666] hover:bg-[#f5f9f5] hover:text-[#0ea960] py-1 px-2 rounded-md transition-colors font-semibold text-sm hidden sm:flex">
                  <MdInsertEmoticon className="text-xl text-yellow-500" /> Feeling
                </button>
              </div>
              <button className="bg-[#0ea960] text-white font-bold py-1.5 px-5 rounded-lg hover:bg-[#0c9052] transition-colors text-sm">
                Post
              </button>
            </div>
          </div>

          <FeedPost
            avatarIcon="👩🏻" avatarBg="bg-[#f0d6e3]"
            name="Lan Nguyen" time="18 days"
            content={<>Hôm nay mình đạp xe 15km đi làm thay vì xe máy! Tiết kiệm được ~1.2 kg CO₂e. <span className="text-[#0ea960]">#SongXanh</span></>}
            imageIcon="🚲" imageBg="bg-[#d4ebd8]" imageIconClass="text-[#0ea960]"
            initialLikes={12}
            comments={[
              { name: "Anh Thu", avatarIcon: "👩🏻", avatarBg: "bg-[#f0d6e3]", text: "Tuyệt vời quá! Cuối tuần mình cũng thử." },
              { name: "Hoang Long", avatarIcon: "👨🏻‍🦱", avatarBg: "bg-[#aed9b8]", text: "Rất truyền cảm hứng, đi xe đạp cũng rèn luyện sức khỏe nữa." }
            ]}
          />

          <FeedPost
            avatarIcon="👨🏻‍🦱" avatarBg="bg-[#aed9b8]"
            name="Minh Tran" time="14 days"
            content="Cố gắng Meat-free Monday hôm nay. Bữa trưa ăn chay rất ngon và nhẹ bụng."
            imageIcon="🥗" imageBg="bg-[#fde8cd]" imageIconClass="text-orange-500"
            initialLikes={5}
          />

          <FeedPost
            avatarIcon="👩🏽" avatarBg="bg-[#fde047]"
            name="Bao Ngoc" time="2 days"
            content="Started growing my own herbs at home! Super fun and good for the planet. 🌱"
            imageIcon="🪴" imageBg="bg-[#eef2ff]" imageIconClass=""
            initialLikes={23}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-2">
          {/* Groups */}
          <div className="flex flex-col">
            <div
              className="bg-white px-4 py-3 rounded-xl shadow-sm flex justify-between items-center cursor-pointer select-none hover:bg-[#f9f9f9] transition-colors"
              onClick={() => setShowGroups(!showGroups)}
            >
              <h3 className="font-bold text-[#333]">Suggested Groups</h3>
              <span className={`text-[#888] text-xs font-bold transition-transform duration-300 ${showGroups ? 'rotate-180' : ''}`}>▼</span>
            </div>
            <div className={`grid transition-all duration-300 ease-in-out ${showGroups ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
              <div className="overflow-hidden flex flex-col gap-3">
                {[
                  { name: "Saigon Eco-Warriors", members: 52 },
                  { name: "Hanoi Green Team", members: 38 },
                  { name: "Hanoi Green Team", members: 38 },
                  { name: "Hanoi Green Team", members: 38 },
                ].map((group, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#d4ebd8] flex items-center justify-center border-2 border-[#0ea960] shrink-0 overflow-hidden text-2xl">
                      🌱
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#333] text-sm leading-tight">{group.name}</h4>
                      <div className="text-xs text-[#888] mb-1">{group.members} members</div>
                      <button className="border border-[#0ea960] text-[#0ea960] text-xs font-bold py-1 px-3 rounded-full hover:bg-[#e8f5e9]">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white p-5 rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-[#333]">Month Leaderboard</h3>
            <div
              className="flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ maxHeight: `${visibleCount * 56}px` }}
            >
              {mockLeaderboard.map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 shrink-0 transition-opacity duration-300 ${index < visibleCount ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${user.rank === 1 ? 'bg-[#fde047] text-[#b45309]' : user.rank === 2 ? 'bg-[#e5e7eb] text-[#4b5563]' : user.rank === 3 ? 'bg-[#f3f4f6] text-[#4b5563]' : 'bg-[#f3f4f6] text-[#4b5563]'}`}>{user.rank}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${user.bg}`}>{user.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#333] text-sm">{user.name}</h4>
                    <div className="text-xs text-[#666]">{user.score}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-1">
              {visibleCount < mockLeaderboard.length && (
                <div
                  className="text-sm text-[#888] cursor-pointer hover:bg-[#f9f9f9] rounded-lg px-4 py-1.5 transition-colors font-semibold"
                  onClick={() => setVisibleCount(Math.min(visibleCount + 5, mockLeaderboard.length))}
                >
                  Show more
                </div>
              )}
              {visibleCount > 3 && (
                <div
                  className="text-sm text-[#888] cursor-pointer hover:bg-[#f9f9f9] rounded-lg px-4 py-1.5 transition-colors font-semibold"
                  onClick={() => setVisibleCount(3)}
                >
                  Show less
                </div>
              )}
            </div>
            <div className="mt-4 bg-[#e8f5e9] p-3 rounded-lg flex items-center justify-between border border-[#c8e6c9]">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#aed9b8] flex items-center justify-center shrink-0">👨🏻</div>
              <div>
                <h4 className="font-bold text-[#333] text-sm">Nhat 👋</h4>
                <div className="text-xs text-[#666]">85.2 kg CO₂e</div>
              </div>
            </div>
            <div className="font-bold text-[#333]">15th</div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h3 className="font-bold text-[#333] mb-4">Latest Community Feed & Tips</h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3 border-b border-[#f0f0f0] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#aed9b8] flex items-center justify-center shrink-0 text-sm">👨🏻‍🦱</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333] text-sm leading-none mb-1">Tran Nguyen</h4>
                <p className="text-xs text-[#666]">Tip: Just switched to a low-flow shower head. Save ~20kg CO₂e!</p>
              </div>
              <div className="flex gap-2 text-[#888]">
                <MdOutlineChatBubbleOutline className="cursor-pointer hover:text-[#333]" />
                <MdOutlineShare className="cursor-pointer hover:text-[#333]" />
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-[#f0f0f0] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#f0d6e3] flex items-center justify-center shrink-0 text-sm">👩🏻</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333] text-sm leading-none mb-1">Sarah Lee <span className="font-normal text-[#888]">completed a challenge: 🥇</span></h4>
                <p className="text-xs text-[#666]">Walked to work for 5 days.</p>
              </div>
              <div className="flex gap-2 text-[#888]">
                <MdOutlineChatBubbleOutline className="cursor-pointer hover:text-[#333]" />
              </div>
            </div>
            <div className="flex items-start gap-3 border-b border-[#f0f0f0] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#aed9b8] flex items-center justify-center shrink-0 text-sm">👨🏻</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333] text-sm leading-none mb-1">Nhat</h4>
                <p className="text-xs text-[#666]">Looking for local cycling partners.</p>
              </div>
              <div className="flex gap-2 text-[#888]">
                <MdOutlineChatBubbleOutline className="cursor-pointer hover:text-[#333]" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fcd34d] flex items-center justify-center shrink-0 text-sm">👩🏽</div>
              <div className="flex-1">
                <h4 className="font-bold text-[#333] text-sm leading-none mb-1">Bao Ngoc</h4>
                <p className="text-xs text-[#666]">Tip: Unplug electronics when not in use. Ghost electricity adds up!</p>
              </div>
              <div className="flex gap-2 text-[#888]">
                <MdOutlineChatBubbleOutline className="cursor-pointer hover:text-[#333]" />
                <MdOutlineShare className="cursor-pointer hover:text-[#333]" />
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
