import React, {useRef} from "react";
import { Link, useParams } from "react-router-dom";
import { getCandidateEvaluation ,getUser} from "../../service/api";
import { CgWorkAlt } from "react-icons/cg";
import { BsCashStack } from "react-icons/bs";
import Microsoft from "../../assets/images/micro.jpg";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { AiTwotoneStar, AiOutlineStar } from "react-icons/ai";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";
import { useReactToPrint } from "react-to-print";

import { HiOutlineLocationMarker } from "react-icons/hi";
import swal from "sweetalert";
import { IoTerminalSharp } from "react-icons/io5";

const UpdateInterviewApplication = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);
  const [u_id, setu_id] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [status, setStatus] = React.useState(null);
  const [currStatus, setCurrStatus] = React.useState(null);
  const [feedback, setFeedback] = React.useState(null);
  const [evaluation, setEvaluation] = React.useState([]);
  const [rating, setRating] = React.useState(0);


  const [user, setUser] = React.useState(null);
  const [candidate, setCandidate] = React.useState(null);

  const componentRef = useRef();
  const openPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Evaluation Report"
  })

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
      if(res.data.data){
        setEvaluation(res.data.data);
      }
    
      setLoading(false);
    };
    initial();
  }, []);

  return (
    <div className="bg-slate-100" ref={componentRef}>
      <div className="mx-5 mt-3 md:p-5 p-1">
        <p className="font-bold text-2xl ">Interview Details</p>
        {loading && (
          <p className="text-center font-semibold text-lg">Loading Data...</p>
        )}
        <div>
          <button onClick={openPdf} >Print</button>
          </div>
        {!loading && (
          <div>
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
                        <h5 class="text-black-900 text-lg font-bold mb-1 ">
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


           {evaluation ? evaluation.map((item ,index)=>{

            return ( <> <div className="my-5 bg-white">
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
                          item && item.evaluations&& item.evaluations.questions && 
                          item.evaluations.questions.map((question,index) => {
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
                
                  <div className="my-2 bg-white ">
                    <p className="font-semibold text-lg my-1 mx-2">Feedback</p>
                    <div className="w-full bg-white px-3 py-3 space-y-2">
                      {/* <p className="font-semibold">Add Feedback</p> */}
                      <textarea
                        className="px-4 py-1 my-3 w-3/4 block"
                        rows="5"
                        style={{ borderRadius: "5px" }}
                        value={item.evaluations.feedback}
                        
                      />
                     
                    </div>
                  </div>
                </div>
              </div>
              </>
        
)
        }):<p>Not Yet Evaluated</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateInterviewApplication;
