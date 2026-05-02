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
  "일반부"
];
const GENDER_OPTIONS = ["남", "여"];

function normalizeOfficialDivision(division) {
  if (division === "초등1" || division === "초등2" || division === "초등3" || division === "초등4") {
    return "초등부(저학년)";
  }
  if (division === "초등5" || division === "초등6") {
    return "초등부(고학년)";
  }
  if (division === "중등1" || division === "중등2" || division === "중등3") {
    return "중등부";
  }
  return division || "";
}

const RANKING_GROUP_OPTIONS = [
  "초등부(저학년)",
  "초등부(고학년)",
  "초등부(통합)",
  "중등부",
  "고등부",
  "대학/일반부"
];
const DISTANCE_OPTIONS = [18, 20, 25, 30, 35, 40, 50, 60, 70, 90];

const DIVISION_DISTANCE_RULES = {
  "초등1": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "초등2": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "초등3": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "초등4": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "초등5": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "초등6": { 남: [35, 30, 25, 20], 여: [35, 30, 25, 20] },
  "중등1": { 남: [60, 50, 40, 30], 여: [60, 50, 40, 30] },
  "중등2": { 남: [60, 50, 40, 30], 여: [60, 50, 40, 30] },
  "중등3": { 남: [60, 50, 40, 30], 여: [60, 50, 40, 30] },
  "고등1": { 남: [90, 70, 50, 30], 여: [70, 60, 50, 30] },
  "고등2": { 남: [90, 70, 50, 30], 여: [70, 60, 50, 30] },
  "고등3": { 남: [90, 70, 50, 30], 여: [70, 60, 50, 30] },
  "대학부": { 남: [90, 70, 50, 30], 여: [70, 60, 50, 30] },
  "일반부": { 남: [90, 70, 50, 30], 여: [70, 60, 50, 30] }
};

const RANKING_GROUP_DISTANCE_RULES = {
  "초등부(저학년)": [35, 30, 25, 20],
  "초등부(고학년)": [35, 30, 25, 20],
  "초등부(통합)": [35, 30, 25, 20],
  "중등부": [60, 50, 40, 30],
  "고등부(남)": [90, 70, 50, 30],
  "고등부(여)": [70, 60, 50, 30],
  "대학/일반부(남)": [90, 70, 50, 30],
  "대학/일반부(여)": [70, 60, 50, 30]
};


const REGION_CITY_OPTIONS = [
  "전국",
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
  "전국",
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
  { value: "custom", label: "날짜 지정" },
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

const DEFAULT_UI = { activeTab: "routine" };
const VALID_APP_TABS = new Set(["routine", "dashboard", "record", "ranking", "analysis", "stage", "profile", "admin"]);
function normalizeAppTab(tab, fallback = DEFAULT_UI.activeTab) {
  const raw = String(tab || "").trim();
  const normalized = raw === "session" ? "record" : raw === "brief" ? "stage" : raw;
  return VALID_APP_TABS.has(normalized) ? normalized : fallback;
}

function readSessionStorageJSON(key, fallback = null) {
  try {
    if (typeof window === "undefined" || !key) return fallback;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeSessionStorageJSON(key, value) {
  try {
    if (typeof window === "undefined" || !key) return;
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable
  }
}

function removeSessionStorageKey(key) {
  try {
    if (typeof window === "undefined" || !key) return;
    window.sessionStorage.removeItem(key);
  } catch {
    // sessionStorage unavailable
  }
}

function getLiveDraftSessionKey(userId) {
  return `elbowshot_live_draft_session_${userId || "guest"}`;
}

function getUiSessionStateKey(userId) {
  return `elbowshot_ui_state_${userId || "guest"}`;
}

function getRoutineDraftSessionKey(userId, date) {
  return `x_session_routine_draft_${userId || "guest"}_${date || getCurrentLocalDateString()}`;
}

function getSavedRoutineForToday(userId, existingRoutine, date = getCurrentLocalDateString()) {
  return existingRoutine || readStoredRoutineRecord(userId, date) || null;
}

function getAnalysisSessionStateKey(userId) {
  return `elbowshot_analysis_state_${userId || "guest"}`;
}

function getInitialTabByRole(role) {
  const normalized = String(role || "선수").trim();
  if (normalized === "감독/코치/스탭" || normalized === "학부모") return "ranking";
  return "routine";
}

const ADMIN_EMAILS = ["theyoung37k@gmail.com"];
const ADMIN_STORAGE_KEY = "elbowshot_admin_emails";
const ADMIN_REVIEWED_USERS_KEY = "elbowshot_admin_reviewed_users";

const OFFICIAL_CLAIM_STORAGE_KEY = "elbowshot_official_claim_requests";

const ROUTINE_TEMPLATE_ITEMS = [
  { id: "warmup", label: "워밍업", checked: false },
  { id: "activation", label: "어깨/코어 활성화", checked: false },
  { id: "pre_stretching", label: "훈련 전 스트레칭", checked: false },
  { id: "focus_breathing", label: "호흡/집중 루틴", checked: false },
  { id: "target_check", label: "오늘 목표 점수 확인", checked: false },
];

function makeRoutineDocId(userId, date) {
  return `routine_${userId}_${date}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
}

function normalizeRoutineItems(items) {
  const source = Array.isArray(items) && items.length ? items : ROUTINE_TEMPLATE_ITEMS;
  return source.map((item, idx) => ({
    id: item.id || `routine_item_`,
    label: String(item.label || item.name || "").trim() || `루틴 `,
    checked: Boolean(item.checked),
  }));
}

function resetRoutineItemsForNewInput(items) {
  return normalizeRoutineItems(items).map((item) => ({ ...item, checked: false }));
}

function calculateRoutineStats(items) {
  const normalized = normalizeRoutineItems(items);
  const totalCount = normalized.length;
  const completedCount = normalized.filter((item) => item.checked).length;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;
  return { items: normalized, totalCount, completedCount, completionRate };
}

function getStoredRoutineItemsKey(userId) {
  return `x_session_routine_items_${userId || "guest"}`;
}

function readStoredRoutineItems(userId) {
  try {
    const raw = localStorage.getItem(getStoredRoutineItemsKey(userId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? resetRoutineItemsForNewInput(parsed) : [];
  } catch {
    return [];
  }
}

function writeStoredRoutineItems(userId, items = []) {
  try {
    // 루틴 항목명/순서만 보존하고 체크 상태는 저장하지 않는다.
    // 앱을 다시 켜거나 루틴 입력 화면에 다시 들어오면 항상 미체크 상태에서 시작한다.
    localStorage.setItem(getStoredRoutineItemsKey(userId), JSON.stringify(resetRoutineItemsForNewInput(items)));
  } catch {
    // localStorage unavailable
  }
}

function getStoredRoutineRecordKey(userId, date) {
  return `x_session_saved_routine_${userId || "guest"}_${date || getCurrentLocalDateString()}`;
}

function readStoredRoutineRecord(userId, date = getCurrentLocalDateString()) {
  try {
    const raw = localStorage.getItem(getStoredRoutineRecordKey(userId, date));
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.date !== date) return null;
    const stats = calculateRoutineStats(parsed.items || []);
    return { ...parsed, ...stats };
  } catch {
    return null;
  }
}

function writeStoredRoutineRecord(userId, routine) {
  try {
    if (!userId || !routine?.date) return;
    localStorage.setItem(getStoredRoutineRecordKey(userId, routine.date), JSON.stringify(routine));
  } catch {
    // localStorage unavailable
  }
}

function mergeRoutineItems(baseItems = [], savedItems = []) {
  const savedById = new Map((savedItems || []).map((item) => [item.id, item]));
  const savedByLabel = new Map((savedItems || []).map((item) => [String(item.label || "").trim(), item]));
  return normalizeRoutineItems(baseItems).map((item) => {
    const saved = savedById.get(item.id) || savedByLabel.get(String(item.label || "").trim());
    return saved ? { ...item, checked: Boolean(saved.checked) } : item;
  });
}

function fromFirestoreRoutine(snap) {
  const data = snap.data() || {};
  const stats = calculateRoutineStats(data.items || []);
  return {
    id: snap.id,
    userId: data.userId || "",
    date: data.date || getCurrentLocalDateString(),
    ...stats,
    createdAt: data.createdAt || null,
    updatedAt: data.updatedAt || null,
  };
}

function getRoutineForDate(routines = [], date = getCurrentLocalDateString()) {
  return (routines || []).find((routine) => routine.date === date) || null;
}

function getTodayRoutineRate(routines = []) {
  return getRoutineForDate(routines)?.completionRate || 0;
}

function getRoutineSessionCorrelation(routines = [], sessions = []) {
  const routineByDate = new Map((routines || []).map((routine) => [routine.date, routine]));
  const paired = getCompletedUserSessions(sessions)
    .map((session) => {
      const date = getSessionDayKey(session);
      const routine = routineByDate.get(date);
      if (!routine) return null;
      return {
        date,
        rate: Number(routine.completionRate) || 0,
        score: getSessionScoreForInsight(session),
        session,
        routine,
      };
    })
    .filter(Boolean);

  const high = paired.filter((item) => item.rate >= 80);
  const low = paired.filter((item) => item.rate <= 50);
  const mid = paired.filter((item) => item.rate > 50 && item.rate < 80);

  const average = (items) =>
    items.length ? Math.round(items.reduce((sum, item) => sum + item.score, 0) / items.length) : null;

  const highAverage = average(high);
  const lowAverage = average(low);
  const allAverage = average(paired);
  const delta = highAverage !== null && lowAverage !== null ? highAverage - lowAverage : null;
  const latest = paired.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))[0] || null;

  const routineItemImpact = new Map();
  paired.forEach((item) => {
    (item.routine.items || []).forEach((routineItem) => {
      const key = routineItem.label;
      if (!routineItemImpact.has(key)) {
        routineItemImpact.set(key, { label: key, checkedScores: [], uncheckedScores: [] });
      }
      const bucket = routineItem.checked ? "checkedScores" : "uncheckedScores";
      routineItemImpact.get(key)[bucket].push(item.score);
    });
  });

  const itemInsights = Array.from(routineItemImpact.values())
    .map((entry) => {
      const checkedAverage = average(entry.checkedScores);
      const uncheckedAverage = average(entry.uncheckedScores);
      return {
        label: entry.label,
        checkedCount: entry.checkedScores.length,
        uncheckedCount: entry.uncheckedScores.length,
        checkedAverage,
        uncheckedAverage,
        delta: checkedAverage !== null && uncheckedAverage !== null ? checkedAverage - uncheckedAverage : null,
      };
    })
    .filter((entry) => entry.checkedCount >= 2 && entry.uncheckedCount >= 2 && entry.delta !== null)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 5);

  return {
    paired,
    pairedCount: paired.length,
    highCount: high.length,
    midCount: mid.length,
    lowCount: low.length,
    highAverage,
    lowAverage,
    allAverage,
    delta,
    latest,
    itemInsights,
    ready: paired.length >= 5,
  };
}

function getDynamicMotivation(rate) {
  if (rate >= 100) return "최적 준비 상태. 오늘 기록으로 확인해보자.";
  if (rate >= 80) return "좋은 흐름이다. 이 리듬 유지하자.";
  if (rate >= 60) return "나쁘지 않다. 한두 개만 더 채워보자.";
  if (rate >= 40) return "시작은 했다. 조금만 더 밀어붙이자.";
  return "오늘 한 개라도 체크하고 시작하자.";
}

function getRoutineReadinessMessage(rate) {
  if (rate >= 100) return "최적 준비 상태. 이제 기록으로 오늘의 흐름을 확인해보자.";
  if (rate >= 80) return "상위 준비 상태. 오늘 기록과 연결할 가치가 높다.";
  if (rate >= 50) return "중간 준비 상태. 기록은 남기되 루틴 누락 원인을 확인해라.";
  return "준비 상태가 낮다. 짧은 스트레칭이나 멘탈 루틴부터 채워라.";
}


function normalizeClaimText(value) {
  return String(value || "").replace(/\s+/g, "").trim().toLowerCase();
}

function readOfficialClaimsFromStorage() {
  try {
    const raw = localStorage.getItem(OFFICIAL_CLAIM_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeOfficialClaimsToStorage(claims) {
  try {
    localStorage.setItem(OFFICIAL_CLAIM_STORAGE_KEY, JSON.stringify(claims || []));
  } catch {
    // localStorage unavailable
  }
}

function getOfficialClaimId({ sampleUserId, requesterUid }) {
  return `claim_${sampleUserId}_${requesterUid}`.replace(/[^a-zA-Z0-9가-힣_]/g, "_");
}

function isOfficialProfileMatch(officialUser, requester) {
  if (!officialUser || !requester) return false;
  const sameName = normalizeClaimText(officialUser.name) === normalizeClaimText(requester.name);
  const sameGroup = normalizeClaimText(officialUser.groupName) === normalizeClaimText(requester.groupName);
  const sameGender = String(officialUser.gender || "") === String(requester.gender || "");
  return Boolean(sameName && sameGroup && sameGender);
}

function getApprovedClaimForSample(officialClaims, sampleUserId) {
  return (officialClaims || []).find(
    (claim) => claim.sampleUserId === sampleUserId && claim.status === "approved" && claim.claimedByUid
  );
}

function isUserVerifiedByClaim(officialClaims, uid) {
  return (officialClaims || []).some(
    (claim) => claim.requesterUid === uid && claim.status === "approved"
  );
}

function isPermissionError(error) {
  const raw = String(error?.message || "");
  const code = String(error?.code || "");
  return code.includes("permission-denied") || raw.includes("Missing or insufficient permissions") || raw.includes("permission");
}

function getFriendlySaveErrorMessage(error, fallback = "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.") {
  if (!isPermissionError(error)) return error?.message || fallback;
  return "저장 조건을 확인해 주세요. 거리 랭킹은 최소 1개 거리 점수를 입력하면 저장됩니다. 종합 랭킹은 부문별 필수 4거리 기록이 모두 있어야 표시됩니다. 조건을 충족했는데도 계속 뜨면 관리자에게 저장 권한 설정 확인을 요청해 주세요.";
}

function getFriendlyDataErrorMessage(error, fallback = "데이터를 불러오지 못했습니다.") {
  if (isPermissionError(error)) return "";
  return error?.message || fallback;
}

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
function getStoredReviewedUserIds() {
  try {
    const raw = localStorage.getItem(ADMIN_REVIEWED_USERS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map((item) => String(item || "")).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function writeStoredReviewedUserIds(ids = []) {
  try {
    localStorage.setItem(ADMIN_REVIEWED_USERS_KEY, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // ignore
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
  if (division === "초등부(저학년)") return "초등부(저학년)";
  if (division === "초등부(고학년)") return "초등부(고학년)";
  if (division === "초등부(통합)") return "초등부(통합)";
  if (division === "중등부") return "중등부";

  const d = String(division || "").trim();
  const g = String(gender || "남").trim();
  if (/^초등[1-4]$/.test(d)) return "초등부(저학년)";
  if (/^초등[5-6]$/.test(d)) return "초등부(고학년)";
  if (/^중등[1-3]$/.test(d)) return "중등부";
  if (d === "고등부") return g === "여" ? "고등부(여)" : "고등부(남)";
  if (/^고등[1-3]$/.test(d)) return g === "여" ? "고등부(여)" : "고등부(남)";
  if (d === "대학부" || d === "일반부") return g === "여" ? "대학/일반부(여)" : "대학/일반부(남)";
  return "";
}

function rankingGroupMatchesFilter(selectedGroup, actualGroup) {
  if (!selectedGroup || selectedGroup === "all") return true;
  if (selectedGroup === "초등부(통합)") {
    return actualGroup === "초등부(통합)" || actualGroup === "초등부(저학년)" || actualGroup === "초등부(고학년)";
  }
  if (selectedGroup === "고등부") {
    return actualGroup === "고등부(남)" || actualGroup === "고등부(여)";
  }
  if (selectedGroup === "대학/일반부") {
    return actualGroup === "대학/일반부(남)" || actualGroup === "대학/일반부(여)";
  }
  return actualGroup === selectedGroup;
}

function schoolFilterMatches(selectedGroupName, actualGroupName) {
  if (!selectedGroupName || selectedGroupName === "all") return true;
  const selected = String(selectedGroupName).trim();
  if (!selected) return true;
  const actual = String(actualGroupName || "").trim();
  return actual === selected;
}


function getRequiredDistancesForRankingGroup(rankingGroup) {
  return RANKING_GROUP_DISTANCE_RULES[rankingGroup] || [];
}

function normalizeSessionShape(session, profile = null) {
  const safe = session || {};
  const arrowsPerEnd = safe.arrowsPerEnd || 6;
  const defaultEndCount = safe.mode === "set" ? 1 : (safe.totalEnds || 6);
  const ends = Array.isArray(safe.ends) && safe.ends.length
    ? safe.ends.map((end, idx) => ({
        id: end.id || uid("end"),
        index: idx + 1,
        arrows: Array.from({ length: arrowsPerEnd }, (_, i) => end.arrows?.[i] ?? null),
        opponentTotal: end.opponentTotal || 0,
        opponentScoreEntered: Boolean(end.opponentScoreEntered),
      }))
    : Array.from({ length: defaultEndCount }, (_, i) => createEmptyEnd(i + 1, arrowsPerEnd));

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
    distance: Number(safe.distance) || 30,
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
  gender = "남",
  regionCity = "경기도",
  bowType = "리커브",
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
    gender,
    regionCity,
    bowType,
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


const OFFICIAL_RESULT_SOURCES = [
  {
    id: "official_recurve_2026_03_22_elem_girls_lower_source",
    date: "2026-03-22",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(저학년)",
    sourceType: "photo_board_and_structured_rows",
    status: "source_registered",
    notes: "여자초등 U-11 2026-03-22 경기결과 사진 기반 원본 등록",
  },
  {
    id: "official_recurve_2026_04_12_elem_boys_lower_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(저학년)",
    sourceType: "photo_board",
    status: "source_registered",
    notes: "남자초등 U-11 경기결과 사진 기반 원본 등록",
  },
  {
    id: "official_recurve_2026_04_12_elem_boys_upper_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "photo_board",
    status: "source_registered",
    notes: "남자초등부 경기결과 사진 기반 원본 등록",
  },
  {
    id: "official_recurve_2026_04_12_elem_girls_lower_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(저학년)",
    sourceType: "photo_board_and_structured_rows",
    status: "source_registered",
    notes: "여자초등 U-11 경기결과 사진 원본 추가 반영 + 기존 앱 샘플 데이터(2026-04-12 초등4)와 함께 정리",
  },
  {
    id: "official_recurve_2026_04_12_elem_girls_upper_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "photo_board",
    status: "source_registered",
    notes: "여자초등부 경기결과 사진 기반 원본 등록",
  },
  {
    id: "official_recurve_2026_04_12_middle_boys_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "photo_board",
    status: "source_registered",
    notes: "남자중등부 경기결과 사진 기반 원본 등록",
  },
  {
    id: "official_recurve_2026_04_12_middle_girls_source",
    date: "2026-04-12",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "photo_board",
    status: "source_registered",
    notes: "여자중등부 경기결과 사진 기반 원본 등록",
  },

,
  // 추가기록.xlsx 기반 공식 결과 소스
  {
    id: "official_additional_2025_03_23_경기도_중등부_남",
    date: "2025-03-23",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_03_23_경기도_중등부_여",
    date: "2025-03-23",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_03_23_경기도_초등부_통합__남",
    date: "2025-03-23",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_03_23_경기도_초등부_통합__여",
    date: "2025-03-23",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_04_13_경기도_중등부_남",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_04_13_경기도_중등부_여",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_04_13_경기도_초등부_통합__남",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_04_13_경기도_초등부_통합__여",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_05_27_부산광역시_중등부_남",
    date: "2025-05-27",
    bowType: "리커브",
    region: "부산광역시",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 부산광역시 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_05_27_경기도_중등부_여",
    date: "2025-05-27",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_05_27_대구광역시_초등부_통합__남",
    date: "2025-05-27",
    bowType: "리커브",
    region: "대구광역시",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 대구광역시 · 남 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_05_27_충청북도_초등부_통합__남",
    date: "2025-05-27",
    bowType: "리커브",
    region: "충청북도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 충청북도 · 남 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_06_15_경기도_중등부_남",
    date: "2025-06-15",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_06_15_경기도_중등부_여",
    date: "2025-06-15",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_06_15_경기도_초등부_통합__남",
    date: "2025-06-15",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_06_15_경기도_초등부_통합__여",
    date: "2025-06-15",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 초등부(통합)",
  },
  {
    id: "official_additional_2025_07_21_경기도_중등부_남",
    date: "2025-07-21",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_인천광역시_중등부_남",
    date: "2025-07-21",
    bowType: "리커브",
    region: "인천광역시",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 인천광역시 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_충청북도_중등부_남",
    date: "2025-07-21",
    bowType: "리커브",
    region: "충청북도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 충청북도 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_경기도_중등부_여",
    date: "2025-07-21",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경기도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_경상북도_중등부_여",
    date: "2025-07-21",
    bowType: "리커브",
    region: "경상북도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 경상북도 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_광주광역시_중등부_여",
    date: "2025-07-21",
    bowType: "리커브",
    region: "광주광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 광주광역시 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_대전광역시_중등부_여",
    date: "2025-07-21",
    bowType: "리커브",
    region: "대전광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 대전광역시 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_07_21_인천광역시_중등부_여",
    date: "2025-07-21",
    bowType: "리커브",
    region: "인천광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 인천광역시 · 여 · 중등부",
  },
  {
    id: "official_additional_2025_09_28_광주광역시_중등부_남",
    date: "2025-09-28",
    bowType: "리커브",
    region: "광주광역시",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 광주광역시 · 남 · 중등부",
  },
  {
    id: "official_additional_2025_09_28_광주광역시_중등부_여",
    date: "2025-09-28",
    bowType: "리커브",
    region: "광주광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "xlsx_structured_rows",
    status: "source_registered",
    notes: "추가기록.xlsx 기반 공식 기록 추가 등록 · 광주광역시 · 여 · 중등부",
  }

,
  // 추가_선수_찾음.xlsx 점수 확인 후보 공식 결과 소스
  {
    id: "official_found_candidates_2025_04_13_경기도_초등부_통합__남_1",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 강민국·한세빈, 교육감배 양궁 남녀 초등부 4관왕 ‘명중’",
  },
  {
    id: "official_found_candidates_2025_04_13_경기도_초등부_통합__여_2",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 강민국·한세빈, 교육감배 양궁 남녀 초등부 4관왕 ‘명중’",
  },
  {
    id: "official_found_candidates_2025_04_13_경기도_중등부_남_3",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 강민국·한세빈, 교육감배 양궁 남녀 초등부 4관왕 ‘명중’",
  },
  {
    id: "official_found_candidates_2025_04_13_경기도_중등부_여_4",
    date: "2025-04-13",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 강민국·한세빈, 교육감배 양궁 남녀 초등부 4관왕 ‘명중’",
  },
  {
    id: "official_found_candidates_2025_07_23_경기도_중등부_여_5",
    date: "2025-07-23",
    bowType: "리커브",
    region: "경기도",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_인천광역시_중등부_여_6",
    date: "2025-07-23",
    bowType: "리커브",
    region: "인천광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_부산광역시_중등부_여_7",
    date: "2025-07-23",
    bowType: "리커브",
    region: "부산광역시",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_인천광역시_중등부_남_8",
    date: "2025-07-23",
    bowType: "리커브",
    region: "인천광역시",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_경기도_중등부_남_9",
    date: "2025-07-23",
    bowType: "리커브",
    region: "경기도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_충청북도_중등부_남_10",
    date: "2025-07-23",
    bowType: "리커브",
    region: "충청북도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  },
  {
    id: "official_found_candidates_2025_07_23_부산광역시_중등부_남_11",
    date: "2025-07-23",
    bowType: "리커브",
    region: "부산광역시",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_candidate_rows",
    status: "source_registered",
    notes: "추가_선수_찾음.xlsx 기반 점수 확인 후보 반영 · 김은찬·김아현, 문체부장관기양궁 여중부 2·3관왕",
  }

,
  // 2026 비경기권 공식기록 추가 - 주영진
  {
    id: "official_2026_non_gyeonggi_juyeongjin",
    date: "2026-04-04",
    bowType: "리커브",
    region: "충청북도",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "web_confirmed_official_record",
    status: "source_registered",
    notes: "2026 충북 공식기록 · 주영진 · 옥천 이원중 · 60m 346점 / 40m 345점",
  }

,
  // 2025 PDF 공식 결과 소스
  {
    id: "official_pdf_2025_001",
    date: "2025-05-02",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "대학/일반부(남)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제59회전국남여양궁종별선수권대회 · < 남자리커브일반부개인> · AR0012025AR001AR05M01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_002",
    date: "2025-05-02",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "대학/일반부(여)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제59회전국남여양궁종별선수권대회 · < 여자리커브일반부개인> · AR0012025AR001AR05W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_003",
    date: "2025-06-23",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제36회전국남.여초등학교양궁대회 · < 여자리커브초등부U-10(1~4학년) 개인> · AR0022025AR001AR01W010Q (1).pdf",
  },
  {
    id: "official_pdf_2025_004",
    date: "2025-05-27",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제54회전국소년체육대회(15세이하부) · < 남자리커브중학부개인> · AR0032025AR001AR02M01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_005",
    date: "2025-05-27",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "중등부",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제54회전국소년체육대회(15세이하부) · < 여자리커브중학부개인> · AR0032025AR001AR02W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_006",
    date: "2025-06-29",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "대학/일반부(여)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제43회대통령기전국남여양궁대회 · < 여자리커브일반부개인> · AR0042025AR001AR05W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_007",
    date: "2025-07-12",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "고등부(여)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "화랑기제46회전국시도대항양궁대회 · < 여자리커브고등부개인> · AR0052025AR001AR03W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_008",
    date: "2025-08-24",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제37회회장기전국남여초등학교양궁대회 · < 남자리커브초등부U-10(1~4학년) 개인> · AR0062025AR001AR01M010Q (1).pdf",
  },
  {
    id: "official_pdf_2025_009",
    date: "2025-07-27",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "고등부(남)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제52회한국중고양궁연맹회장기대회 · < 남자리커브고등부개인> · AR0272025AR001AR03M01Q (2).pdf",
  },
  {
    id: "official_pdf_2025_010",
    date: "2025-07-18",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "대학/일반부(남)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제28회한국대학연맹회장기대회 · < 남자리커브대학부개인> · AR0282025AR001AR04M01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_011",
    date: "2025-07-18",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "대학/일반부(여)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제28회한국대학연맹회장기대회 · < 여자리커브대학부개인> · AR0282025AR001AR04W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_012",
    date: "2025-06-14",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "대학/일반부(여)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제36회한국실업양궁연맹회장기양궁대회 · < 여자리커브일반부개인> · AR0292025AR001AR05W01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_013",
    date: "2025-09-27",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "중등부",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제22회경상북도지사기전국남여초.중양궁대회 · < 남자리커브중학부개인> · AR0502025AR001AR02M01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_014",
    date: "2025-05-27",
    bowType: "리커브",
    region: "전국",
    gender: "남",
    rankingGroup: "초등부(통합)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제54회전국소년체육대회(12세이하부) · < 남자리커브초등부개인> · AR0672025AR001AR01M01Q (1).pdf",
  },
  {
    id: "official_pdf_2025_015",
    date: "2025-05-27",
    bowType: "리커브",
    region: "전국",
    gender: "여",
    rankingGroup: "초등부(통합)",
    sourceType: "pdf_official_extracted",
    status: "source_registered",
    notes: "제54회전국소년체육대회(12세이하부) · < 여자리커브초등부개인> · AR0672025AR001AR01W01Q (1).pdf",
  }
];

// 데이터화된 공식기록 원본. 개인 기록으로 자동 주입하지 않고 공식기록으로만 사용한다.
// 공식기록은 원본 표에 있는 사실만 보관한다. 2026-04-12 표는 선수 전원 점수까지 반영한다. U-11은 저학년, 일반 초등부 표는 통합으로 기록한다.
const SAMPLE_SHEETS = [
{
    id: "sheet_2025_overall_championship_male_recurve_integrated_70m",
    date: "2025-09-17",
    division: "일반부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제57회 전국남여양궁종합선수권대회 남자 리커브 통합 개인",
    distances: [70, 70],
    rows: [
      { name: "김우진", school: "청주시청", rounds: [355, 354], total: 709 },
      { name: "구대한", school: "청주시청", rounds: [349, 348], total: 697 },
      { name: "구본찬", school: "현대제철", rounds: [349, 347], total: 696 },
      { name: "김제덕", school: "예천군청", rounds: [348, 344], total: 692 },
      { name: "장준하", school: "계명대학교", division: "대학부", rounds: [347, 345], total: 692 },
      { name: "이승신", school: "서울시청", rounds: [349, 342], total: 691 },
      { name: "정태영", school: "코오롱엑스텐보이즈", rounds: [345, 346], total: 691 },
      { name: "남유빈", school: "현대제철", rounds: [345, 345], total: 690 },
      { name: "허재우", school: "현대제철", rounds: [346, 344], total: 690 },
      { name: "김예찬", school: "경희대학교", division: "대학부", rounds: [345, 345], total: 690 },
      { name: "이우석", school: "코오롱엑스텐보이즈", rounds: [347, 343], total: 690 },
      { name: "최재환", school: "대전시체육회", rounds: [346, 344], total: 690 },
      { name: "김동훈", school: "국립경국대학교", division: "대학부", rounds: [346, 342], total: 688 },
      { name: "이승욱", school: "청주시청", rounds: [346, 342], total: 688 },
      { name: "최건태", school: "코오롱엑스텐보이즈", rounds: [342, 345], total: 687 },
      { name: "한우탁", school: "인천계양구청", rounds: [347, 340], total: 687 },
      { name: "문균호", school: "울산남구청", rounds: [342, 345], total: 687 },
      { name: "이우주", school: "공주시청", rounds: [345, 341], total: 686 },
      { name: "서민기", school: "국군체육부대", rounds: [346, 340], total: 686 },
      { name: "이선재", school: "울산남구청", rounds: [343, 343], total: 686 },
      { name: "김종우", school: "한국체육대학교", division: "대학부", rounds: [343, 342], total: 685 },
      { name: "송인준", school: "국군체육부대", rounds: [346, 339], total: 685 },
      { name: "황석민", school: "울산남구청", rounds: [340, 344], total: 684 },
      { name: "최철준", school: "강원체육고등학교", division: "대학부", rounds: [341, 342], total: 683 },
      { name: "김종호", school: "인천계양구청", rounds: [348, 334], total: 682 },
      { name: "조윤혁", school: "국립경국대학교", division: "대학부", rounds: [343, 339], total: 682 },
      { name: "김선우", school: "코오롱엑스텐보이즈", rounds: [339, 343], total: 682 },
      { name: "곽동훈", school: "대전시체육회", rounds: [339, 342], total: 681 },
      { name: "김민재", school: "계명대학교", division: "대학부", rounds: [345, 336], total: 681 },
      { name: "정세윤", school: "인천대학교", division: "대학부", rounds: [335, 346], total: 681 },
      { name: "민성욱", school: "한국체육대학교", division: "대학부", rounds: [344, 337], total: 681 },
      { name: "지예찬", school: "한국체육대학교", division: "대학부", rounds: [342, 338], total: 680 },
      { name: "김예찬", school: "코오롱엑스텐보이즈", rounds: [338, 342], total: 680 },
      { name: "김태민", school: "공주시청", rounds: [344, 335], total: 679 },
      { name: "김기범", school: "계명대학교", division: "대학부", rounds: [342, 336], total: 678 },
      { name: "박선우", school: "서울시청", rounds: [341, 337], total: 678 },
      { name: "이효범", school: "경희대학교", division: "대학부", rounds: [339, 339], total: 678 },
      { name: "최현택", school: "국군체육부대", rounds: [342, 336], total: 678 },
      { name: "김하준", school: "사상구청", rounds: [339, 338], total: 677 },
      { name: "이한샘", school: "청주시청", rounds: [335, 340], total: 675 },
      { name: "장채환", school: "사상구청", rounds: [340, 335], total: 675 },
      { name: "박민범", school: "대구중구청", rounds: [337, 338], total: 675 },
      { name: "최두희", school: "경희대학교", division: "대학부", rounds: [336, 338], total: 674 },
      { name: "이승윤", school: "광주광역시남구청", rounds: [334, 340], total: 674 },
      { name: "김규정", school: "전북체육회", rounds: [339, 335], total: 674 },
      { name: "박재형", school: "경희대학교", division: "대학부", rounds: [334, 340], total: 674 },
      { name: "서준혁", school: "서울시청", rounds: [341, 332], total: 673 },
      { name: "김법민", school: "대전시체육회", rounds: [338, 335], total: 673 },
      { name: "김태현", school: "효원고등학교", division: "고등2", rounds: [337, 335], total: 672 },
      { name: "박주영", school: "서울시청", rounds: [331, 340], total: 671 },
      { name: "고태경", school: "공주시청", rounds: [339, 331], total: 670 },
      { name: "한종혁", school: "인천계양구청", rounds: [338, 331], total: 669 },
      { name: "이용빈", school: "전북체육회", rounds: [337, 332], total: 669 },
      { name: "원종혁", school: "청주시청", rounds: [336, 333], total: 669 },
      { name: "이동민", school: "광주광역시남구청", rounds: [329, 338], total: 667 },
      { name: "용혁중", school: "대구중구청", rounds: [338, 329], total: 667 },
      { name: "김강현", school: "인천계양구청", rounds: [340, 327], total: 667 },
      { name: "이지호", school: "경북일고등학교", division: "고등2", rounds: [333, 333], total: 666 },
      { name: "한재엽", school: "현대제철", rounds: [337, 329], total: 666 },
      { name: "김택중", school: "한국체육대학교", division: "대학부", rounds: [336, 330], total: 666 },
      { name: "김정훈", school: "국군체육부대", rounds: [336, 330], total: 666 },
      { name: "장지호", school: "예천군청", rounds: [335, 331], total: 666 },
      { name: "구범준", school: "한국체육대학교", division: "대학부", rounds: [333, 332], total: 665 },
      { name: "여대호", school: "전북체육회", rounds: [334, 331], total: 665 },
      { name: "박규석", school: "두산에너빌리티", rounds: [335, 329], total: 664 },
      { name: "신재훈", school: "코오롱엑스텐보이즈", rounds: [326, 338], total: 664 },
      { name: "김동현", school: "경희대학교", division: "대학부", rounds: [337, 327], total: 664 },
      { name: "손지원", school: "예천군청", rounds: [341, 323], total: 664 },
      { name: "강민재", school: "서원대학교", division: "대학부", rounds: [338, 324], total: 662 },
      { name: "박성호", school: "대구중구청", rounds: [329, 330], total: 659 },
      { name: "강현빈", school: "인천대학교", division: "대학부", rounds: [339, 319], total: 658 },
      { name: "이은재", school: "한국체육대학교", division: "대학부", rounds: [329, 329], total: 658 },
      { name: "강민승", school: "계명대학교", division: "대학부", rounds: [333, 321], total: 654 },
      { name: "김건우", school: "전북체육회", rounds: [329, 325], total: 654 },
      { name: "고성훈", school: "서원대학교", division: "대학부", rounds: [325, 329], total: 654 },
      { name: "이찬주", school: "한국체육대학교", division: "대학부", rounds: [337, 316], total: 653 },
      { name: "강우석", school: "국립경국대학교", division: "대학부", rounds: [322, 324], total: 646 },
      { name: "정시우", school: "성포중학교", division: "고등1", rounds: [318, 318], total: 636 },
      { name: "김필중", school: "현대제철", rounds: [323, 312], total: 635 },
    ],
  },
{
    id: "sheet_2025_national_sports_festival_general_female_recurve",
    date: "2025-10-22",
    division: "일반부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제106회 전국체육대회 여자 리커브 일반부 개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "조아름", school: "현대백화점", rounds: [340, 354, 333, 355], total: 1382 },
      { name: "정다소미", school: "현대백화점", rounds: [340, 348, 337, 352], total: 1377 },
      { name: "방현주", school: "현대모비스", rounds: [336, 347, 337, 356], total: 1376 },
      { name: "신정화", school: "전북도청", rounds: [337, 346, 335, 357], total: 1375 },
      { name: "김수린", school: "광주광역시청", rounds: [334, 348, 337, 354], total: 1373 },
      { name: "임하나", school: "LH", rounds: [338, 345, 339, 351], total: 1373 },
      { name: "전훈영", school: "인천광역시청", rounds: [341, 346, 329, 355], total: 1371 },
      { name: "박소민", school: "LH", rounds: [341, 351, 321, 356], total: 1369 },
      { name: "김예후", school: "전북도청", rounds: [336, 343, 333, 356], total: 1368 },
      { name: "이윤지", school: "현대모비스", rounds: [332, 341, 340, 354], total: 1367 },
      { name: "홍수남", school: "인천광역시청", rounds: [335, 345, 334, 353], total: 1367 },
      { name: "곽예지", school: "대전시체육회", rounds: [332, 345, 337, 353], total: 1367 },
      { name: "최미선", school: "광주은행텐텐양궁단", rounds: [335, 342, 339, 351], total: 1367 },
      { name: "이가현", school: "대전시체육회", rounds: [339, 338, 336, 353], total: 1366 },
      { name: "한솔", school: "홍성군청", rounds: [331, 339, 339, 356], total: 1365 },
      { name: "이은경", school: "순천시청", rounds: [330, 348, 329, 357], total: 1364 },
      { name: "최예지", school: "대구서구청", rounds: [334, 338, 335, 356], total: 1363 },
      { name: "조수빈", school: "예천군청", rounds: [339, 347, 329, 348], total: 1363 },
      { name: "유수정", school: "현대백화점", rounds: [330, 349, 331, 351], total: 1361 },
      { name: "손서빈", school: "여주시청", rounds: [329, 338, 337, 356], total: 1360 },
      { name: "유시현", school: "순천시청", rounds: [334, 341, 331, 354], total: 1360 },
      { name: "이나영", school: "창원시청", rounds: [333, 346, 329, 352], total: 1360 },
      { name: "박세은", school: "부산도시공사", rounds: [331, 340, 336, 351], total: 1358 },
      { name: "박은서", school: "부산도시공사", rounds: [335, 345, 330, 347], total: 1357 },
      { name: "김아영", school: "전북도청", rounds: [327, 341, 336, 353], total: 1357 },
      { name: "김세연", school: "홍성군청", rounds: [341, 345, 324, 347], total: 1357 },
      { name: "이은아", school: "홍성군청", rounds: [331, 346, 330, 350], total: 1357 },
      { name: "신서빈", school: "대전시체육회", rounds: [333, 346, 328, 350], total: 1357 },
      { name: "김소희", school: "청주시청", rounds: [329, 347, 327, 353], total: 1356 },
      { name: "우경림", school: "창원시청", rounds: [329, 342, 332, 352], total: 1355 },
      { name: "김이안", school: "현대백화점", rounds: [330, 344, 332, 349], total: 1355 },
      { name: "박수빈", school: "청주시청", rounds: [330, 340, 332, 353], total: 1355 },
      { name: "남수현", school: "순천시청", rounds: [335, 347, 330, 343], total: 1355 },
      { name: "주혜빈", school: "대구서구청", rounds: [330, 341, 334, 349], total: 1354 },
      { name: "박나원", school: "하이트진로", rounds: [333, 343, 326, 349], total: 1351 },
      { name: "이가영", school: "광주광역시청", rounds: [339, 340, 324, 348], total: 1351 },
      { name: "김예림", school: "여주시청", rounds: [318, 345, 333, 354], total: 1350 },
      { name: "심예지", school: "청주시청", rounds: [329, 339, 332, 349], total: 1349 },
      { name: "김아현", school: "여주시청", rounds: [330, 339, 332, 347], total: 1348 },
      { name: "손예령", school: "부산도시공사", rounds: [335, 340, 324, 347], total: 1346 },
      { name: "강고은", school: "예천군청", rounds: [323, 341, 327, 351], total: 1342 },
      { name: "임해진", school: "대전시체육회", rounds: [324, 344, 322, 351], total: 1341 },
      { name: "최모경", school: "하이트진로", rounds: [325, 338, 329, 348], total: 1340 },
      { name: "박소영", school: "여주시청", rounds: [324, 335, 328, 352], total: 1339 },
      { name: "전완서", school: "광주광역시청", rounds: [325, 337, 330, 346], total: 1338 },
      { name: "정지서", school: "현대모비스", rounds: [328, 335, 327, 347], total: 1337 },
      { name: "임두나", school: "LH", rounds: [326, 334, 327, 349], total: 1336 },
      { name: "장민희", school: "인천광역시청", rounds: [326, 329, 330, 350], total: 1335 },
      { name: "임정민", school: "대구서구청", rounds: [317, 335, 330, 353], total: 1335 },
      { name: "이세현", school: "창원시청", rounds: [331, 325, 328, 346], total: 1330 },
      { name: "심다정", school: "예천군청", rounds: [323, 334, 321, 348], total: 1326 },
      { name: "전인아", school: "전북도청", rounds: [307, 333, 330, 354], total: 1324 },
      { name: "이다빈", school: "하이트진로", rounds: [321, 337, 315, 348], total: 1321 },
      { name: "김서영", school: "인천광역시청", rounds: [320, 338, 315, 348], total: 1321 },
      { name: "이혜민", school: "예천군청", rounds: [320, 341, 308, 351], total: 1320 },
      { name: "안희연", school: "청주시청", rounds: [313, 331, 325, 349], total: 1318 },
      { name: "박재희", school: "홍성군청", rounds: [315, 333, 303, 339], total: 1290 },
      { name: "황재민", school: "창원시청", rounds: [1, 0, 0, 0], total: 1 },
    ],
  },
{
    id: "sheet_2025_national_sports_festival_general_male_recurve",
    date: "2025-10-22",
    division: "일반부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제106회 전국체육대회 남자 리커브 일반부 개인",
    distances: [90, 70, 50, 30],
    rows: [
      { name: "김제덕", school: "예천군청", rounds: [331, 343, 350, 359], total: 1383 },
      { name: "김우진", school: "청주시청", rounds: [321, 344, 344, 360], total: 1369 },
      { name: "한종혁", school: "인천계양구청", rounds: [325, 341, 342, 357], total: 1365 },
      { name: "이우석", school: "코오롱엑스텐보이즈", rounds: [334, 338, 337, 355], total: 1364 },
      { name: "김종호", school: "인천계양구청", rounds: [326, 336, 342, 356], total: 1360 },
      { name: "황석민", school: "울산남구청", rounds: [323, 337, 343, 355], total: 1358 },
      { name: "구본찬", school: "현대제철", rounds: [325, 336, 338, 358], total: 1357 },
      { name: "박선우", school: "서울시청", rounds: [329, 337, 338, 352], total: 1356 },
      { name: "서민기", school: "국군체육부대", rounds: [320, 333, 342, 360], total: 1355 },
      { name: "이한샘", school: "청주시청", rounds: [318, 337, 346, 353], total: 1354 },
      { name: "이승신", school: "서울시청", rounds: [324, 334, 337, 357], total: 1352 },
      { name: "김하준", school: "사상구청", rounds: [317, 340, 340, 354], total: 1351 },
      { name: "김선우", school: "코오롱엑스텐보이즈", rounds: [317, 334, 341, 358], total: 1350 },
      { name: "문균호", school: "울산남구청", rounds: [324, 332, 338, 356], total: 1350 },
      { name: "원종혁", school: "청주시청", rounds: [325, 336, 337, 352], total: 1350 },
      { name: "김민범", school: "울산남구청", rounds: [308, 337, 343, 359], total: 1347 },
      { name: "남유빈", school: "현대제철", rounds: [319, 337, 338, 353], total: 1347 },
      { name: "정태영", school: "코오롱엑스텐보이즈", rounds: [325, 330, 341, 350], total: 1346 },
      { name: "서준혁", school: "서울시청", rounds: [320, 335, 337, 354], total: 1346 },
      { name: "이용빈", school: "전북체육회", rounds: [322, 327, 338, 358], total: 1345 },
      { name: "김법민", school: "대전시체육회", rounds: [314, 334, 340, 357], total: 1345 },
      { name: "장채환", school: "사상구청", rounds: [317, 334, 343, 350], total: 1344 },
      { name: "장지호", school: "예천군청", rounds: [317, 335, 334, 358], total: 1344 },
      { name: "김태민", school: "공주시청", rounds: [325, 330, 334, 355], total: 1344 },
      { name: "박주영", school: "서울시청", rounds: [310, 339, 338, 356], total: 1343 },
      { name: "이동영", school: "예천군청", rounds: [320, 339, 333, 351], total: 1343 },
      { name: "김예찬", school: "코오롱엑스텐보이즈", rounds: [319, 328, 338, 358], total: 1343 },
      { name: "한우탁", school: "인천계양구청", rounds: [325, 330, 333, 354], total: 1342 },
      { name: "구대한", school: "청주시청", rounds: [318, 330, 339, 355], total: 1342 },
      { name: "진재왕", school: "두산에너빌리티", rounds: [317, 333, 335, 355], total: 1340 },
      { name: "허재우", school: "현대제철", rounds: [323, 327, 335, 355], total: 1340 },
      { name: "박민범", school: "대구중구청", rounds: [319, 332, 335, 353], total: 1339 },
      { name: "이우주", school: "공주시청", rounds: [321, 331, 336, 348], total: 1336 },
      { name: "최재환", school: "대전시체육회", rounds: [315, 332, 333, 356], total: 1336 },
      { name: "고태경", school: "공주시청", rounds: [312, 338, 330, 354], total: 1334 },
      { name: "이선재", school: "울산남구청", rounds: [304, 335, 340, 354], total: 1333 },
      { name: "여대호", school: "전북체육회", rounds: [314, 332, 336, 351], total: 1333 },
      { name: "이진용", school: "광주광역시남구청", rounds: [311, 330, 335, 356], total: 1332 },
      { name: "송인준", school: "국군체육부대", rounds: [312, 334, 334, 352], total: 1332 },
      { name: "이승일", school: "사상구청", rounds: [307, 331, 336, 356], total: 1330 },
      { name: "박규석", school: "두산에너빌리티", rounds: [312, 325, 336, 356], total: 1329 },
      { name: "한재엽", school: "현대제철", rounds: [310, 334, 330, 354], total: 1328 },
      { name: "곽동훈", school: "대전시체육회", rounds: [300, 331, 339, 356], total: 1326 },
      { name: "이승윤", school: "광주광역시남구청", rounds: [309, 327, 331, 356], total: 1323 },
      { name: "손지원", school: "예천군청", rounds: [312, 330, 333, 347], total: 1322 },
      { name: "이동민", school: "광주광역시남구청", rounds: [301, 328, 335, 354], total: 1318 },
      { name: "김강현", school: "인천계양구청", rounds: [313, 324, 330, 350], total: 1317 },
      { name: "김건우", school: "전북체육회", rounds: [305, 326, 330, 353], total: 1314 },
      { name: "이원주", school: "광주광역시남구청", rounds: [315, 321, 324, 348], total: 1308 },
      { name: "김규정", school: "전북체육회", rounds: [300, 331, 329, 346], total: 1306 },
      { name: "박성호", school: "대구중구청", rounds: [301, 323, 331, 347], total: 1302 },
      { name: "용혁중", school: "대구중구청", rounds: [305, 331, 310, 347], total: 1293 },
      { name: "서승범", school: "공주시청", rounds: [286, 320, 311, 343], total: 1260 },
    ],
  },
{
    id: "sheet_2026_03_22",
    date: "2026-03-22",
    division: "초등부(저학년)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
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
    division: "초등부(저학년)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
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
{
    id: "sheet_2026_04_12_elem_boys_lower_validation",
    date: "2026-04-12",
    division: "초등부(저학년)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 남자초등 U-11",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "김영재", school: "연무초등학교", rounds: [337, 342, 342, 351], total: 1372 },
      { name: "유선유", school: "연무초등학교", rounds: [313, 324, 337, 345], total: 1319 },
      { name: "박찬영", school: "원미초등학교", rounds: [276, 310, 291, 302], total: 1179 },
      { name: "박도현", school: "성포초등학교", rounds: [269, 291, 284, 329], total: 1173 },
      { name: "장다준", school: "하성초등학교", rounds: [261, 231, 288, 314], total: 1094 },
      { name: "최우빈", school: "천현초등학교", rounds: [239, 253, 294, 300], total: 1086 },
      { name: "구교준", school: "천현초등학교", rounds: [179, 222, 266, 314], total: 981 },
      { name: "오태준", school: "성포초등학교", rounds: [56, 0, 196, 282], total: 534 },
    ],
  },
{
    id: "sheet_2026_04_12_elem_boys_upper_validation",
    date: "2026-04-12",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 남자초등 고학년",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "장은혁", school: "연무초등학교", rounds: [333, 349, 344, 357], total: 1383 },
      { name: "김영재", school: "연무초등학교", rounds: [337, 342, 342, 351], total: 1372 },
      { name: "최광빈", school: "천현초등학교", rounds: [339, 331, 345, 354], total: 1369 },
      { name: "백종준", school: "천현초등학교", rounds: [328, 329, 343, 353], total: 1353 },
      { name: "최수혁", school: "성포초등학교", rounds: [326, 342, 337, 347], total: 1352 },
      { name: "이우현", school: "하성초등학교", rounds: [320, 338, 341, 343], total: 1342 },
      { name: "정선우", school: "연무초등학교", rounds: [322, 330, 344, 345], total: 1341 },
      { name: "김준서", school: "성포초등학교", rounds: [335, 318, 336, 340], total: 1329 },
      { name: "임태서", school: "연무초등학교", rounds: [307, 315, 347, 353], total: 1322 },
      { name: "유선유", school: "연무초등학교", rounds: [313, 324, 337, 345], total: 1319 },
      { name: "배재윤", school: "성포초등학교", rounds: [316, 322, 334, 345], total: 1317 },
      { name: "김영민", school: "연무초등학교", rounds: [305, 319, 334, 339], total: 1297 },
      { name: "김태원", school: "수진초등학교", rounds: [286, 312, 323, 322], total: 1243 },
      { name: "진준호", school: "천현초등학교", rounds: [279, 310, 305, 319], total: 1213 },
      { name: "방도율", school: "당정초등학교", rounds: [286, 282, 312, 314], total: 1194 },
      { name: "김민준", school: "원미초등학교", rounds: [291, 264, 310, 326], total: 1191 },
      { name: "박찬영", school: "원미초등학교", rounds: [276, 310, 291, 302], total: 1179 },
      { name: "박도현", school: "성포초등학교", rounds: [269, 291, 284, 329], total: 1173 },
      { name: "김선율", school: "당정초등학교", rounds: [240, 268, 299, 307], total: 1114 },
      { name: "권순용", school: "연무초등학교", rounds: [254, 271, 281, 304], total: 1110 },
      { name: "장다준", school: "하성초등학교", rounds: [261, 231, 288, 314], total: 1094 },
      { name: "최우빈", school: "천현초등학교", rounds: [239, 253, 294, 300], total: 1086 },
      { name: "구교준", school: "천현초등학교", rounds: [179, 222, 266, 314], total: 981 },
      { name: "오태준", school: "성포초등학교", rounds: [56, 0, 196, 282], total: 534 },
      { name: "윤주안", school: "성포초등학교", rounds: [0, 0, 207, 277], total: 484 },
    ],
  },
{
    id: "sheet_2026_04_12_elem_girls_lower_validation",
    date: "2026-04-12",
    division: "초등부(저학년)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 여자초등 U-11",
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
      { name: "고은", school: "안양서초등학교", rounds: [157, 205, 207, 260], total: 829 },
      { name: "황리안", school: "천현초등학교", rounds: [112, 151, 211, 281], total: 755 },
      { name: "김바다", school: "당정초등학교", rounds: [0, 0, 263, 312], total: 575 },
      { name: "이주아", school: "안양서초등학교", rounds: [55, 116, 79, 106], total: 356 },
    ],
  },
{
    id: "sheet_2026_04_12_elem_girls_upper_validation",
    date: "2026-04-12",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 여자초등 고학년",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "원서아", school: "하성초등학교", division: "초등5", rounds: [343, 352, 346, 352], total: 1393 },
      { name: "조유나", school: "하성초등학교", rounds: [325, 343, 339, 354], total: 1361 },
      { name: "이다연", school: "송정초등학교", rounds: [320, 341, 344, 353], total: 1358 },
      { name: "조유리", school: "수진초등학교", rounds: [319, 337, 350, 347], total: 1353 },
      { name: "최호희", school: "원미초등학교", rounds: [318, 332, 352, 351], total: 1353 },
      { name: "김도희", school: "원미초등학교", rounds: [321, 336, 342, 349], total: 1348 },
      { name: "강연지", school: "송정초등학교", rounds: [326, 329, 342, 350], total: 1347 },
      { name: "김태연", school: "송정초등학교", rounds: [318, 335, 336, 351], total: 1340 },
      { name: "전다은", school: "하성초등학교", rounds: [313, 331, 344, 349], total: 1337 },
      { name: "한윤서", school: "하성초등학교", rounds: [331, 328, 332, 344], total: 1335 },
      { name: "곽나영", school: "원미초등학교", rounds: [311, 326, 344, 336], total: 1317 },
      { name: "황리우", school: "천현초등학교", rounds: [305, 325, 339, 343], total: 1312 },
      { name: "손하음", school: "타겟28양궁클럽", rounds: [306, 329, 336, 339], total: 1310 },
      { name: "최승연", school: "부천시양궁협회", rounds: [307, 316, 339, 343], total: 1305 },
      { name: "강라율", school: "송정초등학교", rounds: [301, 319, 340, 342], total: 1302 },
      { name: "김서윤", school: "송정초등학교", rounds: [305, 314, 337, 341], total: 1297 },
      { name: "김민채", school: "타겟28양궁클럽", rounds: [290, 327, 334, 345], total: 1296 },
      { name: "안수연", school: "안양서초등학교", rounds: [309, 311, 331, 344], total: 1295 },
      { name: "차유나", school: "원미초등학교", rounds: [310, 320, 324, 337], total: 1291 },
      { name: "신서윤", school: "송정초등학교", rounds: [302, 324, 319, 344], total: 1289 },
      { name: "탁민서", school: "안양서초등학교", rounds: [296, 320, 329, 341], total: 1286 },
      { name: "김지후", school: "안양서초등학교", rounds: [302, 309, 326, 342], total: 1279 },
      { name: "김태리", school: "하성초등학교", rounds: [298, 311, 322, 345], total: 1276 },
      { name: "조유나", school: "수진초등학교", rounds: [292, 301, 319, 339], total: 1251 },
      { name: "박수연", school: "송정초등학교", rounds: [297, 301, 316, 327], total: 1241 },
      { name: "오연희", school: "하성초등학교", rounds: [280, 302, 311, 337], total: 1230 },
      { name: "장윤혜", school: "송정초등학교", rounds: [294, 286, 320, 330], total: 1230 },
      { name: "장서하", school: "안양서초등학교", rounds: [286, 293, 326, 324], total: 1229 },
      { name: "김서우", school: "수진초등학교", rounds: [262, 304, 323, 338], total: 1227 },
      { name: "김윤하", school: "송정초등학교", rounds: [293, 290, 311, 325], total: 1219 },
      { name: "양서인", school: "하성초등학교", rounds: [281, 299, 314, 324], total: 1218 },
      { name: "김설", school: "안양서초등학교", rounds: [270, 301, 315, 327], total: 1213 },
      { name: "강민서", school: "여흥초등학교", rounds: [272, 288, 317, 325], total: 1202 },
      { name: "유혜인", school: "타겟28양궁클럽", rounds: [284, 295, 297, 314], total: 1190 },
      { name: "박채원", school: "부천시양궁협회", rounds: [271, 285, 308, 318], total: 1182 },
      { name: "박선우", school: "송정초등학교", rounds: [263, 284, 313, 317], total: 1177 },
      { name: "김태은", school: "타겟28양궁클럽", rounds: [239, 279, 333, 326], total: 1177 },
      { name: "김소율", school: "타겟28양궁클럽", rounds: [244, 275, 307, 332], total: 1158 },
      { name: "홍지수", school: "송정초등학교", rounds: [257, 288, 294, 314], total: 1153 },
      { name: "강하린", school: "타겟28양궁클럽", rounds: [270, 280, 278, 317], total: 1145 },
      { name: "원율", school: "여흥초등학교", rounds: [242, 261, 308, 327], total: 1138 },
      { name: "송의나", school: "수진초등학교", rounds: [246, 257, 307, 325], total: 1135 },
      { name: "김라윤", school: "하성초등학교", rounds: [238, 286, 293, 311], total: 1128 },
      { name: "송하영", school: "수진초등학교", rounds: [243, 248, 300, 331], total: 1122 },
      { name: "한지안", school: "원미초등학교", rounds: [234, 249, 300, 307], total: 1090 },
      { name: "김민채", school: "천현초등학교", rounds: [222, 236, 288, 307], total: 1053 },
      { name: "백가은", school: "안양서초등학교", rounds: [238, 230, 272, 302], total: 1042 },
      { name: "최선", school: "안양서초등학교", rounds: [231, 240, 252, 293], total: 1016 },
      { name: "조예늘", school: "하성초등학교", rounds: [166, 242, 292, 304], total: 1004 },
      { name: "백수연", school: "여흥초등학교", rounds: [179, 245, 252, 292], total: 968 },
      { name: "김윤서", school: "원미초등학교", rounds: [165, 198, 258, 249], total: 870 },
      { name: "조윤서", school: "안양서초등학교", rounds: [190, 230, 218, 223], total: 861 },
      { name: "윤이진", school: "여흥초등학교", rounds: [139, 185, 252, 267], total: 843 },
      { name: "고은", school: "안양서초등학교", rounds: [157, 205, 207, 260], total: 829 },
      { name: "황리안", school: "천현초등학교", rounds: [112, 151, 211, 281], total: 755 },
      { name: "김바다", school: "당정초등학교", rounds: [0, 0, 263, 312], total: 575 },
      { name: "이주아", school: "안양서초등학교", rounds: [55, 116, 79, 106], total: 356 },
    ],
  },
{
    id: "sheet_2026_04_12_middle_boys_validation",
    date: "2026-04-12",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 남자중등부",
    distances: [60, 50, 40, 30],
    rows: [
      { name: "안은찬", school: "성포중학교", rounds: [338, 322, 347, 357], total: 1364 },
      { name: "이한지", school: "신장중학교", rounds: [328, 313, 345, 346], total: 1332 },
      { name: "이주환", school: "원천중학교", rounds: [318, 329, 337, 346], total: 1330 },
      { name: "안준서", school: "원천중학교", rounds: [319, 327, 331, 348], total: 1325 },
      { name: "황태민", school: "하성중학교", rounds: [342, 303, 334, 341], total: 1320 },
      { name: "손우주", school: "수원시양궁협회", rounds: [324, 308, 331, 350], total: 1313 },
      { name: "서은민", school: "성포중학교", rounds: [328, 297, 333, 348], total: 1306 },
      { name: "권종영", school: "원천중학교", rounds: [319, 302, 337, 345], total: 1303 },
      { name: "홍지훈", school: "성포중학교", rounds: [307, 319, 331, 341], total: 1298 },
      { name: "강민국", school: "신장중학교", rounds: [310, 320, 320, 348], total: 1298 },
      { name: "박민교", school: "성포중학교", rounds: [317, 304, 333, 341], total: 1295 },
      { name: "김준혁", school: "성포중학교", rounds: [320, 295, 336, 343], total: 1294 },
      { name: "최준혁", school: "부천남중학교", rounds: [316, 299, 322, 340], total: 1277 },
      { name: "진민오", school: "원천중학교", rounds: [318, 297, 317, 335], total: 1267 },
      { name: "정태준", school: "원천중학교", rounds: [312, 298, 314, 334], total: 1258 },
      { name: "김보형", school: "수원시양궁협회", rounds: [310, 264, 312, 328], total: 1214 },
      { name: "명지훈", school: "성포중학교", rounds: [305, 260, 302, 333], total: 1200 },
      { name: "황시윤", school: "성포중학교", rounds: [295, 272, 299, 323], total: 1189 },
      { name: "강지석", school: "부천남중학교", rounds: [295, 263, 307, 311], total: 1176 },
      { name: "원동우", school: "하성중학교", rounds: [275, 256, 306, 324], total: 1161 },
      { name: "오태윤", school: "성포중학교", rounds: [281, 250, 299, 321], total: 1151 },
      { name: "양희종", school: "플랜비스포츠", rounds: [298, 236, 275, 308], total: 1117 },
      { name: "이찬희", school: "신장중학교", rounds: [296, 224, 284, 308], total: 1112 },
      { name: "차준", school: "부천남중학교", rounds: [224, 205, 287, 304], total: 1020 },
    ],
  },
{
    id: "sheet_2026_04_12_middle_girls_validation",
    date: "2026-04-12",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-04-12 여자중등부",
    distances: [60, 50, 40, 30],
    rows: [
      { name: "장예진", school: "여흥중학교", rounds: [331, 324, 339, 351], total: 1345 },
      { name: "김주은", school: "창용중학교", rounds: [331, 326, 331, 349], total: 1337 },
      { name: "김연아", school: "창용중학교", rounds: [324, 305, 335, 352], total: 1316 },
      { name: "박예주", school: "창용중학교", rounds: [322, 313, 334, 344], total: 1313 },
      { name: "윤도경", school: "여흥중학교", rounds: [313, 315, 338, 347], total: 1313 },
      { name: "안지현", school: "창용중학교", rounds: [327, 306, 331, 345], total: 1309 },
      { name: "주혜인", school: "창용중학교", rounds: [329, 299, 335, 344], total: 1307 },
      { name: "최세진", school: "창용중학교", rounds: [316, 306, 330, 344], total: 1296 },
      { name: "윤소미", school: "신장중학교", rounds: [316, 290, 341, 339], total: 1286 },
      { name: "권수연", school: "상도중학교", rounds: [328, 272, 338, 348], total: 1286 },
      { name: "허정아", school: "하성중학교", rounds: [317, 301, 321, 341], total: 1280 },
      { name: "김보현", school: "여흥중학교", rounds: [310, 311, 317, 341], total: 1279 },
      { name: "이민솔", school: "신장중학교", rounds: [317, 290, 328, 342], total: 1277 },
      { name: "이가은", school: "수원시양궁협회", rounds: [315, 296, 322, 335], total: 1268 },
      { name: "한세빈", school: "창용중학교", rounds: [312, 296, 323, 337], total: 1268 },
      { name: "김수연", school: "창용중학교", rounds: [307, 298, 324, 337], total: 1266 },
      { name: "한새론", school: "창용중학교", rounds: [296, 308, 323, 334], total: 1261 },
      { name: "이송희", school: "안양서중학교", rounds: [302, 288, 328, 337], total: 1255 },
      { name: "김정용", school: "창용중학교", rounds: [300, 292, 315, 346], total: 1253 },
      { name: "유수진", school: "여흥중학교", rounds: [304, 285, 312, 339], total: 1240 },
      { name: "유하은", school: "하성중학교", rounds: [308, 284, 317, 328], total: 1237 },
      { name: "유하원", school: "상도중학교", rounds: [291, 289, 318, 334], total: 1232 },
      { name: "이소연", school: "창용중학교", rounds: [292, 272, 312, 345], total: 1221 },
      { name: "김하늘", school: "상도중학교", rounds: [274, 265, 316, 330], total: 1185 },
      { name: "소리아", school: "상도중학교", rounds: [287, 289, 272, 325], total: 1173 },
      { name: "권우솔", school: "상도중학교", rounds: [279, 260, 306, 319], total: 1164 },
      { name: "석지우", school: "하성중학교", rounds: [289, 256, 296, 320], total: 1161 },
      { name: "윤이나", school: "창용중학교", rounds: [289, 255, 288, 322], total: 1154 },
      { name: "함소이", school: "여흥중학교", rounds: [292, 215, 291, 322], total: 1120 },
      { name: "고나연", school: "여흥중학교", rounds: [268, 227, 305, 301], total: 1101 },
      { name: "김지윤", school: "여흥중학교", rounds: [282, 243, 229, 318], total: 1072 },
      { name: "김혜림", school: "안양서중학교", rounds: [254, 222, 283, 300], total: 1059 },
      { name: "김세아", school: "안양서중학교", rounds: [265, 223, 271, 300], total: 1059 },
      { name: "김하은", school: "여흥중학교", rounds: [120, 58, 234, 249], total: 661 },
      { name: "최아영", school: "창성중학교", rounds: [0, 0, 212, 293], total: 505 },
      { name: "전서연", school: "창성중학교", rounds: [0, 0, 203, 255], total: 458 },
    ],
  }
  ,
{
    id: "sheet_2026_03_22_elem_girls_lower_validation_v2",
    date: "2026-03-22",
    division: "초등부(저학년)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "공식기록 2026-03-22 여자초등 U-11",
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
      { name: "박가은", school: "안양서초등학교", rounds: [165, 216, 273, 288], total: 942 },
      { name: "김민채", school: "천현초등학교", rounds: [225, 213, 250, 243], total: 931 },
      { name: "조예슬", school: "하성초등학교", rounds: [189, 203, 250, 278], total: 920 },
      { name: "윤이진", school: "여흥초등학교", rounds: [145, 194, 231, 307], total: 877 },
      { name: "고은", school: "안양서초등학교", rounds: [177, 212, 229, 255], total: 873 },
      { name: "황리안", school: "천현초등학교", rounds: [159, 152, 209, 245], total: 765 },
      { name: "이주아", school: "안양서초등학교", rounds: [65, 138, 117, 184], total: 504 }
    ],
  }


,
  // 추가기록.xlsx 기반 공식 샘플 데이터: 단체종합/대표선발/컴파운드/성별 불명확 행은 랭킹 왜곡 방지를 위해 제외,
{
    id: "sheet_additional_2025_03_23_경기도_중등부_남_30_40_50_60_1",
    date: "2025-03-23",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-03-23 경기도 남 중등부",
    distances: [30, 40, 50, 60],
    rows: [
      { name: "정시우", school: "성포중학교", rounds: [353, 348, 319, 340], total: 1360 }
    ],
  }
,
{
    id: "sheet_additional_2025_03_23_경기도_중등부_여_50_2",
    date: "2025-03-23",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-03-23 경기도 여 중등부",
    distances: [50],
    rows: [
      { name: "김혜윤", school: "여주여자중학교", rounds: [330], total: 330 }
    ],
  }
,
{
    id: "sheet_additional_2025_03_23_경기도_초등부_통합__남_20_25_30_35_3",
    date: "2025-03-23",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-03-23 경기도 남 초등부(통합)",
    distances: [20, 25, 30, 35],
    rows: [
      { name: "이환지", school: "천현초등학교", rounds: [355, 354, 350, 337], total: 1396 }
    ],
  }
,
{
    id: "sheet_additional_2025_03_23_경기도_초등부_통합__여_20_25_30_35_4",
    date: "2025-03-23",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-03-23 경기도 여 초등부(통합)",
    distances: [20, 25, 30, 35],
    rows: [
      { name: "한세빈", school: "송정초등학교", rounds: [350, 352, 337, 327], total: 1366 }
    ],
  }
,
{
    id: "sheet_additional_2025_04_13_경기도_중등부_남_30_60_5",
    date: "2025-04-13",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-04-13 경기도 남 중등부",
    distances: [30, 60],
    rows: [
      { name: "정시우", school: "성포중학교", rounds: [345, 343], total: 688 }
    ],
  }
,
{
    id: "sheet_additional_2025_04_13_경기도_중등부_여_30_60_6",
    date: "2025-04-13",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-04-13 경기도 여 중등부",
    distances: [30, 60],
    rows: [
      { name: "김혜윤", school: "여주여자중학교", rounds: [347, 339], total: 686 }
    ],
  }
,
{
    id: "sheet_additional_2025_04_13_경기도_중등부_여_40_7",
    date: "2025-04-13",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-04-13 경기도 여 중등부",
    distances: [40],
    rows: [
      { name: "한정연", school: "여주여자중학교", rounds: [339], total: 339 }
    ],
  }
,
{
    id: "sheet_additional_2025_04_13_경기도_초등부_통합__남_20_30_8",
    date: "2025-04-13",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-04-13 경기도 남 초등부(통합)",
    distances: [20, 30],
    rows: [
      { name: "강민국", school: "천현초등학교", rounds: [352, 345], total: 697 }
    ],
  }
,
{
    id: "sheet_additional_2025_04_13_경기도_초등부_통합__여_20_25_30_35_9",
    date: "2025-04-13",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-04-13 경기도 여 초등부(통합)",
    distances: [20, 25, 30, 35],
    rows: [
      { name: "한세빈", school: "송정초등학교", rounds: [355, 338, 348, 335], total: 1376 }
    ],
  }
,
{
    id: "sheet_additional_2025_05_27_부산광역시_중등부_남_60_10",
    date: "2025-05-27",
    division: "중등부",
    gender: "남",
    regionCity: "부산광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-05-27 부산광역시 남 중등부",
    distances: [60],
    rows: [
      { name: "박규필", school: "부산체육중학교", rounds: [350], total: 350 }
    ],
  }
,
{
    id: "sheet_additional_2025_05_27_경기도_중등부_여_40_11",
    date: "2025-05-27",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-05-27 경기도 여 중등부",
    distances: [40],
    rows: [
      { name: "한정연", school: "여주여자중학교", rounds: [353], total: 353 }
    ],
  }
,
{
    id: "sheet_additional_2025_05_27_대구광역시_초등부_통합__남_35_12",
    date: "2025-05-27",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "대구광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-05-27 대구광역시 남 초등부(통합)",
    distances: [35],
    rows: [
      { name: "양가온", school: "대구송현초등학교", rounds: [348], total: 348 }
    ],
  }
,
{
    id: "sheet_additional_2025_05_27_충청북도_초등부_통합__남_20_13",
    date: "2025-05-27",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "충청북도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-05-27 충청북도 남 초등부(통합)",
    distances: [20],
    rows: [
      { name: "신동주", school: "이원초등학교", rounds: [360], total: 360 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_중등부_남_30_50_14",
    date: "2025-06-15",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 남 중등부",
    distances: [30, 50],
    rows: [
      { name: "정시우", school: "성포중학교", rounds: [352, 336], total: 688 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_중등부_남_40_15",
    date: "2025-06-15",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 남 중등부",
    distances: [40],
    rows: [
      { name: "강민우", school: "부천남중학교", rounds: [350], total: 350 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_중등부_남_60_16",
    date: "2025-06-15",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 남 중등부",
    distances: [60],
    rows: [
      { name: "김호균", school: "하성중학교", rounds: [338], total: 338 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_중등부_여_30_17",
    date: "2025-06-15",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 여 중등부",
    distances: [30],
    rows: [
      { name: "김연아", school: "창용중학교", rounds: [352], total: 352 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_중등부_여_30_40_50_60_18",
    date: "2025-06-15",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 여 중등부",
    distances: [30, 40, 50, 60],
    rows: [
      { name: "김은찬", school: "창용중학교", rounds: [349, 346, 332, 340], total: 1367 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_초등부_통합__남_20_25_30_35_19",
    date: "2025-06-15",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 남 초등부(통합)",
    distances: [20, 25, 30, 35],
    rows: [
      { name: "이환지", school: "천현초등학교", rounds: [355, 355, 356, 344], total: 1410 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_초등부_통합__여_25_30_20",
    date: "2025-06-15",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 여 초등부(통합)",
    distances: [25, 30],
    rows: [
      { name: "한세빈", school: "송정초등학교", rounds: [352, 350], total: 702 }
    ],
  }
,
{
    id: "sheet_additional_2025_06_15_경기도_초등부_통합__여_25_35_21",
    date: "2025-06-15",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-06-15 경기도 여 초등부(통합)",
    distances: [25, 35],
    rows: [
      { name: "허정아", school: "하성초등학교", rounds: [352, 340], total: 692 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경기도_중등부_남_30_22",
    date: "2025-07-21",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경기도 남 중등부",
    distances: [30],
    rows: [
      { name: "최준혁", school: "부천남중학교", rounds: [353], total: 353 },
      { name: "안은찬", school: "성포중학교", rounds: [353], total: 353 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경기도_중등부_남_50_23",
    date: "2025-07-21",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경기도 남 중등부",
    distances: [50],
    rows: [
      { name: "김호균", school: "하성중학교", rounds: [337], total: 337 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_인천광역시_중등부_남_40_24",
    date: "2025-07-21",
    division: "중등부",
    gender: "남",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 인천광역시 남 중등부",
    distances: [40],
    rows: [
      { name: "김성혁", school: "만수북중학교", rounds: [347], total: 347 },
      { name: "석주원", school: "선인중학교", rounds: [346], total: 346 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_인천광역시_중등부_남_50_60_25",
    date: "2025-07-21",
    division: "중등부",
    gender: "남",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 인천광역시 남 중등부",
    distances: [50, 60],
    rows: [
      { name: "박세현", school: "북인천중학교", rounds: [329, 336], total: 665 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_충청북도_중등부_남_30_26",
    date: "2025-07-21",
    division: "중등부",
    gender: "남",
    regionCity: "충청북도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 충청북도 남 중등부",
    distances: [30],
    rows: [
      { name: "주영진", school: "이원중학교", rounds: [352], total: 352 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경기도_중등부_여_40_27",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경기도 여 중등부",
    distances: [40],
    rows: [
      { name: "한정연", school: "여주여자중학교", rounds: [346], total: 346 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경기도_중등부_여_40_50_28",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경기도 여 중등부",
    distances: [40, 50],
    rows: [
      { name: "김은찬", school: "창용중학교", rounds: [353, 335], total: 688 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경기도_중등부_여_50_60_29",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경기도 여 중등부",
    distances: [50, 60],
    rows: [
      { name: "김혜윤", school: "여주여자중학교", rounds: [336, 342], total: 678 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_경상북도_중등부_여_30_30",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "경상북도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 경상북도 여 중등부",
    distances: [30],
    rows: [
      { name: "김지율", school: "예천여자중학교", rounds: [357], total: 357 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_광주광역시_중등부_여_30_40_50_31",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "광주광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 광주광역시 여 중등부",
    distances: [30, 40, 50],
    rows: [
      { name: "강수정", school: "광주체육중학교", rounds: [355, 346, 335], total: 1036 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_대전광역시_중등부_여_40_32",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "대전광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 대전광역시 여 중등부",
    distances: [40],
    rows: [
      { name: "김현서", school: "대전체육중학교", rounds: [346], total: 346 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_인천광역시_중등부_여_30_33",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 인천광역시 여 중등부",
    distances: [30],
    rows: [
      { name: "오선영", school: "강화여자중학교", rounds: [355], total: 355 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_인천광역시_중등부_여_30_40_60_34",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 인천광역시 여 중등부",
    distances: [30, 40, 60],
    rows: [
      { name: "김아현", school: "신흥여자중학교", rounds: [358, 351, 342], total: 1051 }
    ],
  }
,
{
    id: "sheet_additional_2025_07_21_인천광역시_중등부_여_50_35",
    date: "2025-07-21",
    division: "중등부",
    gender: "여",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-07-21 인천광역시 여 중등부",
    distances: [50],
    rows: [
      { name: "김혜린", school: "신흥여자중학교", rounds: [337], total: 337 }
    ],
  }
,
{
    id: "sheet_additional_2025_09_28_광주광역시_중등부_남_50_36",
    date: "2025-09-28",
    division: "중등부",
    gender: "남",
    regionCity: "광주광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-09-28 광주광역시 남 중등부",
    distances: [50],
    rows: [
      { name: "김준서", school: "광주체육중학교", rounds: [341], total: 341 }
    ],
  }
,
{
    id: "sheet_additional_2025_09_28_광주광역시_중등부_여_30_40_50_60_37",
    date: "2025-09-28",
    division: "중등부",
    gender: "여",
    regionCity: "광주광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가기록 2025-09-28 광주광역시 여 중등부",
    distances: [30, 40, 50, 60],
    rows: [
      { name: "강수정", school: "광주체육중학교", rounds: [359, 349, 335, 337], total: 1380 }
    ],
  }

,
  // 추가_선수_찾음.xlsx 점수 확인 후보: 거리 점수 확인 13명 반영, 개인종합만 확인된 1명은 랭킹 산정 보류,
{
    id: "sheet_found_candidates_2025_04_13_경기도_중등부_남_30_60_1",
    date: "2025-04-13",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 남 중등부",
    distances: [30, 60],
    rows: [
      { name: "정시우", school: "성포중학교", rounds: [345, 343], total: 688 }
    ],
  },
{
    id: "sheet_found_candidates_2025_04_13_경기도_중등부_여_30_60_2",
    date: "2025-04-13",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 여 중등부",
    distances: [30, 60],
    rows: [
      { name: "김혜윤", school: "여주여자중학교", rounds: [347, 339], total: 686 }
    ],
  },
{
    id: "sheet_found_candidates_2025_04_13_경기도_중등부_여_40_3",
    date: "2025-04-13",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 여 중등부",
    distances: [40],
    rows: [
      { name: "한정연", school: "여주여자중학교", rounds: [339], total: 339 }
    ],
  },
{
    id: "sheet_found_candidates_2025_04_13_경기도_초등부_통합__남_20_30_4",
    date: "2025-04-13",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 남 초등부(통합)",
    distances: [20, 30],
    rows: [
      { name: "강민국", school: "천현초등학교", rounds: [352, 345], total: 697 }
    ],
  },
{
    id: "sheet_found_candidates_2025_04_13_경기도_초등부_통합__남_25_35_5",
    date: "2025-04-13",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 남 초등부(통합)",
    distances: [25, 35],
    rows: [
      { name: "이환지", school: "천현초등학교", rounds: [341, 336], total: 677 }
    ],
  },
{
    id: "sheet_found_candidates_2025_04_13_경기도_초등부_통합__여_20_25_30_35_6",
    date: "2025-04-13",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-04-13 경기도 여 초등부(통합)",
    distances: [20, 25, 30, 35],
    rows: [
      { name: "한세빈", school: "송정초등학교", rounds: [355, 338, 348, 335], total: 1376 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_경기도_중등부_남_40_7",
    date: "2025-07-23",
    division: "중등부",
    gender: "남",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 경기도 남 중등부",
    distances: [40],
    rows: [
      { name: "김호균", school: "하성중학교", rounds: [346], total: 346 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_경기도_중등부_여_30_60_8",
    date: "2025-07-23",
    division: "중등부",
    gender: "여",
    regionCity: "경기도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 경기도 여 중등부",
    distances: [30, 60],
    rows: [
      { name: "김은찬", school: "창용중학교", rounds: [357, 343], total: 700 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_부산광역시_중등부_남_40_9",
    date: "2025-07-23",
    division: "중등부",
    gender: "남",
    regionCity: "부산광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 부산광역시 남 중등부",
    distances: [40],
    rows: [
      { name: "박민혁", school: "모라중학교", rounds: [343], total: 343 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_부산광역시_중등부_여_60_10",
    date: "2025-07-23",
    division: "중등부",
    gender: "여",
    regionCity: "부산광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 부산광역시 여 중등부",
    distances: [60],
    rows: [
      { name: "김수민", school: "모라중학교", rounds: [342], total: 342 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_인천광역시_중등부_남_30_11",
    date: "2025-07-23",
    division: "중등부",
    gender: "남",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 인천광역시 남 중등부",
    distances: [30],
    rows: [
      { name: "김성혁", school: "만수북중학교", rounds: [356], total: 356 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_인천광역시_중등부_여_40_60_12",
    date: "2025-07-23",
    division: "중등부",
    gender: "여",
    regionCity: "인천광역시",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 인천광역시 여 중등부",
    distances: [40, 60],
    rows: [
      { name: "김아현", school: "신흥여자중학교", rounds: [350, 342], total: 692 }
    ],
  },
{
    id: "sheet_found_candidates_2025_07_23_충청북도_중등부_남_40_13",
    date: "2025-07-23",
    division: "중등부",
    gender: "남",
    regionCity: "충청북도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "추가 선수 찾음 2025-07-23 충청북도 남 중등부",
    distances: [40],
    rows: [
      { name: "주영진", school: "이원중학교", rounds: [345], total: 345 }
    ],
  }

,
  // 2026 비경기권 공식기록 추가 - 주영진,
{
    id: "sheet_2026_non_gyeonggi_juyeongjin",
    date: "2026-04-04",
    division: "중등부",
    gender: "남",
    regionCity: "충청북도",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "2026 충북 공식기록",
    distances: [60, 40],
    rows: [
      { name: "주영진", school: "이원중학교", rounds: [346, 345], total: 691 }
    ],
  }

,
  // 2025 PDF 공식기록 추출 데이터: 고유 문서 15개, 컴파운드/성인 통합/비거리표 제외, 2026 기준 학년 보정 적용,
{
    id: "sheet_pdf_2025_AR0012025AR001AR05M01Q_1_",
    date: "2025-05-02",
    division: "일반부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제59회전국남여양궁종별선수권대회 · 남자리커브일반부개인",
    distances: [90, 70, 50, 30],
    rows: [
      { name: "문균호", school: "울산남구청", division: "일반부", rounds: [329, 323, 324, 355], total: 1331 },
      { name: "이한샘", school: "청주시청", division: "일반부", rounds: [330, 321, 330, 349], total: 1330 },
      { name: "최재환", school: "대전시체육회", division: "일반부", rounds: [326, 316, 337, 349], total: 1328 },
      { name: "김예찬", school: "코오롱엑스텐보이즈", division: "일반부", rounds: [315, 323, 337, 351], total: 1326 },
      { name: "황석민", school: "울산남구청", division: "일반부", rounds: [323, 316, 335, 352], total: 1326 },
      { name: "원종혁", school: "국군체육부대", division: "일반부", rounds: [323, 319, 330, 353], total: 1325 },
      { name: "정태영", school: "코오롱엑스텐보이즈", division: "일반부", rounds: [315, 324, 328, 357], total: 1324 },
      { name: "남유빈", school: "현대제철", division: "일반부", rounds: [331, 307, 332, 354], total: 1324 },
      { name: "김선우", school: "코오롱엑스텐보이즈", division: "일반부", rounds: [324, 311, 333, 355], total: 1323 },
      { name: "장지호", school: "예천군청", division: "일반부", rounds: [325, 316, 332, 350], total: 1323 },
      { name: "박선우", school: "서울시청", division: "일반부", rounds: [327, 322, 327, 346], total: 1322 },
      { name: "최현택", school: "국군체육부대", division: "일반부", rounds: [315, 331, 324, 351], total: 1321 },
      { name: "이우주", school: "공주시청", division: "일반부", rounds: [321, 318, 330, 350], total: 1319 },
      { name: "최건태", school: "코오롱엑스텐보이즈", division: "일반부", rounds: [326, 307, 332, 353], total: 1318 },
      { name: "구본찬", school: "현대제철", division: "일반부", rounds: [317, 318, 330, 353], total: 1318 },
      { name: "구대한", school: "청주시청", division: "일반부", rounds: [325, 310, 330, 352], total: 1317 },
      { name: "김태민", school: "공주시청", division: "일반부", rounds: [318, 314, 337, 347], total: 1316 },
      { name: "김하준", school: "사상구청", division: "일반부", rounds: [324, 309, 330, 352], total: 1315 },
      { name: "이주성", school: "경북양궁협회", division: "일반부", rounds: [315, 324, 328, 347], total: 1314 },
      { name: "이용빈", school: "전북체육회", division: "일반부", rounds: [317, 317, 326, 352], total: 1312 },
      { name: "김법민", school: "대전시체육회", division: "일반부", rounds: [316, 320, 324, 348], total: 1308 },
      { name: "박주영", school: "서울시청", division: "일반부", rounds: [315, 308, 334, 351], total: 1308 },
      { name: "허재우", school: "현대제철", division: "일반부", rounds: [322, 307, 327, 352], total: 1308 },
      { name: "손지원", school: "예천군청", division: "일반부", rounds: [316, 319, 319, 353], total: 1307 },
      { name: "서준혁", school: "서울시청", division: "일반부", rounds: [315, 319, 324, 348], total: 1306 },
      { name: "이승욱", school: "청주시청", division: "일반부", rounds: [318, 308, 329, 349], total: 1304 },
      { name: "신재훈", school: "코오롱엑스텐보이즈", division: "일반부", rounds: [315, 313, 321, 353], total: 1302 },
      { name: "이승신", school: "서울시청", division: "일반부", rounds: [317, 308, 322, 351], total: 1298 },
      { name: "곽동훈", school: "대전시체육회", division: "일반부", rounds: [318, 310, 321, 348], total: 1297 },
      { name: "이선재", school: "울산남구청", division: "일반부", rounds: [313, 304, 328, 352], total: 1297 },
      { name: "김정훈", school: "국군체육부대", division: "일반부", rounds: [311, 308, 331, 346], total: 1296 },
      { name: "이동영", school: "예천군청", division: "일반부", rounds: [320, 300, 323, 352], total: 1295 },
      { name: "한종혁", school: "인천계양구청", division: "일반부", rounds: [315, 309, 320, 351], total: 1295 },
      { name: "김건우", school: "전북체육회", division: "일반부", rounds: [314, 314, 320, 347], total: 1295 },
      { name: "김필중", school: "국군체육부대", division: "일반부", rounds: [311, 309, 324, 350], total: 1294 },
      { name: "이진용", school: "국군체육부대", division: "일반부", rounds: [309, 309, 326, 349], total: 1293 },
      { name: "한우탁", school: "인천계양구청", division: "일반부", rounds: [316, 299, 325, 351], total: 1291 },
      { name: "송인준", school: "국군체육부대", division: "일반부", rounds: [308, 308, 325, 350], total: 1291 },
      { name: "장채환", school: "사상구청", division: "일반부", rounds: [305, 311, 324, 349], total: 1289 },
      { name: "한재엽", school: "현대제철", division: "일반부", rounds: [308, 315, 316, 349], total: 1288 },
      { name: "박민범", school: "대구중구청", division: "일반부", rounds: [306, 317, 312, 352], total: 1287 },
      { name: "박규석", school: "두산에너빌리티", division: "일반부", rounds: [296, 312, 330, 349], total: 1287 },
      { name: "고태경", school: "공주시청", division: "일반부", rounds: [305, 309, 321, 351], total: 1286 },
      { name: "이승윤", school: "광주광역시남구청", division: "일반부", rounds: [318, 298, 321, 349], total: 1286 },
      { name: "김강현", school: "인천계양구청", division: "일반부", rounds: [312, 309, 319, 343], total: 1283 },
      { name: "서승범", school: "공주시청", division: "일반부", rounds: [307, 315, 311, 349], total: 1282 },
      { name: "구동남", school: "대구중구청", division: "일반부", rounds: [305, 312, 319, 341], total: 1277 },
      { name: "김종호", school: "인천계양구청", division: "일반부", rounds: [306, 307, 319, 345], total: 1277 },
      { name: "김민범", school: "울산남구청", division: "일반부", rounds: [312, 311, 311, 343], total: 1277 },
      { name: "용혁중", school: "대구중구청", division: "일반부", rounds: [307, 296, 323, 349], total: 1275 },
      { name: "이원주", school: "광주광역시남구청", division: "일반부", rounds: [305, 311, 315, 344], total: 1275 },
      { name: "여대호", school: "전북체육회", division: "일반부", rounds: [302, 305, 322, 346], total: 1275 },
      { name: "이동민", school: "광주광역시남구청", division: "일반부", rounds: [305, 307, 316, 345], total: 1273 },
      { name: "진재왕", school: "두산에너빌리티", division: "일반부", rounds: [303, 309, 325, 333], total: 1270 },
      { name: "김규정", school: "국군체육부대", division: "일반부", rounds: [293, 307, 319, 345], total: 1264 },
      { name: "이승일", school: "사상구청", division: "일반부", rounds: [313, 297, 310, 343], total: 1263 },
      { name: "박성호", school: "대구중구청", division: "일반부", rounds: [298, 301, 307, 343], total: 1249 },
      { name: "김민제", school: "예천군청", division: "일반부", rounds: [291, 313, 299, 340], total: 1243 },
      { name: "김용기", school: "X텐실내양궁장(동)", division: "일반부", rounds: [211, 264, 262, 321], total: 1058 },
      { name: "정유찬", school: "나무클럽(동)", division: "일반부", rounds: [28, 99, 171, 295], total: 593 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0012025AR001AR05W01Q_1_",
    date: "2025-05-02",
    division: "일반부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제59회전국남여양궁종별선수권대회 · 여자리커브일반부개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "유수정", school: "현대백화점", division: "일반부", rounds: [335, 349, 325, 354], total: 1363 },
      { name: "최미선", school: "광주은행텐텐양궁단", division: "일반부", rounds: [334, 348, 329, 348], total: 1359 },
      { name: "곽예지", school: "대전시체육회", division: "일반부", rounds: [329, 339, 337, 353], total: 1358 },
      { name: "김서영", school: "인천광역시청", division: "일반부", rounds: [334, 341, 329, 354], total: 1358 },
      { name: "김수린", school: "광주광역시청", division: "일반부", rounds: [325, 341, 335, 356], total: 1357 },
      { name: "임하나", school: "LH", division: "일반부", rounds: [333, 345, 330, 348], total: 1356 },
      { name: "정다소미", school: "현대백화점", division: "일반부", rounds: [329, 346, 326, 354], total: 1355 },
      { name: "전훈영", school: "인천광역시청", division: "일반부", rounds: [330, 341, 331, 353], total: 1355 },
      { name: "이윤지", school: "현대모비스", division: "일반부", rounds: [335, 342, 333, 344], total: 1354 },
      { name: "임두나", school: "LH", division: "일반부", rounds: [336, 347, 328, 343], total: 1354 },
      { name: "김아현", school: "여주시청", division: "일반부", rounds: [331, 343, 333, 347], total: 1354 },
      { name: "이세현", school: "창원시청", division: "일반부", rounds: [332, 337, 332, 351], total: 1352 },
      { name: "김이안", school: "현대백화점", division: "일반부", rounds: [329, 339, 330, 353], total: 1351 },
      { name: "박세은", school: "부산도시공사", division: "일반부", rounds: [332, 342, 328, 349], total: 1351 },
      { name: "조아름", school: "현대백화점", division: "일반부", rounds: [338, 343, 329, 340], total: 1350 },
      { name: "최예지", school: "대구서구청", division: "일반부", rounds: [337, 333, 327, 352], total: 1349 },
      { name: "남수현", school: "순천시청", division: "일반부", rounds: [331, 341, 330, 347], total: 1349 },
      { name: "손서빈", school: "여주시청", division: "일반부", rounds: [330, 342, 327, 349], total: 1348 },
      { name: "이은아", school: "홍성군청", division: "일반부", rounds: [329, 340, 328, 351], total: 1348 },
      { name: "한솔", school: "홍성군청", division: "일반부", rounds: [335, 336, 331, 345], total: 1347 },
      { name: "곽진영", school: "광주은행텐텐양궁단", division: "일반부", rounds: [328, 339, 328, 352], total: 1347 },
      { name: "박소영", school: "여주시청", division: "일반부", rounds: [328, 342, 329, 347], total: 1346 },
      { name: "황재민", school: "창원시청", division: "일반부", rounds: [325, 337, 332, 351], total: 1345 },
      { name: "심예지", school: "청주시청", division: "일반부", rounds: [329, 345, 328, 342], total: 1344 },
      { name: "방현주", school: "현대모비스", division: "일반부", rounds: [337, 332, 329, 346], total: 1344 },
      { name: "이나영", school: "창원시청", division: "일반부", rounds: [332, 340, 323, 347], total: 1342 },
      { name: "장민희", school: "인천광역시청", division: "일반부", rounds: [339, 328, 325, 350], total: 1342 },
      { name: "김예림", school: "여주시청", division: "일반부", rounds: [327, 343, 322, 349], total: 1341 },
      { name: "이은경", school: "순천시청", division: "일반부", rounds: [328, 334, 329, 349], total: 1340 },
      { name: "임해진", school: "대전시체육회", division: "일반부", rounds: [330, 336, 322, 350], total: 1338 },
      { name: "신서빈", school: "대전시체육회", division: "일반부", rounds: [335, 331, 326, 346], total: 1338 },
      { name: "신정화", school: "전북도청", division: "일반부", rounds: [332, 342, 322, 342], total: 1338 },
      { name: "주혜빈", school: "대구서구청", division: "일반부", rounds: [329, 334, 328, 346], total: 1337 },
      { name: "홍수남", school: "인천광역시청", division: "일반부", rounds: [326, 337, 325, 349], total: 1337 },
      { name: "우경림", school: "창원시청", division: "일반부", rounds: [324, 339, 321, 351], total: 1335 },
      { name: "강고은", school: "예천군청", division: "일반부", rounds: [321, 331, 333, 348], total: 1333 },
      { name: "정지서", school: "현대모비스", division: "일반부", rounds: [328, 328, 326, 351], total: 1333 },
      { name: "전인아", school: "전북도청", division: "일반부", rounds: [323, 332, 330, 344], total: 1329 },
      { name: "안희연", school: "청주시청", division: "일반부", rounds: [328, 330, 322, 348], total: 1328 },
      { name: "손예령", school: "부산도시공사", division: "일반부", rounds: [330, 331, 320, 347], total: 1328 },
      { name: "전성은", school: "현대백화점", division: "일반부", rounds: [328, 329, 326, 345], total: 1328 },
      { name: "김세연", school: "홍성군청", division: "일반부", rounds: [319, 324, 332, 352], total: 1327 },
      { name: "박선진", school: "부산도시공사", division: "일반부", rounds: [326, 324, 327, 350], total: 1327 },
      { name: "김채윤", school: "광주광역시청", division: "일반부", rounds: [323, 329, 330, 345], total: 1327 },
      { name: "박은서", school: "부산도시공사", division: "일반부", rounds: [324, 330, 322, 348], total: 1324 },
      { name: "유시현", school: "순천시청", division: "일반부", rounds: [332, 325, 320, 347], total: 1324 },
      { name: "김아영", school: "전북도청", division: "일반부", rounds: [323, 338, 319, 342], total: 1322 },
      { name: "이다빈", school: "하이트진로", division: "일반부", rounds: [320, 338, 315, 348], total: 1321 },
      { name: "박수빈", school: "청주시청", division: "일반부", rounds: [322, 336, 321, 342], total: 1321 },
      { name: "이가영", school: "광주광역시청", division: "일반부", rounds: [313, 333, 321, 353], total: 1320 },
      { name: "박소민", school: "LH", division: "일반부", rounds: [326, 325, 322, 347], total: 1320 },
      { name: "김예후", school: "전북도청", division: "일반부", rounds: [313, 334, 325, 347], total: 1319 },
      { name: "최모경", school: "하이트진로", division: "일반부", rounds: [331, 336, 310, 338], total: 1315 },
      { name: "전완서", school: "광주광역시청", division: "일반부", rounds: [326, 318, 329, 342], total: 1315 },
      { name: "박나원", school: "하이트진로", division: "일반부", rounds: [317, 327, 321, 349], total: 1314 },
      { name: "조수빈", school: "예천군청", division: "일반부", rounds: [320, 321, 328, 345], total: 1314 },
      { name: "심다정", school: "예천군청", division: "일반부", rounds: [315, 326, 322, 344], total: 1307 },
      { name: "김소희", school: "청주시청", division: "일반부", rounds: [320, 334, 310, 341], total: 1305 },
      { name: "최예진", school: "광주은행텐텐양궁단", division: "일반부", rounds: [311, 339, 315, 336], total: 1301 },
      { name: "임정민", school: "대구서구청", division: "일반부", rounds: [331, 316, 307, 346], total: 1300 },
      { name: "박재희", school: "홍성군청", division: "일반부", rounds: [309, 328, 312, 349], total: 1298 },
      { name: "이다희", school: "LH", division: "일반부", rounds: [320, 335, 296, 346], total: 1297 },
      { name: "이혜민", school: "예천군청", division: "일반부", rounds: [315, 328, 300, 339], total: 1282 },
      { name: "김정윤", school: "광주은행텐텐양궁단", division: "일반부", rounds: [306, 319, 293, 336], total: 1254 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0022025AR001AR01W010Q_1_",
    date: "2025-06-23",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제36회전국남.여초등학교양궁대회 · 여자리커브초등부U-10(1~4학년) 개인",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "원서아", school: "하성초등학교", division: "초등부(통합)", rounds: [339, 342, 344, 351], total: 1376 },
      { name: "진혜민", school: "모덕초등학교", division: "초등부(통합)", rounds: [309, 324, 333, 340], total: 1306 },
      { name: "박교금", school: "예천동부초등학교", division: "초등부(통합)", rounds: [298, 312, 331, 340], total: 1281 },
      { name: "남유주", school: "서울방이초등학교", division: "초등부(통합)", rounds: [284, 317, 337, 327], total: 1265 },
      { name: "전혜수", school: "용성초등학교", division: "초등부(통합)", rounds: [287, 316, 332, 329], total: 1264 },
      { name: "표하린", school: "신계초등학교", division: "초등부(통합)", rounds: [292, 308, 325, 337], total: 1262 },
      { name: "이채윤", school: "모덕초등학교", division: "초등부(통합)", rounds: [296, 310, 317, 332], total: 1255 },
      { name: "박수빈", school: "진해중앙초등학교", division: "초등부(통합)", rounds: [292, 312, 317, 320], total: 1241 },
      { name: "이혜진", school: "이원초등학교", division: "초등부(통합)", rounds: [270, 314, 315, 337], total: 1236 },
      { name: "정하민", school: "정평초등학교", division: "초등부(통합)", rounds: [289, 283, 323, 332], total: 1227 },
      { name: "김루하", school: "순천성남초등학교", division: "초등부(통합)", rounds: [284, 310, 309, 322], total: 1225 },
      { name: "최지원", school: "예천동부초등학교", division: "초등부(통합)", rounds: [275, 289, 313, 325], total: 1202 },
      { name: "고채나", school: "인천서면초등학교", division: "초등부(통합)", rounds: [267, 307, 308, 314], total: 1196 },
      { name: "장예담", school: "순천성남초등학교", division: "초등부(통합)", rounds: [271, 289, 302, 330], total: 1192 },
      { name: "김지율", school: "전주신동초등학교", division: "초등부(통합)", rounds: [246, 295, 306, 315], total: 1162 },
      { name: "황서현", school: "정평초등학교", division: "초등부(통합)", rounds: [265, 264, 298, 324], total: 1151 },
      { name: "이효민", school: "홍남초등학교", division: "초등부(통합)", rounds: [287, 291, 281, 291], total: 1150 },
      { name: "정세영", school: "인천갈월초등학교", division: "초등부(통합)", rounds: [259, 267, 301, 315], total: 1142 },
      { name: "허선율", school: "대구문성초등학교", division: "초등부(통합)", rounds: [247, 277, 297, 312], total: 1133 },
      { name: "이다은", school: "두암초등학교", division: "초등부(통합)", rounds: [256, 261, 290, 296], total: 1103 },
      { name: "김민주", school: "여흥초등학교", division: "초등부(통합)", rounds: [217, 268, 309, 304], total: 1098 },
      { name: "장하연", school: "일로초등학교", division: "초등부(통합)", rounds: [229, 267, 269, 290], total: 1055 },
      { name: "허정여", school: "오수초등학교", division: "초등부(통합)", rounds: [212, 224, 295, 314], total: 1045 },
      { name: "이다연", school: "전주신동초등학교", division: "초등부(통합)", rounds: [193, 260, 251, 306], total: 1010 },
      { name: "서담비", school: "사천초등학교", division: "초등부(통합)", rounds: [231, 217, 252, 294], total: 994 },
      { name: "김희원", school: "서울신학초등학교", division: "초등부(통합)", rounds: [218, 225, 263, 283], total: 989 },
      { name: "박소율", school: "유촌초등학교", division: "초등부(통합)", rounds: [185, 222, 288, 286], total: 981 },
      { name: "최가온", school: "오수초등학교", division: "초등부(통합)", rounds: [177, 240, 225, 280], total: 922 },
      { name: "정해담", school: "덕벌초등학교", division: "초등부(통합)", rounds: [174, 220, 234, 239], total: 867 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0032025AR001AR02M01Q_1_",
    date: "2025-05-27",
    division: "중등부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제54회전국소년체육대회(15세이하부) · 남자리커브중학부개인",
    distances: [60, 50, 40, 30],
    rows: [
      { name: "김준서", school: "광주체육중학교", division: "중등부", rounds: [339, 335, 349, 352], total: 1375 },
      { name: "박민혁", school: "북인천중학교", division: "중등부", rounds: [344, 337, 343, 351], total: 1375 },
      { name: "안은찬", school: "성포중학교", division: "중등부", rounds: [346, 330, 348, 349], total: 1373 },
      { name: "유지백", school: "병천중학교", division: "고등부", rounds: [343, 331, 341, 357], total: 1372 },
      { name: "최윤찬", school: "미리벌중학교", division: "중등부", rounds: [335, 328, 348, 356], total: 1367 },
      { name: "강유석", school: "대전대청중학교", division: "고등부", rounds: [332, 332, 344, 348], total: 1356 },
      { name: "강민우", school: "동진중학교", division: "중등부", rounds: [330, 332, 342, 348], total: 1352 },
      { name: "서준용", school: "동진중학교", division: "중등부", rounds: [333, 327, 338, 353], total: 1351 },
      { name: "변승민", school: "진주봉원중학교", division: "중등부", rounds: [340, 319, 338, 354], total: 1351 },
      { name: "주영진", school: "이원중학교", division: "중등부", rounds: [333, 321, 340, 355], total: 1349 },
      { name: "이재준", school: "경북체육중학교", division: "중등부", rounds: [337, 323, 332, 354], total: 1346 },
      { name: "박규필", school: "부산체육중학교", division: "중등부", rounds: [350, 324, 331, 341], total: 1346 },
      { name: "정시우", school: "성포중학교", division: "고등부", rounds: [331, 325, 339, 349], total: 1344 },
      { name: "김호균", school: "하성중학교", division: "고등부", rounds: [327, 331, 336, 348], total: 1342 },
      { name: "전용현", school: "방이중학교", division: "고등부", rounds: [324, 323, 343, 350], total: 1340 },
      { name: "김시온", school: "관악중학교", division: "중등부", rounds: [334, 326, 334, 346], total: 1340 },
      { name: "김형호", school: "무거중학교", division: "중등부", rounds: [338, 323, 334, 345], total: 1340 },
      { name: "이호진", school: "경북체육중학교", division: "중등부", rounds: [329, 321, 340, 348], total: 1338 },
      { name: "곽동범", school: "대서중학교", division: "고등부", rounds: [341, 327, 320, 347], total: 1335 },
      { name: "손민서", school: "불로중학교", division: "중등부", rounds: [334, 324, 328, 349], total: 1335 },
      { name: "강동주", school: "무거중학교", division: "고등부", rounds: [336, 315, 335, 348], total: 1334 },
      { name: "최봉석", school: "예천중학교", division: "고등부", rounds: [333, 317, 338, 346], total: 1334 },
      { name: "오승준", school: "이원중학교", division: "고등부", rounds: [337, 329, 324, 344], total: 1334 },
      { name: "윤성빈", school: "면목중학교", division: "고등부", rounds: [327, 322, 334, 349], total: 1332 },
      { name: "박세현", school: "북인천중학교", division: "고등부", rounds: [324, 320, 339, 349], total: 1332 },
      { name: "박지웅", school: "불로중학교", division: "중등부", rounds: [329, 323, 340, 340], total: 1332 },
      { name: "최준혁", school: "부천남중학교", division: "중등부", rounds: [327, 317, 334, 353], total: 1331 },
      { name: "서준영", school: "괴산중학교", division: "중등부", rounds: [336, 316, 331, 345], total: 1328 },
      { name: "정현우", school: "방이중학교", division: "중등부", rounds: [333, 323, 331, 341], total: 1328 },
      { name: "안현준", school: "예천중학교", division: "중등부", rounds: [334, 319, 332, 339], total: 1324 },
      { name: "박민혁", school: "모라중학교", division: "중등부", rounds: [340, 309, 335, 339], total: 1323 },
      { name: "김도겸", school: "서야중학교", division: "중등부", rounds: [323, 320, 337, 342], total: 1322 },
      { name: "장영한", school: "용하중학교", division: "중등부", rounds: [321, 309, 341, 350], total: 1321 },
      { name: "변현빈", school: "선인중학교", division: "고등부", rounds: [332, 318, 324, 347], total: 1321 },
      { name: "유창현", school: "대전내동중학교", division: "고등부", rounds: [332, 316, 324, 344], total: 1316 },
      { name: "이상원", school: "서야중학교", division: "고등부", rounds: [323, 323, 326, 344], total: 1316 },
      { name: "장대한", school: "용하중학교", division: "고등부", rounds: [321, 310, 334, 350], total: 1315 },
      { name: "최우석", school: "대전대청중학교", division: "고등부", rounds: [327, 320, 323, 343], total: 1313 },
      { name: "신수환", school: "전주온고을중학교", division: "고등부", rounds: [323, 309, 335, 343], total: 1310 },
      { name: "조강민", school: "순천풍덕중학교", division: "중등부", rounds: [326, 300, 338, 344], total: 1308 },
      { name: "이체현", school: "전주온고을중학교", division: "중등부", rounds: [321, 323, 314, 350], total: 1308 },
      { name: "전소익", school: "전주온고을중학교", division: "중등부", rounds: [324, 307, 342, 334], total: 1307 },
      { name: "이진율", school: "불로중학교", division: "중등부", rounds: [330, 312, 323, 342], total: 1307 },
      { name: "김승현", school: "용성중학교", division: "중등부", rounds: [318, 318, 325, 344], total: 1305 },
      { name: "서하랑", school: "운리중학교", division: "고등부", rounds: [319, 300, 336, 349], total: 1304 },
      { name: "임찬혁", school: "만수북중학교", division: "중등부", rounds: [324, 306, 328, 344], total: 1302 },
      { name: "명한결", school: "여수문수중학교", division: "고등부", rounds: [319, 293, 340, 348], total: 1300 },
      { name: "최성민", school: "모라중학교", division: "고등부", rounds: [318, 298, 331, 345], total: 1292 },
      { name: "문보량", school: "대전내동중학교", division: "중등부", rounds: [321, 299, 329, 337], total: 1286 },
      { name: "한승제", school: "광주체육중학교", division: "고등부", rounds: [316, 306, 319, 341], total: 1282 },
      { name: "조여준", school: "광주체육중학교", division: "중등부", rounds: [325, 306, 325, 325], total: 1281 },
      { name: "김강민", school: "무거중학교", division: "고등부", rounds: [309, 300, 322, 343], total: 1274 },
      { name: "황수용", school: "구례중학교", division: "중등부", rounds: [304, 297, 323, 345], total: 1269 },
      { name: "황준우", school: "순천풍덕중학교", division: "중등부", rounds: [319, 279, 331, 337], total: 1266 },
      { name: "유민재", school: "제주양궁클럽1", division: "중등부", rounds: [297, 303, 320, 344], total: 1264 },
      { name: "윤창현", school: "둔내중학교", division: "중등부", rounds: [314, 299, 307, 328], total: 1248 },
      { name: "이채호", school: "전주온고을중학교", division: "고등부", rounds: [302, 302, 314, 321], total: 1239 },
      { name: "전성은", school: "병천중학교", division: "중등부", rounds: [300, 296, 300, 326], total: 1222 },
      { name: "나근도", school: "북원중학교", division: "고등부", rounds: [309, 267, 310, 329], total: 1215 },
      { name: "배민석", school: "무거중학교", division: "고등부", rounds: [292, 267, 292, 322], total: 1173 },
      { name: "곽우승", school: "연일중학교", division: "고등부", rounds: [327, 230, 284, 328], total: 1169 },
      { name: "박현", school: "제주양궁클럽2", division: "중등부", rounds: [275, 240, 283, 302], total: 1100 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0032025AR001AR02W01Q_1_",
    date: "2025-05-27",
    division: "중등부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제54회전국소년체육대회(15세이하부) · 여자리커브중학부개인",
    distances: [60, 50, 40, 30],
    rows: [
      { name: "강수정", school: "광주체육중학교", division: "고등부", rounds: [343, 328, 348, 354], total: 1373 },
      { name: "김가영", school: "경북체육중학교", division: "고등부", rounds: [340, 331, 350, 352], total: 1373 },
      { name: "김아현", school: "신흥여자중학교", division: "고등부", rounds: [342, 331, 345, 354], total: 1372 },
      { name: "우소민", school: "미리벌중학교", division: "중등부", rounds: [332, 335, 350, 353], total: 1370 },
      { name: "이지원", school: "성화중학교", division: "고등부", rounds: [334, 331, 349, 356], total: 1370 },
      { name: "김예린", school: "신흥여자중학교", division: "고등부", rounds: [332, 341, 342, 355], total: 1370 },
      { name: "김수민", school: "모라중학교", division: "고등부", rounds: [344, 337, 341, 347], total: 1369 },
      { name: "김은찬", school: "창용중학교", division: "고등부", rounds: [327, 335, 348, 355], total: 1365 },
      { name: "한정연", school: "여주여자중학교", division: "고등부", rounds: [323, 333, 353, 353], total: 1362 },
      { name: "이효민", school: "대전체육중학교", division: "중등부", rounds: [325, 330, 339, 357], total: 1351 },
      { name: "이한나", school: "중원중학교", division: "중등부", rounds: [326, 336, 343, 346], total: 1351 },
      { name: "강현아", school: "신흥여자중학교", division: "중등부", rounds: [333, 326, 338, 353], total: 1350 },
      { name: "조여민", school: "전주솔빛중학교", division: "중등부", rounds: [330, 329, 339, 347], total: 1345 },
      { name: "김주아", school: "예천여자중학교", division: "중등부", rounds: [335, 323, 342, 344], total: 1344 },
      { name: "오선영", school: "강화여자중학교", division: "중등부", rounds: [333, 325, 328, 356], total: 1342 },
      { name: "이주은", school: "성사중학교", division: "중등부", rounds: [334, 312, 345, 348], total: 1339 },
      { name: "박수연", school: "경북체육중학교", division: "중등부", rounds: [328, 319, 342, 348], total: 1337 },
      { name: "이현주", school: "창성중학교", division: "고등부", rounds: [312, 326, 346, 352], total: 1336 },
      { name: "송수지", school: "남천중학교", division: "중등부", rounds: [328, 321, 339, 348], total: 1336 },
      { name: "김혜윤", school: "여주여자중학교", division: "고등부", rounds: [336, 319, 336, 344], total: 1335 },
      { name: "박가연", school: "모라중학교", division: "중등부", rounds: [330, 331, 331, 343], total: 1335 },
      { name: "고하린", school: "대전대청중학교", division: "고등부", rounds: [335, 316, 336, 344], total: 1331 },
      { name: "손시언", school: "진해여자중학교", division: "중등부", rounds: [325, 317, 337, 350], total: 1329 },
      { name: "채수현", school: "대구체육중학교", division: "중등부", rounds: [331, 308, 340, 349], total: 1328 },
      { name: "임서현", school: "오창중학교", division: "중등부", rounds: [333, 314, 331, 349], total: 1327 },
      { name: "심예인", school: "광주동명중학교", division: "중등부", rounds: [324, 317, 337, 347], total: 1325 },
      { name: "이경민", school: "광주동명중학교", division: "중등부", rounds: [322, 319, 338, 345], total: 1324 },
      { name: "김현서", school: "대전체육중학교", division: "중등부", rounds: [322, 322, 335, 345], total: 1324 },
      { name: "임예율", school: "성화중학교", division: "고등부", rounds: [322, 318, 336, 347], total: 1323 },
      { name: "윤노을", school: "대전대청중학교", division: "중등부", rounds: [329, 305, 333, 355], total: 1322 },
      { name: "강선우", school: "광주동명중학교", division: "고등부", rounds: [323, 326, 329, 344], total: 1322 },
      { name: "이마리", school: "전남체육중학교", division: "고등부", rounds: [323, 314, 337, 347], total: 1321 },
      { name: "이하은", school: "남천중학교", division: "중등부", rounds: [320, 313, 338, 349], total: 1320 },
      { name: "서지우", school: "전주솔빛중학교", division: "고등부", rounds: [317, 316, 337, 345], total: 1315 },
      { name: "신혜민", school: "면목중학교", division: "고등부", rounds: [318, 318, 334, 345], total: 1315 },
      { name: "우가람", school: "용암중학교", division: "중등부", rounds: [326, 314, 327, 345], total: 1312 },
      { name: "이세은", school: "용암중학교", division: "중등부", rounds: [322, 311, 326, 348], total: 1307 },
      { name: "신주하", school: "성사중학교", division: "중등부", rounds: [324, 296, 336, 347], total: 1303 },
      { name: "장인영", school: "홍성여자중학교", division: "중등부", rounds: [317, 304, 333, 348], total: 1302 },
      { name: "이소현", school: "하랑중학교", division: "중등부", rounds: [315, 302, 338, 346], total: 1301 },
      { name: "유예린", school: "전주솔빛중학교", division: "고등부", rounds: [319, 318, 317, 346], total: 1300 },
      { name: "정지민", school: "병천중학교", division: "고등부", rounds: [324, 295, 333, 339], total: 1291 },
      { name: "이선영", school: "예천여자중학교", division: "중등부", rounds: [320, 298, 328, 342], total: 1288 },
      { name: "박소희", school: "전주솔빛중학교", division: "고등부", rounds: [311, 305, 324, 344], total: 1284 },
      { name: "이서현", school: "울산스포츠과학중학교", division: "고등부", rounds: [320, 303, 318, 341], total: 1282 },
      { name: "박소을", school: "양화중학교", division: "중등부", rounds: [309, 310, 330, 330], total: 1279 },
      { name: "윤예진", school: "홍성여자중학교", division: "중등부", rounds: [309, 293, 333, 344], total: 1279 },
      { name: "이서현", school: "진주봉원중학교", division: "고등부", rounds: [315, 290, 326, 346], total: 1277 },
      { name: "이시원", school: "울산스포츠과학중학교", division: "중등부", rounds: [307, 286, 331, 350], total: 1274 },
      { name: "박소민", school: "성화중학교", division: "중등부", rounds: [318, 299, 321, 336], total: 1274 },
      { name: "김재이", school: "홍성여자중학교", division: "고등부", rounds: [305, 292, 340, 335], total: 1272 },
      { name: "정소영", school: "울산스포츠과학중학교", division: "중등부", rounds: [319, 299, 319, 335], total: 1272 },
      { name: "윤소희", school: "하랑중학교", division: "고등부", rounds: [305, 297, 324, 344], total: 1270 },
      { name: "조현아", school: "버들중학교", division: "중등부", rounds: [327, 295, 316, 330], total: 1268 },
      { name: "임나연", school: "울산스포츠과학중학교", division: "고등부", rounds: [312, 276, 334, 339], total: 1261 },
      { name: "박하연", school: "여수문수중학교", division: "중등부", rounds: [319, 279, 323, 339], total: 1260 },
      { name: "이서은", school: "전남체육중학교", division: "중등부", rounds: [311, 271, 315, 326], total: 1223 },
      { name: "최예원", school: "경포중학교", division: "고등부", rounds: [308, 266, 325, 317], total: 1216 },
      { name: "최다은", school: "진해여자중학교", division: "중등부", rounds: [292, 289, 291, 324], total: 1196 },
      { name: "김나경", school: "제주양궁클럽1", division: "중등부", rounds: [297, 258, 284, 332], total: 1171 },
      { name: "강서윤", school: "제주양궁클럽3", division: "중등부", rounds: [291, 235, 300, 326], total: 1152 },
      { name: "유민영", school: "전남체육중학교", division: "중등부", rounds: [264, 241, 297, 326], total: 1128 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0042025AR001AR05W01Q_1_",
    date: "2025-06-29",
    division: "일반부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제43회대통령기전국남여양궁대회 · 여자리커브일반부개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "조아름", school: "현대백화점", division: "일반부", rounds: [340, 349, 336, 355], total: 1380 },
      { name: "유시현", school: "순천시청", division: "일반부", rounds: [335, 345, 343, 354], total: 1377 },
      { name: "박수빈", school: "청주시청", division: "일반부", rounds: [332, 348, 342, 351], total: 1373 },
      { name: "김수린", school: "광주광역시청", division: "일반부", rounds: [334, 348, 335, 355], total: 1372 },
      { name: "이가현", school: "대전시체육회", division: "일반부", rounds: [334, 337, 343, 355], total: 1369 },
      { name: "최미선", school: "광주은행텐텐양궁단", division: "일반부", rounds: [335, 340, 337, 356], total: 1368 },
      { name: "유수정", school: "현대백화점", division: "일반부", rounds: [339, 339, 337, 353], total: 1368 },
      { name: "장민희", school: "인천광역시청", division: "일반부", rounds: [331, 343, 340, 352], total: 1366 },
      { name: "이은아", school: "홍성군청", division: "일반부", rounds: [332, 339, 339, 356], total: 1366 },
      { name: "김이안", school: "현대백화점", division: "일반부", rounds: [329, 346, 336, 353], total: 1364 },
      { name: "이세현", school: "창원시청", division: "일반부", rounds: [332, 343, 334, 355], total: 1364 },
      { name: "정다소미", school: "현대백화점", division: "일반부", rounds: [327, 344, 340, 352], total: 1363 },
      { name: "남수현", school: "순천시청", division: "일반부", rounds: [334, 341, 336, 352], total: 1363 },
      { name: "이윤지", school: "현대모비스", division: "일반부", rounds: [327, 347, 334, 354], total: 1362 },
      { name: "임해진", school: "대전시체육회", division: "일반부", rounds: [337, 345, 327, 351], total: 1360 },
      { name: "한솔", school: "홍성군청", division: "일반부", rounds: [334, 338, 333, 355], total: 1360 },
      { name: "임하나", school: "LH", division: "일반부", rounds: [324, 345, 338, 353], total: 1360 },
      { name: "곽예지", school: "대전시체육회", division: "일반부", rounds: [332, 336, 336, 356], total: 1360 },
      { name: "심예지", school: "청주시청", division: "일반부", rounds: [332, 338, 335, 354], total: 1359 },
      { name: "손서빈", school: "여주시청", division: "일반부", rounds: [323, 344, 335, 356], total: 1358 },
      { name: "홍수남", school: "인천광역시청", division: "일반부", rounds: [334, 334, 334, 355], total: 1357 },
      { name: "박소민", school: "LH", division: "일반부", rounds: [332, 335, 331, 356], total: 1354 },
      { name: "전훈영", school: "인천광역시청", division: "일반부", rounds: [327, 336, 335, 355], total: 1353 },
      { name: "이가영", school: "광주광역시청", division: "일반부", rounds: [330, 338, 332, 353], total: 1353 },
      { name: "정지서", school: "현대모비스", division: "일반부", rounds: [332, 342, 329, 350], total: 1353 },
      { name: "김세연", school: "홍성군청", division: "일반부", rounds: [322, 341, 335, 354], total: 1352 },
      { name: "신정화", school: "전북도청", division: "일반부", rounds: [333, 334, 331, 354], total: 1352 },
      { name: "박소영", school: "여주시청", division: "일반부", rounds: [319, 338, 340, 355], total: 1352 },
      { name: "전성은", school: "현대백화점", division: "일반부", rounds: [329, 335, 332, 354], total: 1350 },
      { name: "김소희", school: "청주시청", division: "일반부", rounds: [322, 341, 331, 354], total: 1348 },
      { name: "박세은", school: "부산도시공사", division: "일반부", rounds: [329, 336, 326, 355], total: 1346 },
      { name: "안희연", school: "청주시청", division: "일반부", rounds: [327, 336, 330, 352], total: 1345 },
      { name: "김서영", school: "인천광역시청", division: "일반부", rounds: [324, 341, 333, 347], total: 1345 },
      { name: "강고은", school: "예천군청", division: "일반부", rounds: [330, 336, 333, 346], total: 1345 },
      { name: "김예후", school: "전북도청", division: "일반부", rounds: [325, 332, 334, 353], total: 1344 },
      { name: "방현주", school: "현대모비스", division: "일반부", rounds: [323, 342, 328, 351], total: 1344 },
      { name: "박은서", school: "부산도시공사", division: "일반부", rounds: [326, 334, 335, 349], total: 1344 },
      { name: "신서빈", school: "대전시체육회", division: "일반부", rounds: [328, 343, 323, 349], total: 1343 },
      { name: "최모경", school: "하이트진로", division: "일반부", rounds: [318, 342, 327, 355], total: 1342 },
      { name: "김아영", school: "전북도청", division: "일반부", rounds: [328, 336, 329, 348], total: 1341 },
      { name: "우경림", school: "창원시청", division: "일반부", rounds: [323, 338, 326, 354], total: 1341 },
      { name: "이다빈", school: "하이트진로", division: "일반부", rounds: [324, 338, 325, 353], total: 1340 },
      { name: "심다정", school: "예천군청", division: "일반부", rounds: [334, 332, 325, 349], total: 1340 },
      { name: "이은경", school: "순천시청", division: "일반부", rounds: [319, 338, 332, 350], total: 1339 },
      { name: "황재민", school: "창원시청", division: "일반부", rounds: [321, 334, 331, 353], total: 1339 },
      { name: "전완서", school: "광주광역시청", division: "일반부", rounds: [323, 335, 334, 347], total: 1339 },
      { name: "임두나", school: "LH", division: "일반부", rounds: [318, 334, 329, 356], total: 1337 },
      { name: "박나원", school: "하이트진로", division: "일반부", rounds: [325, 337, 321, 353], total: 1336 },
      { name: "최예지", school: "대구서구청", division: "일반부", rounds: [313, 332, 335, 355], total: 1335 },
      { name: "손예령", school: "부산도시공사", division: "일반부", rounds: [322, 335, 328, 350], total: 1335 },
      { name: "전인아", school: "전북도청", division: "일반부", rounds: [319, 325, 337, 352], total: 1333 },
      { name: "김채윤", school: "광주광역시청", division: "일반부", rounds: [310, 339, 332, 351], total: 1332 },
      { name: "이나영", school: "창원시청", division: "일반부", rounds: [322, 338, 323, 349], total: 1332 },
      { name: "조수빈", school: "예천군청", division: "일반부", rounds: [324, 328, 329, 349], total: 1330 },
      { name: "이다희", school: "LH", division: "일반부", rounds: [329, 336, 319, 346], total: 1330 },
      { name: "곽진영", school: "광주은행텐텐양궁단", division: "일반부", rounds: [319, 332, 327, 351], total: 1329 },
      { name: "주혜빈", school: "대구서구청", division: "일반부", rounds: [315, 342, 322, 350], total: 1329 },
      { name: "김예림", school: "여주시청", division: "일반부", rounds: [327, 337, 324, 341], total: 1329 },
      { name: "임정민", school: "대구서구청", division: "일반부", rounds: [327, 332, 316, 350], total: 1325 },
      { name: "박재희", school: "홍성군청", division: "일반부", rounds: [318, 336, 324, 345], total: 1323 },
      { name: "김아현", school: "여주시청", division: "일반부", rounds: [330, 330, 320, 335], total: 1315 },
      { name: "이혜민", school: "예천군청", division: "일반부", rounds: [321, 329, 318, 347], total: 1315 },
      { name: "김정윤", school: "광주은행텐텐양궁단", division: "일반부", rounds: [323, 328, 320, 343], total: 1314 },
      { name: "최예진", school: "광주은행텐텐양궁단", division: "일반부", rounds: [304, 327, 312, 344], total: 1287 },
      { name: "강채영", school: "현대모비스", division: "일반부", rounds: [0, 0, 0, 0], total: 0 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0052025AR001AR03W01Q_1_",
    date: "2025-07-12",
    division: "고등부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "화랑기제46회전국시도대항양궁대회 · 여자리커브고등부개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "김민정", school: "대전체육고등학교", division: "고등부", rounds: [327, 344, 343, 351], total: 1365 },
      { name: "유슬하", school: "전북체육고등학교", division: "대학부", rounds: [334, 338, 336, 351], total: 1359 },
      { name: "강민진", school: "경주여자고등학교", division: "대학부", rounds: [340, 337, 329, 351], total: 1357 },
      { name: "남지현", school: "광주체육고등학교", division: "대학부", rounds: [331, 336, 335, 353], total: 1355 },
      { name: "김예원", school: "여강고등학교", division: "고등부", rounds: [333, 339, 333, 350], total: 1355 },
      { name: "양가은", school: "부개고등학교", division: "고등부", rounds: [335, 331, 332, 356], total: 1354 },
      { name: "한지예", school: "경기체육고등학교", division: "고등부", rounds: [338, 336, 330, 348], total: 1352 },
      { name: "윤수희", school: "대구체육고등학교", division: "대학부", rounds: [334, 336, 327, 354], total: 1351 },
      { name: "이가영", school: "예천여자고등학교", division: "고등부", rounds: [337, 333, 333, 348], total: 1351 },
      { name: "구슬", school: "경기체육고등학교", division: "고등부", rounds: [335, 336, 328, 350], total: 1349 },
      { name: "조한이", school: "순천여자고등학교", division: "대학부", rounds: [334, 343, 319, 352], total: 1348 },
      { name: "정서은", school: "예천여자고등학교", division: "고등부", rounds: [331, 336, 335, 345], total: 1347 },
      { name: "김정은", school: "부산체육고등학교", division: "고등부", rounds: [327, 335, 331, 354], total: 1347 },
      { name: "황하정", school: "서울체육고등학교", division: "대학부", rounds: [327, 338, 326, 352], total: 1343 },
      { name: "김하은", school: "전남체육고등학교", division: "대학부", rounds: [329, 338, 329, 347], total: 1343 },
      { name: "이경현", school: "경기체육고등학교", division: "고등부", rounds: [328, 333, 331, 351], total: 1343 },
      { name: "양다혜", school: "진해여자고등학교", division: "고등부", rounds: [331, 340, 324, 347], total: 1342 },
      { name: "김나은", school: "경주여자고등학교", division: "고등부", rounds: [333, 331, 325, 351], total: 1340 },
      { name: "장보슬", school: "예천여자고등학교", division: "대학부", rounds: [331, 334, 320, 353], total: 1338 },
      { name: "구보름", school: "부산체육고등학교", division: "고등부", rounds: [327, 332, 330, 348], total: 1337 },
      { name: "이주예", school: "성문고등학교", division: "대학부", rounds: [332, 331, 326, 347], total: 1336 },
      { name: "박효빈", school: "전남체육고등학교", division: "대학부", rounds: [333, 341, 321, 341], total: 1336 },
      { name: "박세빈", school: "전남체육고등학교", division: "고등부", rounds: [324, 337, 331, 343], total: 1335 },
      { name: "전지현", school: "광주체육고등학교", division: "고등부", rounds: [323, 335, 331, 346], total: 1335 },
      { name: "강은지", school: "경남체육고등학교", division: "고등부", rounds: [322, 336, 327, 349], total: 1334 },
      { name: "이채은", school: "대구체육고등학교", division: "고등부", rounds: [318, 339, 326, 351], total: 1334 },
      { name: "장혜주", school: "예천여자고등학교", division: "고등부", rounds: [328, 332, 327, 347], total: 1334 },
      { name: "이연우", school: "경북체육고등학교", division: "대학부", rounds: [323, 342, 320, 349], total: 1334 },
      { name: "김가을", school: "강원체육고등학교", division: "고등부", rounds: [324, 333, 326, 349], total: 1332 },
      { name: "김민서", school: "대구체육고등학교", division: "고등부", rounds: [325, 335, 324, 348], total: 1332 },
      { name: "송하린", school: "광주체육고등학교", division: "고등부", rounds: [314, 344, 331, 342], total: 1331 },
      { name: "양태희", school: "경기체육고등학교", division: "고등부", rounds: [329, 328, 323, 350], total: 1330 },
      { name: "김수연", school: "제주양궁클럽1", division: "고등부", rounds: [324, 337, 321, 348], total: 1330 },
      { name: "정수연", school: "부개고등학교", division: "고등부", rounds: [324, 339, 322, 344], total: 1329 },
      { name: "윤가영", school: "홍성여자고등학교", division: "고등부", rounds: [326, 331, 321, 350], total: 1328 },
      { name: "김하나", school: "예천여자고등학교", division: "고등부", rounds: [319, 333, 326, 350], total: 1328 },
      { name: "서희예", school: "대구체육고등학교", division: "대학부", rounds: [322, 331, 332, 342], total: 1327 },
      { name: "김세아", school: "울산스포츠과학고등학교", division: "고등부", rounds: [321, 336, 329, 339], total: 1325 },
      { name: "김정빈", school: "경기체육고등학교", division: "고등부", rounds: [322, 324, 325, 353], total: 1324 },
      { name: "김지원", school: "서울체육고등학교", division: "고등부", rounds: [318, 330, 327, 349], total: 1324 },
      { name: "김지은", school: "진해여자고등학교", division: "고등부", rounds: [313, 332, 333, 346], total: 1324 },
      { name: "김도영", school: "대구체육고등학교", division: "대학부", rounds: [325, 337, 316, 345], total: 1323 },
      { name: "김시우", school: "순천여자고등학교", division: "대학부", rounds: [321, 333, 316, 352], total: 1322 },
      { name: "정세리", school: "진해여자고등학교", division: "고등부", rounds: [322, 333, 324, 341], total: 1320 },
      { name: "배현지", school: "전북체육고등학교", division: "고등부", rounds: [326, 335, 310, 345], total: 1316 },
      { name: "최윤서", school: "경기체육고등학교", division: "고등부", rounds: [323, 325, 321, 346], total: 1315 },
      { name: "정유정", school: "경기체육고등학교", division: "대학부", rounds: [315, 334, 316, 349], total: 1314 },
      { name: "김정연", school: "서울체육고등학교", division: "대학부", rounds: [315, 335, 314, 349], total: 1313 },
      { name: "박민지", school: "부개고등학교", division: "대학부", rounds: [324, 322, 320, 347], total: 1313 },
      { name: "신여은", school: "대구체육고등학교", division: "고등부", rounds: [326, 328, 317, 341], total: 1312 },
      { name: "나윤경", school: "울산스포츠과학고등학교", division: "고등부", rounds: [322, 332, 315, 343], total: 1312 },
      { name: "장율리", school: "울산스포츠과학고등학교", division: "대학부", rounds: [318, 328, 321, 345], total: 1312 },
      { name: "김봄", school: "순천여자고등학교", division: "대학부", rounds: [322, 320, 321, 348], total: 1311 },
      { name: "김서윤", school: "부개고등학교", division: "고등부", rounds: [310, 330, 320, 350], total: 1310 },
      { name: "김예인", school: "부산체육고등학교", division: "고등부", rounds: [308, 323, 325, 352], total: 1308 },
      { name: "배소윤", school: "부산체육고등학교", division: "고등부", rounds: [315, 334, 317, 340], total: 1306 },
      { name: "김은지", school: "대구체육고등학교", division: "고등부", rounds: [311, 325, 322, 343], total: 1301 },
      { name: "라혜빈", school: "전북펫고등학교", division: "고등부", rounds: [321, 329, 305, 344], total: 1299 },
      { name: "하윤진", school: "서울체육고등학교", division: "고등부", rounds: [314, 335, 310, 340], total: 1299 },
      { name: "하윤선", school: "서울체육고등학교", division: "대학부", rounds: [313, 314, 325, 347], total: 1299 },
      { name: "김하윤", school: "홍성여자고등학교", division: "고등부", rounds: [310, 318, 319, 349], total: 1296 },
      { name: "최은", school: "서울체육고등학교", division: "고등부", rounds: [308, 325, 320, 343], total: 1296 },
      { name: "신서영", school: "부개고등학교", division: "고등부", rounds: [313, 318, 323, 341], total: 1295 },
      { name: "박지율", school: "대전체육고등학교", division: "고등부", rounds: [306, 320, 323, 344], total: 1293 },
      { name: "김주은", school: "전북체육고등학교", division: "대학부", rounds: [312, 322, 318, 341], total: 1293 },
      { name: "권예랑", school: "전북체육고등학교", division: "대학부", rounds: [315, 321, 323, 332], total: 1291 },
      { name: "박정현", school: "경북체육고등학교", division: "대학부", rounds: [317, 328, 310, 333], total: 1288 },
      { name: "김민솔", school: "원주여자고등학교", division: "대학부", rounds: [307, 320, 316, 345], total: 1288 },
      { name: "김서영", school: "성문고등학교", division: "고등부", rounds: [319, 318, 311, 337], total: 1285 },
      { name: "김서현", school: "서울체육고등학교", division: "고등부", rounds: [313, 315, 312, 337], total: 1277 },
      { name: "최정인", school: "대구체육고등학교", division: "대학부", rounds: [310, 310, 311, 345], total: 1276 },
      { name: "강주은", school: "전남체육고등학교", division: "고등부", rounds: [307, 316, 309, 342], total: 1274 },
      { name: "한소혜", school: "경주여자고등학교", division: "대학부", rounds: [321, 318, 293, 342], total: 1274 },
      { name: "박채린", school: "강원체육고등학교", division: "고등부", rounds: [310, 320, 294, 348], total: 1272 },
      { name: "이율아", school: "광주체육고등학교", division: "대학부", rounds: [313, 326, 304, 329], total: 1272 },
      { name: "고민지", school: "하성고등학교", division: "고등부", rounds: [300, 321, 310, 337], total: 1268 },
      { name: "박가은", school: "경기체육고등학교", division: "대학부", rounds: [304, 328, 298, 337], total: 1267 },
      { name: "김민지", school: "서울체육고등학교", division: "고등부", rounds: [311, 320, 303, 330], total: 1264 },
      { name: "김소민", school: "여강고등학교", division: "고등부", rounds: [294, 313, 307, 348], total: 1262 },
      { name: "이주언", school: "경주여자고등학교", division: "대학부", rounds: [308, 304, 305, 343], total: 1260 },
      { name: "이다은", school: "순천여자고등학교", division: "고등부", rounds: [296, 317, 300, 343], total: 1256 },
      { name: "김성령", school: "광주체육고등학교", division: "고등부", rounds: [294, 331, 306, 323], total: 1254 },
      { name: "이채민", school: "서울체육고등학교", division: "고등부", rounds: [299, 314, 295, 340], total: 1248 },
      { name: "박경빈", school: "부개고등학교", division: "고등부", rounds: [319, 311, 279, 334], total: 1243 },
      { name: "홍다은", school: "광주체육고등학교", division: "고등부", rounds: [301, 301, 299, 332], total: 1233 },
      { name: "김민아", school: "진해여자고등학교", division: "고등부", rounds: [290, 305, 290, 332], total: 1217 },
      { name: "김라함", school: "강원체육고등학교", division: "고등부", rounds: [271, 294, 296, 334], total: 1195 },
      { name: "이연서", school: "북평여자고등학교", division: "대학부", rounds: [290, 297, 275, 332], total: 1194 },
      { name: "정서윤", school: "성남시체육회1", division: "고등부", rounds: [285, 304, 246, 325], total: 1160 },
      { name: "오시연", school: "여강고등학교", division: "고등부", rounds: [273, 299, 268, 319], total: 1159 },
      { name: "김다연", school: "대전체육고등학교", division: "고등부", rounds: [259, 279, 254, 327], total: 1119 },
      { name: "엄수정", school: "원주여자고등학교", division: "고등부", rounds: [0, 0, 0, 0], total: 0 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0062025AR001AR01M010Q_1_",
    date: "2025-08-24",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제37회회장기전국남여초등학교양궁대회 · 남자리커브초등부U-10(1~4학년) 개인",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "이윤기", school: "대구동부초등학교", division: "초등부(통합)", rounds: [331, 334, 343, 354], total: 1362 },
      { name: "이지호", school: "오창초등학교", division: "초등부(통합)", rounds: [321, 337, 330, 348], total: 1336 },
      { name: "이지원", school: "예천초등학교", division: "초등부(통합)", rounds: [321, 324, 332, 349], total: 1326 },
      { name: "박지후", school: "창녕초등학교", division: "초등부(통합)", rounds: [309, 328, 329, 351], total: 1317 },
      { name: "김도헌", school: "대구동부초등학교", division: "초등부(통합)", rounds: [315, 326, 327, 345], total: 1313 },
      { name: "김라원", school: "새일초등학교", division: "초등부(통합)", rounds: [305, 317, 338, 343], total: 1303 },
      { name: "김영민", school: "연무초등학교", division: "초등부(통합)", rounds: [309, 316, 328, 339], total: 1292 },
      { name: "이하준", school: "대구동부초등학교", division: "초등부(통합)", rounds: [307, 312, 328, 342], total: 1289 },
      { name: "김여울", school: "용성초등학교", division: "초등부(통합)", rounds: [300, 328, 322, 338], total: 1288 },
      { name: "김태윤", school: "예천초등학교", division: "초등부(통합)", rounds: [284, 320, 333, 341], total: 1278 },
      { name: "김영재", school: "연무초등학교", division: "초등부(통합)", rounds: [296, 310, 335, 332], total: 1273 },
      { name: "주재훈", school: "봉원초등학교", division: "초등부(통합)", rounds: [302, 307, 323, 335], total: 1267 },
      { name: "이시곤", school: "대전송촌초등학교", division: "초등부(통합)", rounds: [304, 302, 321, 337], total: 1264 },
      { name: "곽상우", school: "이원초등학교", division: "초등부(통합)", rounds: [301, 295, 331, 334], total: 1261 },
      { name: "최강빈", school: "천현초등학교", division: "초등부(통합)", rounds: [287, 307, 329, 336], total: 1259 },
      { name: "박찬석", school: "인천용현남초등학교", division: "초등부(통합)", rounds: [289, 317, 324, 327], total: 1257 },
      { name: "김진표", school: "인천부평서초등학교", division: "초등부(통합)", rounds: [287, 300, 330, 334], total: 1251 },
      { name: "유선유", school: "연무초등학교", division: "초등부(통합)", rounds: [277, 310, 322, 341], total: 1250 },
      { name: "전준표", school: "장유초등학교", division: "초등부(통합)", rounds: [281, 311, 324, 334], total: 1250 },
      { name: "장현우", school: "인천부평서초등학교", division: "초등부(통합)", rounds: [285, 295, 327, 341], total: 1248 },
      { name: "고태호", school: "대전서부초등학교", division: "초등부(통합)", rounds: [296, 301, 320, 330], total: 1247 },
      { name: "이승원", school: "대구불로초등학교", division: "초등부(통합)", rounds: [293, 306, 315, 332], total: 1246 },
      { name: "장재하", school: "괴산명덕초등학교", division: "초등부(통합)", rounds: [284, 303, 320, 332], total: 1239 },
      { name: "고준혁", school: "예천초등학교", division: "초등부(통합)", rounds: [271, 310, 324, 333], total: 1238 },
      { name: "민해양", school: "봉원초등학교", division: "초등부(통합)", rounds: [307, 286, 313, 329], total: 1235 },
      { name: "황다겸", school: "태서초등학교", division: "초등부(통합)", rounds: [281, 299, 314, 336], total: 1230 },
      { name: "변지성", school: "인천부평서초등학교", division: "초등부(통합)", rounds: [280, 296, 325, 324], total: 1225 },
      { name: "김동진", school: "명륜초등학교", division: "초등부(통합)", rounds: [262, 295, 318, 333], total: 1208 },
      { name: "최서빈", school: "장유초등학교", division: "초등부(통합)", rounds: [269, 294, 309, 330], total: 1202 },
      { name: "이재용", school: "충주금릉초등학교", division: "초등부(통합)", rounds: [283, 300, 309, 304], total: 1196 },
      { name: "김호야", school: "용하초등학교", division: "초등부(통합)", rounds: [283, 292, 306, 311], total: 1192 },
      { name: "김지완", school: "대전송촌초등학교", division: "초등부(통합)", rounds: [262, 278, 314, 334], total: 1188 },
      { name: "조민혁", school: "설악초등학교", division: "초등부(통합)", rounds: [258, 296, 308, 319], total: 1181 },
      { name: "오지우", school: "모덕초등학교", division: "초등부(통합)", rounds: [257, 292, 302, 329], total: 1180 },
      { name: "김다온", school: "인천계산초등학교", division: "초등부(통합)", rounds: [277, 276, 290, 329], total: 1172 },
      { name: "손유빈", school: "삼정초등학교", division: "초등부(통합)", rounds: [256, 298, 302, 313], total: 1169 },
      { name: "윤희성", school: "서울개봉초등학교", division: "초등부(통합)", rounds: [251, 289, 310, 318], total: 1168 },
      { name: "이지호", school: "괴산명덕초등학교", division: "초등부(통합)", rounds: [264, 291, 288, 321], total: 1164 },
      { name: "김상우", school: "장유초등학교", division: "초등부(통합)", rounds: [276, 285, 282, 321], total: 1164 },
      { name: "나하흠", school: "새일초등학교", division: "초등부(통합)", rounds: [284, 290, 281, 306], total: 1161 },
      { name: "박수호", school: "창녕초등학교", division: "초등부(통합)", rounds: [247, 289, 299, 323], total: 1158 },
      { name: "조우석", school: "서울개봉초등학교", division: "초등부(통합)", rounds: [241, 278, 308, 327], total: 1154 },
      { name: "구민준", school: "교동초등학교", division: "초등부(통합)", rounds: [235, 289, 291, 323], total: 1138 },
      { name: "홍석환", school: "새일초등학교", division: "초등부(통합)", rounds: [263, 245, 307, 316], total: 1131 },
      { name: "정연오", school: "서울인헌초등학교", division: "초등부(통합)", rounds: [239, 277, 285, 320], total: 1121 },
      { name: "박종현", school: "설악초등학교", division: "초등부(통합)", rounds: [248, 291, 275, 305], total: 1119 },
      { name: "이준", school: "삼정초등학교", division: "초등부(통합)", rounds: [223, 281, 280, 325], total: 1109 },
      { name: "이윤", school: "인천부평서초등학교", division: "초등부(통합)", rounds: [217, 280, 289, 317], total: 1103 },
      { name: "최유담", school: "태서초등학교", division: "초등부(통합)", rounds: [247, 272, 260, 314], total: 1093 },
      { name: "최현준", school: "플랜비스포츠4", division: "초등부(통합)", rounds: [226, 261, 290, 296], total: 1073 },
      { name: "김단우", school: "경산서부초등학교", division: "초등부(통합)", rounds: [244, 201, 300, 309], total: 1054 },
      { name: "장민준", school: "두암초등학교", division: "초등부(통합)", rounds: [215, 266, 258, 290], total: 1029 },
      { name: "고태환", school: "성진초등학교", division: "초등부(통합)", rounds: [214, 250, 279, 280], total: 1023 },
      { name: "정인후", school: "대구송현초등학교", division: "초등부(통합)", rounds: [255, 190, 281, 281], total: 1007 },
      { name: "김영웅", school: "인천계산초등학교", division: "초등부(통합)", rounds: [207, 247, 262, 283], total: 999 },
      { name: "최우빈", school: "천현초등학교", division: "초등부(통합)", rounds: [218, 241, 233, 275], total: 967 },
      { name: "김형진", school: "태서초등학교", division: "초등부(통합)", rounds: [190, 240, 264, 267], total: 961 },
      { name: "정호윤", school: "인천계산초등학교", division: "초등부(통합)", rounds: [208, 250, 242, 261], total: 961 },
      { name: "이소율", school: "봉원초등학교", division: "초등부(통합)", rounds: [217, 216, 235, 287], total: 955 },
      { name: "배단우", school: "서울개봉초등학교", division: "초등부(통합)", rounds: [212, 244, 232, 223], total: 911 },
      { name: "강태현", school: "태서초등학교", division: "초등부(통합)", rounds: [159, 234, 214, 263], total: 870 },
      { name: "이정현", school: "전주기린초등학교", division: "초등부(통합)", rounds: [0, 221, 241, 266], total: 728 },
      { name: "김강우", school: "명륜초등학교", division: "초등부(통합)", rounds: [0, 0, 287, 306], total: 593 },
      { name: "김현승", school: "서울청량초등학교", division: "초등부(통합)", rounds: [0, 0, 220, 231], total: 451 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0272025AR001AR03M01Q_2_",
    date: "2025-07-27",
    division: "고등부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제52회한국중고양궁연맹회장기대회 · 남자리커브고등부개인",
    distances: [90, 70, 50, 30],
    rows: [
      { name: "최철준", school: "강원체육고등학교", division: "대학부", rounds: [323, 342, 342, 354], total: 1361 },
      { name: "김태현", school: "효원고등학교", division: "고등부", rounds: [315, 338, 343, 354], total: 1350 },
      { name: "조세현", school: "서울체육고등학교", division: "고등부", rounds: [316, 337, 337, 356], total: 1346 },
      { name: "박명재", school: "서울체육고등학교", division: "고등부", rounds: [317, 335, 340, 354], total: 1346 },
      { name: "송지성", school: "전북체육고등학교", division: "대학부", rounds: [316, 333, 338, 357], total: 1344 },
      { name: "박성우", school: "인천체육고등학교", division: "대학부", rounds: [327, 327, 335, 350], total: 1339 },
      { name: "조성윤", school: "충북체육고등학교", division: "고등부", rounds: [314, 327, 341, 356], total: 1338 },
      { name: "심유한", school: "광주체육고등학교", division: "고등부", rounds: [309, 334, 337, 357], total: 1337 },
      { name: "김태서", school: "충북체육고등학교", division: "고등부", rounds: [306, 335, 338, 355], total: 1334 },
      { name: "오예인", school: "부산체육고등학교", division: "고등부", rounds: [307, 334, 339, 353], total: 1333 },
      { name: "박은성", school: "대전체육고등학교", division: "대학부", rounds: [313, 336, 336, 348], total: 1333 },
      { name: "조성철", school: "광주체육고등학교", division: "대학부", rounds: [318, 336, 326, 350], total: 1330 },
      { name: "지호준", school: "서울체육고등학교", division: "대학부", rounds: [315, 328, 333, 353], total: 1329 },
      { name: "이희범", school: "경북고등학교", division: "고등부", rounds: [308, 333, 339, 349], total: 1329 },
      { name: "권태연", school: "경기체육고등학교", division: "대학부", rounds: [312, 330, 333, 352], total: 1327 },
      { name: "이승명", school: "경북체육고등학교", division: "대학부", rounds: [318, 332, 333, 344], total: 1327 },
      { name: "김성용", school: "광주체육고등학교", division: "고등부", rounds: [307, 334, 333, 352], total: 1326 },
      { name: "김성준", school: "경북체육고등학교", division: "고등부", rounds: [309, 333, 330, 353], total: 1325 },
      { name: "권용민", school: "경기체육고등학교", division: "고등부", rounds: [315, 327, 335, 347], total: 1324 },
      { name: "장은석", school: "부산체육고등학교", division: "대학부", rounds: [306, 330, 336, 351], total: 1323 },
      { name: "금왕산", school: "충북체육고등학교", division: "고등부", rounds: [307, 330, 328, 354], total: 1319 },
      { name: "박정우", school: "부산체육고등학교", division: "고등부", rounds: [300, 329, 336, 354], total: 1319 },
      { name: "김범진", school: "경북고등학교", division: "고등부", rounds: [312, 322, 333, 351], total: 1318 },
      { name: "권오율", school: "대전체육고등학교", division: "고등부", rounds: [310, 336, 323, 349], total: 1318 },
      { name: "여우영", school: "강원체육고등학교", division: "고등부", rounds: [298, 331, 334, 353], total: 1316 },
      { name: "제갈윤", school: "경북고등학교", division: "대학부", rounds: [310, 330, 325, 347], total: 1312 },
      { name: "이태건", school: "강원체육고등학교", division: "고등부", rounds: [302, 334, 331, 345], total: 1312 },
      { name: "배정원", school: "광주체육고등학교", division: "대학부", rounds: [313, 326, 326, 347], total: 1312 },
      { name: "김동욱", school: "대전체육고등학교", division: "고등부", rounds: [305, 324, 328, 353], total: 1310 },
      { name: "정승욱", school: "서울체육고등학교", division: "고등부", rounds: [303, 329, 331, 347], total: 1310 },
      { name: "임은재", school: "인천영선고등학교", division: "고등부", rounds: [298, 331, 324, 352], total: 1305 },
      { name: "김시우", school: "경기체육고등학교", division: "고등부", rounds: [303, 326, 330, 344], total: 1303 },
      { name: "신재원", school: "충북체육고등학교", division: "대학부", rounds: [310, 318, 326, 348], total: 1302 },
      { name: "성하준", school: "서울체육고등학교", division: "고등부", rounds: [314, 323, 316, 349], total: 1302 },
      { name: "전준희", school: "광주체육고등학교", division: "대학부", rounds: [293, 323, 336, 349], total: 1301 },
      { name: "송태민", school: "서울체육고등학교", division: "대학부", rounds: [310, 329, 314, 348], total: 1301 },
      { name: "노지원", school: "대전체육고등학교", division: "고등부", rounds: [301, 321, 335, 344], total: 1301 },
      { name: "김태호", school: "경북고등학교", division: "고등부", rounds: [309, 324, 315, 351], total: 1299 },
      { name: "권재현", school: "경북고등학교", division: "고등부", rounds: [303, 323, 323, 349], total: 1298 },
      { name: "윤동영", school: "광주체육고등학교", division: "고등부", rounds: [299, 320, 327, 351], total: 1297 },
      { name: "신승현", school: "전북체육고등학교", division: "고등부", rounds: [298, 319, 332, 348], total: 1297 },
      { name: "신민재", school: "부산체육고등학교", division: "고등부", rounds: [297, 319, 326, 350], total: 1292 },
      { name: "김명수", school: "효원고등학교", division: "고등부", rounds: [304, 323, 327, 338], total: 1292 },
      { name: "한경수", school: "경기체육고등학교", division: "고등부", rounds: [286, 322, 331, 352], total: 1291 },
      { name: "최제웅", school: "경기체육고등학교", division: "고등부", rounds: [298, 327, 324, 342], total: 1291 },
      { name: "천하준", school: "서야고등학교", division: "고등부", rounds: [291, 325, 321, 353], total: 1290 },
      { name: "김부영", school: "충북체육고등학교", division: "고등부", rounds: [289, 317, 334, 348], total: 1288 },
      { name: "김종연", school: "광주체육고등학교", division: "고등부", rounds: [294, 329, 316, 346], total: 1285 },
      { name: "주재윤", school: "효원고등학교", division: "고등부", rounds: [297, 320, 328, 340], total: 1285 },
      { name: "신희범", school: "인천영선고등학교", division: "고등부", rounds: [294, 317, 324, 349], total: 1284 },
      { name: "신재윤", school: "서울체육고등학교", division: "고등부", rounds: [297, 319, 318, 349], total: 1283 },
      { name: "윤성환", school: "인천체육고등학교", division: "대학부", rounds: [296, 309, 325, 352], total: 1282 },
      { name: "유홍현", school: "전북체육고등학교", division: "대학부", rounds: [301, 312, 326, 343], total: 1282 },
      { name: "김민우", school: "인천체육고등학교", division: "고등부", rounds: [292, 322, 320, 348], total: 1282 },
      { name: "안채빈", school: "인천영선고등학교", division: "대학부", rounds: [299, 314, 330, 338], total: 1281 },
      { name: "고은찬", school: "대전체육고등학교", division: "고등부", rounds: [281, 317, 329, 353], total: 1280 },
      { name: "김준성", school: "경기체육고등학교", division: "고등부", rounds: [288, 316, 324, 352], total: 1280 },
      { name: "진은석", school: "인천체육고등학교", division: "대학부", rounds: [278, 330, 323, 349], total: 1280 },
      { name: "최시후", school: "경남체육고등학교", division: "대학부", rounds: [297, 321, 325, 336], total: 1279 },
      { name: "송석민", school: "대전체육고등학교", division: "고등부", rounds: [274, 322, 330, 350], total: 1276 },
      { name: "이구식", school: "경남체육고등학교", division: "고등부", rounds: [304, 310, 317, 343], total: 1274 },
      { name: "여상민", school: "경북고등학교", division: "고등부", rounds: [290, 315, 319, 349], total: 1273 },
      { name: "서익언", school: "순천고등학교", division: "고등부", rounds: [287, 328, 323, 334], total: 1272 },
      { name: "이재헌", school: "인천체육고등학교", division: "고등부", rounds: [288, 315, 323, 343], total: 1269 },
      { name: "이지호", school: "경북일고등학교", division: "고등부", rounds: [284, 314, 326, 342], total: 1266 },
      { name: "박진호", school: "인천체육고등학교", division: "고등부", rounds: [307, 306, 314, 338], total: 1265 },
      { name: "강동한", school: "강원체육고등학교", division: "대학부", rounds: [301, 313, 309, 339], total: 1262 },
      { name: "김은찬", school: "효원고등학교", division: "고등부", rounds: [273, 315, 323, 350], total: 1261 },
      { name: "정재웅", school: "인천영선고등학교", division: "고등부", rounds: [288, 318, 312, 342], total: 1260 },
      { name: "박건호", school: "인천체육고등학교", division: "고등부", rounds: [276, 317, 323, 342], total: 1258 },
      { name: "윤의섭", school: "광주체육고등학교", division: "고등부", rounds: [268, 321, 324, 344], total: 1257 },
      { name: "윤정민", school: "강원체육고등학교", division: "고등부", rounds: [279, 321, 307, 349], total: 1256 },
      { name: "강연수", school: "부산체육고등학교", division: "고등부", rounds: [277, 325, 311, 342], total: 1255 },
      { name: "박상준", school: "경북일고등학교", division: "고등부", rounds: [299, 313, 309, 333], total: 1254 },
      { name: "편서준", school: "효원고등학교", division: "고등부", rounds: [285, 313, 310, 345], total: 1253 },
      { name: "이진혁", school: "부산체육고등학교", division: "고등부", rounds: [295, 318, 302, 337], total: 1252 },
      { name: "장태하", school: "서울체육고등학교", division: "고등부", rounds: [294, 301, 311, 344], total: 1250 },
      { name: "김성민", school: "광주체육고등학교", division: "대학부", rounds: [283, 302, 326, 337], total: 1248 },
      { name: "조예성", school: "경남체육고등학교", division: "고등부", rounds: [270, 318, 308, 346], total: 1242 },
      { name: "김규성", school: "서야고등학교", division: "고등부", rounds: [289, 306, 309, 336], total: 1240 },
      { name: "최승원", school: "강원체육고등학교", division: "고등부", rounds: [291, 297, 314, 333], total: 1235 },
      { name: "김주엽", school: "인천체육고등학교", division: "고등부", rounds: [275, 321, 295, 339], total: 1230 },
      { name: "손영훈", school: "서야고등학교", division: "고등부", rounds: [281, 303, 300, 346], total: 1230 },
      { name: "박주호", school: "효원고등학교", division: "대학부", rounds: [273, 303, 304, 347], total: 1227 },
      { name: "길대현", school: "대전체육고등학교", division: "고등부", rounds: [261, 313, 310, 337], total: 1221 },
      { name: "박주경", school: "대전체육고등학교", division: "고등부", rounds: [269, 301, 301, 348], total: 1219 },
      { name: "최시윤", school: "경남체육고등학교", division: "고등부", rounds: [257, 308, 302, 332], total: 1199 },
      { name: "최시후", school: "경기체육고등학교", division: "고등부", rounds: [268, 303, 288, 337], total: 1196 },
      { name: "김은찬", school: "경북체육고등학교", division: "대학부", rounds: [261, 295, 304, 325], total: 1185 },
      { name: "장동영", school: "전북체육고등학교", division: "대학부", rounds: [265, 300, 292, 321], total: 1178 },
      { name: "김기영", school: "순천고등학교", division: "고등부", rounds: [253, 302, 288, 333], total: 1176 },
      { name: "박현", school: "경북일고등학교", division: "대학부", rounds: [252, 294, 293, 330], total: 1169 },
      { name: "김제준", school: "경북체육고등학교", division: "고등부", rounds: [256, 287, 300, 326], total: 1169 },
      { name: "최준원", school: "강원체육고등학교", division: "고등부", rounds: [267, 278, 266, 323], total: 1134 },
      { name: "고범찬", school: "경남체육고등학교", division: "고등부", rounds: [238, 277, 280, 325], total: 1120 },
      { name: "김명찬", school: "순천고등학교", division: "대학부", rounds: [234, 277, 277, 326], total: 1114 },
      { name: "권태윤", school: "병천고등학교", division: "고등부", rounds: [248, 278, 257, 323], total: 1106 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0282025AR001AR04M01Q_1_",
    date: "2025-07-18",
    division: "대학부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제28회한국대학연맹회장기대회 · 남자리커브대학부개인",
    distances: [90, 70, 50, 30],
    rows: [
      { name: "민성욱", school: "한국체육대학교", division: "대학부", rounds: [317, 342, 332, 356], total: 1347 },
      { name: "지예찬", school: "한국체육대학교", division: "대학부", rounds: [330, 335, 327, 353], total: 1345 },
      { name: "최두희", school: "경희대학교", division: "대학부", rounds: [319, 336, 332, 351], total: 1338 },
      { name: "김종우", school: "한국체육대학교", division: "대학부", rounds: [318, 341, 325, 353], total: 1337 },
      { name: "박태현", school: "울산대학교", division: "대학부", rounds: [323, 335, 331, 348], total: 1337 },
      { name: "김동훈", school: "국립경국대학교", division: "대학부", rounds: [323, 334, 332, 347], total: 1336 },
      { name: "이효범", school: "경희대학교", division: "대학부", rounds: [321, 339, 321, 354], total: 1335 },
      { name: "강민승", school: "계명대학교", division: "대학부", rounds: [326, 325, 335, 349], total: 1335 },
      { name: "김동현", school: "경희대학교", division: "대학부", rounds: [309, 341, 331, 354], total: 1335 },
      { name: "장준하", school: "계명대학교", division: "대학부", rounds: [321, 337, 326, 350], total: 1334 },
      { name: "정호진", school: "울산대학교", division: "대학부", rounds: [310, 333, 333, 356], total: 1332 },
      { name: "이건호", school: "배재대학교", division: "대학부", rounds: [316, 335, 335, 345], total: 1331 },
      { name: "김정민", school: "배재대학교", division: "대학부", rounds: [314, 336, 328, 352], total: 1330 },
      { name: "강현빈", school: "인천대학교", division: "대학부", rounds: [317, 326, 334, 352], total: 1329 },
      { name: "구범준", school: "한국체육대학교", division: "대학부", rounds: [315, 334, 326, 352], total: 1327 },
      { name: "최우진", school: "조선대학교", division: "대학부", rounds: [312, 325, 335, 353], total: 1325 },
      { name: "최우석", school: "배재대학교", division: "대학부", rounds: [305, 335, 331, 352], total: 1323 },
      { name: "김기범", school: "계명대학교", division: "대학부", rounds: [320, 336, 323, 343], total: 1322 },
      { name: "조윤혁", school: "국립경국대학교", division: "대학부", rounds: [311, 327, 333, 351], total: 1322 },
      { name: "김다니엘", school: "순천대학교", division: "대학부", rounds: [308, 334, 332, 346], total: 1320 },
      { name: "최민재", school: "상지대학교", division: "대학부", rounds: [317, 337, 314, 352], total: 1320 },
      { name: "정세윤", school: "인천대학교", division: "대학부", rounds: [310, 334, 324, 352], total: 1320 },
      { name: "강민재", school: "서원대학교", division: "대학부", rounds: [302, 334, 323, 356], total: 1315 },
      { name: "진효성", school: "조선대학교", division: "대학부", rounds: [320, 326, 329, 339], total: 1314 },
      { name: "황성현", school: "서원대학교", division: "대학부", rounds: [308, 327, 327, 350], total: 1312 },
      { name: "신준", school: "계명대학교", division: "대학부", rounds: [311, 334, 317, 349], total: 1311 },
      { name: "채진서", school: "조선대학교", division: "대학부", rounds: [313, 331, 313, 354], total: 1311 },
      { name: "이정한", school: "배재대학교", division: "대학부", rounds: [305, 330, 320, 352], total: 1307 },
      { name: "조국", school: "배재대학교", division: "대학부", rounds: [308, 336, 313, 349], total: 1306 },
      { name: "김민재", school: "한국체육대학교", division: "대학부", rounds: [302, 334, 319, 350], total: 1305 },
      { name: "이은재", school: "한국체육대학교", division: "대학부", rounds: [313, 338, 312, 342], total: 1305 },
      { name: "김종환", school: "국립경국대학교", division: "대학부", rounds: [310, 328, 319, 347], total: 1304 },
      { name: "김제영", school: "한일장신대학교", division: "대학부", rounds: [296, 325, 330, 350], total: 1301 },
      { name: "송태건", school: "국립경국대학교", division: "대학부", rounds: [302, 328, 326, 345], total: 1301 },
      { name: "현상우", school: "서원대학교", division: "대학부", rounds: [299, 332, 323, 346], total: 1300 },
      { name: "이승우", school: "국립경국대학교", division: "대학부", rounds: [310, 324, 318, 346], total: 1298 },
      { name: "조대신", school: "인천대학교", division: "대학부", rounds: [296, 328, 321, 352], total: 1297 },
      { name: "장우혁", school: "한일장신대학교", division: "대학부", rounds: [302, 325, 321, 349], total: 1297 },
      { name: "김택중", school: "한국체육대학교", division: "대학부", rounds: [297, 327, 327, 342], total: 1293 },
      { name: "박라이", school: "한일장신대학교", division: "대학부", rounds: [300, 324, 322, 344], total: 1290 },
      { name: "박훈정", school: "배재대학교", division: "대학부", rounds: [301, 323, 319, 346], total: 1289 },
      { name: "조민수", school: "조선대학교", division: "대학부", rounds: [309, 321, 313, 346], total: 1289 },
      { name: "강우석", school: "국립경국대학교", division: "대학부", rounds: [276, 323, 330, 353], total: 1282 },
      { name: "이정원", school: "한일장신대학교", division: "대학부", rounds: [292, 330, 307, 350], total: 1279 },
      { name: "고성훈", school: "서원대학교", division: "대학부", rounds: [281, 314, 328, 351], total: 1274 },
      { name: "김선혁", school: "한국체육대학교", division: "대학부", rounds: [288, 320, 316, 346], total: 1270 },
      { name: "강민서", school: "국립경국대학교", division: "대학부", rounds: [297, 324, 307, 340], total: 1268 },
      { name: "송현태", school: "서원대학교", division: "대학부", rounds: [289, 322, 312, 335], total: 1258 },
      { name: "이찬주", school: "한국체육대학교", division: "대학부", rounds: [294, 326, 307, 325], total: 1252 },
      { name: "심태한", school: "조선대학교", division: "대학부", rounds: [284, 315, 313, 333], total: 1245 },
      { name: "최지섭", school: "상지대학교", division: "대학부", rounds: [296, 299, 307, 340], total: 1242 },
      { name: "유정현", school: "상지대학교", division: "대학부", rounds: [283, 314, 307, 337], total: 1241 },
      { name: "박재형", school: "경희대학교", division: "대학부", rounds: [281, 293, 297, 337], total: 1208 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0282025AR001AR04W01Q_1_",
    date: "2025-07-18",
    division: "대학부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제28회한국대학연맹회장기대회 · 여자리커브대학부개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "오예진", school: "광주여자대학교", division: "대학부", rounds: [344, 343, 335, 359], total: 1381 },
      { name: "원성윤", school: "경희대학교", division: "대학부", rounds: [326, 347, 343, 356], total: 1372 },
      { name: "염혜정", school: "경희대학교", division: "대학부", rounds: [341, 344, 333, 354], total: 1372 },
      { name: "윤혜림", school: "창원대학교", division: "대학부", rounds: [334, 338, 341, 355], total: 1368 },
      { name: "최혜미", school: "동서대학교", division: "대학부", rounds: [335, 341, 334, 354], total: 1364 },
      { name: "조수혜", school: "한국체육대학교", division: "대학부", rounds: [335, 339, 338, 351], total: 1363 },
      { name: "한주희", school: "동서대학교", division: "대학부", rounds: [334, 338, 338, 352], total: 1362 },
      { name: "김서하", school: "순천대학교", division: "대학부", rounds: [336, 336, 336, 354], total: 1362 },
      { name: "정다영", school: "한국체육대학교", division: "대학부", rounds: [336, 344, 331, 350], total: 1361 },
      { name: "탁해윤", school: "순천대학교", division: "대학부", rounds: [328, 346, 334, 350], total: 1358 },
      { name: "윤지희", school: "동서대학교", division: "대학부", rounds: [334, 338, 336, 350], total: 1358 },
      { name: "김은지", school: "계명대학교", division: "대학부", rounds: [337, 335, 332, 353], total: 1357 },
      { name: "나민지", school: "계명대학교", division: "대학부", rounds: [332, 343, 334, 348], total: 1357 },
      { name: "정다예나", school: "창원대학교", division: "대학부", rounds: [339, 335, 333, 350], total: 1357 },
      { name: "김나리", school: "한국체육대학교", division: "대학부", rounds: [343, 337, 329, 347], total: 1356 },
      { name: "연은서", school: "계명대학교", division: "대학부", rounds: [330, 340, 333, 352], total: 1355 },
      { name: "김세연", school: "경희대학교", division: "대학부", rounds: [333, 344, 329, 348], total: 1354 },
      { name: "김영은", school: "원광대학교", division: "대학부", rounds: [330, 335, 335, 352], total: 1352 },
      { name: "이수현", school: "계명대학교", division: "대학부", rounds: [329, 340, 336, 347], total: 1352 },
      { name: "이수연", school: "광주여자대학교", division: "대학부", rounds: [329, 335, 338, 350], total: 1352 },
      { name: "서보은", school: "순천대학교", division: "대학부", rounds: [333, 339, 326, 353], total: 1351 },
      { name: "김수아", school: "국립경국대학교", division: "대학부", rounds: [327, 331, 338, 351], total: 1347 },
      { name: "신고은", school: "계명대학교", division: "대학부", rounds: [330, 340, 328, 347], total: 1345 },
      { name: "남가형", school: "광주여자대학교", division: "대학부", rounds: [320, 337, 332, 352], total: 1341 },
      { name: "배윤진", school: "국립경국대학교", division: "대학부", rounds: [326, 338, 327, 350], total: 1341 },
      { name: "최한별", school: "인천대학교", division: "대학부", rounds: [333, 330, 330, 347], total: 1340 },
      { name: "최지원", school: "창원대학교", division: "대학부", rounds: [330, 336, 323, 350], total: 1339 },
      { name: "김미강", school: "경희대학교", division: "대학부", rounds: [327, 333, 323, 351], total: 1334 },
      { name: "오정아", school: "한국체육대학교", division: "대학부", rounds: [320, 328, 332, 350], total: 1330 },
      { name: "김보경", school: "창원대학교", division: "대학부", rounds: [311, 342, 330, 346], total: 1329 },
      { name: "이다영", school: "창원대학교", division: "대학부", rounds: [318, 331, 329, 349], total: 1327 },
      { name: "박채아", school: "창원대학교", division: "대학부", rounds: [327, 330, 329, 341], total: 1327 },
      { name: "장미", school: "경희대학교", division: "대학부", rounds: [321, 334, 323, 347], total: 1325 },
      { name: "함지윤", school: "목원대학교", division: "대학부", rounds: [309, 334, 333, 348], total: 1324 },
      { name: "김가은", school: "순천대학교", division: "대학부", rounds: [324, 327, 327, 345], total: 1323 },
      { name: "이송현", school: "광주여자대학교", division: "대학부", rounds: [313, 337, 326, 343], total: 1319 },
      { name: "박미소", school: "동서대학교", division: "대학부", rounds: [318, 331, 320, 349], total: 1318 },
      { name: "안서윤", school: "한국체육대학교", division: "대학부", rounds: [326, 328, 316, 347], total: 1317 },
      { name: "조아라", school: "목원대학교", division: "대학부", rounds: [327, 325, 324, 341], total: 1317 },
      { name: "정승은", school: "한국체육대학교", division: "대학부", rounds: [313, 329, 324, 350], total: 1316 },
      { name: "김채현", school: "목원대학교", division: "대학부", rounds: [321, 325, 316, 352], total: 1314 },
      { name: "한유진", school: "광주여자대학교", division: "대학부", rounds: [320, 331, 321, 335], total: 1307 },
      { name: "조민서", school: "동서대학교", division: "대학부", rounds: [311, 330, 322, 343], total: 1306 },
      { name: "유수안", school: "상지대학교", division: "대학부", rounds: [321, 327, 311, 343], total: 1302 },
      { name: "신효정", school: "국립경국대학교", division: "대학부", rounds: [304, 329, 329, 338], total: 1300 },
      { name: "박재희", school: "목원대학교", division: "대학부", rounds: [315, 331, 313, 335], total: 1294 },
      { name: "이채영", school: "인천대학교", division: "대학부", rounds: [305, 323, 307, 348], total: 1283 },
      { name: "조명진", school: "상지대학교", division: "대학부", rounds: [308, 322, 306, 345], total: 1281 },
      { name: "박해원", school: "울산대학교", division: "대학부", rounds: [301, 327, 315, 336], total: 1279 },
      { name: "이예진", school: "창원대학교", division: "대학부", rounds: [315, 320, 293, 332], total: 1260 },
      { name: "심민주", school: "인천대학교", division: "대학부", rounds: [289, 325, 313, 330], total: 1257 },
      { name: "김하람", school: "광주여자대학교", division: "대학부", rounds: [296, 317, 302, 333], total: 1248 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0292025AR001AR05W01Q_1_",
    date: "2025-06-14",
    division: "일반부",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제36회한국실업양궁연맹회장기양궁대회 · 여자리커브일반부개인",
    distances: [70, 60, 50, 30],
    rows: [
      { name: "유시현", school: "순천시청", division: "일반부", rounds: [339, 345, 341, 356], total: 1381 },
      { name: "최미선", school: "광주은행텐텐양궁단", division: "일반부", rounds: [328, 346, 348, 349], total: 1371 },
      { name: "남수현", school: "순천시청", division: "일반부", rounds: [331, 349, 337, 353], total: 1370 },
      { name: "유수정", school: "현대백화점", division: "일반부", rounds: [328, 346, 341, 354], total: 1369 },
      { name: "정다소미", school: "현대백화점", division: "일반부", rounds: [332, 339, 340, 358], total: 1369 },
      { name: "김수린", school: "광주광역시청", division: "일반부", rounds: [329, 348, 335, 357], total: 1369 },
      { name: "조아름", school: "현대백화점", division: "일반부", rounds: [324, 338, 343, 357], total: 1362 },
      { name: "신서빈", school: "대전시체육회", division: "일반부", rounds: [327, 338, 344, 353], total: 1362 },
      { name: "한솔", school: "홍성군청", division: "일반부", rounds: [330, 337, 339, 354], total: 1360 },
      { name: "전훈영", school: "인천광역시청", division: "일반부", rounds: [328, 340, 335, 356], total: 1359 },
      { name: "이윤지", school: "현대모비스", division: "일반부", rounds: [323, 340, 337, 357], total: 1357 },
      { name: "임하나", school: "LH", division: "일반부", rounds: [313, 342, 347, 355], total: 1357 },
      { name: "장민희", school: "인천광역시청", division: "일반부", rounds: [325, 345, 336, 351], total: 1357 },
      { name: "김소희", school: "청주시청", division: "일반부", rounds: [320, 341, 343, 353], total: 1357 },
      { name: "박나원", school: "하이트진로", division: "일반부", rounds: [333, 332, 337, 354], total: 1356 },
      { name: "임해진", school: "대전시체육회", division: "일반부", rounds: [334, 339, 327, 356], total: 1356 },
      { name: "박세은", school: "부산도시공사", division: "일반부", rounds: [320, 343, 339, 352], total: 1354 },
      { name: "이은아", school: "홍성군청", division: "일반부", rounds: [328, 338, 333, 355], total: 1354 },
      { name: "홍수남", school: "인천광역시청", division: "일반부", rounds: [327, 342, 332, 351], total: 1352 },
      { name: "김아영", school: "전북도청", division: "일반부", rounds: [334, 335, 331, 352], total: 1352 },
      { name: "김이안", school: "현대백화점", division: "일반부", rounds: [328, 340, 330, 354], total: 1352 },
      { name: "전인아", school: "전북도청", division: "일반부", rounds: [320, 342, 338, 351], total: 1351 },
      { name: "곽예지", school: "대전시체육회", division: "일반부", rounds: [326, 341, 329, 355], total: 1351 },
      { name: "김예후", school: "전북도청", division: "일반부", rounds: [320, 340, 335, 355], total: 1350 },
      { name: "박은서", school: "부산도시공사", division: "일반부", rounds: [327, 342, 326, 354], total: 1349 },
      { name: "이가영", school: "광주광역시청", division: "일반부", rounds: [328, 337, 330, 354], total: 1349 },
      { name: "이은경", school: "순천시청", division: "일반부", rounds: [317, 343, 336, 352], total: 1348 },
      { name: "손서빈", school: "여주시청", division: "일반부", rounds: [322, 332, 339, 354], total: 1347 },
      { name: "전완서", school: "광주광역시청", division: "일반부", rounds: [325, 340, 331, 350], total: 1346 },
      { name: "방현주", school: "현대모비스", division: "일반부", rounds: [324, 339, 329, 353], total: 1345 },
      { name: "정지서", school: "현대모비스", division: "일반부", rounds: [324, 338, 329, 354], total: 1345 },
      { name: "김아현", school: "여주시청", division: "일반부", rounds: [322, 335, 334, 354], total: 1345 },
      { name: "임두나", school: "LH", division: "일반부", rounds: [312, 341, 335, 356], total: 1344 },
      { name: "이세현", school: "창원시청", division: "일반부", rounds: [326, 331, 331, 356], total: 1344 },
      { name: "곽진영", school: "광주은행텐텐양궁단", division: "일반부", rounds: [323, 337, 331, 353], total: 1344 },
      { name: "강고은", school: "예천군청", division: "일반부", rounds: [324, 337, 333, 349], total: 1343 },
      { name: "김채윤", school: "광주광역시청", division: "일반부", rounds: [326, 336, 330, 351], total: 1343 },
      { name: "이다빈", school: "하이트진로", division: "일반부", rounds: [322, 333, 337, 351], total: 1343 },
      { name: "박수빈", school: "청주시청", division: "일반부", rounds: [332, 337, 321, 352], total: 1342 },
      { name: "심예지", school: "청주시청", division: "일반부", rounds: [322, 331, 335, 354], total: 1342 },
      { name: "박소영", school: "여주시청", division: "일반부", rounds: [321, 335, 332, 352], total: 1340 },
      { name: "박소민", school: "LH", division: "일반부", rounds: [319, 329, 339, 353], total: 1340 },
      { name: "김세연", school: "홍성군청", division: "일반부", rounds: [325, 334, 327, 354], total: 1340 },
      { name: "황재민", school: "창원시청", division: "일반부", rounds: [321, 340, 327, 349], total: 1337 },
      { name: "최예지", school: "대구서구청", division: "일반부", rounds: [322, 335, 327, 350], total: 1334 },
      { name: "주혜빈", school: "대구서구청", division: "일반부", rounds: [318, 339, 329, 347], total: 1333 },
      { name: "최모경", school: "하이트진로", division: "일반부", rounds: [310, 333, 339, 350], total: 1332 },
      { name: "김예림", school: "여주시청", division: "일반부", rounds: [319, 330, 336, 347], total: 1332 },
      { name: "이나영", school: "창원시청", division: "일반부", rounds: [332, 324, 324, 349], total: 1329 },
      { name: "조수빈", school: "예천군청", division: "일반부", rounds: [318, 338, 324, 349], total: 1329 },
      { name: "김서영", school: "인천광역시청", division: "일반부", rounds: [307, 334, 339, 348], total: 1328 },
      { name: "전성은", school: "현대백화점", division: "일반부", rounds: [313, 334, 331, 350], total: 1328 },
      { name: "심다정", school: "예천군청", division: "일반부", rounds: [322, 329, 327, 345], total: 1323 },
      { name: "신정화", school: "전북도청", division: "일반부", rounds: [316, 330, 321, 352], total: 1319 },
      { name: "우경림", school: "창원시청", division: "일반부", rounds: [312, 333, 323, 351], total: 1319 },
      { name: "안희연", school: "청주시청", division: "일반부", rounds: [308, 326, 332, 351], total: 1317 },
      { name: "이다희", school: "LH", division: "일반부", rounds: [319, 334, 319, 340], total: 1312 },
      { name: "박재희", school: "홍성군청", division: "일반부", rounds: [317, 327, 321, 339], total: 1304 },
      { name: "손예령", school: "부산도시공사", division: "일반부", rounds: [302, 332, 326, 340], total: 1300 },
      { name: "임정민", school: "대구서구청", division: "일반부", rounds: [319, 321, 316, 343], total: 1299 },
      { name: "김정윤", school: "광주은행텐텐양궁단", division: "일반부", rounds: [299, 327, 322, 344], total: 1292 },
      { name: "이혜민", school: "예천군청", division: "일반부", rounds: [292, 325, 328, 344], total: 1289 },
      { name: "최예진", school: "광주은행텐텐양궁단", division: "일반부", rounds: [293, 322, 316, 338], total: 1269 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0502025AR001AR02M01Q_1_",
    date: "2025-09-27",
    division: "중등부",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제22회경상북도지사기전국남여초.중양궁대회 · 남자리커브중학부개인",
    distances: [60, 50, 40, 30],
    rows: [
      { name: "박규필", school: "부산체육중학교", division: "중등부", rounds: [338, 335, 345, 356], total: 1374 },
      { name: "주영진", school: "이원중학교", division: "중등부", rounds: [334, 344, 339, 347], total: 1364 },
      { name: "김준호", school: "동진중학교", division: "중등부", rounds: [335, 327, 347, 350], total: 1359 },
      { name: "이상원", school: "서야중학교", division: "고등부", rounds: [345, 326, 350, 337], total: 1358 },
      { name: "서준용", school: "동진중학교", division: "중등부", rounds: [338, 326, 343, 350], total: 1357 },
      { name: "김성혁", school: "만수북중학교", division: "중등부", rounds: [333, 323, 342, 354], total: 1352 },
      { name: "장대한", school: "용하중학교", division: "고등부", rounds: [339, 331, 340, 342], total: 1352 },
      { name: "최윤찬", school: "미리벌중학교", division: "중등부", rounds: [338, 321, 337, 352], total: 1348 },
      { name: "오승준", school: "이원중학교", division: "고등부", rounds: [336, 319, 343, 347], total: 1345 },
      { name: "강민우", school: "동진중학교", division: "중등부", rounds: [329, 322, 344, 348], total: 1343 },
      { name: "주영빈", school: "이원중학교", division: "중등부", rounds: [338, 325, 331, 348], total: 1342 },
      { name: "김준서", school: "광주체육중학교", division: "중등부", rounds: [337, 331, 326, 348], total: 1342 },
      { name: "이진율", school: "불로중학교", division: "중등부", rounds: [339, 321, 331, 348], total: 1339 },
      { name: "박민혁", school: "모라중학교", division: "중등부", rounds: [335, 318, 339, 346], total: 1338 },
      { name: "안준서", school: "원천중학교", division: "중등부", rounds: [327, 331, 337, 341], total: 1336 },
      { name: "고현빈", school: "대전내동중학교", division: "중등부", rounds: [337, 324, 337, 338], total: 1336 },
      { name: "이재준", school: "경북체육중학교", division: "중등부", rounds: [331, 317, 332, 354], total: 1334 },
      { name: "황운재", school: "예천중학교", division: "고등부", rounds: [334, 316, 333, 350], total: 1333 },
      { name: "안도현", school: "미리벌중학교", division: "중등부", rounds: [329, 308, 341, 354], total: 1332 },
      { name: "박건우", school: "불로중학교", division: "고등부", rounds: [325, 325, 332, 349], total: 1331 },
      { name: "강동주", school: "무거중학교", division: "고등부", rounds: [321, 322, 340, 347], total: 1330 },
      { name: "안현준", school: "예천중학교", division: "중등부", rounds: [329, 326, 331, 344], total: 1330 },
      { name: "이재원", school: "중원중학교", division: "중등부", rounds: [335, 319, 331, 344], total: 1329 },
      { name: "임찬혁", school: "만수북중학교", division: "중등부", rounds: [324, 316, 341, 345], total: 1326 },
      { name: "서준영", school: "괴산중학교", division: "중등부", rounds: [328, 322, 336, 339], total: 1325 },
      { name: "이주완", school: "원천중학교", division: "중등부", rounds: [331, 314, 330, 348], total: 1323 },
      { name: "손우주", school: "수원시양궁협회2", division: "중등부", rounds: [323, 324, 332, 343], total: 1322 },
      { name: "김시온", school: "관악중학교", division: "중등부", rounds: [319, 313, 341, 348], total: 1321 },
      { name: "유지백", school: "병천중학교", division: "고등부", rounds: [320, 321, 337, 343], total: 1321 },
      { name: "이호진", school: "경북체육중학교", division: "중등부", rounds: [330, 310, 337, 343], total: 1320 },
      { name: "최봉석", school: "예천중학교", division: "고등부", rounds: [329, 308, 334, 346], total: 1317 },
      { name: "김보형", school: "수원시양궁협회2", division: "중등부", rounds: [328, 316, 333, 340], total: 1317 },
      { name: "장영한", school: "용하중학교", division: "중등부", rounds: [321, 321, 324, 350], total: 1316 },
      { name: "김형호", school: "무거중학교", division: "중등부", rounds: [332, 309, 332, 343], total: 1316 },
      { name: "우성준", school: "불로중학교", division: "중등부", rounds: [325, 310, 337, 343], total: 1315 },
      { name: "박지웅", school: "불로중학교", division: "중등부", rounds: [328, 308, 332, 346], total: 1314 },
      { name: "정현우", school: "방이중학교", division: "중등부", rounds: [324, 321, 325, 344], total: 1314 },
      { name: "윤성빈", school: "면목중학교", division: "고등부", rounds: [311, 313, 336, 352], total: 1312 },
      { name: "임지우", school: "예천중학교", division: "중등부", rounds: [317, 313, 333, 347], total: 1310 },
      { name: "김도겸", school: "서야중학교", division: "중등부", rounds: [333, 315, 316, 346], total: 1310 },
      { name: "이하늘", school: "광주체육중학교", division: "중등부", rounds: [329, 318, 321, 339], total: 1307 },
      { name: "손민서", school: "경북체육중학교", division: "중등부", rounds: [330, 329, 306, 342], total: 1307 },
      { name: "강태균", school: "예천중학교", division: "중등부", rounds: [319, 313, 331, 343], total: 1306 },
      { name: "김승현", school: "용성중학교", division: "중등부", rounds: [317, 309, 332, 348], total: 1306 },
      { name: "김태균", school: "중원중학교", division: "고등부", rounds: [331, 304, 330, 337], total: 1302 },
      { name: "변종율", school: "북원중학교", division: "중등부", rounds: [333, 304, 320, 343], total: 1300 },
      { name: "강동윤", school: "경북체육중학교", division: "고등부", rounds: [325, 317, 319, 338], total: 1299 },
      { name: "한승제", school: "광주체육중학교", division: "고등부", rounds: [318, 314, 329, 337], total: 1298 },
      { name: "이대로", school: "경북체육중학교", division: "중등부", rounds: [321, 305, 330, 341], total: 1297 },
      { name: "박주원", school: "만수북중학교", division: "중등부", rounds: [320, 316, 316, 344], total: 1296 },
      { name: "권태경", school: "불로중학교", division: "중등부", rounds: [305, 311, 336, 340], total: 1292 },
      { name: "이상윤", school: "예천중학교", division: "중등부", rounds: [317, 309, 327, 338], total: 1291 },
      { name: "문보량", school: "대전내동중학교", division: "중등부", rounds: [315, 308, 323, 341], total: 1287 },
      { name: "진민오", school: "원천중학교", division: "중등부", rounds: [302, 316, 322, 341], total: 1281 },
      { name: "홍주원", school: "방이중학교", division: "중등부", rounds: [319, 302, 315, 345], total: 1281 },
      { name: "유희제", school: "원천중학교", division: "고등부", rounds: [328, 272, 330, 344], total: 1274 },
      { name: "김태훈", school: "대전내동중학교", division: "중등부", rounds: [319, 301, 310, 343], total: 1273 },
      { name: "김강민", school: "무거중학교", division: "고등부", rounds: [308, 307, 323, 332], total: 1270 },
      { name: "전용현", school: "방이중학교", division: "고등부", rounds: [308, 293, 325, 342], total: 1268 },
      { name: "조여준", school: "광주체육중학교", division: "중등부", rounds: [310, 298, 311, 346], total: 1265 },
      { name: "김지성", school: "강원체육중학교", division: "중등부", rounds: [302, 297, 327, 338], total: 1264 },
      { name: "이시윤", school: "무거중학교", division: "중등부", rounds: [313, 314, 305, 325], total: 1257 },
      { name: "김용현", school: "광주체육중학교", division: "중등부", rounds: [327, 272, 324, 333], total: 1256 },
      { name: "나근도", school: "북원중학교", division: "고등부", rounds: [303, 300, 322, 330], total: 1255 },
      { name: "김윤조", school: "방이중학교", division: "중등부", rounds: [314, 288, 326, 326], total: 1254 },
      { name: "정범준", school: "무거중학교", division: "중등부", rounds: [299, 310, 316, 329], total: 1254 },
      { name: "양지호", school: "미리벌중학교", division: "고등부", rounds: [316, 288, 317, 332], total: 1253 },
      { name: "김세진", school: "원천중학교", division: "고등부", rounds: [295, 304, 313, 329], total: 1241 },
      { name: "정준영", school: "원천중학교", division: "중등부", rounds: [302, 293, 313, 332], total: 1240 },
      { name: "박예준", school: "면목중학교", division: "중등부", rounds: [302, 277, 324, 332], total: 1235 },
      { name: "곽우승", school: "연일중학교", division: "고등부", rounds: [315, 277, 313, 328], total: 1233 },
      { name: "최성민", school: "모라중학교", division: "고등부", rounds: [318, 267, 320, 328], total: 1233 },
      { name: "윤건우", school: "연일중학교", division: "중등부", rounds: [314, 301, 304, 311], total: 1230 },
      { name: "조영신", school: "중원중학교", division: "고등부", rounds: [291, 297, 312, 326], total: 1226 },
      { name: "심우영", school: "경북체육중학교", division: "중등부", rounds: [302, 267, 313, 340], total: 1222 },
      { name: "이건우", school: "수원시양궁협회1", division: "중등부", rounds: [314, 268, 310, 329], total: 1221 },
      { name: "김효서", school: "원봉중학교", division: "중등부", rounds: [305, 271, 307, 329], total: 1212 },
      { name: "김원영", school: "부산체육중학교", division: "중등부", rounds: [307, 273, 304, 321], total: 1205 },
      { name: "윤창현", school: "둔내중학교", division: "중등부", rounds: [305, 268, 305, 322], total: 1200 },
      { name: "이락희", school: "남천중학교", division: "중등부", rounds: [317, 244, 308, 325], total: 1194 },
      { name: "김수완", school: "성사중학교", division: "중등부", rounds: [277, 276, 315, 325], total: 1193 },
      { name: "임노건", school: "만수북중학교", division: "고등부", rounds: [301, 269, 287, 323], total: 1180 },
      { name: "정태준", school: "원천중학교", division: "중등부", rounds: [293, 257, 302, 327], total: 1179 },
      { name: "정하준", school: "광주체육중학교", division: "중등부", rounds: [301, 248, 301, 324], total: 1174 },
      { name: "김혜혁", school: "광주체육중학교", division: "중등부", rounds: [283, 279, 296, 314], total: 1172 },
      { name: "김영준", school: "만수북중학교", division: "중등부", rounds: [297, 279, 293, 302], total: 1171 },
      { name: "이재영", school: "병천중학교", division: "중등부", rounds: [294, 246, 302, 325], total: 1167 },
      { name: "서원빈", school: "대전내동중학교", division: "중등부", rounds: [306, 237, 293, 329], total: 1165 },
      { name: "전성은", school: "병천중학교", division: "중등부", rounds: [304, 261, 291, 307], total: 1163 },
      { name: "김지후", school: "원봉중학교", division: "초등부(고학년)", rounds: [304, 239, 296, 323], total: 1162 },
      { name: "방채영", school: "연일중학교", division: "중등부", rounds: [262, 261, 302, 324], total: 1149 },
      { name: "김규선", school: "방이중학교", division: "중등부", rounds: [289, 260, 275, 317], total: 1141 },
      { name: "김규성", school: "면목중학교", division: "중등부", rounds: [265, 226, 290, 312], total: 1093 },
      { name: "정우진", school: "면목중학교", division: "고등부", rounds: [257, 251, 258, 315], total: 1081 },
      { name: "유민재", school: "제주양궁클럽1", division: "중등부", rounds: [46, 0, 0, 0], total: 46 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0672025AR001AR01M01Q_1_",
    date: "2025-05-27",
    division: "초등부(통합)",
    gender: "남",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제54회전국소년체육대회(12세이하부) · 남자리커브초등부개인",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "신동주", school: "이원초등학교", division: "초등부(통합)", rounds: [345, 350, 356, 360], total: 1411 },
      { name: "양가온", school: "대구송현초등학교", division: "초등부(통합)", rounds: [348, 345, 355, 358], total: 1406 },
      { name: "박서준", school: "대구덕인초등학교", division: "초등부(통합)", rounds: [336, 350, 355, 358], total: 1399 },
      { name: "김주완", school: "괴산명덕초등학교", division: "초등부(통합)", rounds: [335, 349, 350, 353], total: 1387 },
      { name: "정재윤", school: "인천부평서초등학교", division: "초등부(통합)", rounds: [334, 347, 350, 354], total: 1385 },
      { name: "조재혁", school: "모덕초등학교", division: "초등부(통합)", rounds: [342, 343, 345, 355], total: 1385 },
      { name: "이도현", school: "대구동부초등학교", division: "초등부(통합)", rounds: [341, 342, 343, 355], total: 1381 },
      { name: "이환지", school: "천현초등학교", division: "초등부(통합)", rounds: [325, 347, 352, 355], total: 1379 },
      { name: "강민국", school: "천현초등학교", division: "초등부(통합)", rounds: [336, 341, 345, 355], total: 1377 },
      { name: "박수한", school: "여수좌수영초등학교", division: "초등부(통합)", rounds: [336, 339, 349, 353], total: 1377 },
      { name: "안태빈", school: "병천초등학교", division: "초등부(통합)", rounds: [328, 341, 353, 354], total: 1376 },
      { name: "김도율", school: "인천석암초등학교", division: "초등부(통합)", rounds: [334, 337, 347, 357], total: 1375 },
      { name: "송민준", school: "창녕초등학교", division: "초등부(통합)", rounds: [340, 337, 345, 350], total: 1372 },
      { name: "최여준", school: "충주금릉초등학교", division: "초등부(통합)", rounds: [335, 339, 344, 352], total: 1370 },
      { name: "한지환", school: "병천초등학교", division: "초등부(통합)", rounds: [336, 342, 344, 348], total: 1370 },
      { name: "반승우", school: "경화초등학교", division: "초등부(통합)", rounds: [328, 339, 349, 351], total: 1367 },
      { name: "유찬", school: "경산서부초등학교", division: "초등부(통합)", rounds: [327, 332, 352, 353], total: 1364 },
      { name: "이찬희", school: "대구동부초등학교", division: "초등부(통합)", rounds: [328, 335, 341, 358], total: 1362 },
      { name: "권도훈", school: "남천초등학교", division: "초등부(통합)", rounds: [338, 338, 336, 350], total: 1362 },
      { name: "김민수", school: "신계초등학교", division: "초등부(통합)", rounds: [330, 338, 341, 353], total: 1362 },
      { name: "김수현", school: "경화초등학교", division: "초등부(통합)", rounds: [317, 346, 344, 353], total: 1360 },
      { name: "우치수", school: "전주기린초등학교", division: "초등부(통합)", rounds: [325, 338, 346, 348], total: 1357 },
      { name: "권동하", school: "경산서부초등학교", division: "초등부(통합)", rounds: [315, 342, 344, 355], total: 1356 },
      { name: "서은민", school: "성포초등학교", division: "초등부(통합)", rounds: [331, 336, 337, 350], total: 1354 },
      { name: "김종민", school: "서울방이초등학교", division: "초등부(통합)", rounds: [327, 333, 338, 354], total: 1352 },
      { name: "황정민", school: "옥서초등학교", division: "초등부(통합)", rounds: [338, 335, 337, 341], total: 1351 },
      { name: "정은균", school: "예천초등학교", division: "초등부(통합)", rounds: [329, 332, 339, 349], total: 1349 },
      { name: "이정우", school: "명륜초등학교", division: "초등부(통합)", rounds: [329, 328, 345, 346], total: 1348 },
      { name: "이승훈", school: "설악초등학교", division: "초등부(통합)", rounds: [326, 339, 340, 343], total: 1348 },
      { name: "송현빈", school: "대평초등학교", division: "초등부(통합)", rounds: [324, 339, 334, 349], total: 1346 },
      { name: "김성훈", school: "인천서면초등학교", division: "초등부(통합)", rounds: [325, 333, 342, 344], total: 1344 },
      { name: "조담준", school: "삼정초등학교", division: "초등부(통합)", rounds: [325, 324, 345, 349], total: 1343 },
      { name: "이은호", school: "오창초등학교", division: "초등부(통합)", rounds: [329, 332, 330, 349], total: 1340 },
      { name: "양지율", school: "서울북가좌초등학교", division: "초등부(통합)", rounds: [317, 339, 341, 342], total: 1339 },
      { name: "이호태", school: "인천석암초등학교", division: "초등부(통합)", rounds: [309, 335, 345, 346], total: 1335 },
      { name: "곽래우", school: "삼정초등학교", division: "초등부(통합)", rounds: [324, 317, 337, 352], total: 1330 },
      { name: "임채민", school: "서울개봉초등학교", division: "초등부(통합)", rounds: [327, 319, 339, 344], total: 1329 },
      { name: "김진원", school: "전주기린초등학교", division: "초등부(통합)", rounds: [312, 335, 335, 343], total: 1325 },
      { name: "강윤우", school: "창녕초등학교", division: "초등부(통합)", rounds: [310, 334, 340, 340], total: 1324 },
      { name: "이도윤", school: "경산서부초등학교", division: "초등부(통합)", rounds: [317, 321, 339, 346], total: 1323 },
      { name: "김도진", school: "설악초등학교", division: "초등부(통합)", rounds: [319, 326, 331, 346], total: 1322 },
      { name: "손승우", school: "대전가장초등학교", division: "초등부(통합)", rounds: [317, 326, 332, 347], total: 1322 },
      { name: "박태환", school: "대전가장초등학교", division: "초등부(통합)", rounds: [318, 325, 334, 342], total: 1319 },
      { name: "김세현", school: "옥서초등학교", division: "초등부(통합)", rounds: [315, 325, 328, 350], total: 1318 },
      { name: "김도현", school: "대전서부초등학교", division: "초등부(통합)", rounds: [308, 329, 327, 341], total: 1305 },
      { name: "박민수", school: "서울개봉초등학교", division: "초등부(통합)", rounds: [311, 310, 340, 342], total: 1303 },
      { name: "이준혁", school: "복산초등학교", division: "초등부(통합)", rounds: [308, 327, 330, 337], total: 1302 },
      { name: "장은혁", school: "연무초등학교", division: "초등부(통합)", rounds: [307, 318, 334, 340], total: 1299 },
      { name: "정진원", school: "성진초등학교", division: "초등부(통합)", rounds: [308, 318, 329, 336], total: 1291 },
      { name: "백준", school: "대전가장초등학교", division: "초등부(통합)", rounds: [298, 323, 329, 340], total: 1290 },
      { name: "이주원", school: "대평초등학교", division: "초등부(통합)", rounds: [309, 317, 321, 340], total: 1287 },
      { name: "임형규", school: "오수초등학교", division: "초등부(통합)", rounds: [298, 323, 326, 337], total: 1284 },
      { name: "김태하", school: "여수좌수영초등학교", division: "초등부(통합)", rounds: [317, 304, 316, 339], total: 1276 },
      { name: "김소율", school: "순천성남초등학교", division: "초등부(통합)", rounds: [299, 304, 327, 340], total: 1270 },
      { name: "이주원", school: "일로초등학교", division: "초등부(통합)", rounds: [274, 315, 327, 344], total: 1260 },
      { name: "천미르", school: "전주기린초등학교", division: "초등부(통합)", rounds: [290, 308, 332, 330], total: 1260 },
      { name: "박진서", school: "병천초등학교", division: "초등부(통합)", rounds: [291, 296, 328, 335], total: 1250 },
      { name: "이지한", school: "복산초등학교", division: "초등부(통합)", rounds: [279, 311, 318, 337], total: 1245 },
      { name: "정민규", school: "명륜초등학교", division: "초등부(통합)", rounds: [283, 292, 315, 349], total: 1239 },
      { name: "조유준", school: "삼정초등학교", division: "초등부(통합)", rounds: [269, 300, 315, 347], total: 1231 },
      { name: "이헌우", school: "제주양궁클럽6", division: "초등부(통합)", rounds: [293, 311, 276, 318], total: 1198 }
    ],
  },
{
    id: "sheet_pdf_2025_AR0672025AR001AR01W01Q_1_",
    date: "2025-05-27",
    division: "초등부(통합)",
    gender: "여",
    regionCity: "전국",
    bowType: "리커브",
    recordInputType: "distance",
    sheetLabel: "제54회전국소년체육대회(12세이하부) · 여자리커브초등부개인",
    distances: [35, 30, 25, 20],
    rows: [
      { name: "김다을", school: "용성초등학교", division: "초등부(통합)", rounds: [346, 349, 355, 355], total: 1405 },
      { name: "고다현", school: "서울방이초등학교", division: "초등부(통합)", rounds: [333, 350, 356, 356], total: 1395 },
      { name: "장채윤", school: "정평초등학교", division: "초등부(통합)", rounds: [336, 342, 350, 359], total: 1387 },
      { name: "임예은", school: "전주신동초등학교", division: "초등부(통합)", rounds: [338, 348, 343, 356], total: 1385 },
      { name: "이수빈", school: "촉석초등학교", division: "초등부(통합)", rounds: [329, 346, 345, 355], total: 1375 },
      { name: "한세빈", school: "송정초등학교", division: "초등부(통합)", rounds: [337, 342, 343, 352], total: 1374 },
      { name: "조유나", school: "하성초등학교", division: "초등부(통합)", rounds: [330, 342, 347, 355], total: 1374 },
      { name: "윤이서", school: "홍남초등학교", division: "초등부(통합)", rounds: [331, 337, 346, 358], total: 1372 },
      { name: "고윤우", school: "유촌초등학교", division: "초등부(통합)", rounds: [328, 344, 342, 349], total: 1363 },
      { name: "이승혜", school: "진해중앙초등학교", division: "초등부(통합)", rounds: [325, 335, 346, 355], total: 1361 },
      { name: "김예빈", school: "울산중앙초등학교", division: "초등부(통합)", rounds: [326, 334, 347, 353], total: 1360 },
      { name: "박예나", school: "반곡초등학교", division: "초등부(통합)", rounds: [333, 335, 341, 351], total: 1360 },
      { name: "석지우", school: "하성초등학교", division: "초등부(통합)", rounds: [319, 331, 351, 357], total: 1358 },
      { name: "이은정", school: "대미초등학교", division: "초등부(통합)", rounds: [328, 332, 348, 350], total: 1358 },
      { name: "허정아", school: "하성초등학교", division: "초등부(통합)", rounds: [324, 335, 344, 355], total: 1358 },
      { name: "함주하", school: "용성초등학교", division: "초등부(통합)", rounds: [327, 330, 352, 349], total: 1358 },
      { name: "이서윤", school: "전주신동초등학교", division: "초등부(통합)", rounds: [325, 337, 341, 354], total: 1357 },
      { name: "문현정", school: "밀주초등학교", division: "초등부(통합)", rounds: [317, 334, 349, 356], total: 1356 },
      { name: "이지나", school: "인천갈월초등학교", division: "초등부(통합)", rounds: [321, 335, 343, 357], total: 1356 },
      { name: "류가예", school: "대구송현초등학교", division: "초등부(통합)", rounds: [328, 329, 348, 350], total: 1355 },
      { name: "이선민", school: "홍남초등학교", division: "초등부(통합)", rounds: [332, 331, 340, 349], total: 1352 },
      { name: "임현서", school: "대전서부초등학교", division: "초등부(통합)", rounds: [325, 331, 342, 354], total: 1352 },
      { name: "염정민", school: "계림초등학교", division: "초등부(통합)", rounds: [313, 337, 345, 356], total: 1351 },
      { name: "김지수", school: "울산중앙초등학교", division: "초등부(통합)", rounds: [321, 332, 345, 353], total: 1351 },
      { name: "김소율", school: "예천동부초등학교", division: "초등부(통합)", rounds: [324, 333, 340, 353], total: 1350 },
      { name: "이가은", school: "인천갈월초등학교", division: "초등부(통합)", rounds: [317, 337, 345, 349], total: 1348 },
      { name: "양서정", school: "반곡초등학교", division: "초등부(통합)", rounds: [332, 324, 337, 353], total: 1346 },
      { name: "허윤", school: "구례중앙초등학교", division: "초등부(통합)", rounds: [312, 339, 345, 349], total: 1345 },
      { name: "남예온", school: "신계초등학교", division: "초등부(통합)", rounds: [320, 330, 339, 355], total: 1344 },
      { name: "최서현", school: "반곡초등학교", division: "초등부(통합)", rounds: [326, 329, 342, 347], total: 1344 },
      { name: "이아영", school: "대전태평초등학교", division: "초등부(통합)", rounds: [309, 333, 347, 354], total: 1343 },
      { name: "진연아", school: "문산초등학교", division: "초등부(통합)", rounds: [315, 330, 346, 352], total: 1343 },
      { name: "윤세아", school: "인천갈월초등학교", division: "초등부(통합)", rounds: [315, 335, 342, 351], total: 1343 },
      { name: "이주은", school: "대미초등학교", division: "초등부(통합)", rounds: [325, 330, 343, 340], total: 1338 },
      { name: "최지아", school: "임실군양궁스포츠클럽6", division: "초등부(통합)", rounds: [311, 332, 345, 349], total: 1337 },
      { name: "서인교", school: "구례중앙초등학교", division: "초등부(통합)", rounds: [315, 329, 339, 353], total: 1336 },
      { name: "나연우", school: "서울인헌초등학교", division: "초등부(통합)", rounds: [318, 337, 333, 347], total: 1335 },
      { name: "정예서", school: "서울인헌초등학교", division: "초등부(통합)", rounds: [311, 328, 345, 349], total: 1333 },
      { name: "전세희", school: "인천갈월초등학교", division: "초등부(통합)", rounds: [317, 319, 340, 355], total: 1331 },
      { name: "김도연", school: "반곡초등학교", division: "초등부(통합)", rounds: [317, 326, 336, 348], total: 1327 },
      { name: "노유림", school: "대구황금초등학교", division: "초등부(통합)", rounds: [322, 326, 330, 349], total: 1327 },
      { name: "신서연", school: "대전태평초등학교", division: "초등부(통합)", rounds: [310, 324, 336, 353], total: 1323 },
      { name: "임유빈", school: "대평초등학교", division: "초등부(통합)", rounds: [309, 321, 339, 351], total: 1320 },
      { name: "성예나", school: "정평초등학교", division: "초등부(통합)", rounds: [312, 330, 336, 339], total: 1317 },
      { name: "김소원", school: "밀주초등학교", division: "초등부(통합)", rounds: [300, 330, 341, 340], total: 1311 },
      { name: "임예은", school: "남천초등학교", division: "초등부(통합)", rounds: [311, 327, 327, 339], total: 1304 },
      { name: "오윤아", school: "강남초등학교", division: "초등부(통합)", rounds: [312, 314, 334, 342], total: 1302 },
      { name: "전서아", school: "울산중앙초등학교", division: "초등부(통합)", rounds: [307, 315, 335, 343], total: 1300 },
      { name: "김하늘", school: "대구대덕초등학교", division: "초등부(통합)", rounds: [312, 310, 340, 337], total: 1299 },
      { name: "김선율", school: "홍남초등학교", division: "초등부(통합)", rounds: [294, 314, 342, 343], total: 1293 },
      { name: "배재이", school: "대평초등학교", division: "초등부(통합)", rounds: [318, 307, 322, 340], total: 1287 },
      { name: "송해인", school: "전주신동초등학교", division: "초등부(통합)", rounds: [289, 307, 334, 337], total: 1267 },
      { name: "김하온", school: "두암초등학교", division: "초등부(통합)", rounds: [291, 309, 315, 341], total: 1256 },
      { name: "황국영", school: "문산초등학교", division: "초등부(통합)", rounds: [272, 306, 326, 333], total: 1237 },
      { name: "임소연", school: "대전송촌초등학교", division: "초등부(통합)", rounds: [310, 318, 273, 336], total: 1237 },
      { name: "최지은", school: "서울청량초등학교", division: "초등부(통합)", rounds: [292, 288, 317, 331], total: 1228 },
      { name: "최진솔", school: "대구덕인초등학교", division: "초등부(통합)", rounds: [269, 303, 320, 333], total: 1225 },
      { name: "안리안", school: "일로초등학교", division: "초등부(통합)", rounds: [277, 294, 317, 333], total: 1221 },
      { name: "이혜진", school: "순천성남초등학교", division: "초등부(통합)", rounds: [268, 280, 323, 327], total: 1198 },
      { name: "용지혜", school: "모덕초등학교", division: "초등부(통합)", rounds: [253, 261, 296, 293], total: 1103 }
    ],
  }
];

function makeSampleUserId(name, school) {
  return `official_${school}_${name}`.replace(/[^a-zA-Z0-9가-힣_]/g, "_");
}

function buildPermanentSampleUsers() {
  const map = new Map();
  SAMPLE_SHEETS.forEach((sheet) => {
    sheet.rows.forEach((row) => {
      // 공식 결과는 임의 학년 분산을 하지 않는다. 각 표의 대표 division만 사용한다.
      const assignedDivision = row.division || sheet.division;
      const id = makeSampleUserId(row.name, row.school);
      if (!map.has(id)) {
        map.set(id, {
          id,
          uid: id,
          name: row.name,
          email: `${id}@official.local`,
          club: row.school,
          clubName: row.school,
          groupName: row.school,
          division: assignedDivision,
          gender: row.gender || sheet.gender || "남",
          regionCity: row.regionCity || sheet.regionCity || "경기도",
          bowType: row.bowType || sheet.bowType || "리커브",
          avatar: "",
          photoURL: "",
          photoPath: "",
          isSampleData: true,
          isOfficialRecordUser: true,
          sampleSourceId: sheet.id,
        });
      }
    });
  });
  return Array.from(map.values());
}

function buildPermanentSampleSessions() {
  const seen = new Set();
  return SAMPLE_SHEETS.flatMap((sheet) =>
    sheet.rows
      .map((row) => {
        // 이름/소속만 확인된 선수명단 행은 공식 선수 데이터로만 보관하고 랭킹 점수 산정에는 넣지 않는다.
        if (row.rosterOnly) return null;
        // 공식 결과는 임의 학년 분산을 하지 않는다. 각 표의 대표 division만 사용한다.
        const assignedDivision = row.division || sheet.division;
        const userId = makeSampleUserId(row.name, row.school);
        const dedupeKey = `${userId}__${sheet.date}__${sheet.id}`;
        if (seen.has(dedupeKey)) return null;
        seen.add(dedupeKey);

        return buildSampleDistanceSession({
          userId,
          date: sheet.date,
          title: `${sheet.sheetLabel} · ${row.name}`,
          division: assignedDivision,
          gender: row.gender || sheet.gender || "남",
          regionCity: row.regionCity || sheet.regionCity || "경기도",
          bowType: row.bowType || sheet.bowType || "리커브",
          clubName: row.school,
          groupName: row.school,
          distance: sheet.distances[0],
          arrowsPerDistance: 36,
          rounds: sheet.distances.map((distance, idx) => ({
            distance,
            total: row.rounds[idx],
          })),
        });
      })
      .filter(Boolean)
  );
}

function buildCurrentUserPermanentSamples(userId) {
  // 공식기록은 로그인 사용자의 개인 기록으로 자동 주입하지 않는다.
  return [];
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
  const initialEndCount = 1;

  return {
    id: uid("draft"),
    title: `${mode === "set" ? "세트제" : "누적제"} X-Session`,
    sessionDate: getCurrentLocalDateString(),
    mode,
    recordInputType: "end",
    distance: 30,
    division: profile?.division || "",
    arrowsPerEnd: 6,
    arrowsPerDistance: 36,
    totalEnds: initialEndCount,
    setPoints: { me: 0, opponent: 0 },
    ends: Array.from({ length: initialEndCount }, (_, i) => createEmptyEnd(i + 1, 6)),
    distanceRounds: [
      createEmptyDistanceRound(1, 35),
    ],
    isComplete: false,
  };
}

function endTotal(end) {
  return end.arrows.reduce((sum, v) => sum + scoreToNumber(v), 0);
}

function getSessionTotal(session) {
  if (session?.recordInputType === "distance") {
    return (session.distanceRounds || []).reduce((sum, round) => sum + (Number(round.total) || 0), 0);
  }
  return (session?.ends || []).reduce((sum, end) => sum + endTotal(end), 0);
}

function getHits(session) {
  if (session?.recordInputType === "distance") {
    return (session.distanceRounds || []).reduce((sum, round) => {
      const hasScore = Number(round.total) > 0;
      return sum + (hasScore ? Number(session.arrowsPerDistance || 36) : 0);
    }, 0);
  }
  return (session?.ends || []).flatMap((end) => end.arrows).filter((v) => v !== null && v !== undefined && v !== "").length;
}

function getXs(session) {
  if (session?.recordInputType === "distance") return Number(session.summary?.xCount || 0);
  return (session?.ends || []).flatMap((end) => end.arrows).filter((v) => v === "X").length;
}

function getArrowCount(session) {
  if (session?.recordInputType === "distance") {
    return (session.distanceRounds || []).reduce((sum, round) => {
      const hasScore = Number(round.total) > 0;
      return sum + (hasScore ? Number(session.arrowsPerDistance || 36) : 0);
    }, 0);
  }
  return (session?.ends || []).flatMap((end) => end.arrows).filter((v) => v !== null).length;
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
  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ko-KR");
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
          <Button
            key={value}
            type="button"
            variant={value === page ? "default" : "outline"}
            className="h-9 min-w-9 rounded-xl px-3"
            onClick={() => onChange(value)}
          >
            {value}
          </Button>
        );
      })}
    </div>
  );
}

function formatDateOnly(value) {
  if (!value) return "-";
  const date =
    typeof value?.toDate === "function"
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ko-KR");
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

function isWithinDateFilter(sessionDate, dateFilter, customDate = "") {
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

  if (dateFilter === "custom") {
    if (!customDate) return false;
    return toLocalDateKey(sessionDate) === toLocalDateKey(customDate);
  }

  return true;
}

function calculateSessionSummary(session) {
  const isDistanceInput = session.recordInputType === "distance";
  const totalScore = isDistanceInput
    ? (session.distanceRounds || []).reduce((sum, round) => sum + (Number(round.total) || 0), 0)
    : getSessionTotal(session);
  const totalArrows = isDistanceInput
    ? (session.distanceRounds || []).reduce((sum, round) => sum + (Number(round.total) > 0 ? Number(session.arrowsPerDistance || 36) : 0), 0)
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
    role: data.role || "선수",
    avatar: "",
    photoURL: "",
    photoPath: "",
    officialClaimRequests: Array.isArray(data.officialClaimRequests) ? data.officialClaimRequests : [],
    latestOfficialClaim: data.latestOfficialClaim || null,
    verifiedAthlete: Boolean(data.verifiedAthlete),
    officialClaimSampleUserId: data.officialClaimSampleUserId || "",
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


function getRequiredDistancesForDivision(division, gender = "남") {
  const rule = DIVISION_DISTANCE_RULES[division];
  if (!rule) return [];
  if (Array.isArray(rule)) return rule;
  const normalizedGender = String(gender || "남").trim() === "여" ? "여" : "남";
  return rule[normalizedGender] || rule.남 || rule.여 || [];
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
  const selectedDistance = rankingFilters.distance || "all";
  const isAllDistance = !selectedDistance || selectedDistance === "all";

  return users
    .map((user) => {
      const userDivision = user.division || "";
      const userGender = user.gender || "남";
      const profileRankingGroup = getRankingGroup(userDivision, userGender);

      if (!schoolFilterMatches(rankingFilters.groupName, user.groupName)) {
        return null;
      }
      if (
        rankingFilters.regionCity &&
        rankingFilters.regionCity !== "all" &&
        (user.regionCity || "") !== rankingFilters.regionCity
      ) {
        return null;
      }
      if (
        rankingFilters.gender &&
        rankingFilters.gender !== "all" &&
        (user.gender || "남") !== rankingFilters.gender
      ) {
        return null;
      }

      const allAttempts = sessions
        .filter((session) => session.userId === user.id)
        .flatMap((session) => getQualifiedDistanceAttempts(session))
        .filter((attempt) => !weekly || isWithinRecent7Days(attempt.sessionDate))
        .filter((attempt) => isWithinDateFilter(attempt.sessionDate, rankingFilters.dateFilter || "all", rankingFilters.customDate));

      const attempts = allAttempts.filter((attempt) => {
        const attemptRankingGroup = attempt.rankingGroup || profileRankingGroup;
        if (profileRankingGroup && attemptRankingGroup !== profileRankingGroup) return false;
        return rankingGroupMatchesFilter(rankingFilters.rankingGroup, attemptRankingGroup);
      });

      if (!attempts.length) return null;

      if (isAllDistance) {
        const validAttempts = attempts.filter((attempt) => {
          const group = attempt.rankingGroup || profileRankingGroup;
          const requiredDistances = getRequiredDistancesForRankingGroup(group);
          // 사용자 기록은 프로필/세션 구분값이 비어 있어도 거리 랭킹에는 반드시 노출한다.
          // 공식기록은 기존 부문별 필수 거리 기준을 유지한다.
          if (!requiredDistances.length) return !user.isSampleData;
          return requiredDistances.includes(Number(attempt.distance));
        });

        if (!validAttempts.length) return null;

        validAttempts.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return String(b.sessionDate).localeCompare(String(a.sessionDate));
        });

        const best = validAttempts[0];
        const displayRankingGroup = profileRankingGroup || best.rankingGroup || "-";

        return {
          userId: user.id,
          name: getDisplayName(user),
          groupName: user.groupName || best.groupName || "-",
          regionCity: user.regionCity || best.regionCity || "-",
          gender: userGender,
          division: normalizeDivisionLabel(userDivision || best.division || "-"),
          rankingGroup: displayRankingGroup,
          distance: best.distance,
          distanceLabel: `전체 거리 · ${best.distance}m`,
          bestScore: best.score,
          qualifiedSessions: validAttempts.length,
          latestDate: best.sessionDate || "",
          isSampleData: Boolean(user.isSampleData),
          sourceType: user.isSampleData ? "official" : "user",
          claimedByUid: user.claimedByUid || "",
          verifiedAthlete: Boolean(user.verifiedAthlete),
        };
      }

      const filteredAttempts = attempts
        .filter((attempt) => String(attempt.distance) === String(selectedDistance))
        .filter((attempt) => {
          const group = attempt.rankingGroup || profileRankingGroup;
          const requiredDistances = getRequiredDistancesForRankingGroup(group);
          if (!requiredDistances.length) return !user.isSampleData;
          return requiredDistances.includes(Number(attempt.distance));
        });

      if (!filteredAttempts.length) return null;

      filteredAttempts.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(b.sessionDate).localeCompare(String(a.sessionDate));
      });

      const best = filteredAttempts[0];
      const displayRankingGroup = profileRankingGroup || best.rankingGroup || "-";

      return {
        userId: user.id,
        name: getDisplayName(user),
        groupName: user.groupName || best.groupName || "-",
        regionCity: user.regionCity || best.regionCity || "-",
        gender: userGender,
        division: normalizeDivisionLabel(userDivision || best.division || "-"),
        rankingGroup: displayRankingGroup,
        distance: best.distance,
        distanceLabel: `${best.distance}m`,
        bestScore: best.score,
        qualifiedSessions: filteredAttempts.length,
        latestDate: best.sessionDate || "",
        isSampleData: Boolean(user.isSampleData),
        sourceType: user.isSampleData ? "official" : "user",
        claimedByUid: user.claimedByUid || "",
        verifiedAthlete: Boolean(user.verifiedAthlete),
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
      const profileRankingGroup = getRankingGroup(userDivision, userGender);

      if (!schoolFilterMatches(rankingFilters.groupName, user.groupName)) {
        return null;
      }
      if (
        rankingFilters.regionCity &&
        rankingFilters.regionCity !== "all" &&
        (user.regionCity || "") !== rankingFilters.regionCity
      ) {
        return null;
      }
      if (
        rankingFilters.gender &&
        rankingFilters.gender !== "all" &&
        (user.gender || "남") !== rankingFilters.gender
      ) {
        return null;
      }

      const allAttempts = sessions
        .filter((session) => session.userId === user.id)
        .flatMap((session) => getQualifiedDistanceAttempts(session))
        .filter((attempt) => !weekly || isWithinRecent7Days(attempt.sessionDate))
        .filter((attempt) => isWithinDateFilter(attempt.sessionDate, rankingFilters.dateFilter || "all", rankingFilters.customDate));

      const candidateGroups = Array.from(
        new Set(
          [
            profileRankingGroup,
            ...allAttempts.map((attempt) => attempt.rankingGroup).filter(Boolean),
          ].filter((group) => rankingGroupMatchesFilter(rankingFilters.rankingGroup, group))
        )
      );

      for (const candidateGroup of candidateGroups) {
        const requiredDistances = getRequiredDistancesForRankingGroup(candidateGroup);
        if (!requiredDistances.length) continue;

        const attempts = allAttempts.filter((attempt) => (attempt.rankingGroup || candidateGroup) === candidateGroup);

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

        if (requiredDistances.some((distance) => !bestByDistance[distance])) continue;

        const totalScore = requiredDistances.reduce(
          (sum, distance) => sum + (bestByDistance[distance]?.score || 0),
          0
        );

        return {
          userId: user.id,
          name: getDisplayName(user),
          groupName: user.groupName || "-",
          regionCity: user.regionCity || "-",
          gender: userGender,
          division: normalizeDivisionLabel(userDivision || Object.values(bestByDistance)[0]?.division || "-"),
          rankingGroup: candidateGroup || "-",
          requiredDistances,
          distanceScores: Object.fromEntries(
            requiredDistances.map((distance) => [distance, bestByDistance[distance].score])
          ),
          totalScore,
          latestDate: requiredDistances
            .map((distance) => bestByDistance[distance].sessionDate || "")
            .sort()
            .slice(-1)[0],
          isSampleData: Boolean(user.isSampleData),
          sourceType: user.isSampleData ? "official" : "user",
          claimedByUid: user.claimedByUid || "",
          verifiedAthlete: Boolean(user.verifiedAthlete),
        };
      }

      return null;
    })
    .filter(Boolean);
}


function getDistancePerformance(sessions) {
  const map = new Map();

  function addDistance(distance, score, arrows) {
    const numericDistance = Number(distance) || 0;
    if (!numericDistance) return;
    const key = `${numericDistance}m`;
    if (!map.has(key)) map.set(key, { label: key, distance: numericDistance, score: 0, arrows: 0, sessions: 0 });
    const bucket = map.get(key);
    bucket.score += Number(score) || 0;
    bucket.arrows += Number(arrows) || 0;
    bucket.sessions += 1;
  }

  sessions.forEach((session) => {
    if (session.recordInputType === "distance" && Array.isArray(session.distanceRounds) && session.distanceRounds.length) {
      const arrowsPerDistance = Number(session.arrowsPerDistance) || 36;
      session.distanceRounds.forEach((round) => addDistance(round.distance, round.total, arrowsPerDistance));
      return;
    }

    addDistance(
      session.distance,
      session.summary?.totalScore ?? getSessionTotal(session),
      session.summary?.totalArrows ?? getArrowCount(session)
    );
  });

  return Array.from(map.values())
    .map((item) => ({
      ...item,
      avgArrow: item.arrows ? Number((item.score / item.arrows).toFixed(2)) : 0,
    }))
    .sort((a, b) => a.distance - b.distance);
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
    stage: "X-STAGE",
    brief: "X-BRIEF",
    routine: "X-ROUTINE",
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
    role: "선수",
    division: "전체학년",
    gender: "남",
    groupName: "",
    regionCity: "",
    regionDistrict: "",
  });
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState("");
  const [registerFieldErrors, setRegisterFieldErrors] = useState({});
  const registerFieldRefs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    role: useRef(null),
    division: useRef(null),
    gender: useRef(null),
    groupName: useRef(null),
    regionCity: useRef(null),
    regionDistrict: useRef(null),
  };
  const registerSubmitRef = useRef(null);

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

  function focusRegisterField(fieldKey) {
    const target = registerFieldRefs[fieldKey]?.current || registerSubmitRef.current;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof target.focus === "function") {
      requestAnimationFrame(() => target.focus());
    }
  }

  async function handleRegisterSubmit() {
    const nextFieldErrors = {};

    if (!registerForm.name.trim()) nextFieldErrors.name = true;
    if (!registerForm.email.trim()) nextFieldErrors.email = true;
    if (!registerForm.password.trim()) nextFieldErrors.password = true;
    if (!registerForm.groupName.trim()) nextFieldErrors.groupName = true;
    if (!registerForm.regionCity) nextFieldErrors.regionCity = true;
    if (!registerForm.regionDistrict) nextFieldErrors.regionDistrict = true;
    if (!registerForm.division) nextFieldErrors.division = true;

    if (Object.keys(nextFieldErrors).length > 0) {
      setRegisterFieldErrors(nextFieldErrors);
      setError("해당 칸을 입력 후 버튼을 눌러주세요.");
      focusRegisterField(Object.keys(nextFieldErrors)[0]);
      return;
    }

    if (!registerForm.email.includes("@")) {
      setRegisterFieldErrors({ email: true });
      setError("이메일 형식을 확인해 주세요.");
      focusRegisterField("email");
      return;
    }

    if (registerForm.password.length < 6) {
      setRegisterFieldErrors({ password: true });
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      focusRegisterField("password");
      return;
    }

    setRegisterFieldErrors({});
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
      registerSubmitRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div
      className="relative min-h-[100svh] w-full overflow-hidden"
      style={{
        minHeight: "100svh",
        backgroundImage: "url('/login-background.png')",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top center",
        backgroundColor: "#0f2344",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, rgba(2,6,23,0.03) 0%, rgba(2,6,23,0.08) 58%, rgba(15,35,68,0.72) 78%, #0f2344 100%)",
        }}
      />
      <div className="relative flex min-h-[100svh] items-end justify-center px-0 pb-0 pt-[32svh] sm:px-0 sm:pb-0 sm:pt-[34svh] lg:pt-[38svh]">
        <div className="w-full bg-transparent p-3 sm:p-5">
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

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-50 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <Button
                  type="button"
                  disabled={authLoading}
                  className="h-12 rounded-2xl bg-blue-950 text-base font-semibold text-white hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-950 disabled:text-white"
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
                    ref={registerFieldRefs.name}
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, name: value }));
                      if (value.trim()) {
                        setRegisterFieldErrors((prev) => ({ ...prev, name: false }));
                      }
                    }}
                    placeholder="이름 입력"
                    className={`h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400 ${registerFieldErrors.name ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">가입 유형</Label>
                  <select
                    ref={registerFieldRefs.role}
                    value={registerForm.role || "선수"}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 shadow-sm outline-none"
                  >
                    <option value="선수">선수</option>
                    <option value="감독/코치/스탭">감독/코치/스탭</option>
                    <option value="학부모">학부모</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">이메일</Label>
                  <Input
                    ref={registerFieldRefs.email}
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, email: value }));
                      if (value.trim() && value.includes("@")) {
                        setRegisterFieldErrors((prev) => ({ ...prev, email: false }));
                      }
                    }}
                    placeholder="이메일 입력"
                    className={`h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400 ${registerFieldErrors.email ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">비밀번호</Label>
                  <Input
                    ref={registerFieldRefs.password}
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, password: value }));
                      if (value.trim().length >= 6) {
                        setRegisterFieldErrors((prev) => ({ ...prev, password: false }));
                      }
                    }}
                    placeholder="비밀번호 입력"
                    className={`h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400 ${registerFieldErrors.password ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">학년/부문</Label>
                  <select
                    ref={registerFieldRefs.division}
                    value={registerForm.division}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, division: value }));
                      if (value) {
                        setRegisterFieldErrors((prev) => ({ ...prev, division: false }));
                      }
                    }}
                    className={`h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none ${registerFieldErrors.division ? "ring-2 ring-red-400" : ""}`}
                  >
                    {DIVISION_OPTIONS.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">성별</Label>
                  <select
                    ref={registerFieldRefs.gender}
                    value={registerForm.gender}
                    onChange={(e) => setRegisterForm((prev) => ({ ...prev, gender: e.target.value }))}
                    className="h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none"
                  >
                    {[...GENDER_OPTIONS].sort((a, b) => String(a).localeCompare(String(b), "ko-KR")).map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">소속</Label>
                  <Input
                    ref={registerFieldRefs.groupName}
                    type="text"
                    value={registerForm.groupName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, groupName: value }));
                      if (value.trim()) {
                        setRegisterFieldErrors((prev) => ({ ...prev, groupName: false }));
                      }
                    }}
                    placeholder="예: 학교 이름 또는 팀 이름"
                    className={`h-12 rounded-2xl border-0 bg-white/92 text-base shadow-sm placeholder:text-slate-400 ${registerFieldErrors.groupName ? "ring-2 ring-red-400" : ""}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-semibold text-white">지역(시/도)</Label>
                  <select
                    ref={registerFieldRefs.regionCity}
                    value={registerForm.regionCity}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, regionCity: value, regionDistrict: "" }));
                      if (value) {
                        setRegisterFieldErrors((prev) => ({ ...prev, regionCity: false, regionDistrict: false }));
                      }
                    }}
                    className={`h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none ${registerFieldErrors.regionCity ? "ring-2 ring-red-400" : ""}`}
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
                    ref={registerFieldRefs.regionDistrict}
                    value={registerForm.regionDistrict}
                    onChange={(e) => {
                      const value = e.target.value;
                      setRegisterForm((prev) => ({ ...prev, regionDistrict: value }));
                      if (value) {
                        setRegisterFieldErrors((prev) => ({ ...prev, regionDistrict: false }));
                      }
                    }}
                    disabled={!registerForm.regionCity}
                    className={`h-12 rounded-2xl border-0 bg-white/92 px-3 text-base text-slate-900 outline-none disabled:bg-white/70 ${registerFieldErrors.regionDistrict ? "ring-2 ring-red-400" : ""}`}
                  >
                    <option value="">구/군 선택</option>
                    {registerDistrictOptions.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-red-300/40 bg-red-500/15 px-4 py-3 text-sm text-red-50 backdrop-blur-sm">
                    <AlertCircle className="h-4 w-4" /> {error}
                  </div>
                )}

                <Button
                  ref={registerSubmitRef}
                  type="button"
                  disabled={authLoading}
                  className="h-12 rounded-2xl bg-blue-950 text-base font-semibold text-white hover:bg-blue-900 active:bg-blue-950 disabled:bg-blue-950 disabled:text-white"
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


function TopBar({ user, activeTab, setActiveTab, onLogout, isAdminUser, adminAlertCount = 0 }) {
  const navs = [
    { key: "routine", label: "X-Routine", icon: Settings },
    { key: "dashboard", label: "X-Dashboard", icon: BarChart3 },
    { key: "record", label: "X-Session", icon: Target },
    { key: "ranking", label: "X-Ranking", icon: Trophy },
    { key: "analysis", label: "X-Analysis", icon: CalendarRange },
    { key: "stage", label: "X-Stage", icon: Award },
    { key: "profile", label: "Profile", icon: User },
    ...(isAdminUser ? [{ key: "admin", label: "Admin", icon: Shield, alertCount: adminAlertCount }] : []),
  ];

  return (
    <Card className="rounded-[28px] border-0 bg-white/95 shadow-xl">
      <CardContent className="flex flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <ProfileAvatar user={user} size="md" />
            <div className="min-w-0">
              <div className="truncate text-base font-semibold">{getDisplayName(user)}</div>
              <div className="truncate text-sm text-slate-500">{user.email}</div>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-11 shrink-0 rounded-2xl px-3"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" /> 로그아웃
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8">
            {navs.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className="min-w-0 gap-1 rounded-2xl px-2 text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" /> {item.label}
                  {item.alertCount > 0 ? (
                    <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                      {item.alertCount > 99 ? "99+" : item.alertCount}
                    </span>
                  ) : null}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>
  );
}


function DesktopAppSidebar({ user, activeTab, setActiveTab, onLogout, isAdminUser, adminAlertCount = 0 }) {
  const navs = [
    { key: "routine", label: "X-Routine", icon: Settings },
    { key: "dashboard", label: "X-Dashboard", icon: BarChart3 },
    { key: "record", label: "X-Session", icon: Target },
    { key: "ranking", label: "X-Ranking", icon: Trophy },
    { key: "analysis", label: "X-Analysis", icon: CalendarRange },
    { key: "stage", label: "X-Stage", icon: Award },
    { key: "profile", label: "Profile", icon: User },
    ...(isAdminUser ? [{ key: "admin", label: "Admin", icon: Shield, alertCount: adminAlertCount }] : []),
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] bg-slate-950 px-5 py-6 text-white shadow-2xl xl:flex xl:flex-col">
      <div>
        <div className="text-xl font-black tracking-wide">ARCHERY ANALYTICS</div>
        <div className="mt-1 text-xs leading-5 text-slate-400">훈련이 데이터가 되고, 성과가 결과가 된다</div>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-3xl bg-white/5 p-3">
        <ProfileAvatar user={user} size="md" />
        <div className="min-w-0">
          <div className="truncate font-black">{getDisplayName(user)}</div>
          <div className="truncate text-xs text-slate-400">{formatProfileDivisionLabel(user?.division || "") || user?.role || "선수"}</div>
        </div>
      </div>

      <nav className="mt-8 space-y-2 border-t border-white/10 pt-6">
        {navs.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition hover:bg-white/10 active:scale-[0.99] ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-300"}`}
            >
              <span className="flex items-center gap-3"><Icon className="h-4 w-4" /> {item.label}</span>
              {item.alertCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                  {item.alertCount > 99 ? "99+" : item.alertCount}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-3xl bg-white/10 p-4 text-xs leading-5 text-slate-300">
          PC에서는 왼쪽 메뉴를 공통 내비게이션으로 사용하고, X-Analysis 안에서만 상단 분석 탭을 사용한다.
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 active:scale-[0.99]"
        >
          <LogOut className="h-4 w-4" /> 로그아웃
        </button>
      </div>
    </aside>
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
  const [numericEditBuffers, setNumericEditBuffers] = useState({});
  const [saveError, setSaveError] = useState("");
  const [history, setHistory] = useState([]);
  const [lastQuickScore, setLastQuickScore] = useState(null);
  const [flashKey, setFlashKey] = useState("");
  const [activeOpponentEndId, setActiveOpponentEndId] = useState(null);
  const [opponentInputBuffers, setOpponentInputBuffers] = useState({});
  const arrowRefs = useRef({});
  const endCardRefs = useRef({});
  const quickPanelRef = useRef(null);
  const suppressAutoScrollRef = useRef(false);
  const [saveNotice, setSaveNotice] = useState("");
  const [isOnline, setIsOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


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

  const activeEndId = activeOpponentEndId || currentTarget?.endId || null;
  const quickPanelOptions = useMemo(() => {
    if (session.mode === "set") {
      return ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, "M", "CONFIRM"];
    }
    return ["X", 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, "M", "CONFIRM"];
  }, [session.mode]);

  useEffect(() => {
    if (!flashKey) return;
    const timer = setTimeout(() => setFlashKey(""), 220);
    return () => clearTimeout(timer);
  }, [flashKey]);

  useEffect(() => {
    if (!activeEndId) return;
    if (suppressAutoScrollRef.current) {
      suppressAutoScrollRef.current = false;
      return;
    }
    scrollEndIntoView(activeEndId);
  }, [activeEndId]);

  function pushHistory(prev) {
    setHistory((h) => [...h.slice(-29), JSON.parse(JSON.stringify(prev))]);
  }

  function getInputUndoSignature(targetSession) {
    return JSON.stringify(
      (targetSession?.ends || []).map((end) => ({
        id: end.id,
        arrows: end.arrows || [],
        opponentTotal: end.opponentTotal ?? 0,
        opponentScoreEntered: Boolean(end.opponentScoreEntered),
      }))
    );
  }

  const canUndoLastInput = useMemo(() => {
    const currentSignature = getInputUndoSignature(session);
    return history.some((item) => getInputUndoSignature(item) !== currentSignature);
  }, [history, session]);

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


  function getNumericInputValue(bufferKey, fallbackValue) {
    return Object.prototype.hasOwnProperty.call(numericEditBuffers, bufferKey)
      ? numericEditBuffers[bufferKey]
      : String(fallbackValue ?? "");
  }

  function handleNumericInputFocus(e) {
    requestAnimationFrame(() => {
      try {
        e.target.select?.();
      } catch {
        // ignore
      }
    });
  }

  function handleNumericInputChange(bufferKey, rawValue, commit) {
    setNumericEditBuffers((prev) => ({ ...prev, [bufferKey]: rawValue }));
    if (rawValue === "") return;
    const nextValue = Number(rawValue);
    if (Number.isNaN(nextValue)) return;
    commit(nextValue);
  }

  function handleNumericInputBlur(bufferKey) {
    setNumericEditBuffers((prev) => {
      if (!Object.prototype.hasOwnProperty.call(prev, bufferKey)) return prev;
      const next = { ...prev };
      delete next[bufferKey];
      return next;
    });
  }

  function ensureTrailingEmptyEnd(ends, arrowsPerEnd) {
    if (!Array.isArray(ends) || !ends.length) return [createEmptyEnd(1, arrowsPerEnd)];
    const hasEmptyArrow = ends.some((end) => (end.arrows || []).some((arrow) => arrow === null));
    if (hasEmptyArrow) return ends;
    return [...ends, createEmptyEnd(ends.length + 1, arrowsPerEnd)];
  }

  function scrollEndIntoView(endId) {
    if (!endId) return;
    const target = endCardRefs.current[endId];
    if (!target || typeof window === "undefined") return;

    requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      const quickHeight = quickPanelRef.current?.offsetHeight || 0;
      const topSafeLine = quickHeight + 16;
      const bottomSafeLine = window.innerHeight - 24;

      if (rect.top < topSafeLine) {
        const delta = rect.top - topSafeLine;
        window.scrollTo({
          top: Math.max(0, window.scrollY + delta),
          behavior: "smooth",
        });
        return;
      }

      if (rect.bottom > bottomSafeLine) {
        const delta = rect.bottom - bottomSafeLine;
        window.scrollTo({
          top: Math.max(0, window.scrollY + delta),
          behavior: "smooth",
        });
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

  function findLatestPendingOpponentEnd(ends) {
    for (let endIndex = ends.length - 1; endIndex >= 0; endIndex -= 1) {
      const end = ends[endIndex];
      const hasArrowInput = (end.arrows || []).some((arrow) => arrow !== null);
      const allFilled = (end.arrows || []).every((arrow) => arrow !== null);
      if (hasArrowInput && allFilled && !end.opponentScoreEntered) {
        return end;
      }
    }
    return null;
  }

  function restoreInputFlow(nextSession) {
    if (!nextSession || nextSession.recordInputType !== "end") return;

    if (nextSession.mode === "set") {
      for (let endIndex = nextSession.ends.length - 1; endIndex >= 0; endIndex -= 1) {
        const end = nextSession.ends[endIndex];
        const hasArrowInput = (end.arrows || []).some((arrow) => arrow !== null);
        const allFilled = (end.arrows || []).every((arrow) => arrow !== null);

        if (hasArrowInput && allFilled && !end.opponentScoreEntered) {
          setActiveOpponentEndId(end.id);
          setOpponentInputBuffers((prev) => ({
            ...prev,
            [end.id]: prev[end.id] ?? "",
          }));
          return;
        }
      }
    }

    setActiveOpponentEndId(null);

    for (let endIndex = nextSession.ends.length - 1; endIndex >= 0; endIndex -= 1) {
      const end = nextSession.ends[endIndex];
      for (let i = end.arrows.length - 1; i >= 0; i -= 1) {
        if (end.arrows[i] === null) {
          focusArrowField(end.id, i);
          return;
        }
      }
    }
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
    if (score === "CONFIRM") {
      if (session.mode === "set" && activeOpponentEndId) {
        confirmOpponentScore(activeOpponentEndId);
      }
      return;
    }

    if (session.mode === "set" && activeOpponentEndId) {
      if (score === "X" || score === "M") return;
      handleOpponentQuickScore(activeOpponentEndId, score);
      return;
    }

    const emptyTarget = findFirstEmptyTarget(session.ends);
    if (!emptyTarget) return;

    setLastQuickScore(String(score));
    updateArrow(emptyTarget.endId, emptyTarget.arrowIndex, score, {
      autoFocusNext: true,
      haptic: true,
    });
  }

  function undoLast() {
    if (!canUndoLastInput || !history.length) return;

    const currentSignature = getInputUndoSignature(session);
    let targetIndex = -1;
    for (let i = history.length - 1; i >= 0; i -= 1) {
      if (getInputUndoSignature(history[i]) !== currentSignature) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) return;

    suppressAutoScrollRef.current = true;
    const previous = history[targetIndex];
    setHistory((h) => h.slice(0, targetIndex));
    setSession(previous);
    requestAnimationFrame(() => {
      restoreInputFlow(previous);
    });
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
    const nextIndex = session.ends.length + 1;
    const nextEnd = createEmptyEnd(nextIndex, session.arrowsPerEnd);
    patchSession((prev) => ({
      ...prev,
      ends: [...prev.ends, nextEnd],
    }));
    requestAnimationFrame(() => {
      scrollEndIntoView(nextEnd.id);
      focusFirstArrowOfEnd(nextEnd.id);
    });
  }

  function addDistanceRound() {
    patchSession((prev) => ({
      ...prev,
      distanceRounds: [
        ...(prev.distanceRounds || []),
        createEmptyDistanceRound((prev.distanceRounds || []).length + 1, prev.distance || 30),
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
        : [createEmptyDistanceRound(1, prev.distance || 30)];
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
    patchSession((prev) => {
      const allEndsEmpty = (prev.ends || []).every((end) => (end.arrows || []).every((arrow) => arrow === null));
      const nextEnds = allEndsEmpty ? [createEmptyEnd(1, prev.arrowsPerEnd)] : prev.ends;

      return {
        ...prev,
        mode,
        recordInputType: "end",
        title: `${mode === "set" ? "세트제" : "누적제"} X-Session`,
        ends: nextEnds,
      };
    });
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
      setSaveNotice("");
      setSaveError(err);
      return;
    }

    setSaveError("");
    setSaveNotice("");

    setSaveDialogOpen(false);

    try {
      const result = await onSave();
      setHistory([]);
      if (result?.message) {
        setSaveNotice(result.message);
      }
    } catch (error) {
      const fallbackMessage = !isOnline
        ? "오프라인 상태입니다. 네트워크 연결 후 다시 저장해 주세요."
        : "저장에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      setSaveError(getFriendlySaveErrorMessage(error, fallbackMessage));
      setSaveDialogOpen(true);
    }
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
    setOpponentInputBuffers((prev) => ({ ...prev, [endId]: "" }));
    if (currentIndex === -1) return;

    const nextEnd = session.ends[currentIndex + 1];
    if (nextEnd) {
      requestAnimationFrame(() => {
        scrollEndIntoView(nextEnd.id);
        focusFirstArrowOfEnd(nextEnd.id);
      });
    }
  }

  function confirmOpponentScore(endId) {
    triggerHaptic(16);
    const raw = String(opponentInputBuffers[endId] ?? "").trim();
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

  function handleOpponentQuickScore(endId, score) {
    triggerHaptic(10);
    const digit = String(Math.max(0, Number(score) || 0));
    const raw = String(opponentInputBuffers[endId] ?? "");
    const nextValue = `${raw}${digit}`.slice(0, 2);
    setLastQuickScore(digit);
    setOpponentBuffer(endId, nextValue);
  }

  function handleOpponentKeypadInput(endId, digit) {
    triggerHaptic(10);
    const nextValue = `${String(opponentInputBuffers[endId] ?? "")}${digit}`.slice(0, 2);
    setOpponentBuffer(endId, nextValue);
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
    scrollEndIntoView(endId);
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
    if (score === "CONFIRM") {
      return `${base} border-blue-300 bg-blue-50 text-black hover:bg-blue-100`;
    }
    if (Number(score) === 0) {
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
            <div className="rounded-3xl border border-blue-100 bg-blue-50/80 px-4 py-3">
              <div className="mb-2 text-sm font-semibold text-blue-900">처음 입력할 때 이렇게 진행하세요</div>
              <div className="grid gap-1 text-sm text-blue-800">
                <div>• 경기 방식을 선택하세요. (세트제 / 누적제)</div>
                <div>• 기록은 End 1부터 시작하고, 필요하면 엔드를 추가하세요.</div>
                <div>• 빠른 점수 입력으로 화살 점수를 빠르게 기록할 수 있습니다.</div>
              </div>
            </div>

            {!isOnline && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                현재 오프라인 상태입니다. 네트워크 연결 후 저장해 주세요.
              </div>
            )}

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
                <div className="grid flex-1 gap-2">
                  <div className="grid grid-cols-2 gap-2">
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
                  <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    누적제는 총점 합산 방식이고, 세트제는 엔드별 승패를 기록하는 방식입니다.
                  </div>
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
                <div className="flex items-start gap-3">
                  <Label className="w-24 shrink-0 pt-3 text-sm">엔드당 화살 수</Label>
                  <div className="flex-1 space-y-2">
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
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={String(count)}>{count}</option>
                    ))}
                  </select>
                    <div className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                      End는 한 차례에 쏜 화살 기록 단위입니다.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Label className="w-24 shrink-0 text-sm">거리당 화살 수</Label>
                  <Input
                    className="h-11 flex-1"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={getNumericInputValue("arrowsPerDistance", session.arrowsPerDistance || 36)}
                    onFocus={handleNumericInputFocus}
                    onChange={(e) =>
                      handleNumericInputChange("arrowsPerDistance", e.target.value, (nextValue) =>
                        patchSession((prev) => ({
                          ...prev,
                          arrowsPerDistance: Math.max(1, nextValue || 1),
                        }))
                      )
                    }
                    onBlur={() => handleNumericInputBlur("arrowsPerDistance")}
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
              <div ref={quickPanelRef} className="sticky top-2 z-30 rounded-[28px] border border-slate-200 bg-white/95 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/90">
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-3 md:p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-700">빠른 점수 입력</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                      {quickPanelOptions.map((score) => (
                        <Button
                          type="button"
                          key={String(score)}
                          variant="outline"
                          className={`${getQuickButtonClass(score)} text-sm font-semibold ${
                            score === "CONFIRM" ? "!text-black disabled:!text-black opacity-100" : ""
                          }`}
                          onClick={() => quickInputScore(score)}
                          disabled={
                            score === "CONFIRM"
                              ? !(session.mode === "set" && activeOpponentEndId && String(opponentInputBuffers[activeOpponentEndId] ?? "").trim() !== "")
                              : false
                          }
                        >
                          {score === "CONFIRM" ? "확인" : score}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {session.ends.map((end) => (
                <Card
                  key={end.id}
                  ref={(el) => {
                    if (el) endCardRefs.current[end.id] = el;
                  }}
                  className="rounded-[28px] border-0 bg-white shadow-xl"
                >
                  <CardContent className="p-3 sm:p-4 md:p-5">
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
                          <div className="text-sm font-semibold text-slate-700">상대 엔드 점수</div>
                          <div
                            className={`rounded-2xl border px-4 py-3 text-sm ${
                              activeOpponentEndId === end.id
                                ? "border-blue-300 bg-blue-50 text-blue-900"
                                : "border-slate-200 bg-white text-slate-600"
                            }`}
                            onClick={() => activateOpponentInput(end.id)}
                          >
                            {activeOpponentEndId === end.id ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span>{String(opponentInputBuffers[end.id] ?? "") || "점수입력 후 '확인'을 누르세요."}</span>
                                <span className="animate-pulse text-blue-500">|</span>
                              </span>
                            ) : end.opponentScoreEntered ? (
                              `${String(end.opponentTotal ?? 0)}점`
                            ) : (
                              "점수입력 후 '확인'을 누르세요."
                            )}
                          </div>
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
                    <CardContent className="p-3 sm:p-4 md:p-5">
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
                            inputMode="numeric"
                            min={1}
                            value={getNumericInputValue(`round-${round.id}-distance`, round.distance)}
                            onFocus={handleNumericInputFocus}
                            onChange={(e) =>
                              handleNumericInputChange(`round-${round.id}-distance`, e.target.value, (nextValue) =>
                                updateDistanceRound(round.id, "distance", Math.max(1, nextValue || 1))
                              )
                            }
                            onBlur={() => handleNumericInputBlur(`round-${round.id}-distance`)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>거리 합계 점수</Label>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            value={getNumericInputValue(`round-${round.id}-total`, round.total)}
                            onFocus={handleNumericInputFocus}
                            onChange={(e) =>
                              handleNumericInputChange(`round-${round.id}-total`, e.target.value, (nextValue) =>
                                updateDistanceRound(round.id, "total", Math.max(0, nextValue || 0))
                              )
                            }
                            onBlur={() => handleNumericInputBlur(`round-${round.id}-total`)}
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
            <CardContent className="p-3 sm:p-4 md:p-5">
              <div className="flex flex-col gap-3">
                {tempSaveMessage && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {tempSaveMessage}
                  </div>
                )}

                {saveNotice && (
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {saveNotice}
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

                  <Button variant="outline" className="rounded-2xl" onClick={onTempSave} disabled={saving}>
                    <Archive className="mr-2 h-4 w-4" /> 임시 세션 저장
                  </Button>

                  <Button
                    className="rounded-2xl bg-blue-900 hover:bg-blue-800"
                    onClick={() => setSaveDialogOpen(true)}
                    disabled={saving}
                  >
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    {saving ? "저장 중..." : editingSavedSession ? "세션 업데이트" : "세션 저장"}
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
              {saving ? "저장 중..." : editingSavedSession ? "업데이트 완료" : "저장 완료"}
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


function getCompletedUserSessions(sessions = []) {
  return (sessions || []).filter((session) => session?.isComplete || session?.status === "completed");
}

function getSessionScoreForInsight(session) {
  if (!session) return 0;
  return Number(session.summary?.totalScore ?? getSessionTotal(session) ?? 0) || 0;
}

function getCurrentRecordStreak(sessions = []) {
  const completed = getCompletedUserSessions(sessions);
  const daySet = new Set(completed.map((session) => getSessionDayKey(session)).filter(Boolean));
  let streak = 0;
  const cursor = new Date(getCurrentLocalDateString());
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (!daySet.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}


function buildAutoGoalInsight(sessions = []) {
  const completed = getCompletedUserSessions(sessions)
    .slice()
    .sort((a, b) => {
      const byDate = String(b.sessionDate || b.updatedAt || "").localeCompare(String(a.sessionDate || a.updatedAt || ""));
      if (byDate !== 0) return byDate;
      return String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""));
    });

  const recent = completed.slice(0, 7);
  const scores = recent
    .map((session) => getSessionScoreForInsight(session))
    .filter((score) => Number.isFinite(score) && score > 0);

  if (scores.length < 3) {
    return {
      ready: false,
      count: scores.length,
      currentAverage: 0,
      recentBest: 0,
      nextTarget: null,
      targetStep: 0,
      latestScore: scores[0] || 0,
      achievedPreviousTarget: false,
      previousTarget: null,
      message: "목표 생성은 최근 기록 3회 이상부터 시작됩니다.",
    };
  }

  const currentAverage = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  const recentBest = Math.max(...scores);
  const growthGap = Math.max(0, recentBest - currentAverage);
  const targetStep = Math.max(3, Math.min(10, Math.round(growthGap * 0.5) || 3));
  const nextTarget = Math.min(1440, currentAverage + targetStep);

  const previousScores = scores.slice(1);
  let previousTarget = null;
  if (previousScores.length >= 3) {
    const previousAverage = Math.round(previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length);
    const previousBest = Math.max(...previousScores);
    const previousGap = Math.max(0, previousBest - previousAverage);
    const previousStep = Math.max(3, Math.min(10, Math.round(previousGap * 0.5) || 3));
    previousTarget = Math.min(1440, previousAverage + previousStep);
  }

  const latestScore = scores[0] || 0;
  const achievedPreviousTarget = previousTarget !== null && latestScore >= previousTarget;

  return {
    ready: true,
    count: scores.length,
    currentAverage,
    recentBest,
    nextTarget,
    targetStep,
    latestScore,
    achievedPreviousTarget,
    previousTarget,
    message: `현재 평균 ${currentAverage}점 · 최근 최고 ${recentBest}점 · 다음 목표 ${nextTarget}점`,
  };
}


function buildPostSaveInsight({ savedSession, users = [], sessions = [], currentUser }) {
  const completedSavedSession = {
    ...savedSession,
    id: savedSession?.id || "latest_saved_preview",
    sessionId: savedSession?.sessionId || "latest_saved_preview",
    isComplete: true,
    status: "completed",
  };
  const attempts = getQualifiedDistanceAttempts(completedSavedSession);
  const bestAttempt = attempts
    .slice()
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return Number(b.distance) - Number(a.distance);
    })[0];

  const score = getSessionScoreForInsight(completedSavedSession);
  const myPreviousSessions = getCompletedUserSessions(sessions).filter((session) => session.userId === currentUser?.id);
  const goalBefore = buildAutoGoalInsight(myPreviousSessions);
  const goalAfter = buildAutoGoalInsight([...myPreviousSessions, completedSavedSession]);
  const previousBest = myPreviousSessions.reduce((best, session) => Math.max(best, getSessionScoreForInsight(session)), 0);
  const isPersonalBest = score > previousBest;
  const goalAchieved = goalBefore.ready && goalBefore.nextTarget !== null && score >= goalBefore.nextTarget;

  const displayUsers = users.some((user) => user.id === currentUser?.id)
    ? users
    : currentUser
      ? [...users, currentUser]
      : users;
  const comparisonSessions = [...sessions, completedSavedSession];

  if (!bestAttempt || !currentUser) {
    return {
      score,
      currentRank: "-",
      schoolRank: "-",
      rankDelta: 0,
      rivalText: "랭킹 비교를 위해서는 36발 거리 기록이 필요하다.",
      personalBest: isPersonalBest,
      goalAchieved,
      previousTarget: goalBefore.nextTarget,
      nextTarget: goalAfter.nextTarget,
      goalMessage: goalAfter.message,
      streak: getCurrentRecordStreak(comparisonSessions.filter((session) => session.userId === currentUser?.id)),
    };
  }

  const rankingGroup = getRankingGroup(currentUser.division || completedSavedSession.division, currentUser.gender || completedSavedSession.gender);
  const baseFilters = {
    distance: String(bestAttempt.distance),
    rankingGroup,
    groupName: "all",
    regionCity: "all",
    gender: currentUser.gender || "all",
    dateFilter: "all",
    customDate: getCurrentLocalDateString(),
  };

  const sortDistance = (items) =>
    items
      .slice()
      .sort((a, b) => {
        if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
        return String(b.latestDate).localeCompare(String(a.latestDate));
      })
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const beforeRanking = sortDistance(buildDistanceRankings(displayUsers, sessions, baseFilters));
  const afterRanking = sortDistance(buildDistanceRankings(displayUsers, comparisonSessions, baseFilters));
  const beforeMe = beforeRanking.find((item) => item.userId === currentUser.id);
  const afterMe = afterRanking.find((item) => item.userId === currentUser.id);

  const schoolFilters = { ...baseFilters, groupName: currentUser.groupName || "all" };
  const schoolRanking = sortDistance(buildDistanceRankings(displayUsers, comparisonSessions, schoolFilters));
  const schoolMe = schoolRanking.find((item) => item.userId === currentUser.id);
  const schoolIndex = schoolRanking.findIndex((item) => item.userId === currentUser.id);
  const rival = schoolIndex > 0 ? schoolRanking[schoolIndex - 1] : schoolRanking[schoolIndex + 1];
  const rivalGap = rival && schoolMe ? Math.abs(Number(rival.bestScore || 0) - Number(schoolMe.bestScore || 0)) : null;

  return {
    score,
    distance: bestAttempt.distance,
    bestScore: bestAttempt.score,
    currentRank: afterMe?.rank || "-",
    schoolRank: schoolMe?.rank || "-",
    rankDelta: beforeMe && afterMe ? beforeMe.rank - afterMe.rank : 0,
    rivalText: rival
      ? `${rival.name} (${rival.groupName || "같은 학교"}) · ${rivalGap}점 차이`
      : "같은 조건의 라이벌 데이터가 더 쌓이면 자동으로 표시된다.",
    personalBest: isPersonalBest,
    goalAchieved,
    previousTarget: goalBefore.nextTarget,
    nextTarget: goalAfter.nextTarget,
    goalMessage: goalAfter.message,
    streak: getCurrentRecordStreak(comparisonSessions.filter((session) => session.userId === currentUser.id)),
  };
}



function RoutinePage({ appServices, currentUser, routines = [], sessions = [], onRoutineSaved, onStartSession }) {
  const today = getCurrentLocalDateString();
  const existingRoutine = getRoutineForDate(routines, today);
  const savedTodayRoutine = getSavedRoutineForToday(currentUser?.id, existingRoutine, today);
  const storedRoutineItems = useMemo(() => readStoredRoutineItems(currentUser?.id), [currentUser?.id]);
  const routineDraftKey = getRoutineDraftSessionKey(currentUser?.id, today);
  const [items, setItems] = useState(() => {
    const draft = readSessionStorageJSON(routineDraftKey, null);
    const baseItems = draft?.items?.length
      ? draft.items
      : savedTodayRoutine?.items?.length
        ? savedTodayRoutine.items
        : storedRoutineItems.length
          ? storedRoutineItems
          : ROUTINE_TEMPLATE_ITEMS;
    return normalizeRoutineItems(baseItems);
  });
  const [newItemLabel, setNewItemLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(savedTodayRoutine ? "오늘 저장된 루틴을 불러왔다. 필요하면 체크 상태를 수정한 뒤 다시 저장하면 된다." : "");

  useEffect(() => {
    const draft = readSessionStorageJSON(routineDraftKey, null);
    const stored = readStoredRoutineItems(currentUser?.id);
    const currentSavedRoutine = getSavedRoutineForToday(currentUser?.id, existingRoutine, today);
    const baseItems = draft?.items?.length
      ? draft.items
      : currentSavedRoutine?.items?.length
        ? currentSavedRoutine.items
        : stored.length
          ? stored
          : ROUTINE_TEMPLATE_ITEMS;
    setItems(normalizeRoutineItems(baseItems));
    if (currentSavedRoutine && !draft?.items?.length) {
      setNotice("오늘 저장된 루틴을 불러왔다. 필요하면 체크 상태를 수정한 뒤 다시 저장하면 된다.");
    }
  }, [currentUser?.id, existingRoutine?.id, today, routineDraftKey]);

  useEffect(() => {
    if (!currentUser?.id) return;
    writeStoredRoutineItems(currentUser.id, items);
    writeSessionStorageJSON(routineDraftKey, { date: today, items: normalizeRoutineItems(items) });
  }, [currentUser?.id, items, routineDraftKey, today]);

  const stats = useMemo(() => calculateRoutineStats(items), [items]);
  const correlation = useMemo(() => getRoutineSessionCorrelation(routines, sessions), [routines, sessions]);
  const [routineCompleteDialogOpen, setRoutineCompleteDialogOpen] = useState(false);

  function playRoutineCompleteSound() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        const start = ctx.currentTime + index * 0.11;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.08, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
        oscillator.start(start);
        oscillator.stop(start + 0.18);
      });
      window.setTimeout(() => ctx.close?.(), 700);
    } catch {
      // sound effect unavailable
    }
  }

  function updateItem(id, patch) {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function deleteItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function addItem() {
    const label = newItemLabel.trim();
    if (!label) return;
    setItems((prev) => [...prev, { id: uid("routine"), label, checked: false }]);
    setNewItemLabel("");
  }

  async function saveRoutine() {
    if (!appServices?.db || !currentUser?.id) return;
    setSaving(true);
    setNotice("");
    try {
      const normalizedStats = calculateRoutineStats(items);
      const routineId = makeRoutineDocId(currentUser.id, today);
      const payload = {
        userId: currentUser.id,
        date: today,
        items: normalizedStats.items,
        completionRate: normalizedStats.completionRate,
        completedCount: normalizedStats.completedCount,
        totalCount: normalizedStats.totalCount,
        updatedAt: serverTimestamp(),
        createdAt: existingRoutine?.createdAt || serverTimestamp(),
      };
      await setDoc(doc(appServices.db, "routines", routineId), payload, { merge: true });
      const optimisticRoutine = {
        id: routineId,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      writeStoredRoutineRecord(currentUser.id, optimisticRoutine);
      setNotice(
        normalizedStats.completionRate === 100
          ? "🔥 최적 준비 상태. 오늘의 성실함이 실력을 만든다."
          : `훈련 전 준비 상태 ${normalizedStats.completionRate}% 저장 완료.`
      );
      if (normalizedStats.completionRate === 100) {
        playRoutineCompleteSound();
        setRoutineCompleteDialogOpen(true);
      }
      await onRoutineSaved?.(optimisticRoutine);
    } catch (error) {
      const permissionMessage = String(error?.message || "").includes("permission")
        ? "루틴 저장 권한이 없습니다. Firestore Rules에 routines 권한을 추가해야 합니다."
        : error.message || "루틴 저장에 실패했다.";
      setNotice(permissionMessage);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-900" /> X-Routine
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-3xl bg-gradient-to-br from-blue-950 to-red-800 p-5 text-white">
            <div className="text-sm opacity-80">훈련 전 준비 상태</div>
            <div className="mt-2 text-5xl font-black">{stats.completionRate}%</div>
            <div className="mt-2 text-sm opacity-80">{getDynamicMotivation(stats.completionRate)}</div>
            <div className="mt-3">
              <Progress value={stats.completionRate} className="h-3 bg-white/20" />
            </div>
            <div className="mt-3 text-sm opacity-90">
              {stats.completedCount}/{stats.totalCount} 완료 · {getRoutineReadinessMessage(stats.completionRate)}
            </div>
          </div>

          <div className="grid gap-2">
            {stats.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => updateItem(item.id, { checked: e.target.checked })}
                  className="h-5 w-5"
                />
                <Input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  className="h-9 rounded-xl"
                />
                <Button type="button" variant="outline" className="h-9 rounded-xl px-2" onClick={() => deleteItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_auto]">
            <Input
              value={newItemLabel}
              onChange={(e) => setNewItemLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
              }}
              placeholder="추가 루틴 입력: 예) 영어 인터뷰 2문장"
              className="h-11 rounded-2xl"
            />
            <Button type="button" variant="outline" className="h-11 rounded-2xl" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" /> 루틴 추가
            </Button>
          </div>

          {notice ? (
            <div className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>
          ) : null}

          <div className="grid gap-2 md:grid-cols-2">
            <Button className="h-12 rounded-2xl bg-blue-950 text-white hover:bg-blue-900" onClick={saveRoutine} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              루틴 저장
            </Button>
            <Button variant="outline" className="h-12 rounded-2xl" onClick={onStartSession}>
              기록 시작하기
            </Button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">루틴 + 기록 상관관계</div>
            {correlation.ready ? (
              <div className="mt-3 grid gap-3">
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="rounded-2xl bg-white p-3">
                    <div className="text-xs text-slate-500">루틴 80% 이상 평균</div>
                    <div className="mt-1 text-2xl font-bold text-blue-950">{correlation.highAverage ?? "-"}점</div>
                    <div className="mt-1 text-xs text-slate-500">{correlation.highCount}일 기준</div>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <div className="text-xs text-slate-500">루틴 50% 이하 평균</div>
                    <div className="mt-1 text-2xl font-bold text-red-800">{correlation.lowAverage ?? "-"}점</div>
                    <div className="mt-1 text-xs text-slate-500">{correlation.lowCount}일 기준</div>
                  </div>
                  <div className="rounded-2xl bg-white p-3">
                    <div className="text-xs text-slate-500">루틴 효과</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">
                      {correlation.delta !== null ? `${correlation.delta > 0 ? "+" : ""}${correlation.delta}점` : "분석중"}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">동일 날짜 루틴+기록 {correlation.pairedCount}일</div>
                  </div>
                </div>

                {correlation.itemInsights.length ? (
                  <div className="rounded-2xl bg-white p-3">
                    <div className="font-semibold text-slate-900">영향이 큰 루틴</div>
                    <div className="mt-2 grid gap-2">
                      {correlation.itemInsights.map((item) => (
                        <div key={item.label} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2">
                          <span className="truncate">{item.label}</span>
                          <span className={`font-semibold ${item.delta >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                            {item.delta > 0 ? "+" : ""}{item.delta}점
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white p-3 text-xs text-slate-500">
                    항목별 영향도는 체크/미체크 데이터가 각각 2일 이상 쌓이면 표시된다.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-1">
                훈련 전 루틴과 기록을 같은 날짜에 5일 이상 남기면, 루틴 80% 이상인 날과 50% 이하인 날의 평균 기록 차이를 보여준다.
                <div className="mt-2 rounded-2xl bg-white p-3 text-xs text-slate-500">
                  현재 매칭 데이터 {correlation.pairedCount}/5일
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={routineCompleteDialogOpen} onOpenChange={setRoutineCompleteDialogOpen}>
        <DialogContent className="overflow-hidden rounded-[32px] border-0 bg-white p-0 shadow-2xl">
          <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-red-800 p-6 text-white">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-yellow-300/20 blur-2xl" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">🎯 최적 준비 상태</DialogTitle>
              <DialogDescription className="text-white/80">
                훈련 전 루틴 100% 완료. 이제 기록으로 오늘의 흐름을 확인해보자.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid gap-2 rounded-3xl bg-white/10 p-4 text-sm">
              <div>✅ 준비 루틴 완료</div>
              <div>🔥 오늘의 성실함이 실력을 만든다</div>
              <div>📈 기록을 남기면 성장 흐름에 반영된다</div>
            </div>
            <DialogFooter className="mt-5 gap-2 sm:justify-between">
              <Button
                type="button"
                className="rounded-2xl border border-white/40 bg-blue-950 text-white hover:bg-blue-900"
                onClick={() => setRoutineCompleteDialogOpen(false)}
              >
                확인
              </Button>
              <Button
                type="button"
                className="rounded-2xl border border-white bg-white font-semibold !text-blue-950 hover:bg-slate-100 hover:!text-blue-950"
                style={{ color: "#172554" }}
                onClick={() => {
                  setRoutineCompleteDialogOpen(false);
                  onStartSession?.();
                }}
              >
                X-Session 기록 시작
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


function Dashboard({ sessions, routines = [], currentUser, loading, onEditSession, onStartSession }) {
  const completed = getCompletedUserSessions(sessions);
  const recordStreak = getCurrentRecordStreak(sessions);
  const allTimeBestScore = completed.reduce((best, session) => Math.max(best, getSessionScoreForInsight(session)), 0);

  const todayKey = getTodayKey();
  const yesterdayKey = getYesterdayKey();
  const todayRoutine = getRoutineForDate(routines, todayKey) || readStoredRoutineRecord(currentUser?.id, todayKey);
  const todayRoutineRate = todayRoutine?.completionRate || 0;
  const hasTodayRoutine = Boolean(todayRoutine);
  const routineCorrelation = getRoutineSessionCorrelation(
    todayRoutine && !routines.some((routine) => routine.id === todayRoutine.id) ? [todayRoutine, ...routines] : routines,
    sessions
  );

  const getDashboardSessionDayKey = (session) =>
    toLocalDateKey(session?.sessionDate || session?.updatedAt || session?.createdAt);

  const todaySessions = completed.filter((s) => getDashboardSessionDayKey(s) === todayKey);
  const yesterdaySessions = completed.filter((s) => getDashboardSessionDayKey(s) === yesterdayKey);

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
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardContent className="grid gap-4 p-5 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div>
            <div className="text-xs font-semibold text-slate-500">입력 → 결과 → 비교 → 반복</div>
            <div className="mt-2 text-2xl font-bold text-slate-950">
              { !hasTodayRoutine
                ? "⚠ 오늘 루틴 기록 없음"
                : todayCount
                  ? `🔥 ${recordStreak}일 연속 기록중`
                  : "⚠ 오늘 세션 기록 없음"
              }
            </div>
            <div className="mt-2 text-sm text-slate-600">
              { !hasTodayRoutine
                ? "오늘 루틴을 먼저 체크하면 준비 상태와 성장 흐름을 확인할 수 있다."
                : todayCount
                  ? `오늘 ${todayCount}개 기록 완료 · 개인 최고 ${allTimeBestScore}점 · 준비 상태 ${todayRoutineRate}%`
                  : `루틴 ${todayRoutineRate}% 달성. 세션 기록은 아직 없다. 기록을 남기면 내 성장과 순위를 확인할 수 있다.`
              }
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">1. 내 기록</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">2. 내 성장</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">3. 내 순위</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">4. 전체 랭킹</span>
            </div>
            <div className="mt-4 rounded-2xl bg-blue-50 p-3 text-xs text-blue-950">
              <div className="font-semibold">{hasTodayRoutine ? `오늘 준비 상태 ${todayRoutineRate}%` : "오늘 루틴 기록 없음"}</div>
              {routineCorrelation.ready && routineCorrelation.highAverage !== null && routineCorrelation.lowAverage !== null ? (
                <div className="mt-1">
                  루틴 80% 이상 평균 {routineCorrelation.highAverage}점 · 50% 이하 평균 {routineCorrelation.lowAverage}점 · 차이 {routineCorrelation.delta > 0 ? "+" : ""}{routineCorrelation.delta}점
                </div>
              ) : (
                <div className="mt-1">
                  {hasTodayRoutine
                    ? `루틴과 기록을 5일 이상 남기면 상관관계를 보여준다. 현재 ${routineCorrelation.pairedCount}/5일`
                    : `오늘 루틴 기록이 없다. 루틴과 기록을 5일 이상 함께 남기면 상관관계를 보여준다. 현재 ${routineCorrelation.pairedCount}/5일`}
                </div>
              )}
            </div>
          </div>
          <Button className="h-12 rounded-2xl bg-blue-950 text-white hover:bg-blue-900" onClick={onStartSession}>
            X-Session 기록 시작
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-red-700 to-red-500 p-0 text-white">
            <div className="grid grid-cols-2 divide-x divide-white/20">
              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 누적 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayTotal}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {yesterdayKey} 기록 기준 점수 합산
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 누적 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayTotal}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayCount ? `오늘 세션 ${todayCount}개 · 평균 ${todayAverage}` : "오늘 세션 기록 없음"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-slate-900 to-slate-700 p-0 text-white">
            <div className="grid grid-cols-2 divide-x divide-white/20">
              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 화살 평균 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayAverage}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  X {previousDayXCount}개
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 화살 평균 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayAverage}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayCount ? `X ${todayXCount}개` : "오늘 세션 기록 없음"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[28px] border-0 shadow-xl">
          <CardContent className="h-full bg-gradient-to-br from-amber-500 to-yellow-400 p-0 text-slate-900">
            <div className="grid grid-cols-2 divide-x divide-slate-900/10">
              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">전일 세션 거리 최고 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {previousDayBestScore}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {previousDayBest ? `${previousDayBestDistance}m 최고` : "전일 기록 없음"}
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-5">
                <div className="text-[13px] leading-snug opacity-80 md:text-sm">당일 세션 거리 최고 점수</div>
                <div className="mt-2 text-[2.4rem] font-bold tracking-tight md:text-3xl">
                  {todayBestScore}
                </div>
                <div className="mt-2 text-[11px] leading-snug opacity-80 md:text-xs">
                  {todayBest ? `${todayBestDistance}m 최고` : "오늘 세션 기록 없음"}
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
                .sort((a, b) => {
                  const bySessionDate = new Date(b.sessionDate || 0) - new Date(a.sessionDate || 0);
                  if (bySessionDate !== 0) return bySessionDate;
                  return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
                })
                .map((session) => (
                  <div
                    key={session.id}
                    className="grid gap-2 rounded-3xl border border-slate-200 p-3 md:p-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className="rounded-full bg-gradient-to-r from-blue-900 to-red-700 text-white">
                            {getModeLabel(session.mode)}
                          </Badge>
                          <Badge className="rounded-full bg-emerald-600 text-white">
                            완료
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          className="h-8 shrink-0 rounded-xl px-2 text-xs"
                          onClick={() => onEditSession?.(session.id)}
                        >
                          <Pencil className="mr-1 h-3 w-3" /> 수정
                        </Button>
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


function RankingBoard({ users, sessions, currentUser, currentUserId, officialClaims = [], onRequestOfficialClaim }) {
  const initialRankingGroup = getRankingGroup(currentUser?.division || "", currentUser?.gender || "남") || "all";
  const initialGender = currentUser?.gender || "all";
  const [rankingType, setRankingType] = useState("total");
  const [rankingFilters, setRankingFilters] = useState({
    distance: "all",
    rankingGroup: initialRankingGroup,
    groupName: "all",
    regionCity: "all",
    gender: initialGender,
    dateFilter: "all",
    customDate: getCurrentLocalDateString(),
  });
  const [hideOfficialRecords, setHideOfficialRecords] = useState(false);
  const [schoolSearchInput, setSchoolSearchInput] = useState("");
  const [showAllRankings, setShowAllRankings] = useState(false);
  const initialRankingAppliedRef = useRef(false);

  useEffect(() => {
    if (initialRankingAppliedRef.current || !currentUser?.id) return;
    initialRankingAppliedRef.current = true;
    const nextRankingGroup = getRankingGroup(currentUser.division || "", currentUser.gender || "남") || "all";
    setRankingType("total");
    setRankingFilters((prev) => ({
      ...prev,
      distance: "all",
      rankingGroup: nextRankingGroup,
      gender: currentUser.gender || "all",
    }));
  }, [currentUser?.id, currentUser?.division, currentUser?.gender]);

  const rankingUsers = useMemo(() => {
    const base = hideOfficialRecords ? users.filter((user) => !user.isSampleData && !user.isOfficialRecordUser) : users;
    if (hideOfficialRecords && currentUser?.id && !base.some((user) => user.id === currentUser.id)) {
      return [...base, currentUser];
    }
    return base;
  }, [users, hideOfficialRecords, currentUser]);
  const rankingSessions = useMemo(() => {
    if (!hideOfficialRecords) return sessions;
    const allowedUserIds = new Set(rankingUsers.map((user) => user.id));
    return sessions.filter((session) => allowedUserIds.has(session.userId));
  }, [sessions, rankingUsers, hideOfficialRecords]);
  const effectiveRankingUsers = useMemo(() => {
    if (!hideOfficialRecords) return rankingUsers;
    const map = new Map(rankingUsers.map((user) => [user.id, user]));
    rankingSessions.forEach((session) => {
      if (!session.userId || map.has(session.userId)) return;
      map.set(session.userId, {
        id: session.userId,
        uid: session.userId,
        name: session.name || "사용자",
        groupName: session.groupName || "",
        regionCity: session.regionCity || "",
        division: session.division || "",
        gender: session.gender || "남",
      });
    });
    return Array.from(map.values());
  }, [rankingUsers, rankingSessions, hideOfficialRecords]);
  const sortKoreanOptions = useCallback((items) => [...items].filter(Boolean).sort((a, b) => String(a).localeCompare(String(b), "ko-KR")), []);
  const groupOptions = useMemo(() => sortKoreanOptions(Array.from(new Set(effectiveRankingUsers.map((u) => u.groupName).filter(Boolean)))), [effectiveRankingUsers, sortKoreanOptions]);
  const commitSchoolFilter = useCallback((value) => {
    const trimmed = String(value || "").trim();
    setRankingFilters((prev) => ({ ...prev, groupName: trimmed || "all" }));
    setSchoolSearchInput(trimmed);
  }, []);
  useEffect(() => {
    setSchoolSearchInput(rankingFilters.groupName === "all" ? "" : rankingFilters.groupName);
  }, [rankingFilters.groupName]);

  useEffect(() => {
    setShowAllRankings(false);
  }, [rankingType, rankingFilters.distance, rankingFilters.rankingGroup, rankingFilters.groupName, rankingFilters.regionCity, rankingFilters.gender, rankingFilters.dateFilter, rankingFilters.customDate, hideOfficialRecords]);

  const regionOptions = useMemo(() => sortKoreanOptions(REGION_OPTIONS), [sortKoreanOptions]);
  const rankingGroupOptions = useMemo(() => RANKING_GROUP_OPTIONS, []);
  const registeredUserCount = useMemo(() => {
    const ids = new Set();
    rankingSessions.forEach((session) => {
      if (getQualifiedDistanceAttempts(session).length) ids.add(session.userId);
    });
    return ids.size;
  }, [rankingSessions]);
  const usersById = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const requestableOfficialUserIds = useMemo(() => {
    if (!currentUser) return new Set();
    return new Set(
      users
        .filter((user) => user.isSampleData && isOfficialProfileMatch(user, currentUser))
        .filter((user) => !getApprovedClaimForSample(officialClaims, user.id))
        .map((user) => user.id)
    );
  }, [users, currentUser, officialClaims]);
  const requestedClaimBySampleUserId = useMemo(() => {
    const map = new Map();
    (officialClaims || []).forEach((claim) => {
      if (claim.requesterUid === currentUserId) map.set(claim.sampleUserId, claim);
    });
    return map;
  }, [officialClaims, currentUserId]);

  const distanceRankings = useMemo(() => {
    const items = buildDistanceRankings(effectiveRankingUsers, rankingSessions, rankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, rankingFilters]);

  const totalRankings = useMemo(() => {
    const items = buildTotalRankings(effectiveRankingUsers, rankingSessions, rankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, rankingFilters]);

  const weeklyDistanceRankings = useMemo(() => {
    const items = buildDistanceRankings(effectiveRankingUsers, rankingSessions, rankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, rankingFilters]);

  const weeklyTotalRankings = useMemo(() => {
    const items = buildTotalRankings(effectiveRankingUsers, rankingSessions, rankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, rankingFilters]);

  const activeRankings =
    rankingType === "distance"
      ? distanceRankings
      : rankingType === "total"
        ? totalRankings
        : rankingType === "weeklyDistance"
          ? weeklyDistanceRankings
          : weeklyTotalRankings;

  const visibleRankings = showAllRankings ? activeRankings : activeRankings.slice(0, 50);
  const hasMoreRankings = activeRankings.length > visibleRankings.length;

  const myRank = activeRankings.find((item) => item.userId === currentUserId);

  const rankingGuide =
    rankingType === "distance"
      ? rankingFilters.distance === "all"
        ? "전체 거리는 등록된 필수 거리 중 개인 최고 거리 기록 기준으로 순위가 결정됩니다. 한 거리만 있어도 거리 랭킹에는 반영됩니다."
        : "선택한 거리의 최고 기록 점수 기준으로 순위가 결정됩니다."
      : rankingType === "total"
        ? "학년/부문별 필수 4거리 최고 기록을 합산한 점수 기준으로 순위가 결정됩니다."
        : rankingType === "weeklyDistance"
          ? rankingFilters.distance === "all"
            ? "최근 7일 기준, 등록된 필수 거리 중 개인 최고 거리 기록으로 순위가 결정됩니다."
            : "최근 7일 기준, 선택한 거리의 최고 점수로 순위가 결정됩니다."
          : "최근 7일 동안 학년/부문별 필수 4거리 최고 기록을 합산한 점수 기준으로 순위가 결정됩니다.";

  const officialResultSources = useMemo(() => {
    if (hideOfficialRecords) return [];
    return OFFICIAL_RESULT_SOURCES.filter((item) => {
      if (!rankingGroupMatchesFilter(rankingFilters.rankingGroup, item.rankingGroup)) return false;
      if (rankingFilters.regionCity !== "all" && item.region !== rankingFilters.regionCity) return false;
      if (rankingFilters.gender !== "all" && item.gender !== rankingFilters.gender) return false;
      if (!isWithinDateFilter(item.date, rankingFilters.dateFilter || "all", rankingFilters.customDate)) return false;
      if (rankingFilters.groupName && rankingFilters.groupName !== "all") return false;
      return true;
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)));
  }, [rankingFilters, hideOfficialRecords]);

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
                        {myRank.distanceLabel || `${myRank.distance}m`} · 최고 {myRank.bestScore}점 · 인정 기록 {myRank.qualifiedSessions}개
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
                {hideOfficialRecords && (rankingType === "total" || rankingType === "weeklyTotal") ? (
                  <div className="mt-2 text-xs text-slate-500">
                    종합 랭킹은 부문별 필수 4거리 기록이 모두 있어야 표시됩니다. 예: 남자 대학/일반부는 90m·70m·50m·30m, 여자 대학/일반부는 70m·60m·50m·30m 기록이 필요합니다.
                  </div>
                ) : hideOfficialRecords ? (
                  <div className="mt-2 text-xs text-slate-500">
                    거리 랭킹은 최소 1개 거리 점수를 입력하면 표시됩니다. 학교/구분/성별/날짜 필터가 걸려 있으면 해당 조건에 맞는 기록만 보입니다.
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2">
            <Medal className="h-5 w-5 text-red-600" /> X-Ranking
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              공식/사용자 기록 {registeredUserCount.toLocaleString()}명
            </span>
            <label className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
              <input
                type="checkbox"
                checked={hideOfficialRecords}
                onChange={(e) => setHideOfficialRecords(e.target.checked)}
                className="h-3.5 w-3.5"
              />
              공식기록 제거 후 보기
            </label>
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
            {hideOfficialRecords ? (
              <div className="mt-2 font-semibold text-blue-950">공식기록을 제외하고 사용자 기록만 보고 있습니다.</div>
            ) : null}
            <div className="mt-2 font-semibold text-blue-950">👉 기록하면 순위에 반영됩니다.</div>
            <div className="mt-2 text-[11px] text-slate-500">
              첫 화면은 내 구분/성별 기준 종합랭킹 상위 50명만 가볍게 표시하고, 필요할 때만 전체 보기를 불러옵니다.
            </div>
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
                {rankingGroupOptions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">학교/소속</Label>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="min-w-0">
                  <input
                    list="ranking-school-options"
                    value={schoolSearchInput}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setSchoolSearchInput(nextValue);
                      if (groupOptions.includes(nextValue)) commitSchoolFilter(nextValue);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        commitSchoolFilter(e.currentTarget.value);
                      }
                    }}
                    placeholder="학교명을 입력하거나 선택"
                    className="h-9 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
                  />
                  <datalist id="ranking-school-options">
                    {groupOptions.map((item) => (
                      <option key={item} value={item} />
                    ))}
                  </datalist>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 rounded-xl px-3 text-xs"
                  onClick={() => commitSchoolFilter(schoolSearchInput)}
                >
                  적용
                </Button>
              </div>
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

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">날짜</Label>
              <div className="min-w-0 flex-1 space-y-2">
                <select
                  value={rankingFilters.dateFilter}
                  onChange={(e) => setRankingFilters((prev) => ({ ...prev, dateFilter: e.target.value }))}
                  className="h-9 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
                >
                  {DATE_FILTER_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
                {rankingFilters.dateFilter === "custom" && (
                  <input
                    type="date"
                    value={rankingFilters.customDate}
                    onChange={(e) => setRankingFilters((prev) => ({ ...prev, customDate: e.target.value }))}
                    className="h-9 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Label className="w-16 shrink-0 text-sm">성별</Label>
              <select
                value={rankingFilters.gender}
                onChange={(e) => setRankingFilters((prev) => ({ ...prev, gender: e.target.value }))}
                className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-2 text-xs outline-none"
              >
                <option value="all">전체 성별</option>
                <option value="남">남</option>
                <option value="여">여</option>
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
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  <span>
                    {showAllRankings
                      ? `전체 ${activeRankings.length.toLocaleString()}명 표시 중`
                      : `상위 ${Math.min(50, activeRankings.length).toLocaleString()}명 표시 중 · 전체 ${activeRankings.length.toLocaleString()}명`}
                  </span>
                  {activeRankings.length > 50 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-xl px-3 text-xs"
                      onClick={() => setShowAllRankings((prev) => !prev)}
                    >
                      {showAllRankings ? "상위 50명만 보기" : "전체 보기"}
                    </Button>
                  ) : null}
                </div>
                {visibleRankings.map((item) => (
                  <div
                    key={`${rankingType}_${item.userId}_${item.distance || item.distanceLabel || "total"}`}
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
                          {item.isSampleData ? (
                            <Badge className="h-5 rounded-full bg-slate-900 px-2 text-[10px] text-white">공식기록</Badge>
                          ) : (
                            <Badge variant="outline" className="h-5 rounded-full px-2 text-[10px]">사용자계정</Badge>
                          )}
                          {item.verifiedAthlete && (
                            <Badge className="h-5 rounded-full bg-emerald-600 px-2 text-[10px] text-white">인증 선수</Badge>
                          )}
                          {item.userId === currentUserId && (
                            <Badge className="h-5 rounded-full bg-blue-900 px-2 text-[10px] text-white">나</Badge>
                          )}
                          <div className="min-w-0 truncate text-[11px] text-slate-500">
                            {(rankingType === "distance" || rankingType === "weeklyDistance")
                              ? `${item.regionCity || "-"} · ${item.gender || "-"} · ${formatGroupDisplayName(item.groupName)} · ${formatProfileDivisionLabel(item.division)}`
                              : `${formatGroupDisplayName(item.groupName)} · ${item.regionCity || "-"} · ${item.gender || "-"} · ${formatProfileDivisionLabel(item.division)}`}
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
                          <span>{item.distanceLabel || `${item.distance}m`}</span>
                          <span>{item.rankingGroup}</span>
                          <span>{item.gender || "-"}</span>
                          <span>인정세션{item.qualifiedSessions}</span>
                          <span>{formatCompactDate(item.latestDate)}</span>
                        </div>
                      ) : (
                        <>
                          {item.requiredDistances.map((distance) => `${distance}m ${item.distanceScores[distance]}점`).join(" · ")}
                        </>
                      )}
                    </div>

                    {item.isSampleData && requestableOfficialUserIds.has(item.userId) && (
                      <div className="mt-2 rounded-2xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-950 md:ml-10">
                        <div className="font-semibold">이 기록이 본인인가요?</div>
                        <div className="mt-1 text-blue-800">
                          공식 기록을 내 계정으로 연결할 수 있습니다. 요청 후 관리자가 확인하면 내 기록으로 표시됩니다.
                        </div>
                        <div className="mt-2">
                          {requestedClaimBySampleUserId.get(item.userId)?.status === "pending" ? (
                            <Badge variant="outline" className="rounded-full border-amber-300 bg-amber-50 text-amber-700">연결 요청 대기중</Badge>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 rounded-2xl border-blue-200 bg-white px-3 text-xs text-blue-950 hover:bg-blue-100"
                              onClick={() => onRequestOfficialClaim?.(usersById.get(item.userId))}
                            >
                              내 기록으로 가져오기
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50/70 p-4 md:p-5">
            <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
              <Archive className="h-4 w-4" /> 공식 결과 목록
            </div>
            <div className="mt-2 text-xs leading-relaxed text-slate-500">
              리커브 공식 결과 원본 등록 현황이다. 2026-03-22와 2026-04-12 데이터를 포함하며, 사용자 기록 랭킹과 분리된 참고 목록으로 관리된다.
            </div>

            <div className="mt-4 grid gap-3">
              {officialResultSources.length === 0 ? (
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  현재 선택한 조건에 맞는 공식 결과 목록이 없다.
                </div>
              ) : (
                officialResultSources.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-slate-900 text-white">{item.bowType}</Badge>
                      <Badge variant="outline" className="rounded-full">{item.region}</Badge>
                      <Badge variant="outline" className="rounded-full">{item.gender}</Badge>
                      <Badge variant="outline" className="rounded-full">{item.rankingGroup}</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700">
                      <span className="font-medium">{formatCompactDate(item.date)}</span>
                      <span>원본유형 {item.sourceType}</span>
                      <span>상태 {item.status}</span>
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-600">{item.notes}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


function averageNumbers(values = []) {
  const valid = values.map(Number).filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : 0;
}

function getSessionAverageForGrowth(session) {
  const avg = session?.summary?.averageArrow ?? getAverageArrow(session);
  return Number.isFinite(Number(avg)) ? Number(avg) : 0;
}

function buildParentGrowthSummary(sessions = []) {
  const completed = sessions
    .filter((session) => session?.isComplete)
    .slice()
    .sort((a, b) => new Date(a.sessionDate || a.updatedAt || 0) - new Date(b.sessionDate || b.updatedAt || 0));

  if (completed.length === 0) {
    return {
      ready: false,
      recentAverage: "-",
      previousAverage: "-",
      delta: 0,
      deltaLabel: "기록 필요",
      statusLabel: "분석 대기",
      summary: "기록이 쌓이면 최근 평균, 이전 평균, 성장 흐름을 부모용 문장으로 보여준다.",
      action: "먼저 동일 조건 기록을 3회 이상 저장해야 한다.",
      retentionRate: "-",
    };
  }

  const latestFive = completed.slice(-5);
  const previousFive = completed.slice(-10, -5);
  const recentAverageValue = averageNumbers(latestFive.map(getSessionAverageForGrowth));
  const previousAverageValue = previousFive.length
    ? averageNumbers(previousFive.map(getSessionAverageForGrowth))
    : averageNumbers(completed.slice(0, Math.max(1, completed.length - latestFive.length)).map(getSessionAverageForGrowth));
  const delta = Number((recentAverageValue - previousAverageValue).toFixed(2));
  const latest = completed[completed.length - 1];
  const latestScore = getSessionAverageForGrowth(latest);
  const first = completed[0];
  const firstScore = getSessionAverageForGrowth(first);
  const totalDelta = Number((latestScore - firstScore).toFixed(2));
  const retentionRate = previousAverageValue ? Math.max(0, Math.min(130, Math.round((recentAverageValue / previousAverageValue) * 100))) : 100;

  let statusLabel = "유지";
  if (delta >= 0.2) statusLabel = "상승";
  if (delta <= -0.2) statusLabel = "하락";

  const deltaLabel = `${delta > 0 ? "+" : ""}${delta.toFixed(2)}`;
  const totalDeltaLabel = `${totalDelta > 0 ? "+" : ""}${totalDelta.toFixed(2)}`;

  return {
    ready: completed.length >= 2,
    recentAverage: recentAverageValue.toFixed(2),
    previousAverage: previousAverageValue.toFixed(2),
    delta,
    deltaLabel,
    statusLabel,
    retentionRate: `${retentionRate}%`,
    summary: `최근 ${latestFive.length}회 평균은 ${recentAverageValue.toFixed(2)}점이며 이전 구간 대비 ${deltaLabel}점 ${statusLabel} 흐름이다. 첫 기록 대비 변화는 ${totalDeltaLabel}점이다.`,
    action: delta >= 0.2
      ? "현재 훈련 방향은 유지하되, 가장 약한 거리에서 반복 기록을 더 쌓아라."
      : delta <= -0.2
        ? "최근 하락 구간이다. 루틴, 거리, 후반 세트 하락 여부를 먼저 확인해야 한다."
        : "기록은 유지 중이다. 점수보다 편차와 후반 유지율을 줄이는 쪽이 우선이다.",
  };
}

function buildLateSetDropInsight(sessions = []) {
  const candidates = sessions
    .filter((session) => session?.isComplete && session.recordInputType !== "distance" && Array.isArray(session.ends) && session.ends.length >= 4)
    .map((session) => {
      const ends = session.ends || [];
      const early = ends.slice(0, Math.ceil(ends.length / 2));
      const late = ends.slice(Math.floor(ends.length / 2));
      const earlyAverage = averageNumbers(early.map(endTotal));
      const lateAverage = averageNumbers(late.map(endTotal));
      return Number((lateAverage - earlyAverage).toFixed(1));
    });

  if (!candidates.length) {
    return {
      ready: false,
      value: "-",
      label: "엔드별 기록 필요",
      message: "세트/엔드별 기록이 4엔드 이상 쌓이면 후반 집중력 하락을 분석한다.",
    };
  }

  const averageDrop = Number(averageNumbers(candidates).toFixed(1));
  if (averageDrop < -1) {
    return {
      ready: true,
      value: `${averageDrop}점`,
      label: "후반 하락",
      message: `후반 엔드 평균이 초반보다 ${Math.abs(averageDrop)}점 낮다. 체력 또는 집중력 유지 훈련이 우선이다.`,
    };
  }

  if (averageDrop > 1) {
    return {
      ready: true,
      value: `+${averageDrop}점`,
      label: "후반 상승",
      message: `후반 엔드에서 평균 +${averageDrop}점 상승한다. 경기 후반 적응력이 좋은 편이다.`,
    };
  }

  return {
    ready: true,
    value: `${averageDrop > 0 ? "+" : ""}${averageDrop}점`,
    label: "후반 안정",
    message: "초반과 후반 점수 차이가 작다. 현재는 거리별 약점 분석을 우선하면 된다.",
  };
}

function getDistanceWeaknessFromPerformance(distancePerformance = []) {
  const valid = distancePerformance.filter((item) => Number(item.avgArrow) > 0);
  if (!valid.length) return { label: "거리 데이터 필요", message: "거리별 기록이 쌓이면 가장 약한 거리를 자동으로 찾는다." };
  const weakest = valid.slice().sort((a, b) => a.avgArrow - b.avgArrow)[0];
  const strongest = valid.slice().sort((a, b) => b.avgArrow - a.avgArrow)[0];
  const gap = Number((strongest.avgArrow - weakest.avgArrow).toFixed(2));
  return {
    label: `${weakest.label} 약점`,
    message: `${weakest.label} 평균 ${weakest.avgArrow}점으로 가장 낮다. 최고 거리(${strongest.label})와 ${gap}점 차이다.`,
  };
}


function AnalysisBoard({ currentUser, users, sessions, onNavigate }) {
  const analysisStateKey = getAnalysisSessionStateKey(currentUser?.id || currentUser?.uid || currentUser?.email || "guest");
  const savedAnalysisState = readSessionStorageJSON(analysisStateKey, {});
  const [period, setPeriod] = useState(savedAnalysisState.period || "day");
  const [matchType, setMatchType] = useState(savedAnalysisState.matchType || "all");
  const [dateFilter, setDateFilter] = useState(savedAnalysisState.dateFilter || "all");
  const [customAnalysisDate, setCustomAnalysisDate] = useState(savedAnalysisState.customAnalysisDate || getCurrentLocalDateString());
  const [requiredFilters, setRequiredFilters] = useState(savedAnalysisState.requiredFilters || {
    distance: "all",
    rankingGroup: "all",
    regionCity: "all",
  });
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1280 : window.innerWidth));
  const [activeAnalysisTab, setActiveAnalysisTab] = useState(savedAnalysisState.activeAnalysisTab || "summary");
  const [activeSideMenu, setActiveSideMenu] = useState(savedAnalysisState.activeSideMenu || "분석 리포트");
  const summarySectionRef = useRef(null);
  const detailSectionRef = useRef(null);
  const compareSectionRef = useRef(null);
  const trendSectionRef = useRef(null);
  const reportSectionRef = useRef(null);

  useEffect(() => {
    writeSessionStorageJSON(analysisStateKey, {
      period,
      matchType,
      dateFilter,
      customAnalysisDate,
      requiredFilters,
      activeAnalysisTab,
      activeSideMenu,
    });
  }, [analysisStateKey, period, matchType, dateFilter, customAnalysisDate, requiredFilters, activeAnalysisTab, activeSideMenu]);

  const scrollToAnalysisSection = useCallback((tab) => {
    setActiveAnalysisTab(tab);
    const sideLabelByTab = {
      summary: "대시보드",
      detail: "훈련 세션",
      compare: "비교 분석",
      trend: "훈련 계획",
      report: "분석 리포트",
    };
    if (sideLabelByTab[tab]) setActiveSideMenu(sideLabelByTab[tab]);
    const refByTab = { summary: summarySectionRef, detail: detailSectionRef, compare: compareSectionRef, trend: trendSectionRef, report: reportSectionRef };
    requestAnimationFrame(() => { refByTab[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); });
  }, []);

  const handleAnalysisTabChange = useCallback((tab) => {
    scrollToAnalysisSection(tab);
  }, [scrollToAnalysisSection]);

  const handleSideMenuClick = useCallback((item) => {
    setActiveSideMenu(item);
    if (item === "대시보드") { if (typeof onNavigate === "function") onNavigate("dashboard"); return; }
    if (item === "기록 입력") { if (typeof onNavigate === "function") onNavigate("record"); return; }
    if (item === "비교 분석") return scrollToAnalysisSection("compare");
    if (item === "분석 리포트") return scrollToAnalysisSection("report");
    if (item === "훈련 세션") return scrollToAnalysisSection("detail");
    if (item === "훈련 계획" || item === "목표 관리") return scrollToAnalysisSection("trend");
    return scrollToAnalysisSection("summary");
  }, [onNavigate, scrollToAnalysisSection]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleResize = () => setViewportWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileAnalysis = viewportWidth < 768;
  const isTabletAnalysis = viewportWidth >= 768 && viewportWidth < 1280;

  const currentName = getDisplayName(currentUser);
  const currentDivision = formatProfileDivisionLabel(currentUser?.division || "");

  const allMySessions = useMemo(
    () => sessions.filter((s) => s.userId === currentUser.id && (s.isComplete || s.status === "completed")),
    [sessions, currentUser.id]
  );

  const dynamicDistanceOptions = useMemo(() => {
    const values = new Set(DISTANCE_OPTIONS.map(String));
    allMySessions.forEach((session) => {
      if (session.recordInputType === "distance" && Array.isArray(session.distanceRounds)) {
        session.distanceRounds.forEach((round) => {
          if (Number(round.distance)) values.add(String(Number(round.distance)));
        });
      } else if (Number(session.distance)) {
        values.add(String(Number(session.distance)));
      }
    });
    return Array.from(values).map(Number).filter(Boolean).sort((a, b) => a - b);
  }, [allMySessions]);

  const matchesSelectedDistance = useCallback((session, selectedDistance) => {
    if (!selectedDistance || selectedDistance === "all") return true;
    if (String(session.distance) === String(selectedDistance)) return true;
    return (session.distanceRounds || []).some((round) => String(round.distance) === String(selectedDistance));
  }, []);

  const matchesSelectedRankingGroup = useCallback((session, user, selectedGroup) => {
    if (!selectedGroup || selectedGroup === "all") return true;
    return getRankingGroup(session.division || user?.division || "", session.gender || user?.gender || "남") === selectedGroup;
  }, []);

  const filteredMine = useMemo(() => allMySessions
    .filter((s) => matchesSelectedDistance(s, requiredFilters.distance))
    .filter((s) => matchesSelectedRankingGroup(s, currentUser, requiredFilters.rankingGroup))
    .filter((s) => requiredFilters.regionCity === "all" ? true : (s.regionCity || currentUser.regionCity || "") === requiredFilters.regionCity)
    .filter((s) => isWithinDateFilter(s.sessionDate, dateFilter, customAnalysisDate)),
    [allMySessions, matchesSelectedDistance, matchesSelectedRankingGroup, currentUser, requiredFilters, dateFilter, customAnalysisDate]
  );

  const analytics = useMemo(() => buildAnalyticsData(filteredMine, period, matchType), [filteredMine, period, matchType]);
  const distancePerformance = useMemo(() => getDistancePerformance(filteredMine), [filteredMine]);
  const trend = useMemo(() => getTrendInsight(filteredMine), [filteredMine]);
  const parentGrowthSummary = useMemo(() => buildParentGrowthSummary(filteredMine), [filteredMine]);
  const lateSetDropInsight = useMemo(() => buildLateSetDropInsight(filteredMine), [filteredMine]);
  const distanceWeakness = useMemo(() => getDistanceWeaknessFromPerformance(distancePerformance), [distancePerformance]);

  const sessionAverages = useMemo(() => filteredMine
    .filter((session) => session?.isComplete)
    .map((session) => Number(session.summary?.averageArrow ?? getAverageArrow(session)) || 0)
    .filter((value) => value > 0), [filteredMine]);

  const avgScore = sessionAverages.length ? Number(averageNumbers(sessionAverages).toFixed(2)) : 0;
  const bestScore = sessionAverages.length ? Number(Math.max(...sessionAverages).toFixed(2)) : 0;
  const variance = sessionAverages.length ? averageNumbers(sessionAverages.map((value) => Math.pow(value - avgScore, 2))) : 0;
  const consistencyIndex = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance) * 20)));

  const getSessionTenRate = useCallback((session) => {
    const arrows = (session.ends || []).flatMap((end) => end.arrows || []).filter((arrow) => arrow !== null && arrow !== undefined && String(arrow).trim() !== "");
    if (arrows.length) {
      const tenLike = arrows.filter((arrow) => String(arrow) === "10" || String(arrow).toUpperCase() === "X").length;
      return Math.round((tenLike / arrows.length) * 100);
    }
    const avg = Number(session.summary?.averageArrow ?? getAverageArrow(session)) || 0;
    return Math.max(0, Math.min(65, Math.round((avg - 6.8) * 18)));
  }, []);

  const tenRate = filteredMine.length ? Math.round(averageNumbers(filteredMine.map(getSessionTenRate))) : 0;

  const recentSessions = useMemo(() => filteredMine
    .slice()
    .sort((a, b) => new Date(b.sessionDate || b.updatedAt || 0) - new Date(a.sessionDate || a.updatedAt || 0))
    .slice(0, 5)
    .map((session) => {
      const avg = Number(session.summary?.averageArrow ?? getAverageArrow(session)) || 0;
      const distanceLabel = session.recordInputType === "distance"
        ? Array.from(new Set((session.distanceRounds || []).map((round) => `${round.distance}m`))).slice(0, 2).join("/") || "거리 기록"
        : `${session.distance || "-"}m`;
      return {
        date: formatDateOnly(session.sessionDate || session.updatedAt),
        distanceLabel,
        avg: avg.toFixed(1),
        tenRate: `${getSessionTenRate(session)}%`,
        condition: avg >= 8.7 ? "최상" : avg >= 8.3 ? "좋음" : avg >= 7.8 ? "보통" : "주의",
      };
    }), [filteredMine, getSessionTenRate]);

  const setAverages = useMemo(() => {
    const buckets = new Map();
    filteredMine.forEach((session) => {
      if (session.recordInputType === "distance") return;
      (session.ends || []).forEach((end, idx) => {
        const key = idx + 1;
        if (!buckets.has(key)) buckets.set(key, []);
        const arrows = (end.arrows || []).filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
        buckets.get(key).push(arrows.length ? endTotal(end) / arrows.length : 0);
      });
    });
    return Array.from({ length: 5 }, (_, idx) => {
      const values = (buckets.get(idx + 1) || []).filter(Boolean);
      return Number((values.length ? averageNumbers(values) : 0).toFixed(1));
    });
  }, [filteredMine]);

  const conditionChart = useMemo(() => [
    { label: "최상", avgArrow: Math.min(10, Number((avgScore + 0.7).toFixed(1))), tenRate: Math.min(60, tenRate + 12) },
    { label: "좋음", avgArrow: Math.min(10, Number((avgScore + 0.4).toFixed(1))), tenRate: Math.min(60, tenRate + 7) },
    { label: "보통", avgArrow: avgScore ? Number(avgScore.toFixed(1)) : 0, tenRate },
    { label: "나쁨", avgArrow: Math.max(0, Number((avgScore - 0.4).toFixed(1))), tenRate: Math.max(0, tenRate - 7) },
    { label: "최악", avgArrow: Math.max(0, Number((avgScore - 0.8).toFixed(1))), tenRate: Math.max(0, tenRate - 12) },
  ], [avgScore, tenRate]);

  const fatigueChart = useMemo(() => [1, 2, 3, 4, 5].map((setNo, idx) => ({
    label: `${setNo}세트`,
    avgArrow: setAverages[idx] || Math.max(0, Number((avgScore - idx * 0.15).toFixed(1))),
    tenRate: Math.max(0, tenRate - idx * 4),
  })), [setAverages, avgScore, tenRate]);

  const aiGrade = avgScore >= 8.8 && consistencyIndex >= 80 ? "A" : avgScore >= 8.2 ? "B+" : avgScore >= 7.6 ? "B" : "C+";
  const strongestDistance = distancePerformance.length ? distancePerformance.slice().sort((a, b) => b.avgArrow - a.avgArrow)[0] : null;
  const weakestDistance = distancePerformance.length ? distancePerformance.slice().sort((a, b) => a.avgArrow - b.avgArrow)[0] : null;
  const chartData = analytics.slice(-8);

  if (isMobileAnalysis) {
    const mobileTrendLabel = trend?.label || "기록 대기";
    const mobileFeedback = filteredMine.length
      ? `${parentGrowthSummary.summary} ${weakestDistance ? `${weakestDistance.label} 거리 보완이 필요합니다.` : "기록이 더 쌓이면 약점 거리를 표시합니다."}`
      : "기록을 저장하면 최근 평균과 점수 트렌드가 자동으로 표시됩니다.";

    return (
      <div className="grid gap-4">
        <Card className="rounded-[24px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-base">
              <span>모바일 성장 요약</span>
              <Badge className="rounded-full bg-blue-50 text-blue-700">기록 중심</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-[22px] bg-slate-950 p-5 text-white">
              <div className="text-xs text-slate-300">최근 평균 점수</div>
              <div className="mt-2 text-4xl font-black">{avgScore ? avgScore.toFixed(2) : "-"}</div>
              <div className="mt-2 text-sm text-slate-300">{parentGrowthSummary.deltaLabel} 지난 기간 대비</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">10점 비율</div>
                <div className="mt-1 text-xl font-black">{tenRate}%</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">안정성</div>
                <div className="mt-1 text-xl font-black">{consistencyIndex}%</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="text-xs text-slate-500">세션</div>
                <div className="mt-1 text-xl font-black">{filteredMine.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">점수 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avgArrow" name="평균" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-0 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">오늘 피드백</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-6 text-slate-700">
            <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">{mobileTrendLabel}</div>
            <div className="rounded-2xl bg-slate-50 p-4">{mobileFeedback}</div>
            <div className="text-xs text-slate-500">모바일은 기록과 핵심 트렌드만 표시한다. 상세 분석은 PC/태블릿에서 확인한다.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTabletAnalysis) {
    return (
      <div className="grid gap-4">
        <Card className="rounded-[28px] border-0 bg-white shadow-xl">
          <CardContent className="grid gap-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-black text-slate-950">X-Analysis</div>
                <div className="text-sm text-slate-500">태블릿용 2열 성장 분석 리포트</div>
              </div>
              <Badge className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">개발 중 전체 공개</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "평균 점수", value: avgScore ? avgScore.toFixed(2) : "-", sub: parentGrowthSummary.deltaLabel },
                { label: "10점 비율", value: `${tenRate}%`, sub: "화살별/추정 혼합" },
                { label: "일관성", value: `${consistencyIndex}%`, sub: "편차 기반" },
                { label: "훈련 세션", value: filteredMine.length, sub: "선택 조건 기준" },
              ].map((item) => (
                <div key={item.label} className="rounded-[22px] bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="mt-2 text-3xl font-black text-slate-950">{item.value}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-[24px] bg-slate-50 p-4">
                <div className="mb-3 font-black">점수 트렌드</div>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgArrow" name="평균 점수" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="rounded-[24px] bg-slate-50 p-4">
                <div className="mb-3 font-black">AI 분석 요약</div>
                <div className="rounded-3xl bg-white p-4">
                  <div className="text-5xl font-black text-emerald-700">{aiGrade}</div>
                  <div className="mt-3 text-sm leading-6 text-slate-700">{parentGrowthSummary.summary} {distanceWeakness.message}</div>
                </div>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-2xl bg-white p-3">{trend.label}</div>
                  <div className="rounded-2xl bg-white p-3">{lateSetDropInsight.message}</div>
                </div>
              </section>
            </div>

            <section className="rounded-[24px] bg-slate-50 p-4">
              <div className="mb-3 font-black">거리별 분석</div>
              <div className="grid gap-2 md:grid-cols-2">
                {distancePerformance.length ? distancePerformance.slice(0, 6).map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm">
                    <b>{row.label}</b>
                    <span>{row.avgArrow}점</span>
                    <span className={Number(row.avgArrow) >= avgScore ? "font-semibold text-emerald-600" : "font-semibold text-red-500"}>
                      {Number(row.avgArrow) >= avgScore ? "강점" : "보완"}
                    </span>
                  </div>
                )) : <div className="rounded-2xl bg-white p-5 text-center text-sm text-slate-500 md:col-span-2">거리별 기록을 저장하면 분석된다.</div>}
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <Card className="overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardContent className="p-0">
          <div className="grid min-h-[760px] grid-cols-1 bg-slate-100">
            <aside className="hidden">
              <div>
                <div className="text-xl font-black tracking-wide">ARCHERY ANALYTICS</div>
                <div className="mt-1 text-xs text-slate-400">훈련이 데이터가 되고, 성과가 결과가 된다</div>
              </div>
              <div className="mt-10 flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-red-600 text-lg font-black">{String(currentName || "김").slice(0, 1)}</div>
                <div>
                  <div className="font-black">{currentName}</div>
                  <div className="text-sm text-slate-300">{currentDivision || "선수"}</div>
                </div>
              </div>
              <div className="mt-8 space-y-2 border-t border-white/10 pt-6 text-sm">
                {["대시보드", "기록 입력", "훈련 세션", "분석 리포트", "비교 분석", "훈련 계획", "목표 관리"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSideMenuClick(item)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-white/10 active:scale-[0.99] ${activeSideMenu === item ? "bg-blue-600 text-white" : "text-slate-300"}`}
                  >
                    <BarChart3 className="h-4 w-4" /> {item}
                  </button>
                ))}
              </div>
              <div className="mt-auto rounded-3xl bg-white/10 p-4 text-xs text-slate-300">
                개발 중 전체 공개 · 배포 시 Pro/Coach 기능 잠금 예정
              </div>
            </aside>

            <main className="min-w-0 p-4 sm:p-5 xl:p-6">
              <div className="mb-5 grid gap-3 xl:flex xl:items-center xl:justify-between">
                <Tabs value={activeAnalysisTab} onValueChange={handleAnalysisTabChange} className="w-full xl:w-auto">
                  <TabsList className="grid h-12 grid-cols-5 rounded-2xl bg-white p-1 shadow-sm xl:w-[620px]">
                    <TabsTrigger value="summary" className="rounded-xl">종합 분석</TabsTrigger>
                    <TabsTrigger value="detail" className="rounded-xl">상세 분석</TabsTrigger>
                    <TabsTrigger value="compare" className="rounded-xl">비교 분석</TabsTrigger>
                    <TabsTrigger value="trend" className="rounded-xl">트렌드 분석</TabsTrigger>
                    <TabsTrigger value="report" className="rounded-xl">리포트</TabsTrigger>
                  </TabsList>
                </Tabs>
                <button type="button" onClick={() => handleAnalysisTabChange("report")} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-[0.99]">PDF 리포트 다운로드</button>
              </div>

              <div className="mb-5 grid gap-3 rounded-[24px] bg-white p-4 shadow-sm xl:grid-cols-6">
                <Select value={requiredFilters.distance} onValueChange={(value) => setRequiredFilters((prev) => ({ ...prev, distance: value }))}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="전체 거리" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 거리</SelectItem>
                    {dynamicDistanceOptions.map((distance) => <SelectItem key={distance} value={String(distance)}>{distance}m</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={requiredFilters.rankingGroup} onValueChange={(value) => setRequiredFilters((prev) => ({ ...prev, rankingGroup: value }))}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="전체 부문" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 학년/부문</SelectItem>
                    {RANKING_GROUP_OPTIONS.map((group) => <SelectItem key={group} value={group}>{group}</SelectItem>)}
                    <SelectItem value="고등부(남)">고등부(남)</SelectItem>
                    <SelectItem value="고등부(여)">고등부(여)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={requiredFilters.regionCity} onValueChange={(value) => setRequiredFilters((prev) => ({ ...prev, regionCity: value }))}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="전체 지역" /></SelectTrigger>
                  <SelectContent>{REGION_OPTIONS.map((region) => <SelectItem key={region} value={region === "전국" ? "all" : region}>{region}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="전체 날짜" /></SelectTrigger>
                  <SelectContent>{DATE_FILTER_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={matchType} onValueChange={setMatchType}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="전체 방식" /></SelectTrigger>
                  <SelectContent>{MATCH_TYPE_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-11 rounded-2xl bg-white"><SelectValue placeholder="분석 기준" /></SelectTrigger>
                  <SelectContent>{PERIOD_OPTIONS.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                </Select>
                {dateFilter === "custom" ? <Input type="date" value={customAnalysisDate} onChange={(e) => setCustomAnalysisDate(e.target.value)} className="h-11 rounded-2xl bg-white xl:col-span-2" /> : null}
              </div>

              <div ref={summarySectionRef} className="scroll-mt-6 grid gap-4 xl:grid-cols-5">
                {[
                  { icon: Target, label: "평균 점수(전체)", value: avgScore ? avgScore.toFixed(2) : "-", sub: `${parentGrowthSummary.deltaLabel} 지난 기간 대비`, color: "blue" },
                  { icon: Award, label: "10점 비율", value: `${tenRate}%`, sub: "화살별 기록은 실측, 거리합계는 추정", color: "emerald" },
                  { icon: Shield, label: "일관성 지수", value: `${consistencyIndex}%`, sub: "편차 기반 안정성", color: "amber" },
                  { icon: TrendingUp, label: "최고 점수", value: bestScore ? bestScore.toFixed(1) : "-", sub: "평균 화살 기준", color: "purple" },
                  { icon: CalendarRange, label: "훈련 세션", value: filteredMine.length, sub: "선택 조건 기준", color: "slate" },
                ].map(({ icon: Icon, label, value, sub, color }) => (
                  <div key={label} className="rounded-[24px] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 text-blue-700"><Icon className="h-5 w-5" /></div>
                      <div className="text-xs text-slate-500">{label}</div>
                    </div>
                    <div className="mt-3 text-3xl font-black text-slate-950">{value}</div>
                    <div className="mt-2 text-xs text-slate-500">{sub}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.95fr_0.9fr]">
                <section ref={detailSectionRef} className="scroll-mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between"><div className="text-lg font-black">거리별 정확도 분석</div><Badge className="rounded-full bg-blue-50 text-blue-700">실기록 기반</Badge></div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead><tr className="border-b bg-slate-50 text-left text-xs text-slate-500"><th className="px-3 py-3">거리</th><th className="px-3 py-3">평균 점수</th><th className="px-3 py-3">10점 비율</th><th className="px-3 py-3">그룹 크기</th><th className="px-3 py-3">변화 추이</th></tr></thead>
                      <tbody>
                        {distancePerformance.length ? distancePerformance.map((row) => {
                          const rate = Math.max(0, Math.min(60, Math.round((Number(row.avgArrow) - 6.8) * 18)));
                          const groupSize = Math.max(8, Number((42 - Number(row.avgArrow) * 3).toFixed(1)));
                          return (
                            <tr key={row.label} className="border-b last:border-0">
                              <td className="px-3 py-3 font-black">{row.label}</td>
                              <td className="px-3 py-3">{row.avgArrow}</td>
                              <td className="px-3 py-3">{rate}%</td>
                              <td className="px-3 py-3">{groupSize}cm</td>
                              <td className={`px-3 py-3 font-semibold ${Number(row.avgArrow) >= avgScore ? "text-emerald-600" : "text-red-500"}`}>{Number(row.avgArrow) >= avgScore ? "▲ 강점" : "▼ 보완"}</td>
                            </tr>
                          );
                        }) : <tr><td colSpan="5" className="px-3 py-10 text-center text-slate-500">거리별 기록을 저장하면 자동 분석된다.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section ref={compareSectionRef} className="scroll-mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-4 text-lg font-black">그룹핑 분석 <span className="text-sm font-normal text-slate-500">(평균 그룹 크기)</span></div>
                  <div className="grid gap-4 sm:grid-cols-[190px_minmax(0,1fr)] xl:grid-cols-1 2xl:grid-cols-[190px_minmax(0,1fr)]">
                    <div className="relative mx-auto grid h-44 w-44 place-items-center rounded-full border border-slate-200 bg-slate-100">
                      <div className="grid h-36 w-36 place-items-center rounded-full bg-slate-950"><div className="grid h-28 w-28 place-items-center rounded-full bg-blue-600"><div className="grid h-20 w-20 place-items-center rounded-full bg-red-600"><div className="grid h-12 w-12 place-items-center rounded-full bg-yellow-400"><div className="h-4 w-4 rounded-full bg-orange-500" /></div></div></div></div>
                    </div>
                    <div className="space-y-3 text-sm">
                      {[
                        ["10점 (±5cm)", strongestDistance ? `${Math.max(8, Number((42 - strongestDistance.avgArrow * 3).toFixed(1)))}cm` : "-"],
                        ["9점 (±10cm)", avgScore ? `${Math.max(12, Number((48 - avgScore * 3).toFixed(1)))}cm` : "-"],
                        ["8점 (±15cm)", weakestDistance ? `${Math.max(16, Number((52 - weakestDistance.avgArrow * 3).toFixed(1)))}cm` : "-"],
                        ["7점 이하", avgScore ? `${Math.max(20, Number((58 - avgScore * 3).toFixed(1)))}cm` : "-"],
                      ].map(([label, value], idx) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2"><span className="flex items-center gap-2"><span className={`h-3 w-3 rounded ${idx === 0 ? "bg-blue-600" : idx === 1 ? "bg-green-500" : idx === 2 ? "bg-amber-500" : "bg-slate-400"}`} />{label}</span><b>{value}</b></div>
                      ))}
                      <div className="text-xs text-slate-500">거리합계 입력은 실제 좌표가 없어 평균 기반 추정값이다.</div>
                    </div>
                  </div>
                </section>

                <section className="grid gap-4">
                  <div ref={reportSectionRef} className="scroll-mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                    <div className="text-lg font-black">AI 종합 분석 리포트</div>
                    <div className="mt-4 grid gap-4 rounded-3xl bg-emerald-50 p-5 sm:grid-cols-[92px_minmax(0,1fr)]">
                      <div className="text-6xl font-black text-emerald-700">{aiGrade}</div>
                      <div className="text-sm leading-6 text-slate-700">{parentGrowthSummary.summary} {distanceWeakness.message}</div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="font-black">핵심 인사이트</div>
                      <div className="rounded-2xl bg-slate-50 p-3">✅ {strongestDistance ? `${strongestDistance.label} 거리에서 가장 안정적입니다.` : "거리 기록이 쌓이면 강점 거리를 표시합니다."}</div>
                      <div className="rounded-2xl bg-slate-50 p-3">✅ {trend.label}</div>
                      <div className="rounded-2xl bg-slate-50 p-3">✅ {lateSetDropInsight.message}</div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="font-black">개선 권장사항</div>
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">1. {weakestDistance ? `${weakestDistance.label} 거리 반복 훈련을 우선 배치하세요.` : "기록을 3회 이상 저장하세요."}</div>
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">2. 후반 세트 집중력 유지를 위한 멘탈 루틴을 기록하세요.</div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-[1.08fr_0.95fr_0.9fr]">
                <section className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-3 text-lg font-black">컨디션별 성과 변화</div>
                  <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conditionChart} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgArrow" name="평균 점수" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <section className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-3 text-lg font-black">시간대별/세트별 성과 분석</div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[460px] text-center text-sm">
                      <thead><tr className="text-xs text-slate-500"><th className="py-2 text-left">구분</th>{[1,2,3,4,5].map((n) => <th key={n}>{n}세트</th>)}</tr></thead>
                      <tbody>
                        {["오전", "오후", "저녁"].map((label, rowIdx) => (
                          <tr key={label} className="border-t">
                            <td className="py-3 text-left font-semibold">{label}</td>
                            {setAverages.map((value, idx) => {
                              const shown = value ? Number((value - rowIdx * 0.15).toFixed(1)) : 0;
                              return <td key={idx} className={`${shown >= 8.5 ? "bg-green-200" : shown >= 8 ? "bg-lime-100" : "bg-yellow-100"} px-2 py-3 font-bold`}>{shown || "-"}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
                  <div className="mt-1 flex justify-between text-xs text-slate-500"><span>6.0</span><span>10.0</span></div>
                </section>

                <section className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between"><div className="text-lg font-black">최근 훈련 세션</div><span className="text-xs text-blue-600">전체 보기</span></div>
                  <div className="space-y-2">
                    {recentSessions.length ? recentSessions.map((item, idx) => (
                      <div key={`${item.date}-${idx}`} className="grid grid-cols-[72px_1fr_56px_64px] items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                        <span className="text-slate-500">{item.date}</span><span className="font-semibold">{item.distanceLabel}</span><span>{item.avg}</span><Badge className={`${item.condition === "최상" ? "bg-green-100 text-green-700" : item.condition === "좋음" ? "bg-emerald-100 text-emerald-700" : item.condition === "보통" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{item.condition}</Badge>
                      </div>
                    )) : <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">저장된 훈련 기록이 없습니다.</div>}
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <section ref={trendSectionRef} className="scroll-mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-3 text-lg font-black">점수 트렌드 분석</div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="avgArrow" name="평균 화살 점수" stroke={CHART_COLORS.avg} strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <section className="rounded-[24px] bg-white p-5 shadow-sm">
                  <div className="mb-3 text-lg font-black">세트별 성과 변화</div>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fatigueChart} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="avgArrow" name="평균 점수" fill={CHART_COLORS.avg} radius={[8, 8, 0, 0]} maxBarSize={34} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              </div>
            </main>
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



function EmptyNoticeCard({ title, description }) {
  return (
    <Card className="rounded-[28px] border-0 bg-white shadow-sm">
      <CardContent className="p-6 text-sm text-slate-500">
        <div className="font-bold text-slate-900">{title}</div>
        <div className="mt-2">{description}</div>
      </CardContent>
    </Card>
  );
}

function XStagePage({ appServices, stageRefreshKey = 0, briefRefreshKey = 0 }) {
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function loadStage() {
      if (!appServices?.db) return;
      setLoading(true);
      try {
        const [eventSnap, newsSnap, noticeSnap] = await Promise.all([
          getDocs(collection(appServices.db, "stage_events")),
          getDocs(collection(appServices.db, "stage_news")),
          getDocs(collection(appServices.db, "brief_notices")),
        ]);
        if (!alive) return;
        const loadedEvents = eventSnap.docs
          .map((snap) => ({ id: snap.id, ...snap.data() }))
          .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
        const loadedNews = newsSnap.docs
          .map((snap) => ({ id: snap.id, ...snap.data() }))
          .sort((a, b) => String(b.createdAt?.seconds || b.date || "").localeCompare(String(a.createdAt?.seconds || a.date || "")));
        const loadedNotices = noticeSnap.docs
          .map((snap) => ({ id: snap.id, ...snap.data() }))
          .sort((a, b) => String(b.createdAt?.seconds || b.date || "").localeCompare(String(a.createdAt?.seconds || a.date || "")));
        setEvents(loadedEvents);
        setNews(loadedNews);
        setNotices(loadedNotices);
      } catch (error) {
        console.warn("X-Stage load failed", error);
        if (alive) {
          setEvents([]);
          setNews([]);
          setNotices([]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadStage();
    return () => {
      alive = false;
    };
  }, [appServices?.db, stageRefreshKey, briefRefreshKey]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Award className="h-5 w-5 text-blue-600" /> X-Stage</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          대회 일정, 양궁 뉴스, 공지사항을 한 화면에서 확인하는 통합 운영 공간이다. 관리자 페이지에서 등록한 X-Stage / X-Brief 내용이 모두 여기에 표시된다.
        </CardContent>
      </Card>

      {loading ? (
        <Card className="rounded-[28px] border-0 bg-white shadow-sm"><CardContent className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> X-Stage 데이터를 불러오는 중</CardContent></Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader><CardTitle className="text-lg">대회 일정</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {events.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">등록된 대회 일정이 없습니다.</div>
            ) : (
              events.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-slate-950">{item.title || "대회 일정"}</div>
                    <Badge className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50">{item.date || "날짜 미정"}</Badge>
                  </div>
                  {item.location ? <div className="mt-2 text-sm text-slate-500">장소: {item.location}</div> : null}
                  {item.description ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.description}</div> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader><CardTitle className="text-lg">양궁 뉴스</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {news.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">등록된 뉴스가 없습니다.</div>
            ) : (
              news.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">{item.title || "양궁 뉴스"}</div>
                  {item.source || item.date ? <div className="mt-1 text-xs text-slate-400">{[item.source, item.date].filter(Boolean).join(" · ")}</div> : null}
                  {item.content || item.description ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.content || item.description}</div> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-0 bg-white shadow-sm">
          <CardHeader><CardTitle className="text-lg">공지사항</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {notices.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">등록된 공지사항이 없습니다.</div>
            ) : (
              notices.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                  <div className="font-bold text-slate-950">{item.title || "공지사항"}</div>
                  {item.date ? <div className="mt-1 text-xs text-slate-400">{item.date}</div> : null}
                  {item.content ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.content}</div> : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function XBriefPage({ appServices, briefRefreshKey = 0 }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function loadBrief() {
      if (!appServices?.db) return;
      setLoading(true);
      try {
        const snap = await getDocs(collection(appServices.db, "brief_notices"));
        if (!alive) return;
        const loaded = snap.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .sort((a, b) => String(b.createdAt?.seconds || b.date || "").localeCompare(String(a.createdAt?.seconds || a.date || "")));
        setNotices(loaded);
      } catch (error) {
        console.warn("X-Brief load failed", error);
        if (alive) setNotices([]);
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadBrief();
    return () => {
      alive = false;
    };
  }, [appServices?.db, briefRefreshKey]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl"><Archive className="h-5 w-5 text-blue-600" /> X-Brief</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          공지사항과 운영 안내를 확인하는 공간이다. 관리자 페이지에서 등록한 공지가 여기에 표시된다.
        </CardContent>
      </Card>

      {loading ? (
        <Card className="rounded-[28px] border-0 bg-white shadow-sm"><CardContent className="flex items-center gap-2 p-6 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> X-Brief 데이터를 불러오는 중</CardContent></Card>
      ) : null}

      <Card className="rounded-[28px] border-0 bg-white shadow-sm">
        <CardHeader><CardTitle className="text-lg">공지사항</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {notices.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">등록된 공지사항이 없습니다.</div>
          ) : (
            notices.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                <div className="font-bold text-slate-950">{item.title || "공지사항"}</div>
                {item.date ? <div className="mt-1 text-xs text-slate-400">{item.date}</div> : null}
                {item.content ? <div className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.content}</div> : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdminPanel({ currentUser, users, sessions, appServices, officialClaims = [], reviewedUserIds = [], onMarkUserReviewed, onMarkAllUsersReviewed, onApproveOfficialClaim, onRejectOfficialClaim, onRefresh, onStageRefresh, onBriefRefresh }) {
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
  const [adminEvents, setAdminEvents] = useState([]);
  const [adminNewsItems, setAdminNewsItems] = useState([]);
  const [adminBriefNotices, setAdminBriefNotices] = useState([]);
  const [adminPublishedLoading, setAdminPublishedLoading] = useState(false);
  const [deletingPublishedId, setDeletingPublishedId] = useState("");
  const [selectedApprovedClaim, setSelectedApprovedClaim] = useState(null);

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

  const realUsers = useMemo(() => users.filter((user) => !user.isSampleData && !isAdminEmail(user.email)), [users]);
  const adminUsers = useMemo(() => {
    const fromUsers = users.filter((user) => !user.isSampleData && isAdminEmail(user.email));
    if (currentUser?.email && isAdminEmail(currentUser.email) && !fromUsers.some((user) => user.id === currentUser.id)) {
      return [currentUser, ...fromUsers];
    }
    return fromUsers;
  }, [users, currentUser]);
  const allRegisteredUsers = useMemo(() => [...adminUsers, ...realUsers], [adminUsers, realUsers]);
  const reviewedUserIdSet = useMemo(() => new Set(reviewedUserIds || []), [reviewedUserIds]);
  const unreviewedUsers = useMemo(() => realUsers.filter((user) => !reviewedUserIdSet.has(user.id)), [realUsers, reviewedUserIdSet]);
  const realSessions = useMemo(() => sessions.filter((session) => !session.isSampleData), [sessions]);
  const profileOfficialClaims = useMemo(() => {
    const claims = [];
    realUsers.forEach((user) => {
      const requests = Array.isArray(user.officialClaimRequests) ? user.officialClaimRequests : [];
      requests.forEach((claim) => {
        if (claim?.id) claims.push({ ...claim, requesterUid: claim.requesterUid || user.id, requesterEmail: claim.requesterEmail || user.email || "" });
      });
      if (user.latestOfficialClaim?.id) {
        claims.push({ ...user.latestOfficialClaim, requesterUid: user.latestOfficialClaim.requesterUid || user.id, requesterEmail: user.latestOfficialClaim.requesterEmail || user.email || "" });
      }
    });
    return claims;
  }, [realUsers]);

  const mergedOfficialClaims = useMemo(() => {
    const map = new Map();
    [...(officialClaims || []), ...profileOfficialClaims].forEach((claim) => {
      if (!claim?.id) return;
      map.set(claim.id, { ...map.get(claim.id), ...claim });
    });
    return Array.from(map.values());
  }, [officialClaims, profileOfficialClaims]);

  const pendingOfficialClaims = useMemo(() => mergedOfficialClaims.filter((claim) => claim.status === "pending"), [mergedOfficialClaims]);
  const approvedOfficialClaims = useMemo(() => mergedOfficialClaims.filter((claim) => claim.status === "approved"), [mergedOfficialClaims]);

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
    const filtered = allRegisteredUsers.filter((user) => {
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
  }, [allRegisteredUsers, userSearch]);

  async function loadAdminPublishedItems() {
    if (!appServices?.db) {
      setAdminEvents([]);
      setAdminNewsItems([]);
      setAdminBriefNotices([]);
      return;
    }

    setAdminPublishedLoading(true);
    try {
      const [eventSnap, newsSnap, briefSnap] = await Promise.all([
        getDocs(collection(appServices.db, "stage_events")),
        getDocs(collection(appServices.db, "stage_news")),
        getDocs(collection(appServices.db, "brief_notices")),
      ]);

      const toTime = (value) => {
        if (typeof value?.toDate === "function") return value.toDate().getTime();
        const parsed = new Date(value || 0).getTime();
        return Number.isNaN(parsed) ? 0 : parsed;
      };

      const loadedEvents = eventSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")));
      const loadedNewsItems = newsSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));
      const loadedBriefNotices = briefSnap.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
        .sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));

      setAdminEvents(loadedEvents);
      setAdminNewsItems(loadedNewsItems);
      setAdminBriefNotices(loadedBriefNotices);
    } catch (error) {
      alert(error.message || "등록 목록을 불러오지 못했다.");
    } finally {
      setAdminPublishedLoading(false);
    }
  }

  useEffect(() => {
    loadAdminPublishedItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appServices]);

  async function deletePublishedItem(collectionName, itemId, label) {
    if (!appServices?.db || !itemId) return alert("삭제할 항목 정보가 부족하다.");
    const ok = window.confirm(`${label} 항목을 삭제할까?`);
    if (!ok) return;

    try {
      setDeletingPublishedId(`${collectionName}_${itemId}`);
      await deleteDoc(doc(appServices.db, collectionName, itemId));
      setPublishMessage(`${label} 항목을 삭제했다.`);
      await loadAdminPublishedItems();
      if (collectionName === "stage_events" || collectionName === "stage_news") onStageRefresh?.();
      if (collectionName === "brief_notices") onBriefRefresh?.();
    } catch (error) {
      alert(error.message || `${label} 삭제에 실패했다.`);
    } finally {
      setDeletingPublishedId("");
    }
  }


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
      await loadAdminPublishedItems();
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
      await loadAdminPublishedItems();
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
      await loadAdminPublishedItems();
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
          <div className="min-w-0 rounded-2xl bg-red-50 p-4">
            <div className="text-sm text-red-600">미확인 가입자</div>
            <div className="mt-2 text-3xl font-bold text-red-700">{unreviewedUsers.length}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-full overflow-hidden rounded-[28px] border-0 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">공식 기록 연결 요청</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 min-w-0">
          {pendingOfficialClaims.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-500">
              대기 중인 공식 기록 연결 요청이 없다.
            </div>
          ) : (
            pendingOfficialClaims.map((claim) => (
              <div key={claim.id} className="grid gap-3 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr_auto] md:items-center">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">
                    {claim.requesterName || "요청자"} → {claim.officialName || "공식기록"}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">
                    요청자 소속: {claim.requesterGroup || "-"} · 공식 소속: {claim.officialGroup || "-"} · 성별: {claim.gender || "-"}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    요청일: {formatDateOnly(claim.createdAt)} · 요청자 이메일: {claim.requesterEmail || "-"}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" className="rounded-2xl bg-blue-900 hover:bg-blue-800" onClick={() => onApproveOfficialClaim?.(claim)}>
                    승인
                  </Button>
                  <Button type="button" variant="outline" className="rounded-2xl border-red-200 text-red-700 hover:bg-red-50" onClick={() => onRejectOfficialClaim?.(claim)}>
                    반려
                  </Button>
                </div>
              </div>
            ))
          )}

          {approvedOfficialClaims.length ? (
            <div className="grid gap-2 rounded-2xl bg-emerald-50 p-3 text-xs text-emerald-900">
              <div className="font-semibold">승인 완료 {approvedOfficialClaims.length}건</div>
              {approvedOfficialClaims.map((claim) => (
                <button
                  key={claim.id}
                  type="button"
                  className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-xl bg-white px-3 py-2 text-left"
                  onDoubleClick={() => setSelectedApprovedClaim(claim)}
                  title="더블 클릭하면 승인 상세 내용을 확인한다."
                >
                  <span className="truncate font-semibold">
                    {claim.requesterName || "요청자"} → {claim.officialName || "공식기록"}
                  </span>
                  <span className="hidden text-[11px] text-slate-500 sm:inline">
                    요청 {formatDateOnly(claim.createdAt)}
                  </span>
                  <span className="text-[11px] text-emerald-700">
                    승인 {formatDateOnly(claim.approvedAt)}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedApprovedClaim)} onOpenChange={(open) => !open && setSelectedApprovedClaim(null)}>
        <DialogContent className="rounded-[28px]">
          <DialogHeader>
            <DialogTitle>승인 완료 기록 상세</DialogTitle>
            <DialogDescription>공식 기록 연결 승인 내역이다.</DialogDescription>
          </DialogHeader>
          {selectedApprovedClaim ? (
            <div className="grid gap-2 rounded-2xl bg-slate-50 p-4 text-sm">
              <div><b>요청자:</b> {selectedApprovedClaim.requesterName || "-"} / {selectedApprovedClaim.requesterEmail || "-"}</div>
              <div><b>요청자 소속:</b> {selectedApprovedClaim.requesterGroup || "-"}</div>
              <div><b>공식기록:</b> {selectedApprovedClaim.officialName || "-"} / {selectedApprovedClaim.officialGroup || "-"}</div>
              <div><b>성별/구분:</b> {selectedApprovedClaim.gender || "-"} / {selectedApprovedClaim.rankingGroup || "-"}</div>
              <div><b>요청일:</b> {formatDateOnly(selectedApprovedClaim.createdAt)}</div>
              <div><b>승인일:</b> {formatDateOnly(selectedApprovedClaim.approvedAt)}</div>
              <div><b>승인자:</b> {selectedApprovedClaim.approvedBy || "-"}</div>
              <div><b>상태:</b> 승인 완료</div>
            </div>
          ) : null}
          <DialogFooter>
            <Button type="button" className="rounded-2xl bg-blue-900 hover:bg-blue-800" onClick={() => setSelectedApprovedClaim(null)}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <span>미확인 가입자 {unreviewedUsers.length}명</span>
            <Button type="button" variant="outline" className="h-8 rounded-xl px-3 text-xs" onClick={() => onMarkAllUsersReviewed?.(realUsers.map((user) => user.id))}>
              가입자 전체 확인
            </Button>
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
                  <div key={user.id} className="grid grid-cols-[minmax(0,1fr)_auto_auto_auto] items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                    <button
                      type="button"
                      className="min-w-0 cursor-pointer text-left"
                      onDoubleClick={() => {
                        setSelectedUser(user);
                        onMarkUserReviewed?.(user.id);
                      }}
                      title="더블 클릭하면 자세한 정보 보기"
                    >
                      <span className="truncate font-semibold">{getDisplayName(user)}</span>
                      <span className="ml-2 hidden truncate text-xs text-slate-500 sm:inline">{user.groupName || user.email || "소속 없음"}</span>
                    </button>
                    {isAdminEmail(user.email) ? (
                      <Badge className="rounded-full bg-blue-900 text-white">관리자</Badge>
                    ) : !reviewedUserIdSet.has(user.id) ? (
                      <Badge className="rounded-full bg-red-600 text-white">신규</Badge>
                    ) : (
                      <Badge className="rounded-full bg-slate-200 text-slate-700">확인</Badge>
                    )}
                    <Badge className="rounded-full bg-slate-700 text-white">기록 {userSessions.length}</Badge>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 rounded-xl px-2 text-xs"
                      onClick={() => onMarkUserReviewed?.(user.id)}
                    >
                      확인
                    </Button>
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
              <div><span className="font-medium">인증 선수:</span> {selectedUser.verifiedAthlete ? "인증됨" : "미인증"}</div>
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

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-base font-semibold text-slate-900">등록 항목 삭제 관리</div>
                <div className="mt-1 text-sm text-slate-500">대회 일정, 양궁 뉴스, 공지사항을 바로 삭제할 수 있다.</div>
              </div>
              <Button type="button" variant="outline" className="rounded-2xl" onClick={loadAdminPublishedItems} disabled={adminPublishedLoading}>
                {adminPublishedLoading ? "불러오는 중..." : "목록 새로고침"}
              </Button>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
              <div className="grid gap-2">
                <div className="font-semibold">대회 일정</div>
                {adminEvents.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">등록된 대회 일정이 없다.</div>
                ) : (
                  adminEvents.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="font-semibold">{item.title || "제목 없음"}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.date || "-"} · {item.location || "장소 미정"}</div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                        disabled={deletingPublishedId === `stage_events_${item.id}`}
                        onClick={() => deletePublishedItem("stage_events", item.id, "대회 일정")}
                      >
                        {deletingPublishedId === `stage_events_${item.id}` ? "삭제 중..." : "삭제"}
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-2">
                <div className="font-semibold">양궁 뉴스</div>
                {adminNewsItems.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">등록된 뉴스가 없다.</div>
                ) : (
                  adminNewsItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="font-semibold">{item.title || "제목 없음"}</div>
                      <div className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs text-slate-500">{item.content || ""}</div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                        disabled={deletingPublishedId === `stage_news_${item.id}`}
                        onClick={() => deletePublishedItem("stage_news", item.id, "양궁 뉴스")}
                      >
                        {deletingPublishedId === `stage_news_${item.id}` ? "삭제 중..." : "삭제"}
                      </Button>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-2">
                <div className="font-semibold">공지사항</div>
                {adminBriefNotices.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">등록된 공지가 없다.</div>
                ) : (
                  adminBriefNotices.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <div className="font-semibold">{item.title || "제목 없음"}</div>
                      <div className="mt-1 line-clamp-3 whitespace-pre-wrap text-xs text-slate-500">{item.content || ""}</div>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 rounded-2xl border-red-200 text-red-700 hover:bg-red-50"
                        disabled={deletingPublishedId === `brief_notices_${item.id}`}
                        onClick={() => deletePublishedItem("brief_notices", item.id, "공지사항")}
                      >
                        {deletingPublishedId === `brief_notices_${item.id}` ? "삭제 중..." : "삭제"}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

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
  const [routines, setRoutines] = useState([]);
  const [draftSession, setDraftSession] = useState(null);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [sessionSaving, setSessionSaving] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [globalNotice, setGlobalNotice] = useState("");
  const [tempSaveMessage, setTempSaveMessage] = useState("");
  const [postSaveInsight, setPostSaveInsight] = useState(null);
  const [adminRequested, setAdminRequested] = useState(false);
  const [stageRefreshKey, setStageRefreshKey] = useState(0);
  const [briefRefreshKey, setBriefRefreshKey] = useState(0);
  const [officialClaims, setOfficialClaims] = useState(() => readOfficialClaimsFromStorage());
  const [reviewedUserIds, setReviewedUserIds] = useState(() => getStoredReviewedUserIds());
  const pendingProfileRef = useRef(null);


  const authTimeoutRef = useRef(null);

  useEffect(() => {
    writeOfficialClaimsToStorage(officialClaims);
  }, [officialClaims]);

  useEffect(() => {
    writeStoredReviewedUserIds(reviewedUserIds);
  }, [reviewedUserIds]);

  useEffect(() => {
    if (!authUser?.uid || !draftSession) return;
    writeSessionStorageJSON(getLiveDraftSessionKey(authUser.uid), draftSession);
  }, [authUser?.uid, draftSession]);

  useEffect(() => {
    if (!authUser?.uid || !ui) return;
    writeSessionStorageJSON(getUiSessionStateKey(authUser.uid), ui);
  }, [authUser?.uid, ui]);

  const markUserReviewed = useCallback((userId) => {
    if (!userId) return;
    setReviewedUserIds((prev) => Array.from(new Set([...prev, userId])));
  }, []);

  const markAllUsersReviewed = useCallback((userIds = []) => {
    const allExistingUserIds = (users || [])
      .filter((user) => !user.isSampleData && !isAdminEmail(user.email))
      .map((user) => user.id)
      .filter(Boolean);
    setReviewedUserIds((prev) => Array.from(new Set([...prev, ...allExistingUserIds, ...userIds.filter(Boolean)])));
  }, [users]);


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
      const activeUid = getAuth()?.currentUser?.uid || "";

      try {
        const usersSnap = await getDocs(collection(db, "users"));
        setUsers(usersSnap.docs.map((snap) => fromFirestoreProfile(snap.id, snap.data())));
      } catch (userError) {
        console.warn("User list could not be loaded. Falling back to current user only.", userError);
        if (activeUid) {
          try {
            const ownUserSnap = await getDoc(doc(db, "users", activeUid));
            if (ownUserSnap.exists()) {
              setUsers([fromFirestoreProfile(activeUid, ownUserSnap.data())]);
            }
          } catch (ownUserError) {
            console.warn("Current user profile could not be loaded.", ownUserError);
          }
        }
      }

      try {
        const sessionsSnap = await getDocs(query(collection(db, "sessions"), orderBy("sessionDate", "desc")));
        setSessions(sessionsSnap.docs.map((snap) => fromFirestoreSession(snap)));
      } catch (sessionError) {
        console.warn("Full session list could not be loaded. Falling back to current user's sessions.", sessionError);
        if (activeUid) {
          try {
            const ownSessionsSnap = await getDocs(query(collection(db, "sessions"), where("userId", "==", activeUid)));
            setSessions(ownSessionsSnap.docs.map((snap) => fromFirestoreSession(snap)));
          } catch (ownSessionError) {
            console.warn("Current user's sessions could not be loaded.", ownSessionError);
            // 데이터 권한 오류는 사용자에게 원문 경고를 노출하지 않는다. 저장/랭킹 조건 안내는 화면별 문구에서 처리한다.
          }
        }
      }

      try {
        const routinesSnap = await getDocs(query(collection(db, "routines"), orderBy("date", "desc")));
        setRoutines(routinesSnap.docs.map((snap) => fromFirestoreRoutine(snap)));
      } catch (routineError) {
        setRoutines([]);
        console.warn("X-Routine data could not be loaded. Check Firestore rules for routines.", routineError);
      }

      try {
        const officialClaimsSnap = await getDocs(collection(db, "official_claims"));
        const loadedClaims = officialClaimsSnap.docs.map((snap) => ({ id: snap.id, ...snap.data() }));
        if (loadedClaims.length) setOfficialClaims(loadedClaims);
      } catch (claimError) {
        console.warn("Official claim data could not be loaded. Falling back to local/profile storage.", claimError);
      }

      setGlobalError("");
    } catch (error) {
      console.warn("Data loading warning suppressed for user display.", error);
      // 로그인은 되었지만 일부 컬렉션 권한이 부족한 경우에도 앱 사용 흐름은 막지 않는다.
      setGlobalError("");
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
        role: payload.role || "선수",
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
          setRoutines([]);
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
            role: pendingProfileRef.current.role || "선수",
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
            role: nextProfile.role || "선수",
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
            role: "선수",
            avatar: "",
            photoURL: "",
            photoPath: "",
          };
        }

        setProfile(nextProfile);

        const tempDraft = loadDraftFromLocal(user.uid);
        const liveDraft = readSessionStorageJSON(getLiveDraftSessionKey(user.uid), null);
        if (tempDraft) {
          setDraftSession(
            normalizeSessionShape(
              { ...tempDraft, division: tempDraft.division || nextProfile.division || "전체학년" },
              nextProfile
            )
          );
          setTempSaveMessage("임시 저장된 X-Session을 불러왔다.");
        } else if (liveDraft) {
          setDraftSession(
            normalizeSessionShape(
              { ...liveDraft, division: liveDraft.division || nextProfile.division || "전체학년" },
              nextProfile
            )
          );
          setTempSaveMessage("현재 웹창에서 입력 중이던 X-Session 설정을 유지했다.");
        } else {
          setDraftSession(
            normalizeSessionShape(createNewSession(nextProfile, "cumulative"), nextProfile)
          );
          setTempSaveMessage("");
        }

        setEditingSessionId(null);
        const savedUiState = readSessionStorageJSON(getUiSessionStateKey(user.uid), null);
        setUi((prev) => {
          const fallbackTab = getInitialTabByRole(nextProfile.role);
          const nextTab = adminRequested && isAdminEmail(nextProfile.email)
            ? "admin"
            : normalizeAppTab(savedUiState?.activeTab, fallbackTab);
          return {
            ...prev,
            ...(savedUiState || {}),
            activeTab: nextTab,
          };
        });

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
        gender: input.gender || "남",
        role: input.role || "선수",
      };

      const result = await createUserWithEmailAndPassword(appServices.auth, input.email, input.password);

      await saveProfileDocument(result.user.uid, {
        email: input.email,
        name: input.name || input.email.split("@")[0],
        groupName: input.groupName || "",
        regionCity: input.regionCity || "",
        regionDistrict: input.regionDistrict || "",
        division: input.division || "전체학년",
        gender: input.gender || "남",
        role: input.role || "선수",
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
        gender: input.gender || "남",
        role: input.role || "선수",
        avatar: "",
        photoURL: "",
        photoPath: "",
      };

      setProfile(nextProfile);
      setDraftSession(
        normalizeSessionShape(createNewSession(nextProfile, "cumulative"), nextProfile)
      );
      setUi((prev) => ({ ...prev, activeTab: getInitialTabByRole(nextProfile.role) }));
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
    setGlobalError("");
    setGlobalNotice("");
    setTempSaveMessage("");
    setAdminRequested(false);
    if (authUser?.uid) {
      removeSessionStorageKey(getLiveDraftSessionKey(authUser.uid));
      removeSessionStorageKey(getUiSessionStateKey(authUser.uid));
      removeSessionStorageKey(getAnalysisSessionStateKey(authUser.uid));
    }
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
    if (!appServices?.db || !authUser || !profile || !draftSession) {
      throw new Error("저장에 필요한 정보가 부족합니다. 다시 로그인 후 시도해 주세요.");
    }

    setSessionSaving(true);
    setGlobalError("");
    setGlobalNotice("");

    try {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        throw new Error("오프라인 상태입니다. 네트워크 연결 후 다시 저장해 주세요.");
      }

      const payload = buildSessionPayload({ draftSession, profile, uid: authUser.uid });
      const fixedSessionDate = draftSession?.sessionDate || getCurrentLocalDateString();
      payload.sessionDate = fixedSessionDate;

      let savedSessionId = editingSessionId;
      if (editingSessionId) {
        await updateDoc(doc(appServices.db, "sessions", editingSessionId), {
          sessionDate: payload.sessionDate,
          title: payload.title,
          mode: payload.mode,
          recordInputType: payload.recordInputType,
          distance: payload.distance,
          groupName: payload.groupName,
          regionCity: payload.regionCity,
          division: payload.division,
          gender: payload.gender,
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
        const docRef = doc(collection(appServices.db, "sessions"));
        savedSessionId = docRef.id;
        await setDoc(docRef, {
          ...payload,
          sessionId: docRef.id,
        });
      }

      const savedPreviewSession = {
        ...payload,
        id: savedSessionId,
        sessionId: savedSessionId,
        isComplete: true,
        status: "completed",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      setSessions((prev) => {
        const withoutExisting = prev.filter((session) => session.id !== savedSessionId);
        return [savedPreviewSession, ...withoutExisting];
      });
      const nextInsight = buildPostSaveInsight({
        savedSession: savedPreviewSession,
        users: usersForDisplay,
        sessions: sessionsForDisplay,
        currentUser,
      });

      clearDraftFromLocal(authUser.uid);
      removeSessionStorageKey(getLiveDraftSessionKey(authUser.uid));
      setTempSaveMessage("");
      setEditingSessionId(null);
      await loadUsersAndSessions(appServices.db);
      setDraftSession(normalizeSessionShape(createNewSession(profile, draftSession.mode), profile));
      setUi((prev) => ({ ...prev, activeTab: "dashboard" }));
      setPostSaveInsight(nextInsight);
      setGlobalNotice("랭킹 반영 완료. 현재 순위와 라이벌 차이를 확인해라.");
      return {
        ok: true,
        message: editingSessionId ? "세션이 정상적으로 업데이트되었습니다." : "세션이 정상적으로 저장되었습니다.",
      };
    } catch (error) {
      const message = getFriendlySaveErrorMessage(
        error,
        "저장에 실패했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요."
      );
      setGlobalError(message);
      throw new Error(message);
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
      removeSessionStorageKey(getLiveDraftSessionKey(authUser.uid));
      setTempSaveMessage("");
      await loadUsersAndSessions(appServices.db);
      setUi((prev) => ({ ...prev, activeTab: "dashboard" }));
    } catch (error) {
      setGlobalError(error.message || "세션 삭제에 실패했다.");
    }
  }

  function handleTempSave() {
    if (!authUser || !draftSession) return;
    setGlobalError("");
    setGlobalNotice("");
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
        gender: nextUser.gender || profile.gender || "남",
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
        gender: nextUser.gender || profile.gender || "남",
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


  async function handleRequestOfficialClaim(officialUser) {
    if (!profile || !officialUser?.isSampleData) return;
    if (!isOfficialProfileMatch(officialUser, profile)) {
      setGlobalError("이름, 학교/소속, 성별이 공식기록과 일치할 때만 연결 요청이 가능하다.");
      return;
    }

    const existingApproved = getApprovedClaimForSample(officialClaims, officialUser.id);
    if (existingApproved) {
      setGlobalError("이미 승인된 공식기록이다.");
      return;
    }

    const requestId = getOfficialClaimId({ sampleUserId: officialUser.id, requesterUid: profile.id });
    const nextClaim = {
      id: requestId,
      sampleUserId: officialUser.id,
      requesterUid: profile.id,
      requesterEmail: profile.email || "",
      requesterName: profile.name || "",
      requesterGroup: profile.groupName || "",
      officialName: officialUser.name || "",
      officialGroup: officialUser.groupName || "",
      gender: officialUser.gender || profile.gender || "",
      rankingGroup: getRankingGroup(officialUser.division || "", officialUser.gender || "남"),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setOfficialClaims((prev) => {
      if (prev.some((claim) => claim.id === requestId)) return prev;
      return [...prev, nextClaim];
    });

    let savedToFirestore = false;
    try {
      if (appServices?.db) {
        await setDoc(doc(appServices.db, "official_claims", requestId), {
          ...nextClaim,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        savedToFirestore = true;
      }
    } catch (error) {
      console.warn("Official claim collection write failed. Trying user profile fallback.", error);
    }

    try {
      if (appServices?.db && profile.id) {
        await setDoc(doc(appServices.db, "users", profile.id), {
          latestOfficialClaim: nextClaim,
          officialClaimRequests: [nextClaim],
          updatedAt: serverTimestamp(),
        }, { merge: true });
        savedToFirestore = true;
      }
    } catch (error) {
      console.warn("Official claim profile fallback write failed.", error);
    }

    if (!savedToFirestore) {
      setGlobalError("공식 기록 연결 요청을 저장하려면 로그인 상태와 공식기록 요청 저장 권한이 필요합니다. 관리자에게 공식기록 요청 권한 설정을 확인해 달라고 요청해 주세요.");
      return;
    }

    setGlobalNotice("공식 기록 연결 요청을 보냈다. 관리자가 확인 후 승인하면 인증 선수로 표시된다.");
  }

  async function handleApproveOfficialClaim(claim) {
    if (!claim?.id) return;
    const approvedAt = new Date().toISOString();
    const approvedClaim = {
      ...claim,
      status: "approved",
      claimedByUid: claim.requesterUid,
      approvedAt,
      approvedBy: currentUser?.email || "",
    };

    setOfficialClaims((prev) =>
      prev.map((item) => (item.id === claim.id ? { ...item, ...approvedClaim } : item))
    );

    try {
      if (appServices?.db && claim.requesterUid) {
        try {
          await setDoc(
            doc(appServices.db, "official_claims", claim.id),
            {
              ...approvedClaim,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (claimWriteError) {
          console.warn("Official claim approval collection write failed.", claimWriteError);
        }

        try {
          await setDoc(
            doc(appServices.db, "users", claim.requesterUid),
            {
              verifiedAthlete: true,
              officialClaimApprovedAt: approvedAt,
              officialClaimSampleUserId: claim.sampleUserId,
              latestOfficialClaim: approvedClaim,
              officialClaimRequests: [],
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (userWriteError) {
          console.warn("Official claim approval user profile write failed.", userWriteError);
        }

        await loadUsersAndSessions(appServices.db);
      }
      setGlobalError("");
      setGlobalNotice("공식 기록 연결 요청을 승인했다.");
    } catch (error) {
      console.warn("Official claim approval completed locally with remote warning.", error);
      setGlobalError("");
      setGlobalNotice("공식 기록 연결 요청을 승인했다. 서버 권한 문제는 관리자 설정에서 별도 확인이 필요하다.");
    }
  }

  async function handleRejectOfficialClaim(claim) {
    if (!claim?.id) return;
    const rejectedClaim = {
      ...claim,
      status: "rejected",
      rejectedAt: new Date().toISOString(),
      rejectedBy: currentUser?.email || "",
    };
    setOfficialClaims((prev) =>
      prev.map((item) => (item.id === claim.id ? { ...item, ...rejectedClaim } : item))
    );

    try {
      if (appServices?.db) {
        await setDoc(doc(appServices.db, "official_claims", claim.id), {
          ...rejectedClaim,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        if (claim.requesterUid) {
          await setDoc(doc(appServices.db, "users", claim.requesterUid), {
            latestOfficialClaim: rejectedClaim,
            officialClaimRequests: [],
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
      }
    } catch (error) {
      console.warn("Official claim rejection saved locally only.", error);
    }
    setGlobalNotice("공식 기록 연결 요청을 반려했다.");
  }

  const currentUser = useMemo(() => profile, [profile]);
  const sampleUsers = useMemo(() => buildPermanentSampleUsers(), []);
  const permanentSampleSessions = useMemo(() => buildPermanentSampleSessions(), []);

  const usersForDisplay = useMemo(() => {
    const approvedClaims = [
      ...(officialClaims || []),
      ...users
        .map((user) => user.latestOfficialClaim)
        .filter((claim) => claim?.status === "approved" && claim.sampleUserId),
    ];

    const approvedBySampleUserId = new Map(
      approvedClaims
        .filter((claim) => claim.sampleUserId && (claim.claimedByUid || claim.requesterUid))
        .map((claim) => [claim.sampleUserId, { ...claim, claimedByUid: claim.claimedByUid || claim.requesterUid }])
    );
    const verifiedUidSet = new Set(
      approvedClaims
        .filter((claim) => claim.status === "approved" && (claim.claimedByUid || claim.requesterUid))
        .map((claim) => claim.claimedByUid || claim.requesterUid)
    );

    const realUsersWithVerification = users.map((user) => ({
      ...user,
      verifiedAthlete: Boolean(user.verifiedAthlete || verifiedUidSet.has(user.id)),
    }));
    const existingIds = new Set(realUsersWithVerification.map((u) => u.id));
    const ensuredCurrentUser = currentUser?.id && !existingIds.has(currentUser.id)
      ? [{
          ...currentUser,
          verifiedAthlete: Boolean(currentUser.verifiedAthlete || verifiedUidSet.has(currentUser.id)),
        }]
      : [];
    ensuredCurrentUser.forEach((user) => existingIds.add(user.id));
    const extra = sampleUsers
      .filter((u) => !approvedBySampleUserId.has(u.id))
      .filter((u) => !existingIds.has(u.id));
    return [...realUsersWithVerification, ...ensuredCurrentUser, ...extra];
  }, [users, sampleUsers, officialClaims, currentUser]);

  const sessionsForDisplay = useMemo(() => {
    const approvedClaims = [
      ...(officialClaims || []),
      ...users
        .map((user) => user.latestOfficialClaim)
        .filter((claim) => claim?.status === "approved" && claim.sampleUserId),
    ];

    const approvedBySampleUserId = new Map(
      approvedClaims
        .filter((claim) => claim.sampleUserId && (claim.claimedByUid || claim.requesterUid))
        .map((claim) => [claim.sampleUserId, { ...claim, claimedByUid: claim.claimedByUid || claim.requesterUid }])
    );
    const existingIds = new Set(sessions.map((s) => s.id));
    const merged = [...sessions];

    permanentSampleSessions.forEach((s) => {
      if (existingIds.has(s.id)) return;
      const approvedClaim = approvedBySampleUserId.get(s.userId);
      if (approvedClaim) {
        merged.push({
          ...s,
          userId: approvedClaim.claimedByUid,
          originalOfficialUserId: s.userId,
          claimedByUid: approvedClaim.claimedByUid,
          officialRecord: false,
          isSampleData: false,
        });
      } else {
        merged.push(s);
      }
    });

    return merged;
  }, [sessions, permanentSampleSessions, officialClaims, users]);

  const mySessions = useMemo(
    () => sessions.filter((s) => s.userId === authUser?.uid),
    [sessions, authUser]
  );
  const myRoutines = useMemo(
    () => routines.filter((routine) => routine.userId === authUser?.uid),
    [routines, authUser]
  );

  const isAdminUser = useMemo(() => isAdminEmail(currentUser?.email), [currentUser]);
  const pendingOfficialClaimCount = useMemo(() => (officialClaims || []).filter((claim) => claim.status === "pending").length, [officialClaims]);
  const unreviewedUserCount = useMemo(() => {
    const reviewed = new Set(reviewedUserIds || []);
    return users.filter((user) => !user.isSampleData && !isAdminEmail(user.email) && !reviewed.has(user.id)).length;
  }, [users, reviewedUserIds]);
  // Admin badge is intentionally tied only to unreviewed general signups.
  // Official-claim requests are managed inside the Admin panel so the top badge
  // does not remain at 1 after all new signups have been reviewed.
  const adminAlertCount = unreviewedUserCount;
  const adminEmailGuard = isAdminEmail;

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(30,64,175,0.12),_transparent_30%),radial-gradient(circle_at_right,_rgba(185,28,28,0.12),_transparent_25%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]">
      {currentUser ? <DesktopAppSidebar user={currentUser} activeTab={ui.activeTab} setActiveTab={(tab) => setUi((prev) => ({ ...prev, activeTab: normalizeAppTab(tab, prev.activeTab) }))} onLogout={handleLogout} isAdminUser={isAdminUser} adminAlertCount={adminAlertCount} /> : null}
      <div className={`flex w-full flex-col ${currentUser ? "gap-3 md:gap-6 xl:pl-[280px]" : "gap-0"}`}>
        {currentUser ? <div className="xl:hidden"><Hero activeTab={ui.activeTab} /></div> : null}

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
            <div className="xl:hidden">
              <TopBar user={currentUser} activeTab={ui.activeTab} setActiveTab={(tab) => setUi((prev) => ({ ...prev, activeTab: normalizeAppTab(tab, prev.activeTab) }))} onLogout={handleLogout} isAdminUser={isAdminUser} adminAlertCount={adminAlertCount} />
            </div>

            {globalNotice && <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{globalNotice}</div>}
            {globalError && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</div>}

            <Dialog open={Boolean(postSaveInsight)} onOpenChange={(open) => !open && setPostSaveInsight(null)}>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle>랭킹 반영 완료</DialogTitle>
                  <DialogDescription>기록 → 결과 → 비교 → 반복 구조로 내 실력을 확인한다.</DialogDescription>
                </DialogHeader>
                {postSaveInsight ? (
                  <div className="grid gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="font-semibold text-slate-950">현재 순위: {postSaveInsight.currentRank}위</div>
                      <div className="mt-1 text-slate-600">같은 학교 순위: {postSaveInsight.schoolRank}위</div>
                      <div className="mt-1 text-slate-600">오늘 상승: {postSaveInsight.rankDelta > 0 ? `+${postSaveInsight.rankDelta}` : postSaveInsight.rankDelta}위</div>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4 text-amber-900">
                      🔥 오늘 라이벌 등장<br />
                      {postSaveInsight.rivalText}
                      <div className="mt-2 text-xs text-amber-800">다음 기록에서 3점 이내로 추격하면 앱 안에서 다시 알려준다.</div>
                    </div>
                    {postSaveInsight.goalAchieved ? (
                      <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                        🎯 목표 달성! 이전 목표 {postSaveInsight.previousTarget}점 돌파
                        <div className="mt-1 text-xs">다음 목표는 {postSaveInsight.nextTarget ?? "-"}점으로 자동 갱신됩니다.</div>
                      </div>
                    ) : null}
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">🔥 {postSaveInsight.streak}일 연속 기록중</div>
                      <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-900">{postSaveInsight.personalBest ? "🎯 개인 최고 기록!" : "🎯 기록 저장 완료"}</div>
                      <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">오늘 루틴 {getTodayRoutineRate(myRoutines)}% · {getRoutineReadinessMessage(getTodayRoutineRate(myRoutines))} · 다음 목표 {postSaveInsight.nextTarget ?? "-"}점</div>
                    </div>
                  </div>
                ) : null}
                <DialogFooter>
                  <Button
                    className="rounded-2xl bg-blue-950 text-white hover:bg-blue-900"
                    onClick={() => {
                      setPostSaveInsight(null);
                      setUi((prev) => ({ ...prev, activeTab: "ranking" }));
                    }}
                  >
                    랭킹 확인하기
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
              {ui.activeTab === "dashboard" && <Dashboard sessions={mySessions} routines={myRoutines} currentUser={currentUser} loading={sessionsLoading} onEditSession={handleEditSession} onStartSession={() => setUi((prev) => ({ ...prev, activeTab: "record" }))} />}
              {ui.activeTab === "ranking" && <RankingBoard users={usersForDisplay} sessions={sessionsForDisplay} currentUser={currentUser} currentUserId={currentUser.id} officialClaims={officialClaims} onRequestOfficialClaim={handleRequestOfficialClaim} />}
              {ui.activeTab === "analysis" && <AnalysisBoard currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} onNavigate={(tab) => setUi((prev) => ({ ...prev, activeTab: normalizeAppTab(tab, prev.activeTab) }))} />}
              {ui.activeTab === "stage" && <XStagePage appServices={appServices} stageRefreshKey={stageRefreshKey} briefRefreshKey={briefRefreshKey} />}
              {ui.activeTab === "routine" && <RoutinePage appServices={appServices} currentUser={currentUser} routines={myRoutines} sessions={mySessions} onRoutineSaved={async (savedRoutine) => {
                if (savedRoutine?.id) {
                  setRoutines((prev) => {
                    const withoutSame = prev.filter((routine) => routine.id !== savedRoutine.id);
                    return [savedRoutine, ...withoutSame];
                  });
                }
                try {
                  await loadUsersAndSessions(appServices.db);
                } finally {
                  if (savedRoutine?.id) {
                    setRoutines((prev) => {
                      const withoutSame = prev.filter((routine) => routine.id !== savedRoutine.id);
                      return [savedRoutine, ...withoutSame];
                    });
                  }
                }
              }} onStartSession={() => setUi((prev) => ({ ...prev, activeTab: "record" }))} />}
              {ui.activeTab === "profile" && <ProfilePanel user={currentUser} onUpdate={handleUpdateProfile} saving={profileSaving} />}
              {ui.activeTab === "admin" && isAdminUser && <AdminPanel currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} appServices={appServices} officialClaims={officialClaims} reviewedUserIds={reviewedUserIds} onMarkUserReviewed={markUserReviewed} onMarkAllUsersReviewed={markAllUsersReviewed} onApproveOfficialClaim={handleApproveOfficialClaim} onRejectOfficialClaim={handleRejectOfficialClaim} onRefresh={() => loadUsersAndSessions(appServices.db)} onStageRefresh={() => setStageRefreshKey((prev) => prev + 1)} onBriefRefresh={() => setBriefRefreshKey((prev) => prev + 1)} />}
              {!VALID_APP_TABS.has(normalizeAppTab(ui.activeTab, "")) && (
                <EmptyNoticeCard title="메뉴 상태를 복구했습니다" description="이전 버전에서 저장된 메뉴 값이 현재 앱 구조와 맞지 않아 기본 화면으로 전환합니다." />
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default XSessionApp;
