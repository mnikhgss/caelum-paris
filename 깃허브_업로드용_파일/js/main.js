/**
 * VENDÔME PARIS — Haute Couture Showcase & Interactive Runway Engine
 * Multi-Angle Catwalk Views, 9 Luxury Disciplines, Macro Loupe & 3D Colorways,
 * In-Site Luxury Salon Booking Modal & Silk Physics Atelier
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    initStationSync();
    initCurtainDrawer();
    initAudioEngine();
    initTimelineClicks();
    initColorwaySwitcher();
    initRunwayAngleSwitcher();
    initLoupeZoom();
    initRoyalFinale();
    initBookingModal();
    initSilkAtelierModal();
  });

  /* ==========================================================================
     1. Station Database & Floating Showcase Overlay
     ========================================================================== */
  const stationData = {
    scarf: {
      num: "01 / 08",
      title: "N° 01 — L'ÉCHARPE MAGIQUE",
      desc: "공기를 가르는 실크의 유동성. 순백의 갤러리 속에 부유하는 에르메스급 실크 카레.",
      curtain: {
        title: "L'Écharpe Magique en Twill de Soie",
        subtitle: "프랑스 리옹 아틀리에 수작업 에르메스급 실크 트윌 14모메",
        image: "assets/images/silk-scarf-pattern.jpg",
        description: "프랑스 리옹의 전통 직조 방식을 그대로 계승한 최고급 뮬베리 실크 트윌(Silk Twill). 바로크 양식의 골든 체인과 에메랄드 깃털 모티프가 허공에서 부유하며 빛의 각도에 따라 입체적인 텍스처를 드러냅니다. 마법의 양탄자처럼 유연하게 흐르는 곡면 물리를 감상하십시오.",
        specs: [
          { label: "원단 소재", val: "100% 멀버리 실크 트윌 (14 Momme)" },
          { label: "마감 기법", val: "프랑스 장인 수작업 루로테(Roulotté) 핸드 롤링" },
          { label: "염색 공정", val: "천연 식물성 및 미네랄 안료 스크린 프린트" },
          { label: "규격", val: "90 × 90 cm 정사각 카레 (Carré)" },
          { label: "원산지", val: "프랑스 리옹 (Made in France)" }
        ],
        looks: [
          {
            name: "Look 01 · 바로크 실크 카레",
            title: "L'Écharpe Magique en Twill de Soie",
            subtitle: "프랑스 리옹 아틀리에 수작업 에르메스급 실크 트윌 14모메",
            image: "assets/images/silk-scarf-pattern.jpg",
            desc: "프랑스 리옹의 전통 직조 방식을 그대로 계승한 최고급 뮬베리 실크 트윌. 바로크 양식의 골든 체인과 에메랄드 깃털 모티프가 허공에서 부유하며 빛의 각도에 따라 입체적인 텍스처를 드러냅니다.",
            specs: [
              { label: "원단 소재", val: "100% 멀버리 실크 트윌 (14 Momme)" },
              { label: "마감 기법", val: "프랑스 장인 수작업 루로테(Roulotté) 핸드 롤링" },
              { label: "규격", val: "90 × 90 cm 정사각 카레 (Carré)" }
            ]
          },
          {
            name: "Look 02 · 모노그램 캔버스 에디션 (Toile Céleste)",
            title: "Carré de Soie & Bracelet Astral Céleste",
            subtitle: "100% 실크 트윌 모노그램 캔버스 & 18K 룬문자 오비탈 뱅글 세트",
            image: "assets/images/caelum_pattern_accessory_studio.png",
            desc: "카일룸의 4대 상징 모티브(C-궤도, 북극성 솔리테어, 로장주 다이아몬드, 궤도 플라워)가 황금비율로 배치된 90x90cm 실크 트윌 스카프와 그 위에 안착한 18K 솔리드 골드 엘프 룬문자 오비탈 뱅글의 조화로운 세트 컬렉션.",
            specs: [
              { label: "스카프 소재", val: "100% 리옹산 실크 트윌 (Toile Céleste 스크린 프린트)" },
              { label: "주얼리", val: "18K 솔라 옐로우 골드 & 4방위 바게트 다이아몬드 베젤 세팅" },
              { label: "인그레이빙", val: "절대반지 엘프 룬문자 내외부 듀얼 마이크로 레이저 각인" },
              { label: "세트 구성", val: "카일룸 오렌지-골드 기프트 박스 & 시리얼 보증서 포함" }
            ]
          }
        ]
      }
    },
    coat: {
      num: "02 / 08",
      title: "N° 02 — LE MANTEAU RUNWAY",
      desc: "아이보리 캐시미어와 리퀴드 골드 자수가 빚어내는 런웨이 실루엣.",
      curtain: {
        title: "Le Manteau Sculptural en Cachemire",
        subtitle: "아이보리 캐시미어 & 리퀴드 골드 자수 꾸뛰르 코트",
        image: "assets/images/runway-coat-white.jpg",
        description: "런웨이 모델의 역동적인 워킹에 맞춰 실루엣을 바꾸는 오뜨 꾸뛰르 코트. 최고급 몽골산 화이트 캐시미어와 리퀴드 골드 와이어를 입체 자수하여 걸을 때마다 황금빛 굴절이 웅장하게 흐릅니다.",
        specs: [
          { label: "원단 소재", val: "100% 몽골산 화이트 캐시미어 & 실크 안감" },
          { label: "자수 공법", val: "24K 리퀴드 골드 메탈릭 자수 & 핸드 플리츠" },
          { label: "제작 시간", val: "수석 테일러 장인 1인 전담 280시간" },
          { label: "핏", val: "신체 3D 스캔 기반 비스포크 아키텍처럴 실루엣" },
          { label: "쇼케이스", val: "2026 파리 패션위크 런웨이 오프닝 룩" }
        ],
        looks: [
          {
            name: "Look 01 · 런웨이 코트",
            title: "Le Manteau Sculptural en Cachemire",
            subtitle: "아이보리 캐시미어 & 24K 리퀴드 골드 자수 꾸뛰르 코트",
            image: "assets/images/runway-coat-white.jpg",
            desc: "런웨이 모델의 역동적인 워킹에 맞춰 실루엣을 바꾸는 오뜨 꾸뛰르 코트. 최고급 몽골산 화이트 캐시미어와 리퀴드 골드 와이어를 입체 자수하여 걸을 때마다 황금빛 굴절이 웅장하게 흐릅니다.",
            specs: [
              { label: "원단 소재", val: "100% 몽골산 화이트 캐시미어 & 실크 안감" },
              { label: "자수 공법", val: "24K 리퀴드 골드 메탈릭 자수 & 핸드 플리츠" },
              { label: "제작 시간", val: "수석 테일러 장인 1인 전담 280시간" },
              { label: "핏", val: "신체 3D 스캔 기반 비스포크 아키텍처럴 실루엣" }
            ]
          },
          {
            name: "Look 02 · 이브닝 드레스",
            title: "La Robe du Soir en Mousseline de Soie",
            subtitle: "순백의 실크 시폰 & 유체 크롬 코르셋 조각 드레스",
            image: "assets/images/evening-gown-white.jpg",
            desc: "순백의 갤러리 허공에 부유하는 오뜨 꾸뛰르 이브닝 가운. 유동하는 액체 크롬 코르셋이 인체의 유기적 곡선을 감싸며 공기처럼 가볍고 조각적인 실루엣을 완성합니다.",
            specs: [
              { label: "원단 소재", val: "프랑스 리옹산 100% 퓨어 실크 시폰 (Silk Chiffon)" },
              { label: "코르셋 조각", val: "경량 항공 알루미늄 단조 & 3중 리퀴드 크롬 미러 폴리싱" },
              { label: "드레이핑", val: "무봉제 입체 재단 핸드 드레이핑 180시간" },
              { label: "원산지", val: "프랑스 파리 오뜨 꾸뛰르 살롱 (Made in Paris)" }
            ]
          },
          {
            name: "Look 03 · 모노그램 런웨이 케이프 (Toile Céleste)",
            title: "Le Manteau à Doublure Toile Céleste",
            subtitle: "아이보리 캐시미어 & 카일룸 4대 시그니처 모노그램 실크 안감 케이프",
            image: "assets/images/caelum_pattern_couture_studio.png",
            desc: "카일룸의 4대 상징 모티브(C-궤도, 북극성 솔리테어, 로장주 다이아몬드, 궤도 플라워)를 자카드 직조한 천체 실크 안감과 아이보리 더블페이스 캐시미어가 결합된 런웨이 케이프.",
            specs: [
              { label: "원단 소재", val: "100% 퓨어 베이비 캐시미어 & 카일룸 모노그램 실크 자카드 안감" },
              { label: "시그니처 패턴", val: "카일룸 4대 모티브 (Toile Céleste) 24K 골드 자수" },
              { label: "클로저", val: "목선 솔리드 18K L'Anneau Céleste 회전형 하드웨어 브로치" },
              { label: "제작 공방", val: "파리 오뜨 꾸뛰르 아틀리에 수석 테일러 310시간" }
            ]
          }
        ]
      }
    },
    bag: {
      num: "03 / 08",
      title: "N° 03 — LE SAC SELLERIE",
      desc: "수작업 새들 스티치 카프스킨과 24K 골드 하드웨어의 명품 백.",
      curtain: {
        title: "Le Sac d'Apparat en Cuir Sellier",
        subtitle: "에르메스급 새들 스티치 카프스킨 & 24K 골드 하드웨어",
        image: "assets/images/luxury-handbag-white.jpg",
        description: "전통 승마 마구(Sellerie) 제작 기법인 양손 새들 스티치로 완성된 구조적 레더 백. 최상위 등급 토뤼옹 카프스킨의 촉촉한 질감과 거울처럼 연마된 24K 골드 잠금 버클이 완벽한 균형을 이룹니다.",
        specs: [
          { label: "가죽 소재", val: "프랑스산 풀그레인 토뤼옹 카프스킨 (Taurillon)" },
          { label: "스티치 기법", val: "밀랍 린카블레(Fil Au Chinois) 양손 수작업 새들 스티치" },
          { label: "하드웨어", val: "단조 황동 베이스 24K 옐로우 골드 트리플 도금" },
          { label: "제작 공방", val: "프랑스 파리 장인 전담 아틀리에 (1인 1백 완성)" },
          { label: "인증", val: "장인 고유 인장 및 넘버링 영구 보증서" }
        ],
        looks: [
          {
            name: "Look 01 · 셀리에 토뤼옹 백",
            title: "Le Sac d'Apparat en Cuir Sellier",
            subtitle: "에르메스급 새들 스티치 카프스킨 & 24K 골드 하드웨어",
            image: "assets/images/luxury-handbag-white.jpg",
            desc: "전통 승마 마구(Sellerie) 제작 기법인 양손 새들 스티치로 완성된 구조적 레더 백. 최상위 등급 토뤼옹 카프스킨의 촉촉한 질감과 거울처럼 연마된 24K 골드 잠금 버클이 완벽한 균형을 이룹니다.",
            specs: [
              { label: "가죽 소재", val: "프랑스산 풀그레인 토뤼옹 카프스킨 (Taurillon)" },
              { label: "스티치 기법", val: "밀랍 린카블레 양손 수작업 새들 스티치" },
              { label: "하드웨어", val: "단조 황동 베이스 24K 옐로우 골드 트리플 도금" },
              { label: "제작 공방", val: "프랑스 파리 장인 전담 아틀리에 (1인 1백 완성)" }
            ]
          },
          {
            name: "Look 02 · 모노그램 캔버스 백 (Toile Céleste)",
            title: "Le Sac d'Apparat en Toile Céleste",
            subtitle: "캐비어 블랙 카프스킨 캔버스 & 24K 골드 시그니처 4대 모티브 엠보스",
            image: "assets/images/caelum_pattern_bag_studio.png",
            desc: "루이비통의 모노그램 캔버스 전통을 카일룸의 천체 기하학으로 재해석한 아이코닉 백. 4대 상징 모티브 엠보싱 캔버스와 중앙의 3축 자이로스코픽 18K 골드 회전 잠금쇠가 조화를 이룹니다.",
            specs: [
              { label: "캔버스 소재", val: "카일룸 시그니처 엠보스드 캐비어 카프스킨 (Toile Céleste)" },
              { label: "잠금 장치", val: "솔리드 18K 솔라 골드 L'Anneau Céleste 3축 회전 잠금 버클" },
              { label: "핸들 마감", val: "핸드 스티치드 롤드 레더 탑 핸들 & 탈부착 숄더 스트랩" },
              { label: "내부 구성", val: "샤모아 스웨이드 안감, 지퍼 포켓 및 고유 넘버링 메탈 플레이트" }
            ]
          }
        ]
      }
    },
    jewelry: {
      num: "04 / 08",
      title: "N° 04 — LA HAUTE PARURE",
      desc: "무중력 공간 속에서 영원히 자전하는 플래티넘과 에메랄드 초커.",
      curtain: {
        title: "L'Orbe Gyroscopique en Platine",
        subtitle: "무마찰 자전하는 플래티넘 리본과 콜롬비아산 에메랄드 초커",
        image: "assets/images/choker-white.jpg",
        description: "우주 자이로스코프 메커니즘에서 착안한 키네틱 하이 주얼리. 쇄골의 미세한 맥박에도 플래티넘 리본이 부드럽게 회전하며, 중앙의 무결점 에메랄드가 극적인 빛의 산란(Caustics)을 만들어냅니다.",
        specs: [
          { label: "메탈", val: "플래티넘 950 (Pt 950)" },
          { label: "메인 스톤", val: "4.20캐럿 콜롬비아 무오일 천연 에메랄드" },
          { label: "파베 세팅", val: "DEF 컬러 VVS1 엑설런트 컷 다이아몬드 184p" },
          { label: "회전 베어링", val: "무마찰 지르코니아 세라믹 마이크로 베어링" },
          { label: "에디션", val: "전 세계 3점 한정 피스 유니크" }
        ],
        looks: [
          {
            name: "Piece 01 · 키네틱 초커",
            title: "L'Orbe Gyroscopique en Platine",
            subtitle: "무마찰 자전하는 플래티넘 리본과 콜롬비아산 에메랄드 초커",
            image: "assets/images/choker-white.jpg",
            desc: "우주 자이로스코프 메커니즘에서 착안한 키네틱 하이 주얼리. 쇄골의 미세한 맥박에도 플래티넘 리본이 부드럽게 회전하며, 중앙의 무결점 에메랄드가 극적인 빛의 산란(Caustics)을 만들어냅니다.",
            specs: [
              { label: "메탈", val: "플래티넘 950 (Pt 950)" },
              { label: "메인 스톤", val: "4.20캐럿 콜롬비아 무오일 천연 에메랄드" },
              { label: "파베 세팅", val: "DEF 컬러 VVS1 다이아몬드 184p" },
              { label: "에디션", val: "전 세계 3점 한정 피스 유니크" }
            ]
          },
          {
            name: "Piece 02 · 솔리테어 링",
            title: "Le Solitaire Étoile Filante",
            subtitle: "5.12캐럿 콜롬비아 에메랄드 & 플래티넘 마이크로 오픈워크 링",
            image: "assets/images/diamond-ring-white.jpg",
            desc: "기하학적 건축 구조의 플래티넘 950 밴드 중앙에 5캐럿 무오일 천연 콜롬비아 에메랄드를 공중 부유 세팅하여, 빛의 굴절과 무지갯빛 프리즘 분산을 극대화한 하이 주얼리 링.",
            specs: [
              { label: "메탈 소재", val: "플래티넘 950 (Pt 950) 핸드 폴리싱" },
              { label: "메인 스톤", val: "5.12 ct 에메랄드 컷 무오일 에메랄드 (GIA)" },
              { label: "세팅 기법", val: "기하학적 오픈워크 다이아몬드 파베 96p" },
              { label: "원산지", val: "프랑스 파리 아틀리에 카일룸 (Atelier Caelum Paris 1888)" }
            ]
          },
          {
            name: "Piece 03 · 시그니처 뱅글",
            title: "Le Bracelet Astral d'Or (18K)",
            subtitle: "파리 아틀리에 카일룸 단조 18K 솔라 골드 & 천체 룬문자 각인",
            image: "assets/images/signature-bangle-white.jpg",
            desc: "카일룸(CAELUM)의 전 컬렉션을 관통하는 궤도이자 시그니처 하이 주얼리. 무한한 천체 궤도를 유영하는 초슬림 18K 솔리드 골드 밴드 위에 황금빛으로 타오르는 천체 엘프 룬문자를 정밀 각인하고 4방위에 최상위 바게트 다이아몬드를 베젤 세팅했습니다.",
            specs: [
              { label: "메탈 소재", val: "18K 옐로우 골드 750 (초슬림 고탄성 단조 공법)" },
              { label: "인그레이빙", val: "고대 엘프(Tengwar) 룬문자 황금빛 발광 인레이" },
              { label: "세팅 스톤", val: "바게트 컷 다이아몬드 4p (총 1.20 ct, VVS1)" },
              { label: "마감 기법", val: "미러 폴리싱 & 핸드 밀그레인 인그레이빙" }
            ]
          }
        ]
      }
    },
    eyewear: {
      num: "05 / 08",
      title: "N° 05 — L'OPTIQUE SOLAIRE",
      desc: "단조 티타늄과 앰버 그라디언트 렌즈의 조각적 럭셔리 아이웨어.",
      curtain: {
        title: "L'Optique Sculpturale en Titane",
        subtitle: "단조 베타 티타늄 & 앰버 그라디언트 조각적 럭셔리 선글라스",
        image: "assets/images/couture-eyewear-white.jpg",
        description: "현대 건축물의 미니멀리즘에서 영감을 받은 구조적 아이웨어. 나사 없이 일체형으로 정밀 가공된 티타늄 림과 자연광의 자외선을 완벽 차단하는 수공예 앰버 그라디언트 렌즈가 인상적인 하이패션 무드를 완성합니다.",
        specs: [
          { label: "프레임 소재", val: "일본 후쿠이산 단조 베타 티타늄 (무게 14g)" },
          { label: "렌즈", val: "독일 칼자이스(ZEISS) 특주 앰버 그라디언트 편광 렌즈" },
          { label: "마감", val: "매트 사틴 샌드블라스트 & 24K 골드 악센트" },
          { label: "코받침", val: "인체공학적 세라믹 노즈패드" },
          { label: "케이스", val: "풀그레인 레더 핸드메이드 하드케이스 포함" }
        ]
      }
    },
    flacon: {
      num: "06 / 08",
      title: "N° 06 — LE FLACON D'OR",
      desc: "순백의 공간 속에 부유하는 크리스탈 퍼퓸 플라콘과 골드 헤일로.",
      curtain: {
        title: "Le Flacon Solaire en Cristal",
        subtitle: "조각적 크리스탈 플라콘과 공중 부유 키네틱 골드 캡",
        image: "assets/images/perfume-flacon-white.jpg",
        description: "순백의 스튜디오 허공에 떠 있는 예술적 향수 플라콘. 천연 앰버 향수 원액과 빛의 굴절(Caustics)을 자아내는 핸드 블로운 크리스탈 돔, 그 위를 공전하는 키네틱 골드 헤일로가 조화를 이룹니다.",
        specs: [
          { label: "플라콘 소재", val: "프랑스 마스터 크리스탈 핸드 블로잉" },
          { label: "키네틱 캡", val: "24K 옐로우 골드 도금 티타늄 링" },
          { label: "향조 (Fragrance)", val: "그라스(Grasse) 천연 아이리스 & 앰버그리스" },
          { label: "용량", val: "100 ml 오 드 퍼퓸 (Extrait de Parfum)" },
          { label: "에디션", val: "연간 50병 넘버링 리미티드 수공예 보틀" }
        ]
      }
    },
    shoes: {
      num: "07 / 08",
      title: "N° 07 — LE SOULIER DE VERRE",
      desc: "광학 크리스탈 글래스와 리퀴드 크롬으로 조각된 오뜨 꾸뛰르 힐.",
      curtain: {
        title: "Le Soulier Sculptural en Cristal Optique",
        subtitle: "빛의 굴절을 극대화한 아키텍처럴 크리스탈 & 리퀴드 크롬 스틸레토",
        image: "assets/images/couture-shoes-white.jpg",
        description: "신데렐라의 유리 구두를 현대적 오뜨 꾸뛰르 건축학으로 재해석한 마스터피스. 광학 등급 크리스탈 글래스를 다면체로 수작업 패싯 연마하고, 유체역학적 리퀴드 크롬 힐을 일체화하여 걸음마다 바닥에 무지갯빛 프리즘 분산을 남깁니다.",
        specs: [
          { label: "힐 소재", val: "광학 고순도 크리스탈 글래스 (Optical Crystal)" },
          { label: "힐 구조", val: "초경량 티타늄 코어 & 3중 리퀴드 크롬 미러 피니시" },
          { label: "인솔", val: "충격 흡수 나노 젤 패딩 & 이탈리아산 소프트 램스킨" },
          { label: "굽 높이", val: "105 mm 아키텍처럴 캔틸레버 실루엣" },
          { label: "에디션", val: "고객 발형 3D 스캔 기반 1:1 맞춤 제작 (Bespoke)" }
        ]
      }
    },
    trunk: {
      num: "08 / 08",
      title: "N° 08 — LA MALLE D'OR",
      desc: "황동 모서리 보강과 화이트 카프스킨으로 완성된 비스포크 주얼리 트렁크.",
      curtain: {
        title: "La Malle Haute Joaillerie en Cuir Blanc",
        subtitle: "1892년 프랑스 전통 트렁크 메이킹 비전 & 24K 솔리드 황동 피팅",
        image: "assets/images/luxury-trunk-white.jpg",
        description: "130년 넘게 이어온 파리 트렁크 장인의 정수가 담긴 이동식 하이 주얼리 금고. 방수 가공된 퓨어 화이트 토뤼옹 가죽 위에 수작업 리벳팅된 솔리드 브라스 코너와 특허 텀블러 자물쇠가 궁극의 럭셔리 유산을 증명합니다.",
        specs: [
          { label: "외장 가죽", val: "최상급 프랑스산 풀그레인 토뤼옹 카프스킨" },
          { label: "프레임", val: "30년 자연 건조 포플러(Poplar) 원목 아치 프레임" },
          { label: "하드웨어", val: "솔리드 단조 황동(Solid Brass) 핸드 폴리싱" },
          { label: "내장 마감", val: "초미세 마이크로파이버 벨벳 스웨이드 12단 서랍" },
          { label: "잠금 장치", val: "장인 수제작 비복제 멀티 텀블러 황동 락" }
        ]
      }
    },
    bangle: {
      num: "N° 00 · SIGNATURE",
      title: "LE BRACELET ASTRAL D'OR",
      desc: "방돔 파리의 상징. 18K 솔리드 골드와 안팎으로 빛나는 엘프 룬문자 뱅글.",
      curtain: {
        title: "Le Bracelet Astral d'Or (18K)",
        subtitle: "방돔 아틀리에 단조 18K 옐로우 골드 & 룬문자 안팎 정밀 각인, 4방위 바게트 다이아몬드",
        image: "assets/images/signature-bangle-white.jpg",
        description: "방돔 파리(VENDÔME)의 공식 시그니처 하이 주얼리. 반지의 제왕 절대반지에서 착안한 18K 솔리드 골드 밴드의 안쪽과 바깥쪽 표면 전체에 황금빛으로 타오르는 고대 엘프 룬문자(Tengwar)를 정밀 인그레이빙하고, 동서남북 4방위에 최상위 VVS1 바게트 다이아몬드를 마이크로 베젤 세팅했습니다.",
        specs: [
          { label: "메탈 소재", val: "18K 옐로우 골드 750 (초슬림 고탄성 단조 공법)" },
          { label: "인그레이빙", val: "Tengwar 고대 엘프 룬문자 안쪽 & 바깥쪽 전면 양각 인레이" },
          { label: "세팅 스톤", val: "바게트 컷 다이아몬드 4p (총 1.20 ct, D-E 컬러, VVS1)" },
          { label: "마감 기법", val: "미러 폴리싱 & 핸드 밀그레인(Milgrain) 인그레이빙" },
          { label: "각인 명문", val: "VENDÔME MDCCCXCII (1892) & 방돔 광장 장인 인장" },
          { label: "사이즈", val: "15 cm, 16.5 cm, 18 cm 비스포크 맞춤 조절" }
        ]
      }
    }
  };

  let currentActiveId = 'scarf';

  function initStationSync() {
    const cardEl = document.getElementById('story-card');
    const numEl = document.getElementById('story-num');
    const titleEl = document.getElementById('story-title');
    const descEl = document.getElementById('story-desc');
    const timelineSteps = document.querySelectorAll('.timeline-step');
    const silkBtn = document.getElementById('silk-atelier-btn');

    window.addEventListener('stationChanged', (e) => {
      const station = e.detail;
      const data = stationData[station.id];
      if (!data) return;

      currentActiveId = station.id;

      if (cardEl) {
        cardEl.style.opacity = '0.4';
        cardEl.style.transform = 'translateY(8px)';

        setTimeout(() => {
          if (numEl) numEl.innerText = data.num;
          if (titleEl) titleEl.innerText = data.title;
          if (descEl) descEl.innerText = data.desc;

          // Only display Silk Atelier button for Scarf station
          if (silkBtn) {
            silkBtn.style.display = (station.id === 'scarf') ? 'inline-flex' : 'none';
          }

          cardEl.style.opacity = '1';
          cardEl.style.transform = 'translateY(0)';
        }, 160);
      }

      timelineSteps.forEach(step => {
        if (step.getAttribute('data-id') === station.id) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
    });

    if (window.MaisonGallery3D && typeof window.MaisonGallery3D.getCurrentStation === 'function') {
      const st = window.MaisonGallery3D.getCurrentStation();
      if (st) {
        window.dispatchEvent(new CustomEvent('stationChanged', { detail: st }));
      }
    }
  }

  /* ==========================================================================
     2. Inspection Curtain Drawer
     ========================================================================== */
  function initCurtainDrawer() {
    const backdrop = document.getElementById('curtain-drawer');
    const closeBtn = document.getElementById('close-curtain');
    const inspectBtn = document.getElementById('inspect-current-btn');
    const curtainReserveBtn = document.getElementById('curtain-reserve-btn');
    const curtainSilkLabBtn = document.getElementById('curtain-silk-lab-btn');

    if (!backdrop) return;

    function openCurtain(id, preferredLookIdx = null) {
      const info = stationData[id] || stationData['scarf'];
      const c = info.curtain;

      document.getElementById('curtain-title').innerText = c.title;
      document.getElementById('curtain-subtitle').innerText = c.subtitle;
      document.getElementById('curtain-desc').innerText = c.description;

      const imgEl = document.getElementById('curtain-img');
      if (imgEl) {
        imgEl.src = c.image;
        imgEl.alt = c.title;
      }

      const specsWrap = document.getElementById('curtain-specs-wrap');
      if (specsWrap) {
        specsWrap.innerHTML = c.specs.map(s => `
          <div class="curtain-spec-row">
            <span class="curtain-spec-label">${s.label}</span>
            <span class="curtain-spec-val">${s.val}</span>
          </div>
        `).join('');
      }

      // Show/Hide Silk Lab shortcut button in curtain for scarf
      if (curtainSilkLabBtn) {
        curtainSilkLabBtn.style.display = (id === 'scarf') ? 'flex' : 'none';
      }

      // Lookbook Multi-Piece Switcher Pills
      const tabsWrap = document.getElementById('curtain-look-tabs');
      if (tabsWrap) {
        if (c.looks && c.looks.length > 1) {
          tabsWrap.innerHTML = c.looks.map((look, idx) => `
            <button class="curtain-look-tab ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
              ${look.name}
            </button>
          `).join('');
          tabsWrap.style.display = 'flex';

          const tabBtns = tabsWrap.querySelectorAll('.curtain-look-tab');
          tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              tabBtns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              const idx = parseInt(btn.getAttribute('data-idx'), 10);
              const look = c.looks[idx];
              if (!look) return;

              document.getElementById('curtain-title').innerText = look.title;
              document.getElementById('curtain-subtitle').innerText = look.subtitle;
              document.getElementById('curtain-desc').innerText = look.desc;
              if (imgEl) {
                imgEl.src = look.image;
                imgEl.alt = look.title;
              }
              if (specsWrap) {
                specsWrap.innerHTML = look.specs.map(s => `
                  <div class="curtain-spec-row">
                    <span class="curtain-spec-label">${s.label}</span>
                    <span class="curtain-spec-val">${s.val}</span>
                  </div>
                `).join('');
              }
              if (window.MaisonAudio) window.MaisonAudio.playClick();
            });
          });

          // If a specific look index is requested (e.g. Monogram Edition), activate it immediately
          if (preferredLookIdx !== null && c.looks[preferredLookIdx]) {
            const targetBtn = tabsWrap.querySelector(`.curtain-look-tab[data-idx="${preferredLookIdx}"]`);
            if (targetBtn) targetBtn.click();
          }
        } else {
          tabsWrap.innerHTML = '';
          tabsWrap.style.display = 'none';
        }
      }

      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';

      if (window.MaisonAudio) window.MaisonAudio.playChime(659.25);
    }

    function closeCurtain() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (window.MaisonAudio) window.MaisonAudio.playClick();
    }

    if (inspectBtn) {
      inspectBtn.addEventListener('click', () => openCurtain(currentActiveId));
    }

    const patternBtn = document.getElementById('story-pattern-view-btn');
    if (patternBtn) {
      patternBtn.addEventListener('click', () => {
        let targetStation = currentActiveId;
        let lookIdx = 1;
        if (targetStation === 'coat') {
          lookIdx = 2; // Look 03: Monogram Runway Cape
        } else if (targetStation === 'bag') {
          lookIdx = 1; // Look 02: Monogram Canvas Bag
        } else if (targetStation === 'scarf') {
          lookIdx = 1; // Look 02: Monogram Carré & Bangle
        } else {
          targetStation = 'bag';
          lookIdx = 1;
        }
        openCurtain(targetStation, lookIdx);
      });
    }

    if (curtainReserveBtn) {
      curtainReserveBtn.addEventListener('click', () => {
        closeCurtain();
        window.dispatchEvent(new CustomEvent('openBookingModal', { detail: { pieceId: currentActiveId } }));
      });
    }

    if (curtainSilkLabBtn) {
      curtainSilkLabBtn.addEventListener('click', () => {
        closeCurtain();
        window.dispatchEvent(new CustomEvent('openSilkAtelierModal'));
      });
    }

    window.addEventListener('openCurtain', (e) => {
      openCurtain(e.detail.id, e.detail.lookIdx !== undefined ? e.detail.lookIdx : null);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeCurtain);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeCurtain();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) closeCurtain();
    });

    // Deep link support: e.g. ?inspect=bangle or ?inspect=coat
    const urlParams = new URLSearchParams(window.location.search);
    const inspectParam = urlParams.get('inspect');
    if (inspectParam) {
      setTimeout(() => {
        openCurtain(inspectParam);
      }, 400);
    }
  }

  /* ==========================================================================
     3. Runway Multi-Angle Catwalk Switcher
     ========================================================================== */
  function initRunwayAngleSwitcher() {
    const angleBtns = document.querySelectorAll('.runway-angle-btn');
    angleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        angleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const preset = btn.getAttribute('data-angle');
        if (window.MaisonGallery3D && window.MaisonGallery3D.setRunwayAngle) {
          window.MaisonGallery3D.setRunwayAngle(preset);
        }
        if (window.MaisonAudio) window.MaisonAudio.playClick();
      });
    });
  }

  /* ==========================================================================
     4. Colorway Switcher
     ========================================================================== */
  function initColorwaySwitcher() {
    const dots = document.querySelectorAll('.colorway-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        const colorHex = dot.getAttribute('data-color') || '#ffffff';
        const sheenHex = dot.getAttribute('data-sheen') || '#f6e6c4';

        if (window.MaisonGallery3D && window.MaisonGallery3D.setColorway) {
          window.MaisonGallery3D.setColorway(colorHex, sheenHex);
        }
        if (window.MaisonAudio) window.MaisonAudio.playClick();
      });
    });
  }

  /* ==========================================================================
     5. Macro Weave Loupe Zoom (Preserves Full Model & Zero Offset)
     ========================================================================== */
  function initLoupeZoom() {
    const container = document.querySelector('.loupe-container');
    const loupe = document.querySelector('.loupe-glass');
    const targetImg = document.getElementById('curtain-img');

    if (!container || !loupe || !targetImg) return;

    container.addEventListener('mouseenter', () => {
      loupe.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
      loupe.style.opacity = '0';
    });

    container.addEventListener('mousemove', (e) => {
      const imgRect = targetImg.getBoundingClientRect();
      const contRect = container.getBoundingClientRect();

      const mouseXInImg = e.clientX - imgRect.left;
      const mouseYInImg = e.clientY - imgRect.top;

      if (mouseXInImg >= 0 && mouseXInImg <= imgRect.width && mouseYInImg >= 0 && mouseYInImg <= imgRect.height) {
        loupe.style.opacity = '1';
        const xInCont = e.clientX - contRect.left;
        const yInCont = e.clientY - contRect.top;
        loupe.style.left = `${xInCont}px`;
        loupe.style.top = `${yInCont}px`;

        const zoomFactor = 2.4;
        const bgX = -mouseXInImg * zoomFactor + loupe.offsetWidth / 2;
        const bgY = -mouseYInImg * zoomFactor + loupe.offsetHeight / 2;
        loupe.style.backgroundImage = `url(${targetImg.src})`;
        loupe.style.backgroundSize = `${imgRect.width * zoomFactor}px ${imgRect.height * zoomFactor}px`;
        loupe.style.backgroundPosition = `${bgX}px ${bgY}px`;
      } else {
        loupe.style.opacity = '0';
      }
    });
  }

  /* ==========================================================================
     6. Timeline Step Clicking
     ========================================================================== */
  function initTimelineClicks() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach((step, idx) => {
      step.addEventListener('click', () => {
        if (window.MaisonGallery3D) {
          window.MaisonGallery3D.goToStation(idx);
        }
      });
    });
  }

  /* ==========================================================================
     7. Audio Engine
     ========================================================================== */
  function initAudioEngine() {
    let audioCtx = null;
    let isSoundOn = false;
    const btn = document.getElementById('sound-toggle-btn');

    function initCtx() {
      if (!audioCtx) {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (AudioClass) audioCtx = new AudioClass();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
    }

    window.MaisonAudio = {
      playClick: function () {
        if (!isSoundOn || !audioCtx) return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.04);
        } catch (e) {}
      },
      playChime: function (freq = 523.25) {
        if (!isSoundOn || !audioCtx) return;
        try {
          [freq, freq * 1.25, freq * 1.5].forEach((f, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, audioCtx.currentTime);
            const start = audioCtx.currentTime + i * 0.04;
            gain.gain.setValueAtTime(0.001, start);
            gain.gain.linearRampToValueAtTime(0.035, start + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(start);
            osc.stop(start + 0.55);
          });
        } catch (e) {}
      }
    };

    if (btn) {
      btn.addEventListener('click', () => {
        initCtx();
        isSoundOn = !isSoundOn;
        if (isSoundOn) {
          btn.innerHTML = `<span>Sound ON</span><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>`;
          window.MaisonAudio.playChime(659.25);
        } else {
          btn.innerHTML = `<span>Sound Muted</span><span class="w-1.5 h-1.5 rounded-full bg-gray-400"></span>`;
        }
      });
    }
  }

  /* ==========================================================================
     8. Royal Finale Climax & Panorama Shelf Controller
     ========================================================================== */
  function initRoyalFinale() {
    const finaleContainer = document.getElementById('royal-finale-container');
    const storyContainer = document.querySelector('.story-overlay-container');
    const backToTopBtn = document.getElementById('finale-back-to-top');
    const panoramaCards = document.querySelectorAll('.panorama-card');

    window.addEventListener('royalFinale', (e) => {
      const isFinale = e.detail && e.detail.active;

      if (finaleContainer) {
        if (isFinale) {
          finaleContainer.classList.add('visible');
        } else {
          finaleContainer.classList.remove('visible');
        }
      }

      if (storyContainer) {
        if (isFinale) {
          storyContainer.style.opacity = '0';
          storyContainer.style.pointerEvents = 'none';
        } else {
          storyContainer.style.opacity = '1';
          storyContainer.style.pointerEvents = 'auto';
        }
      }
    });

    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.MaisonAudio) window.MaisonAudio.playClick();
      });
    }

    panoramaCards.forEach(card => {
      card.addEventListener('click', () => {
        const stationId = card.getAttribute('data-station');
        if (stationId) {
          window.dispatchEvent(new CustomEvent('openCurtain', { detail: { id: stationId } }));
          if (window.MaisonAudio) window.MaisonAudio.playClick();
        }
      });
    });
  }

  /* ==========================================================================
     9. In-Site Luxury Salon Booking Modal System (No External Mailto)
     ========================================================================== */
  function initBookingModal() {
    const modal = document.getElementById('salon-booking-modal');
    const closeBtn = document.getElementById('close-booking-modal');
    const doneBtn = document.getElementById('booking-done-btn');
    const headerBtn = document.getElementById('header-reserve-btn');
    const finaleBtn = document.getElementById('finale-reserve-btn');
    const form = document.getElementById('salon-booking-form');
    const formView = document.getElementById('booking-form-view');
    const successView = document.getElementById('booking-success-view');
    const dateInput = document.getElementById('booking-date');
    const pieceSelect = document.getElementById('booking-piece');

    if (!modal) return;

    // Set minimum date to tomorrow
    if (dateInput) {
      const tomorrow = new Date(Date.now() + 86400000);
      dateInput.min = tomorrow.toISOString().split('T')[0];
      dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    function openModal(preselectPieceId) {
      if (formView) formView.classList.remove('hidden');
      if (successView) successView.classList.add('hidden');

      // Pre-select matching collection piece if supplied
      if (pieceSelect && preselectPieceId) {
        for (let i = 0; i < pieceSelect.options.length; i++) {
          if (pieceSelect.options[i].value.toLowerCase().includes(preselectPieceId.toLowerCase())) {
            pieceSelect.selectedIndex = i;
            break;
          }
        }
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (window.MaisonAudio) window.MaisonAudio.playChime(587.33);
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (window.MaisonAudio) window.MaisonAudio.playClick();
    }

    if (headerBtn) headerBtn.addEventListener('click', () => openModal(currentActiveId));
    if (finaleBtn) finaleBtn.addEventListener('click', () => openModal(currentActiveId));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (doneBtn) doneBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    window.addEventListener('openBookingModal', (e) => {
      openModal(e.detail && e.detail.pieceId);
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const locRadio = form.querySelector('input[name="salon_location"]:checked');
        const salonLoc = locRadio ? locRadio.value : 'Paris Atelier Céleste';
        const piece = pieceSelect ? pieceSelect.value : "N° 00 — LE BRACELET ASTRAL D'OR";
        const dateVal = document.getElementById('booking-date').value || '2026. 11. 15';
        const timeVal = document.getElementById('booking-time').value || '14:00 PM';
        const nameVal = document.getElementById('booking-name').value || 'VIP Client';
        const phoneVal = document.getElementById('booking-phone').value || '010-0000-0000';

        // Update Confirmation View Elements
        const clientNameEl = document.getElementById('confirm-client-name');
        const salonLocEl = document.getElementById('confirm-salon-loc');
        const clientPhoneEl = document.getElementById('confirm-client-phone');
        const slotEl = document.getElementById('confirm-slot');
        const pieceEl = document.getElementById('confirm-piece');
        const codeEl = document.getElementById('booking-confirm-code');

        if (clientNameEl) clientNameEl.innerText = `${nameVal} 귀하`;
        if (salonLocEl) salonLocEl.innerText = salonLoc;
        if (clientPhoneEl) clientPhoneEl.innerText = phoneVal;
        if (slotEl) slotEl.innerText = `${dateVal} · ${timeVal}`;
        if (pieceEl) pieceEl.innerText = piece;

        const locShort = salonLoc.split(' ')[0].toUpperCase();
        const randNum = Math.floor(100 + Math.random() * 900);
        if (codeEl) codeEl.innerText = `VIP-MDE-2026-${locShort}-${randNum}`;

        formView.classList.add('hidden');
        successView.classList.remove('hidden');

        if (window.MaisonAudio) window.MaisonAudio.playChime(784);
      });
    }
  }

  /* ==========================================================================
     10. Silk Physics Atelier Modal System (Interactive Cloth Simulation Lab)
     ========================================================================== */
  function initSilkAtelierModal() {
    const modal = document.getElementById('silk-atelier-modal');
    const closeBtn = document.getElementById('close-silk-modal');
    const openBtn = document.getElementById('silk-atelier-btn');
    const canvas = document.getElementById('silk-atelier-canvas');

    const sliderWind = document.getElementById('slider-wind');
    const sliderTension = document.getElementById('slider-tension');
    const sliderWave = document.getElementById('slider-wave');

    const valWind = document.getElementById('val-wind');
    const valTension = document.getElementById('val-tension');
    const valWave = document.getElementById('val-wave');

    const colorChips = document.querySelectorAll('.atelier-color-chip');

    if (!modal || !canvas) return;

    let aRenderer, aScene, aCamera, aClothMesh, aClothGeo;
    let aAnimId = null;
    let aClock = 0;
    let windSpeed = 1.8;
    let waveAmp = 1.4;
    let clothTension = 0.24;
    let dragRipple = 0;
    let isCanvasDragging = false;

    function initAtelierScene() {
      if (aRenderer) return;

      aScene = new THREE.Scene();
      aScene.background = new THREE.Color(0xfbfbfa);

      aCamera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      aCamera.position.set(0, 5, 24);
      aCamera.lookAt(0, 0, 0);

      const ambLight = new THREE.AmbientLight(0xffffff, 1.3);
      aScene.add(ambLight);

      const dirLight = new THREE.DirectionalLight(0xfff8ea, 2.0);
      dirLight.position.set(20, 30, 20);
      aScene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0xedf2f7, 1.2);
      fillLight.position.set(-20, -10, 15);
      aScene.add(fillLight);

      // Create 3D Silk Cloth Mesh (64 x 64 high-density grid)
      aClothGeo = new THREE.PlaneGeometry(24, 24, 64, 64);

      const texLoader = new THREE.TextureLoader();
      const silkTex = texLoader.load('assets/images/silk-scarf-pattern.jpg');
      silkTex.wrapS = THREE.RepeatWrapping;
      silkTex.wrapT = THREE.RepeatWrapping;

      const clothMat = new THREE.MeshStandardMaterial({
        map: silkTex,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide
      });

      aClothMesh = new THREE.Mesh(aClothGeo, clothMat);
      aClothMesh.rotation.x = -Math.PI * 0.28;
      aClothMesh.rotation.z = Math.PI * 0.05;
      aScene.add(aClothMesh);

      aRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
      aRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      resizeAtelier();

      // Mouse drag wave ripple interaction
      canvas.addEventListener('mousedown', () => { isCanvasDragging = true; });
      window.addEventListener('mouseup', () => { isCanvasDragging = false; });
      canvas.addEventListener('mousemove', () => {
        dragRipple = Math.min(dragRipple + (isCanvasDragging ? 0.35 : 0.1), 3.2);
      });
    }

    function resizeAtelier() {
      if (aCamera && aRenderer && canvas) {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight;
        aCamera.aspect = w / h;
        aCamera.updateProjectionMatrix();
        aRenderer.setSize(w, h, false);
      }
    }

    function animateAtelier() {
      aAnimId = requestAnimationFrame(animateAtelier);
      aClock += 0.016 * windSpeed;
      dragRipple *= 0.95;

      if (aClothGeo) {
        const pos = aClothGeo.attributes.position;
        const count = pos.count;

        for (let i = 0; i < count; i++) {
          const u = pos.getX(i);
          const v = pos.getY(i);

          const w1 = Math.sin(u * clothTension + aClock * 2.2) * (waveAmp + dragRipple);
          const w2 = Math.cos(v * (clothTension * 1.2) + aClock * 1.6) * (waveAmp * 0.8 + dragRipple * 0.6);
          const w3 = Math.sin((u + v) * 0.08 + aClock * 2.8) * 1.1;

          pos.setZ(i, w1 + w2 + w3);
        }
        pos.needsUpdate = true;
        aClothGeo.computeVertexNormals();

        aClothMesh.rotation.y = Math.sin(aClock * 0.6) * 0.1;
      }

      aRenderer.render(aScene, aCamera);
    }

    function openSilkModal() {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      initAtelierScene();
      resizeAtelier();
      if (!aAnimId) animateAtelier();
      if (window.MaisonAudio) window.MaisonAudio.playChime(659.25);
    }

    function closeSilkModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (aAnimId) {
        cancelAnimationFrame(aAnimId);
        aAnimId = null;
      }
      if (window.MaisonAudio) window.MaisonAudio.playClick();
    }

    if (openBtn) openBtn.addEventListener('click', openSilkModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSilkModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSilkModal();
    });

    window.addEventListener('openSilkAtelierModal', openSilkModal);

    window.addEventListener('resize', () => {
      if (modal.classList.contains('open')) resizeAtelier();
    });

    // Sliders
    if (sliderWind) {
      sliderWind.addEventListener('input', (e) => {
        windSpeed = parseFloat(e.target.value);
        if (valWind) valWind.innerText = `${windSpeed.toFixed(1)} m/s`;
      });
    }
    if (sliderTension) {
      sliderTension.addEventListener('input', (e) => {
        clothTension = parseFloat(e.target.value);
        if (valTension) valTension.innerText = `${clothTension.toFixed(2)} λ`;
      });
    }
    if (sliderWave) {
      sliderWave.addEventListener('input', (e) => {
        waveAmp = parseFloat(e.target.value);
        if (valWave) valWave.innerText = `${waveAmp.toFixed(1)} A`;
      });
    }

    // Color Chips
    colorChips.forEach(chip => {
      chip.addEventListener('click', () => {
        colorChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const colHex = chip.getAttribute('data-color') || '#ffffff';
        if (aClothMesh && aClothMesh.material) {
          aClothMesh.material.color.set(colHex);
        }
        if (window.MaisonAudio) window.MaisonAudio.playClick();
      });
    });
  }

})();
