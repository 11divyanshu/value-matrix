import React from "react";
import { useParams, Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";

const CompanyDetails = () => {
  const { id } = useParams();
  const [companyDetail, setCompanyDetail] = React.useState(null);

  React.useEffect(() => {
    const initial = async () => {
      let token = await localStorage.getItem("access_token");
      let response = await getUserFromId({ id: id }, token);
      if (response && response.status === 200) {
        console.log(response.data);
        await setCompanyDetail(response.data.user);
      }
    };
    initial();
  }, []);

  const navigate = useNavigate();

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let res =await  getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.list_companies === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();  
  }, []);

  return (
    <div className="p-5">
      <Link to="/admin/companies" className="text-sm text-blue-500 my-2">Back</Link>
      {companyDetail && (
        <div>
          <p className="text-2xl font-bold">Company Details</p>
          <p className="text-xl font-bold my-5">{companyDetail.firstName}</p>
          <div className="flex items-center  space-x-12 pb-3">
            <p>
              <span className="font-semibold">Contact : </span>
              {companyDetail.contact}
            </p>
            {}
            {companyDetail.desc.length > 0 && companyDetail.desc[0].website && (
              <a href={companyDetail.desc[0].website} target="_blank" rel="noreferrer">
                <button className="bg-blue-500 rounded-md px-2 py-1 text-white">
                  Visit Website
                </button>
              </a>
            )}
          </div>
          <div className="text-md space-y-5 p-3 rounded-md shadow-md bg-gray-100 my-3">
            <div className="flex w-1/2 justify-between">
              <p>
                <span className="font-semibold">Email : </span>
                {companyDetail.email}
              </p>
            </div>
          </div>
          <div className="text-md space-y-5  p-3 rounded-md shadow-md bg-gray-100">
            {companyDetail.desc.length > 0 && companyDetail.desc[0].about && (
              <div className="my-2">
                <p className="font-semibold">Overview</p>
                <p>{companyDetail.desc[0].about}</p>
              </div>
            )}
            {companyDetail.desc.length > 0 && companyDetail.desc[0].desc && (
              <div className="my-2">
                <p className="font-semibold">Industry</p>
                <p>{companyDetail.desc[0].industry}</p>
              </div>
            )}
            <div className="flex justify-between w-1/2 flex-wrap">
              {companyDetail.desc.length > 0 &&
                companyDetail.desc[0].company_size && (
                  <div className="my-2">
                    <p className="font-semibold">Company Size </p>
                    <p> {companyDetail.desc[0].company_size}</p>
                  </div>
                )}
              {companyDetail.desc.length > 0 && companyDetail.desc[0].found && (
                <div className="my-2">
                  <p className="font-semibold">Founded </p>
                  <p> {companyDetail.desc[0].found}</p>
                </div>
              )}
            </div>
              {companyDetail.desc.length > 0 && companyDetail.desc[0].motto && (
                <div className="my-2">
                  <p className="font-semibold">Motto </p>
                  <p> {companyDetail.desc[0].motto}</p>
                </div>
              )}
          </div>
          
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;
