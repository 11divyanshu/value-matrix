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
    <div className="p-5 bg-slate-100">
      {/* <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p> */}
      {user !== null && user !== undefined && (
        <div className="m-3">
          <div
            className="md:h-48 h-24 w-full relative"
            style={{ background: "#99DEFF" }}
          ></div>
          <div className="relative  rounded-md w-full py-3 md:flex  ">
                      <div className="absolute  sm:left-6 sm:px-2 -top-20 md:-top-28 md:left-20 ">
                        <img
                          src={
                             user && user.profileImg && profileImg ? profileImg : Avatar
                           }
                          //src={Avatar}
                          className="sm:h-20 sm:w-20 md:h-56 md:w-56 rounded-full"
                          alt="userAvatar"
                        />
                      </div>

            <div className="mt-24 md:ml-80 md:px-5 md:mt-3  sm:mx-5 md:text-left">
              <p className="font-semibold md:text-3xl text-2xl ">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-400 text-lg">{user.username}</p>
            </div>
            <div className=" mt-3 md:text-right  md:ml-auto sm:text-left ">
              <button
                class=" hover:bg-blue-700 text-white font-bold py-2 px-8 text-xs rounded"
                style={{backgroundColor:"#034488"}}
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

          <div
            className="my-7 rounded-lg pt-3 w-full"
            style={{ borderRadius: "12px" }}
          >
            <div className="App " style={{ borderRadius: "12px" }}>
              <Tabs />
            </div>
          </div>
        </div>
      )}{" "}
    </div>
  );
};

export default UserProfile;
