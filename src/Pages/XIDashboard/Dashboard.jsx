import React,{Fragment} from "react";

// Components
import Card from "../../Components/SuperXIDashboard/Cards";
import SessionCard from "../../Components/CompanyDashboard/sessions";
import {AiOutlineArrowUp} from "react-icons/ai"
import Avatar from "../../assets/images/UserAvatar.png";

// Assets
import { Chart } from 'react-charts'

import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";
import swal from "sweetalert";
import { BsThreeDots } from "react-icons/bs";
import Sidebar from "../../Components/Dashbaord/sidebar";
import { PaymentSuccess, newOrder, getUserCurrentCredit } from "../../service/api.js"
import logo from "../../assets/images/logo.png";
import { Dialog, Transition } from "@headlessui/react";
const Panel = () => {
  const [user, setUser] = React.useState(null);
  const [modal, setModal] = React.useState(null);
  const [amount, setAmount] = React.useState(null);
  const [credit, setCredit] = React.useState(null);
  const [currentCredit, setCurrentCredit] = React.useState(null);
  React.useEffect(()=>{
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
  })

  React.useEffect(() => {
    const getCredit = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await getUserCurrentCredit(user._id); 
      if(res){
        console.log(res.data);
      }
    }
  })

  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
      },
      {
        label: 'Series 2',
        data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
      }
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'ordinal', position: 'bottom' },
      { type: 'ordinal', position: 'left' }
    ],
    []
  )

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
    const result = await newOrder({user_type : user.user_type  , amount:amt ,userId: user._id});
    console.log(result)
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
    console.log(transactionId)
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
          razorpaySignature: response.razorpay_signature
         
        };


    const result1 = await PaymentSuccess({data:data,id:transactionId,userId:user._id ,amount:amount});
        console.log("Swal Check");
        swal({
          title: "Payment Completed Successfully",
          message: "Success",
          icon: "success",
          button: "OK",
        })
        .then(() => {
          window.location.reload();
        })
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
    <div className="flex bg-slate-100 ">

    <div className="container-fluid mx-5 mt-2 ">
      <p className="text-sm flex my-5 mx-5 font-semibold">Hey {user && user.firstName ? user.firstName :"XI" } - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>
      <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-4">
        <div className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow" style={{background:"#9BDDFB"}}>
          
          <div className=" text-md font-semibold text-gray-900">
            Job Active - 00
          </div>
        </div>
        <div className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow" style={{background:"#9BDDFB"}}>
          
          <div className=" text-md font-semibold text-gray-900">
            Interview Schedule - 00
          </div>
        </div>
        <div className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow" style={{background:"#9BDDFB"}}>
          
          <div className=" text-md font-semibold text-gray-900">
            Candidate Uploaded - 00
          </div>
        </div>
        <div className="lg:w-5/6 px-4 mx-5 py-2 text-center bg-white rounded-lg shadow" style={{background:"#9BDDFB"}}>
          
          <div className=" text-md font-semibold text-gray-900">
            Reschedule Interviews - 00
          </div>
        </div>
      </div>



      <div className="lg:flex">

       

      <div className="md:w-full  sm:w-full lg:w-5/6  rounded-lg py-5 my-4 lg:mx-3 bg-white shadow-md">
            <div className="border-b border-gray-200 my-2 px-5 mb-2 pb-2 flex justify-between">
              <div className="">
            <p className="text-lg font-bold font-gray-400">Today's Interview Request</p>
            <p className="text-sm font-bold text-gray-300 mb-2">Lorem ipsum dorem, Lorem ipsum dorem </p>
            </div>
            <div className="text-xs text-gray-500 font-semibold mt-2">See All Logs &#12297;</div>
          </div>
          <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center md:grid-cols-6 sm:grid-cols-3">


            <div className="px-5 text-center my-2 text-sm col-span-2"><p>Interview Request with Developer</p>

              <button style={{ background: "#3ED3C5" }} className="  rounded-3xl px-6 mx-2 py-2 my-2 text-xs text-gray-900 font-semibold">
                Accept
              </button> <button className="bg-white rounded-3xl px-6 mx-2 py-2 text-xs my-2 border border-gray-500  text-gray">
                Reject
              </button>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>Tuesday</p>
              <p className="text-gray-400 text-sm"> Jan 17,2022</p>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>12am  - 1am</p><p className="text-gray-400 text-sm"> 03 Minutes Remaining</p></div>
            <div className="px-5 text-center my-5 text-sm"><span className="bg-yellow-300 text-yellow-800 text-xs font-medium mr-2 px-6 py-2  rounded-3xl dark:bg-yellow-200 dark:text-yellow-900 mt-4">Pending</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
          </div>

          <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center md:grid-cols-6 sm:grid-cols-3">


            <div className="px-5 text-center my-2 text-sm col-span-2"><p>Interview Request with Developer</p>

              <button style={{ background: "#3ED3C5" }} className=" rounded-3xl my-2   px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                Start
              </button> <button className="bg-white rounded-3xl border border-gray-500  px-6 mx-2 py-2 my-2  text-xs text-gray">
                Reject
              </button>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>Wednesday</p>         
                 <p className="text-gray-400 text-sm"> Jan 18,2022</p>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>12am  - 1am</p><p className="text-gray-400 text-sm"> 03 Minutes Remaining</p></div>
            <div className="px-5 text-center my-5 text-sm"><span className="bg-yellow-300 text-yellow-800 text-xs font-medium mr-2 px-6 py-2 rounded-3xl dark:bg-yellow-200 dark:text-yellow-900 my-2 ">Pending</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
          </div>

          <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center md:grid-cols-6 sm:grid-cols-3">


            <div className="px-5 text-center my-2 text-sm col-span-2"><p>Interview Request with Client</p>

              <button style={{ background: "#3ED3C5" }} className="  rounded-3xl my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                Re-Start
              </button> <button className="bg-white border border-gray-500  rounded-3xl px-6 mx-2 py-2 my-2  text-xs text-gray">
                Discard
              </button>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>Monday</p>         
                 <p className="text-gray-400 text-sm"> Jan 16,2022</p>
            </div>
            <div className="px-5 text-center my-2 text-sm "><p>12am  - 1am</p><p className="text-gray-400 text-sm"> 03 Minutes Remaining</p></div>
            <div className="px-5 text-center my-5 text-sm"><span className="bg-green-500 font-bold text-black text-xs font-medium mr-2 px-6 py-2 rounded-3xl dark:bg-green-200 dark:text-black my-2">Completed</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
          </div>


          <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center md:grid-cols-6 sm:grid-cols-3">


            <div className="px-5 text-center my-2 text-sm col-span-2"><p>Interview Request with Developer</p>

              <button  className=" rounded-3xl my-2 border border-gray-500 px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                Inprogress
              </button> <button className="bg-white border border-gray-500  rounded-3xl px-6 mx-2 my-2  py-2 text-xs text-gray">
                Reject
              </button>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>Tuesday</p>
              <p className="text-gray-400 text-sm"> Jan 17,2022</p>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>12am  - 1am</p><p className="text-gray-400 text-sm"> 03 Minutes Remaining</p></div>
            <div className="px-5 text-center my-5 text-sm"><span className=" text-gray-800 text-xs font-semibold mr-2 px-6 py-0.5  rounded-3xl  my-2 py-2" style={{backgroundColor:"#A5C0BD"}}>Inprogress</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
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
              onClose={() => { }}
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
                            <img src={logo} width="100"/>
                            <h3 className="my-5">Enter the number of credit you want to purchase</h3>
                          <input
                                  id="amount"
                                  name="amount"
                                  className="block border border-gray-200 my-4 py-1 px-3 w-full"
                                
                                onChange={async(event) => {
                                  console.log(event.target.value);
                                  setCredit(event.target.value);
                                 
                                }}
                                >
                                 
                                </input>
                            <div className="" style={{ display:"flex" }}>
                              <button
                                className=" hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {displayRazorpay(credit)}}
                              >Buy</button>
                              <button
                                className="mx-3 hover:bg-blue-700 text-white font-bold py-2 my-4 px-4 text-md flex text-center rounded-lg"
                                style={{ backgroundColor: "#034488" }}
                                onClick={() => {setModal(false)}}
                              >Close</button>
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
            <SessionCard />
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
      <div className="lg:flex ">
       
      <div className="sm:w-full md:w-full lg:w-5/6 rounded-lg px-5 py-2 my-4 h-80 lg:mx-4 bg-white shadow-md ">
          <div 
            style={{
              margin:"auto",
              width: '90%',
              height: '270px'
            }}
          >
            <Chart data={data} axes={axes} />
          </div>
        </div>
        <div className="shadow-lg sm:w-full rounded-lg md:w-full lg:w-2/6  py-5  bg-white  justify-around lg:mx-4 my-4 h-auto  px-4 bg-white">
          <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
            <p className="px-6 mx-2  text-xl">Recent People</p></p>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
            <div> <p className="py-2 font-md">Rahul Pandey</p>
              <p className="text-gray-400 text-sm">Web Developer , UI/UX Designer</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
            <div> <p className="py-2 font-md">Rahul Pandey</p>
              <p className="text-gray-400 text-sm">Web Developer , UI/UX Designer</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
            <div> <p className="py-2 font-md">Rahul Pandey</p>
              <p className="text-gray-400 text-sm">Web Developer , UI/UX Designer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Panel;
