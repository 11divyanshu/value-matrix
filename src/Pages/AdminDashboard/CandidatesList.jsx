import React from "react";
import { getUserList } from "../../service/api";
import { Link } from "react-router-dom";

const CandiadateList = () => {
  const [userList, setUserList] = React.useState([]);

  React.useEffect(() => {
    const initial = async () => {
      let token = await localStorage.getItem("access_token");
      let user = JSON.parse(await localStorage.getItem("user"));
      let response = await getUserList({ user_id: user._id }, token);
      if (response && response.status === 200) {
        setUserList(response.data.user);
      }
    };
    initial();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-semibold">Candidates List</p>
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
                    {userList.map((user, index) => {
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
                          <td class="text-xs text-blue-500 font-light px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/candidate/${user._id}`}>View Detail</Link>
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

export default CandiadateList;
