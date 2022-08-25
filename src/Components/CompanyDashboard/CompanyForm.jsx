import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "tw-elements";
import ResumeForm from "./CompanyFormComponent/ResumeForm";
import AboutDetailForm from "./CompanyFormComponent/AboutDetails";
import Billing from "./CompanyFormComponent/Billing";
import ContactDetailForm from "./CompanyFormComponent/ContactDetails";
import Tools from "./CompanyFormComponent/Tools";

const CandidateResumeForm = (props) => {
  let [isOpen, setIsOpen] = useState(props.isOpen);
  let [step, setStep] = useState(0);

  // Candidate Details
  const [companyDetails, setCompanyDetails] = useState({
    // resume: null,
    about : [],
    // experience : [],
    contact : {},
    billing : [],
  });

  const [progress, setProgress] = useState(1);

  let components = [
    // {
    //   icon: "Upload Resume",
    //   component: (
    //     <ResumeForm
    //       setCompanyDetails={setCompanyDetails}
    //       setStep={setStep}
    //       companyDetails={companyDetails}
    //     />
    //   ),
    // },
    { name: "About",
      icon: "",
      component: (
        <AboutDetailForm
          setCompanyDetails={setCompanyDetails}
          setStep={setStep}
          companyDetails={companyDetails}
        />
      ),
    },
  
    {name: "Contact Details",
      icon: "",
      component: <ContactDetailForm
      setCompanyDetails={setCompanyDetails}
      setStep={setStep}
      companyDetails={companyDetails}
      />
    },
      {name: "Billing Credentials",
      icon : "",
      component : <Billing
      setCompanyDetails={setCompanyDetails}
      setStep={setStep}
      companyDetails={companyDetails}
      />
    }
    // {
    //   name: "Tools",
    //   icon :"",
    //   component : <Tools
    //   setCompanyDetails={setCompanyDetails}
    //   setStep={setStep}
    //   companyDetails={companyDetails}
    //   />
    // }
  ];

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  React.useEffect(() => {
    var p = (step +1) * (100 / components.length);
    setProgress(p);
  },[step])

  // React.useEffect(()=>{
  //   localStorage.setItem("companyDetails", JSON.stringify(companyDetails));
  // },[])
  React.useEffect(() => {
    const initial = async () => {
      let res = await localStorage.getItem("companyDetails");
      if (res === "null" || res === null) {
        localStorage.setItem(
          "companyDetails",
          JSON.stringify(companyDetails)
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
                    Complete Your Details
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
                      <div class="bg-blue-400 h-1" style={{width: progress+"%"}}></div>
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
