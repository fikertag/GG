// import NavBar from "./component/navbar";
// import Roasts from "./component/Rosts";
// import Comments from "./component/Comment";
import Link from "next/link";

export default function Home() {
  return (
    // <div className="bg-black max-w-[700px] flex mx-auto ">
    //   <NavBar />
    //   <div className="py-5 flex justify-between relative">
    //     <Roasts />
    //     {/* <Comments /> */}
    //   </div>
    // </div>
    <div className="bg-[#1a1a1a] h-screen text-white flex flex-col items-center justify-center px-4">
      <div className="text-4xl text-center pb-5 font-bold">
        Share your Gossip Anonymously
      </div>
      <div className="text-center text-gray-400 max-w-lg">
      Talk about your teachers, your crush, and everything in between. Stay anonymous, spill the tea, and enjoy the buzz!
      </div>
      <Link
        href={"/gossip"}
        className="bg-white text-black px-6 py-2 rounded-md text-xl my-8 transition-transform transform hover:scale-105"
      >
        Get Started
      </Link>
      <div className="mt-8 text-gray-500">Trusted by HU students</div>
    </div>
  );
}
