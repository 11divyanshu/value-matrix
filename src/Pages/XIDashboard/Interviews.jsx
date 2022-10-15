// import React from "react";
// import { slotDetailsOfXI, updateContactOTP ,updateSlot} from "../../service/api.js";
// import { Formik, Field, Form } from "formik";
// import Loader from "../../assets/images/loader.gif";
// import Avatar from "../../assets/images/UserAvatar.png";
// import { BsFillBookmarkFill } from "react-icons/bs";
// import {
//     HiOutlineUser, HiOutlineLocationMarker,
//     HiOutlineCurrencyDollar,
//     HiOutlineCalendar,
//     HiOutlinePlay,
// } from "react-icons/hi";
// import { Popover, Transition, Dialog } from "@headlessui/react";
// import { BsThreeDots, BsCashStack } from "react-icons/bs";
// import { CgWorkAlt } from "react-icons/cg";
// import { Fragment } from "react";

// import swal from "sweetalert";
// import { Link, Navigate, useNavigate } from "react-router-dom";
// import Moment from 'react-moment';

// const JobList = () => {
//     const [jobs, setJobs] = React.useState([]);
//     const [loader, setLoader] = React.useState(true);

//     const [user, setUser] = React.useState(null);
//     const [sendOTP, setsendOTP] = React.useState(null);
//     const [otpModal, setotpModal] = React.useState(null);
//     const [slotId, setslotId] = React.useState(null);


//     const [otp, setotp] = React.useState(null);
//     const [smsOTP, setsmsOTP] = React.useState("");
//     const handleOTP = (e) => {
//         setsmsOTP(e.target.value);
//     }


//     React.useEffect(() => {
//         const getData = async () => {
//             let user = JSON.parse(localStorage.getItem("user"));
//             setUser(user);
//             let res = await slotDetailsOfXI(user._id);
//             console.log(res)
//             if (res && res.data) {
//                 setJobs(res.data);
//                 setLoader(false);
//                 let arr = [...res.data];
//                 const jsonObj = JSON.stringify(arr);

//                 // save to localStorage
//                 localStorage.setItem("jobsdetails", jsonObj);
//             }
//         };
//         getData();
//     }, []);

//     return (
//         <div className="bg-slate-100">
//             <div
//                 className="flex mx-5 mt-3"
//                 style={{ justifyContent: "space-between" }}
//             >
//                 {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
//                 <p className="text-sm flex my-5 mx-5 font-semibold">
//                     Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
//                     <p className="text-gray-400 px-2"> here's what's happening today!</p>
//                 </p>
//             </div>
//             <div className="p-4 w-full md:flex mx-auto">
//                 <div className=" md:w-3/4 md:mx-5">
//                     {loader ? (
//                         <p className="text-center font-semibold my-4">...Loading</p>
//                     ) : (
//                         <>
//                             <div className="flex justify-between w-full bg-white">
//                                 <div
//                                     className="  py-4 px-5"
//                                     style={{ borderRadius: "6px 6px 0 0" }}
//                                 >
//                                     <p className="text-gray-900 w-full font-bold">Interviews</p>
//                                     {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
//                                 </div>

//                                 {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
//                             </div>
//                             {otpModal &&
//                                 <Transition
//                                     appear
//                                     show={otpModal}
//                                     as={Fragment}
//                                     className="relative z-10 w-full "
//                                     style={{ zIndex: 1000 }}
//                                 >
//                                     <Dialog
//                                         as="div"
//                                         className="relative z-10 w-5/6 "
//                                         onClose={() => { }}
//                                         static={true}
//                                     >
//                                         <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//                                         <Transition.Child
//                                             as={Fragment}
//                                             enter="ease-out duration-300"
//                                             enterFrom="opacity-0"
//                                             enterTo="opacity-100"
//                                             leave="ease-in duration-200"
//                                             leaveFrom="opacity-100"
//                                             leaveTo="opacity-0"
//                                         >
//                                             <div className="fixed inset-0 bg-black bg-opacity-25" />
//                                         </Transition.Child>

//                                         <div className="fixed inset-0 overflow-y-auto ">
//                                             <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
//                                                 <Transition.Child
//                                                     as={Fragment}
//                                                     enter="ease-out duration-300"
//                                                     enterFrom="opacity-0 scale-95"
//                                                     enterTo="opacity-100 scale-100"
//                                                     leave="ease-in duration-200"
//                                                     leaveFrom="opacity-100 scale-100"
//                                                     leaveTo="opacity-0 scale-95"
//                                                 >
//                                                     <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all h-[30vh]">

//                                                         <p>Enter OTP</p>
//                                                         <input
//                                                             type="number"
//                                                             name="smsOTP"
//                                                             onChange={handleOTP}
//                                                             placeholder="Email OTP"
//                                                             className="w-full"
//                                                             style={{ borderRadius: "12px", marginTop: "10px" }}
//                                                         ></input>
//                                                         <div className="flex my-3">
//                                                             <button
//                                                                 className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
//                                                                 style={{ backgroundColor: "#034488" }}
//                                                                 onClick={async() => {

//                                                                     console.log(smsOTP);
//                                                                     console.log(otp);

//                                                                     if (smsOTP == otp) {

//                                                                         let res = await updateSlot(slotId, { status:"Accepted"});

//                                                                         swal({
//                                                                             title: "Job Accepted Successfully !",
//                                                                             message: "Success",
//                                                                             icon: "success",
//                                                                             button: "Continue",
//                                                                         }).then((result) => {
//                                                                             //  handleJobInvitation(invitation, true);
//                                                                             setotpModal(false);
//                                                                             window.location.reload();
//                                                                         });
//                                                                     } else {
//                                                                         swal({
//                                                                             title: "Invalid OTP !",
//                                                                             message: "Error",
//                                                                             icon: "error",
//                                                                             button: "Continue",
//                                                                         })
//                                                                     }
//                                                                 }}>Submit</button>
//                                                             <button
//                                                                 className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
//                                                                 style={{ backgroundColor: "#034488" }} onClick={async () => {

//                                                                     let resend = await updateContactOTP({ contact: user.contact }, { access_token: user.access_token })
//                                                                     console.log(resend.otp)
//                                                                     setotp(resend.otp)
//                                                                 }}>Resend OTP</button>

//                                                             <button
//                                                                 className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
//                                                                 style={{ backgroundColor: "#034488" }} onClick={() => { setotpModal(false) }}>Cancel</button></div>
//                                                     </Dialog.Panel>
//                                                 </Transition.Child>
//                                             </div>
//                                         </div>
//                                     </Dialog>
//                                 </Transition>}

//                             <div className="w-full">
//                                 {jobs &&
//                                     jobs.map((job) => {
//                                         console.log(job)
//                                         return (
//                                             <div className="w-full px-5 bg-white py-1 my-2">
//                                                 <div className="grid grid-cols-1  items-center lg:grid-cols-6 relative py-3">
//                                                     <div className="px-5 my-2 text-md col-span-2 space-y-1">
//                                                         <p>
//                                                             Interview with
//                                                             <span className="font-semibold">
//                                                                 {" "}
//                                                                 {job.user[0].firstName} {job.user[0].lastname}
//                                                             </span>
//                                                         </p>
//                                                         <p>
//                                                             <span className="font-semibold">Job : </span> {job.job[0].jobTitle}
//                                                         </p>
//                                                         <p className="text-sm"><span className="font-semibold">Interview Id :</span>{job.interviewId}</p>
//                                                     </div>
//                                                     <div className="px-5 my-2 text-md">
//                                                         <p>   {new Date(job.startDate).getDate() +
//                                                             "-" +
//                                                             (new Date(job.startDate).getMonth() + 1) +
//                                                             "-" +
//                                                             new Date(job.startDate).getFullYear()}</p>
//                                                         <p className="text-gray-400 text-sm">Tuesday</p>
//                                                     </div>
//                                                     <div className="px-5 my-2 text-md">
//                                                         <p>{new Date(job.startDate).getHours() + ":" + new Date(job.startDate).getMinutes()} - {new Date(job.endDate).getHours() + ":" + new Date(job.endDate).getMinutes()}</p>
//                                                         <p className="text-red-400 text-xs">
//                                                             <Moment toNow>{new Date(job.startDate)}</Moment>
//                                                         </p>
//                                                     </div>
//                                                     <div className="flex space-x-3 items-center">
//                                                         <div className="px-5 text-center my-5 text-md">
//                                                             <span className="bg-gray-400 text-gray-800 text-xs font-medium mr-2 px-6 py-0.5 rounded-3xl my-2 py-2">
//                                                                 {job.status}
//                                                             </span>
//                                                         </div>
//                                                         {job.status == "Pending" ?
//                                                         <div className="px-5 text-center my-5 text-md">
//                                                             <button
//                                                                 style={{ background: "#3ED3C5" }}
//                                                                 onClick={async() => {
//                                                                     // handleJobInvitation(job, true);
//                                                                    setotpModal(true);
//                                                                    let resend = await updateContactOTP({ contact: user.contact }, { access_token: user.access_token })
//                                                                    console.log(resend.otp)
//                                                                    setotp(resend.otp)
//                                                                    setslotId(job._id);
//                                                                 }}
//                                                                 className="btn  rounded-3xl shadow-sm px-6 my-3 py-2 text-xs text-gray-900 font-semibold"
//                                                             >
//                                                                 Accept{" "}
//                                                             </button>
//                                                         </div>: null}
                                                        
//                                                         </div>

//                                                     <div className="px-4 mx-2 py-4 align-middle absolute -right-2 top-6">
//                                                         <Popover className="relative mt-1">
//                                                             {({ open }) => (
//                                                                 <>
//                                                                     <Popover.Button
//                                                                         className={`
//                               ${open ? "" : "text-opacity-90"} focus:outline-0`}
//                                                                     >


//                                                                         <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
//                                                                     </Popover.Button>
//                                                                     <Transition
//                                                                         as={Fragment}
//                                                                         enter="transition ease-out duration-200"
//                                                                         enterFrom="opacity-0 translate-y-1"
//                                                                         enterTo="opacity-100 translate-y-0"
//                                                                         leave="transition ease-in duration-150"
//                                                                         leaveFrom="opacity-100 translate-y-0"
//                                                                         leaveTo="opacity-0 translate-y-1"
//                                                                     >
//                                                                         <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
//                                                                             <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
//                                                                                 <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
//                                                                                     <div className="flex items-center border-b text-gray-800 space-x-2">
//                                                                                         {/* <BsThreeDots className="text-md" /> */}
//                                                                                         <p className="text-sm font-semibold py-2">
//                                                                                             <Link to={`/XI/jobDetails/${job.job._id}`} target="_blank">
//                                                                                                 View Job Details{" "}
//                                                                                             </Link>
//                                                                                         </p>{" "}
//                                                                                     </div>
//                                                                                     <div className="flex items-center text-gray-800 space-x-2">
//                                                                                         {/* <BsThreeDots className="text-md" /> */}
//                                                                                         <p className="text-sm font-semibold py-1">
//                                                                                             <Link to={`/XI`}>View Applicant Details</Link>
//                                                                                         </p>{" "}
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </div>
//                                                                         </Popover.Panel>
//                                                                     </Transition>
//                                                                 </>
//                                                             )}
//                                                         </Popover>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         );
//                                     })}
//                                 {jobs && jobs.length === 0 && (
//                                     <p className="text-center font-semibold my-5">No Interviews Schduled</p>
//                                 )}
//                             </div>
//                         </>
//                     )}
//                 </div>

//                 <div className="md:w-1/4 my-3">
//                     <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
//                         <p className="text-xl mx-auto text-gray-700 font-bold  flex">
//                             <p className="p-1">
//                                 <BsFillBookmarkFill />
//                             </p>
//                             <p className=" mx-2  text-sm ">My Items</p>
//                         </p>
//                         <div className="border-b border-gray-600 flex justify-between my-4 py-4">
//                             <p className="font-bold text-xs">Posted Jobs</p>
//                             <p className="text-gray-400 font-semibold text-xs"> {jobs.length > 0 ? jobs.length : 0}</p>
//                         </div>
//                         <div className="border-b border-gray-600 flex justify-between my-4 py-4">
//                             <p className="font-bold text-xs">My Learnings</p>
//                             <p className="text-gray-400 font-semibold text-xs">06</p>
//                         </div>
//                         <div className=" border-gray-600 flex justify-between mt-4 pt-4">
//                             <p className="font-bold text-xs">Save Posts</p>
//                             <p className="text-gray-400 font-semibold text-xs">01</p>
//                         </div>
//                     </div>

//                     <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
//                         <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
//                             {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

//                             <p className=" mx-2  text-sm ">Support</p>
//                             <p className="">
//                                 <HiOutlineUser />
//                             </p>
//                         </p>

//                         <div className="flex justify-between text-xs py-4 px-3">
//                             <div>
//                                 <p>Open 0/5</p>
//                             </div>
//                             <div>
//                                 <p>Working 0/5</p>
//                             </div>
//                             <div>
//                                 <p>Closed 0/5</p>
//                             </div>
//                         </div>
//                         <div className="flex px-2 vertical-align-middle">
//                             <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
//                             <div>
//                                 {" "}
//                                 <p className="py-2 text-sm">Cameron Williamson</p>
//                                 <p className="text-gray-400 text-xs">Product Designer</p>
//                             </div>
//                         </div>

//                         <div className="flex px-2 vertical-align-middle">
//                             <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
//                             <div>
//                                 {" "}
//                                 <p className="py-2 text-sm">Brookyln Simmons</p>
//                                 <p className="text-gray-400 text-xs">Software Engineer</p>
//                             </div>
//                         </div>

//                         <div className="flex px-2 vertical-align-middle">
//                             <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
//                             <div>
//                                 {" "}
//                                 <p className="py-2 text-sm">Leslie Alexander</p>
//                                 <p className="text-gray-400 text-xs">Project Manager</p>
//                             </div>
//                         </div>

//                         {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default JobList;