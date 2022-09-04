import React from 'react';

// Assets
import { AiFillCalendar } from "react-icons/ai";


const SessionCard = () => {
    return (
        <div className="shadow-lg px-4 py-5 bg-white">
        <div className="flex items-start space-x-3">
          <AiFillCalendar className="text-4xl text-gray-700" />
          <div>
            <p className="text-lg text-center font-semibold">
             Available Sessions
            </p>
            <p className="text-xs">
              
              {/* <span className="text-blue-600 font-semibold cursor-pointer">
                Update
              </span> */}
            </p>
          </div>
        </div>
        <div className="my-3">
           
           <div className='mx-4 px-3 my-4'><label>Thu 12 May</label>
           <br/>
           <div className='flex my-2 '>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           </div>
           
           </div>

           <div className='mx-4 px-3 mt-4'><label>Thu 12 May</label>
           <br/>
           <div className='flex my-2 '>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           </div>
           
           </div>

           <div className='mx-4 px-3 mt-4'><label>Thu 12 May</label>
           <br/>
           <div className='flex my-2 '>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           <span class="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl dark:bg-gray-600 dark:text-gray-600">10am -11am</span>
           </div>
           
           </div>

        </div>
      </div>
    )
}

export default SessionCard;