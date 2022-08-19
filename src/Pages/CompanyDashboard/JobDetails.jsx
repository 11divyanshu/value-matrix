import React from "react";
import { getJobById } from "../../service/api";
import { ReactSession } from "react-client-session";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import {AiOutlineCalendar} from "react-icons/ai"
import {CgWorkAlt} from "react-icons/cg"
import {HiOutlineCurrencyRupee} from "react-icons/hi"

function JobDetails(props) {

  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = localStorage.getItem("access_token");
      let res = await getJobById(job_id, access_token);
      if (res) {
        setJob(res.data.job);
      }else{
        console.log("no response")
      }
    };
    getData();
  }, [job_id]);


  return (
    // <div className="p-5 mx-auto">
    //   <p className="text-2xl font-bold">Job Details</p>
    //   {job && (
    //     <div className="p-2 my-5 space-y-3 w-3/4 text-gray-800">
    //       <p>
    //         <span className="font-semibold">Job Title :</span>{" "}
    //         {/* <span className="capitalize">{job.jobTitle}</span> */}
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Description :</span>{" "}
    //         <span className="capitalize">{job.jobDesc}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Location :</span>{" "}
    //         <span className="capitalize">{job.location}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Job Type :</span>{" "}
    //         <span className="capitalize">{job.jobType}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Hiring Organization :</span>{" "}
    //         <span className="capitalize">{job.hiringOrganization}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold">Basic Pay Range :</span>{" "}
    //         <span className="capitalize">{job.basicSalary}</span>
    //       </p>
    //       <p>
    //         <span className="font-semibold my-2">Apply By :</span>{" "}
    //         <span className="capitalize">
    //           {new Date(job.validTill).getDate() +
    //             "-" +
    //             new Date(job.validTill).getMonth() +
    //             "-" +
    //             new Date(job.validTill).getFullYear()}
    //         </span>
    //       </p>
    //     </div>
    //   )}
    // </div>
    <div className="container p-5">
      {job ? (
        <div className="card my-5 mx-auto w-3/4 p-5 " style={{ "boxShadow": "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>

          <div className="flex">
          <div className="px-3 w-1/5 mx-auto align-middle" > <img className="w-1/2 mx-auto align-middle" src={Microsoft} style={{verticalAlign:"middle"}}/></div>

          <div className="card-body px-5 w-4/5" style={{ borderLeft: '1px solid grey' }}>

            <h5 className=" px-4 py-2 text-3xl text-blue-700 font-bold">{job.jobTitle}</h5>
            <h6 className="px-4 mb-2 text-muted">{job.hiringOrganization} . {job.location}</h6>
            <p className="card-text font-semibold p-4">{job.jobDesc}</p>





          </div>


          </div>
          <div className="flex mt-5 w-3/4 mx-auto" style={{justifyContent:'space-between'}}>

            <div className="p-3 m-3 "><h2 className="text-blue-700 text-xl flex gap-2 align-middle font-semibold"><CgWorkAlt/>Job Type</h2>
              <h3>{job.jobType}</h3></div>

            <div className="p-3 m-3"><h2 className="text-blue-700 text-xl flex gap-2 align-middle font-semibold"><HiOutlineCurrencyRupee/>Basic Pay Range</h2>
              <h3>{job.basicSalary} rupees per year</h3></div>

            <div className="p-3 m-3"><h2 className="text-blue-700 text-xl gap-2 align-item-center font-semibold flex" style={{verticalAlign:"middle"}}><AiOutlineCalendar/>Apply By :</h2>
              <h3> {new Date(job.validTill).getDate() +
                "-" +
                new Date(job.validTill).getMonth() +
                "-" +
                new Date(job.validTill).getFullYear()}</h3></div>
          </div>
        </div>

      ):<p>Loading...</p>}
    </div>
  );
}
export default JobDetails;
