 import React from 'react'
import { Link, useNavigate } from "react-router-dom";

// export default function Modal() {
//   return (
//     <div>
        
//         <div className="modal w-1/2 p-5 m-5 mx-auto text-center" tabindex="-1" role="dialog" style={{boxShadow: "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"}}>
//     <div className="modal-dialog p-4" role="document">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title text-3xl font-blue-600"  style={{ color: '#3667E9' }}>Complete Your Profile</h5>
//           <hr></hr>
//         </div>
//         <div className="modal-body p-4">
//           <p>Let's Begin Our Journey By Completing Your Details</p>
//         </div>
//         <div className="modal-footer">
//         <Link to={`/company/profile`}>
//         <button type="button"
//                     className="bg-blue-600 text-white my-2 py-2 rounded-lg hover:bg-blue-700 text-center w-1/4 cursor-pointer"

//                     style={{ backgroundColor: "#3B82F6" }}>
// View Profile
//                   </button></Link>
//         </div>
//       </div>
//     </div>
//   </div></div>
//   )
// }

import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

export default function MyModal() {
  let [isOpen, setIsOpen] = useState(true)



  function openModal() {
    setIsOpen(true)
  }
 React.useEffect(()=>{
openModal();
 },[])

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button> */}


      </div>

      <Transition appear show={isOpen} as={Fragment} onClose={() => setIsOpen(true)}>
        <Dialog as="div" className="relative z-10" >
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                   Complete Your Profile
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                    Let's Begin Our Journey By Completing Your Details
                    </p>
                  </div>

                  <div className="mt-4">
                  <Link to={`/company/profile`}>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    //   onClick={closeModal}
                    >
                      View Profile
                    </button>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

