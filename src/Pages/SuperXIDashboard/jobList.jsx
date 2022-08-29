import React from "react";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listJobs } from "../../service/api.js";
import { CSVLink } from "react-csv";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);

  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    { label: "job_description", key: "jobDesc" },
    { label: "createTime", key: "createTime" },
    { label: "uploadedBy", key: "uploadBy" },
    { label: "location", key: "location" },
    { label: "job_type", key: "jobType" },
    { label: "applicants", key: "applicants" },
    { label: "valid_till", key: "validTill" },
    { label: "hiring_organization", key: "hiringOrganization" },
    { label: "basic_salary", key: "basicSalary" },

  ]

  const csvReport = {
    filename: "jobs.csv",
    headers: headerso,
    data: jobs,
  }





  React.useEffect(() => {
    const getData = async () => {
      let res = await listJobs();
      console.log(res)
      if (res && res.data) {
        setJobs(res.data.jobs);
        console.log("hi");
        console.log(res.data.jobs);
        let arr = [...res.data.jobs];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);


      }


    };
    getData();
  }, []);



  return (

    <> <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}><p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p>

      <div className="py-3">


        <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button class="bg-blue-600 p-3 w-10vw rounded-md text-white">DOWNLOAD CSV</button></CSVLink></p>
      </div>
    </div>
      <div className="p-4 w-full flex mx-auto" >

        <div className="w-1/3 mx-5 mt-5 h-3/5 shadow-lg rounded-lg">

          <div className="my-7 space-y-3 w-full p-4">
            <label className="text-left font-semibold text-lg w-3/4 block">Category</label>
            <input
              name="jobTitle"
              type="text"
              placeholder=""
              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
            />

          </div>

          <div className="my-7 space-y-3 w-full p-4">
            <label className="text-left font-semibold text-lg w-3/4 block">Location</label>
            <input
              name="jobTitle"
              type="text"
              placeholder=""
              className="border-[0.5px] rounded-lg my-3 border-gray-400 md:w-3/4 w-3/4 focus:outline-0 focus:border-0 p-1"
            />

          </div>

          <div className="p-4">

            <label for="default-range" className="block mb-2 text-lg w-3/4 font-semibold">Pay Range</label>
            <input id="default-range" type="range" value="50" class="w-3/4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />

          </div>
        </div>
        <div className=" w-2/3 mx-5">


          <div className="p-2 w-full">
            {jobs && (
              jobs.map((job) => {
                return (
                  <JobCard job={job} />
                )
              })
            )}
          </div>
        </div>


      </div>

    </>
  );
};

export default JobList;
