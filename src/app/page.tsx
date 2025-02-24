import NavBar from "./component/navbar";
import Roasts from "./component/Rosts";
import Comments from "./component/Comment";

export default function Home() {
  return (
    <div className="bg-[#1a1a1a] ">
      <NavBar />
      <div className="px-10 py-5 flex justify-between">
        <Roasts />
        <Comments />
      </div>
    </div>
  );
}
