"use client";

import { useState, useRef, useEffect } from "react";
import Roast from "./Rost";
import { useInsults } from "@/context/InsultContext";
import { useComments } from "@/context/Comment";

export default function Roasts() {
  const { insults, addInsult } = useInsults();
  const { setIsComment } = useComments();
  const [newInsult, setNewInsult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newInsult]);

  const handlesubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    addInsult(newInsult)
      .then(() => {
        setNewInsult("");
        setError(null); // Clear any previous error
      })
      .catch((err) => {
        setError("Failed to add insult. Please try again.");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div
      onClick={() => setIsComment("")}
      className="text-[#cbccce] pt-16 px-4 w-full "
    >
      <form onSubmit={handlesubmit} className=" ">
        {/* <textarea
          placeholder="write your gossip here"
          value={newInsult}
          required
          onChange={(e) => setNewInsult(e.target.value)}
          className=" bg-transparent border border-gray-500/50 shadow-sm w-full py-1 resize-none px-3 text-[#cbccce] focus:outline-none m-0 pt-2 text-sm rounded-md "
        /> */}
        <textarea
          ref={textareaRef}
          placeholder="write your gossip here..."
          className="overflow-y-hidden bg-transparent border border-[#3b3b3b] rounded-md px-3 py-2 text-sm resize-none flex-grow focus:outline-none h-10 w-full"
          value={newInsult}
          onChange={(e) => {
            if (e.target.value.length > 399) return; // Prevent input beyond 350 chars
            setNewInsult(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }}
        />
        <button
          type="submit"
          disabled={!newInsult.trim() || loading}
          className={` ${
            !newInsult.trim()
              ? "text-[#616163] border-gray-500/50"
              : "text-[#e0e1e2] border-[#bdbcbc]"
          } relative px-6 border flex justify-center items-center gap-2  shadow-sm py-2 transition-all active:bg-transparent mt-2 text-sm rounded-md`}
        >
          Gossip
          {loading && (
            <div className="flex justify-center items-center ml-2 absolute right-1">
              <div
                style={{
                  border: "1px solid #1a1a1a",
                  borderTop: "1px solid #ffffff",
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                  animation: "spin 2s linear infinite",
                }}
              ></div>
              <style jsx>{`
                @keyframes spin {
                  0% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </div>
          )}
          {error && (
            <div className="text-red-500 ml-2 absolute right-2 text-[8px]">
              X
            </div>
          )}
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
