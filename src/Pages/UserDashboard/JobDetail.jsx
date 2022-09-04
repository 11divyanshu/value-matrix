import React from "react";
import { getJobById } from "../../service/api";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";

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
              {/* <p className="card-text font-semibold p-4">{job.jobDesc}</p> */}
            </div>
            {/* <div className="flex mt-5 w-3/4 mx-auto" style={{justifyContent:'space-between'}}>

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
          </div> */}

            <div className="flex mt-5 px-3">
              {job.salary && (
                <div className="flex mt-5 px-5">
                  <p className="">
                    <div className="shadow-lg p-3 rounded-full">
                      <p className="text-3xl text-blue-500">
                        <HiOutlineCalendar />
                      </p>
                    </div>
                  </p>
                  <div>
                    <p className="px-4 text-gray-400 text-lg text-gray-400">
                      Job Type
                    </p>
                    <p className="px-4 text-md">{job.jobType}</p>
                  </div>
                </div>
              )}

              {/* =======
                    <div className="shadow-lg p-3 rounded-full"><p className="text-3xl text-blue-500"><HiOutlineCalendar /></p></div>

                  </p>
                  <div>
                    <p className="px-4 text-gray-400 text-lg text-gray-400">Job Type</p>
                    <p className="px-4 text-md">{job.jobType}</p>
                  </div>
                </div>

              )}

>>>>>>> bb774ccb8e7895cda9ce592fd2d4395ac20eddad */}
              {/* <p className="text-sm text-gray-700 mx-auto">
              {job.jobType}
            </p> */}
              <div className="flex px-5 mt-5">
                <p className="text-sm  ">
                  <div className="shadow-lg p-3 rounded-full">
                    <div className="text-3xl text-blue-500 ">
                      <HiOutlineCurrencyDollar />
                    </div>
                  </div>
                </p>
                <div>
                  <p className="px-4 text-lg text-gray-400 ">Pay Range</p>
                  <p className="px-4 text-md">{job.salary}</p>
                </div>
              </div>

              <div className="flex px-5 mt-5">
                <p className="text-sm  ">
                  <div className="shadow-lg p-3 rounded-full">
                    <div className="text-3xl text-blue-500 ">
                      <HiOutlineLocationMarker />
                    </div>
                  </div>
                </p>
                <div>
                  <p className="px-4 text-lg text-gray-400 ">Location</p>
                  <p className="px-4 text-md">{job.location}</p>
                </div>
              </div>

              <div className="flex px-5 mt-5">
                <p className="text-sm  ">
                  <div className="shadow-lg p-3 rounded-full">
                    <div className="text-3xl text-blue-500 ">
                      <HiOutlinePlay />
                    </div>
                  </div>
                </p>
                <div>
                  <p className="px-4 text-lg text-gray-400 ">Apply By</p>
                  <p className="px-4 text-md">
                    {new Date(job.validTill).getDate() +
                      "-" +
                      new Date(job.validTill).getMonth() +
                      "-" +
                      new Date(job.validTill).getFullYear()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className="card my-5 mx-auto w-4/5 p-5 "
            style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}
          >
            <div className="card-body px-5 w-4/5">
              <div className="my-7">
                <h5 className=" px-4 py-2 text-xl text-gray-800 font-bold">
                  {" "}
                  Job Description :
                </h5>
                <h6
                  className="px-4 mb-2 text-lg text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.jobDesc)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-xl text-gray-800 font-bold">
                  Eligibility :
                </h5>
                <h6
                  className="px-4 mb-2 text-lg text-gray-500"
                  dangerouslySetInnerHTML={createMarkup(job.eligibility)}
                ></h6>
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-xl text-gray-800 font-bold">
                  Skills Required :
                </h5>
                {job &&
                  job.skills &&
                  job.skills.map((item) => {
                    return (
                      <span class="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">
                        {item}
                      </span>
                    );
                  })}
              </div>
              <div className="my-7">
                <h5 className=" px-4 py-2 text-xl text-gray-800 font-bold">
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
