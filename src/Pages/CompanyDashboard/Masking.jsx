import React, { Fragment  , useEffect} from "react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { updateUserDetails,getUserFromId } from "../../service/api";
import swal from "sweetalert";



const Masking = () => {
    const [user, setUser] = React.useState(null);
    const [logo, setLogo] = React.useState(null);
    const [title, setTitle] = React.useState(null);
    const [email, setEmail] = React.useState(null);
    const [contact, setContact] = React.useState(null);
    const [education, setEducation] = React.useState(null);


    
    useEffect(() => {
        const initial = async () => {
          let user = JSON.parse(await localStorage.getItem("user"));
          setUser(user);
    console.log(user)
        //   let res = await getUserFromId({ id: user._id }, user.access_token);
 
        //   console.log(res);
          setLogo(user.showComLogo)
          setTitle(user.showComName)
          setEducation(user.showEducation)
          setContact(user.showContact)
          setEmail(user.showEmail)
        

        } ;
        initial();
    },[])
    return(
<div className="bg-slate-100 -mt-10 text-center align-center w-full h-[80vh]">
<div className="lg:w-3/4 mx-auto py-5 mt-10 shadow-md mr-3 bg-white">
<div className="w-full mt-9 text-left">
    <p className="font-semibold text-xl mx-4">Data Control Settings</p>
  <div className="w-full m-5  mx-7">
    <Formik
        initialValues={{
            logo: logo ? logo : false,
            title:title ? title : false,
            email:email ? email : false,
            contact:contact ? contact : false,
            education:education ? education : false
           }}
      
      validate={(values) => {
        const errors = {};
     

        return errors;
      }}
    // onSubmit={postJob}
    >
      {(values) => {
        return (
          <div>
            <Form className="w-full mt-9">
            <div className="my-4 mt-9  w-3/4">
                <label className="text-left w-3/4 font-semibold block">
                  Brand Masking
                </label>
                <label className="w-1/2 content-center px-4 flex p-1  text-md">
                  <Field type="checkbox" className="m-2" name="logo" />
                  <p className="text-md font-bold mx-3 font-gray-600">Logo</p>
                </label>
                <label className="w-1/2 content-center px-4 flex p-1  text-md">
                  <Field type="checkbox" className="m-2" name="title" />
                  <p className="text-md font-bold mx-3 font-gray-600">Title</p>
                </label>

              </div>
              <div className="my-4 space-y-3 w-3/4">
                <label className="text-left w-3/4 font-semibold block">
                  Candidate Masking
                </label>

                <div className=" items-center space-x-2">
                  <label className="w-1/2 content-center mx-2  px-4 flex p-1  text-md">
                    <Field type="checkbox" className="m-2" name="email" />
                    <p className="text-md font-bold mx-3 font-gray-600">Email</p>
                  </label>
                  <label className="w-1/2 content-center  px-4 flex p-1  text-md">
                    <Field type="checkbox" className="m-2" name="contact" />
                    <p className="text-md font-bold mx-3 font-gray-600">Contact</p>
                  </label>
                  <label className="w-1/2 content-center  px-4 flex p-1  text-md">
                    <Field type="checkbox" className="m-2" name="education" />
                    <p className="text-md font-bold mx-3 font-gray-600">Education Details</p>
                  </label>

                </div>
                </div>

                <div className="">
                  
                  <button
                  className="bg-[#034488] mx-3 px-4 py-1 rounded-sm text-white"
                  onClick={async() => {

                      console.log(values); 
                      
                let user = await JSON.parse(
                  await localStorage.getItem("user")
                );
                // if (job === null) job = {};
                // job.showComLogo = values.values.logo;
                // job.showComName = values.values.title;
                // job.showEducation = values.values.education;
                // job.showContact = values.values.contact;
                // job.showEmail = values.values.email;


                setLogo(values.values.logo);
                setTitle(values.values.title);
                setEmail(values.values.email);
                setContact(values.values.contact);
                setEmail(values.values.email);
         
                let res = await updateUserDetails({
                    email:user.email,
                    contact:user.contact,
                    username:user.username,
                    user_id : user._id,
                    updates:{
                        showComLogo: values.values.logo ? values.values.logo : false,
                        showComName:values.values.title ? values.values.title : false,
                        showEmail:values.values.email ? values.values.email : false,
                        showContact:values.values.contact ? values.values.contact : false,
                        showEducation:values.values.education ? values.values.education : false
                    }
                }, user.access_token);
                console.log(res);
             

                localStorage.setItem(
                  "user",
                  JSON.stringify(res.data.user)
                );
                // await setJob(job);

                    // setPageIndex(6);

                  }}
                >
                  Update
                </button>
                </div>
               
            </Form>
          </div>
        );
      }}
    </Formik>
  </div>
</div>
</div>

</div>)
}

export default Masking;
