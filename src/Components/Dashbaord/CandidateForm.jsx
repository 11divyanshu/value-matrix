import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "../../assets/stylesheet/detailForm.scss";

import "tw-elements";
import ResumeForm from "./CandidateFormComponent/ResumeForm";
import EducationDetailForm from "./CandidateFormComponent/EducationalDetails";
import ExperienceDetailForm from "./CandidateFormComponent/ExperienceDetail";
import AssociationDetailForm from "./CandidateFormComponent/Association";
import ContactDetailForm from "./CandidateFormComponent/ContactDetails";
import Tools from "./CandidateFormComponent/Tools";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { IoSchoolOutline } from "react-icons/io5";
import { FaRegBuilding } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
const CandidateResumeForm = (props) => {
  let [isOpen, setIsOpen] = useState(props.isOpen);
  let [step, setStep] = useState(0);

  // Candidate Details
  const [candidateDetails, setCandidateDetails] = useState({
    resume: null,
    education: [],
    experience: [],
    associate: [],
    contact: {},
    tools: [],
  });

  const [progress, setProgress] = useState(1);

  let components = [
    {
      name: "Upload Resume",
      icon: <IoSchoolOutline  />,
      component: (
        <ResumeForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Educational Details",
      icon: <FaRegBuilding  />,
      component: (
        <EducationDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Experience",
      icon: <CgWorkAlt  />,
      component: (
        <ExperienceDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Association",
      icon: <CgWorkAlt  />,
      component: (
        <AssociationDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Contact Details",
      icon: <FiInfo  />,
      component: (
        <ContactDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Skills",
      icon: <GrScorecard />,
      component: (
        <Tools
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
  ];

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  React.useEffect(() => {
    var p = (step + 1) * (100 / components.length);
    setProgress(p);
  }, [step]);

  React.useEffect(() => {
    const initial = async () => {
      let res = await localStorage.getItem("candidateDetails");
      let user = JSON.parse(await localStorage.getItem("user"));
      if (user && (res === "null" || res === null)) {
        let data = {
          education : user.education ? user.education : [],
          experience : user.experience ? user.experience : [],
          associate : user.associate ? user.associate : [],
          contact : user.contact ? user.contact : {},
          tools : user.tools ? user.tools : [],
        }
        await localStorage.setItem("candidateDetails", JSON.stringify(data));
      }
    };
    initial();
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} className="relative z-50 w-full">
        <Dialog
          as="div"
          className="relative z-120  w-5/6"
          onClose={() => {}}
          static={true}
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all" >
                  <Dialog.Title
                    as="h3"
                    className="text-lg md:text-2xl font-bold leading-6 text-gray-900 flex"
                  >
                    Complete Your Profile
                    <p className="ml-auto mt-1 text-sm text-[#034488] cursor-pointer" onClick = {()=>{
                      
                      localStorage.removeItem("resumeInfo")
                      props.setModalIsOpen(false); localStorage.setItem("modalOnce", true);}}>Skip</p>
                  </Dialog.Title>
                  <div className="pt-4">
                    <div className="flex justify-between py-3">
                      {components &&
                        components.map((item, index) => {
                          return (
                            <div
                              className={`text-sm ${
                                index > step && "text-gray-600"
                              } ${index === step && "text-[#034488] font-semibold"} ${
                                index < step && "text-green-600"
                              }`}
                            >
                               <p className="lg:visible hidden content">{item.name}</p>
          <p className="icons hidden">
           {item.icon}
          </p>
                            </div>
                          );
                        })}
                    </div>
                    <div className="w-full bg-gray-200 h-1 mb-6">
                      <div
                        className="bg-[#034488] h-1"
                        style={{ width: progress + "%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-8">{components[step].component}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default CandidateResumeForm;
