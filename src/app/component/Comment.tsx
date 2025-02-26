"use client";

import { useComments } from "@/context/Comment";
import { useInsults } from "@/context/InsultContext";

import { useState } from "react";

export default function Comments() {
  const { comments, addComments, isComment } = useComments();
  const [newComments, setNewComment] = useState("");

  const { selectedInsult } = useInsults();

  const handleAddComments = () => {
    addComments(newComments, selectedInsult);
    setNewComment("");
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-[#0e0d0d] w-full text-white left-0 bottom-0  ${
        isComment ? "fixed" : "hidden"
      } `}
    >
      <div className="border border-[#2d2d2e] h-[450px] flex flex-col ">
        <div className="bg-[#1a1a1a] py-3 px-3 text-[#cbccce]">Comments</div>

        <div className="flex flex-col items-start justify-start flex-grow  overflow-y-scroll pb-10">
          {comments.map((comment) =>
            comment.insultId === selectedInsult ? (
              <div
                key={comment._id}
                className="pb-3 px-3 border-b border-[#282829] w-full text-xs flex flex-col font-[200] "
              >
                <div className="py-1 text-[10px]">
                  {comment.createdAt.split("T")[0]}
                </div>
                <div>{comment.text}</div>
              </div>
            ) : null
          )}
        </div>
        <div className="flex  items-center justify-between border-t border-[#262627] ">
          <input
            placeholder="comment here"
            className="bg-transparent px-3 outline-none py-5 text-xs"
            value={newComments}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="mr-5 text-sm" onClick={handleAddComments}>
            send
          </button>
        </div>
      </div>
    </div>
  );
}
