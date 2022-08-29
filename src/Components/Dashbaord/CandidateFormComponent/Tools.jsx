import React from "react";
import swal from "sweetalert";
import { AiOutlineClose } from "react-icons/ai";
import { RiContactsBookLine } from "react-icons/ri";

import { getSkills, submitCandidateDetails } from "../../../service/api";

const Tools = (props) => {
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
      let res = await getSkills({ user_id: user._id }, user.access_token);
      if (res && res.status === 200) {
        let skills = [];
        res.data.map((el) => {
          skills.push(el.skill);
        });
        await setDbSkills(skills);
      }
    };
    initial();
  });

  const handleSubmit = async () => {
    let res = JSON.parse(await localStorage.getItem("candidateDetails"));
    let user = JSON.parse(await localStorage.getItem("user"));
    res.user_id = user._id;
    let access_token = await localStorage.getItem("access_token");
    let response = await submitCandidateDetails(res, access_token);
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
    <div>
      <p className="font-bold text-lg">Skills</p>
      <div className="flex flex-wrap items-center">
        <input
          className="w-4/5 text-600 my-3 mr-3"
          style={{ borderRadius: "10px" }}
          type="text"
          ref={inputRef}
          onChange={() => {
            if (inputRef.current) {
              setSuggesstions(
                dbSkills.filter((el) => {
                  return el.includes(inputRef.current.value);
                })
              );
              const res = tools.findIndex((el) => {
                return (
                  el.toLowerCase() === inputRef.current.value.toLowerCase()
                );
              });
              if (res !== -1) {
                setDisabled(true);
                setError("Already added");
              } else {
                setDisabled(false);
                setError(null);
              }
            }
          }}
          onKeyDown={async (e) => {
            if (e.key === "Enter" && disabled === false) {
              if (inputRef.current) {
                if (inputRef.current.value !== "") {
                  let t = tools;
                  await setTools([...tools, inputRef.current.value]);
                  t.push(inputRef.current.value);
                  console.log(t);
                  inputRef.current.value = "";
                  let res = await localStorage.getItem("candidateDetails");
                  res = JSON.parse(res);
                  res.tools = t;
                  await localStorage.setItem(
                    "candidateDetails",
                    JSON.stringify(res)
                  );
                  setError(null);
                }
              }
            }
          }}
        />
        <button
          type="button"
          className="bg-blue-600 rounded-sm text-white  py-2 px-3"
          disabled={disabled}
          onClick={async () => {
            if (inputRef.current && inputRef.current.value !== "") {
              let t = tools;
              await setTools([...tools, inputRef.current.value]);
              t.push(inputRef.current.value);
              inputRef.current.value = "";
              let res = await localStorage.getItem("candidateDetails");
              res = JSON.parse(res);
              res.tools = t;
              await localStorage.setItem(
                "candidateDetails",
                JSON.stringify(res)
              );
              setError(null);
            }
          }}
        >
          Add
        </button>
        {error && <p className="text-sm text-red-500 mb-5">{error}</p>}
      </div>
      <div className="flex items-center space-x-3 py-4">
        <p className="font-semibold">Suggesstions:</p>
        {suggesstions &&
          suggesstions.map((el, index) => {
            if (index < 5) {
              return (
                <p
                  key={index}
                  className="text-sm text-blue-700 bg-blue-100 p-2 cursor-pointer"
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = el;
                    }
                  }}
                >
                  {el}
                </p>
              );
            }
            return null;
          })}
      </div>
      <div className="flex flex-wrap">
        {tools &&
          tools.map((item, index) => {
            return (
              <div
                key={index}
                className="bg-gray-400 mr-3 my-2 text-black py-1 px-2 flex items-center space-x-3"
              >
                <p>{item}</p>
                <p
                  className="cursor-pointer"
                  onClick={async () => {
                    const res1 = tools.filter((el) => {
                      return el !== item;
                    });
                    let res = await localStorage.getItem("candidateDetails");
                    res = JSON.parse(res);
                    res.tools = res1;
                    await localStorage.setItem(
                      "candidateDetails",
                      JSON.stringify(res)
                    );
                    setTools(res1);
                  }}
                >
                  <AiOutlineClose />
                </p>
              </div>
            );
          })}
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
