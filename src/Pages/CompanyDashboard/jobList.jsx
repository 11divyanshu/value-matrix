import React, { useState } from "react";
import JobCard from "../../Components/Dashbaord/JobCard.jsx";
import { listJobs,listBinJobs } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from "formik";
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import "../../assets/stylesheet/pagination.css";
import SupportTable from "./SupportTable.jsx";
const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    // document.getElementById('1').classList.add('page_active')
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
      let res = await listJobs(c_id._id);
      let binJobs = await listBinJobs(c_id._id);
      console.log(binJobs);
      console.log(res);
      if (res && res.data) {
        setJobs(res.data.jobs);
        console.log(res.data.jobs);
        let arr = [...res.data.jobs];
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
      console.log(res.data.jobs);
      let arr = [...res.data.jobs];
      console.log(arr);
      setJobs([]);
      // setLoader(true);
      setLoader(false);
      setTimeout(() => {
        setJobs(res.data.jobs);
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

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= jobs.length; i++) {
      document.getElementById("crd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("crd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
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
                className=" p-3 w-10vw rounded-md text-white"
                style={{ backgroundColor: "#034488" }}
              >
                Download CSV
              </button>
            </CSVLink>
          </p>
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
        {/* <div className="md:w-1/4 sm:w-full  mt-5 h-3/5 shadow-lg rounded-lg">



          <Formik
            initialValues={{
              picked: 'One',
              toggle: false,
              checked: [],
            }}
          // onSubmit={async (values) => {

          // }}
          >
            {({ values }) => (
              <Form className="px-5 py-3 bg-white">
                <div id="my-radio-group " className="text-2xl font-bold py-4 font-gray-600">Filters</div>
                <div role="group" className="flex-column align-items-center  py-3 my-3 w-1/2 border-t border-gray-300" aria-labelledby="my-radio-group">

                  <label className="content-center px-4  flex  text-xl">
                    <Field type="radio" className="m-2 " name="picked" value="One" />
                    <p className="text-xl font-bold mx-3 font-gray-600">All</p>
                  </label>
                  <br />
                  <label className="px-4   flex   text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Two" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Active</p>
                  </label>
                  <br />
                  <label className="px-4 flex text-xl">
                    <Field type="radio" className="m-2" name="picked" value="Three" />
                    <p className="text-xl font-bold mx-3 font-gray-600">Ended</p>
                  </label>
                </div>

                <label className="w-1/2 content-center mx-auto px-4 flex p-1  text-xl">
                  <Field type="checkbox" className="m-2" name="toggle" />
                  <p className="text-xl font-bold mx-3 font-gray-600">Vacant</p>
                </label>


                <button
                  className=" text-white shadow-lg rounded-lg my-4 px-4 py-2"
                  style={{backgroundColor:"#034488"}}
                  onClick={() => applyFilter(values)}
                >
                  Apply
                </button>
              </Form>
            )}
          </Formik>


        </div> */}
        <div className=" md:w-3/4 md:mx-5">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <div>
              <div className="flex justify-between w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">Posted Jobs</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>
                <div className="w-[5vw] py-4 ml-auto px-6">
                  <Link to="/company/jobsAdd">
                    <button
                      className=" hover:bg-blue-700 rounded-lg text-white p-3"
                      style={{ backgroundColor: "#034488" }}
                    >
                      <p className="flex">
                        <AiOutlinePlus />
                      </p>
                    </button>
                  </Link>
                </div>
                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>

              {/* <div className="w-full">
                {jobs &&
                  jobs.map((job) => {
                    return <JobCard job={job} />;
                  })}
              </div> */}
              <div className="w-full">
                {jobs &&
                  jobs.map((job, index) => {
                    return <JobCard job={job} index={index} />;
                  })}
              </div>
              <div className="w-full">
                <div className="flex justify-between my-2 mx-1">
                  <div>
                    Page {page} of {Math.ceil(jobs.length / 5)}
                  </div>
                  <div>
                    {" "}
                    {jobs &&
                      jobs.map((job, index) => {
                        return index % 5 == 0 ? (
                          <span
                            className={`mx-2 ${
                              page == index / 5 + 1 ? "page_active" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              paginate(index / 5 + 1);
                            }}
                          >
                            {index / 5 + 1}
                          </span>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/4">
          <div className="shadow-lg  py-5  justify-around  px-5 bg-white">
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

          <SupportTable/>
        </div>
      </div>
    </div>
  );
};

export default JobList;
