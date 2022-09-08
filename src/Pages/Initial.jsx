import React from "react";

const Initial = () => {
  
    React.useEffect(() => {
        window.location.href="/login";
    }, []);

    return(
        <div></div>
    )
};

export default Initial;