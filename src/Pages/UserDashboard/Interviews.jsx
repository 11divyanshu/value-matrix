import React, { useState } from "react";
import JobCard from "../../Components/XIDashboard/JobCard.jsx";
import { slotDetailsOfUser,updateInterviewApplication,updateWallet } from "../../service/api.js";

import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { Fragment } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Moment from "react-moment";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import swal from "sweetalert";
import SupportTable from "./SupportTable.jsx";
const JobList = (props) => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(true);
  const [jobsExist, setjobsExist] = React.useState(false);
  const [index, setIndex] = React.useState(props.index);
  const [page, setPage] = useState(1);
  const [jobAccepted, setjobAccepted] = React.useState(false);

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
      let res = await slotDetailsOfUser(user._id);

      console.log(res);
      if (res && res.data[0]) {
        setJobs(res.data);
        setLoader(false);
        setjobsExist(true);
        let arr = [...res.data];
        const jsonObj = JSON.stringify(arr);
        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);
      } else {
        setjobsExist(false);
      }
    };
    getData();
  }, []);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= jobs.length; i++) {
      document.getElementById("intercard" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("intercard" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  return (
    <div className="bg-slate-100">
      <div
        className="flex mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "User"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
        <div className=" md:w-3/4 md:mx-5">
          {/* {jobsExist ? null : <p>No Upcoming Interviews</p>
                    } */}
          {jobsExist && loader ? (
            <p className="text-center font-semibold my-4">...Loading</p>
          ) : (
            <>
              <div className="flex justify-between w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Interviews</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>

              <div className="w-full">
                {jobs &&
                  jobs.map((job, index) => {
                    if (job.slotType == "SuperXI") {
                      return (
                        <div id={"intercard" + (index + 1)} className={index < 5 ? "w-full px-5 bg-white py-1 my-2" : "w-full px-5 bg-white py-1 my-2 hidden"}>
                          <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
                            <div className="px-5 my-2 text-md col-span-2 space-y-1">
                              <p>
                                Interview with
                                <span className="font-semibold">
                                  {" "}
                                  {job.XI[0]._id}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold">Upgrade to XI  </span>{" "}
                              </p>
                              {job.xiinterviewApplication && job.xiinterviewApplication.length > 0 ?
                                <p className="text-sm">
                                  <span className="font-semibold">
                                    Interview Id :
                                  </span>
                                  {job.interviewId}
                                </p> : null}
                            </div>
                            <div className="px-5 my-2 text-md">
                              <p>
                                {" "}
                                {new Date(job.startDate).getDate() +
                                  "-" +
                                  (new Date(job.startDate).getMonth() + 1) +
                                  "-" +
                                  new Date(job.startDate).getFullYear()}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {new Intl.DateTimeFormat("en-US", {
                                  weekday: "long",
                                }).format(new Date(job.startDate))}
                              </p>
                            </div>
                            <div className="px-5 my-2 text-md">
                              <p>
                                {new Date(job.startDate).getHours() +
                                  ":" +
                                  new Date(job.startDate).getMinutes()}{" "}
                                -{" "}
                                {new Date(job.endDate).getHours() +
                                  ":" +
                                  new Date(job.endDate).getMinutes()}
                              </p>
                              <p className="text-red-400 text-xs">
                                <Moment to={new Date(job.startDate)}>
                                  {new Date()}
                                </Moment>
                              </p>
                            </div>
                            <div className="flex space-x-3 items-center">
                              <div className="px-5 text-center my-5 text-md">
                                <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                  {job.status}
                                </span>
                              </div>
                              {/* {job.startDate === new Date() && job.status === "Accepted*/}


                              <div className="px-5 text-center my-5 text-md cursor-pointer" onClick={async()=>{
                                    let update = await updateInterviewApplication(job.uploadBy, { status:"Interviewed" });

                                    let update2 = await updateWallet(job._id);
                                }}>
                                  
                                    <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black cursor-pointer">
                                      Join
                                    </span>
                                </div>
                                {/* } */}
                            </div>

                            <div className="px-4 mx-2 py-4 align-middle absolute -right-2 top-0">
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
                                            <div className="flex items-center  text-gray-800 space-x-2">
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-2">
                                                <Link
                                                  to={`/user/interviewDetails/${job._id}`}
                                                >
                                                  View Details{" "}
                                                </Link>
                                              </p>{" "}
                                            </div>
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    else {
                      return (
                        <div id={"intercard" + (index + 1)} className={index < 5 ? "w-full px-5 bg-white py-1 my-2" : "w-full px-5 bg-white py-1 my-2 hidden"}>
                          <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
                            {job.XI[0] ? <div className="px-5 my-2 text-md col-span-2 space-y-1">
                              <p>
                                Interview with
                                <span className="font-semibold">
                                  {" "}
                                  {job.XI[0]._id}
                                </span>
                              </p>
                              <p>
                                <span className="font-semibold">Job : </span>{" "}
                                {job.job[0] && job.job[0].jobTitle}
                              </p>
                              <p className="text-sm">
                                <span className="font-semibold">
                                  Interview Id :
                                </span>
                                {job.interviewId}
                              </p>
                            </div> :
                              <div>Interview Scheduled</div>
                            }
                            <div className="px-5 my-2 text-md">
                              <p>
                                {" "}
                                {new Date(job.startDate).getDate() +
                                  "-" +
                                  (new Date(job.startDate).getMonth() + 1) +
                                  "-" +
                                  new Date(job.startDate).getFullYear()}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {new Intl.DateTimeFormat("en-US", {
                                  weekday: "long",
                                }).format(new Date(job.startDate))}
                              </p>
                            </div>
                            <div className="px-5 my-2 text-md">
                              <p>
                                {new Date(job.startDate).getHours() +
                                  ":" +
                                  new Date(job.startDate).getMinutes()}{" "}
                                -{" "}
                                {new Date(job.endDate).getHours() +
                                  ":" +
                                  new Date(job.endDate).getMinutes()}
                              </p>
                              <p className="text-red-400 text-xs">
                                <Moment to={new Date(job.startDate)}>
                                  {new Date()}
                                </Moment>
                              </p>
                            </div>
                            <div className="flex space-x-3 items-center">
                              <div className="px-5 text-center my-5 text-md">
                                <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
                                  {job.status}
                                </span>
                              </div>
                                {
                                  job.status === "Accepted" || job.status === "Pending" ? (
                                    <div className="px-5 text-center my-5 text-md" onClick={async()=>{
                                        let update = await updateInterviewApplication(job.uploadBy, { status:"Interviewed" });




                                <div className="px-5 text-center my-5 text-md cursor-pointer" onClick={async()=>{
                                    let update = await updateInterviewApplication(job.uploadBy, { status:"Interviewed" });

                                    let update2 = await updateWallet(job._id);
                                }}>
                                  
                                    <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black cursor-pointer">
                                      Join
                                    </span>
                                </div>
                                {/* } */}
                                        let update2 = await updateWallet(job._id);
                                    }}>
                                      
                                        <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                          Join
                                        </span>
                                    </div>
                                  ) : (
                                  <div className="px-5 text-center my-5 text-md" onClick={async()=>{
                                    swal({
                                      title: "Interviewed Already Completed",
                                      message: "Success",
                                      icon: "success",
                                      button: "OK",
                                    })
                                  }}>
                                    
                                      <span className="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
                                        Completed
                                      </span>
                                  </div>
                                )
                                }
                            </div>

                            <div className="px-4 mx-2 py-4 align-middle absolute -right-2 top-0">
                              <Popover className="relative mt-1">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`
                              ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                    >
                                      <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800 mt-5" />
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
                                            <div className="flex items-center  text-gray-800 space-x-2">
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-2">
                                                <Link
                                                  to={`/user/interviewDetails/${job._id}`}
                                                >
                                                  View Details{" "}
                                                </Link>
                                              </p>{" "}
                                            </div>
                                          </div>
                                        </div>
                                      </Popover.Panel>
                                    </Transition>
                                  </>
                                )}
                              </Popover>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}

                {jobs && jobs.length === 0 && (
                  <p className="text-center font-semibold my-5">
                    No Interviews Schduled
                  </p>
                )}
              </div>
              <div className="w-full">
                <div className="flex justify-between my-2 mx-1">
                  {
                    Math.ceil(jobs.length / 5) ? (
                      <div>
                        Page {page} of {Math.ceil(jobs.length / 5)}
                      </div>
                    ) : null
                  }

                  <div>
                    {" "}
                    {jobs &&
                      jobs.map((job, index) => {
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
            </>
          )}
        </div>

        <div className="md:w-1/4">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Scheduled Interviews</p>
              <p className="text-gray-400 font-semibold text-xs">
                {" "}
                {jobs.length > 0 ? jobs.length : 0}
              </p>
            </div>
          </div>

          {/* <SupportTable/> */}
        </div>
      </div>
    </div>
  );
};

export default JobList;
