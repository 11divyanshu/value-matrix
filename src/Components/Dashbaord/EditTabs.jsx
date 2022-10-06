import React, { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import "../../assets/stylesheet/Tabs.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { IoPeople, IoSchoolOutline } from "react-icons/io5";
import Microsoft from "../../assets/images/Social/microsoft.svg";
import Google from "../../assets/images/Social/google.svg";
import Linkedin from "../../assets/images/Social/linkedin.svg";
import { Link } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineFolderAdd,
  AiOutlineUnorderedList,
  AiOutlineDelete,
  AiOutlineRead
} from "react-icons/ai";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Combobox } from "@headlessui/react";
import cities from "cities.json";

// Assets
import swal from "sweetalert";

import "react-multi-carousel/lib/styles.css";
// Components And API services
import {
  updateContactOTP,
  updateEmailOTP,
  updateUserDetails,
  validateSignupDetails,
  getDBCompanyList,
  getDBSchoolList,
  uploadCandidateResume,
  getCountryList,
  languagesList,
  checkCompany,
  getJobTitles
} from "../../service/api";
import ReactCropper from "../../Pages/UserDashboard/ReactCrop";
import Loader from "../../assets/images/loader.gif";

// Assets
import Avatar from "../../assets/images/UserAvatar.png";
import "react-image-crop/dist/ReactCrop.css";
export default function Tabs(props) {
  React.useEffect(() => {
    setEmailOTP(null);
    setContactOTP(null);
  }, []);
  // File Upload
  const [loading, setLoading] = React.useState(false);
  // States for the Page
  const [user, setUser] = React.useState(null);
  const [lastname, setLastname] = React.useState(null);
  const [firstname, setFirstname] = React.useState(null);
  const [houseNo, sethouseNo] = React.useState(null);
  const [street, setstreet] = React.useState(null);
  const [region, setregion] = React.useState(null);
  const [city, setcity] = React.useState(null);
  const [Addcountry, setAddCountry] = React.useState(null);
  const [zip, setzip] = React.useState(null);
  const [resume, setresume] = React.useState(null);
  const [access_token, setToken] = React.useState(null);
  const [language, setLanguage] = React.useState([]);

  const [skillsPrimary, setSkillsPrimary] = React.useState([]);
  const [rolesC, setCRoles] = React.useState([]);

  const [roles, setRoles] = React.useState([]);
  const [showRoles, setShowRoles] = React.useState([]);
  const [primarySkills, setPrimarySkills] = React.useState([]);
  const [secondarySkills, setSecondarySkills] = React.useState([]);
  const [prof, setProf] = React.useState([]);
  const [dbSkills, setDbSkills] = React.useState([]);
  const [rolesProf, setRolesProf] = React.useState([]);
  const [dbCopy, setDbCopy] = React.useState([]);

  const inputSkillRef = React.useRef(null);
  // Updates Any Error during the Editing Profile
  const [Error, setError] = React.useState(null);
  const [error, seterror] = React.useState(null);
  const [secEmail, setSecEmail] = React.useState([]);
  const [secContact, setSecContact] = React.useState([]);
  // City Autocomplete
  const [selectedCity, setSelectedCity] = React.useState(cities[103]);
  const [country, setSelectedCountry] = React.useState([]);
  const [selectedAddCity, setSelectedAddCity] = React.useState(cities[103]);
  const [query, setQuery] = React.useState("");
  const [Addquery, setAddQuery] = React.useState("");
  const filteredCity =
    query === ""
      ? cities.slice(0, 5)
      : cities
        .filter((city) => {
          return (
            city.country.toLowerCase().includes(query.toLowerCase()) ||
            city.name.toLowerCase().replace("ā", "a")
              .replace("ò", "o")
              .replace("à", "a").includes(query.toLowerCase())
          );
        })
        .slice(0, 5);
  const filteredAddCity =
    Addquery === ""
      ? cities.slice(0, 5)
      : cities
        .filter((Addcity) => {
          return (
            Addcity.country.toLowerCase().includes(Addquery.toLowerCase()) ||
            Addcity.name.toLowerCase().replace("ā", "a")
              .replace("ò", "o")
              .replace("à", "a").includes(Addquery.toLowerCase())
          );
        })
        .slice(0, 5);



  React.useEffect(() => {
    const initial = async () => {
      let res = await getDBCompanyList();
      setCompanyList(res.data);
      setExCompanyList(res.data);
      console.log(res.data);

      let languages = await languagesList();
      console.log(languages);
      setLanguage(languages.data);

      let title = await getJobTitles();
      console.log(title);
      setJobTitle(title.data);

      let country = await getCountryList();
      console.log(country);
      setSelectedCountry(country.data.countries[0].country);
    };
    initial();
  }, []);

  const [excompanyList, setExCompanyList] = React.useState([]);

  const [companyList, setCompanyList] = React.useState([]);
  const [selectedCompany, setSelectedCompany] = React.useState(null);
  const [companyQuery, setCompanyQuery] = React.useState("");
  const filteredCompany =
    companyQuery === ""
      ? companyList.slice(0, 10)
      : companyList
        .filter((company) =>
          company.name.toLowerCase().includes(companyQuery.toLowerCase())
        )
        .slice(0, 10);


  const [selectedExCompany, setSelectedExCompany] = React.useState(null);
  const [companyExQuery, setExCompanyQuery] = React.useState("");
  const filteredExCompany =
    companyExQuery === ""
      ? companyList.slice(0, 10)
      : companyList
        .filter((company) =>
          company.name.toLowerCase().includes(companyExQuery.toLowerCase())
        )
        .slice(0, 10);

  // console.log(filteredExCompany)


  React.useEffect(() => {
    const initial = async () => {
      let res = await getDBSchoolList();
      console.log(res);
      setSchoolList(res.data);
    };
    initial();
  }, []);


  const [schoolList, setSchoolList] = React.useState([]);
  const [selectedSchool, setSelectedSchool] = React.useState(null);
  const [schoolQuery, setSchoolQuery] = React.useState("");
  const filteredSchool =
    schoolQuery === ""
      ? schoolList.slice(0, 10)
      : schoolList
        .filter((school) =>
          school.name.toLowerCase().includes(schoolQuery.toLowerCase())
        )
        .slice(0, 10);


  const [JobTitle, setJobTitle] = React.useState([]);
  const [selectedTitle, setSelectedTitle] = React.useState(null);
  const [TitleQuery, setTitleQuery] = React.useState("");
  const filteredTitle =
    TitleQuery === ""
      ? JobTitle.slice(0, 10)
      : JobTitle
        .filter((title) =>
          title.name.toLowerCase().includes(TitleQuery.toLowerCase())
        )
        .slice(0, 10);


  // OTPs State
  const [EmailOTP, setEmailOTP] = React.useState(null);
  const [ContactOTP, setContactOTP] = React.useState(null);

  // Updates The Profile Picture
  const [ProfilePic, setProfilePic] = React.useState(undefined);

  const ModalBtnRef = React.useRef(null);
  const ModalRef = React.useRef(null);

  const [upImg, setUpImg] = React.useState(null);

  const [index, setIndex] = React.useState(0);
  const [profileImg, setProfileImg] = React.useState(null);

  //education
  const [educationalDetail, setEducationalDetail] = React.useState([]);

  const [showEduForm, setShowEduForm] = React.useState(false);

  const [edit, setEdit] = React.useState(null);
  const [showError, setShowError] = React.useState(true);
  const [present, setPresent] = React.useState(false);
  const [exPresent, setExPresent] = React.useState(false);
  const [asPresent, setAsPresent] = React.useState(false);

  const resetBtn = React.useRef(null);
  const [initialValues, setInitialValues] = React.useState({
    //education
    contact: null,
    email: null,
    houseNo: null,
    street: null,
    city: null,
    country: null,
    state: null,
    zip: null,
    //experience
  });
  const [eduinitialValues, setEduInitialValues] = React.useState({
    //education
    school: null,
    degree: null,
    field_of_study: null,
    start_date: null,
    end_date: null,
    grade: null,
    description: null,
    //experience
  });
  const [exinitialValues, setExInitialValues] = React.useState({
    title: null,
    employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

  // Experience
  const [experienceDetail, setExperienceDetail] = React.useState([]);
  const [showExForm, setShowExForm] = React.useState(false);

  //Association
  const [associateDetail, setAssociateDetail] = React.useState([]);
  const [showAsForm, setShowAsForm] = React.useState(false);

  const [asinitialValues, setAsInitialValues] = React.useState({
    title: null,
    // employment_type: "",
    company_name: null,
    location: null,
    start_date: null,
    end_date: null,
    industry: null,
    description: null,

    //experience
  });

  //Tools
  const [tools, setTools] = React.useState([]);
  const [ederror, setFormError] = React.useState(false);
  const [aserror, setAsFormError] = React.useState(false);
  const [exerror, setExFormError] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);

  const inputRef = React.useRef(null);

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState(null)

  //Langugage skills
  const [languageSkills, setLanguageSkills] = React.useState([]);
  const [showLsForm, setShowLsForm] = React.useState(false);
  const [lsinitialValues, setLsInitialValues] = React.useState({
    name: null,
    read: null,
    write: null,
    speak: null,

  });
  const [lserror, setLsFormError] = React.useState(false);


  const handleChange = async (e) => {
    setLoading(true);
    setError(null);
    if (e.target && e.target.files) {
      let user = JSON.parse(await localStorage.getItem("user"));
      let access_token = await localStorage.getItem("access_token");
      console.log(user, " ", access_token);
      let fd = new FormData();
      fd.append("user_id", user._id);
      fd.append("file", e.target.files[0]);

      let response = await uploadCandidateResume(fd, access_token);
      if (response && response.status === 200) {
        await setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        let res = await localStorage.getItem("candidateDetails");
        res = JSON.parse(res);
        res.resume = e.target.files[0].name;
        await localStorage.setItem("candidateDetails", JSON.stringify(res));
      } else {
        seterror("Error uploading file");
      }


      // Resume Parser
      var fileReader = new FileReader();
      var base64;
      // Onload of file read the file content
      let base64String = "";
      fileReader.onload = async function (fileLoadedEvent) {
        var modifiedDate = (new Date(fileLoadedEvent.lastModified)).toISOString().substring(0, 10);
        // base64 = Base64.encodeArray(fileLoadedEvent.target.result);
        base64 = fileLoadedEvent.target.result;
        base64String = base64;
        // let resumeResponse = await sovrenResumeParser({
        //   DocumentAsBase64String: base64,
        //   SkillsSettings: {
        //     Normalize: false,
        //     TaxonomyVersion: "",
        //   },
        //   ProfessionsSettings: {
        //     Normalize: false,
        //   },
        //   DocumentLastModified : modifiedDate,
        // });
        // console.log(resumeResponse);
      };
      await fileReader.readAsDataURL(e.target.files[0]);
      setLoading(false);
      e.target.files = null;
    }
  };

  React.useEffect(() => {
    const initial = async () => {
      console.log("in user");
      let e = JSON.parse(await localStorage.getItem("user"));
      let resume = JSON.parse(await localStorage.getItem("resumeInfo"));
      // console.log(resume.data);
      setUser(e);
      if (resume) {
       console.log(resume.data);

        setSecContact(resume.secondaryContacts)
        setSecEmail(resume.secondaryEmails)
        if (resume.data === null) return null;
        // setUsername(resume.data.userna)
        let ed = resume.data.education;
        //console.log(ed);
        if (ed !== "null" || ed !== null) {
          setEducationalDetail(ed);
        }
        if (ed === null) {
          setEducationalDetail([]);
        }
        let ex = resume.data.experience;
        // console.log(ex);
        if (ex !== "null" || ex !== null) {
          setExperienceDetail(ex);
        }
        if (ex === null) {
          setExperienceDetail([]);
        }

        let as = resume.data.associate;
        //console.log(as);
        if (as !== "null" || as !== null) {
          setAssociateDetail(as);
        }
        if (as === null) {
          setAssociateDetail([]);
        }
        let ls = resume.data.language;
        //console.log(ls);
        if (ls !== "null" || ls !== null) {
          setLanguageSkills(ls);
        }
        if (ls === null) {
          setLanguageSkills([]);
        }

        if (resume.data.firstName) {
          setFirstname(resume.data.firstName);
          e.firstName = resume.data.firstName;
        }
        if (resume.data.lastName) {
          setLastname(resume.data.lastName);
          e.lastName = resume.data.lastName;

        }
        if (resume.data.email) {
          e.email = resume.data.email;
        }
        if (resume.data.contact) {
          e.contact = resume.data.contact;

        }
        if (resume.data.houseNo) {
          sethouseNo(resume.data.houseNo);
          e.houseNo = resume.data.houseNo;

        }
        if (resume.data.street) {
          setstreet(resume.data.street);
          e.street = resume.data.street;

        }
        if (resume.data.city) {
          setSelectedAddCity(resume.data.city);
          e.city = resume.data.city;

        }
        if (resume.data.state) {
          setregion(resume.data.state);
          e.state = resume.data.state;

        }
        if (resume.data.country) {
          setAddCountry(resume.data.country);
          e.country = resume.data.country;

        }
        if (resume.data.zip) {
          setzip(resume.data.zip);
          e.zip = resume.data.zip;

        }
        if (resume.data.secondaryEmails) {
          setSecEmail(resume.data.secondaryEmails);
          e.secondaryEmails = resume.data.secondaryEmails;

        }
        if (resume.data.secondaryContacts) {
          setSecContact(resume.data.secondaryContacts);
          e.secondaryContacts = resume.data.secondaryContacts;

        }
        if (resume.data.resume) {
          setresume(resume.data.resume);
          e.resume = resume.data.resume;

        }

       

        setUser(e);
        console.log(e);
      } else{



        console.log("true user")

        setSecContact(e.secondaryContacts)
        setSecEmail(e.secondaryEmails)
        if (e === null) return null;
        let ed = e.education;
        console.log(ed);
        if (ed !== "null" || ed !== null) {
          setEducationalDetail(ed);
        }
        if (ed === null) {
          setEducationalDetail([]);
        }
        let ex = e.experience;
        console.log(ex);
        if (ex !== "null" || ex !== null) {
          setExperienceDetail(ex);
        }
        if (ex === null) {
          setExperienceDetail([]);
        }

        let as = e.associate;
        console.log(as);
        if (as !== "null" || as !== null) {
          setAssociateDetail(as);
        }
        if (as === null) {
          setAssociateDetail([]);
        }
        let ls = e.language;
        console.log(ls);
        if (ls !== "null" || ls !== null) {
          setLanguageSkills(ls);
        }
        if (ls === null) {
          setLanguageSkills([]);
        }
        let et = e.tools;
        if (et !== "null" || et !== null) {
          setTools(et);
        }
        if (et === null) {
          setTools([]);
        }
        let primarySkills = {};
        let roles = new Set([]);
        e.tools.forEach((skill) => {
          roles.add(skill.role);
          if (primarySkills[skill.role]) {
            primarySkills[skill.role].add(skill.primarySkill);
          } else {
            primarySkills[skill.role] = new Set([skill.primarySkill]);
          }
        });
        setCRoles(Array.from(roles));

        Array.from(roles).map((el) => {
          primarySkills[el] = Array.from(primarySkills[el]);
        });
        setSkillsPrimary(primarySkills);

      }

    }

    initial();
  }, []);

  const updateEducation = async (values) => {
    console.log(ederror);
    if (!ederror) {
      let e = JSON.parse(await localStorage.getItem("user"));
      if (edit !== null) {
        const temp = [...educationalDetail];
        let school = selectedSchool;
        temp[edit] = { ...values, school: school, Ispresent: present };
        await setEducationalDetail(temp);
        await setEdit(null);
        resetBtn.current.click();
        e.education = temp;
        setUser(e);
        await localStorage.setItem("user", JSON.stringify(e));

        return;
      }
      let temp = educationalDetail;
      let school = selectedSchool;

      temp = [...educationalDetail, { ...values, school: school, Ispresent: present }];
      await setEducationalDetail(temp);
      e.education = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setEduInitialValues({
        school: null,
        degree: null,
        field_of_study: null,
        start_date: null,
        end_date: null,
        grade: null,
        description: null,
      });
      setSelectedSchool(null);
      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

  };



  const updateExperience = async (values) => {
    if (!exerror) {
      let e = JSON.parse(await localStorage.getItem("user"));
      if (edit !== null) {
        let city = selectedCity;
        if (selectedCity.name) {
          city = selectedCity.name + ", " + selectedCity.country;

        }
        let company = selectedCompany;
        let title = selectedTitle;
        const temp = [...experienceDetail];
        temp[edit] = { ...values, location: city, company_name: company, Ispresent: exPresent, title: title };
        await setExperienceDetail(temp);
        e.experience = temp;
        setUser(e);
        await localStorage.setItem("user", JSON.stringify(e));
        await setEdit(null);
        resetBtn.current.click();
        return;
      }
      let city = selectedCity;
      if (selectedCity.name) {
        city = selectedCity.name + ", " + selectedCity.country;
      }
      let company = selectedCompany;
      let title = selectedTitle;

      let temp = experienceDetail;
      temp = [...experienceDetail, { ...values, location: city, company_name: company, Ispresent: exPresent, title: title }];
      await setExperienceDetail(temp);
      e.experience = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setExInitialValues({
        title: null,
        employment_type: "",
        company_name: null,
        location: null,
        start_date: null,
        end_date: null,
        industry: null,
        description: null,
      });
      setSelectedCompany(null);
      setSelectedTitle(null);
      setSelectedCity(null);
      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

  };
  const updateLanguage = async (values) => {
    console.log(values);
    if (!lserror) {
      let e = JSON.parse(await localStorage.getItem("user"));
      if (edit !== null) {
        const temp = [...languageSkills];
        temp[edit] = { ...values };
        await setLanguageSkills(temp);
        e.language = temp;
        setUser(e);
        console.log(e);
        await localStorage.setItem("user", JSON.stringify(e));
        await setEdit(null);
        resetBtn.current.click();
        return;
      }


      let temp = languageSkills;
      temp = languageSkills ? [...languageSkills, { ...values }] : [{ ...values }];
      await setLanguageSkills(temp);

      e.language = temp;
      console.log(e)
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setLsInitialValues({
        name: null,
        read: null,
        write: null,
        speak: null,
      });
      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

  };

  const updateAssociation = async (values) => {
    if (!aserror) {
      let e = JSON.parse(await localStorage.getItem("user"));
      if (edit !== null) {
        const temp = [...associateDetail];
        let company = selectedCompany;
        let title = selectedTitle;

        temp[edit] = { ...values, location: selectedCity, company_name: company, Ispresent: asPresent, title: title };
        await setAssociateDetail(temp);
        e.associate = temp;
        setUser(e);
        await localStorage.setItem("user", JSON.stringify(e));
        await setEdit(null);
        setSelectedTitle(null);

        resetBtn.current.click();
        return;
      }
      let company = selectedCompany;
      let title = selectedTitle;

      let temp = associateDetail;
      temp
        ? (temp = [...associateDetail, { ...values, location: selectedCity, company_name: company, Ispresent: asPresent, title: title }])
        : (temp = [{ ...values, location: selectedCity, company_name: company, Ispresent: asPresent, title: title }]);
      await setAssociateDetail(temp);
      e.associate = temp;
      setUser(e);
      await localStorage.setItem("user", JSON.stringify(e));
      await setAsInitialValues({
        title: null,

        company_name: null,
        location: null,
        start_date: null,
        end_date: null,
        industry: null,
        description: null,
      });
      setSelectedCompany(null);
      setSelectedTitle(null);

      resetBtn.current.click();
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }
    // else {
    //   swal({
    //     icon: "error",
    //     title: "EditProfile",
    //     text: "Something Went Wrong",
    //     button: "Continue",
    //   });
    // }
  };

  const save = async (values) => {
    console.log(values);
    let wait = 0;
    if (values.firstName) {
      if (EmailOTP === null && ContactOTP === null)
        wait = await SendOTPFunction(values);
      if (wait !== 0) return;
      console.log("values");
      if (EmailOTP && ContactOTP) {
        if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
          setError("Invalid Email OTP and Contact OTP");
          return;
        }
      }

      if (EmailOTP && values.emailOTP !== EmailOTP) {
        setError("Invalid Email OTP");
        return;
      }

      if (ContactOTP && values.contactOTP !== ContactOTP) {
        setError("Invalid Contact OTP");
        return;
      }
      let city = selectedAddCity;
      let e = user;
      if (selectedAddCity.name) {
        city = selectedAddCity.name;
        e.city = city;
        setUser(e);
      }
      setFirstname(values.firstName)
      setLastname(values.lastName)
      if (values.country) {

        e.country = values.country;
        setUser(e);
      }
      user.username = values.username;
      user.firstName = values.firstName;
      user.lastname = values.lastName;
      user.houseNo = values.houseNo;
      user.street = values.street;
      user.city = city;
      user.country = values.country;
      user.state = values.state;
      user.zip = values.zip;
      user.contact = values.contact;
      user.secondaryContacts = secContact;
      user.secondaryEmails = secEmail;
      user.resume = resume;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      swal({
        icon: "success",
        title: "EditProfile",
        text: "Details Saved",
        button: "Continue",
      });
    }

    // if (values.about) {
    //   // user.desc[0] = values;
    //   // console.log(user);
    //   // setUser(user);
    //   // localStorage.setItem("user", JSON.stringify(user));
    //   let e = JSON.parse(
    //     await localStorage.getItem("user")
    //   );
    //   const temp = [...user.desc];
    //   temp[0] = values;
    //   console.log(temp)
    //   e.desc = temp;
    //   update(e);
    //   await localStorage.setItem(
    //     "user",
    //     JSON.stringify(e)
    //   );
    //   await setAboutDetail(temp);

    //   // e.about = temp;

    //   // await props.setUser({
    //   //   desc: temp,
    //   //   ...props.user,
    //   // });

    //   // await localStorage.setItem("user", JSON.stringify(user));
    //   // return;
    // }
  };

  // const submit = async (values) => {
  //   console.log("values");
  //   let wait = 0;
  //   if (EmailOTP === null && ContactOTP === null)
  //     wait = await SendOTPFunction(values);
  //   if (wait !== 0) return;
  //   console.log("values");
  //   if (EmailOTP && ContactOTP) {
  //     if (values.emailOTP !== EmailOTP && values.contactOTP !== ContactOTP) {
  //       setError("Invalid Email OTP and Contact OTP");
  //       return;
  //     }
  //   }
  //   console.log("values");
  //   if (EmailOTP && values.emailOTP !== EmailOTP) {
  //     setError("Invalid Email OTP");
  //     return;
  //   }
  //   console.log("values");
  //   if (ContactOTP && values.contactOTP !== ContactOTP) {
  //     setError("Invalid Contact OTP");
  //     return;
  //   }
  //   console.log("values");
  //   update(user);
  // };

  const SendOTPFunction = async (values) => {
    let wait = 0;
    if (values.email !== user.email) {
      let emailValidate = await validateSignupDetails({ email: values.email });
      if (emailValidate.data.email === true) {
        setError("Email Already Registered");
        return 1;
      }
      let res = await updateEmailOTP(
        { mail: values.email },
        { access_token: access_token }
      );
      if (res.otp) {
        setEmailOTP(res.otp);
        wait = 1;
      } else if (res.Error) {
        setError(res.Error);
      }
    }
    if (values.contact !== user.contact) {
      let contactValidate = await validateSignupDetails({
        contact: values.contact,
      });
      if (contactValidate.data.contact === true) {
        setError("Contact Already Registered");
        return 1;
      }
      let res2 = await updateContactOTP(
        { contact: values.contact },
        { access_token: access_token }
      );
      if (res2.otp) {
        setContactOTP(res2.otp);
        wait = 1;
      } else if (res2.Error) {
        setError(res2.Error);
      }
    }
    console.log(wait);
    return wait;
  };

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await localStorage.getItem("user"));
      let p = JSON.parse(await localStorage.getItem("prof"));
      let pr1 = JSON.parse(await localStorage.getItem("RolesProf"));
      let res = await getSkills({ user_id: user._id }, user.access_token);
      let roles = new Set();
      let pSkills = {};
      if (res && res.status === 200) {
        await res.data.map((el) => {
          el.proficiency = 0;
          roles.add(el.role);
          if (pSkills[el.role]) {
            pSkills[el.role].add(el.primarySkill);
          } else {
            pSkills[el.role] = new Set([el.primarySkill]);
          }
          return null;
        });
        let pr = new Array(res.data.length).fill(0);
        if (!pr1) pr1 = new Array(roles.size).fill(0);

        if (user.tools.length > 0) {
          await user.tools.forEach(async (skill) => {
            let index = res.data.findIndex(
              (el) =>
                el.primarySkill === skill.primarySkill &&
                el.role === skill.role &&
                el.secondarySkill === skill.secondarySkill
            );
            pr[index] = skill.proficiency;
          });
          await setProf([...pr]);
        } else if (p) {
          await setProf(p);
        } else {
          await setProf(pr);
        }

        await setRolesProf(pr1);
        await setShowRoles(Array.from(roles));
        await setRoles(Array.from(roles));
        await setDbSkills(res.data);
        await setPrimarySkills(pSkills);
        Array.from(roles).map((el) => {
          pSkills[el] = Array.from(pSkills[el]);
        });
      }
    };
    initial();
  }, []);

  const update = async (ed) => {
    let skills = [];

    dbSkills.forEach((el, index) => {
      if (prof[index] > 0) {
        el.proficiency = prof[index];
        skills.push(el);
      }
    });
    let skillData;
    if (skills) {
      skillData = skills;
    } else {
      skillData = user.tools;
    }
    console.log(skillData)

    // let user = JSON.parse(localStorage.getItem("user"));
    // await setExperienceDetail(temp);


    let data = {
      firstName: ed.firstName,
      lastname: ed.lastname,
      houseNo: ed.houseNo,
      street: ed.street,
      city: ed.city,
      country: ed.country,
      state: ed.state,
      zip: ed.zip,
      experience: experienceDetail,
      username: ed.username,
      associate: associateDetail,
      education: educationalDetail,
      language: languageSkills,
      tools: skillData,
      secondaryContacts: secContact,
      secondaryEmails: secEmail,
      resume: resume,
    };
    if (EmailOTP) {
      data.email = ed.email;
    }
    if (ContactOTP) {
      data.contact = ed.contact;
    }
    console.log(data);
    let res = await updateUserDetails(
      { user_id: user._id, updates: data },
      { access_token: access_token }
    );

    if (res.data.Error) {
      if (res.data.contact) {
        setError(res.data.Error);
        return;
      }
      if (res.data.email) {
        setError(res.data.Error);
        return;
      }
    } else if (res) {
      await localStorage.setItem("user", JSON.stringify(res.data.user));
      await localStorage.removeItem("prof");
      await localStorage.removeItem("RolesProf");
      await localStorage.removeItem("resumeInfo");
    } else {
      console.log("Error");
    }

    swal({
      icon: "success",
      title: "EditProfile",
      text: "Details Updated Succesfully",
      button: "Continue",
    }).then(() => {
      window.location.href = "/user/profile";

    })
  };

  // React.useEffect(() => {
  //   const initial = async () => {
  //     let access_token1 = await localStorage.getItem("access_token");
  //     let user = JSON.parse(await localStorage.getItem("user"));
  //     if (access_token1 === "null" || access_token === "undefined")
  //       await localStorage.setItem("access_token", user.access_token);
  //     // if (user && user.profileImg) {
  //     //   let image = JSON.parse(await localStorage.getItem("profileImg"));
  //     //   console.log(image);
  //     //   let base64string = btoa(
  //     //     String.fromCharCode(...new Uint8Array(image.data))
  //     //   );
  //     //   let src = `data:image/png;base64,${base64string}`;
  //     //   await setProfilePic(src);
  //     // }
  //     console.log(user);
  //     await setUser(user);
  //     await setToken(access_token1);
  //   };
  //   initial();
  // }, []);

  return (
    <div className="Tabs w-full mt-3">
      <div className="tabList flex w-full">
        <div
          className={`tabHead ${index === 0 && "active"}`}
          onClick={() => {
            setIndex(0);
          }}
        >
          <p className="lg:visible hidden content">Contact</p>
          <p className="icons hidden">
            <AiOutlineHome />
          </p>
        </div>
        <div
          className={`tabHead ${index === 1 && "active"}`}
          onClick={() => {
            setIndex(1);
          }}
        >
          <p className="lg:visible hidden content">Education</p>
          <p className="icons hidden">
            <IoSchoolOutline />
          </p>
        </div>
        <div
          className={`tabHead ${index === 2 && "active"}`}
          onClick={() => {
            setIndex(2);
          }}
        >
          <p className="lg:visible hidden content">Experience</p>
          <p className="icons hidden">
            <CgWorkAlt />
          </p>
        </div>
        <div
          className={`tabHead ${index === 3 && "active"}`}
          onClick={() => {
            setIndex(3);
          }}
        >
          <p className="lg:visible hidden content">Association</p>
          <p className="icons hidden">
            <HiOutlineOfficeBuilding />
          </p>
        </div>
        <div
          className={`tabHead ${index === 4 && "active"}`}
          onClick={() => {
            setIndex(4);
          }}
        >
          <p className="md:visible hidden content">Skills</p>
          <p className="icons hidden">
            <AiOutlineUnorderedList />
          </p>
        </div>
      </div>
      <div className="tabContent bg-white  w-full p-5" hidden={index != 0}>
        {user !== null && user !== undefined && (
          <Formik
            initialValues={{
              username: user.username,
              firstName: user.firstName,
              email: user.email ? user.email : " ",
              contact: user.contact
                ? [
                  user.googleId,
                  user.microsoftId,
                  user.linkedInId,
                  user.username,
                  user.githubId,
                ].includes(user.contact)
                  ? " "
                  : user.contact
                : " ",
              emailOTP: "",
              contactOTP: "",
              houseNo: user.houseNo,
              street: user.street,
              city: user.city,
              country: user.country,
              state: user.state,
              zip: user.zip,
            }}
            onSubmit={(values) => save(values)}
            validate={async (values) => {
              const errors = {};
              if (values.username !== user.username) {
                let check = await validateSignupDetails({
                  username: values.username,
                });
                console.log(check);
                if (check.data.username) {
                  errors.username = "Username already exists";
                }
              }
              if (!values.firstName) {
                errors.firstName = "Required";
              }
              if (!values.email) {
                errors.email = "Required";
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = "Invalid Email Address";
              }
              if (!values.contact) {
                errors.contact = "Required";
              } else if (
                !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
                  values.contact
                )
              ) {
                errors.contact = "Invalid Contact Number";
              }
              return errors;
            }}
          >
            {({ values }) => (
              <Form>
                {/* <p className="md:w-1/2  flex w-full  space-y-1 my-5">
                <span className="font-semibold text-lg w-2/5 mx-2"> Username :</span>{" "}
                {user.username}{" "}
              </p> */}

                <div className="flex flex-wrap mt-2 w-full gap-y-5">
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Username
                    </label>
                    <div className="w-full">
                      <Field
                        type="text"
                        name="username"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                        className="block border-gray-200 py-1 w-full"

                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Name
                    </label>
                    <div className="w-full">
                      <Field
                        type="text"
                        name="firstName"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                        className="block border-gray-200 py-1 w-full"

                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    {/* <label className="font-semibold text-lg w-2/5 mx-2">
                                    Work Period{" "}
                                  </label> */}

                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Address
                    </label>
                    <div className="w-full">
                      <div
                        className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 mr-2 md:mr-0 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2 align-middle">
                          <label className="font-semibold text-md py-2">
                            House/ Flat No.
                          </label>
                          <div className="">
                            <Field
                              name="houseNo"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              value={values.houseNo}
                            />
                            <ErrorMessage
                              name="houseNo"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2  md:mx-0 align-middle">
                          <label className="font-semibold text-md ml-0 lg:ml-5 py-2">
                            Street
                          </label>
                          <div className="">
                            <Field
                              name="street"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"

                              value={values.street}
                            />

                            <ErrorMessage
                              name="street"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2  align-middle">
                          <label className="font-semibold text-md py-2">
                            City
                          </label>
                          <div className="">

                            <p>
                              Current Location :{" "}
                              {values.city ? `${values.city}` : ""}
                            </p>

                            {/* <Field
                                      name="location"
                                      type="text"
                                      placeholder="Ex. London"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.location}
                                    /> */}
                            <Combobox
                              value={selectedAddCity}
                              onChange={setSelectedAddCity}
                            >
                              <Combobox.Input
                                onChange={(event) =>
                                  setAddQuery(event.target.value)
                                }
                                className="border-[0.5px] rounded-lg w-full  border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                style={{ borderRadius: "5px" }}
                              />
                              <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                {Addquery.length > 0 && (
                                  <Combobox.Option className="p-2" value={`${Addquery}`}>
                                    Create "{Addquery}"
                                  </Combobox.Option>
                                )}
                                {filteredAddCity.map((city) => (
                                  <Combobox.Option
                                    key={city.name}
                                    value={`${city.name.replace("ā", "a")
                                      .replace("ò", "o")
                                      .replace("à", "a")},`}
                                  >
                                    {({ active, selected }) => (
                                      <li
                                        className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                          }`}
                                      >
                                        {city.name.replace("ā", "a")
                                          .replace("ò", "o")
                                          .replace("à", "a")}
                                      </li>
                                    )}

                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            </Combobox>

                            <ErrorMessage
                              name="city"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2  md:mx-0 align-middle">
                          <label className="font-semibold text-md py-2 ml-0 lg:ml-5">
                            State/Region
                          </label>
                          <div className="">
                            <Field
                              name="state"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"

                              value={values.state}
                            />

                            <ErrorMessage
                              name="state"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 gap-2 mb-6 lg:grid-cols-2 md:w-full"
                        style={{ justifyContent: "space-between" }}
                      >
                        <div className=" grid grid-cols-1 lg:grid-cols-2  ml-3 md:mx-0  align-middle">
                          <label className="font-semibold text-md py-2">
                            Country
                          </label>
                          <div className="">
                            <Field
                              component="select"
                              id="country"
                              name="country"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"
                              value={values.country}
                              multiple={false}
                            >
                              {country &&
                                country.map((item) => {
                                  return (
                                    <option value={item.name}>{item.name}</option>
                                  );
                                })}
                            </Field>

                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 md:mx-0  align-middle">
                          <label className="font-semibold text-md py-2 ml-0 lg:ml-5">
                            Zip Code
                          </label>
                          <div className="">
                            <Field
                              name="zip"
                              type="text"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 w-full"

                              value={values.zip}
                            />

                            <ErrorMessage
                              name="zip"
                              component="div"
                              className="text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Email
                    </label>
                    <div className="w-full">
                      <Field
                        name="email"
                        type="text"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                        className="block border-gray-200 py-1 w-full"

                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Contact
                    </label>
                    <div className="w-full">
                      <Field
                        name="contact"
                        type="text"
                        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                        className="block border-gray-200 py-1 w-full"

                      />
                      <ErrorMessage
                        name="contact"
                        component="div"
                        className="text-sm text-red-600"
                      />
                    </div>
                  </div>
                  {EmailOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Email OTP
                      </label>
                      <Field
                        name="emailOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}
                  {ContactOTP && (
                    <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                      <label className="font-semibold text-lg md:w-2/5 mx-2">
                        Contact OTP
                      </label>
                      <Field
                        name="contactOTP"
                        type="text"
                        className="block border-gray-400 py-1 md:w-5/6 sm:w-full mx-2"
                      />
                    </div>
                  )}

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Secondary Emails
                    </label>
                    <div className="w-full">
                      {secEmail && secEmail.map((item, index) => {

                        return (
                          <div
                            className="w-full flex items-center"
                            style={{ borderRadius: "12px" }}
                          >
                            <input
                              value={item}
                              type="text"
                              disabled
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-2 w-full"

                            // style={{
                            //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                            //   border: "none",
                            // }}
                            />
                            <div className="relative flex items-center">

                              <p
                                className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3"




                              >
                                <AiOutlineDelete
                                  onClick={async () => {
                                    setSecEmail(
                                      secEmail.filter((item, i) => i !== index)
                                    );
                                    let res = JSON.parse(await localStorage.getItem("user"));
                                    res.secondaryEmails = secEmail.filter(
                                      (item, i) => i !== index
                                    );
                                    setUser(res);
                                    localStorage.setItem("user", JSON.stringify(res));
                                  }}
                                  className="text-xl" />
                              </p>

                            </div>
                          </div>
                        )
                      })}
                    </div>

                  </div>
                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Secondary Contacts
                    </label>
                    <div className=" w-full">
                      {secContact && secContact.map((item, index) => {
                        return (
                          <div
                            className="w-full flex items-center"
                            style={{ borderRadius: "12px" }}
                          >
                            <input
                              value={item}
                              type="text"
                              disabled
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-2 w-full"

                            // style={{
                            //                           boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',

                            //   border: "none",
                            // }}
                            />
                            <div className="relative flex items-center">

                              <p
                                className="text-black text-sm hover:text-blue-500 cursor-pointer w-10 px-2 font-semibold  absolute right-3"




                              >
                                <AiOutlineDelete
                                  onClick={async () => {
                                    setSecContact(
                                      secContact.filter((item, i) => i !== index)
                                    );
                                    let res = JSON.parse(await localStorage.getItem("user"));
                                    res.secondaryContacts = secContact.filter(
                                      (item, i) => i !== index
                                    );
                                    setUser(res);
                                    localStorage.setItem("user", JSON.stringify(res));
                                  }}
                                  className="text-xl" />
                              </p>

                            </div>

                          </div>
                        )
                      })}
                    </div>

                  </div>

                  <div className="md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                    <label className="font-semibold text-lg md:w-2/5 mx-2">
                      Connect Social Account
                      {/* <p className="text-sm mx-2 text-gray-500">Connect Account Associated With Provided Email Address Only !</p> */}
                    </label>
                    {user && !user.linkedInId ? (
                      <div className="w-4/5 flex items-center px-4">

                        <a href={`${url}/auth/linkedin`}>
                          {/* <button className=" color-white py-2 px-8 flex rounded-lg"
                            style={{ backgroundColor: "#034488" }}
                          > */}
                          {/* <img
                              src={Linkedin}
                              className="h-5 ml-1"
                              alt="socialauthLinkedIn"
                            /> */}
                          <div className="flex rounded-lg shadow-md px-8 py-2" style={{ backgroundColor: "#034488" }}>
                            <p className="text-lg py-1" style={{ color: "#fff" }}>
                              <BsLinkedin />
                            </p>

                            <p className="text-white font-semibold mx-2">LinkedIn</p>
                          </div>
                          {/* </button> */}
                        </a>
                      </div>

                    ) : <p className="w-4/5 flex items-center px-4 text-green-600 font-semibold">Connected</p>}
                    {Error && <p className="text-sm text-red-500">{Error}</p>}
                  </div>
                </div>

                <div className="w-full text-center">
                  <button
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#034488" }}
                    type="submit"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    className="bg-blue-500 px-4 mx-2 py-2 text-white rounded-lg my-5"
                    style={{ backgroundColor: "#034488" }}
                    onClick={() => update(user)}
                  >
                    Submit
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 1}>
        {user !== null &&
          user !== undefined &&
          educationalDetail.map((item, index) => {
            return (
              <div
                className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 w-full "
                key={index}
              >
                <div className="flex justify-end space-x-3 items-center">
                  {/* <RiEditBoxLine
                    className="cursor-pointer"
                    onClick={() => {
                      setEdit(index);
                      setEduInitialValues(item);
                      setShowEduForm(true);
                    }}
                  /> */}

                </div>
                <p className="font-semibold text-md md:w-2/5 ">{item.school}</p>
                <div className="grid grid-cols-1 md:gap-2 gap-0 lg:grid-cols-4 align-items-right">
                  <div className="flex my-2 space-x-2 text-sm items-center">
                    <FiInfo />
                    <p>{item.degree}</p> <p>|</p> <p>{item.field_of_study}</p>
                  </div>
                  {item.grade != "" ? (
                    <div className="space-x-2 my-2 flex items-center">
                      <GrScorecard /> <p>{item.grade}</p>
                    </div>
                  ) : <div className="space-x-2 my-2 flex items-center">
                    <GrScorecard /> <p>0</p>
                  </div>}
                  <div className="flex items-center my-2 space-x-2">
                    <BsCalendar />
                    <p className="text-sm text-gray-600 mr-5">
                      {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                    </p>
                  </div>
                  <div className="flex text-right mr-auto space-x-2 justify-end">
                    <button
                      className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded ml-auto content-end"
                      style={{ backgroundColor: "#034488" }}
                      onClick={() => {
                        setEdit(index);
                        setEduInitialValues(item);
                        setSelectedCity(cities[0]);
                        setShowEduForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <div className="text-xl mx-5 px-7 py-2">
                      <AiOutlineDelete
                        className="text-red-600 cursor-pointer"
                        onClick={async () => {
                          setEducationalDetail(
                            educationalDetail.filter((item, i) => i !== index)
                          );
                          let res = JSON.parse(await localStorage.getItem("user"));
                          res.education = educationalDetail.filter(
                            (item, i) => i !== index
                          );
                          setUser(res);
                          localStorage.setItem("user", JSON.stringify(res));
                        }}
                      /></div>
                  </div>
                </div>
              </div>
            );
          })}
        <div className="flex mx-auto justify-center text-center">
          <button
            className=" py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
            style={{ backgroundColor: "#034488" }}
            onClick={async () => {
              await setShowError(true);

              await setEduInitialValues({
                school: null,
                degree: null,
                field_of_study: null,
                start_date: null,
                end_date: null,
                grade: null,
                description: null,
              });
              await setShowEduForm(true);
            }}
          >
            Add Education
          </button>

          <button
            className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
            style={{ backgroundColor: "#034488" }}
            onClick={() => update(user)}
          >
            Submit
          </button>
        </div>
        {showEduForm && (
          <Transition
            appear
            show={showEduForm}
            as={Fragment}
            className="relative z-1050 w-full"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-1050 w-5/6"
              onClose={() => { }}
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

              <div className="fixed inset-0 overflow-y-auto ">
                <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                      <div className={`${!showEduForm ? "hidden" : "block"}`}>
                        {/* <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-5">
                          Add Education
                        </p> */}
                        <Formik
                          initialValues={eduinitialValues}
                          validate={(values) => {
                            if (showEduForm === false) return {};
                            const errors = {};
                            if (!selectedSchool || selectedSchool === " ") {
                              errors.school = "Required";
                            }
                            if (
                              values.degree === null ||
                              values.degree.trim() === ""
                            ) {
                              errors.degree = "Required !";
                            }
                            if (
                              values.field_of_study === null ||
                              values.field_of_study.trim() === ""
                            ) {
                              errors.field_of_study = "Required !";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "Required !";
                            }
                            if (!present && values.end_date === null) {
                              errors.end_date = "Required !";
                            }

                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (!present && values.start_date > values.end_date) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }
                            if (values.grade === null) {
                              errors.grade = "Required !";
                            }
                            console.log(errors);
                            if (
                              errors.degree ||
                              errors.field_of_study ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.grade
                            ) {
                              setFormError(true);
                            } else {
                              setFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    School{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    {/* <Field
                                      name="school"
                                      type="text"
                                      placeholder="Ex. Boston University"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.school}
                                    /> */}
                                    {edit !== null && (
                                      <p>Current University : {values.school}</p>
                                    )}
                                    <Combobox
                                      value={selectedSchool}
                                      onChange={setSelectedSchool}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setSchoolQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {schoolQuery.length > 0 && (
                                          <Combobox.Option
                                            value={`${schoolQuery}`}
                                            className="cursor-pointer p-2"
                                          >
                                            Create "{schoolQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredSchool.map((school) => (
                                          <Combobox.Option
                                            key={school.name}
                                            value={`${school.name}`}
                                            className="cursor-pointer"
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >


                                                {school.name}
                                              </li>)}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="school"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Degree{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="degree"
                                      type="text"
                                      placeholder="Ex. Bachelor's"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.degree}
                                    />
                                    <ErrorMessage
                                      name="degree"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Field{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="field_of_study"
                                      type="text"
                                      placeholder="Ex. Business"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.field_of_study}
                                    />
                                    <ErrorMessage
                                      name="field_of_study"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  {/* <label className="font-semibold text-lg w-2/5 mx-2">
                                    Work Period{" "}
                                  </label> */}

                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Study Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          maxDate={new Date().toString()}
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>

                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div >
                                        {!present &&
                                          (<div className="">
                                            <Field
                                              name="end_date"
                                              type="month"
                                              className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                              style={{
                                                borderRadius: "4px",
                                                border: "0.5px solid",
                                              }}
                                              value={values.end_date}
                                            />

                                            <ErrorMessage
                                              name="end_date"
                                              component="div"
                                              className="text-sm text-red-600"
                                            />
                                          </div>)
                                        }


                                        <div className="mx-3 my-2">

                                          <input type="checkbox" id="myCheck"
                                            onChange={(e) => {
                                              // var checkBox = document.getElementById("myCheck");

                                              if (e.target.checked == true) {
                                                setPresent(true);
                                              } else {
                                                setPresent(false);

                                              }
                                            }}


                                          />
                                          <label className="font-semibold text-md ml-2 py-2">
                                            Present
                                          </label>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Grade
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="grade"
                                      type="text"
                                      className="block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.grade}
                                    />
                                    <ErrorMessage
                                      name="grade"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full justify-between space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-2 w-full h-20 border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.description}
                                    />
                                    <ErrorMessage
                                      name="description"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className=" flex justify-center mt-4 text-center">
                                  <button
                                    onClick={() => {
                                      setPresent(false);
                                      updateEducation(values)
                                    }}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      setPresent(false);
                                      setSelectedExCompany(null);
                                      setSelectedTitle(null);
                                      setSelectedCity(null);
                                      await setShowError(false);
                                      await setShowEduForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 2}>
        <div>
          {user &&
            experienceDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    {/* <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setExInitialValues(item);
                        setShowExForm(true);
                      }}
                    />
                  */}
                  </div>
                  <div className="font-semibold flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">
                      {item.employment_type}
                    </p>{" "}
                  </div>
                  <div className="grid grid-cols-1 md:gap-2 gap-0 lg:grid-cols-4 align-items-right">
                    <div className="space-x-2 my-2 flex items-center ">
                      <FaRegBuilding />
                      <p>{item.company_name}</p>
                    </div>
                    <div className="space-x-2 my-2 flex items-center">
                      <CgWorkAlt />
                      <p>{item.industry}</p>
                    </div>
                    <div className="flex items-center space-x-2 my-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setEdit(index);
                          setExInitialValues(item);
                          setShowExForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <div className="text-xl mx-5 px-7 py-2">

                        <AiOutlineDelete
                          className="text-red-600 cursor-pointer"
                          onClick={async () => {
                            setExperienceDetail(
                              experienceDetail.filter((item, i) => i !== index)
                            );
                            let res = JSON.parse(
                              await localStorage.getItem("user")
                            );
                            res.experience = experienceDetail.filter(
                              (item, i) => i !== index
                            );
                            setUser(res);
                            localStorage.setItem("user", JSON.stringify(res));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* {item.description && (
                    <div className="py-2">{item.description}</div>
                  )} */}
                </div>
              );
            })}

          <div className=" flex justify-center text-center">
            <button
              className="  py-2 text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={async () => {
                await setShowError(true);
                await setSelectedCity(null);
                await setEdit(null);
                await setExInitialValues({
                  title: null,
                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowExForm(true);
              }}
            >
              Add Experience
            </button>

            <button
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={() => update(user)}
            >
              Submit
            </button>
          </div>
        </div>

        {showExForm && (
          <Transition
            appear
            show={showExForm}
            as={Fragment}
            className="relative z-10000"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10000"
              onClose={() => { }}
              static={true}
            >
              <div
                className="fixed inset-0 bg-black/30 z-10000"
                aria-hidden="true"
              />
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25 z-10000" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto z-10000">
                <div className="flex min-h-full items-center justify-center z-10000 p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">
                      {/* <Dialog.Title
                        as="h3"
                        className="text-2xl font-bold leading-6 text-gray-900"
                      >
                        Complete Your Details
                      </Dialog.Title> */}
                      <div className={`${!showExForm ? "hidden" : "block"}`}>
                        {/* <p className="text-md font-semibold md:w-1/2  flex w-full  space-y-1 my-5">
                          Add Experience
                        </p> */}
                        <Formik
                          initialValues={exinitialValues}
                          validate={(values) => {
                            if (showExForm === false) return {};
                            const errors = {};
                            // if (!values.title) {
                            //   errors.title = "Required";
                            // }
                            if (!values.employment_type) {
                              errors.employment_type = "Required";
                            }
                            if (!selectedCompany || selectedCompany === " ") {
                              errors.company_name = "Required";
                            }
                            if (!selectedTitle || selectedTitle === " ") {
                              errors.title = "Required";
                            }
                            if (!selectedCity || selectedCity === " ") {
                              errors.location = "Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "Required !";
                            }
                            if (!exPresent && values.end_date === null) {
                              errors.end_date = "Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (!exPresent && values.start_date > values.end_date) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }
                            if (exPresent && values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }

                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location
                            ) {
                              setExFormError(true);
                            } else {
                              setExFormError(false);
                            }

                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Title{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {/* <Field
                                      name="title"
                                      type="text"
                                      placeholder="Ex. Manager"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.title}
                                    /> */}
                                    {edit !== null && (
                                      <p>
                                        Current Job :{" "}
                                        {`${values.title}`}
                                      </p>
                                    )}

                                    <Combobox
                                      value={selectedTitle}
                                      onChange={setSelectedTitle}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setTitleQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {TitleQuery.length > 0 && (
                                          <Combobox.Option className="p-2" value={`${TitleQuery}`}>
                                            Create "{TitleQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredTitle.map((title) => (
                                          <Combobox.Option
                                            key={title.name}
                                            value={`${title.name}`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >
                                                {title.name}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5  md:flex   space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Employment Type{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="employment_type"
                                      as="select"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                    >
                                      <option value="">Please Select</option>
                                      <option value="Full Time">
                                        Full Time
                                      </option>
                                      <option value="Part Time">
                                        Part Time
                                      </option>
                                      <option value="Self Employed">
                                        Self Employed
                                      </option>
                                      <option value="Internship">
                                        Internship
                                      </option>
                                      <option value="Free Lancer">
                                        Free Lancer
                                      </option>
                                    </Field>
                                    <ErrorMessage
                                      name="employment_type"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className=" md:w-4/5  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Company{" "}
                                  </label>

                                  <div className="w-full md:w-4/5">
                                    {/* <Field
                                      name="company_name"
                                      type="text"
                                      placeholder="Ex. Microsoft"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.company_name}
                                    /> */}
                                    {edit !== null && (
                                      <p>Current Company : {values.company_name}</p>
                                    )}
                                    <Combobox
                                      value={selectedCompany}
                                      onChange={setSelectedCompany}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setCompanyQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {companyQuery.length > 0 && (
                                          <Combobox.Option
                                            value={`${companyQuery}`}
                                            className="cursor-pointer p-2"
                                            onClick={async () => {
                                              let res = await checkCompany({ name: companyQuery });

                                            }}
                                          >
                                            Create "{companyQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCompany.map((company) => (
                                          <Combobox.Option
                                            key={company.name}
                                            value={`${company.name}`}
                                            className="cursor-pointer"
                                          >  {({ active, selected }) => (
                                            <li
                                              className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                }`}
                                            >
                                              {company.name}
                                            </li>
                                          )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Location{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {edit !== null && (
                                      <p>
                                        Current Location :{" "}
                                        {`${values.location}`}
                                      </p>
                                    )}
                                    {/* <Field
                                      name="location"
                                      type="text"
                                      placeholder="Ex. London"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.location}
                                    /> */}
                                    <Combobox
                                      value={selectedCity}
                                      onChange={setSelectedCity}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {query.length > 0 && (
                                          <Combobox.Option className="p-2" value={`${query}`}>
                                            Create "{query}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCity.map((city) => (
                                          <Combobox.Option
                                            key={city.name}
                                            value={`${city.name.replace("ā", "a")
                                              .replace("ò", "o")
                                              .replace("à", "a")}, ${city.country}`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >
                                                {city.name.replace("ā", "a")
                                                  .replace("ò", "o")
                                                  .replace("à", "a")}, {city.country}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="location"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>

                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div >
                                        {!exPresent &&
                                          <div className="">
                                            <Field
                                              name="end_date"
                                              type="month"
                                              className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                              style={{
                                                borderRadius: "4px",
                                                border: "0.5px solid",
                                              }}
                                              value={values.end_date}
                                            />

                                            <ErrorMessage
                                              name="end_date"
                                              component="div"
                                              className="text-sm text-red-600"
                                            />
                                          </div>
                                        }
                                        <div className="mx-3 my-2">

                                          <input type="checkbox" id="myCheck"
                                            onChange={(e) => {
                                              // var checkBox = document.getElementById("myCheck");

                                              if (e.target.checked == true) {
                                                setExPresent(true);
                                              } else {
                                                setExPresent(false);

                                              }
                                            }}


                                          />
                                          <label className="font-semibold text-md ml-2 py-2">
                                            Present
                                          </label>

                                        </div>
                                      </div>

                                    </div>
                                  </div>
                                </div>
                                <div className="  md:flex w-full md:w-4/5  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Industry{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="industry"
                                      type="text"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.industry}
                                    />
                                    <ErrorMessage
                                      name="industry"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5  md:flex   space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.description}
                                    />
                                    <ErrorMessage
                                      name="description"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className=" flex mt-4 justify-center text-center">
                                  <button
                                    onClick={() => {
                                      setExPresent(false);

                                      updateExperience(values)
                                    }

                                    }
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      setExPresent(false);

                                      await setShowError(false);
                                      await setEdit(null);
                                      await setSelectedCity(cities[0]);
                                      await setShowExForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index != 3}>
        <div>
          {user &&
            associateDetail &&
            associateDetail.map((item, index) => {
              return (
                <div
                  className=" rounded-md py-2 px-4 bg-white border border-gray-400 my-5 h-35"
                  key={index}
                >
                  <div className="flex justify-end space-x-3 items-center">
                    {/* <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setAsInitialValues(item);
                        setShowAsForm(true);
                      }}
                    />
                  */}
                  </div>
                  <div className="font-semibold my-1 flex space-x-2 items-center">
                    <p>{item.title}</p> <p className="font-normal text-sm">|</p>{" "}
                    <p className="font-normal text-sm">{item.location}</p>{" "}
                  </div>
                  <div className="grid grid-cols-1 md:gap-2 gap-1 lg:grid-cols-4 align-items-right">
                    <div className="space-x-2 flex items-center">
                      <FaRegBuilding />
                      <p>{item.company_name}</p>
                    </div>

                    <div className="space-x-2 flex items-center">
                      <CgWorkAlt />
                      <p>{item.industry}</p>
                    </div>

                    <div className="flex items-center space-x-2 my-2">
                      <BsCalendar />
                      <p className="text-sm text-gray-600 mr-5">
                        {item.start_date} - {item.Ispresent ? "Present" : item.end_date}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                        style={{ backgroundColor: "#034488" }}
                        onClick={() => {
                          setEdit(index);
                          setAsInitialValues(item);
                          setShowAsForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <div className="text-xl mx-5 px-7 py-2">

                        <AiOutlineDelete
                          className="text-red-600 cursor-pointer"
                          onClick={async () => {
                            setAssociateDetail(
                              associateDetail.filter((item, i) => i !== index)
                            );
                            let res = JSON.parse(
                              await localStorage.getItem("user")
                            );
                            res.associate = associateDetail.filter(
                              (item, i) => i !== index
                            );
                            setUser(res);
                            localStorage.setItem("user", JSON.stringify(res));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {item.description && (
                    <div className="py-2">{item.description}</div>
                  )}
                </div>
              );
            })}

          <div className="flex mx-auto justify-center text-center">
            <button
              className="py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={async () => {
                await setShowError(true);
                await setSelectedCity(null);
                await setEdit(null);
                await setAsInitialValues({
                  title: null,

                  company_name: null,
                  location: null,
                  start_date: null,
                  end_date: null,
                  industry: null,
                  description: null,
                });
                await setShowAsForm(true);
              }}
            >
              Add Association
            </button>

            <button
              className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={() => update(user)}
            >
              Submit
            </button>
          </div>
        </div>

        {showAsForm && (
          <Transition
            appear
            show={showAsForm}
            as={Fragment}
            className="relative z-10000"
            style={{ zIndex: 1000 }}
          >
            <Dialog
              as="div"
              className="relative z-10000"
              onClose={() => { }}
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
                    <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">

                      <div className={`${!showAsForm ? "hidden" : "block"}`}>

                        <Formik
                          initialValues={asinitialValues}
                          validate={(values) => {
                            if (showAsForm === false) return {};
                            const errors = {};
                            // if (!values.title) {
                            //   errors.title = "Required";
                            // }
                            if (!selectedTitle || selectedTitle === " ") {
                              errors.title = "Required";
                            }

                            if (!selectedCompany || selectedCompany === " ") {
                              errors.company_name = "Required";
                            }
                            if (!selectedCity || selectedCity === " ") {
                              errors.location = "Required";
                            }
                            if (values.start_date === null) {
                              errors.start_date = "Required !";
                            }
                            if (!asPresent && values.end_date === null) {
                              errors.end_date = "Required !";
                            }
                            if (values.start_date > new Date()) {
                              errors.start_date =
                                "Start date cannot be greater than today's date";
                            }
                            if (!asPresent && values.start_date > values.end_date) {
                              errors.end_date =
                                "End date cannot be less than start date";
                            }
                            if (
                              errors.title ||
                              errors.employment_type ||
                              errors.company_name ||
                              errors.end_date ||
                              errors.start_date ||
                              errors.location
                            ) {
                              setAsFormError(true);
                            } else {
                              setAsFormError(false);
                            }
                            return errors;
                          }}
                        >
                          {({ values }) => {
                            return (
                              <Form className="w-full py-4">
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Title{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {/* <Field
                                      name="title"
                                      type="text"
                                      placeholder="Ex. Manager"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.title}
                                    /> */}
                                    {edit !== null && (
                                      <p>
                                        Current Job :{" "}
                                        {`${values.title}`}
                                      </p>
                                    )}

                                    <Combobox
                                      value={selectedTitle}
                                      onChange={setSelectedTitle}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setTitleQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg w-full border-gray-400 focus:outline-0 focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md">
                                        {TitleQuery.length > 0 && (
                                          <Combobox.Option className="p-2" value={`${TitleQuery}`}>
                                            Create "{TitleQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredTitle.map((title) => (
                                          <Combobox.Option
                                            key={title.name}
                                            value={`${title.name}`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >
                                                {title.name}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="title"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>

                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Company{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {/* <Field
                                      name="company_name"
                                      type="text"
                                      placeholder="Ex. Microsoft"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.company_name}
                                    /> */}
                                    {edit !== null && (
                                      <p>Current Company : {values.company_name}</p>
                                    )}
                                    <Combobox
                                      value={selectedCompany}
                                      onChange={setSelectedCompany}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setCompanyQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 focus:border-0 px-4 py-2 w-full"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute z-100 bg-white rounded-lg shadow-md overflow-y-auto" style={{ borderRadius: "5px", overflowY: "auto" }}>
                                        {companyQuery.length > 0 && (
                                          <Combobox.Option
                                            value={`${companyQuery}`}
                                            className="cursor-pointer p-2"
                                            onClick={async () => {
                                              let res = await checkCompany({ name: companyQuery });

                                            }}
                                          >
                                            Create "{companyQuery}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCompany.map((company) => (
                                          <Combobox.Option
                                            key={company.name}
                                            value={`${company.name}`}
                                            className="cursor-pointer "
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >
                                                {company.name}
                                              </li>
                                            )}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="company_name"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="w-full md:w-4/5 md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Location{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    {edit !== null && (
                                      <p>
                                        Current Location :{" "}
                                        {`${values.location}`}
                                      </p>
                                    )}
                                    {/* <Field
                                      name="location"
                                      type="text"
                                      placeholder="Ex. London"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.location}
                                    /> */}
                                    <Combobox
                                      value={selectedCity}
                                      onChange={setSelectedCity}
                                    >
                                      <Combobox.Input
                                        onChange={(event) =>
                                          setQuery(event.target.value)
                                        }
                                        className="border-[0.5px] rounded-lg border-gray-400 focus:outline-0 w-full focus:border-0 px-4 py-2"
                                        style={{ borderRadius: "5px" }}
                                      />
                                      <Combobox.Options className="absolute bg-white rounded-lg shadow-md">
                                        {query.length > 0 && (
                                          <Combobox.Option className="p-2" value={`${query}`}>
                                            Create "{query}"
                                          </Combobox.Option>
                                        )}
                                        {filteredCity.map((city) => (
                                          <Combobox.Option
                                            key={city.name}
                                            value={`${city.name.replace("ā", "a")
                                              .replace("ò", "o")
                                              .replace("à", "a")}, ${city.country}`}
                                          >
                                            {({ active, selected }) => (
                                              <li
                                                className={`${active ? 'bg-blue-500 text-white p-2' : 'bg-white text-black p-2'
                                                  }`}
                                              >
                                                {city.name.replace("ā", "a")
                                                  .replace("ò", "o")
                                                  .replace("à", "a")}, {city.country}</li>)}
                                          </Combobox.Option>
                                        ))}
                                      </Combobox.Options>
                                    </Combobox>
                                    <ErrorMessage
                                      name="location"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-2">
                                  <label className="font-semibold text-lg w-2/5 mx-2 md:mx-0 sm:mt-4">
                                    Work Period{" "}
                                  </label>

                                  <div
                                    className="w-4/5 md:flex w-full"
                                    style={{ justifyContent: "space-between" }}
                                  >
                                    <div className=" my-1  md:flex md:mr-5 align-middle">
                                      <label className="font-semibold text-md md:ml-0 py-2 ml-2">
                                        Start From
                                      </label>
                                      <div className="">
                                        <Field
                                          name="start_date"
                                          type="month"
                                          className="block border-gray-400 py-2 w-full md:w-4/5 mx-2 border-[0.5px] border-[#6b7280]"
                                          style={{
                                            borderRadius: "4px",
                                            border: "0.5px solid",
                                          }}
                                          value={values.start_date}
                                        />
                                        <ErrorMessage
                                          name="start_date"
                                          component="div"
                                          className="text-sm text-red-600"
                                        />
                                      </div>
                                    </div>

                                    <div className=" my-1  md:flex md:ml-2  align-middle">
                                      <label className="font-semibold text-md ml-2 py-2">
                                        End At
                                      </label>
                                      <div >
                                        {!asPresent &&
                                          <div className="">
                                            <Field
                                              name="end_date"
                                              type="month"
                                              className="block border-gray-400 py-2 mx-2 border-[0.5px] w-full border-[#6b7280]"
                                              style={{
                                                borderRadius: "4px",
                                                border: "0.5px solid",
                                              }}
                                              value={values.end_date}
                                            />

                                            <ErrorMessage
                                              name="end_date"
                                              component="div"
                                              className="text-sm text-red-600"
                                            />
                                          </div>
                                        }


                                        <div className="mx-3 my-2">

                                          <input type="checkbox" id="myCheck"
                                            onChange={(e) => {
                                              // var checkBox = document.getElementById("myCheck");

                                              if (e.target.checked == true) {
                                                setAsPresent(true);
                                              } else {
                                                setAsPresent(false);

                                              }
                                            }}


                                          />
                                          <label className="font-semibold text-md ml-2 py-2">
                                            Present
                                          </label>

                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Industry{" "}
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="industry"
                                      type="text"
                                      className=" block border-gray-400 py-2 w-full border-[0.5px] border-[#6b7280]"
                                      style={{ borderRadius: "4px" }}
                                      value={values.industry}
                                    />
                                    <ErrorMessage
                                      name="industry"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="md:w-1/2  md:flex w-full  space-y-1 my-5">
                                  <label className="font-semibold text-lg w-2/5 mx-2">
                                    Description
                                  </label>
                                  <div className="w-full md:w-4/5">
                                    <Field
                                      name="description"
                                      type="textarea"
                                      className="block border-gray-400 py-1 w-full border-[0.5px] border-[#6b7280] p-2"
                                      style={{
                                        borderRadius: "4px",
                                        border: "0.5px solid",
                                      }}
                                      value={values.description}
                                    />

                                    <ErrorMessage
                                      name="description"
                                      component="div"
                                      className="text-sm text-red-600"
                                    />
                                  </div>
                                </div>
                                <div className="flex px-5 w-full justify-center text-center">
                                  <button
                                    onClick={() => {
                                      setAsPresent(false);

                                      updateAssociation(values)
                                    }}
                                    className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                    style={{ backgroundColor: "#034488" }}
                                  >
                                    {edit === null ? "Save Changes " : "Update"}
                                  </button>
                                  <button
                                    type="button"
                                    className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                    ref={resetBtn}
                                    onClick={async () => {
                                      await setAsPresent(false);
                                      setSelectedExCompany(null);
                                      setSelectedTitle(null);
                                      setSelectedCity(null);
                                      await setShowError(false);
                                      await setShowAsForm(false);
                                    }}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Form>
                            );
                          }}
                        </Formik>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        )}
      </div>
      <div className="tabContent bg-white p-5" hidden={index !== 4}>
        {user !== null && user !== undefined && (
          <div>
            <label className="font-semibold text-lg w-2/5 mx-2">Skills</label>
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
              <button
                className="h-10 bg-blue-600 text-white rounded-lg block cursor-pointer px-8 align-middle ml-3 my-2"
                style={{ backgroundColor: "#034488" }}
              >
                Search
              </button>
            </div>
            <div className="md:w-1/2  flex w-full  space-y-1 my-5">
              <div className="w-full">
                {showRoles &&
                  showRoles.map((el, index) => {
                    return (
                      <div key={index}>
                        <Disclosure>
                          {({ open }) => (
                            <div className={`${open ? "shadow-md" : ""}`}>
                              <Disclosure.Button
                                className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg " : ""
                                  }`}
                              >
                                <span>{el}</span>
                                <div className="ml-auto mr-5 flex items-center space-x-2">
                                  <p>0</p>
                                  <input
                                    type="range"
                                    min="0"
                                    max="5"
                                    value={rolesProf[index]}
                                    onChange={(e) => {
                                      console.log(dbSkills);
                                      dbSkills.forEach((skill) => {
                                        if (skill.role === el) {
                                          skill.proficiency = e.target.value;
                                          let inde = dbSkills.findIndex(
                                            (el) => {
                                              return el === skill;
                                            }
                                          );
                                          let p = prof;
                                          p[inde] = e.target.value;
                                          setProf(p);
                                          skill.rating = e.target.value;
                                        }
                                      });
                                      console.log(dbSkills);
                                      let rp = rolesProf;
                                      rp[index] = e.target.value;
                                      setRolesProf(rp);
                                      localStorage.setItem(
                                        "RolesProf",
                                        JSON.stringify(rolesProf)
                                      );
                                    }}
                                  />
                                  <p>5</p>
                                </div>
                                <ChevronUpIcon
                                  className={`${!open ? "rotate-180 transform" : ""
                                    } h-5 w-5 text-blue-500`}
                                />
                              </Disclosure.Button>
                              <Disclosure.Panel className="p-3 px-4">
                                {primarySkills[el].map((skill, index) => {
                                  return (
                                    <div>
                                      <Disclosure>
                                        {({ open }) => (
                                          <div
                                            className={`${open ? "shadow-md" : ""
                                              }`}
                                          >
                                            <Disclosure.Button
                                              className={`flex w-full justify-between rounded-lg bg-blue-50 px-4 py-3 text-left text-sm font-medium hover:bg-blue-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-300 focus-visible:ring-opacity-75 ${open ? "shadow-lg" : ""
                                                } `}
                                            >
                                              <span>{skill}</span>
                                              <ChevronUpIcon
                                                className={`${!open
                                                  ? "rotate-180 transform"
                                                  : ""
                                                  } h-5 w-5 text-blue-500`}
                                              />
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="p-3 px-12">
                                              {dbSkills
                                                .filter((secSkill) => {
                                                  return (
                                                    secSkill.primarySkill ===
                                                    skill &&
                                                    secSkill.role === el
                                                  );
                                                })
                                                .map((secSkill, index) => {
                                                  let d = dbSkills;
                                                  let index1 = d.findIndex(
                                                    (el) => {
                                                      return el === secSkill;
                                                    }
                                                  );
                                                  return (
                                                    <div className="flex my-2 text-sm justify-between items-center px-3 py-1">
                                                      <p>
                                                        {
                                                          secSkill.secondarySkill
                                                        }
                                                      </p>

                                                      <div className="flex items-center space-x-2">
                                                        <p>0</p>
                                                        <input
                                                          type="range"
                                                          min="0"
                                                          max="5"
                                                          value={prof[index1]}
                                                          onChange={async (
                                                            e
                                                          ) => {
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
                                                            await setProf([
                                                              ...p,
                                                            ]);
                                                            await setDbSkills([
                                                              ...d,
                                                            ]);
                                                            if (
                                                              e.target.value > 0
                                                            ) {
                                                              let u = user;
                                                              let to = u.tools;
                                                              to.push({
                                                                proficiency:
                                                                  e.target
                                                                    .value,
                                                                ...secSkill,
                                                              });
                                                              u.tools = to;
                                                              await setUser({
                                                                ...u,
                                                              });
                                                            }
                                                          }}
                                                        />
                                                        <p>5</p>
                                                        <p className="text-xs font-italics">
                                                          {prof[index1] > 0
                                                            ? "Self-assetsted"
                                                            : "Unassested"}
                                                        </p>
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

            <div className="p-5">
              {rolesC
                ? rolesC.map((item, index) => {
                  return (
                    <div className="py-2">
                      <p className="font-semibold text-md md:w-1/2  md:flex w-full  space-y-2 my-5">
                        {item}
                      </p>
                      {skillsPrimary[item].map((el) => (
                        <div className="py-1">
                          <p className="text-sm my-2">{el}</p>
                          <div className="md:flex ">
                            {user.tools
                              .filter(
                                (tool) =>
                                  tool.role === item &&
                                  tool.primarySkill === el
                              )
                              .map((item1, index) => (
                                <p className="bg-blue-100 text-blue-800 text-xs mb-2 font-semibold mr-2 px-3 py-1.5 rounded dark:bg-blue-200 dark:text-blue-800 ">
                                  {item1.secondarySkill}{" "}
                                  {item1.proficiency &&
                                    `(${item1.proficiency})`}
                                </p>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
                : "No Skills"}
            </div>
          </div>
        )}

        <div>
          <label className="font-semibold text-lg w-2/5 mx-2">Language Skills</label>
          <div className="my-3 px-4 flex items-center flex-wrap">
            {showLsForm && (
              <Transition
                appear
                show={showLsForm}
                as={Fragment}
                className="relative z-10000"
                style={{ zIndex: 1000 }}
              >
                <Dialog
                  as="div"
                  className="relative z-10000"
                  onClose={() => { }}
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
                        <Dialog.Panel className="w-full  px-7 my-5 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-w-4xl mx-auto">

                          <div className={`${!showLsForm ? "hidden" : "block"}`}>

                            <Formik
                              initialValues={lsinitialValues}
                              validate={(values) => {
                                if (showLsForm === false) return {};
                                const errors = {};
                                if (!values.name) {
                                  errors.name = "Required";
                                }

                                // if (values.read === null) {
                                //   errors.read = "Required !";
                                // }
                                // if (values.write === null) {
                                //   errors.write = "Required !";
                                // }
                                // if (values.speak === null) {
                                //   errors.speak = "Required !";
                                // }

                                // if (
                                //   errors.name ||
                                //   errors.read ||
                                //   errors.write ||
                                //   errors.speak 
                                // ) {
                                //   setLsFormError(true);
                                // } else {
                                //   setLsFormError(false);
                                // }
                                return errors;
                              }}
                            >
                              {({ values }) => {
                                return (
                                  <Form className="w-full py-4">

                                    <div className="md:w-1/2 md:mx-2 my-1 sm:mx-0  md:flex w-full  space-y-1">
                                      <label className="font-bold text-lg md:w-2/5 mx-5 mt-2">
                                        Name{" "}
                                      </label>
                                      <Field
                                        component="select"
                                        id="name"
                                        name="name"
                                        style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "40px" }}
                                        className="block border-gray-200 py-1 md:w-4/5 sm:w-4/5 mx-5"
                                        value={values.name}
                                        multiple={false}
                                      >
                                        {language &&
                                          language.map((item) => {
                                            return (
                                              <option value={item.name}>{item.name}</option>
                                            );
                                          })}
                                      </Field>
                                      <div>
                                        <ErrorMessage
                                          name="name"
                                          component="div"
                                          className="text-sm my-2 text-red-600"
                                        />
                                      </div>

                                    </div>
                                    <div style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", height: "60px" }}
                                      className="border-gray-200 flex my-5">
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="read"
                                          className="my-1 "
                                          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px" }}
                                          onClick={() => {
                                            // let temp = permissions;
                                            // temp[index].value = !temp[index].value;
                                            // setPermissions(temp);
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Read
                                        </label>
                                      </div>
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="write"
                                          className="my-1 "
                                          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px" }}
                                          onClick={() => {
                                            // let temp = permissions;
                                            // temp[index].value = !temp[index].value;
                                            // setPermissions(temp);
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Write
                                        </label>
                                      </div>
                                      <div className="mx-3 my-4">
                                        <Field
                                          type="checkbox"
                                          name="speak"
                                          className="my-1"
                                          style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px" }}
                                          onClick={() => {
                                            // let temp = permissions;
                                            // temp[index].value = !temp[index].value;
                                            // setPermissions(temp);
                                          }}
                                        />
                                        <label
                                          htmlFor="permissions"
                                          className="text-gray-700 mx-3 font-bold"
                                        >
                                          Speak
                                        </label>
                                      </div>
                                    </div>
                                    <div className="flex px-5 w-full justify-center text-center">
                                      <button
                                        onClick={() => {

                                          updateLanguage(values);
                                          setShowLsForm(false);

                                        }}
                                        className=" bg-blue-600  text-white rounded-lg block cursor-pointer py-2 px-8 align-middle"
                                        style={{ backgroundColor: "#034488" }}
                                      >
                                        {edit === null ? "Save Changes " : "Update"}
                                      </button>
                                      <button
                                        type="button"
                                        className=" border-[0.5px] mx-3 border-gray-700 py-2 text-gray-700 rounded-lg block cursor-pointer px-8"
                                        ref={resetBtn}
                                        onClick={async () => {
                                          await setEdit(null);
                                          await setShowError(false);
                                          await setShowLsForm(false);
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </Form>)
                              }}
                            </Formik>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition>)}

          </div>
          <div className=" mx-auto justify-center text-center">
            <div className="lg:w-2/3 md:w-full sm:w-full">
              {user && languageSkills &&
                languageSkills.map((item, index) => {
                  return (
                    <div
                      className=" rounded-md py-2 px-4 bg-white border  my-4 h-35"
                      key={index}
                    >
                      <div className="flex justify-end space-x-3 items-center">
                        {/* <RiEditBoxLine
                      className="cursor-pointer"
                      onClick={() => {
                        setEdit(index);
                        setExInitialValues(item);
                        setShowExForm(true);
                      }}
                    />
                  */}
                      </div>
                      <div className="font-semibold flex space-x-2 items-center">
                        <p>{item.name}</p> <p className="font-normal text-sm">|</p>{" "}

                      </div>
                      <div className="grid grid-cols-1 md:gap-2 lg:grid-cols-6 space-between align-items-right ">
                        <div className="col-start-1 col-end-3 flex">
                          <div className="space-x-2 my-2 flex items-center pr-2">

                            {item.read ? <p className="text-lg flex md:text-sm sm:text-xs "><AiOutlineRead className="my-auto mx-2" /> Read</p> : ""}
                          </div>
                          <div className="space-x-2 my-2 flex items-center px-2">

                            {item.write ? <p className="text-lg md:text-sm sm:text-xs flex"><HiPencil className="my-auto mx-2" />Write</p> : ""}
                          </div>
                          <div className="flex items-center space-x-2 my-2 px-2">


                            {item.speak ? <p className="text-lg md:text-sm sm:text-xs flex"><IoPeople className="my-auto mx-2" />Speak</p> : ""}

                          </div>
                        </div>
                        <div className="col-start-5 col-end-7 col-span-2 flex items-center space-x-2 ">
                          <button
                            className=" hover:bg-blue-700 text-white font-bold py-3 px-8 text-xs rounded"
                            style={{ backgroundColor: "#034488" }}
                            onClick={() => {
                              setEdit(index);
                              setLsInitialValues(item);
                              setShowLsForm(true);
                            }}
                          >
                            Edit
                          </button>
                          <div className="text-xl mx-5 px-7 py-2">

                            <AiOutlineDelete
                              className="text-red-600 cursor-pointer"
                              onClick={async () => {
                                setLanguageSkills(
                                  languageSkills.filter((item, i) => i !== index)
                                );
                                let res = JSON.parse(
                                  await localStorage.getItem("user")
                                );
                                res.experience = languageSkills.filter(
                                  (item, i) => i !== index
                                );
                                setUser(res);
                                localStorage.setItem("user", JSON.stringify(res));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {item.description && (
                        <div className="py-2 w-1/2">{item.description}</div>
                      )}
                    </div>
                  );
                })}
            </div>
            <button
              className="py-2  text-white rounded-lg block cursor-pointer px-8 my-5"
              style={{ backgroundColor: "#034488" }}
              onClick={async () => {
                await setShowError(true);

                await setEdit(null);
                await setLsInitialValues({
                  name: null,
                  read: null,
                  write: null,
                  speak: null,
                });
                setShowLsForm(true);
                // await setShowLsForm(true);
              }}
            >
              Add Language Skills
            </button>


          </div>
        </div>


        {/* <p className="font-bold text-lg">Resume</p>
        {fileName && <p className="my-3">{fileName}</p>}
        {error && <p className="text-red-500 my-3">{error}</p>} */}
        {/* <div className="my-5">
          {loading ? (
            <button className="py-1 px-3 bg-blue-500 rounded-md">
              <img src={Loader} className="h-7" alt="loader" />
            </button>
          ) : (
            <label
              for="resume"
              className="py-2 px-3 cursor-pointer bg-blue-500 rounded-md text-white"
              style={{ backgroundColor: "#034488" }}
            >
              {" "}
              Upload Resume{" "}
            </label>
          )}
          <input
            type="file"
            name="resume"
            className="hidden"
            id="resume"
            accept="application/pdf, application/msword"
            onChange={handleChange}
          />
        </div> */}


        <button
          className="bg-blue-500 px-4 mx-2 py-1 text-white rounded-lg my-5"
          style={{ backgroundColor: "#034488" }}
          onClick={() => update(user)}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
