import React from "react";

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

import { BsThreeDots } from "react-icons/bs";

const Panel = () => {
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

  return (
    <div className="flex bg-slate-100 ">

    <div className="container mx-auto mt-2 ">
      <p className="text-sm flex my-5 mx-5 font-semibold">Hey Andrew - <p className="text-gray-400 px-2"> here's what's happening today!</p></p>
      <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-4 align-items-center">
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
            <div className="px-5 text-center my-5 text-sm"><span class="bg-yellow-300 text-yellow-800 text-xs font-medium mr-2 px-6 py-2  rounded-3xl dark:bg-yellow-200 dark:text-yellow-900 mt-4">Pending</span>
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
            <div className="px-5 text-center my-5 text-sm"><span class="bg-yellow-300 text-yellow-800 text-xs font-medium mr-2 px-6 py-2 rounded-3xl dark:bg-yellow-200 dark:text-yellow-900 my-2 ">Pending</span>
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
            <div className="px-5 text-center my-5 text-sm"><span class="bg-green-500 font-bold text-black text-xs font-medium mr-2 px-6 py-2 rounded-3xl dark:bg-green-200 dark:text-black my-2">Completed</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
          </div>


          <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center md:grid-cols-6 sm:grid-cols-3">


            <div className="px-5 text-center my-2 text-sm col-span-2"><p>Interview Request with Developer</p>
<div className="w-full justify-between">
              <button  className=" rounded-3xl my-2 border border-gray-500 px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                Inprogress
              </button> 
              <button className="bg-white border border-gray-500  rounded-3xl px-6 mx-2 my-2  py-2 text-xs text-gray">
                Reject
              </button>
              </div>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>Tuesday</p>
              <p className="text-gray-400 text-sm"> Jan 17,2022</p>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p>12am  - 1am</p><p className="text-gray-400 text-sm"> 03 Minutes Remaining</p></div>
            <div className="px-5 text-center my-5 text-sm"><span class="bg-gray-400 text-green-800 text-xs font-medium mr-2 px-6 py-0.5  bg-green-200 rounded-3xl dark:bg-green-200 dark:text-green-900 my-2 py-2">Inprogress</span>
            </div>
            <div className="px-5 text-center my-2 text-sm"><p><button style={{ background: "#3ED3C5" }} className=" rounded-lg my-2  px-6 mx-2 py-2 text-xs text-gray-900 font-semibold">
                More
              </button></p></div>
          </div>



        </div>

        <div className="sm:w-full md:flex lg:flex-wrap md:w-full lg:w-2/6 my-4 lg:mx-3 ">

          <div className="md:w-1/2 lg:w-full sm:w-full "><SessionCard /></div>
          

          <div className="shadow-lg my-5 md:w-1/2 lg:w-full md:mx-1 md:my-0 rounded-lg py-5 bg-white sm:w-full">
        <div className="flex items-start space-x-3 px-6  ">
          <div className="py-5">
            <p className="text-lg text-left font-semibold">
             Credit Score $
            </p>
            <p className="text-xs">
              
            Lorem ipsum dolor sit amet,
            </p>
          </div>
          <div className="text-2xl font-bold flex py-5"> 6200 <p className="text-green-500"><AiOutlineArrowUp/></p><p className="text-lg">62% </p></div>
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
          <p className="text-xl px-4 mx-auto text-gray-700 font-bold  flex">

            {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}


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


      


          {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}


        </div>
      </div>


    </div>
   

  </div>
  );
};

export default Panel;
