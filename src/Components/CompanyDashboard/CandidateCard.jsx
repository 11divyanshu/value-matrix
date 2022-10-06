// import React from "react";
// import { FaBuilding } from "react-icons/fa";
// import {
//   HiOutlineLocationMarker,
//   HiOutlineCurrencyDollar,
//   HiOutlineCalendar,
//   HiOutlinePlay,
// } from "react-icons/hi";
// import { Link, useNavigate } from "react-router-dom";
// import { BsThreeDots, BsCashStack } from "react-icons/bs";
// import { CgWorkAlt } from "react-icons/cg";
// import { Fragment } from "react";

// import { Popover, Transition } from "@headlessui/react";

// const JobCard = (props) => {
//   const [job, setJob] = React.useState(props.job);
//   const [user, setUser] = React.useState(null);
//   console.log(props.job);
//   // localStorage.setItem("jobs", JSON.stringify(job))

//   React.useState(() => {
//     setUser(JSON.parse(localStorage.getItem("user")));
//   }, []);

//   localStorage.setItem("ids", JSON.stringify(job._id));
//   return (
  
//     <div className="w-full px-5 bg-white py-1 border border-b">
//       <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
//         <div className="col-span-2">
//           <h5 className="text-black-900 text-md font-bold mb-1 ">{job.firstName}{" "}{job.lastName}</h5>
         
//         </div>
//         <div className="col-span-2">
//           <div className="flex py-1">
//             <div className="text-md py-1 text-gray-400 font-semibold ">
//               <CgWorkAlt />
//             </div>

//             <p className="px-4 text-sm text-gray-400 font-semibold">
//             {job.email}
//             </p>
//           </div>
        
//         </div>
//         <div className="col-span-2">
//           <div className="flex py-1">
//             <div className="text-md py-1 text-gray-400 font-semibold ">
//               <HiOutlineCalendar />
//             </div>

//             <p className="px-2 text-md text-gray-400 font-semibold">
//             {job.phoneNo}

//             </p>
//           </div>
         
//         </div>
//         <div className="flex col-span-2">
          
       
         

//           <div className="px-4 mx-2 py-4 align-middle">
//             {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
//             <Popover className="relative mt-1">
//               {({ open }) => (
//                 <>
//                   <Popover.Button
//                     className={`
//             ${open ? "" : "text-opacity-90"} focus:outline-0`}
//                   >

//                     <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
//                   </Popover.Button>
//                   <Transition
//                     as={Fragment}
//                     enter="transition ease-out duration-200"
//                     enterFrom="opacity-0 translate-y-1"
//                     enterTo="opacity-100 translate-y-0"
//                     leave="transition ease-in duration-150"
//                     leaveFrom="opacity-100 translate-y-0"
//                     leaveTo="opacity-0 translate-y-1"
//                   >
//                     <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
//                       <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
//                         <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
//                           <div className="flex items-center border-b text-gray-800 space-x-2">
//                             {/* <BsThreeDots className="text-md" /> */}
//                             <p className="text-sm font-semibold py-2">
//                               <Link to={`/company/candidateDetails/${job._id}`}>
//                                 View Details{" "}
//                               </Link>
//                             </p>{" "}
//                           </div>
//                           <div className="flex items-center text-gray-800 space-x-2" onClick={()=>{

// let res = deleteCandidate(job._id);


//                           }}>
//                             {/* <BsThreeDots className="text-md" /> */}
//                             <p className="text-sm font-semibold py-1">
//                               {/* <Link to={`/company/jobUpdate/${job._id}`}> */}
//                                 Delete{" "}
//                               {/* </Link> */}
//                             </p>{" "}
//                           </div>
//                         </div>
//                       </div>
//                     </Popover.Panel>
//                   </Transition>
//                 </>
//               )}
//             </Popover>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JobCard;
