import React from "react";
import { getJobById } from "../../service/api";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";
import { BsThreeDots ,BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { CgWorkAlt } from "react-icons/cg";

function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);

  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      await setUser(user);
      let res = await getJobById(job_id, access_token);
      if (res) {
        setJob(res.data.job);
      }
    };

    getData();
  }, [job_id]);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

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
    <div className="w-full p-5">
      {job ? (
        <>
          {/* <div
            className="card my-5 mx-auto w-4/5 p-5 "
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <div className="card-body px-5 w-4/5">
              <h5 className=" px-4 py-2 text-4xl text-gray-900 font-extrabold">
                {job.jobTitle}
              </h5>
              <h6 className="px-4 mb-2 text-xl text-blue-600 font-extrabold">
                {job.hiringOrganization} . {job.location}
              </h6>
              <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}

<div
            className="card my-5 w-full p-5 bg-white "
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >

            <p className="text-center text-3xl font-black py-2 mb-3">{job.jobTitle}{"  "} {job.jobType} {"  "}job</p>

            <div className="w-full  bg-white border border-b">
              <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6" style={{backgroundColor:"#F2F3F5"}}>
                <div className="col-span-2 flex align-middle">
                  <div className="">
                    <img src={Microsoft} className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700"/>
                  </div>
                  <div className="pt-3">
                  <h5 class="text-black-900 text-lg font-bold mb-1 ">{job.jobTitle}</h5>
                  <p className="text-sm font-bold  text-gray-400 font-semibold">{job.hiringOrganization}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  {/* <p className="px-4 text-gray-400 font-semibold text-lg text-gray-400 font-semibold">Job Type</p> */}
                  <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><CgWorkAlt /></div>

                    <p className="px-4 text-md text-gray-400 font-semibold">{job.jobType}</p>
                  </div>
                  <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><HiOutlineLocationMarker /></div>

                    <p className="px-4 text-md text-gray-400 font-semibold">{job.location}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><HiOutlineCalendar /></div>


                    <p className="px-2 text-md text-gray-400 font-semibold">{new Date(job.validTill).getDate() +
                      "-" +
                      (new Date(job.validTill).getMonth() + 1) +
                      "-" +
                      new Date(job.validTill).getFullYear()}</p>



                  </div>
                  <div className="flex py-1"><div className="text-lg py-1 text-gray-400 font-semibold "><BsCashStack /></div>

                    <p className="px-4 text-md text-gray-400 font-semibold">{job.salary}</p>
                  </div>
         

                </div>
               
                <div className="text-right  w-12 ml-auto align-middle">
  <p className="text-right text-lg py-5"><BsThreeDots/></p>
  {/* <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p> */}

</div>


              </div>
            </div>
            <div className="card-body px-7 w-4/5">
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  {" "}
                  Job Description :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.jobDesc)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Eligibility :
                </h5>
                <h6
                  className="px-4 mb-2 text-md text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.eligibility)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">Skills Required :</h5>
                {job && job.skills && job.skills.map((item) => {
                  return (

                    <span class="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">{item}</span>
                  )
                })}
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-md text-gray-800 font-bold">
                  Perks :
                </h5>
                <h6
                  className="px-4 mb-2 text-lg text-gray-500"
                  dangerouslySetInnerHTML={{ __html: job.perks }}
                ></h6>
                {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
              </div>
            </div>
          
              

               
              

               
              

          
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default JobDetails;
