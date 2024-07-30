import { useEffect, useRef } from 'react';

const VideoComponent = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    const handleVideoEnd = () => {
      // 비디오의 마지막 프레임에서 멈추게 합니다.
      video.currentTime = video.duration;
    };

    // 비디오가 끝났을 때 이벤트 리스너 추가
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, []);

  return (
    <div className="flex justify-center items-center overflow-hidden h-[95vh]">
      <video
        ref={videoRef}
        src="/mp4/im-store.mp4"
        height="90vh"
        autoPlay
        muted
      />
    </div>
  );
};

export default VideoComponent;
