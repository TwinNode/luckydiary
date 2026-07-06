# 일운 기록 · 운세 다이어리

일진(일운)·월운·세운을 십성/12운성 기준으로 보고, 임상(실제 기분·결과)을 기록·분석하는 개인용 PWA.
서버 없이 브라우저 안(localStorage)에만 저장되며, 데이터는 외부로 전송되지 않는다.

## 파일
- `index.html` — 앱 전체 (단일 파일)
- `manifest.json`, `sw.js` — PWA(설치·오프라인)
- `icon-*.png`, `apple-touch-icon.png` — 앱 아이콘

## 로컬 실행
```
python -m http.server 8731
```
→ 브라우저에서 `http://localhost:8731` (서비스워커/설치는 https 또는 localhost에서만 동작)

---

## 📱 APK 만들기 (GitHub Pages + PWABuilder)

로컬 안드로이드 SDK 없이 APK를 만드는 가장 쉬운 경로.

### 1) GitHub에 올리기 (public)
```
# 이 폴더(saju_diary)에서
git init            # (이미 되어 있으면 생략)
git add -A
git commit -m "일운 기록 PWA"
git branch -M main
git remote add origin https://github.com/<사용자명>/iljin-diary.git
git push -u origin main
```

### 2) GitHub Pages 켜기
- 저장소 → **Settings → Pages**
- Source: **Deploy from a branch**, Branch: **main / (root)** → Save
- 1~2분 뒤 `https://<사용자명>.github.io/iljin-diary/` 주소가 생김 (이게 앱 URL)
- 그 주소를 폰 크롬으로 열어 정상 동작 확인 (메뉴 → 홈 화면에 추가 로 PWA 설치도 가능)

### 3) PWABuilder로 APK 생성
- <https://www.pwabuilder.com> 접속 → 위 GitHub Pages 주소 입력 → **Start**
- 매니페스트/서비스워커 점수 확인 (이미 다 넣어둠)
- **Package For Stores → Android** → **Generate**
- 옵션에서 **"Signed APK"** 선택 가능. 서명 키를 새로 만들면 `.keystore` 파일을 안전하게 보관할 것 (앱 업데이트 때 같은 키 필요)
- 다운로드된 zip 안의 `.apk`(또는 test APK)를 폰에 옮겨 설치
  - 폰 설정에서 "알 수 없는 출처 앱 설치" 허용 필요

> PWABuilder가 만드는 건 **TWA(Trusted Web Activity)** — GitHub Pages의 앱을 전체화면 웹뷰로 감싼 것. 첫 실행 때 온라인이면 서비스워커가 캐시해서 이후 오프라인도 됨. 데이터(localStorage)는 앱 내부에 유지됨.

### 대안: 완전 오프라인 APK (호스팅 불필요)
Node + Android Studio가 있으면 **Capacitor**로 HTML을 APK에 통째로 넣을 수 있다(호스팅 없이 오프라인). 필요하면 이 경로도 세팅 가능.

## 데이터 백업
- 설정 → **엑셀(.xlsx) 내보내기**: `일진기록`·`월운세운` 두 탭으로 저장
- 기기 변경/브라우저 정리 전 반드시 백업 (localStorage는 지워지면 복구 불가)
