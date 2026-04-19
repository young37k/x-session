import React, { useState } from "react";

function XSessionApp() {
  const [mode, setMode] = useState("login");
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
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.4)",
        }}
      >
        {/* 로그인 / 회원가입 선택 */}
        <div style={{ display: "flex", marginBottom: 20 }}>
          <button
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: mode === "login" ? "#0f172a" : "#e5e7eb",
              color: mode === "login" ? "#fff" : "#111",
            }}
          >
            로그인
          </button>

          <button
            onClick={() => setMode("signup")}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 10,
              border: "none",
              background: mode === "signup" ? "#0f172a" : "#e5e7eb",
              color: mode === "signup" ? "#fff" : "#111",
              marginLeft: 8,
            }}
          >
            회원가입
          </button>
        </div>

        {/* 이메일 */}
        <div style={{ marginBottom: 12 }}>
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
            }}
          />
        </div>

        {/* 비밀번호 */}
        <div style={{ marginBottom: 20 }}>
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
            }}
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          style={{
            width: "100%",
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "#0f172a",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          X-SESSION {mode === "login" ? "로그인" : "회원가입"}
        </button>
      </div>
    </div>
  );
}

export default XSessionApp;
