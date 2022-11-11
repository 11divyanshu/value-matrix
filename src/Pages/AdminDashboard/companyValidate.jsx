import React from "react";
import JobCard from "../../Components/AdminDashboard/JobCard.jsx";
import {
  listJobs,
  unapprovedJobsList,
  approveJob,
  addcompany,
  listUnapproveCompany,
  approveCompany,
} from "../../service/api.js";
import { Dialog } from "@headlessui/react";

import { CSVLink } from "react-csv";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import {
  HiOutlineUser,
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
} from "react-icons/hi";
import { Popover, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
const JobList = () => {
  const [jobs, setJobs] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [showForm, setShowForm] = React.useState(null);
  const [edit, setEdit] = React.useState(null);
  const [initialValues, setInitialValues] = React.useState({
    title: null,
  });
  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, []);

  React.useEffect(() => {
    const getData = async () => {
      let c_id = JSON.parse(localStorage.getItem("user"));
      console.log(c_id);
      let res = await listUnapproveCompany();
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

  return (
    <div className="bg-slate-100">
      <div
        className="flex mx-5"
        style={{ justifyContent: "space-between" }}
      >
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>

        <div className="py-3">
          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue">
            <button
              className=" p-3 w-10vw rounded-md text-white"
              style={{ backgroundColor: "#034488" }}
              onClick={() => {
                setEdit(null);
                setInitialValues({
                  title: null,
                });
                setShowForm(true);
              }}
            >
              Add Company Titles
            </button>
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
                  <p className="text-gray-900 w-full font-bold">
                    Unapproved Company
                  </p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>
              {showForm && (
                <Transition
                  appear
                  show={showForm}
                  as={Fragment}
                  className="relative z-10000"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10000"
                    onClose={() => {}}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                            <div
                              className={`${!showForm ? "hidden" : "block"}`}
                            >
                              <Formik
                                initialValues={initialValues}
                                validate={(values) => {
                                  if (showForm === false) return {};
                                  const errors = {};
                                  if (!values.title) {
                                    errors.title = "Required";
                                  }

                                  return errors;
                                }}
                                onSubmit={async (values) => {
                                  let res1 = await addcompany({
                                    list: [{ name: values.title }],
                                  });
                                  await setShowForm(false);
                                  let res = await listUnapproveCompany();
                                  console.log(res);
                                  if (res && res.data) {
                                    setJobs(res.data);
                                  }
                                }}
                              >
                                {({ values }) => {
                                  return (
                                    <Form className="w-full py-4">
                                      <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                        <label className="font-semibold text-lg w-2/5 mx-2">
                                          Name
                                        </label>
                                        <div className="w-full md:w-4/5">
                                          <Field
                                            name="title"
                                            type="text"
                                            className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                            style={{
                                              borderRadius: "4px",
                                              border: "0.5px solid",
                                            }}
                                            value={values.title}
                                          />

                                          <ErrorMessage
                                            name="title"
                                            component="div"
                                            className="text-sm text-red-600"
                                          />
                                        </div>
                                      </div>
                                      <div className="flex px-5 w-full justify-center text-center">
                                        <button
                                          type="submit"
                                          className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                          style={{ backgroundColor: "#034488" }}
                                        >
                                          {edit === null
                                            ? "Save Changes "
                                            : "Update"}
                                        </button>
                                        <button
                                          type="button"
                                          className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                          onClick={async () => {
                                            await setShowForm(false);
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </Form>
                                  );
                                }}
                              </Formik>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}

              <div className="w-full">
                {jobs &&
                  jobs.map((job) => {
                    return (
                      <div className="w-full px-5 bg-white py-1 border border-b">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
                          <div className="col-span-2">
                            <h5 className="text-black-900 text-md font-bold mb-1 ">
                              {job.name}
                            </h5>
                            {/* <p className="text-sm font-bold  text-gray-400 font-semibold">
                          {job.hiringOrganization}
                        </p> */}
                          </div>
                          {/* <div className="col-span-2">
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
                      </div> */}
                          {/* <div className="col-span-2">
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
                      </div> */}
                          <div className="flex col-span-2">
                            <button
                              style={{ background: "#3ED3C5" }}
                              className="  rounded-3xl px-6 my-3 text-xs py-2 mx-3 text-gray-900 font-semibold"
                              onClick={async () => {
                                let res1 = await approveCompany({
                                  id: job._id,
                                });
                                let res = await listUnapproveCompany();
                                console.log(res);
                                if (res && res.data) {
                                  setJobs(res.data);
                                  console.log(res.data);
                                  let arr = [...res.data];
                                  const jsonObj = JSON.stringify(arr);

                                  // save to localStorage
                                  localStorage.setItem("jobsdetails", jsonObj);
                                }
                              }}
                            >
                              Approve{" "}
                            </button>
                            <button
                              // style={{ background: "#3ED3C5" }}
                              className=" bg-yellow-300 rounded-3xl px-6 py-2 my-3 mx-3 text-xs text-gray-900 font-semibold"
                              onClick={async () => {
                                // let res1 = await approveJob({_id:job._id});
                                // let res = await unapprovedJobsList();
                                // console.log(res);
                                // if (res && res.data) {
                                //   setJobs(res.data);
                                //   console.log(res.data);
                                //   let arr = [...res.data];
                                //   const jsonObj = JSON.stringify(arr);
                                // console.log(res)
                                //  }}
                              }}
                            >
                              Discard
                            </button>

                            <div className="px-4 mx-2 py-4 align-middle"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </div>

        <div className="md:w-1/4">
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
