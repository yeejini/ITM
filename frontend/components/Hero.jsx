import Link from 'next/link'
import { Button } from './ui/button'
import { Download, Send } from 'lucide-react';
import { Badge } from "./ui/badge"


import {
  RiBriefcase4Fill,
  RiTeamFill,
  RiTodoFill,
  RiArrowDownSLine,
} from 'react-icons/ri';

import DevImg from './Devlmg';

import Socials from './Socials';



const Hero = () => {
  return (
    // <section className='py-12 xl:py-24 h-[84vh] xl:pt-28 bg-hero bg-no-repeat bg-bottom bg-cover dark:bg-none'>
    //   <div className='container mx-auto'>
    //     <div className='flex justify-between gap-x-8'>
    //       <div>
    //         <div className='text-sm uppercase font-semibold mb-4 text-primary tracking-[4px]'>
    //           Interview Master
    //         </div>
    //         <h1 className='h1 mb-4'>
    //           {/* Welcome to <span className='block'>InterviewMaster</span> */}
    //           AI 모의 면접
    //         </h1>
    //         <p className='subtitle max-w-[490px] mx-auto xl:mx-0'>
    //           지금 바로 시작하세요!
    //         </p>
    //         <div>
            
    //           <Link href='/login'>
    //             <Button className='gap-x-10'>
    //               Start<Send size={18}/>
    //               </Button>
    //           </Link>
    //           <div className='mb-4'>
    //   <Badge size="large" variant="default">#자소서 기반</Badge>
    //   <Badge size="xl" variant="secondary">#꼬리 질문</Badge>
    //   <Badge size="xl" variant="secondary">#면접 합격</Badge>
    // </div>
             
    //         </div>
    //       </div>
    //       <div className='hidden xl:flex relative'>
    //         <div className='bg-hero_shape2_dark dark:bg-hero_shape2_light w-[500px] h-[500px] bg-no-repeat absolute -top-1 -right-2 bg-opacity-50'></div>
    //         <DevImg 
    //           containerStyles=' w-[500px] h-[450px] bg-no-repeat relative bg-bottom'
    //           imgSrc='/hero/maininterview.png'/>
    //       </div>
        
    //     </div>
    //       <div className='hidden md:flex absolute left-2/4 bottom-44 xl:bottom-12 animate-bounce'>
    //         <RiArrowDownSLine className='text-3xl text-primary' />
    //       </div>
    //   </div>
    // </section>

    <div className="flex justify-center items-center overflow-hidden h-[95vh]">
  <video src="/mp4/Interview.mp4" height="90vh" autoPlay muted loop />
</div>

  );
};
export default Hero
