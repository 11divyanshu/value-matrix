import React from "react";

// Components
import Card from "../../Components/Dashbaord/Cards";
import SessionCard from "../../Components/Dashbaord/sessions";

// Assets
import VideoCall from "../../assets/images/Call.svg";
import Board from "../../assets/images/board.svg";
import { BsThreeDots } from "react-icons/bs";

const Panel = () => {
  return (
    <div>
      <div className="flex flex-col-reverse lg:flex-row">
        <div className="w-3/8 p-3">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        <div className="w-5/8 p-3">
          <div className="flex space-x-3 md:flex-row flex-col ">
            <div>
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
                      Mins of interview
                    </p>
                    <BsThreeDots className="text-orange-400 ml-auto text-lg" />
                  </div>
                  <div>
                    <div>
                      <p className="text-gray-800 text-lg font-bold mt-24">
                        18 Hrs
                      </p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 bg-blue-200 p-3 space-y-3">
                  <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700">
                      Credit Earned
                    </p>
                    <BsThreeDots className="text-blue-400 ml-auto text-lg" />
                  </div>
                  <div>
                    <div>
                      <p className="text-gray-800 text-lg font-bold mt-24">
                        3.4 k
                      </p>
                      <p className="text-xs">This Month</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-3/8">
              <SessionCard />
            </div>
          </div>
          <div className="flex  md:space-x-3 space-x-3  mt-3 flex-wrap justify-center">
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-purple-200 text-center px-10 my-3">
              <p className="text-md font-bold text-gray-700">
                Give Mock Interview
              </p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-purple-600 rounded-md px-3 text-white text-sm hover:bg-purple-700 py-2">
                Give Interview
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-blue-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Give Mock Interview
              </p>
              <img src={Board} alt="Board" className="md:h-32 md:w-32 h-16 w-16 mx-auto"/>
              <button className="bg-blue-600 rounded-md px-3 text-white text-sm hover:bg-blue-700 py-2">
                Give Interview
              </button>
            </div>
            <div className="rounded-sm shadow-lg py-12 space-y-3 bg-orange-200 text-center px-10  my-3">
              <p className="text-md font-bold text-gray-700">
                Give Mock Interview
              </p>
              <img
                src={VideoCall}
                alt="videoCall"
                className="md:h-32 md:w-32 h-16 w-16 mx-auto"
              />
              <button className="bg-orange-600 rounded-md px-3 text-white text-sm hover:bg-orange-700 py-2">
                Give Interview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;
