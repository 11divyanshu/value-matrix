import Avatar from "../../assets/images/UserAvatar.png";

const RecentPeople = () => {
  return (
    <div className="shadow-lg sm:w-full rounded-lg md:w-full lg:w-full py-10 my-8 h-auto mx-5 bg-white px-4">
      <p className="text-xl px-4 mx-auto text-gray-700 font-bold  flex">
        {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

        <p className="px-6 mx-2  text-xl">Recent People</p>
      </p>
      <div className="flex my-4 px-5 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 font-md">Rahul Pandey</p>
          <p className="text-gray-400 text-sm">
            Web Developer , UI/UX Designer
          </p>
        </div>
      </div>

      <div className="flex my-4 px-5 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 font-md">Rahul Pandey</p>
          <p className="text-gray-400 text-sm">
            Web Developer , UI/UX Designer
          </p>
        </div>
      </div>

      <div className="flex my-4 px-5 vertical-align-middle">
        <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
        <div>
          {" "}
          <p className="py-2 font-md">Rahul Pandey</p>
          <p className="text-gray-400 text-sm">
            Web Developer , UI/UX Designer
          </p>
        </div>
      </div>

      {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}
    </div>
  );
};

export default RecentPeople;