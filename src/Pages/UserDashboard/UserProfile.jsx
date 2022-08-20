import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";
import  {getUserFromId } from  "../../service/api.js";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import { Navigate, useNavigate } from "react-router-dom";

const UserProfile = () => {
  let navigate = useNavigate();

  // Access Token And User State
  const [user, setUser] = React.useState(null);
  const [profileImg, setProfileImg] = React.useState(null);

  // Sets User and AccessToken from SessionStorage
  React.useEffect(() => {
    const func = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      await setUser(user);
      let access_token = await localStorage.getItem("access_token");
      if (user && user.profileImg) {
        let image = JSON.parse(await localStorage.getItem("profileImg"));
	if(image.data){
        let base64string = btoa(
          String.fromCharCode(...new Uint8Array(image.data))
        );
        let src = `data:image/png;base64,${base64string}`;
        setProfileImg(src);}
      }
      if (access_token === null) window.location.href = "/login";
    };
    func();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Profile</p>

      {user !== null && user !== undefined && (
        <div>
          <div className="my-3 shadow-md rounded-md w-full p-3 flex items-center ">
            <div>
              <img
                src={
                  user && user.profileImg && profileImg ? profileImg : Avatar
                }
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

          <div className="my-3 shadow-md rounded-md w-full p-6 md:pt-6 pt-3">
            <p className="my-3  font-bold text-lg">User Details</p>
            <Formik
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastname,
                email: user.email ? user.email : " ",
                contact: user.contact ? user.contact : " ",
                about : user.about ? user.about : " ",
              }}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  <p className="my-3">
                    <span className="font-semibold">Username :</span>{" "}
                    {user.username}{" "}
                  </p>
                  <div className="flex flex-wrap w-full gap-y-5">
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">First Name</label>
                      <Field
                        type="text"
                        name="firstName"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",border:"none"}}
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Last Name</label>
                      <Field
                        name="lastName"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",border:"none"}}
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">About</label>
                      <Field
                        as="textarea"
                        className="block  py-1 md:w-1/2 w-3/4 h-20"
                        name="about"
                        disabled
                        style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",border:"none"}}
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",border:"none"}}
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",border:"none"}}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
