import React from "react";
import JobCard from "../../Components/AdminDashboard/JobCard.jsx";
import { listJobs,unapprovedJobsList,approveJob } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from "formik";
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser,HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar, } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);
  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    // { label: "job_description", key: "jobDesc" },
    { label: "createTime", key: "createTime" },
    { label: "uploadedBy", key: "uploadBy" },
    { label: "location", key: "location" },
    { label: "job_type", key: "jobType" },
    { label: "applicants", key: "applicants" },
    { label: "valid_till", key: "validTill" },
    { label: "hiring_organization", key: "hiringOrganization" },
    { label: "basic_salary", key: "basicSalary" },
  ];

  const csvReport = {
    filename: "jobs.csv",
    headers: headerso,
    data: jobs,
  };

  React.useEffect(() => {
    const getData = async () => {
      let c_id = JSON.parse(localStorage.getItem("user"));
      console.log(c_id);
      let res = await unapprovedJobsList();
      console.log(res);
      if (res && res.data) {
        setJobs(res.data);
        console.log(res.data);
        let arr = [...res.data];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        localStorage.setItem("jobsdetails", jsonObj);
      }
    };
    getData();
  }, []);

  const applyFilter = async (values) => {
    setLoader(true);
    console.log(values.picked);
    console.log(values.toggle);
    let c_id = JSON.parse(localStorage.getItem("user"));
    console.log(c_id);
    const access_token = localStorage.getItem("access_token");
    let res = await FilterCompany(c_id._id, values);

    if (res && res.data) {
      // await setJobs(res.data.jobs);
      console.log(res.data);
      let arr = [...res.data];

      setJobs([]);
      // setLoader(true);
      setLoader(false);
      setTimeout(() => {
        setJobs(res.data);
      }, 1000);
      // setFilter(res.data.jobs);

      console.log(jobs);
      const jsonObj = JSON.stringify(arr);

      // save to localStorage
      localStorage.setItem("jobsdetails", jsonObj);
    } else {
      console.log("no response");
    }
  };

  return (
    <div className="bg-slate-100">
      <div
        className="flex mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>

        <div className="py-3">
          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue">
            <CSVLink {...csvReport}>
              <button
                class=" p-3 w-10vw rounded-md text-white"
                style={{ backgroundColor: "#034488" }}
              >
                Download CSV
              </button>
            </CSVLink>
          </p>
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
      
        <div className=" md:w-3/4 md:mx-5">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <>
              <div className="flex justify-between w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Unapproved Jobs</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>

              <div className="w-full">
                {jobs &&
                  jobs.map((job) => {
                    return(<div className="w-full px-5 bg-white py-1 border border-b">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
                      <div className="col-span-2">
                        <h5 class="text-black-900 text-md font-bold mb-1 ">{job.jobTitle}</h5>
                        <p className="text-sm font-bold  text-gray-400 font-semibold">
                          {job.hiringOrganization}
                        </p>
                      </div>
                      <div className="col-span-2">
                        {/* <p className="px-4 text-gray-400 font-semibold text-md text-gray-400 font-semibold">Job Type</p> */}
                        <div className="flex py-1">
                          <div className="text-md py-1 text-gray-400 font-semibold ">
                            <CgWorkAlt />
                          </div>
              
                          <p className="px-4 text-sm text-gray-400 font-semibold">
                            {job.jobType}
                          </p>
                        </div>
                        <div className="flex py-1">
                          <div className="text-md py-1 text-gray-400 font-semibold ">
                            <HiOutlineLocationMarker />
                          </div>
              
                          <p className="px-4 text-sm text-gray-400 font-semibold">
                            {job.location}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="flex py-1">
                          <div className="text-md py-1 text-gray-400 font-semibold ">
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
                          <div className="text-md py-1 text-gray-400 font-semibold ">
                            <BsCashStack />
                          </div>
              
                          {job.salary && job.salary.length >= 2 && (
                            <p className="px-4 text-md text-gray-400 font-semibold">
                              {job.salary[0].symbol} {job.salary[1]}{" "}
                              {job.salary.length === 3 && <span>- {job.salary[2]}</span>}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex col-span-2">
                        {job.archived ? (
                          <button
                            // style={{ background: "#3ED3C5" }}
                            className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                          >
                            Archived{" "}
                          </button>
                        ) : new Date().toISOString() < job.validTill ? (
                          <button
                            style={{ background: "#3ED3C5" }}
                            className="  rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                          >
                            Active{" "}
                          </button>
                        ) : (
                          <button
                            // style={{ background: "#3ED3C5" }}
                            className=" bg-white border border-gray-400 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                          >
                            Ended{" "}
                          </button>
                        )}
              
                        <div className="px-4 mx-2 py-4 align-middle">
                          {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
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
                                  <Popover.Panel className="absolute z-10  max-w-sm  px-9 sm:px-0 lg:max-w-3xl md:w-[8vw]">
                                    <div className="overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                      <div className="relative gap-8 bg-white p-3 lg:grid-cols-4  justify-between">
                                        <div className="flex items-center border-b text-gray-800 space-x-2">
                                          {/* <BsThreeDots className="text-md" /> */}
                                          <p className="text-sm font-semibold py-2">
                                            <Link to={`/company/jobDetails/${job._id}`}>
                                              View Details{" "}
                                            </Link>
                                          </p>{" "}
                                        </div>
                                        <div className="flex items-center text-gray-800 space-x-2"
                                        onClick={async()=>{
                                         let res1 = await approveJob({_id:job._id});
                                         let res = await unapprovedJobsList();
                                         console.log(res);
                                         if (res && res.data) {
                                           setJobs(res.data);
                                           console.log(res.data);
                                           let arr = [...res.data];
                                           const jsonObj = JSON.stringify(arr);
                                         
                                         console.log(res)
                                        }}
                                      }
                                        >
                                          {/* <BsThreeDots className="text-md" /> */}
                                          <p className="text-sm font-semibold py-1">
                                           
                                              Approve Jobs
                                            
                                          </p>{" "}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
              
                          {/* <button id="dropdownLeftButton" data-dropdown-toggle="dropdownLeft" data-dropdown-placement="left" className="mb-3 md:mb-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
              >>>>>>> c827bec0fca0f186c865ab6e43be363b58eedecf
                  
                  
                  <svg className="mr-2 w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg></button>
              
              
              <div id="dropdownLeft" className="hidden z-20 w-44 bg-white rounded absolute divide-y divide-gray-100 shadow dark:bg-gray-700">
                  <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownLeftButton">
                    <li>
                      <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                    </li>
                    
                  </ul>
              </div> */}
              
                          {/* <p className="ml-auto text-md text-blue-500 cursor-pointer" ><Link to={`/company/jobDetails/${job._id}`}>View Details &#12297;</Link></p> */}
                        </div>
                      </div>
                    </div>
                  </div>);
                  })}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/4 my-3">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Posted Jobs</p>
              <p className="text-gray-400 font-semibold text-xs">
                {jobs.length > 0 ? jobs.length : 0}
              </p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p>
              <p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p>
              <p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

              <p className=" mx-2  text-sm ">Support</p>
              <p className="">
                <HiOutlineUser />
              </p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div>
                <p>Open 0/5</p>
              </div>
              <div>
                <p>Working 0/5</p>
              </div>
              <div>
                <p>Closed 0/5</p>
              </div>
            </div>
            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle">
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div>
                {" "}
                <p className="py-2 text-sm">Leslie Alexander</p>
                <p className="text-gray-400 text-xs">Project Manager</p>
              </div>
            </div>

            {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;
