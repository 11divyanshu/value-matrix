import React from "react";
import { useParams } from "react-router-dom";
import { ReactSession } from "react-client-session";

// Components
import { adminDashboardRoutes } from "../../routes";
import Navbar from "../../Components/AdminDashboard/Navbar";
import Sidebar from "../../Components/AdminDashboard/Sidebar";
import { getUserFromId, getUserIdFromToken } from "../../service/api";
import jsCookie from "js-cookie";
import "../../assets/stylesheet/layout.scss"
import AdminUserProfile from "../AdminDashboard/AdminUserProfile.jsx";
import JobDetails from "../AdminDashboard/JobDetails.jsx";

const AdminDashboard = () => {
  // Component To Render
  let [comp, setComponent] = React.useState(null);
  let { component ,id } = useParams();
  component = "/" + component;
console.log(id)
  // Current User
  let [user, setUser] = React.useState(null);

  // Retrieve And Saves Access Token and User to Session
  const [access_token, setAccessToken] = React.useState(null);

  React.useEffect(() => {
    const tokenFunc = async () => {
      let access_token1 = null;
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term !== null && term !== undefined && term !== "null") {
        await localStorage.removeItem("access_token");
        access_token1 = term;
        await setAccessToken(term);
        await localStorage.setItem("access_token", term);

        let user_id = await getUserIdFromToken({ access_token: access_token1 });

        if (user_id) {
          let user = await getUserFromId(
            { id: user_id.data.user.user },
            access_token1
          );
          await setUser(user.data.user.user);
          if (user.data.user.access_valid === false) {
            window.location.href = "/login";
          }
          if (
            user.data.user.user_type === "Admin" ||
            user.data.user.user_type === "Admin_User" ||
            user.data.user.isAdmin
          ) {
            console.log("");
          } else {
            window.location.href = "/login";
          }
          await localStorage.setItem("user", JSON.stringify(user.data.user));
          // window.history.pushState({ url: "/admin" }, "", "/admin");
          window.location.href="/admin";
        } else {
          window.location.href = "/login";
        }
      } else {
        let access_token = await localStorage.getItem("access_token");
        let user = JSON.parse(await localStorage.getItem("user"));
        if (access_token === "null" || access_token === null)
          access_token = user.access_token;
        await localStorage.setItem("access_token", access_token);
        if (user.access_valid === false) window.location.href = "/login";
        if (
          user.user_type === "Admin" ||
          (user.user_type === "Admin_User" || user.isAdmin === true)
        )
          console.log("");
        else window.location.href = "/login";
        await setAccessToken(access_token);
        await setUser(user);
      }
      let user = JSON.parse(await localStorage.getItem("user"));
      let token = await localStorage.getItem("access_token");
      if (!user || !token) {
        window.location.href = "/login";
      }
    };

    const func = async () => {
      await tokenFunc();
      let location = window.location.search;
      const queryParams = new URLSearchParams(location);
      const term = queryParams.get("a");
      if (term) {
        // window.history.pushState({ path: "/admin" }, "", "/admin");
        window.location.href="/admin";
      }
    };
    func();
  }, [access_token]);
  React.useEffect(() => {
    if (!component || component === "/undefined") {
      setComponent(
        adminDashboardRoutes.filter((route) => route.path === "/")[0].component
      );
    } else {
      let c = adminDashboardRoutes.filter((route) => route.path === component);
      if (c[0]) setComponent(c[0].component);
      else {
        let c1 = component.split("/");
        console.log(c1);
        if (c1[1] === "AdminUserProfile") setComponent(<AdminUserProfile id={id} />);
        else if (c1[1] === "jobDetails") setComponent(<JobDetails id={id} />);
      else {
        let c = adminDashboardRoutes.filter(
          (route) => route.path === component.split("admin/")[1]
        );
        if (c.length >= 1 && c[0] && c[0] !== undefined) setComponent(c[0].component);
        else
          setComponent(
            adminDashboardRoutes.filter((route) => route.path === "/admin")[0]
              .component
          );
      }
    }
    
    }
  }, [component]);

  return (
    <div className="max-w-screen h-screen">
     <div className="w-full bg-white  fixed navbar">
        {" "}
        <Navbar user={user} />
      </div>

      <div className="flex w-full ">
        <Sidebar className="sidebarComponent">

        </Sidebar>
        <div className="justify-end ml-auto mt-20 panel2">{comp}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
