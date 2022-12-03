import React, { useEffect, Fragment } from "react";

// Components
import Card from "../../Components/SuperXIDashboard/Cards";
import SessionCard from "../../Components/CompanyDashboard/sessions";
import { AiOutlineArrowUp } from "react-icons/ai";
import Avatar from "../../assets/images/UserAvatar.png";
import {
  PaymentSuccess,
  newOrder,
  getUserCurrentCredit,
  listJobs,
  listBinJobs,
} from "../../service/api.js";

// Assets
import { Chart } from "react-charts";
import { Dialog, Transition } from "@headlessui/react";

import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";

import { BsCashStack, BsThreeDots } from "react-icons/bs";
import logo from "../../assets/images/logo.png";
import swal from "sweetalert";
import RecentPeople from "./RecentPeople";
import { CgWorkAlt } from "react-icons/cg";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
const Panel = () => {
  const [user, setUser] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  
  const [jobs, setjobs] = React.useState(null);
  const [cjobs, setcjobs] = React.useState(null);
  const [pjobs, setpjobs] = React.useState(null);
  const [pendingjobs, setpendingjobs] = React.useState(0);
  const [activejobs, setactivejobs] = React.useState(0);
  const [notacceptingjobs, setnotacceptingjobs] = React.useState(0);
  const [closedjobs, setclosedjobs] = React.useState(0);
  const [archivedjobs, setarchivedjobs] = React.useState(0);

  const [credit, setCredit] = React.useState(null);
  const [currentCredit, setCurrentCredit] = React.useState(null);
  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    
    const initial = async ()=>{
      let res = await listJobs(user._id);
      let binJobs = await listBinJobs(user._id);
      setjobs(res.data.jobs);
      setpjobs(binJobs.data.jobs);
      setpendingjobs(binJobs.data.jobs.length);
      let activejob = 0;
      let notaccepting = 0;
      let closedjob = 0;
      let archivedjob = 0;
      let setcjob = [];
      for(let i=0; i<res.data.jobs.length; i++){
        if(res.data.jobs[i].status === "Active"){
          activejob += 1;
        }
        if(res.data.jobs[i].status === "Not Accepting"){
          notaccepting += 1;
        }
        if(res.data.jobs[i].status === "Closed"){
          closedjob += 1;
          setcjob.push(res.data.jobs[i]);
        }
        if(res.data.jobs[i].status === "Archived"){
          archivedjob += 1;
        }
      }
      setactivejobs(activejob);
      setnotacceptingjobs(notaccepting);
      setclosedjobs(closedjob);
      setarchivedjobs(archivedjob);
      setcjobs(setcjob);
    }

    initial();
  },[]);

  React.useEffect(() => {
    const getCredit = async () => {
      console.log("Checking function");
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await getUserCurrentCredit(user._id);
      if (res) {
        setCurrentCredit(res.data.data.credit);
      }
    };
    getCredit();
  }, []);
  const data = React.useMemo(
    () => [
      {
        label: "Series 1",
        data: [
          [0, 1],
          [1, 2],
          [2, 4],
          [3, 2],
          [4, 7],
        ],
      },
      {
        label: "Series 2",
        data: [
          [0, 3],
          [1, 1],
          [2, 5],
          [3, 6],
          [4, 4],
        ],
      },
    ],
    []
  );

  const axes = React.useMemo(
    () => [
      { primary: true, type: "ordinal", position: "bottom" },
      { type: "ordinal", position: "left" },
    ],
    []
  );

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
  async function displayRazorpay(amt) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await newOrder({
      user_type: user.user_type,
      amount: amt,
      userId: user._id,
    });
    console.log(result);
    if (!result) {
      alert("Server error. Are you online?");
      return;
    }
    console.log(result.data);

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.order;
    // let amount = result.data.order.amount
    // let order_id = result.data.order.order_id
    // let currency = result.data.order.currency
    let transactionId = result.data.id;
    console.log(transactionId);
    const options = {
      key: "rzp_test_6ri9glEbS06F1H", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Value Matrix",
      description: "Test Transaction",
      image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        console.log(transactionId);
        const result1 = await PaymentSuccess({
          data: data,
          id: transactionId,
          userId: user._id,
          credit: credit,
        });
        console.log(result1);
        console.log("Swal Check");
        swal({
          title: "Payment Completed Successfully",
          message: "Success",
          icon: "success",
          button: "OK",
        }).then(() => {
          window.location.reload();
        });
      },
      prefill: {
        name: "Value Matrix",
        email: "vmdeveloper171@gmail.com",
        contact: "9999999999",
      },
      notes: {
        address: "Value Matrix Corporate Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setModal(false);
  }

  return (
    <div className="flex bg-slate-100 ">
      <div className="container mx-auto mt-2 ">
        <p className="text-sm flex my-5 mx-10 font-semibold">
          Hey {user && user.firstName ? user.firstName : "Company"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
        <div className="grid grid-cols-1 gap-2 mb-6 mx-5 lg:grid-cols-5 align-items-center">
          <div
            className="lg:w-5/6 px-4 mx-5 py-3 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <p className=" text-md font-bold text-gray-900">Pending Jobs - { pendingjobs }</p>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-3 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <p className=" text-md font-bold text-gray-900">Active Jobs - { activejobs }</p>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-3 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-black text-gray-900">
              Not Accepting Jobs - { notacceptingjobs }
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-3 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-black text-gray-900">
              Closed Jobs - { closedjobs }
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-3 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-black text-gray-900">
              Archived Jobs - { archivedjobs }
            </div>
          </div>
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
              onClose={() => {}}
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
                    <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                      <div className={`${!modal ? "hidden" : "block"}`}>
                        <div className="w-full">
                          <div className="w-full my-5">
                            <img src={logo} width="100" />
                            <h3 className="my-5">
                              Enter the number of credit you want to purchase
                            </h3>
                            <input
                              id="amount"
                              name="amount"
                              className="block border border-gray-200 my-4 py-1 px-3 w-full"
                              onChange={async (event) => {
                                console.log(event.target.value);
                                setCredit(event.target.value);
                              }}
                            ></input>
                            <div className="" style={{ display: "flex" }}>
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {
                                  displayRazorpay(credit);
                                }}
                              >
                                Buy
                              </button>
                              <button
                                className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {
                                  setModal(false);
                                }}
                              >
                                Close
                              </button>
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

        <div className="lg:flex">
          <div className="md:w-full sm:w-full lg:w-4/6">
            <div className="rounded-lg py-5 my-4 lg:mx-10 bg-white shadow-md">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Posted Jobs
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-2">
                  <a href="/company/jobs">See All Active Jobs &#12297;</a>
                </div>
              </div>
              {jobs?<div className="px-6">
                {jobs.map((job, index)=>{
                  if(index<3){
                    return(
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
                        <div className="col-span-2">
                          <h5 className="text-black-900 text-md font-bold mb-1 ">
                            {job.jobTitle}
                          </h5>
                          <p className="text-sm  text-gray-400 font-semibold">
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
                        <div className="col-span-2 flex justify-center items-center">
                          <a className="rounded-xl px-4 py-4 my-3 text-xs text-white font-semibold" style={{ background: "#3ED3C5" }} href={`/company/jobDetails/${job._id}`}>View Details</a>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>:null}
            </div>
            <div className="rounded-lg py-5 my-4 lg:mx-10 bg-white shadow-md">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Pending Jobs
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-2">
                  <a href="/company/pendingjobs">See All Pending Jobs &#12297;</a>
                </div>
              </div>
              {pjobs?<div className="px-6 h-fit">
                {pjobs.map((job, index)=>{
                  if(index<3){
                    return(
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8 sm:grid-cols-4 my-3">
                        <div className="col-span-2">
                          <h5 className="text-black-900 text-md font-bold mb-1 ">
                            {job.jobTitle}
                          </h5>
                          <p className="text-sm  text-gray-400 font-semibold">
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
                        <div className="col-span-2 flex justify-center items-center">
                          <a className="rounded-xl px-4 py-4 my-3 text-xs text-white font-semibold" style={{ background: "#3ED3C5" }} href={`/company/jobDetails/${job._id}`}>View Details</a>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>:null}
            </div>
          </div>

          <div className="sm:w-full md:flex-wrap lg:flex-wrap md:w-full lg:w-2/6 my-4 ">

            <div className="shadow-lg my-5 w-full md:mx-1 lg:mx-5 md:my-0 rounded-lg py-2 bg-white h-fit">
              <div className="flex items-start space-x-3 px-6  ">
                <div className="mt-3">
                  <p className="text-lg text-left">
                    <p className="text-left text-lg font-semibold">
                      Wallet Credit - {currentCredit}
                    </p>
                  </p>
                  <button
                    className=" hover:bg-blue-700 text-white font-bold my-3 py-2 px-4 text-xs flex text-center rounded-lg"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    <p className="py-1">Buy Credits</p>
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-lg lg:mx-4 bg-white shadow-md w-full h-fit py-2">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Closed Jobs
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
              </div>
              {cjobs.length != 0 ?<div className="px-6">
                {cjobs.map((job, index)=>{
                  if(index<3){
                    return(
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-4 my-3">
                        <div className="col-span-2">
                          <h5 className="text-black-900 text-md font-bold mb-1 ">
                            {job.jobTitle}
                          </h5>
                          <p className="text-sm  text-gray-400 font-semibold">
                            {job.hiringOrganization}
                          </p>
                        </div>
                        <div className="col-span-2 flex justify-center items-center">
                          <a className="rounded-xl px-4 py-2 text-xs text-white font-semibold" style={{ background: "#3ED3C5" }} href={`/company/jobDetails/${job._id}`}>View Details</a>
                        </div>
                      </div>
                    );
                  }
                })}
                <div className="flex justify-end">
                  <a href="/company/jobs" className="text-blue-500 text-xs">View More</a>
                </div>
              </div>:<h5 className="text-center font-bold mt-4">No Records Found</h5>}
            </div>

            {/* <div className="md:w-1/2 lg:w-full sm:w-full mx-5 rounded-lg">
              <SessionCard />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
