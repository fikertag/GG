"use client";

import { useComments } from "@/context/Comment";
import { useInsults } from "@/context/InsultContext";

import { useState } from "react";

export default function Comments() {
  const { comments, addComments } = useComments();
  const [newComments, setNewComment] = useState("");

  const { selectedInsult } = useInsults();

  // useEffect(() => {
  //   {
  //     comments.map((comment) => console.log(comment.insultId, selectedInsult));
  //   }
  // }, [selectedInsult]);
  // useEffect(() => {
  //   console.log("comment", comments);
  // }, [comments]);

  const handleAddComments = () => {
    addComments(newComments, selectedInsult);
    setNewComment("");
  };

  return (
    <div className=" text-white pt-16 w-2/6 px-4 fixed right-0  ">
      <div className="border border-[#2d2d2e] h-[560px] flex flex-col ">
        <div className="bg-[#2a2a2a] py-3 px-3 ">Comments</div>

        <div className="flex flex-col items-start justify-start flex-grow ">
          {comments.map((comment) =>
            comment.insultId === selectedInsult ? (
              <div
                key={comment._id}
                className="py-2 px-4 border-t border-[#2d2d2e] w-full text-xs flex flex-col font-[200]"
              >
                <div className="py-1">{comment.createdAt}</div>
                <div>{comment.text}</div>
              </div>
            ) : null
          )}
        </div>

        <textarea
          placeholder="comment here"
          className="bg-transparent border-t border-[#262627]  resize-none px-3 outline-none pt-2"
          value={newComments}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleAddComments}>send</button>
      </div>
    </div>
  );
}
