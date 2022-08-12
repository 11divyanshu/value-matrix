import React from "react";
import { getJobById } from "../../service/api";
import { ReactSession } from "react-client-session";

<<<<<<< HEAD
function JobDetails(state) {
    console.log(state);
    const {states}=useParams();
    const [jobs, setJobs] = React.useState(null);
    const res=JSON.parse(localStorage.getItem("ids"))
    console.log(res);
    React.useEffect(() => {
        let access_token = ReactSession.get(state.job_id,"access_token");
        const getData = async () => {
          let res = await getjobbyid(access_token);
            console.log(res)
          if (res && res.data) {
            setJobs(res.data.jobs);
            
            
          }
        };
        getData();
      }, []);
=======
function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);
>>>>>>> afb9efaea2fbb8b403c6d2c9a0afbc0a4ac0df33

  React.useEffect(() => {
    const getData = async () => {
      let access_token = ReactSession.get("access_token");
      let res = await getJobById(job_id, access_token);
      if(res){
        setJob(res.data.job);
      }
    };
    getData();
  }, [job_id]);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Job Details</p>
      {job && (
      <div className="p-2 my-5 space-y-3 w-3/4 text-gray-800">
      
        <p><span className="font-semibold">Job Title :</span> <span className="capitalize">{job.jobTitle}</span></p>
        <p><span className="font-semibold">Job Description :</span> <span className="capitalize">{job.jobDesc}</span></p>
        <p><span className="font-semibold">Job Location :</span> <span className="capitalize">{job.location}</span></p>
        <p><span className="font-semibold">Job Type :</span> <span className="capitalize">{job.jobType}</span></p>
        <p><span className="font-semibold">Hiring Organization :</span> <span className="capitalize">{job.hiringOrganization}</span></p>
        <p><span className="font-semibold">Basic Pay Range :</span> <span className="capitalize">{job.basicSalary}</span></p>
        <p><span className="font-semibold my-2">Apply By :</span> <span className="capitalize">{new Date(job.validTill).getDate() + "-" + new Date(job.validTill).getMonth()+"-"+new Date(job.validTill).getFullYear()}</span></p>
      </div>
      )}
    </div>
  );

}

export default JobDetails;
