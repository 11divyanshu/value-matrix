import React from "react";
import { FaBuilding } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getJobById } from "../../service/api";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import {AiOutlineCalendar} from "react-icons/ai"
import {CgWorkAlt} from "react-icons/cg"
import {HiOutlineCurrencyRupee} from "react-icons/hi"

const JobCard = (props) => {
 const [job_id, setJobId] = React.useState(props.id);
 const [job, setJob] = React.useState(null);  // localStorage.setItem("jobs", JSON.stringify(job))

  // localStorage.setItem("ids", JSON.stringify(job._id))

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
    // <div class="flex my-2 w-full">
    //   <div class="block rounded-sm shadow-lg border-[0.5px] border-gray-300 bg-white w-1/2">
    //     <div class="py-3 px-6 border-b border-gray-300 items-center flex ">
    //       <FaBuilding className="text-gray-500 mr-2" />
          

    //       <p>{job.hiringOrganization}</p>
    //       <p className="ml-auto text-xs text-blue-500 cursor-pointer" ><Link to={`/user/jobDetails/${job._id}`}>View Details</Link></p>
    //     </div>
    //     <div class="p-6">
    //       <h5 class="text-gray-900 text-xl font-medium mb-2">{job.jobTitle}</h5>
    //       <div className="flex mb-3">
    //         {job.basicSalary && (
    //           <p className="text-sm text-gray-700">
    //             Salary : {job.basicSalary}
    //           </p>
    //         )}

    //         <p className="text-sm text-gray-700 mx-auto">
    //           Job Type : {job.jobType}
    //         </p>
    //       </div>
    //       <p class="text-gray-700 text-base">{job.jobDesc}</p>
    //     </div>
    //   </div>
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
};

export default JobCard;
