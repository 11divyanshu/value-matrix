import React, { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { getCandidateEvaluation, getUser, updateEvaluation } from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar, AiOutlinePrinter } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete ,AiOutlineDown} from "react-icons/ai";
import ReactToPrint,{ useReactToPrint } from "react-to-print";
import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { IoTerminalSharp } from "react-icons/io5";
import { Button } from "@mui/material";
const UpdateInterviewApplication = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
  const [u_id, setu_id] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [concern, setConcern] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [grouped, setGrouped] = React.useState([]);
  const [rating, setRating] = React.useState(0);
  const [skillSet, setSkillSet] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);


  const [user, setUser] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);

  const componentRef = useRef();
  const openPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Evaluation Report"
  })

  const pageStyle = `
  @page {
    size: 8000mm 5000mm;
  }

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

  React.useEffect(() => {
    let initial = async () => {
      console.log(id);
      let user = await JSON.parse(localStorage.getItem("user"));
      await setUser(user);

      let candidate = await getUser({ id: id }, user.access_token);
      setCandidate(candidate.data.user);
      console.log(candidate);



      let res = await getCandidateEvaluation({ id: id }, user.access_token);
      console.log(res);
      if (res.data.data) {
        setEvaluation(res.data.data);
      }

      setLoading(false);
    };
    initial();
  }, []);

  return (
    <>
    <ReactToPrint
          trigger={() => <Button>Print this out!</Button>}
          content={() => componentRef}
        />
    <div className="bg-slate-100" ref={componentRef}>
      <div className="mx-5 mt-3 md:p-5 p-1">
        <div className="flex justify-between">
          <p className="font-bold text-2xl ">Interview Details</p>
          {loading && (
            <p className="text-center font-semibold text-lg">Loading Data...</p>
          )}

          {/* <button onClick={openPdf} >Print</button> */}
          <button
            className=" hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-6 sm:mx-0 text-xl rounded"
            style={{ backgroundColor: "#034488" }}
            onClick={openPdf}
          >
            <AiOutlinePrinter />
          </button>
          
        </div>
        {!loading && (
          <div >
            {interview && (
              <p className="my-2 text-sm">
                <span className="font-semibold">Interview Id : </span>{" "}
                {interview.application._id}
              </p>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {candidate && (
              <div className="my-5 mt-8">
                <p className="my-3 text-lg font-semibold">Candidate Details</p>
                <div className="w-full  bg-white border border-b bg-white md:px-9 px-3 mx-1 py-6 border space-y-2">
                  <p>
                    <span className="font-semibold">Name :</span>{" "}
                    {candidate.firstName}{" "}
                    {candidate.lastname}
                  </p>
                  <div className="w-1/2 flex flex-wrap justify-between">
                    {candidate.email && (
                      <p>
                        <span className="font-semibold">Email :</span>{" "}
                        {candidate.email}
                      </p>
                    )}
                    {candidate.contact && (
                      <p>
                        <span className="font-semibold">Contact :</span>{" "}
                        {candidate.contact}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* {interview && interview.job && (
              <div className="my-5">
                <div className="flex justify-between">
                  <p className="my-3 font-semibold text-lg">Job Details</p>
                  <Link
                    to={`/XI/jobDetails/${interview.job._id}`}
                    target="_blank"
                  >
                    View Job Details
                  </Link>
                </div>
                <div className="w-full  bg-white border border-b">
                  <div className="grid px-9 grid-cols-1 gap-4 lg:grid-cols-7 py-6 relative">
                    <div className="col-span-2 flex align-middle">
                      <div className="">
                        <img
                          src={Microsoft}
                          className="h-20 w-20 text-center rounded-full mx-3 bg-white border border-gray-700"
                          alt="Company_Logo"
                        />
                      </div>
                      <div className="pt-3">
                        <h5 className="text-black-900 text-lg font-bold mb-1 ">
                          {interview.job.jobTitle}
                        </h5>
                        <p className="text-sm font-bold  text-gray-400 font-semibold">
                          {interview.job.hiringOrganization}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <CgWorkAlt />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.jobType}
                        </p>
                      </div>
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <HiOutlineLocationMarker />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.location}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex py-1">
                        <div className="text-lg py-1 text-gray-400 font-semibold ">
                          <BsCashStack />
                        </div>

                        <p className="px-4 text-md text-gray-400 font-semibold">
                          {interview.job.salary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )} */}


            {evaluation ? evaluation.map((item, index) => {

              return (<> <div className="my-5 bg-white">
                <div className="my-5 mt-8 border border-b md:px-9 px-3">
                  <p className="my-5 text-lg font-semibold">Interviewers Details</p>
                  <div className="w-full  bg-white  bg-white md:px-4 py-6 space-y-2">
                    <p>
                      <span className="font-semibold">Name :</span>{" "}
                      {item.firstName}{" "}
                      {item.lastname}
                    </p>
                    <div className="w-1/2 flex flex-wrap justify-between">
                      {item.email && (
                        <p>
                          <span className="font-semibold">Email :</span>{" "}
                          {item.email}
                        </p>
                      )}
                      {item.contact && (
                        <p>
                          <span className="font-semibold">Contact :</span>{" "}
                          {item.contact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full mx-3 md:px-9 px-3 md:py-6 py-2 space-y-2 flex items-center flex-wrap">
                  <p className="font-semibold text-lg my-1">
                    Candiate Rating :
                  </p>
                  <div className="flex items-center md:ml-4 ml-1 space-x-1">
                    {item.evaluations.candidate_rating
                      > 0 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {item.evaluations.candidate_rating
                      > 1 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {item.evaluations.candidate_rating
                      > 2 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {item.evaluations.candidate_rating
                      > 3 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                    {item.evaluations.candidate_rating
                      > 4 ? (
                      <AiTwotoneStar
                        className="text-yellow-500 text-xl"

                      />
                    ) : (
                      <AiOutlineStar
                        className="text-xl cursor-pointer"

                      />
                    )}
                  </div>

                </div>


                <div className="w-full md:px-9 px-3 md:py-6 py-2 space-y-2">
                  <div className="w-full  bg-white bg-white px-3">
                    <p className="font-semibold text-lg my-1">Status</p>

                    <p>
                      {" "}
                      <span className="font-semibold">
                        Current Status :
                      </span>{" "}
                      {item.evaluations.status}
                    </p>
                  </div>

                  <div className="w-full  bg-white bg-white px-3 py-6 space-y-2">
                    <p className="font-semibold text-lg my-3">
                      Evaluation Details
                    </p>

                    {
                      item && item.evaluations && item.evaluations.questions &&
                      item.evaluations.questions.map((question, index) => {
                        return (
                          <div className="my-5">
                            <p className="font-semibold text-md">
                              Question {index + 1} :{" "}
                              <span className="font-normal">
                                {question.question}
                              </span>
                            </p>
                            <p className="font-semibold text-gray-600 text-md my-1">
                              Ideal Answer :{" "}
                              <span className="font-normal">
                                {question.idealAnswer}
                              </span>
                            </p>
                            <textarea
                              className="px-4 py-1 my-3 w-3/4"
                              style={{ borderRadius: "5px" }}
                              disabled
                            >
                              {question.answer}
                            </textarea>
                          </div>
                        );
                      }
                      )}

                  </div>


                  <div>
                    <div className="flex justify-between md:w-3/4 px-3">
                    <p className="font-semibold text-lg my-3">Skills</p><button
                      className=" hover:bg-blue-700 text-white font-bold px-8 md:mx-6 sm:mx-0 text-xs rounded"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {

                        



                        var array = item.evaluations.skills,
                          grouped = array.reduce((r, v, i, a) => {
                            // console.log(r);
                          //   console.log(v.role);
                          //   console.log(i);
                          //   console.log(a[0].role);
                          //   const map1 = new Map();
                            if (a[i - 1] && v.role == a[i - 1].role) {
                             r[r.length - 1].push(v);


                            //     if (a[i - 1] && v.primarySkill == a[i - 1].primarySkill) {
                            // //  const data = map1.get(v.primarySkill);
                            // //  if(data === undefined){
                            // //        map1.set(v.primarySkill, new Array())
                            // //  }else{
                            // //       data.push(v.secondarySkill);
                            // //       map1.set(v.primarySkill, data);
                            // //  }
                            //     }
                            //     else{
                            //       r.push(v === a[i + 1] ? [v] : [v]);
                            //     }



                            } else {
                              r.push(v === a[i + 1] ? [v] : [v]);
                              
                            }

let skills = [];
                           for(var i=0 ; i<r.length ; i++){

                              // if(item.role == "Front End Developer"){
                                // console.log(item)
                                const map1 = new Map();
  r[i].map((item)=>{

    var  data = map1.get(item.primarySkill);
    if(data == undefined){
     let arr = new Array();
     arr.push({secondarySkill:item.secondarySkill,proficiency:item.proficiency,role:item.role});
         map1.set(item.primarySkill, arr);
    }else{
        data.push({secondarySkill:item.secondarySkill,proficiency:item.proficiency,role:item.role});
        map1.set(item.primarySkill, data);
    }

  })
 var array = [];
  map1.forEach((value,key)=>{
    array.push({value:value , key:key})
  })
  skills.push(array);
  

                             
                              // }
  
                          }

                           console.log(skills);


                          
                            //  console.log(r);

                             setSkillSet(skills);
                             return r;
                            // {skillSet
                            // && skillSet.map((item, index) => {
                            // var array = item,
                            // grouped = array.reduce((r, v, i, a) => {
                            //   // console.log(r);
                            //   // console.log(v.role);
                            //   // //console.log(i);
                            //   // console.log(a[0].role);
                            //   if (a[i - 1] && v.primarySkill == a[i - 1].primarySkill) {
                                
                            //     r[r.length - 1].push(v);
                            //     // console.log(r);
  
  
  
                            //   } else {
                            //     r.push(v === a[i + 1] ? [v] : [v]);
                                
                            //   }
                            //    console.log(r)
  
                            //    setPrimarySkills(r);
                             
                            // }, []);
                          //})}
                           
                          }, []);

                         

                      }}

                    >
                      show Skills
                    </button>
                    </div>
                    <div className=" bg-white w-full  space-y-1">


                      <div className="p-3">
                       {skillSet
                ? skillSet.map((item, index) => {
                  return ( <div className="">
                      <div className="flex justify-between md:w-3/4 px-3 ">
                      <p className="font-semibold text-md md:w-1/2  md:flex w-full   my-2">
                        {/* {item[0].role} */}
                       {item[0].value[0].role}
                      </p>
                   
             
                    </div>

                { item.map((item)=>{
return (<div className="py-1 block">
                          <p className="text-sm my-2">{item.key}</p>
                        
                          <div className="md:flex flex-wrap">
                          {item.value && item.value.map((e) => (
                                <p className="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800 ">
                                  {e.secondarySkill}{" "}
                                  {e.proficiency &&
                                    `(${e.proficiency})`}
                                </p>
                             ))}
                          </div>
                        </div>)
  //  console.log(value, key); // 
})}
                      
                        
                      
                    </div>
                  );
                })
                : "No Skills"} 
                      </div>

                    </div>
                  </div>

                  <div className="my-2 bg-white ">
                    <p className="font-semibold text-lg my-1 mx-2">Feedback</p>
                    <div className="w-full bg-white px-3 py-3 space-y-2">
                      {/* <p className="font-semibold">Add Feedback</p> */}
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        value={item.evaluations.feedback}
                        disabled
                      />

                    </div>
                  </div>



                  <div className="my-2 bg-white ">
                    <div className="flex justify-between w-3/4">
                      <p className="font-semibold text-lg my-1 mx-2">Concern</p>
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-2 px-8 md:mx-6 sm:mx-0 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={async () => {
                          let res = await updateEvaluation({
                            updates: { concern: concern },
                            user_id: item._id,
                            application_id: item.job,
                          });
                          if (res && res.status === 200) {
                            swal("Success", "Feedback Updated", "success");
                          }
                          else {
                            swal("Error", "Something went wrong", "error");
                          }
                        }}
                      >
                        Update
                      </button>
                    </div>
                    <div className="w-full bg-white px-3 py-3 space-y-2">
                      {/* <p className="font-semibold">Add Feedback</p> */}
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        value={item.evaluations.concern}
                        onChange={(e) => {
                          setConcern(e.target.value);
                        }}
                      />

                    </div>
                  </div>
                </div>
              </div>
              </>

              )
            }) : <p>Not Yet Evaluated</p>}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UpdateInterviewApplication;
