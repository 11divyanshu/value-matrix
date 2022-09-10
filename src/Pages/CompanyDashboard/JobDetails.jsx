import React from "react";
import { getJobById } from "../../service/api";
import { ReactSession } from "react-client-session";
import { useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { AiOutlineCalendar } from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import DOMPurify from "dompurify";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";

function JobDetails(props) {
  const [job_id, setJobId] = React.useState(props.id);
  const [job, setJob] = React.useState(null);

  const [candidates, setCandidates] = React.useState([]);
  const [showCandidate, setShowCandidate] = React.useState(false);
  const [declined, setDeclined] = React.useState([]);
  const [showDeclined, setShowDeclined] = React.useState(false);
  const [invited, setInvited] = React.useState([]);
  const [showInvited, setShowInvited] = React.useState(false);

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
      console.log(res.data);
      if (res) {
        setJob(res.data.job);
        setCandidates(res.data.applicants);
        setDeclined(res.data.declined);
        setInvited(res.data.invited);
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
      } else {
        console.log("no response");
        console.log(job);
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
    <div className="w-full p-5 " style={{ backgroundColor: "#F2F3F5" }}>
      {job ? (
        <>
          {/* 
          <div className="card my-5 mx-auto w-4/5 p-5 bg-white " style={{ "boxShadow": "rgba(0, 0, 0, 0.1) 0px 4px 12px" }}>




            <div className="card-body px-5 w-4/5">

              <h5 className=" px-4 py-2 text-4xl text-gray-900 font-extrabold">{job.jobTitle}</h5>
              <h6 className="px-4 mb-2 text-lg text-blue-600 font-extrabold">{job.hiringOrganization} . {job.location}</h6>
             

            </div>
           

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
          </div> */}

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
                className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6"
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
                  {/* <p className="px-4 text-gray-400 font-semibold text-lg text-gray-400 font-semibold">Job Type</p> */}
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
                        {job.uploadBy === user._id && (
                                 <Popover className="relative mt-1">
                                 {({ open }) => (
                                   <>
                                     <Popover.Button
                                       className={`
                               ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                     >
                                       {/* <div class="absolute inline-block top-0 right-0 bottom-auto left-auto translate-x-2/4 -translate-y-1/2 rotate-0 skew-x-0 skew-y-0 scale-x-100 scale-y-100 p-1 text-xs bg-[#034488] rounded-full z-10" style={{backgroundColor:"#034488"}}></div> */}
                   
                                       <BsThreeDots className="text-gray-700 text-lg cursor-pointer hover:text-gray-800" />
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
                                           <div className="relative gap-8 bg-white p-3 lg:grid-cols-2 flex justify-between">
                                             <div className="flex items-center text-gray-800 space-x-2">
                                               {/* <BsThreeDots className="text-md" /> */}
                                               <p className="text-sm font-semibold">
                                                 <Link to={`/company/jobUpdate/${job._id}`}>
                                                   Update Details{" "}
                                                 </Link>
                                               </p>{" "}
                                             </div>
                                           </div>
                                         </div>
                                       </Popover.Panel>
                                     </Transition>
                                   </>
                                 )}
                               </Popover>
                        )}
                <div className="text-right  w-12 ml-auto align-middle">
                  <p className="text-right text-lg py-5">
                    <BsThreeDots />
                  </p>
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
                  })} */}<div className="px-4">
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
                    : "No Skills Required"}</div>
                <div className="">
                </div>
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
            {user._id === job.uploadBy && (
              <div className="my-5 px-9">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg">
                    Applicants{" "}
                    <span className="text-sm">({candidates.length})</span>
                  </p>
                  {candidates.length > 0 && showCandidate ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowCandidate(true)}
                    >
                      Show
                    </p>
                  )}
                </div>

                {candidates.length > 0 && showCandidate && (
                  <table class="w-full my-5">
                    <thead class="bg-white border-b text-left">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((user, index) => {
                        return (
                          <tr
                            class={`${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } border-b`}
                          >
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                              {index + 1}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.firstName} {user.lastName}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.email}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.contact}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              Pending
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                <div className="flex items-center justify-between my-5">
                  <p className="font-bold text-lg">
                    Invitations
                    <span className="text-sm"> ({invited.length})</span>
                  </p>
                  {invited.length > 0 && showInvited ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowInvited(true)}
                    >
                      Show
                    </p>
                  )}
                </div>

                {invited.length > 0 && showInvited && (
                  <table class="w-full my-3">
                    <thead class="bg-white border-b text-left">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Contact
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invited.map((user, index) => {
                        return (
                          <tr
                            class={`${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } border-b`}
                          >
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                              {index + 1}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.firstName} {user.lastName}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.email}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.contact}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {candidates.includes(user)
                                ? "Accepted"
                                : declined.includes(user)
                                ? "Declined"
                                : "Waiting"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                <div className="flex items-center justify-between my-3">
                  <p className="font-bold text-lg">
                    Invitations Declined
                    <span className="text-sm"> ({declined.length})</span>
                  </p>
                  {declined.length > 0 && showDeclined ? (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowDeclined(false)}
                    >
                      Hide
                    </p>
                  ) : (
                    <p
                      className="text-sm hover:underline text-blue-500 cursor-pointer"
                      onClick={() => setShowDeclined(true)}
                    >
                      Show
                    </p>
                  )}
                </div>

                {declined.length > 0 && showDeclined && (
                  <table class="w-full my-3">
                    <thead class="bg-white border-b text-left">
                      <tr>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          #
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          First Name
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                        >
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {declined.map((user, index) => {
                        return (
                          <tr
                            class={`${
                              index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } border-b`}
                          >
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                              {index + 1}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.firstName} {user.lastName}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.email}
                            </td>
                            <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                              {user.contact}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
export default JobDetails;
