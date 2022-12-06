import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteGrid, DyteParticipantsAudio, DyteMeeting } from "@dytesdk/react-ui-kit";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import { useState } from "react";
import { useEffect } from "react";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
  startinterview,
  endinterview,
  stopproctoring,
  getproctoring,
  handlerecording,
} from "../service/api";
import Editor from "@monaco-editor/react";
import renderHTML from 'react-render-html';

import { getxiquestions, getinterviewjob, checkinterviewdetails, getlivestatus, setquestionresult } from "../service/api.js";
import { useParams } from "react-router-dom";
import swal from "sweetalert";
import logo from "../assets/images/logo.png";

import UpdateInterviewApplication from "./XIDashboard/UpdateInterviewApplication.jsx";
import axios from "axios";

export default function MyMeeting() {
    const { meeting } = useDyteMeeting();
    const [user, setUser] = useState(null);
    const [access_token, setAccessToken] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [language, setlanguage] = useState(null);
    const [livestats, setLiveStats] = useState(null);
    const [theme, settheme] = useState(null);
    const [code, setcode] = useState(null);
    const [usercode, setusercode] = useState("");
    const [receivedcode, setreceivedcode] = useState("//Write your code here...");
    const [xiquestion, setxiquestion] = useState(null);
    const [selectedlanguage, setselectedlanguage] = useState("Javascript");
    const [currentUser, setCurrentUser] = useState(null);
    const [interviewStatus, setInterviewStatus] = useState(null);
    const [nqtype, setnqtype] = useState(null);
    const [nqlevel, setnqlevel] = useState(null);
    const [nqexperience, setnqexperience] = useState(null);
    const [nqcategory, setnqcategory] = useState(null);
    const [lateststats, setlateststats] = useState(null);
    const [codeInputs, setCodeInputs] = useState("");
    const [codeOutputs, setCodeOutputs] = useState("");
    const [timestamptext, settimestamptext] = useState("");
    const [pscount, setpscount] = useState(0);
    const [gqcount, setgqcount] = useState(0);
    const [activearea, setactivearea] = useState(0);
    const [intvboard, setintvboard] = useState(null);

    const [value, setValue] = useState(code || "");
    const {id} = useParams();

    let fetchinter = null;
    let getstats = null;

    const handleEditorChange = (value) => {
      setValue(value);
    };

    const leaveCall = async ()=>{
      let orgid = "c2c3dde8-0e37-45ed-9d4a-e324a5f3fdce";
      let getrec = await axios.get("https://api.cluster.dyte.in/v1/organizations/"+orgid+"/meetings/"+interviewStatus.data.meetingID+"/recordings",{
        headers:{
          Authorization: 'Basic a9776634bc04e1573d26',
        }
      });
      if(getrec){
        let stoprecording = await handlerecording(interviewStatus.data.meetingID, id, getrec.data.data.recordings[0].downloadUrl);
        let end = await endinterview(id);
        if(end && stoprecording){
          meeting.leaveRoom();
          window.location.href= "/XI/UpdateInterviewApplication/"+id;
        }else{
          swal({
            icon: "error",
            title: "Something went wrong!",
            button:"Ok"
          });
        }
      }else{
        swal({
          icon: "error",
          title: "Something went wrong!",
          button: "Ok"
        });
      }
    }

    const startcall = async ()=>{
      let start = await startinterview(id);
    }

    const handletimestamp = (e)=>{
      settimestamptext(e.target.value);
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

    const setcorrect = async ()=>{
      let intvquestion = {
        question: xiquestion.question,
        level: xiquestion.level,
        type: xiquestion.type,
        answer: xiquestion.answer,
        experience: xiquestion.experience,
        category: xiquestion.category,
        submission: "Correct"
      }
      setxiquestion(null);
      let setques = await setquestionresult(id, intvquestion);
    }

    const setincorrect = async ()=>{
      let intvquestion = {
        type: xiquestion.question,
        level: xiquestion.level,
        type: xiquestion.type,
        answer: xiquestion.answer,
        experience: xiquestion.experience,
        category: xiquestion.category,
        submission: "Incorrect"
      }
      setxiquestion(null);
      let setques = await setquestionresult(id, intvquestion);
    }

    const setskipped = async ()=>{
      let intvquestion = {
        type: xiquestion.question,
        level: xiquestion.level,
        type: xiquestion.type,
        answer: xiquestion.answer,
        experience: xiquestion.experience,
        category: xiquestion.category,
        submission: "Skipped"
      }
      setxiquestion(null);
      let setques = await setquestionresult(id, intvquestion);
    }

    const getnextquestion = async ()=>{
      if(nqtype == null || nqlevel == null || nqexperience == null || nqcategory == null){
        swal({
          title: "Do select all the fields to get next question!",
          message: "Do select all the fields.",
          icon: "error",
          button: "Ok",
        });
      }else{
        if(nqtype === "General Question"){
          let xiquestion = await getxiquestions(nqtype,nqlevel,nqexperience,nqcategory);
          setxiquestion(xiquestion.data.ques);
          setgqcount(gqcount+1);
        }else{
          let xiquestion = await getxiquestions(nqtype,nqlevel,nqexperience,nqcategory);
          setxiquestion(xiquestion.data.ques);
          setpscount(pscount+1);
        }
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
            // console.log(interviewStatus);
  
            if(interviewStatus.data.data === "Data Retrieved"){
              let interviewjob = await getinterviewjob(interviewStatus.data.jobid);
              // console.log(interviewjob.data.job.skills[0].role);
              let xiquestion = await getxiquestions("General Question","Easy","Beginner",interviewjob.data.job.skills[0].role);
              // console.log(xiquestion);
              setxiquestion(xiquestion.data.ques);
            }else{
              // console.log("Error");
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
            // console.log(user.data.user);
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
      fetchinter = setInterval(async ()=>{
        getstats = await getlivestatus(id);
        setLiveStats(getstats.data.stats.livestats);
        setlateststats(getstats.data.stats);
        setValue(atob(getstats.data.stats.codearea))
        setCodeInputs(getstats.data.stats.codestdin);
        setCodeOutputs(getstats.data.stats.codestdout);
        setselectedlanguage(getstats.data.stats.codelanguage);
      },2000);
    },[]);
  
    return (
      <div style={{ minHeight:"100vh", backgroundColor:"#080808" }} className="flex flex-col">
        <div className="flex m-0" style={{ backgroundColor:"#080808", position:"relative", height:"92vh" }}>
          <div className="md:w-1/2 h-full pl-2">
            <div className="w-full flex mt-4">
              <div className="w-1/3">
                <div className={ activearea===0 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer":"border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer" } onClick={()=>{setactivearea(0)}} style={{ borderRadius:"10px 0px 0px 10px" }}>CODING</div>
              </div>
              <div className="w-1/3">
                <div className={ activearea===1 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer":"border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer" } onClick={()=>{setactivearea(1)}} style={{ borderRadius:"0px 0px 0px 0px" }}>WHITEBOARD</div>
              </div>
              <div className="w-1/3">
                <div className={ activearea===2 ? "border-2 border-white w-full text-center p-2 font-bold bg-white text-gray-900 cursor-pointer":"border-2 border-white w-full text-center p-2 font-bold bg-gray-900 text-white cursor-pointer" } onClick={()=>{setactivearea(2)}} style={{ borderRadius:"0px 10px 10px 0px" }}>EVALUATION</div>
              </div>
            </div>
            {!activearea?<div>
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
              <div className="flex mb-8" style={{ height:"14vh" }}>
                <div className="md:w-1/2 mr-2">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    <pre className="px-2 py-1 font-normal text-xs text-white">
                      {codeInputs}
                    </pre>
                  </div>
                </div>
                <div className="md:w-1/2 ml-2">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4 h-full">
                    <pre className="px-2 py-1 font-normal text-xs text-white">
                      {atob(codeOutputs)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>:<div>
              {!(activearea-1)?
              <div className="w-full my-2 py-2 bg-white" style={{ height:"72vh" }}>
                {intvboard?
                  <img src={intvboard} width="100%"/>
                :null}
              </div>
              :
              <div className="w-full my-2 py-2 bg-white" style={{ height:"72vh", overflowY:"scroll" }}>
                <UpdateInterviewApplication/>
              </div>
              }
            </div>}
            <div className="bg-gray-900 text-white p-4 rounded-2xl text-md flex" style={{ height:"10vh" }}>
              <textarea onChange={handletimestamp} className="w-5/6 bg-gray-900 text-white border-0" placeholder="Timestamp the session..."></textarea>
              <button className="bg-green-500 w-1/6 text-white text-md font-bold rounded-xl">Set Timestamp</button>
            </div>
          </div>
          <div className="md:w-1/2 h-full">
            <div className="w-full py-4 pr-2 pl-4">
              <div className="flex gap-3" style={{ height:"28vh" }}>
                <div className="md:w-3/4">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
                    { xiquestion?<>
                      <strong>Question: </strong> {renderHTML(xiquestion.question)}
                      <strong>Answer: </strong> {xiquestion.answer}<br/>
                      <strong>Type: </strong> {xiquestion.type}<br/>
                      <strong>Level: </strong> {xiquestion.level}<br/>
                      <strong>Category: </strong> {xiquestion.category}<br/>
                      <button className="rounded border-2 border-green-500 bg-green-500 text-white font-bold px-4 py-2 mr-2 mt-4" onClick={setcorrect}>Correct</button>
                      <button className="rounded border-2 border-red-500 bg-red-500 text-white font-bold px-4 py-2 mr-2 mt-4" onClick={setincorrect}>Incorrect</button>
                      <button className="rounded border-2 border-gray-200 text-gray-200 font-bold px-4 py-2 mt-4" onClick={setskipped}>Skip</button>
                    </>: <>
                      <div>
                        <h2 className="text-white font-bold mb-3">Loading Next Question...</h2>
                      </div>
                    </> }
                  </div>
                </div>
                <div className="md:w-1/4">
                  <div className="bg-gray-900 text-white p-4 rounded-2xl text-md h-full">
                    {livestats?
                      <>
                        <strong>Face:</strong> {livestats.countOfPeople != 0 ?<span className="text-green-500">Pass</span>:<span className="text-red-500">Fail</span>}<br/>
                        <strong>Earpiece:</strong> {livestats.earPiece === null ?<span className="text-green-500">Pass</span>:<span className="text-red-500">Fail</span>}<br/>
                        <strong>Gaze:</strong> {livestats.gaze === null ?<span className="text-green-500">Pass</span>:<span className="text-red-500">Fail</span>}<br/>
                        <strong>Emotion:</strong> <span className="text-green-500">{livestats.emotion}</span><br/>
                        <strong>Head Pose:</strong> <span className="text-green-500">{livestats.headPose}</span><br/>
                      </>
                    :<>Loading...</>}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex pb-4" style={{ height:"60vh" }}>
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
        <div className="flex bg-white justify-center items-center" style={{ height:"8vh" }}>
          <div className="md:w-1/6 px-6">
            <img src={logo} style={{ height:"4vh" }} />
          </div>
          <div className="md:w-4/6 flex justify-center items-center">
            {lateststats?<>
              {lateststats.interviewStatus?<>
                <button className="rounded-2xl bg-red-600 text-white px-4 py-2 font-bold" onClick={leaveCall}>End Interview</button>
              </>:<>
                <button className="rounded-2xl bg-green-600 text-white px-4 py-2 font-bold" onClick={startcall}>Start Interview</button>
              </>}
            </>:null}
          </div>
          <div className="md:w-1/6"></div>
        </div>
      </div>
    );
}