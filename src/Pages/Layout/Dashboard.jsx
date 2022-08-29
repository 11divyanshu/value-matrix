import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";
import OneSignal from "react-onesignal";

// Components
import JobDetails from "../UserDashboard/JobDetail.jsx";
import CandidateResumeForm from "../../Components/Dashbaord/CandidateForm.jsx";
import { dashboardRoutes } from "../../routes";
import HorizontalNav from "../../Components/Dashbaord/Navbar";
import Sidebar from "../../Components/Dashbaord/sidebar";
import {
  getProfileImage,
  getUserFromId,
  getUserIdFromToken,
} from "../../service/api";

const Dashboard = () => {
  let [comp, setComponent] = React.useState(null);
  let { component, id } = useParams();
  component = "/" + component;
  let [access_token, setAccessToken] = React.useState(null);
  let [user, setUser] = React.useState(null);
  let [profileImg, setProfileImg] = React.useState(null);
  let [userCheck, setUserCheck] = React.useState(false);

  // Form to get User details
  const [modalIsOpen, setModalIsOpen] = React.useState(true);

  React.useEffect(() => {
    OneSignal.init({
      appId: "91130518-13a8-4213-bf6c-36b55314829a",
      safari_web_id: "web.onesignal.auto.2cee7bb2-7604-4e25-b1d2-cbd521c730a5",
      notifyButton: {
        enable: true,
      },
    });
  }, []);

  // Set Access_Token And User to the Session Storage

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");

      // If Token is passed in the url
      if (term !== null && term !== undefined && term !== "null") {
        await localStorage.removeItem("access_token");
        access_token1 = term;
        await setAccessToken(term);
        await localStorage.setItem("access_token", term);

        await setAccessToken(access_token1);

        let user_id = await getUserIdFromToken({ access_token: access_token1 });
        let a = await localStorage.getItem("access_token");
        if (a === "null") {
          let u = JSON.parse(await localStorage.getItem("user"));
          await localStorage.setItem("access_token", u._id);
        }

        if (user_id) {
          let user = await getUserFromId(
            { id: user_id.data.user.user },
            access_token1
          );

          await setUser(user.data.user.user);
          if (user.profileImg) {
            let image = await getProfileImage(
              { id: user_id.data.user.user },
              access_token1
            );
            setProfileImg(image.data.Image);
            await localStorage.setItem(
              "profileImg",
              JSON.stringify(image.data.Image)
            );
          }
          if (
            user.data.user.access_valid === false ||
            user.data.user.user_type !== "User"
          )
            window.location.href = "/login";
          await localStorage.setItem("user", JSON.stringify(user.data.user));
          window.history.pushState({ url: "/user" }, "", "/user");
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = await localStorage.getItem("access_token");
        await setAccessToken(access_token);
        let user = JSON.parse(localStorage.getItem("user"));
        await setUser(user);

        if (user.access_valid === false || user.user_type !== "User") {
          window.location.href = "/login";
        }
      }
      let user = JSON.parse(localStorage.getItem("user"));
      console.log(user);
      let token = localStorage.getItem("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }
      if (user.tools.length === 0|| user.education === [] || user.association === [] ) {
        console.log("F")
        setModalIsOpen(true);
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        window.history.pushState({ path: "/user" }, "", "/user");
      }
    };
    func();
  }, [access_token]);

  // Get Component To Render from the URL Parameter
  React.useEffect(() => {
    if (component === null) {
      let c = dashboardRoutes.filter((route) => route.path === "");
      setComponent(c[0].component);
    } else {
      let c = dashboardRoutes.filter((route) => route.path === component);
      // console.log(c)
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");

        if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
        else {
          let c = dashboardRoutes.filter(
            (route) => route.path === component.split("/")[1]
          );

          if (c[0]) setComponent(c[0].component);
          else
            setComponent(
              dashboardRoutes.filter((route) => route.path === "")[0].component
            );
        }
      }
    }
  }, [component]);

  return (
    <div className="max-w-screen flex h-screen">
      {modalIsOpen && (
        <div>
          <CandidateResumeForm isOpen={true} setModalIsOpen={setModalIsOpen} />
        </div>
     )} 
      <div className="z-10 fixed h-screen">
        <Sidebar user={user} />
      </div>
      <div className="md:pl-16 pl-0 w-full z-1">
        <HorizontalNav user={user} />
        <div>{comp}</div>
      </div>
    </div>
  );
};

export default Dashboard;
