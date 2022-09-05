import React from "react";

// Components
import Card from "../../Components/Dashbaord/Cards";
import SessionCard from "../../Components/CompanyDashboard/sessions";
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

      <div className="container-fluid mx-auto mt-12">
        <div className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-4">
          <div className="w-5/6 px-4 mx-5 py-3 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total users
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              18 Total Interview
            </div>
          </div>
          <div className="w-5/6 px-4 mx-5 py-3 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total users
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              08 Interview Pending
            </div>
          </div>
          <div className="w-5/6 px-4 mx-5 py-3 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Profit
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              22 interview Completed
            </div>
          </div>
          <div className="w-5/6 px-4 mx-5 py-3 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Orders
            </div>
            <div className="mt-1 text-lg font-semibold text-gray-900">
              01 Interview in Progress
            </div>
          </div>
        </div>



        <div className="flex w-full">

          <div className="w-4/6 px-5 py-2 mx-5 bg-white shadow-md">

            <div
              style={{
                width: '100%',
                height: '250px'
              }}
            >
              <Chart data={data} axes={axes} />
            </div>


          </div>

          <div className="w-2/6">
            <SessionCard />
          </div>

        </div>
        <div className="flex w-full mt-5">
          <div className="w-4/6 py-5 mx-5  bg-white shadow-md">
            <div className="border-b border-gray-200 my-3 px-5 py-2">
              <p className="text-xl font-bold font-gray-400">Interview Call Logs</p>
              <p className="text-md font-bold text-gray-300">Lorem ipsum dorem, Lorem ipsum dorem </p>
            </div>
            <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center lg:grid-cols-6">


              <div className="px-5 text-center col-span-2"><p>Interview Request with Developer</p>

                <button style={{ background: "#40D1C9" }} className=" rounded-3xl px-3 py-2 my-2 text-xs text-white">
                  Accept
                </button> <button className="bg-white rounded-3xl px-3 py-2 text-xs my-2  text-gray">
                  Reject
                </button>
              </div>
              <div className="px-5 text-center"><p>Tuesday</p>
                <p className="text-gray-400"> Jan 17,2022</p>
              </div>
              <div className="px-5 text-center"><p>12am  - 1am</p><p className="text-gray-400"> 03 Minutes Remaining</p></div>
              <div className="px-5 text-center"><span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">Pending</span>
              </div>
              <div className="px-5 text-center"><p><BsThreeDots /></p></div>
            </div>

            <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center lg:grid-cols-6">


              <div className="px-5 text-center col-span-2"><p>Interview Request with Developer</p>

                <button style={{ background: "#40D1C9" }} className=" rounded-3xl my-2  px-3 py-2 text-xs text-white">
                  Accept
                </button> <button className="bg-white rounded-3xl px-3 py-2 my-2  text-xs text-gray">
                  Reject
                </button>
              </div>
              <div className="px-5 text-center"><p>Tuesday</p>         
                   <p className="text-gray-400"> Jan 17,2022</p>
              </div>
              <div className="px-5 text-center"><p>12am  - 1am</p><p className="text-gray-400"> 03 Minutes Remaining</p></div>
              <div className="px-5 text-center"><span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">Pending</span>
              </div>
              <div className="px-5 text-center"><p><BsThreeDots /></p></div>
            </div>

            <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center lg:grid-cols-6">


              <div className="px-5 text-center col-span-2"><p>Interview Request with Developer</p>

                <button style={{ background: "#40D1C9" }} className=" rounded-3xl my-2  px-3 py-2 text-xs text-white">
                  Accept
                </button> <button className="bg-white rounded-3xl px-3 py-2 my-2  text-xs text-gray">
                  Reject
                </button>
              </div>
              <div className="px-5 text-center"><p>Tuesday</p>         
                   <p className="text-gray-400"> Jan 17,2022</p>
              </div>
              <div className="px-5 text-center"><p>12am  - 1am</p><p className="text-gray-400"> 03 Minutes Remaining</p></div>
              <div className="px-5 text-center"><span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">Pending</span>
              </div>
              <div className="px-5 text-center"><p><BsThreeDots /></p></div>
            </div>


            <div className="grid grid-cols-1 border-b border-gray-200 mb-6 align-items-center text-center lg:grid-cols-6">


              <div className="px-5 text-center col-span-2"><p>Interview Request with Developer</p>

                <button style={{ background: "#40D1C9" }} className=" rounded-3xl my-2  px-3 py-2 text-xs text-white">
                  Accept
                </button> <button className="bg-white rounded-3xl px-3 my-2  py-2 text-xs text-gray">
                  Reject
                </button>
              </div>
              <div className="px-5 text-center"><p>Tuesday</p>
                <p className="text-gray-400"> Jan 17,2022</p>
              </div>
              <div className="px-5 text-center"><p>12am  - 1am</p><p className="text-gray-400"> 03 Minutes Remaining</p></div>
              <div className="px-5 text-center"><span class="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900">Pending</span>
              </div>
              <div className="px-5 text-center"><p><BsThreeDots /></p></div>
            </div>



          </div>


          <div className="shadow-lg w-2/6  py-5  bg-white  justify-around  px-4 bg-white">
            <p className="text-xl px-4 mx-auto text-gray-700 font-bold  flex">

              {/* <div className=" px-3 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}


              <p className="px-3  text-xl">Recent People</p></p>
            <div className="flex my-4 px-5 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 font-md">Rahul Pandey</p>
                <p className="text-gray-400">Web Developer , UI/UX Designer</p>
              </div>
            </div>

            <div className="flex my-4 px-5 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 font-md">Rahul Pandey</p>
                <p className="text-gray-400">Web Developer , UI/UX Designer</p>
              </div>
            </div>


            <div className="flex my-4 px-5 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 font-md">Rahul Pandey</p>
                <p className="text-gray-400">Web Developer , UI/UX Designer</p>
              </div>
            </div>


            <div className="flex my-4 px-5 vertical-align-middle" >
              <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
              <div> <p className="py-2 font-md">Rahul Pandey</p>
                <p className="text-gray-400">Web Developer , UI/UX Designer</p>
              </div>
            </div>


            {/* <button className="bg-blue-600 rounded-lg px-3 my-3 py-2 text-xs text-white">View List</button> */}


          </div>
        </div>


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
