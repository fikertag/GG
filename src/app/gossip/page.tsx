"use client"

import { useEffect, useState } from "react";
import NavBar from "../component/navbar";
import Roasts from "../component/Rosts";
// import Comments from "../component/Comment";
import { useInsults } from "@/context/InsultContext";
import { useComments } from "@/context/Comment";

export default function Gossip() {
  const { insults } = useInsults();
  const { comments } = useComments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (insults.length > 0 && comments.length > 0) {
      setLoading(false);
    }
  }, [insults, comments]);

  return (
    <div className="bg-[#1a1a1a] max-w-[700px] flex mx-auto justify-center ">
    <NavBar />
    <div className="py-5 flex justify-between relative">
      {loading ? (
        <div className="flex justify-center items-center h-screen text-white text-2xl">
          Loading ... 
        </div>
      ) : (
        <Roasts />
      )}
    </div>
  </div>
  );
}