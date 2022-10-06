import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ReactSession } from "react-client-session";
import { LogoutAPI } from "../../service/api";
import NotificationPopOver from "../Dashbaord/Notifications";
import { getProfileImage } from "../../service/api";
import "../../assets/stylesheet/layout.scss"

// Assets
import logo from "../../assets/images/logo.png";
import Avatar from "../../assets/images/UserAvatar.png";
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { FiHelpCircle, FiLogOut } from "react-icons/fi";
import { AiOutlineUser } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";

const Navbar = (props) => {
  const Logout = async () => {
    console.log("CHeck");
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    await localStorage.setItem("user", null);
    await localStorage.setItem("access_token", null);
    window.location.href = "/login";
  };

  const [ProfilePic, setProfilePic] = React.useState(undefined);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let access_token1 = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      if (access_token1 === "null")
        await localStorage.setItem("access_token", user.access_token);
      if (user && user.profileImg) {
        let image = await getProfileImage({ id: user._id }, user.access_token);
        await localStorage.setItem("profileImg", JSON.stringify(image));
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data.Image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfilePic(src);
      }
      setUser(user);
    };
    initial();
  }, []);

  return (
    <div className="flex items-center navbar border-b-2 w-full py-3 z-100 shadow-md" style={{zIndex:9999}}>
      <div className="text-slate-600 text-lg 2xl:block hidden ">
        <img className="h-10 mx-5" src={logo} />{" "}
      </div>

      <div className="md:w-3/5 mx-auto pl-7 w-1/2" style={{zIndex:9999}}>
        <form>
          <label
            for="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
          >
            Search
          </label>
          <div className="relative">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              style={{
                boxShadow:
                  "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                border: "rgb(156 163 175) solid 0.5px",
              }}
              type="search"
              id="default-search"
              className="block p-3 pl-10 w-full text-sm text-gray-500 bg-gray-0 rounded-lg  focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="       Type to search"
              required
            />
            {/* <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
          </div>
        </form>
      </div>
      <div className="space-x-8   ml-auto flex mr-8 items-center" style={{zIndex:9999}}>
        {/* <IoCall className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden"/>
      <BsFillChatLeftTextFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden" /> */}
        <NotificationPopOver />
        <FiHelpCircle/>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
              >
                <div className="flex space-x-3 items-center cursor-pointer">
                  <div className="text-xs text-start md:block hidden">
                    {user && user.firstName && (
                      <p className="text-md text-semibold">
                        {user.firstName}
                      </p>
                    )}
                    {/* <p className="text-xs text-gray-600">View Profile</p> */}
                  </div>
                  <img
                    src={
                      user && user.profileImg && ProfilePic
                        ? ProfilePic
                        : Avatar
                    }
                    // src={Avatar}
                    className="h-7 w-7 rounded-full"
                    alt="userAvatar"
                  />
                </div>
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute left-screen z-10 mt-3 w-[150px] w-max-content max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
                {/* <Popover.Panel className="absolute left-screen z-100 mt-3 w-max-content max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl "> */}
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      <span className="flex items-center">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer"
                          onClick={Logout}
                        >
                          <MdOutlineLogout /> <p>Logout</p>
                        </div>
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
