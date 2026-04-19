import React, { useState } from "react";

function XSessionApp() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [saveEmail, setSaveEmail] = useState(true);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "url('/login-background.png') center/cover no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: 24,
          borderRadius: 20,
          backdropFilter: "blur(6px)",
          background: "transparent", // ✅ 불투명 박스 제거
        }}
      >
        {/* 이메일 */}
        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <label style={{ color: "#fff", fontSize: 14 }}>이메일</label>

            <label style={{ color: "#fff", fontSize: 12 }}>
              <input
                type="checkbox"
                checked={saveEmail}
                onChange={() => setSaveEmail(!saveEmail)}
                style={{ marginRight: 4 }}
              />
              저장
            </label>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            style={{
              width: "100%",
              height: 44,
              borderRadius: 10,
              border: "none",
              padding: "0 12px",
              background: "rgba(255,255,255,0.9)",
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ color: "#fff", fontSize: 14 }}>비밀번호</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호 입력"
            style={{
              width: "100%",
              height: 44,
              borderRadius: 10,
              border: "none",
              padding: "0 12px",
              marginTop: 6,
              background: "rgba(255,255,255,0.9)",
            }}
          />
        </div>

        {/* 로그인 / 회원가입 버튼 */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "none",
              background: "#0f172a",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            로그인
          </button>

          <button
            style={{
              flex: 1,
              height: 48,
              borderRadius: 12,
              border: "none",
              background: "#e5e7eb",
              color: "#111",
              fontWeight: "bold",
            }}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default XSessionApp;
