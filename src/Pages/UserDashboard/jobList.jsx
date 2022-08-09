import React from "react";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listJobs } from "../../service/api.js";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);

  React.useEffect(() => {
    const getData = async () => {
      let res = await listJobs();
      console.log(res)
      if (res && res.data) {
        setJobs(res.data.jobs);
      }
    };
    getData();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-semibold">All Jobs</p>
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
