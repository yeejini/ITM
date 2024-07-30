import { useEffect } from 'react';


const useConfirmPageLeave = () => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      return '면접 내용이 모두 사라지며, 녹화기록도 모두 사라집니다. 계속하시겠습니까?';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
};

export default useConfirmPageLeave;