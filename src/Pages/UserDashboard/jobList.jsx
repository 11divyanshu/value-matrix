import React from "react";
import JobCard from "../../Components/Dashbaord/UserJobCard.jsx"
import { listJobs } from "../../service/api.js";
import { CSVLink } from "react-csv";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);

  const headerso=[
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    { label: "job_description", key: "jobDesc" },
    {label:"createTime",key:"createTime"},
    {label:"uploadedBy",key:"uploadBy"},
    {label:"location",key:"location"},
    {label:"job_type",key:"jobType"},
    {label:"applicants",key:"applicants"},
    {label:"valid_till",key:"validTill"},
    {label:"hiring_organization",key:"hiringOrganization"},
    {label:"basic_salary",key:"basicSalary"},

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
        let arr=[...res.data.jobs];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);
        
        
      }
      
      
    };
    getData();
  }, []);

  

  return (
    <div className="p-5 w-full mx-auto" >
      <div className="flex w-1/2" style={{justifyContent:'space-between'}}>

      <p className="text-2xl font-semibold pl-3 ">All Jobs</p>
      <p className="text-gray-900 text-s mb-2 text-left text-blue"><CSVLink {...csvReport}><button class="bg-blue-600 p-3 w-10vw rounded-md text-white">DOWNLOAD CSV</button></CSVLink></p>
      </div>
      <div className="p-2 min-w-[50vw]">
        {jobs && (
            jobs.map((job)=>{
                return (
                    <JobCard job={job}/>
                )
            })
        )}
      </div>
    </div>
  );
};

export default JobList;
