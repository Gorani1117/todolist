# ⚡ CYBER//TASKFLOW - Cyberpunk To-Do List

> **마젠타 네온 감성의 사이버펑크 스타일 할 일 관리 웹 애플리케이션**  
> 8비트 레트로 게임 "뿅뿅" 사운드와 강력한 태스크 관리 기능을 갖춘 오프라인 완결형 스마트 To-Do 프로그램입니다.

---

## ✨ 주요 기능 (Key Features)

- 🎮 **8비트 레트로 게임 "뿅뿅" 사운드 (Web Audio API)**
  - 할 일을 완료할 때마다 경쾌한 2단 아케이드 뿅뿅(Bbyong!) 사운드가 재생됩니다.
  - 외부 음원 파일 없이 순수 브라우저 오디오 신디사이저로 동작하여 100% 오프라인에서 즉시 실행됩니다.
  - 상단 `FX: ON / FX: MUTE` 버튼으로 손쉽게 음소거 가능합니다.

- 🎨 **마젠타 사이버펑크 HUD 디자인 (Neon Magenta & Cyan)**
  - 네온 핫핑크/마젠타와 일렉트릭 시안의 미래지향적 인터페이스
  - 스캔라인 효과, 발광 네온 테두리, 커스텀 체크박스, `Orbitron` & `Share Tech Mono` 폰트 적용

- 📁 **완료한 목록 자동 격리 & 하단 아카이브 (Completed Archive)**
  - 할 일 체크 시 진행 중인 목록에서 분리되어 하단의 **완료한 목록**으로 자동 이동
  - 접기/펼치기(아코디언) 기능으로 깔끔한 화면 유지
  - 체크박스 재클릭 시 진행 중인 목록으로 즉시 복원 가능

- 🔍 **스마트 필터 & 실시간 통합 검색**
  - 전체 할 일, 오늘 마감, 중요(긴급) 태스크, 섹터(카테고리)별 필터링
  - 진행 중인 태스크와 완료된 태스크를 아우르는 실시간 키워드 검색

- ⚙️ **서브태스크 & 데이터 백업 (JSON)**
  - 각 할 일마다 세부 체크리스트(Subroutines) 등록 가능
  - LocalStorage 자동 저장으로 새로고침해도 영구 유지
  - JSON 파일 백업 다운로드 및 복원 기능 지원

---

## 🚀 실행 방법 (Getting Started)

별도의 Node.js나 서버 설치 없이 브라우저에서 바로 실행할 수 있습니다.

1. 저장소를 클론(또는 다운로드)합니다:
   ```bash
   git clone https://github.com/Gorani1117/todolist.git
   ```
2. `index.html` 파일을 더블 클릭하여 Chrome, Edge, Safari 등 웹 브라우저에서 바로 엽니다.

---

## 🛠️ 기술 스택 (Tech Stack)

- **Frontend**: HTML5, Vanilla JavaScript (ES6+)
- **Styling**: Tailwind CSS (CDN), Custom Cyberpunk CSS
- **Icons**: Lucide Icons
- **Audio Engine**: Web Audio API (Chiptune Synthesizer)
- **Storage**: Browser LocalStorage

---

## 📂 파일 구조 (File Structure)

```
todolist/
├── index.html        # 메인 웹 페이지 마크업 및 HUD 레이아웃
├── style.css         # 사이버펑크 네온 마젠타 스타일 & 애니메이션
├── app.js            # 상태 관리, 로컬 스토리지, 8비트 사운드 신디사이저
├── .gitignore        # 불필요한 시스템 파일 제외 설정
└── README.md         # 프로젝트 소개 및 가이드 문서
```

