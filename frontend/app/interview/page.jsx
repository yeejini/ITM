'use client';
import dynamic from 'next/dynamic'
import React, { useEffect, useState,useCallback } from "react";
import { checkAudioCodecPlaybackSupport, useRecordWebcam } from 'react-record-webcam';
import { AudioRecorder,useAudioRecorder } from 'react-audio-voice-recorder';
import ReactPlayer from 'react-player';
import { Cookies } from "react-cookie";
import { redirect, useRouter } from 'next/navigation'; // next/navigation에서 useRouter를 가져옴
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons"
import { create_polly, post_chat, post_new_qs, post_stt, save_audio, save_video } from "../api";
import { Camera } from "lucide-react";
import useConfirmPageLeave from "@/hooks/useConfirmPageLeave";

// import useBlockPageNavigation from "@/hooks/useRouteChangeBlocking";


const Interview = () => {
  useConfirmPageLeave(); // 훅 사용

  const cookies = new Cookies();
  const [start, setStart] = useState(0);
  const [question,setQuestion] = useState(cookies.get('simul_info'));
  const [frontQ, setFrontQ] = useState(cookies.get('simul_ques'));
  const [textPath, setTextPath] = useState("");
  const [chatQ, setchatQ] = useState("");
  const router = useRouter()
  const [count, setCount] = useState(1);
  const [disabled, setDisabled] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const user_uuid = cookies.get('user_uuid');
  const [loadingMessage, setLoadingMessage] = useState(null); // 로딩 메시지 상태 추가
  const [nextloadingMessage, setNextLoadingMessage] = useState(""); // 로딩 메시지 상태 추가
  const [message, setMessage] = useState("");

  const {
    activeRecordings,
    createRecording,
    cancelRecording,
    closeCamera,
    openCamera,
    stopRecording,
    startRecording,
  } = useRecordWebcam({mediaTrackConstraints: { video: true, audio: false }});

  const [audio_key,setAudio_key] = useState('audio/tmp.mp3');
  const [video_key,setVideo_key] = useState('video/tmp.webm');
  const itv_cnt = cookies.get('itv_cnt');

  const recorderControls = useAudioRecorder();
  const addAudioElement = async (blob) => {
    const audio_formData = new FormData()
    audio_formData.append('audio_key',audio_key)
    audio_formData.append('blob',blob)
    await save_audio(audio_formData)
    await fetchSTT();
  };
  const polly = async (text) => {
    const arrayBuffer = await create_polly(text);
    const blob = new Blob([new Uint8Array(arrayBuffer)], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.onended = () => {
      startItv();
    };
    audio.play();
  }

  const postVideo = async () => {
    try {
      const recording = await createRecording();
      if (!recording) return;
      await openCamera(recording.id);
      await startRecording(recording.id);
      // await muteRecording(recording.id);
      await new Promise(resolve => setTimeout(resolve, 600000));
      await clickStopButton(recording.id);
    } catch (error) {
      console.log({error});
    }
  };

  const stopAndUpload = async (recording_id) => {
    const recorded = await stopRecording(recording_id);
    const video_formData = new FormData()
    const now = Date.now()
    setVideo_key(`${user_uuid}/${itv_cnt}/${now}_video.webm`);
    video_formData.append('video_key',`${user_uuid}/${itv_cnt}/${now}_video.webm`)
    video_formData.append('blob',recorded.blob)
    console.log(video_key);
    console.log(recorded.blob);
    save_video(video_formData);
    // await cancelRecording(recording_id);
    await closeCamera(recording_id);
    await cancelRecording(recording_id);
  };

  const startItv = useCallback(async () => {
    // Start postVideo and recording
    postVideo();
    recorderControls.startRecording();
    // Start the countdown timer
    setCountdown(3);
    setMessage("");  // Clear any previous message
    const timer = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount === 1) {
          clearInterval(timer);
          setCountdown(null);
          setMessage("지금 말씀해주세요");
          return null;
        }
        return prevCount - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  

  const clickStopButton = async (recording_id) => {
    const now = Date.now()
    // setVideo_key(`${user_uuid}/${itv_cnt}/${now}_video.webm`);
    setAudio_key(`${user_uuid}/${itv_cnt}/${now}_audio.mp3`);
    stopAndUpload(recording_id);
    recorderControls.stopRecording();
    setMessage(null);  
  };
  const fetchSTT = async () => {
   
    if(count ==3 ){
      setLoadingMessage("면접 결과 생성 중 입니다."); // 로딩 메시지 설정

    }else{
      setLoadingMessage("다음 질문 생성 중입니다. 잠시 기다려주세요."); // 로딩 메시지 설정

    }

    console.log(audio_key)
    console.log(cookies.get('itv_no'))
    console.log(count)
    var text_path = ''
    try {
      const stt_formData = new FormData();
      stt_formData.append('user_uuid',user_uuid);
      stt_formData.append('file_path',audio_key);
      stt_formData.append('itv_cnt',itv_cnt);
      const response = await post_stt(stt_formData);
      console.log(response);
      console.log('STT 끝');
      
      if(count ==3 ){
        setLoadingMessage("면접 결과 생성 중 입니다."); // 로딩 메시지 설정

      }else{
        setLoadingMessage("다음 질문 생성 중입니다. 잠시 기다려주세요."); // 로딩 메시지 설정

      }
      setTextPath(response.s3_file_path);
      text_path = response.s3_file_path;
      //질문 끝난 후 db에 post
      const newqs_formData = new FormData();
      newqs_formData.append('user_id',cookies.get('user_id'));
      newqs_formData.append('itv_no',cookies.get('itv_no'));
      newqs_formData.append('qs_no',count);
      newqs_formData.append('qs_content',frontQ);
      //newqs_formData.append('qs_video_url',`s3://simulation-userdata/${video_key}`);
      newqs_formData.append('qs_video_url',`${video_key}`);

      newqs_formData.append('qs_audio_url',`${audio_key}`);
      newqs_formData.append('qs_text_url',text_path);
      post_new_qs(newqs_formData);
      // Count 증가
      setCount(count + 1);
    } catch (error) {
      console.log(error);
    }

  try{
      // const chat_formData = new FormData();
      // chat_formData.append('answer_url',text_path);
      // chat_formData.append('itv_no',cookies.get('itv_no'));
      // chat_formData.append('question_number',count + 1);
      // const chat_response = await post_chat(chat_formData);
      // console.log(chat_response);
      // setchatQ(chat_response.response);
      if (count === 3) {
        const newqs_formData = new FormData();
        newqs_formData.append('user_id',cookies.get('user_id'));
        newqs_formData.append('itv_no',cookies.get('itv_no'));
        newqs_formData.append('qs_no',count);
        newqs_formData.append('qs_content',frontQ);
        newqs_formData.append('qs_video_url',`${video_key}`);
        newqs_formData.append('qs_audio_url',`${audio_key}`);
        newqs_formData.append('qs_text_url',text_path);
        await post_new_qs(newqs_formData);
        router.push('/report')
      }
      else{
        const chat_formData = new FormData();
        chat_formData.append('answer_url',text_path);
        chat_formData.append('itv_no',cookies.get('itv_no'));
        chat_formData.append('question_number',count + 1);
        const chat_response = await post_chat(chat_formData);
        console.log(chat_response);
        console.log(count);
        setchatQ(chat_response.response);
       

        console.log('다음 질문');
        console.log("next 전");
        console.log(chatQ);
        setFrontQ(chat_response.response);
        polly(chat_response.response);
        console.log("next 후");
      }
    } catch (error) {
      console.log(error);
    }
    // 로딩 메시지 해제 및 startNext 호출
      setLoadingMessage(null);
  };
//fetchSTT 끝


  useEffect(() => {
  if (start == 0) {
    polly(question);
    setStart(1);
  }
}, [start]);

  return (
    <div className="container mx-auto">
  <div className="my-8">
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-3xl font-semibold">면접 질문</h2>
      <div>
        {activeRecordings.map(recording => (
          <div key={recording.id}>
            <button
              onClick={() => clickStopButton(recording.id)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              END
            </button>
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-center gap-4 justify-center">
      {message && (
        <div className="text-center">
          <p className="text-red-500 text-xl font-bold">{message}</p>
        </div>
      )}
    </div>
    <div className="bg-gray-100 p-4 mb-8">
      <p className="text-lg">{frontQ}</p>
    </div>
  </div>
  <div className="relative">
    <div className="text-center text-white rounded-lg overflow-hidden shadow-xl aspect-w-16 aspect-h-9 max-w-5xl mx-auto">
      <ReactPlayer
        className="w-full h-auto mx-auto"
        url='https://www.youtube.com/embed/IFmto-5_oK8?si=7uAh7Lb7A8BLjIM0'
        width="960px"
        height="540px"
        muted={true}
        loop={true}
        playing={true}
        volume="0"
      />
    </div>
    <div style={{ display: 'none' }}>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        recorderControls={recorderControls}
      />
    </div>
    <div>
      {countdown !== null && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="text-center">
            <span className="block text-[10rem] font-bold text-white leading-none">
              {countdown}
            </span>
          </div>
        </div>
      )}
      {loadingMessage !== null && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
          <div className="text-center">
            <span className="block text-[3rem] font-bold text-white leading-none">
              {loadingMessage}
            </span>
          </div>
        </div>
      )}
    </div>
  </div>
  <div className="text-center mt-8">
    {activeRecordings.map(recording => (
      <div key={recording.id}>
        <h2>{recording.status}</h2>
        <video style={{ display: 'none' }} ref={recording.webcamRef} autoPlay muted />
      </div>
    ))}
  </div>
</div>



  );
};

export default Interview;
