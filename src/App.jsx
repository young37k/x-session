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
    sessionDate: safe.sessionDate || "2026-04-12",
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

function formatDateTime(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("ko-KR");
  } catch {
    return String(value);
  }
}

function formatDateOnly(value) {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("ko-KR");
  } catch {
    return String(value);
  }

function formatFullDate(value) {
  if (!value) return "-";
  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

}

function getWeekKey(dateInput) {
  const date = new Date(dateInput);
  const first = new Date(date.getFullYear(), 0, 1);
  const dayMs = 24 * 60 * 60 * 1000;
  const week = Math.ceil((((date - first) / dayMs) + first.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function getMonthKey(dateInput) {
  const date = new Date(dateInput);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getYearKey(dateInput) {
  return String(new Date(dateInput).getFullYear());
}

function toLocalDateKey(value) {
  if (!value) return "";
  const raw =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);

  if (Number.isNaN(raw.getTime())) return "";
  const year = raw.getFullYear();
  const month = String(raw.getMonth() + 1).padStart(2, "0");
  const day = String(raw.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayKey() {
  return toLocalDateKey(new Date());
}

function getCurrentLocalDateString() {
  return toLocalDateKey(new Date());
}

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return toLocalDateKey(date);
}

function getSessionDayKey(session) {
  return toLocalDateKey(session?.sessionDate);
}

function isWithinDateFilter(sessionDate, dateFilter) {
  if (!sessionDate || dateFilter === "all") return true;
  const target = new Date(sessionDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetOnly = new Date(target);
  targetOnly.setHours(0, 0, 0, 0);

  if (dateFilter === "today") {
    return targetOnly.getTime() === today.getTime();
  }

  if (dateFilter === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return targetOnly.getTime() === yesterday.getTime();
  }

  if (dateFilter === "7days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 6);
    return targetOnly >= start && targetOnly <= today;
  }

  if (dateFilter === "30days") {
    const start = new Date(today);
    start.setDate(start.getDate() - 29);
    return targetOnly >= start && targetOnly <= today;
  }

  return true;
}

function calculateSessionSummary(session) {
  const isDistanceInput = session.recordInputType === "distance";
  const totalScore = isDistanceInput
    ? (session.distanceRounds || []).reduce((sum, round) => sum + (Number(round.total) || 0), 0)
    : getSessionTotal(session);
  const totalArrows = isDistanceInput
    ? ((session.distanceRounds || []).length * (Number(session.arrowsPerDistance) || 0))
    : getArrowCount(session);
  const xCount = isDistanceInput ? 0 : getXs(session);
  const hitCount = isDistanceInput ? 0 : getHits(session);
  const averageArrow = totalArrows ? Number((totalScore / totalArrows).toFixed(2)) : 0;
  const averageEnd = isDistanceInput
    ? ((session.distanceRounds || []).length ? Number((totalScore / session.distanceRounds.length).toFixed(2)) : 0)
    : (session.ends.length ? Number((totalScore / session.ends.length).toFixed(2)) : 0);
  const setPoints = deriveSetPoints(session);
  const endScores = isDistanceInput
    ? (session.distanceRounds || []).map((round) => Number(round.total) || 0)
    : session.ends.map((end) => endTotal(end));
  return {
    totalScore,
    totalArrows,
    xCount,
    hitCount,
    averageArrow,
    averageEnd,
    setPointsMe: isDistanceInput ? 0 : setPoints.me,
    setPointsOpponent: isDistanceInput ? 0 : setPoints.opponent,
    bestEndScore: endScores.length ? Math.max(...endScores) : 0,
    worstEndScore: endScores.length ? Math.min(...endScores) : 0,
  };
}

function buildSessionPayload({ draftSession, profile, uid }) {
  const summary = calculateSessionSummary(draftSession);
  const isDistanceInput = draftSession.recordInputType === "distance";

  return {
    sessionId: "",
    recordInputType: draftSession.recordInputType || "end",
    userId: uid,
    sessionDate: draftSession.sessionDate,
    title: draftSession.title,
    mode: draftSession.mode,
    distance: draftSession.distance,
    groupName: profile.groupName || "",
    regionCity: profile.regionCity || "",
    division: draftSession.division || profile.division || "",
    gender: profile.gender || "남",
    arrowsPerEnd: draftSession.arrowsPerEnd,
    arrowsPerDistance: draftSession.arrowsPerDistance || 36,
    endCount: isDistanceInput ? 0 : draftSession.ends.length,
    distanceRoundCount: isDistanceInput ? (draftSession.distanceRounds || []).length : 0,
    distanceRounds: isDistanceInput
      ? (draftSession.distanceRounds || []).map((round) => ({
          roundNo: round.index,
          distance: Number(round.distance) || 0,
          total: Number(round.total) || 0,
        }))
      : [],
    ends: isDistanceInput
      ? []
      : draftSession.ends.map((end) => ({
          endNo: end.index,
          arrows: end.arrows,
          opponentTotal: Number(end.opponentTotal) || 0,
          opponentScoreEntered: Boolean(end.opponentScoreEntered),
          endTotal: endTotal(end),
          xCount: end.arrows.filter((v) => v === "X").length,
          hitCount: end.arrows.filter((v) => v !== null && v !== undefined && v !== "").length,
        })),
    summary,
    status: "completed",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

function fromFirestoreProfile(uidValue, data) {
  return {
    id: uidValue,
    uid: uidValue,
    name: data.displayName || "",
    email: data.email || "",
    club: "",
    clubName: "",
    groupName: data.groupName || "",
    regionCity: data.regionCity || "",
    regionDistrict: data.regionDistrict || "",
    division: data.division || "",
    gender: data.gender || "남",
    avatar: "",
    photoURL: "",
    photoPath: "",
  };
}

function fromFirestoreSession(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    sessionId: docSnap.id,
    userId: data.userId,
    title: data.title,
    sessionDate: data.sessionDate,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.sessionDate,
    createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.sessionDate,
    mode: data.mode,
    recordInputType: data.recordInputType || "end",
    distance: data.distance,
    division: data.division || "",
    gender: data.gender || "남",
    clubName: "",
    groupName: data.groupName || "",
    regionCity: data.regionCity || "",
    regionDistrict: data.regionDistrict || "",
    arrowsPerEnd: data.arrowsPerEnd || 6,
    arrowsPerDistance: data.arrowsPerDistance || 36,
    distanceRounds: (data.distanceRounds || []).map((round) => ({ distance: round.distance, total: round.total })),
    totalEnds: data.endCount || (data.ends?.length ?? 0),
    ends: (data.ends || []).map((end) => ({
      id: uid("loaded_end"),
      index: end.endNo,
      arrows: end.arrows || [],
      opponentTotal: end.opponentTotal || 0,
      opponentScoreEntered: Boolean(end.opponentScoreEntered),
    })),
    isComplete: data.status === "completed",
    summary: data.summary || null,
  };
}

function buildAnalyticsData(sessions, mode, matchType = "all") {
  const completed = sessions
    .filter((s) => s.isComplete)
    .filter((s) => (matchType === "all" ? true : s.mode === matchType))
    .slice()
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  const map = new Map();

  function initBucket(label) {
    if (!map.has(label)) map.set(label, { label, score: 0, arrows: 0, matches: 0, ends: 0 });
    return map.get(label);
  }

  completed.forEach((session, sessionIndex) => {
    if (mode === "match") {
      const bucket = initBucket(`경기 ${sessionIndex + 1}`);
      bucket.score += session.summary?.totalScore ?? getSessionTotal(session);
      bucket.arrows += session.summary?.totalArrows ?? getArrowCount(session);
      bucket.matches += 1;
      bucket.ends += session.ends.length;
      return;
    }

    if (mode === "end") {
      if (session.recordInputType === "distance") {
        (session.distanceRounds || []).forEach((round, roundIndex) => {
          const bucket = initBucket(`G${sessionIndex + 1}-D${roundIndex + 1}`);
          bucket.score += Number(round.total) || 0;
          bucket.arrows += Number(session.arrowsPerDistance) || 0;
          bucket.ends += 1;
        });
      } else {
        session.ends.forEach((end, endIndex) => {
          const bucket = initBucket(`G${sessionIndex + 1}-E${endIndex + 1}`);
          bucket.score += endTotal(end);
          bucket.arrows += end.arrows.filter((v) => v !== null).length;
          bucket.ends += 1;
        });
      }
      return;
    }

    let label = formatDateOnly(session.sessionDate || session.updatedAt);
    if (mode === "week") label = getWeekKey(session.sessionDate || session.updatedAt);
    if (mode === "month") label = getMonthKey(session.sessionDate || session.updatedAt);
    if (mode === "year") label = getYearKey(session.sessionDate || session.updatedAt);

    const bucket = initBucket(label);
    bucket.score += session.summary?.totalScore ?? getSessionTotal(session);
    bucket.arrows += session.summary?.totalArrows ?? getArrowCount(session);
    bucket.matches += 1;
    bucket.ends += session.ends.length;
  });

  return Array.from(map.values()).map((item) => ({
    ...item,
    avgArrow: item.arrows ? Number((item.score / item.arrows).toFixed(2)) : 0,
    avgEnd: item.ends ? Number((item.score / item.ends).toFixed(2)) : 0,
  }));
}

function getSessionRankingMetric(session, rankingFilters = {}) {
  const selectedDistance = rankingFilters.distance;
  const isDistanceMode = session.recordInputType === "distance";

  if (selectedDistance && selectedDistance !== "all") {
    if (isDistanceMode) {
      const round = (session.distanceRounds || []).find(
        (item) => String(item.distance) === String(selectedDistance)
      );
      if (!round) return null;

      const score = Number(round.total) || 0;
      const arrows = Number(session.arrowsPerDistance) || 0;

      return {
        score,
        arrows,
        best: score,
        distance: Number(selectedDistance) || 0,
        xCount: 0,
      };
    }

    if (String(session.distance) !== String(selectedDistance)) return null;
  }

  return {
    score: session.summary?.totalScore ?? getSessionTotal(session),
    arrows: session.summary?.totalArrows ?? getArrowCount(session),
    best: session.summary?.totalScore ?? getSessionTotal(session),
    distance: session.distance || 0,
    xCount: session.summary?.xCount ?? getXs(session),
  };
}

function buildRivalComparison(mySessions, rivalSessions, mode, matchType) {
  const mine = buildAnalyticsData(mySessions, mode, matchType);
  const rival = buildAnalyticsData(rivalSessions, mode, matchType);
  const labels = Array.from(new Set([...mine.map((x) => x.label), ...rival.map((x) => x.label)]));
  return labels.map((label) => ({
    label,
    나: mine.find((x) => x.label === label)?.avgArrow ?? 0,
    라이벌: rival.find((x) => x.label === label)?.avgArrow ?? 0,
  }));
}


function getRequiredDistancesForDivision(division) {
  return DIVISION_DISTANCE_RULES[division] || [];
}

function isWithinRecent7Days(sessionDate) {
  if (!sessionDate) return false;
  const target = new Date(sessionDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  return target >= start && target <= today;
}

function getQualifiedDistanceAttempts(session) {
  if (!session || !session.isComplete) return [];
  if (session.mode !== "cumulative") return [];

  if (session.recordInputType === "distance") {
    const arrowsPerDistance = Number(session.arrowsPerDistance) || 0;
    if (arrowsPerDistance !== 36) return [];
    return (session.distanceRounds || [])
      .map((round) => ({
        distance: Number(round.distance) || 0,
        score: Number(round.total) || 0,
        arrowsCount: arrowsPerDistance,
        sessionDate: session.sessionDate || session.updatedAt || "",
        division: session.division || "",
        gender: session.gender || "",
        rankingGroup: getRankingGroup(session.division, session.gender),
        groupName: session.groupName || "",
        regionCity: session.regionCity || "",
      }))
      .filter((item) => item.distance > 0 && item.score >= 0 && item.score <= 360);
  }

  const actualArrowCount = (session.ends || [])
    .flatMap((end) => end.arrows || [])
    .filter((arrow) => arrow !== null && arrow !== undefined && String(arrow).trim() !== "")
    .length;

  if (actualArrowCount !== 36) return [];

  const totalScore = session.summary?.totalScore ?? getSessionTotal(session);
  if (totalScore < 0 || totalScore > 360) return [];

  return [{
    distance: Number(session.distance) || 0,
    score: totalScore,
    arrowsCount: actualArrowCount,
    sessionDate: session.sessionDate || session.updatedAt || "",
    division: session.division || "",
    gender: session.gender || "",
    rankingGroup: getRankingGroup(session.division, session.gender),
    groupName: session.groupName || "",
    regionCity: session.regionCity || "",
  }];
}

function buildDistanceRankings(users, sessions, rankingFilters = {}, options = {}) {
  const { weekly = false } = options;

  return users
    .map((user) => {
      const userDivision = user.division || "";
      const userGender = user.gender || "남";
      const userRankingGroup = getRankingGroup(userDivision, userGender);
      if (
        rankingFilters.rankingGroup &&
        rankingFilters.rankingGroup !== "all" &&
        userRankingGroup !== rankingFilters.rankingGroup
      ) {
        return null;
      }
      if (
        rankingFilters.groupName &&
        rankingFilters.groupName !== "all" &&
        (user.groupName || "") !== rankingFilters.groupName
      ) {
        return null;
      }
      if (
        rankingFilters.regionCity &&
        rankingFilters.regionCity !== "all" &&
        (user.regionCity || "") !== rankingFilters.regionCity
      ) {
        return null;
      }

      const attempts = sessions
        .filter((session) => session.userId === user.id)
        .flatMap((session) => getQualifiedDistanceAttempts(session))
        .filter((attempt) => !weekly || isWithinRecent7Days(attempt.sessionDate))
        .filter((attempt) => attempt.rankingGroup === userRankingGroup)
        .filter((attempt) =>
          rankingFilters.distance && rankingFilters.distance !== "all"
            ? String(attempt.distance) === String(rankingFilters.distance)
            : true
        )
        .filter((attempt) =>
          rankingFilters.distance && rankingFilters.distance !== "all"
            ? getRequiredDistancesForRankingGroup(userRankingGroup).includes(Number(attempt.distance))
            : true
        );

      if (!attempts.length) return null;

      attempts.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(b.sessionDate).localeCompare(String(a.sessionDate));
      });

      const best = attempts[0];
      return {
        userId: user.id,
        name: getDisplayName(user),
        groupName: user.groupName || best.groupName || "-",
        regionCity: user.regionCity || best.regionCity || "-",
        division: normalizeDivisionLabel(userDivision || best.division || "-"),
        rankingGroup: userRankingGroup || best.rankingGroup || "-",
        distance: best.distance,
        bestScore: best.score,
        qualifiedSessions: attempts.length,
        latestDate: best.sessionDate || "",
      };
    })
    .filter(Boolean);
}

function buildTotalRankings(users, sessions, rankingFilters = {}, options = {}) {
  const { weekly = false } = options;

  return users
    .map((user) => {
      const userDivision = user.division || "";
      const userGender = user.gender || "남";
      const userRankingGroup = getRankingGroup(userDivision, userGender);
      if (
        rankingFilters.rankingGroup &&
        rankingFilters.rankingGroup !== "all" &&
        userRankingGroup !== rankingFilters.rankingGroup
      ) {
        return null;
      }
      if (
        rankingFilters.groupName &&
        rankingFilters.groupName !== "all" &&
        (user.groupName || "") !== rankingFilters.groupName
      ) {
        return null;
      }
      if (
        rankingFilters.regionCity &&
        rankingFilters.regionCity !== "all" &&
        (user.regionCity || "") !== rankingFilters.regionCity
      ) {
        return null;
      }

      const requiredDistances = getRequiredDistancesForRankingGroup(userRankingGroup);
      if (!requiredDistances.length) return null;

      const attempts = sessions
        .filter((session) => session.userId === user.id)
        .flatMap((session) => getQualifiedDistanceAttempts(session))
        .filter((attempt) => !weekly || isWithinRecent7Days(attempt.sessionDate))
        .filter((attempt) => attempt.rankingGroup === userRankingGroup);

      const bestByDistance = {};
      requiredDistances.forEach((distance) => {
        const candidates = attempts
          .filter((attempt) => String(attempt.distance) === String(distance))
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return String(b.sessionDate).localeCompare(String(a.sessionDate));
          });
        if (candidates.length) bestByDistance[distance] = candidates[0];
      });

      if (requiredDistances.some((distance) => !bestByDistance[distance])) return null;

      const totalScore = requiredDistances.reduce(
        (sum, distance) => sum + (bestByDistance[distance]?.score || 0),
        0
      );

      return {
        userId: user.id,
        name: getDisplayName(user),
        groupName: user.groupName || "-",
        regionCity: user.regionCity || "-",
        division: normalizeDivisionLabel(userDivision || "-"),
        rankingGroup: userRankingGroup || "-",
        requiredDistances,
        distanceScores: Object.fromEntries(
          requiredDistances.map((distance) => [distance, bestByDistance[distance].score])
        ),
        totalScore,
        latestDate: requiredDistances
          .map((distance) => bestByDistance[distance].sessionDate || "")
          .sort()
          .slice(-1)[0],
      };
    })
    .filter(Boolean);
}


function getDistancePerformance(sessions) {
  const map = new Map();
  sessions.forEach((session) => {
    const key = `${session.distance}m`;
    if (!map.has(key)) map.set(key, { label: key, score: 0, arrows: 0, sessions: 0 });
    const bucket = map.get(key);
    bucket.score += session.summary?.totalScore ?? getSessionTotal(session);
    bucket.arrows += session.summary?.totalArrows ?? getArrowCount(session);
    bucket.sessions += 1;
  });
  return Array.from(map.values())
    .map((item) => ({
      ...item,
      avgArrow: item.arrows ? Number((item.score / item.arrows).toFixed(2)) : 0,
    }))
    .sort((a, b) => Number(a.label.replace("m", "")) - Number(b.label.replace("m", "")));
}

function getWeakZoneInsight(sessions) {
  const counts = { X: 0, 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, M: 0 };
  sessions.forEach((session) => {
    session.ends.forEach((end) => {
      end.arrows.forEach((arrow) => {
        if (arrow === null || arrow === undefined || arrow === "") return;
        const key = String(arrow);
        if (counts[key] !== undefined) counts[key] += 1;
      });
    });
  });
  const entries = Object.entries(counts)
    .filter(([key]) => key !== "X" && key !== "10")
    .sort((a, b) => b[1] - a[1]);
  const top = entries.find(([, count]) => count > 0);
  if (!top) return "충분한 기록이 없어 약점 구간을 아직 판단하기 어렵다.";
  return `${top[0]}점 구간 비중이 가장 높다. 이 구간 안정화가 우선이다.`;
}

function getTrendInsight(sessions) {
  const completed = sessions
    .filter((s) => s.isComplete)
    .slice()
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));

  if (completed.length < 2) {
    return { value: 0, label: "비교할 이전 기록 부족", up: null };
  }

  const latest = completed[completed.length - 1].summary?.averageArrow ?? getAverageArrow(completed[completed.length - 1]);
  const prev = completed[completed.length - 2].summary?.averageArrow ?? getAverageArrow(completed[completed.length - 2]);
  const diff = Number((latest - prev).toFixed(2));

  if (diff > 0) return { value: diff, label: `직전 경기 대비 +${diff}`, up: true };
  if (diff < 0) return { value: diff, label: `직전 경기 대비 ${diff}`, up: false };
  return { value: 0, label: "직전 경기와 동일", up: null };
}

function ProfileAvatar({ user, size = "md" }) {
  const sizeMap = { sm: "h-10 w-10", md: "h-12 w-12", lg: "h-20 w-20" };
  const initial = getDisplayName(user).trim().charAt(0) || "?";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900 to-red-700 text-white ${sizeMap[size] || sizeMap.md}`}
    >
      <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>
        {initial}
      </span>
    </div>
  );
}

function Hero({ activeTab = "dashboard" }) {
  const heroLabelMap = {
    record: "X-SESSION",
    dashboard: "X-DASHBOARD",
    ranking: "X-RANKING",
    analysis: "X-ANALYSIS",
    profile: "PROFILE",
    admin: "ADMIN",
  };

  const currentLabel = heroLabelMap[activeTab] || "X-DASHBOARD";

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-gradient-to-br from-blue-950 via-slate-900 to-red-900 text-white shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <div className="text-center">
            <div className="text-sm font-semibold tracking-[0.28em] text-white/70 md:text-base">
              X-SESSION
            </div>
            <h1 className="mt-3 text-[clamp(28px,7vw,44px)] font-black leading-[1.05] tracking-[-0.04em] text-white">
              {currentLabel}
            </h1>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FirebaseSetupNoticeCompact() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div
        className="cursor-pointer text-sm font-medium text-slate-700"
        onDoubleClick={() => setOpen((prev) => !prev)}
        title="더블 클릭하면 상세 상태를 본다."
      >
        Firebase 상태
      </div>
      {open && (
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          <div className="rounded-2xl bg-white px-4 py-3">Auth: 이메일/비밀번호 로그인</div>
          <div className="rounded-2xl bg-white px-4 py-3">Firestore: users / sessions 저장</div>
          <div className="rounded-2xl bg-white px-4 py-3">프로필 이미지는 현재 비활성화</div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700">Firebase 환경변수 감지 완료</div>
        </div>
      )}
    </div>
  );
}


function AuthPanel({ onRegister, onLogin, authLoading }) {
  const SAVED_EMAIL_KEY = "elbowshot_saved_email";
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    division: "전체학년",
    gender: "남",
    groupName: "",
    regionCity: "",
    regionDistrict: "",
  });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");

  const registerDistrictOptions = useMemo(
    () => getDistrictOptions(registerForm.regionCity),
    [registerForm.regionCity]
  );

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || "";
      if (savedEmail) {
        setLoginForm((prev) => ({ ...prev, email: savedEmail }));
        setRememberEmail(true);
      }
    } catch {
      // ignore
    }
  }, []);

  async function handleLoginSubmit() {
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      setError("이메일/비밀번호를 입력해 주세요.");
      return;
    }

    const normalizedEmail = loginForm.email.trim().toLowerCase();

    try {
      if (rememberEmail) {
        localStorage.setItem(SAVED_EMAIL_KEY, normalizedEmail);
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }
    } catch {
      // ignore
    }

    setError("");
    try {
      await onLogin({
        email: normalizedEmail,
        password: loginForm.password,
      });
    } catch (error) {
      setError(error.message || "로그인에 실패했다.");
    }
  }

  async function handleRegisterSubmit() {
    if (
      !registerForm.name.trim() ||
      !registerForm.email.trim() ||
      !registerForm.password.trim() ||
      !registerForm.groupName.trim() ||
      !registerForm.regionCity ||
      !registerForm.regionDistrict ||
      !registerForm.division
    ) {
      setError("해당 칸을 입력 후 버튼을 눌러주세요.");
      return;
    }

    if (!registerForm.email.includes("@")) {
      setError("해당 칸을 입력 후 버튼을 눌러주세요.");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setError("");
    try {
      await onRegister({
        ...registerForm,
        email: registerForm.email.trim().toLowerCase(),
        name: registerForm.name.trim(),
        groupName: registerForm.groupName.trim(),
      });
    } catch (error) {
      setError(error.message || "회원가입에 실패했다.");
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-[22px] sm:rounded-[28px] shadow-2xl"
      style={{
        minHeight: "100svh",
        backgroundImage: "url('/login-background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundColor: "#dfe6f3",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.03)_0%,rgba(2,6,23,0.18)_100%)]" />
      <div className="relative flex min-h-[100svh] items-end justify-center px-2 pb-2 pt-[32svh] sm:px-4 sm:pb-4 sm:pt-[34svh] lg:pt-[38svh]">
        <div className="w-full max-w-lg rounded-[24px] sm:rounded-[30px] bg-transparent p-3 sm:p-5">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-black/20 p-1 backdrop-blur-sm">
              <Button
                type="button"
                variant="ghost"
                className={`h-11 rounded-2xl text-base font-semibold ${mode === "login" ? "bg-white text-slate-900 hover:bg-white" : "text-white hover:bg-white/10"}`}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                로그인
              </Button>
              <Button
                type="button"
                variant="ghost"
                className={`h-11 rounded-2xl text-base font-semibold ${mode === "register" ? "bg-white text-slate-900 hover:bg-white" : "text-white hover:bg-white/10"}`}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                회원가입
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-50 backdrop-blur-sm">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {mode === "login" ? (
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label className="text-sm font-semibold text-white">이메일</Label>
                    <label htmlFor="remember-email" className="flex cursor-pointer items-center gap-2 text-xs font-medium text-white/95">
                      <input
                        id="remember-email"
                        type="checkbox"
                        checked={rememberEmail}
                        onChange={(e) => setRememberEmail(e.target.checked)}
                        className="h-4 w-4 rounded border-white/40"
                      />
                      이메일 저장
                    </label>
                  </div>
                  <Input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="이메일 입력"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">비밀번호</Label>
                  <Input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="비밀번호 입력"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>

                <Button
                  type="button"
                  disabled={authLoading}
                  className="h-12 rounded-2xl bg-blue-950 text-base font-semibold hover:bg-blue-900"
                  onClick={handleLoginSubmit}
                >
                  {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  로그인
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">이름</Label>
                  <Input
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="이름 입력"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">이메일</Label>
                  <Input
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="이메일 입력"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">비밀번호</Label>
                  <Input
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="비밀번호 입력"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">학년/부문</Label>
                  <select
                    value={registerForm.division}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, division: e.target.value }))}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none"
                  >
                    {DIVISION_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">성별</Label>
                  <select
                    value={registerForm.gender}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none"
                  >
                    {GENDER_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">소속</Label>
                  <Input
                    type="text"
                    value={registerForm.groupName}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, groupName: e.target.value }))}
                    placeholder="예: 엘보샷"
                    className="h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">지역(시/도)</Label>
                  <select
                    value={registerForm.regionCity}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, regionCity: e.target.value, regionDistrict: "" }))}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none"
                  >
                    <option value="">지역 선택</option>
                    {REGION_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">지역(구/군)</Label>
                  <select
                    value={registerForm.regionDistrict}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, regionDistrict: e.target.value }))}
                    disabled={!registerForm.regionCity}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none disabled:bg-white/70"
                  >
                    <option value="">구/군 선택</option>
                    {registerDistrictOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <Button
                  type="button"
                  disabled={authLoading}
                  className="h-12 rounded-2xl bg-white/92 text-base font-semibold text-slate-900 hover:bg-white"
                  onClick={handleRegisterSubmit}
                >
                  {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                  회원가입 완료
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function TopBar({ user, activeTab, setActiveTab, onLogout, isAdminUser }) {
  const navs = [
    { key: "record", label: "X-Session", icon: Target },
    { key: "dashboard", label: "X-Dashboard", icon: BarChart3 },
    { key: "ranking", label: "X-Ranking", icon: Trophy },
    { key: "analysis", label: "X-Analysis", icon: CalendarRange },
    { key: "profile", label: "Profile", icon: User },
    ...(isAdminUser ? [{ key: "admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <Card className="rounded-[28px] border-0 bg-white/95 shadow-xl">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <ProfileAvatar user={user} size="md" />
          <div className="min-w-0">
            <div className="truncate text-base font-semibold">{getDisplayName(user)}</div>
            <div className="truncate text-sm text-slate-500">{user.email}</div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="grid w-full grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 md:w-auto lg:grid-cols-5">
            {navs.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className="gap-2 rounded-2xl px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" /> {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <Button variant="outline" className="rounded-2xl" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" /> 로그아웃
        </Button>
      </CardContent>
    </Card>
  );
}

function SessionEditor({
  session,
  setSession,
  onSave,
  onTempSave,
  onDeleteSavedSession,
  saving,
  tempSaveMessage,
  editingSavedSession,
}) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, endId: null });
  const [deleteSessionDialog, setDeleteSessionDialog] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [history, setHistory] = useState([]);
  const [lastQuickScore, setLastQuickScore] = useState(null);
  const [flashKey, setFlashKey] = useState("");
  const [activeOpponentEndId, setActiveOpponentEndId] = useState(null);
  const [opponentInputBuffers, setOpponentInputBuffers] = useState({});
  const arrowRefs = useRef({});

  const totalArrows = useMemo(
    () => session.ends.flatMap((end) => end.arrows).filter((v) => v !== null).length,
    [session]
  );

  const progress = useMemo(() => {
    if (session.recordInputType === "distance") {
      const rounds = session.distanceRounds || [];
      const filled = rounds.filter((round) => Number(round.total) > 0).length;
      return Math.round((filled / Math.max(1, rounds.length)) * 100);
    }
    return Math.round(
      (totalArrows / Math.max(1, session.totalEnds * session.arrowsPerEnd)) * 100
    );
  }, [session, totalArrows]);

  const currentTarget = useMemo(() => {
    if (session.mode === "set" && activeOpponentEndId) {
      return null;
    }
    for (const end of session.ends) {
      for (let i = 0; i < end.arrows.length; i += 1) {
        if (end.arrows[i] === null) {
          return { endId: end.id, arrowIndex: i };
        }
      }
    }
    return null;
  }, [session, activeOpponentEndId]);

  useEffect(() => {
    if (!flashKey) return;
    const timer = setTimeout(() => setFlashKey(""), 220);
    return () => clearTimeout(timer);
  }, [flashKey]);

  function pushHistory(prev) {
    setHistory((h) => [...h.slice(-29), JSON.parse(JSON.stringify(prev))]);
  }

  function reindexEnds(ends) {
    return ends.map((end, idx) => ({ ...end, index: idx + 1 }));
  }

  function patchSession(update) {
    setSession((prev) => {
      pushHistory(prev);
      const next = typeof update === "function" ? update(prev) : { ...prev, ...update };
      return { ...next, totalEnds: next.ends.length, setPoints: deriveSetPoints(next) };
    });
  }

  function triggerHaptic() {
    if (typeof window !== "undefined" && window.navigator?.vibrate) {
      window.navigator.vibrate(12);
    }
  }

  function focusArrowField(endId, arrowIndex) {
    const key = `${endId}_${arrowIndex}`;
    const target = arrowRefs.current[key];
    if (!target) return;
    requestAnimationFrame(() => {
      try {
        target.focus();
      } catch {
        // ignore
      }
    });
  }

  function findFirstEmptyTarget(ends) {
    for (const end of ends) {
      for (let i = 0; i < end.arrows.length; i += 1) {
        if (end.arrows[i] === null) {
          return { endId: end.id, arrowIndex: i };
        }
      }
    }
    return null;
  }

  function updateArrow(endId, arrowIndex, value, options = {}) {
    const { autoFocusNext = true, haptic = false } = options;

    const nextEnds = session.ends.map((end) =>
      end.id === endId
        ? {
            ...end,
            arrows: end.arrows.map((arrow, idx) => (idx === arrowIndex ? value : arrow)),
          }
        : end
    );

    patchSession((prev) => ({
      ...prev,
      ends: prev.ends.map((end) =>
        end.id === endId
          ? {
              ...end,
              arrows: end.arrows.map((arrow, idx) => (idx === arrowIndex ? value : arrow)),
            }
          : end
      ),
    }));

    if (haptic) triggerHaptic();

    setFlashKey(`${endId}_${arrowIndex}`);

    const updatedEnd = nextEnds.find((item) => item.id === endId);
    const isSetOpponentStep =
      session.recordInputType === "end" &&
      session.mode === "set" &&
      updatedEnd &&
      updatedEnd.arrows.every((item) => item !== null);

    if (isSetOpponentStep) {
      activateOpponentInput(endId);
      return;
    }

    if (autoFocusNext) {
      const nextTarget = findFirstEmptyTarget(nextEnds);
      if (nextTarget) focusArrowField(nextTarget.endId, nextTarget.arrowIndex);
    }
  }

  function quickInputScore(score) {
    if (session.mode === "set" && activeOpponentEndId) return;
    const emptyTarget = findFirstEmptyTarget(session.ends);
    if (!emptyTarget) return;

    setLastQuickScore(String(score));
    updateArrow(emptyTarget.endId, emptyTarget.arrowIndex, score, {
      autoFocusNext: true,
      haptic: true,
    });
  }

  function undoLast() {
    if (!history.length) return;
    const previous = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setSession(previous);
  }

  function resetEnd(endId) {
    patchSession((prev) => ({
      ...prev,
      ends: prev.ends.map((end) =>
        end.id === endId
          ? {
              ...end,
              arrows: Array.from({ length: prev.arrowsPerEnd }, () => null),
              opponentTotal: 0,
              opponentScoreEntered: false,
            }
          : end
      ),
    }));
    setActiveOpponentEndId((prev) => (prev === endId ? null : prev));
    setOpponentInputBuffers((prev) => ({ ...prev, [endId]: "" }));
  }

  function addEnd() {
    patchSession((prev) => ({
      ...prev,
      ends: [...prev.ends, createEmptyEnd(prev.ends.length + 1, prev.arrowsPerEnd)],
    }));
  }

  function addDistanceRound() {
    patchSession((prev) => ({
      ...prev,
      distanceRounds: [
        ...(prev.distanceRounds || []),
        createEmptyDistanceRound((prev.distanceRounds || []).length + 1, prev.distance || 70),
      ],
    }));
  }

  function updateDistanceRound(roundId, field, value) {
    patchSession((prev) => ({
      ...prev,
      distanceRounds: (prev.distanceRounds || []).map((round) =>
        round.id === roundId ? { ...round, [field]: value } : round
      ),
    }));
  }

  function removeDistanceRound(roundId) {
    patchSession((prev) => {
      const filtered = (prev.distanceRounds || []).filter((round) => round.id !== roundId);
      const nextRounds = filtered.length
        ? filtered.map((round, idx) => ({ ...round, index: idx + 1 }))
        : [createEmptyDistanceRound(1, prev.distance || 70)];
      return { ...prev, distanceRounds: nextRounds };
    });
  }

  function confirmDeleteEnd() {
    patchSession((prev) => {
      const filtered = prev.ends.filter((end) => end.id !== deleteDialog.endId);
      return {
        ...prev,
        ends: reindexEnds(filtered.length ? filtered : [createEmptyEnd(1, prev.arrowsPerEnd)]),
      };
    });
    setDeleteDialog({ open: false, endId: null });
  }

  function applyMode(mode) {
    patchSession((prev) => ({
      ...prev,
      mode,
    recordInputType: "end",
      title: `${mode === "set" ? "세트제" : "누적제"} X-Session`,
    }));
    if (mode !== "set") {
      setActiveOpponentEndId(null);
      setOpponentInputBuffers({});
    }
  }

  function applyRecordInputType(recordInputType) {
    patchSession((prev) => ({
      ...prev,
      recordInputType,
      mode: recordInputType === "distance" ? "cumulative" : prev.mode,
      title: `${(recordInputType === "distance" || prev.mode === "cumulative") ? "누적제" : "세트제"} X-Session`,
      distanceRounds:
        recordInputType === "distance" && (!prev.distanceRounds || !prev.distanceRounds.length)
          ? [
              createEmptyDistanceRound(1, 35),
              createEmptyDistanceRound(2, 30),
              createEmptyDistanceRound(3, 25),
              createEmptyDistanceRound(4, 20),
            ]
          : prev.distanceRounds,
    }));
    if (recordInputType !== "end") {
      setActiveOpponentEndId(null);
      setOpponentInputBuffers({});
    }
  }

  function validateBeforeSave() {
    if (!session.sessionDate) return "날짜를 선택해야 한다.";

    if (session.recordInputType === "distance") {
      if (!session.distanceRounds?.length) return "최소 1개의 거리 기록은 필요하다.";
      const hasAnyDistanceScore = session.distanceRounds.some((round) => Number(round.total) > 0);
      if (!hasAnyDistanceScore) return "최소 1개 거리의 합계 점수는 입력해야 저장 가능하다.";
      return "";
    }

    if (!session.ends.length) return "최소 1개의 엔드는 필요하다.";
    if (session.arrowsPerEnd < 1 || session.arrowsPerEnd > MAX_ARROWS_PER_END) {
      return "엔드당 화살 수가 비정상적이다.";
    }
    const hasAnyArrow = session.ends.some((end) => end.arrows.some((v) => v !== null));
    if (!hasAnyArrow) return "최소 1발 이상 입력해야 저장 가능하다.";
    if (session.mode === "set") {
      const missingOpponentScore = session.ends.some((end) => {
        const hasEndInput = end.arrows.some((v) => v !== null);
        return hasEndInput && !end.opponentScoreEntered;
      });
      if (missingOpponentScore) return "세트제는 각 엔드의 상대 점수를 입력해야 저장 가능하다.";
    }
    return "";
  }

  async function confirmSave() {
    const err = validateBeforeSave();
    if (err) {
      setSaveError(err);
      return;
    }
    setSaveError("");
    await onSave();
    setSaveDialogOpen(false);
    setHistory([]);
  }

  async function confirmDeleteSavedSession() {
    await onDeleteSavedSession();
    setDeleteSessionDialog(false);
    setHistory([]);
  }

  function isCurrentArrow(endId, arrowIndex) {
    return currentTarget?.endId === endId && currentTarget?.arrowIndex === arrowIndex;
  }

  function setOpponentBuffer(endId, value) {
    setOpponentInputBuffers((prev) => ({ ...prev, [endId]: value }));
  }

  function focusFirstArrowOfEnd(endId) {
    const target = session.ends.find((item) => item.id === endId);
    if (!target) return;
    focusArrowField(target.id, 0);
  }

  function moveToNextEndFromOpponent(endId) {
    const currentIndex = session.ends.findIndex((item) => item.id === endId);
    setActiveOpponentEndId(null);
    if (currentIndex === -1) return;
    const nextEnd = session.ends[currentIndex + 1];
    if (nextEnd) {
      requestAnimationFrame(() => focusFirstArrowOfEnd(nextEnd.id));
    }
  }

  function confirmOpponentScore(endId) {
    triggerHaptic(16);
    const raw = String(opponentInputBuffers[endId] ?? "");
    if (raw === "") return;
    const value = Math.max(0, Number(raw) || 0);
    patchSession((prev) => ({
      ...prev,
      ends: prev.ends.map((item) =>
        item.id === endId ? { ...item, opponentTotal: value, opponentScoreEntered: true } : item
      ),
    }));
    moveToNextEndFromOpponent(endId);
  }

  function handleOpponentKeypadInput(endId, digit) {
    triggerHaptic(10);
    const nextValue = `${String(opponentInputBuffers[endId] ?? "")}${digit}`.slice(0, 2);
    setOpponentBuffer(endId, nextValue);
    if (nextValue.length >= 2) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setOpponentInputBuffers((prev) => {
            const latest = String(prev[endId] ?? nextValue);
            if (latest !== "") {
              const value = Math.max(0, Number(latest) || 0);
              patchSession((sessionPrev) => ({
                ...sessionPrev,
                ends: sessionPrev.ends.map((item) =>
                  item.id === endId ? { ...item, opponentTotal: value, opponentScoreEntered: true } : item
                ),
              }));
              moveToNextEndFromOpponent(endId);
            }
            return prev;
          });
        }, 0);
      });
    }
  }

  function handleOpponentKeypadDelete(endId) {
    triggerHaptic(6);
    const raw = String(opponentInputBuffers[endId] ?? "");
    setOpponentBuffer(endId, raw.slice(0, -1));
  }

  function activateOpponentInput(endId) {
    triggerHaptic(10);
    const end = session.ends.find((item) => item.id === endId);
    setActiveOpponentEndId(endId);
    setOpponentBuffer(
      endId,
      end && end.opponentScoreEntered ? String(end.opponentTotal ?? 0) : ""
    );
  }

  function getQuickButtonClass(score) {
    const base =
      "h-10 rounded-2xl border transition-all duration-150 active:scale-[0.98] ";
    const isActive = String(lastQuickScore) === String(score);

    if (score === "X") {
      return `${base} ${isActive ? "border-amber-400 bg-amber-100 text-amber-900 shadow-sm" : "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100"}`;
    }
    if (score === "M") {
      return `${base} ${isActive ? "border-slate-500 bg-slate-200 text-slate-900 shadow-sm" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"}`;
    }
    if (Number(score) >= 9) {
      return `${base} ${isActive ? "border-red-400 bg-red-100 text-red-900 shadow-sm" : "border-red-200 bg-red-50 text-red-800 hover:bg-red-100"}`;
    }
    if (Number(score) >= 7) {
      return `${base} ${isActive ? "border-blue-400 bg-blue-100 text-blue-900 shadow-sm" : "border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100"}`;
    }
    return `${base} ${isActive ? "border-emerald-400 bg-emerald-100 text-emerald-900 shadow-sm" : "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"}`;
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[0.88fr_1.12fr]">
        <Card className="self-start rounded-[28px] border-0 bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-700" /> X-Session Setup
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {editingSavedSession && (
                  <Badge className="rounded-full bg-amber-500 px-3 py-1 text-white">
                    세션 편집중
                  </Badge>
                )}
                <Badge className="rounded-full bg-gradient-to-r from-blue-900 to-red-700 px-3 py-1 text-white">
                  {session.mode === "set" ? "세트제" : "누적제"}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <Label className="w-24 shrink-0 text-sm">날짜</Label>
                <Input
                  className="h-11 flex-1"
                  type="date"
                  value={session.sessionDate}
                  onChange={(e) => patchSession((prev) => ({ ...prev, sessionDate: e.target.value }))}
                />
              </div>

              <div className="flex items-start gap-3">
                <Label className="w-24 shrink-0 pt-3 text-sm">입력 방식</Label>
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Button
                    variant={session.recordInputType === "end" ? "default" : "outline"}
                    className="h-11 rounded-2xl bg-blue-900 px-3 hover:bg-blue-800"
                    onClick={() => applyRecordInputType("end")}
                  >
                    엔드 기반
                  </Button>
                  <Button
                    variant={session.recordInputType === "distance" ? "default" : "outline"}
                    className="h-11 rounded-2xl bg-emerald-700 px-3 hover:bg-emerald-600"
                    onClick={() => applyRecordInputType("distance")}
                  >
                    거리 기반
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Label className="w-24 shrink-0 pt-3 text-sm">기록 방식</Label>
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Button
                    variant={session.mode === "cumulative" ? "default" : "outline"}
                    className="h-11 rounded-2xl bg-blue-900 px-3 hover:bg-blue-800"
                    onClick={() => applyMode("cumulative")}
                  >
                    누적제
                  </Button>
                  <Button
                    variant={session.mode === "set" ? "default" : "outline"}
                    className="h-11 rounded-2xl bg-red-700 px-3 hover:bg-red-600"
                    onClick={() => applyMode("set")}
                  >
                    세트제
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-24 shrink-0 text-sm">거리 (m)</Label>
                <div className="flex-1">
                  <Select
                    value={String(session.distance)}
                    onValueChange={(value) => patchSession((prev) => ({ ...prev, distance: Number(value) }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="거리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_OPTIONS.map((distance) => (
                        <SelectItem key={distance} value={String(distance)}>
                          {distance}m
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-24 shrink-0 text-sm">학년</Label>
                <Input className="h-11 flex-1" value={session.division || ""} disabled />
              </div>

              {session.recordInputType === "end" ? (
                <div className="flex items-center gap-3">
                  <Label className="w-24 shrink-0 text-sm">엔드당 화살 수</Label>
                  <select
                    value={String(session.arrowsPerEnd)}
                    onChange={(e) => {
                      const next = Math.min(MAX_ARROWS_PER_END, Math.max(1, Number(e.target.value) || 1));
                      patchSession((prev) => ({
                        ...prev,
                        arrowsPerEnd: next,
                        ends: prev.ends.map((end) => ({
                          ...end,
                          arrows: Array.from({ length: next }, (_, i) => end.arrows[i] ?? null),
                        })),
                      }));
                    }}
                    className="h-11 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={String(count)}>{count}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Label className="w-24 shrink-0 text-sm">거리당 화살 수</Label>
                  <Input
                    className="h-11 flex-1"
                    type="number"
                    min={1}
                    value={session.arrowsPerDistance || 36}
                    onChange={(e) =>
                      patchSession((prev) => ({
                        ...prev,
                        arrowsPerDistance: Math.max(1, Number(e.target.value) || 36),
                      }))
                    }
                  />
                </div>
              )}

              <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-red-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>X-Session 진행률</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 pb-28 md:pb-6">
          {session.recordInputType === "end" ? (
            <>
              <div className="sticky top-2 z-30 rounded-[28px] border border-slate-200 bg-white/95 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/90">
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-700">빠른 점수 입력</div>
                      <Button
                        variant="outline"
                        className="h-9 rounded-2xl px-3 text-xs sm:text-sm"
                        onClick={undoLast}
                        disabled={!history.length}
                      >
                        <Undo2 className="mr-2 h-4 w-4" /> 마지막 입력 취소
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                      {QUICK_SCORE_OPTIONS.map((score) => (
                        <Button
                          key={String(score)}
                          variant="outline"
                          className={getQuickButtonClass(score)}
                          onClick={() => quickInputScore(score)}
                        >
                          {score}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {session.ends.map((end) => (
                <Card key={end.id} className="rounded-[28px] border-0 bg-white shadow-xl">
                  <CardContent className="p-4 md:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold">End {end.index}</div>
                        <div className="text-sm text-slate-500">합계 {endTotal(end)}점</div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="rounded-2xl" onClick={() => resetEnd(end.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> 초기화
                        </Button>
                        <Button
                          variant="outline"
                          className="rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteDialog({ open: true, endId: end.id })}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 엔드 삭제
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {end.arrows.map((arrow, arrowIndex) => {
                        const key = `${end.id}_${arrowIndex}`;
                        const isCurrent = isCurrentArrow(end.id, arrowIndex);
                        const isFlashed = flashKey === key;

                        return (
                          <div
                            key={key}
                            className={`rounded-2xl border p-2 transition-all duration-150 ${
                              isCurrent
                                ? "border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-200"
                                : isFlashed
                                  ? "border-emerald-300 bg-emerald-50"
                                  : "border-slate-200"
                            }`}
                          >
                            <div className="mb-2 text-center text-xs text-slate-500">화살 {arrowIndex + 1}</div>
                            <select
                              ref={(el) => {
                                if (el) arrowRefs.current[key] = el;
                              }}
                              disabled={session.mode === "set" && !!activeOpponentEndId}
                              value={arrow ?? ""}
                              onChange={(e) =>
                                updateArrow(
                                  end.id,
                                  arrowIndex,
                                  e.target.value === ""
                                    ? null
                                    : isNaN(Number(e.target.value))
                                      ? e.target.value
                                      : Number(e.target.value),
                                  { autoFocusNext: true, haptic: true }
                                )
                              }
                              className={`h-10 w-full rounded-xl border bg-white px-2 text-center text-sm outline-none transition ${
                                isCurrent
                                  ? "border-blue-300 text-blue-900"
                                  : isFlashed
                                    ? "border-emerald-300 text-emerald-900"
                                    : "border-slate-200"
                              }`}
                            >
                              <option value="">선택</option>
                              {SCORE_OPTIONS.map((option) => (
                                <option key={String(option)} value={String(option)}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      })}
                    </div>

                    {session.mode === "set" && (
                      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-3">
                            <Label>상대 엔드 점수</Label>
                            <div
                              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
                                activeOpponentEndId === end.id
                                  ? "bg-blue-100 text-blue-900 ring-1 ring-blue-300"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {activeOpponentEndId === end.id ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <span>{String(opponentInputBuffers[end.id] ?? "") || "입력 대기"}</span>
                                  <span className="animate-pulse text-blue-500">|</span>
                                </span>
                              ) : (
                                String(end.opponentTotal ?? 0)
                              )}
                            </div>
                          </div>

                          {activeOpponentEndId === end.id ? (
                            <>
                              <div className="grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                  <Button
                                    key={`${end.id}_${num}`}
                                    type="button"
                                    variant="outline"
                                    className="h-11 rounded-2xl text-base font-semibold"
                                    onClick={() => handleOpponentKeypadInput(end.id, num)}
                                  >
                                    {num}
                                  </Button>
                                ))}
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-11 rounded-2xl text-base font-semibold"
                                  onClick={() => handleOpponentKeypadDelete(end.id)}
                                >
                                  ←
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-11 rounded-2xl text-base font-semibold"
                                  onClick={() => handleOpponentKeypadInput(end.id, 0)}
                                >
                                  0
                                </Button>
                                <Button
                                  type="button"
                                  className="h-11 rounded-2xl bg-blue-900 text-base font-semibold hover:bg-blue-800"
                                  onClick={() => confirmOpponentScore(end.id)}
                                  disabled={String(opponentInputBuffers[end.id] ?? "") === ""}
                                >
                                  확인
                                </Button>
                              </div>
                              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                                지금은 상대 엔드 점수 입력 단계다. 0점도 0을 직접 눌러 입력해야 다음 엔드로 이동한다.
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                              <div className="text-sm text-slate-500">입력된 상대 엔드 점수로 세트 포인트를 계산한다.</div>
                              <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => activateOpponentInput(end.id)}
                              >
                                점수 수정
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </>
          ) : (
            <>
              <div className="grid gap-3">
                {(session.distanceRounds || []).map((round) => (
                  <Card key={round.id} className="rounded-[28px] border-0 bg-white shadow-xl">
                    <CardContent className="p-4 md:p-5">
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="text-base font-semibold">거리 기록 {round.index}</div>
                          <div className="text-sm text-slate-500">
                            거리 {round.distance || "-"}m · 합계 {Number(round.total) || 0}점
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                          onClick={() => removeDistanceRound(round.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> 거리 삭제
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label>거리 (m)</Label>
                          <Input
                            type="number"
                            min={1}
                            value={round.distance}
                            onChange={(e) =>
                              updateDistanceRound(round.id, "distance", Math.max(1, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>거리 합계 점수</Label>
                          <Input
                            type="number"
                            min={0}
                            value={round.total}
                            onChange={(e) =>
                              updateDistanceRound(round.id, "total", Math.max(0, Number(e.target.value) || 0))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
          <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col gap-3">
                {tempSaveMessage && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {tempSaveMessage}
                  </div>
                )}

                {saveError && (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {saveError}
                  </div>
                )}

                <div className="grid gap-2 sm:grid-cols-4">
                  {session.recordInputType === "end" ? (
                    <Button variant="outline" className="rounded-2xl" onClick={addEnd}>
                      <Plus className="mr-2 h-4 w-4" /> 엔드 추가
                    </Button>
                  ) : (
                    <Button variant="outline" className="rounded-2xl" onClick={addDistanceRound}>
                      <Plus className="mr-2 h-4 w-4" /> 거리 추가
                    </Button>
                  )}

                  <Button variant="outline" className="rounded-2xl" onClick={onTempSave}>
                    <Archive className="mr-2 h-4 w-4" /> 임시 세션 저장
                  </Button>

                  <Button
                    className="rounded-2xl bg-blue-900 hover:bg-blue-800"
                    onClick={() => setSaveDialogOpen(true)}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {editingSavedSession ? "세션 업데이트" : "세션 저장"}
                  </Button>

                  {editingSavedSession && (
                    <Button
                      variant="outline"
                      className="rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                      onClick={() => setDeleteSessionDialog(true)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 세션 삭제
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="rounded-[28px]">
          <DialogHeader>
            <DialogTitle>{editingSavedSession ? "X-Session 업데이트" : "X-Session 저장"}</DialogTitle>
            <DialogDescription>
              현재 입력 상태를 {editingSavedSession ? "업데이트" : "Firestore에 저장"}한다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm">
            <div>총점: {getSessionTotal(session)}점</div>
            <div>히트 수: {getHits(session)}발</div>
            <div>X 개수: {getXs(session)}개</div>
            <div>평균 화살 점수: {getAverageArrow(session).toFixed(2)}</div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-2xl" onClick={() => setSaveDialogOpen(false)}>
              취소
            </Button>
            <Button className="rounded-2xl bg-blue-900 hover:bg-blue-800" onClick={confirmSave} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {editingSavedSession ? "업데이트 완료" : "저장 완료"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}>
        <DialogContent className="rounded-[28px]">
          <DialogHeader>
            <DialogTitle>엔드 삭제 확인</DialogTitle>
            <DialogDescription>이 엔드를 삭제하면 해당 엔드 기록이 함께 제거된다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-2xl" onClick={() => setDeleteDialog({ open: false, endId: null })}>
              취소
            </Button>
            <Button className="rounded-2xl bg-red-700 hover:bg-red-600" onClick={confirmDeleteEnd}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteSessionDialog} onOpenChange={setDeleteSessionDialog}>
        <DialogContent className="rounded-[28px]">
          <DialogHeader>
            <DialogTitle>X-Session 삭제 확인</DialogTitle>
            <DialogDescription>현재 불러온 저장 세션을 완전히 삭제한다.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-2xl" onClick={() => setDeleteSessionDialog(false)}>
              취소
            </Button>
            <Button className="rounded-2xl bg-red-700 hover:bg-red-600" onClick={confirmDeleteSavedSession}>
              세션 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Dashboard({ sessions, loading, onEditSession }) {
  const completed = sessions.filter((s) => s.isComplete);

  const todayKey = getTodayKey();
  const yesterdayKey = getYesterdayKey();

  const todaySessions = completed.filter((s) => getSessionDayKey(s) === todayKey);
  const yesterdaySessions = completed.filter((s) => getSessionDayKey(s) === yesterdayKey);

  const todayTotal = todaySessions.reduce(
    (sum, s) => sum + (s.summary?.totalScore ?? getSessionTotal(s)),
    0
  );
  const todayArrows = todaySessions.reduce(
    (sum, s) => sum + (s.summary?.totalArrows ?? getArrowCount(s)),
    0
  );
  const todayXCount = todaySessions.reduce(
    (sum, s) => sum + (s.summary?.xCount ?? getXs(s)),
    0
  );
  const todayAverage = todayArrows ? (todayTotal / todayArrows).toFixed(2) : "0.00";
  const todayCount = todaySessions.length;

  const previousDayTotal = yesterdaySessions.reduce(
    (sum, s) => sum + (s.summary?.totalScore ?? getSessionTotal(s)),
    0
  );

  const previousDayArrows = yesterdaySessions.reduce(
    (sum, s) => sum + (s.summary?.totalArrows ?? getArrowCount(s)),
    0
  );

  const previousDayXCount = yesterdaySessions.reduce(
    (sum, s) => sum + (s.summary?.xCount ?? getXs(s)),
    0
  );

  const previousDayAverage = previousDayArrows
    ? (previousDayTotal / previousDayArrows).toFixed(2)
    : "0.00";

  const previousDayBest = yesterdaySessions.length
    ? yesterdaySessions.reduce((best, current) =>
        (current.summary?.totalScore ?? getSessionTotal(current)) >
        (best.summary?.totalScore ?? getSessionTotal(best))
          ? current
          : best
      )
    : null;

  const previousDayBestScore = previousDayBest
    ? previousDayBest.summary?.totalScore ?? getSessionTotal(previousDayBest)
    : 0;
  const previousDayBestDistance = previousDayBest ? previousDayBest.distance : "-";

  const todayBest = todaySessions.length
    ? todaySessions.reduce((best, current) =>
        (current.summary?.totalScore ?? getSessionTotal(current)) >
        (best.summary?.totalScore ?? getSessionTotal(best))
          ? current
          : best
      )
    : null;

  const todayBestScore = todayBest
    ? todayBest.summary?.totalScore ?? getSessionTotal(todayBest)
    : 0;
  const todayBestDistance = todayBest ? todayBest.distance : "-";

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-red-700 to-red-500 p-0 text-white">
            <div className="grid grid-cols-2 divide-x divide-white/20">
              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 누적 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayTotal}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {yesterdayKey} 기록 기준 점수 합산
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 누적 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayTotal}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayCount ? `오늘 세션 ${todayCount}개 · 평균 ${todayAverage}` : "오늘 기록 없음"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-slate-900 to-slate-700 p-0 text-white">
            <div className="grid grid-cols-2 divide-x divide-white/20">
              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 화살 평균 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayAverage}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  X {previousDayXCount}개
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 화살 평균 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayAverage}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayCount ? `X ${todayXCount}개` : "오늘 기록 없음"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-amber-500 to-yellow-400 p-0 text-slate-900">
            <div className="grid grid-cols-2 divide-x divide-slate-900/10">
              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 거리 최고 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayBestScore}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {previousDayBest ? `${previousDayBestDistance}m 최고` : "전일 기록 없음"}
                </div>
              </div>

              <div className="p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 거리 최고 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayBestScore}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayBest ? `${todayBestDistance}m 최고` : "오늘 기록 없음"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle>Recent X-Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> X-Session 불러오는 중
            </div>
          ) : sessions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              아직 저장된 X-Session이 없다.
            </div>
          ) : (
            <div className="grid gap-3">
              {completed
                .slice()
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((session) => (
                  <div
                    key={session.id}
                    className="grid gap-2 rounded-3xl border border-slate-200 p-3 md:grid-cols-[1fr_auto] md:items-center md:gap-3 md:p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full bg-gradient-to-r from-blue-900 to-red-700 text-white">
                          {getModeLabel(session.mode)}
                        </Badge>
                        <Badge className="rounded-full bg-slate-700 text-white">
                          {getInputTypeLabel(session.recordInputType)}
                        </Badge>
                        <Badge className="rounded-full bg-emerald-600 text-white">
                          완료
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        {formatDateTime(session.updatedAt)}
                      </div>
                      <div className="mt-2 text-sm leading-snug text-slate-700">
                        총점 {session.summary?.totalScore ?? getSessionTotal(session)} / {getInputTypeLabel(session.recordInputType)} / X{" "}
                        {session.summary?.xCount ?? getXs(session)} / 평균{" "}
                        {(
                          session.summary?.averageArrow ?? getAverageArrow(session)
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm text-slate-500 md:flex-col md:items-end md:text-right">
                      <div className="truncate">
                        {session.recordInputType === "distance"
                          ? `거리 기록 ${(session.distanceRounds || []).length}개`
                          : `${session.distance}m · 엔드 ${session.ends.length}개`}
                      </div>
                      <Button
                        variant="outline"
                        className="h-10 rounded-2xl px-4"
                        onClick={() => onEditSession?.(session.id)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> 수정
                      </Button>
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
                value={rankingFilters.division}
                onChange={(e) => setRankingFilters((prev) => ({ ...prev, division: e.target.value }))}
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
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="truncate text-sm font-semibold">{item.name}</div>
                          {item.userId === currentUserId && (
                            <Badge className="h-5 rounded-full bg-blue-900 px-2 text-[10px] text-white">나</Badge>
                          )}
                        </div>
                        <div className="truncate text-[11px] text-slate-500">
                          {item.groupName} · {item.regionCity} · {item.rankingGroup || item.division}
                        </div>
                      </div>
                      <div className="text-right text-xs font-semibold text-slate-500">
                        {rankingType === "distance" || rankingType === "weeklyDistance"
                          ? `${item.bestScore}점`
                          : `총점 ${Number(item.totalScore || 0).toFixed(0)}`}
                      </div>
                    </div>

                    <div className="mt-1 pl-10 text-[11px] text-slate-700">
                      {rankingType === "distance" || rankingType === "weeklyDistance" ? (
                        <>
                          거리 {item.distance}m · 구분 {item.rankingGroup || item.division} · 인정 세션 {item.qualifiedSessions}개 · 기준일 {formatDateOnly(item.latestDate)}
                        </>
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
  const [selectedRival, setSelectedRival] = useState(rivalCandidates[0]?.id || "none");

  useEffect(() => {
    if (!rivalCandidates.find((u) => u.id === selectedRival)) {
      setSelectedRival(rivalCandidates[0]?.id || "none");
    }
  }, [selectedRival, rivalCandidates]);

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
                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">평균 화살 점수 변화</div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer>
                      <LineChart data={analytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgArrow" name="평균 화살 점수" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 4, fill: CHART_COLORS.avg }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-3xl bg-slate-50 p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-700">구간별 총점</div>
                  <div className="h-[320px] w-full">
                    <ResponsiveContainer>
                      <BarChart data={analytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" name="총점" fill={CHART_COLORS.score} radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4">
                <div className="mb-3 text-sm font-semibold text-slate-700">거리별 성능 비교</div>
                <div className="h-[320px] w-full">
                  <ResponsiveContainer>
                    <BarChart data={distancePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgArrow" name="거리별 평균 화살 점수" fill={CHART_COLORS.avg} radius={[8, 8, 0, 0]} />
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

            <div className="grid gap-2">
              <Label>라이벌 선택</Label>
              <select value={selectedRival} onChange={(e) => setSelectedRival(e.target.value)} className="h-11 min-w-[240px] rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none">
                {rivalCandidates.length === 0 ? (
                  <option value="none">비교할 선수가 없음</option>
                ) : (
                  rivalCandidates.map((user) => (
                    <option key={user.id} value={user.id}>{getDisplayName(user)}</option>
                  ))
                )}
              </select>
            </div>

            <div className="pb-2 text-sm text-slate-500">나 vs {rivalLabel}</div>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-red-50 p-4">
            <div className="mb-3 text-sm font-semibold text-slate-700">평균 화살 점수 비교</div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer>
                <LineChart data={comparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
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


function AdminPanel({ currentUser, users, sessions, appServices, onRefresh }) {
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

  async function handleSaveSession() {
    if (!appServices?.db || !authUser || !profile || !draftSession) return;

    setSessionSaving(true);
    setGlobalError("");

    try {
      const payload = buildSessionPayload({ draftSession, profile, uid: authUser.uid });
      const fixedSessionDate = editingSessionId
        ? (draftSession?.sessionDate || getCurrentLocalDateString())
        : getCurrentLocalDateString();
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
              {ui.activeTab === "profile" && <ProfilePanel user={currentUser} onUpdate={handleUpdateProfile} saving={profileSaving} />}
              {ui.activeTab === "admin" && isAdminUser && <AdminPanel currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} appServices={appServices} onRefresh={() => loadUsersAndSessions(appServices.db)} />}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default XSessionApp;
