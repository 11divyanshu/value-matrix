import React, { useState, Fragment, useEffect } from "react";
import {
  addSlot,
  XISlots,
  updateSlot,
  newslotupdater,
  deleteSlot,
  ValidateSlot,
} from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Loader from "../../assets/images/loader.gif";
import Avatar from "../../assets/images/UserAvatar.png";
import { BsFillBookmarkFill } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";
import { Popover } from "@headlessui/react";
import { Dialog, Transition } from "@headlessui/react";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import DateTimePicker from "react-datetime-picker";

import { Link, useNavigate } from "react-router-dom";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { ImCross } from "react-icons/im";
import swal from "sweetalert";
import SupportTable from "./SupportTable.jsx";

const JobList = () => {
  const [slots, setSlots] = useState([]);
  const [slotstructure, setslotstructure] = useState([]);
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [slotbookingscreen, setslotbookingscreen] = React.useState(0);
  const [slotdate, setslotdate] = React.useState(null);
  const [slotrange, setslotrange] = React.useState(null);
  const [slotmap, setslotmap] = React.useState(null);
  const [allslotdates, setallslotdates] = React.useState(null);

  // const [SlotTime, setSlotTime] = React.useState({
  //   startTime: "",
  //   endTime: "",
  // });
  const [showCandidateForm, setShowCandidateForm] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [loading, setLoading] = React.useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [page, setPage] = React.useState(1);
  const [globalslotval, setglobalslotval] = React.useState(0);

  //   const headerso = [
  //     { label: "job_id", key: "_id" },
  //     { label: "job_title", key: "jobTitle" },
  //     // { label: "job_description", key: "jobDesc" },
  //     { label: "createTime", key: "createTime" },
  //     { label: "uploadedBy", key: "uploadBy" },
  //     { label: "location", key: "location" },
  //     { label: "job_type", key: "jobType" },
  //     { label: "applicants", key: "applicants" },
  //     { label: "valid_till", key: "validTill" },
  //     { label: "hiring_organization", key: "hiringOrganization" },
  //     { label: "basic_salary", key: "basicSalary" },

  //   ]

  //   const csvReport = {
  //     filename: "jobs.csv",
  //     headers: headerso,
  //     data: jobs,
  //   }

  const setSlotsdate = (data)=>{
    let alldates = [];
    let allslots = [];
    let tempslot = [];
    let tempdate = null;
    let customdate = null;
    let tempstart = null;
    let tempend = null;
    console.log(data);
    for(let i=0; i<data.length; i++){
      tempdate = new Date(data[i].startDate.toLocaleString());
      customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth())+1) + "-" + tempdate.getFullYear();
      if(!alldates.includes(customdate)){
        alldates.push(customdate);
        alldates.sort();
        alldates.reverse();
      }
    }
    setallslotdates(alldates);
    for(let i=0; i<alldates.length; i++){
      tempslot = [];
      for(let j=0; j<data.length; j++){
        tempstart = "";
        tempend = "";
        tempdate = new Date(data[j].startDate.toLocaleString());
        customdate = tempdate.getDate() + "-" + (parseInt(tempdate.getMonth())+1) + "-" + tempdate.getFullYear();
        if(alldates[i] == customdate){
          tempdate = new Date(data[j].startDate.toLocaleString());
          if(tempdate.getHours() < 9){
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getHours();
          tempstart = tempstart + ":";
          if(tempdate.getMinutes() < 9){
            tempstart = tempstart + "0";
          }
          tempstart = tempstart + tempdate.getMinutes();
          tempdate = new Date(data[j].endDate.toLocaleString());
          if(tempdate.getHours() < 9){
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getHours();
          tempend = tempend + ":";
          if(tempdate.getMinutes() < 9){
            tempend = tempend + "0";
          }
          tempend = tempend + tempdate.getMinutes();
          tempslot.push({
            startTime: tempstart,
            endTime: tempend,
            data: data[j]
          })
        }
      }
      allslots.push({
        slots: tempslot,
        date: alldates[i]
      });
    }
    setslotstructure(allslots);
  }

  useEffect(() => {
    const getData = async () => {
      let user = JSON.parse(localStorage.getItem("user"));
      setUser(user);

      // console.log(c_id);

      let res = await XISlots(user._id);
      if (res) {
        setSlots(res.data);
        setSlotsdate(res.data);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    let start = new Date(startTime);

    if (startTime) {
      setEndTime(new Date(start.setHours(start.getHours() + 1)));
    }
    // else{
    //   setEndTime(new Date(start.setHours(start.getHours() + 1)))
    //   let end = new Date(endTime);
    //   setEndTime(new Date(end.setDate(end.getDate() + 1)))

    // }
  }, [startTime]);

  const handleSubmit = async () => {
    let user = JSON.parse(localStorage.getItem("user"));
    let id = user._id;

    setLoading(true);

    if (editId !== null) {
      let check = await ValidateSlot({ id: id, startTime: startTime });
      if (check.data.check === true) {
        let res = await updateSlot(editId, {
          startDate: startTime,
          endDate: endTime,
        });
        console.log(res);
        if (res.status === 200) {
          let res1 = await XISlots(user._id);
          if (res1) {
            setSlots(res1.data);
            setSlotsdate(res1.data);
          }
          setLoading(false);
          swal({
            icon: "success",
            title: "Update Slots",
            text: "Slot Updated Succesfully",
            button: "Continue",
          });
          setEditId(null);
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        } else {
          swal({
            icon: "error",
            title: "Update Slots",
            text: "Something went wrong",
            button: "Continue",
          }).then(() => {
            setModal(false);
            setEndTime(null);
            setStartTime(null);
          });
        }
      } else {
        swal({
          icon: "error",
          title: "Add Slots",
          text: "Slot Limit Exceeded",
          button: "Continue",
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      }
      return;
    }

    let check = await ValidateSlot({ id: id, startTime: startTime });
    if (check.data.check === true) {
      let res = await addSlot([
        { createdBy: id, startDate: startTime, endDate: endTime },
      ]);

      if (res.status === 200) {
        let res2 = await XISlots(user._id);
        if (res2) {
          setSlots(res2.data);
          setSlotsdate(res2.data);
        }
        setLoading(false);
        swal({
          icon: "success",
          title: "Add Slots",
          text: "Slot Added Succesfully",
          button: "Continue",
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      } else {
        swal({
          icon: "error",
          title: "Add Slots",
          text: "Something went wrong",
          button: "Continue",
        }).then(() => {
          setModal(false);
          setEndTime(null);
          setStartTime(null);
        });
      }
    } else {
      swal({
        icon: "error",
        title: "Add Slots",
        text: "Slot Limit Exceeded",
        button: "Continue",
      }).then(() => {
        setModal(false);
        setEndTime(null);
        setStartTime(null);
      });
    }
  };

  const selectSlots = (slotval)=>{
    setglobalslotval(slotval);
    if(slotdate==null){
      swal({
        icon: "error",
        title: "Please Select Date",
        button: "Ok"
      });
    }else{
      let hour = null;
      let minutes = null;
      let endhour = null;
      let endminutes = null;
      let temp = [];
      for(let i=0; i<1440; i+=slotval){
        if(parseInt(i/60)>9){
          hour = parseInt(i/60).toString();
        }else{
          hour = "0"+parseInt(i/60).toString()
        }
        if(parseInt(i%60)>9){
          minutes = parseInt(i%60).toString();
        }else{
          minutes = "0"+parseInt(i%60).toString()
        }
        if(parseInt((i+slotval)/60)>9){
          endhour = parseInt((i+slotval)/60).toString();
        }else{
          endhour = "0"+parseInt((i+slotval)/60).toString()
        }
        if(parseInt((i+slotval)%60)>9){
          endminutes = parseInt((i+slotval)%60).toString();
        }else{
          endminutes = "0"+parseInt((i+slotval)%60).toString()
        }
        temp.push({
          value: hour+":"+minutes,
          endtime: endhour+":"+endminutes,
          status: false
        });
      }
      setslotmap(temp);
      setslotbookingscreen(1);
      setslotrange(slotval);
    }
  }

  const updateslotbox = (index)=>{
    let temp = [];
    for(let i=0; i<slotmap.length; i++){
      if(i===index){
        temp.push({
          value: slotmap[i].value,
          endtime: slotmap[i].endtime,
          status: !slotmap[i].status
        });
      }else{
        temp.push({
          value: slotmap[i].value,
          endtime: slotmap[i].endtime,
          status: slotmap[i].status
        });
      }
    }
    setslotmap(temp);
  }

  const updateSlotFncn = async ()=>{
    let trueslots = [];
    let interviewslots = [];
    for(let i=0; i<slotmap.length; i++){
      if(slotmap[i].status == true)
      trueslots.push(slotmap[i]);
    }
    if(globalslotval == 30){
      for(let i=0; i<trueslots.length-1; i++){
        if(trueslots[i].endtime == trueslots[i+1].value){
          interviewslots.push({
            starttime: trueslots[i].value,
            endtime: trueslots[i+1].endtime
          });
        }
      }
    }else if(globalslotval == 60){
      let hour = null;
      let minutes = null;
      let endhour = null;
      let endminutes = null;
      let temp = [];
      let tempslotmap = [];
      for(let i=0; i<1440; i+=30){
        if(parseInt(i/60)>9){
          hour = parseInt(i/60).toString();
        }else{
          hour = "0"+parseInt(i/60).toString()
        }
        if(parseInt(i%60)>9){
          minutes = parseInt(i%60).toString();
        }else{
          minutes = "0"+parseInt(i%60).toString()
        }
        if(parseInt((i+30)/60)>9){
          endhour = parseInt((i+30)/60).toString();
        }else{
          endhour = "0"+parseInt((i+30)/60).toString()
        }
        if(parseInt((i+30)%60)>9){
          endminutes = parseInt((i+30)%60).toString();
        }else{
          endminutes = "0"+parseInt((i+30)%60).toString()
        }
        temp.push({
          value: hour+":"+minutes,
          endtime: endhour+":"+endminutes,
          status: false
        });
      }
      for(let j=0; j<temp.length; j+=2){
        for(let k=0; k<trueslots.length; k++){
          if(temp[j].value == trueslots[k].value){
            tempslotmap.push({
              value: temp[j].value,
              endtime: temp[j].endtime,
              status: true
            });
            tempslotmap.push({
              value: temp[j+1].value,
              endtime: temp[j+1].endtime,
              status: true
            });
          }
        }
      }
      for(let i=0; i<tempslotmap.length-1; i++){
        if(tempslotmap[i].endtime == tempslotmap[i+1].value){
          interviewslots.push({
            starttime: tempslotmap[i].value,
            endtime: tempslotmap[i+1].endtime
          });
        }
      }
    }else{
      swal({
        icon: "error",
        title: "Something Went Wrong",
        button: "Ok"
      });
    }
    let newinterviewslots = interviewslots;
    let oldslots = [];
    let checkedslots = [];
    let skipentry = 0;
    let checkingdate = slotdate.charAt(8).toString() + slotdate.charAt(9).toString() + "-" + slotdate.charAt(5).toString() + slotdate.charAt(6).toString() + "-" + slotdate.charAt(0).toString() + slotdate.charAt(1).toString() + slotdate.charAt(2).toString() + slotdate.charAt(3).toString();
    if(allslotdates.includes(checkingdate.toString())){
      for(let i=0; i<slotstructure.length; i++){
        if(slotstructure[i].date == checkingdate){
          oldslots = slotstructure[i].slots;
          for(let j=0; j<oldslots.length; j++){
            skipentry = 0;
            for(let k=0; k<newinterviewslots.length; k++){
              if(oldslots[j].endTime == newinterviewslots[k].endtime && oldslots[j].startTime == newinterviewslots[k].starttime){
                skipentry = 1;
                checkedslots.push({
                  data: oldslots[j].data,
                  startTime: oldslots[j].startTime,
                  endTime: oldslots[j].endTime,
                  action: "ignore",
                });
              }
            }
            if(skipentry == 0){
              checkedslots.push({
                data: oldslots[j].data,
                startTime: oldslots[j].startTime,
                endTime: oldslots[j].endTime,
                action: "delete",
              });
            }
          }
          let oldcheckedslots = checkedslots;
          for(let l=0; l<newinterviewslots.length; l++){
            skipentry = 0;
            for(let m=0; m<oldcheckedslots.length; m++){
              if(newinterviewslots[l].starttime === oldcheckedslots[m].startTime && newinterviewslots[l].endtime === oldcheckedslots[m].endTime){
                skipentry = 1;
              }
            }
            if(skipentry === 0){
              checkedslots.push({
                startTime: newinterviewslots[l].starttime,
                endTime: newinterviewslots[l].endtime,
                action: "create",
              });
            }
          }
        }
      }
    }else{
      for(let l=0; l<interviewslots.length; l++){
        console.log(interviewslots[l]);
        checkedslots.push({
          startTime: interviewslots[l].starttime,
          endTime: interviewslots[l].endtime,
          action: "create",
        });
      }
    }
    let newupdater = await newslotupdater(user._id, checkedslots, slotdate);
    if(newupdater.status === 200){
      window.location.reload();
    }
  }

  const handleUpdate = async (slots) => {
    console.log(slots);
    setModal(true);
    let startDate = new Date(slots.startDate);
    let endDate = new Date(slots.endDate);

    setStartTime(startDate);
    setEndTime(endDate);
    setEditId(slots._id);
  };
  const handleDelete = async (slots) => {
    console.log(slots);

    swal({
      title: "Are you sure?",
      text: "you want to delete slot!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        let res = await deleteSlot(slots._id);
        if (res.status === 200) {
          let res2 = await XISlots(user._id);
          if (res2) {
            setSlots(res2.data);
            setSlotsdate(res2.data);
          }
        }
        swal("Slot has been Deleted", {
          title: "Slot Removed",
          icon: "success",
        });
      }
    });
  };

  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= slotstructure.length; i++) {
      document.getElementById("crd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("crd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
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
          Hey {user && user.firstName ? user.firstName : "XI"} -{" "}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>

        <div className="py-3 flex">
          <div className="mx-1">
            <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue">
              <button
                className=" p-3 w-10vw rounded-md text-white"
                style={{ backgroundColor: "#034488" }}
                onClick={() => {
                  setModal(true);
                  setShowCandidateForm(true);
                }}
              >
                Add Slots
              </button>
            </p>
          </div>
          {/* <div>
          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button className=" p-3 w-10vw rounded-md text-white" style={{ backgroundColor: "#034488" }}>Download CSV</button></CSVLink></p>
        </div> */}
        </div>
      </div>
      <div className="p-4 w-full md:flex mx-auto">
        <div className=" md:w-3/4 md:mx-5">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <>
              <div className="  w-full bg-white">
                <div
                  className="  py-4 px-5"
                  style={{ borderRadius: "6px 6px 0 0" }}
                >
                  <p className="text-gray-900 w-full font-bold">All Slots</p>
                  {/* <p className="text-gray-400 w-full font-semibold">Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p> */}
                </div>
                <div className="mt-3">
                  <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
                        <div className="overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-white border-b">
                              <tr>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  #
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Date
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Slots
                                </th>
                                <th
                                  scope="col"
                                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                >
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {slotstructure &&
                                slotstructure.map((slotdetails, index) => {
                                  return (
                                    <tr id={"crd" + (index + 1)}
                                      className={`${
                                        index % 2 === 0
                                          ? "bg-gray-100"
                                          : "bg-white"
                                      } border-b ${index < 5 ? "" : "hidden"}`}
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {index + 1}
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        <span>{ slotdetails.date }</span>
                                      </td>
                                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {slotdetails.slots.map((slottime,index)=>{
                                          return (<span className="border border-gray-900 rounded px-2 py-1 text-xs mr-2">{ slottime.startTime } - { slottime.endTime }</span>);
                                        })}
                                        <span>
                                          
                                        </span>
                                      </td>
                                      <td className="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap">
                                        Edit
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="text-xs text-gray-500 py-4 px-2 font-semibold mt-2">See All Logs &#12297;</div> */}
              </div>
              <div className="w-full">
                <div className="flex justify-between my-2 mx-1">
                  <div>
                    Page {page} of {Math.ceil(slotstructure.length / 5)}
                  </div>
                  <div>
                    {" "}
                    {slotstructure &&
                      slotstructure.map((slot, index) => {
                        return index % 5 == 0 ? (
                          <span
                            className={`mx-2 ${
                              page == index / 5 + 1 ? "page_active" : ""
                            }`}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              paginate(index / 5 + 1);
                            }}
                          >
                            {index / 5 + 1}
                          </span>
                        ) : null;
                      })}
                  </div>
                </div>
              </div>
              {modal && (
                <Transition
                  appear
                  show={modal}
                  as={Fragment}
                  className="relative z-10 w-full "
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10 w-5/6 "
                    onClose={() => {}}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
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
                          <Dialog.Panel className="w-full px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[65vh]">
                            {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                            <div className={`${!modal ? "hidden" : "block"} h-full`}>
                              <div className="w-full h-full">
                                <div className="w-full h-full">
                                  <div className="my-3 w-3/4 md:w-full text-left flex justify-between">
                                    <div>
                                      <p className="font-semibold">Add Slots</p>
                                      {/* <p className="text-sm mt-3 mb-1 break-words">
                                      ( Headers Conventions: firstName, lastName, email,
                                      phoneNo, Address)
                                    </p>
                                    <p className="text-sm break-words">
                                      (Data must contain candidate's email Address and phoneNo
                                      Number)
                                    </p> */}
                                    </div>
                                    <div>
                                      <button
                                        className="bg-[#034488] text-white rounded-sm px-4 my-2 pt--8"
                                        onClick={() => {
                                          setStartTime(null);
                                          setEndTime(null);
                                          setModal(false);
                                          setslotbookingscreen(0);
                                        }}
                                        style={{
                                          backgroundColor: "#fff",
                                          color: "#034488",
                                        }}
                                      >
                                        <ImCross />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="my-4 w-full p-3 bg-slate-100 px-8" style={{ height:"90%", overflowY:"scroll" }}>
                                    {slotbookingscreen==0?<>
                                      <div className="text-center">
                                        <h2 className="text-center font-bold text-2xl">Select Date</h2>
                                        <div className="flex w-full justify-center my-4">
                                          <input type="date" onChange={(e)=>{
                                            setslotdate(e.target.value);
                                          }} />
                                        </div>
                                        <h2 className="text-center font-bold text-2xl">Select Time Range</h2>
                                        <div className="flex w-full justify-center my-4">
                                          <button onClick={()=>{selectSlots(30)}} className="bg-white text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer">30 Minutes</button>
                                          <button onClick={()=>{selectSlots(60)}} className="bg-white text-gray-600 border border-gray-400  text-xs font-semibold mr-2 px-2.5 py-2 rounded-3xl cursor-pointer">1 Hour</button>
                                        </div>
                                      </div>
                                    </>:<>
                                      <div className="text-center">
                                        <h2 className="text-center font-bold text-2xl">Select Time Slots for <span className="text-xl text-gray-900">{slotdate}</span></h2>
                                        <div className="w-full my-4">
                                          {slotmap?<>
                                            {slotmap.map((usetime,index)=>{
                                              return(
                                                <div className="flex mb-1">
                                                  <div className="w-1/12 flex"><span className="text-xs" style={{ marginTop:"-8px" }}>{usetime.value}</span></div>
                                                  <div className="w-11/12">
                                                    <div onClick={()=>{updateslotbox(index)}} className={usetime.status===true ? "bg-blue-300 hover:bg-blue-200 cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold" : "bg-blue-100 hover:bg-blue-200 cursor-pointer h-8 w-full flex justify-center items-center text-white font-bold"}>{usetime.status===true ? <>Selected</> : null}</div>
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </>:<>Loading...</>}
                                        </div>
                                        <div className="w-full my-4 flex justify-center">
                                          <button className="bg-blue-500 hover:bg-blue-500 rounded px-4 py-2 text-white font-bold" onClick={()=>{updateSlotFncn()}}>Update Slot</button>
                                        </div>
                                      </div>
                                    </>}
                                  </div>
                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8 hidden">
                                    <Formik
                                      initialValues={{}}
                                      validate={(values) => {
                                        const errors = {};

                                        if (
                                          startTime === "" ||
                                          startTime === null
                                        ) {
                                          errors.startTime =
                                            "Start Time Cannot be Empty";
                                        }
                                        if (
                                          endTime === "" ||
                                          endTime === null
                                        ) {
                                          errors.endTime =
                                            "End Time Cannot be Empty";
                                        }
                                        if (startTime > endTime) {
                                          errors.endTime =
                                            "End Time Cannot be greater than Start Time";
                                        }
                                        return errors;
                                      }}
                                      onSubmit={handleSubmit}
                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            {/* <p className="text-left font-semibold py-2">
                                              Add User
                                            </p> */}
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                <DateTimePicker
                                                  minDate={new Date()}
                                                  onChange={setStartTime}
                                                  value={startTime}
                                                />

                                                {/* <Field
                                                  name="startTime"
                                                  type="text"
                                                  className="text-600 rounded-sm block px-4 py-1"
                                                  style={{ borderRadius: "5px" }}
                                                /> */}
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                <DateTimePicker
                                                  onChange={setEndTime}
                                                  value={endTime}
                                                  disabled
                                                />

                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                                                type="submit"
                                                style={{
                                                  backgroundColor: "#034488",
                                                }}
                                              >
                                                {editId ? "Update" : "Add"}
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setStartTime(null);
                                                  setEndTime(null);
                                                  setModal(false);
                                                  setEditId(null);
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </Form>
                                        );
                                      }}
                                    </Formik>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
              {modal2 && (
                <Transition
                  appear
                  show={modal}
                  as={Fragment}
                  className="relative z-10 w-full "
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-10 w-5/6 "
                    onClose={() => {}}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
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
                          <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all h-[65vh]">
                            {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                            <div className={`${!modal ? "hidden" : "block"}`}>
                              <div className="w-full mt-9">
                                <div className="w-full m-5 mx-7">
                                  <div className="my-3 w-3/4 md:w-full text-left flex justify-between">
                                    <div>
                                      <p className="font-semibold">Add Slots</p>
                                      {/* <p className="text-sm mt-3 mb-1 break-words">
                                      ( Headers Conventions: firstName, lastName, email,
                                      phoneNo, Address)
                                    </p>
                                    <p className="text-sm break-words">
                                      (Data must contain candidate's email Address and phoneNo
                                      Number)
                                    </p> */}
                                    </div>
                                    <div>
                                      <button
                                        className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                        onClick={() => {
                                          setStartTime(null);
                                          setEndTime(null);
                                          setModal(false);
                                        }}
                                        style={{
                                          backgroundColor: "#fff",
                                          color: "#034488",
                                        }}
                                      >
                                        <ImCross />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="my-4 w-3/4 p-3 bg-slate-100 px-8">
                                    <Formik
                                      initialValues={{}}
                                      validate={(values) => {
                                        const errors = {};

                                        if (
                                          startTime === "" ||
                                          startTime === null
                                        ) {
                                          errors.startTime =
                                            "Start Time Cannot be Empty";
                                        }
                                        if (
                                          endTime === "" ||
                                          endTime === null
                                        ) {
                                          errors.endTime =
                                            "End Time Cannot be Empty";
                                        }
                                        if (startTime > endTime) {
                                          errors.endTime =
                                            "End Time Cannot be greater than Start Time";
                                        }
                                        return errors;
                                      }}
                                      onSubmit={handleSubmit}
                                    >
                                      {({ values }) => {
                                        return (
                                          <Form>
                                            {/* <p className="text-left font-semibold py-2">
                                              Add User
                                            </p> */}
                                            <div className="flex my-3 flex-wrap text-left">
                                              <div className="w-1/2">
                                                <label>Start Time</label>
                                                <DateTimePicker
                                                  minDate={new Date()}
                                                  onChange={setStartTime}
                                                  value={startTime}
                                                />

                                                {/* <Field
                                                  name="startTime"
                                                  type="text"
                                                  className="text-600 rounded-sm block px-4 py-1"
                                                  style={{ borderRadius: "5px" }}
                                                /> */}
                                                <ErrorMessage
                                                  name="startTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                              <div className="w-1/2">
                                                <label>End Time</label>
                                                <DateTimePicker
                                                  onChange={setEndTime}
                                                  value={endTime}
                                                  disabled
                                                />

                                                <ErrorMessage
                                                  name="endTime"
                                                  component="div"
                                                  className="text-red-600 text-sm w-full"
                                                />
                                              </div>
                                            </div>

                                            <div>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm py-1 my-2 px-4"
                                                type="submit"
                                                style={{
                                                  backgroundColor: "#034488",
                                                }}
                                              >
                                                {editId ? "Update" : "Add"}
                                              </button>
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1 my-2 mx-4"
                                                onClick={() => {
                                                  setStartTime(null);
                                                  setEndTime(null);
                                                  setModal(false);
                                                  setEditId(null);
                                                }}
                                              >
                                                Cancel
                                              </button>
                                            </div>
                                          </Form>
                                        );
                                      }}
                                    </Formik>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
            </>
          )}
        </div>

        <div className="md:w-1/4">
          <div className="shadow-lg  py-5  bg-white  justify-around  px-5 bg-white">
            <p className="text-xl mx-auto text-gray-700 font-bold  flex">
              <p className="p-1">
                <BsFillBookmarkFill />
              </p>
              <p className=" mx-2  text-sm ">My Items</p>
            </p>
            <div className="border-b border-gray-600 flex justify-between my-4 py-4">
              <p className="font-bold text-xs">Posted Jobs</p>
              <p className="text-gray-400 font-semibold text-xs">
                {" "}
                {slots.length > 0 ? slots.length : 0}
              </p>
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

          <SupportTable/>
        </div>
      </div>
    </div>
  );
};

export default JobList;
