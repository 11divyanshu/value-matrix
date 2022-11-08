import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteSetupScreen, DyteLeaveButton, DyteParticipantsAudio, DyteMeeting, DyteParticipant, DyteParticipantCount, DyteGrid, DyteSimpleGrid, DyteParticipants } from "@dytesdk/react-ui-kit";
import { useEffect, useState } from "react";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import Editor from "@monaco-editor/react";
import axios from "axios";

import { compilecode, checkcompilestatus } from "../service/api.js";

import "../assets/stylesheet/dyte.css";

import { languageOptions } from "../Components/languageOption.js";

export default function MyMeeting() {
    const { meeting } = useDyteMeeting();
    const [user, setUser] = useState(null);
    const [access_token, setAccessToken] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [language, setlanguage] = useState(null);
    const [languageid, setlanguageid] = useState(63);
    const [theme, settheme] = useState(null);
    const [code, setcode] = useState(null);
    const [outputDetails, setoutputDetails] = useState(null);
    const [customInput, setCustomInput] = useState("");
    const [processing, setProcessing] = useState(false);

    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value) => {
      setValue(value);
      setcode(value);
    };


    useEffect(()=>{
      meeting.joinRoom();
      var dm = document.getElementById("dytemaster");
      console.log(dm);
    },[]);

    const leaveCall = ()=>{
      meeting.leaveRoom();
    }

    const modifyLanguage = (e)=>{
      setlanguage(languageOptions[e.target.value].name);
      setlanguageid(languageOptions[e.target.value].id);
    }

    const getOutput = () => {
      let statusId = outputDetails?.status?.id;
  
      if (statusId === 6) {
        // compilation error
        return (
          <pre className="px-2 py-1 font-normal text-xs text-red-500">
            {atob(outputDetails?.compile_output)}
          </pre>
        );
      } else if (statusId === 3) {
        return (
          <pre className="px-2 py-1 font-normal text-xs text-green-500">
            {atob(outputDetails.stdout) !== null
              ? `${atob(outputDetails.stdout)}`
              : null}
          </pre>
        );
      } else if (statusId === 5) {
        return (
          <pre className="px-2 py-1 font-normal text-xs text-red-500">
            {`Time Limit Exceeded`}
          </pre>
        );
      } else {
        return (
          <pre className="px-2 py-1 font-normal text-xs text-red-500">
            {atob(outputDetails?.stderr)}
          </pre>
        );
      }
    };

    const handleCompile = async () => {
      setoutputDetails(null);
      setProcessing(true);
      const formData = {
        language_id: languageid,
        source_code: btoa(code),
        stdin: btoa(customInput),
      };
      
      const cc = await compilecode(formData);
      if(cc.data.data === "Token Generated"){
        const ccs = await checkcompilestatus(cc.data.token);
        setoutputDetails(ccs.data.rsp);
        setProcessing(true);
      }else{
        console.log("Something Went Wrong!!");
      }
    };
  
    return (
      <div style={{ minHeight:"100vh", backgroundColor:"#080808" }} className="flex flex-col">
        <div className="bg-white">
          <Navbar user={user} />
        </div>
        <div className="flex h-full m-0" style={{ backgroundColor:"#080808" }}>
          <div className="md:w-1/2 h-full">
            <div className="flex justify-between my-4">
              <div className="text-white">
                Select Language
                <select onChange={modifyLanguage} className="bg-gray-900 text-white mx-2">
                  {languageOptions.map((data,key)=>{
                    return(<>
                    {key===0?
                      <option value={key} selected>{data.name}</option>:
                      <option value={key}>{data.name}</option>
                    }
                  </>);
                  })
                  }
                </select>
              </div>
              <div>
                <button className="bg-green-500 rounded-xl text-white font-bold px-4 py-2" onClick={handleCompile}>Compile</button>
              </div>
            </div>
            <Editor
              className="rounded-2xl"
              height="50vh"
              width={`100%`}
              language={language || "javascript"}
              value={value}
              theme="vs-dark"
              defaultValue="//Write your code here..."
              onChange={handleEditorChange}
            />
            <div className="bg-gray-900 text-white p-4 rounded-2xl text-md my-4">
              {outputDetails ? <>{getOutput()}</> : <pre className="px-2 py-1 font-normal text-xs text-white">
                {processing?<>Processing</>:<>Code Output Appears Here</>}...
              </pre>}
            </div>
          </div>
          <div className="md:w-1/2 h-full">
            <div className="w-full p-4">
              <div className="bg-gray-900 text-white p-4 rounded-2xl text-md">
                Interview Coding Question Appears Here...
              </div>
            </div>
            <div className="flex pb-4">
              <div className="md:w-1/2 px-4 pt-4">
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