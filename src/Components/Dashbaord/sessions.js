import React from 'react';

// Assets
import { AiFillCalendar } from "react-icons/ai";


const SessionCard = () => {
    return (
        <div className="shadow-lg py-5 px-4 bg-slate-100">
        <div className="flex items-start space-x-3">
          <AiFillCalendar className="text-4xl text-gray-700" />
          <div>
            <p className="text-lg font-semibold">
              Available Sessions
            </p>
            <p className="text-xs">
              In your local time zone{" "}
              <span className="text-blue-600 font-semibold cursor-pointer">
                Update
              </span>
            </p>
          </div>
        </div>
        <div className="mt-3">
            <div className="flex py-1 px-2 space-x-2 w-full mr-24">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1 w-1/2">
                  <p className="uppercase font-bold text-gray-600 text-xs">THU</p>
                  <p className="font-bold text-gray-700 text-xs">17 May</p>
                  <p className="text-xs">2 slots</p>
                </div>
                <div className="w-1/2 space-y-1">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-blue-600 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-blue-600 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                </div>
            </div>
            <div className="flex py-1 px-2 space-x-2 w-full mr-24">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1 w-1/2">
                  <p className="uppercase font-bold text-gray-600 text-xs">FRI</p>
                  <p className="font-bold text-gray-700 text-xs">18 May</p>
                  <p className="text-xs">2 slots</p>
                </div>
                <div className="w-1/2 space-y-1">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-blue-600 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-blue-600 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                </div>
            </div>
            <div className="flex py-1 px-2 space-x-2 w-full mr-24">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1 w-1/2">
                  <p className="uppercase font-bold text-gray-600 text-xs">Sat</p>
                  <p className="font-bold text-gray-700 text-xs">19 May</p>
                  <p className="text-xs">1 slot</p>
                </div>
                <div className="w-1/2 space-y-1">
                <div className="border-[0.5px] border-blue-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-blue-600 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                <div className="border-[0.5px] border-gray-300 bg-blue-100 text-center p-2 space-y-1">
                  <p className="uppercase font-bold text-gray-500 text-xs">9:30 - 10:30 A.M. </p>
                </div>
                </div>
            </div>
        </div>
      </div>
    )
}

export default SessionCard;