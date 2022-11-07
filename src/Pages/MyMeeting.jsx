import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteSetupScreen, DyteLeaveButton, DyteParticipantsAudio, DyteMeeting, DyteParticipant, DyteParticipantCount, DyteGrid, DyteSimpleGrid, DyteParticipants } from "@dytesdk/react-ui-kit";
import { useEffect, useState } from "react";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import Editor from "@monaco-editor/react";

import "../assets/stylesheet/dyte.css";

export default function MyMeeting() {
    const { meeting } = useDyteMeeting();
    const [user, setUser] = useState(null);
    const [access_token, setAccessToken] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [language, setlanguage] = useState(null);
    const [theme, settheme] = useState(null);
    const [code, setcode] = useState(null);

    const [value, setValue] = useState(code || "");

    const handleEditorChange = (value) => {
      setValue(value);
    };


    useEffect(()=>{
      meeting.joinRoom();
      var dm = document.getElementById("dytemaster");
      console.log(dm);
    },[]);

    const checkmeeting = ()=>{
      let list = Object.entries(meeting.participants.active);
      console.log(meeting.participants.active);
    }

    const leaveCall = ()=>{
      meeting.leaveRoom();
    }
  
    return (
      <div style={{ minHeight:"100vh" }}>
        <Navbar user={user} />
        <div className="flex h-full h-max" style={{ backgroundColor:"#000" }}>
          <div className="md:w-1/2">
            <DyteMeetingTitle meeting={meeting} />
            <Editor
              height="50vh"
              width={`100%`}
              language={language || "javascript"}
              value={value}
              theme="vs-dark"
              defaultValue="Write your code here..."
              onChange={handleEditorChange}
            />
          </div>
          <div className="md:w-1/2">
            <div className="w-full"></div>
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
        <div>
          <button onClick={leaveCall}>Leave Room</button>
          <button onClick={checkmeeting}>Check Room</button>
        </div>
      </div>
    );
}