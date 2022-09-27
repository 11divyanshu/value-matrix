import React, { useState, Fragment, useEffect } from "react";
import JobCard from "../../Components/CompanyDashboard/CandidateCard.jsx";
import { getCandidateList, addCandidate, deleteCandidate, eligibleJobsForCandidate, sendJobInvitations } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FilterCompany } from "../../service/api.js";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from 'react-icons/bs'
import { HiOutlineUser } from 'react-icons/hi'
import { Popover } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import * as xlsx from "xlsx/xlsx.mjs";

import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
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
  const [showjobs, setShowJobs] = React.useState(false);
  const [listEligibleJobs, setListEligibleJobs] = React.useState([]);
  // Candidate Invitations Xl Sheet Input
  const candidateInputRef = React.useState(null);
  // Candidate Data
  const [candidateData, setCandidateData] = React.useState([]);
  const [rejectedData, setRejectedData] = React.useState([]);
  const [selectedData, setSelectedData] = React.useState([]);
  const [sendCandidate, setSendCandidate] = React.useState([]);
  const [jobId, setJobId] = React.useState([]);

  const [showRejected, setShowRejected] = React.useState(false);
  const [showCandidate, setShowCandidate] = React.useState(false);

  const [candidateInitial, setCandidateInitial] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    Address: "",
  });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editIndex, setEditIndex] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  }, [])
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

  ]

  const csvReport = {
    filename: "jobs.csv",
    headers: headerso,
    data: jobs,
  }





  useEffect(() => {
    const getData = async () => {

      let c_id = JSON.parse(localStorage.getItem("user"));
      // console.log(c_id);
      let id = c_id._id;

      let res = await getCandidateList(id);
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

  // Handle Candidates File Upload
  const handleCandidateFileUpload = async (e) => {
    try {
      e.preventDefault();
      setShowCandidateForm(false);
      if (e.target.files) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target.result;
          const workbook = xlsx.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let d = selectedData;
          let r = rejectedData;
          const json = await xlsx.utils.sheet_to_json(worksheet);

          json.forEach((item) => {
            const EmailIndex = d.findIndex((el) => {
              return (
                (el.email !== null &&
                  el.email !== undefined &&
                  el.email !== "undefined" &&
                  item.email !== undefined &&
                  el.email.trim().toLowerCase() ===
                  item.email.trim().toLowerCase()) ||
                el.phoneNo === item.phoneNo
              );
            });
            const RejectIndex = r.findIndex(
              (el) =>
                (el.email !== null &&
                  item.email !== undefined &&
                  (el.email !== undefined && el.email.trim().toLowerCase()) ===
                  item.email.trim().toLowerCase()) ||
                el.phoneNo === item.phoneNo
            );

            if (EmailIndex !== -1 || RejectIndex !== -1) {
              r.push({
                firstName: item["First Name"] ? item["First Name"] : "",
                lastName: item["Last Name"] ? item["Last Name"] : "",
                email: item.email ? item.email : "",
                phoneNo: item.phoneNo ? item.phoneNo : "",
                Reason: "email/phoneNo Already Added",
                // Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (
              item.email === null ||
              item.email === undefined ||
              item.email.trim() === "" ||
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                item.email.trim()
              )
            ) {
              r.push({
                firstName: item["First Name"] ? item["First Name"] : "",
                lastName: item["Last Name"] ? item["Last Name"] : "",
                email: item.email ? item.email : "",
                phoneNo: item.phoneNo ? item.phoneNo : "",
                Reason: "Invalid email",
                // Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (item.phoneNo === null || !/^[0-9]{10}$/i.test(item.phoneNo)) {
              r.push({
                firstName: item["First Name"] ? item["First Name"] : "",
                lastName: item["Last Name"] ? item["Last Name"] : "",
                email: item.email ? item.email : "",
                phoneNo: item.phoneNo ? item.phoneNo : "",
                Reason: "Invalid phoneNo",
                // Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (
              item["First Name"] === null ||
              item["First Name"] === undefined ||
              item["First Name"].trim() === ""
            ) {
              r.push({
                firstName: item["First Name"] ? item["First Name"] : "",
                lastName: item["Last Name"] ? item["Last Name"] : "",
                email: item.email ? item.email : "",
                phoneNo: item.phoneNo ? item.phoneNo : "",
                Reason: "Invalid First Name",
                // Address: item.Address ? item.Address : "",
              });
              return;
            }
            if (EmailIndex === -1) {
              d.push({
                firstName: item["First Name"] ? item["First Name"] : "",
                lastName: item["Last Name"] ? item["Last Name"] : "",
                email: item.email ? item.email : "",
                phoneNo: item.phoneNo ? item.phoneNo : "",
                company_id: user._id,
                job_id: user._id,
              });
            }
          });
          await setCandidateData(d);
          await setRejectedData(r);
          await setSelectedData(d);
          candidateInputRef.current.value = "";
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const applyFilter = async (values) => {
  //   setLoader(true);
  //   console.log(values.picked);
  //   console.log(values.toggle);
  //   let c_id = JSON.parse(localStorage.getItem("user"));
  //   console.log(c_id);
  //   const access_token = localStorage.getItem("access_token");
  //   let res = await FilterCompany(c_id._id, values);

  //   if (res && res.data) {
  //     // await setJobs(res.data.jobs);
  //     console.log(res.data.jobs);
  //     let arr = [...res.data.jobs];

  //     setJobs([]);
  //     // setLoader(true);
  //     setLoader(false);
  //     setTimeout(() => {

  //       setJobs(res.data.jobs);
  //     }, 1000);
  //     // setFilter(res.data.jobs);

  //     console.log(jobs)
  //     const jsonObj = JSON.stringify(arr);

  //     // save to localStorage
  //     localStorage.setItem("jobsdetails", jsonObj);



  //   } else {
  //     console.log("no response")
  //   }
  // }







  return (

    <div className="bg-slate-100">
      <div className="flex mx-5 mt-3" style={{ justifyContent: 'space-between' }}>
        {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
        <p className="text-sm flex my-5 mx-5 font-semibold">Hey {user && user.firstName ? user.firstName : "Company"} - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>


        <div className="py-3 flex">
          <div className="mx-1">


            <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><button class=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }} onClick={() => {
              setModal(true);
              setShowCandidateForm(false);

            }}>Add Candidate</button></p>
          </div>
          {/* <div>
          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button class=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }}>Download CSV</button></CSVLink></p>
        </div> */}
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto" >

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

          {loader ? <p>...Loading</p> :
            <>
              <div className="flex justify-between w-full bg-white">
                <div className="  py-4 px-5" style={{ borderRadius: "6px 6px 0 0" }}><p className="text-gray-900 w-full font-bold">All Candidates</p>
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
                                    <p className="font-semibold">Add Candidate Details Sheet</p>
                                    <p className="text-sm mt-3 mb-1 break-words">
                                      ( Headers Conventions: firstName, lastName, email,
                                      phoneNo, Address)
                                    </p>
                                    <p className="text-sm break-words">
                                      (Data must contain candidate's email Address and phoneNo
                                      Number)
                                    </p>
                                  </div>
                                    <div><button className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                      onClick={() => setModal(false)}style={{ backgroundColor: "#fff" ,color:'#034488'}}
                                      >   
                                        <ImCross/></button></div>
                                  </div>
                                  <div className="flex space-x-10 my-3">
                                    <button
                                      className="bg-[#034488] text-white rounded-sm px-4 py-1"
                                      onClick={() => {
                                        setShowCandidateForm(true);
                                      }}
                                    >
                                      Add User
                                    </button>
                                    {candidateData.length === 0 && rejectedData.length === 0 && (
                                      <label
                                        for="candidatesInput"
                                        className="cursor-pointer bg-[#034488] text-white rounded-sm px-4 py-1"
                                        onClick={() => {
                                          if (candidateInputRef.current)
                                            candidateInputRef.current.click();
                                        }}
                                      >
                                        {" "}
                                        Add File{" "}
                                      </label>
                                    )}
                                    <input
                                      ref={candidateInputRef}
                                      type="file"
                                      className="hidden"
                                      accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                      onChange={handleCandidateFileUpload}
                                    />
                                    {(rejectedData.length > 0 || selectedData.length > 0) && (
                                      <button
                                        className="bg-[#034488] text-white rounded-sm px-2 py-1"
                                        onClick={() => {
                                          setCandidateData([]);
                                          setSelectedData([]);
                                          setRejectedData([]);
                                          setShowCandidateForm(false);
                                          if (candidateInputRef.current)
                                            candidateInputRef.current.value = " ";
                                        }}
                                      >
                                        Reset Data
                                      </button>
                                    )}
                                  </div>
                                  {showCandidateForm && (

                                    <div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
                                      <Formik
                                        initialValues={candidateInitial}
                                        validate={(values) => {
                                          const errors = {};
                                          let d = selectedData;

                                          const res = d.findIndex((el) => {
                                            return el.email === values.email;
                                          });
                                          const res2 = d.findIndex((el) => {
                                            return el.phoneNo == values.phoneNo;
                                          });
                                          if (
                                            !values.email ||
                                            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                              values.email.trim()
                                            )
                                          ) {
                                            errors.email = "Invalid email";
                                          } else if (res !== -1) {
                                            errors.email = "email already exists";
                                          }
                                          if (
                                            !values.phoneNo ||
                                            !/^[0-9]{10}$/i.test(values.phoneNo)
                                          ) {
                                            errors.phoneNo = "Invalid phoneNo";
                                          } else if (res2 !== -1) {
                                            errors.phoneNo = "phoneNo already exists";
                                          }
                                          return errors;
                                        }}
                                        onSubmit={async (values) => {
                                          let d = selectedData;
                                          let r = rejectedData;
                                          let data = {
                                            company_id: user._id,
                                            job_id: user._id,
                                            firstName: values.firstName,
                                            lastName: values.lastName,
                                            phoneNo: values.phoneNo,
                                            email: values.email,
                                          }
                                          d.push(data);
                                          await setSelectedData(d);
                                          await setCandidateData(d);
                                          await setRejectedData(r);
                                          await setShowCandidate(true);
                                          await setShowCandidateForm(false);
                                          console.log(values);

                                          setCandidateInitial({
                                            firstName: "",
                                            lastName: "",
                                            email: "",
                                            phoneNo: "",
                                            Address: "",
                                          });
                                          swal({
                                            title: "Candidate Added Successfully !",
                                            message: "Success",
                                            icon: "success",
                                            button: "Continue",
                                          })


                                          // if (editIndex !== null) r.splice(editIndex, 1);
                                          // setEditIndex(null);
                                          // d.push(values);
                                          // await setSelectedData(d);
                                          // await setCandidateData(d);
                                          // await setRejectedData(r);
                                          // await setShowCandidate(true);
                                          // await setShowCandidateForm(false);
                                        }}
                                      >
                                        {({ values }) => {
                                          return (
                                            <Form>
                                              <p className="text-left font-semibold py-2">
                                                Add User
                                              </p>
                                              <div className="flex my-3 flex-wrap text-left">
                                                <div className="w-1/2">
                                                  <label>First Name</label>
                                                  <Field
                                                    name="firstName"
                                                    type="text"
                                                    className="text-600 rounded-sm block px-4 py-1"
                                                    style={{ borderRadius: "5px" }}
                                                  />
                                                  <ErrorMessage
                                                    name="firstName"
                                                    component="div"
                                                  />
                                                </div>
                                                <div className="w-1/2">
                                                  <label>Last Name</label>
                                                  <Field
                                                    name="lastName"
                                                    type="text"
                                                    className="text-600 rounded-sm block px-4 py-1"
                                                    style={{ borderRadius: "5px" }}
                                                  />
                                                  <ErrorMessage
                                                    name="lastName"
                                                    component="div"
                                                  />
                                                </div>
                                              </div>
                                              <div className="flex my-3 flex-wrap text-left">
                                                <div className="w-1/2">
                                                  <label>email</label>
                                                  <Field
                                                    name="email"
                                                    type="text"
                                                    className="text-600 rounded-sm block px-4 py-1"
                                                    style={{ borderRadius: "5px" }}
                                                  />
                                                  <ErrorMessage
                                                    name="email"
                                                    component="div"
                                                    className="text-sm text-red-500"
                                                  />
                                                </div>
                                                <div className="w-1/2">
                                                  <label>phoneNo</label>
                                                  <Field
                                                    name="phoneNo"
                                                    type="text"
                                                    className="text-600 rounded-sm block px-4 py-1"
                                                    style={{ borderRadius: "5px" }}
                                                  />
                                                  <ErrorMessage
                                                    name="phoneNo"
                                                    component="div"
                                                    className="text-sm text-red-500"
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
                                                    setCandidateInitial({
                                                      firstName: "",
                                                      lastName: "",
                                                      email: "",
                                                      phoneNo: "",
                                                      Address: "",
                                                    });
                                                    setShowCandidateForm(false);

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
                                  )} <div className="my-9 lg:w-3/4">
                                    {rejectedData.length > 0 && (
                                      <div className="flex items-center w-full justify-between">
                                        <p>Rejected Data ({rejectedData.length})</p>
                                        <p>
                                          {showRejected ? (
                                            <p
                                              className="text-sm text-blue-500 cursor-pointer ml-auto"
                                              onClick={() => {
                                                setShowRejected(false);
                                              }}
                                            >
                                              Hide
                                            </p>
                                          ) : (
                                            <p
                                              className="text-sm text-blue-500 cursor-pointer ml-auto"
                                              onClick={() => {
                                                setShowRejected(true);
                                              }}
                                            >
                                              Show
                                            </p>
                                          )}
                                        </p>
                                      </div>
                                    )}
                                    {showRejected && rejectedData.length > 0 && (
                                      <div className="my-4">
                                        <table class="w-full">
                                          <thead class="bg-white border-b">
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
                                                email
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
                                                Reason
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {rejectedData.map((user, index) => {
                                              return (
                                                <tr
                                                  class={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                    } border-b`}
                                                >
                                                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {index + 1}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.email}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.phoneNo}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.Reason}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    <RiEditBoxLine
                                                      className="text-sm text-blue-500 cursor-pointer"
                                                      onClick={() => {
                                                        setCandidateInitial(user);
                                                        setEditIndex(index);
                                                        setShowCandidateForm(true);
                                                      }}
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                  <div className="my-9">
                                    {candidateData.length > 0 && (
                                      <div className="flex items-center lg:w-3/4 justify-between">
                                        <p className="font-semibold">
                                          Candidate Data ({candidateData.length})
                                        </p>
                                        <p>
                                          {showCandidate ? (
                                            <p
                                              className="text-sm text-blue-500 cursor-pointer ml-auto"
                                              onClick={() => {
                                                setShowCandidate(false);
                                              }}
                                            >
                                              Hide
                                            </p>
                                          ) : (
                                            <p
                                              className="text-sm text-blue-500 cursor-pointer ml-auto"
                                              onClick={() => {
                                                setShowCandidate(true);
                                              }}
                                            >
                                              Show
                                            </p>
                                          )}
                                        </p>
                                        <button
                                          className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"

                                          style={{ backgroundColor: "#034488" }}
                                          onClick={async () => {
                                            let res = await addCandidate(selectedData, user.access_token);
                                            console.log(res);
                                            setJobs(res.data);
                                            setCandidateInitial({
                                              firstName: "",
                                              lastName: "",
                                              email: "",
                                              phoneNo: "",
                                              Address: "",
                                            });
                                            swal({
                                              title: "Candidate Added Successfully !",
                                              message: "Success",
                                              icon: "success",
                                              button: "Continue",
                                            })
                                          }}>Add Candidate</button>
                                      </div>

                                    )}
                                    {showCandidate && candidateData.length > 0 && (
                                      <div className="my-4">
                                        <table class="w-3/4">
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
                                                Last Name
                                              </th>
                                              <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                              >
                                                email
                                              </th>
                                              <th
                                                scope="col"
                                                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                              >
                                                phoneNo
                                              </th>

                                            </tr>
                                          </thead>
                                          <tbody>
                                            {candidateData.map((user, index) => {
                                              return (
                                                <tr
                                                  class={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                                                    } border-b`}
                                                >
                                                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                                                    {index + 1}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.firstName}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.lastName}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.email}
                                                  </td>
                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    {user.phoneNo}
                                                  </td>

                                                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                                                    <AiOutlineDelete
                                                      className="text-sm  text-red-500 cursor-pointer"
                                                      onClick={() => {
                                                        setCandidateData(
                                                          candidateData.filter(
                                                            (item) => item.email !== user.email
                                                          )
                                                        );
                                                        setSelectedData(
                                                          selectedData.filter(
                                                            (item) => item.email !== user.email
                                                          )
                                                        );
                                                      }}
                                                    />
                                                  </td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
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
              {showjobs && (
                <Transition
                  appear
                  show={showjobs}
                  as={Fragment}
                  className="relative z-1050 w-full overflow-hidden"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-1050 w-5/6"
                    onClose={() => { }}
                    static={true}
                  >
                    <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
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


                    <div className="fixed inset-0 overflow-hidden ">
                      <div className="flex max-h-full items-center overflow-y-auto justify-center text-center my-7 py-7 rounded-lg max-w-4xl mx-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full  px-7 my-9 transform  rounded-xl bg-white p-9 text-left align-middle shadow-xl transition-all">
                            <div className="w-full mt-9 text-right flex justify-between">   <p className="font-semibold text-xl my-5">Send Job Request</p> <button
                                                  className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                                                 onClick={()=>{
                                                  setShowJobs(false);

                                                 }}
                                                  style={{ backgroundColor: "#fff" ,color:'#034488'}}
                                                >
                                                  <ImCross/>
                                                </button></div>
                            {listEligibleJobs && listEligibleJobs.map((job) => {
                              return (
                                <div className="w-full px-5 bg-white py-1 border border-b">
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
                                      {/* {job.archived ? (
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
                                      )} */}

{job.archived ? (
                                        <button
                                          // style={{ background: "#3ED3C5" }}
                                          className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                                        >
                                          Archived{" "}
                                        </button>
                                      ) : new Date().toISOString() < job.validTill ? (
                                        jobId.find((item) => { return item == job._id }) ? (
                                          <button
                                            // style={{ background: "#3ED3C5" }}
                                            className=" bg-yellow-300 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                                          >
                                            Requested{" "}
                                          </button>
                                        ) : (
                                          <button
                                            style={{ background: "#3ED3C5" }}
                                            className="  rounded-3xl px-6 my-3 text-xs  text-gray-900 font-semibold"
                                            onClick={() => {
                                              let res1 = sendJobInvitations(
                                                {
                                                  job_id: job._id,
                                                  candidates: sendCandidate,
                                                  user_id: job.uploadBy,
                                                },
                                                user.access_token
                                              );
                                              if (res1) {
                                                swal({
                                                  title: "Job Posted Successfully !",
                                                  message: "Success",
                                                  icon: "success",
                                                  button: "Continue",
                                                }).then((result) => {
                                                
                                                });
                                              } else {
                                                swal({
                                                  title: " Error Posting Job !",
                                                  message: "OOPS! Error Occured",
                                                  icon: "Error",
                                                  button: "Ok",
                                                });
                                              }
  
                                            }}
                                          >
                                            Send Request{" "}
                                          </button>
                                        )
                                        
                                      ) : (
                                        <button
                                          // style={{ background: "#3ED3C5" }}
                                          className=" bg-white border border-gray-400 rounded-3xl px-6 my-3 text-xs text-gray-900 font-semibold"
                                        >
                                          Ended{" "}
                                        </button>
                                      )}
                                      
                                    </div>
                                  </div>
                                </div>)


                            })
                            }


                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>





              )}


              <div className="w-full">


                {jobs && (
                  jobs.map((job) => {
                    return (
                      <div className="w-full px-5 bg-white py-1 border border-b">
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 sm:grid-cols-4 my-3">
                          <div className="col-span-2">
                            <h5 class="text-black-900 text-md font-bold mb-1 ">{job.firstName}{" "}{job.lastName}</h5>

                          </div>
                          <div className="col-span-2">
                            <div className="flex py-1">
                              <div className="text-md py-1 text-gray-400 font-semibold ">
                                <CgWorkAlt />
                              </div>

                              <p className="px-4 text-sm text-gray-400 font-semibold">
                                {job.email}
                              </p>
                            </div>

                          </div>
                          <div className="col-span-2">
                            <div className="flex py-1">
                              <div className="text-md py-1 text-gray-400 font-semibold ">
                                <HiOutlineCalendar />
                              </div>

                              <p className="px-2 text-md text-gray-400 font-semibold">
                                {job.phoneNo}

                              </p>
                            </div>

                          </div>
                          <div className="flex col-span-1">




                            <div className="px-4 mx-2 py-4 align-middle">
                              {/* <p className="text-right text-md py-3"><BsThreeDots/></p> */}
                              <Popover className="relative mt-1">
                                {({ open }) => (
                                  <>
                                    <Popover.Button
                                      className={`
            ${open ? "" : "text-opacity-90"} focus:outline-0`}
                                    >

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
                                                <Link to={`/company/candidateReport/${job.candidate_id}`}>
                                                  View Details{" "}
                                                </Link>
                                              </p>{" "}
                                            </div>
                                            <div className="flex items-center border-b text-gray-800 space-x-2" onClick={async () => {

                                              let d = [];
                                              d.push({Email:job.email,
                                              Contact:job.phoneNo,
                                              FirstName:job.firstName,
                                              LastName:job.lastName,
                                            
                                            });
                                              setSendCandidate(d);
                                              setShowJobs(true);
                                              let res = await eligibleJobsForCandidate(job.email);

                                              if (res) {
                                                setListEligibleJobs(res.data);

                                                console.log(res)
                                              }
                                              var arr = job.jobId.split(',');
                                              setJobId(arr);

                                            }}>
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-2">
                                                Add to Job{" "}
                                              </p>{" "}
                                            </div>
                                            <div className="flex items-center text-gray-800 space-x-2" onClick={() => {
                                              swal({
                                                title: "Are you sure?",
                                                text: " you want to delete the Candidate",
                                                icon: "warning",
                                                buttons: true,
                                                dangerMode: true,
                                              })
                                                .then((willDelete) => {
                                                  if (willDelete) {

                                                    let res = deleteCandidate(job._id, { company_id: user._id });
                                                    console.log(res);
                                                    setJobs(res);
                                                    swal("Candidate has been deleted!", {
                                                      icon: "success",
                                                    });
                                                  } else {
                                                    swal("Your imaginary file is safe!");
                                                  }
                                                });




                                            }}>
                                              {/* <BsThreeDots className="text-md" /> */}
                                              <p className="text-sm font-semibold py-1">
                                                {/* <Link to={`/company/jobUpdate/${job._id}`}> */}
                                                Archive{" "}
                                                {/* </Link> */}
                                              </p>{" "}
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
                        </div>

                      </div>
                    )
                  })
                )}
              </div>
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
              <p className="font-bold text-xs">Posted Jobs</p><p className="text-gray-400 font-semibold text-xs">04</p>
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
