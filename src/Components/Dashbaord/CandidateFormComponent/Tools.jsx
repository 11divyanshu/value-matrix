import React from "react";

const Tools = (props) => {
  const [tools, setTools] = React.useState([]);

  const inputRef = React.useRef(null);

  return (
    <div>
      <p className="font-bold text-lg">Tools</p>
      <div>
        <input
          className="w-3/4 text-600 my-3"
          style={{ borderRadius: "10px" }}
          type="text"
          ref={inputRef}
        />
      </div>
      <div className="pt-5 flex w-full">
        <button
          className="bg-blue-600 py-2 px-3 rounded-sm text-white"
          onClick={() => props.setStep(3)}
        >
          Prev
        </button>
        {false ? (
          <button className="bg-blue-600 py-2 px-3 rounded-sm ml-auto text-white">
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
