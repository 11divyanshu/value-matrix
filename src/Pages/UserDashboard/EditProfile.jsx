import React from "react";
import { ReactSession } from "react-client-session";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import ReactCrop from "react-image-crop";

// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
} from "../../service/api";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";

const EditProfile = () => {
  // Sets OTPs to NULL
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);

  // States for the Page
  const [user, setUser] = React.useState(null);
  const [access_token, setToken] = React.useState(null);

  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);

  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);
  // const [image, setImage] =React.useState(undefined);

  const ModalBtnRef = React.useRef(null);
  const imagePreviewCanvasRef = React.useRef(null);
  // const [crop, setCrop] = React.useState({
  //   unit: "%",
  //   x: 25,
  //   y: 25,
  //   width: 50,
  //   height: 50,
  // });

  const setImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      const myFileItemReader = new FileReader();
      myFileItemReader.readAsDataURL(e.target.files[0]);
      myFileItemReader.onloadend = async() => {
        await setProfilePic(myFileItemReader.result);
        console.log("F");
        console.log(ProfilePic);
      };
      ModalBtnRef.current.click();
    }
  };

  // const imageLoaded = (image) => {
  //   setImage(image);
  // };
  // function imageCrop(crop) {
  //   setCrop(crop);
  // }
  // function imageCropComplete(crop) {
  //   userCrop(crop);
  // }
  // async function userCrop(crop) {
  //   if (image && crop.width && crop.height) {
  //     await getCroppedImage(image, crop, "newFile.jpeg");
  //   }
  // }

  // function getCroppedImage(image, crop, fileName) {
  //   const imageCanvas = document.createElement("canvas");
  //   const scaleX = image.naturalWidth / image.width;
  //   const scaleY = image.naturalHeight / image.height;
  //   imageCanvas.width = crop.width;
  //   imageCanvas.height = crop.height;
  //   const imgCx = imageCanvas.getContext("2d");
  //   imgCx.drawImage(
  //     image,
  //     crop.x * scaleX,
  //     crop.y * scaleY,
  //     crop.width * scaleX,
  //     crop.height * scaleY,
  //     0,
  //     0,
  //     crop.width,
  //     crop.height
  //   );
  //   return new Promise((reject, resolve) => {
  //     imageCanvas.toBlob((blob) => {
  //       if (!blob) {
  //         reject(new Error("the image canvas is empty"));
  //         return;
  //       }
  //       blob.name = fileName;
  //       let imageURL;
  //       window.URL.revokeObjectURL(imageURL);
  //       imageURL = window.URL.createObjectURL(blob);
  //       resolve(imageURL);
  //       // setImageUrl(blob);
  //     }, "image1/jpeg");
  //   });
  // }


  // Form Edit Submission
  const submit = (values) => {
    let wait = 0;
    if (EmailOTP === null && ContactOTP === null)
      wait = SendOTPFunction(values);
    if (wait) return;
    if (EmailOTP && ContactOTP) {
      if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Email OTP and Contact OTP");
        return;
      }
    }
    if (EmailOTP && values.emailOTP !== EmailOTP) {
      setError("Invalid Email OTP");
      return;
    }
    if (ContactOTP && values.contactOTP !== ContactOTP) {
      setError("Invalid Contact OTP");
      return;
    }
    update(values);
  };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      console.log("d");
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    return wait;
  };

  const update = async (values) => {
    let data = {
      firstName: values.firstName,
      lastname: values.lastName,
    };
    if (EmailOTP) {
      data.email = values.email;
    }
    if (ContactOTP) {
      data.contact = values.contact;
    }
    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );
    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      window.location.href = "/profile";
    } else {
      console.log("Error");
    }
  };

  // Sets User And Access_token
  React.useEffect(() => {
    let access_token1 = ReactSession.get("access_token");
    let user = ReactSession.get("user");
    setUser(user);
    setToken(access_token1);
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Edit Profile</p>
      {user !== null && (
        <div>
          <div className="my-3 shadow-md rounded-md w-full p-3 flex items-center">
            <div>
              <img
                src={(user && user.ProfilePic )? user.ProfilePic : Avatar}
                className="h-16 w-16 rounded-md mx-6"
                alt="userAvatar"
                ref={imagePreviewCanvasRef}
              />
            </div>
            <div>
              <p className="font-semibold">
                {user.firstName} {user.lastname}
              </p>
              <p className="text-gray-700 text-sm">User</p>
            </div>
            <div class="ml-auto mr-5">
              <label>
                <p class="bg-blue-500 rounded-sm text-white px-2 py-1 cursor-pointer">
                  Upload Image
                </p>
                <input
                  type="file"
                  accept="image"
                  class="hidden"
                  onChange={(e) => setImageChange(e)}
                />
              </label>
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
                emailOTP: "",
                contactOTP: "",
              }}
              validate={(values) => {
                const errors = {};
                if (!values.firstName) {
                  errors.firstName = "Required";
                }
                if (!values.lastName) {
                  errors.lastName = "Required";
                }
                if (!values.email) {
                  errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid Email Address";
                }
                if (!values.contact) {
                  errors.contact = "Required";
                } else if (
                  !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                    values.contact
                  )
                ) {
                  errors.contact = "Invalid Contact Number";
                }
                return errors;
              }}
              onSubmit={(values) => submit(values)}
            >
              {({ values }) => (
                <Form>
                  {Error && <p className="text-sm text-red-500">{Error}</p>}
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
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Last Name</label>
                      <Field
                        name="lastName"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Email</label>
                      <Field
                        name="email"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    <div className="md:w-1/2 w-full space-y-1">
                      <label className="font-semibold">Contact</label>
                      <Field
                        name="contact"
                        type="text"
                        className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        disabled={EmailOTP !== null || ContactOTP !== null}
                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                    {EmailOTP && (
                      <div className="md:w-1/2 w-full space-y-1">
                        <label className="font-semibold">Email OTP</label>
                        <Field
                          name="emailOTP"
                          type="text"
                          className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        />
                      </div>
                    )}
                    {ContactOTP && (
                      <div className="md:w-1/2 w-full space-y-1">
                        <label className="font-semibold">Contact OTP</label>
                        <Field
                          name="contactOTP"
                          type="text"
                          className="block border-gray-400 py-1 md:w-1/2 w-3/4"
                        />
                      </div>
                    )}
                  </div>
                  <div className="w-full">
                    <button
                      type="submit"
                      className="bg-blue-500 px-2 py-1 text-white rounded-sm my-5"
                      style={{ backgroundColor: " rgb(59 130 246)" }}
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Modal For Cropping Image */}
      <button
        type="button"
        class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out hidden"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        ref={ModalBtnRef}
      >
        Launch static backdrop modal
      </button>
      <div
        class="modal fade fixed ml-[25vw] top-0  hidden h-full outline-none overflow-x-hidden overflow-y-auto"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog relative w-[40vw] pointer-events-none my-5">
          <div class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5
                class="text-xl font-medium leading-normal text-gray-800"
                id="exampleModalLabel"
              >
                Crop Image
              </h5>
            </div>
            <div class="modal-body relative p-4">
              {/* <ReactCrop crop={crop} onImageLoaded={imageLoaded}
        onChange={imageCrop}
        onComplete={imageCropComplete}>
          <img  src={ProfilePic} alt="profileImg"/>
        </ReactCrop> */}
            </div>
            <div class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
              <button
                type="button"
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-purple-700 hover:shadow-lg focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-purple-800 active:shadow-lg transition duration-150 ease-in-out"
                data-bs-dismiss="modal"
                onClick={() => {
                }}
                style={{ backgroundColor: "rgb(37 99 235)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal For Cropping Image */}
    </div>
  );
};

export default EditProfile;
