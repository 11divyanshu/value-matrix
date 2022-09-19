import React from "react";
import { FaBuilding } from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";

import { Popover, Transition } from "@headlessui/react";

const InterviewListCard = (props) => {
  const [job, setJob] = React.useState(props.job);
  const [user, setUser] = React.useState(null);
  console.log(props.job);
  // localStorage.setItem("jobs", JSON.stringify(job))

  React.useState(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

//   localStorage.setItem("ids", JSON.stringify(job._id));
  return (
    <div className="w-full px-5 bg-white py-1 my-2">
      <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
        <div className="px-5 my-2 text-md col-span-2 space-y-1">
          <p>
            Interview with
            <span className="font-semibold">
              {" "}
              {job.applicant.firstName} {job.applicant.lastname}
            </span>
          </p>
          <p>
            <span className="font-semibold">Job : </span> {job.job.jobTitle}
          </p>
          <p className="text-sm"><span className="font-semibold">Interview Id :</span>{job.application._id}</p>
        </div>
        <div className="px-5 my-2 text-md">
          <p> Jan 17,2022</p>
          <p className="text-gray-400 text-sm">Tuesday</p>
        </div>
        <div className="px-5 my-2 text-md">
          <p>12am - 1am</p>
          <p className="text-red-400 text-xs"> 03 Minutes Remaining</p>
        </div>
        <div className="flex space-x-3 items-center">
        <div className="px-5 text-center my-5 text-md">
          <span class="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl dark:bg-yellow-200 dark:text-gray-900 my-2 py-2">
            {job.application.status}
          </span>
        </div>
        <div className="px-5 text-center my-5 text-md">
            <Link to={`/XI/reportDetails/${job.application._id}`}>
          <span class="text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2 border-2 border-black">
            View
          </span></Link>
        </div></div>

        <div className="px-4 mx-2 py-4 align-middle absolute -right-2 top-0">
          <Popover className="relative mt-1">
            {({ open }) => (
              <>
                <Popover.Button
                  className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                >
                  {/* <div class="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10" style={{backgroundColor:"#034488"}}></div> */}

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
                        <div className="flex items-center border-b text-gray-800 space-x-2">
                          {/* <BsThreeDots className="text-md" /> */}
                          <p className="text-sm font-semibold py-2">
                            <Link to={`/XI/jobDetails/${job.job._id}`} target="_blank">
                              View Job Details{" "}
                            </Link>
                          </p>{" "}
                        </div>
                        <div className="flex items-center text-gray-800 space-x-2">
                          {/* <BsThreeDots className="text-md" /> */}
                          <p className="text-sm font-semibold py-1">
                            <Link to={`/XI`}>View Applicant Details</Link>
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
};

export default InterviewListCard;
