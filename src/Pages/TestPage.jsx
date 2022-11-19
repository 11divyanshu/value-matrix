import React from "react";
import { TranscribeClient, CreateCallAnalyticsCategoryCommand } from "@aws-sdk/client-transcribe";

const TestPage = () => {
  
    React.useEffect(() => {
        const client = new TranscribeClient({ region: "us-east-1" });
        const params = {
            /** input parameters */
          };
          const command = new CreateCallAnalyticsCategoryCommand(params);
    }, []);

    return(
        <div></div>
    )
};

export default TestPage;



// import React from 'react';
// import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// const appId = '005a1159-6106-460b-8204-4fb3c303b9b1';
// const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
// SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();
//   const startListening = () => SpeechRecognition.startListening({ continuous: true });

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
//     <div>
//       <p>Microphone: {listening ? 'on' : 'off'}</p>
//       <button
//         onTouchStart={startListening}
//         onMouseDown={startListening}
//         onTouchEnd={SpeechRecognition.stopListening}
//         onMouseUp={SpeechRecognition.stopListening}
//       >Hold to talk</button>
//       <p>{transcript}</p>
//     </div>
//   );
// };
// export default Dictaphone;