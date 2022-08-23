import React from "react";

const ResumeForm = (props) => {
  const [file, setFile] = React.useState(null);

  const handleChange = async (e) => {
    if (e.target && e.target.files) {
      await setFile(e.target.files[0]);
      props.setCandidateDetails({
        resume: e.target.files[0],
        ...props.candidateDetails,
      });
    }
  };

  return (
    <div>
      <p className="font-bold text-lg">Upload Your Resume</p>
      {file && <p className="my-3">{file.name}</p>}
      <div className="my-5">
        <label
          for="resume"
          className="py-2 px-3 cursor-pointer bg-blue-500 rounded-md text-white"
        >
          {" "}
          Upload Resume{" "}
        </label>
        <input
          type="file"
          name="resume"
          className="hidden"
          id="resume"
          accept="application/pdf, application/msword"
          onChange={handleChange}
        />
      </div>
      <div className="w-full flex content-end">
        {file === null ? (
          <button
            disabled={true}
            className={`px-3 py-2 ml-auto mr-3 bg-blue-400 text-white rounded-md`}
          >
            Next
          </button>
        ) : (
          <button
            disabled={file === null}
            onClick={() => props.setStep(1)}
            className={`px-3 py-2 ml-auto mr-3 bg-blue-500 text-white rounded-md`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
