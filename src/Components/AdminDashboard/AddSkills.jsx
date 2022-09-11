import React from "react";
import * as xlsx from "xlsx/xlsx.mjs";
import { AiOutlineClose } from "react-icons/ai";
import { addSkills, getSkills } from "../../service/api";
import swal from "sweetalert";

const AddSkills = () => {
  const inputRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const [dbSkills, setDbSkills] = React.useState([]);
  const [skills, setSkills] = React.useState([]);
  const [skillError, setSkillError] = React.useState(null);

  const changeHandler = async (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        let s = skills;
        console.log(json[0]["Secondary Skill"].split("  ")[0].split("\n"));
        for (let i = 0; i < json.length; i++) {
          let secSkills = json[i]["Secondary Skill"]
            .split("  ")[0]
            .split("\n");
          if(secSkills.length === 1){
            secSkills = secSkills[0].split(",")
          }
          for (let j = 0; j < secSkills.length; j++) {
            const res = s.findIndex((el) => {
              console.log(el);
              return (
                el.Role.toLowerCase() === json[i].Role.toLowerCase() &&
                json[i]["Primary Skill"].toLowerCase() ===
                  el.PrimarySkill.toLowerCase() &&
                secSkills[j].toLowerCase() === el.SecondarySkill.toLowerCase()
              );
            });
            const res2 = dbSkills.findIndex((el) => {
              return (
                el.Role.toLowerCase() === json[i].Role.toLowerCase() &&
                json[i]["Primary Skill"].toLowerCase() ===
                  el.PrimarySkill.toLowerCase() &&
                secSkills[j].toLowerCase() === el.SecondarySkill.toLowerCase()
              );
            });
            if (res === -1 && res2 === -1) {
              s.push({
                Role: json[i].Role,
                PrimarySkill: json[i]["Primary Skill"],
                SecondarySkill: secSkills[j],
              });
            }
          }
        }
        console.log(s);
        await setSkills(s);
        setSkills([...skills, "S"]);
        setSkills(
          skills.filter((el) => {
            return el !== "S";
          })
        );
        fileRef.current.value = "";
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    let user = JSON.parse(await localStorage.getItem("user"));
    let token = user.access_token;
    let res = await addSkills({ user_id: user._id, skills: skills }, token);
    console.log(res);
    if (res && res.status === 200) {
      swal({
        title: "Success",
        text: "Skills Added Successfully",
        icon: "success",
        button: "Ok",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

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

  return (
    <div className="p-5 bg-slate-100 h-100" style={{height:'100%'}}>
      <div className="w-5/6 bg-white mx-auto py-4 px-6 h-100">
      <p className="font-bold text-2xl">Add Skills</p>
      <div className="my-4 flex items-center">
        <div className="my-4">
          <p className="font-semibold">Import Spreadsheet</p>
          <p className="text-xs">( Upload sheet with Skills as header )</p>
        </div>
        <label for="skillCSV">
          <p
            className="ml-10 rounded-sm cursor-pointer bg-blue-500 px-2 py-1 text-white"
            onClick={() => {
              if (fileRef.current) {
                fileRef.current.click();
              }
            }}
          >
            Import
          </p>
        </label>
        <input
          type="File"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          name="skillCSV"
          ref={fileRef}
          className="hidden"
          onChange={changeHandler}
        />
      </div>
      <div>
        <p className="font-semibold">Add Skill</p>
        <div className="flex items-center">
          <input
            type="text"
            className="p-0 text-600 my-2 h-8"
            ref={inputRef}
            onChange={() => {
              setSkillError(null);
              const res = skills.findIndex((el) => {
                return (
                  el.toLowerCase() === inputRef.current.value.toLowerCase()
                );
              });
              if (res !== -1) {
                setSkillError("Skill already added");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSkillError(null);
                if (inputRef.current) {
                  if (
                    !skills.includes(inputRef.current.value) &&
                    !dbSkills.includes(inputRef.current.value) &&
                    inputRef.current.value !== "" &&
                    inputRef.current.value !== null
                  ) {
                    setSkills([...skills, inputRef.current.value]);
                    inputRef.current.value = "";
                  }
                  const res = skills.findIndex((el) => {
                    return (
                      el.toLowerCase() === inputRef.current.value.toLowerCase()
                    );
                  });
                  const res2 = dbSkills.findIndex((el) => {
                    return (
                      el.toLowerCase() === inputRef.current.value.toLowerCase()
                    );
                  });
                  if (res !== -1 || res2 !== -1) {
                    setSkillError("Skill already added");
                  }
                }
              }
            }}
          />
          <button
            className="bg-blue-500 text-white rouned-sm ml-8 px-2 py-1"
            onClick={() => {
              setSkillError(null);
              if (inputRef.current) {
                if (
                  !skills.includes(inputRef.current.value) &&
                  !dbSkills.includes(inputRef.current.value) &&
                  inputRef.current.value !== "" &&
                  inputRef.current.value !== null
                ) {
                  setSkills([...skills, inputRef.current.value]);
                  inputRef.current.value = "";
                }
                const res = skills.findIndex((el) => {
                  return (
                    el.toLowerCase() === inputRef.current.value.toLowerCase()
                  );
                });
                const res2 = dbSkills.findIndex((el) => {
                  return (
                    el.toLowerCase() === inputRef.current.value.toLowerCase()
                  );
                });
                if (res !== -1 || res2 !== -1) {
                  setSkillError("Skill already added");
                }
              }
            }}
          >
            Add
          </button>
        </div>
        <div>
          {skillError && <p className="text-red-500 text-sm">{skillError}</p>}
        </div>
        <div className="flex items-center my-4 flex-wrap">
          {skills.map((skill) => {
            return (
              <div className="bg-blue-100 text-blue-700 flex space-x-3 mr-4 items-center p-2">
                <p className="text-sm">{skill.Role}</p>
                <p
                  className="cursor-pointer text-sm"
                  onClick={() => {
                    setSkills(
                      skills.filter((el) => {
                        return el !== skill;
                      })
                    );
                  }}
                >
                  <AiOutlineClose />
                </p>
              </div>
            );
          })}
        </div>
        <div className="my-4">
          <button
            className="px-2 py-1 bg-blue-500 text-white rounded-sm"
            disabled={skills.length === 0}
            onClick={handleUpload}
          >
            Update
          </button>
        </div>
        {/* <div className="my-4">
          <p className="font-semibold">Skills Present</p>
          <div className=" items-center my-4">
            {dbSkills.map((skill) => {
              return (
                <div className="bg-blue-100 text-blue-700 flex space-x-3 mr-4 my-2 items-center p-2">
                  <p className="text-sm">{skill}</p>
                </div>
              );
            })}
          </div>
        </div> */}
      </div>
    </div>
    </div>
  );
};

export default AddSkills;
