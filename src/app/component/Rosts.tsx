"use client";

import { useState } from "react";
import Roast from "./Rost";
import { useInsults } from "@/context/InsultContext";

export default function Roasts() {
  const { insults, addInsult } = useInsults();
  const [newInsult, setNewInsult] = useState<string>("");

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addInsult(newInsult);
    setNewInsult("");
  };

  return (
    <div className="text-[#cbccce] pt-16 w-4/6">
      <form onSubmit={handlesubmit}>
        <textarea
          placeholder="write your roast here"
          value={newInsult}
          onChange={(e) => setNewInsult(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2d2d2e] w-full py-1 resize-none px-3 text-[#cbccce] focus:outline-none focus:border-[#3e3e3f] m-0 pt-2 text-sm"
        />
        <button
          type="submit"
          className="border border-[#262627] px-7 py-1 hover:bg-[#343435] transition-all active:bg-transparent mt-3"
        >
          Roast
        </button>
      </form>

      <div className="mt-5 flex flex-col gap-3">
        {insults.map((insult, index) => (
          <div key={index}>
            <Roast insult={insult} />
          </div>
        ))}
      </div>
    </div>
  );
}
