import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { updateProfileImage } from "../../service/api";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { ReactSession } from "react-client-session";
import { url } from "../../service/api";

const ReactCropper = (props) => {
  const [imageSrc, setImageSrc] = React.useState(props.upImg);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  let user1 = ReactSession.get("user");
  const [user, setUser] = React.useState(user1);
  const btnRef = React.useRef(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      setImageSrc(imageDataUrl);
    }
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      let user = ReactSession.get("user");
      let access_token1 = ReactSession.get("access_token");
      console.log("donee", { croppedImage });
      await setCroppedImage(croppedImage);    
      const result = await fetch(croppedImage);
      const buf = result.arrayBuffer();
      const file = new File([buf], user._id + "-profile", { type: MimeType });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user._id);
      let res = await updateProfileImage(formData, access_token1);
      console.log(res);
      if (res) {
        // window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  return (
    <div>
      {imageSrc ? (
        <div class="block">
          <div className="block">
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
              style={{
                containerStyle: { height: "40vh", backgroundColor: "black" },
                cropAreaStyle: { width: "100px" },
              }}
              initialCroppedAreaPercentages={{
                width: 10,
                height: 10,
                x: 0,
                y: 0,
              }}
            />
          </div>
        </div>
      ) : (
        <label>
          <p class="bg-blue-500 rounded-sm text-white px-2 py-1 cursor-pointer w-fit mx-auto">
            Upload Image
          </p>
          <input
            type="file"
            onChange={onFileChange}
            accept="image/png "
            className="hidden"
          />
        </label>
      )}
      <div
        className={`flex justify-content-end  ${
          imageSrc ? "mt-[43vh]" : "mt-3"
        }`}
      >
        <button
          className=" border-[0.5px] border-red-400 text-red-400 rounded-sm px-2 py-1 cursor-pointer w-fit ml-auto"
          onClick={() => {
            setCroppedImage(null);
            setImageSrc(null);
            props.Modal.current.click();
          }}
        >
          Cancel
        </button>
        {imageSrc && (
          <button
            onClick={showCroppedImage}
            className=" bg-blue-500 rounded-sm text-white px-2 py-1 cursor-pointer w-fit ml-3"
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default ReactCropper;
