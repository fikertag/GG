export default function Comments() {
  return (
    <div className="text-[#cbccce] pt-16 w-2/6 px-4 fixed right-0  ">
      <div className="border border-[#2d2d2e] h-[560px] flex flex-col justify-between ">
        <div className="bg-[#2a2a2a] py-3 px-3 ">Comments</div>
        <div className="px-3 flex justify-center text-xl">
          No Comments Found
        </div>
        <textarea
          placeholder="comment here"
          className="bg-transparent border-t border-[#262627]  resize-none px-3 outline-none pt-2"
        />
      </div>
    </div>
  );
}
