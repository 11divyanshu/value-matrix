import React from "react";
import { FaBuilding } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineLocationMarker,HiOutlineCurrencyDollar,HiOutlineCalendar,HiOutlinePlay} from "react-icons/hi";

const JobCard = (props) => {
 
  const [job, setJob] = React.useState(props.job);
  localStorage.setItem("jobs", JSON.stringify(job))

  localStorage.setItem("ids", JSON.stringify(job._id))
  return (
    <div class="flex my-2 w-full">
      <div class="block rounded-sm p-4 shadow-lg border-[0.5px] border-gray-300 bg-white w-full">
       
        <div class="p-6">
          <h5 class="text-black-900 text-2xl font-bold mb-2">{job.jobTitle}</h5>
          <p className="text-xl  text-blue-500">{job.hiringOrganization}</p>
          <div className="flex mt-5 px-3">
            {job.salary && (
              <div className="flex px-3">
              <p className="">
                <div className="shadow-lg p-3 rounded-full"><p className="text-2xl text-blue-500"><HiOutlineCalendar/></p></div>
                
                </p>
                <div>
                <p className="px-4 text-gray-400 text-lg text-gray-400">Job Type</p>
                <p className="px-4 text-md">{job.jobType}</p>
                </div>
                </div> 
              
            )}

            {/* <p className="text-sm text-gray-700 mx-auto">
              {job.jobType}
            </p> */}
            <div className="flex px-3">
            <p className="text-sm  ">
                <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineCurrencyDollar/></div></div>
                
                </p>
                <div>
                <p className="px-4 text-lg text-gray-400 ">Pay Range</p>
                <p className="px-4 text-md">{job.salary}</p>
                </div>
            </div>

            <div className="flex px-3">
            <p className="text-sm  ">
                <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlineLocationMarker/></div></div>
                
                </p>
                <div>
                <p className="px-4 text-lg text-gray-400 ">Location</p>
                <p className="px-4 text-md">{job.location}</p>
                </div>
            </div>

            <div className="flex px-3">
            <p className="text-sm  ">
                <div className="shadow-lg p-3 rounded-full"><div className="text-2xl text-blue-500 "><HiOutlinePlay/></div></div>
                
                </p>
                <div>
                <p className="px-4 text-lg text-gray-400 ">Apply Till</p>
                <p className="px-4 text-md">{new Date(job.validTill).getDate() +
                "-" +
               ( new Date(job.validTill).getMonth()+1) +
                "-" +
                new Date(job.validTill).getFullYear()}</p>
                </div>
            </div>

          </div>
          {/* <p class="text-gray-700 text-base">{job.jobDesc}</p> */}
        </div>
        <div class="py-3 border-t border-gray-300 items-center flex ">
          {/* <FaBuilding className="text-gray-500 mr-2" /> */}
          

         
          <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/user/jobDetails/${job._id}`}>View Details &#12297;</Link></p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;