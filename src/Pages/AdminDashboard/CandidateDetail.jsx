import React from "react";
import { useParams, Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { FiInfo } from "react-icons/fi";
import { BsCalendar } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { download } from "downloadjs";
import { downloadResume } from "../../service/api.js";
import { useNavigate } from "react-router-dom";

const CandiadateDetail = () => {
  const { id } = useParams();
  const [userDetail, setUserDetail] = React.useState(null);

  const navigate = useNavigate();
  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.list_candidates ===
          false
        ) {
          navigate(-1);
        }
      }
      let token = await localStorage.getItem("access_token");
      let response = await getUserFromId({ id: id }, token);
      console.log(response);
      if (response && response.status === 200) {
        await setUserDetail(response.data.user);
      }
    };
    initial();
  }, []);

  return (
    <div className="p-5">
      <Link to="/admin/candidates" className="text-sm text-blue-500 my-2">
        Back
      </Link>
      {userDetail && (
        <div>
          <p className="text-2xl font-bold">Candidate Details</p>
          <div className="flex w-full items-center">
            <p className="text-xl font-bold my-5 capitalize">
              {userDetail.firstName} {userDetail.lastname}
            </p>
            {userDetail.resume && (
              <p
                className="ml-auto text-blue-500 text-sm cursor-pointer"
                onClick={async () => {
                  let token = await localStorage.getItem("access_token");
                  let res = await downloadResume({ user_id: id }, token);
                  if (res && res.status === 200) {
                    const link = document.createElement("a");
                    link.href = res.data.link;
                    link.setAttribute("download", "resume.pdf");
                    link.setAttribute("target", "_blank");
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                  }
                }}
              >
                Download Resume
              </p>
            )}
          </div>
          <div className="space-y-2 bg-gray-100 p-3 rounded-sm">
            <p>
              <span className="font-semibold">Username :</span>{" "}
              {userDetail.username}
            </p>
            <p>
              <span className="font-semibold">Email :</span> {userDetail.email}
            </p>
            <p>
              <span className="font-semibold">Contact :</span>{" "}
              {userDetail.contact}
            </p>
            {userDetail.address && (
              <p>
                <span className="font-semibold">Address :</span>{" "}
                {userDetail.address}
              </p>
            )}
          </div>
          {userDetail.education && userDetail.education.length > 0 && (
            <div className="bg-gray-100 my-3 p-3">
              <p className="font-semibold">Education</p>
              {userDetail.education &&
                userDetail.education.length > 0 &&
                userDetail.education.map((edu) => {
                  return (
                    <div className="p-3 bg-white my-2 w-3/4">
                      <p className="font-semibold">{edu.school}</p>
                      <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                        <div className="flex space-x-2 text-sm items-center">
                          <FiInfo />
                          <p>{edu.degree}</p> <p>|</p>{" "}
                          <p>{edu.field_of_study}</p>
                        </div>
                        {edu.grade && (
                          <div className="space-x-2 flex items-center">
                            <GrScorecard /> <p>{edu.grade}</p>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <BsCalendar />
                          <p className="text-sm text-gray-600 mr-5">
                            {edu.start_date} - {edu.end_date}
                          </p>
                        </div>
                      </div>
                      {edu.description && (
                        <div className="py-2">{edu.description}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          {userDetail.experience && userDetail.experience.length > 0 && (
            <div className="bg-gray-100 my-3 p-3">
              <p className="font-semibold">Experience</p>
              {userDetail.experience &&
                userDetail.experience.length > 0 &&
                userDetail.experience.map((exp) => {
                  return (
                    <div className="p-3 bg-white my-2 w-3/4">
                      <p className="font-semibold">{exp.title}</p>
                      <div className="flex flex-wrap space-x-12 w-full py-1 text-gray-800 ">
                        <div className="space-x-2 flex items-center">
                          <FaRegBuilding />
                          <p>{exp.company_name}</p>
                        </div>
                        <div className="space-x-2 flex items-center">
                          <CgWorkAlt />
                          <p>{exp.industry}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BsCalendar />
                          <p className="text-sm text-gray-600 mr-5">
                            {exp.start_date} - {exp.end_date}
                          </p>
                        </div>
                      </div>
                      {exp.description && (
                        <div className="py-2">{exp.description}</div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          {userDetail.tools && userDetail.tools.length > 0 && (
            <div className="bg-gray-100 my-3 p-3">
              <p className="font-semibold">Skills</p>
              <div className="bg-white p-3 my-2 flex flex-wrap space-x-4">
                {userDetail.tools &&
                  userDetail.tools.length > 0 &&
                  userDetail.tools.map((skill) => {
                    return (
                      <div>
                        {/* <p className="font-semibold text-md my-3">{skill}</p>
                        {skillsPrimary[skill].map((el) => (
                          <div>
                            <p className="text-sm my-2">{el}</p>
                            {user.tools
                              .filter(
                                (tool) =>
                                  tool.role === skill &&
                                  tool.primarySkill === el
                              )
                              .map((skill1, index) => (
                                <span className="bg-blue-100 inline-block text-blue-800 text-xs my-4 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                  {skill1.secondarySkill}({skill1.proficiency}){" "}
                                  <span className="text-sm">
                                    {" "}
                                    {skill1.lastassested
                                      ? `(lastassested(${item1.lastassested}))`
                                      : "unassested"}
                                  </span>
                                </span>
                              ))}
                          </div>
                        ))} */}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandiadateDetail;
