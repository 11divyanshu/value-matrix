import React from "react";
import { Link } from "react-router-dom";
import { getCompanyList } from "../../service/api";

// Assets
import { BsGlobe } from "react-icons/bs";
import { FaRegBuilding } from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";

const CompanyList = () => {
  const [companyList, setCompanyList] = React.useState([]);

  React.useEffect(() => {
    const initial = async () => {
      let access = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let res = await getCompanyList({ user_id: user._id }, access);
      if (res && res.status === 200) {
        setCompanyList(res.data.company);
      }
    };
    initial();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold">Company List</p>
      <div className="mt-3">
        <div class="flex flex-col">
          <div class="overflow-x-auto w-[90%] sm:-mx-6 lg:-mx-8">
            <div class="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="w-full">
                  <thead class="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        First Name
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        View Details
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList.map((user, index) => {
                      return (
                        <tr
                          class={`${
                            index % 2 === 0 ? "bg-gray-100" : "bg-white"
                          } border-b`}
                        >
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.username}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.firstName}
                          </td>
                          <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td class="text-xs text-blue-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/company/${user._id}`}>
                              View Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
