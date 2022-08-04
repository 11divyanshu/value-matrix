import React from "react";
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
// Assets
import { IoCall } from "react-icons/io5";
import { BsFillChatLeftTextFill, BsFillBellFill } from "react-icons/bs";

const Navbar = (props) => {
  return (
    <div className="flex items-center border-b-2 w-full pl-4 py-4 shadow-md">
      <div className="text-slate-600 text-lg">Company Name</div>
      <div className="space-x-8 ml-auto flex mr-8 items-center">
        <IoCall className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
        <BsFillChatLeftTextFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
        <Popover className="relative">
        {({ open }) => (
            <>
            <Popover.Button
              className={`
              ${open ? '' : 'text-opacity-90'} focus:outline-0`}
            >
              <BsFillBellFill className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                   Notifications
                  </div>
                  <div className="bg-gray-50 p-4">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          Documentation
                        </span>
                      </span>
                      <span className="block text-sm text-gray-500">
                        Start integrating products and tools
                      </span>
                    </a>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>

        <div className="flex space-x-3 items-center cursor-pointer">
          <div className="h-7 w-7 bg-blue-600 rounded-full"></div>
          <div className="text-xs">
            {props.user ? (
              <p className="text-md text-semibold">{props.user.username}</p>
            ) : (
              <p className="text-md text-semibold">User</p>
            )}
            <p className="text-xs text-gray-600">View Admin Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
