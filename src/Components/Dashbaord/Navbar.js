import React from "react";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LogoutAPI } from "../../service/api";
import { ReactSession } from "react-client-session";
import { Link } from "react-router-dom";

// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import { RiLogoutBoxRFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import NotificationPopOver from "./Notifications";

const HorizontalNav = (props) => {
  const [progress, setProgress] = React.useState(0);

  const Logout = async () => {
    console.log("CHeck");
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
    <div className="flex items-center border-b-2 w-full pl-4 py-4 shadow-md">
      <div className="text-slate-600 text-lg md:block hidden ">
        Value Matrix
      </div>
      <div className="space-x-8   ml-auto flex mr-8 items-center">
        <IoCall className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden" />
        <BsFillChatLeftTextFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden" />
        <NotificationPopOver />
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={`
              ${open ? "" : "text-opacity-90"} focus:outline-0`}
              >
                <div className="flex space-x-3 items-center cursor-pointer">
                  <div className="h-7 w-7 bg-blue-600 rounded-full"></div>
                  <div className="text-xs text-start md:block hidden">
                    {props.user ? (
                      <p className="text-md text-semibold">
                        {props.user.username}
                      </p>
                    ) : (
                      <p className="text-md text-semibold">User</p>
                    )}
                  </div>
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
                <Popover.Panel className="absolute left-screen z-10 mt-3 w-max-content max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl ">
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
                            <FaUserCircle /> <p>View Profile</p>
                          </Link>
                        </div>
                      </span>
                      <span className="flex items-center my-3">
                        <div
                          className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer"
                          onClick={Logout}
                        >
                          <RiLogoutBoxRFill /> <p>Logout</p>
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
