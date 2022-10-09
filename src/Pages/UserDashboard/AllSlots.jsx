import React, { useRef,useState,useEffect } from "react";
import {
    availableSlots,
    bookSlot,
    findCandidateByEmail,
    getJobInvitations,
    handleCandidateJobInvitation,
} from "../../service/api";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import swal from "sweetalert";
import {
    HiOutlineLocationMarker,
    HiOutlineCurrencyDollar,
    HiOutlineCalendar,
    HiOutlinePlay,
} from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { Fragment } from "react";
import Loader from "../../assets/images/loader.gif";
import Moment from 'react-moment';
import DateTimePicker from 'react-datetime-picker';

import { Popover, Transition, Dialog } from "@headlessui/react";

const JobInvitations = () => {
    const [JobInvitation, setJobInvitation] = useState([]);
    const [Loading, setLoading] = useState(true);
    const [Error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [chooseSlot, setchooseSlot] = useState(null);
    const [slot, setSlot] = useState([]);
    const [invitation, setInvitation] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [otp, setotp] = useState(null);
    const [otpModal, setotpModal] = useState(null);
    const OTPField = useRef(null);
    const [startTime, setStartTime] = useState(new Date());

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        setUser(user);
    }, [])
    useEffect(() => {
        const initial = async () => {
            let user = JSON.parse(await localStorage.getItem("user"));
            let res = await getJobInvitations(
                { user_id: user._id },
                user.access_token
            );
            console.log(user)
            if (res && res.status === 200) {
                setJobInvitation(res.data.jobInvites);
                setLoading(false);
            }
            let candidate = await findCandidateByEmail(user.email);
            console.log(candidate);

            setCandidate(candidate.data[0])

            let slots = await availableSlots(user._id);
            console.log(slots.data);
            setSlot(slots.data);

        };
        initial();
    }, []);


    const handleJobInvitation = async (job, accept) => {
        try {
            let user = JSON.parse(await localStorage.getItem("user"));
            let res = await handleCandidateJobInvitation(
                { job_id: job._id, user_id: user._id, accept: accept },
                user.access_token
            );
            if (res && res.status === 200) {
                let d = JobInvitation.filter((el) => {
                    return el !== job;
                });
                await setJobInvitation(d);
                await setJobInvitation(d);
                swal({
                    title: "Success",
                    text: accept ? "Job Invitation Accepted" : "Job Invitation Rejected",
                    icon: "success",
                    button: "Ok",
                });
            } else {
                swal({
                    title: "Error",
                    text: "Something went wrong",
                    icon: "error",
                    button: "Ok",
                });
            }
        } catch (err) {
            console.log(err);
            swal({
                title: "Error",
                text: "Something went wrong",
                icon: "error",
                button: "Ok",
            });
        }
    };

    return (
        <div className="bg-slate-100">
            <div
                className="flex mx-5 mt-3"
                style={{ justifyContent: "space-between" }}
            >
                {/* <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p> */}
                <p className="text-sm flex my-5 mx-5 font-semibold">
                    Hey  {user && user.firstName ? user.firstName : "User"}  -{" "}
                    <p className="text-gray-400 px-2"> here's what's happening today!</p>
                </p>
            </div>
            <div className="p-4 w-full md:flex mx-auto">
                {/* {!Loading && JobInvitation.length === 0 && (
          <div className="text-center py-5 text-2xl md:w-3/4">
            No Interview Invitations
          </div>
        )} */}
                {otpModal &&
                    <Transition
                        appear
                        show={otpModal}
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
                                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle  transition-all h-[30vh]">

                                            <p>Enter OTP</p>
                                            <input
                                                type="number"
                                                name="EmailOTP"
                                                refs={OTPField}
                                                placeholder="Email OTP"
                                                className="w-full"
                                                style={{ borderRadius: "12px", marginTop: "10px" }}
                                            ></input>
                                            <div className="flex my-3">
                                                <button
                                                    className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                                    style={{ backgroundColor: "#034488" }}
                                                    onClick={() => {
                                                        if (OTPField.current == otp) {
                                                            swal({
                                                                title: "Job Accepted Successfully !",
                                                                message: "Success",
                                                                icon: "success",
                                                                button: "Continue",
                                                            }).then((result) => {
                                                                // handleJobInvitation(invitation, true);
                                                                setotpModal(false);
                                                            });
                                                        }
                                                    }}>Submit</button> <button
                                                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 mx-1 md:mx-4 text-xs rounded"
                                                        style={{ backgroundColor: "#034488" }} onClick={() => { setotpModal(false) }}>Cancel</button></div>
                                        </Dialog.Panel>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>}




                {/* {!Loading && JobInvitation.length > 0&& ( */}
                <div className=" md:w-3/4 md:mx-5">
                    <div
                        className="justify-between w-full bg-white"
                        style={{ borderRadius: "6px 6px 0 0" }}
                    >
                        <div className="  py-4 px-5">
                            <p className="text-gray-900 w-full font-bold">Available Slots</p>
                            {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                        </div>
                    </div>

                    <div className=" px-3 py-5 rounded-lg bg-white w-full">
                        <div className="flex items-start space-x-3 	">
                            {/* <AiFillCalendar className="text-4xl text-gray-700" /> */}
                            <div className='py-1 mx-3 flex'>
                                <p className="text-lg text-center font-semibold">
                                <DateTimePicker onChange={setStartTime} value={startTime} disableClock/>
                                </p>
                            </div>
                        </div>
                        <div className="my-3">

                            <div className='mx-2  my-4'>
                                <label>  <Moment format="D MMM YYYY" withTitle>
                                    {new Date(startTime)}
                                </Moment></label>
                                <br />
                                <div className='flex my-2 '>

                                    {slot && slot.map((item, index) => {

                                        if (new Date(item.startDate).getDate() === new Date(startTime).getDate()) {
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
                            </div>
                        </div>









                    </div>
                </div>
                {/* ) } */}

                <div className="md:w-1/4 my-3">
                    <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
                        <p className="text-xl mx-auto text-gray-700 font-bold  flex">
                            <p className="p-1">
                                <BsFillBookmarkFill />
                            </p>
                            <p className=" mx-2  text-sm ">My Items</p>
                        </p>
                        <div className="border-b border-gray-600 flex justify-between my-4 py-4">
                            <p className="font-bold text-xs">All Jobs</p>
                            <p className="text-gray-400 font-semibold text-xs">04</p>
                        </div>
                        <div className="border-b border-gray-600 flex justify-between my-4 py-4">
                            <p className="font-bold text-xs">My Learnings</p>
                            <p className="text-gray-400 font-semibold text-xs">06</p>
                        </div>
                        <div className=" border-gray-600 flex justify-between mt-4 pt-4">
                            <p className="font-bold text-xs">Save Posts</p>
                            <p className="text-gray-400 font-semibold text-xs">01</p>
                        </div>
                    </div>

                    <div className="shadow-lg sm:w-full rounded-lg   py-5  bg-white  justify-around my-4 h-auto  px-4 bg-white">
                        <p className="text-xl px-2 mx-auto text-gray-700 font-bold  flex">
                            {/* <div className=" px-6 mx-2 py-1 ml-5 text-center" ><AiOutlineUnorderedList/></div> */}

                            <p className=" mx-2  text-sm ">Support</p>
                            <p className="">
                                <HiOutlineUser />
                            </p>
                        </p>

                        <div className="flex justify-between text-xs py-4 px-3">
                            <div>
                                <p>Open 0/5</p>
                            </div>
                            <div>
                                <p>Working 0/5</p>
                            </div>
                            <div>
                                <p>Closed 0/5</p>
                            </div>
                        </div>
                        <div className="flex px-2 vertical-align-middle">
                            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
                            <div>
                                {" "}
                                <p className="py-2 text-sm">Cameron Williamson</p>
                                <p className="text-gray-400 text-xs">Product Designer</p>
                            </div>
                        </div>

                        <div className="flex px-2 vertical-align-middle">
                            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
                            <div>
                                {" "}
                                <p className="py-2 text-sm">Brookyln Simmons</p>
                                <p className="text-gray-400 text-xs">Software Engineer</p>
                            </div>
                        </div>

                        <div className="flex px-2 vertical-align-middle">
                            <img src={Avatar} className="rounded-full w-12 h-12 m-3" />
                            <div>
                                {" "}
                                <p className="py-2 text-sm">Leslie Alexander</p>
                                <p className="text-gray-400 text-xs">Project Manager</p>
                            </div>
                        </div>

                        {/* <button className="bg-blue-600 rounded-lg px-6 mx-2 my-3 py-2 text-xs text-gray-900 font-semibold">View List</button> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobInvitations;
