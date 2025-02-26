import { useInsults } from "@/context/InsultContext";
import { useComments } from "@/context/Comment";
import { useState } from "react";

type Insult = {
  insult: {
    _id: string;
    detail: string;
    like: number;
    dislike: number;
    comments: string[];
    createdAt: string;
    updatedAt: string;
  };
};

export default function Roast({ insult }: Insult) {
  const {
    likeInsult,
    likedInsults,
    dislikeInsult,
    setSelectedInsult,
    selectedInsult,
  } = useInsults();
  const { isComment, setIsComment, comments, addComments } = useComments();
  const [newComments, setNewComment] = useState("");

  let liked: boolean = false;
  let disliked: boolean = false;
  const handleLike = (id: string) => {
    likeInsult(id);
  };
  const handleDislike = (id: string) => {
    dislikeInsult(id);
  };
  const handleComment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInsult(id);
    if (isComment === id) {
      setIsComment("");
      return;
    }
    setIsComment(id);
  };

  const handleAddComments = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRealAddComments = () => {
    addComments(newComments, selectedInsult);
    setNewComment("");
  };

  liked = likedInsults.some(
    (insultObj) => insultObj.id === insult._id && insultObj.type === "like"
  );
  disliked = likedInsults.some(
    (insultObj) => insultObj.id === insult._id && insultObj.type === "dislike"
  );

  const isSelected = selectedInsult === insult._id;

  return (
    <div
      onClick={(e) => handleComment(insult._id, e)}
      className={`${
        isSelected ? "bg-[#202020]" : "bg-[#1a1a1a]"
      } border border-[#333] pt-2 px-2 text-[#cbccce] flex flex-col justify-between items-start text-sm cursor-pointer transition-all`}
    >
      <div className="text-xs text-gray-500">{new Date(insult.createdAt).toLocaleDateString()}</div>

      <div className="text-sm text-white pr-3 mb-3 font-light">
        {insult.detail}
      </div>

      <div className="flex gap-5 pb-3 items-center" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={liked ? "green" : "#cbccce"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer transition-all"
            onClick={() => handleLike(insult._id)}
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
          </svg>
          <div>{insult.like}</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="16"
            width="16"
            stroke={disliked ? "red" : "#cbccce"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer transition-all"
            onClick={() => handleDislike(insult._id)}
          >
            <desc>Laboratory Test Stool Streamline Icon: https://streamlinehq.com</desc>
            <path d="M17.25 11c0.7956 0 1.5587 0.3161 2.1213 0.8787 0.5626 0.5626 0.8787 1.3256 0.8787 2.1213 0 0.7956 -0.3161 1.5587 -0.8787 2.1213 -0.5626 0.5626 -1.3257 0.8787 -2.1213 0.8787h3c0.7956 0 1.5587 0.3161 2.1213 0.8787 0.5626 0.5626 0.8787 1.3256 0.8787 2.1213 0 0.7956 -0.3161 1.5587 -0.8787 2.1213 -0.5626 0.5626 -1.3257 0.8787 -2.1213 0.8787H3.75c-0.79565 0 -1.55871 -0.3161 -2.12132 -0.8787C1.06607 21.5587 0.75 20.7956 0.75 20c0 -0.7957 0.31607 -1.5587 0.87868 -2.1213C2.19129 17.3161 2.95435 17 3.75 17h3c-0.79565 0 -1.55871 -0.3161 -2.12132 -0.8787C4.06607 15.5587 3.75 14.7956 3.75 14c0 -0.7957 0.31607 -1.5587 0.87868 -2.1213C5.19129 11.3161 5.95435 11 6.75 11h3c-0.79565 0 -1.55871 -0.3161 -2.12132 -0.8787C7.06607 9.55871 6.75 8.79565 6.75 8c0 -0.79565 0.31607 -1.55871 0.87868 -2.12132C8.19129 5.31607 8.95435 5 9.75 5c0.9657 0.00036 1.906 -0.30998 2.6818 -0.88515 0.7758 -0.57518 1.3459 -1.38467 1.6262 -2.30885 0.0383 -0.12476 0.1086 -0.23735 0.2038 -0.32665 0.0952 -0.08929 0.212 -0.15219 0.339 -0.18249 0.1269 -0.0303 0.2596 -0.02695 0.3849 0.00973 0.1252 0.03668 0.2387 0.10541 0.3293 0.19941C16.5283 2.69223 17.4478 4.14551 18 5.75c0.663 2.35 -0.358 5.25 -3.75 5.25h3Z"></path>
          </svg>
          <div>{insult.dislike}</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#cbccce"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="cursor-pointer transition-all"
            onClick={(e) => handleComment(insult._id, e)}
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <div>{insult.comments.length}</div>
        </div>
      </div>
      {isComment === insult._id && (
        <div className="px-4 w-full pb-4" onClick={(e) => handleAddComments(e)}>
          {comments.map(
            (c) =>
              c.insultId === insult._id && (
                <div
                  key={c._id}
                  className="border-t border-[#333] pt-3 px-2"
                >
                  <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>

                  <div className="text-sm text-white pb-3 font-light">
                    {c.text}
                  </div>
                </div>
              )
          )}
          <div className="flex items-center justify-between">
            <textarea
              placeholder="Add a comment..."
              className="bg-transparent border border-[#333] rounded-md px-3 py-2 h-12 text-sm resize-none flex-grow focus:outline-none"
              value={newComments}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={() => handleRealAddComments()}
              className=" text-white px-4 py-2 rounded-md ml-2"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}