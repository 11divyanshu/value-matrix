import React, { useEffect, useState, Fragment } from 'react'
import { browserName } from 'react-device-detect';

import UserAvatar from "../../assets/images/loginBackground.jpeg"
// import { AiOutlineDelete, AiOutlinePrinter } from "react-icons/ai";
import { BsFillStarFill } from 'react-icons/bs';
import BarChart from '../../Components/CompanyDashboard/BarChart';
// import RadarChart from '../../Components/CompanyDashboard/RadarChart';
import StackedChart from '../../Components/CompanyDashboard/StackedChart';
import PrintAble from "../CompanyDashboard/PrintAble";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { ImCross } from "react-icons/im";

import { psyurl, url } from '../../service/api';

import Avatar from "../../assets/images/temp.jpg";

import { useParams } from 'react-router-dom';
import { getInterviewApplication, slot_by_interviewId } from "../../service/api";
import axios from 'axios';
const CPrintable = () => {
  const [user, setUser] = useState(null);
  const [modal, setModal] = React.useState(null);
  const [application, setApplication] = useState(null)
  const [applicant, setApplicant] = useState(null)
  const [slot, setSlot] = useState(null)
  const [job, setJob] = useState(null)
  const [psycsdetails, setpsycsdetails] = useState(null)
  const [evaluated, setevaluated] = useState(null)
  const [jobskills, setjobskills] = useState(null)
  const [selfassested, setselfassested] = useState(null)
  const [persona, setpersona] = useState(null)
  const { id } = useParams();


  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    setUser(user);

  }, []);

  useEffect(() => {
    const gia = async () => {
      let res = await getInterviewApplication({ id: id }, user.access_token);
      console.log("res ", res)

      const { applicant, application, job } = res.data.data
      setApplication(application);
      setApplicant(applicant);
      setJob(job);

      let slot_res = await slot_by_interviewId(application._id)
      const slot = slot_res.data
      setSlot(slot);

      let psycs = await axios.get(psyurl+"/"+applicant.linkedinurlkey);
      console.log(psycs);
      setpsycsdetails(psycs);
      setpersona(psycs.data.persona.details);
      let intrv = application.interviewers;
      setevaluated(application.evaluations[intrv].skills);
      setselfassested(applicant.skills);
      setjobskills(job.skills);
    }
    gia()

  }, [user])
  let leftEyeBlinkRate, faceTest, gazeTest, earpieceDetectionStatus;
  if (application) {
    leftEyeBlinkRate = application.leftEyeBlinkRate * 10
    faceTest = application.faceTest
    gazeTest = application.gazeTest
    earpieceDetectionStatus = application.earpieceDetectionStatus
    if (parseFloat(leftEyeBlinkRate.toFixed(2)) > 4)
      leftEyeBlinkRate = "High"
    else if (parseFloat(leftEyeBlinkRate.toFixed(2)) < 2.8)
      leftEyeBlinkRate = "Low"
    else
      leftEyeBlinkRate = "Medium"
  }
  let interview_date = ""
  if (slot) {
    const { startDate } = slot
    const date = new Date(slot.startDate)
    const yy = date.getFullYear()
    const mm = date.getMonth()
    const dd = date.getDate()
    const hh = date.getHours()
    const mn = date.getMinutes()
    interview_date = `${yy}-${mm > 9 ? mm : `0${mm}`}-${dd > 9 ? dd : `0${dd}`} | ${hh > 9 ? hh : `0${hh}`}-${mn > 9 ? mn : `0${mn}`}`

  }


  // console.log("application 22",application)
  return (
    <div>
      <div
        className="flex mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        <p className="text-sm flex my-3 mx-5 font-semibold">
          Hey {user && user.firstName ? user.firstName : "Company"}
          <p className="text-gray-400 px-2"> here's what's happening today!</p>
        </p>
        <button
          className=" mx-3 hidden lg:px-5 lg:py-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
          style={{ backgroundColor: "#034488" }}
          onClick={() => {
            setModal(true);

          }}
        >
          Save
        </button>

      </div>{modal && (
        <Transition
          appear
          show={modal}
          as={Fragment}
          className="relative z-1050 w-full"
          style={{ zIndex: 1000 }}
        >
          <Dialog
            as="div"
            className="relative z-1050 w-5/6"
            onClose={() => { }}
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
              <div className="flex min-h-full items-center justify-center p-4 text-center max-w-screen-2xl mx-auto">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                    <div className={`${!modal ? "hidden" : "block"}`}>
                      <div className="w-full">
                        <button
                          className="bg-[#034488] text-white rounded-sm py-1 mt-5"
                          onClick={() => setModal(false)}
                          style={{
                            backgroundColor: "#fff",
                            color: "#034488",
                          }}
                        >
                          <ImCross />
                        </button>
                        <PrintAble />
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className='lg:flex mx-5'>


        <div className='left lg:w-2/3'>
          <div className="lg:mx-10 lg:flex gap-2 mx-5 mt-2 ">
            {/* <div className="lg:w-1/3 w-full rounded-lg my-2">
              <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
                <div className=" text-sm mx-2 font-semibold text-gray-900 my-2">
                  <div className=''>
                    <p className='text-xs'>Candidate Job Specific</p>
                    <p className='text-xs'>Success Recommendation</p>
                  </div>
                  <div className=''>

                  </div>
                </div>
              </div>
            </div> */}
            <div className="lg:w-1/3 w-full rounded-lg my-2">
              <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
                <p className='text-xs font-semibold mx-2'>Candidate Details</p>
                <div className="text-sm mx-2 my-3 flex justify-between">
                  <div className=''>
                    <p className='text-xs my-2'>Name:</p>
                    <p className='text-xs my-2'>Email:</p>
                    <p className='text-xs my-2'>Contact:</p>
                  </div>
                  <div className='mr-16'>
                    <p className='text-xs my-2'>{applicant && applicant.firstName}</p>
                    <p className='text-xs my-2'>{applicant && applicant.email}</p>
                    <p className='text-xs my-2'>{applicant && applicant.contact}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 w-full rounded-lg my-2">
              <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
                <p className='text-xs font-semibold mx-2'>Interview Details</p>
                <div className="text-sm mx-2 my-3 text-gray-500 flex justify-between">
                  <div className=''>
                    <p className='text-xs my-2'>Job Title:</p>
                    <p className='text-xs my-2'>Job Type:</p>
                    <p className='text-xs my-2'>Interview Date:</p>
                  </div>
                  <div className='mr-16'>
                    <p className='text-xs my-2'>{job && job.jobTitle}</p>
                    <p className='text-xs my-2'>{job && job.jobType}</p>
                    <p className='text-xs my-2'>{interview_date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* <div className='lg:mx-10 mx-4 my-5'>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">SUMMARY</p>
              </div>
              <div className="flex my-4 px-5 vertical-align-middle" >
                <div> <h3 className="py-2 font-md">This summary is generated by “Heimdall”, valuematrix.ai proprietary AI engine.

                  The probability of deception is captured through various parameters monitored and processed during the interview by valuematrix.ai
                  proprietary engine and internal QC process.
                </h3>
                </div>
              </div>

              <div className="my-4 px-5 vertical-align-middle" >
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Composure</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Calm to mild aggressive</p></div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Emotions</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Tensed, Surprise and Happy</p></div>
                </div>
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Communications</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Very good</p>
                  </div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Global exposure
                    </p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Yes</p>
                  </div>
                </div>
                <div className='lg:flex w-full'>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Mindset</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">Open</p>
                  </div>
                  <div className='lg:w-1/2 mx-5'>
                    <p className="py-2 font-bold">Probability of deception</p>
                    <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">5%</p>
                  </div>
                </div>
                <div className='m-5'>
                  <p className="text-gray-400 py-3 text-sm bg-gray-100 px-2 rounded-lg">How to read probability of deception
                    0% to 20%

                    20% to 40%

                    40% to 50%

                    No to mild

                    Mild to medium, this could be due to varied reasons like not knowing answers, tensed or stressed etc.

                    High levels of deception.
                  </p>
                </div>
              </div>
            </div>
          </div> */}


          <div className='lg:mx-10 mx-4 my-5 '>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">Candidate Personality Report</p>
              </div>
              <div className="my-4 px-5 vertical-align-middle" >
                {persona?
                  <p className="text-gray-500 text-lg">
                    <span className='font-semibold pb-4'>Folowing traits are observed for <strong>{applicant && applicant.firstName}</strong>.</span><br/>
                    - Action orientness is <strong>{persona.actionOrientedness.level}</strong>. <br/>
                    - Has a <strong>{persona.attitudeAndOutlook.level}</strong> attitude and outlook. <br/>
                    - The team work skills are <strong>{persona.teamWorkSkills.level}</strong>. <br/>
                    - The learning ability is <strong>{persona.learningAbility.level}</strong>. <br/>
                    - Has a <strong>{persona.needForAutonomy.level}</strong> need for autonomy. <br/>
                    - The general behavior is <strong>{persona.generalBehavior.level}</strong>.
                  </p>
                :null}
                {/* <div> <p className="py-2 font-bold">Personality (OCEAN)</p>
                  <p className="text-gray-500 text-lg">This Big Five assessment measures your scores on five major dimensions of personality Openness, Conscientiousness, Extraversion,
                    Agreeableness, and Neuroticism (OCEAN).</p>
                </div>
                <div>
                  {psycsdetails?
                  <BarChart psydata={psycsdetails.data} />
                  :null}
                </div> */}
              </div>

            </div>
          </div>


          {/* <div className='lg:mx-10 mx-4 mt-10 '>
            <div className="text-xl py-5 rounded-t-lg text-white font-bold  flex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Cognitive Aptitude</p>
            </div>
            <div className="lg:flex">
              <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">

                <div className='mx-5'> <p className="py-2 font-bold">The Cognitive aptitude are scored as percentiles</p>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">Required
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">Score
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Critical Thinking
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Problem Solving
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Attention to details
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>

                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Numerical reasoning
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>
                <div className='flex w-full'>
                  <div className='w-1/3 mx-5'>Spatial reasoning
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">60%
                    </p>
                  </div>
                  <div className='w-1/3 mx-5'>
                    <p className="py-2 font-bold">50%
                    </p>
                  </div>
                </div>


              </div>
              <div className='w-1 bg-gray-200'></div>
              <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">

                <RadarChart />
              </div>
            </div>
          </div> */}


          <div className='lg:mx-10 mx-4 my-5 '>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">Technical Assessment </p>
              </div>
              <div className="flex my-4 px-5 vertical-align-middle" >
                <div className='flex justify-around '> <p className="font-bold">Coding Assessment</p>
                  <p className="text-gray-400 text-sm font-semibold  m-5">Problem: Find out if the given two Strings are anagrams or not
                    <h5>
                      <strong>Language:</strong> {application && application.codelanguage}
                    </h5>
                  </p>
                </div>
              </div>

            </div>
          </div>


          <div className='lg:mx-10 mx-4 my-5 '>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">Interviewers Score & Notes</p>
              </div>
              <div>
                {(evaluated && jobskills && selfassested)?
                  <StackedChart evaluated={evaluated} jobskills={jobskills} selfassested={selfassested} />
                :null}
              </div>
              <div className='w-full'>
                <p className="py-2 mx-5 font-bold">Positives</p>
                <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">

                  <div className='flex w-full gap-3'>
                    <p className="text-gray-400 text-sm">Candidate s approach towards the solution was fine, he started by checking if the string is an anagram and then proceeded to
                      perform operations to find if the string is an anagram.
                    </p>
                  </div>

                </div>
              </div>
              <div className='w-full'>
                <p className="py-2 mx-5 font-bold">Lowlights</p>
                <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">

                  <div className='flex w-full gap-3'>
                    <p className="text-gray-400 text-sm">The solution was implemented using old ways of writing codes, when enquired candidate is not aware of modern coding
                      formats like
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className='lg:mx-10 mx-4 my-5 h-fit'>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
              <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
                style={{ backgroundColor: "rgb(3, 68, 136)" }}>
                <p className="px-6 mx-2  text-xl">Recordings and playback</p>
              </div>
              <div className="my-4 px-5 vertical-align-middle" >
                <div>
                  <p className="py-2 font-bold">Candidate interviewed by  (masked id) on {interview_date}</p>
                  {/* <p className="py-2 font-bold">Feedback reviewed by Paula Rose on 2nd August 2022 at 6:30 am GMT.
                  </p>
                  <p className="py-2 font-bold">Quality check by YJKLXXXXMD (masked id) on 2nd August 2022 at 1 pm GMT.
                  </p> */}
                  <p className="py-2 font-bold">The complete interview session is available for your below <span> <a className='text-blue-500 hidden' href=" www.valuematrix.ai/interview/12549558475545525212"> www.valuematrix.ai</a></span>
                  </p>
                </div>
              </div>
              <div className='w-full px-8'>
                <video width="100%" controls>
                  <source src="https://d3bkmu9apbxn6w.cloudfront.net/5b74347b-69ab-4cf3-ac57-4886e633f7a5_recording.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                {/* <iframe className='mx-auto rounded-lg w-4/5' height={400} src="https://valuematrix.s3.ap-south-1.amazonaws.com/5b74347b-69ab-4cf3-ac57-4886e633f7a5_recording.mp4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
              </div>
            </div>
          </div>
        </div>






        <div className='right lg:w-1/3 mx-2 lg:mx-0'>
          <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-fit my-3 bg-white ">
            <div className="text-xl py-5 rounded-t-lg text-white font-bold  flex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Heimdall Anti Deception Engine</p>
            </div>
            <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Browser/OS</p>
                <p className="text-gray-400 text-sm text-right font-bold ml-8">{browserName}</p>
              </div>
            </div>
            {/* <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Location</p>
                <p className="text-gray-400 text-sm text-right ml-8">Raritan, New Jersey, USA</p>
              </div>
            </div> */}
            <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Face Detection</p>
                <p className="text-gray-400 text-sm text-right font-bold ml-8">{faceTest ? <span className={"text-green-500"}>Detected</span> : <span className={"text-red-500"}>Not Detected</span>} </p>

                {/* <p className="text-gray-400 text-sm text-right ml-8">Detected Individual identified as Peter

                  (verified & matched with Profile and LinkedIn picture) </p> */}
              </div>
            </div>
            <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Gaze Tracking</p>
                <p className="text-gray-400 text-sm text-right font-bold ml-8">{gazeTest ? <span className={"text-green-500"}>Detected</span> : <span className={"text-red-500"}>Not Detected</span>} </p>
              </div>
            </div>
            <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Earpiece Detection</p>
                <p className="text-gray-400 text-sm text-right font-bold ml-8">{earpieceDetectionStatus ? <span className={"text-red-500"}>Detected</span> : <span className={"text-green-500"}>Not Detected</span>} </p>

              </div>
            </div>
            <div className="flex my-4 px-5 vertical-align-middle" >
              <div className='flex w-full justify-between'>
                <p className="font-md font-bold">Eye Blink Rate</p>
                <p className="text-gray-400 text-sm text-right font-bold ml-8">{leftEyeBlinkRate}</p>
              </div>
            </div>

          </div>


          {/* <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-fit my-3 bg-white ">
            <div className="text-xl py-5 rounded-t-lg text-white font-bold  flex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Candidate Other Exposures</p>
            </div>
            <div className="mt-3">
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Look alike Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Hint Control </p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">DE&I</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">XI & Candidate Collision Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
              <div className="flex px-5 vertical-align-middle" >
                <div className='flex w-full justify-between'> <p className="py-2 font-bold font-md">Candidate Peer Collision Detection</p>
                  <p className="text-gray-400 text-sm">On</p>
                </div>
              </div>
            </div>
          </div> */}


          <div className='my-3'>
            <div>
              {applicant ?
                <img className='rounded-t-lg' src={url + "/media/profileImg/" + applicant.profileImg} width="100%" alt="" />
                :
                <img className='rounded-t-lg' src={Avatar} width="100%" alt="" />
              }
            </div>
            <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white ">
              <div className="text-xl pt-5 rounded-lg text-black font-bold flex">
                <p className="mx-5 text-xl">{applicant && applicant.firstName}</p>
              </div>
            </div>
          </div>

          <div className="shadow-lg sm:w-full md:w-full lg:w-full my-3 pb-10 h-auto  bg-white ">
            <div className="text-xl py-5 text-white rounded-t-lg bg-blue-600 ex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Interviewer Feedback </p>
            </div>

            <div className='mx-5 mt-4'>
              {application?
                <p className="text-gray-400 text-sm">{application.evaluations[application.interviewers].feedback}</p>
              :null}
            </div>

          </div>

          <div className="shadow-lg sm:w-full md:w-full lg:w-full my-3 pb-10 h-auto  bg-white ">
            <div className="text-xl py-5 text-white rounded-t-lg bg-blue-600 ex"
              style={{ backgroundColor: "rgb(3, 68, 136)" }}>
              <p className="px-6 mx-2  text-xl">Candidate Feedback </p>
            </div>
            <div className="flex my-4 vertical-align-middle" >
              <div className='flex w-full mx-5 justify-between'> <p className="py-2 font-bold">{applicant && applicant.firstName}</p>
                <div className='flex gap-1'>
                  {application?<>
                    {application.rating > 0 ? <BsFillStarFill />:null}
                    {application.rating > 1 ? <BsFillStarFill />:null}
                    {application.rating > 2 ? <BsFillStarFill />:null}
                    {application.rating > 3 ? <BsFillStarFill />:null}
                    {application.rating > 4 ? <BsFillStarFill />:null}
                  </>
                  :null}
                </div>
              </div>
            </div>

            <div className='mx-5'>
              {application?
                <p className="text-gray-400 text-sm">{application.candidatefeedback}</p>
              :null}

            </div>

          </div>
        </div>
      </div>



    </div>
  )
}

export default CPrintable