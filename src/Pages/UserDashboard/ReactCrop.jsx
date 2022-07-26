import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { updateProfileImage, getProfileImage } from "../../service/api";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { ReactSession } from "react-client-session";
import { url } from "../../service/api";
import axios from "axios";
import { BlockList } from "net";
import swal from "sweetalert";
import Loader from "../../assets/images/loader.gif";

const ReactCropper = (props) => {
  const [imageSrc, setImageSrc] = React.useState(props.upImg);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [loading, setLoading] = React.useState(false);

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
      setLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      let userS = localStorage.getItem("user");
      let user = JSON.parse(userS);
      let access_token1 = localStorage.getItem("access_token");
      console.log("donee", croppedImage);
      await setCroppedImage(croppedImage);

      const formData = new FormData();
      let blob = await fetch(croppedImage).then(r => r.blob());
      blob.originalname = user._id + "-profile";
      formData.append("user_id", user._id);
      formData.append("file" , blob);
      console.log(formData.files);
console.log("update")
     
      let res = await updateProfileImage(formData,props.user, access_token1);
      console.log(res)
      if(res.status === 200 && res.data.Success === true){
        setLoading(false)
      let image = await getProfileImage(
        {id : user._id},
        access_token1
      );
      user.profileImg = user._id +"-profile";
      await localStorage.setItem("user", JSON.stringify(user));
      await localStorage.setItem("profileImg", JSON.stringify(image.data.Image));

   
         window.location.reload();
      }  
      else { 
        setLoading(false)
if(res.status === 200 && res.data.Message !== undefined){
          swal({
            icon: "error",
            title: "Oops",
            text: res.data.Message,
            button: "Continue",
          });
}else{

swal({
            icon: "error",
            title: "Oops",
            text: "Something Went Wrong",
            button: "Continue",
          });

}
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
        <div className="block">
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
          <p className="rounded-sm text-white px-4 py-1 cursor-pointer w-fit mx-auto" style={{backgroundColor:"#034488"}}>
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
          className=" border-[0.5px] border-red-400 text-red-400 rounded-sm px-4 py-1 cursor-pointer w-fit ml-auto"
          onClick={() => {
            setLoading(false);
            setCroppedImage(null);
            setImageSrc(null);
            props.Modal.current.click();
          }}
        >
          Cancel
        </button>
        {imageSrc && (
          <button
            onClick={()=>showCroppedImage()}
            className="rounded-sm text-white px-4 py-1 cursor-pointer w-fit ml-3"
            style={{backgroundColor:"#034488"}}
          >
           {loading ? (
              <img src={Loader} className="h-7" alt="loader" />
          ) : (
           "Upload"
          )}
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