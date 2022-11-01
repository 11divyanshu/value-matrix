import React, { useState, Fragment , useEffect} from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  getXIList
} from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { Popover } from "@headlessui/react";


const XICategory = () => {
  const [userList, setUserList] = React.useState([]);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [permissions, setPermissions] = React.useState([
    {
      title: "Add Jobs",
      id: "add_jobs",
      value: add_jobs,
    },
    {
      title: "Add Users",
      id: "add_users",
      value: add_users,
    },
    {
      title: "List Candidates",
      id: "list_candidates",
      value: listCan,
    },
  ]);



 const navigate = useNavigate();

 React.useEffect(() => {
   const initial = async () => {
     let user = JSON.parse(await localStorage.getItem("user"));
     let res = await getUserFromId({ id: user._id }, user.access_token);
     console.log(res);
     if (res && res.data && res.data.user) {
       if (
         res.data.user.permissions[0].admin_permissions.list_XI === false
       ) {
         navigate(-1);
       }
     }
   };
   initial();
 }, []);
 


  React.useEffect(() => {
    const initial = async () => {
      let token = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let response = await getXIList({user_id:user._id},token);
      console.log(response);
      if (response && response.status === 200) {
        setUserList(response.data);
      }
    };
    initial();
  }, []);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= userList.length; i++) {
      document.getElementById("AdminUserCrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("AdminUserCrd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  return (
    <div className="p-5">
      <p className="text-2xl font-semibold mx-10">XI Categories</p>
      <div className="mt-3">
        <div className="flex flex-col mx-10">
          <div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Category
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Cat Multiplier
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Limit
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Payout
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((item, index) => {
                      return (
                        <>
                          <tr
                            id={"AdminUserCrd" + (index + 1)}
                            className={
                              index < 5 ? "bg-gray-100" : "bg-gray-100 hidden"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.cat}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.limit}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.payout}
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                            <Popover className="relative mt-1">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                    >
                                      <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
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
                                      <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                        <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                          <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
                                            
                                            <div
                                              className="flex items-center border-b text-gray-800 space-x-2"
                                              onClick={async () => {
                                              
                                              }}
                                            >
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-2">
                                                Update
                                              </p>{" "}
                                            </div>
                                            <div
                                              className="flex items-center text-gray-800 space-x-2"
                                             
                                            >
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-1 cursor-pointer">
                                                Delete
                                              </p>{" "}
                                            </div>
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                <div className={userList.length > 5 ? "w-full" : "hidden"}>
                  <div className="flex justify-between my-2 mx-1">
                    <div>
                      Page {page} of {Math.ceil(userList.length / 5)}
                    </div>
                    <div>
                      {" "}
                      {userList &&
                        userList.map((user, index) => {
                          return index % 5 == 0 ? (
                            <span
                              className="mx-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                paginate(index / 5 + 1);
                              }}
                            >
                              {index / 5 + 1}
                            </span>
                          ) : null;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XICategory;
