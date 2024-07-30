'use client';
import React, { useEffect, useState } from "react";
import "../globals.css";
import DevImg from '../../components/Devlmg';
import { Button } from "../../components/ui/button";
import { useRouter  } from 'next/navigation';
import { Cookies } from 'react-cookie';
import { postCV } from "../api";
import { ConstructionIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"; // 필요한 모듈 import


const Information = () => {
  const [loadingMessage, setLoadingMessage] = useState(null); // 로딩 메시지 상태 추가
  const [showDialog, setShowDialog] = useState(false); // 모달 상태 추가
  const cookies = new Cookies();
  const [start, setStart] = useState(0);
  const [cvLoaded, setCvLoaded] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });
  const [disabled, setDisabled] = useState(true);
  const router = useRouter();

  const handleButton = (event) => {
    router.push("/interview");
  };

  const handleBack = () => {
    router.push("/custom");
  };

  useEffect(() => {
    setLoadingMessage("질문 생성 중입니다. 잠시 기다려주세요."); // 로딩 메시지 설정

    const fetchData = async () => {
      try {
        const newCV_formData = new FormData();
        newCV_formData.append('coverletter_url', cookies.get('coverletter_url'));
        newCV_formData.append('position', cookies.get('position'));
        newCV_formData.append('itv_no', cookies.get('itv_no'));
        const response = await postCV(newCV_formData);

        console.log(response);
        console.log(response.status);

        
        if (response.status === 200) {
          setCvLoaded(true);
          setLoadingMessage("개인정보 동의를 한 후, start버튼을 누르면 시작됩니다."); // 로딩 메시지 설정

          // 쿠키에 데이터 저장
          cookies.set('simul_info', response.response);
          cookies.set('simul_ques', response.response);
        } else {
          setShowDialog(true); // 모달 띄우기
        }
      } catch (error) {
        console.log(error);
        setShowDialog(true); // 에러 발생 시 모달 띄우기
      }
    };

    if (start === 0) {
      setStart(1);
      fetchData();
    }
  }, [start]);


  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [id]: checked,
    }));
  };

  useEffect(() => {
    const allChecked = Object.values(checkboxes).every((value) => value);
    setDisabled(!(cvLoaded && allChecked));
  }, [checkboxes, cvLoaded]);

  return (
    <section className="min-h-screen pt-12">
      <div className="container mx-auto">
        <h1 className="section-title mb-8 xl:mb-8 text-center mx-auto"> 
          Information 
        </h1>
        <h3 className="h2 mb-16 text-center custom-font text-red-500">
        {loadingMessage}
        </h3>
        <div>
          <p className="font-bold text-xl mb-4">아래의 안내사항을 잘 읽고 참여해주세요!</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-md text-left mb-16">
          <p className="h4 font-bold text-lg mb-4">모의 면접 도중, 새로고침과 뒤로가기 불가합니다! 이 점 꼭 유의 해주세요.</p>
          <p className="font-bold text-lg mb-4">1. 면접 질문이 끝나면 3초의 시간이 주어집니다. 3초 후에 답해주세요!</p>
          <p className="font-bold text-lg mb-4">2. 첫 번째 질문에는 자소서를 기반으로 질문이 제공되며, 그 후는 본인이 대답한 내용에 대한 추가 질문이 주어집니다.</p>
          <p className="font-bold text-lg mb-4">3. 질문에 대답하지 못할 경우, 자소서 기반의 새로운 주제의 질문이 주어집니다.</p>
          <p className="font-bold text-lg">4. 답변을 완료하면 END 버튼을 꼭 눌러주세요!</p>
        </div>
        <div className="bg-blue-50 p-8 rounded-md text-left mb-10 flex items-center">
          <div className="flex-1">
            <p className="font-bold text-xl mb-4">개인 정보 동의(필수)</p>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="checkbox1" 
                  className="mr-2" 
                  checked={checkboxes.checkbox1}
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="checkbox1" className="text-sm">
                  개인 정보 동의
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="checkbox2" 
                  className="mr-2" 
                  checked={checkboxes.checkbox2}
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="checkbox2" className="text-sm">
                  카메라 녹화 허용
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="checkbox3" 
                  className="mr-2" 
                  checked={checkboxes.checkbox3}
                  onChange={handleCheckboxChange} 
                />
                <label htmlFor="checkbox3" className="text-sm">
                  비디오 녹화 허용
                </label>
              </div>
              <div><p>수집된 데이터는 3년 뒤 자동 삭제될 예정입니다.</p></div>
            </div>
          </div>
          <div className="hidden xl:flex relative">
            <DevImg 
              containerStyles='w-[300px] h-[300px] bg-no-repeat relative bg-bottom'
              imgSrc='/information/agreeimg.png'/>
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleButton} disabled={disabled} className='gap-x-2 py-3 px-6 text-lg'>
            Start
          </Button>
        </div>
      </div>
      {showDialog && (
        <Dialog open={showDialog}>
          <DialogContent className="sm:max-w-[750px]">
            <DialogHeader>
              <DialogTitle className="text-2xl text-red-500">자기소개서 업로드 ERROR!</DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-center py-10 text-xl">
            자기소개서 내용이 너무 짧거나
            관심 직무와 관련이 없는 내용 입니다.<br/>
            올바른 질문 생성을 위해 자기소개서를 다시 업로드 해주세요.
            </DialogDescription>
            <DialogFooter className="flex justify-center">
                <Button onClick={handleBack} className="py-3 px-6 text-lg">Back</Button>
            
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};


export default Information;
