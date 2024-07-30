'use client';
import DevImg from '../../components/Devlmg';
import Badge from "../../components/Badge";
import { useState, useRef, useEffect } from 'react';
import VideoComponent from '../../components/videocomponent';
import { useRouter } from 'next/navigation'; // next/navigation에서 useRouter를 가져옴
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RiBriefcase4Fill, RiTeamFill, RiTodoFill } from "react-icons/ri";
import { Cookies } from "react-cookie";
import { getItv_cnt, postItv, uploadFileToS3 } from "../api";

const CustomDialog = () => {
  const cookies = new Cookies();
  const user_id = cookies.get('user_id');
  const [step, setStep] = useState(1);
  const [job, setJob] = useState("");
  const [file, setFile] = useState(null);
  const router = useRouter();
  const [error, setError] = useState("");


  useEffect(() => {
    // 로그인 여부 확인
    if (!user_id) {
      router.push('/login'); // 로그인 되어 있지 않으면 로그인 페이지로 리다이렉트
    }
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때 한 번만 실행되도록 설정
  
  const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  const allowedExtensions = /(\.txt|\.pdf|\.docx)$/i; // Exclude .hwp

  if (!allowedExtensions.exec(selectedFile.name)) {
    setError("Invalid file type. Only TXT, PDF, and DOCX files are allowed.");
    setFile(null);
    return;
  }

  setError("");
  setFile(selectedFile);
};
  
  const handleNext = () => {
    setStep(step + 1);
  };
  
  const handleSubmit = async () => {
    if (!file) {
      setError("파일을 선택해주세요.");
      return;
    }

    console.log(file);
    console.log(user_id);
    //int_cnt get 
    const itv_cnt = await getItv_cnt(user_id);
    console.log(itv_cnt.new_itv_cnt);
    console.log(itv_cnt.new_itv_cnt + 1);
    cookies.set('itv_cnt', itv_cnt.new_itv_cnt + 1);

    const s3_formData = new FormData();
    s3_formData.append('file', file);
    // s3_formData.append('user_id',user_id);
    s3_formData.append('itv_cnt', itv_cnt.new_itv_cnt + 1);
    s3_formData.append('user_uuid',cookies.get("user_uuid"));
    const file_path = await uploadFileToS3(s3_formData);
    console.log(file_path);
    const newitv_formData = new FormData();
    newitv_formData.append('user_id',user_id);
    newitv_formData.append('itv_text_url',file_path);
    newitv_formData.append('itv_job',job);
    newitv_formData.append('itv_cate','자소서');
    const response = await postItv(newitv_formData);

    console.log(response);
    cookies.set('itv_no', response.new_itv_no);
    cookies.set('coverletter_url', file_path);
    cookies.set('position', job);

    router.push('/information');

    
  };
   // 파일 선택 여부에 따라 SUBMIT 버튼 활성화/비활성화 처리
   const isSubmitDisabled = !file || error !== "";

 

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
        className='absolute w-[20vw] h-[20vh] text-lg' 
        style={{ 
          top: '60%', 
          left: '12%', 
          transform: 'translate(-40%, -2%)',
          backgroundColor: 'transparent', 
          border: '2px solid transparent', 
          color: 'transparent'
          }}></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          {step === 1 ? (
            <>
              <DialogTitle>관심 직무를 입력해주세요.</DialogTitle>
              <DialogDescription>
                예시: 클라우드 엔지니어
              </DialogDescription>
            </>
          ) : (
            <DialogTitle>자기소개서 파일을 첨부해주세요.</DialogTitle>
          )}
        </DialogHeader>
        {step === 1 ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="job" className="text-right">
                관심 직무
              </Label>
              <Input
                id="job"
                onChange={(e) => setJob(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              파일 첨부
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {file && <div>Selected File: {file.name}</div>}
        
          </div>
        )}
        <DialogFooter>
          {step === 1 ? (
            <Button onClick={handleNext}>NEXT</Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isSubmitDisabled}>SUBMIT</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const Custom = () => {
  return (
    // <section className='py-12 xl:py-24 h-[84vh] xl:pt-28 bg-hero bg-no-repeat bg-bottom bg-cover dark:bg-none'>
    //   <div className='container mx-auto'>
    //     <div className='flex justify-between gap-x-8'>
    //       <div>
    //         <div className='text-sm uppercase font-semibold mb-4 text-primary tracking-[4px]'>
    //           Web Service
    //         </div>
    //         <h1 className="section-title mb-8 xl:mb-16 text-center mx-auto">
    //           자소서 기반 면접 Service
    //         </h1>

    //         <p className='subtitle max-w-[490px] mx-auto xl:mx-0'>
    //         "아래 스타트 버튼을 눌러서 시작하세요!"
            
    //         </p>
    //         <div>
    //           <CustomDialog />
    //         </div>
    //       </div>
    //       <div className='hidden xl:flex relative'>
    //         <Badge 
    //           containerStyles='absolute top-[24%] -left-[5rem]'
    //           icon={<RiBriefcase4Fill />}
    //           endCountNum={3}
    //           badgeText={'Best Service'}
    //         />
    //         <Badge 
    //           containerStyles='absolute top-[80%] -left-[1rem]'
    //           icon={<RiTodoFill />}
    //           endCountNum={6}
    //           endCountText='k'
    //           badgeText={'Like Number'}
    //         />
    //         <Badge 
    //           containerStyles='absolute top-[55%] -right-8'
    //           icon={<RiTeamFill />}
    //           endCountNum={9}
    //           endCountText='k'
    //           badgeText={'Happy Clients'}
    //         />

    //         <div className='bg-hero_shape2_dark dark:bg-hero_shape2_light w-[500px] h-[500px] bg-no-repeat absolute -top-1 -right-2 bg-opacity-50'></div>
    //         <DevImg 
    //           containerStyles=' w-[700px] h-[450px] bg-no-repeat relative bg-bottom'
    //           imgSrc='/custom/custom.png'/>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  //   <div className="flex justify-center items-center overflow-hidden h-[95vh]">
  //   <video src="/mp4/custom.mp4" height="90vh" autoPlay muted loop />
  // </div>
  <div className="relative flex justify-center items-center overflow-hidden h-[95vh]">
  <VideoComponent />
  <CustomDialog />
</div>
  );
};

export default Custom;
