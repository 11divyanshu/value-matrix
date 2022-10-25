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
import { Dialog, Menu } from "@headlessui/react";

import { Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";

const JobCard = (props) => {
  const [job, setJob] = React.useState(props.job);
  const [index, setIndex] = React.useState(props.index);
  const [user, setUser] = React.useState(null);
  const [chooseStatus, setchooseStatus] = React.useState(null);

  console.log(props.job);
  // localStorage.setItem("jobs", JSON.stringify(job))

  React.useState(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  localStorage.setItem("ids", JSON.stringify(job._id));
  return (
    // <div className="flex my-2 w-full">
    //   <div className="block rounded-md p-3 my-2 shadow-md border-[0.5px] border-gray-300 bg-white w-full">

    //     <div className="p-6">
    //       <h5 className="text-black-900 text-2xl font-bold mb-2">{job.jobTitle}</h5>
    //       <p className="text-xl font-bold  text-blue-500">{job.hiringOrganization}</p>
    //       <div className="md:flex mt-5 px-3">
    //         {job.salary && (
    //           <div className="flex px-3">
    //           <p className="">
    //             <div className="shadow-md p-3 rounded-full"><p className="text-2xl text-blue-500"><HiOutlineCalendar/></p></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-gray-400 text-md text-gray-400">Job Type</p>
    //             <p className="px-4 text-md">{job.jobType}</p>
    //             </div>
    //             </div>

    //         )}

    //         {/* <p className="text-sm text-gray-700 mx-auto">
    //           {job.jobType}
    //         </p> */}
    //         <div className="flex flex-wrap px-3">
    //         <p className="text-sm">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineCurrencyDollar/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Pay Range</p>
    //             <p className="px-4 text-md">{job.salary}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineLocationMarker/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Location</p>
    //             <p className="px-4 text-md">{job.location}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlinePlay/></div></div>

    //             </p>
    //             <div>
    //             <p className="px-4 text-md text-gray-400 ">Apply Till</p>
    //             <p className="px-4 text-md">{new Date(job.validTill).getDate() +
    //             "-" +
    //            ( new Date(job.validTill).getMonth()+1) +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}</p>
    //             </div>
    //         </div>

    //       </div>
    //       {/* <p className="text-gray-700 text-base">{job.jobDesc}</p> */}
    //     </div>
    //     <div className="py-3 border-t border-gray-300 items-center flex ">
    //       {/* <FaBuilding className="text-gray-500 mr-2" /> */}

    //       <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
    //     </div>
    //   </div>
    // </div>

    <div
      id={"crd" + (index + 1)}
      className={
        index < 5
          ? "w-full px-5 bg-white py-1 border border-b"
          : "w-full px-5 bg-white py-1 border border-b hidden"
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
        <div className="col-span-2">
          <h5 className="text-black-900 text-md font-bold mb-1 ">
            {job.jobTitle}
          </h5>
          <p className="text-sm font-bold  text-gray-400 font-semibold">
            {job.hiringOrganization}
          </p>
        </div>
        <div className="col-span-2">
          {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <CgWorkAlt />
            </div>

            <p className="px-4 text-sm text-gray-400 font-semibold">
              {job.jobType}
            </p>
          </div>
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <HiOutlineLocationMarker />
            </div>

            <p className="px-4 text-sm text-gray-400 font-semibold">
              {job.location}
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <HiOutlineCalendar />
            </div>

            <p className="px-2 text-md text-gray-400 font-semibold">
              {new Date(job.validTill).getDate() +
                "-" +
                (new Date(job.validTill).getMonth() + 1) +
                "-" +
                new Date(job.validTill).getFullYear()}
            </p>
          </div>
          <div className="flex py-1">
            <div className="text-md py-1 text-gray-400 font-semibold ">
              <BsCashStack />
            </div>

            {job.salary && job.salary.length >= 2 && (
              <p className="px-4 text-md text-gray-400 font-semibold">
                {job.salary[0].symbol} {job.salary[1]}{" "}
                {job.salary.length === 3 && <span>- {job.salary[2]}</span>}
              </p>
            )}
          </div>
        </div>
        <div className="flex col-span-2">
          {job.archived ? (
            <button
              // style={{ background: "#3ED3C5" }}
              className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
            >
              Archived{" "}
            </button>
          ) : new Date().toISOString() < job.validTill ? (
            <button
              style={{ background: "#3ED3C5" }}
              className="  rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
            >
              Active{" "}
            </button>
          ) : (
            <button
              // style={{ background: "#3ED3C5" }}
              className=" bg-white border border-gray-400 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"       
            >
              Ended{" "}
            </button>
          )}

          <Menu as="div" className="relative inline-block mx-3 text-left">
            <div>
              <Menu.Button className="flex bg-yellow-300 rounded-3xl mx-2 py-2 my-3 text-xs text-gray-900 font-semibold">
                Status
                <ChevronDownIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute -mt-3 z-10 w-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="text-left">
                  <Menu.Item>
                    <button
                      // style={{background: "#3ED3C5" }}
                      className="rounded-3xl px-4 my-2 text-sm text-gray-900 font-semibold"
                      onClick={() => {
                        setchooseStatus(true);
                      }}
                    >
                      Archived{" "}
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      // style={{ background: "#3ED3C5" }}
                      className="  rounded-3xl px-4 my-2 text-sm text-gray-900 font-semibold"
                      onClick={() => {
                        setchooseStatus(true);
                      }}
                    >
                      Active{" "}
                    </button>
                  </Menu.Item>
                  <Menu.Item>
                    <button
                      // style={{ background: "#3ED3C5" }}
                      className="  rounded-3xl px-4 my-2 text-sm text-gray-900 font-semibold"
                      onClick={() => {
                        setchooseStatus(true);
                      }}
                    >
                      Ended{" "}
                    </button>
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {chooseStatus && (
            <Transition
              appear
              show={chooseStatus}
              as={Fragment}
              className="relative z-10 w-full "
              style={{ zIndex: 1000 }}
            >
              <Dialog
                as="div"
                className="relative z-10 w-5/6 "
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
                  <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Dialog.Panel className="w-auto pb-5 transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all">
                        <div className="rounded-lg bg-white w-full">
                          <div className="flex items-start space-x-3 	">
                            {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                            <div className="py-5 w-full bg-blue-900 flex">
                              <p className="text-lg mx-5 text-center text-white font-semibold">
                                Change Status
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-3 	">
                            {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                            <div className="py-5 w-full flex">
                              <p className="text-lg mx-5 text-center text-black font-semibold">
                                Do you want to change status
                              </p>
                            </div>
                          </div>
                          
                          <div className="w-auto mx-auto flex justify-center">
                            <button
                              className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                              style={{ backgroundColor: "#034488" }}
                            >
                              Confirm
                            </button>
                            <button
                              className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                              onClick={() => {
                                setchooseStatus(false);
                              }}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition>
          )}

          <div className=" mr-2 py-4 align-middle">
            {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
            <Popover className="relative mt-1">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                  >
                    {/* <div className="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10" style={{backgroundColor:"#034488"}}></div> */}

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
                              <Link to={`/company/jobDetails/${job._id}`}>
                                View Details{" "}
                              </Link>
                            </p>{" "}
                          </div>
                          <div className="flex items-center text-gray-800 space-x-2">
                            {/* <BsThreeDots className="text-md" /> */}
                            <p className="text-sm font-semibold py-1">
                              <Link to={`/company/jobUpdate/${job._id}`}>
                                Edit{" "}
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

            {/* <button id="dropdownLeftButton" data-dropdown-toggle="dropdownLeft" data-dropdown-placement="left" className="mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
>>>>>>> c827bec0fca0f186c865ab6e43be363b58eedecf
    
    
    <svg className="mr-2 w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></button>


<div id="dropdownLeft" className="hidden z-20 w-44 bg-white rounded absolute divide-y divide-gray-100 shadow dark:bg-gray-700">
    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLeftButton">
      <li>
        <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
      </li>
      
    </ul>
</div> */}

            {/* <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
