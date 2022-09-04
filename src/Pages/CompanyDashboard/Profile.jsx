import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Card from "../../Components/CompanyDashboard/Card";
import ProgressBar from "@ramonak/react-progress-bar";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Tabs from "../../Components/CompanyDashboard/Tabs";
const CompanyProfile = () => {
  let navigate = useNavigate();

  // Access Token And User State
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
 
  // Sets User and AccessToken from SessionStorage



  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let access_token = localStorage.getItem("access_token");
      if (user && user.profileImg) {
        const img = user.profileImg;
        const imgBase64 = img.toString("base64");
        console.log(imgBase64);
        setProfileImg(img);
        setProfileImg(imgBase64);
      }
      if (access_token === null) window.location.href = "/login";


   

      await setUser(user);
    };
    func();
  }, []);


  return (
    <div className="p-5 bg-slate-100">
      {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
    
      {user !== null && user !== undefined && (


        <div className="m-5">
 <div className="h-48 w-full relative" style={{ background: "#99DEFF" }}>

</div>
<div className="relative mx-5 rounded-md w-full p-3 flex items-center ">
            <div className="absolute -top-20 left-20">
              <img
                // src={
                //   user && user.profileImg && profileImg ? profileImg : Avatar
                // }
                src={Avatar}
                className="h-40 w-40 rounded-full mx-6"
                alt="userAvatar"
              />
            </div>
            <div className="ml-72">
            <p className="font-semibold text-3xl">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className="ml-auto mr-6 ">
              <button
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  let url = window.location.href;
                  let type = url.split("/")[3];
                  window.location.href = "/" + type + "/editProfile";
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
       


          <div className="my-3 mx-5  rounded-lg w-full  pt-3 w-3/4">
         
            <div className="App ">
      <Tabs/>
      </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default CompanyProfile;
