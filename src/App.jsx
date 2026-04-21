// login_background_top_crop_patch.jsx
// 목적:
// - 모바일/PC 모두 로그인 배경 이미지를 "상단 기준"으로 배치
// - 혹시 잘리더라도 "발쪽(하단)"에서 잘리도록 설정
// - 모바일: upload한 login-bg-mobile.png 사용
// - 데스크탑: upload한 login-bg-desktop.png.png 사용
//
// 적용 방법:
// 1) 로그인 화면 최상단 wrapper(배경 div)를 이 코드의 LoginBackgroundShell 방식으로 교체
// 2) 이미지 파일은 public 폴더에 아래 이름으로 둔다
//    /public/login-bg-mobile.png
//    /public/login-bg-desktop.png
//    ※ 현재 업로드된 데스크탑 파일명이 login-bg-desktop.png.png 인 경우,
//       실제 파일명은 login-bg-desktop.png 로 정리하는 것을 권장

import React from "react";

export function LoginBackgroundShell({ children }) {
  return (
    <div
      className="
        min-h-[100svh] w-full
        bg-no-repeat
        bg-top
        bg-slate-200
        px-2 py-2
        md:px-4 md:py-4
      "
      style={{
        // 모바일은 모바일 전용 이미지, PC는 데스크탑 전용 이미지
        backgroundImage:
          "image-set(url('/login-bg-mobile.png') 1x)",
        backgroundPosition: "top center",
        // 핵심:
        // 모바일은 로고가 절대 잘리면 안 되므로 contain
        // PC는 화면 활용을 위해 cover, 단 상단 기준으로 배치해서 하단부터 잘리게 함
        backgroundSize: "contain",
      }}
    >
      <div
        className="mx-auto w-full max-w-[1600px] min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)]"
        style={{
          backgroundImage: "url('/login-bg-desktop.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "cover",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 권장 구조 1: 모바일/PC를 CSS로 분리해서 더 명확하게 쓰는 버전
// ------------------------------------------------------------

export function LoginBackgroundShellResponsive({ children }) {
  return (
    <div className="min-h-[100svh] w-full bg-slate-200 px-2 py-2 md:px-4 md:py-4">
      {/* 모바일 배경층 */}
      <div
        className="
          md:hidden
          min-h-[calc(100svh-16px)] w-full
          rounded-[24px]
          bg-no-repeat bg-top
        "
        style={{
          backgroundImage: "url('/login-bg-mobile.png')",
          backgroundPosition: "top center",
          backgroundSize: "contain",
          backgroundColor: "#dbe4ee",
        }}
      >
        {children}
      </div>

      {/* 데스크탑 배경층 */}
      <div
        className="
          hidden md:block
          mx-auto w-full max-w-[1600px]
          min-h-[calc(100svh-32px)]
          rounded-[32px]
          bg-no-repeat bg-top
        "
        style={{
          backgroundImage: "url('/login-bg-desktop.png')",
          backgroundPosition: "top center",
          backgroundSize: "cover",
          backgroundColor: "#dbe4ee",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// 로그인 카드 예시
// ------------------------------------------------------------

export default function LoginScreenExample() {
  return (
    <LoginBackgroundShellResponsive>
      <div className="flex min-h-[calc(100svh-16px)] md:min-h-[calc(100svh-32px)] items-end justify-center">
        <div className="mb-4 w-full max-w-[560px] rounded-[28px] bg-black/18 p-4 backdrop-blur-sm md:mb-8 md:p-6">
          <div className="grid grid-cols-2 gap-2 rounded-full bg-black/18 p-1">
            <button className="rounded-full bg-white px-4 py-3 text-lg font-bold text-slate-900">
              로그인
            </button>
            <button className="rounded-full px-4 py-3 text-lg font-bold text-white/90">
              회원가입
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-lg font-bold text-white">이메일</label>
              <input
                className="w-full rounded-2xl border border-white/20 bg-white px-4 py-4 text-xl outline-none"
                placeholder="이메일 입력"
              />
            </div>

            <div>
              <label className="mb-2 block text-lg font-bold text-white">비밀번호</label>
              <input
                className="w-full rounded-2xl border border-white/20 bg-white px-4 py-4 text-xl outline-none"
                placeholder="비밀번호 입력"
                type="password"
              />
            </div>

            <button className="w-full rounded-2xl bg-slate-950 px-4 py-4 text-xl font-bold text-white">
              로그인
            </button>
          </div>
        </div>
      </div>
    </LoginBackgroundShellResponsive>
  );
}
