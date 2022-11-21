import { HiOutlineUser } from "react-icons/hi";
import Avatar from "../../assets/images/UserAvatar.png";

const SupportTable = () => {
  return (
    <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
      <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
        {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

        <p className=" mx-2  text-sm ">Support</p>
        <p className="">
          <HiOutlineUser />
        </p>
      </p>

      <div className="flex justify-between text-xs py-4 px-3">
        <div>
          <p>Open 0/5</p>
        </div>
        <div>
          <p>Working 0/5</p>
        </div>
        <div>
          <p>Closed 0/5</p>
        </div>
      </div>
      <div className="flex px-2 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 text-sm">Cameron Williamson</p>
          <p className="text-gray-400 text-xs">Product Designer</p>
        </div>
      </div>

      <div className="flex px-2 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 text-sm">Brookyln Simmons</p>
          <p className="text-gray-400 text-xs">Software Engineer</p>
        </div>
      </div>

      <div className="flex px-2 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 text-sm">Leslie Alexander</p>
          <p className="text-gray-400 text-xs">Project Manager</p>
        </div>
      </div>

      {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}
    </div>
  );
};

export default SupportTable;
