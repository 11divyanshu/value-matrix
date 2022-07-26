import React, { useState, Fragment, useEffect } from "react";
import {
  getUserList,
  getCompanyUserList,
  updateUserDetails,
  getXIList,
  getDialerToken,
} from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { MdCallEnd } from "react-icons/md";
import { BsCalendar, BsLinkedin, BsFillMicFill } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url, handleXIStatusChange } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { Device } from "@twilio/voice-sdk";
import "../../assets/stylesheet/dialer.css";
import axios from "axios";
import ActionDropdown from "../../Components/AdminDashboard/ActionDropdown";
const XIOnboarding = () => {
  const [userList, setUserList] = React.useState([]);
  const [modal, setModal] = React.useState(false);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [muted, setMuted] = useState(false);
  const [onPhone, setOnPhone] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("");
  const [token, setToken] = useState("");
  const [device, setDevice] = useState(null);
  const [call, setCall] = useState(null);
  const [callUser, setCallUser] = useState(null);
  const options = ["Approved", "Forwarded"];
  const [selected, setSelected] = useState(options[0]);
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
    const tokenFetch = async () => {
      let res = await getDialerToken();
      console.log(res.data.token);
      setToken(res.data.token);
    };
    tokenFetch();
  }, []);

  // React.useEffect(() => {
  //   const initial = async () => {
  //     let user = JSON.parse(await localStorage.getItem("user"));
  //     let res = await getUserFromId({ id: user._id }, user.access_token);
  //     if (res && res.data && res.data.user) {
  //       if (res.data.user.permissions[0].admin_permissions.list_XI === false) {
  //         navigate(-1);
  //       }
  //     }
  //   };
  //   initial();
  // }, []);

  React.useEffect(() => {
    const initial = async () => {
      let token = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let response = await getXIList({ user_id: user._id }, token);
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
  const handleToggleMute = () => {
    var m = !muted;
    setMuted(m);
    call.mute(m);
  };
  const handleToggleCall = async (contact) => {
    let d = new Device(token);
    setDevice(d);
    const call = await d.connect({
      params: { To: `+91${contact}` },
    });
    setCurrentNumber(contact);
    setOnPhone(true);
    setCall(call);
    console.log(device);
  };

  const handleDisconnect = () => {
    console.log(device);
    device.disconnectAll();
    setOnPhone(false);
    setModal(true);
    setCall(null);
  };

  const handleUserStatusChange = async () => {
    let user = JSON.parse(await localStorage.getItem("user"));
    let result = await handleXIStatusChange({id:callUser._id , status : selected});
    console.log(result)
    if(result && result.status ===200){
      swal({
        title: "Success",
        text: "XI Onboarding Status Changed",
        icon: "success",
        button: "Ok",
      });
      window.location.reload();
    }else{
      swal({
        title: "Oops",
        text: "Something went wrong",
        icon: "success",
        button: "Ok",
      });
    }
  };

  return (
    <div className="p-5">
      {modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-1050 w-full"
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-1050 w-5/6"
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
                  <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className={`${!modal ? "hidden" : "block"}`}>
                      <div className="w-full">
                        <div className="w-full my-5">
                          <h3 className="my-5">
                            What action would you like to take for the user?
                          </h3>
                          <form>
                            <select
                              value={selected}
                              onChange={(e) => setSelected(e.target.value)}
                            >
                              {options.map((value) => (
                                <option value={value} key={value}>
                                  {value}
                                </option>
                              ))}
                            </select>
                          </form>
                          <div className="" style={{ display: "flex" }}>
                            <button
                              className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                              style={{ backgroundColor: "#034488" }}
                            >
                              Cancel
                            </button>
                            <button
                              className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                              style={{ backgroundColor: "#034488" }}
                              onClick={() => {
                                setModal(false);
                                handleUserStatusChange();
                              }}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      {onPhone ? (
        <div className="modal_parent_div">
          <div className="caller_name_div">
            <p>{callUser && callUser.firstName}</p>
            <p>{callUser && callUser.contact}</p>
          </div>
          <div className="buttons_parent_div">
            <button
              className=" hover:bg-danger-700 flex text-white justify-center font-bold p-4 text-sm text-center rounded-md mx-2"
              style={{ backgroundColor: "#808080", borderRadius: "50%" }}
              onClick={handleToggleMute}
            >
              <p>
                <BsFillMicFill />
              </p>
            </button>

            <button
              className=" hover:bg-danger-700 flex text-white justify-center font-bold p-4 text-sm text-center rounded-md mx-2"
              style={{ backgroundColor: "#F22F46", borderRadius: "50%" }}
              onClick={handleDisconnect}
            >
              <p>
                <MdCallEnd />
              </p>
            </button>
          </div>
        </div>
      ) : null}

      <p className="text-2xl font-semibold mx-10">XI Pending Users List</p>
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
                        Status
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Action
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
                      console.log(user);
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
                              {user.status}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              <button
                                className=" hover:bg-blue-700 flex text-white justify-center font-bold py-2 w-full text-sm mt-4 text-center rounded-lg"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {
                                  setCallUser(user);
                                  handleToggleCall(user.contact);
                                }}
                              >
                                Call
                              </button>
                            </td>
                            <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap cursor-pointer">
                              <Link to={`/admin/AdminUserProfile/${user._id}`}>
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
