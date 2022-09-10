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
    //       {/* <p class="text-gray-700 text-base">{job.jobDesc}</p> */}
    //     </div>
    //     <div class="py-3 border-t border-gray-300 items-center flex ">
    //       {/* <FaBuilding className="text-gray-500 mr-2" /> */}
          

         
    //       <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
    //     </div>
    //   </div>
    // </div>

    <div className="w-full px-5 bg-white py-1 border border-b">
 <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 my-3">
<div className="col-span-2">
<h5 class="text-black-900 text-md font-bold mb-1 ">{job.jobTitle}</h5>
 <p className="text-sm font-bold  text-gray-400 font-semibold">{job.hiringOrganization}</p>
</div>
<div className="col-span-2">
{/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
<div className="flex py-1"><div className="text-md py-1 text-gray-400 font-semibold "><CgWorkAlt/></div>

   <p className="px-4 text-sm text-gray-400 font-semibold">{job.jobType}</p>
</div>
   <div className="flex py-1"><div className="text-md py-1 text-gray-400 font-semibold "><HiOutlineLocationMarker/></div>

   <p className="px-4 text-sm text-gray-400 font-semibold">{job.location}</p>
   </div>
</div>
<div className="col-span-2">
  <div className="flex py-1"><div className="text-md py-1 text-gray-400 font-semibold "><HiOutlineCalendar/></div>


<p className="px-2 text-md text-gray-400 font-semibold">{new Date(job.validTill).getDate() +
             "-" +
            ( new Date(job.validTill).getMonth()+1) +
             "-" +
             new Date(job.validTill).getFullYear()}</p> 


       
       </div>
       <div className="flex py-1"><div className="text-md py-1 text-gray-400 font-semibold "><BsCashStack/></div>

       <p className="px-4 text-sm text-gray-400 font-semibold">{job.salary}</p>
       </div>

</div>
<div className="flex col-span-2">
<button style={{ background: "#3ED3C5" }} className="  rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold">
                Complete Draft
              </button>
              <div className="text-right w-12 ml-auto py-2 align-middle">
  <p className="text-right text-md py-3"><BsThreeDots/></p>
  
  {/* <button id="dropdownLeftButton" data-dropdown-toggle="dropdownLeft" data-dropdown-placement="left" className="mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
    
    
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
