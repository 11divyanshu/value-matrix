import React, { useRef, useState } from "react";
import {
  availableSlots,
  bookSlot,
  findCandidateByEmail,
  getJobInvitations,
  handleCandidateJobInvitation,
  updateContactOTP,
  updateSlot,
  updateInterviewApplication,
  updateUserDetails,
  getUserFromId,
  handleXIInterview,
  priorityEngine,
  userRequestUpdate,
  createTaskScheduler
} from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import swal from "sweetalert";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Loader from "../../assets/images/loader.gif";
import Moment from 'react-moment';

import { Fragment } from "react";
import { Popover, Transition, Dialog } from "@headlessui/react";
import DatePicker from 'react-date-picker';

const JobInvitations = (props) => {
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [Loading, setLoading] = React.useState(true);
  const [xiInter, setxiInter] = React.useState(false);
  const [Error, setError] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [chooseSlot, setchooseSlot] = React.useState(null);
  const [slot, setSlot] = React.useState([]);
  const [invitation, setInvitation] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);
  const [otp, setotp] = React.useState(null);
  const [otpModal, setotpModal] = React.useState(null);
  const [slotId, setslotId] = React.useState(null);
  const [startTime, setStartTime] = React.useState(new Date());
  const [smsOTP, setsmsOTP] = React.useState("");
  const [page, setPage] = useState(1);
  const [slotCompare, setSlotCompare] = useState({});
  const [index, setIndex] = React.useState(props.index);
  const [type, setType] = React.useState(null);

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= JobInvitation.length; i++) {
      document.getElementById("invcrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("invcrd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  const handleOTP = (e) => {
    setsmsOTP(e.target.value);
  }


  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let user1 = await getUserFromId({ id: user._id }, user.access_token);
      setUser(user1.data.user);
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );
      console.log(user)
      if (res && res.status === 200) {
        setJobInvitation(res.data.jobInvites);
        setLoading(false);
      }
      let candidate = await findCandidateByEmail(user.email);
      console.log(candidate);

      setCandidate(candidate.data[0])


    };
    initial();
  }, []);


  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await localStorage.getItem("user"));
      let interviewer = [];
      interviewer.push(slotId.createdBy);
      let res = await handleCandidateJobInvitation(
        { job_id: job._id, user_id: user._id, accept: accept, interviewers: interviewer },
        user.access_token
      );
      console.log(res)
      if (res && res.status === 200) {

        let res1 = await updateSlot(slotId._id, { interviewId: res.data.data._id });


        let date = new Date();
        date = new Date(date.getTime() + 1800000);
        let res2 = await createTaskScheduler({ applicantId: user._id, interviewerId: slotId.createdBy, nextTime: date, priority: slotId.priority , slotId: slotId._id ,interviewId :  res.data.data._id ,startDate : slotId.startDate })

       console.log(res2)

       
        console.log(res1);
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

        setslotId(null);
        setotpModal(false);
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
      <div
        className="flex mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey  {user && user.firstName ? user.firstName : "User"}  -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
        {/* {!Loading && JobInvitation.length === 0 && (
          <div className="text-center py-5 text-2xl md:w-3/4">
            No Interview Invitations
          </div>
        )} */}
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
                          Enter OTP
                        </p>
                      </div>

                      <div className="my-16 w-full">
                        <h2 className="mx-auto w-fit">OTP sent to {user.contact} </h2>
                      </div>

                      <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-56"></div>
                      <div className="mx-56 my-5">
                        <h3>Enter OTP</h3>
                        <input
                          id="smsOTP"
                          type="number"
                          name="smsOTP"
                          onChange={handleOTP}
                          placeholder="Enter OTP"
                          className="w-full"
                          style={{ borderRadius: "12px", marginTop: "10px" }}
                        ></input>
                      </div>

                      <div className="w-full my-16 flex justify-center">
                        <button
                          className="border-2 text-black font-bold py-3 px-8 w-fit md:mx-4 text-xs rounded"
                          onClick={async () => {

                            let resend = await updateContactOTP({ contact: user.contact }, { access_token: user.access_token })
                            console.log(resend.otp)
                            setotp(resend.otp)
                          }}>Resend OTP</button>
                      </div>

                      <div className="flex my-16 justify-center">
                        <button
                          className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                          style={{ backgroundColor: "#034488" }}
                          onClick={async () => {

                            console.log(smsOTP);
                            console.log(otp);

                            if (smsOTP == otp) {
                              let res = await updateSlot(slotId._id, { userId: user._id, status: "Pending" });

                              if (slotId.slotType == "SuperXI") {
                                let res = await updateUserDetails(
                                  { user_id: user._id, updates: { status: "Applied" } },
                                  { access_token: user.access_token }
                                );
                                let res1 = await handleXIInterview(
                                  { slotId: slotId._id, interviewer: slotId.createdBy, applicant: user._id, status: "Pending" },
                                  user.access_token
                                ); window.location.reload();
                              

                                setslotId(null);
                                setotpModal(false);
                              } else {



                              

                             
                                handleJobInvitation(invitation, true);
                                if (res.status == 200) {
                                  console.log(invitation);



                               
                                  setotpModal(false);

                                }
                              }
                            } else {
                              swal({
                                title: "Invalid OTP !",
                                message: "Error",
                                icon: "error",
                                button: "Continue",
                              })
                            }
                          }}>Submit</button>


                        <button
                          className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                          style={{ backgroundColor: "#034488" }} onClick={() => { setotpModal(false) }}>Cancel</button></div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>}

        {chooseSlot &&
          <Transition
            appear
            show={chooseSlot}
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
                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-[65vh]">
                      <div className="rounded-lg bg-white w-full">
                        <div className="flex items-start space-x-3 	">
                          {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                          <div className='py-5 w-full bg-blue-900 flex'>
                            <p className="text-lg mx-5 text-center text-white font-semibold">
                              Meeting
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 mx-16 my-5">
                          {/* <div className="w-auto">Image</div> */}
                          <div className="w-auto">
                            <h2 className="font-semibold">{xiInter ? "Upgrade To XI" : invitation.hiringOrganization}</h2>
                            <p className="text-xs">{xiInter ? "" : invitation.jobTitle}</p>
                          </div>
                        </div>

                        <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-16"></div>

                        {/* <div className="w-auto mx-16 my-5">
                          <p className="my-2 text-sm">Subject</p>
                          <div className="w-auto">
                            <input type="text" className="w-full rounded-lg border-black" />
                          </div>
                        </div> */}

                        <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-16"></div>

                        <div className="flex items-start space-x-3 	">
                          {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                          <div className='py-1 my-5 mx-16 flex'>
                            <p className="text-sm text-center font-semibold">
                              <DatePicker onChange={setStartTime} value={startTime} disableClock />
                            </p>
                          </div>
                        </div>
                        <div className="mx-16">

                          <div className='mx-2'>
                            <label>
                              <Moment format="D MMM YYYY" withTitle>
                                {new Date(startTime)}
                              </Moment></label>
                            <br />
                            <div className='flex my-2 '>

                              {slot && slot.map((item, index) => {

                                if (new Date(item.startDate).getDate() === new Date(startTime).getDate()) {
                                  return (
                                    <span className={`${slotId && (slotId._id === item._id) ? "bg-blue text-white-600" : "bg-white text-gray-600"} border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer`}
                                      onClick={async () => {
                                        console.log(item);
                                        let priority = await priorityEngine(item.startDate, type);
                                        console.log(priority)
                                        if (priority.status == 200) {


                                          let max = 0;
                                          // for (let i = 0; i < priority.data.slot.length; i++) {
                                          //   if (priority.data.slot[i].priority >= max) {
                                          //     max = priority.data.slot[i].priority;
                                          //     setSlotCompare(priority.data.slot[i]);
                                          //   }
                                          // }
                                          // console.log(slotCompare)
                                          let res = await bookSlot({ candidate_id: candidate.candidate_id, slotId: priority.data.slot._id });
                                          console.log(res)

                                          if (res.status === 200) {

                                            if (xiInter) {

                                              let userRequestUpdate = await userRequestUpdate(user._id);
                                            }
                                            setchooseSlot(false);
                                            setotpModal(true);
                                            setotp(res.data.OTP)
                                            setxiInter(false);


                                            setslotId(slotCompare);
                                          }
                                        }
                                      }}

                                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                                  )
                                }

                              })}
                            </div>
                          </div>
                        </div>
                        <div className="w-auto mx-auto flex justify-center">
                          {/* <button
                            className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                            style={{ backgroundColor: "#034488" }}
                          >
                            Confirm
                          </button> */}
                          <button
                            className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                            onClick={() => {
                              setchooseSlot(false)
                              setxiInter(false);

                            }}>Decline
                          </button>
                        </div>
                        {/* <div className="my-3">

                          <div className='mx-2  my-4'>
                            <label>  <Moment format="D MMM YYYY" withTitle>
                              {new Date()}
                            </Moment></label>
                            <br />
                            <div className='flex my-2 '>

                              {slot && slot.map((item, index) => {

                                if (new Date(item.startDate).getDate() === new Date().getDate()) {
                                  return (
                                    <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"
                                      onClick={async () => {
                                        let res = await bookSlot({ candidate_id: candidate.candidate_id, slotId: item._id });
                                        console.log(res)
                                        if (res.status === 200) {
                                          setchooseSlot(false);
                                          setotpModal(true);
                                          setotp(res.data.otp)
                                        }
                                      }}

                                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                                  )
                                }

                              })}
                            </div>
                          
                          <button
                            className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                            style={{ backgroundColor: "#034488" }} onClick={() => { navigate("/user/allslots") }}>View More</button>


                        </div>
                      </div> */}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>}

        {/* {!Loading && JobInvitation.length > 0&& ( */}
        <div className=" md:w-3/4 md:mx-5">
          <div
            className="justify-between w-full bg-white"
            style={{ borderRadius: "6px 6px 0 0" }}
          >
            <div className="  py-4 px-5">
              <p className="text-gray-900 w-full font-bold">Candidate Interview Invitations</p>
              {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
            </div>
          </div>
          {!Loading && user.status !== "Forwarded" && JobInvitation.length === 0 ?
            (
              <div className="text-center py-5 text-2xl md:w-4/4">
                No Interview Invitations
              </div>
            ) : (
              <div className="w-full">{user && user.status == "Forwarded" && (
                <div className={"w-full px-5 bg-white py-1 border border-b"}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                    <div className="col-span-6">
                      <h5 className="text-black-900 text-md font-bold mb-1 ">Upgrade to XI</h5>

                    </div>
                    {/* <div className="col-span-2">
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
                    </div> */}
                    {/* <div className="col-span-2">
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
                              {typeof (job.salary) === "object" ? job.salary[2] : job.salary}
                            </p>
                      </div>
                    </div> */}
                    <div className="flex col-span-2">



                      <button
                        style={{ background: "#3ED3C5" }}
                        onClick={async () => {
                          //handleJobInvitation(job, true);

                          let slots = await availableSlots(user._id, "SuperXI");
                          const key = 'startDate';

                          const arrayUniqueByKey = [...new Map(slots.data.map(item =>
                            [item[key], item])).values()];

                          setType("SuperXI");
                          setSlot(arrayUniqueByKey);
                          setchooseSlot(true);
                          setxiInter(true);
                        }}
                        className="btn  rounded-3xl shadow-sm px-6 my-1 py-2 mr-3 text-xs text-gray-900 font-semibold"
                      >
                        Accept{" "}
                      </button>
                      <button
                        style={{ background: "#fff" }}
                        onClick={async () => {
                          let res = await updateUserDetails(
                            { user_id: user._id, updates: { status: "Pending" } },
                            { access_token: user.access_token }
                          );
                          setxiInter(false);

                          //handleJobInvitation(job, false);
                        }}
                        className="bg-white border border-gray-500  rounded-3xl px-6 mx-2 my-2  py-2 text-xs text-gray"                      >
                        Decline{" "}
                      </button>

                      {/* <div className="px-4 mx-2 py-4 align-middle">
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
                                        onClick={async() => {
                                          let res = await updateUserDetails(
                                            { user_id: user._id, updates: {status:"Pending"} },
                                            { access_token: user.access_token }
                                          );
                                           //handleJobInvitation(job, false);
                                        }}
                                      >
                                        <p className="text-sm font-semibold py-2">
                                          Decline
                                        </p>{" "}
                                      </div>

                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}
                {JobInvitation.map((job, index) => {
                  if (job.status && job.status === "Active") {
                    return (
                      <div id={"invcrd" + (index + 1)} className={index < 5 ? "w-full px-5 bg-white py-1 border border-b" : "w-full px-5 bg-white py-1 border border-b hidden"}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                          <div className="col-span-2">
                            <h5 className="text-black-900 text-md font-bold mb-1 ">{job.jobTitle}</h5>
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
                                {typeof (job.salary) === "object" ? job.salary[2] : job.salary}
                              </p>
                            </div>
                          </div>
                          <div className="flex col-span-2">



                            <button
                              style={{ background: "#3ED3C5" }}
                              onClick={async () => {
                                //handleJobInvitation(job, true);
                                let slots = await availableSlots(user._id, "XI");
                                console.log(slots.data);


                                const key = 'startDate';

                                const arrayUniqueByKey = [...new Map(slots.data.map(item =>
                                  [item[key], item])).values()];



                                console.log(arrayUniqueByKey)
                                setType("XI")

                                setSlot(arrayUniqueByKey);
                                setInvitation(job)
                                setchooseSlot(true);
                              }}
                              className="btn  rounded-3xl shadow-sm px-6 my-3 text-xs text-gray-900 font-semibold"
                            >
                              Accept{" "}
                            </button>

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
                                            <div
                                              className="flex items-center border-b text-gray-800 space-x-2"
                                              onClick={() => {
                                                handleJobInvitation(job, false);
                                              }}
                                            >
                                              <p className="text-sm font-semibold py-2">
                                                Decline
                                              </p>{" "}
                                            </div>
                                            <div className="flex items-center text-gray-800 space-x-2">
                                              <p className="text-sm font-semibold py-1">
                                                <Link
                                                  to={`/user/jobDetails/${job._id}`}
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
                      </div>

                    );
                  }
                })}
              </div>)}
          <div className="w-full">
            <div className="flex justify-between my-2 mx-1">
              {
                Math.ceil(JobInvitation.length / 5) ? (
                  <div>
                    Page {page} of {Math.ceil(JobInvitation.length / 5)}
                  </div>
                ) : null
              }
              <div>
                {" "}
                {JobInvitation &&
                  JobInvitation.map((job, index) => {
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
        {/* ) } */}

        <div className="md:w-1/4">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">All Jobs</p>
              <p className="text-gray-400 font-semibold text-xs">04</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p>
              <p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p>
              <p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

              <p className=" mx-2  text-sm ">Support</p>
              <p className="">
                <HiOutlineUser />
              </p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div>
                <p>Open 0/5</p>
              </div>
              <div>
                <p>Working 0/5</p>
              </div>
              <div>
                <p>Closed 0/5</p>
              </div>
            </div>
            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Leslie Alexander</p>
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
