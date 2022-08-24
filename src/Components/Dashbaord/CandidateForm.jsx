import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "tw-elements";
import ResumeForm from "./CandidateFormComponent/ResumeForm";
import EducationDetailForm from "./CandidateFormComponent/EducationalDetails";
import ExperienceDetailForm from "./CandidateFormComponent/ExperienceDetail";
import ContactDetailForm from "./CandidateFormComponent/ContactDetails";
import Tools from "./CandidateFormComponent/Tools";

const CandidateResumeForm = (props) => {
  let [isOpen, setIsOpen] = useState(props.isOpen);
  let [step, setStep] = useState(0);

  // Candidate Details
  const [candidateDetails, setCandidateDetails] = useState({
    resume: null,
    education: [],
    experience: [],
    contact: {},
    tools: [],
  });

  const [progress, setProgress] = useState(1);

  let components = [
    {
      name: "Upload Resume",
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
      component: (
        <ExperienceDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Contact Details",
      component: (
        <ContactDetailForm
          setCandidateDetails={setCandidateDetails}
          setStep={setStep}
          candidateDetails={candidateDetails}
        />
      ),
    },
    {
      name: "Tools",
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
      if (res === "null" || res === null) {
        localStorage.setItem(
          "candidateDetails",
          JSON.stringify(candidateDetails)
        );
      }
    };
    initial();
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} className="relative z-50">
        <Dialog
          as="div"
          className="relative z-10"
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
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900"
                  >
                    Complete Your Profile
                  </Dialog.Title>
                  <div className="pt-4">
                    <div className="flex justify-between py-3">
                      {components &&
                        components.map((item, index) => {
                          return (
                            <div
                              className={`text-sm ${
                                index > step && ("text-gray-600")
                              } ${index === step && ("text-blue-600")} ${index < step && ("text-green-600")}`}
                            >
                              {item.name}
                            </div>
                          );
                        })}
                    </div>
                    <div class="w-full bg-gray-200 h-1 mb-6">
                      <div
                        class="bg-blue-400 h-1"
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
