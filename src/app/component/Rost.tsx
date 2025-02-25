import { useInsults } from "@/context/InsultContext";

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
  const { likeInsult, likedInsults, dislikeInsult, setSelectedInsult } =
    useInsults();
  let liked: boolean = false;
  let disliked: boolean = false;
  const handleLike = (id: string) => {
    likeInsult(id);
  };
  const handleDislike = (id: string) => {
    dislikeInsult(id);
  };

  liked = likedInsults.some(
    (insultObj) => insultObj.id === insult._id && insultObj.type === "like"
  );
  disliked = likedInsults.some(
    (insultObj) => insultObj.id === insult._id && insultObj.type === "dislike"
  );

  return (
    <div className="bg-[#1a1a1a] border border-[#2d2d2e] w-full py-2 resize-none px-3 text-white focus:outline-none focus:border-[#636364]  flex justify-between text-sm">
      <div className="text-[13px] pr-3">{insult.detail}</div>

      <div className="flex gap-[10px] w-44">
        <div className="flex items-center gap-1 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            className={`hover:fill-green-600 ${
              liked && "fill-green-600"
            } cursor-pointer transition-all`}
            onClick={() => handleLike(insult._id)}
          >
            <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"></path>
          </svg>
          <div>{insult.like}</div>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            style={{ transform: "rotate(180deg)" }}
            className={`hover:fill-red-600 ${
              disliked && "fill-red-600"
            } cursor-pointer transition-all`}
            onClick={() => handleDislike(insult._id)}
          >
            <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z"></path>
          </svg>
          <div>{insult.dislike}</div>
        </div>
        <div className="flex items-center gap-1 text-[#515253] text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#515253"
            onClick={() => setSelectedInsult(insult._id)}
          >
            <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path>
            <circle cx="9.5" cy="11.5" r="1.5"></circle>
            <circle cx="14.5" cy="11.5" r="1.5"></circle>
          </svg>
          <div>{insult.comments.length}</div>
        </div>
        <div className="flex items-center gap-1 text-[#515253] text-xs">
          <div>2/23/2025</div>
        </div>
      </div>
    </div>
  );
}
