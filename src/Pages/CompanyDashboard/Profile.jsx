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
const CompanyProfile = () => {
  let navigate = useNavigate();

  // Access Token And User State
  const [user, setUser] = React.useState();
  const [profileImg, setProfileImg] = React.useState(null);
  const [profile, setProfile] = React.useState(true);
  const [contact, setContact] = React.useState(false);
  const [image, setImage] = React.useState(false);
  const [about, setAbout] = React.useState(false);
  const [social, setSocial] = React.useState(false);
  const [progress, setProgress] = React.useState(0)
  // Sets User and AccessToken from SessionStorage
  const [bar, setBar] = React.useState(0)

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 3000, min: 2000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 2000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };


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


      if (user.firstName && user.profileImg && user.about && user.linkedInId) {
        setProfile(false);
      }

      await setUser(user);
    };
    func();
  }, []);

  React.useEffect(() => {

    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      console.log(user)
      setProgress(0);

      if (user) {
        if (user.contact) {
          setProgress(progress + 1);
          setContact(true);
        }
        if (user.profileImg) {
          setProgress(progress + 1);
          setImage(true);
        }
        if (user.about) {
          setProgress(progress + 1);
          setAbout(true);
        }
        if (user.linkedInId) {
          setProgress(progress + 1);
          setSocial(true);
        }

      }

      var bar = (progress / 4) * 100;
      console.log(bar)
      setBar(bar);


      console.log(progress)
    }
    func();
  }, [])

  return (
    <div className="p-5">
      <p className="text-2xl font-bold" style={{ color: "#3B82F6" }}>Company Details</p>
      {profile && <div className="w-3/4 text-center mx-auto shadow-md rounded-md" >
        <p className="text-3xl py-4">Complete Your Profile!</p>
        <Carousel responsive={responsive} className="w-3/4 mx-auto">
          <Card name={"Contact"} check={contact}></Card>
          <Card name={"About"} check={about}></Card>
          <Card name={"Profile Image"} check={image}></Card>
          <Card name={"Linked In"} check={social}></Card>

        </Carousel>


        {/* <div className="w-3/4 mx-auto my-2">
          {progress &&
            <ProgressBar bgColor={"#3B82F6"} completed={bar} />}
        </div> */}

      </div>}
      {user !== null && user !== undefined && (


        <div className="flex flex-column-reverse m-4">




          <div className="my-3 mx-5 shadow-md rounded-md w-full p-6 md:pt-6 pt-3 w-3/4">
            {/* <p className="my-3  font-bold text-lg">Company Details</p> */}
            <Formik
              initialValues={{
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastname,
                email: user.email ? user.email : " ",
                contact: user.contact ? user.contact : " ",
                about: user.about ? user.about : ""
              }}
            >
              {({ values, isSubmitting }) => (
                <Form>

                  <div className="flex flex-wrap w-full gap-y-5">
                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Contact Information</label>
                    <hr />
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Username</label>
                      <Field
                        type="text"
                        name="username"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Company Name</label>
                      <Field
                        type="text"
                        name="firstName"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />
                    </div>

                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">About</label>
                    <hr />
                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">About</label>
                      <Field
                        as="textarea"
                        className="block  py-1 md:w-1/2 w-3/4 h-20"
                        name="about"
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Website</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Industry</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>

                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Company Size</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>
                    <div className="md:w-1/2 w-full space-y-1">

                      <label className="font-semibold">Location</label>
                      <Field
                        as="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        name=""
                        disabled
                        style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                      />

                    </div>
                    <label style={{ color: "#3B82F6" }} className="py-3 text-xl font-semibold">Social Media</label>


                    <div className="md:w-1/2 w-full ml-3 space-y-1 flex">

                      {(user.linkedInId) && (<img
                        src={Linkedin}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}
                      {(user.googleId) && (<img
                        src={Google}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}
                      {(user.microsoftId) && (<img
                        src={Microsoft}
                        alt="linkedin-login"
                        className="cursor-pointer h-7"
                      />


                      )}

                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="my-3 mx-5 shadow-md rounded-md w-1/4 p-3 flex-column text-center" style={{ height: '300px' }}>
            <div className="text-center w-1/2 mx-auto">
              <img
                src={user && user.profileImg && profileImg ? Avatar : Avatar}
                className="h-16 w-16 rounded-md mx-6"
                alt="userAvatar"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold mt-3">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-700 text-sm"></p>
            </div>
            <div className="mx-auto w-1/2  text-center">
              <button
                className="bg-blue-600 p-3 text-white rounded-lg mx-auto block mt-4 hover:bg-blue-600 text-center cursor-pointer"
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
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
