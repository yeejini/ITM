'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

import { GanttChartSquare, Blocks, Gem } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"
 
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import useScrollProgress from '@/hooks/useScrollProgress';
const serviceData = [
  
  {
    icon: <GanttChartSquare size={72} strokeWidth={0.8} />,
    title: 'number1',
    Description: ''
  },
]

const Services = () => {

  const carouselRef = useRef(null);

  useEffect(() => {
    const autoplayInstance = Autoplay({
      delay: 2000, // 2초마다 자동으로 넘김
      stopOnInteraction: true, // 사용자 상호 작용 시 멈춤
    });

    if (carouselRef.current) {
      carouselRef.current.addPlugin(autoplayInstance);
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removePlugin(autoplayInstance);
      }
    };
  }, []);

  const completion = useScrollProgress();
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  
  return (
    <div className="flex">
      <section className="mb-12 xl:mb-36 flex-1">
        <div className="container mx-auto">
          <h2 className="section-title mb-12 xl:mb-24 text-center mx-auto">
            Service Introduction
          </h2>
          <div className="flex">
            <div className="w-full max-w-screen-sm mx-auto">
              <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
              >
                <CarouselContent>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                              src={`/service/service${index + 1}.png`}
                              alt={`Service Icon ${index + 1}`}
                              width={300} // 이미지 폭
                              height={300} // 이미지 높이
                              layout="responsive" // 반응형 레이아웃
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
            <div className="bg-blue-100 p-8">
            <h3 className="text-xl font-semibold mb-2">"step1. 관심 직무를 적어주세요!"</h3>
              <p className="text-lg mb-11">
                관심 직무를 적어주시면 실제 면접과 가까운 질문을 제공해 드려요! 
                정확성이 높은 질문을 받기 위해 면접 직전, 관심직무를 적어주세요.
              </p>
              <h3 className="text-xl font-semibold mb-2">"step2. 자소서 기반 면접 시뮬레이션 제공"</h3>
              <p className="text-lg mb-11">
                실제 면접처럼 자소서를 기반으로 AI면접관이 직접 질문을 합니다.
                답변을 직접 작성할 필요없이, 간편하게 음성으로 답변해주시면 됩니다.
              </p>
              <h3 className="text-xl font-semibold mb-2">step3. 연계 질문으로 퀄리티 UP!</h3>
              <p className="text-lg mb-11">
                답변한 질문을 기반으로 3번정도의 연계질문을 제시합니다. 
                실제 면접과 같은 분위기를 느낄 수 있어요!
              </p>
              <h3 className="text-xl font-semibold mb-2">"step4. 결과 레포트 제공"</h3>
              <p className="text-lg">
                제공한 면접 질문에 대해 직접 답변한 내용을 결과 레포트를 제공해드려요!
                모의 면접 후에도 손쉽게 My Page에서 볼 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Services