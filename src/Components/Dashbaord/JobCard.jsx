import React from "react";
import { FaBuilding} from "react-icons/fa";
import { HiOutlineLocationMarker,HiOutlineCurrencyDollar,HiOutlineCalendar,HiOutlinePlay} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots ,BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";


const JobCard = (props) => {
 
  const [job, setJob] = React.useState(props.job);
  console.log(props.job)
  // localStorage.setItem("jobs", JSON.stringify(job))

  localStorage.setItem("ids", JSON.stringify(job._id))
  return (
    // <div class="flex my-2 w-full">
    //   <div class="block rounded-md p-3 my-2 shadow-md border-[0.5px] border-gray-300 bg-white w-full">
       
    //     <div class="p-6">
    //       <h5 class="text-black-900 text-2xl font-bold mb-2">{job.jobTitle}</h5>
    //       <p className="text-xl font-bold  text-blue-500">{job.hiringOrganization}</p>
    //       <div className="md:flex mt-5 px-3">
    //         {job.salary && (
    //           <div className="flex px-3">
    //           <p className="">
    //             <div className="shadow-md p-3 rounded-full"><p className="text-2xl text-blue-500"><HiOutlineCalendar/></p></div>
                
    //             </p>
    //             <div>
    //             <p className="px-4 text-gray-400 text-lg text-gray-400">Job Type</p>
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
    //             <p className="px-4 text-lg text-gray-400 ">Pay Range</p>
    //             <p className="px-4 text-md">{job.salary}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineLocationMarker/></div></div>
                
    //             </p>
    //             <div>
    //             <p className="px-4 text-lg text-gray-400 ">Location</p>
    //             <p className="px-4 text-md">{job.location}</p>
    //             </div>
    //         </div>

    //         <div className="flex px-3">
    //         <p className="text-sm  ">
    //             <div className="shadow-md p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlinePlay/></div></div>
                
    //             </p>
    //             <div>
    //             <p className="px-4 text-lg text-gray-400 ">Apply Till</p>
    //             <p className="px-4 text-md">{new Date(job.validTill).getDate() +
    //             "-" +
    //            ( new Date(job.validTill).getMonth()+1) +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}</p>
    //             </div>
    //         </div>

    //       </div>
    //       {/* <p class="text-gray-700 text-base">{job.jobDesc}</p> */}
    //     </div>
    //     <div class="py-3 border-t border-gray-300 items-center flex ">
    //       {/* <FaBuilding className="text-gray-500 mr-2" /> */}
          

         
    //       <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full px-5 bg-white py-1 border border-b">
 <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 my-3">
<div className="col-span-2">
<h5 class="text-black-900 text-lg font-bold mb-1 ">{job.jobTitle}</h5>
 <p className="text-sm font-bold  text-gray-400 font-semibold">{job.hiringOrganization}</p>
</div>
<div>
{/* <p className="px-4 text-gray-400 font-semibold text-lg text-gray-400 font-semibold">Job Type</p> */}
<div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><CgWorkAlt/></div>

   <p className="px-4 text-md text-gray-400 font-semibold">{job.jobType}</p>
</div>
   <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><HiOutlineLocationMarker/></div>

   <p className="px-4 text-md text-gray-400 font-semibold">{job.location}</p>
   </div>
</div>
<div>
  <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><HiOutlineCalendar/></div>


<p className="px-2 text-md text-gray-400 font-semibold">{new Date(job.validTill).getDate() +
             "-" +
            ( new Date(job.validTill).getMonth()+1) +
             "-" +
             new Date(job.validTill).getFullYear()}</p> 


       
       </div>
       <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><BsCashStack/></div>

       <p className="px-4 text-md text-gray-400 font-semibold">{job.salary}</p>
       </div>

</div>
<div>
<button style={{ background: "#3ED3C5" }} className="  rounded-3xl px-6 mx-2 py-2 my-3 text-xs text-gray-900 font-semibold">
                Complete Draft
              </button>
</div>
<div className="text-right  w-12 ml-auto align-middle">
  <p className="text-right py-3"><BsThreeDots/></p>

</div>


 </div>
    </div>
  );
};

export default JobCard;
