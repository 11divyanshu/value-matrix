import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "tw-elements";
import { BiErrorCircle } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import {Link } from "react-router-dom";

const DetailForm = (props) => {
  
  return (
    <>
      <Transition appear show={props.isOpen} as={Fragment} className="relative z-50">
        <Dialog
          as="div"
          className="relative z-120"
          onClose={() => {}}
          static={true}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-full  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ width: "62%" }}
                >
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 flex"
                  >
                    Complete Your Profile To Continue
                  </Dialog.Title>
                  <div className="pt-4 w-full">
                    <div className="py-9 text-xl space-y-5 w-full">
                      <div className="flex items-center space-x-3">
                        {props.user && props.user.profileImg ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Uploaded Profile Image</p>
                      </div>
                      <div className="flex items-center space-x-5">
                        {props.user && props.user.linkedInId ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Connected LinkedIn Profile</p>
                      </div>
                      <div className="flex items-center space-x-5">
                        {props.user && props.user.tools.length > 0 ? (
                          <TiTick className="text-green-500 text-2xl" />
                        ) : (
                          <BiErrorCircle className="text-red-500 text-2xl" />
                        )}
                        <p>Updated Skills</p>
                      </div>
                      <div className="mt-10 mb-5 w-full">
                        <Link to="/user/editProfile">
                        <button className="px-4 py-2 w-1/3 block mx-auto rounded-sm text-white" style={{backgroundColor:"#034488"}}>Complete Your Profile</button></Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DetailForm;
