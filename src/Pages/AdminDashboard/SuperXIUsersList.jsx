import React, { useState, Fragment, useEffect } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  getSuperXIUserList,
  postXIUserLevel,
  ListXIMultiplier,
  ListXILevel,
  ListXICategory,
  updateXIInfo,
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
import { Button } from "@mui/material";

const XIOnboarding = () => {
  const [userList, setUserList] = React.useState([]);
  const [level, setLevel] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [multiplier, setMultiplier] = React.useState([]);
  const [Modal, setModal] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [otpModal, setotpModal] = React.useState(null);
  const [newLevel, setNewLevel] = React.useState(0);
  const [xiIdTemp, setXiIdTemp] = React.useState(null);
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
      let response = await getSuperXIUserList({ user_id: user._id }, token);
      console.log(response);
      if (response && response.status === 200) {
        setUserList(response.data);
      }
      let response1 = await ListXILevel();
      if (response1 && response1.status === 200) {
        setLevel(response1.data.category);
      }

      let response2 = await ListXIMultiplier();
      if (response2 && response2.status === 200) {
        setMultiplier(response2.data.category);
      }
      let response3 = await ListXICategory();
      if (response3 && response3.status === 200) {
        setCategory(response3.data.category);
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

  const handleLevelChange = (level,id) => {
    console.log(level)
    setotpModal(true);
    setXiIdTemp(id);
  }

  const handlePostNewLevel = async() => {
    let data = parseInt(newLevel);
    let token = await localStorage.getItem("access_token");
    setotpModal(false);
    let response = await postXIUserLevel({ user_id: xiIdTemp,level:newLevel }, token);
    if(response){
      swal({
        title: "Level Upgraded Successfully!",
        text: "XI Level is upgraded successfully!",
        icon: "success",
      }).then((respose) => {
        window.location.reload();
      });
    }else{
      swal({
        title: "Error!",
        text: "Something went wrong!",
        icon: "error",
      }).then((respose) => {
        window.location.reload();
      });
    }
  }

  return (
    <div className="p-5">
      {otpModal &&
        <Transition
          appear
          show={otpModal}
          as={Fragment}
          className="relative z-10 w-full "
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-10 w-5/6 "
            onClose={() => { }}
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

            <div className="fixed inset-0 overflow-y-auto ">
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-auto">

                    <div className='py-5 w-full bg-blue-900 flex'>
                      <p className="text-lg mx-5 text-center text-white font-semibold">
                        Enter New Level
                      </p>
                    </div>
                    <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-56"></div>
                    <div className="mx-56 my-5">
                      <h3>Enter New Level</h3>
                      <input
                        id="smsOTP"
                        type="number"
                        name="smsOTP"
                        onChange={(e) => {
                          setNewLevel(e.target.value);
                        }}
                        placeholder="Enter New Level"
                        className="w-full"
                        style={{ borderRadius: "12px", marginTop: "10px" }}
                      ></input>
                    </div>

                    <div className="w-full my-16 flex justify-center">
                      <button
                        className="border-2 text-black font-bold py-3 px-8 w-fit md:mx-4 text-xs rounded"
                        onClick={() => {
                          handlePostNewLevel()
                        }}>Submit</button>
                    </div>

                    <div className="flex my-16 justify-center">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                        style={{ backgroundColor: "#034488" }} onClick={() => { setotpModal(false) }}>Cancel</button></div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>}
      <p className="text-2xl font-semibold mx-10">XI Users List</p>
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
                        Username
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Level
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
                        Performance
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        View Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user, index) => {
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
                              {user.username}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {user.firstName}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {user.email}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                            <div className="">
                                <select
                                  id="level"
                                  name="level"
                                  style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                  className="block border-gray-200 py-1 w-full"
                                  // value={values.country}
                                  onChange={async(event) => {
                                    console.log(event.target.value);
                                    let update = await updateXIInfo({id:user._id , levelId: event.target.value});
                                    if(update.status==200){
                                      console.log('done');
                                    }
                                  }}
                                >
                                  {level &&
                                    level.map((item) => {
                                      return (
                                        <option value={item._id}>{item.level}</option>
                                      );
                                    })}
                                </select>

                              </div>
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                            <div className="">
                                <select
                                  id="category"
                                  name="category"
                                  style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                  className="block border-gray-200 py-1 w-full"
                                // value={values.country}
                                onChange={async(event) => {
                                  console.log(event.target.value);
                                  let update = await updateXIInfo({id:user._id , categoryId: event.target.value});
                                  if(update.status==200){
                                    console.log('done');
                                  }
                                }}
                                >
                                  {category &&
                                    category.map((item) => {
                                      return (
                                        <option value={item._id}>{item.category}</option>
                                      );
                                    })}
                                </select>

                              </div>
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              <div className="">
                                <select
                                  id="multiplier"
                                  name="multiplier"
                                  style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                                  className="block border-gray-200 py-1 w-full"
                                // value={values.country}
                                onChange={async(event) => {
                                  console.log(event.target.value);
                                  let update = await updateXIInfo({id:user._id , multiplierId: event.target.value});
                                  if(update.status==200){
                                    console.log('done');
                                  }
                                }}
                                >
                                  {multiplier &&
                                    multiplier.map((item) => {
                                      return (
                                        <option value={item._id}>{item.multiplier}</option>
                                      );
                                    })}
                                </select>

                              </div>
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                              <Link to={`/admin/AdminUserProfile/${user._id}`} >
                                <p>View Detail</p>
                              </Link>
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

export default XIOnboarding;
