// import React, { useEffect } from "react";

// const StoryLoading = () => {
//   useEffect(() => {
//     // Dynamically add the DotLottie script to the document
//     const script = document.createElement("script");
//     script.src = "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs";
//     script.type = "module";
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <dotlottie-player
//         src="https://lottie.host/3de99782-fd11-4b55-8992-3bb881e8c5bb/rvKHki15zh.lottie"
//         background="transparent"
//         speed="1"
//         style={{ width: "300px", height: "300px" }}
//         loop
//         autoplay
//       ></dotlottie-player>
//     </div>
//   );
// };

// export default StoryLoading;

import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = () => {
  const sigCanvas = useRef(null);

  // Function to clear the signature
  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  // Function to save the signature as an image
  const saveSignature = () => {
    const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    console.log("Signature Image URL: ", dataUrl);
  };

  return (
    <div className="signature-container" style={{ textAlign: "center", margin: "20px" }}>
      <h2>Sign Here</h2>
      <SignatureCanvas
        ref={sigCanvas}
        penColor="white"
        canvasProps={{
          width: 500,
          height: 200,
          className: "signature-canvas",
          style: { border: "1px solid white" },
        }}
      />
      <div style={{ marginTop: "20px" }} className="text-white bg-red">
        <button onClick={clearSignature} style={{ margin: "0 10px" }} className="bg-[red]">
          Clear
        </button>
        <button onClick={saveSignature} style={{ margin: "0 10px" }} className="bg-[blue]">
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignaturePad;
