import Avatar from "../../assets/images/UserAvatar.png";

const RecentPeople = () => {
  return (
    <div className="shadow-lg sm:w-full rounded-lg md:w-full lg:w-2/6  py-5  bg-white  justify-around lg:mx-4 my-4 h-auto  px-4 bg-white">
      <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
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
    </div>
  );
};

export default RecentPeople;
