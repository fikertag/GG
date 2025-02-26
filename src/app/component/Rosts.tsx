"use client";

import { useState } from "react";
import Roast from "./Rost";
import { useInsults } from "@/context/InsultContext";
import { useComments } from "@/context/Comment";

export default function Roasts() {
  const { insults, addInsult } = useInsults();
  const { setIsComment } = useComments();
  const [newInsult, setNewInsult] = useState<string>("");

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addInsult(newInsult);
    setNewInsult("");
  };

  return (
    <div onClick={() => setIsComment("")} className="text-[#cbccce] pt-16 px-3 w-full ">
      <form onSubmit={handlesubmit} className=" ">
        <textarea
          placeholder="write your roast here"
          value={newInsult}
          onChange={(e) => setNewInsult(e.target.value)}
          className=" bg-transparent border border-gray-500/50 shadow-sm w-full py-1 resize-none px-3 text-[#cbccce] focus:outline-none m-0 pt-2 text-sm rounded-md "
        />
        <button
          type="submit"
          className="border border-gray-500/50 shadow-sm px-5 py-1 transition-all active:bg-transparent mt-2 tetx-xs rounded-md"
        >
          Roast
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-2">
        {insults.map((insult, index) => (
          <div key={index}>
            <Roast insult={insult} />
          </div>
        ))}
      </div>
    </div>
  );
}
