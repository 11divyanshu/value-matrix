import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import Tabs from "../../Components/Dashbaord/Tabs";
const UserProfile = () => {
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
    <div className="p-5">
      <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Your Profile</p>
    
      {user !== null && user !== undefined && (


        <div className="m-5">

<div className="my-3 shadow-md mx-5  rounded-md w-full p-3 flex items-center ">
            <div>
              <img
                // src={
                //   user && user.profileImg && profileImg ? profileImg : Avatar
                // }
                src={Avatar}
                className="h-16 w-16 rounded-md mx-6"
                alt="userAvatar"
              />
            </div>
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-700 text-sm">User</p>
            </div>
            <div className="ml-auto mr-6 ">
              <button
                className="border-[0.5px] border-gray-600 text-gray-600 px-2 py-1 rounded-sm"
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
       


          <div className="my-3 mx-5 shadow-md rounded-lg w-full  pt-3 w-3/4" style={{borderRadius:"12px"}}>
        
            <div className="App " style={{borderRadius:"12px"}}>
      <Tabs/>
      </div>
          </div>
          </div>
      )}
    </div>
  );
};

export default UserProfile;
