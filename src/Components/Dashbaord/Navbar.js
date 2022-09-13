import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Avatar from "../../assets/images/UserAvatar.png";
import { LogoutAPI , getProfileImage} from "../../service/api";
import { ReactSession } from "react-client-session";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png"
import {AiOutlineUser} from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";

// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import NotificationPopOver from "./Notifications";
import { FiLogOut } from "react-icons/fi";

const HorizontalNav = (props) => {
  const [progress, setProgress] = React.useState(0);
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);

  const Logout = async () => {
    let user = await localStorage.getItem("user");
    user = JSON.parse(user);
    let res = await LogoutAPI(user._id);
    console.log(res);
    await localStorage.setItem("user", null);
    await localStorage.setItem("access_token", null);
    window.location.href = "/login";
  };

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let step = 0;
      console.log(user);
      await setUser(user);
      if (user && user.profileImg) {
        let image = await getProfileImage({ id: user._id }, user.access_token);
        await localStorage.setItem("profileImg", JSON.stringify(image));
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data.Image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        await setProfileImg(src);
      }
      if (user.resume) {
        step++;
      }
      if (user.tools.length > 0) {
        step++;
      }
      if (user.education.length > 0) {
        step++;
      }
      if (user.contact !== user.id && user.address && user.email) {
        step++;
      }
      if (user.experience.length > 0) {
        // step++;
      }
      let progress = (step / 5) * 100;
      await setProgress(progress);
    };
    initial();
  }, []);

  return (
    <div className="flex items-center border-b-2 w-full pl-4 py-3 shadow-md z-[100]">
      <div className="text-slate-600 text-lg lg:block hidden ">
        <img className="h-10 mx-5" src={logo} />
      </div>

      <div className="md:w-3/5 mx-auto pl-7 w-1/2">

        <form >
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300">Search</label>
          <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',backgroundColor:"transparent" }} type="search" id="default-search" class="block p-3 pl-10 w-full text-sm text-gray-500 rounded-lg border-none  focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Type to search" required />
            {/* <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}
          </div>
        </form>
      </div>

      <div className="space-x-8   ml-auto flex mr-8 items-center">

        <NotificationPopOver />
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
              ${open ? "" : "text-opacity-90"} focus:outline-0`}
              >
                <div className="flex space-x-3 items-center cursor-pointer">
                  <div className="text-xs text-start md:block hidden">
                    {props.user ? (
                      <p className="text-md text-semibold">
                        {props.user.firstName}
                      </p>
                    ) : (
                      <p className="text-md text-semibold">User</p>
                    )}
                  </div>
                  <img
                    src={
                      user && user.profileImg && profileImg ? profileImg : Avatar
                    }
                    //src={Avatar}
                    className="h-7 w-7 md:h-7 md:w-7 rounded-full"
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
                <Popover.Panel className="absolute left-screen z-[100] mt-3 w-[10vw] -translate-x-full transform px-4 sm:px-0 lg:max-w-3xl ">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="bg-gray-50 p-4">
                      {progress < 100 && (
                        <div>
                          <Link className="text-xs" to="/user/editProfile">
                            Complete Your Profile
                          </Link>
                          <div class="w-full bg-gray-200 h-1 mb-6">
                            <div
                              class="bg-blue-400 text-xs h-1"
                              style={{ width: progress + "%" }}
                            ></div>
                          </div>
                        </div>
                      )}
                      <span className="flex items-center mb-3">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer">
                          <Link
                            to="/user/profile"
                            className="flex space-x-2 items-center"
                          >
                            <AiOutlineUser/> <p>View Profile</p>
                          </Link>
                        </div>
                      </span>
                      <span className="flex items-center my-3">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer"
                          onClick={Logout}
                        >
                          <MdOutlineLogout/> <p>Logout</p>
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

export default HorizontalNav;
