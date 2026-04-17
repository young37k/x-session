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
const DISTANCE_OPTIONS = [18, 20, 25, 30, 35, 40, 50, 60, 70, 90];

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

function normalizeSessionShape(session, profile = null) {
  const safe = session || {};
  const arrowsPerEnd = safe.arrowsPerEnd || 6;
  const ends = Array.isArray(safe.ends) && safe.ends.length
    ? safe.ends.map((end, idx) => ({
        id: end.id || uid("end"),
        index: idx + 1,
        arrows: Array.from({ length: arrowsPerEnd }, (_, i) => end.arrows?.[i] ?? null),
        opponentTotal: end.opponentTotal || 0,
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
    sessionDate: new Date().toISOString().slice(0, 10),
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
  return session.ends.flatMap((end) => end.arrows).filter((v) => v !== null && v !== "M").length;
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

function getYesterdayKey() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
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
          endTotal: endTotal(end),
          xCount: end.arrows.filter((v) => v === "X").length,
          hitCount: end.arrows.filter((v) => v !== null && v !== "M").length,
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

function buildUserRankings(users, sessions, rankingFilters = {}) {
  return users
    .map((user) => {
      const mySessions = sessions.filter((s) => s.userId === user.id && s.isComplete);

      const filtered = mySessions.filter((s) => {
        const metric = getSessionRankingMetric(s, rankingFilters);
        if (!metric) return false;

        if (
          rankingFilters.division &&
          rankingFilters.division !== "all" &&
          normalizeDivisionLabel(s.division) !== normalizeDivisionLabel(rankingFilters.division)
        ) {
          return false;
        }
        if (
          rankingFilters.groupName &&
          rankingFilters.groupName !== "all" &&
          (s.groupName || user.groupName || "") !== rankingFilters.groupName
        ) {
          return false;
        }
        if (
          rankingFilters.regionCity &&
          rankingFilters.regionCity !== "all" &&
          (s.regionCity || user.regionCity || "") !== rankingFilters.regionCity
        ) {
          return false;
        }
        if (
          rankingFilters.mode &&
          rankingFilters.mode !== "all" &&
          s.mode !== rankingFilters.mode
        ) {
          return false;
        }
        if (
          rankingFilters.dateFilter &&
          rankingFilters.dateFilter !== "all" &&
          !isWithinDateFilter(s.sessionDate, rankingFilters.dateFilter)
        ) {
          return false;
        }
        return true;
      });

      const metrics = filtered.map((s) => getSessionRankingMetric(s, rankingFilters)).filter(Boolean);

      const totalScore = metrics.reduce((sum, metric) => sum + metric.score, 0);
      const totalArrows = metrics.reduce((sum, metric) => sum + metric.arrows, 0);
      const avgArrow = totalArrows ? totalScore / totalArrows : 0;
      const bestSession = metrics.length ? Math.max(...metrics.map((metric) => metric.best)) : 0;

      return {
        userId: user.id,
        name: getDisplayName(user),
        club: user.club || "-",
        groupName: user.groupName || "-",
        division: normalizeDivisionLabel(user.division) || "-",
        sessions: filtered.length,
        totalScore,
        avgArrow,
        bestSession,
        xCount: metrics.reduce((sum, metric) => sum + (metric.xCount || 0), 0),
        avatar: "",
        distance: metrics[0]?.distance || 0,
        latestDate:
          filtered
            .slice()
            .sort((a, b) => String(b.sessionDate).localeCompare(String(a.sessionDate)))[0]
            ?.sessionDate || "",
      };
    })
    .filter((item) => item.sessions > 0);
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

function Hero() {
  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-gradient-to-br from-blue-950 via-slate-900 to-red-900 text-white shadow-2xl">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="rounded-full border-0 bg-white/15 px-3 py-1 text-white">
              X-SESSION
            </Badge>
            <Badge className="rounded-full border-0 bg-red-500/80 px-3 py-1 text-white">
              X-Session Platform
            </Badge>
            <Badge className="rounded-full border-0 bg-blue-500/80 px-3 py-1 text-white">
              X Brand System
            </Badge>
          </div>
          <div className="mt-6 max-w-4xl">
            <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              X-Session으로 기록하고, X-Ranking으로 증명한다.
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-slate-200 md:text-2xl">
              이 버전은 X-Session, X-Dashboard, X-Ranking, X-Analysis 구조를 기준으로 한 Firebase 실전 연결형 v1이다.
            </p>
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


function AuthPanel({ onRegister, onLogin, onAdminLogin, authLoading }) {
  const SAVED_EMAIL_KEY = "elbowshot_saved_email";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    division: "전체학년",
    groupName: "",
    regionCity: "",
    regionDistrict: "",
  });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const districtOptions = useMemo(() => getDistrictOptions(form.regionCity), [form.regionCity]);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || "";
      if (savedEmail) {
        setForm((prev) => ({ ...prev, email: savedEmail }));
        setRememberEmail(true);
      }
    } catch {
      // ignore
    }
  }, []);

  async function submit(e) {
    e.preventDefault();

    if (!form.email.trim() || !form.email.includes("@")) {
      return setError("올바른 이메일이 필요하다.");
    }

    if (!form.password.trim() || form.password.length < 6) {
      return setError("비밀번호는 최소 6자 이상이어야 한다.");
    }

    if (mode === "register") {
      if (!form.name.trim()) return setError("이름을 입력해야 한다.");
      if (!form.division) return setError("학년 또는 부문을 선택해야 한다.");
      if (!form.groupName.trim()) return setError("소속을 입력해야 한다.");
      if (!form.regionCity) return setError("지역(시/도)을 선택해야 한다.");
      if (!form.regionDistrict) return setError("지역(구/군)을 선택해야 한다.");

      setError("");
      await onRegister({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        division: form.division,
        groupName: form.groupName.trim(),
        regionCity: form.regionCity,
        regionDistrict: form.regionDistrict,
      });
      return;
    }

    try {
      const normalizedEmail = form.email.trim().toLowerCase();

      if (rememberEmail) {
        localStorage.setItem(SAVED_EMAIL_KEY, normalizedEmail);
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
      }
    } catch {
      // ignore
    }

    setError("");
    await onLogin({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
  }

  return (
    <Card className="rounded-[28px] border-0 bg-white shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User className="h-5 w-5 text-blue-700" />
          {mode === "register" ? "회원가입" : "로그인"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex gap-2">
          <Button
            variant={mode === "login" ? "default" : "outline"}
            className="rounded-2xl"
            onClick={() => setMode("login")}
          >
            로그인
          </Button>
          <Button
            variant={mode === "register" ? "default" : "outline"}
            className="rounded-2xl"
            onClick={() => setMode("register")}
          >
            회원가입
          </Button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          {mode === "register" && (
            <>
              <div className="grid gap-2">
                <Label>이름</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>학년/부문</Label>
                <Select
                  value={form.division || undefined}
                  onValueChange={(value) => setForm({ ...form, division: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="학년 또는 부문 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISION_OPTIONS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>소속</Label>
                <Input
                  value={form.groupName}
                  onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                  placeholder="예: 서울체고, OO클럽, OO실업팀"
                />
              </div>

              <div className="grid gap-2">
                <Label>지역(시/도)</Label>
                <select
                  value={form.regionCity || ""}
                  onChange={(e) =>
                    setForm({ ...form, regionCity: e.target.value, regionDistrict: "" })
                  }
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                >
                  <option value="">지역 선택</option>
                  {REGION_CITY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label>지역(구/군)</Label>
                <select
                  value={form.regionDistrict || ""}
                  onChange={(e) => setForm({ ...form, regionDistrict: e.target.value })}
                  disabled={!form.regionCity}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none disabled:bg-slate-50"
                >
                  <option value="">구/군 선택</option>
                  {districtOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label>이메일</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>비밀번호</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {mode === "login" && (
            <div className="md:col-span-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <input
                id="remember-email"
                type="checkbox"
                checked={rememberEmail}
                onChange={(e) => setRememberEmail(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              <label htmlFor="remember-email" className="cursor-pointer select-none">
                이메일 저장
              </label>
              <span className="text-xs text-slate-500">다음 로그인 때 이메일을 자동으로 불러온다.</span>
            </div>
          )}

          <div className="md:col-span-2 flex flex-col gap-3">
            {error && (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={authLoading}
              className="h-11 rounded-2xl bg-blue-900 text-base hover:bg-blue-800"
            >
              {authLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              {mode === "register" ? "X-SESSION 가입" : "X-SESSION 로그인"}
            </Button>

            {mode === "login" && (
              <Button
                type="button"
                variant="outline"
                disabled={authLoading}
                className="h-11 rounded-2xl"
                onClick={async () => {
                  setError("");
                  try {
                    await onAdminLogin({
                      email: form.email.trim().toLowerCase(),
                      password: form.password,
                    });
                  } catch (error) {
                    setError(error.message || "관리자 로그인에 실패했다.");
                  }
                }}
              >
                관리자 페이지 로그인
              </Button>
            )}
          </div>
        </form>
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
      <Card className="rounded-[28px] border-0 bg-white shadow-xl">
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

