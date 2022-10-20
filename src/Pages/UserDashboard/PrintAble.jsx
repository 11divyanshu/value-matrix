import React from 'react'
import Logo from "../../assets/images/logo.png"
import UserAvatar from "../../assets/images/loginBackground.jpeg"
import { BsFillStarFill } from 'react-icons/bs'
import BarChart from '../../Components/Dashbaord/BarChart';
import RadarChart from '../../Components/Dashbaord/RadarChar';
import StackedChart from '../../Components/Dashbaord/StackedChart';


const printAble = () => {
  return (
    <div>
      <div className="mx-auto mt-2 ">
        <div className='mx-16 my-10'><img src={Logo} alt="" className='h-20' /></div>
        <div className=" mx-10 lg:flex gap-2 mt-2 ">
          <div className="lg:w-1/3 w-full rounded-lg my-2">
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
          </div>
          <div className="lg:w-1/3 w-full rounded-lg my-2">
            <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
              <p className='text-xs font-semibold mx-2'>Candidate Details</p>
              <div className=" text-sm mx-2 my-3 flex justify-between">
                <div className=''>
                  <p className='text-xs my-2'>Company:</p>
                  <p className='text-xs my-2'>Candidate:</p>
                </div>
                <div className=''>
                  <p className='text-xs my-2'>Microsoft</p>
                  <p className='text-xs my-2'>Peter</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/3 w-full rounded-lg my-2">
            <div className="bg-white rounded-lg shadow h-32 py-5" style={{ background: "#9BDDFB" }}>
              <p className='text-xs font-semibold mx-2'>Interview Details</p>
              <div className=" text-sm mx-2 text-gray-500 flex justify-between ">
                <div className=''>
                  <p className='text-xs my-1'>Position:</p>
                  <p className='text-xs my-1'>Round:</p>
                  <p className='text-xs my-1'>Interview Date:</p>
                </div>
                <div className=''>
                  <p className='text-xs my-1'>SSE 1</p>
                  <p className='text-xs my-1'>Live Coding (90 Mins)</p>
                  <p className='text-xs my-1'>20-07-2022 | 09:00 am</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:flex md:flex mt-10 mx-10">

        <div className="shadow-lg sm:w-full md:w-full lg:w-full h-auto bg-white ">
          <div className="text-xl py-5 rounded-tl-lg text-white font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 text-xl">Heimdall Anti Deception Engine</p>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Device</p>
              <p className="text-gray-400 text-sm text-right ml-8">Lenovo Laptop</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Location</p>
              <p className="text-gray-400 text-sm text-right ml-8">Raritan, New Jersey, USA</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Face Detection</p>
              <p className="text-gray-400 text-sm text-right ml-8">Detected Individual identified as Peter

                (verified & matched with Profile and LinkedIn picture) </p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Gaze Tracking</p>
              <p className="text-gray-400 text-sm text-right ml-8">On

                Candidate was always looking at the screen or camera</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Earpiece Detection</p>
              <p className="text-gray-400 text-sm text-right ml-8">Not Detectedr</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'>
              <p className="font-md font-bold">Eye Blink Rate</p>
              <p className="text-gray-400 text-sm text-right ml-8">Normal</p>
            </div>
          </div>

        </div>

        <div className='w-1 bg-gray-200'></div>

        <div className="shadow-lg sm:w-full md:w-full lg:w-full h-auto  bg-white ">
          <div className="text-xl py-5 rounded-tr-lg text-white font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Candidate Other Exposures</p>
          </div>
          <div className="flex mt-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'> <p className="font-bold font-md">Look alike Detection</p>
              <p className="text-gray-400 text-sm">On</p>
            </div>
          </div>

          <div className="flex mt-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'> <p className="font-bold font-md">Hint Control </p>
              <p className="text-gray-400 text-sm">On</p>
            </div>
          </div>


          <div className="flex mt-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'> <p className="font-bold font-md">DE&I</p>
              <p className="text-gray-400 text-sm">On</p>
            </div>
          </div>
          <div className="flex mt-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'> <p className="font-bold font-md">XI & Candidate Collision Detection</p>
              <p className="text-gray-400 text-sm">On</p>
            </div>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex w-full justify-between'> <p className="font-bold font-md">Candidate Peer Collision Detection</p>
              <p className="text-gray-400 text-sm">On</p>
            </div>
          </div>
        </div>
      </div>





      <div className='w-100 mx-10 h-1 bg-gray-200'></div>

      <div className="lg:flex md:flex mb-10 mx-10">
        <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">
          <div>
            <img src={UserAvatar} alt="" />
          </div>
          <div className="text-xl py-5 text-white bg-blue-600 ex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Candidate Feedback </p>
          </div>
          <div className="flex my-4 vertical-align-middle" >
            <div className='flex w-full mx-5 justify-between'> <p className="py-2 font-bold">Peter</p>
              <div className='flex gap-1'>
                <BsFillStarFill />
                <BsFillStarFill />
                <BsFillStarFill />
                <BsFillStarFill />
                <BsFillStarFill />
              </div>
            </div>
          </div>

          <div className='mx-5'>

            <p className="text-gray-400 text-sm">I had a smooth interview experience. Person who took my tech
              round was calm, humble and thorough with technology </p>
          </div>

        </div>


        <div className='w-1 bg-gray-200'></div>


        <div className="shadow-lg sm:w-full md:w-full lg:w-1/2 pb-10 h-auto  bg-white ">
          <div className="text-xl py-5 rounded-tr-lg text-black font-bold  flex">
            <p className="mx-5  text-xl">Candidate Details</p>
          </div>
          <div className="flex my-2 vertical-align-middle" >
            <div className='flex mx-5 w-full justify-between'> <p className="py-2 font-bold font-md">Job Code</p>
              <p className="text-gray-400 text-sm">ABC-KJS-CKS</p>
            </div>
          </div>
          <div className="flex my-2 vertical-align-middle" >
            <div className='flex mx-5 w-full justify-between'> <p className="py-2 font-bold font-md">Job Family</p>
              <p className="text-gray-400 text-sm">Software Developer</p>
            </div>
          </div>
          <div className="flex my-2 vertical-align-middle" >
            <div className='flex mx-5 w-full justify-between'> <p className="py-2 font-bold font-md">Job Title</p>
              <p className="text-gray-400 text-sm">Senior Software Developer</p>
            </div>
          </div>
          <div className="flex my-2 vertical-align-middle" >
            <div className='flex mx-5 w-full justify-between'> <p className="py-2 font-bold font-md">Name</p>
              <p className="text-gray-400 text-sm">Peter</p>
            </div>
          </div>
          <div className="flex my-2 vertical-align-middle" >
            <div className='flex mx-5 w-full justify-between'> <p className="py-2 font-bold font-md">Invited to interview</p>
              <p className="text-gray-400 text-sm">26th July 2022</p>
            </div>
          </div>
          <div className='w-5/6'>
            <p className="text-gray-400 text-lg mx-5">Candidate resume and other details are available at


              Mr.Peter was assessed on 2nd of August 2022 on ValueMatrix.ai
              platform by ABCDXXXXAS (masked id) at 5 am GMT.

              Please note the interviewer has enabled the masked mode for
              enhanced privacy</p>
          </div>
        </div>
      </div>
      {/* ------------------------------ */}
      <div className='mx-10 my-5'>
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
      </div>
      {/* ------------------------------------------- */}
      <div className='mx-10 my-5 '>
        <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
          <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Candidate Assessment Report</p>
          </div>
          <div className="my-4 px-5 vertical-align-middle" >
            <div> <p className="py-2 font-bold">Personality (OCEAN)</p>
              <p className="text-gray-500 text-lg">This Big Five assessment measures your scores on five major dimensions of personality Openness, Conscientiousness, Extraversion,
                Agreeableness, and Neuroticism (OCEAN).</p>
            </div>
            <div>
              <BarChart />
            </div>
            <div>
              <p className="text-gray-500 text-lg">The OCEAN score suggests that Mr. Peter is curious and a creative person interested in learning and trying new things and excited by
                challenge. Mr. Glaxon is goal oriented, shows attention to details and have a strong work ethic. </p>
            </div>
          </div>

        </div>
      </div>

      {/* ------------------ */}

      <div className=' mt-10 mx-10'>
        <div className="text-xl py-5 rounded-tl-lg text-white font-bold  flex"
          style={{ backgroundColor: "rgb(3, 68, 136)" }}>
          <p className="px-6 mx-2  text-xl">Cognitive Aptitude</p>
        </div>
        <div className="lg:flex md:flex ">
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
      </div>
      {/* ------------------ */}
      <div className='mx-10 my-5 '>
        <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
          <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Technical Assessment </p>
          </div>
          <div className="flex my-4 px-5 vertical-align-middle" >
            <div className='flex justify-around '> <p className="font-bold">Coding Assessment</p>
              <p className="text-gray-400 text-sm font-bold  m-5">Problem: Find out if the given two Strings are anagrams or not

                Language: Java
              </p>
            </div>
          </div>

        </div>
      </div>
      {/* ------------------ */}
      <div className='mx-10 my-5 '>
        <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
          <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Interviewers Score & Notes</p>
          </div>
          <div>
                <StackedChart />
              </div>
          <div className='w-full'>
            <p className="py-2 mx-5 font-bold">Positives</p>
            <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">

              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">Candidate s approach towards the solution was fine, he started by checking if the string is an anagram and then proceeded to
                  perform operations to find if the string is an anagram.
                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">Kept the code clean and was able to clearly explain the logic he has implemented.

                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">He made sure the requirements are well understood before he began to implement the solution.

                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">Followed the design process to pay attention on pre steps before jumping onto HLD

                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">He has good communication & clear thoughts. He was composed throughout the session & asked relevant questions and was
                  interactive.


                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">Explained what were the design choices he has made based on the requirements. Able to explain and justify the choices made.



                </p>
              </div>

            </div>
          </div>
          <div className='w-full'>
            <p className="py-2 mx-5 font-bold">Lowlights</p>
            <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">

              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">The solution was implemented using old ways of writing codes, when enquired candidate is not aware of modern coding
                  formats like
                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">lambda, streams etc

                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md">-</p>
                <p className="text-gray-400 text-sm">Corner cases like null, empty & number check were missing.


                </p>
              </div>
              <div className='flex w-full gap-3'> <p className="font-bold font-md mx-1 "> </p>
                <p className="text-gray-400 text-sm">There were compilation errors in the beginning, needed nudge to correct those.
                </p>
              </div>


            </div>
          </div>
          <div className='w-full'>
            <p className="py-2 mx-5 font-bold">Recommendation</p>
            <div className="text-gray-400 py-3 text-sm px-5 mx-5 bg-gray-100 rounded-lg my-4 vertical-align-middle">
              <div className='w-full'>
                <p className="text-gray-400 text-sm">(Rating 8/10)
                </p>
                <p className="text-gray-400 text-sm">                  ABCDXXXXAS (masked id) recommends this candidate as Strong and good to Proceed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------ */}
      <div className='mx-10 my-5 '>
        <div className="shadow-lg sm:w-full md:w-full lg:w-full pb-10 h-auto bg-white rounded-b-lg">
          <div className="text-xl py-5 text-white rounded-t-lg font-bold  flex"
            style={{ backgroundColor: "rgb(3, 68, 136)" }}>
            <p className="px-6 mx-2  text-xl">Recordings and playback</p>
          </div>
          <div className="my-4 px-5 vertical-align-middle" >
            <div>
              <p className="py-2 font-bold">Candidate interviewed by ABCDXXXXAS (masked id) on 2nd August 2022 at 5am GMT</p>
              <p className="py-2 font-bold">Feedback reviewed by Paula Rose on 2nd August 2022 at 6:30 am GMT.
              </p>
              <p className="py-2 font-bold">Quality check by YJKLXXXXMD (masked id) on 2nd August 2022 at 1 pm GMT.
              </p>
              <p className="py-2 font-bold">The complete interview session is available for your review at <span> <a className='text-blue-500' href=" www.valuematrix.ai/interview/12549558475545525212">
                www.valuematrix.ai</a></span>
              </p>
            </div>
            <div className='w-full'>
                <iframe className='mx-auto rounded-lg w-4/5' height={400} src="https://www.youtube.com/embed/g_1oiJqE3OI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
          </div>
        </div>
      </div>

      <div className='mx-10 my-5'>
        <h3>Copyright © 2022 valuematrix.ai. All rights reserved.</h3>
      </div>
    </div>
  )
}

export default printAble