'use client';
import DevImg from "./Devlmg";
import { useRouter } from 'next/navigation'; // next/navigation에서 useRouter를 가져옴
import { Cookies } from "react-cookie";

const About = () => {
  const router = useRouter();
  const cookies = new Cookies();
  
  const handleStartInterview = () => {
    const user_id = cookies.get('user_id');
    if (user_id) {
      router.push('/custom');
    } else {
      router.push('/login');
    }
  };

  return ( 
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                AI 모의 면접으로 취업 준비를 시작하세요.
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                AI 기반 모의 면접 서비스로 실전 면접 실력을 키워보세요. 꼬리 질문과 답변에 대한 결과를 바탕으로 스스로 피드백이 가능하며, 이를 통해 면접 스킬을 향상 시킬 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <button
                onClick={handleStartInterview}
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                모의 면접 시작하기
              </button>
            </div>
          </div>
          <div className="hidden xl:flex flex-1 relative">
            <DevImg 
              containerStyles='bg-about_shape_dark dark:bg-avout_shape_dark w-[505px] h-[505px] bg-no-repeat relative' 
              imgSrc='/about/about.png' 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
