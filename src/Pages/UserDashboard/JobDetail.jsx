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
import {
  getJobInvitations,
  handleCandidateJobInvitation,
} from "../../service/api";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import swal from "sweetalert";
import Loader from "../../assets/images/loader.gif";

function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [roles, setRoles] = React.useState([]);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const getData = async () => {
      // let access_token = ReactSession.get("access_token");
      let access_token = localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      await setUser(user);
      let res = await getJobById(job_id, access_token);
      let primarySkills = {};
        let roles = new Set([]);
        res.data.job.skills.forEach((skill) => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
        setRoles(Array.from(roles));
        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);
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
  const handleJobInvitation = async (job, accept) => {
    try {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await handleCandidateJobInvitation(
        { job_id: job._id, user_id: user._id, accept: accept },
        user.access_token
      );
      if (res && res.status === 200) {
        let d = JobInvitation.filter((el) => {
          return el !== job;
        });
        await setJobInvitation(d);
        await setJobInvitation(d);
        swal({
          title: "Success",
          text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
          icon: "success",
          button: "Ok",
        });
      } else {
        swal({
          title: "Error",
          text: "Something went wrong",
          icon: "error",
          button: "Ok",
        });
      }
    } catch (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
        button: "Ok",
      });
    }
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
    <div className="w-full p-5 h-full bg-slate-100">
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
            <p className="text-center text-3xl font-black py-2 mb-3">
              {job.jobTitle}
              {"  "} {job.jobType} {"  "}job
            </p>

            <div className="w-full  bg-white border border-b">
              <div
                className="grid px-9 grid-cols-1 gap-4 md:grid-cols-7 sm:grid-cols-4   py-6"
                style={{ backgroundColor: "#F2F3F5" }}
              >
                <div className="col-span-2 flex align-middle">
                  <div className="">
                    <img
                      src={Microsoft}
                      className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700"
                    />
                  </div>
                  <div className="pt-3">
                    <h5 class="text-black-900 text-lg font-bold mb-1 ">
                      {job.jobTitle}
                    </h5>
                    <p className="text-sm font-bold  text-gray-400 font-semibold">
                      {job.hiringOrganization}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <CgWorkAlt />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.jobType}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineLocationMarker />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.location}
                    </p>
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <HiOutlineCalendar />
                    </div>

                    <p className="px-2 text-md text-gray-400 font-semibold">
                      {new Date(job.validTill).getDate() +
                        "-" +
                        (new Date(job.validTill).getMonth() + 1) +
                        "-" +
                        new Date(job.validTill).getFullYear()}
                    </p>
                  </div>
                  <div className="flex py-1">
                    <div className="text-lg py-1 text-gray-400 font-semibold ">
                      <BsCashStack />
                    </div>

                    <p className="px-4 text-md text-gray-400 font-semibold">
                      {job.salary}
                    </p>
                  </div>
                </div>
                
                  <Popover className="relative mt-1">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`
                               ${
                                 open ? "" : "text-opacity-90"
                               } focus:outline-0`}
                        >
                         

                          <BsThreeDots className="text-gray-700 text-lg mt-5 cursor-pointer hover:text-gray-800" />
                        </Popover.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl">
                            <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="relative gap-8 bg-white p-2 lg:grid-cols-2 flex justify-between">
                                <div className="w-[8vw]  text-gray-800 " onClick={() => {
                           handleJobInvitation(job, false)}}>
                                  {/* <BsThreeDots className="text-md" /> */}
                                  <p className="text-sm font-semibold py-1  cursor-pointer" 
                                    >
                                      Decline 
                                  </p>
                                 
                                </div>
                              </div>
                            </div>
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                
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
                <h5 className=" px-4 py-2 text-lg text-gray-800 font-bold">
                  Skills Required :
                </h5>
                {/* {job &&
                  job.skills &&
                  job.skills.map((item) => {
                    return (
                      <span class="bg-blue-100 text-blue-800 text-md my-5 font-semibold mx-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-600">
                        {item.primarySkill}
                      </span>
                    );
                  })} */}
                <div className="px-4">
                  {roles
                    ? roles.map((item, index) => {
                        return (
                          <div>
                            <p className="font-semibold text-md my-3">{item}</p>
                            {skillsPrimary[item].map((el) => (
                              <div>
                                <p className="text-sm my-2">{el}</p>
                                {job.skills
                                  .filter(
                                    (tool) =>
                                      tool.role === item &&
                                      tool.primarySkill === el
                                  )
                                  .map((item1, index) => (
                                    <span class="bg-blue-100 text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                      {item1.secondarySkill}({item1.proficiency}
                                      )
                                    </span>
                                  ))}
                              </div>
                            ))}
                          </div>
                        );
                      })
                    : "No Skills Required"}
                </div>
                <div className=""></div>
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
            <div className="text-right">
            <button
                    className="shadow-lg rounded-md mx-5 my-4 px-6 py-2"
                    style={{ backgroundColor: "#034488", color: "#fff" }}
                    onClick={() => {
                      handleJobInvitation(job, true);
                    }}
                    // onClick={() => applyFilter(values)}
                  >
                    Apply
                  </button>
                  </div>

            </div>
        </>
      ) : 
        (<div className="text-center w-full py-5 text-2xl"><img src={Loader} alt="loader" className="h-24 mx-auto" /></div>)
        }
    </div>
  );
}
export default JobDetails;
