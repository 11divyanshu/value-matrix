import React from "react";
import swal from "sweetalert";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";

import { AiOutlineClose, AiOutlineStar, AiFillStar } from "react-icons/ai";
import { RiContactsBookLine } from "react-icons/ri";

import { getSkills, submitCandidateDetails } from "../../../service/api";

const Tools = (props) => {
  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);

  const [loading, setLoading] = React.useState(true);

  const inputSkillRef = React.useRef(null);


  const [tools, setTools] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);

  const [dbSkills, setDbSkills] = React.useState([]);
  const [suggesstions, setSuggesstions] = React.useState([]);

  const inputRef = React.useRef(null);

  const [submitError, setSubmitError] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let res = JSON.parse(await localStorage.getItem("candidateDetails"));

      if (res !== null && res.tools !== []) {
        setTools(res.tools);
      }
    };
    initial();
  }, []);

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let p = JSON.parse(await localStorage.getItem("prof"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        if (p) {
          setProf(p);
        } else {
          await setProf(new Array(res.data.length).fill(0));
        }
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
        await setLoading(false);
      }
    };
    initial();
  }, []);

  const handleSubmit = async () => {
    let res = JSON.parse(await localStorage.getItem("candidateDetails"));
    let user = JSON.parse(await localStorage.getItem("user"));
    res.user_id = user._id;
    let skills = dbSkills.filter((el)=>{
      return el.proficiency > 0;
    })
    let access_token = await localStorage.getItem("access_token");
    let response = await submitCandidateDetails({res, tools : skills, user_id : user._id}, access_token);
    if (response && response.status === 200) {
      await localStorage.setItem("user", JSON.stringify(response.data.user));
      await localStorage.removeItem("candidateDetails");
      swal({
        title: "Candidate Details",
        text: "Details Updated",
        icon: "success",
        button: false,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      swal({
        title: "Candidate Details",
        text: "Something Went Wrong",
        icon: "error",
        button: false,
      });
      setSubmitError("Something went wrong");
    }
  };

  return (
    // <div>
    //   <p className="font-bold text-lg">Skills</p>
    //   <div className="flex flex-wrap items-center">
    //     <input
    //       className="w-4/5 text-600 my-3 mr-3"
    //       style={{ borderRadius: "10px" }}
    //       type="text"
    //       ref={inputRef}
    //       onChange={() => {
    //         if (inputRef.current) {
    //           setSuggesstions(
    //             dbSkills.filter((el) => {
    //               return el.includes(inputRef.current.value);
    //             })
    //           );
    //           const res = tools.findIndex((el) => {
    //             return (
    //               el.toLowerCase() === inputRef.current.value.toLowerCase()
    //             );
    //           });
    //           if (res !== -1) {
    //             setDisabled(true);
    //             setError("Already added");
    //           } else {
    //             setDisabled(false);
    //             setError(null);
    //           }
    //         }
    //       }}
    //       onKeyDown={async (e) => {
    //         if (e.key === "Enter" && disabled === false) {
    //           if (inputRef.current) {
    //             if (inputRef.current.value !== "") {
    //               let t = tools;
    //               await setTools([...tools, inputRef.current.value]);
    //               t.push(inputRef.current.value);
    //               console.log(t);
    //               inputRef.current.value = "";
    //               let res = await localStorage.getItem("candidateDetails");
    //               res = JSON.parse(res);
    //               res.tools = t;
    //               await localStorage.setItem(
    //                 "candidateDetails",
    //                 JSON.stringify(res)
    //               );
    //               setError(null);
    //             }
    //           }
    //         }
    //       }}
    //     />
    //     <button
    //       type="button"
    //       className="bg-blue-600 rounded-sm text-white  py-2 px-3"
    //       disabled={disabled}
    //       onClick={async () => {
    //         if (inputRef.current && inputRef.current.value !== "") {
    //           let t = tools;
    //           await setTools([...tools, inputRef.current.value]);
    //           t.push(inputRef.current.value);
    //           inputRef.current.value = "";
    //           let res = await localStorage.getItem("candidateDetails");
    //           res = JSON.parse(res);
    //           res.tools = t;
    //           await localStorage.setItem(
    //             "candidateDetails",
    //             JSON.stringify(res)
    //           );
    //           setError(null);
    //         }
    //       }}
    //     >
    //       Add
    //     </button>
    //     {error && <p className="text-sm text-red-500 mb-5">{error}</p>}
    //   </div>
    //   <div className="flex items-center space-x-3 py-4">
    //     <p className="font-semibold">Suggesstions:</p>
    //     {suggesstions &&
    //       suggesstions.map((el, index) => {
    //         if (index < 5) {
    //           return (
    //             <p
    //               key={index}
    //               className="text-sm text-blue-700 bg-blue-100 p-2 cursor-pointer"
    //               onClick={() => {
    //                 if (inputRef.current) {
    //                   inputRef.current.value = el;
    //                 }
    //               }}
    //             >
    //               {el}
    //             </p>
    //           );
    //         }
    //         return null;
    //       })}
    //   </div>
    //   <div className="flex flex-wrap">
    //     {tools &&
    //       tools.map((item, index) => {
    //         return (
    //           <div
    //             key={index}
    //             className="bg-gray-400 mr-3 my-2 text-black py-1 px-2 flex items-center space-x-3"
    //           >
    //             <p>{item}</p>
    //             <p
    //               className="cursor-pointer"
    //               onClick={async () => {
    //                 const res1 = tools.filter((el) => {
    //                   return el !== item;
    //                 });
    //                 let res = await localStorage.getItem("candidateDetails");
    //                 res = JSON.parse(res);
    //                 res.tools = res1;
    //                 await localStorage.setItem(
    //                   "candidateDetails",
    //                   JSON.stringify(res)
    //                 );
    //                 setTools(res1);
    //               }}
    //             >
    //               <AiOutlineClose />
    //             </p>
    //           </div>
    //         );
    //       })}
    //   </div>
    //   <div className="pt-5 flex w-full">
    //     <button
    //       className="bg-blue-600 py-2 px-3 rounded-sm text-white"
    //       onClick={async () => {
    //         let access = await localStorage.getItem("access_token");
    //         let details = JSON.parse(
    //           await localStorage.getItem("candidateDetails")
    //         );
    //         let user = JSON.parse(await localStorage.getItem("user"));
    //         await submitCandidateDetails(
    //           { tools: details.tools, user_id: user._id },
    //           access
    //         );
    //         props.setStep(4);
    //       }}
    //     >
    //       Prev
    //     </button>
    //     {tools !== [] && tools.length > 0 ? (
    //       <button
    //         className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
    //         onClick={() => {
    //           handleSubmit();
    //         }}
    //       >
    //         Submit
    //       </button>
    //     ) : (
    //       <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
    //         Submit
    //       </button>
    //     )}
    //   </div>
    // </div>
    <div>
      <p className="font-bold text-lg">Skills</p>
      {loading && <div className="w-full text-center">Loading Data ...</div>}
      <div className="my-3 px-4 flex items-center flex-wrap">
              <input
                type="text"
                className="w-3/4 text-600 border-[0.5px] border-[#6b7280] p-2"
                placeholder="Search Skill..."
                ref={inputSkillRef}
                onChange={async () => {
                  let role = new Set([]);
                  if (
                    inputSkillRef.current.value.trim() !== "" ||
                    !inputSkillRef ||
                    !inputSkillRef.current.value
                  ) {
                    dbSkills.forEach((el) => {
                      if (
                        el.role
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      } else if (
                        el.primarySkill
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      } else if (
                        el.secondarySkill
                          .toLowerCase()
                          .includes(inputSkillRef.current.value.toLowerCase())
                      ) {
                        role.add(el.role);
                      }
                    });
                    await setShowRoles(Array.from(role));
                  } else {
                    await setShowRoles(roles);
                  }
                }}
              />
              <button className="h-10 bg-blue-600 text-white rounded-sm block cursor-pointer px-8 align-middle ml-3">
                Search
              </button>
            </div>

      <div className="my-3">
        <div className="w-full">
          {showRoles &&
            showRoles.map((el, index) => {
              return (
                <div key={index}>
                  <Disclosure>
                    {({ open }) => (
                      <div className={`${open ? "shadow-md":""}`}>
                        <Disclosure.Button className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg ":""}`}>
                          <span>{el}</span>
                          <ChevronUpIcon
                            className={`${
                              !open ? "rotate-180 transform" : ""
                            } h-5 w-5 text-blue-500`}
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="px-2">
                          {primarySkills[el].map((skill, index) => {
                            return (
                              <div>
                                <Disclosure>
                                  {({ open }) => (
                                    <div className={`${open ? "shadow-md":""}`}>
                                      <Disclosure.Button className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-2 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg":""} `}>
                                        <span>{skill}</span>
                                        <ChevronUpIcon
                                          className={`${
                                            !open ? "rotate-180 transform" : ""
                                          } h-5 w-5 text-blue-500`}
                                        />
                                      </Disclosure.Button>
                                      <Disclosure.Panel className="p-3 px-12">
                                        {dbSkills
                                          .filter((secSkill) => {
                                            return (
                                              secSkill.primarySkill === skill &&
                                              secSkill.role === el
                                            );
                                          })
                                          .map((secSkill, index) => {
                                            let d = dbSkills;
                                            let index1 = d.findIndex((el) => {
                                              return el === secSkill;
                                            });
                                            return (
                                              <div className="flex my-2 text-sm justify-between items-center">
                                                <p>{secSkill.secondarySkill}</p>
                                               
                                                <div className="flex items-center space-x-2">
                                                  0
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    value={prof[index1]}
                                                    onChange={async (e) => {
                                                      let d = dbSkills;
                                                      d[index1] = {
                                                        ...d[index1],
                                                        proficiency:
                                                          e.target.value,
                                                      };
                                                      let p = prof;
                                                      prof[index1] =
                                                        e.target.value;
                                                      await localStorage.setItem(
                                                        "prof",
                                                        JSON.stringify(p)
                                                      );
                                                      await setProf([...p]);
                                                      await setDbSkills([...d]);
                                                    }}
                                                  />
                                                  5
                                                </div>
                                              </div>
                                            );
                                          })}
                                      </Disclosure.Panel>
                                    </div>
                                  )}
                                </Disclosure>
                              </div>
                            );
                          })}
                        </Disclosure.Panel>
                      </div>
                    )}
                  </Disclosure>
                </div>
              );
            })}
        </div>
      </div>
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          onClick={async () => {
            let access = await localStorage.getItem("access_token");
            let details = JSON.parse(
              await localStorage.getItem("candidateDetails")
            );
            let user = JSON.parse(await localStorage.getItem("user"));
            await submitCandidateDetails(
              { tools: details.tools, user_id: user._id },
              access
            );
            props.setStep(4);
          }}
        >
          Prev
        </button>
        {tools !== [] && tools.length > 0 ? (
          <button
            className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white"
            onClick={() => {
              handleSubmit();
            }}
          >
            Submit
          </button>
        ) : (
          <button className="bg-blue-400 py-2 px-3 rounded-sm ml-auto text-white">
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default Tools;
