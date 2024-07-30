'use client';
import React from "react";

const With = () => {
  const images = [
    {
      src: "/with/spoid.png",
      link: "www.spoid.shop",
      description: "컴퓨터 견적의 최저가로 최적의 성능을 뽑아주는 Spoid 입니다. 여러 사이트의 가격 추세를 확인하고 알람을 통해 최저가로 견적 생성을 손쉽게 하세요!"
    },
    {
      src: "/with/dapanda.png",
      link: "awscloudschool.online",
      description: "네고에 지친 당신, DAPANDA에서 최적의 중고 거래를 경험해보세요. 경매의 재미와 다양한 물품 거래로 스트레스 없이 할 수 있는 중고거래, Welcome to DAPANDA!"
    },
    {
      src: "/with/quick.png",
      link: "quickcatch.store",
      description: "QuickCatch는 실시간 홈쇼핑 방송과 상품 정보, 그리고 해당 상품의 인터넷 최저가를 제공합니다. 또한, 알찬 리뷰 요약과 할인율 순위를 통해 최적의 쇼핑 환경을 제공합니다."
    },
    {
      src: "/with/placeholder.png",
      link: "placeholder-web.shop",
      description: "약속 코스를 생각하기 힘든 적, 놀러 가고 싶은 지역의 혼잡도가 궁금한 적이 있으셨나요? PlaceHolder는 매주 업데이트되는 인기 가게들로 AI가 혼잡도를 고려한 약속 코스를 만들어 드립니다! 원하는 지역과 테마를 선택해 코스를 자동으로 생성하고 혼잡도를 실시간으로 확인해보세요."
    },
    {
      src: "/with/mylittle.png",
      link: "book.mylittle.recipes",
      description: "1인 가구를 위한 스마트 요리 비서 My Little Recipe Book! 쉽고 빠른 레시피 검색, 인기 유튜브 요리 영상, 영양 정보, 냉장고 커스터마이징으로 유통기한 관리까지, 마리레와 함께 혼자서도 두렵지 않은 즐거운 요리를 경험하세요!"
    }
    // 필요한 만큼 사진 경로 추가
  ];

  return (
    <section className="flex items-center justify-center min-h-screen"> 
      <div>
        <h2 className="section-title mb-8 xl:mb-16 text-center mx-auto">
          With Page
        </h2>
        <div className="flex flex-col space-y-8">
          {images.map((image, index) => (
            <div key={index} className="flex items-start space-x-4">
              <img src={image.src} alt={`Photo ${index + 1}`} className="w-40 h-40 object-contain" />
              <div>
                <a href={`https://${image.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{image.link}</a>
                <p className="max-w-lg">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default With;
