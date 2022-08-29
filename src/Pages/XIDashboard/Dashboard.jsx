import React from "react";

// Components
import Card from "../../Components/Dashbaord/Cards";
import SessionCard from "../../Components/Dashbaord/sessions";

// Assets
import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import { BsThreeDots } from "react-icons/bs";
import Graph from "../../assets/images/graph.png";
import LGraph from "../../assets/images/lgraph.png";

const XIDashboard = () => {
  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="w-3/8 p-3 pt-0">
          <Card name={"Sumit Yadav"} type={"interviewer"} />
          <Card name={"Amit Mittal"} type={"interviewer"} />
          <Card name={"Yash Jain"} type={"interviewer"} />
          <Card name={"Yomesh Gandhi"} type={"interviewer"} />
        </div>
        <div className="w-5/8 p-3">
          <div className="flex space-x-3 md:flex-row flex-col ">
            <div className="bg-slate-100 p-2">
              <p className="font-semibold">Today's Stats</p>
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
                    Pending Feedbacks
                  </p>
                </div>
              </div>
              <div className="flex space-x-3 py-4">
                <div className="w-1/2 bg-orange-200 p-3 space-y-3">
                  <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700">
                      Mins of interview
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
                      <p className="text-gray-800 text-lg font-bold ">18 Hrs</p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
                <div
                  className="w-1/2 p-3 space-y-3"
                  style={{ backgroundColor: "#B4C6F0" }}
                >
                  <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700">
                      Credit Earned
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
                      <p className="text-gray-800 text-lg font-bold">3.4 k</p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/8">
              <div className="shadow-lg py-5 px-4 bg-blue-100">
                <p className="text-lg font-semibold">Available Interviewers</p>
                <div>
                    <p className="my-2">Mahesh Pawar</p>
                    <p className="my-2">Khushi Sikarwar</p>
                    <p className="my-2">Shreya Rajawat</p>
                    <p className="my-2">Vimarsh Chaturvedi </p>
                    <p className="my-2">Arpit Lal </p>
                    <p className="my-2">John Byers</p>
                    <p className="my-2">Mayank Bansal</p>
                    <button className="text-sm text-white bg-blue-500 px-2 py-1 rounded-sm">View All</button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex  md:space-x-3 space-x-3  mt-3 flex-wrap justify-center">
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-purple-200 text-center px-10 my-3">
              <p className="text-md font-bold text-gray-700">System Support</p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-purple-600 rounded-md px-3 text-white text-sm hover:bg-purple-700 py-2">
                Connect
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-blue-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">Interview Help</p>
              <img
                src={Board}
                alt="Board"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-blue-600 rounded-md px-3 text-white text-sm hover:bg-blue-700 py-2">
                Connect
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-orange-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Schedule Inteviews
              </p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-orange-600 rounded-md px-3 text-white text-sm hover:bg-orange-700 py-2">
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XIDashboard;
