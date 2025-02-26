"use client";

import { useInsults } from "@/context/InsultContext";
import { useComments } from "@/context/Comment";
import { useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const { fetchInsults } = useInsults();
  const { fetchComments } = useComments();
  // const [isOpen, setIsOpen] = useState(false);

  const handleReload = () => {
    fetchComments();
    fetchInsults();
  };



  return (
    <div className="bg-[#1a1a1a] w-full text-[#cbccce] border-b-[0.1px] border-[#2d2d2e] py-4 min-[500px]:px-32 px-4 flex justify-between items-center fixed z-10 left-0">
      <Link href={"/"} className="text-2xl font-bold">Gossip</Link>
      <div className="flex gap-8 text-lg">
        {/* <div
          className=" relative flex gap-2 items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="#cbccce"
          >
            <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19s.55-.988 1.012-1H21V4c0-1.103-.897-2-2-2zm0 14H5V5c0-.806.55-.988 1-1h13v12z"></path>
          </svg>
          <span className="hidden">Rules</span>
          {isOpen && (
            <div className="absolute top-full left-0 bg-gray-800 text-white p-2 mt-2 rounded shadow">
              No rule
            </div>
          )}
        </div> */}
        <p
          className="flex gap-2 items-center cursor-pointer"
          onClick={handleReload}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#cbccce"
          >
            <path d="M10 11H7.101l.001-.009a4.956 4.956 0 0 1 .752-1.787 5.054 5.054 0 0 1 2.2-1.811c.302-.128.617-.226.938-.291a5.078 5.078 0 0 1 2.018 0 4.978 4.978 0 0 1 2.525 1.361l1.416-1.412a7.036 7.036 0 0 0-2.224-1.501 6.921 6.921 0 0 0-1.315-.408 7.079 7.079 0 0 0-2.819 0 6.94 6.94 0 0 0-1.316.409 7.04 7.04 0 0 0-3.08 2.534 6.978 6.978 0 0 0-1.054 2.505c-.028.135-.043.273-.063.41H2l4 4 4-4zm4 2h2.899l-.001.008a4.976 4.976 0 0 1-2.103 3.138 4.943 4.943 0 0 1-1.787.752 5.073 5.073 0 0 1-2.017 0 4.956 4.956 0 0 1-1.787-.752 5.072 5.072 0 0 1-.74-.61L7.05 16.95a7.032 7.032 0 0 0 2.225 1.5c.424.18.867.317 1.315.408a7.07 7.07 0 0 0 2.818 0 7.031 7.031 0 0 0 4.395-2.945 6.974 6.974 0 0 0 1.053-2.503c.027-.135.043-.273.063-.41H22l-4-4-4 4z"></path>
          </svg>
          <span className="hidden">Reload</span>
        </p>
      </div>
    </div>
  );
}
