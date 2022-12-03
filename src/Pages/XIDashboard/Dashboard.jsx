import React, { Fragment, useEffect } from "react";

// Components
import Card from "../../Components/SuperXIDashboard/Cards";
import SessionCard from "../../Components/CompanyDashboard/sessions";
import { AiOutlineArrowUp, AiOutlinePlus } from "react-icons/ai";
import Avatar from "../../assets/images/UserAvatar.png";

// Assets
import { Chart } from "react-charts";

import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";
import swal from "sweetalert";
import { BsCashStack, BsThreeDots } from "react-icons/bs";
import Sidebar from "../../Components/Dashbaord/sidebar";
import RecentPeople from "./RecentPeople.jsx";
import {
  PaymentSuccess,
  newOrder,
  getUserCurrentCredit,
  XISlots,
  getXIInterviewList,
  getJobInvitations,
} from "../../service/api.js";
import logo from "../../assets/images/logo.png";
import { Dialog, Transition } from "@headlessui/react";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";

const Panel = () => {
  const [slots, setSlots] = React.useState(null);
  const [slotstructure, setslotstructure] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [credit, setCredit] = React.useState(null);
  const [currentCredit, setCurrentCredit] = React.useState(null);
  const [invitations, setinvitations] = React.useState(0);
  const [scheduledinterviews, setscheduledinterviews] = React.useState(0);
  const [matchedinterviews, setmatchedinterviews] = React.useState(0);
  const [bookedslots, setbookedslots] = React.useState(0);
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [JobInvitationbin, setJobInvitationbin] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);

  const setSlotsdate = (data)=>{
    let alldates = [];
    let allslots = [];
    let tempslot = [];
    let tempdate = null;
    let customdate = null;
    let tempstart = null;
    let tempend = null;
    console.log(data);
    for(let i=0; i<data.length; i++){
      tempdate = new Date(data[i].startDate.toLocaleString());
      customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth())+1) + "-" + tempdate.getFullYear();
      if(!alldates.includes(customdate)){
        alldates.push(customdate);
        alldates.sort();
        alldates.reverse();
      }
    }
    for(let i=0; i<alldates.length; i++){
      tempslot = [];
      for(let j=0; j<data.length; j++){
        tempstart = "";
        tempend = "";
        tempdate = new Date(data[j].startDate.toLocaleString());
        customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth())+1) + "-" + tempdate.getFullYear();
        if(alldates[i] == customdate){
          tempdate = new Date(data[j].startDate.toLocaleString());
          if(tempdate.getHours() < 9){
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getHours();
          tempstart = tempstart + ":";
          if(tempdate.getMinutes() < 9){
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getMinutes();
          tempdate = new Date(data[j].endDate.toLocaleString());
          if(tempdate.getHours() < 9){
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getHours();
          tempend = tempend + ":";
          if(tempdate.getMinutes() < 9){
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getMinutes();
          tempslot.push({
            startTime: tempstart,
            endTime: tempend,
            data: data[j]
          })
        }
      }
      allslots.push({
        slots: tempslot,
        date: alldates[i]
      });
    }
    setslotstructure(allslots);
  }

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

    const getslots = async ()=>{
      let res = await XISlots(user._id);
      if (res) {
        setSlots(res.data);
        setbookedslots(res.data.length);
        setSlotsdate(res.data);
      }

      let res2 = await getXIInterviewList(
        { user_id: user._id },
        user.access_token
      );
      if(res2){
        setmatchedinterviews(res2.data.length);
      }

      let res3 = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );
      if(res3){
        console.log(res3);
        setinvitations(res3.data.jobInvites.length);
      }
    }
    
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      console.log(user);
      let res = await getJobInvitations(
        { user_id: user._id },
        user.access_token
      );
      if (res && res.status === 200) {
        setJobInvitation(res.data.jobInvites);
        setJobInvitationbin(res.data.jobInvitesbin);
      }
    };

    getslots();
    initial();
  },[]);

  useEffect(() => {
    const getCredit = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await getUserCurrentCredit(user._id);
      if (res) {
        console.log(res.data);
      }
    };
  },[]);

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

        const result1 = await PaymentSuccess({
          data: data,
          id: transactionId,
          userId: user._id,
          amount: amount,
        });
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
  }

  return (
    <div className="flex bg-slate-100 w-full">
      <div className="container-fluid mx-5 mt-2 w-full">
        <p className="text-sm flex my-5 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
        <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-4">
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Invitations - { invitations }
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Scheduled Interviews - { scheduledinterviews }
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Matched Interviews - { matchedinterviews }
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Booked Slots - { bookedslots }
            </div>
          </div>
        </div>

        <div className="lg:flex w-full">
          <div className="md:w-full sm:w-full lg:w-5/6 rounded-lg py-5 my-4 lg:mx-3 md:pr-8">
            <div className="shadow-lg w-full rounded-lg py-5 my-4 lg:mx-10 bg-white">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Recent Interview Invitations
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
                <div
                  className="text-xs text-gray-500 font-semibold mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.location.href = "/xi/interviewInvitations";
                  }}
                >
                  See All Invitations &#12297;
                </div>
              </div>

              {JobInvitation.length === 0 && JobInvitationbin.length === 0 ? (
                <div className="text-center py-5 text-2xl md:w-4/4">
                  No Interview Invitations
                </div>
              ) : (
                <div className="w-full">
                  {JobInvitation.map((job, index) => {
                    if (job.status && job.status === "Active") {
                      return (
                        <div
                          id={"invcrd" + (index + 1)}
                          className={
                            index < 5
                              ? "w-full px-5 bg-white py-1 border border-b"
                              : "w-full px-5 bg-white py-1 border border-b hidden"
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                            <div className="col-span-2">
                              <h5 className="text-black-900 text-md font-bold mb-1 ">
                                {job.jobTitle}
                              </h5>
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

                                <p className="px-4 text-sm text-gray-400 font-semibold">
                                  {typeof job.salary === "object"
                                    ? job.salary[2]
                                    : job.salary}
                                </p>
                              </div>
                            </div>
                            <div className="flex col-span-2">
                              {/* button here */}
                              <a href={`/xi/jobDetails/${job._id}`}
                                style={{ background: "#3ED3C5" }}
                                className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs font-bold flex items-center text-white"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                  {JobInvitationbin.map((job, index) => {
                    if (1) {
                      return (
                        <div
                          id={"invcrd" + (index + 1)}
                          className={
                            index < 5
                              ? "w-full px-5 bg-white py-1 border border-b"
                              : "w-full px-5 bg-white py-1 border border-b hidden"
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                            <div className="col-span-2">
                              <h5 className="text-black-900 text-md font-bold mb-1 ">
                                {job.jobTitle}
                              </h5>
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

                                <p className="px-4 text-sm text-gray-400 font-semibold">
                                  {typeof job.salary === "object"
                                    ? job.salary[2]
                                    : job.salary}
                                </p>
                              </div>
                            </div>
                            <div className="flex col-span-2">
                              {/* button here */}
                              <a href={`/xi/jobDetails/${job._id}`}
                                style={{ background: "#3ED3C5" }}
                                className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs font-bold flex items-center text-white"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
            <div className="shadow-lg w-full rounded-lg py-5 my-4 lg:mx-10 bg-white">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Pending Interview Invitations
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
                <div
                  className="text-xs text-gray-500 font-semibold mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.location.href = "/xi/interviews";
                  }}
                >
                  See All Pending Interviews &#12297;
                </div>
              </div>

              {interviews.length === 0 ? (
                <div className="text-center py-5 text-2xl md:w-4/4">
                  No Pending Invitations
                </div>
              ) : (
                <div className="w-full">
                  {interviews.map((job, index) => {
                    if (job.status && job.status === "Pending") {
                      return (
                        <div
                          className={
                            index < 5
                              ? "w-full px-5 bg-white py-1 border border-b"
                              : "w-full px-5 bg-white py-1 border border-b hidden"
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                            <div className="col-span-2">
                              <h5 className="text-black-900 text-md font-bold mb-1 ">
                                {job.job[0].jobTitle}
                              </h5>
                              <p className="text-sm font-bold  text-gray-400 font-semibold">
                                {job.job[0].hiringOrganization}
                              </p>
                            </div>
                            <div className="col-span-4">
                              <div className="flex py-1">
                                <div className="text-md py-1 text-gray-400 font-semibold ">
                                  <HiOutlineCalendar />
                                </div>

                                <p className="px-2 text-md text-gray-400 font-semibold">
                                  Scheduled on {" "}
                                  {new Date(job.startDate).getDate() +
                                    "-" +
                                    (new Date(job.startDate).getMonth() + 1) +
                                    "-" +
                                    new Date(job.startDate).getFullYear()}
                                </p>
                              </div>
                              <div className="flex py-1">
                                <div className="text-md py-1 text-gray-400 font-semibold ">
                                  <BsCashStack />
                                </div>

                                <p className="px-4 text-sm text-gray-400 font-semibold">
                                  {typeof job.job[0].salary === "object"
                                    ? job.job[0].salary[2]
                                    : job.job[0].salary}
                                </p>
                              </div>
                            </div>
                            <div className="flex col-span-2">
                              {/* button here */}
                              <a href={`/user/jobDetails/${job._id}`}
                                style={{ background: "#3ED3C5" }}
                                className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs font-bold flex items-center text-white"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
            <div className="shadow-lg w-full rounded-lg py-5 my-4 lg:mx-10 bg-white">
              <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
                <div className="">
                  <p className="text-lg font-bold font-gray-400">
                    Matched Interview Invitations
                  </p>
                  {/* <p className="text-sm font-bold text-gray-300 mb-2">
                    Lorem ipsum dorem, Lorem ipsum dorem{" "}
                  </p> */}
                </div>
                <div
                  className="text-xs text-gray-500 font-semibold mt-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.location.href = "/xi/interviews";
                  }}
                >
                  See All Matched Interviews &#12297;
                </div>
              </div>

              {interviews.length === 0 ? (
                <div className="text-center py-5 text-2xl md:w-4/4">
                  No Matched Invitations
                </div>
              ) : (
                <div className="w-full">
                  {interviews.map((job, index) => {
                    if (job.status && job.status === "Pending") {
                      return (
                        <div
                          className={
                            index < 5
                              ? "w-full px-5 bg-white py-1 border border-b"
                              : "w-full px-5 bg-white py-1 border border-b hidden"
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-8 sm:grid-cols-4  my-3">
                            <div className="col-span-2">
                              <h5 className="text-black-900 text-md font-bold mb-1 ">
                                {job.job[0].jobTitle}
                              </h5>
                              <p className="text-sm font-bold  text-gray-400 font-semibold">
                                {job.job[0].hiringOrganization}
                              </p>
                            </div>
                            <div className="col-span-4">
                              <div className="flex py-1">
                                <div className="text-md py-1 text-gray-400 font-semibold ">
                                  <HiOutlineCalendar />
                                </div>

                                <p className="px-2 text-md text-gray-400 font-semibold">
                                  Scheduled on {" "}
                                  {new Date(job.startDate).getDate() +
                                    "-" +
                                    (new Date(job.startDate).getMonth() + 1) +
                                    "-" +
                                    new Date(job.startDate).getFullYear()}
                                </p>
                              </div>
                              <div className="flex py-1">
                                <div className="text-md py-1 text-gray-400 font-semibold ">
                                  <BsCashStack />
                                </div>

                                <p className="px-4 text-sm text-gray-400 font-semibold">
                                  {typeof job.job[0].salary === "object"
                                    ? job.job[0].salary[2]
                                    : job.job[0].salary}
                                </p>
                              </div>
                            </div>
                            <div className="flex col-span-2">
                              {/* button here */}
                              <a href={`/user/jobDetails/${job._id}`}
                                style={{ background: "#3ED3C5" }}
                                className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs font-bold flex items-center text-white"
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="sm:w-full md:flex lg:flex-wrap md:w-full lg:w-2/6 my-4 lg:mx-3 ">
            <div className="md:w-1/2 lg:w-full sm:w-full ">
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
                                    Enter the number of credit you want to
                                    purchase
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
              <div className="shadow-lg mb-5 md:w-1/2 lg:w-full py-2 md:my-0 rounded-lg bg-white sm:w-full">
                <div className="px-6 mt-2">
                  <h5 className="text-lg font-semibold w-full flex justify-between">
                    <span>Booked Slots</span>
                    <button
                      className=" hover:bg-blue-700 rounded-lg text-white p-3"
                      style={{ backgroundColor: "#034488" }}
                    >
                      <a href="/XI/slots?addslot=1"><AiOutlinePlus /></a>
                    </button>
                  </h5>
                </div>
                <div className="">
                  {slotstructure && slotstructure.map((slotdetails, index) => {
                    if(index<3){
                      return (
                        <div className='mx-2 my-4 px-4'>
                          <h5 className="mb-2">{ slotdetails.date }</h5>
                          <div className="flex w-full" style={{overflowX:"auto"}}>
                            {slotdetails.slots.map((slottime,index)=>{
                              return (<span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">{ slottime.startTime } - { slottime.endTime }</span>);
                            })}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
                <div className="text-right px-6 my-2">
                  <a href={`/XI/slots`} className="text-blue-500 text-sm">View More</a>
                </div>
              </div>
              <div className="shadow-lg my-5 md:w-1/2 lg:w-full py-2 md:my-0 rounded-lg bg-white sm:w-full h-28">
                <div className="flex items-start space-x-3 px-6  ">
                  <div className="mt-3">
                    <p className="text-lg text-left">
                      <p className="text-left text-lg font-semibold">
                        Wallet Credit - {currentCredit}
                      </p>
                    </p>
                    <button
                      className=" hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs flex text-center rounded-lg"
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
            </div>
          </div>
        </div>
        {/* <div className="lg:flex ">
          <div className="sm:w-full md:w-full lg:w-5/6 rounded-lg px-5 py-2 my-4 h-80 lg:mx-4 bg-white shadow-md ">
            <div
              style={{
                margin: "auto",
                width: "90%",
                height: "270px",
              }}
            >
              <Chart data={data} axes={axes} />
            </div>
          </div>

          <RecentPeople />
        </div> */}
      </div>
    </div>
  );
};

export default Panel;
