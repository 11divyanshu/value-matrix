import React from "react";
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import{ ReactSession} from "react-client-session";
import { LogoutAPI } from "../../service/api";
import NotificationPopOver from "../Dashbaord/Notifications";

// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill } from "react-icons/bs";
import {FiLogOut} from "react-icons/fi";

const Navbar = (props) => {
  const Logout = async () => {

    let user = ReactSession.get("user");
    console.log(user);
    window.location.href = "/login";
    let res = await LogoutAPI(user._id);
    console.log(res);
    ReactSession.set("user", null);
    ReactSession.set("access_token", null);
  };

  return (
    <div className="flex items-center border-b-2 w-full pl-4 py-4 shadow-md">
    <div className="text-slate-600 text-lg md:block hidden ">Company Name</div>
    <div className="space-x-8   ml-auto flex mr-8 items-center">
      <IoCall className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden"/>
      <BsFillChatLeftTextFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 md:block hidden" />
      <NotificationPopOver/>
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
                  <p className="text-xs text-gray-600">View Profile</p>
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
                    <span className="flex items-center">
                      <div
                        className="text-sm font-medium text-gray-900 flex items-center space-x-2 cursor-pointer"
                        onClick={Logout}
                      >
                        <FiLogOut /> <p>Logout</p>
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