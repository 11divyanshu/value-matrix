import React, { useEffect, Fragment } from "react";

// Components
import Card from "../../Components/Dashbaord/Cards";
import SessionCard from "../../Components/Dashbaord/sessions";
import Avatar from "../../assets/images/UserAvatar.png";

// Assets
import { Chart } from "react-charts";
import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";
import swal from "sweetalert";
import { BsThreeDots } from "react-icons/bs";
import Sidebar from "../../Components/Dashbaord/sidebar";
import RecentPeople from "./RecentPeople.jsx";
import {
  PaymentSuccess,
  newOrder,
  getUserCurrentCredit,
  getUserStats,
  slotDetailsOfUser,
  getJobInvitations
} from "../../service/api.js";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyDollar,
  HiOutlineCalendar,
  HiOutlinePlay,
} from "react-icons/hi";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import { AiOutlineArrowUp } from "react-icons/ai";
import logo from "../../assets/images/logo.png";
import { Dialog, Transition } from "@headlessui/react";
const Panel = () => {
  const [user, setUser] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [invited, setInvited] = React.useState(0);
  const [scheduled, setScheduled] = React.useState(0);
  const [pending, setPending] = React.useState(0);
  const [completed, setCompleted] = React.useState(0);
  const [currentCredit, setCurrentCredit] = React.useState(null);
  const [JobInvitation, setJobInvitation] = React.useState([]);
  const [JobInvitationbin, setJobInvitationbin] = React.useState([]);
  const [interviews, setInterviews] = React.useState([]);
  React.useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  });

  React.useEffect(() => {
    const getCredit = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await getUserCurrentCredit(user._id);
      if (res) {
        setCurrentCredit(res.data.data.credit);
      }
    };
    const getStats = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await getUserStats(user._id);
      if (res) {
        console.log(res);
        setInvited(res.data.invited);
      }
      let res2 = await slotDetailsOfUser(user._id);
      if(res2){
        console.log(res2);
        let records = res2.data;
        setInterviews(records);
        let pending = 0;
        let scheduled = 0;
        let completed = 0;
        for(let i=0; i<records.length; i++){
          if(records[i].status === "Accepted"){
            scheduled+=1;
          }
          if(records[i].status === "Pending"){
            pending+=1;
          }
          if(records[i].status === "Completed"){
            completed+=1;
          }
        }
        setScheduled(scheduled);
        setPending(pending);
        setCompleted(completed);
      }
    };
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
    getCredit();
    getStats();
    initial();
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
    <div className="flex sm:p-1 bg-slate-100 overflow-hidden">
      {/* <Sidebar /> */}

      <div className="container mx-auto mt-2 ">
        <p className="text-sm flex mx-10 font-semibold my-4">
          Hey {user && user.firstName ? user.firstName : "User"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
        <div className="grid grid-cols-1 gap-2 mx-5 mb-6 lg:grid-cols-4 align-items-center rounded-lg">
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Invited - {invited}
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Pending Interviews - {pending}
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Scheduled Interviews - {scheduled}
            </div>
          </div>
          <div
            className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow"
            style={{ background: "#9BDDFB" }}
          >
            <div className=" text-md font-semibold text-gray-900">
              Completed Interviews - {completed}
            </div>
          </div>
        </div>

        <div className="lg:flex ">
          {/* <div className="sm:w-full md:w-full lg:w-5/6 px-2 py-2 my-4 md:mx-1 lg:mx-10 bg-white shadow-md rounded-lg  ">
            <div
              style={{
                margin: "auto",
                width: "90%",
                height: "300px",
                zIndex: -2,
              }}
            >
              <Chart data={data} axes={axes} style={{ zIndex: 0 }} />
            </div>
          </div> */}

          <div className="md:w-full md:mx-1 lg:w-5/6 mx-10 sm:w-full md:pr-8">
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
                    window.location.href = "/user/interviewInvitations";
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
                    window.location.href = "/user/interviews";
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
          </div>

          <div className="sm:w-full md:w-full md:mx-1 lg:w-2/6 my-4 lg:mx-4 ">
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
                                    setAmount(event.target.value);
                                  }}
                                  min={1}
                                  onKeyPress={(e) => {
                                    if (
                                      e.key === "-" ||
                                      e.key === "+" ||
                                      (e.target.value === "" &&
                                        e.key === "0") ||
                                      e.key === "e" ||
                                      e.key === "." ||
                                      e.key === "," ||
                                      e.key === "E" ||
                                      e.key === " " ||
                                      e.key === "Enter" ||
                                      e.key === "Backspace" ||
                                      e.key === "Delete" ||
                                      e.key === "ArrowLeft" ||
                                      e.key === "ArrowRight" ||
                                      e.key === "ArrowUp" ||
                                      e.key === "ArrowDown"
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                ></input>
                                <div className="" style={{ display: "flex" }}>
                                  <button
                                    className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                    style={{ backgroundColor: "#034488" }}
                                    onClick={() => {
                                      displayRazorpay(amount);
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
            <div className="shadow-lg px-3 py-5 bg-white w-full rounded-lg mb-3">
              <div className="flex items-start space-x-3 px-6  ">
                <div className="pb-5">
                  <p className="text-lg text-left">
                    <p className="text-left text-lg font-semibold">
                      Wallet Credit - {currentCredit}
                    </p>
                  </p>
                  {/* <p className="text-xs">

                    Lorem ipsum dolor sit amet,
                  </p> */}
                  {/* <button className="App-link" >
                    Pay ₹500
                </button> */}
                  <button
                    className=" hover:bg-blue-700 text-white font-bold py-2 px-4 text-xs flex text-center rounded-lg"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    {/* <p classname=" py-2"><AiOutlinePlus/></p> */}
                    {/* <p className="py-1 px-2 text-sm font-bold">
              {" "}
              <AiOutlinePlus />
            </p> */}
                    <p className="py-1">Buy Credits</p>
                  </button>
                </div>
                {/* <div className="text-2xl font-bold flex py-5">
                  {" "}
                  6200{" "}
                  <p className="text-green-500">
                    <AiOutlineArrowUp />
                  </p>
                  <p className="text-lg">62% </p>
                </div> */}
              </div>
            </div>
            <div className="shadow-lg py-5 bg-white w-full rounded-lg mb-3">
              <div className="px-8">
                <div className="pb-5">
                  <p className="text-lg text-left">
                    <p className="text-left text-lg font-semibold">
                      Scheduled Interviews
                    </p>
                  </p>
                </div>
              </div>
                {interviews.length === 0 ? <>
                  <h5>No Interviews Found</h5>
                </>:<>
                  {interviews.map((interview, index)=>{
                    if(interview.status === "Accepted" && index<=5){
                      return(
                        <div className="w-full bg-white py-1 border border-b px-8">
                          <h5 className="text-xl mb-1"><strong>{interview.job[0].jobTitle}</strong></h5>
                          <h5>{interview.job[0].hiringOrganization}</h5>
                          <a href={`/user/interviewDetails/${interview._id}`} className="text-blue-500 text-sm">View Details</a>
                        </div>
                      );
                    }
                  })}
                  <div className="text-right px-6 mt-2">
                    <a href={`/user/interviews`} className="text-blue-500 text-sm">View More</a>
                  </div>
                </>}
            </div>
            {/* <SessionCard /> */}
          </div>
        </div>
        {/* <div className="lg:flex w-full ">
          <RecentPeople />
        </div> */}
      </div>
      {/* <div className="flex flex-col-reverse lg:flex-row"> */}
      {/* <div className="w-2/5 p-3">
          <Card />
          <Card />
          <Card />
          <Card />
        </div> */}
      {/* <div className="w-3/5 p-3">
          <div className="flex space-x-3 md:flex-row flex-col ">
            <div className="w-3/5 mx-2">
              <div className="shadow-lg  py-5 flex justify-around space-x-9 px-4 bg-slate-100">
                <div className="space-y-2">
                  <p className="text-blue-400 text-3xl font-semibold">16</p>
                  <p className="font-semibold text-sm uppercase text-gray-700">
                    Total Interview
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-orange-400 text-3xl font-semibold">4</p>
                  <p className="font-semibold text-sm uppercase text-gray-700">
                    Pending Interview
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-purple-400 text-3xl font-semibold">12</p>
                  <p className="font-semibold text-sm uppercase text-gray-700">
                    Completed Interview
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 py-4">
                <div className="w-1/2 bg-orange-200 p-3 space-y-3">
                  <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700">
                      Credits Bought
                    </p>
                    <BsThreeDots className="text-orange-400 ml-auto text-lg" />
                  </div>
                  <div>
                    <div>
                      <img
                        src={LGraph}
                        alt="graph"
                        className="md:h-20  -z-10 md:w-32 h-8 w-full"
                      />
                      <p className="text-gray-800 text-lg font-bold ">
                       12k
                      </p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 p-3 space-y-3" style={{ backgroundColor: "#B4C6F0" }}>
                  <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700">
                      Current Balance
                    </p>
                    <BsThreeDots className="text-blue-400 ml-auto text-lg" />
                  </div>
                  <div>
                    <div className="w-full h-22 relative">
                      <img
                        src={Graph}
                        alt="graph"
                        className="md:h-20  -z-10 md:w-32 h-8 w-full"
                      />
                      <p className="text-gray-800 text-lg font-bold">
                        3.4 k
                      </p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-2/5 mx-1">
              <SessionCard />
            </div>
          </div> */}
      {/* <div className="flex w-3/5 md:space-x-4 space-x-4 flex-wrap justify-center">
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-purple-200 text-center px-10 my-3">
              <p className="text-md font-bold text-gray-700">
                Post a Job
              </p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-purple-600 rounded-md px-3 text-white text-sm hover:bg-purple-700 py-2">
                view
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-blue-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Buy Credits
              </p>
              <img src={Board} alt="Board" className="md:h-32 md:w-32 h-16 w-16 mx-auto" />
              <button className="bg-blue-600 rounded-md px-3 text-white text-sm hover:bg-blue-700 py-2">
                View
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-orange-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Culture Training
              </p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-orange-600 rounded-md px-3 text-white text-sm hover:bg-orange-700 py-2">
                Train Now
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-blue-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Assistance
              </p>
              <img src={Board} alt="Board" className="md:h-32 md:w-32 h-16 w-16 mx-auto" />
              <button className="bg-blue-600 rounded-md px-3 text-white text-sm hover:bg-blue-700 py-2">
                View
              </button>
            </div>
          </div>
        \
        </div>

      </div> */}
    </div>
  );
};

export default Panel;
