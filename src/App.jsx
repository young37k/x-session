import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Trophy,
  User,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  ArrowRight,
  Medal,
  Swords,
  Crown,
  CalendarRange,
  Shield,
  Loader2,
  Settings,
  Lock,
  UserX,
  Eraser,
  Archive,
  Pencil,
  Undo2,
  TrendingUp,
  TrendingDown,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,

  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  getDocs,
  orderBy,
  where,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const SCORE_OPTIONS = ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "M"];
const QUICK_SCORE_OPTIONS = ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, "M"];
const MAX_ARROWS_PER_END = 6;
const DIVISION_OPTIONS = [
  "전체학년",
  "초등1",
  "초등2",
  "초등3",
  "초등4",
  "초등5",
  "초등6",
  "중등1",
  "중등2",
  "중등3",
  "고등1",
  "고등2",
  "고등3",
  "대학부",
  "일반부",
  "국가대표"
];
const GENDER_OPTIONS = ["남", "여"];
const RANKING_GROUP_OPTIONS = [
  "저학년",
  "고학년",
  "중등부",
  "고등부(남)",
  "고등부(여)",
  "대학/일반부(남)",
  "대학/일반부(여)"
];
const DISTANCE_OPTIONS = [18, 20, 25, 30, 35, 40, 50, 60, 70, 90];

const DIVISION_DISTANCE_RULES = {
  "초등1": [35, 30, 25, 20],
  "초등2": [35, 30, 25, 20],
  "초등3": [35, 30, 25, 20],
  "초등4": [35, 30, 25, 20],
  "초등5": [35, 30, 25, 20],
  "초등6": [35, 30, 25, 20],
  "중등1": [60, 50, 40, 30],
  "중등2": [60, 50, 40, 30],
  "중등3": [60, 50, 40, 30],
  "고등1": [70, 60, 50, 30],
  "고등2": [70, 60, 50, 30],
  "고등3": [70, 60, 50, 30],
  "대학부": [70, 60, 50, 30],
  "일반부": [70, 60, 50, 30],
  "국가대표": [70],
};

const RANKING_GROUP_DISTANCE_RULES = {
  "저학년": [35, 30, 25, 20],
  "고학년": [35, 30, 25, 20],
  "중등부": [60, 50, 40, 30],
  "고등부(남)": [90, 70, 50, 30],
  "고등부(여)": [70, 60, 50, 30],
  "대학/일반부(남)": [90, 70, 50, 30],
  "대학/일반부(여)": [70, 60, 50, 30],
};


const REGION_CITY_OPTIONS = [
  "강원특별자치도",
  "경기도",
  "경상남도",
  "경상북도",
  "광주광역시",
  "대구광역시",
  "대전광역시",
  "부산광역시",
  "서울특별시",
  "세종특별자치시",
  "울산광역시",
  "인천광역시",
  "전라남도",
  "전북특별자치도",
  "제주특별자치도",
  "충청남도",
  "충청북도",
];


const REGION_OPTIONS = [
  "강원특별자치도",
  "경기도",
  "경상남도",
  "경상북도",
  "광주광역시",
  "대구광역시",
  "대전광역시",
  "부산광역시",
  "서울특별시",
  "세종특별자치시",
  "울산광역시",
  "인천광역시",
  "전라남도",
  "전북특별자치도",
  "제주특별자치도",
  "충청남도",
  "충청북도",
];


const REGION_DISTRICT_MAP = {
  "서울특별시": ["강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구","노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구","성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구"],
  "부산광역시": ["강서구","금정구","기장군","남구","동구","동래구","부산진구","북구","사상구","사하구","서구","수영구","연제구","영도구","중구","해운대구"],
  "대구광역시": ["남구","달서구","달성군","동구","북구","서구","수성구","중구","군위군"],
  "인천광역시": ["강화군","계양구","미추홀구","남동구","동구","부평구","서구","연수구","옹진군","중구"],
  "광주광역시": ["광산구","남구","동구","북구","서구"],
  "대전광역시": ["대덕구","동구","서구","유성구","중구"],
  "울산광역시": ["남구","동구","북구","울주군","중구"],
  "세종특별자치시": ["세종시"],
  "제주특별자치도": ["제주시","서귀포시"],
  "강원특별자치도": ["춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시","홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"],
  "전북특별자치도": ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],
  "경기도": ["수원시","성남시","안양시","부천시","안산시","용인시","광명시","평택시","과천시","오산시","시흥시","군포시","의왕시","하남시","이천시","안성시","김포시","화성시","광주시","여주시","양주시","구리시","남양주시","의정부시","동두천시","파주시","포천시","연천군","가평군","양평군"],
  "충청남도": ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  "충청북도": ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],
  "경상남도": ["창원시","진주시","통영시","사천시","김해시","밀양시","거제시","양산시","의령군","함안군","창녕군","고성군","남해군","하동군","산청군","함양군","거창군","합천군"],
  "경상북도": ["포항시","경주시","김천시","안동시","구미시","영주시","상주시","문경시","경산시","군위군","의성군","청송군","영양군","영덕군","청도군","고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"],
  "전라남도": ["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],
};

function getDistrictOptions(regionCity) {
  return REGION_DISTRICT_MAP[regionCity] || [];
}

const MATCH_TYPE_OPTIONS = [
  { value: "all", label: "전체 방식" },
  { value: "cumulative", label: "누적제" },
  { value: "set", label: "세트제" },
];
const DATE_FILTER_OPTIONS = [
  { value: "all", label: "전체 날짜" },
  { value: "today", label: "오늘" },
  { value: "yesterday", label: "전일" },
  { value: "7days", label: "최근 7일" },
  { value: "30days", label: "최근 30일" },
];
const PERIOD_OPTIONS = [
  { value: "end", label: "엔드별" },
  { value: "match", label: "경기별" },
  { value: "day", label: "일별" },
  { value: "week", label: "주별" },
  { value: "month", label: "월별" },
  { value: "year", label: "연별" },
];
const SORT_OPTIONS = [
  { value: "score", label: "평균점수순" },
  { value: "date", label: "날짜순" },
  { value: "name", label: "이름순" },
  { value: "distance", label: "거리순" },
];
const CHART_COLORS = {
  avg: "#1d4ed8",
  score: "#dc2626",
  me: "#1d4ed8",
  rival: "#f59e0b",
};

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const FIREBASE_READY = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
);

const DEFAULT_UI = { activeTab: "dashboard" };

const ADMIN_EMAILS = ["theyoung37k@gmail.com", "5@gmail.com"];
const ADMIN_STORAGE_KEY = "elbowshot_admin_emails";

async function deleteAllSessionsForUser(db, uid) {
  const q = query(collection(db, "sessions"), where("userId", "==", uid));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    await deleteDoc(doc(db, "sessions", d.id));
  }
}


function getStoredAdminEmails() {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item || "").trim().toLowerCase()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

function getAllAdminEmails() {
  return Array.from(new Set([...ADMIN_EMAILS, ...getStoredAdminEmails()]));
}

function isAdminEmail(email) {
  return getAllAdminEmails().includes(String(email || "").trim().toLowerCase());
}

function getInputTypeLabel(recordInputType) {
  if (recordInputType === "distance") return "거리기반";
  return "엔드기반";
}

function getModeLabel(mode) {
  if (mode === "set") return "세트제";
  return "누적제";
}

function normalizeDivisionLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/\s+/g, "").replace(/학년$/,"");
}

function formatProfileDivisionLabel(value) {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  const elementary = raw.match(/^초등(\d)$/);
  if (elementary) return `초${elementary[1]}`;
  const middle = raw.match(/^중등(\d)$/);
  if (middle) return `중${middle[1]}`;
  const high = raw.match(/^고등(\d)$/);
  if (high) return `고${high[1]}`;
  if (raw === "대학부") return "대학부";
  if (raw === "일반부") return "일반부";
  if (raw === "국가대표") return "국가대표";
  return raw;
}

function formatGroupDisplayName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "-";
  return raw
    .replace(/초등학교$/g, "초")
    .replace(/중학교$/g, "중")
    .replace(/고등학교$/g, "고")
    .replace(/초등$/g, "초")
    .replace(/중등$/g, "중")
    .replace(/고등$/g, "고");
}

function getRankingGroup(division, gender) {
  const d = String(division || "").trim();
  const g = String(gender || "남").trim();
  if (/^초등[1-4]$/.test(d)) return "저학년";
  if (/^초등[5-6]$/.test(d)) return "고학년";
  if (/^중등[1-3]$/.test(d)) return "중등부";
  if (/^고등[1-3]$/.test(d)) return g === "여" ? "고등부(여)" : "고등부(남)";
  if (d === "대학부" || d === "일반부") return g === "여" ? "대학/일반부(여)" : "대학/일반부(남)";
  return "";
}

function getRequiredDistancesForRankingGroup(rankingGroup) {
  return RANKING_GROUP_DISTANCE_RULES[rankingGroup] || [];
}

function normalizeSessionShape(session, profile = null) {
  const safe = session || {};
  const arrowsPerEnd = safe.arrowsPerEnd || 6;
  const ends = Array.isArray(safe.ends) && safe.ends.length
    ? safe.ends.map((end, idx) => ({
        id: end.id || uid("end"),
        index: idx + 1,
        arrows: Array.from({ length: arrowsPerEnd }, (_, i) => end.arrows?.[i] ?? null),
        opponentTotal: end.opponentTotal || 0,
        opponentScoreEntered: Boolean(end.opponentScoreEntered),
      }))
    : Array.from({ length: safe.totalEnds || 6 }, (_, i) => createEmptyEnd(i + 1, arrowsPerEnd));

  const distanceRounds = Array.isArray(safe.distanceRounds) && safe.distanceRounds.length
    ? safe.distanceRounds.map((round, idx) => ({
        id: round.id || uid("dist"),
        index: idx + 1,
        distance: Number(round.distance) || 18,
        total: Number(round.total) || 0,
      }))
    : [
        { id: uid("dist"), index: 1, distance: 35, total: 0 },
        { id: uid("dist"), index: 2, distance: 30, total: 0 },
        { id: uid("dist"), index: 3, distance: 25, total: 0 },
        { id: uid("dist"), index: 4, distance: 20, total: 0 },
      ];

  return {
    ...safe,
    title: safe.title || "누적제 X-Session",
    sessionDate: safe.sessionDate || getCurrentLocalDateString(),
    mode: safe.mode || "cumulative",
    recordInputType: safe.recordInputType || "end",
    distance: Number(safe.distance) || 70,
    division: safe.division || profile?.division || "",
    gender: safe.gender || profile?.gender || "남",
    arrowsPerEnd,
    arrowsPerDistance: safe.arrowsPerDistance || 36,
    totalEnds: ends.length,
    setPoints: safe.setPoints || { me: 0, opponent: 0 },
    ends,
    distanceRounds,
    isComplete: Boolean(safe.isComplete),
  };
}

function getIsoDateOffset(days = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildSampleDistanceSession({
  userId,
  date,
  title,
  division,
  clubName,
  groupName,
  distance,
  arrowsPerDistance,
  rounds,
}) {
  const distanceRounds = rounds.map((round, idx) => ({
    id: `sample_round_${idx + 1}_${round.distance}`,
    index: idx + 1,
    distance: round.distance,
    total: round.total,
  }));

  const totalScore = distanceRounds.reduce((sum, round) => sum + (Number(round.total) || 0), 0);
  const totalArrows = distanceRounds.length * (Number(arrowsPerDistance) || 0);

  return {
    id: uid('sample_session'),
    sessionId: uid('sample_session'),
    userId,
    title,
    sessionDate: date,
    updatedAt: `${date}T09:00:00.000Z`,
    createdAt: `${date}T09:00:00.000Z`,
    mode: 'cumulative',
    recordInputType: 'distance',
    distance,
    division,
    clubName,
    groupName,
    arrowsPerEnd: 6,
    arrowsPerDistance,
    totalEnds: 0,
    ends: [],
    distanceRounds,
    isComplete: true,
    isSampleData: true,
    summary: {
      totalScore,
      totalArrows,
      xCount: 0,
      hitCount: 0,
      averageArrow: totalArrows ? Number((totalScore / totalArrows).toFixed(2)) : 0,
      averageEnd: distanceRounds.length ? Number((totalScore / distanceRounds.length).toFixed(2)) : 0,
      setPointsMe: 0,
      setPointsOpponent: 0,
      bestEndScore: distanceRounds.length ? Math.max(...distanceRounds.map((r) => Number(r.total) || 0)) : 0,
      worstEndScore: distanceRounds.length ? Math.min(...distanceRounds.map((r) => Number(r.total) || 0)) : 0,
    },
  };
}

function buildTestRecordSheets(userId) {
  if (!userId) return [];
  return [
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 남자초등 U-11',
      division: '남자초등 U-11',
      clubName: '연무초등학교',
      groupName: '연무초등학교',
      distance: 35,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 35, total: 337 },
        { distance: 30, total: 342 },
        { distance: 25, total: 342 },
        { distance: 20, total: 351 },
      ],
    }),
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 여자초등 U-11',
      division: '여자초등 U-11',
      clubName: '천현초등학교',
      groupName: '천현초등학교',
      distance: 35,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 35, total: 305 },
        { distance: 30, total: 325 },
        { distance: 25, total: 339 },
        { distance: 20, total: 343 },
      ],
    }),
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 남자 컴파운드',
      division: '남자-컴파운드',
      clubName: '팀 자이언트',
      groupName: '팀 자이언트',
      distance: 50,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 50, total: 354 },
        { distance: 50, total: 347 },
        { distance: 30, total: 356 },
        { distance: 30, total: 358 },
      ],
    }),
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 여자 컴파운드',
      division: '여자-컴파운드',
      clubName: '신장중학교',
      groupName: '신장중학교',
      distance: 50,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 50, total: 328 },
        { distance: 50, total: 324 },
        { distance: 30, total: 339 },
        { distance: 30, total: 348 },
      ],
    }),
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 남자중등부',
      division: '남자중등부',
      clubName: '성포중학교',
      groupName: '성포중학교',
      distance: 60,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 60, total: 338 },
        { distance: 50, total: 322 },
        { distance: 40, total: 347 },
        { distance: 30, total: 357 },
      ],
    }),
    buildSampleDistanceSession({
      userId,
      date: '2026-04-12',
      title: '테스트기록지 · 여자중등부',
      division: '여자중등부',
      clubName: '여흥중학교',
      groupName: '여흥중학교',
      distance: 60,
      arrowsPerDistance: 36,
      rounds: [
        { distance: 60, total: 331 },
        { distance: 50, total: 324 },
        { distance: 40, total: 339 },
        { distance: 30, total: 351 },
      ],
    }),
  ];
}

const SAMPLE_SHEETS = [
  {
    id: "sheet_2026_03_22",
    date: "2026-03-22",
    division: "초등4",
    recordInputType: "distance",
    sheetLabel: "테스트기록지 2026-03-22",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "황리우", school: "천현초등학교", rounds: [302, 315, 332, 333], total: 1282 },
      { name: "김설", school: "안양서초등학교", rounds: [277, 312, 314, 332], total: 1235 },
      { name: "김태리", school: "하성초등학교", rounds: [271, 302, 320, 334], total: 1227 },
      { name: "조유나", school: "수진초등학교", rounds: [271, 302, 311, 326], total: 1210 },
      { name: "장윤혜", school: "송정초등학교", rounds: [282, 288, 293, 336], total: 1199 },
      { name: "원율", school: "여흥초등학교", rounds: [264, 291, 319, 310], total: 1184 },
      { name: "김서우", school: "수진초등학교", rounds: [279, 276, 302, 291], total: 1148 },
      { name: "홍지수", school: "송정초등학교", rounds: [248, 264, 294, 318], total: 1124 },
      { name: "김소율", school: "타겟28양궁클럽", rounds: [278, 232, 272, 326], total: 1108 },
      { name: "강민서", school: "여흥초등학교", rounds: [253, 263, 270, 303], total: 1089 },
      { name: "조윤서", school: "안양서초등학교", rounds: [253, 242, 277, 300], total: 1072 },
      { name: "송의나", school: "수진초등학교", rounds: [227, 270, 269, 304], total: 1070 },
      { name: "백수연", school: "여흥초등학교", rounds: [202, 270, 275, 320], total: 1067 },
      { name: "김윤서", school: "원미초등학교", rounds: [195, 255, 290, 301], total: 1041 },
      { name: "백가은", school: "안양서초등학교", rounds: [165, 216, 273, 288], total: 942 },
      { name: "김민채", school: "천현초등학교", rounds: [225, 213, 250, 243], total: 931 },
      { name: "조예늘", school: "하성초등학교", rounds: [189, 203, 250, 278], total: 920 },
      { name: "윤이진", school: "여흥초등학교", rounds: [145, 194, 231, 307], total: 877 },
      { name: "고은", school: "안양서초등학교", rounds: [177, 212, 229, 255], total: 873 },
      { name: "황리안", school: "천현초등학교", rounds: [159, 152, 209, 245], total: 765 },
      { name: "이주아", school: "안양서초등학교", rounds: [65, 138, 117, 184], total: 504 },
    ],
  },
  {
    id: "sheet_2026_04_12",
    date: "2026-04-12",
    division: "초등4",
    recordInputType: "distance",
    sheetLabel: "테스트기록지 2026-04-12",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "황리우", school: "천현초등학교", rounds: [305, 325, 339, 343], total: 1312 },
      { name: "김태리", school: "하성초등학교", rounds: [298, 311, 322, 345], total: 1276 },
      { name: "조유나", school: "수진초등학교", rounds: [292, 301, 319, 339], total: 1251 },
      { name: "장윤혜", school: "송정초등학교", rounds: [294, 286, 320, 330], total: 1230 },
      { name: "김서우", school: "수진초등학교", rounds: [262, 304, 323, 338], total: 1227 },
      { name: "김설", school: "안양서초등학교", rounds: [270, 301, 315, 327], total: 1213 },
      { name: "강민서", school: "여흥초등학교", rounds: [272, 288, 317, 325], total: 1202 },
      { name: "김소율", school: "타겟28양궁클럽", rounds: [244, 275, 307, 332], total: 1158 },
      { name: "홍지수", school: "송정초등학교", rounds: [257, 288, 294, 314], total: 1153 },
      { name: "원율", school: "여흥초등학교", rounds: [242, 261, 308, 327], total: 1138 },
      { name: "송의나", school: "수진초등학교", rounds: [246, 257, 307, 325], total: 1135 },
      { name: "김민채", school: "천현초등학교", rounds: [222, 236, 288, 307], total: 1053 },
      { name: "백가은", school: "안양서초등학교", rounds: [238, 230, 272, 302], total: 1042 },
      { name: "조예늘", school: "하성초등학교", rounds: [166, 242, 292, 304], total: 1004 },
      { name: "백수연", school: "여흥초등학교", rounds: [179, 245, 252, 292], total: 968 },
      { name: "김윤서", school: "원미초등학교", rounds: [165, 198, 258, 249], total: 870 },
      { name: "조윤서", school: "안양서초등학교", rounds: [190, 230, 218, 223], total: 861 },
      { name: "윤이진", school: "여흥초등학교", rounds: [139, 185, 252, 267], total: 843 },
      { name: "고은", school: "안양서초등학교", rounds: [139, 185, 207, 260], total: 829 },
      { name: "황리안", school: "천현초등학교", rounds: [157, 205, 211, 281], total: 755 },
      { name: "김바다", school: "당정초등학교", rounds: [112, 151, 263, 312], total: 575 },
      { name: "이주아", school: "안양서초등학교", rounds: [55, 116, 79, 106], total: 356 },
    ],
  },
];

function makeSampleUserId(name, school) {
  return `sample_${school}_${name}`.replace(/[^a-zA-Z0-9가-힣_]/g, "_");
}

function buildPermanentSampleUsers() {
  const map = new Map();
  SAMPLE_SHEETS.forEach((sheet) => {
    sheet.rows.forEach((row) => {
      const id = makeSampleUserId(row.name, row.school);
      if (!map.has(id)) {
        map.set(id, {
          id,
          uid: id,
          name: row.name,
          email: `${id}@sample.local`,
          club: row.school,
          clubName: row.school,
          groupName: row.school,
          division: sheet.division,
          avatar: "",
          photoURL: "",
          photoPath: "",
          isSampleData: true,
        });
      }
    });
  });
  return Array.from(map.values());
}

function buildPermanentSampleSessions() {
  return SAMPLE_SHEETS.flatMap((sheet) =>
    sheet.rows.map((row) =>
      buildSampleDistanceSession({
        userId: makeSampleUserId(row.name, row.school),
        date: sheet.date,
        title: `${sheet.sheetLabel} · ${row.name}`,
        division: sheet.division,
        clubName: row.school,
        groupName: row.school,
        distance: sheet.distances[0],
        arrowsPerDistance: 36,
        rounds: sheet.distances.map((distance, idx) => ({
          distance,
          total: row.rounds[idx],
        })),
      })
    )
  );
}

function buildCurrentUserPermanentSamples(userId) {
  if (!userId) return [];
  return SAMPLE_SHEETS.map((sheet) => {
    const row = sheet.rows[0];
    return buildSampleDistanceSession({
      userId,
      date: sheet.date,
      title: `${sheet.sheetLabel}`,
      division: sheet.division,
      clubName: row.school,
      groupName: row.school,
      distance: sheet.distances[0],
      arrowsPerDistance: 36,
      rounds: sheet.distances.map((distance, idx) => ({
        distance,
        total: row.rounds[idx],
      })),
    });
  });
}

function scoreToNumber(v) {
  if (v === "X") return 10;
  if (v === "M") return 0;
  return Number(v) || 0;
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function getDisplayName(user) {
  if (!user) return "이름없음";
  const raw = String(user.name || "").trim();
  if (raw) return raw;
  const email = String(user.email || "").trim();
  if (email.includes("@")) return email.split("@")[0];
  return "이름없음";
}

function createEmptyEnd(index, arrowsPerEnd) {
  return {
    id: uid("end"),
    index,
    arrows: Array.from({ length: arrowsPerEnd }, () => null),
    opponentTotal: 0,
    opponentScoreEntered: false,
  };
}

function createEmptyDistanceRound(index, distance = 70) {
  return {
    id: uid("round"),
    index,
    distance,
    total: 0,
  };
}

function isSessionContentEmpty(session) {
  if (!session) return true;

  const hasArrowInput = (session.ends || []).some((end) =>
    (end.arrows || []).some((arrow) => arrow !== null && arrow !== undefined && String(arrow).trim() !== "")
  );

  const hasOpponentInput = (session.ends || []).some((end) => {
    if (end.opponentScoreEntered) return true;
    return String(end.opponentTotal ?? "").trim() !== "";
  });

  const hasDistanceInput = (session.distanceRounds || []).some((round) => Number(round.total) > 0);

  return !hasArrowInput && !hasOpponentInput && !hasDistanceInput;
}

function shouldAutoRefreshDraftSessionDate(session, editingSessionId) {
  if (!session || editingSessionId) return false;
  return isSessionContentEmpty(session) && session.sessionDate !== getCurrentLocalDateString();
}

function createNewSession(profile, mode = "cumulative") {
  return {
    id: uid("draft"),
    title: `${mode === "set" ? "세트제" : "누적제"} X-Session`,
    sessionDate: getCurrentLocalDateString(),
    mode,
    recordInputType: "end",
    distance: 70,
    division: profile?.division || "",
    arrowsPerEnd: 6,
    arrowsPerDistance: 36,
    totalEnds: 6,
    setPoints: { me: 0, opponent: 0 },
    ends: Array.from({ length: 6 }, (_, i) => createEmptyEnd(i + 1, 6)),
    distanceRounds: [
      createEmptyDistanceRound(1, 35),
      createEmptyDistanceRound(2, 30),
      createEmptyDistanceRound(3, 25),
      createEmptyDistanceRound(4, 20),
    ],
    isComplete: false,
  };
}

function endTotal(end) {
  return end.arrows.reduce((sum, v) => sum + scoreToNumber(v), 0);
}

function getSessionTotal(session) {
  return session.ends.reduce((sum, end) => sum + endTotal(end), 0);
}

function getHits(session) {
  return session.ends.flatMap((end) => end.arrows).filter((v) => v !== null && v !== undefined && v !== "").length;
}

function getXs(session) {
  return session.ends.flatMap((end) => end.arrows).filter((v) => v === "X").length;
}

function getArrowCount(session) {
  return session.ends.flatMap((end) => end.arrows).filter((v) => v !== null).length;
}

function getAverageArrow(session) {
  const count = getArrowCount(session);
  return count ? getSessionTotal(session) / count : 0;
}

function deriveSetPoints(session) {
  if (session.mode !== "set") return { me: 0, opponent: 0 };
  return session.ends.reduce(
    (acc, end) => {
      const myTotal = endTotal(end);
      const oppTotal = Number(end.opponentTotal) || 0;
      if (myTotal > oppTotal) acc.me += 2;
      else if (myTotal < oppTotal) acc.opponent += 2;
      else {
        acc.me += 1;
        acc.opponent += 1;
      }
      return acc;
    },
    { me: 0, opponent: 0 }
  );
}



function formatCompactDate(value) {
  if (!value) return "-";
  const d = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ko-KR");
  } catch {
    return String(value);
  }
}


function paginateItems(items, page, perPage = 3) {
  const safePage = Math.max(1, Number(page || 1));
  const start = (safePage - 1) * perPage;
  return items.slice(start, start + perPage);
}

function PaginationControls({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {Array.from({ length: totalPages }).map((_, index) => {
        const value = index + 1;
        return (
          
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        경기일 {formatCompactDate(session.sessionDate)}
                        <span className="ml-2 text-xs text-slate-400">저장 {formatDateTime(session.updatedAt)}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-snug text-slate-700">
                        <span>
                          총점 {session.summary?.totalScore ?? getSessionTotal(session)} / X{" "}
                          {session.summary?.xCount ?? getXs(session)} / 평균{" "}
                          {(
                            session.summary?.averageArrow ?? getAverageArrow(session)
                          ).toFixed(2)}
                        </span>
                        <span className="text-slate-500">
                          {session.recordInputType === "distance"
                            ? `거리기록 ${(session.distanceRounds || []).length}개`
                            : `${session.distance}m, 엔드 ${session.ends.length}개`}
                        </span>
                        <Button
                          variant="outline"
                          className="h-9 rounded-2xl px-3"
                          onClick={() => onEditSession?.(session.id)}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> 수정
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, sub, icon: Icon, tone }) {
  const toneMap = {
    blue: "from-blue-900 to-blue-700 text-white",
    red: "from-red-700 to-red-500 text-white",
    slate: "from-slate-900 to-slate-700 text-white",
    gold: "from-amber-500 to-yellow-400 text-slate-900",
  };

  return (
    <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
      <CardContent className={`bg-gradient-to-br p-5 ${toneMap[tone] || toneMap.slate}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm opacity-80">{title}</div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
            <div className="mt-2 text-xs opacity-80">{sub}</div>
          </div>
          <div className="rounded-2xl bg-white/15 p-3">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function RankingBoard({ users, sessions, currentUserId }) {
  const [rankingType, setRankingType] = useState("distance");
  const [rankingFilters, setRankingFilters] = useState({
    distance: "all",
    rankingGroup: "all",
    groupName: "all",
    regionCity: "all",
  });

  const groupOptions = useMemo(() => Array.from(new Set(users.map((u) => u.groupName).filter(Boolean))), [users]);
  const regionOptions = useMemo(() => REGION_OPTIONS, []);

  const distanceRankings = useMemo(() => {
    const items = buildDistanceRankings(users, sessions, rankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [users, sessions, rankingFilters]);

  const totalRankings = useMemo(() => {
    const items = buildTotalRankings(users, sessions, rankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [users, sessions, rankingFilters]);

  const weeklyDistanceRankings = useMemo(() => {
    const items = buildDistanceRankings(users, sessions, rankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [users, sessions, rankingFilters]);

  const weeklyTotalRankings = useMemo(() => {
    const items = buildTotalRankings(users, sessions, rankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [users, sessions, rankingFilters]);

  const activeRankings =
    rankingType === "distance"
      ? distanceRankings
      : rankingType === "total"
        ? totalRankings
        : rankingType === "weeklyDistance"
          ? weeklyDistanceRankings
          : weeklyTotalRankings;

  const myRank = activeRankings.find((item) => item.userId === currentUserId);

  const rankingGuide =
    rankingType === "distance"
      ? "36발 경기 기준, 랭킹 구분별 필수 거리 조건을 충족한 최고 기록 점수로 순위가 결정됩니다."
      : rankingType === "total"
        ? "랭킹 구분별 필수 4거리 최고 기록을 합산한 점수 기준으로 순위가 결정됩니다."
        : rankingType === "weeklyDistance"
          ? "최근 7일 기준, 랭킹 구분별 필수 거리 조건을 충족한 최고 점수로 순위가 결정됩니다."
          : "최근 7일 동안 랭킹 구분별 필수 4거리 최고 기록을 합산한 점수 기준으로 순위가 결정됩니다.";

  return (
    <div className="grid gap-4 xl:grid-cols-[0.72fr_1.28fr]">
      <div className="grid gap-4">
        <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" /> 내 랭킹
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
              {rankingGuide}
            </div>
            {myRank ? (
              <div className="space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-red-700 p-6 text-white shadow-lg">
                  <div className="text-sm opacity-80">현재 순위</div>
                  <div className="mt-2 text-5xl font-bold">#{myRank.rank}</div>
                  <div className="mt-2 text-sm opacity-90">
                    {rankingType === "distance" || rankingType === "weeklyDistance" ? (
                      <>
                        {myRank.distance}m · 최고 {myRank.bestScore}점 · 인정 기록 {myRank.qualifiedSessions}개
                      </>
                    ) : (
                      <>
                        종합 {myRank.totalScore}점 · 기준 거리 {myRank.requiredDistances.join(" / ")}m
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                현재 선택한 조건에서 랭킹에 반영된 기록이 없다.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-red-600" /> X-Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            <Button
              variant={rankingType === "distance" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setRankingType("distance")}
            >
              거리 랭킹
            </Button>
            <Button
              variant={rankingType === "total" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setRankingType("total")}
            >
              종합 랭킹
            </Button>
            <Button
              variant={rankingType === "weeklyDistance" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setRankingType("weeklyDistance")}
            >
              주간 거리
            </Button>
            <Button
              variant={rankingType === "weeklyTotal" ? "default" : "outline"}
              className="rounded-2xl"
              onClick={() => setRankingType("weeklyTotal")}
            >
              주간 종합
            </Button>
          </div>

          <div className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
            {rankingGuide}
          </div>

          <div className="grid gap-2">
            {(rankingType === "distance" || rankingType === "weeklyDistance") && (
              <div className="flex flex-wrap items-center gap-2">
                <Label className="w-16 shrink-0 text-sm">거리</Label>
                <select
                  value={rankingFilters.distance}
                  onChange={(e) => setRankingFilters((prev) => ({ ...prev, distance: e.target.value }))}
                  className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
                >
                  <option value="all">전체 거리</option>
                  {DISTANCE_OPTIONS.map((distance) => (
                    <option key={distance} value={String(distance)}>{distance}m</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">구분</Label>
              <select
                value={rankingFilters.rankingGroup}
                onChange={(e) => setRankingFilters((prev) => ({ ...prev, rankingGroup: e.target.value }))}
                className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
              >
                <option value="all">전체 구분</option>
                {RANKING_GROUP_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">학교/소속</Label>
              <select
                value={rankingFilters.groupName}
                onChange={(e) => setRankingFilters((prev) => ({ ...prev, groupName: e.target.value }))}
                className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
              >
                <option value="all">전체 학교/소속팀</option>
                {groupOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">지역</Label>
              <select
                value={rankingFilters.regionCity}
                onChange={(e) => setRankingFilters((prev) => ({ ...prev, regionCity: e.target.value }))}
                className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
              >
                <option value="all">전체 지역</option>
                {regionOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            {activeRankings.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                현재 조건에서 랭킹에 반영된 기록이 없다.
              </div>
            ) : (
              <div className="grid gap-3">
                {activeRankings.map((item) => (
                  <div
                    key={`${rankingType}_${item.userId}_${item.distance || "total"}`}
                    className={`rounded-2xl border px-3 py-2 ${
                      item.userId === currentUserId
                        ? "border-blue-300 bg-blue-50"
                        : item.rank <= 3
                          ? "border-amber-300 bg-amber-50"
                          : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-white ${
                        item.rank === 1
                          ? "bg-gradient-to-br from-amber-400 to-yellow-300 text-slate-900"
                          : item.rank === 2
                            ? "bg-gradient-to-br from-slate-400 to-slate-300 text-slate-900"
                            : item.rank === 3
                              ? "bg-gradient-to-br from-orange-500 to-amber-700"
                              : "bg-gradient-to-br from-blue-900 to-red-700"
                      }`}>
                        {item.rank}
                      </div>
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <div className="truncate text-sm font-semibold">{item.name}</div>
                          {item.userId === currentUserId && (
                            <Badge className="h-5 rounded-full bg-blue-900 px-2 text-[10px] text-white">나</Badge>
                          )}
                          <div className="min-w-0 truncate text-[11px] text-slate-500">
                            {(rankingType === "distance" || rankingType === "weeklyDistance")
                              ? `${item.regionCity || "-"} ${formatGroupDisplayName(item.groupName)} ${formatProfileDivisionLabel(item.division)}`
                              : `${formatGroupDisplayName(item.groupName)} · ${item.regionCity || "-"} · ${formatProfileDivisionLabel(item.division)}`}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 pl-2 text-right text-sm font-semibold text-slate-500">
                        {rankingType === "distance" || rankingType === "weeklyDistance"
                          ? `${item.bestScore}점`
                          : `총점 ${Number(item.totalScore || 0).toFixed(0)}`}
                      </div>
                    </div>

                    <div className="mt-1 pl-10 text-[11px] leading-5 text-slate-700">
                      {rankingType === "distance" || rankingType === "weeklyDistance" ? (
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span>{item.distance}m</span>
                          <span>{item.rankingGroup}</span>
                          <span>인정세션{item.qualifiedSessions}</span>
                          <span>{formatCompactDate(item.latestDate)}</span>
                        </div>
                      ) : (
                        <>
                          {item.requiredDistances.map((distance) => `${distance}m ${item.distanceScores[distance]}점`).join(" · ")}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function AnalysisBoard({ currentUser, users, sessions }) {
  const [period, setPeriod] = useState("day");
  const [matchType, setMatchType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [requiredFilters, setRequiredFilters] = useState({
    distance: "",
    rankingGroup: "",
    regionCity: "all",
  });

  const allMySessions = sessions.filter((s) => s.userId === currentUser.id && s.isComplete);
  const rivalCandidates = users.filter((u) => u.id !== currentUser.id);
  const [rivalSearch, setRivalSearch] = useState("");
  const [selectedRival, setSelectedRival] = useState(rivalCandidates[0]?.id || "none");

  useEffect(() => {
    if (!rivalCandidates.find((u) => u.id === selectedRival)) {
      setSelectedRival(rivalCandidates[0]?.id || "none");
    }
  }, [selectedRival, rivalCandidates]);

  const filteredRivalCandidates = useMemo(() => {
    const keyword = String(rivalSearch || "").trim().toLowerCase();
    if (!keyword) return rivalCandidates;
    return rivalCandidates.filter((user) => {
      return [
        getDisplayName(user),
        user.groupName,
        user.regionCity,
        user.division,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
  }, [rivalCandidates, rivalSearch]);

  useEffect(() => {
    if (!filteredRivalCandidates.find((u) => u.id === selectedRival)) {
      setSelectedRival(filteredRivalCandidates[0]?.id || "none");
    }
  }, [selectedRival, filteredRivalCandidates]);

  const isReady = Boolean(requiredFilters.distance && requiredFilters.rankingGroup);

  const filteredMine = allMySessions.filter(
    (s) =>
      isReady &&
      String(s.distance) === String(requiredFilters.distance) &&
      getRankingGroup(s.division || currentUser.division || "", s.gender || currentUser.gender || "남") === requiredFilters.rankingGroup &&
      (requiredFilters.regionCity === "all" ? true : (s.regionCity || currentUser.regionCity || "") === requiredFilters.regionCity) &&
      isWithinDateFilter(s.sessionDate, dateFilter)
  );

  const rivalUser = users.find((u) => u.id === selectedRival);

  const rivalSessions = sessions
    .filter((s) => s.userId === selectedRival && s.isComplete)
    .filter(
      (s) =>
        isReady &&
        String(s.distance) === String(requiredFilters.distance) &&
        getRankingGroup(s.division || rivalUser?.division || "", s.gender || rivalUser?.gender || "남") === requiredFilters.rankingGroup &&
        (requiredFilters.regionCity === "all" ? true : (s.regionCity || rivalUser?.regionCity || "") === requiredFilters.regionCity) &&
        isWithinDateFilter(s.sessionDate, dateFilter)
    );

  const analytics = useMemo(() => buildAnalyticsData(filteredMine, period, matchType), [filteredMine, period, matchType]);
  const comparison = useMemo(() => buildRivalComparison(filteredMine, rivalSessions, period, matchType), [filteredMine, rivalSessions, period, matchType]);
  const rivalLabel = getDisplayName(rivalUser);
  const trend = getTrendInsight(filteredMine);
  const distancePerformance = getDistancePerformance(allMySessions.filter((s) => isWithinDateFilter(s.sessionDate, dateFilter)));
  const weakZoneInsight = getWeakZoneInsight(filteredMine);

  return (
    <div className="grid gap-4">
      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-700" /> X-Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">거리</Label>
              <select value={requiredFilters.distance} onChange={(e) => setRequiredFilters((prev) => ({ ...prev, distance: e.target.value }))} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                <option value="">거리 선택</option>
                {DISTANCE_OPTIONS.map((distance) => (
                  <option key={distance} value={String(distance)}>{distance}m</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">랭킹 구분</Label>
              <select value={requiredFilters.rankingGroup} onChange={(e) => setRequiredFilters((prev) => ({ ...prev, rankingGroup: e.target.value }))} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                <option value="">랭킹 구분 선택</option>
                {RANKING_GROUP_OPTIONS.map((item) => (<option key={item} value={item}>{item}</option>))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">지역</Label>
              <select value={requiredFilters.regionCity} onChange={(e) => setRequiredFilters((prev) => ({ ...prev, regionCity: e.target.value }))} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                <option value="all">전체 지역</option>
                {REGION_OPTIONS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">날짜</Label>
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                {DATE_FILTER_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">경기 방식</Label>
              <select value={matchType} onChange={(e) => setMatchType(e.target.value)} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                {MATCH_TYPE_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">분석 기준</Label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none">
                {PERIOD_OPTIONS.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
          </div>

          {!isReady ? (
            <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
              분석 결과를 보려면 거리와 학년/부문을 선택해야 한다.
            </div>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <Card className="rounded-[24px] border-0 bg-slate-50 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-2 text-sm text-slate-500">직전 경기 추세</div>
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      {trend.up === true && <TrendingUp className="h-5 w-5 text-emerald-600" />}
                      {trend.up === false && <TrendingDown className="h-5 w-5 text-red-600" />}
                      {trend.label}
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-[24px] border-0 bg-slate-50 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-2 text-sm text-slate-500">약점 구간</div>
                    <div className="text-lg font-semibold">{weakZoneInsight}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-[24px] border-0 bg-slate-50 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-2 text-sm text-slate-500">현재 선택 조건 경기 수</div>
                    <div className="text-3xl font-bold">{filteredMine.length}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">평균 화살 점수 변화</div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics} margin={{ top: 8, right: 6, left: -8, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickMargin={8} />
                        <YAxis domain={[0, 10]} width={28} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: 12 }} />
                        <Line type="monotone" dataKey="avgArrow" name="평균 화살 점수" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 4, fill: CHART_COLORS.avg }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-3 sm:p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">구간별 총점</div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics} margin={{ top: 8, right: 4, left: -14, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} tickMargin={8} />
                        <YAxis width={30} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend wrapperStyle={{ paddingTop: 12 }} />
                        <Bar dataKey="score" name="총점" fill={CHART_COLORS.score} radius={[8, 8, 0, 0]} maxBarSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-3 sm:p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">거리별 성능 비교</div>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distancePerformance} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} tickMargin={8} />
                      <YAxis domain={[0, 10]} width={28} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ paddingTop: 12 }} />
                      <Bar dataKey="avgArrow" name="거리별 평균 화살 점수" fill={CHART_COLORS.avg} radius={[8, 8, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Swords className="h-5 w-5 text-red-700" /> X-Analysis Rival Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            {!isReady && (
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
                먼저 거리와 학년/부문을 선택해야 라이벌 비교가 활성화된다.
              </div>
            )}

            <div className="grid min-w-0 flex-1 gap-2">
              <Label>라이벌 선택</Label>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
                <Input
                  value={rivalSearch}
                  onChange={(e) => setRivalSearch(e.target.value)}
                  placeholder="이름 검색"
                  className="h-11 rounded-2xl"
                />
                <select
                  value={selectedRival}
                  onChange={(e) => setSelectedRival(e.target.value)}
                  className="h-11 min-w-0 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  {filteredRivalCandidates.length === 0 ? (
                    <option value="none">검색 결과 없음</option>
                  ) : (
                    filteredRivalCandidates.map((user) => (
                      <option key={user.id} value={user.id}>{getDisplayName(user)}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="pb-2 text-sm text-slate-500">나 vs {rivalLabel}</div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-red-50 p-3 sm:p-4">
            <div className="mb-3 text-sm font-semibold text-slate-700">평균 화살 점수 비교</div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparison} margin={{ top: 8, right: 6, left: -6, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} tickMargin={8} />
                  <YAxis domain={[0, 10]} width={28} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: 12 }} />
                  <Line type="monotone" dataKey="나" stroke={CHART_COLORS.me} strokeWidth={3} dot={{ r: 4, fill: CHART_COLORS.me }} />
                  <Line type="monotone" dataKey="라이벌" stroke={CHART_COLORS.rival} strokeWidth={3} dot={{ r: 4, fill: CHART_COLORS.rival }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function XStagePage({ appServices, stageRefreshKey = 0 }) {
  const [events, setEvents] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [eventPage, setEventPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadStageData() {
      if (!appServices?.db) {
        if (!cancelled) {
          setEvents([]);
          setNewsItems([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      try {
        const [eventSnap, newsSnap] = await Promise.all([
          getDocs(query(collection(appServices.db, "stage_events"), orderBy("date", "asc"))),
          getDocs(query(collection(appServices.db, "stage_news"), orderBy("createdAt", "desc"))),
        ]);

        if (cancelled) return;
        const loadedEvents = eventSnap.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
        const loadedNewsItems = newsSnap.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a, b) => {
            const aTime =
              typeof a.createdAt?.toDate === "function"
                ? a.createdAt.toDate().getTime()
                : new Date(a.createdAt || 0).getTime();
            const bTime =
              typeof b.createdAt?.toDate === "function"
                ? b.createdAt.toDate().getTime()
                : new Date(b.createdAt || 0).getTime();
            return bTime - aTime;
          });
        setEvents(loadedEvents);
        setNewsItems(loadedNewsItems);
        setEventPage(1);
        setNewsPage(1);
      } catch (error) {
        if (!cancelled) {
          setEvents([]);
          setNewsItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStageData();
    return () => {
      cancelled = true;
    };
  }, [appServices, stageRefreshKey]);

  const pagedEvents = paginateItems(events, eventPage, 3);
  const pagedNewsItems = paginateItems(newsItems, newsPage, 3);
  const totalEventPages = Math.ceil(events.length / 3);
  const totalNewsPages = Math.ceil(newsItems.length / 3);

  return (
    <Card className="rounded-[28px] border-0 bg-white/95 shadow-xl">
      <CardHeader>
        <CardTitle>X-Stage</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[22px] border border-slate-200 bg-white p-5">
          <div className="text-lg font-semibold text-slate-900">대회 일정</div>
          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="text-sm text-slate-500">불러오는 중...</div>
            ) : events.length === 0 ? (
              <div className="text-sm text-slate-500">아직 등록된 대회 일정이 없다.</div>
            ) : (
              <>
                {pagedEvents.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">{item.title || "제목 없음"}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {item.date || "-"} · {item.location || "장소 미정"}
                    </div>
                  </div>
                ))}
                <PaginationControls page={eventPage} totalPages={totalEventPages} onChange={setEventPage} />
              </>
            )}
          </div>
        </div>
        <div className="rounded-[22px] border border-slate-200 bg-white p-5">
          <div className="text-lg font-semibold text-slate-900">양궁 뉴스</div>
          <div className="mt-4 grid gap-3">
            {loading ? (
              <div className="text-sm text-slate-500">불러오는 중...</div>
            ) : newsItems.length === 0 ? (
              <div className="text-sm text-slate-500">아직 등록된 뉴스가 없다.</div>
            ) : (
              <>
                {pagedNewsItems.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-900">{item.title || "제목 없음"}</div>
                    <div className="mt-1 whitespace-pre-wrap text-xs text-slate-600">{item.content || ""}</div>
                  </div>
                ))}
                <PaginationControls page={newsPage} totalPages={totalNewsPages} onChange={setNewsPage} />
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function XBriefPage({ appServices, briefRefreshKey = 0 }) {
  const [notices, setNotices] = useState([]);
  const [briefPage, setBriefPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadNotices() {
      if (!appServices?.db) {
        if (!cancelled) {
          setNotices([]);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(appServices.db, "brief_notices"), orderBy("createdAt", "desc")));
        if (cancelled) return;
        const loadedNotices = snap.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a, b) => {
            const aTime =
              typeof a.createdAt?.toDate === "function"
                ? a.createdAt.toDate().getTime()
                : new Date(a.createdAt || 0).getTime();
            const bTime =
              typeof b.createdAt?.toDate === "function"
                ? b.createdAt.toDate().getTime()
                : new Date(b.createdAt || 0).getTime();
            return bTime - aTime;
          });
        setNotices(loadedNotices);
        setBriefPage(1);
      } catch (error) {
        if (!cancelled) setNotices([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadNotices();
    return () => {
      cancelled = true;
    };
  }, [appServices, briefRefreshKey]);

  const pagedNotices = paginateItems(notices, briefPage, 3);
  const totalBriefPages = Math.ceil(notices.length / 3);

  return (
    <Card className="rounded-[28px] border-0 bg-white/95 shadow-xl">
      <CardHeader>
        <CardTitle>X-Brief</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {loading ? (
            <div className="text-sm text-slate-500">불러오는 중...</div>
          ) : notices.length === 0 ? (
            <div className="rounded-[22px] border border-slate-200 bg-white p-5">
              <div className="text-lg font-semibold text-slate-900">공지사항</div>
              <div className="mt-2 text-sm text-slate-500">아직 등록된 공지가 없다.</div>
            </div>
          ) : (
            <>
              {pagedNotices.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-slate-200 bg-white p-5">
                  <div className="text-lg font-semibold text-slate-900">{item.title || "제목 없음"}</div>
                  <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.content || ""}</div>
                  <div className="mt-2 text-xs text-slate-400">{formatDateTime(item.createdAt)}</div>
                </div>
              ))}
              <PaginationControls page={briefPage} totalPages={totalBriefPages} onChange={setBriefPage} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ProfilePanel({ user, onUpdate, saving }) {
  const [form, setForm] = useState(user);
  const [savedMessage, setSavedMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(
    () =>
      setForm({
        ...user,
        division: user?.division || "전체학년",
        regionCity: user?.regionCity || "",
        regionDistrict: user?.regionDistrict || "",
        groupName: user?.groupName || "",
      }),
    [user]
  );

  const districtOptions = useMemo(() => getDistrictOptions(form?.regionCity), [form?.regionCity]);

  async function submit(e) {
    e.preventDefault();

    if (!form.name?.trim()) {
      setErrorMessage("이름을 입력해야 한다.");
      setSavedMessage("");
      return;
    }
    if (!form.division) {
      setErrorMessage("학년/부문을 선택해야 한다.");
      setSavedMessage("");
      return;
    }
    if (!form.gender) {
      setErrorMessage("성별을 선택해야 한다.");
      setSavedMessage("");
      return;
    }
    if (!form.groupName?.trim()) {
      setErrorMessage("소속을 입력해야 한다.");
      setSavedMessage("");
      return;
    }
    if (!form.regionCity) {
      setErrorMessage("지역(시/도)을 선택해야 한다.");
      setSavedMessage("");
      return;
    }
    if (!form.regionDistrict) {
      setErrorMessage("지역(구/군)을 선택해야 한다.");
      setSavedMessage("");
      return;
    }

    setErrorMessage("");
    const result = await onUpdate(form);

    if (result?.ok) {
      setSavedMessage(result.message || "프로필이 저장되었다.");
      setErrorMessage("");
      setTimeout(() => setSavedMessage(""), 1800);
      return;
    }

    setSavedMessage("");
    setErrorMessage(result?.message || "프로필 저장에 실패했다.");
  }

  return (
    <div className="grid gap-4">
      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle>프로필 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="flex items-center gap-4">
              <ProfileAvatar user={form} size="lg" />
              <div className="text-sm text-slate-500">이름의 첫 글자가 자동으로 표시된다.</div>
            </div>

            <div className="grid gap-2">
              <Label>이름</Label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="정확한 기록 관리를 위해 본명 사용 권장"
              />
              <div className="text-xs text-slate-500">정확한 기록 비교와 랭킹 관리를 위해 본명으로 입력하는 것을 권장한다.</div>
            </div>

            <div className="grid gap-2">
              <Label>이메일</Label>
              <Input value={form.email || ""} disabled />
            </div>

            <div className="grid gap-2">
              <Label>학년/부문</Label>
              <Select value={form.division || undefined} onValueChange={(value) => setForm({ ...form, division: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="학년 또는 부문 선택" />
                </SelectTrigger>
                <SelectContent>
                  {DIVISION_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>성별</Label>
              <Select value={form.gender || "남"} onValueChange={(value) => setForm({ ...form, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="성별 선택" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>소속</Label>
              <Input
                value={form.groupName || ""}
                onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                placeholder="예: 서울체고, OO클럽, OO실업팀"
              />
            </div>

            <div className="grid gap-2">
              <Label>지역(시/도)</Label>
              <select
                value={form.regionCity || ""}
                onChange={(e) => setForm({ ...form, regionCity: e.target.value, regionDistrict: "" })}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="">지역 선택</option>
                {REGION_OPTIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label>지역(구/군)</Label>
              <select
                value={form.regionDistrict || ""}
                onChange={(e) => setForm({ ...form, regionDistrict: e.target.value })}
                disabled={!form.regionCity}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-50"
              >
                <option value="">구/군 선택</option>
                {districtOptions.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {savedMessage && (
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {savedMessage}
              </div>
            )}

            <Button type="submit" disabled={saving} className="rounded-2xl bg-blue-900 hover:bg-blue-800">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              프로필 저장
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


function AdminPanel({ currentUser, users, sessions, appServices, onRefresh, onStageRefresh, onBriefRefresh }) {
  const [emailRegion, setEmailRegion] = useState("all");
  const [emailDivision, setEmailDivision] = useState("all");
  const [emailSubject, setEmailSubject] = useState("[X-SESSION 안내]");
  const [emailBody, setEmailBody] = useState("안녕하세요. X-SESSION 운영 안내입니다.");
  const [adminMemo, setAdminMemo] = useState(() => {
    try {
      return localStorage.getItem("elbowshot_admin_memo") || "";
    } catch {
      return "";
    }
  });
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [extraAdmins, setExtraAdmins] = useState(() => getStoredAdminEmails());
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [eventForm, setEventForm] = useState({ title: "", date: "", location: "" });
  const [newsForm, setNewsForm] = useState({ title: "", content: "" });
  const [briefForm, setBriefForm] = useState({ title: "", content: "" });
  const [publishMessage, setPublishMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("elbowshot_admin_memo", adminMemo);
    } catch {}
  }, [adminMemo]);

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(extraAdmins));
    } catch {}
  }, [extraAdmins]);

  const realUsers = useMemo(() => users.filter((user) => !user.isSampleData), [users]);
  const realSessions = useMemo(() => sessions.filter((session) => !session.isSampleData), [sessions]);

  const divisionOptions = useMemo(
    () => Array.from(new Set(realUsers.map((user) => user.division).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko")),
    [realUsers]
  );

  const regionOptions = useMemo(
    () => Array.from(new Set(realUsers.map((user) => user.regionCity).filter(Boolean))).sort((a, b) => a.localeCompare(b, "ko")),
    [realUsers]
  );

  const filteredRecipients = useMemo(() => {
    return realUsers.filter((user) => {
      if (!user.email) return false;
      if (emailDivision !== "all" && user.division !== emailDivision) return false;
      if (emailRegion !== "all" && user.regionCity !== emailRegion) return false;
      return true;
    });
  }, [realUsers, emailDivision, emailRegion]);

  const recipientEmails = useMemo(
    () => filteredRecipients.map((user) => user.email).filter(Boolean).join(","),
    [filteredRecipients]
  );

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(emailSubject || "");
    const body = encodeURIComponent(emailBody || "");
    return `mailto:${recipientEmails}?subject=${subject}&body=${body}`;
  }, [recipientEmails, emailSubject, emailBody]);

  const allAdmins = useMemo(() => getAllAdminEmails(), [extraAdmins]);

  const visibleUsers = useMemo(() => {
    const keyword = String(userSearch || "").trim().toLowerCase();
    const filtered = realUsers.filter((user) => {
      if (!keyword) return true;
      return [
        user.name,
        user.email,
        user.groupName,
        user.regionCity,
        user.division,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword));
    });
    return filtered
      .slice()
      .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ko"))
      .slice(0, 10);
  }, [realUsers, userSearch]);


  async function createStageEvent() {
    if (!appServices?.db) return alert("DB 연결이 준비되지 않았다.");
    if (!eventForm.title.trim() || !eventForm.date.trim()) {
      return alert("대회 제목과 날짜를 입력해줘.");
    }
    try {
      await addDoc(collection(appServices.db, "stage_events"), {
        title: eventForm.title.trim(),
        date: eventForm.date.trim(),
        location: eventForm.location.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || "",
      });
      setEventForm({ title: "", date: "", location: "" });
      setPublishMessage("대회 일정이 등록되었다.");
      onStageRefresh?.();
    } catch (error) {
      alert(error.message || "대회 일정 등록에 실패했다.");
    }
  }

  async function createStageNews() {
    if (!appServices?.db) return alert("DB 연결이 준비되지 않았다.");
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      return alert("뉴스 제목과 내용을 입력해줘.");
    }
    try {
      await addDoc(collection(appServices.db, "stage_news"), {
        title: newsForm.title.trim(),
        content: newsForm.content.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || "",
      });
      setNewsForm({ title: "", content: "" });
      setPublishMessage("양궁 뉴스가 등록되었다.");
      onStageRefresh?.();
    } catch (error) {
      alert(error.message || "양궁 뉴스 등록에 실패했다.");
    }
  }

  async function createBriefNotice() {
    if (!appServices?.db) return alert("DB 연결이 준비되지 않았다.");
    if (!briefForm.title.trim() || !briefForm.content.trim()) {
      return alert("공지 제목과 내용을 입력해줘.");
    }
    try {
      await addDoc(collection(appServices.db, "brief_notices"), {
        title: briefForm.title.trim(),
        content: briefForm.content.trim(),
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || "",
      });
      setBriefForm({ title: "", content: "" });
      setPublishMessage("공지사항이 등록되었다.");
      onBriefRefresh?.();
    } catch (error) {
      alert(error.message || "공지 등록에 실패했다.");
    }
  }

  async function copyRecipients() {
    try {
      await navigator.clipboard.writeText(recipientEmails);
      alert("수신자 이메일을 복사했다.");
    } catch {
      alert("복사에 실패했다.");
    }
  }

  function addAdminEmail() {
    const normalized = String(newAdminEmail || "").trim().toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      alert("올바른 관리자 이메일을 입력해줘.");
      return;
    }
    if (allAdmins.includes(normalized)) {
      alert("이미 등록된 관리자 이메일이다.");
      return;
    }
    setExtraAdmins((prev) => [...prev, normalized]);
    setNewAdminEmail("");
  }

  function removeAdminEmail(email) {
    if (ADMIN_EMAILS.includes(email)) {
      alert("기본 관리자 이메일은 삭제할 수 없다.");
      return;
    }
    if (String(currentUser?.email || "").trim().toLowerCase() === String(email).trim().toLowerCase()) {
      alert("현재 로그인한 관리자 계정은 여기서 삭제할 수 없다.");
      return;
    }
    setExtraAdmins((prev) => prev.filter((item) => item !== email));
  }

  async function deleteUserData(user) {
    if (!appServices?.db) {
      alert("DB 연결이 준비되지 않았다.");
      return;
    }
    const ok = window.confirm(
      `${getDisplayName(user)} 가입자 데이터를 삭제할까?
프로필 문서와 저장 기록이 삭제된다.
인증 계정 자체 삭제는 현재 프론트엔드에서 지원하지 않는다.`
    );
    if (!ok) return;

    try {
      setDeletingUserId(user.id);
      const userSessions = realSessions.filter((session) => session.userId === user.id);
      for (const session of userSessions) {
        await deleteDoc(doc(appServices.db, "sessions", session.id));
      }
      await deleteDoc(doc(appServices.db, "users", user.id));
      if (selectedUser?.id === user.id) setSelectedUser(null);
      await onRefresh?.();
      alert("가입자 데이터 삭제를 완료했다.");
    } catch (error) {
      alert(error.message || "가입자 데이터 삭제에 실패했다.");
    } finally {
      setDeletingUserId("");
    }
  }

  return (
    <div className="grid w-full max-w-full gap-6 overflow-x-hidden">
            <FirebaseSetupNoticeCompact />

<Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">관리자 페이지</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">관리자</div>
            <div className="mt-2 text-lg font-semibold">{currentUser?.name || "관리자"}</div>
            <div className="text-sm text-slate-500">{currentUser?.email || ""}</div>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">실사용자 수</div>
            <div className="mt-2 text-3xl font-bold">{realUsers.length}</div>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">실기록 수</div>
            <div className="mt-2 text-3xl font-bold">{realSessions.length}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">관리자 계정 설정</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 min-w-0">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            추가 관리자 이메일을 등록하면 다음 로그인부터 관리자 모드 진입이 가능하다.
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              value={newAdminEmail}
              onChange={(e) => setNewAdminEmail(e.target.value)}
              placeholder="추가 관리자 이메일 입력"
              className="rounded-2xl"
            />
            <Button type="button" className="w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800 md:w-auto" onClick={addAdminEmail}>
              관리자 추가
            </Button>
          </div>
          <div className="grid gap-2">
            {allAdmins.map((email) => (
              <div key={email} className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate">{email}</div>
                  <div className="text-xs text-slate-500">
                    {ADMIN_EMAILS.includes(email) ? "기본 관리자" : "추가 관리자"}
                  </div>
                </div>
                {ADMIN_EMAILS.includes(email) ? (
                  <Badge className="rounded-full bg-slate-700 text-white">기본 관리자</Badge>
                ) : (
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => removeAdminEmail(email)}>
                    관리자 삭제
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">가입자 목록 / 프로필 보기</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 min-w-0">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            비밀번호는 표시하지 않는다. 이름을 더블 클릭하면 자세한 정보를 볼 수 있다. 가입자 삭제는 프로필 문서와 저장 기록을 삭제한다.
          </div>
          <div className="grid gap-2 md:max-w-md">
            <Label>이름 검색</Label>
            <Input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="이름, 이메일, 소속, 지역 검색"
            />
          </div>
          <div className="grid gap-2">
            {visibleUsers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 px-4 py-6 text-sm text-slate-500">
                검색 결과가 없다.
              </div>
            ) : (
              visibleUsers.map((user) => {
                const userSessions = realSessions.filter((session) => session.userId === user.id);
                return (
                  <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div
                      className="min-w-0 cursor-pointer"
                      onDoubleClick={() => setSelectedUser(user)}
                      title="더블 클릭하면 자세한 정보 보기"
                    >
                      <div className="truncate font-semibold">{getDisplayName(user)}</div>
                      <div className="truncate text-sm text-slate-500">{user.email || "이메일 없음"}</div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-slate-700 text-white">기록 {userSessions.length}</Badge>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-2xl"
                        disabled={deletingUserId === user.id}
                        onClick={() => deleteUserData(user)}
                      >
                        {deletingUserId === user.id ? "삭제 중..." : "가입자 삭제"}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedUser)} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-[92vw] rounded-3xl sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>가입자 상세 정보</DialogTitle>
            <DialogDescription>비밀번호는 관리자 페이지에서도 표시하지 않는다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-3 text-sm">
              <div><span className="font-medium">이름:</span> {selectedUser.name || "미입력"}</div>
              <div><span className="font-medium">이메일:</span> {selectedUser.email || "미입력"}</div>
              <div><span className="font-medium">학년/부문:</span> {selectedUser.division || "미입력"}</div>
              <div><span className="font-medium">소속:</span> {selectedUser.groupName || "미입력"}</div>
              <div><span className="font-medium">지역:</span> {selectedUser.regionCity || "미입력"}</div>
              <div><span className="font-medium">가입일:</span> {formatFullDate(selectedUser.createdAt)}</div>
              <div><span className="font-medium">UID:</span> {selectedUser.id}</div>
              <div><span className="font-medium">저장 기록 수:</span> {realSessions.filter((session) => session.userId === selectedUser.id).length}</div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setSelectedUser(null)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">X-Stage / X-Brief 발행</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {publishMessage ? (
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {publishMessage}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-base font-semibold text-slate-900">대회 일정 등록</div>
              <div className="mt-4 grid gap-3">
                <div className="grid gap-2">
                  <Label>제목</Label>
                  <Input value={eventForm.title} onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="예: 전국 초등 양궁대회" />
                </div>
                <div className="grid gap-2">
                  <Label>날짜</Label>
                  <Input type="date" value={eventForm.date} onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>장소</Label>
                  <Input value={eventForm.location} onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))} placeholder="예: 예천 진호국제양궁장" />
                </div>
                <Button type="button" className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800" onClick={createStageEvent}>
                  대회 일정 등록
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-base font-semibold text-slate-900">양궁 뉴스 등록</div>
              <div className="mt-4 grid gap-3">
                <div className="grid gap-2">
                  <Label>제목</Label>
                  <Input value={newsForm.title} onChange={(e) => setNewsForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="예: 국가대표 선발전 시작" />
                </div>
                <div className="grid gap-2">
                  <Label>내용</Label>
                  <textarea value={newsForm.content} onChange={(e) => setNewsForm((prev) => ({ ...prev, content: e.target.value }))} className="min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="뉴스 내용을 입력해줘." />
                </div>
                <Button type="button" className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800" onClick={createStageNews}>
                  뉴스 등록
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-base font-semibold text-slate-900">공지사항 등록</div>
              <div className="mt-4 grid gap-3">
                <div className="grid gap-2">
                  <Label>제목</Label>
                  <Input value={briefForm.title} onChange={(e) => setBriefForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="예: 점검 안내" />
                </div>
                <div className="grid gap-2">
                  <Label>내용</Label>
                  <textarea value={briefForm.content} onChange={(e) => setBriefForm((prev) => ({ ...prev, content: e.target.value }))} className="min-h-[140px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none" placeholder="공지 내용을 입력해줘." />
                </div>
                <Button type="button" className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800" onClick={createBriefNotice}>
                  공지 등록
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">운영 메모</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <textarea
            value={adminMemo}
            onChange={(e) => setAdminMemo(e.target.value)}
            className="min-h-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            placeholder="수정 메모, 배포 메모, 개선 계획"
          />
          <div className="text-sm text-slate-500">이 메모는 현재 브라우저에 저장된다.</div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">메일 발송 준비</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 min-w-0">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>학년/부문</Label>
              <select
                value={emailDivision}
                onChange={(e) => setEmailDivision(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="all">전체 학년/부문</option>
                {divisionOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label>지역</Label>
              <select
                value={emailRegion}
                onChange={(e) => setEmailRegion(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="all">전체 지역</option>
                {regionOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            실제 대량 발송은 아직 연결하지 않았다. 현재는 수신자 이메일 복사 및 메일앱 열기용이다.
          </div>

          <div className="grid gap-2">
            <Label>수신자 수</Label>
            <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm">
              {filteredRecipients.length}명
            </div>
          </div>

          <div className="grid gap-2">
            <Label>제목</Label>
            <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          </div>

          <div className="grid gap-2">
            <Label>내용</Label>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="min-h-[180px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800" onClick={() => recipientEmails && window.open(mailtoHref, "_self")}>
              메일앱으로 열기
            </Button>
            <Button type="button" variant="outline" className="rounded-2xl" onClick={copyRecipients}>
              이메일 복사
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function XSessionApp() {
  const [ui, setUi] = useState(DEFAULT_UI);
  const [appServices, setAppServices] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [draftSession, setDraftSession] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [sessionSaving, setSessionSaving] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [tempSaveMessage, setTempSaveMessage] = useState("");
  const [adminRequested, setAdminRequested] = useState(false);
  const [stageRefreshKey, setStageRefreshKey] = useState(0);
  const [briefRefreshKey, setBriefRefreshKey] = useState(0);
  const pendingProfileRef = useRef(null);


  const authTimeoutRef = useRef(null);


  useEffect(() => {
    if (!authLoading) {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
      return;
    }

    authTimeoutRef.current = setTimeout(() => {
      setAuthLoading(false);
      setGlobalError((prev) => prev || "인증 확인이 지연되어 기본 화면으로 전환했다. 다시 로그인해줘.");
    }, 5000);

    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    };
  }, [authLoading]);


  useEffect(() => {
    if (!FIREBASE_READY) return;
    const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
    setAppServices({
      app,
      auth: getAuth(app),
      db: getFirestore(app),
    });
  }, []);

  const loadUsersAndSessions = useCallback(async (db) => {
    setSessionsLoading(true);
    try {
      const [usersSnap, sessionsSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(query(collection(db, "sessions"), orderBy("sessionDate", "desc"))),
      ]);
      setUsers(usersSnap.docs.map((snap) => fromFirestoreProfile(snap.id, snap.data())));
      setSessions(sessionsSnap.docs.map((snap) => fromFirestoreSession(snap)));
    } catch (error) {
      setGlobalError(error.message || "데이터 로딩에 실패했다.");
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  function getDraftStorageKey(userId) {
    return `elbowshot_temp_draft_${userId}`;
  }

  function saveDraftToLocal(userId, draft) {
    try {
      localStorage.setItem(getDraftStorageKey(userId), JSON.stringify(draft));
    } catch {
      // ignore
    }
  }

  function loadDraftFromLocal(userId) {
    try {
      const raw = localStorage.getItem(getDraftStorageKey(userId));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearDraftFromLocal(userId) {
    try {
      localStorage.removeItem(getDraftStorageKey(userId));
    } catch {
      // ignore
    }
  }

  async function saveProfileDocument(uidValue, payload) {
    const existing = await getDoc(doc(appServices.db, "users", uidValue));
    await setDoc(
      doc(appServices.db, "users", uidValue),
      {
        uid: uidValue,
        email: payload.email,
        displayName: payload.name,
        photoURL: "",
        photoPath: "",
        groupName: payload.groupName || "",
        regionCity: payload.regionCity || "",
        regionDistrict: payload.regionDistrict || "",
        division: payload.division || "",
        gender: payload.gender || "남",
        gender: payload.gender || "남",
        role: "player",
        status: "active",
        createdAt: existing.exists() ? existing.data().createdAt || serverTimestamp() : serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  useEffect(() => {
    if (!appServices?.auth || !appServices?.db) return;

    const unsubscribe = onAuthStateChanged(appServices.auth, async (user) => {
      setAuthUser(user || null);
      setAuthLoading(false);

      try {
        if (!user) {
          setProfile(null);
          setDraftSession(null);
          setEditingSessionId(null);
          setUsers([]);
          setSessions([]);
          setUi(DEFAULT_UI);
          return;
        }

        let nextProfile = null;
        const snap = await getDoc(doc(appServices.db, "users", user.uid));

        if (snap.exists()) {
          nextProfile = fromFirestoreProfile(user.uid, snap.data());
        } else if (pendingProfileRef.current && pendingProfileRef.current.email === user.email) {
          nextProfile = {
            id: user.uid,
            uid: user.uid,
            name: pendingProfileRef.current.name || user.email?.split("@")[0] || "사용자",
            email: pendingProfileRef.current.email || user.email || "",
            club: "",
            clubName: "",
            groupName: pendingProfileRef.current.groupName || "",
            regionCity: pendingProfileRef.current.regionCity || "",
            regionDistrict: pendingProfileRef.current.regionDistrict || "",
            division: pendingProfileRef.current.division || "전체학년",
            gender: pendingProfileRef.current.gender || "남",
            avatar: "",
            photoURL: "",
            photoPath: "",
          };
          await saveProfileDocument(user.uid, {
            email: nextProfile.email,
            name: nextProfile.name,
            groupName: nextProfile.groupName,
            regionCity: nextProfile.regionCity,
            regionDistrict: nextProfile.regionDistrict,
            division: nextProfile.division,
            gender: nextProfile.gender,
          });
        } else {
          nextProfile = {
            id: user.uid,
            uid: user.uid,
            name: user.displayName || user.email?.split("@")[0] || "사용자",
            email: user.email || "",
            club: "",
            clubName: "",
            groupName: "",
            regionCity: "",
            regionDistrict: "",
            division: "전체학년",
            gender: "남",
            avatar: "",
            photoURL: "",
            photoPath: "",
          };
        }

        setProfile(nextProfile);

        const tempDraft = loadDraftFromLocal(user.uid);
        if (tempDraft) {
          setDraftSession(
            normalizeSessionShape(
              { ...tempDraft, division: tempDraft.division || nextProfile.division || "전체학년" },
              nextProfile
            )
          );
          setTempSaveMessage("임시 저장된 X-Session을 불러왔다.");
        } else {
          setDraftSession(
            normalizeSessionShape(createNewSession(nextProfile, "cumulative"), nextProfile)
          );
          setTempSaveMessage("");
        }

        setEditingSessionId(null);
        setUi((prev) => ({
          ...prev,
          activeTab: adminRequested && isAdminEmail(nextProfile.email) ? "admin" : "dashboard",
        }));

        await loadUsersAndSessions(appServices.db);
      } catch (error) {
        console.error("AUTH_FLOW_ERROR", error);
        setGlobalError(error.message || "인증 후 데이터 로딩에 실패했다.");
        setDraftSession(null);
        setEditingSessionId(null);
        setUi(DEFAULT_UI);
      } finally {
        pendingProfileRef.current = null;
      }
    });

    return () => unsubscribe();
  }, [appServices, loadUsersAndSessions, adminRequested]);



  async function handleRegister(input) {
    if (!appServices?.auth || !appServices?.db) {
      throw new Error("Firebase 연결이 아직 준비되지 않았습니다.");
    }

    setAuthLoading(true);
    setGlobalError("");

    try {
      pendingProfileRef.current = {
        name: input.name || input.email.split("@")[0],
        email: input.email,
        groupName: input.groupName || "",
        regionCity: input.regionCity || "",
        regionDistrict: input.regionDistrict || "",
        division: input.division || "전체학년",
      };

      const result = await createUserWithEmailAndPassword(appServices.auth, input.email, input.password);

      await saveProfileDocument(result.user.uid, {
        email: input.email,
        name: input.name || input.email.split("@")[0],
        groupName: input.groupName || "",
        regionCity: input.regionCity || "",
        regionDistrict: input.regionDistrict || "",
        division: input.division || "전체학년",
      });

      const nextProfile = {
        id: result.user.uid,
        uid: result.user.uid,
        name: input.name || input.email.split("@")[0],
        email: input.email,
        club: "",
        clubName: "",
        groupName: input.groupName || "",
        regionCity: input.regionCity || "",
        regionDistrict: input.regionDistrict || "",
        division: input.division || "전체학년",
        avatar: "",
        photoURL: "",
        photoPath: "",
      };

      setProfile(nextProfile);
      setDraftSession(
        normalizeSessionShape(createNewSession(nextProfile, "cumulative"), nextProfile)
      );
      setUi((prev) => ({ ...prev, activeTab: "dashboard" }));
      await loadUsersAndSessions(appServices.db);
      return { ok: true };
    } catch (error) {
      pendingProfileRef.current = null;
      let message = error.message || "회원가입에 실패했다.";
      if (error?.code === "auth/email-already-in-use") {
        message = "이미 가입한 이메일 주소입니다.";
      }
      setGlobalError(message);
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleLogin(input) {
    if (!appServices?.auth) {
      throw new Error("Firebase 연결이 아직 준비되지 않았습니다.");
    }

    setAdminRequested(false);
    setAuthLoading(true);
    setGlobalError("");

    try {
      await signInWithEmailAndPassword(appServices.auth, input.email, input.password);
      return { ok: true };
    } catch (error) {
      let message = error.message || "로그인에 실패했다.";
      if (error?.code === "auth/user-not-found" || error?.code === "auth/invalid-credential") {
        message = "회원가입후 이용해 주세요.";
      } else if (error?.code === "auth/wrong-password") {
        message = "비밀번호를 다시 확인해 주세요.";
      } else if (error?.code === "auth/invalid-email") {
        message = "올바른 이메일 주소를 입력해 주세요.";
      }
      setGlobalError(message);
      throw new Error(message);
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleAdminLogin(input) {
    if (!isAdminEmail(input.email)) {
      setGlobalError("관리자 권한이 없는 이메일이다.");
      return;
    }

    setAdminRequested(true);
    setAuthLoading(true);
    setGlobalError("");

    try {
      await signInWithEmailAndPassword(appServices.auth, input.email, input.password);
    } catch (error) {
      setGlobalError(error.message || "관리자 로그인에 실패했다.");
      setAuthLoading(false);
      setAdminRequested(false);
    }
  }

  async function handleLogout() {
    if (!appServices?.auth) return;

    await signOut(appServices.auth);
    setAuthUser(null);
    setProfile(null);
    setDraftSession(null);
    setEditingSessionId(null);
    setUsers([]);
    setSessions([]);
    setUi(DEFAULT_UI);
    setTempSaveMessage("");
    setAdminRequested(false);
  }

  useEffect(() => {
    if (!draftSession) return;
    if (!shouldAutoRefreshDraftSessionDate(draftSession, editingSessionId)) return;

    setDraftSession((prev) => {
      if (!shouldAutoRefreshDraftSessionDate(prev, editingSessionId)) return prev;
      return { ...prev, sessionDate: getCurrentLocalDateString() };
    });
  }, [draftSession, editingSessionId]);

  useEffect(() => {
    if (editingSessionId) return;
    const timer = window.setInterval(() => {
      setDraftSession((prev) => {
        if (!shouldAutoRefreshDraftSessionDate(prev, editingSessionId)) return prev;
        return { ...prev, sessionDate: getCurrentLocalDateString() };
      });
    }, 60 * 1000);

    return () => window.clearInterval(timer);
  }, [editingSessionId]);

  async function handleSaveSession() {
    if (!appServices?.db || !authUser || !profile || !draftSession) return;

    setSessionSaving(true);
    setGlobalError("");

    try {
      const payload = buildSessionPayload({ draftSession, profile, uid: authUser.uid });
      const fixedSessionDate = draftSession?.sessionDate || getCurrentLocalDateString();
      payload.sessionDate = fixedSessionDate;

      if (editingSessionId) {
        await updateDoc(doc(appServices.db, "sessions", editingSessionId), {
          sessionDate: payload.sessionDate,
          title: payload.title,
          mode: payload.mode,
          recordInputType: payload.recordInputType,
          distance: payload.distance,
          groupName: payload.groupName,
          division: payload.division,
          arrowsPerEnd: payload.arrowsPerEnd,
          arrowsPerDistance: payload.arrowsPerDistance,
          endCount: payload.endCount,
          distanceRoundCount: payload.distanceRoundCount,
          distanceRounds: payload.distanceRounds,
          ends: payload.ends,
          summary: payload.summary,
          status: payload.status,
          updatedAt: serverTimestamp(),
        });
      } else {
        const docRef = await addDoc(collection(appServices.db, "sessions"), payload);
        await setDoc(doc(appServices.db, "sessions", docRef.id), { sessionId: docRef.id }, { merge: true });
      }

      clearDraftFromLocal(authUser.uid);
      setTempSaveMessage("");
      setEditingSessionId(null);
      await loadUsersAndSessions(appServices.db);
      setDraftSession(normalizeSessionShape(createNewSession(profile, draftSession.mode), profile));
      setUi((prev) => ({ ...prev, activeTab: "dashboard" }));
    } catch (error) {
      setGlobalError(error.message || "X-Session 저장에 실패했다.");
    } finally {
      setSessionSaving(false);
    }
  }

  async function handleDeleteSavedSession() {
    if (!appServices?.db || !editingSessionId || !authUser || !profile) return;
    try {
      await deleteDoc(doc(appServices.db, "sessions", editingSessionId));
      setEditingSessionId(null);
      setDraftSession(normalizeSessionShape(createNewSession(profile, "cumulative"), profile));
      clearDraftFromLocal(authUser.uid);
      setTempSaveMessage("");
      await loadUsersAndSessions(appServices.db);
      setUi((prev) => ({ ...prev, activeTab: "dashboard" }));
    } catch (error) {
      setGlobalError(error.message || "세션 삭제에 실패했다.");
    }
  }

  function handleTempSave() {
    if (!authUser || !draftSession) return;
    saveDraftToLocal(authUser.uid, draftSession);
    setTempSaveMessage("임시 X-Session 저장 완료. 다음에 다시 로그인해도 이어서 입력할 수 있다.");
  }

  function handleEditSession(sessionId) {
    const target = sessionsForDisplay.find((s) => s.id === sessionId);
    if (!target || !profile) return;
    setDraftSession({
      ...target,
      recordInputType: target.recordInputType || "end",
      division: target.division || profile.division || "",
      distanceRounds:
        target.distanceRounds?.length
          ? target.distanceRounds.map((round, idx) => ({
              ...round,
              id: round.id || uid("edit_round"),
              index: idx + 1,
            }))
          : [
              createEmptyDistanceRound(1, 35),
              createEmptyDistanceRound(2, 30),
              createEmptyDistanceRound(3, 25),
              createEmptyDistanceRound(4, 20),
            ],
      ends: (target.ends || []).map((end, idx) => ({
        ...end,
        id: end.id || uid("edit_end"),
        index: idx + 1,
        arrows: Array.from({ length: target.arrowsPerEnd || 6 }, (_, i) => end.arrows?.[i] ?? null),
      })),
    });
    setEditingSessionId(target.isSampleData ? null : target.id);
    setUi((prev) => ({ ...prev, activeTab: "record" }));
    setTempSaveMessage(
      target.isSampleData
        ? "샘플 X-Session을 입력 화면으로 불러왔다. 저장하면 내 기록으로 새로 저장된다."
        : "저장된 X-Session을 편집 중이다."
    );
  }

  async function handleUpdateProfile(nextUser) {
    if (!appServices?.db || !authUser || !profile) return;

    setProfileSaving(true);
    setGlobalError("");

    try {
      await saveProfileDocument(authUser.uid, {
        email: profile.email,
        name: nextUser.name,
        groupName: nextUser.groupName,
        regionCity: nextUser.regionCity,
        regionDistrict: nextUser.regionDistrict,
        division: nextUser.division,
      });

      const refreshed = {
        ...profile,
        name: nextUser.name || profile.name || "",
        club: "",
        clubName: "",
        groupName: nextUser.groupName || "",
        regionCity: nextUser.regionCity || "",
        regionDistrict: nextUser.regionDistrict || "",
        division: nextUser.division || "전체학년",
      };

      setProfile(refreshed);
      setDraftSession((prev) =>
        prev
          ? {
              ...prev,
              division: refreshed.division,
            }
          : createNewSession(refreshed, "cumulative")
      );

      if (authUser && draftSession) {
        saveDraftToLocal(authUser.uid, {
          ...(draftSession || createNewSession(refreshed, "cumulative")),
          division: refreshed.division,
        });
      }

      await loadUsersAndSessions(appServices.db);
      return { ok: true, message: "프로필이 저장되었다. 앱 전체 표시 정보에도 반영된다." };
    } catch (error) {
      const message = error.message || "프로필 저장에 실패했다.";
      setGlobalError(message);
      return { ok: false, message };
    } finally {
      setProfileSaving(false);
    }
  }

  const currentUser = useMemo(() => profile, [profile]);
  const sampleUsers = useMemo(() => buildPermanentSampleUsers(), []);
  const permanentSampleSessions = useMemo(() => buildPermanentSampleSessions(), []);

  const usersForDisplay = useMemo(() => {
    const existingIds = new Set(users.map((u) => u.id));
    const extra = sampleUsers.filter((u) => !existingIds.has(u.id));
    return [...users, ...extra];
  }, [users, sampleUsers]);

  const sessionsForDisplay = useMemo(() => {
    const existingIds = new Set(sessions.map((s) => s.id));
    const merged = [...sessions];

    permanentSampleSessions.forEach((s) => {
      if (!existingIds.has(s.id)) merged.push(s);
    });

    return merged;
  }, [sessions, permanentSampleSessions]);

  const mySessions = useMemo(
    () => sessions.filter((s) => s.userId === authUser?.uid),
    [sessions, authUser]
  );

  const isAdminUser = useMemo(() => isAdminEmail(currentUser?.email), [currentUser]);
  const adminEmailGuard = isAdminEmail;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.12),_transparent_30%),radial-gradient(circle_at_right,_rgba(185,28,28,0.12),_transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      <div className={`mx-auto flex w-full flex-col ${currentUser ? "max-w-7xl gap-3 px-2 py-2 md:gap-6 md:p-6 xl:p-8" : "max-w-[min(96vw,1440px)] gap-0 px-0 py-0 md:px-4 md:py-4 xl:px-6 xl:py-6"}`}>
        {currentUser ? <Hero activeTab={ui.activeTab} /> : null}

        {authLoading && !authUser ? (
          <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
            <CardContent className="flex items-center gap-3 p-6 text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin" /> 인증 상태 확인 중
            </CardContent>
          </Card>
        ) : !currentUser ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <AuthPanel onRegister={handleRegister} onLogin={handleLogin} authLoading={authLoading} />
          </motion.div>
        ) : (
          <>
            <TopBar user={currentUser} activeTab={ui.activeTab} setActiveTab={(tab) => setUi((prev) => ({ ...prev, activeTab: tab }))} onLogout={handleLogout} isAdminUser={isAdminUser} />

            {globalError && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</div>}

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {ui.activeTab === "record" && draftSession && (
                <SessionEditor
                  session={draftSession}
                  setSession={setDraftSession}
                  onSave={handleSaveSession}
                  onTempSave={handleTempSave}
                  onDeleteSavedSession={handleDeleteSavedSession}
                  saving={sessionSaving}
                  tempSaveMessage={tempSaveMessage}
                  editingSavedSession={Boolean(editingSessionId)}
                />
              )}
              {ui.activeTab === "dashboard" && <Dashboard sessions={mySessions} loading={sessionsLoading} onEditSession={handleEditSession} />}
              {ui.activeTab === "ranking" && <RankingBoard users={usersForDisplay} sessions={sessionsForDisplay} currentUserId={currentUser.id} />}
              {ui.activeTab === "analysis" && <AnalysisBoard currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} />}
              {ui.activeTab === "stage" && <XStagePage appServices={appServices} stageRefreshKey={stageRefreshKey} />}
              {ui.activeTab === "brief" && <XBriefPage appServices={appServices} briefRefreshKey={briefRefreshKey} />}
              {ui.activeTab === "profile" && <ProfilePanel user={currentUser} onUpdate={handleUpdateProfile} saving={profileSaving} />}
              {ui.activeTab === "admin" && isAdminUser && <AdminPanel currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} appServices={appServices} onRefresh={() => loadUsersAndSessions(appServices.db)} onStageRefresh={() => setStageRefreshKey((prev) => prev + 1)} onBriefRefresh={() => setBriefRefreshKey((prev) => prev + 1)} />}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default XSessionApp;
