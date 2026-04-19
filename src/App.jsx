import React, { useState } from "react";

/* 🔥 시/도 고정 리스트 */
const REGION_OPTIONS = [
  "전체 지역",
  "서울특별시",
  "부산광역시",
  "대구광역시",
  "인천광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "경기도",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전북특별자치도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
  "해외"
];

export default function App() {
  const [arrowsPerEnd, setArrowsPerEnd] = useState(6);

  return (
    <div style={{ padding: 16, maxWidth: 480, margin: "0 auto" }}>
      
      {/* ===================== X-Session ===================== */}
      <h2 style={{ marginBottom: 12 }}>X-Session</h2>

      <div className="form-row">
        <label>엔드당 화살 수</label>
        <select
          value={arrowsPerEnd}
          onChange={(e) => setArrowsPerEnd(Number(e.target.value))}
        >
          {[1,2,3,4,5,6].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      {/* ===================== X-Analysis ===================== */}
      <h2 style={{ marginTop: 32, marginBottom: 12 }}>X-Analysis</h2>

      {["거리","학년","학교/소속팀","지역","경기 방식","날짜"].map(label => (
        <div key={label} className="form-row">
          <label>{label}</label>
          <select>
            <option>전체 {label}</option>
          </select>
        </div>
      ))}

      {/* ===================== X-Ranking ===================== */}
      <h2 style={{ marginTop: 32, marginBottom: 12 }}>X-Ranking</h2>

      <div className="form-row">
        <label>지역</label>
        <select>
          {REGION_OPTIONS.map(r => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* 🔥 상위3명 제거됨 */}

      {/* 랭킹 카드 */}
      {[1,2,3,4].map(rank => (
        <div key={rank} className="rank-card">

          {/* 1줄 */}
          <div className="rank-top">
            <div className="rank-num">{rank}</div>

            <div className="rank-info">
              <div className="rank-name">홍리우</div>
              <div className="rank-sub">천현초등학교 · 초등4</div>
            </div>

            <div className="rank-score">2594</div>
          </div>

          {/* 2줄 */}
          <div className="rank-bottom">
            X 0 · 평균 9.01 · 최고 1312 · 세션 2
          </div>

        </div>
      ))}

      {/* ===================== 스타일 ===================== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        .form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          gap: 10px;
        }

        .form-row label {
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .form-row select {
          flex: 1;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #ddd;
          padding: 0 10px;
          font-size: 14px;
        }

        .rank-card {
          border: 1px solid #e5c36a;
          border-radius: 16px;
          padding: 12px;
          margin-bottom: 10px;
          background: #fffaf0;
        }

        .rank-top {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .rank-num {
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: gold;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }

        .rank-info {
          flex: 1;
          min-width: 0;
        }

        .rank-name {
          font-weight: bold;
          font-size: 15px;
        }

        .rank-sub {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rank-score {
          font-size: 14px;
          font-weight: bold;
          color: #555;
          white-space: nowrap;
        }

        .rank-bottom {
          font-size: 13px;
          margin-top: 6px;
          color: #444;
          white-space: nowrap;
        }
      `}</style>

    </div>
  );
}
