import React, { useState, Fragment, useEffect } from "react";
import { availableSlots } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from 'react-icons/bs'
import { HiOutlineUser } from 'react-icons/hi'
import { Popover } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import DateTimePicker from 'react-datetime-picker';


import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import swal from 'sweetalert';
const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const [modal, setModal] = React.useState(false);
  


  const [SlotTime, setSlotTime] = React.useState({
    startTime: "",
    endTime: "",
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, [])
  //   const headerso = [
  //     { label: "job_id", key: "_id" },
  //     { label: "job_title", key: "jobTitle" },
  //     // { label: "job_description", key: "jobDesc" },
  //     { label: "createTime", key: "createTime" },
  //     { label: "uploadedBy", key: "uploadBy" },
  //     { label: "location", key: "location" },
  //     { label: "job_type", key: "jobType" },
  //     { label: "applicants", key: "applicants" },
  //     { label: "valid_till", key: "validTill" },
  //     { label: "hiring_organization", key: "hiringOrganization" },
  //     { label: "basic_salary", key: "basicSalary" },

  //   ]

  //   const csvReport = {
  //     filename: "jobs.csv",
  //     headers: headerso,
  //     data: jobs,
  //   }





  useEffect(() => {
    const getData = async () => {

      let c_id = JSON.parse(localStorage.getItem("user"));
      // console.log(c_id);
      let id = c_id._id;

      let res = await availableSlots();
      console.log(res)
      if (res && res.data) {
        setJobs(res.data);
        console.log(res.data);
        let arr = [...res.data];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        // localStorage.setItem("jobsdetails", jsonObj);


      }


    };
    getData();
  }, []);










  return (

    <div className="bg-slate-100">
      <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}>
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">Hey {user && user.firstName ? user.firstName : "Company"} - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>


        <div className="py-3 flex">
          <div className="mx-1">


            <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><button className=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }} onClick={() => {
              setModal(true);
              setShowCandidateForm(true);

            }}>Add Slots</button></p>
          </div>
          {/* <div>
          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button className=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }}>Download CSV</button></CSVLink></p>
        </div> */}
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto" >


        <div className=" md:w-3/4 md:mx-5">

          {loader ? <p>...Loading</p> :
            <>
              <div className="flex justify-between w-full bg-white">
                <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}><p className="text-gray-900 w-full font-bold">All Slots</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>
              {modal && (
                <Transition
                  appear
                  show={modal}
                  as={Fragment}
                  className="relative z-1050 w-full"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-1050 w-5/6"
                    onClose={() => { }}
                    static={true}
                  >
                    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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

                    <div className="fixed inset-0 overflow-y-auto ">
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                            <div className={`${!modal ? "hidden" : "block"}`}>
                              <div className="w-full mt-9">
                                <div className="w-full m-5 mx-7">
                                  <div className="my-3 w-3/4 md:w-full text-left flex justify-between"><div>
                                    <p className="font-semibold">Add Slots</p>
                                    {/* <p className="text-sm mt-3 mb-1 break-words">
                                      ( Headers Conventions: firstName, lastName, email,
                                      phoneNo, Address)
                                    </p>
                                    <p className="text-sm break-words">
                                      (Data must contain candidate's email Address and phoneNo
                                      Number)
                                    </p> */}
                                  </div>
                                    <div><button className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                      onClick={() => setModal(false)} style={{ backgroundColor: "#fff", color: '#034488' }}
                                    >
                                      <ImCross /></button></div>
                                  </div>



                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
                                    <Formik
                                      initialValues={SlotTime}
                                      validate={(values) => {
                                        const errors = {};

                                        return errors;
                                      }}





                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            {/* <p className="text-left font-semibold py-2">
                                              Add User
                                            </p> */}
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                <DateTimePicker onChange={setStartTime} value={startTime} />

                                                {/* <Field
                                                  name="startTime"
                                                  type="text"
                                                  className="text-600 rounded-sm block px-4 py-1"
                                                  style={{ borderRadius: "5px" }}
                                                /> */}
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                <Field
                                                  name="endTime"
                                                  type="text"
                                                  className="text-600 rounded-sm block px-4 py-1"
                                                  style={{ borderRadius: "5px" }}
                                                />
                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                />
                                              </div>
                                            </div>
                                          

                                            <div>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                                                type="submit"
                                                style={{ backgroundColor: "#034488" }}
                                              >
                                                Add
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setSlotTime({
                                                    startTime: "",
                                                    endTime: "",

                                                  });
                                                  setModal(false);
                                                  setEditIndex(null);
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



                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}




            </>
          }
        </div>

        <div className="md:w-1/4 my-3">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1"><BsFillBookmarkFill /></p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Posted Jobs</p><p className="text-gray-400 font-semibold text-xs"> {jobs.length > 0 ? jobs.length : 0}</p>
            </div>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">My Learnings</p><p className="text-gray-400 font-semibold text-xs">06</p>
            </div>
            <div className=" border-gray-600 flex justify-between mt-4 pt-4">
              <p className="font-bold text-xs">Save Posts</p><p className="text-gray-400 font-semibold text-xs">01</p>
            </div>
          </div>

          <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
            <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">

              {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}


              <p className=" mx-2  text-sm ">Support</p><p className=""><HiOutlineUser /></p>
            </p>

            <div className="flex justify-between text-xs py-4 px-3">
              <div><p>Open 0/5</p></div>
              <div><p>Working 0/5</p></div>
              <div><p>Closed 0/5</p></div>
            </div>
            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Cameron Williamson</p>
                <p className="text-gray-400 text-xs">Product Designer</p>
              </div>
            </div>

            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Brookyln Simmons</p>
                <p className="text-gray-400 text-xs">Software Engineer</p>
              </div>
            </div>


            <div className="flex px-2 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 text-sm">Leslie Alexander</p>
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
