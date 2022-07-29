import axios from 'axios';
const url = 'http://localhost:8000';

// User Method API
export const authenticateLogin = async (user) => {
    try{
        return await axios.post(`${url}/userLogin`, user);
    } catch (error){
        console.log('error while calling login API: ',error);
    }
}

// User Signup
export const authenticateSignUp = async (user) =>{
    try{
        console.log(`authenticate ${user}`);
        return await axios.post(`${url}/userSignup`, user);
    }
    catch(error){
        console.log("Error while calling signup API: ", error);
    }
}

// Validate Signup details
export const validateSignupDetails = async (user) => {
    try{
        return await axios.post(`${url}/validateSignup`, user);
    }
    catch(error){
        console.log("Error Calling Validate Signup API : ",error);
    }
}

// Mail OTP to users
export const OTPMail = async(mail) =>{
    try{
        let c = await axios.post(`${url}/OTPMail`, mail);
        return c.data.otp;
    }
    catch(error){
        console.log("Error while calling OTPMail API: ", error);
    }
}

// SMS OTP to Users
export const OTPSms = async(mail) => {
    try{
        let c = await axios.post(`${url}/OTPSms`, mail);
        return c.data.otp;
    }
    catch(error){
        console.log("Error while calling OTPSms API : ", error);
    }
}