import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import {
  availableSlots,

} from "../../service/api";
// Assets
import { AiFillCalendar } from "react-icons/ai";


const SessionCard = () => {

  const [slot, setSlot] = useState([]);
  useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(localStorage.getItem("user"));

      let slots = await availableSlots(user._id);
      setSlot(slots.data);

    };
    initial();

  }, [])

  return (
    <div className="shadow-lg px-3 py-5 bg-white w-full rounded-lg">
      <div className="flex items-start space-x-3 	">
        <AiFillCalendar className="text-4xl text-gray-700" />
        <div className='py-1'>
          <p className="text-lg text-center font-semibold">
            Available Slots
          </p>
        </div>
      </div>
      <div className="my-1">
        <div className='mx-2'>
          <br />
          <div className='mx-2  my-4'>
            <label> <Moment format="D MMM YYYY" withTitle add={{ days: 1 }}>{new Date()}</Moment></label>
            <br />
            <div className='flex my-2 '>

              {slot && slot.map((item, index) => {

                if (new Date(item.startDate).getDate() === new Date().getDate() + 1) {
                  return (
                    <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"
                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                  )
                }
              })}
            </div>
          </div>
          <div className='mx-2  my-4'>
            <label> <Moment format="D MMM YYYY" withTitle add={{ days: 2 }}>{new Date()}</Moment></label>
            <br />
            <div className='flex my-2 '>
              {slot && slot.map((item, index) => {
                if (new Date(item.startDate).getDate() === new Date().getDate() + 2) {
                  return (
                    <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"

                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                  )
                }
              })}
            </div>
          </div>
        </div>
        {/* <button
  className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
  style={{ backgroundColor: "#034488" }} onClick={() => { navigate("/user/allslots") }}>View More</button> */}


      </div>
    </div>
  )
}

export default SessionCard;