import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field } from "formik";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";

const UserProfile = () => {

  // Access Token And User State
  const [access_token, setAccesToken] = React.useState(null);
  const [user, setUser] = React.useState(null);

  // Sets User and AccessToken from SessionStorage
  React.useEffect(() => {
    let user = ReactSession.get("user");
    let access_token = ReactSession.get("access_token");
    setUser(user);
    setAccesToken(access_token);
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Profile</p>
      {user !== null && (
        <div>
          <div className="my-3 shadow-md rounded-md w-full p-3 flex items-center">
            <div>
              <img
                src={user.ProfileImg ? user.ProfileImg : Avatar}
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
            <div className="ml-auto mr-6">
              <button
                className="border-[0.5px] border-gray-600 text-gray-600 px-2 py-1 rounded-sm"
                onClick={() => (window.location.href = "/editProfile")}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <div className="my-3 shadow-md rounded-md w-full p-6">
            <p className="my-3  font-bold text-lg">User Details</p>
            <Formik
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastname,
                email: user.email ? user.email : " ",
                contact: user.contact ? user.contact : " ",
              }}
            >
              {({ values, isSubmitting }) => (
                <Form>
                  <p className="my-3">
                    <span className="font-semibold">Username :</span>{" "}
                    {user.username}{" "}
                  </p>
                  <div className="flex flex-wrap w-full gap-y-5">
                    <div className="w-1/2 space-y-1">
                      <label className="font-semibold">First Name</label>
                      <Field
                        type="text"
                        name="firstName"
                        disabled
                        className="block border-gray-400 py-1 w-1/2"
                      />
                    </div>
                    <div className="w-1/2 space-y-1">
                      <label className="font-semibold">Last Name</label>
                      <Field
                        name="lastName"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 w-1/2"
                      />
                    </div>
                    <div className="w-1/2 space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 w-1/2"
                      />
                    </div>
                    <div className="w-1/2 space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        disabled
                        className="block border-gray-400 py-1 w-1/2"
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
