import React from "react";
import {
  getJobInvitations,
  handleCandidateJobInvitation,
} from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from 'react-icons/bs'
import { HiOutlineUser } from 'react-icons/hi'
import swal from "sweetalert";
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
import Loader from "../../assets/images/loader.gif";

import { Popover, Transition } from "@headlessui/react";

const JobInvitations = () => {
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [Loading, setLoading] = React.useState(true);
  const [Error, setError] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );

      if (res && res.status === 200) {
        setJobInvitation(res.data.jobInvites);
        setLoading(false);
      }
    };
    initial();
  }, []);

  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await handleCandidateJobInvitation(
        { job_id: job._id, user_id: user._id, accept: accept },
        user.access_token
      );
      if (res && res.status === 200) {
        let d = JobInvitation.filter((el) => {
          return el !== job;
        });
        await setJobInvitation(d);
        await setJobInvitation(d);
        swal({
          title: "Success",
          text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
          icon: "success",
          button: "Ok",
        });
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    } catch (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
  };

  return (
    <div className="bg-slate-100">
    <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}>
      {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
      <p className="text-sm flex my-5 mx-5 font-semibold">Hey Andrew - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>

  
    </div>
    <div className="p-4 w-full md:flex mx-auto" >


       
        {!Loading && JobInvitation.length === 0 && (
          <div className="text-center py-5 text-2xl">
            No Interview Invitations
          </div>
        )}


{!Loading && JobInvitation.length > 0 ? (
  <div className=" md:w-3/4 md:mx-5">
  <div className="justify-between w-full bg-white" style={{ borderRadius: "6px 6px 0 0" }}>
                  <div className="  py-4 px-5" ><p className="text-gray-900 w-full font-bold">Posted Jobs</p>
                    {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                  </div>
  
                </div>
  
                <div className="w-full">
              {JobInvitation.map((job, index) => {
                return (
                  <div className="w-full px-5 bg-white py-1 border border-b">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 my-3">
                    <div className="col-span-2">
                      <h5 class="text-black-900 text-md font-bold mb-1 ">{job.jobTitle}</h5>
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
            
                        <p className="px-4 text-sm text-gray-400 font-semibold">
                          {job.salary}
                        </p>
                      </div>
                    </div>
                    <div className="flex col-span-2">
                     
                      
                        
                         <button
                          style={{ background: "#3ED3C5" }}
                          onClick={() => {
                                     handleJobInvitation(job, true);
                                   }}
                          className="btn  rounded-3xl shadow-sm px-6 my-3 text-xs text-gray-900 font-semibold"
                        >Accept </button>
                        
                      
                      
                     
                      <div className="px-4 mx-2 py-4 align-middle">
                        {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
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
                              <div className="flex items-center border-b text-gray-800 space-x-2" onClick={() => {
                           handleJobInvitation(job, false);
                         }} >
                                <p className="text-sm font-semibold py-2">Decline</p>{" "}
                               
                              </div>
                              <div className="flex items-center text-gray-800 space-x-2">
                                <p className="text-sm font-semibold py-1"><Link to={`/user/jobDetails/${job._id}`}>View Details </Link></p>{" "}
                               
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
                </div>

                  // <div className=" p-3 px-5 w-full mx-auto text-md shadow-md my-3" style={{backgroundColor:"#F2F3F5"}}>
                  //   <div className="flex items-baseline">
                  //     <p className="font-semibold mr-2">{job.jobTitle}</p>
                  //     <p>|</p>
                  //     <p className="mr-auto ml-2">{job.hiringOrganization}</p>
                  //   </div>

                  //   {job.jobDesc && (
                  //     <p
                  //       className="py-2"
                  //       dangerouslySetInnerHTML={{ __html: job.jobDesc }}
                  //     ></p>
                  //   )}
                  //   <div className="my-3 flex space-x-2">
                  //     <a
                  //       href={`/user/jobDetails/${job._id}`}
                  //       target="_blank"
                  //       rel="noreferrer"
                  //     >
                  //       <button className="px-2 py-1 text-white rounded-sm text-sm" style={{ background: "#034488" }}>
                  //         View Details
                  //       </button>
                  //     </a>
                  //     <button
                  //       className=" px-2 py-1 text-white rounded-sm text-sm"
                  //       onClick={() => {
                  //         handleJobInvitation(job, true);
                  //       }}
                  //       style={{ background: "#034488" }}
                  //     >
                  //       Accept
                  //     </button>
                  //     <button
                  //       className="border-[0.5px] border-gray-500 text-gray-500 px-2 py-1 rounded-sm text-sm"
                  //      
                        
                  //     >
                  //       Decline
                  //     </button>
                  //   </div>
                  // </div>


                );
              })}
            </div>
          </div>
        ) : 
          (<div className="text-center w-full py-5 text-2xl"><img src={Loader} alt="loader" className="h-24 mx-auto" /></div>)
          }

<div className="md:w-1/4 ">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1"><BsFillBookmarkFill /></p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">All Jobs</p><p className="text-gray-400 font-semibold text-xs">04</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p><p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p><p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">

              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}


              <p className=" mx-2  text-sm ">Support</p><p className=""><HiOutlineUser /></p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div><p>Open 0/5</p></div>
              <div><p>Working 0/5</p></div>
              <div><p>Closed 0/5</p></div>
            </div>
            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>


            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Leslie Alexander</p>
                <p className="text-gray-400 text-xs">Project Manager</p>
              </div>
            </div>





            {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}


          </div>

        </div>
       
      </div>
    </div>
  );
};

export default JobInvitations;
