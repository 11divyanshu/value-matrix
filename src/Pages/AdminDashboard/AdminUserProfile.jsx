import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";
import { getProfileImage, getUserFromId ,updateUserDetails,sendForwardedMail } from "../../service/api";
import { BiErrorCircle } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
// Assets
 import swal from "sweetalert";
import Avatar from "../../assets/images/UserAvatar.png";
import {Link, Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import AdminTabs from "../../Components/AdminDashboard/AdminTabs";
import { Popover, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
//  import { Device } from '@twilio/voice-sdk';

//  import {Device } from 'twilio-client';
// import Twilio from "twilio";

const AdminUserProfile = (props) => {

  let navigate = useNavigate();
console.log(props);
  // Access Token And User State
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [job_id, setJobId] = React.useState(props.id);
  const [approveModal, setApproveModal] = React.useState(false);
  const [access_token, setaccess_token] = React.useState(null);
  //  const Device = Twilio.Device;
  // Sets User and AccessToken from SessionStorage

  React.useEffect(() => {
    const func = async () => {
      let access_token = localStorage.getItem("access_token");
      setaccess_token(access_token);
      let user1 = await getUserFromId({ id: props.id},{token: access_token});
      console.log(user1)
      let user = user1.data.user;
      console.log(user)
      if (user && user.profileImg) {

        
        let image = await getProfileImage({ id: user._id }, user.access_token);
        console.log(image)
        if (image && image.status === 200) {

          await localStorage.setItem("profileImg", JSON.stringify(image));

          // let base64string = btoa(
          //  String.fromCharCode(...new Uint8Array(image.data.Image.data))
          // );

          let base64string = btoa(new Uint8Array(image.data.Image.data).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
          }, ''));
          let src = `data:image/png;base64,${base64string}`;
          await setProfileImg(src);
        }
      }
      if (access_token === null) window.location.href = "/login";

      await setUser(user);
    

      // let token = getJSON('/token').done(function (data) {
      //   console.log(data);
      //   Twilio.Device.setup(data.token);
      // }).fail(function (err) {
      //   console.log(err);
      //   // self.setState({ log: 'Could not fetch token, see console.log' });
      // });
  

      // Configure event handlers for Twilio Device
      // Twilio.Device.disconnect(function () {
      //   // self.setState({
      //   //   onPhone: false,
      //   //   log: 'Call ended.'
      //   // });
      // });
  
      // Twilio.Device.ready(function () {
      //   // console.log("Twilio.Device Ready!");
      //   // self.log = 'Connected';
      // });
    };
    func();
  }, []);

  const Call = async()=>{
 

    //   const token = ("/token").then((res) => res.json())
    //  .then((json) => {
    //     console.log(json)
    //  })

    //  token.done(function(data) {
    //   Twilio.Device.setup(data.token);
    // }).fail(function(err) {
    //   console.log(err);
    //   // setState({log: 'Could not fetch token, see console.log'});
    // });

    setApproveModal(true);

  }

 


  return (
    <div className="h-100 ml-10">
      {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
      {user !== null && user !== undefined && (
        <div className="w-full">
          <div
            className="md:h-48 h-24 relative -z-[3]"
            style={{ background: "#99DEFF" }}
          ></div>
          <div className="relative  rounded-md w-full py-3 md:flex  ">
            <div className="absolute left-6  sm:left-6 sm:px-2 -top-20 md:-top-28 md:left-20 ">
              <img
                src={
                  user && user.profileImg && profileImg ? profileImg : Avatar
                }
                //src={Avatar}
                className=" h-36 w-36 md:h-32 md:w-32 lg:h-56 lg:w-56 rounded-full relative"
                alt="userAvatar"
              />
            </div>

            <div className="mt-16 flex justify-between w-full md:ml-80 md:px-5 md:mt-3  sm:mx-5 md:text-left">
              <p className="font-semibold md:text-3xl mx-6  text-2xl ">
                {user.firstName} {user.lastname}
              <p className="text-gray-400 text-lg">{user.username}</p>
              </p>

              <div className="flex py-2">
                <Link to="">
                    <button
                      className=" hover:bg-blue-700 px-4 font-bold text-white text-md rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={()=>{Call()}}
                    >
                      Call
                    </button>
                    </Link>
                  </div>
            </div>
          </div>
          {approveModal &&
          <Transition
            appear
            show={approveModal}
            as={Fragment}
            className="relative z-10 w-full "
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10 w-5/6 "
              onClose={() => { }}
              static={true}
            >
              <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
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
                <div className="flex min-h-full items-center justify-center text-center max-w-4xl mx-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full transform overflow-hidden rounded-2xl bg-white text-left align-middle  transition-all h-[65vh]">
                      <div className="rounded-lg bg-white w-full">
                        <div className="flex items-start space-x-3 	">
                          {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                          <div className='py-5 w-full bg-blue-900 flex'>
                            <p className="text-lg mx-5 text-center text-white font-semibold">
                              Approve Candidate
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 mx-16 my-5">
                          <div className="w-auto">Image</div>
                          <div className="w-auto">
                            <h2 className="font-semibold">{user.firstName}</h2>
                            <p className="text-xs">HR Manager</p>
                          </div>
                        </div>

                        <div className="w-auto h-0.5 rounded-lg bg-gray-300 mx-16"></div>

                      


                       
                       
                        <div className="w-auto mx-auto flex justify-center">
                          <button
                            className="text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                            style={{ backgroundColor: "#034488" }}
                            onClick={async()=>{
                              let res = await updateUserDetails(
                                { user_id: user._id, updates: {status:"Approved" , isXI:true} },
                                { access_token: access_token }
                              );
                              if(res && res.status === 200){
                                
                                  setApproveModal(false)
                                
                              }
                            }}
                          >
                            Confirm
                          </button>
                          <button
                            className="text-black font-bold py-3 border-black border-2 px-8 mx-1 md:mx-4 text-xs rounded"
                            onClick={async() => {
                              let res = await updateUserDetails(
                                { user_id: user._id, updates: {status:"Forwarded"} },
                                { access_token: access_token}
                              );
                              if(res && res.status === 200){
                                let res1 = await sendForwardedMail({mail :user.email});
                                if(res1.status ==200){
                                  setApproveModal(false)

                                }
                              }

                            }}>Decline
                          </button>
                        </div>
                        {/* <div className="my-3">

                          <div className='mx-2  my-4'>
                            <label>  <Moment format="D MMM YYYY" withTitle>
                              {new Date()}
                            </Moment></label>
                            <br />
                            <div className='flex my-2 '>

                              {slot && slot.map((item, index) => {

                                if (new Date(item.startDate).getDate() === new Date().getDate()) {
                                  return (
                                    <span className="bg-white border border-gray-400 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer"
                                      onClick={async () => {
                                        let res = await bookSlot({ candidate_id: candidate.candidate_id, slotId: item._id });
                                        console.log(res)
                                        if (res.status === 200) {
                                          setchooseSlot(false);
                                          setotpModal(true);
                                          setotp(res.data.otp)
                                        }
                                      }}

                                    >{new Date(item.startDate).getHours() + ":" + new Date(item.startDate).getMinutes()} - {new Date(item.endDate).getHours() + ":" + new Date(item.endDate).getMinutes()}</span>
                                  )
                                }

                              })}
                            </div>
                          
                          <button
                            className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                            style={{ backgroundColor: "#034488" }} onClick={() => { navigate("/user/allslots") }}>View More</button>


                        </div>
                      </div> */}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>}
          <div className="mx-3 my-2">
            {!user.profileImg || !user.linkedInId || !user.tools.length ?
              (
                <div className="mx-5">
                  <div className="flex items-center space-x-3 py-1">
                    {user && user.profileImg ? (
                      <TiTick className="text-green-500 text-2xl" />
                    ) : (
                      <BiErrorCircle className="text-red-500 text-2xl" />
                    )}
                    <p>Uploaded Profile Image</p>
                  </div>
                  <div className="flex items-center space-x-3 py-1">
                    {user && user.linkedInId ? (
                      <TiTick className="text-green-500 text-2xl" />
                    ) : (
                      <BiErrorCircle className="text-red-500 text-2xl" />
                    )}
                    <p>Connected LinkedIn Profile</p>
                  </div>
                  <div className="flex items-center space-x-3 py-1">
                    {user && user.tools && user.tools.length > 0 ? (
                      <TiTick className="text-green-500 text-2xl" />
                    ) : (
                      <BiErrorCircle className="text-red-500 text-2xl" />
                    )}
                    <p>Updated Skills</p>
                  </div>
                </div>
                
              ) : null}
              
          </div>

          

          <div
            className="my-7 rounded-lg pt-3 w-full"
            style={{ borderRadius: "12px" }}
          >
            <div className="App " style={{ borderRadius: "12px" }}>
              <AdminTabs user={user} />
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default AdminUserProfile;
