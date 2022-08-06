import axios from "axios";

export const url = "http://localhost:8000";
// export const url = "http://3.6.65.3:8000"

// User Method API
export const authenticateLogin = async (user) => {
  try {
    return await axios.post(`${url}/userLogin`, user);
  } catch (error) {
    console.log("error while calling login API: ", error);
  }
};

// User Signup
export const authenticateSignUp = async (user) => {
  try {
    return await axios.post(`${url}/userSignup`, user);
  } catch (error) {
    console.log("Error while calling signup API: ", error);
  }
};

// Validate Signup details
export const validateSignupDetails = async (user) => {
  try {
    return await axios.post(`${url}/validateSignup`, user);
  } catch (error) {
    console.log("Error Calling Validate Signup API : ", error);
  }
};

// Logout
export const LogoutAPI = async (user_id) => {
  try {
    return axios.post(`${url}/logout`, { user_id: user_id });
  } catch (error) {
    console.log("Error Calling Logout API : ", error);
  }
};

// Mail OTP to users
export const OTPMail = async (mail) => {
  try {
    let c = await axios.post(`${url}/OTPMail`, mail);
    return c.data.otp;
  } catch (error) {
    console.log("Error while calling OTPMail API: ", error);
  }
};

// SMS OTP to Users
export const OTPSms = async (mail) => {
  try {
    let c = await axios.post(`${url}/OTPSms`, mail);
    return c.data.otp;
  } catch (error) {
    console.log("Error while calling OTPSms API : ", error);
  }
};

// Get Users From Tokem
export const getUserIdFromToken = async (token) => {
  try {
    let c = await axios.post(`${url}/getUserIdFromToken`, token, {
      headers: { authorization: token.access_token },
    });
    return c;
  } catch (error) {
    console.log("Error while calling Getting User From Token: ", error);
  }
};

// Search User From Id
export const getUserFromId = async (data, token) => {
  try {
    let c = await axios.post(`${url}/getUserFromId`, data, {
      headers: { authorization: token.access_token },
    });
    return c;
  } catch (error) {
    console.log("Error while calling SearchUserFromId: ", error);
  }
};

// Update User Details
export const updateUserDetails = async (data, token) => {
  try {
    return await axios.post(`${url}/updateUserDetails`, data, {
      headers: { authorization: token.access_token },
    });
  } catch (error) {
    console.log("Error while calling UpdateUserDetails : ", error);
  }
};

// Admin Login
export const adminLogin = async (user) => {
  try {
    return await axios.post(`${url}/adminLogin`, user);
  } catch (error) {
    console.log("error while calling login API: ", error);
  }
};

// Update Email OTP
export const updateEmailOTP = async (mail, token) => {
  try {
    let c = await axios.post(`${url}/updateEmailOTP`, mail, {
      headers: { authorization: token.access_token },
    });
    return c.data;
  } catch (error) {
    console.log("Error while calling OTPMail API: ", error);
  }
};

// Update Contact OTP
export const updateContactOTP = async (contact, token) => {
  try {
    let c = await axios.post(`${url}/updateContactOTP`, contact, {
      headers: { authorization: token.access_token },
    });
    return c.data;
  } catch (error) {
    console.log("Error while calling OTPSms API : ", error);
  }
};

// Notification API
export const pushNotification = async (noti, token) => {
  try {
    return await axios.post(`${url}/pushNotification`, noti, {
      headers: { authorization: token.access_token },
    });
  } catch (error) {
    console.log("Error Calling Push Notification API : ", error);
  }
};

// Get User Notification
export const getUserNotification = async (user, token) => {
  try {
    return await axios.post(
      `${url}/getUserNotification`,
      { user_id: user._id, user: user},
      { headers: { authorization: token } }
    );
  } catch (error) {
    console.log("Error Calling Get User Notification API : ", error);
  }
};

// Mark Notification As Read
export const markNotiReadForUser = async (data, token) => {
  try {
    return await axios.post(
      `${url}/markNotificationRead`,
      { noti_id: data.noti_id, user_id: data.user_id },
      { headers: { authorization: token } }
    );
  } catch (error) {
    console.log("Error Calling Mark Notification Read API : ", error);
  }
};

// Send Email Notifications
export const sendEmailNotification = async (data, token) => {
  try {
    return await axios.post(`${url}/sendEmailNotification`, data, {
      headers: {
        authorization: token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// send onesignal notification
export const sendOneSignalNotification  = async(data, token) => {
  try {
    return await axios.post(`${url}/sendOneSignalNotification`, data, {
      headers: {
        authorization: token,
      }
    })
  } catch (error) {
    console.log("Error calling One Signal Notification : ", error);
  }
}