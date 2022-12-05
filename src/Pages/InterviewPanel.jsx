import { useDyteClient, DyteProvider } from "@dytesdk/react-web-core";
import MyMeeting from "./MyMeeting.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { apikey, orgid } from "./DyteCredentials.jsx";
import { useParams } from "react-router-dom";
import logo from "../assets/images/logo.png";
import Webcam from "react-webcam";

import { getinterviewdetails, checkinterviewdetails, processFlask, updateinterviewcheck, updatelivestatus, fetchinterviewdetails, processFlasklive, getlivestatus, startproctoring, stopproctoring, getproctoring, startlivemeet } from "../service/api.js";
import { IoEar } from "react-icons/io5";

import html2canvas from 'html2canvas';

export default function App() {
    const [meeting, initMeeting] = useDyteClient();
    const [screenDisplay, setScreenDisplay] = useState(0);
    const [currentbtn, setcurrentbtn] = useState(0);
    const [counter, setcounter] = useState(0);
    const [overlapImage, setOverlapImage] = useState("");
    const [overlapText, setOverlapText] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [interviewStatus, setInterviewStatus] = useState(null);
    const [leftearpiece, setleftearpiece] = useState(0);
    const [rightearpiece, setrightearpiece] = useState(0);
    const [flaskurl, setFlaskUrl] = useState("http://localhost:5000");
    const {id} = useParams();

    let pfl = null;
    let ufl = null;
    let getstats = null;
  
    useEffect(() => {
      const initial = async ()=>{
        let user = JSON.parse(localStorage.getItem("user"));
        if(user === null){
          window.location.href="/login";
        }else{
          setCurrentUser(user);

          let interviewStatus = await checkinterviewdetails(id, user);
          console.log(interviewStatus);
          setInterviewStatus(interviewStatus);

          initDyte(interviewStatus.data);
          
          // setScreenDisplay(5);
          // setcurrentbtn(1);

          if(interviewStatus.data.data === "Data Retrieved"){
            if(interviewStatus.data.faceTest === false && interviewStatus.data.gazeTest === false && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false){
              setScreenDisplay(1);
              setTimeout(()=>{
                document.getElementById("getUserPhoto").click();
              },2000);
            }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === false && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false){
              setScreenDisplay(2);
            }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false){
              setScreenDisplay(3);
            }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === true && interviewStatus.data.earTest === false){
              setScreenDisplay(4);
            }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === true && interviewStatus.data.earTest === true){
              setcurrentbtn(1);
              if(interviewStatus.data.interviewStatus === false){
                setScreenDisplay(5);
              }else{
                initDyte(interviewStatus.data);
                setScreenDisplay(6);
              }
            }
          }


        }
      }
      initial();
    }, []);

    const initDyte = (interviewStatus) =>{
      initMeeting({
        roomName: interviewStatus.meetingRoom,
        authToken: interviewStatus.authToken,
        defaults: {
          audio: true,
          video: true
        },
      });
      // console.log(meeting);
    }

    const nextFrame = async ()=>{
      setcurrentbtn(0);
      setScreenDisplay(screenDisplay+1);
      setOverlapImage(null);
      if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === true && interviewStatus.data.earTest === true){
        setScreenDisplay(5);
        if(interviewStatus.data.interviewStatus){
          setcurrentbtn(1);
        }else{
          setcurrentbtn(0);
          let runloop = 1;
          do{
            getstats = await getlivestatus(id);
            if(getstats.data.stats.interviewStatus === true){
              runloop = 0;
              setcurrentbtn(1);
            }
          }while(runloop === 1);
        }
      }else{
        setTimeout(()=>{
          document.getElementById("getUserPhoto").click();
        },1000);
      }
    }

    const capturescreenshot = ()=>{
      html2canvas(document.body).then(function(canvas) {
        let capturedimage = canvas.toDataURL();
      });
    }

    const joinMeeting = async ()=>{

      await axios.post("https://api.cluster.dyte.in/v2/meetings/"+interviewStatus.data.meetingID+"/livestreams",{
        name: interviewStatus.data.meetingRoom
      },{
        headers:{
          Authorization: 'Basic YzJjM2RkZTgtMGUzNy00NWVkLTlkNGEtZTMyNGE1ZjNmZGNlOmE5Nzc2NjM0YmMwNGUxNTczZDI2',
        }
      }).then(async (data)=>{
        console.log(data);
        let startproct = await startproctoring(id, data.data.data.playback_url);
        console.log(startproct.data);
      }).catch( async (err)=>{
        let respp = await axios.get("https://api.cluster.dyte.in/v2/meetings/"+interviewStatus.data.meetingID+"/active-livestream", {
          headers:{
            Authorization: 'Basic YzJjM2RkZTgtMGUzNy00NWVkLTlkNGEtZTMyNGE1ZjNmZGNlOmE5Nzc2NjM0YmMwNGUxNTczZDI2'
          }
        });
        if(respp){
          let startproct = await startproctoring(id, respp.data.data.playback_url);
          console.log(startproct.data);
        }
      });

      let orgid = "c2c3dde8-0e37-45ed-9d4a-e324a5f3fdce";

      await axios.post("https://api.cluster.dyte.in/v1/organizations/"+orgid+"/meetings/"+interviewStatus.data.meetingID+"/recording",{
        headers:{
          Authorization: 'Basic a9776634bc04e1573d26',
        }
      }).then(async (data)=>{
        console.log(data);
      }).catch( async (err)=>{
        console.log(err);
      });


      setScreenDisplay(6);

      document.getElementById("intvpanel").requestFullscreen();
      
      setTimeout(()=>{
        document.getElementById("getUserPhotoLive").click();
      },2000);

    }

    const processLive = async (image)=>{
      if(image != null){
        pfl = await processFlasklive(currentUser, image, id);
        ufl = await updatelivestatus(pfl.data.data, id);
        document.getElementById("getUserPhotoLive").click();
      }else{
        document.getElementById("getUserPhotoLive").click();
      }
    }

    const processFrame = async (imageSrc)=>{
      setcounter(counter+1);
      if(imageSrc === null){
        document.getElementById("getUserPhoto").click();
      }else{
        let response = null;
        let updatedinterview = null;
        if(interviewStatus.data.faceTest === false && interviewStatus.data.gazeTest === false && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false && screenDisplay === 1){
          response =  await processFlask(currentUser, imageSrc, "face", id);
          // console.log(response);
          if(response.data.data.FaceDetected === true){
            updatedinterview = await updateinterviewcheck("face", "data:image/jpeg;base64,"+response.data.img, id);
            // console.log(updatedinterview);
            if(updatedinterview.data.data === "Updated Test"){
              if(updatedinterview.data.updatedinterview.faceTest === true){
                let newinterview = await getinterviewdetails(id);
                setInterviewStatus(newinterview);
                setcurrentbtn(1);
                setOverlapImage("data:image/jpeg;base64,"+response.data.img);
              }else{
                // console.log("Something Went Wrong");
              }
            }else{
              // console.log("Something Went Wrong");
            }
          }else{
            document.getElementById("getUserPhoto").click();
          }
        }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === false && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false && screenDisplay === 2){
          response =  await processFlask(currentUser, imageSrc, "gaze", id);
          // console.log(response);
          if(response.data.data.Eyes_Detected === true){
            if(response.data.data.message === ""){
              updatedinterview = await updateinterviewcheck("gaze", "data:image/jpeg;base64,"+response.data.img, id);
              console.log(updatedinterview);
              if(updatedinterview.data.data === "Updated Test"){
                if(updatedinterview.data.updatedinterview.gazeTest === true){
                  let newinterview = await getinterviewdetails(id);
                  setOverlapText("");
                  setInterviewStatus(newinterview);
                  setcurrentbtn(1);
                  setOverlapImage("data:image/jpeg;base64,"+response.data.img);
                }else{
                  // console.log("Something Went Wrong");
                }
              }else{
                // console.log("Something Went Wrong");
              }
            }else{
              setOverlapText("response.data.data.message");
            }
          }else{
            setOverlapText(response.data.data.message);
            document.getElementById("getUserPhoto").click();
          }
        }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === false && interviewStatus.data.earTest === false && screenDisplay === 3){
          response =  await processFlask(currentUser, imageSrc, "person", id);
          console.log(response);
          if(response.data.data.NumberOfFaces < 1){
            setOverlapText("No Person Detected");
            document.getElementById("getUserPhoto").click();
          }else if(response.data.data.NumberOfFaces > 1){
            setOverlapText("More Than One Person Detected");
            document.getElementById("getUserPhoto").click();
          }else if(response.data.data.NumberOfFaces === 1){
            updatedinterview = await updateinterviewcheck("person", "data:image/jpeg;base64,"+response.data.img, id);
            console.log(updatedinterview);
            if(updatedinterview.data.data === "Updated Test"){
              if(updatedinterview.data.updatedinterview.personTest === true){
                let newinterview = await getinterviewdetails(id);
                setInterviewStatus(newinterview);
                setOverlapText("");
                setcurrentbtn(1);
                setOverlapImage("data:image/jpeg;base64,"+response.data.img);
              }else{
                console.log("Something Went Wrong");
              }
            }else{
              console.log("Something Went Wrong");
            }
          }else{
            document.getElementById("getUserPhoto").click();
          }
        }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === true && interviewStatus.data.earTest === false && screenDisplay === 4){
          response =  await processFlask(currentUser, imageSrc, "ear", id);
          console.log(response);
          if(response.data.data.State === "NoEarpiece"){
            if(leftearpiece === 2 && rightearpiece === 2){
              updatedinterview = await updateinterviewcheck("ear", "data:image/jpeg;base64,"+response.data.img, id);
              if(updatedinterview.data.data === "Updated Test"){
                if(updatedinterview.data.updatedinterview.earTest === true){
                  let newinterview = await getinterviewdetails(id);
                  setInterviewStatus(newinterview);
                  setOverlapText("");
                  setcurrentbtn(1);
                }else{
                  console.log("Something Went Wrong");
                }
              }else{
                console.log("Something Went Wrong");
              }
            }
            if(response.data.data.Side === "Right"){
              setrightearpiece(2);
              document.getElementById("getUserPhoto").click();
            }else if(response.data.data.Side === "Left"){
              setleftearpiece(2);
              document.getElementById("getUserPhoto").click();
            }else{
              document.getElementById("getUserPhoto").click();
            }
          }else if(response.data.data.State === "Earpiece"){
            if(response.data.data.Side === "Right"){
              setrightearpiece(1);
              document.getElementById("getUserPhoto").click();
            }else if(response.data.data.Side === "Left"){
              setleftearpiece(1);
              document.getElementById("getUserPhoto").click();
            }else{
              document.getElementById("getUserPhoto").click();
            }
          }else{
            document.getElementById("getUserPhoto").click();
            setOverlapText("Kindly Remove Your Earpiece !!");
          }
        }else if(interviewStatus.data.faceTest === true && interviewStatus.data.gazeTest === true && interviewStatus.data.personTest === true && interviewStatus.data.earTest === true && screenDisplay === 5){
        }
      }
    }
  
    return (
      <>
      {screenDisplay===0?
        <div className="flex justify-center items-center h-screen" style={{ backgroundColor:"#f1f1f1" }}>
          <div>
            <img src={logo} alt="Value Matrix" width="200px"/>
            <div className="flex justify-center items-center mt-4 mb-2">
              <div role="status">
                <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
            <h3 className="text-center">Loading Interview...</h3>
          </div>
        </div>
      :null}
      {screenDisplay>=1 && screenDisplay<=5?
        <div className="flex min-h-screen justify-center items-center" style={{ flexDirection:"row-reverse", flexWrap:"wrap", backgroundColor:"#f1f1f1" }}>
          <div className="w-full">
            <div className="md:flex px-8">
              <div className="md:w-fit flex justify-center">
                <img src={logo} alt="Value Matrix" className="w-28 mb-8 md:w-60 md:mb-0"/>
              </div>
              <div className="w-full flex justify-center items-center">
                <div className="w-2/12">
                  <div className="flex justify-center items-center">
                    {screenDisplay>1?
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    :
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    }
                  </div>
                  <h4 className="font-bold text-center mt-2 hidden md:block">Face Capture</h4>
                </div>
                <div className="w-2/12">
                  <div className="flex justify-center items-center">
                    {screenDisplay>2?
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    :
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    }
                  </div>
                  <h4 className="font-bold text-center mt-2 hidden md:block">Gaze Tracking</h4>
                </div>
                <div className="w-2/12">
                  <div className="flex justify-center items-center">
                    {screenDisplay>3?
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    :
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    }
                  </div>
                  <h4 className="font-bold text-center mt-2 hidden md:block">Person Detection</h4>
                </div>
                <div className="w-2/12">
                  <div className="flex justify-center items-center">
                    {screenDisplay>4?
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    :
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    }
                  </div>
                  <h4 className="font-bold text-center mt-2 hidden md:block">Earpiece Detection</h4>
                </div>
                <div className="w-2/12">
                  <div className="flex justify-center items-center">
                    {screenDisplay>5?
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                    :
                    <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                    }
                  </div>
                  <h4 className="font-bold text-center mt-2 hidden md:block">Ready to Join !!</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="flex justify-center items-center w-full" style={{ position:"relative" }}>
            <Webcam
              audio={false}
              height={1080}
              width={1920}
              videoConstraints={{
                width: 1920,
                height: 1080,
                facingMode: "user"
              }}
              screenshotFormat="image/jpeg"
            >
              {({ getScreenshot }) => (
                <button id="getUserPhoto"
                  onClick={() => {
                    const imageSrc = getScreenshot()
                    processFrame(imageSrc);
                  }}
                >
                </button>
              )}
            </Webcam>
            <img style={{
              height:"100%",
              position:"absolute",
              top:0,
              left:0
            }} src={overlapImage}/>
            {overlapText!=""?<div style={{ color:"#0f0", textAlign:"center", position:"absolute", top:20, left:0, width:"100%", textShadow:"2px 7px 5px rgba(255,255,255,0.3)" }}>{overlapText}</div>:null}
            </div>
          </div>
          <div className="md:w-1/3 h-full p-8">
            <div className="p-8 shadow-lg w-full rounded-lg" style={{ backgroundColor:"#F6F0F0" }}>
              <h2 className="text-xl font-bold mb-4">Hi { currentUser.firstName },</h2>
              {screenDisplay===1?
                <>
                  <h2 className="text-3xl"><strong>Face Capture</strong></h2>
                  <p className="mt-4">
                    <h4 className="text-xl">Instructions:</h4>
                    <ol className="list-decimal mt-2 pl-4">
                      <li>Face towards your webcam.</li>
                      <li>Make sure you’re sitting under proper lighting.</li>
                      <li>Remove any accessories on your face if present.</li>
                    </ol>
                  </p>
                </>
              :null}
              {screenDisplay===2?
                <>
                  <h2 className="text-3xl"><strong>Gaze Tracking</strong></h2>
                  <p className="mt-4">
                    <h4 className="text-xl">Instructions:</h4>
                    <ol className="list-decimal mt-2 pl-4">
                      <li>A ball will appear on the screen.</li>
                      <li>Focus on the ball and it's movement .</li>
                    </ol>
                  </p>
                </>
              :null}
              {screenDisplay===3?
                <>
                  <h2 className="text-3xl"><strong>Person Detection</strong></h2>
                  <p className="mt-4">
                    <h4 className="text-xl">Instructions:</h4>
                    <ol className="list-decimal mt-2 pl-4">
                      <li>Sit steady in fron of the camera.</li>
                      <li>Make sure there is no other person present in your room.</li>
                    </ol>
                  </p>
                </>
              :null}
              {screenDisplay===4?
                <>
                  <h2 className="text-3xl"><strong>Earpiece Detection</strong></h2>
                  <p className="mt-4">
                    <h4 className="text-xl">Instructions:</h4>
                    <ol className="list-decimal mt-2 pl-4">
                      <li>Make sure you are not wearing any earpiece.</li>
                    </ol>
                  </p>
                </>
              :null}
              {screenDisplay===5?
                <>
                  <h2 className="text-3xl"><strong>Ready to join</strong></h2>
                  <p className="mt-4">
                    <h4 className="text-xl">Congratulations!! You have passed all the tests.</h4>
                    <h4>The interviewer will soon let you in the meeting room.</h4>
                  </p>
                </>
              :null}
              <div className="flex mt-2">
              {screenDisplay===4 && leftearpiece===0?
                <div className="text-center">
                  <button className="rounded-full bg-gray-400 text-white p-2 mx-1" style={{ transform:"scaleX(-1)" }}><IoEar className="text-2xl" /></button><br/>
                  Left
                </div>
              :null}
              {screenDisplay===4 && leftearpiece===1?
                <div className="text-center">
                  <button className="rounded-full bg-red-500 text-white p-2 mx-1" style={{ transform:"scaleX(-1)" }}><IoEar className="text-2xl" /></button><br/>
                  Left
                </div>
              :null}
              {screenDisplay===4 && leftearpiece===2?
                <div className="text-center">
                  <button className="rounded-full bg-green-500 text-white p-2 mx-1" style={{ transform:"scaleX(-1)" }}><IoEar className="text-2xl" /></button><br/>
                  Left
                </div>
              :null}
              {screenDisplay===4 && rightearpiece===0?
                <div className="text-center">
                  <button className="rounded-full bg-gray-400 text-white p-2 mx-1"><IoEar className="text-2xl" /></button><br/>
                  Right
                </div>
              :null}
              {screenDisplay===4 && rightearpiece===1?
                <div className="text-center">
                  <button className="rounded-full bg-red-500 text-white p-2 mx-1"><IoEar className="text-2xl" /></button><br/>
                  Right
                </div>
              :null}
              {screenDisplay===4 && rightearpiece===2?
                <div className="text-center">
                  <button className="rounded-full bg-green-500 text-white p-2 mx-1"><IoEar className="text-2xl" /></button><br/>
                  Right
                </div>
              :null}
              </div>
              {screenDisplay<5 && currentbtn===1?
              <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={nextFrame}>Next</button>
              :
              null
              }
              {screenDisplay<5 && currentbtn===0?
              <button className="mt-4 bg-gray-400 text-white font-bold py-2 px-4 rounded">Next</button>
              :
              null
              }
              {screenDisplay===5 && currentbtn===1?
              <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={joinMeeting}>Join !!</button>
              :
              null
              }
              {screenDisplay===5 && currentbtn===0?
              <button className="mt-4 bg-gray-400 text-white font-bold py-2 px-4 rounded">Waiting!!</button>
              :
              null
              }
            </div>
          </div>
        </div>
      :null}
      <div style={{ zIndex:`${screenDisplay===6?"10000":"-10000"}`, position:"fixed", top:0, width:"100%" }} id="intvpanel">
        <DyteProvider value={meeting}>
          <MyMeeting />
        </DyteProvider>
      </div>
      </>
    );
  }