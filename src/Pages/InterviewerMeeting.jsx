import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer, DyteChat, DyteMeetingTitle, DyteMicToggle, DyteCameraToggle, DyteGrid, DyteParticipantsAudio } from "@dytesdk/react-ui-kit";
import Navbar from "../Components/XIDashboard/Navbar.jsx";
import { useState } from "react";
import { useEffect } from "react";
import {
  getUserFromId,
  getUserIdFromToken,
  getProfileImage,
} from "../service/api";
import Editor from "@monaco-editor/react";

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

    const leaveCall = ()=>{
      meeting.leaveRoom();
    }

    useEffect(()=>{
      meeting.joinRoom();
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
    },[]);
  
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
              <div className="md:w-1/2">
                <DyteGrid meeting={meeting} />
                <DyteParticipantsAudio meeting={meeting} />
              </div>
            </div>
          </div>
        </div>
        <div>
          <button onClick={leaveCall}>Leave Room</button>
        </div>
      </div>
    );
}