import React from 'react';

// Assets
import { AiFillCalendar } from "react-icons/ai";


const SessionCard = () => {
    return (
        <div className="shadow-lg px-3 py-5 rounded-lg bg-white w-full">
        <div className="flex items-start space-x-3 	">
          {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
          <div className='py-1 mx-3'>
            <p className="text-lg text-center font-semibold">
             Available Sessions
            </p>
          
          </div>
        </div>
        <div className="my-3">
           
           <div className='mx-2  my-4'><label>Thu 12 May</label>
           <br/>
           <div className='flex my-2 '>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           </div>
           
           </div>

           <div className='mx-2  mt-4'><label>Fri 13 May</label>
           <br/>
           <div className='flex my-2 '>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           </div>
           
           </div>

           <div className='mx-2  mt-4'><label>Sat 14 May</label>
           <br/>
           <div className='flex my-2 '>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl">10am -11am</span>
           </div>
           
           </div>

        </div>
      </div>
    )
}

export default SessionCard;