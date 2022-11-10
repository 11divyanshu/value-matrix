import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteGrid, DyteParticipantsAudio, DyteMeeting } from "@dytesdk/react-ui-kit";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import { useState } from "react";
import { useEffect } from "react";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
} from "../service/api";
import Editor from "@monaco-editor/react";
import renderHTML from 'react-render-html';

import { getxiquestions, getinterviewjob, checkinterviewdetails } from "../service/api.js";
import { useParams } from "react-router-dom";
import swal from "sweetalert";

export default function MyMeeting() {
    const { meeting } = useDyteMeeting();
    const [user, setUser] = useState(null);
    const [access_token, setAccessToken] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [language, setlanguage] = useState(null);
    const [theme, settheme] = useState(null);
    const [code, setcode] = useState(null);
    const [usercode, setusercode] = useState("");
    const [receivedcode, setreceivedcode] = useState("");
    const [xiquestion, setxiquestion] = useState(null);
    const [selectedlanguage, setselectedlanguage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [interviewStatus, setInterviewStatus] = useState(null);
    const [nqtype, setnqtype] = useState(null);
    const [nqlevel, setnqlevel] = useState(null);
    const [nqexperience, setnqexperience] = useState(null);
    const [nqcategory, setnqcategory] = useState(null);

    const [value, setValue] = useState(code || "");
    const {id} = useParams();

    const handleEditorChange = (value) => {
      setValue(value);
    };

    const leaveCall = ()=>{
      meeting.leaveRoom();
    }

    const handletype = (e)=>{
      setnqtype(e.target.value);
    }

    const handlelevel = (e)=>{
      setnqlevel(e.target.value);
    }

    const handlexperience = (e)=>{
      setnqexperience(e.target.value);
    }

    const handlecategory = (e)=>{
      setnqcategory(e.target.value);
    }

    const getnextquestion = ()=>{
      if(nqtype == null || nqlevel == null || nqexperience == null || nqcategory == null){
        swal({
          title: "Do select all the fields to get next question!",
          message: "Do select all the fields.",
          icon: "error",
          button: "Ok",
        });
      }
    }

    useEffect(()=>{
      meeting.joinRoom();
      const initial = async ()=>{
        let user = JSON.parse(localStorage.getItem("user"));
        if(user === null){
          window.location.href="/login";
        }else{
          if(user.isXI === true){
            setCurrentUser(user);
            let interviewStatus = await checkinterviewdetails(id, user);
            setInterviewStatus(interviewStatus);
            console.log(interviewStatus);
  
            if(interviewStatus.data.data === "Data Retrieved"){
              let interviewjob = await getinterviewjob(interviewStatus.data.jobid);
              console.log(interviewjob.data.job.skills[0].role);
              let xiquestion = await getxiquestions("General Question","Easy","Beginner",interviewjob.data.job.skills[0].role);
              console.log(xiquestion);
              // setxiquestion(xiquestion.data.ques);
            }else{
              console.log("Error");
            }
          }else{
            window.location.href="/login";
          }
        }
      }
      const tokenFunc = async () => {
        let access_token1 = null;
        let location = window.location.search;
        const queryParams = new URLSearchParams(location);
        const term = queryParams.get("a");

        // If Token is passed in the url
        if (term !== null && term !== undefined && term !== "null") {
          await localStorage.removeItem("access_token");
          access_token1 = term;
          await setAccessToken(term);
          await localStorage.setItem("access_token", term);

          await setAccessToken(access_token1);

          let user_id = await getUserIdFromToken({ access_token: access_token1 });
          let a = await localStorage.getItem("access_token");
          if (a === "null") {
            let u = JSON.parse(await localStorage.getItem("user"));
            await localStorage.setItem("access_token", u._id);
          }
          if (user_id) {
            let user = await getUserFromId(
              { id: user_id.data.user.user },
              access_token1
            );

            await setUser(user.data.user.user);
            if (user.invite) {
              window.location.href = "/setProfile" + user.resetPassId;
            }
            if (user.profileImg) {
              let image = await getProfileImage(
                { id: user_id.data.user.user },
                access_token1
              );
              setProfileImg(image.data.Image);
              await localStorage.setItem(
                "profileImg",
                JSON.stringify(image.data.Image)
              );
            }
            console.log(user.data.user);
            if (
              user.data.user.access_valid === false ||
              user.data.user.user_type !== "XI"
            )
              window.location.href = "/login";
            await localStorage.setItem("user", JSON.stringify(user.data.user));
            // window.history.pushState({ url: "/XI" }, "", "/XI");
            window.location.href="/XI";
          } else {
            window.location.href = "/login";
          }
        } else {
          let access_token = await localStorage.getItem("access_token");
          await setAccessToken(access_token);
          let user = JSON.parse(localStorage.getItem("user"));
          await setUser(user);

          if (user.access_valid === false || user.user_type !== "XI") {
            window.location.href = "/login";
          }
        }
        let user = JSON.parse(localStorage.getItem("user"));
        let token = localStorage.getItem("access_token");
        if (!user || !token) {
          window.location.href = "/login";
        }
      };
      tokenFunc();
      initial();
    },[]);
  
    return (
      <div style={{ minHeight:"100vh", backgroundColor:"#080808" }} className="flex flex-col">
        <div className="bg-white">
          <Navbar user={user} />
        </div>
        <div className="flex h-full m-0" style={{ backgroundColor:"#080808", position:"relative" }}>
          <div className="md:w-1/2 h-full pl-2">
            <div className="flex justify-between my-4">
              <div className="text-white">
                <strong>Selected Language: </strong> { selectedlanguage }
              </div>
            </div>
            <Editor
              className="rounded-2xl"
              height="50vh"
              width={`100%`}
              language={language || "javascript"}
              value={value}
              theme="vs-dark"
              defaultValue={ receivedcode }
              onChange={handleEditorChange}
            />
            <div className="flex mb-8">
              <div className="md:w-1/2 mr-2">
                <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                  <pre className="px-2 py-1 font-normal text-xs text-white">
                    Code Inputs Appear Here...
                  </pre>
                </div>
              </div>
              <div className="md:w-1/2 ml-2">
                <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                  <pre className="px-2 py-1 font-normal text-xs text-white">
                    Code Output Appears Here...
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 h-full">
            <div className="w-full h-full py-4 pr-2 pl-4">
              <div className="flex gap-3">
                <div className="md:w-3/4">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
                    { xiquestion?<>
                      <strong>Question: </strong> {renderHTML(xiquestion.question)}
                      <strong>Answer: </strong> {xiquestion.answer}<br/>
                      <strong>Type: </strong> {xiquestion.type}<br/>
                      <strong>Level: </strong> {xiquestion.level}<br/>
                      <strong>Experience: </strong> {xiquestion.experience}<br/>
                      <strong>Category: </strong> {xiquestion.category}<br/>
                      <button className="rounded border-2 border-green-500 bg-green-500 text-white font-bold px-4 py-2 mr-2 mt-4">Correct</button>
                      <button className="rounded border-2 border-red-500 bg-red-500 text-white font-bold px-4 py-2 mr-2 mt-4">Incorrect</button>
                      <button className="rounded border-2 border-gray-200 text-gray-200 font-bold px-4 py-2 mt-4">Skip</button>
                    </>: <>
                      <div>
                        <h2 className="text-white font-bold mb-3">Select Next Question Type</h2>
                      </div>
                      <div className="flex">
                        <div className="w-full">
                          <select id="type" onChange={handlecategory} className="bg-gray-900 text-white w-full">
                            <option value="" selected disabled>Select Category</option>
                            <option value="Java Full Stack Developer">Java Full Stack Developer</option>
                            <option value="Front End Developer">Front End Developer</option>
                            <option value="React Developer">React Developer</option>
                            <option value="Angular Developer">Angular Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="Python Developer">Python Developer</option>
                            <option value="Java Developer">Java Developer</option>
                            <option value="Android Developer">Android Developer</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 my-3">
                        <div className="w-1/2">
                          <select id="type" onChange={handlelevel} className="bg-gray-900 text-white w-full">
                            <option value="" selected disabled>Select Level</option>
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        <div className="w-1/2">
                          <select id="type" onChange={handlexperience} className="bg-gray-900 text-white w-full">
                            <option value="" selected disabled>Select Experience</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advance">Advance</option>
                            <option value="Professional">Professional</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-3/4">
                          <select id="type" onChange={handletype} className="bg-gray-900 text-white w-full">
                            <option value="" selected disabled>Select Type</option>
                            <option value="Problem Statement">Problem Statement</option>
                            <option value="General Question">General Question</option>
                          </select>
                        </div>
                        <div className="w-1/4">
                          <button className="rounded h-full w-full text-white bg-green-500 font-bold" onClick={getnextquestion}>Get Question</button>
                        </div>
                      </div>
                    </> }
                  </div>
                </div>
                <div className="md:w-1/4">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
                    <strong>Face:</strong> Pass
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pb-4">
              <div className="md:w-1/2 px-4">
                <DyteChat
                  className="rounded-2xl"
                  meeting={meeting}
                  style={{ minHeight: '50vh', width: '100%', backgroundColor: '#111827', color:"#fff" }}
                />
              </div>
              <div className="md:w-1/2" style={{ overflowY:"hidden" }}>
                <div style={{ height:"120%", overflowY:"hidden" }}>
                  <DyteMeeting mode="fill" meeting={meeting} className="dytemaster" style={{ height: '100%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex bg-white justify-center p-6">
          <button className="rounded-2xl bg-red-600 text-white px-4 py-2 font-bold" onClick={leaveCall}>Leave Room</button>
        </div>
      </div>
    );
}