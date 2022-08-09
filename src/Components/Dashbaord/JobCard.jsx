import React from "react";
import { FaBuilding } from "react-icons/fa";

const JobCard = (props) => {
  const [job, setJob] = React.useState(props.job);
  console.log(job);
  return (
    <div class="flex my-2 w-full">
      <div class="block rounded-sm shadow-lg border-[0.5px] border-gray-300 bg-white w-1/2">
        <div class="py-3 px-6 border-b border-gray-300 items-center flex ">
          <FaBuilding className="text-gray-500 mr-2" />
          <p>{job.hiringOrganization}</p>
          <p className="ml-auto text-xs text-blue-500 cursor-pointer">View Details</p>
        </div>
        <div class="p-6">
          <h5 class="text-gray-900 text-xl font-medium mb-2">{job.jobTitle}</h5>
          <div className="flex mb-3">
            {job.basicSalary && (
              <p className="text-sm text-gray-700">
                Salary : {job.basicSalary}
              </p>
            )}

            <p className="text-sm text-gray-700 mx-auto">
              Job Type : {job.jobType}
            </p>
          </div>
          <p class="text-gray-700 text-base">{job.jobDesc}</p>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
