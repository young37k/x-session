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
  writeBatch,
  limit,
  startAfter,
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


const CUSTOM_VENUE_STORAGE_KEY = "elbowshot_custom_weather_venues_v1";

const ARCHERY_VENUES = [
  { id: "yecheon_jinho", name: "예천진호국제양궁장", region: "경북 예천", latitude: 36.6579, longitude: 128.4524, type: "국제/전국대회 경기장" },
  { id: "jincheon_national", name: "진천 국가대표선수촌 양궁장", region: "충북 진천", latitude: 36.8676, longitude: 127.4349, type: "국가대표 훈련장" },
  { id: "gwangju_international", name: "광주국제양궁장", region: "광주", latitude: 35.1467, longitude: 126.8690, type: "국제/전국대회 경기장" },
  { id: "kim_su_nyeong", name: "청주 김수녕양궁장", region: "충북 청주", latitude: 36.6389, longitude: 127.4896, type: "국제/전국대회 경기장" },
  { id: "incheon_gyeyang", name: "인천계양아시아드양궁장", region: "인천 계양", latitude: 37.5332, longitude: 126.7377, type: "국제/전국대회 경기장" },
  { id: "ulsan_munsu", name: "울산문수국제양궁장", region: "울산 남구", latitude: 35.5313, longitude: 129.2723, type: "국제/전국대회 경기장" },
  { id: "jinju_stadium", name: "진주종합경기장 양궁장", region: "경남 진주", latitude: 35.1786, longitude: 128.1076, type: "전국대회 경기장" },
  { id: "mokdong", name: "목동종합운동장 양궁장", region: "서울 양천", latitude: 37.5305, longitude: 126.8817, type: "국내 경기장" },
  { id: "anyang", name: "안양양궁장", region: "경기 안양", latitude: 37.3943, longitude: 126.9568, type: "국내 경기장" },
  { id: "suwon", name: "수원양궁장", region: "경기 수원", latitude: 37.2867, longitude: 127.0345, type: "국내 경기장" },
  { id: "yongin", name: "용인양궁장", region: "경기 용인", latitude: 37.2411, longitude: 127.1776, type: "국내 경기장" },
  { id: "ansan", name: "안산양궁장", region: "경기 안산", latitude: 37.3219, longitude: 126.8309, type: "국내 경기장" },
  { id: "wonju", name: "원주양궁장", region: "강원 원주", latitude: 37.3422, longitude: 127.9202, type: "국내 경기장" },
  { id: "daejeon", name: "대전양궁장", region: "대전", latitude: 36.3504, longitude: 127.3845, type: "국내 경기장" },
  { id: "jeonju", name: "전주양궁장", region: "전북 전주", latitude: 35.8242, longitude: 127.1480, type: "국내 경기장" },
  { id: "sunchang", name: "순창공설운동장 양궁장", region: "전북 순창", latitude: 35.3745, longitude: 127.1376, type: "국내 경기장" },
  { id: "gwangyang", name: "광양공설운동장 양궁장", region: "전남 광양", latitude: 34.9407, longitude: 127.6959, type: "국내 경기장" },
  { id: "busan", name: "부산강서체육공원 양궁장", region: "부산 강서", latitude: 35.2090, longitude: 128.9824, type: "국내 경기장" },
  { id: "daegu", name: "대구양궁장", region: "대구", latitude: 35.8714, longitude: 128.6014, type: "국내 경기장" },
  { id: "school_profile", name: "프로필 학교/소속 위치", region: "프로필 기준", latitude: null, longitude: null, type: "학교" },
];

function normalizeVenueNameKey(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[()·ㆍ.,_-]/g, "")
    .replace(/초등학교/g, "초")
    .replace(/중학교/g, "중")
    .replace(/고등학교/g, "고")
    .toLowerCase();
}

const SCHOOL_LOCATION_PRESETS = {
  [normalizeVenueNameKey("안양서초등학교")]: { latitude: 37.3902, longitude: 126.9506, region: "경기 안양" },
  [normalizeVenueNameKey("김포하성초등학교")]: { latitude: 37.7188, longitude: 126.6315, region: "경기 김포" },
  [normalizeVenueNameKey("하남천현초등학교")]: { latitude: 37.5399, longitude: 127.2147, region: "경기 하남" },
  [normalizeVenueNameKey("성포초등학교")]: { latitude: 37.3237, longitude: 126.8468, region: "경기 안산" },
  [normalizeVenueNameKey("연무초등학교")]: { latitude: 36.1290, longitude: 127.0982, region: "충남 논산" },
  [normalizeVenueNameKey("예천초등학교")]: { latitude: 36.6541, longitude: 128.4551, region: "경북 예천" },
  [normalizeVenueNameKey("예천동부초등학교")]: { latitude: 36.6559, longitude: 128.4646, region: "경북 예천" },
  [normalizeVenueNameKey("인천부평서초등학교")]: { latitude: 37.5096, longitude: 126.7215, region: "인천 부평" },
  [normalizeVenueNameKey("인천계산초등학교")]: { latitude: 37.5383, longitude: 126.7245, region: "인천 계양" },
  [normalizeVenueNameKey("인천용현남초등학교")]: { latitude: 37.4487, longitude: 126.6499, region: "인천 미추홀" },
  [normalizeVenueNameKey("서울인헌초등학교")]: { latitude: 37.4745, longitude: 126.9659, region: "서울 관악" },
  [normalizeVenueNameKey("서울방이초등학교")]: { latitude: 37.5115, longitude: 127.1160, region: "서울 송파" },
  [normalizeVenueNameKey("대구송현초등학교")]: { latitude: 35.8317, longitude: 128.5517, region: "대구 달서" },
  [normalizeVenueNameKey("대전태평초등학교")]: { latitude: 36.3252, longitude: 127.3977, region: "대전 중구" },
  [normalizeVenueNameKey("홍남초등학교")]: { latitude: 36.6006, longitude: 126.6622, region: "충남 홍성" },
  [normalizeVenueNameKey("용암초등학교")]: { latitude: 36.6069, longitude: 127.5057, region: "충북 청주" },
  [normalizeVenueNameKey("하성중학교")]: { latitude: 37.7194, longitude: 126.6328, region: "경기 김포" },
  [normalizeVenueNameKey("안양서중학교")]: { latitude: 37.3920, longitude: 126.9514, region: "경기 안양" },
  [normalizeVenueNameKey("성포중학교")]: { latitude: 37.3224, longitude: 126.8435, region: "경기 안산" },
};

function getKnownSchoolLocation(name) {
  const key = normalizeVenueNameKey(name);
  if (!key) return null;
  if (SCHOOL_LOCATION_PRESETS[key]) return SCHOOL_LOCATION_PRESETS[key];
  const aliasKey = Object.keys(SCHOOL_LOCATION_PRESETS).find((item) => item.includes(key) || key.includes(item));
  return aliasKey ? SCHOOL_LOCATION_PRESETS[aliasKey] : null;
}


function readCustomWeatherVenues() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_VENUE_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => item?.id && item?.name) : [];
  } catch {
    return [];
  }
}

function writeCustomWeatherVenues(venues) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_VENUE_STORAGE_KEY, JSON.stringify(Array.isArray(venues) ? venues : []));
  } catch {
    // ignore storage failure
  }
}

function makeCustomVenueId(name) {
  return `custom_${String(name || "venue").replace(/[^0-9a-zA-Z가-힣]+/g, "_").slice(0, 30)}_${Date.now()}`;
}

function toRadians(value) {
  return (Number(value) * Math.PI) / 180;
}

function getDistanceKmBetweenCoords(a, b) {
  if (!a || !b) return Number.POSITIVE_INFINITY;
  const lat1 = Number(a.latitude);
  const lon1 = Number(a.longitude);
  const lat2 = Number(b.latitude);
  const lon2 = Number(b.longitude);
  if (![lat1, lon1, lat2, lon2].every(Number.isFinite)) return Number.POSITIVE_INFINITY;
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function getNearestArcheryVenues(coords, limitCount = 3) {
  if (!coords) return ARCHERY_VENUES.filter((venue) => venue.latitude && venue.longitude).slice(0, limitCount);
  return ARCHERY_VENUES
    .filter((venue) => venue.latitude && venue.longitude)
    .map((venue) => ({ ...venue, distanceKm: getDistanceKmBetweenCoords(coords, venue) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limitCount);
}

function getWindLevelFromSpeed(speed) {
  const value = Number(speed);
  if (!Number.isFinite(value)) return "정보없음";
  if (value < 1.5) return "없음";
  if (value < 3.5) return "약함";
  if (value < 6) return "중간";
  return "강함";
}

function getWindDirectionLabel(degree) {
  const value = Number(degree);
  if (!Number.isFinite(value)) return "-";
  const labels = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
  return labels[Math.round((((value % 360) + 360) % 360) / 45) % 8];
}

function getWeatherApiBaseUrl(dateText) {
  const today = getCurrentLocalDateString();
  const target = String(dateText || today).slice(0, 10);
  return target < today ? "https://archive-api.open-meteo.com/v1/archive" : "https://api.open-meteo.com/v1/forecast";
}

async function fetchSessionWindWeather({ latitude, longitude, sessionDate }) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new Error("위치 좌표가 없어 바람 정보를 조회할 수 없습니다.");
  }
  const date = String(sessionDate || getCurrentLocalDateString()).slice(0, 10);
  const baseUrl = getWeatherApiBaseUrl(date);
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    start_date: date,
    end_date: date,
    hourly: "wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m",
    timezone: "Asia/Seoul",
  });
  const response = await fetch(`${baseUrl}?${params.toString()}`);
  if (!response.ok) throw new Error("기상 데이터를 불러오지 못했습니다.");
  const json = await response.json();
  const hourly = json?.hourly || {};
  const times = hourly.time || [];
  if (!times.length) throw new Error("해당 날짜의 시간별 기상 데이터가 없습니다.");
  const preferredHour = date === getCurrentLocalDateString() ? new Date().getHours() : 12;
  let index = times.findIndex((time) => Number(String(time).slice(11, 13)) >= preferredHour);
  if (index < 0) index = Math.floor(times.length / 2);
  const windSpeed = Number(hourly.wind_speed_10m?.[index]);
  const windDirection = Number(hourly.wind_direction_10m?.[index]);
  const windGust = Number(hourly.wind_gusts_10m?.[index]);
  const temperature = Number(hourly.temperature_2m?.[index]);
  return {
    source: "open-meteo",
    fetchedAt: new Date().toISOString(),
    observedTime: times[index],
    latitude: lat,
    longitude: lon,
    windSpeed: Number.isFinite(windSpeed) ? windSpeed : null,
    windDirection: Number.isFinite(windDirection) ? windDirection : null,
    windDirectionLabel: getWindDirectionLabel(windDirection),
    windGust: Number.isFinite(windGust) ? windGust : null,
    temperature: Number.isFinite(temperature) ? temperature : null,
    windLevel: getWindLevelFromSpeed(windSpeed),
  };
}

function buildDefaultSessionWeather() {
  const firstVenue = ARCHERY_VENUES[0];
  return {
    venueId: firstVenue.id,
    venueName: firstVenue.name,
    region: firstVenue.region,
    latitude: firstVenue.latitude,
    longitude: firstVenue.longitude,
    athleteWindFeel: "",
    auto: null,
    manualNote: "",
  };
}

function getUserSchoolVenue(currentUser) {
  const schoolName = String(
    currentUser?.schoolName ||
    currentUser?.groupName ||
    currentUser?.clubName ||
    currentUser?.school ||
    currentUser?.affiliation ||
    ""
  ).trim();
  if (!schoolName || schoolName === "all") return null;
  const latitude = Number(currentUser?.schoolLatitude ?? currentUser?.schoolLat ?? currentUser?.venueLatitude ?? currentUser?.latitude);
  const longitude = Number(currentUser?.schoolLongitude ?? currentUser?.schoolLng ?? currentUser?.venueLongitude ?? currentUser?.longitude);
  const known = getKnownSchoolLocation(schoolName);
  const finalLatitude = Number.isFinite(latitude) ? latitude : known?.latitude;
  const finalLongitude = Number.isFinite(longitude) ? longitude : known?.longitude;
  return {
    id: "user_school_home",
    name: schoolName,
    region: Number.isFinite(finalLatitude) && Number.isFinite(finalLongitude) ? (known?.region || "프로필 학교 위치") : "소속 학교/훈련장 위치 미등록",
    latitude: Number.isFinite(finalLatitude) ? finalLatitude : null,
    longitude: Number.isFinite(finalLongitude) ? finalLongitude : null,
    isUserSchool: true,
    type: "학교",
  };
}

function buildDefaultSessionWeatherForUser(currentUser) {
  const schoolVenue = getUserSchoolVenue(currentUser);
  if (schoolVenue) {
    return {
      venueId: schoolVenue.id,
      venueName: schoolVenue.name,
      region: schoolVenue.region,
      latitude: schoolVenue.latitude,
      longitude: schoolVenue.longitude,
      athleteWindFeel: "",
      auto: null,
      manualNote: "",
    };
  }
  return buildDefaultSessionWeather();
}

function getEffectiveWindLevel(session) {
  const weather = session?.weather || {};
  const athleteWindFeel = String(weather.athleteWindFeel || "").trim();
  if (athleteWindFeel) return athleteWindFeel;
  const autoLevel = String(weather.auto?.windLevel || weather.windLevel || "").trim();
  if (autoLevel) return autoLevel;
  const autoSpeed = weather.auto?.windSpeed ?? weather.windSpeed;
  return getWindLevelFromSpeed(autoSpeed);
}

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
  "대학부",
  "일반부"
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

function getRoutineDailyStateKey(userId, date) {
  return `x_session_routine_daily_state_${userId || "guest"}_${date || getCurrentLocalDateString()}`;
}

function readRoutineDailyState(userId, date = getCurrentLocalDateString()) {
  try {
    const raw = localStorage.getItem(getRoutineDailyStateKey(userId, date));
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || parsed.date !== date) return null;
    const stats = calculateRoutineStats(parsed.items || []);
    return { ...parsed, ...stats };
  } catch {
    return null;
  }
}

function writeRoutineDailyState(userId, date, items = []) {
  try {
    if (!userId || !date) return;
    const stats = calculateRoutineStats(items);
    const payload = {
      id: makeRoutineDocId(userId, date),
      userId,
      date,
      items: stats.items,
      completionRate: stats.completionRate,
      completedCount: stats.completedCount,
      totalCount: stats.totalCount,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(getRoutineDailyStateKey(userId, date), JSON.stringify(payload));
  } catch {
    // localStorage unavailable
  }
}

function getRoutineUpdatedMs(routine) {
  const value = routine?.updatedAt || routine?.createdAt || "";
  if (!value) return 0;
  if (typeof value === "string") return Date.parse(value) || 0;
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  return 0;
}

function getSavedRoutineForToday(userId, existingRoutine, date = getCurrentLocalDateString()) {
  // PC/모바일 동기화의 기준은 반드시 Firestore에 저장된 오늘 루틴이다.
  // localStorage/sessionStorage는 기기별 임시값이므로 Firestore 값이 있으면 절대 덮어쓰지 않는다.
  if (existingRoutine && existingRoutine.date === date) {
    return existingRoutine;
  }

  // Firestore를 아직 못 불러왔거나 권한 문제로 실패한 경우에만 같은 기기의 fallback 값을 사용한다.
  const storedRecord = readStoredRoutineRecord(userId, date);
  const dailyState = readRoutineDailyState(userId, date);
  const candidates = [storedRecord, dailyState]
    .filter((routine) => routine && routine.date === date)
    .sort((a, b) => getRoutineUpdatedMs(b) - getRoutineUpdatedMs(a));
  return candidates[0] || null;
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
    id: item.id || `routine_item_${idx + 1}`,
    label: String(item.label || item.name || "").trim() || `루틴 ${idx + 1}`,
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

function getTodayRoutineRateForUser(userId, routines = [], date = getCurrentLocalDateString()) {
  const routine = getSavedRoutineForToday(userId, getRoutineForDate(routines, date), date);
  return routine?.completionRate || 0;
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

// 공식 기록 저장 표준: rawDivision/rawSheetLabel/sourceFileId를 먼저 보정하고,
// Firestore에는 canonical division/rankingGroup만 저장한다.
// 초등 U-10/U-11/1~4학년 => 초등부(저학년), U-12/5~6학년 => 초등부(고학년)
// 중학부/중등부 => 중등부, 고등부 => 고등부, 대학부 => 대학부, 일반부 => 일반부
function normalizeDivisionLabel(value, context = {}) {
  const rawText = [
    value,
    context.rawDivision,
    context.sheetLabel,
    context.sourceSheetId,
    context.sourceFileName,
    context.id,
  ]
    .filter(Boolean)
    .map((v) => String(v))
    .join(" ");
  const raw = rawText.replace(/\s+/g, "").replace(/학년$/g, "");
  const lower = raw.toLowerCase();
  if (!raw) return "";

  // 파일 코드 기반 강제 보정: AR04=대학부, AR05=일반부
  if (lower.includes("ar04")) return "대학부";
  if (lower.includes("ar05")) return "일반부";

  if (raw.includes("일반부") || raw.includes("일반")) return "일반부";
  if (raw.includes("대학부") || raw.includes("대학")) return "대학부";
  if (raw.includes("고등부") || raw.includes("고등")) return "고등부";
  if (raw.includes("중학부") || raw.includes("중등부") || raw.includes("중등")) return "중등부";
  if (raw.includes("초등")) {
    if (raw.includes("U-10") || raw.includes("U10") || raw.includes("U-11") || raw.includes("U11") || raw.includes("1~4")) return "초등부(저학년)";
    if (raw.includes("U-12") || raw.includes("U12") || raw.includes("5~6")) return "초등부(고학년)";
    if (/초등[1-4]/.test(raw)) return "초등부(저학년)";
    if (/초등[5-6]/.test(raw)) return "초등부(고학년)";
    return "초등부(통합)";
  }
  if (/^초등[1-4]$/.test(raw)) return "초등부(저학년)";
  if (/^초등[5-6]$/.test(raw)) return "초등부(고학년)";
  if (/^중등[1-3]$/.test(raw)) return "중등부";
  if (/^고등[1-3]$/.test(raw)) return "고등부";
  return raw;
}

function canonicalRankingGroup(value, context = {}) {
  const d = normalizeDivisionLabel(value, context);
  if (d === "초등부(저학년)") return "초등부(저학년)";
  if (d === "초등부(고학년)") return "초등부(고학년)";
  if (d === "초등부(통합)") return "초등부(통합)";
  if (d === "중등부") return "중등부";
  if (d === "고등부") return "고등부";
  if (d === "대학부") return "대학부";
  if (d === "일반부") return "일반부";
  return d;
}

function normalizeOfficialRankingEntry(entry = {}) {
  const division = normalizeDivisionLabel(entry.division || entry.rankingGroup || entry.category, entry);
  const rankingGroup = canonicalRankingGroup(division, entry);
  return {
    ...entry,
    rawDivision: entry.rawDivision || entry.division || entry.rankingGroup || entry.category || "",
    division,
    rankingGroup,
    category: rankingGroup,
    isOfficialRecord: true,
    sourceType: entry.sourceType || "latest_official_batch",
  };
}

function validateOfficialBatchRows(rows = []) {
  return rows.reduce((acc, row) => {
    const d = canonicalRankingGroup(row.rankingGroup || row.division || row.category, row);
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});
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

function hasExactSchoolGrade(value) {
  const raw = String(value || "").trim();
  return /^(초등|중등|고등)[1-6]$/.test(raw);
}

function getDivisionFromRankingGroup(rankingGroup = "", gender = "") {
  const group = String(rankingGroup || "").trim();
  if (group === "초등부(저학년)") return "초등부(저학년)";
  if (group === "초등부(고학년)") return "초등부(고학년)";
  if (group === "초등부(통합)") return "초등부(통합)";
  if (group === "중등부") return "중등부";
  if (group === "고등부" || group === "고등부(남)" || group === "고등부(여)") return "고등부";
  if (group === "대학부" || group === "대학부(남)" || group === "대학부(여)") return "대학부";
  if (group === "일반부" || group === "일반부(남)" || group === "일반부(여)") return "일반부";
  if (group === "대학/일반부(남)" || group === "대학/일반부(여)" || group === "대학/일반부") {
    return normalizeDivisionLabel(group, { sheetLabel: group });
  }
  return canonicalRankingGroup(group) || "-";
}

function formatRankingDivisionLabel(item = {}) {
  // 사용자 기록은 실제 프로필 학년을 우선 표시한다.
  if (!item.isSampleData && !item.isOfficialRecord && !item.isOfficialRecordUser && item.sourceType !== "competition_result") {
    return formatProfileDivisionLabel(item.division || item.rankingGroup || "");
  }

  // 공식 대회 결과는 PDF에 없는 학년을 임의로 만들지 않는다.
  // 정확한 학년이 원본에 있을 때만 학년을 표시하고, 없으면 부문/구분만 표시한다.
  if (hasExactSchoolGrade(item.division)) {
    return formatProfileDivisionLabel(item.division);
  }
  return getDivisionFromRankingGroup(item.rankingGroup || item.category || item.divisionGroup, item.gender);
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
  if (d === "고등부") return "고등부";
  if (/^고등[1-3]$/.test(d)) return "고등부";
  if (d === "대학부") return "대학부";
  if (d === "일반부") return "일반부";
  return canonicalRankingGroup(d);
}

function rankingGroupMatchesFilter(selectedGroup, actualGroup) {
  if (!selectedGroup || selectedGroup === "all") return true;
  if (selectedGroup === "초등부(통합)") {
    return actualGroup === "초등부(통합)" || actualGroup === "초등부(저학년)" || actualGroup === "초등부(고학년)";
  }
  if (selectedGroup === "고등부") {
    return actualGroup === "고등부" || actualGroup === "고등부(남)" || actualGroup === "고등부(여)";
  }
  if (selectedGroup === "대학부") {
    return actualGroup === "대학부" || actualGroup === "대학부(남)" || actualGroup === "대학부(여)" || actualGroup === "대학/일반부(남)" || actualGroup === "대학/일반부(여)" || actualGroup === "대학/일반부";
  }
  if (selectedGroup === "일반부") {
    return actualGroup === "일반부" || actualGroup === "일반부(남)" || actualGroup === "일반부(여)" || actualGroup === "대학/일반부(남)" || actualGroup === "대학/일반부(여)" || actualGroup === "대학/일반부";
  }
  if (selectedGroup === "대학/일반부") {
    return actualGroup === "대학부" || actualGroup === "일반부" || actualGroup === "대학/일반부(남)" || actualGroup === "대학/일반부(여)" || actualGroup === "대학/일반부";
  }
  return canonicalRankingGroup(actualGroup) === canonicalRankingGroup(selectedGroup);
}

function schoolFilterMatches(selectedGroupName, actualGroupName) {
  // 학교/소속 필터는 Firestore where 정확일치로 처리하지 않는다.
  // 대회 PDF/사용자 프로필의 표기가 "안양서초", "안양서초등학교", "하남천현초", "천현초"처럼
  // 달라질 수 있으므로 앱 내부 정규화/부분매칭으로 처리한다.
  return schoolNameMatchesFilter(actualGroupName, selectedGroupName);
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
    weather: safe.weather || buildDefaultSessionWeather(),
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
      clubName: '하남천현초등학교',
      groupName: '하남천현초등학교',
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
    id: "official_jongbyeol_2025_jinju_latest_only",
    date: "2025-05-24",
    startDate: "2025-05-24",
    endDate: "2025-05-27",
    bowType: "리커브",
    region: "전국",
    gender: "전체",
    rankingGroup: "전체",
    sourceType: "latest_official_batch",
    status: "active_latest_only",
    venue: "진주종합경기장",
    eventName: "제60회 전국 남여 양궁 종별선수권 대회",
    notes: "2025/05/24~2025/05/27 진주종합경기장 제60회 전국 남여 양궁 종별선수권 대회",
  },
];

// 데이터화된 공식기록 원본. 개인 기록으로 자동 주입하지 않고 공식기록으로만 사용한다.
// 공식기록은 원본 표에 있는 사실만 보관한다. 2026-04-12 표는 선수 전원 점수까지 반영한다. U-11은 저학년, 일반 초등부 표는 통합으로 기록한다.
const SAMPLE_SHEETS = [
  {
    "gender": "남",
    "division": "초등부(저학년)",
    "rankingGroup": "초등부(저학년)",
    "distances": [
      35,
      30,
      25,
      20
    ],
    "rows": [
      {
        "rank": 1,
        "target": "13D",
        "name": "김영재",
        "school": "연무초등학교",
        "rounds": [
          310,
          339,
          338,
          350
        ],
        "total": 1337,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "29D",
        "name": "변지성",
        "school": "인천부평서초등학교",
        "rounds": [
          317,
          321,
          344,
          354
        ],
        "total": 1336,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "51C",
        "name": "김여울",
        "school": "용성초등학교",
        "rounds": [
          326,
          327,
          335,
          347
        ],
        "total": 1335,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "64A",
        "name": "김승호",
        "school": "대전가장초등학교",
        "rounds": [
          321,
          315,
          340,
          347
        ],
        "total": 1323,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "39A",
        "name": "곽상우",
        "school": "이원초등학교",
        "rounds": [
          309,
          315,
          335,
          346
        ],
        "total": 1305,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "31B",
        "name": "김태양",
        "school": "봉원초등학교",
        "rounds": [
          303,
          317,
          324,
          341
        ],
        "total": 1285,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "15D",
        "name": "유선유",
        "school": "연무초등학교",
        "rounds": [
          294,
          304,
          323,
          329
        ],
        "total": 1250,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "53C",
        "name": "성병옥",
        "school": "임실군양궁스포츠클럽(동)",
        "rounds": [
          292,
          301,
          320,
          336
        ],
        "total": 1249,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "48C",
        "name": "정명환",
        "school": "인천계산초등학교",
        "rounds": [
          297,
          280,
          325,
          336
        ],
        "total": 1238,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "13B",
        "name": "김규빈",
        "school": "옥서초등학교",
        "rounds": [
          295,
          299,
          304,
          334
        ],
        "total": 1232,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "41D",
        "name": "문우진",
        "school": "남천초등학교",
        "rounds": [
          269,
          306,
          318,
          338
        ],
        "total": 1231,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "46C",
        "name": "김태양",
        "school": "인천계산초등학교",
        "rounds": [
          289,
          303,
          316,
          320
        ],
        "total": 1228,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "65A",
        "name": "김민준",
        "school": "대전가장초등학교",
        "rounds": [
          298,
          295,
          301,
          325
        ],
        "total": 1219,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "63B",
        "name": "조승근",
        "school": "두암초등학교",
        "rounds": [
          271,
          302,
          316,
          322
        ],
        "total": 1211,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "35C",
        "name": "장재하",
        "school": "괴산명덕초등학교",
        "rounds": [
          265,
          266,
          320,
          330
        ],
        "total": 1181,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "65C",
        "name": "김지한",
        "school": "경산서부초등학교",
        "rounds": [
          271,
          277,
          312,
          318
        ],
        "total": 1178,
        "sourceRank": 16
      },
      {
        "rank": 17,
        "target": "30D",
        "name": "이윤",
        "school": "인천부평서초등학교",
        "rounds": [
          266,
          279,
          306,
          323
        ],
        "total": 1174,
        "sourceRank": 17
      },
      {
        "rank": 18,
        "target": "40C",
        "name": "최유담",
        "school": "태서초등학교",
        "rounds": [
          257,
          287,
          298,
          322
        ],
        "total": 1164,
        "sourceRank": 18
      },
      {
        "rank": 19,
        "target": "52C",
        "name": "김도윤",
        "school": "용성초등학교",
        "rounds": [
          267,
          255,
          317,
          314
        ],
        "total": 1153,
        "sourceRank": 19
      },
      {
        "rank": 20,
        "target": "41C",
        "name": "강태현",
        "school": "태서초등학교",
        "rounds": [
          264,
          265,
          300,
          323
        ],
        "total": 1152,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "60A",
        "name": "박도현",
        "school": "성포초등학교",
        "rounds": [
          253,
          262,
          313,
          323
        ],
        "total": 1151,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "22D",
        "name": "엄희준",
        "school": "예천초등학교",
        "rounds": [
          247,
          274,
          298,
          322
        ],
        "total": 1141,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "27A",
        "name": "이정현",
        "school": "전주기린초등학교",
        "rounds": [
          240,
          298,
          278,
          320
        ],
        "total": 1136,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "32B",
        "name": "구예준",
        "school": "봉원초등학교",
        "rounds": [
          247,
          240,
          316,
          328
        ],
        "total": 1131,
        "sourceRank": 24
      },
      {
        "rank": 25,
        "target": "21D",
        "name": "김한빈",
        "school": "예천초등학교",
        "rounds": [
          253,
          261,
          307,
          308
        ],
        "total": 1129,
        "sourceRank": 25
      },
      {
        "rank": 26,
        "target": "55C",
        "name": "김윤건",
        "school": "병천초등학교",
        "rounds": [
          245,
          255,
          302,
          319
        ],
        "total": 1121,
        "sourceRank": 26
      },
      {
        "rank": 27,
        "target": "36B",
        "name": "변수현",
        "school": "홍남초등학교",
        "rounds": [
          243,
          241,
          307,
          327
        ],
        "total": 1118,
        "sourceRank": 27
      },
      {
        "rank": 28,
        "target": "31C",
        "name": "최우빈",
        "school": "하남천현초등학교",
        "rounds": [
          234,
          274,
          303,
          306
        ],
        "total": 1117,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "56C",
        "name": "김태윤",
        "school": "병천초등학교",
        "rounds": [
          230,
          260,
          291,
          315
        ],
        "total": 1096,
        "sourceRank": 29
      },
      {
        "rank": 30,
        "target": "32C",
        "name": "구교준",
        "school": "하남천현초등학교",
        "rounds": [
          233,
          235,
          300,
          324
        ],
        "total": 1092,
        "sourceRank": 30
      },
      {
        "rank": 31,
        "target": "14A",
        "name": "박세준",
        "school": "대구송현초등학교",
        "rounds": [
          230,
          262,
          305,
          284
        ],
        "total": 1081,
        "sourceRank": 31
      },
      {
        "rank": 32,
        "target": "56A",
        "name": "김태강",
        "school": "창녕초등학교",
        "rounds": [
          235,
          260,
          270,
          308
        ],
        "total": 1073,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "55A",
        "name": "박재호",
        "school": "창녕초등학교",
        "rounds": [
          193,
          277,
          277,
          319
        ],
        "total": 1066,
        "sourceRank": 33
      },
      {
        "rank": 34,
        "target": "36A",
        "name": "천지환",
        "school": "성진초등학교",
        "rounds": [
          204,
          273,
          277,
          302
        ],
        "total": 1056,
        "sourceRank": 34
      },
      {
        "rank": 35,
        "target": "54A",
        "name": "안선율",
        "school": "창녕초등학교",
        "rounds": [
          213,
          244,
          283,
          303
        ],
        "total": 1043,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "52D",
        "name": "장다준",
        "school": "김포하성초등학교",
        "rounds": [
          199,
          240,
          281,
          316
        ],
        "total": 1036,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "37B",
        "name": "서주원",
        "school": "홍남초등학교",
        "rounds": [
          228,
          245,
          269,
          293
        ],
        "total": 1035,
        "sourceRank": 37
      },
      {
        "rank": 38,
        "target": "55B",
        "name": "박시훈",
        "school": "설악초등학교",
        "rounds": [
          250,
          253,
          257,
          272
        ],
        "total": 1032,
        "sourceRank": 38
      },
      {
        "rank": 38,
        "target": "23D",
        "name": "김승율",
        "school": "예천초등학교",
        "rounds": [
          233,
          238,
          261,
          300
        ],
        "total": 1032,
        "sourceRank": 38
      },
      {
        "rank": 40,
        "target": "53A",
        "name": "김준서",
        "school": "창녕초등학교",
        "rounds": [
          237,
          225,
          250,
          313
        ],
        "total": 1025,
        "sourceRank": 40
      },
      {
        "rank": 41,
        "target": "31D",
        "name": "박보령",
        "school": "인천부평서초등학교",
        "rounds": [
          225,
          238,
          249,
          301
        ],
        "total": 1013,
        "sourceRank": 41
      },
      {
        "rank": 42,
        "target": "55D",
        "name": "장도원",
        "school": "서울인헌초등학교",
        "rounds": [
          188,
          244,
          256,
          290
        ],
        "total": 978,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "49C",
        "name": "채재호",
        "school": "인천계산초등학교",
        "rounds": [
          180,
          238,
          275,
          273
        ],
        "total": 966,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "64B",
        "name": "이민우",
        "school": "두암초등학교",
        "rounds": [
          185,
          218,
          203,
          236
        ],
        "total": 842,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "53D",
        "name": "유기선",
        "school": "송해초등학교",
        "rounds": [
          0,
          0,
          248,
          270
        ],
        "total": 518,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "56D",
        "name": "김태양",
        "school": "서울인헌초등학교",
        "rounds": [
          0,
          0,
          223,
          253
        ],
        "total": 476,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "25B",
        "name": "이찬우",
        "school": "서울청량초등학교",
        "rounds": [
          0,
          0,
          208,
          262
        ],
        "total": 470,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "50D",
        "name": "진서준",
        "school": "문산초등학교",
        "rounds": [
          0,
          0,
          139,
          219
        ],
        "total": 358,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "47A",
        "name": "홍시윤",
        "school": "충주금릉초등학교",
        "rounds": [
          0,
          0,
          134,
          216
        ],
        "total": 350,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "32D",
        "name": "한성진",
        "school": "인천부평서초등학교",
        "rounds": [
          0,
          0,
          84,
          157
        ],
        "total": 241,
        "sourceRank": 50
      },
      {
        "rank": 51,
        "target": "40A",
        "name": "박준수",
        "school": "이원초등학교",
        "rounds": [
          0,
          0,
          0,
          184
        ],
        "total": 184,
        "sourceRank": 51
      },
      {
        "rank": 52,
        "target": "15A",
        "name": "구민찬",
        "school": "대구송현초등학교",
        "rounds": [
          0,
          0,
          0,
          166
        ],
        "total": 166,
        "sourceRank": 52
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar01m010q",
    "sheetLabel": "남자 리커브 초등부 U-10(1~4학년) 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "남",
    "division": "초등부(고학년)",
    "rankingGroup": "초등부(고학년)",
    "distances": [
      35,
      30,
      25,
      20
    ],
    "rows": [
      {
        "rank": 1,
        "target": "31A",
        "name": "김진원",
        "school": "전주기린초등학교",
        "rounds": [
          338,
          345,
          351,
          356
        ],
        "total": 1390,
        "sourceRank": 1
      },
      {
        "rank": 1,
        "target": "11A",
        "name": "이참",
        "school": "대구송현초등학교",
        "rounds": [
          331,
          348,
          354,
          357
        ],
        "total": 1390,
        "sourceRank": 1
      },
      {
        "rank": 3,
        "target": "59D",
        "name": "박수한",
        "school": "여수좌수영초등학교",
        "rounds": [
          336,
          346,
          349,
          358
        ],
        "total": 1389,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "15C",
        "name": "이호태",
        "school": "인천석암초등학교",
        "rounds": [
          336,
          350,
          345,
          357
        ],
        "total": 1388,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "16A",
        "name": "이주원",
        "school": "대평초등학교",
        "rounds": [
          331,
          345,
          351,
          355
        ],
        "total": 1382,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "50A",
        "name": "조인우",
        "school": "창녕초등학교",
        "rounds": [
          335,
          347,
          347,
          350
        ],
        "total": 1379,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "10B",
        "name": "황정민",
        "school": "옥서초등학교",
        "rounds": [
          332,
          334,
          356,
          354
        ],
        "total": 1376,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "29C",
        "name": "백종준",
        "school": "하남천현초등학교",
        "rounds": [
          334,
          337,
          349,
          355
        ],
        "total": 1375,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "12D",
        "name": "장은혁",
        "school": "연무초등학교",
        "rounds": [
          336,
          340,
          346,
          352
        ],
        "total": 1374,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "10A",
        "name": "신재우",
        "school": "대구송현초등학교",
        "rounds": [
          330,
          339,
          349,
          353
        ],
        "total": 1371,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "42A",
        "name": "송바다",
        "school": "서울북가좌초등학교",
        "rounds": [
          331,
          334,
          349,
          355
        ],
        "total": 1369,
        "sourceRank": 11
      },
      {
        "rank": 11,
        "target": "39D",
        "name": "한상원",
        "school": "대구불로초등학교",
        "rounds": [
          328,
          336,
          350,
          355
        ],
        "total": 1369,
        "sourceRank": 11
      },
      {
        "rank": 13,
        "target": "33C",
        "name": "이은호",
        "school": "괴산명덕초등학교",
        "rounds": [
          336,
          333,
          346,
          353
        ],
        "total": 1368,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "12B",
        "name": "이재준",
        "school": "옥서초등학교",
        "rounds": [
          329,
          336,
          348,
          354
        ],
        "total": 1367,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "41A",
        "name": "양지율",
        "school": "서울북가좌초등학교",
        "rounds": [
          335,
          327,
          344,
          357
        ],
        "total": 1363,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "62B",
        "name": "강산",
        "school": "대미초등학교",
        "rounds": [
          332,
          335,
          344,
          351
        ],
        "total": 1362,
        "sourceRank": 16
      },
      {
        "rank": 16,
        "target": "42C",
        "name": "최재국",
        "school": "대구황금초등학교",
        "rounds": [
          327,
          335,
          349,
          351
        ],
        "total": 1362,
        "sourceRank": 16
      },
      {
        "rank": 18,
        "target": "30C",
        "name": "최강빈",
        "school": "하남천현초등학교",
        "rounds": [
          333,
          341,
          338,
          348
        ],
        "total": 1360,
        "sourceRank": 18
      },
      {
        "rank": 19,
        "target": "36D",
        "name": "이은찬",
        "school": "대전서부초등학교",
        "rounds": [
          320,
          338,
          349,
          351
        ],
        "total": 1358,
        "sourceRank": 19
      },
      {
        "rank": 19,
        "target": "10C",
        "name": "박현우",
        "school": "용암초등학교",
        "rounds": [
          329,
          340,
          341,
          348
        ],
        "total": 1358,
        "sourceRank": 19
      },
      {
        "rank": 21,
        "target": "57C",
        "name": "이지호",
        "school": "오창초등학교",
        "rounds": [
          329,
          328,
          349,
          351
        ],
        "total": 1357,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "11B",
        "name": "김건후",
        "school": "옥서초등학교",
        "rounds": [
          329,
          332,
          345,
          350
        ],
        "total": 1356,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "62A",
        "name": "김지호",
        "school": "대전가장초등학교",
        "rounds": [
          328,
          339,
          341,
          346
        ],
        "total": 1354,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "19A",
        "name": "김도헌",
        "school": "대구동부초등학교",
        "rounds": [
          329,
          331,
          339,
          354
        ],
        "total": 1353,
        "sourceRank": 24
      },
      {
        "rank": 25,
        "target": "58A",
        "name": "김준서",
        "school": "성포초등학교",
        "rounds": [
          316,
          333,
          349,
          354
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 25,
        "target": "61A",
        "name": "김성훈",
        "school": "인천서면초등학교",
        "rounds": [
          324,
          333,
          342,
          353
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 27,
        "target": "18D",
        "name": "이지원",
        "school": "예천초등학교",
        "rounds": [
          318,
          333,
          350,
          350
        ],
        "total": 1351,
        "sourceRank": 27
      },
      {
        "rank": 28,
        "target": "26D",
        "name": "장현우",
        "school": "인천부평서초등학교",
        "rounds": [
          323,
          330,
          343,
          353
        ],
        "total": 1349,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "19D",
        "name": "김태윤",
        "school": "예천초등학교",
        "rounds": [
          325,
          329,
          345,
          349
        ],
        "total": 1348,
        "sourceRank": 29
      },
      {
        "rank": 29,
        "target": "30A",
        "name": "우치수",
        "school": "전주기린초등학교",
        "rounds": [
          325,
          332,
          337,
          354
        ],
        "total": 1348,
        "sourceRank": 29
      },
      {
        "rank": 31,
        "target": "43C",
        "name": "최준",
        "school": "대구황금초등학교",
        "rounds": [
          318,
          334,
          344,
          351
        ],
        "total": 1347,
        "sourceRank": 31
      },
      {
        "rank": 31,
        "target": "17D",
        "name": "김현소",
        "school": "예천초등학교",
        "rounds": [
          328,
          328,
          342,
          349
        ],
        "total": 1347,
        "sourceRank": 31
      },
      {
        "rank": 31,
        "target": "35D",
        "name": "김도현",
        "school": "대전서부초등학교",
        "rounds": [
          319,
          332,
          342,
          354
        ],
        "total": 1347,
        "sourceRank": 31
      },
      {
        "rank": 31,
        "target": "20B",
        "name": "곽래우",
        "school": "삼정초등학교",
        "rounds": [
          326,
          326,
          344,
          351
        ],
        "total": 1347,
        "sourceRank": 31
      },
      {
        "rank": 35,
        "target": "57A",
        "name": "최수혁",
        "school": "성포초등학교",
        "rounds": [
          323,
          329,
          343,
          351
        ],
        "total": 1346,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "52A",
        "name": "박지후",
        "school": "창녕초등학교",
        "rounds": [
          332,
          321,
          342,
          349
        ],
        "total": 1344,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "25A",
        "name": "이현승",
        "school": "인천용현남초등학교",
        "rounds": [
          323,
          332,
          343,
          345
        ],
        "total": 1343,
        "sourceRank": 37
      },
      {
        "rank": 38,
        "target": "10D",
        "name": "임태서",
        "school": "연무초등학교",
        "rounds": [
          315,
          335,
          344,
          348
        ],
        "total": 1342,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "47C",
        "name": "김다온",
        "school": "인천계산초등학교",
        "rounds": [
          325,
          327,
          345,
          343
        ],
        "total": 1340,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "21A",
        "name": "이하준",
        "school": "대구동부초등학교",
        "rounds": [
          314,
          332,
          342,
          351
        ],
        "total": 1339,
        "sourceRank": 40
      },
      {
        "rank": 40,
        "target": "33D",
        "name": "이준혁",
        "school": "복산초등학교",
        "rounds": [
          319,
          331,
          338,
          351
        ],
        "total": 1339,
        "sourceRank": 40
      },
      {
        "rank": 42,
        "target": "27B",
        "name": "민해온",
        "school": "봉원초등학교",
        "rounds": [
          316,
          340,
          332,
          347
        ],
        "total": 1335,
        "sourceRank": 42
      },
      {
        "rank": 42,
        "target": "14C",
        "name": "오지호",
        "school": "인천석암초등학교",
        "rounds": [
          321,
          325,
          344,
          345
        ],
        "total": 1335,
        "sourceRank": 42
      },
      {
        "rank": 44,
        "target": "34A",
        "name": "양지원",
        "school": "성진초등학교",
        "rounds": [
          324,
          330,
          338,
          341
        ],
        "total": 1333,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "14D",
        "name": "김영민",
        "school": "연무초등학교",
        "rounds": [
          319,
          325,
          345,
          343
        ],
        "total": 1332,
        "sourceRank": 45
      },
      {
        "rank": 45,
        "target": "20A",
        "name": "이윤기",
        "school": "대구동부초등학교",
        "rounds": [
          319,
          331,
          334,
          348
        ],
        "total": 1332,
        "sourceRank": 45
      },
      {
        "rank": 47,
        "target": "15B",
        "name": "김시우",
        "school": "서울방이초등학교",
        "rounds": [
          321,
          334,
          337,
          339
        ],
        "total": 1331,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "22B",
        "name": "강주혁",
        "school": "서울청량초등학교",
        "rounds": [
          317,
          326,
          341,
          346
        ],
        "total": 1330,
        "sourceRank": 48
      },
      {
        "rank": 48,
        "target": "22A",
        "name": "정하진",
        "school": "인천용현남초등학교",
        "rounds": [
          316,
          328,
          335,
          351
        ],
        "total": 1330,
        "sourceRank": 48
      },
      {
        "rank": 48,
        "target": "29A",
        "name": "천미르",
        "school": "전주기린초등학교",
        "rounds": [
          331,
          316,
          335,
          348
        ],
        "total": 1330,
        "sourceRank": 48
      },
      {
        "rank": 48,
        "target": "24D",
        "name": "손지민",
        "school": "모덕초등학교",
        "rounds": [
          321,
          325,
          341,
          343
        ],
        "total": 1330,
        "sourceRank": 48
      },
      {
        "rank": 52,
        "target": "47B",
        "name": "이은호",
        "school": "서울신학초등학교",
        "rounds": [
          321,
          334,
          331,
          342
        ],
        "total": 1328,
        "sourceRank": 52
      },
      {
        "rank": 53,
        "target": "61C",
        "name": "박우주",
        "school": "경산서부초등학교",
        "rounds": [
          315,
          314,
          346,
          352
        ],
        "total": 1327,
        "sourceRank": 53
      },
      {
        "rank": 54,
        "target": "17A",
        "name": "오승현",
        "school": "대평초등학교",
        "rounds": [
          312,
          335,
          330,
          349
        ],
        "total": 1326,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "11D",
        "name": "정선우",
        "school": "연무초등학교",
        "rounds": [
          319,
          328,
          331,
          346
        ],
        "total": 1324,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "22C",
        "name": "김민준",
        "school": "사천초등학교",
        "rounds": [
          320,
          328,
          330,
          345
        ],
        "total": 1323,
        "sourceRank": 56
      },
      {
        "rank": 57,
        "target": "20D",
        "name": "조태양",
        "school": "예천초등학교",
        "rounds": [
          325,
          315,
          337,
          344
        ],
        "total": 1321,
        "sourceRank": 57
      },
      {
        "rank": 57,
        "target": "51A",
        "name": "유현빈",
        "school": "창녕초등학교",
        "rounds": [
          321,
          321,
          334,
          345
        ],
        "total": 1321,
        "sourceRank": 57
      },
      {
        "rank": 59,
        "target": "50C",
        "name": "손별",
        "school": "용성초등학교",
        "rounds": [
          318,
          313,
          340,
          347
        ],
        "total": 1318,
        "sourceRank": 59
      },
      {
        "rank": 60,
        "target": "37D",
        "name": "강동원",
        "school": "대전서부초등학교",
        "rounds": [
          312,
          323,
          342,
          338
        ],
        "total": 1315,
        "sourceRank": 60
      },
      {
        "rank": 61,
        "target": "14B",
        "name": "이서우",
        "school": "서울방이초등학교",
        "rounds": [
          327,
          310,
          326,
          351
        ],
        "total": 1314,
        "sourceRank": 61
      },
      {
        "rank": 62,
        "target": "60C",
        "name": "양진우",
        "school": "경산서부초등학교",
        "rounds": [
          306,
          333,
          330,
          344
        ],
        "total": 1313,
        "sourceRank": 62
      },
      {
        "rank": 63,
        "target": "23A",
        "name": "박찬석",
        "school": "인천용현남초등학교",
        "rounds": [
          318,
          318,
          335,
          341
        ],
        "total": 1312,
        "sourceRank": 63
      },
      {
        "rank": 63,
        "target": "12A",
        "name": "정인후",
        "school": "대구송현초등학교",
        "rounds": [
          312,
          319,
          338,
          343
        ],
        "total": 1312,
        "sourceRank": 63
      },
      {
        "rank": 63,
        "target": "48B",
        "name": "조승현",
        "school": "서울신학초등학교",
        "rounds": [
          308,
          321,
          344,
          339
        ],
        "total": 1312,
        "sourceRank": 63
      },
      {
        "rank": 66,
        "target": "29B",
        "name": "민해양",
        "school": "봉원초등학교",
        "rounds": [
          312,
          313,
          343,
          343
        ],
        "total": 1311,
        "sourceRank": 66
      },
      {
        "rank": 67,
        "target": "44B",
        "name": "박지혁",
        "school": "천곡초등학교",
        "rounds": [
          295,
          315,
          350,
          350
        ],
        "total": 1310,
        "sourceRank": 67
      },
      {
        "rank": 67,
        "target": "28B",
        "name": "주재훈",
        "school": "봉원초등학교",
        "rounds": [
          314,
          316,
          336,
          344
        ],
        "total": 1310,
        "sourceRank": 67
      },
      {
        "rank": 69,
        "target": "43D",
        "name": "이종민",
        "school": "남천초등학교",
        "rounds": [
          307,
          316,
          341,
          344
        ],
        "total": 1308,
        "sourceRank": 69
      },
      {
        "rank": 70,
        "target": "44C",
        "name": "임승현",
        "school": "대구황금초등학교",
        "rounds": [
          315,
          323,
          330,
          339
        ],
        "total": 1307,
        "sourceRank": 70
      },
      {
        "rank": 71,
        "target": "48A",
        "name": "김진규",
        "school": "둔내초등학교",
        "rounds": [
          309,
          314,
          339,
          344
        ],
        "total": 1306,
        "sourceRank": 71
      },
      {
        "rank": 72,
        "target": "63A",
        "name": "백준",
        "school": "대전가장초등학교",
        "rounds": [
          316,
          303,
          334,
          351
        ],
        "total": 1304,
        "sourceRank": 72
      },
      {
        "rank": 73,
        "target": "34D",
        "name": "이지한",
        "school": "복산초등학교",
        "rounds": [
          305,
          312,
          337,
          349
        ],
        "total": 1303,
        "sourceRank": 73
      },
      {
        "rank": 73,
        "target": "51D",
        "name": "이우현",
        "school": "김포하성초등학교",
        "rounds": [
          312,
          312,
          337,
          342
        ],
        "total": 1303,
        "sourceRank": 73
      },
      {
        "rank": 73,
        "target": "62C",
        "name": "김단우",
        "school": "경산서부초등학교",
        "rounds": [
          312,
          316,
          334,
          341
        ],
        "total": 1303,
        "sourceRank": 73
      },
      {
        "rank": 76,
        "target": "27D",
        "name": "김진표",
        "school": "인천부평서초등학교",
        "rounds": [
          300,
          323,
          332,
          346
        ],
        "total": 1301,
        "sourceRank": 76
      },
      {
        "rank": 77,
        "target": "17C",
        "name": "홍현민",
        "school": "인천석암초등학교",
        "rounds": [
          299,
          312,
          343,
          338
        ],
        "total": 1292,
        "sourceRank": 77
      },
      {
        "rank": 78,
        "target": "44D",
        "name": "김지우",
        "school": "경화초등학교",
        "rounds": [
          287,
          319,
          337,
          347
        ],
        "total": 1290,
        "sourceRank": 78
      },
      {
        "rank": 78,
        "target": "40D",
        "name": "이승원",
        "school": "대구불로초등학교",
        "rounds": [
          299,
          311,
          335,
          345
        ],
        "total": 1290,
        "sourceRank": 78
      },
      {
        "rank": 78,
        "target": "16B",
        "name": "김지호",
        "school": "서울방이초등학교",
        "rounds": [
          311,
          312,
          332,
          335
        ],
        "total": 1290,
        "sourceRank": 78
      },
      {
        "rank": 81,
        "target": "28D",
        "name": "이지빈",
        "school": "인천부평서초등학교",
        "rounds": [
          285,
          313,
          343,
          347
        ],
        "total": 1288,
        "sourceRank": 81
      },
      {
        "rank": 82,
        "target": "58D",
        "name": "김지완",
        "school": "대전송촌초등학교",
        "rounds": [
          307,
          304,
          335,
          341
        ],
        "total": 1287,
        "sourceRank": 82
      },
      {
        "rank": 83,
        "target": "24A",
        "name": "손겸손",
        "school": "인천용현남초등학교",
        "rounds": [
          315,
          317,
          311,
          343
        ],
        "total": 1286,
        "sourceRank": 83
      },
      {
        "rank": 84,
        "target": "46D",
        "name": "김유건",
        "school": "경화초등학교",
        "rounds": [
          302,
          304,
          331,
          348
        ],
        "total": 1285,
        "sourceRank": 84
      },
      {
        "rank": 85,
        "target": "62D",
        "name": "윤희성",
        "school": "서울개봉초등학교",
        "rounds": [
          287,
          321,
          331,
          345
        ],
        "total": 1284,
        "sourceRank": 85
      },
      {
        "rank": 86,
        "target": "50B",
        "name": "이별하",
        "school": "새일초등학교",
        "rounds": [
          306,
          306,
          328,
          340
        ],
        "total": 1280,
        "sourceRank": 86
      },
      {
        "rank": 87,
        "target": "46A",
        "name": "이재용",
        "school": "충주금릉초등학교",
        "rounds": [
          300,
          304,
          329,
          346
        ],
        "total": 1279,
        "sourceRank": 87
      },
      {
        "rank": 87,
        "target": "16C",
        "name": "정현준",
        "school": "인천석암초등학교",
        "rounds": [
          298,
          311,
          335,
          335
        ],
        "total": 1279,
        "sourceRank": 87
      },
      {
        "rank": 89,
        "target": "18A",
        "name": "이제원",
        "school": "대평초등학교",
        "rounds": [
          300,
          313,
          321,
          344
        ],
        "total": 1278,
        "sourceRank": 89
      },
      {
        "rank": 89,
        "target": "38D",
        "name": "고태호",
        "school": "대전서부초등학교",
        "rounds": [
          310,
          309,
          319,
          340
        ],
        "total": 1278,
        "sourceRank": 89
      },
      {
        "rank": 91,
        "target": "56B",
        "name": "강지우",
        "school": "염주초등학교",
        "rounds": [
          311,
          316,
          326,
          321
        ],
        "total": 1274,
        "sourceRank": 91
      },
      {
        "rank": 92,
        "target": "32A",
        "name": "정상후",
        "school": "대전태평초등학교",
        "rounds": [
          301,
          309,
          324,
          339
        ],
        "total": 1273,
        "sourceRank": 92
      },
      {
        "rank": 93,
        "target": "13C",
        "name": "임태건",
        "school": "인천석암초등학교",
        "rounds": [
          303,
          319,
          327,
          323
        ],
        "total": 1272,
        "sourceRank": 93
      },
      {
        "rank": 94,
        "target": "12C",
        "name": "전현준",
        "school": "용암초등학교",
        "rounds": [
          290,
          309,
          324,
          342
        ],
        "total": 1265,
        "sourceRank": 94
      },
      {
        "rank": 95,
        "target": "59A",
        "name": "배재윤",
        "school": "성포초등학교",
        "rounds": [
          305,
          279,
          335,
          344
        ],
        "total": 1263,
        "sourceRank": 95
      },
      {
        "rank": 95,
        "target": "52B",
        "name": "김라원",
        "school": "새일초등학교",
        "rounds": [
          308,
          301,
          326,
          328
        ],
        "total": 1263,
        "sourceRank": 95
      },
      {
        "rank": 97,
        "target": "38C",
        "name": "정찬혁",
        "school": "태서초등학교",
        "rounds": [
          288,
          318,
          316,
          340
        ],
        "total": 1262,
        "sourceRank": 97
      },
      {
        "rank": 97,
        "target": "28C",
        "name": "진준호",
        "school": "하남천현초등학교",
        "rounds": [
          297,
          310,
          321,
          334
        ],
        "total": 1262,
        "sourceRank": 97
      },
      {
        "rank": 99,
        "target": "45C",
        "name": "김민성",
        "school": "대구황금초등학교",
        "rounds": [
          288,
          305,
          321,
          342
        ],
        "total": 1256,
        "sourceRank": 99
      },
      {
        "rank": 99,
        "target": "45D",
        "name": "이온유",
        "school": "경화초등학교",
        "rounds": [
          289,
          307,
          324,
          336
        ],
        "total": 1256,
        "sourceRank": 99
      },
      {
        "rank": 101,
        "target": "42B",
        "name": "김규빈",
        "school": "천곡초등학교",
        "rounds": [
          307,
          298,
          323,
          325
        ],
        "total": 1253,
        "sourceRank": 101
      },
      {
        "rank": 102,
        "target": "34C",
        "name": "이지호",
        "school": "괴산명덕초등학교",
        "rounds": [
          291,
          286,
          332,
          343
        ],
        "total": 1252,
        "sourceRank": 102
      },
      {
        "rank": 103,
        "target": "61D",
        "name": "임채민",
        "school": "서울개봉초등학교",
        "rounds": [
          281,
          302,
          329,
          338
        ],
        "total": 1250,
        "sourceRank": 103
      },
      {
        "rank": 103,
        "target": "42D",
        "name": "문서후",
        "school": "남천초등학교",
        "rounds": [
          280,
          315,
          323,
          332
        ],
        "total": 1250,
        "sourceRank": 103
      },
      {
        "rank": 105,
        "target": "54C",
        "name": "김민율",
        "school": "병천초등학교",
        "rounds": [
          296,
          304,
          325,
          322
        ],
        "total": 1247,
        "sourceRank": 105
      },
      {
        "rank": 106,
        "target": "49A",
        "name": "손지훈",
        "school": "둔내초등학교",
        "rounds": [
          280,
          295,
          333,
          338
        ],
        "total": 1246,
        "sourceRank": 106
      },
      {
        "rank": 107,
        "target": "37C",
        "name": "이동민",
        "school": "태서초등학교",
        "rounds": [
          291,
          308,
          320,
          326
        ],
        "total": 1245,
        "sourceRank": 107
      },
      {
        "rank": 108,
        "target": "38B",
        "name": "김상우",
        "school": "장유초등학교",
        "rounds": [
          290,
          299,
          322,
          332
        ],
        "total": 1243,
        "sourceRank": 108
      },
      {
        "rank": 109,
        "target": "47D",
        "name": "김상윤",
        "school": "경화초등학교",
        "rounds": [
          257,
          315,
          331,
          339
        ],
        "total": 1242,
        "sourceRank": 109
      },
      {
        "rank": 109,
        "target": "26B",
        "name": "김영성",
        "school": "봉원초등학교",
        "rounds": [
          282,
          302,
          321,
          337
        ],
        "total": 1242,
        "sourceRank": 109
      },
      {
        "rank": 111,
        "target": "33B",
        "name": "김하진",
        "school": "홍남초등학교",
        "rounds": [
          293,
          301,
          315,
          330
        ],
        "total": 1239,
        "sourceRank": 111
      },
      {
        "rank": 112,
        "target": "60D",
        "name": "성지율",
        "school": "서울개봉초등학교",
        "rounds": [
          283,
          296,
          323,
          336
        ],
        "total": 1238,
        "sourceRank": 112
      },
      {
        "rank": 113,
        "target": "48D",
        "name": "박규민",
        "school": "문산초등학교",
        "rounds": [
          284,
          305,
          316,
          328
        ],
        "total": 1233,
        "sourceRank": 113
      },
      {
        "rank": 114,
        "target": "57B",
        "name": "김주성",
        "school": "염주초등학교",
        "rounds": [
          302,
          282,
          308,
          338
        ],
        "total": 1230,
        "sourceRank": 114
      },
      {
        "rank": 115,
        "target": "17B",
        "name": "강현진",
        "school": "서울방이초등학교",
        "rounds": [
          300,
          307,
          308,
          314
        ],
        "total": 1229,
        "sourceRank": 115
      },
      {
        "rank": 116,
        "target": "39C",
        "name": "황다겸",
        "school": "태서초등학교",
        "rounds": [
          270,
          295,
          331,
          325
        ],
        "total": 1221,
        "sourceRank": 116
      },
      {
        "rank": 117,
        "target": "19B",
        "name": "이준",
        "school": "삼정초등학교",
        "rounds": [
          279,
          295,
          314,
          323
        ],
        "total": 1211,
        "sourceRank": 117
      },
      {
        "rank": 118,
        "target": "25D",
        "name": "오지우",
        "school": "모덕초등학교",
        "rounds": [
          291,
          273,
          317,
          328
        ],
        "total": 1209,
        "sourceRank": 118
      },
      {
        "rank": 118,
        "target": "30B",
        "name": "이소율",
        "school": "봉원초등학교",
        "rounds": [
          302,
          289,
          305,
          313
        ],
        "total": 1209,
        "sourceRank": 118
      },
      {
        "rank": 118,
        "target": "33A",
        "name": "김동현",
        "school": "성진초등학교",
        "rounds": [
          286,
          294,
          307,
          322
        ],
        "total": 1209,
        "sourceRank": 118
      },
      {
        "rank": 121,
        "target": "57D",
        "name": "이시곤",
        "school": "대전송촌초등학교",
        "rounds": [
          284,
          269,
          324,
          330
        ],
        "total": 1207,
        "sourceRank": 121
      },
      {
        "rank": 121,
        "target": "61B",
        "name": "이은호",
        "school": "구례중앙초등학교",
        "rounds": [
          284,
          272,
          324,
          327
        ],
        "total": 1207,
        "sourceRank": 121
      },
      {
        "rank": 123,
        "target": "40B",
        "name": "최서빈",
        "school": "장유초등학교",
        "rounds": [
          263,
          284,
          318,
          337
        ],
        "total": 1202,
        "sourceRank": 123
      },
      {
        "rank": 123,
        "target": "51B",
        "name": "홍석환",
        "school": "새일초등학교",
        "rounds": [
          249,
          288,
          326,
          339
        ],
        "total": 1202,
        "sourceRank": 123
      },
      {
        "rank": 125,
        "target": "58B",
        "name": "박재우",
        "school": "염주초등학교",
        "rounds": [
          275,
          273,
          312,
          341
        ],
        "total": 1201,
        "sourceRank": 125
      },
      {
        "rank": 125,
        "target": "53B",
        "name": "나하흠",
        "school": "새일초등학교",
        "rounds": [
          279,
          285,
          313,
          324
        ],
        "total": 1201,
        "sourceRank": 125
      },
      {
        "rank": 127,
        "target": "27C",
        "name": "박진우",
        "school": "일로초등학교",
        "rounds": [
          268,
          289,
          316,
          326
        ],
        "total": 1199,
        "sourceRank": 127
      },
      {
        "rank": 128,
        "target": "63C",
        "name": "전태민",
        "school": "경산서부초등학교",
        "rounds": [
          264,
          288,
          311,
          330
        ],
        "total": 1193,
        "sourceRank": 128
      },
      {
        "rank": 129,
        "target": "49B",
        "name": "이서준",
        "school": "새일초등학교",
        "rounds": [
          269,
          287,
          317,
          318
        ],
        "total": 1191,
        "sourceRank": 129
      },
      {
        "rank": 130,
        "target": "60B",
        "name": "신진욱",
        "school": "구례중앙초등학교",
        "rounds": [
          246,
          296,
          319,
          327
        ],
        "total": 1188,
        "sourceRank": 130
      },
      {
        "rank": 131,
        "target": "43A",
        "name": "노우현",
        "school": "서울북가좌초등학교",
        "rounds": [
          264,
          282,
          322,
          319
        ],
        "total": 1187,
        "sourceRank": 131
      },
      {
        "rank": 132,
        "target": "54B",
        "name": "박종현",
        "school": "설악초등학교",
        "rounds": [
          280,
          280,
          301,
          317
        ],
        "total": 1178,
        "sourceRank": 132
      },
      {
        "rank": 133,
        "target": "24B",
        "name": "김현승",
        "school": "서울청량초등학교",
        "rounds": [
          271,
          275,
          310,
          321
        ],
        "total": 1177,
        "sourceRank": 133
      },
      {
        "rank": 134,
        "target": "26C",
        "name": "박정우",
        "school": "일로초등학교",
        "rounds": [
          274,
          268,
          309,
          323
        ],
        "total": 1174,
        "sourceRank": 134
      },
      {
        "rank": 135,
        "target": "23C",
        "name": "이선율",
        "school": "사천초등학교",
        "rounds": [
          267,
          280,
          302,
          323
        ],
        "total": 1172,
        "sourceRank": 135
      },
      {
        "rank": 136,
        "target": "16D",
        "name": "권순용",
        "school": "연무초등학교",
        "rounds": [
          269,
          279,
          302,
          321
        ],
        "total": 1171,
        "sourceRank": 136
      },
      {
        "rank": 137,
        "target": "21B",
        "name": "손유빈",
        "school": "삼정초등학교",
        "rounds": [
          244,
          279,
          317,
          322
        ],
        "total": 1162,
        "sourceRank": 137
      },
      {
        "rank": 138,
        "target": "65D",
        "name": "조우석",
        "school": "서울개봉초등학교",
        "rounds": [
          280,
          272,
          308,
          300
        ],
        "total": 1160,
        "sourceRank": 138
      },
      {
        "rank": 139,
        "target": "54D",
        "name": "정연오",
        "school": "서울인헌초등학교",
        "rounds": [
          273,
          270,
          290,
          322
        ],
        "total": 1155,
        "sourceRank": 139
      },
      {
        "rank": 140,
        "target": "25C",
        "name": "김단우",
        "school": "일로초등학교",
        "rounds": [
          241,
          282,
          306,
          315
        ],
        "total": 1144,
        "sourceRank": 140
      },
      {
        "rank": 140,
        "target": "34B",
        "name": "전수현",
        "school": "홍남초등학교",
        "rounds": [
          257,
          264,
          303,
          320
        ],
        "total": 1144,
        "sourceRank": 140
      },
      {
        "rank": 140,
        "target": "18B",
        "name": "배준수",
        "school": "삼정초등학교",
        "rounds": [
          248,
          267,
          311,
          318
        ],
        "total": 1144,
        "sourceRank": 140
      },
      {
        "rank": 143,
        "target": "63D",
        "name": "배단우",
        "school": "서울개봉초등학교",
        "rounds": [
          246,
          270,
          311,
          316
        ],
        "total": 1143,
        "sourceRank": 143
      },
      {
        "rank": 144,
        "target": "64D",
        "name": "정진서",
        "school": "서울개봉초등학교",
        "rounds": [
          255,
          261,
          309,
          317
        ],
        "total": 1142,
        "sourceRank": 144
      },
      {
        "rank": 145,
        "target": "11C",
        "name": "장하랑",
        "school": "용암초등학교",
        "rounds": [
          243,
          274,
          305,
          318
        ],
        "total": 1140,
        "sourceRank": 145
      },
      {
        "rank": 146,
        "target": "28A",
        "name": "박주혁",
        "school": "전주기린초등학교",
        "rounds": [
          261,
          257,
          307,
          311
        ],
        "total": 1136,
        "sourceRank": 146
      },
      {
        "rank": 147,
        "target": "59C",
        "name": "정민혁",
        "school": "오창초등학교",
        "rounds": [
          248,
          259,
          301,
          324
        ],
        "total": 1132,
        "sourceRank": 147
      },
      {
        "rank": 148,
        "target": "44A",
        "name": "신명교",
        "school": "서울북가좌초등학교",
        "rounds": [
          268,
          273,
          274,
          316
        ],
        "total": 1131,
        "sourceRank": 148
      },
      {
        "rank": 149,
        "target": "35B",
        "name": "이효준",
        "school": "홍남초등학교",
        "rounds": [
          244,
          263,
          282,
          306
        ],
        "total": 1095,
        "sourceRank": 149
      },
      {
        "rank": 150,
        "target": "24C",
        "name": "황준서",
        "school": "사천초등학교",
        "rounds": [
          274,
          286,
          257,
          276
        ],
        "total": 1093,
        "sourceRank": 150
      },
      {
        "rank": 151,
        "target": "49D",
        "name": "박준우",
        "school": "문산초등학교",
        "rounds": [
          239,
          257,
          274,
          314
        ],
        "total": 1084,
        "sourceRank": 151
      },
      {
        "rank": 152,
        "target": "59B",
        "name": "이시헌",
        "school": "염주초등학교",
        "rounds": [
          240,
          245,
          291,
          267
        ],
        "total": 1043,
        "sourceRank": 152
      },
      {
        "rank": 153,
        "target": "64C",
        "name": "이승민",
        "school": "경산서부초등학교",
        "rounds": [
          199,
          237,
          291,
          315
        ],
        "total": 1042,
        "sourceRank": 153
      },
      {
        "rank": 154,
        "target": "36C",
        "name": "류도원",
        "school": "괴산명덕초등학교",
        "rounds": [
          220,
          216,
          261,
          300
        ],
        "total": 997,
        "sourceRank": 154
      },
      {
        "rank": 155,
        "target": "43B",
        "name": "김수인",
        "school": "천곡초등학교",
        "rounds": [
          209,
          236,
          244,
          279
        ],
        "total": 968,
        "sourceRank": 155
      },
      {
        "rank": 156,
        "target": "13A",
        "name": "이시완",
        "school": "대구송현초등학교",
        "rounds": [
          250,
          226,
          236,
          234
        ],
        "total": 946,
        "sourceRank": 156
      },
      {
        "rank": 156,
        "target": "23B",
        "name": "강한민",
        "school": "서울청량초등학교",
        "rounds": [
          229,
          185,
          257,
          275
        ],
        "total": 946,
        "sourceRank": 156
      },
      {
        "rank": 158,
        "target": "41B",
        "name": "우철민",
        "school": "제주양궁클럽",
        "rounds": [
          186,
          191,
          239,
          276
        ],
        "total": 892,
        "sourceRank": 158
      },
      {
        "rank": 159,
        "target": "45B",
        "name": "김민결",
        "school": "천곡초등학교",
        "rounds": [
          182,
          186,
          243,
          271
        ],
        "total": 882,
        "sourceRank": 159
      },
      {
        "rank": 160,
        "target": "58C",
        "name": "장민수",
        "school": "오창초등학교",
        "rounds": [
          152,
          212,
          195,
          277
        ],
        "total": 836,
        "sourceRank": 160
      },
      {
        "rank": 161,
        "target": "35A",
        "name": "고태환",
        "school": "성진초등학교",
        "rounds": [
          164,
          202,
          162,
          244
        ],
        "total": 772,
        "sourceRank": 161
      },
      {
        "rank": 162,
        "target": "38A",
        "name": "임정우",
        "school": "성진초등학교",
        "rounds": [
          138,
          152,
          206,
          222
        ],
        "total": 718,
        "sourceRank": 162
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar01m011q",
    "sheetLabel": "남자 리커브 초등부 U-12(5~6학년) 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "초등부(저학년)",
    "rankingGroup": "초등부(저학년)",
    "distances": [
      35,
      30,
      25,
      20
    ],
    "rows": [
      {
        "rank": 1,
        "target": "30D",
        "name": "김태리",
        "school": "김포하성초등학교",
        "rounds": [
          310,
          332,
          329,
          349
        ],
        "total": 1320,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "25B",
        "name": "이슬기",
        "school": "홍남초등학교",
        "rounds": [
          314,
          324,
          331,
          349
        ],
        "total": 1318,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "48C",
        "name": "정별하",
        "school": "용암초등학교",
        "rounds": [
          300,
          319,
          335,
          344
        ],
        "total": 1298,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "6B",
        "name": "황리우",
        "school": "하남천현초등학교",
        "rounds": [
          302,
          322,
          326,
          347
        ],
        "total": 1297,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "14D",
        "name": "신유나",
        "school": "대구송현초등학교",
        "rounds": [
          311,
          327,
          323,
          334
        ],
        "total": 1295,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "37B",
        "name": "박교금",
        "school": "예천동부초등학교",
        "rounds": [
          298,
          319,
          337,
          335
        ],
        "total": 1289,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "28A",
        "name": "정지우",
        "school": "노암초등학교",
        "rounds": [
          279,
          304,
          319,
          339
        ],
        "total": 1241,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "34D",
        "name": "조아인",
        "school": "대전태평초등학교",
        "rounds": [
          274,
          311,
          317,
          334
        ],
        "total": 1236,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "34A",
        "name": "김라하",
        "school": "인천용현남초등학교",
        "rounds": [
          268,
          307,
          322,
          336
        ],
        "total": 1233,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "47C",
        "name": "박현지",
        "school": "용암초등학교",
        "rounds": [
          270,
          295,
          325,
          333
        ],
        "total": 1223,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "26B",
        "name": "권도희",
        "school": "홍남초등학교",
        "rounds": [
          283,
          299,
          313,
          327
        ],
        "total": 1222,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "41D",
        "name": "김예은",
        "school": "서울인헌초등학교",
        "rounds": [
          280,
          296,
          318,
          325
        ],
        "total": 1219,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "5B",
        "name": "곽예린",
        "school": "대구문성초등학교",
        "rounds": [
          271,
          298,
          318,
          323
        ],
        "total": 1210,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "10C",
        "name": "정은우",
        "school": "대구동부초등학교",
        "rounds": [
          289,
          275,
          320,
          318
        ],
        "total": 1202,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "38C",
        "name": "방다은",
        "school": "밀주초등학교",
        "rounds": [
          275,
          292,
          320,
          310
        ],
        "total": 1197,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "41C",
        "name": "강민서",
        "school": "여흥초등학교",
        "rounds": [
          277,
          301,
          301,
          315
        ],
        "total": 1194,
        "sourceRank": 16
      },
      {
        "rank": 17,
        "target": "35C",
        "name": "장채희",
        "school": "신계초등학교",
        "rounds": [
          245,
          296,
          302,
          329
        ],
        "total": 1172,
        "sourceRank": 17
      },
      {
        "rank": 18,
        "target": "30B",
        "name": "최윤슬",
        "school": "염주초등학교",
        "rounds": [
          249,
          285,
          321,
          309
        ],
        "total": 1164,
        "sourceRank": 18
      },
      {
        "rank": 19,
        "target": "15A",
        "name": "안채이",
        "school": "정평초등학교",
        "rounds": [
          243,
          288,
          302,
          323
        ],
        "total": 1156,
        "sourceRank": 19
      },
      {
        "rank": 20,
        "target": "36A",
        "name": "유연선",
        "school": "인천용현남초등학교",
        "rounds": [
          262,
          265,
          310,
          317
        ],
        "total": 1154,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "62D",
        "name": "김예서",
        "school": "설악초등학교",
        "rounds": [
          242,
          265,
          317,
          324
        ],
        "total": 1148,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "32A",
        "name": "이지윤",
        "school": "노암초등학교",
        "rounds": [
          252,
          275,
          305,
          315
        ],
        "total": 1147,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "35A",
        "name": "김다은",
        "school": "인천용현남초등학교",
        "rounds": [
          249,
          268,
          301,
          323
        ],
        "total": 1141,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "37C",
        "name": "강다영",
        "school": "태서초등학교",
        "rounds": [
          266,
          275,
          289,
          308
        ],
        "total": 1138,
        "sourceRank": 24
      },
      {
        "rank": 25,
        "target": "43C",
        "name": "백수연",
        "school": "여흥초등학교",
        "rounds": [
          260,
          259,
          304,
          314
        ],
        "total": 1137,
        "sourceRank": 25
      },
      {
        "rank": 26,
        "target": "49D",
        "name": "김태림",
        "school": "두암초등학교",
        "rounds": [
          229,
          282,
          303,
          322
        ],
        "total": 1136,
        "sourceRank": 26
      },
      {
        "rank": 27,
        "target": "11C",
        "name": "김하윤",
        "school": "대구동부초등학교",
        "rounds": [
          237,
          269,
          300,
          324
        ],
        "total": 1130,
        "sourceRank": 27
      },
      {
        "rank": 28,
        "target": "21B",
        "name": "박다은",
        "school": "용성초등학교",
        "rounds": [
          238,
          266,
          298,
          326
        ],
        "total": 1128,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "12C",
        "name": "문채린",
        "school": "대구동부초등학교",
        "rounds": [
          244,
          258,
          300,
          320
        ],
        "total": 1122,
        "sourceRank": 29
      },
      {
        "rank": 30,
        "target": "42C",
        "name": "원율",
        "school": "여흥초등학교",
        "rounds": [
          242,
          273,
          291,
          314
        ],
        "total": 1120,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "42D",
        "name": "황율희",
        "school": "서울인헌초등학교",
        "rounds": [
          241,
          273,
          285,
          321
        ],
        "total": 1120,
        "sourceRank": 30
      },
      {
        "rank": 32,
        "target": "65B",
        "name": "박하은",
        "school": "대구황금초등학교",
        "rounds": [
          247,
          282,
          277,
          311
        ],
        "total": 1117,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "55C",
        "name": "김다솜",
        "school": "반곡초등학교",
        "rounds": [
          213,
          286,
          304,
          307
        ],
        "total": 1110,
        "sourceRank": 33
      },
      {
        "rank": 34,
        "target": "31D",
        "name": "조예늘",
        "school": "김포하성초등학교",
        "rounds": [
          222,
          269,
          299,
          315
        ],
        "total": 1105,
        "sourceRank": 34
      },
      {
        "rank": 35,
        "target": "54C",
        "name": "이민주",
        "school": "반곡초등학교",
        "rounds": [
          234,
          269,
          288,
          313
        ],
        "total": 1104,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "17A",
        "name": "전하늘",
        "school": "병천초등학교",
        "rounds": [
          205,
          276,
          305,
          304
        ],
        "total": 1090,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "44C",
        "name": "윤이진",
        "school": "여흥초등학교",
        "rounds": [
          237,
          242,
          294,
          314
        ],
        "total": 1087,
        "sourceRank": 37
      },
      {
        "rank": 38,
        "target": "27B",
        "name": "이가은",
        "school": "홍남초등학교",
        "rounds": [
          240,
          274,
          273,
          290
        ],
        "total": 1077,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "65D",
        "name": "김도연",
        "school": "대평초등학교",
        "rounds": [
          238,
          244,
          279,
          306
        ],
        "total": 1067,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "22B",
        "name": "김하은",
        "school": "용성초등학교",
        "rounds": [
          245,
          267,
          261,
          279
        ],
        "total": 1052,
        "sourceRank": 40
      },
      {
        "rank": 41,
        "target": "44B",
        "name": "김누리",
        "school": "대구대덕초등학교",
        "rounds": [
          233,
          236,
          272,
          304
        ],
        "total": 1045,
        "sourceRank": 41
      },
      {
        "rank": 42,
        "target": "46A",
        "name": "김소민",
        "school": "강남초등학교",
        "rounds": [
          214,
          249,
          280,
          296
        ],
        "total": 1039,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "31A",
        "name": "성다원",
        "school": "노암초등학교",
        "rounds": [
          168,
          217,
          290,
          306
        ],
        "total": 981,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "63D",
        "name": "이하림",
        "school": "설악초등학교",
        "rounds": [
          185,
          243,
          242,
          236
        ],
        "total": 906,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "43D",
        "name": "박주은",
        "school": "서울인헌초등학교",
        "rounds": [
          218,
          179,
          175,
          179
        ],
        "total": 751,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "59C",
        "name": "이주빈",
        "school": "이원초등학교",
        "rounds": [
          0,
          0,
          216,
          239
        ],
        "total": 455,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "38D",
        "name": "김아란",
        "school": "문산초등학교",
        "rounds": [
          0,
          0,
          131,
          258
        ],
        "total": 389,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "18C",
        "name": "임하린",
        "school": "서울청량초등학교",
        "rounds": [
          0,
          0,
          150,
          229
        ],
        "total": 379,
        "sourceRank": 48
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar01w010q",
    "sheetLabel": "여자 리커브 초등부 U-10(1~4학년) 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "초등부(고학년)",
    "rankingGroup": "초등부(고학년)",
    "distances": [
      35,
      30,
      25,
      20
    ],
    "rows": [
      {
        "rank": 1,
        "target": "55A",
        "name": "이지나",
        "school": "인천갈월초등학교",
        "rounds": [
          339,
          351,
          353,
          359
        ],
        "total": 1402,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "5A",
        "name": "조민경",
        "school": "촉석초등학교",
        "rounds": [
          331,
          345,
          357,
          354
        ],
        "total": 1387,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "25D",
        "name": "조유나",
        "school": "김포하성초등학교",
        "rounds": [
          333,
          343,
          352,
          357
        ],
        "total": 1385,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "11A",
        "name": "이세림",
        "school": "정평초등학교",
        "rounds": [
          338,
          342,
          349,
          355
        ],
        "total": 1384,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "56A",
        "name": "이지우",
        "school": "인천갈월초등학교",
        "rounds": [
          331,
          343,
          351,
          357
        ],
        "total": 1382,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "26D",
        "name": "전다온",
        "school": "김포하성초등학교",
        "rounds": [
          330,
          340,
          350,
          353
        ],
        "total": 1373,
        "sourceRank": 6
      },
      {
        "rank": 6,
        "target": "61C",
        "name": "김지윤",
        "school": "유촌초등학교",
        "rounds": [
          338,
          338,
          344,
          353
        ],
        "total": 1373,
        "sourceRank": 6
      },
      {
        "rank": 8,
        "target": "4D",
        "name": "김수빈",
        "school": "주몽양궁클럽(동)",
        "rounds": [
          334,
          343,
          347,
          346
        ],
        "total": 1370,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "33D",
        "name": "신서연",
        "school": "대전태평초등학교",
        "rounds": [
          328,
          339,
          350,
          351
        ],
        "total": 1368,
        "sourceRank": 9
      },
      {
        "rank": 9,
        "target": "22A",
        "name": "김유민",
        "school": "대전서부초등학교",
        "rounds": [
          330,
          331,
          347,
          360
        ],
        "total": 1368,
        "sourceRank": 9
      },
      {
        "rank": 11,
        "target": "27D",
        "name": "원서아",
        "school": "김포하성초등학교",
        "rounds": [
          325,
          337,
          348,
          355
        ],
        "total": 1365,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "8D",
        "name": "강연지",
        "school": "송정초등학교",
        "rounds": [
          323,
          338,
          349,
          354
        ],
        "total": 1364,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "22C",
        "name": "김지율",
        "school": "전주신동초등학교",
        "rounds": [
          321,
          342,
          346,
          354
        ],
        "total": 1363,
        "sourceRank": 13
      },
      {
        "rank": 13,
        "target": "53D",
        "name": "최진솔",
        "school": "대구덕인초등학교",
        "rounds": [
          322,
          337,
          347,
          357
        ],
        "total": 1363,
        "sourceRank": 13
      },
      {
        "rank": 15,
        "target": "56B",
        "name": "천은우",
        "school": "진해중앙초등학교",
        "rounds": [
          337,
          335,
          341,
          349
        ],
        "total": 1362,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "12A",
        "name": "한세영",
        "school": "정평초등학교",
        "rounds": [
          330,
          333,
          345,
          352
        ],
        "total": 1360,
        "sourceRank": 16
      },
      {
        "rank": 16,
        "target": "10A",
        "name": "나유주",
        "school": "정평초등학교",
        "rounds": [
          325,
          339,
          348,
          348
        ],
        "total": 1360,
        "sourceRank": 16
      },
      {
        "rank": 16,
        "target": "5C",
        "name": "임서윤",
        "school": "서울방이초등학교",
        "rounds": [
          320,
          336,
          350,
          354
        ],
        "total": 1360,
        "sourceRank": 16
      },
      {
        "rank": 19,
        "target": "40C",
        "name": "송서현",
        "school": "밀주초등학교",
        "rounds": [
          319,
          341,
          343,
          351
        ],
        "total": 1354,
        "sourceRank": 19
      },
      {
        "rank": 20,
        "target": "7C",
        "name": "남유주",
        "school": "서울방이초등학교",
        "rounds": [
          334,
          320,
          350,
          349
        ],
        "total": 1353,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "52D",
        "name": "김윤설",
        "school": "계림초등학교",
        "rounds": [
          325,
          321,
          353,
          352
        ],
        "total": 1351,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "34B",
        "name": "김지율",
        "school": "예천동부초등학교",
        "rounds": [
          322,
          324,
          349,
          354
        ],
        "total": 1349,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "20D",
        "name": "김도희",
        "school": "원미초등학교",
        "rounds": [
          320,
          329,
          343,
          356
        ],
        "total": 1348,
        "sourceRank": 23
      },
      {
        "rank": 23,
        "target": "60C",
        "name": "윤혜원",
        "school": "유촌초등학교",
        "rounds": [
          327,
          334,
          344,
          343
        ],
        "total": 1348,
        "sourceRank": 23
      },
      {
        "rank": 25,
        "target": "61A",
        "name": "정예림",
        "school": "서울신학초등학교",
        "rounds": [
          322,
          334,
          341,
          349
        ],
        "total": 1346,
        "sourceRank": 25
      },
      {
        "rank": 26,
        "target": "33A",
        "name": "김민희",
        "school": "인천용현남초등학교",
        "rounds": [
          313,
          324,
          352,
          355
        ],
        "total": 1344,
        "sourceRank": 26
      },
      {
        "rank": 26,
        "target": "58B",
        "name": "김시아",
        "school": "진해중앙초등학교",
        "rounds": [
          311,
          339,
          343,
          351
        ],
        "total": 1344,
        "sourceRank": 26
      },
      {
        "rank": 28,
        "target": "21D",
        "name": "최준희",
        "school": "원미초등학교",
        "rounds": [
          309,
          341,
          342,
          350
        ],
        "total": 1342,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "50C",
        "name": "조윤주",
        "school": "반곡초등학교",
        "rounds": [
          325,
          324,
          337,
          352
        ],
        "total": 1338,
        "sourceRank": 29
      },
      {
        "rank": 30,
        "target": "6A",
        "name": "윤지후",
        "school": "촉석초등학교",
        "rounds": [
          315,
          336,
          343,
          343
        ],
        "total": 1337,
        "sourceRank": 30
      },
      {
        "rank": 31,
        "target": "33C",
        "name": "남예온",
        "school": "신계초등학교",
        "rounds": [
          315,
          322,
          344,
          355
        ],
        "total": 1336,
        "sourceRank": 31
      },
      {
        "rank": 32,
        "target": "8A",
        "name": "김세령",
        "school": "촉석초등학교",
        "rounds": [
          324,
          332,
          335,
          342
        ],
        "total": 1333,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "33B",
        "name": "김혜진",
        "school": "예천동부초등학교",
        "rounds": [
          319,
          321,
          344,
          348
        ],
        "total": 1332,
        "sourceRank": 33
      },
      {
        "rank": 34,
        "target": "50D",
        "name": "이시연",
        "school": "대미초등학교",
        "rounds": [
          309,
          325,
          347,
          350
        ],
        "total": 1331,
        "sourceRank": 34
      },
      {
        "rank": 34,
        "target": "57B",
        "name": "박수빈",
        "school": "진해중앙초등학교",
        "rounds": [
          319,
          327,
          343,
          342
        ],
        "total": 1331,
        "sourceRank": 34
      },
      {
        "rank": 36,
        "target": "19B",
        "name": "함주하",
        "school": "용성초등학교",
        "rounds": [
          312,
          326,
          344,
          348
        ],
        "total": 1330,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "9C",
        "name": "송도연",
        "school": "대구동부초등학교",
        "rounds": [
          323,
          320,
          343,
          343
        ],
        "total": 1329,
        "sourceRank": 37
      },
      {
        "rank": 37,
        "target": "52B",
        "name": "손지우",
        "school": "새일초등학교",
        "rounds": [
          334,
          328,
          326,
          341
        ],
        "total": 1329,
        "sourceRank": 37
      },
      {
        "rank": 39,
        "target": "9A",
        "name": "배주원",
        "school": "촉석초등학교",
        "rounds": [
          303,
          339,
          337,
          348
        ],
        "total": 1327,
        "sourceRank": 39
      },
      {
        "rank": 39,
        "target": "46B",
        "name": "이채윤",
        "school": "모덕초등학교",
        "rounds": [
          314,
          325,
          339,
          349
        ],
        "total": 1327,
        "sourceRank": 39
      },
      {
        "rank": 41,
        "target": "10D",
        "name": "신서윤",
        "school": "송정초등학교",
        "rounds": [
          291,
          339,
          344,
          352
        ],
        "total": 1326,
        "sourceRank": 41
      },
      {
        "rank": 41,
        "target": "59B",
        "name": "이유민",
        "school": "진해중앙초등학교",
        "rounds": [
          320,
          326,
          337,
          343
        ],
        "total": 1326,
        "sourceRank": 41
      },
      {
        "rank": 41,
        "target": "46D",
        "name": "고채나",
        "school": "인천서면초등학교",
        "rounds": [
          318,
          333,
          332,
          343
        ],
        "total": 1326,
        "sourceRank": 41
      },
      {
        "rank": 44,
        "target": "35B",
        "name": "한소희",
        "school": "예천동부초등학교",
        "rounds": [
          314,
          329,
          334,
          348
        ],
        "total": 1325,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "11D",
        "name": "김서윤",
        "school": "송정초등학교",
        "rounds": [
          311,
          325,
          337,
          351
        ],
        "total": 1324,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "4B",
        "name": "허선율",
        "school": "대구문성초등학교",
        "rounds": [
          313,
          321,
          342,
          346
        ],
        "total": 1322,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "51C",
        "name": "김서율",
        "school": "반곡초등학교",
        "rounds": [
          300,
          336,
          344,
          341
        ],
        "total": 1321,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "19C",
        "name": "김서율",
        "school": "전주신동초등학교",
        "rounds": [
          316,
          319,
          342,
          341
        ],
        "total": 1318,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "19A",
        "name": "고은아",
        "school": "순천성남초등학교",
        "rounds": [
          316,
          332,
          326,
          343
        ],
        "total": 1317,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "4A",
        "name": "이세은",
        "school": "촉석초등학교",
        "rounds": [
          311,
          314,
          335,
          356
        ],
        "total": 1316,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "59D",
        "name": "김규리",
        "school": "오창초등학교",
        "rounds": [
          306,
          324,
          339,
          347
        ],
        "total": 1316,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "62A",
        "name": "윤시아",
        "school": "서울신학초등학교",
        "rounds": [
          315,
          336,
          325,
          340
        ],
        "total": 1316,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "21A",
        "name": "정서우",
        "school": "대전서부초등학교",
        "rounds": [
          317,
          325,
          331,
          343
        ],
        "total": 1316,
        "sourceRank": 50
      },
      {
        "rank": 54,
        "target": "58C",
        "name": "이혜진",
        "school": "이원초등학교",
        "rounds": [
          307,
          326,
          337,
          345
        ],
        "total": 1315,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "54A",
        "name": "신다은",
        "school": "인천갈월초등학교",
        "rounds": [
          313,
          332,
          326,
          343
        ],
        "total": 1314,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "36B",
        "name": "최지원",
        "school": "예천동부초등학교",
        "rounds": [
          307,
          327,
          335,
          343
        ],
        "total": 1312,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "53B",
        "name": "연하린",
        "school": "새일초등학교",
        "rounds": [
          320,
          318,
          334,
          340
        ],
        "total": 1312,
        "sourceRank": 56
      },
      {
        "rank": 58,
        "target": "27A",
        "name": "이도혜",
        "school": "노암초등학교",
        "rounds": [
          310,
          323,
          333,
          345
        ],
        "total": 1311,
        "sourceRank": 58
      },
      {
        "rank": 58,
        "target": "58A",
        "name": "정세영",
        "school": "인천갈월초등학교",
        "rounds": [
          310,
          332,
          330,
          339
        ],
        "total": 1311,
        "sourceRank": 58
      },
      {
        "rank": 60,
        "target": "16A",
        "name": "안예빈",
        "school": "병천초등학교",
        "rounds": [
          308,
          331,
          331,
          340
        ],
        "total": 1310,
        "sourceRank": 60
      },
      {
        "rank": 60,
        "target": "13A",
        "name": "정하민",
        "school": "정평초등학교",
        "rounds": [
          311,
          325,
          335,
          339
        ],
        "total": 1310,
        "sourceRank": 60
      },
      {
        "rank": 62,
        "target": "28D",
        "name": "한윤서",
        "school": "김포하성초등학교",
        "rounds": [
          295,
          330,
          343,
          341
        ],
        "total": 1309,
        "sourceRank": 62
      },
      {
        "rank": 63,
        "target": "51A",
        "name": "이유빈",
        "school": "서울개봉초등학교",
        "rounds": [
          318,
          317,
          327,
          346
        ],
        "total": 1308,
        "sourceRank": 63
      },
      {
        "rank": 63,
        "target": "60B",
        "name": "노유림",
        "school": "대구황금초등학교",
        "rounds": [
          298,
          328,
          339,
          343
        ],
        "total": 1308,
        "sourceRank": 63
      },
      {
        "rank": 65,
        "target": "54D",
        "name": "김민정",
        "school": "대구덕인초등학교",
        "rounds": [
          306,
          319,
          332,
          350
        ],
        "total": 1307,
        "sourceRank": 65
      },
      {
        "rank": 65,
        "target": "57A",
        "name": "김사랑",
        "school": "인천갈월초등학교",
        "rounds": [
          311,
          321,
          332,
          343
        ],
        "total": 1307,
        "sourceRank": 65
      },
      {
        "rank": 67,
        "target": "38B",
        "name": "배수빈",
        "school": "예천동부초등학교",
        "rounds": [
          311,
          334,
          325,
          336
        ],
        "total": 1306,
        "sourceRank": 67
      },
      {
        "rank": 67,
        "target": "48B",
        "name": "손하음",
        "school": "타겟28(동)",
        "rounds": [
          317,
          319,
          329,
          341
        ],
        "total": 1306,
        "sourceRank": 67
      },
      {
        "rank": 67,
        "target": "24B",
        "name": "김선율",
        "school": "홍남초등학교",
        "rounds": [
          321,
          322,
          326,
          337
        ],
        "total": 1306,
        "sourceRank": 67
      },
      {
        "rank": 70,
        "target": "61B",
        "name": "최소윤",
        "school": "대구황금초등학교",
        "rounds": [
          301,
          322,
          336,
          345
        ],
        "total": 1304,
        "sourceRank": 70
      },
      {
        "rank": 70,
        "target": "18D",
        "name": "김서현",
        "school": "천곡초등학교",
        "rounds": [
          309,
          321,
          329,
          345
        ],
        "total": 1304,
        "sourceRank": 70
      },
      {
        "rank": 72,
        "target": "45D",
        "name": "이다은",
        "school": "인천서면초등학교",
        "rounds": [
          309,
          314,
          343,
          337
        ],
        "total": 1303,
        "sourceRank": 72
      },
      {
        "rank": 72,
        "target": "24A",
        "name": "송하랑",
        "school": "대전서부초등학교",
        "rounds": [
          313,
          313,
          336,
          341
        ],
        "total": 1303,
        "sourceRank": 72
      },
      {
        "rank": 74,
        "target": "6D",
        "name": "김태연",
        "school": "송정초등학교",
        "rounds": [
          306,
          319,
          334,
          343
        ],
        "total": 1302,
        "sourceRank": 74
      },
      {
        "rank": 75,
        "target": "29B",
        "name": "김현아",
        "school": "염주초등학교",
        "rounds": [
          309,
          324,
          329,
          337
        ],
        "total": 1299,
        "sourceRank": 75
      },
      {
        "rank": 76,
        "target": "15D",
        "name": "이서진",
        "school": "대구송현초등학교",
        "rounds": [
          291,
          332,
          325,
          350
        ],
        "total": 1298,
        "sourceRank": 76
      },
      {
        "rank": 77,
        "target": "40B",
        "name": "김빛나",
        "school": "대구대덕초등학교",
        "rounds": [
          299,
          323,
          330,
          345
        ],
        "total": 1297,
        "sourceRank": 77
      },
      {
        "rank": 78,
        "target": "24C",
        "name": "신재이",
        "school": "전주신동초등학교",
        "rounds": [
          301,
          317,
          335,
          343
        ],
        "total": 1296,
        "sourceRank": 78
      },
      {
        "rank": 78,
        "target": "22D",
        "name": "곽나영",
        "school": "원미초등학교",
        "rounds": [
          311,
          314,
          333,
          338
        ],
        "total": 1296,
        "sourceRank": 78
      },
      {
        "rank": 80,
        "target": "16D",
        "name": "김봄",
        "school": "천곡초등학교",
        "rounds": [
          298,
          324,
          339,
          334
        ],
        "total": 1295,
        "sourceRank": 80
      },
      {
        "rank": 80,
        "target": "51B",
        "name": "김민서",
        "school": "송해초등학교",
        "rounds": [
          311,
          318,
          329,
          337
        ],
        "total": 1295,
        "sourceRank": 80
      },
      {
        "rank": 82,
        "target": "11B",
        "name": "장하연",
        "school": "일로초등학교",
        "rounds": [
          308,
          315,
          336,
          334
        ],
        "total": 1293,
        "sourceRank": 82
      },
      {
        "rank": 82,
        "target": "14A",
        "name": "김지율",
        "school": "정평초등학교",
        "rounds": [
          304,
          319,
          333,
          337
        ],
        "total": 1293,
        "sourceRank": 82
      },
      {
        "rank": 84,
        "target": "44D",
        "name": "박다영",
        "school": "인천서면초등학교",
        "rounds": [
          300,
          317,
          331,
          343
        ],
        "total": 1291,
        "sourceRank": 84
      },
      {
        "rank": 84,
        "target": "53A",
        "name": "류다미",
        "school": "인천갈월초등학교",
        "rounds": [
          314,
          303,
          324,
          350
        ],
        "total": 1291,
        "sourceRank": 84
      },
      {
        "rank": 86,
        "target": "34C",
        "name": "표하린",
        "school": "신계초등학교",
        "rounds": [
          300,
          323,
          329,
          337
        ],
        "total": 1289,
        "sourceRank": 86
      },
      {
        "rank": 86,
        "target": "60D",
        "name": "강다은",
        "school": "오창초등학교",
        "rounds": [
          301,
          313,
          333,
          342
        ],
        "total": 1289,
        "sourceRank": 86
      },
      {
        "rank": 88,
        "target": "7D",
        "name": "이다연",
        "school": "송정초등학교",
        "rounds": [
          290,
          317,
          327,
          354
        ],
        "total": 1288,
        "sourceRank": 88
      },
      {
        "rank": 88,
        "target": "7A",
        "name": "김민서",
        "school": "촉석초등학교",
        "rounds": [
          302,
          323,
          322,
          341
        ],
        "total": 1288,
        "sourceRank": 88
      },
      {
        "rank": 90,
        "target": "14C",
        "name": "김아린",
        "school": "서울청량초등학교",
        "rounds": [
          290,
          314,
          337,
          345
        ],
        "total": 1286,
        "sourceRank": 90
      },
      {
        "rank": 91,
        "target": "39D",
        "name": "이서윤",
        "school": "서울인헌초등학교",
        "rounds": [
          308,
          306,
          328,
          341
        ],
        "total": 1283,
        "sourceRank": 91
      },
      {
        "rank": 92,
        "target": "59A",
        "name": "유하은",
        "school": "인천갈월초등학교",
        "rounds": [
          299,
          319,
          324,
          340
        ],
        "total": 1282,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "56D",
        "name": "김리엘",
        "school": "서울북가좌초등학교",
        "rounds": [
          308,
          305,
          333,
          336
        ],
        "total": 1282,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "51D",
        "name": "김상희",
        "school": "계림초등학교",
        "rounds": [
          300,
          312,
          329,
          341
        ],
        "total": 1282,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "55B",
        "name": "진리안",
        "school": "진해중앙초등학교",
        "rounds": [
          304,
          309,
          332,
          337
        ],
        "total": 1282,
        "sourceRank": 92
      },
      {
        "rank": 96,
        "target": "8C",
        "name": "이해음",
        "school": "임실군양궁스포츠클럽(동)",
        "rounds": [
          309,
          324,
          320,
          327
        ],
        "total": 1280,
        "sourceRank": 96
      },
      {
        "rank": 96,
        "target": "9D",
        "name": "강라율",
        "school": "송정초등학교",
        "rounds": [
          304,
          307,
          330,
          339
        ],
        "total": 1280,
        "sourceRank": 96
      },
      {
        "rank": 98,
        "target": "4C",
        "name": "유주하",
        "school": "서울방이초등학교",
        "rounds": [
          298,
          309,
          332,
          340
        ],
        "total": 1279,
        "sourceRank": 98
      },
      {
        "rank": 99,
        "target": "60A",
        "name": "김리하",
        "school": "서울신학초등학교",
        "rounds": [
          288,
          323,
          324,
          341
        ],
        "total": 1276,
        "sourceRank": 99
      },
      {
        "rank": 99,
        "target": "63A",
        "name": "김희원",
        "school": "서울신학초등학교",
        "rounds": [
          307,
          314,
          324,
          331
        ],
        "total": 1276,
        "sourceRank": 99
      },
      {
        "rank": 101,
        "target": "25C",
        "name": "안서린",
        "school": "전주신동초등학교",
        "rounds": [
          287,
          325,
          334,
          326
        ],
        "total": 1272,
        "sourceRank": 101
      },
      {
        "rank": 101,
        "target": "6C",
        "name": "김연진",
        "school": "서울방이초등학교",
        "rounds": [
          287,
          318,
          332,
          335
        ],
        "total": 1272,
        "sourceRank": 101
      },
      {
        "rank": 103,
        "target": "17D",
        "name": "안도은",
        "school": "천곡초등학교",
        "rounds": [
          309,
          296,
          331,
          334
        ],
        "total": 1270,
        "sourceRank": 103
      },
      {
        "rank": 103,
        "target": "63C",
        "name": "정세윤",
        "school": "유촌초등학교",
        "rounds": [
          308,
          319,
          316,
          327
        ],
        "total": 1270,
        "sourceRank": 103
      },
      {
        "rank": 105,
        "target": "48A",
        "name": "안예담",
        "school": "대전송촌초등학교",
        "rounds": [
          294,
          313,
          326,
          336
        ],
        "total": 1269,
        "sourceRank": 105
      },
      {
        "rank": 106,
        "target": "39C",
        "name": "조유빈",
        "school": "밀주초등학교",
        "rounds": [
          301,
          315,
          324,
          327
        ],
        "total": 1267,
        "sourceRank": 106
      },
      {
        "rank": 106,
        "target": "29D",
        "name": "양시언",
        "school": "김포하성초등학교",
        "rounds": [
          300,
          316,
          321,
          330
        ],
        "total": 1267,
        "sourceRank": 106
      },
      {
        "rank": 108,
        "target": "25A",
        "name": "박하연",
        "school": "노암초등학교",
        "rounds": [
          301,
          315,
          320,
          328
        ],
        "total": 1264,
        "sourceRank": 108
      },
      {
        "rank": 109,
        "target": "45C",
        "name": "김지오",
        "school": "용암초등학교",
        "rounds": [
          292,
          313,
          318,
          339
        ],
        "total": 1262,
        "sourceRank": 109
      },
      {
        "rank": 110,
        "target": "17B",
        "name": "박서율",
        "school": "황성초등학교",
        "rounds": [
          289,
          318,
          314,
          339
        ],
        "total": 1260,
        "sourceRank": 110
      },
      {
        "rank": 110,
        "target": "44A",
        "name": "문유빈",
        "school": "강남초등학교",
        "rounds": [
          301,
          312,
          304,
          343
        ],
        "total": 1260,
        "sourceRank": 110
      },
      {
        "rank": 110,
        "target": "23A",
        "name": "조서희",
        "school": "대전서부초등학교",
        "rounds": [
          292,
          306,
          327,
          335
        ],
        "total": 1260,
        "sourceRank": 110
      },
      {
        "rank": 113,
        "target": "24D",
        "name": "오연희",
        "school": "김포하성초등학교",
        "rounds": [
          296,
          301,
          320,
          341
        ],
        "total": 1258,
        "sourceRank": 113
      },
      {
        "rank": 113,
        "target": "47B",
        "name": "김태은",
        "school": "타겟28(동)",
        "rounds": [
          299,
          310,
          321,
          328
        ],
        "total": 1258,
        "sourceRank": 113
      },
      {
        "rank": 115,
        "target": "23D",
        "name": "차유나",
        "school": "원미초등학교",
        "rounds": [
          294,
          306,
          329,
          327
        ],
        "total": 1256,
        "sourceRank": 115
      },
      {
        "rank": 116,
        "target": "35D",
        "name": "황국영",
        "school": "문산초등학교",
        "rounds": [
          301,
          297,
          321,
          335
        ],
        "total": 1254,
        "sourceRank": 116
      },
      {
        "rank": 117,
        "target": "18A",
        "name": "김루하",
        "school": "순천성남초등학교",
        "rounds": [
          287,
          303,
          331,
          332
        ],
        "total": 1253,
        "sourceRank": 117
      },
      {
        "rank": 117,
        "target": "20C",
        "name": "유연우",
        "school": "전주신동초등학교",
        "rounds": [
          291,
          307,
          317,
          338
        ],
        "total": 1253,
        "sourceRank": 117
      },
      {
        "rank": 119,
        "target": "45B",
        "name": "진혜민",
        "school": "모덕초등학교",
        "rounds": [
          281,
          311,
          325,
          335
        ],
        "total": 1252,
        "sourceRank": 119
      },
      {
        "rank": 120,
        "target": "31B",
        "name": "고윤진",
        "school": "교동초등학교",
        "rounds": [
          286,
          310,
          323,
          332
        ],
        "total": 1251,
        "sourceRank": 120
      },
      {
        "rank": 121,
        "target": "39B",
        "name": "윤지인",
        "school": "예천동부초등학교",
        "rounds": [
          295,
          302,
          324,
          328
        ],
        "total": 1249,
        "sourceRank": 121
      },
      {
        "rank": 122,
        "target": "43A",
        "name": "정지원",
        "school": "강남초등학교",
        "rounds": [
          282,
          318,
          311,
          337
        ],
        "total": 1248,
        "sourceRank": 122
      },
      {
        "rank": 122,
        "target": "16C",
        "name": "김한나",
        "school": "서울청량초등학교",
        "rounds": [
          286,
          306,
          320,
          336
        ],
        "total": 1248,
        "sourceRank": 122
      },
      {
        "rank": 124,
        "target": "53C",
        "name": "현수민",
        "school": "반곡초등학교",
        "rounds": [
          284,
          310,
          324,
          326
        ],
        "total": 1244,
        "sourceRank": 124
      },
      {
        "rank": 125,
        "target": "46C",
        "name": "함서율",
        "school": "용암초등학교",
        "rounds": [
          267,
          298,
          331,
          347
        ],
        "total": 1243,
        "sourceRank": 125
      },
      {
        "rank": 126,
        "target": "41A",
        "name": "송설아",
        "school": "강남초등학교",
        "rounds": [
          288,
          294,
          323,
          336
        ],
        "total": 1241,
        "sourceRank": 126
      },
      {
        "rank": 127,
        "target": "57C",
        "name": "진다흰",
        "school": "이원초등학교",
        "rounds": [
          285,
          288,
          323,
          344
        ],
        "total": 1240,
        "sourceRank": 127
      },
      {
        "rank": 128,
        "target": "49B",
        "name": "강하린",
        "school": "타겟28(동)",
        "rounds": [
          282,
          306,
          315,
          336
        ],
        "total": 1239,
        "sourceRank": 128
      },
      {
        "rank": 129,
        "target": "8B",
        "name": "김현아",
        "school": "일로초등학교",
        "rounds": [
          295,
          294,
          312,
          337
        ],
        "total": 1238,
        "sourceRank": 129
      },
      {
        "rank": 130,
        "target": "9B",
        "name": "안로하",
        "school": "일로초등학교",
        "rounds": [
          273,
          319,
          314,
          331
        ],
        "total": 1237,
        "sourceRank": 130
      },
      {
        "rank": 131,
        "target": "13D",
        "name": "박선유",
        "school": "송정초등학교",
        "rounds": [
          296,
          284,
          320,
          335
        ],
        "total": 1235,
        "sourceRank": 131
      },
      {
        "rank": 132,
        "target": "52C",
        "name": "장하윤",
        "school": "반곡초등학교",
        "rounds": [
          285,
          301,
          324,
          324
        ],
        "total": 1234,
        "sourceRank": 132
      },
      {
        "rank": 133,
        "target": "12D",
        "name": "박수연",
        "school": "송정초등학교",
        "rounds": [
          288,
          306,
          304,
          334
        ],
        "total": 1232,
        "sourceRank": 133
      },
      {
        "rank": 134,
        "target": "5D",
        "name": "김윤하",
        "school": "송정초등학교",
        "rounds": [
          277,
          300,
          318,
          328
        ],
        "total": 1223,
        "sourceRank": 134
      },
      {
        "rank": 135,
        "target": "37A",
        "name": "장윤설",
        "school": "덕벌초등학교",
        "rounds": [
          269,
          306,
          317,
          329
        ],
        "total": 1221,
        "sourceRank": 135
      },
      {
        "rank": 136,
        "target": "32B",
        "name": "임윤슬",
        "school": "교동초등학교",
        "rounds": [
          283,
          281,
          316,
          333
        ],
        "total": 1213,
        "sourceRank": 136
      },
      {
        "rank": 137,
        "target": "13C",
        "name": "배보미",
        "school": "서울청량초등학교",
        "rounds": [
          280,
          300,
          310,
          321
        ],
        "total": 1211,
        "sourceRank": 137
      },
      {
        "rank": 137,
        "target": "23C",
        "name": "이다연",
        "school": "전주신동초등학교",
        "rounds": [
          278,
          284,
          318,
          331
        ],
        "total": 1211,
        "sourceRank": 137
      },
      {
        "rank": 139,
        "target": "47D",
        "name": "이다은",
        "school": "두암초등학교",
        "rounds": [
          284,
          288,
          302,
          336
        ],
        "total": 1210,
        "sourceRank": 139
      },
      {
        "rank": 140,
        "target": "21C",
        "name": "송해인",
        "school": "전주신동초등학교",
        "rounds": [
          299,
          302,
          292,
          309
        ],
        "total": 1202,
        "sourceRank": 140
      },
      {
        "rank": 141,
        "target": "14B",
        "name": "김지안",
        "school": "남천초등학교",
        "rounds": [
          267,
          299,
          314,
          321
        ],
        "total": 1201,
        "sourceRank": 141
      },
      {
        "rank": 142,
        "target": "32D",
        "name": "김라윤",
        "school": "김포하성초등학교",
        "rounds": [
          268,
          298,
          305,
          328
        ],
        "total": 1199,
        "sourceRank": 142
      },
      {
        "rank": 143,
        "target": "40D",
        "name": "이시은",
        "school": "서울인헌초등학교",
        "rounds": [
          236,
          311,
          320,
          331
        ],
        "total": 1198,
        "sourceRank": 143
      },
      {
        "rank": 144,
        "target": "62C",
        "name": "박소율",
        "school": "유촌초등학교",
        "rounds": [
          269,
          294,
          321,
          311
        ],
        "total": 1195,
        "sourceRank": 144
      },
      {
        "rank": 145,
        "target": "45A",
        "name": "김주아",
        "school": "강남초등학교",
        "rounds": [
          270,
          280,
          309,
          335
        ],
        "total": 1194,
        "sourceRank": 145
      },
      {
        "rank": 146,
        "target": "13B",
        "name": "박인희",
        "school": "남천초등학교",
        "rounds": [
          246,
          286,
          316,
          337
        ],
        "total": 1185,
        "sourceRank": 146
      },
      {
        "rank": 146,
        "target": "49A",
        "name": "박다인",
        "school": "서울개봉초등학교",
        "rounds": [
          251,
          298,
          309,
          327
        ],
        "total": 1185,
        "sourceRank": 146
      },
      {
        "rank": 148,
        "target": "28B",
        "name": "강민정",
        "school": "염주초등학교",
        "rounds": [
          278,
          252,
          319,
          334
        ],
        "total": 1183,
        "sourceRank": 148
      },
      {
        "rank": 149,
        "target": "15B",
        "name": "구은령",
        "school": "황성초등학교",
        "rounds": [
          259,
          295,
          305,
          322
        ],
        "total": 1181,
        "sourceRank": 149
      },
      {
        "rank": 149,
        "target": "57D",
        "name": "이린",
        "school": "서울북가좌초등학교",
        "rounds": [
          273,
          281,
          310,
          317
        ],
        "total": 1181,
        "sourceRank": 149
      },
      {
        "rank": 151,
        "target": "55D",
        "name": "김다윤",
        "school": "대구덕인초등학교",
        "rounds": [
          265,
          284,
          297,
          334
        ],
        "total": 1180,
        "sourceRank": 151
      },
      {
        "rank": 151,
        "target": "64D",
        "name": "전이하",
        "school": "대평초등학교",
        "rounds": [
          257,
          290,
          310,
          323
        ],
        "total": 1180,
        "sourceRank": 151
      },
      {
        "rank": 153,
        "target": "54B",
        "name": "김지율",
        "school": "새일초등학교",
        "rounds": [
          250,
          293,
          303,
          333
        ],
        "total": 1179,
        "sourceRank": 153
      },
      {
        "rank": 154,
        "target": "29A",
        "name": "윤서현",
        "school": "노암초등학교",
        "rounds": [
          254,
          308,
          297,
          316
        ],
        "total": 1175,
        "sourceRank": 154
      },
      {
        "rank": 155,
        "target": "37D",
        "name": "곽가현",
        "school": "문산초등학교",
        "rounds": [
          258,
          271,
          307,
          337
        ],
        "total": 1173,
        "sourceRank": 155
      },
      {
        "rank": 156,
        "target": "52A",
        "name": "임소민",
        "school": "서울개봉초등학교",
        "rounds": [
          264,
          304,
          277,
          324
        ],
        "total": 1169,
        "sourceRank": 156
      },
      {
        "rank": 157,
        "target": "65A",
        "name": "윤봄",
        "school": "서울신학초등학교",
        "rounds": [
          252,
          280,
          302,
          332
        ],
        "total": 1166,
        "sourceRank": 157
      },
      {
        "rank": 158,
        "target": "40A",
        "name": "이희정",
        "school": "사천초등학교",
        "rounds": [
          262,
          251,
          321,
          326
        ],
        "total": 1160,
        "sourceRank": 158
      },
      {
        "rank": 159,
        "target": "47A",
        "name": "성연재",
        "school": "대전송촌초등학교",
        "rounds": [
          257,
          275,
          304,
          316
        ],
        "total": 1152,
        "sourceRank": 159
      },
      {
        "rank": 160,
        "target": "48D",
        "name": "김태희",
        "school": "두암초등학교",
        "rounds": [
          264,
          272,
          302,
          310
        ],
        "total": 1148,
        "sourceRank": 160
      },
      {
        "rank": 161,
        "target": "42B",
        "name": "정서미",
        "school": "대구대덕초등학교",
        "rounds": [
          264,
          271,
          285,
          318
        ],
        "total": 1138,
        "sourceRank": 161
      },
      {
        "rank": 162,
        "target": "7B",
        "name": "김라엘",
        "school": "일로초등학교",
        "rounds": [
          230,
          294,
          298,
          311
        ],
        "total": 1133,
        "sourceRank": 162
      },
      {
        "rank": 162,
        "target": "62B",
        "name": "정지우",
        "school": "대구황금초등학교",
        "rounds": [
          260,
          276,
          289,
          308
        ],
        "total": 1133,
        "sourceRank": 162
      },
      {
        "rank": 164,
        "target": "36C",
        "name": "김하율",
        "school": "태서초등학교",
        "rounds": [
          257,
          275,
          285,
          311
        ],
        "total": 1128,
        "sourceRank": 164
      },
      {
        "rank": 165,
        "target": "58D",
        "name": "손지희",
        "school": "서울북가좌초등학교",
        "rounds": [
          255,
          278,
          294,
          298
        ],
        "total": 1125,
        "sourceRank": 165
      },
      {
        "rank": 166,
        "target": "64C",
        "name": "양세영",
        "school": "유촌초등학교",
        "rounds": [
          225,
          289,
          287,
          318
        ],
        "total": 1119,
        "sourceRank": 166
      },
      {
        "rank": 167,
        "target": "30A",
        "name": "하다율",
        "school": "노암초등학교",
        "rounds": [
          229,
          260,
          309,
          315
        ],
        "total": 1113,
        "sourceRank": 167
      },
      {
        "rank": 168,
        "target": "41B",
        "name": "장연우",
        "school": "대구대덕초등학교",
        "rounds": [
          243,
          255,
          306,
          304
        ],
        "total": 1108,
        "sourceRank": 168
      },
      {
        "rank": 169,
        "target": "18B",
        "name": "박서현",
        "school": "황성초등학교",
        "rounds": [
          235,
          254,
          294,
          317
        ],
        "total": 1100,
        "sourceRank": 169
      },
      {
        "rank": 170,
        "target": "50A",
        "name": "김민지",
        "school": "서울개봉초등학교",
        "rounds": [
          230,
          264,
          287,
          314
        ],
        "total": 1095,
        "sourceRank": 170
      },
      {
        "rank": 171,
        "target": "15C",
        "name": "김지민",
        "school": "서울청량초등학교",
        "rounds": [
          251,
          250,
          284,
          306
        ],
        "total": 1091,
        "sourceRank": 171
      },
      {
        "rank": 172,
        "target": "49C",
        "name": "송서영",
        "school": "용암초등학교",
        "rounds": [
          207,
          276,
          290,
          314
        ],
        "total": 1087,
        "sourceRank": 172
      },
      {
        "rank": 173,
        "target": "10B",
        "name": "이다인",
        "school": "일로초등학교",
        "rounds": [
          238,
          238,
          301,
          290
        ],
        "total": 1067,
        "sourceRank": 173
      },
      {
        "rank": 173,
        "target": "19D",
        "name": "정의솔",
        "school": "천곡초등학교",
        "rounds": [
          230,
          243,
          292,
          302
        ],
        "total": 1067,
        "sourceRank": 173
      },
      {
        "rank": 175,
        "target": "63B",
        "name": "김민서",
        "school": "대구황금초등학교",
        "rounds": [
          219,
          236,
          289,
          305
        ],
        "total": 1049,
        "sourceRank": 175
      },
      {
        "rank": 176,
        "target": "65C",
        "name": "손세아",
        "school": "유촌초등학교",
        "rounds": [
          223,
          268,
          258,
          291
        ],
        "total": 1040,
        "sourceRank": 176
      },
      {
        "rank": 177,
        "target": "26A",
        "name": "최유주",
        "school": "노암초등학교",
        "rounds": [
          235,
          243,
          277,
          270
        ],
        "total": 1025,
        "sourceRank": 177
      },
      {
        "rank": 178,
        "target": "36D",
        "name": "민서우",
        "school": "문산초등학교",
        "rounds": [
          184,
          258,
          271,
          308
        ],
        "total": 1021,
        "sourceRank": 178
      },
      {
        "rank": 179,
        "target": "39A",
        "name": "장채원",
        "school": "사천초등학교",
        "rounds": [
          186,
          233,
          276,
          315
        ],
        "total": 1010,
        "sourceRank": 179
      },
      {
        "rank": 180,
        "target": "38A",
        "name": "정해담",
        "school": "덕벌초등학교",
        "rounds": [
          200,
          255,
          254,
          284
        ],
        "total": 993,
        "sourceRank": 180
      },
      {
        "rank": 181,
        "target": "43B",
        "name": "최예인",
        "school": "대구대덕초등학교",
        "rounds": [
          182,
          229,
          236,
          293
        ],
        "total": 940,
        "sourceRank": 181
      },
      {
        "rank": 182,
        "target": "12B",
        "name": "김이현",
        "school": "남천초등학교",
        "rounds": [
          112,
          179,
          205,
          196
        ],
        "total": 692,
        "sourceRank": 182
      },
      {
        "rank": 183,
        "target": "50B",
        "name": "이서현",
        "school": "송해초등학교",
        "rounds": [
          0,
          0,
          239,
          286
        ],
        "total": 525,
        "sourceRank": 183
      },
      {
        "rank": 184,
        "target": "23B",
        "name": "JIN SHIYAN",
        "school": "용성초등학교",
        "rounds": [
          0,
          0,
          0,
          0
        ],
        "total": 0,
        "sourceRank": 184
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar01w011q",
    "sheetLabel": "여자 리커브 초등부 U-12(5~6학년) 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "남",
    "division": "중등부",
    "rankingGroup": "중등부",
    "distances": [
      60,
      50,
      40,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "62B",
        "name": "조강민",
        "school": "순천풍덕중학교",
        "rounds": [
          337,
          335,
          348,
          357
        ],
        "total": 1377,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "25C",
        "name": "안은찬",
        "school": "성포중학교",
        "rounds": [
          348,
          331,
          340,
          354
        ],
        "total": 1373,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "38C",
        "name": "손민서",
        "school": "경북체육중학교",
        "rounds": [
          333,
          337,
          342,
          360
        ],
        "total": 1372,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "58A",
        "name": "이주완",
        "school": "원천중학교",
        "rounds": [
          338,
          330,
          346,
          352
        ],
        "total": 1366,
        "sourceRank": 4
      },
      {
        "rank": 4,
        "target": "32A",
        "name": "최윤찬",
        "school": "미리벌중학교",
        "rounds": [
          343,
          328,
          345,
          350
        ],
        "total": 1366,
        "sourceRank": 4
      },
      {
        "rank": 4,
        "target": "42A",
        "name": "서준용",
        "school": "동진중학교",
        "rounds": [
          342,
          328,
          346,
          350
        ],
        "total": 1366,
        "sourceRank": 4
      },
      {
        "rank": 7,
        "target": "18C",
        "name": "김형호",
        "school": "무거중학교",
        "rounds": [
          348,
          327,
          340,
          350
        ],
        "total": 1365,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "47C",
        "name": "황태민",
        "school": "하성중학교",
        "rounds": [
          340,
          334,
          337,
          352
        ],
        "total": 1363,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "44B",
        "name": "박규필",
        "school": "부산체육중학교",
        "rounds": [
          336,
          330,
          343,
          350
        ],
        "total": 1359,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "45B",
        "name": "김준서",
        "school": "광주체육중학교",
        "rounds": [
          339,
          323,
          339,
          353
        ],
        "total": 1354,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "12B",
        "name": "안현준",
        "school": "예천중학교",
        "rounds": [
          335,
          322,
          338,
          356
        ],
        "total": 1351,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "12A",
        "name": "이성윤",
        "school": "운리중학교",
        "rounds": [
          328,
          336,
          337,
          349
        ],
        "total": 1350,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "39C",
        "name": "이재준",
        "school": "경북체육중학교",
        "rounds": [
          328,
          334,
          340,
          347
        ],
        "total": 1349,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "50C",
        "name": "라경현",
        "school": "오수중학교",
        "rounds": [
          331,
          321,
          346,
          350
        ],
        "total": 1348,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "38A",
        "name": "김도겸",
        "school": "서야중학교",
        "rounds": [
          331,
          334,
          336,
          346
        ],
        "total": 1347,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "15C",
        "name": "박예준",
        "school": "면목중학교",
        "rounds": [
          328,
          326,
          341,
          352
        ],
        "total": 1347,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "26A",
        "name": "주현승",
        "school": "진주봉원중학교",
        "rounds": [
          325,
          326,
          344,
          352
        ],
        "total": 1347,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "64A",
        "name": "김성혁",
        "school": "만수북중학교",
        "rounds": [
          329,
          329,
          342,
          347
        ],
        "total": 1347,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "63A",
        "name": "임찬혁",
        "school": "만수북중학교",
        "rounds": [
          339,
          320,
          342,
          346
        ],
        "total": 1347,
        "sourceRank": 15
      },
      {
        "rank": 20,
        "target": "51C",
        "name": "박민혁",
        "school": "모라중학교",
        "rounds": [
          331,
          325,
          342,
          346
        ],
        "total": 1344,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "56C",
        "name": "정현우",
        "school": "방이중학교",
        "rounds": [
          328,
          325,
          342,
          347
        ],
        "total": 1342,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "36C",
        "name": "권동하",
        "school": "경북체육중학교",
        "rounds": [
          332,
          324,
          332,
          353
        ],
        "total": 1341,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "52A",
        "name": "정재윤",
        "school": "부평동중학교",
        "rounds": [
          329,
          325,
          333,
          352
        ],
        "total": 1339,
        "sourceRank": 23
      },
      {
        "rank": 23,
        "target": "50A",
        "name": "정민우",
        "school": "부평동중학교",
        "rounds": [
          332,
          326,
          339,
          342
        ],
        "total": 1339,
        "sourceRank": 23
      },
      {
        "rank": 23,
        "target": "29B",
        "name": "이재원",
        "school": "중원중학교",
        "rounds": [
          335,
          320,
          336,
          348
        ],
        "total": 1339,
        "sourceRank": 23
      },
      {
        "rank": 26,
        "target": "60B",
        "name": "주영빈",
        "school": "이원중학교",
        "rounds": [
          332,
          318,
          341,
          347
        ],
        "total": 1338,
        "sourceRank": 26
      },
      {
        "rank": 26,
        "target": "31B",
        "name": "박민혁",
        "school": "북인천중학교",
        "rounds": [
          334,
          319,
          336,
          349
        ],
        "total": 1338,
        "sourceRank": 26
      },
      {
        "rank": 28,
        "target": "54A",
        "name": "장영한",
        "school": "용하중학교",
        "rounds": [
          328,
          318,
          340,
          351
        ],
        "total": 1337,
        "sourceRank": 28
      },
      {
        "rank": 28,
        "target": "59B",
        "name": "신동주",
        "school": "이원중학교",
        "rounds": [
          330,
          321,
          336,
          350
        ],
        "total": 1337,
        "sourceRank": 28
      },
      {
        "rank": 30,
        "target": "13B",
        "name": "이상윤",
        "school": "예천중학교",
        "rounds": [
          336,
          327,
          329,
          344
        ],
        "total": 1336,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "40C",
        "name": "이호진",
        "school": "경북체육중학교",
        "rounds": [
          331,
          330,
          330,
          345
        ],
        "total": 1336,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "27C",
        "name": "서은민",
        "school": "성포중학교",
        "rounds": [
          332,
          323,
          336,
          345
        ],
        "total": 1336,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "36B",
        "name": "석주원",
        "school": "선인중학교",
        "rounds": [
          338,
          321,
          332,
          345
        ],
        "total": 1336,
        "sourceRank": 30
      },
      {
        "rank": 34,
        "target": "59A",
        "name": "안준서",
        "school": "원천중학교",
        "rounds": [
          334,
          323,
          329,
          349
        ],
        "total": 1335,
        "sourceRank": 34
      },
      {
        "rank": 35,
        "target": "43A",
        "name": "강민우",
        "school": "동진중학교",
        "rounds": [
          323,
          325,
          343,
          343
        ],
        "total": 1334,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "61B",
        "name": "주영진",
        "school": "이원중학교",
        "rounds": [
          332,
          312,
          332,
          356
        ],
        "total": 1332,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "33A",
        "name": "이진율",
        "school": "불로중학교",
        "rounds": [
          332,
          321,
          333,
          346
        ],
        "total": 1332,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "48B",
        "name": "김용현",
        "school": "광주체육중학교",
        "rounds": [
          329,
          320,
          337,
          346
        ],
        "total": 1332,
        "sourceRank": 36
      },
      {
        "rank": 39,
        "target": "44A",
        "name": "김준호",
        "school": "동진중학교",
        "rounds": [
          329,
          323,
          333,
          345
        ],
        "total": 1330,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "51A",
        "name": "김동율",
        "school": "부평동중학교",
        "rounds": [
          335,
          309,
          338,
          347
        ],
        "total": 1329,
        "sourceRank": 40
      },
      {
        "rank": 41,
        "target": "31A",
        "name": "안도현",
        "school": "미리벌중학교",
        "rounds": [
          331,
          308,
          337,
          352
        ],
        "total": 1328,
        "sourceRank": 41
      },
      {
        "rank": 42,
        "target": "60C",
        "name": "최진욱",
        "school": "대서중학교",
        "rounds": [
          333,
          309,
          332,
          353
        ],
        "total": 1327,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "20B",
        "name": "고현빈",
        "school": "대전내동중학교",
        "rounds": [
          324,
          313,
          339,
          350
        ],
        "total": 1326,
        "sourceRank": 43
      },
      {
        "rank": 43,
        "target": "34B",
        "name": "손요한",
        "school": "선인중학교",
        "rounds": [
          325,
          309,
          340,
          352
        ],
        "total": 1326,
        "sourceRank": 43
      },
      {
        "rank": 43,
        "target": "54B",
        "name": "이체현",
        "school": "전주온고을중학교",
        "rounds": [
          328,
          314,
          336,
          348
        ],
        "total": 1326,
        "sourceRank": 43
      },
      {
        "rank": 46,
        "target": "34A",
        "name": "박지웅",
        "school": "불로중학교",
        "rounds": [
          327,
          312,
          339,
          347
        ],
        "total": 1325,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "19B",
        "name": "문보량",
        "school": "대전내동중학교",
        "rounds": [
          320,
          327,
          334,
          343
        ],
        "total": 1324,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "58B",
        "name": "최여준",
        "school": "이원중학교",
        "rounds": [
          324,
          317,
          332,
          348
        ],
        "total": 1321,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "43C",
        "name": "최준혁",
        "school": "부천남중학교",
        "rounds": [
          327,
          317,
          327,
          347
        ],
        "total": 1318,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "22C",
        "name": "이환지",
        "school": "신장중학교",
        "rounds": [
          334,
          314,
          329,
          340
        ],
        "total": 1317,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "28C",
        "name": "박민교",
        "school": "성포중학교",
        "rounds": [
          330,
          309,
          339,
          339
        ],
        "total": 1317,
        "sourceRank": 50
      },
      {
        "rank": 52,
        "target": "61C",
        "name": "박서준",
        "school": "대서중학교",
        "rounds": [
          314,
          321,
          327,
          353
        ],
        "total": 1315,
        "sourceRank": 52
      },
      {
        "rank": 53,
        "target": "13A",
        "name": "이태헌",
        "school": "운리중학교",
        "rounds": [
          325,
          319,
          326,
          343
        ],
        "total": 1313,
        "sourceRank": 53
      },
      {
        "rank": 53,
        "target": "14B",
        "name": "임지우",
        "school": "예천중학교",
        "rounds": [
          334,
          301,
          329,
          349
        ],
        "total": 1313,
        "sourceRank": 53
      },
      {
        "rank": 55,
        "target": "35B",
        "name": "김수혁",
        "school": "선인중학교",
        "rounds": [
          327,
          310,
          330,
          344
        ],
        "total": 1311,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "41B",
        "name": "송현빈",
        "school": "부산체육중학교",
        "rounds": [
          324,
          313,
          332,
          341
        ],
        "total": 1310,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "55C",
        "name": "김윤조",
        "school": "방이중학교",
        "rounds": [
          330,
          319,
          322,
          339
        ],
        "total": 1310,
        "sourceRank": 56
      },
      {
        "rank": 58,
        "target": "34C",
        "name": "이대로",
        "school": "경북체육중학교",
        "rounds": [
          321,
          315,
          334,
          339
        ],
        "total": 1309,
        "sourceRank": 58
      },
      {
        "rank": 59,
        "target": "26C",
        "name": "홍지훈",
        "school": "성포중학교",
        "rounds": [
          327,
          309,
          330,
          342
        ],
        "total": 1308,
        "sourceRank": 59
      },
      {
        "rank": 60,
        "target": "32B",
        "name": "이현율",
        "school": "북인천중학교",
        "rounds": [
          325,
          307,
          330,
          344
        ],
        "total": 1306,
        "sourceRank": 60
      },
      {
        "rank": 61,
        "target": "18A",
        "name": "변종율",
        "school": "북원중학교",
        "rounds": [
          316,
          314,
          339,
          336
        ],
        "total": 1305,
        "sourceRank": 61
      },
      {
        "rank": 62,
        "target": "35A",
        "name": "우성준",
        "school": "불로중학교",
        "rounds": [
          317,
          314,
          331,
          342
        ],
        "total": 1304,
        "sourceRank": 62
      },
      {
        "rank": 62,
        "target": "46B",
        "name": "조여준",
        "school": "광주체육중학교",
        "rounds": [
          326,
          304,
          330,
          344
        ],
        "total": 1304,
        "sourceRank": 62
      },
      {
        "rank": 64,
        "target": "47B",
        "name": "이하늘",
        "school": "광주체육중학교",
        "rounds": [
          323,
          310,
          324,
          346
        ],
        "total": 1303,
        "sourceRank": 64
      },
      {
        "rank": 65,
        "target": "25A",
        "name": "변승민",
        "school": "진주봉원중학교",
        "rounds": [
          321,
          311,
          325,
          345
        ],
        "total": 1302,
        "sourceRank": 65
      },
      {
        "rank": 65,
        "target": "52C",
        "name": "조재혁",
        "school": "모라중학교",
        "rounds": [
          328,
          313,
          320,
          341
        ],
        "total": 1302,
        "sourceRank": 65
      },
      {
        "rank": 67,
        "target": "21C",
        "name": "강민국",
        "school": "신장중학교",
        "rounds": [
          321,
          311,
          333,
          335
        ],
        "total": 1300,
        "sourceRank": 67
      },
      {
        "rank": 68,
        "target": "49B",
        "name": "김혜혁",
        "school": "광주체육중학교",
        "rounds": [
          324,
          306,
          328,
          341
        ],
        "total": 1299,
        "sourceRank": 68
      },
      {
        "rank": 69,
        "target": "55A",
        "name": "김승현",
        "school": "용성중학교",
        "rounds": [
          318,
          299,
          327,
          354
        ],
        "total": 1298,
        "sourceRank": 69
      },
      {
        "rank": 70,
        "target": "63C",
        "name": "정원진",
        "school": "창일중학교",
        "rounds": [
          319,
          312,
          327,
          336
        ],
        "total": 1294,
        "sourceRank": 70
      },
      {
        "rank": 70,
        "target": "33C",
        "name": "김지후",
        "school": "원봉중학교",
        "rounds": [
          308,
          316,
          330,
          340
        ],
        "total": 1294,
        "sourceRank": 70
      },
      {
        "rank": 72,
        "target": "23A",
        "name": "윤건우",
        "school": "연일중학교",
        "rounds": [
          317,
          307,
          323,
          345
        ],
        "total": 1292,
        "sourceRank": 72
      },
      {
        "rank": 73,
        "target": "37C",
        "name": "심우영",
        "school": "경북체육중학교",
        "rounds": [
          320,
          316,
          324,
          331
        ],
        "total": 1291,
        "sourceRank": 73
      },
      {
        "rank": 74,
        "target": "62A",
        "name": "원종혁",
        "school": "만수북중학교",
        "rounds": [
          315,
          304,
          327,
          343
        ],
        "total": 1289,
        "sourceRank": 74
      },
      {
        "rank": 74,
        "target": "29C",
        "name": "김준혁",
        "school": "성포중학교",
        "rounds": [
          325,
          304,
          322,
          338
        ],
        "total": 1289,
        "sourceRank": 74
      },
      {
        "rank": 76,
        "target": "15B",
        "name": "강태균",
        "school": "예천중학교",
        "rounds": [
          324,
          296,
          325,
          343
        ],
        "total": 1288,
        "sourceRank": 76
      },
      {
        "rank": 76,
        "target": "56A",
        "name": "진민오",
        "school": "원천중학교",
        "rounds": [
          322,
          301,
          324,
          341
        ],
        "total": 1288,
        "sourceRank": 76
      },
      {
        "rank": 78,
        "target": "40B",
        "name": "서예준",
        "school": "선인중학교",
        "rounds": [
          325,
          316,
          311,
          334
        ],
        "total": 1286,
        "sourceRank": 78
      },
      {
        "rank": 79,
        "target": "49A",
        "name": "이인서",
        "school": "부평동중학교",
        "rounds": [
          322,
          304,
          320,
          336
        ],
        "total": 1282,
        "sourceRank": 79
      },
      {
        "rank": 79,
        "target": "19A",
        "name": "이정우",
        "school": "북원중학교",
        "rounds": [
          317,
          307,
          322,
          336
        ],
        "total": 1282,
        "sourceRank": 79
      },
      {
        "rank": 81,
        "target": "63B",
        "name": "김민재",
        "school": "순천풍덕중학교",
        "rounds": [
          312,
          300,
          323,
          346
        ],
        "total": 1281,
        "sourceRank": 81
      },
      {
        "rank": 82,
        "target": "18B",
        "name": "김보형",
        "school": "수원시양궁협회",
        "rounds": [
          308,
          299,
          331,
          342
        ],
        "total": 1280,
        "sourceRank": 82
      },
      {
        "rank": 82,
        "target": "16A",
        "name": "김예성",
        "school": "운리중학교",
        "rounds": [
          318,
          304,
          323,
          335
        ],
        "total": 1280,
        "sourceRank": 82
      },
      {
        "rank": 82,
        "target": "17B",
        "name": "손우주",
        "school": "수원시양궁협회",
        "rounds": [
          313,
          300,
          328,
          339
        ],
        "total": 1280,
        "sourceRank": 82
      },
      {
        "rank": 85,
        "target": "17C",
        "name": "이시윤",
        "school": "무거중학교",
        "rounds": [
          317,
          301,
          321,
          340
        ],
        "total": 1279,
        "sourceRank": 85
      },
      {
        "rank": 86,
        "target": "61A",
        "name": "김영준",
        "school": "만수북중학교",
        "rounds": [
          316,
          296,
          317,
          349
        ],
        "total": 1278,
        "sourceRank": 86
      },
      {
        "rank": 86,
        "target": "16B",
        "name": "정은균",
        "school": "예천중학교",
        "rounds": [
          320,
          297,
          323,
          338
        ],
        "total": 1278,
        "sourceRank": 86
      },
      {
        "rank": 88,
        "target": "13C",
        "name": "김도진",
        "school": "강원체육중학교",
        "rounds": [
          320,
          309,
          311,
          337
        ],
        "total": 1277,
        "sourceRank": 88
      },
      {
        "rank": 89,
        "target": "57B",
        "name": "박현준",
        "school": "전주온고을중학교",
        "rounds": [
          316,
          300,
          316,
          341
        ],
        "total": 1273,
        "sourceRank": 89
      },
      {
        "rank": 90,
        "target": "35C",
        "name": "유찬",
        "school": "경북체육중학교",
        "rounds": [
          308,
          303,
          323,
          335
        ],
        "total": 1269,
        "sourceRank": 90
      },
      {
        "rank": 91,
        "target": "59C",
        "name": "양가온",
        "school": "대서중학교",
        "rounds": [
          303,
          296,
          329,
          340
        ],
        "total": 1268,
        "sourceRank": 91
      },
      {
        "rank": 92,
        "target": "64B",
        "name": "김민준",
        "school": "순천풍덕중학교",
        "rounds": [
          318,
          299,
          316,
          334
        ],
        "total": 1267,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "36A",
        "name": "이도현",
        "school": "불로중학교",
        "rounds": [
          310,
          296,
          322,
          339
        ],
        "total": 1267,
        "sourceRank": 92
      },
      {
        "rank": 94,
        "target": "12C",
        "name": "김지성",
        "school": "강원체육중학교",
        "rounds": [
          302,
          306,
          314,
          342
        ],
        "total": 1264,
        "sourceRank": 94
      },
      {
        "rank": 95,
        "target": "40A",
        "name": "김수현",
        "school": "동진중학교",
        "rounds": [
          302,
          298,
          319,
          344
        ],
        "total": 1263,
        "sourceRank": 95
      },
      {
        "rank": 95,
        "target": "37A",
        "name": "권하준",
        "school": "불로중학교",
        "rounds": [
          315,
          294,
          313,
          341
        ],
        "total": 1263,
        "sourceRank": 95
      },
      {
        "rank": 95,
        "target": "22B",
        "name": "박태환",
        "school": "대전내동중학교",
        "rounds": [
          314,
          284,
          320,
          345
        ],
        "total": 1263,
        "sourceRank": 95
      },
      {
        "rank": 98,
        "target": "22A",
        "name": "방채영",
        "school": "연일중학교",
        "rounds": [
          311,
          298,
          317,
          336
        ],
        "total": 1262,
        "sourceRank": 98
      },
      {
        "rank": 98,
        "target": "55B",
        "name": "최율",
        "school": "전주온고을중학교",
        "rounds": [
          313,
          296,
          318,
          335
        ],
        "total": 1262,
        "sourceRank": 98
      },
      {
        "rank": 98,
        "target": "24C",
        "name": "문윤서",
        "school": "전남체육중학교",
        "rounds": [
          319,
          308,
          303,
          332
        ],
        "total": 1262,
        "sourceRank": 98
      },
      {
        "rank": 101,
        "target": "57A",
        "name": "정준영",
        "school": "원천중학교",
        "rounds": [
          313,
          291,
          320,
          336
        ],
        "total": 1260,
        "sourceRank": 101
      },
      {
        "rank": 102,
        "target": "32C",
        "name": "황시윤",
        "school": "성포중학교",
        "rounds": [
          317,
          291,
          318,
          333
        ],
        "total": 1259,
        "sourceRank": 102
      },
      {
        "rank": 103,
        "target": "44C",
        "name": "배시우",
        "school": "양화중학교",
        "rounds": [
          305,
          312,
          306,
          334
        ],
        "total": 1257,
        "sourceRank": 103
      },
      {
        "rank": 104,
        "target": "31C",
        "name": "오태윤",
        "school": "성포중학교",
        "rounds": [
          312,
          300,
          310,
          333
        ],
        "total": 1255,
        "sourceRank": 104
      },
      {
        "rank": 104,
        "target": "38B",
        "name": "임동현",
        "school": "선인중학교",
        "rounds": [
          314,
          300,
          315,
          326
        ],
        "total": 1255,
        "sourceRank": 104
      },
      {
        "rank": 106,
        "target": "37B",
        "name": "김민권",
        "school": "선인중학교",
        "rounds": [
          304,
          291,
          321,
          337
        ],
        "total": 1253,
        "sourceRank": 106
      },
      {
        "rank": 107,
        "target": "48C",
        "name": "김수완",
        "school": "성사중학교",
        "rounds": [
          300,
          298,
          319,
          333
        ],
        "total": 1250,
        "sourceRank": 107
      },
      {
        "rank": 108,
        "target": "30C",
        "name": "명지훈",
        "school": "성포중학교",
        "rounds": [
          312,
          281,
          320,
          336
        ],
        "total": 1249,
        "sourceRank": 108
      },
      {
        "rank": 109,
        "target": "43B",
        "name": "김원영",
        "school": "부산체육중학교",
        "rounds": [
          315,
          300,
          311,
          318
        ],
        "total": 1244,
        "sourceRank": 109
      },
      {
        "rank": 110,
        "target": "65A",
        "name": "정예준",
        "school": "만수북중학교",
        "rounds": [
          292,
          305,
          314,
          332
        ],
        "total": 1243,
        "sourceRank": 110
      },
      {
        "rank": 111,
        "target": "41A",
        "name": "반승우",
        "school": "동진중학교",
        "rounds": [
          291,
          293,
          318,
          340
        ],
        "total": 1242,
        "sourceRank": 111
      },
      {
        "rank": 112,
        "target": "24A",
        "name": "권도훈",
        "school": "연일중학교",
        "rounds": [
          302,
          289,
          317,
          329
        ],
        "total": 1237,
        "sourceRank": 112
      },
      {
        "rank": 113,
        "target": "21B",
        "name": "김태훈",
        "school": "대전내동중학교",
        "rounds": [
          300,
          279,
          317,
          340
        ],
        "total": 1236,
        "sourceRank": 113
      },
      {
        "rank": 113,
        "target": "19C",
        "name": "정범준",
        "school": "무거중학교",
        "rounds": [
          304,
          294,
          303,
          335
        ],
        "total": 1236,
        "sourceRank": 113
      },
      {
        "rank": 115,
        "target": "28A",
        "name": "황수용",
        "school": "구례중학교",
        "rounds": [
          305,
          295,
          310,
          324
        ],
        "total": 1234,
        "sourceRank": 115
      },
      {
        "rank": 116,
        "target": "24B",
        "name": "손승우",
        "school": "대전내동중학교",
        "rounds": [
          299,
          270,
          324,
          338
        ],
        "total": 1231,
        "sourceRank": 116
      },
      {
        "rank": 117,
        "target": "25B",
        "name": "이헌우",
        "school": "제주양궁클럽",
        "rounds": [
          310,
          278,
          306,
          336
        ],
        "total": 1230,
        "sourceRank": 117
      },
      {
        "rank": 118,
        "target": "54C",
        "name": "김규선",
        "school": "방이중학교",
        "rounds": [
          308,
          277,
          315,
          329
        ],
        "total": 1229,
        "sourceRank": 118
      },
      {
        "rank": 119,
        "target": "14C",
        "name": "이우형",
        "school": "강원체육중학교",
        "rounds": [
          302,
          285,
          304,
          335
        ],
        "total": 1226,
        "sourceRank": 119
      },
      {
        "rank": 119,
        "target": "46C",
        "name": "원동우",
        "school": "하성중학교",
        "rounds": [
          310,
          296,
          306,
          314
        ],
        "total": 1226,
        "sourceRank": 119
      },
      {
        "rank": 121,
        "target": "33B",
        "name": "김도율",
        "school": "선인중학교",
        "rounds": [
          293,
          295,
          309,
          327
        ],
        "total": 1224,
        "sourceRank": 121
      },
      {
        "rank": 121,
        "target": "62C",
        "name": "정시우",
        "school": "창일중학교",
        "rounds": [
          305,
          282,
          318,
          319
        ],
        "total": 1224,
        "sourceRank": 121
      },
      {
        "rank": 123,
        "target": "28B",
        "name": "유재광",
        "school": "대전대청중학교",
        "rounds": [
          310,
          264,
          318,
          330
        ],
        "total": 1222,
        "sourceRank": 123
      },
      {
        "rank": 124,
        "target": "47A",
        "name": "한지환",
        "school": "병천중학교",
        "rounds": [
          292,
          290,
          309,
          330
        ],
        "total": 1221,
        "sourceRank": 124
      },
      {
        "rank": 125,
        "target": "48A",
        "name": "김민표",
        "school": "부평동중학교",
        "rounds": [
          307,
          286,
          309,
          318
        ],
        "total": 1220,
        "sourceRank": 125
      },
      {
        "rank": 126,
        "target": "58C",
        "name": "황보길",
        "school": "방이중학교",
        "rounds": [
          307,
          282,
          304,
          322
        ],
        "total": 1215,
        "sourceRank": 126
      },
      {
        "rank": 127,
        "target": "30B",
        "name": "이락희",
        "school": "남천중학교",
        "rounds": [
          290,
          289,
          299,
          336
        ],
        "total": 1214,
        "sourceRank": 127
      },
      {
        "rank": 128,
        "target": "46A",
        "name": "전성은",
        "school": "병천중학교",
        "rounds": [
          297,
          258,
          322,
          336
        ],
        "total": 1213,
        "sourceRank": 128
      },
      {
        "rank": 129,
        "target": "29A",
        "name": "정진우",
        "school": "구례중학교",
        "rounds": [
          295,
          277,
          310,
          329
        ],
        "total": 1211,
        "sourceRank": 129
      },
      {
        "rank": 130,
        "target": "14A",
        "name": "김재준",
        "school": "운리중학교",
        "rounds": [
          282,
          284,
          316,
          328
        ],
        "total": 1210,
        "sourceRank": 130
      },
      {
        "rank": 130,
        "target": "51B",
        "name": "조유준",
        "school": "광주체육중학교",
        "rounds": [
          296,
          284,
          299,
          331
        ],
        "total": 1210,
        "sourceRank": 130
      },
      {
        "rank": 132,
        "target": "39B",
        "name": "이강호",
        "school": "선인중학교",
        "rounds": [
          278,
          296,
          301,
          326
        ],
        "total": 1201,
        "sourceRank": 132
      },
      {
        "rank": 133,
        "target": "65C",
        "name": "한준희",
        "school": "창일중학교",
        "rounds": [
          293,
          271,
          301,
          323
        ],
        "total": 1188,
        "sourceRank": 133
      },
      {
        "rank": 134,
        "target": "41C",
        "name": "강지석",
        "school": "부천남중학교",
        "rounds": [
          284,
          275,
          292,
          335
        ],
        "total": 1186,
        "sourceRank": 134
      },
      {
        "rank": 135,
        "target": "15A",
        "name": "김경탁",
        "school": "운리중학교",
        "rounds": [
          302,
          260,
          302,
          316
        ],
        "total": 1180,
        "sourceRank": 135
      },
      {
        "rank": 136,
        "target": "23B",
        "name": "서원빈",
        "school": "대전내동중학교",
        "rounds": [
          300,
          264,
          288,
          321
        ],
        "total": 1173,
        "sourceRank": 136
      },
      {
        "rank": 137,
        "target": "45C",
        "name": "박민수",
        "school": "양화중학교",
        "rounds": [
          292,
          262,
          292,
          320
        ],
        "total": 1166,
        "sourceRank": 137
      },
      {
        "rank": 138,
        "target": "23C",
        "name": "이선우",
        "school": "전남체육중학교",
        "rounds": [
          280,
          284,
          283,
          318
        ],
        "total": 1165,
        "sourceRank": 138
      },
      {
        "rank": 139,
        "target": "50B",
        "name": "정하준",
        "school": "광주체육중학교",
        "rounds": [
          283,
          247,
          307,
          324
        ],
        "total": 1161,
        "sourceRank": 139
      },
      {
        "rank": 140,
        "target": "20A",
        "name": "정민규",
        "school": "북원중학교",
        "rounds": [
          252,
          281,
          309,
          317
        ],
        "total": 1159,
        "sourceRank": 140
      },
      {
        "rank": 141,
        "target": "42B",
        "name": "이유은",
        "school": "부산체육중학교",
        "rounds": [
          279,
          231,
          318,
          328
        ],
        "total": 1156,
        "sourceRank": 141
      },
      {
        "rank": 142,
        "target": "53B",
        "name": "곽륜우",
        "school": "광주체육중학교",
        "rounds": [
          251,
          266,
          319,
          312
        ],
        "total": 1148,
        "sourceRank": 142
      },
      {
        "rank": 142,
        "target": "64C",
        "name": "표은율",
        "school": "창일중학교",
        "rounds": [
          291,
          270,
          269,
          318
        ],
        "total": 1148,
        "sourceRank": 142
      },
      {
        "rank": 144,
        "target": "52B",
        "name": "조담준",
        "school": "광주체육중학교",
        "rounds": [
          285,
          267,
          277,
          318
        ],
        "total": 1147,
        "sourceRank": 144
      },
      {
        "rank": 145,
        "target": "42C",
        "name": "차준",
        "school": "부천남중학교",
        "rounds": [
          266,
          245,
          315,
          319
        ],
        "total": 1145,
        "sourceRank": 145
      },
      {
        "rank": 146,
        "target": "27B",
        "name": "강성은",
        "school": "제주양궁클럽",
        "rounds": [
          290,
          253,
          285,
          314
        ],
        "total": 1142,
        "sourceRank": 146
      },
      {
        "rank": 147,
        "target": "17A",
        "name": "안수혁",
        "school": "운리중학교",
        "rounds": [
          280,
          265,
          267,
          328
        ],
        "total": 1140,
        "sourceRank": 147
      },
      {
        "rank": 148,
        "target": "57C",
        "name": "김종민",
        "school": "방이중학교",
        "rounds": [
          281,
          245,
          310,
          297
        ],
        "total": 1133,
        "sourceRank": 148
      },
      {
        "rank": 149,
        "target": "20C",
        "name": "이찬희",
        "school": "신장중학교",
        "rounds": [
          289,
          239,
          294,
          303
        ],
        "total": 1125,
        "sourceRank": 149
      },
      {
        "rank": 150,
        "target": "53C",
        "name": "신경환",
        "school": "박종숙양궁아카데미",
        "rounds": [
          285,
          248,
          264,
          316
        ],
        "total": 1113,
        "sourceRank": 150
      },
      {
        "rank": 151,
        "target": "30A",
        "name": "강윤우",
        "school": "미리벌중학교",
        "rounds": [
          294,
          221,
          281,
          309
        ],
        "total": 1105,
        "sourceRank": 151
      },
      {
        "rank": 152,
        "target": "49C",
        "name": "유지안",
        "school": "성사중학교",
        "rounds": [
          274,
          241,
          284,
          304
        ],
        "total": 1103,
        "sourceRank": 152
      },
      {
        "rank": 153,
        "target": "27A",
        "name": "김시후",
        "school": "진주봉원중학교",
        "rounds": [
          255,
          221,
          245,
          316
        ],
        "total": 1037,
        "sourceRank": 153
      },
      {
        "rank": 154,
        "target": "21A",
        "name": "정민준",
        "school": "북원중학교",
        "rounds": [
          238,
          197,
          291,
          292
        ],
        "total": 1018,
        "sourceRank": 154
      },
      {
        "rank": 155,
        "target": "16C",
        "name": "김규성",
        "school": "면목중학교",
        "rounds": [
          257,
          216,
          245,
          290
        ],
        "total": 1008,
        "sourceRank": 155
      },
      {
        "rank": 156,
        "target": "26B",
        "name": "우경민",
        "school": "제주양궁클럽",
        "rounds": [
          228,
          227,
          251,
          274
        ],
        "total": 980,
        "sourceRank": 156
      },
      {
        "rank": 157,
        "target": "56B",
        "name": "전소익",
        "school": "전주온고을중학교",
        "rounds": [
          243,
          167,
          272,
          286
        ],
        "total": 968,
        "sourceRank": 157
      },
      {
        "rank": 158,
        "target": "65B",
        "name": "양시윤",
        "school": "순천풍덕중학교",
        "rounds": [
          220,
          213,
          242,
          285
        ],
        "total": 960,
        "sourceRank": 158
      },
      {
        "rank": 159,
        "target": "53A",
        "name": "허민혁",
        "school": "부평동중학교",
        "rounds": [
          317,
          328,
          306,
          0
        ],
        "total": 951,
        "sourceRank": 159
      },
      {
        "rank": 160,
        "target": "45A",
        "name": "이재영",
        "school": "병천중학교",
        "rounds": [
          0,
          0,
          0,
          0
        ],
        "total": 0,
        "sourceRank": 160
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar02m01q",
    "sheetLabel": "남자 리커브 중학부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "중등부",
    "rankingGroup": "중등부",
    "distances": [
      60,
      50,
      40,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "58B",
        "name": "윤노을",
        "school": "대전대청중학교",
        "rounds": [
          344,
          334,
          348,
          357
        ],
        "total": 1383,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "34C",
        "name": "류수민",
        "school": "부일중학교",
        "rounds": [
          336,
          327,
          347,
          349
        ],
        "total": 1359,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "32A",
        "name": "박수연",
        "school": "경북체육중학교",
        "rounds": [
          342,
          317,
          344,
          352
        ],
        "total": 1355,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "31A",
        "name": "안서영",
        "school": "경북체육중학교",
        "rounds": [
          335,
          325,
          340,
          351
        ],
        "total": 1351,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "61A",
        "name": "우소민",
        "school": "미리벌중학교",
        "rounds": [
          336,
          322,
          340,
          352
        ],
        "total": 1350,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "24A",
        "name": "조여민",
        "school": "임실군 양궁스포츠클럽",
        "rounds": [
          334,
          323,
          341,
          351
        ],
        "total": 1349,
        "sourceRank": 6
      },
      {
        "rank": 6,
        "target": "61C",
        "name": "이하은",
        "school": "남천중학교",
        "rounds": [
          330,
          320,
          343,
          356
        ],
        "total": 1349,
        "sourceRank": 6
      },
      {
        "rank": 6,
        "target": "34A",
        "name": "우가람",
        "school": "용암중학교",
        "rounds": [
          337,
          324,
          338,
          350
        ],
        "total": 1349,
        "sourceRank": 6
      },
      {
        "rank": 9,
        "target": "51A",
        "name": "변다해",
        "school": "인천여자중학교",
        "rounds": [
          330,
          321,
          343,
          352
        ],
        "total": 1346,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "19A",
        "name": "이주은",
        "school": "성사중학교",
        "rounds": [
          333,
          325,
          338,
          349
        ],
        "total": 1345,
        "sourceRank": 10
      },
      {
        "rank": 10,
        "target": "17A",
        "name": "염정민",
        "school": "서라벌여자중학교",
        "rounds": [
          333,
          321,
          337,
          354
        ],
        "total": 1345,
        "sourceRank": 10
      },
      {
        "rank": 12,
        "target": "20B",
        "name": "안지현",
        "school": "창용중학교",
        "rounds": [
          333,
          321,
          339,
          351
        ],
        "total": 1344,
        "sourceRank": 12
      },
      {
        "rank": 12,
        "target": "58D",
        "name": "김다을",
        "school": "용성중학교",
        "rounds": [
          338,
          324,
          331,
          351
        ],
        "total": 1344,
        "sourceRank": 12
      },
      {
        "rank": 12,
        "target": "46A",
        "name": "장여진",
        "school": "여흥중학교",
        "rounds": [
          327,
          328,
          342,
          347
        ],
        "total": 1344,
        "sourceRank": 12
      },
      {
        "rank": 15,
        "target": "11D",
        "name": "권수연",
        "school": "상도중학교",
        "rounds": [
          337,
          328,
          333,
          345
        ],
        "total": 1343,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "25A",
        "name": "조여경",
        "school": "임실군 양궁스포츠클럽",
        "rounds": [
          331,
          317,
          335,
          358
        ],
        "total": 1341,
        "sourceRank": 16
      },
      {
        "rank": 17,
        "target": "21B",
        "name": "최서진",
        "school": "창용중학교",
        "rounds": [
          337,
          328,
          333,
          342
        ],
        "total": 1340,
        "sourceRank": 17
      },
      {
        "rank": 18,
        "target": "38D",
        "name": "이경민",
        "school": "광주동명중학교",
        "rounds": [
          332,
          325,
          334,
          348
        ],
        "total": 1339,
        "sourceRank": 18
      },
      {
        "rank": 18,
        "target": "57C",
        "name": "박소민",
        "school": "성화중학교",
        "rounds": [
          327,
          329,
          341,
          342
        ],
        "total": 1339,
        "sourceRank": 18
      },
      {
        "rank": 20,
        "target": "22B",
        "name": "김주은",
        "school": "창용중학교",
        "rounds": [
          327,
          324,
          337,
          350
        ],
        "total": 1338,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "21A",
        "name": "전이지",
        "school": "성사중학교",
        "rounds": [
          329,
          328,
          328,
          350
        ],
        "total": 1335,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "15C",
        "name": "김지수",
        "school": "무거중학교",
        "rounds": [
          329,
          324,
          339,
          342
        ],
        "total": 1334,
        "sourceRank": 22
      },
      {
        "rank": 22,
        "target": "45B",
        "name": "장인영",
        "school": "홍성여자중학교",
        "rounds": [
          327,
          313,
          343,
          351
        ],
        "total": 1334,
        "sourceRank": 22
      },
      {
        "rank": 24,
        "target": "28D",
        "name": "김미소",
        "school": "광주체육중학교",
        "rounds": [
          328,
          319,
          339,
          347
        ],
        "total": 1333,
        "sourceRank": 24
      },
      {
        "rank": 25,
        "target": "46D",
        "name": "이선영",
        "school": "예천여자중학교",
        "rounds": [
          322,
          322,
          339,
          349
        ],
        "total": 1332,
        "sourceRank": 25
      },
      {
        "rank": 26,
        "target": "33C",
        "name": "반서진",
        "school": "부일중학교",
        "rounds": [
          331,
          312,
          335,
          352
        ],
        "total": 1330,
        "sourceRank": 26
      },
      {
        "rank": 26,
        "target": "54B",
        "name": "홍아인",
        "school": "중원중학교",
        "rounds": [
          323,
          323,
          336,
          348
        ],
        "total": 1330,
        "sourceRank": 26
      },
      {
        "rank": 28,
        "target": "48C",
        "name": "고다연",
        "school": "대전체육중학교",
        "rounds": [
          324,
          325,
          331,
          349
        ],
        "total": 1329,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "48D",
        "name": "김지율",
        "school": "예천여자중학교",
        "rounds": [
          327,
          312,
          338,
          350
        ],
        "total": 1327,
        "sourceRank": 29
      },
      {
        "rank": 30,
        "target": "57B",
        "name": "김도연",
        "school": "대전대청중학교",
        "rounds": [
          331,
          323,
          332,
          337
        ],
        "total": 1323,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "18B",
        "name": "김연아",
        "school": "창용중학교",
        "rounds": [
          321,
          318,
          334,
          350
        ],
        "total": 1323,
        "sourceRank": 30
      },
      {
        "rank": 32,
        "target": "51C",
        "name": "김현서",
        "school": "대전체육중학교",
        "rounds": [
          322,
          317,
          337,
          346
        ],
        "total": 1322,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "20A",
        "name": "신주하",
        "school": "성사중학교",
        "rounds": [
          330,
          311,
          335,
          345
        ],
        "total": 1321,
        "sourceRank": 33
      },
      {
        "rank": 34,
        "target": "41A",
        "name": "김보현",
        "school": "여흥중학교",
        "rounds": [
          325,
          315,
          331,
          348
        ],
        "total": 1319,
        "sourceRank": 34
      },
      {
        "rank": 35,
        "target": "19B",
        "name": "박예주",
        "school": "창용중학교",
        "rounds": [
          322,
          317,
          330,
          349
        ],
        "total": 1318,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "42B",
        "name": "이서은",
        "school": "전남체육중학교",
        "rounds": [
          323,
          318,
          328,
          346
        ],
        "total": 1315,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "13C",
        "name": "임서현",
        "school": "오창중학교",
        "rounds": [
          323,
          322,
          326,
          344
        ],
        "total": 1315,
        "sourceRank": 36
      },
      {
        "rank": 38,
        "target": "61B",
        "name": "윤채민",
        "school": "신흥여자중학교",
        "rounds": [
          321,
          324,
          327,
          342
        ],
        "total": 1314,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "47D",
        "name": "김주아",
        "school": "예천여자중학교",
        "rounds": [
          324,
          310,
          332,
          346
        ],
        "total": 1312,
        "sourceRank": 39
      },
      {
        "rank": 39,
        "target": "58C",
        "name": "정윤서",
        "school": "성화중학교",
        "rounds": [
          323,
          316,
          337,
          336
        ],
        "total": 1312,
        "sourceRank": 39
      },
      {
        "rank": 41,
        "target": "56D",
        "name": "배효린",
        "school": "용성중학교",
        "rounds": [
          322,
          304,
          336,
          349
        ],
        "total": 1311,
        "sourceRank": 41
      },
      {
        "rank": 42,
        "target": "26D",
        "name": "서예람",
        "school": "광주체육중학교",
        "rounds": [
          332,
          296,
          334,
          348
        ],
        "total": 1310,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "43B",
        "name": "윤예진",
        "school": "홍성여자중학교",
        "rounds": [
          308,
          318,
          340,
          343
        ],
        "total": 1309,
        "sourceRank": 43
      },
      {
        "rank": 43,
        "target": "40D",
        "name": "고윤우",
        "school": "광주동명중학교",
        "rounds": [
          320,
          316,
          326,
          347
        ],
        "total": 1309,
        "sourceRank": 43
      },
      {
        "rank": 43,
        "target": "39D",
        "name": "심예인",
        "school": "광주동명중학교",
        "rounds": [
          322,
          317,
          325,
          345
        ],
        "total": 1309,
        "sourceRank": 43
      },
      {
        "rank": 46,
        "target": "33D",
        "name": "손시언",
        "school": "진해중학교",
        "rounds": [
          322,
          316,
          323,
          347
        ],
        "total": 1308,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "16B",
        "name": "김소은",
        "school": "강화여자중학교",
        "rounds": [
          328,
          323,
          331,
          325
        ],
        "total": 1307,
        "sourceRank": 47
      },
      {
        "rank": 47,
        "target": "22D",
        "name": "문다현",
        "school": "모라중학교",
        "rounds": [
          329,
          311,
          331,
          336
        ],
        "total": 1307,
        "sourceRank": 47
      },
      {
        "rank": 49,
        "target": "49A",
        "name": "박다희",
        "school": "전주솔빛중학교",
        "rounds": [
          307,
          319,
          334,
          346
        ],
        "total": 1306,
        "sourceRank": 49
      },
      {
        "rank": 49,
        "target": "44D",
        "name": "이루나",
        "school": "양화중학교",
        "rounds": [
          316,
          313,
          332,
          345
        ],
        "total": 1306,
        "sourceRank": 49
      },
      {
        "rank": 51,
        "target": "35C",
        "name": "김시하",
        "school": "부일중학교",
        "rounds": [
          325,
          296,
          336,
          348
        ],
        "total": 1305,
        "sourceRank": 51
      },
      {
        "rank": 51,
        "target": "57D",
        "name": "신연우",
        "school": "용성중학교",
        "rounds": [
          330,
          319,
          315,
          341
        ],
        "total": 1305,
        "sourceRank": 51
      },
      {
        "rank": 53,
        "target": "54D",
        "name": "이민솔",
        "school": "신장중학교",
        "rounds": [
          322,
          310,
          328,
          343
        ],
        "total": 1303,
        "sourceRank": 53
      },
      {
        "rank": 54,
        "target": "23B",
        "name": "주혜인",
        "school": "창용중학교",
        "rounds": [
          318,
          314,
          326,
          344
        ],
        "total": 1302,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "35B",
        "name": "채수현",
        "school": "대구체육중학교",
        "rounds": [
          326,
          321,
          330,
          324
        ],
        "total": 1301,
        "sourceRank": 55
      },
      {
        "rank": 55,
        "target": "49D",
        "name": "전소율",
        "school": "예천여자중학교",
        "rounds": [
          314,
          304,
          339,
          344
        ],
        "total": 1301,
        "sourceRank": 55
      },
      {
        "rank": 55,
        "target": "25C",
        "name": "이소현",
        "school": "하랑중학교",
        "rounds": [
          320,
          307,
          329,
          345
        ],
        "total": 1301,
        "sourceRank": 55
      },
      {
        "rank": 58,
        "target": "24B",
        "name": "이소연",
        "school": "창용중학교",
        "rounds": [
          316,
          298,
          342,
          344
        ],
        "total": 1300,
        "sourceRank": 58
      },
      {
        "rank": 58,
        "target": "36B",
        "name": "류가예",
        "school": "대구체육중학교",
        "rounds": [
          328,
          310,
          322,
          340
        ],
        "total": 1300,
        "sourceRank": 58
      },
      {
        "rank": 60,
        "target": "17D",
        "name": "최지은",
        "school": "면목중학교",
        "rounds": [
          316,
          314,
          320,
          348
        ],
        "total": 1298,
        "sourceRank": 60
      },
      {
        "rank": 61,
        "target": "60B",
        "name": "김민별",
        "school": "신흥여자중학교",
        "rounds": [
          310,
          308,
          332,
          347
        ],
        "total": 1297,
        "sourceRank": 61
      },
      {
        "rank": 61,
        "target": "55C",
        "name": "조예림",
        "school": "연일중학교",
        "rounds": [
          319,
          306,
          329,
          343
        ],
        "total": 1297,
        "sourceRank": 61
      },
      {
        "rank": 63,
        "target": "21D",
        "name": "양서연",
        "school": "모라중학교",
        "rounds": [
          315,
          308,
          332,
          340
        ],
        "total": 1295,
        "sourceRank": 63
      },
      {
        "rank": 64,
        "target": "17B",
        "name": "김수연",
        "school": "창용중학교",
        "rounds": [
          308,
          317,
          331,
          337
        ],
        "total": 1293,
        "sourceRank": 64
      },
      {
        "rank": 64,
        "target": "48A",
        "name": "임예은",
        "school": "전주솔빛중학교",
        "rounds": [
          312,
          307,
          330,
          344
        ],
        "total": 1293,
        "sourceRank": 64
      },
      {
        "rank": 64,
        "target": "59C",
        "name": "여다민",
        "school": "성화중학교",
        "rounds": [
          315,
          310,
          326,
          342
        ],
        "total": 1293,
        "sourceRank": 64
      },
      {
        "rank": 64,
        "target": "34B",
        "name": "서민정",
        "school": "대구체육중학교",
        "rounds": [
          314,
          314,
          319,
          346
        ],
        "total": 1293,
        "sourceRank": 64
      },
      {
        "rank": 68,
        "target": "45A",
        "name": "윤도경",
        "school": "여흥중학교",
        "rounds": [
          299,
          321,
          324,
          348
        ],
        "total": 1292,
        "sourceRank": 68
      },
      {
        "rank": 68,
        "target": "36C",
        "name": "전인서",
        "school": "부일중학교",
        "rounds": [
          318,
          312,
          320,
          342
        ],
        "total": 1292,
        "sourceRank": 68
      },
      {
        "rank": 70,
        "target": "27C",
        "name": "김수지",
        "school": "부산체육중학교",
        "rounds": [
          312,
          303,
          331,
          345
        ],
        "total": 1291,
        "sourceRank": 70
      },
      {
        "rank": 70,
        "target": "29D",
        "name": "이설하",
        "school": "광주체육중학교",
        "rounds": [
          318,
          317,
          321,
          335
        ],
        "total": 1291,
        "sourceRank": 70
      },
      {
        "rank": 72,
        "target": "27D",
        "name": "박채윤",
        "school": "광주체육중학교",
        "rounds": [
          324,
          316,
          313,
          337
        ],
        "total": 1290,
        "sourceRank": 72
      },
      {
        "rank": 72,
        "target": "63A",
        "name": "김소원",
        "school": "미리벌중학교",
        "rounds": [
          314,
          314,
          315,
          347
        ],
        "total": 1290,
        "sourceRank": 72
      },
      {
        "rank": 72,
        "target": "62B",
        "name": "남수아",
        "school": "신흥여자중학교",
        "rounds": [
          311,
          318,
          319,
          342
        ],
        "total": 1290,
        "sourceRank": 72
      },
      {
        "rank": 72,
        "target": "55D",
        "name": "윤소미",
        "school": "신장중학교",
        "rounds": [
          319,
          304,
          329,
          338
        ],
        "total": 1290,
        "sourceRank": 72
      },
      {
        "rank": 76,
        "target": "36D",
        "name": "민소이",
        "school": "진해중학교",
        "rounds": [
          315,
          301,
          329,
          343
        ],
        "total": 1288,
        "sourceRank": 76
      },
      {
        "rank": 76,
        "target": "28B",
        "name": "김정음",
        "school": "창용중학교",
        "rounds": [
          308,
          320,
          317,
          343
        ],
        "total": 1288,
        "sourceRank": 76
      },
      {
        "rank": 78,
        "target": "57A",
        "name": "고다현",
        "school": "방이중학교",
        "rounds": [
          316,
          302,
          324,
          345
        ],
        "total": 1287,
        "sourceRank": 78
      },
      {
        "rank": 79,
        "target": "29A",
        "name": "전아윤",
        "school": "경북체육중학교",
        "rounds": [
          309,
          305,
          324,
          347
        ],
        "total": 1285,
        "sourceRank": 79
      },
      {
        "rank": 79,
        "target": "37C",
        "name": "이희율",
        "school": "부일중학교",
        "rounds": [
          311,
          315,
          327,
          332
        ],
        "total": 1285,
        "sourceRank": 79
      },
      {
        "rank": 81,
        "target": "45C",
        "name": "신다솔",
        "school": "대전체육중학교",
        "rounds": [
          324,
          302,
          326,
          332
        ],
        "total": 1284,
        "sourceRank": 81
      },
      {
        "rank": 81,
        "target": "30B",
        "name": "천지유",
        "school": "경포중학교",
        "rounds": [
          304,
          310,
          330,
          340
        ],
        "total": 1284,
        "sourceRank": 81
      },
      {
        "rank": 81,
        "target": "64D",
        "name": "이서진",
        "school": "버들중학교",
        "rounds": [
          315,
          307,
          323,
          339
        ],
        "total": 1284,
        "sourceRank": 81
      },
      {
        "rank": 84,
        "target": "45D",
        "name": "김예슬",
        "school": "양화중학교",
        "rounds": [
          308,
          310,
          326,
          339
        ],
        "total": 1283,
        "sourceRank": 84
      },
      {
        "rank": 85,
        "target": "47C",
        "name": "유윤서",
        "school": "대전체육중학교",
        "rounds": [
          309,
          301,
          327,
          344
        ],
        "total": 1281,
        "sourceRank": 85
      },
      {
        "rank": 85,
        "target": "43D",
        "name": "박소을",
        "school": "양화중학교",
        "rounds": [
          320,
          306,
          319,
          336
        ],
        "total": 1281,
        "sourceRank": 85
      },
      {
        "rank": 87,
        "target": "18C",
        "name": "김규린",
        "school": "진주봉원중학교",
        "rounds": [
          310,
          292,
          327,
          350
        ],
        "total": 1279,
        "sourceRank": 87
      },
      {
        "rank": 88,
        "target": "60C",
        "name": "송수지",
        "school": "남천중학교",
        "rounds": [
          309,
          300,
          332,
          336
        ],
        "total": 1277,
        "sourceRank": 88
      },
      {
        "rank": 88,
        "target": "44A",
        "name": "유수진",
        "school": "여흥중학교",
        "rounds": [
          314,
          308,
          312,
          343
        ],
        "total": 1277,
        "sourceRank": 88
      },
      {
        "rank": 90,
        "target": "46C",
        "name": "임현서",
        "school": "대전체육중학교",
        "rounds": [
          301,
          305,
          334,
          336
        ],
        "total": 1276,
        "sourceRank": 90
      },
      {
        "rank": 90,
        "target": "53B",
        "name": "조수하",
        "school": "중원중학교",
        "rounds": [
          316,
          305,
          323,
          332
        ],
        "total": 1276,
        "sourceRank": 90
      },
      {
        "rank": 92,
        "target": "53D",
        "name": "정하은",
        "school": "예천여자중학교",
        "rounds": [
          308,
          304,
          320,
          343
        ],
        "total": 1275,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "64A",
        "name": "문현정",
        "school": "미리벌중학교",
        "rounds": [
          302,
          301,
          332,
          340
        ],
        "total": 1275,
        "sourceRank": 92
      },
      {
        "rank": 92,
        "target": "12B",
        "name": "황채영",
        "school": "구례여자중학교",
        "rounds": [
          318,
          309,
          310,
          338
        ],
        "total": 1275,
        "sourceRank": 92
      },
      {
        "rank": 95,
        "target": "38A",
        "name": "허정아",
        "school": "하성중학교",
        "rounds": [
          314,
          299,
          326,
          333
        ],
        "total": 1272,
        "sourceRank": 95
      },
      {
        "rank": 95,
        "target": "51B",
        "name": "이가은",
        "school": "수원시양궁협회",
        "rounds": [
          309,
          300,
          327,
          336
        ],
        "total": 1272,
        "sourceRank": 95
      },
      {
        "rank": 97,
        "target": "13B",
        "name": "허윤",
        "school": "구례여자중학교",
        "rounds": [
          317,
          307,
          314,
          332
        ],
        "total": 1270,
        "sourceRank": 97
      },
      {
        "rank": 98,
        "target": "33B",
        "name": "오한솔",
        "school": "대구체육중학교",
        "rounds": [
          304,
          294,
          329,
          342
        ],
        "total": 1269,
        "sourceRank": 98
      },
      {
        "rank": 98,
        "target": "20C",
        "name": "김소은",
        "school": "진주봉원중학교",
        "rounds": [
          307,
          297,
          326,
          339
        ],
        "total": 1269,
        "sourceRank": 98
      },
      {
        "rank": 98,
        "target": "31B",
        "name": "박소현",
        "school": "경포중학교",
        "rounds": [
          308,
          300,
          323,
          338
        ],
        "total": 1269,
        "sourceRank": 98
      },
      {
        "rank": 98,
        "target": "30D",
        "name": "진연아",
        "school": "광주체육중학교",
        "rounds": [
          314,
          295,
          327,
          333
        ],
        "total": 1269,
        "sourceRank": 98
      },
      {
        "rank": 102,
        "target": "19C",
        "name": "이수빈",
        "school": "진주봉원중학교",
        "rounds": [
          314,
          289,
          325,
          340
        ],
        "total": 1268,
        "sourceRank": 102
      },
      {
        "rank": 102,
        "target": "11B",
        "name": "서인교",
        "school": "구례여자중학교",
        "rounds": [
          313,
          295,
          318,
          342
        ],
        "total": 1268,
        "sourceRank": 102
      },
      {
        "rank": 104,
        "target": "61D",
        "name": "조현아",
        "school": "버들중학교",
        "rounds": [
          290,
          303,
          329,
          345
        ],
        "total": 1267,
        "sourceRank": 104
      },
      {
        "rank": 105,
        "target": "55A",
        "name": "심유리",
        "school": "방이중학교",
        "rounds": [
          321,
          288,
          315,
          340
        ],
        "total": 1264,
        "sourceRank": 105
      },
      {
        "rank": 106,
        "target": "49C",
        "name": "이아영",
        "school": "대전체육중학교",
        "rounds": [
          317,
          293,
          313,
          339
        ],
        "total": 1262,
        "sourceRank": 106
      },
      {
        "rank": 107,
        "target": "27B",
        "name": "한세빈",
        "school": "창용중학교",
        "rounds": [
          321,
          283,
          316,
          340
        ],
        "total": 1260,
        "sourceRank": 107
      },
      {
        "rank": 108,
        "target": "56A",
        "name": "양이정",
        "school": "방이중학교",
        "rounds": [
          299,
          299,
          323,
          338
        ],
        "total": 1259,
        "sourceRank": 108
      },
      {
        "rank": 109,
        "target": "33A",
        "name": "이세은",
        "school": "용암중학교",
        "rounds": [
          318,
          280,
          319,
          340
        ],
        "total": 1257,
        "sourceRank": 109
      },
      {
        "rank": 109,
        "target": "12D",
        "name": "유하원",
        "school": "상도중학교",
        "rounds": [
          304,
          294,
          321,
          338
        ],
        "total": 1257,
        "sourceRank": 109
      },
      {
        "rank": 111,
        "target": "31C",
        "name": "나연우",
        "school": "관악중학교",
        "rounds": [
          315,
          287,
          319,
          335
        ],
        "total": 1256,
        "sourceRank": 111
      },
      {
        "rank": 112,
        "target": "30A",
        "name": "최효주",
        "school": "경북체육중학교",
        "rounds": [
          319,
          281,
          315,
          338
        ],
        "total": 1253,
        "sourceRank": 112
      },
      {
        "rank": 112,
        "target": "49B",
        "name": "오승은",
        "school": "제주양궁클럽",
        "rounds": [
          299,
          307,
          318,
          329
        ],
        "total": 1253,
        "sourceRank": 112
      },
      {
        "rank": 114,
        "target": "44C",
        "name": "김래현",
        "school": "대전체육중학교",
        "rounds": [
          306,
          279,
          324,
          342
        ],
        "total": 1251,
        "sourceRank": 114
      },
      {
        "rank": 114,
        "target": "37D",
        "name": "이승혜",
        "school": "진해중학교",
        "rounds": [
          311,
          285,
          315,
          340
        ],
        "total": 1251,
        "sourceRank": 114
      },
      {
        "rank": 116,
        "target": "52A",
        "name": "김다솜",
        "school": "인천여자중학교",
        "rounds": [
          290,
          307,
          329,
          323
        ],
        "total": 1249,
        "sourceRank": 116
      },
      {
        "rank": 116,
        "target": "42D",
        "name": "손예은",
        "school": "광주동명중학교",
        "rounds": [
          305,
          294,
          318,
          332
        ],
        "total": 1249,
        "sourceRank": 116
      },
      {
        "rank": 116,
        "target": "29B",
        "name": "서예원",
        "school": "경포중학교",
        "rounds": [
          314,
          298,
          310,
          327
        ],
        "total": 1249,
        "sourceRank": 116
      },
      {
        "rank": 119,
        "target": "41C",
        "name": "윤세아",
        "school": "부일중학교",
        "rounds": [
          306,
          262,
          334,
          345
        ],
        "total": 1247,
        "sourceRank": 119
      },
      {
        "rank": 120,
        "target": "15B",
        "name": "정하연",
        "school": "대서중학교",
        "rounds": [
          309,
          294,
          312,
          331
        ],
        "total": 1246,
        "sourceRank": 120
      },
      {
        "rank": 121,
        "target": "38C",
        "name": "이가은",
        "school": "부일중학교",
        "rounds": [
          303,
          280,
          330,
          332
        ],
        "total": 1245,
        "sourceRank": 121
      },
      {
        "rank": 122,
        "target": "65D",
        "name": "강연우",
        "school": "버들중학교",
        "rounds": [
          298,
          276,
          318,
          352
        ],
        "total": 1244,
        "sourceRank": 122
      },
      {
        "rank": 122,
        "target": "16C",
        "name": "오윤아",
        "school": "무거중학교",
        "rounds": [
          300,
          280,
          325,
          339
        ],
        "total": 1244,
        "sourceRank": 122
      },
      {
        "rank": 122,
        "target": "41D",
        "name": "손세린",
        "school": "광주동명중학교",
        "rounds": [
          307,
          285,
          311,
          341
        ],
        "total": 1244,
        "sourceRank": 122
      },
      {
        "rank": 125,
        "target": "59B",
        "name": "이세형",
        "school": "신흥여자중학교",
        "rounds": [
          312,
          286,
          309,
          335
        ],
        "total": 1242,
        "sourceRank": 125
      },
      {
        "rank": 126,
        "target": "51D",
        "name": "최혜아",
        "school": "예천여자중학교",
        "rounds": [
          299,
          287,
          320,
          335
        ],
        "total": 1241,
        "sourceRank": 126
      },
      {
        "rank": 127,
        "target": "27A",
        "name": "성예나",
        "school": "경북체육중학교",
        "rounds": [
          310,
          269,
          323,
          338
        ],
        "total": 1240,
        "sourceRank": 127
      },
      {
        "rank": 128,
        "target": "28A",
        "name": "장채윤",
        "school": "경북체육중학교",
        "rounds": [
          308,
          282,
          317,
          330
        ],
        "total": 1237,
        "sourceRank": 128
      },
      {
        "rank": 128,
        "target": "19D",
        "name": "문다윤",
        "school": "모라중학교",
        "rounds": [
          301,
          294,
          321,
          321
        ],
        "total": 1237,
        "sourceRank": 128
      },
      {
        "rank": 130,
        "target": "14C",
        "name": "김예빈",
        "school": "무거중학교",
        "rounds": [
          311,
          273,
          315,
          334
        ],
        "total": 1233,
        "sourceRank": 130
      },
      {
        "rank": 130,
        "target": "39A",
        "name": "유하은",
        "school": "하성중학교",
        "rounds": [
          307,
          281,
          302,
          343
        ],
        "total": 1233,
        "sourceRank": 130
      },
      {
        "rank": 132,
        "target": "64C",
        "name": "이승희",
        "school": "안양서중학교",
        "rounds": [
          316,
          273,
          303,
          340
        ],
        "total": 1232,
        "sourceRank": 132
      },
      {
        "rank": 133,
        "target": "63B",
        "name": "김민정",
        "school": "신흥여자중학교",
        "rounds": [
          298,
          297,
          306,
          329
        ],
        "total": 1230,
        "sourceRank": 133
      },
      {
        "rank": 133,
        "target": "26C",
        "name": "임유빈",
        "school": "부산체육중학교",
        "rounds": [
          310,
          273,
          314,
          333
        ],
        "total": 1230,
        "sourceRank": 133
      },
      {
        "rank": 135,
        "target": "37A",
        "name": "석지우",
        "school": "하성중학교",
        "rounds": [
          316,
          275,
          308,
          329
        ],
        "total": 1228,
        "sourceRank": 135
      },
      {
        "rank": 136,
        "target": "35D",
        "name": "이혜승",
        "school": "진해중학교",
        "rounds": [
          276,
          277,
          331,
          341
        ],
        "total": 1225,
        "sourceRank": 136
      },
      {
        "rank": 137,
        "target": "56C",
        "name": "임예은",
        "school": "연일중학교",
        "rounds": [
          311,
          280,
          304,
          329
        ],
        "total": 1224,
        "sourceRank": 137
      },
      {
        "rank": 138,
        "target": "26A",
        "name": "최지아",
        "school": "임실군 양궁스포츠클럽",
        "rounds": [
          290,
          286,
          318,
          329
        ],
        "total": 1223,
        "sourceRank": 138
      },
      {
        "rank": 139,
        "target": "29C",
        "name": "최윤서",
        "school": "관악중학교",
        "rounds": [
          283,
          274,
          325,
          339
        ],
        "total": 1221,
        "sourceRank": 139
      },
      {
        "rank": 139,
        "target": "56B",
        "name": "유소율",
        "school": "대전대청중학교",
        "rounds": [
          304,
          276,
          312,
          329
        ],
        "total": 1221,
        "sourceRank": 139
      },
      {
        "rank": 141,
        "target": "62C",
        "name": "허지원",
        "school": "남천중학교",
        "rounds": [
          294,
          271,
          323,
          332
        ],
        "total": 1220,
        "sourceRank": 141
      },
      {
        "rank": 141,
        "target": "31D",
        "name": "김하온",
        "school": "광주체육중학교",
        "rounds": [
          312,
          274,
          300,
          334
        ],
        "total": 1220,
        "sourceRank": 141
      },
      {
        "rank": 143,
        "target": "30C",
        "name": "정예서",
        "school": "관악중학교",
        "rounds": [
          311,
          279,
          295,
          334
        ],
        "total": 1219,
        "sourceRank": 143
      },
      {
        "rank": 143,
        "target": "25B",
        "name": "한새론",
        "school": "창용중학교",
        "rounds": [
          296,
          272,
          317,
          334
        ],
        "total": 1219,
        "sourceRank": 143
      },
      {
        "rank": 143,
        "target": "59D",
        "name": "김도연",
        "school": "버들중학교",
        "rounds": [
          317,
          269,
          310,
          323
        ],
        "total": 1219,
        "sourceRank": 143
      },
      {
        "rank": 146,
        "target": "50A",
        "name": "유채민",
        "school": "인천여자중학교",
        "rounds": [
          297,
          277,
          316,
          328
        ],
        "total": 1218,
        "sourceRank": 146
      },
      {
        "rank": 147,
        "target": "42C",
        "name": "이가영",
        "school": "대전체육중학교",
        "rounds": [
          288,
          291,
          301,
          337
        ],
        "total": 1217,
        "sourceRank": 147
      },
      {
        "rank": 148,
        "target": "37B",
        "name": "박예은",
        "school": "대구체육중학교",
        "rounds": [
          296,
          283,
          302,
          335
        ],
        "total": 1216,
        "sourceRank": 148
      },
      {
        "rank": 148,
        "target": "44B",
        "name": "김서윤",
        "school": "홍성여자중학교",
        "rounds": [
          292,
          299,
          297,
          328
        ],
        "total": 1216,
        "sourceRank": 148
      },
      {
        "rank": 150,
        "target": "12A",
        "name": "오정주",
        "school": "서라벌여자중학교",
        "rounds": [
          309,
          277,
          311,
          318
        ],
        "total": 1215,
        "sourceRank": 150
      },
      {
        "rank": 150,
        "target": "36A",
        "name": "박재이",
        "school": "용암중학교",
        "rounds": [
          297,
          277,
          314,
          327
        ],
        "total": 1215,
        "sourceRank": 150
      },
      {
        "rank": 152,
        "target": "15D",
        "name": "권우솔",
        "school": "상도중학교",
        "rounds": [
          293,
          273,
          312,
          332
        ],
        "total": 1210,
        "sourceRank": 152
      },
      {
        "rank": 153,
        "target": "18D",
        "name": "최하민",
        "school": "면목중학교",
        "rounds": [
          293,
          285,
          309,
          322
        ],
        "total": 1209,
        "sourceRank": 153
      },
      {
        "rank": 154,
        "target": "55B",
        "name": "임소연",
        "school": "대전대청중학교",
        "rounds": [
          289,
          276,
          317,
          325
        ],
        "total": 1207,
        "sourceRank": 154
      },
      {
        "rank": 154,
        "target": "15A",
        "name": "박지영",
        "school": "서라벌여자중학교",
        "rounds": [
          301,
          278,
          308,
          320
        ],
        "total": 1207,
        "sourceRank": 154
      },
      {
        "rank": 156,
        "target": "24D",
        "name": "장혜주",
        "school": "모라중학교",
        "rounds": [
          313,
          264,
          310,
          318
        ],
        "total": 1205,
        "sourceRank": 156
      },
      {
        "rank": 157,
        "target": "34D",
        "name": "전하린",
        "school": "진해중학교",
        "rounds": [
          298,
          280,
          301,
          325
        ],
        "total": 1204,
        "sourceRank": 157
      },
      {
        "rank": 158,
        "target": "50C",
        "name": "이효민",
        "school": "대전체육중학교",
        "rounds": [
          284,
          276,
          310,
          333
        ],
        "total": 1203,
        "sourceRank": 158
      },
      {
        "rank": 158,
        "target": "64B",
        "name": "윤서영",
        "school": "신흥여자중학교",
        "rounds": [
          297,
          280,
          308,
          318
        ],
        "total": 1203,
        "sourceRank": 158
      },
      {
        "rank": 160,
        "target": "12C",
        "name": "노수연",
        "school": "오창중학교",
        "rounds": [
          303,
          270,
          294,
          333
        ],
        "total": 1200,
        "sourceRank": 160
      },
      {
        "rank": 161,
        "target": "62D",
        "name": "최서현",
        "school": "버들중학교",
        "rounds": [
          274,
          265,
          322,
          333
        ],
        "total": 1194,
        "sourceRank": 161
      },
      {
        "rank": 162,
        "target": "14D",
        "name": "김하늘",
        "school": "상도중학교",
        "rounds": [
          281,
          260,
          316,
          336
        ],
        "total": 1193,
        "sourceRank": 162
      },
      {
        "rank": 162,
        "target": "50D",
        "name": "권보배",
        "school": "예천여자중학교",
        "rounds": [
          287,
          275,
          312,
          319
        ],
        "total": 1193,
        "sourceRank": 162
      },
      {
        "rank": 164,
        "target": "16D",
        "name": "박시연",
        "school": "면목중학교",
        "rounds": [
          287,
          274,
          309,
          322
        ],
        "total": 1192,
        "sourceRank": 164
      },
      {
        "rank": 165,
        "target": "26B",
        "name": "윤이나",
        "school": "창용중학교",
        "rounds": [
          277,
          267,
          306,
          340
        ],
        "total": 1190,
        "sourceRank": 165
      },
      {
        "rank": 166,
        "target": "43C",
        "name": "김가연",
        "school": "대전체육중학교",
        "rounds": [
          292,
          270,
          293,
          333
        ],
        "total": 1188,
        "sourceRank": 166
      },
      {
        "rank": 166,
        "target": "18A",
        "name": "김지민",
        "school": "서라벌여자중학교",
        "rounds": [
          304,
          272,
          288,
          324
        ],
        "total": 1188,
        "sourceRank": 166
      },
      {
        "rank": 168,
        "target": "58A",
        "name": "정유하",
        "school": "방이중학교",
        "rounds": [
          299,
          271,
          290,
          325
        ],
        "total": 1185,
        "sourceRank": 168
      },
      {
        "rank": 169,
        "target": "52B",
        "name": "이주은",
        "school": "중원중학교",
        "rounds": [
          296,
          273,
          293,
          317
        ],
        "total": 1179,
        "sourceRank": 169
      },
      {
        "rank": 169,
        "target": "48B",
        "name": "김나경",
        "school": "제주양궁클럽",
        "rounds": [
          302,
          273,
          283,
          321
        ],
        "total": 1179,
        "sourceRank": 169
      },
      {
        "rank": 171,
        "target": "23D",
        "name": "변하늘",
        "school": "모라중학교",
        "rounds": [
          278,
          256,
          305,
          334
        ],
        "total": 1173,
        "sourceRank": 171
      },
      {
        "rank": 171,
        "target": "14B",
        "name": "심하연",
        "school": "대서중학교",
        "rounds": [
          268,
          280,
          302,
          323
        ],
        "total": 1173,
        "sourceRank": 171
      },
      {
        "rank": 173,
        "target": "13D",
        "name": "소리아",
        "school": "상도중학교",
        "rounds": [
          305,
          261,
          296,
          309
        ],
        "total": 1171,
        "sourceRank": 173
      },
      {
        "rank": 174,
        "target": "63D",
        "name": "박예나",
        "school": "버들중학교",
        "rounds": [
          286,
          260,
          295,
          319
        ],
        "total": 1160,
        "sourceRank": 174
      },
      {
        "rank": 174,
        "target": "65C",
        "name": "김혜림",
        "school": "안양서중학교",
        "rounds": [
          276,
          276,
          293,
          315
        ],
        "total": 1160,
        "sourceRank": 174
      },
      {
        "rank": 176,
        "target": "46B",
        "name": "김다인",
        "school": "홍성여자중학교",
        "rounds": [
          299,
          254,
          284,
          319
        ],
        "total": 1156,
        "sourceRank": 176
      },
      {
        "rank": 177,
        "target": "52D",
        "name": "김소율",
        "school": "예천여자중학교",
        "rounds": [
          273,
          267,
          291,
          323
        ],
        "total": 1154,
        "sourceRank": 177
      },
      {
        "rank": 178,
        "target": "60A",
        "name": "박하윤",
        "school": "방이중학교",
        "rounds": [
          286,
          284,
          287,
          292
        ],
        "total": 1149,
        "sourceRank": 178
      },
      {
        "rank": 179,
        "target": "65B",
        "name": "송서아",
        "school": "신흥여자중학교",
        "rounds": [
          276,
          271,
          294,
          304
        ],
        "total": 1145,
        "sourceRank": 179
      },
      {
        "rank": 180,
        "target": "32D",
        "name": "심려원",
        "school": "광주체육중학교",
        "rounds": [
          279,
          251,
          290,
          320
        ],
        "total": 1140,
        "sourceRank": 180
      },
      {
        "rank": 181,
        "target": "47A",
        "name": "함소이",
        "school": "여흥중학교",
        "rounds": [
          289,
          260,
          285,
          305
        ],
        "total": 1139,
        "sourceRank": 181
      },
      {
        "rank": 182,
        "target": "53A",
        "name": "권아윤",
        "school": "인천여자중학교",
        "rounds": [
          275,
          254,
          287,
          319
        ],
        "total": 1135,
        "sourceRank": 182
      },
      {
        "rank": 183,
        "target": "41B",
        "name": "유민영",
        "school": "전남체육중학교",
        "rounds": [
          273,
          235,
          289,
          322
        ],
        "total": 1119,
        "sourceRank": 183
      },
      {
        "rank": 184,
        "target": "54A",
        "name": "이윤서",
        "school": "인천여자중학교",
        "rounds": [
          265,
          267,
          270,
          314
        ],
        "total": 1116,
        "sourceRank": 184
      },
      {
        "rank": 185,
        "target": "38B",
        "name": "윤초아",
        "school": "전남체육중학교",
        "rounds": [
          269,
          255,
          282,
          308
        ],
        "total": 1114,
        "sourceRank": 185
      },
      {
        "rank": 186,
        "target": "40A",
        "name": "고나연",
        "school": "여흥중학교",
        "rounds": [
          263,
          256,
          266,
          325
        ],
        "total": 1110,
        "sourceRank": 186
      },
      {
        "rank": 187,
        "target": "63C",
        "name": "김세아",
        "school": "안양서중학교",
        "rounds": [
          284,
          248,
          269,
          307
        ],
        "total": 1108,
        "sourceRank": 187
      },
      {
        "rank": 188,
        "target": "17C",
        "name": "정지민",
        "school": "무거중학교",
        "rounds": [
          266,
          227,
          300,
          311
        ],
        "total": 1104,
        "sourceRank": 188
      },
      {
        "rank": 189,
        "target": "52C",
        "name": "기효원",
        "school": "창일중학교",
        "rounds": [
          256,
          246,
          289,
          308
        ],
        "total": 1099,
        "sourceRank": 189
      },
      {
        "rank": 190,
        "target": "60D",
        "name": "양서정",
        "school": "버들중학교",
        "rounds": [
          260,
          231,
          275,
          329
        ],
        "total": 1095,
        "sourceRank": 190
      },
      {
        "rank": 191,
        "target": "23C",
        "name": "정해린",
        "school": "청주중앙여자중학교",
        "rounds": [
          267,
          224,
          289,
          309
        ],
        "total": 1089,
        "sourceRank": 191
      },
      {
        "rank": 192,
        "target": "40B",
        "name": "박하은",
        "school": "전남체육중학교",
        "rounds": [
          272,
          251,
          251,
          305
        ],
        "total": 1079,
        "sourceRank": 192
      },
      {
        "rank": 193,
        "target": "22A",
        "name": "백수정",
        "school": "성사중학교",
        "rounds": [
          255,
          235,
          265,
          305
        ],
        "total": 1060,
        "sourceRank": 193
      },
      {
        "rank": 193,
        "target": "65A",
        "name": "손효주",
        "school": "미리벌중학교",
        "rounds": [
          280,
          211,
          258,
          311
        ],
        "total": 1060,
        "sourceRank": 193
      },
      {
        "rank": 195,
        "target": "35A",
        "name": "김세아",
        "school": "용암중학교",
        "rounds": [
          282,
          206,
          263,
          308
        ],
        "total": 1059,
        "sourceRank": 195
      },
      {
        "rank": 196,
        "target": "53C",
        "name": "김유민",
        "school": "창일중학교",
        "rounds": [
          241,
          224,
          291,
          300
        ],
        "total": 1056,
        "sourceRank": 196
      },
      {
        "rank": 197,
        "target": "42A",
        "name": "김지윤",
        "school": "여흥중학교",
        "rounds": [
          255,
          199,
          301,
          298
        ],
        "total": 1053,
        "sourceRank": 197
      },
      {
        "rank": 198,
        "target": "54C",
        "name": "최지우",
        "school": "창일중학교",
        "rounds": [
          237,
          232,
          281,
          302
        ],
        "total": 1052,
        "sourceRank": 198
      },
      {
        "rank": 199,
        "target": "14A",
        "name": "김도희",
        "school": "서라벌여자중학교",
        "rounds": [
          260,
          228,
          252,
          295
        ],
        "total": 1035,
        "sourceRank": 199
      },
      {
        "rank": 200,
        "target": "11C",
        "name": "김하늘",
        "school": "오창중학교",
        "rounds": [
          258,
          213,
          252,
          303
        ],
        "total": 1026,
        "sourceRank": 200
      },
      {
        "rank": 201,
        "target": "28C",
        "name": "임채원",
        "school": "관악중학교",
        "rounds": [
          248,
          149,
          287,
          318
        ],
        "total": 1002,
        "sourceRank": 201
      },
      {
        "rank": 202,
        "target": "43A",
        "name": "김하은",
        "school": "여흥중학교",
        "rounds": [
          246,
          217,
          241,
          278
        ],
        "total": 982,
        "sourceRank": 202
      },
      {
        "rank": 203,
        "target": "22C",
        "name": "서은비",
        "school": "청주중앙여자중학교",
        "rounds": [
          223,
          197,
          265,
          286
        ],
        "total": 971,
        "sourceRank": 203
      },
      {
        "rank": 204,
        "target": "24C",
        "name": "박수빈",
        "school": "하랑중학교",
        "rounds": [
          218,
          188,
          242,
          289
        ],
        "total": 937,
        "sourceRank": 204
      },
      {
        "rank": 205,
        "target": "16A",
        "name": "이서현",
        "school": "서라벌여자중학교",
        "rounds": [
          246,
          161,
          241,
          284
        ],
        "total": 932,
        "sourceRank": 205
      },
      {
        "rank": 206,
        "target": "47B",
        "name": "김승아",
        "school": "홍성여자중학교",
        "rounds": [
          216,
          179,
          213,
          272
        ],
        "total": 880,
        "sourceRank": 206
      },
      {
        "rank": 207,
        "target": "13A",
        "name": "최여원",
        "school": "서라벌여자중학교",
        "rounds": [
          0,
          169,
          264,
          281
        ],
        "total": 714,
        "sourceRank": 207
      },
      {
        "rank": 208,
        "target": "50B",
        "name": "강현서",
        "school": "제주양궁클럽",
        "rounds": [
          199,
          93,
          170,
          218
        ],
        "total": 680,
        "sourceRank": 208
      },
      {
        "rank": 209,
        "target": "59A",
        "name": "김별",
        "school": "방이중학교",
        "rounds": [
          0,
          0,
          238,
          294
        ],
        "total": 532,
        "sourceRank": 209
      },
      {
        "rank": 210,
        "target": "21C",
        "name": "박하윤",
        "school": "청주중앙여자중학교",
        "rounds": [
          0,
          0,
          242,
          278
        ],
        "total": 520,
        "sourceRank": 210
      },
      {
        "rank": 211,
        "target": "32C",
        "name": "김가율",
        "school": "관악중학교",
        "rounds": [
          0,
          0,
          218,
          264
        ],
        "total": 482,
        "sourceRank": 211
      },
      {
        "rank": 212,
        "target": "62A",
        "name": "변시진",
        "school": "미리벌중학교",
        "rounds": [
          314,
          9,
          0,
          0
        ],
        "total": 323,
        "sourceRank": 212
      },
      {
        "rank": 213,
        "target": "20D",
        "name": "강다윤",
        "school": "모라중학교",
        "rounds": [
          0,
          0,
          0,
          297
        ],
        "total": 297,
        "sourceRank": 213
      },
      {
        "rank": 214,
        "target": "11A",
        "name": "이지혜",
        "school": "서라벌여자중학교",
        "rounds": [
          0,
          0,
          0,
          271
        ],
        "total": 271,
        "sourceRank": 214
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar02w01q",
    "sheetLabel": "여자 리커브 중학부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "남",
    "division": "고등부",
    "rankingGroup": "고등부",
    "distances": [
      90,
      70,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "19B",
        "name": "김태서",
        "school": "충북체육고등학교",
        "rounds": [
          312,
          337,
          328,
          353
        ],
        "total": 1330,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "20A",
        "name": "김성용",
        "school": "광주체육고등학교",
        "rounds": [
          315,
          331,
          334,
          339
        ],
        "total": 1319,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "30B",
        "name": "임은재",
        "school": "인천영선고등학교",
        "rounds": [
          310,
          326,
          331,
          351
        ],
        "total": 1318,
        "sourceRank": 3
      },
      {
        "rank": 3,
        "target": "20B",
        "name": "조성윤",
        "school": "충북체육고등학교",
        "rounds": [
          303,
          337,
          329,
          349
        ],
        "total": 1318,
        "sourceRank": 3
      },
      {
        "rank": 5,
        "target": "26B",
        "name": "이지호",
        "school": "경북일고등학교",
        "rounds": [
          301,
          326,
          333,
          350
        ],
        "total": 1310,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "59B",
        "name": "조세현",
        "school": "서울체육고등학교",
        "rounds": [
          296,
          329,
          332,
          352
        ],
        "total": 1309,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "35A",
        "name": "여우영",
        "school": "강원체육고등학교",
        "rounds": [
          301,
          323,
          336,
          348
        ],
        "total": 1308,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "21A",
        "name": "심유한",
        "school": "광주체육고등학교",
        "rounds": [
          306,
          321,
          327,
          351
        ],
        "total": 1305,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "40A",
        "name": "김성준",
        "school": "경북체육고등학교",
        "rounds": [
          296,
          327,
          328,
          349
        ],
        "total": 1300,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "41B",
        "name": "김호균",
        "school": "경기체육고등학교",
        "rounds": [
          292,
          332,
          329,
          346
        ],
        "total": 1299,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "46A",
        "name": "김라온",
        "school": "대전체육고등학교",
        "rounds": [
          295,
          325,
          331,
          346
        ],
        "total": 1297,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "60B",
        "name": "윤성빈",
        "school": "서울체육고등학교",
        "rounds": [
          287,
          329,
          331,
          349
        ],
        "total": 1296,
        "sourceRank": 12
      },
      {
        "rank": 12,
        "target": "19A",
        "name": "박주혁",
        "school": "광주체육고등학교",
        "rounds": [
          297,
          323,
          328,
          348
        ],
        "total": 1296,
        "sourceRank": 12
      },
      {
        "rank": 14,
        "target": "24B",
        "name": "박상준",
        "school": "경북일고등학교",
        "rounds": [
          300,
          327,
          322,
          346
        ],
        "total": 1295,
        "sourceRank": 14
      },
      {
        "rank": 14,
        "target": "26A",
        "name": "유지백",
        "school": "병천고등학교",
        "rounds": [
          290,
          332,
          323,
          350
        ],
        "total": 1295,
        "sourceRank": 14
      },
      {
        "rank": 16,
        "target": "30A",
        "name": "정시우",
        "school": "효원고등학교",
        "rounds": [
          305,
          316,
          323,
          349
        ],
        "total": 1293,
        "sourceRank": 16
      },
      {
        "rank": 17,
        "target": "57B",
        "name": "성하준",
        "school": "서울체육고등학교",
        "rounds": [
          290,
          323,
          325,
          353
        ],
        "total": 1291,
        "sourceRank": 17
      },
      {
        "rank": 18,
        "target": "51A",
        "name": "김규성",
        "school": "서야고등학교",
        "rounds": [
          300,
          315,
          322,
          353
        ],
        "total": 1290,
        "sourceRank": 18
      },
      {
        "rank": 19,
        "target": "44A",
        "name": "권오율",
        "school": "대전체육고등학교",
        "rounds": [
          290,
          327,
          321,
          351
        ],
        "total": 1289,
        "sourceRank": 19
      },
      {
        "rank": 19,
        "target": "25B",
        "name": "황운재",
        "school": "경북일고등학교",
        "rounds": [
          283,
          327,
          332,
          347
        ],
        "total": 1289,
        "sourceRank": 19
      },
      {
        "rank": 21,
        "target": "58B",
        "name": "박명재",
        "school": "서울체육고등학교",
        "rounds": [
          279,
          328,
          333,
          348
        ],
        "total": 1288,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "39B",
        "name": "한경수",
        "school": "경기체육고등학교",
        "rounds": [
          276,
          327,
          333,
          350
        ],
        "total": 1286,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "28A",
        "name": "김세진",
        "school": "효원고등학교",
        "rounds": [
          291,
          322,
          322,
          350
        ],
        "total": 1285,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "36B",
        "name": "김시우",
        "school": "경기체육고등학교",
        "rounds": [
          277,
          327,
          329,
          351
        ],
        "total": 1284,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "46B",
        "name": "오예인",
        "school": "부산체육고등학교",
        "rounds": [
          291,
          315,
          325,
          353
        ],
        "total": 1284,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "56B",
        "name": "곽동범",
        "school": "경북고등학교",
        "rounds": [
          299,
          321,
          320,
          344
        ],
        "total": 1284,
        "sourceRank": 24
      },
      {
        "rank": 27,
        "target": "65B",
        "name": "장태하",
        "school": "서울체육고등학교",
        "rounds": [
          282,
          331,
          323,
          346
        ],
        "total": 1282,
        "sourceRank": 27
      },
      {
        "rank": 27,
        "target": "47B",
        "name": "신민재",
        "school": "부산체육고등학교",
        "rounds": [
          302,
          328,
          313,
          339
        ],
        "total": 1282,
        "sourceRank": 27
      },
      {
        "rank": 29,
        "target": "32A",
        "name": "김태현",
        "school": "효원고등학교",
        "rounds": [
          288,
          318,
          324,
          350
        ],
        "total": 1280,
        "sourceRank": 29
      },
      {
        "rank": 29,
        "target": "55B",
        "name": "박건우",
        "school": "경북고등학교",
        "rounds": [
          279,
          331,
          328,
          342
        ],
        "total": 1280,
        "sourceRank": 29
      },
      {
        "rank": 29,
        "target": "53A",
        "name": "조예성",
        "school": "경남체육고등학교",
        "rounds": [
          290,
          321,
          323,
          346
        ],
        "total": 1280,
        "sourceRank": 29
      },
      {
        "rank": 32,
        "target": "29A",
        "name": "주재윤",
        "school": "효원고등학교",
        "rounds": [
          291,
          326,
          318,
          344
        ],
        "total": 1279,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "45B",
        "name": "박정우",
        "school": "부산체육고등학교",
        "rounds": [
          293,
          312,
          323,
          350
        ],
        "total": 1278,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "48A",
        "name": "김동욱",
        "school": "대전체육고등학교",
        "rounds": [
          290,
          318,
          326,
          344
        ],
        "total": 1278,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "59A",
        "name": "이재헌",
        "school": "인천체육고등학교",
        "rounds": [
          288,
          327,
          324,
          339
        ],
        "total": 1278,
        "sourceRank": 33
      },
      {
        "rank": 36,
        "target": "37A",
        "name": "이태건",
        "school": "강원체육고등학교",
        "rounds": [
          277,
          329,
          326,
          345
        ],
        "total": 1277,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "38B",
        "name": "김준성",
        "school": "경기체육고등학교",
        "rounds": [
          283,
          318,
          326,
          349
        ],
        "total": 1276,
        "sourceRank": 37
      },
      {
        "rank": 37,
        "target": "45A",
        "name": "강유석",
        "school": "대전체육고등학교",
        "rounds": [
          276,
          324,
          330,
          346
        ],
        "total": 1276,
        "sourceRank": 37
      },
      {
        "rank": 37,
        "target": "61B",
        "name": "정승욱",
        "school": "서울체육고등학교",
        "rounds": [
          285,
          323,
          322,
          346
        ],
        "total": 1276,
        "sourceRank": 37
      },
      {
        "rank": 40,
        "target": "54B",
        "name": "이희범",
        "school": "경북고등학교",
        "rounds": [
          276,
          328,
          326,
          345
        ],
        "total": 1275,
        "sourceRank": 40
      },
      {
        "rank": 41,
        "target": "27B",
        "name": "최봉석",
        "school": "경북일고등학교",
        "rounds": [
          279,
          320,
          332,
          343
        ],
        "total": 1274,
        "sourceRank": 41
      },
      {
        "rank": 42,
        "target": "65A",
        "name": "변현빈",
        "school": "인천체육고등학교",
        "rounds": [
          276,
          322,
          322,
          351
        ],
        "total": 1271,
        "sourceRank": 42
      },
      {
        "rank": 42,
        "target": "31A",
        "name": "김은찬",
        "school": "효원고등학교",
        "rounds": [
          280,
          314,
          331,
          346
        ],
        "total": 1271,
        "sourceRank": 42
      },
      {
        "rank": 44,
        "target": "49A",
        "name": "노지원",
        "school": "대전체육고등학교",
        "rounds": [
          291,
          316,
          321,
          341
        ],
        "total": 1269,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "48B",
        "name": "이진혁",
        "school": "부산체육고등학교",
        "rounds": [
          285,
          323,
          316,
          341
        ],
        "total": 1265,
        "sourceRank": 45
      },
      {
        "rank": 45,
        "target": "25A",
        "name": "한승제",
        "school": "광주체육고등학교",
        "rounds": [
          291,
          306,
          322,
          346
        ],
        "total": 1265,
        "sourceRank": 45
      },
      {
        "rank": 47,
        "target": "47A",
        "name": "최우석",
        "school": "대전체육고등학교",
        "rounds": [
          279,
          318,
          320,
          347
        ],
        "total": 1264,
        "sourceRank": 47
      },
      {
        "rank": 47,
        "target": "34B",
        "name": "이채호",
        "school": "전북체육고등학교",
        "rounds": [
          296,
          308,
          317,
          343
        ],
        "total": 1264,
        "sourceRank": 47
      },
      {
        "rank": 47,
        "target": "43B",
        "name": "박정훈",
        "school": "경기체육고등학교",
        "rounds": [
          292,
          317,
          316,
          339
        ],
        "total": 1264,
        "sourceRank": 47
      },
      {
        "rank": 50,
        "target": "52A",
        "name": "이상원",
        "school": "서야고등학교",
        "rounds": [
          277,
          322,
          321,
          341
        ],
        "total": 1261,
        "sourceRank": 50
      },
      {
        "rank": 51,
        "target": "63B",
        "name": "신재윤",
        "school": "서울체육고등학교",
        "rounds": [
          271,
          318,
          326,
          345
        ],
        "total": 1260,
        "sourceRank": 51
      },
      {
        "rank": 52,
        "target": "54A",
        "name": "최시윤",
        "school": "경남체육고등학교",
        "rounds": [
          269,
          326,
          318,
          346
        ],
        "total": 1259,
        "sourceRank": 52
      },
      {
        "rank": 52,
        "target": "22A",
        "name": "윤동영",
        "school": "광주체육고등학교",
        "rounds": [
          282,
          321,
          309,
          347
        ],
        "total": 1259,
        "sourceRank": 52
      },
      {
        "rank": 54,
        "target": "55A",
        "name": "이구식",
        "school": "경남체육고등학교",
        "rounds": [
          282,
          323,
          312,
          339
        ],
        "total": 1256,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "33B",
        "name": "신승현",
        "school": "전북체육고등학교",
        "rounds": [
          280,
          320,
          316,
          338
        ],
        "total": 1254,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "40B",
        "name": "권용민",
        "school": "경기체육고등학교",
        "rounds": [
          286,
          316,
          317,
          332
        ],
        "total": 1251,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "37B",
        "name": "최제웅",
        "school": "경기체육고등학교",
        "rounds": [
          280,
          308,
          316,
          347
        ],
        "total": 1251,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "63A",
        "name": "박세현",
        "school": "인천체육고등학교",
        "rounds": [
          281,
          320,
          309,
          341
        ],
        "total": 1251,
        "sourceRank": 56
      },
      {
        "rank": 59,
        "target": "34A",
        "name": "윤정민",
        "school": "강원체육고등학교",
        "rounds": [
          270,
          319,
          317,
          342
        ],
        "total": 1248,
        "sourceRank": 59
      },
      {
        "rank": 59,
        "target": "50A",
        "name": "송석민",
        "school": "대전체육고등학교",
        "rounds": [
          288,
          315,
          308,
          337
        ],
        "total": 1248,
        "sourceRank": 59
      },
      {
        "rank": 61,
        "target": "36A",
        "name": "장대한",
        "school": "강원체육고등학교",
        "rounds": [
          280,
          310,
          317,
          339
        ],
        "total": 1246,
        "sourceRank": 61
      },
      {
        "rank": 62,
        "target": "64A",
        "name": "김주엽",
        "school": "인천체육고등학교",
        "rounds": [
          283,
          316,
          304,
          340
        ],
        "total": 1243,
        "sourceRank": 62
      },
      {
        "rank": 63,
        "target": "42B",
        "name": "강민우",
        "school": "경기체육고등학교",
        "rounds": [
          272,
          311,
          318,
          339
        ],
        "total": 1240,
        "sourceRank": 63
      },
      {
        "rank": 64,
        "target": "49B",
        "name": "강연수",
        "school": "부산체육고등학교",
        "rounds": [
          291,
          301,
          313,
          334
        ],
        "total": 1239,
        "sourceRank": 64
      },
      {
        "rank": 65,
        "target": "23B",
        "name": "조영신",
        "school": "충북체육고등학교",
        "rounds": [
          271,
          315,
          307,
          343
        ],
        "total": 1236,
        "sourceRank": 65
      },
      {
        "rank": 66,
        "target": "57A",
        "name": "고범찬",
        "school": "경남체육고등학교",
        "rounds": [
          273,
          315,
          309,
          336
        ],
        "total": 1233,
        "sourceRank": 66
      },
      {
        "rank": 67,
        "target": "58A",
        "name": "양지호",
        "school": "경남체육고등학교",
        "rounds": [
          267,
          307,
          314,
          342
        ],
        "total": 1230,
        "sourceRank": 67
      },
      {
        "rank": 68,
        "target": "62A",
        "name": "박리안",
        "school": "인천체육고등학교",
        "rounds": [
          241,
          317,
          332,
          339
        ],
        "total": 1229,
        "sourceRank": 68
      },
      {
        "rank": 68,
        "target": "61A",
        "name": "박진호",
        "school": "인천체육고등학교",
        "rounds": [
          259,
          318,
          311,
          341
        ],
        "total": 1229,
        "sourceRank": 68
      },
      {
        "rank": 70,
        "target": "29B",
        "name": "서익언",
        "school": "순천고등학교",
        "rounds": [
          270,
          306,
          314,
          337
        ],
        "total": 1227,
        "sourceRank": 70
      },
      {
        "rank": 70,
        "target": "60A",
        "name": "박건호",
        "school": "인천체육고등학교",
        "rounds": [
          281,
          303,
          312,
          331
        ],
        "total": 1227,
        "sourceRank": 70
      },
      {
        "rank": 72,
        "target": "41A",
        "name": "김동현",
        "school": "경북체육고등학교",
        "rounds": [
          268,
          310,
          313,
          335
        ],
        "total": 1226,
        "sourceRank": 72
      },
      {
        "rank": 73,
        "target": "27A",
        "name": "유희제",
        "school": "효원고등학교",
        "rounds": [
          274,
          303,
          313,
          334
        ],
        "total": 1224,
        "sourceRank": 73
      },
      {
        "rank": 74,
        "target": "42A",
        "name": "강동윤",
        "school": "경북체육고등학교",
        "rounds": [
          272,
          316,
          297,
          335
        ],
        "total": 1220,
        "sourceRank": 74
      },
      {
        "rank": 75,
        "target": "23A",
        "name": "김종연",
        "school": "광주체육고등학교",
        "rounds": [
          274,
          295,
          309,
          339
        ],
        "total": 1217,
        "sourceRank": 75
      },
      {
        "rank": 75,
        "target": "38A",
        "name": "최승원",
        "school": "강원체육고등학교",
        "rounds": [
          261,
          300,
          315,
          341
        ],
        "total": 1217,
        "sourceRank": 75
      },
      {
        "rank": 77,
        "target": "22B",
        "name": "오승준",
        "school": "충북체육고등학교",
        "rounds": [
          282,
          297,
          295,
          336
        ],
        "total": 1210,
        "sourceRank": 77
      },
      {
        "rank": 77,
        "target": "62B",
        "name": "전용현",
        "school": "서울체육고등학교",
        "rounds": [
          251,
          315,
          308,
          336
        ],
        "total": 1210,
        "sourceRank": 77
      },
      {
        "rank": 77,
        "target": "21B",
        "name": "김태균",
        "school": "충북체육고등학교",
        "rounds": [
          260,
          295,
          317,
          338
        ],
        "total": 1210,
        "sourceRank": 77
      },
      {
        "rank": 80,
        "target": "56A",
        "name": "이영욱",
        "school": "경남체육고등학교",
        "rounds": [
          257,
          312,
          314,
          322
        ],
        "total": 1205,
        "sourceRank": 80
      },
      {
        "rank": 80,
        "target": "35B",
        "name": "최시후",
        "school": "경기체육고등학교",
        "rounds": [
          263,
          292,
          314,
          336
        ],
        "total": 1205,
        "sourceRank": 80
      },
      {
        "rank": 82,
        "target": "64B",
        "name": "정우진",
        "school": "서울체육고등학교",
        "rounds": [
          270,
          284,
          312,
          333
        ],
        "total": 1199,
        "sourceRank": 82
      },
      {
        "rank": 83,
        "target": "28B",
        "name": "김기영",
        "school": "순천고등학교",
        "rounds": [
          242,
          307,
          306,
          341
        ],
        "total": 1196,
        "sourceRank": 83
      },
      {
        "rank": 84,
        "target": "24A",
        "name": "서하랑",
        "school": "광주체육고등학교",
        "rounds": [
          267,
          289,
          302,
          334
        ],
        "total": 1192,
        "sourceRank": 84
      },
      {
        "rank": 85,
        "target": "44B",
        "name": "강동주",
        "school": "울산스포츠과학고등학교",
        "rounds": [
          258,
          297,
          305,
          330
        ],
        "total": 1190,
        "sourceRank": 85
      },
      {
        "rank": 86,
        "target": "31B",
        "name": "신희범",
        "school": "인천영선고등학교",
        "rounds": [
          262,
          284,
          302,
          336
        ],
        "total": 1184,
        "sourceRank": 86
      },
      {
        "rank": 87,
        "target": "51B",
        "name": "곽우승",
        "school": "부산체육고등학교",
        "rounds": [
          260,
          296,
          294,
          323
        ],
        "total": 1173,
        "sourceRank": 87
      },
      {
        "rank": 88,
        "target": "33A",
        "name": "최준원",
        "school": "강원체육고등학교",
        "rounds": [
          251,
          305,
          295,
          320
        ],
        "total": 1171,
        "sourceRank": 88
      },
      {
        "rank": 89,
        "target": "50B",
        "name": "최성민",
        "school": "부산체육고등학교",
        "rounds": [
          237,
          299,
          293,
          335
        ],
        "total": 1164,
        "sourceRank": 89
      },
      {
        "rank": 90,
        "target": "39A",
        "name": "나근도",
        "school": "강원체육고등학교",
        "rounds": [
          222,
          294,
          291,
          335
        ],
        "total": 1142,
        "sourceRank": 90
      },
      {
        "rank": 91,
        "target": "53B",
        "name": "김범진",
        "school": "경북고등학교",
        "rounds": [
          257,
          276,
          264,
          334
        ],
        "total": 1131,
        "sourceRank": 91
      },
      {
        "rank": 92,
        "target": "43A",
        "name": "김제준",
        "school": "경북체육고등학교",
        "rounds": [
          229,
          277,
          280,
          317
        ],
        "total": 1103,
        "sourceRank": 92
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar03m01q",
    "sheetLabel": "남자 리커브 고등부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "고등부",
    "rankingGroup": "고등부",
    "distances": [
      70,
      60,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "29A",
        "name": "윤가영",
        "school": "홍성여자고등학교",
        "rounds": [
          331,
          343,
          334,
          354
        ],
        "total": 1362,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "30B",
        "name": "고하린",
        "school": "대전체육고등학교",
        "rounds": [
          326,
          341,
          331,
          350
        ],
        "total": 1348,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "62B",
        "name": "김수민",
        "school": "부산체육고등학교",
        "rounds": [
          328,
          338,
          327,
          353
        ],
        "total": 1346,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "16A",
        "name": "김민서",
        "school": "대구체육고등학교",
        "rounds": [
          334,
          337,
          320,
          352
        ],
        "total": 1343,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "59A",
        "name": "구슬",
        "school": "경기체육고등학교",
        "rounds": [
          332,
          339,
          322,
          349
        ],
        "total": 1342,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "35A",
        "name": "양가은",
        "school": "부개고등학교",
        "rounds": [
          335,
          339,
          318,
          349
        ],
        "total": 1341,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "34B",
        "name": "하윤진",
        "school": "서울체육고등학교",
        "rounds": [
          339,
          342,
          318,
          341
        ],
        "total": 1340,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "21A",
        "name": "김가영",
        "school": "경북체육고등학교",
        "rounds": [
          333,
          333,
          321,
          352
        ],
        "total": 1339,
        "sourceRank": 8
      },
      {
        "rank": 8,
        "target": "63A",
        "name": "김은찬",
        "school": "경기체육고등학교",
        "rounds": [
          321,
          339,
          330,
          349
        ],
        "total": 1339,
        "sourceRank": 8
      },
      {
        "rank": 10,
        "target": "39B",
        "name": "양다혜",
        "school": "진해여자고등학교",
        "rounds": [
          332,
          339,
          321,
          346
        ],
        "total": 1338,
        "sourceRank": 10
      },
      {
        "rank": 10,
        "target": "54B",
        "name": "유예린",
        "school": "전북체육고등학교",
        "rounds": [
          325,
          337,
          321,
          355
        ],
        "total": 1338,
        "sourceRank": 10
      },
      {
        "rank": 12,
        "target": "40B",
        "name": "김지은",
        "school": "진해여자고등학교",
        "rounds": [
          330,
          344,
          317,
          346
        ],
        "total": 1337,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "31B",
        "name": "박지율",
        "school": "대전체육고등학교",
        "rounds": [
          327,
          340,
          320,
          349
        ],
        "total": 1336,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "60A",
        "name": "한지예",
        "school": "경기체육고등학교",
        "rounds": [
          328,
          342,
          322,
          342
        ],
        "total": 1334,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "33A",
        "name": "백예하",
        "school": "부개고등학교",
        "rounds": [
          330,
          335,
          317,
          350
        ],
        "total": 1332,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "32B",
        "name": "김민정",
        "school": "대전체육고등학교",
        "rounds": [
          327,
          335,
          317,
          351
        ],
        "total": 1330,
        "sourceRank": 16
      },
      {
        "rank": 17,
        "target": "38B",
        "name": "정세리",
        "school": "진해여자고등학교",
        "rounds": [
          331,
          331,
          317,
          350
        ],
        "total": 1329,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "58A",
        "name": "최윤서",
        "school": "경기체육고등학교",
        "rounds": [
          321,
          340,
          320,
          348
        ],
        "total": 1329,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "64B",
        "name": "구보름",
        "school": "부산체육고등학교",
        "rounds": [
          323,
          336,
          326,
          344
        ],
        "total": 1329,
        "sourceRank": 17
      },
      {
        "rank": 20,
        "target": "65B",
        "name": "김예인",
        "school": "부산체육고등학교",
        "rounds": [
          325,
          335,
          323,
          345
        ],
        "total": 1328,
        "sourceRank": 20
      },
      {
        "rank": 21,
        "target": "24B",
        "name": "박세빈",
        "school": "전남체육고등학교",
        "rounds": [
          315,
          339,
          321,
          351
        ],
        "total": 1326,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "33B",
        "name": "최은",
        "school": "서울체육고등학교",
        "rounds": [
          326,
          343,
          317,
          339
        ],
        "total": 1325,
        "sourceRank": 22
      },
      {
        "rank": 22,
        "target": "62A",
        "name": "양태희",
        "school": "경기체육고등학교",
        "rounds": [
          314,
          343,
          322,
          346
        ],
        "total": 1325,
        "sourceRank": 22
      },
      {
        "rank": 22,
        "target": "34A",
        "name": "김아현",
        "school": "부개고등학교",
        "rounds": [
          312,
          340,
          325,
          348
        ],
        "total": 1325,
        "sourceRank": 22
      },
      {
        "rank": 22,
        "target": "48A",
        "name": "김예원",
        "school": "여강고등학교",
        "rounds": [
          324,
          339,
          320,
          342
        ],
        "total": 1325,
        "sourceRank": 22
      },
      {
        "rank": 26,
        "target": "49B",
        "name": "목지윤",
        "school": "인일여자고등학교",
        "rounds": [
          323,
          338,
          316,
          347
        ],
        "total": 1324,
        "sourceRank": 26
      },
      {
        "rank": 27,
        "target": "23A",
        "name": "안현지",
        "school": "전북펫고등학교",
        "rounds": [
          324,
          329,
          322,
          348
        ],
        "total": 1323,
        "sourceRank": 27
      },
      {
        "rank": 27,
        "target": "16B",
        "name": "이가영",
        "school": "예천여자고등학교",
        "rounds": [
          324,
          337,
          314,
          348
        ],
        "total": 1323,
        "sourceRank": 27
      },
      {
        "rank": 27,
        "target": "19B",
        "name": "장예린",
        "school": "충북체육고등학교",
        "rounds": [
          329,
          334,
          317,
          343
        ],
        "total": 1323,
        "sourceRank": 27
      },
      {
        "rank": 30,
        "target": "35B",
        "name": "김지원",
        "school": "서울체육고등학교",
        "rounds": [
          326,
          330,
          321,
          344
        ],
        "total": 1321,
        "sourceRank": 30
      },
      {
        "rank": 31,
        "target": "42B",
        "name": "김세아",
        "school": "울산스포츠과학고등학교",
        "rounds": [
          330,
          331,
          320,
          339
        ],
        "total": 1320,
        "sourceRank": 31
      },
      {
        "rank": 32,
        "target": "39A",
        "name": "전지현",
        "school": "광주체육고등학교",
        "rounds": [
          322,
          340,
          314,
          343
        ],
        "total": 1319,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "19A",
        "name": "신여은",
        "school": "대구체육고등학교",
        "rounds": [
          322,
          338,
          313,
          345
        ],
        "total": 1318,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "45B",
        "name": "강은지",
        "school": "경남체육고등학교",
        "rounds": [
          320,
          336,
          317,
          345
        ],
        "total": 1318,
        "sourceRank": 33
      },
      {
        "rank": 35,
        "target": "43B",
        "name": "나윤경",
        "school": "울산스포츠과학고등학교",
        "rounds": [
          332,
          327,
          318,
          340
        ],
        "total": 1317,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "15A",
        "name": "이채은",
        "school": "대구체육고등학교",
        "rounds": [
          319,
          336,
          319,
          342
        ],
        "total": 1316,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "63B",
        "name": "배소윤",
        "school": "부산체육고등학교",
        "rounds": [
          330,
          329,
          320,
          337
        ],
        "total": 1316,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "41A",
        "name": "강수정",
        "school": "광주체육고등학교",
        "rounds": [
          324,
          324,
          322,
          346
        ],
        "total": 1316,
        "sourceRank": 36
      },
      {
        "rank": 39,
        "target": "64A",
        "name": "박지원",
        "school": "경기체육고등학교",
        "rounds": [
          316,
          339,
          312,
          348
        ],
        "total": 1315,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "49A",
        "name": "박석영",
        "school": "여강고등학교",
        "rounds": [
          316,
          336,
          319,
          343
        ],
        "total": 1314,
        "sourceRank": 40
      },
      {
        "rank": 40,
        "target": "30A",
        "name": "김재이",
        "school": "홍성여자고등학교",
        "rounds": [
          312,
          332,
          324,
          346
        ],
        "total": 1314,
        "sourceRank": 40
      },
      {
        "rank": 42,
        "target": "53A",
        "name": "김가을",
        "school": "강원체육고등학교",
        "rounds": [
          317,
          337,
          320,
          338
        ],
        "total": 1312,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "29B",
        "name": "김영은",
        "school": "대전체육고등학교",
        "rounds": [
          316,
          336,
          315,
          344
        ],
        "total": 1311,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "57B",
        "name": "김나은",
        "school": "경주여자고등학교",
        "rounds": [
          317,
          334,
          318,
          341
        ],
        "total": 1310,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "20A",
        "name": "김은지",
        "school": "대구체육고등학교",
        "rounds": [
          318,
          335,
          314,
          338
        ],
        "total": 1305,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "31A",
        "name": "정혜정",
        "school": "성문고등학교",
        "rounds": [
          321,
          331,
          306,
          341
        ],
        "total": 1299,
        "sourceRank": 46
      },
      {
        "rank": 46,
        "target": "57A",
        "name": "김정빈",
        "school": "경기체육고등학교",
        "rounds": [
          329,
          329,
          307,
          334
        ],
        "total": 1299,
        "sourceRank": 46
      },
      {
        "rank": 48,
        "target": "61A",
        "name": "이경현",
        "school": "경기체육고등학교",
        "rounds": [
          317,
          327,
          309,
          342
        ],
        "total": 1295,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "17A",
        "name": "이지원",
        "school": "대구체육고등학교",
        "rounds": [
          306,
          329,
          311,
          348
        ],
        "total": 1294,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "65A",
        "name": "박선영",
        "school": "경기체육고등학교",
        "rounds": [
          324,
          322,
          310,
          336
        ],
        "total": 1292,
        "sourceRank": 50
      },
      {
        "rank": 51,
        "target": "40A",
        "name": "송하린",
        "school": "광주체육고등학교",
        "rounds": [
          320,
          334,
          301,
          336
        ],
        "total": 1291,
        "sourceRank": 51
      },
      {
        "rank": 52,
        "target": "22A",
        "name": "나혜빈",
        "school": "전북펫고등학교",
        "rounds": [
          320,
          326,
          307,
          336
        ],
        "total": 1289,
        "sourceRank": 52
      },
      {
        "rank": 52,
        "target": "18B",
        "name": "김예원",
        "school": "예천여자고등학교",
        "rounds": [
          306,
          329,
          311,
          343
        ],
        "total": 1289,
        "sourceRank": 52
      },
      {
        "rank": 54,
        "target": "53B",
        "name": "배현지",
        "school": "전북체육고등학교",
        "rounds": [
          322,
          333,
          301,
          330
        ],
        "total": 1286,
        "sourceRank": 54
      },
      {
        "rank": 54,
        "target": "46A",
        "name": "김혜윤",
        "school": "여강고등학교",
        "rounds": [
          313,
          322,
          309,
          342
        ],
        "total": 1286,
        "sourceRank": 54
      },
      {
        "rank": 56,
        "target": "18A",
        "name": "임예율",
        "school": "대구체육고등학교",
        "rounds": [
          299,
          336,
          303,
          347
        ],
        "total": 1285,
        "sourceRank": 56
      },
      {
        "rank": 57,
        "target": "22B",
        "name": "강주은",
        "school": "전남체육고등학교",
        "rounds": [
          307,
          323,
          313,
          338
        ],
        "total": 1281,
        "sourceRank": 57
      },
      {
        "rank": 58,
        "target": "25B",
        "name": "고민지",
        "school": "하성고등학교",
        "rounds": [
          303,
          337,
          292,
          347
        ],
        "total": 1279,
        "sourceRank": 58
      },
      {
        "rank": 58,
        "target": "61B",
        "name": "김정은",
        "school": "부산체육고등학교",
        "rounds": [
          302,
          332,
          303,
          342
        ],
        "total": 1279,
        "sourceRank": 58
      },
      {
        "rank": 60,
        "target": "52B",
        "name": "이시우",
        "school": "인일여자고등학교",
        "rounds": [
          316,
          323,
          306,
          333
        ],
        "total": 1278,
        "sourceRank": 60
      },
      {
        "rank": 61,
        "target": "47A",
        "name": "한정연",
        "school": "여강고등학교",
        "rounds": [
          322,
          324,
          296,
          335
        ],
        "total": 1277,
        "sourceRank": 61
      },
      {
        "rank": 62,
        "target": "54A",
        "name": "박채린",
        "school": "강원체육고등학교",
        "rounds": [
          313,
          329,
          301,
          333
        ],
        "total": 1276,
        "sourceRank": 62
      },
      {
        "rank": 63,
        "target": "27B",
        "name": "김수연",
        "school": "제주양궁클럽",
        "rounds": [
          306,
          318,
          314,
          335
        ],
        "total": 1273,
        "sourceRank": 63
      },
      {
        "rank": 64,
        "target": "28A",
        "name": "이현주",
        "school": "성남시체육회",
        "rounds": [
          317,
          314,
          300,
          341
        ],
        "total": 1272,
        "sourceRank": 64
      },
      {
        "rank": 65,
        "target": "32A",
        "name": "정은정",
        "school": "성문고등학교",
        "rounds": [
          311,
          309,
          310,
          340
        ],
        "total": 1270,
        "sourceRank": 65
      },
      {
        "rank": 65,
        "target": "42A",
        "name": "강선우",
        "school": "광주체육고등학교",
        "rounds": [
          309,
          333,
          289,
          339
        ],
        "total": 1270,
        "sourceRank": 65
      },
      {
        "rank": 65,
        "target": "51B",
        "name": "김예린",
        "school": "인일여자고등학교",
        "rounds": [
          307,
          330,
          295,
          338
        ],
        "total": 1270,
        "sourceRank": 65
      },
      {
        "rank": 68,
        "target": "51A",
        "name": "이다은",
        "school": "순천여자고등학교",
        "rounds": [
          312,
          329,
          290,
          338
        ],
        "total": 1269,
        "sourceRank": 68
      },
      {
        "rank": 69,
        "target": "44B",
        "name": "임나연",
        "school": "울산스포츠과학고등학교",
        "rounds": [
          306,
          318,
          298,
          345
        ],
        "total": 1267,
        "sourceRank": 69
      },
      {
        "rank": 69,
        "target": "60B",
        "name": "김가은",
        "school": "부산체육고등학교",
        "rounds": [
          312,
          316,
          299,
          340
        ],
        "total": 1267,
        "sourceRank": 69
      },
      {
        "rank": 69,
        "target": "46B",
        "name": "이서현",
        "school": "경남체육고등학교",
        "rounds": [
          308,
          320,
          310,
          329
        ],
        "total": 1267,
        "sourceRank": 69
      },
      {
        "rank": 72,
        "target": "55B",
        "name": "서지우",
        "school": "전북체육고등학교",
        "rounds": [
          303,
          318,
          303,
          341
        ],
        "total": 1265,
        "sourceRank": 72
      },
      {
        "rank": 73,
        "target": "58B",
        "name": "이예슬",
        "school": "경주여자고등학교",
        "rounds": [
          303,
          325,
          292,
          341
        ],
        "total": 1261,
        "sourceRank": 73
      },
      {
        "rank": 74,
        "target": "36A",
        "name": "신서영",
        "school": "부개고등학교",
        "rounds": [
          299,
          329,
          287,
          343
        ],
        "total": 1258,
        "sourceRank": 74
      },
      {
        "rank": 75,
        "target": "52A",
        "name": "김라함",
        "school": "강원체육고등학교",
        "rounds": [
          299,
          310,
          315,
          331
        ],
        "total": 1255,
        "sourceRank": 75
      },
      {
        "rank": 76,
        "target": "23B",
        "name": "이마리",
        "school": "전남체육고등학교",
        "rounds": [
          298,
          319,
          299,
          335
        ],
        "total": 1251,
        "sourceRank": 76
      },
      {
        "rank": 77,
        "target": "37B",
        "name": "신혜민",
        "school": "서울체육고등학교",
        "rounds": [
          299,
          322,
          290,
          335
        ],
        "total": 1246,
        "sourceRank": 77
      },
      {
        "rank": 78,
        "target": "36B",
        "name": "김서현",
        "school": "서울체육고등학교",
        "rounds": [
          304,
          313,
          297,
          330
        ],
        "total": 1244,
        "sourceRank": 78
      },
      {
        "rank": 79,
        "target": "38A",
        "name": "김성령",
        "school": "광주체육고등학교",
        "rounds": [
          304,
          309,
          301,
          327
        ],
        "total": 1241,
        "sourceRank": 79
      },
      {
        "rank": 80,
        "target": "48B",
        "name": "윤예서",
        "school": "인일여자고등학교",
        "rounds": [
          295,
          317,
          293,
          334
        ],
        "total": 1239,
        "sourceRank": 80
      },
      {
        "rank": 81,
        "target": "15B",
        "name": "정서은",
        "school": "예천여자고등학교",
        "rounds": [
          301,
          313,
          290,
          325
        ],
        "total": 1229,
        "sourceRank": 81
      },
      {
        "rank": 81,
        "target": "20B",
        "name": "방초현",
        "school": "충북체육고등학교",
        "rounds": [
          277,
          315,
          302,
          335
        ],
        "total": 1229,
        "sourceRank": 81
      },
      {
        "rank": 83,
        "target": "26A",
        "name": "박하율",
        "school": "임실군 양궁스포츠클럽",
        "rounds": [
          303,
          311,
          285,
          329
        ],
        "total": 1228,
        "sourceRank": 83
      },
      {
        "rank": 84,
        "target": "37A",
        "name": "박경빈",
        "school": "부개고등학교",
        "rounds": [
          310,
          314,
          278,
          322
        ],
        "total": 1224,
        "sourceRank": 84
      },
      {
        "rank": 85,
        "target": "55A",
        "name": "최예원",
        "school": "강원체육고등학교",
        "rounds": [
          290,
          315,
          292,
          325
        ],
        "total": 1222,
        "sourceRank": 85
      },
      {
        "rank": 86,
        "target": "26B",
        "name": "정지민",
        "school": "병천고등학교",
        "rounds": [
          297,
          321,
          271,
          332
        ],
        "total": 1221,
        "sourceRank": 86
      },
      {
        "rank": 87,
        "target": "28B",
        "name": "김다연",
        "school": "대전체육고등학교",
        "rounds": [
          285,
          310,
          286,
          332
        ],
        "total": 1213,
        "sourceRank": 87
      },
      {
        "rank": 88,
        "target": "24A",
        "name": "엄수정",
        "school": "원주여자고등학교",
        "rounds": [
          289,
          297,
          287,
          330
        ],
        "total": 1203,
        "sourceRank": 88
      },
      {
        "rank": 89,
        "target": "21B",
        "name": "오선주",
        "school": "충북체육고등학교",
        "rounds": [
          287,
          300,
          282,
          332
        ],
        "total": 1201,
        "sourceRank": 89
      },
      {
        "rank": 90,
        "target": "47B",
        "name": "이재흔",
        "school": "경남체육고등학교",
        "rounds": [
          298,
          293,
          275,
          332
        ],
        "total": 1198,
        "sourceRank": 90
      },
      {
        "rank": 91,
        "target": "56B",
        "name": "우본희",
        "school": "전북체육고등학교",
        "rounds": [
          277,
          291,
          285,
          334
        ],
        "total": 1187,
        "sourceRank": 91
      },
      {
        "rank": 92,
        "target": "43A",
        "name": "홍다은",
        "school": "광주체육고등학교",
        "rounds": [
          275,
          329,
          271,
          308
        ],
        "total": 1183,
        "sourceRank": 92
      },
      {
        "rank": 93,
        "target": "41B",
        "name": "김민아",
        "school": "진해여자고등학교",
        "rounds": [
          281,
          307,
          274,
          320
        ],
        "total": 1182,
        "sourceRank": 93
      },
      {
        "rank": 94,
        "target": "44A",
        "name": "천예서",
        "school": "광주체육고등학교",
        "rounds": [
          296,
          304,
          243,
          316
        ],
        "total": 1159,
        "sourceRank": 94
      },
      {
        "rank": 95,
        "target": "27A",
        "name": "정서윤",
        "school": "성남시체육회",
        "rounds": [
          245,
          285,
          286,
          334
        ],
        "total": 1150,
        "sourceRank": 95
      },
      {
        "rank": 96,
        "target": "59B",
        "name": "이지현",
        "school": "경주여자고등학교",
        "rounds": [
          268,
          282,
          262,
          327
        ],
        "total": 1139,
        "sourceRank": 96
      },
      {
        "rank": 97,
        "target": "45A",
        "name": "오시연",
        "school": "여강고등학교",
        "rounds": [
          258,
          300,
          271,
          300
        ],
        "total": 1129,
        "sourceRank": 97
      },
      {
        "rank": 98,
        "target": "56A",
        "name": "정하은",
        "school": "강원체육고등학교",
        "rounds": [
          269,
          259,
          261,
          315
        ],
        "total": 1104,
        "sourceRank": 98
      },
      {
        "rank": 99,
        "target": "50B",
        "name": "이승진",
        "school": "인일여자고등학교",
        "rounds": [
          284,
          294,
          222,
          294
        ],
        "total": 1094,
        "sourceRank": 99
      },
      {
        "rank": 100,
        "target": "25A",
        "name": "임지우",
        "school": "원주여자고등학교",
        "rounds": [
          246,
          276,
          232,
          320
        ],
        "total": 1074,
        "sourceRank": 100
      },
      {
        "rank": 101,
        "target": "50A",
        "name": "김상은",
        "school": "순천여자고등학교",
        "rounds": [
          233,
          251,
          166,
          272
        ],
        "total": 922,
        "sourceRank": 101
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar03w01q",
    "sheetLabel": "여자 리커브 고등부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "남",
    "division": "대학부",
    "rankingGroup": "대학부",
    "distances": [
      90,
      70,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "36B",
        "name": "김기범",
        "school": "계명대학교",
        "rounds": [
          318,
          340,
          342,
          357
        ],
        "total": 1357,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "40B",
        "name": "지예찬",
        "school": "한국체육대학교",
        "rounds": [
          302,
          338,
          339,
          357
        ],
        "total": 1336,
        "sourceRank": 2
      },
      {
        "rank": 2,
        "target": "28B",
        "name": "김동훈",
        "school": "국립경국대학교",
        "rounds": [
          304,
          336,
          338,
          358
        ],
        "total": 1336,
        "sourceRank": 2
      },
      {
        "rank": 4,
        "target": "29B",
        "name": "조윤혁",
        "school": "국립경국대학교",
        "rounds": [
          304,
          330,
          344,
          357
        ],
        "total": 1335,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "37B",
        "name": "송지성",
        "school": "계명대학교",
        "rounds": [
          302,
          334,
          342,
          355
        ],
        "total": 1333,
        "sourceRank": 5
      },
      {
        "rank": 5,
        "target": "41B",
        "name": "민성욱",
        "school": "한국체육대학교",
        "rounds": [
          309,
          329,
          338,
          357
        ],
        "total": 1333,
        "sourceRank": 5
      },
      {
        "rank": 7,
        "target": "42C",
        "name": "조민수",
        "school": "조선대학교",
        "rounds": [
          302,
          336,
          339,
          354
        ],
        "total": 1331,
        "sourceRank": 7
      },
      {
        "rank": 7,
        "target": "32B",
        "name": "이주성",
        "school": "국립경국대학교",
        "rounds": [
          307,
          330,
          342,
          352
        ],
        "total": 1331,
        "sourceRank": 7
      },
      {
        "rank": 9,
        "target": "34A",
        "name": "최철준",
        "school": "배재대학교",
        "rounds": [
          316,
          330,
          344,
          340
        ],
        "total": 1330,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "41A",
        "name": "정호진",
        "school": "울산대학교",
        "rounds": [
          299,
          335,
          338,
          354
        ],
        "total": 1326,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "35C",
        "name": "박재형",
        "school": "경희대학교",
        "rounds": [
          309,
          329,
          334,
          351
        ],
        "total": 1323,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "33C",
        "name": "김예찬",
        "school": "경희대학교",
        "rounds": [
          312,
          335,
          319,
          352
        ],
        "total": 1318,
        "sourceRank": 12
      },
      {
        "rank": 12,
        "target": "43B",
        "name": "김종우",
        "school": "한국체육대학교",
        "rounds": [
          306,
          325,
          336,
          351
        ],
        "total": 1318,
        "sourceRank": 12
      },
      {
        "rank": 14,
        "target": "42B",
        "name": "김선혁",
        "school": "한국체육대학교",
        "rounds": [
          302,
          332,
          334,
          346
        ],
        "total": 1314,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "35B",
        "name": "신준",
        "school": "계명대학교",
        "rounds": [
          296,
          329,
          335,
          352
        ],
        "total": 1312,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "43A",
        "name": "최시후",
        "school": "울산대학교",
        "rounds": [
          312,
          325,
          322,
          353
        ],
        "total": 1312,
        "sourceRank": 15
      },
      {
        "rank": 17,
        "target": "37C",
        "name": "윤성환",
        "school": "경희대학교",
        "rounds": [
          297,
          326,
          334,
          354
        ],
        "total": 1311,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "36A",
        "name": "최우석",
        "school": "배재대학교",
        "rounds": [
          290,
          330,
          336,
          355
        ],
        "total": 1311,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "36C",
        "name": "권태연",
        "school": "경희대학교",
        "rounds": [
          299,
          330,
          334,
          348
        ],
        "total": 1311,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "34C",
        "name": "이효범",
        "school": "경희대학교",
        "rounds": [
          300,
          325,
          333,
          353
        ],
        "total": 1311,
        "sourceRank": 17
      },
      {
        "rank": 21,
        "target": "40C",
        "name": "정세윤",
        "school": "인천대학교",
        "rounds": [
          289,
          333,
          334,
          354
        ],
        "total": 1310,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "34B",
        "name": "장준하",
        "school": "계명대학교",
        "rounds": [
          288,
          333,
          337,
          350
        ],
        "total": 1308,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "33A",
        "name": "이정한",
        "school": "배재대학교",
        "rounds": [
          290,
          331,
          335,
          351
        ],
        "total": 1307,
        "sourceRank": 23
      },
      {
        "rank": 23,
        "target": "30C",
        "name": "고성훈",
        "school": "서원대학교",
        "rounds": [
          297,
          335,
          326,
          349
        ],
        "total": 1307,
        "sourceRank": 23
      },
      {
        "rank": 25,
        "target": "39B",
        "name": "구범준",
        "school": "한국체육대학교",
        "rounds": [
          282,
          330,
          339,
          355
        ],
        "total": 1306,
        "sourceRank": 25
      },
      {
        "rank": 25,
        "target": "38B",
        "name": "이은재",
        "school": "한국체육대학교",
        "rounds": [
          293,
          329,
          330,
          354
        ],
        "total": 1306,
        "sourceRank": 25
      },
      {
        "rank": 27,
        "target": "35A",
        "name": "이건호",
        "school": "배재대학교",
        "rounds": [
          299,
          332,
          323,
          351
        ],
        "total": 1305,
        "sourceRank": 27
      },
      {
        "rank": 28,
        "target": "32C",
        "name": "신재원",
        "school": "서원대학교",
        "rounds": [
          291,
          329,
          333,
          351
        ],
        "total": 1304,
        "sourceRank": 28
      },
      {
        "rank": 28,
        "target": "26B",
        "name": "강우석",
        "school": "국립경국대학교",
        "rounds": [
          300,
          329,
          325,
          350
        ],
        "total": 1304,
        "sourceRank": 28
      },
      {
        "rank": 30,
        "target": "27A",
        "name": "진은석",
        "school": "상지대학교",
        "rounds": [
          294,
          326,
          332,
          351
        ],
        "total": 1303,
        "sourceRank": 30
      },
      {
        "rank": 31,
        "target": "39C",
        "name": "조대신",
        "school": "인천대학교",
        "rounds": [
          293,
          327,
          333,
          349
        ],
        "total": 1302,
        "sourceRank": 31
      },
      {
        "rank": 31,
        "target": "31C",
        "name": "장은석",
        "school": "서원대학교",
        "rounds": [
          287,
          328,
          337,
          350
        ],
        "total": 1302,
        "sourceRank": 31
      },
      {
        "rank": 33,
        "target": "30B",
        "name": "강민서",
        "school": "국립경국대학교",
        "rounds": [
          298,
          326,
          327,
          349
        ],
        "total": 1300,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "33B",
        "name": "강민승",
        "school": "계명대학교",
        "rounds": [
          305,
          319,
          328,
          348
        ],
        "total": 1300,
        "sourceRank": 33
      },
      {
        "rank": 35,
        "target": "46A",
        "name": "김다니엘",
        "school": "순천대학교",
        "rounds": [
          286,
          331,
          329,
          352
        ],
        "total": 1298,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "44B",
        "name": "이찬주",
        "school": "한국체육대학교",
        "rounds": [
          303,
          321,
          326,
          344
        ],
        "total": 1294,
        "sourceRank": 36
      },
      {
        "rank": 37,
        "target": "45B",
        "name": "김택중",
        "school": "한국체육대학교",
        "rounds": [
          291,
          325,
          323,
          353
        ],
        "total": 1292,
        "sourceRank": 37
      },
      {
        "rank": 38,
        "target": "46B",
        "name": "지호준",
        "school": "한국체육대학교",
        "rounds": [
          294,
          322,
          328,
          347
        ],
        "total": 1291,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "43C",
        "name": "최우진",
        "school": "조선대학교",
        "rounds": [
          283,
          326,
          327,
          354
        ],
        "total": 1290,
        "sourceRank": 39
      },
      {
        "rank": 39,
        "target": "38C",
        "name": "김동현",
        "school": "경희대학교",
        "rounds": [
          291,
          331,
          319,
          349
        ],
        "total": 1290,
        "sourceRank": 39
      },
      {
        "rank": 41,
        "target": "45C",
        "name": "배정원",
        "school": "조선대학교",
        "rounds": [
          291,
          320,
          324,
          354
        ],
        "total": 1289,
        "sourceRank": 41
      },
      {
        "rank": 41,
        "target": "41C",
        "name": "박성우",
        "school": "인천대학교",
        "rounds": [
          286,
          329,
          329,
          345
        ],
        "total": 1289,
        "sourceRank": 41
      },
      {
        "rank": 43,
        "target": "31A",
        "name": "조승현",
        "school": "남서울대학교(클)",
        "rounds": [
          294,
          333,
          314,
          345
        ],
        "total": 1286,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "27C",
        "name": "현상우",
        "school": "서원대학교",
        "rounds": [
          281,
          319,
          334,
          351
        ],
        "total": 1285,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "44C",
        "name": "조성철",
        "school": "조선대학교",
        "rounds": [
          291,
          322,
          326,
          341
        ],
        "total": 1280,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "29C",
        "name": "황성현",
        "school": "서원대학교",
        "rounds": [
          290,
          320,
          322,
          347
        ],
        "total": 1279,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "37A",
        "name": "박훈정",
        "school": "배재대학교",
        "rounds": [
          295,
          316,
          316,
          349
        ],
        "total": 1276,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "31B",
        "name": "이승명",
        "school": "국립경국대학교",
        "rounds": [
          282,
          323,
          326,
          344
        ],
        "total": 1275,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "46C",
        "name": "전준희",
        "school": "조선대학교",
        "rounds": [
          276,
          320,
          330,
          347
        ],
        "total": 1273,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "40A",
        "name": "장우혁",
        "school": "한일장신대학교",
        "rounds": [
          266,
          326,
          324,
          356
        ],
        "total": 1272,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "26A",
        "name": "최민재",
        "school": "상지대학교",
        "rounds": [
          291,
          319,
          316,
          346
        ],
        "total": 1272,
        "sourceRank": 50
      },
      {
        "rank": 52,
        "target": "28C",
        "name": "송현태",
        "school": "서원대학교",
        "rounds": [
          281,
          317,
          321,
          344
        ],
        "total": 1263,
        "sourceRank": 52
      },
      {
        "rank": 53,
        "target": "28A",
        "name": "유정현",
        "school": "상지대학교",
        "rounds": [
          294,
          315,
          306,
          345
        ],
        "total": 1260,
        "sourceRank": 53
      },
      {
        "rank": 53,
        "target": "27B",
        "name": "송태건",
        "school": "국립경국대학교",
        "rounds": [
          276,
          324,
          319,
          341
        ],
        "total": 1260,
        "sourceRank": 53
      },
      {
        "rank": 55,
        "target": "45A",
        "name": "조율",
        "school": "순천대학교",
        "rounds": [
          287,
          316,
          309,
          341
        ],
        "total": 1253,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "39A",
        "name": "박라이",
        "school": "한일장신대학교",
        "rounds": [
          276,
          317,
          306,
          352
        ],
        "total": 1251,
        "sourceRank": 56
      },
      {
        "rank": 57,
        "target": "29A",
        "name": "안채빈",
        "school": "상지대학교",
        "rounds": [
          267,
          300,
          319,
          346
        ],
        "total": 1232,
        "sourceRank": 57
      },
      {
        "rank": 58,
        "target": "38A",
        "name": "유홍현",
        "school": "배재대학교",
        "rounds": [
          267,
          303,
          306,
          340
        ],
        "total": 1216,
        "sourceRank": 58
      },
      {
        "rank": 59,
        "target": "44A",
        "name": "제갈윤",
        "school": "울산대학교",
        "rounds": [
          256,
          300,
          315,
          342
        ],
        "total": 1213,
        "sourceRank": 59
      },
      {
        "rank": 60,
        "target": "42A",
        "name": "최승유",
        "school": "울산대학교",
        "rounds": [
          256,
          311,
          298,
          337
        ],
        "total": 1202,
        "sourceRank": 60
      },
      {
        "rank": 61,
        "target": "30A",
        "name": "강동한",
        "school": "상지대학교",
        "rounds": [
          253,
          298,
          299,
          321
        ],
        "total": 1171,
        "sourceRank": 61
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar04m01q",
    "sheetLabel": "남자 리커브 대학부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "대학부",
    "rankingGroup": "대학부",
    "distances": [
      70,
      60,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "35B",
        "name": "김서하",
        "school": "순천대학교",
        "rounds": [
          338,
          344,
          344,
          358
        ],
        "total": 1384,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "19A",
        "name": "염혜정",
        "school": "경희대학교",
        "rounds": [
          337,
          347,
          339,
          352
        ],
        "total": 1375,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "22B",
        "name": "최혜미",
        "school": "동서대학교",
        "rounds": [
          344,
          346,
          327,
          356
        ],
        "total": 1373,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "37A",
        "name": "유슬하",
        "school": "계명대학교",
        "rounds": [
          340,
          341,
          338,
          351
        ],
        "total": 1370,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "26B",
        "name": "이수연",
        "school": "광주여자대학교",
        "rounds": [
          335,
          343,
          334,
          351
        ],
        "total": 1363,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "21A",
        "name": "김미강",
        "school": "경희대학교",
        "rounds": [
          340,
          335,
          335,
          351
        ],
        "total": 1361,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "32A",
        "name": "황하정",
        "school": "한국체육대학교",
        "rounds": [
          333,
          339,
          335,
          351
        ],
        "total": 1358,
        "sourceRank": 7
      },
      {
        "rank": 8,
        "target": "20A",
        "name": "장미",
        "school": "경희대학교",
        "rounds": [
          322,
          343,
          334,
          353
        ],
        "total": 1352,
        "sourceRank": 8
      },
      {
        "rank": 9,
        "target": "25B",
        "name": "박미소",
        "school": "동서대학교",
        "rounds": [
          330,
          339,
          331,
          351
        ],
        "total": 1351,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "33C",
        "name": "김수아",
        "school": "국립경국대학교",
        "rounds": [
          328,
          344,
          327,
          350
        ],
        "total": 1349,
        "sourceRank": 10
      },
      {
        "rank": 11,
        "target": "30A",
        "name": "조수혜",
        "school": "한국체육대학교",
        "rounds": [
          327,
          332,
          335,
          354
        ],
        "total": 1348,
        "sourceRank": 11
      },
      {
        "rank": 12,
        "target": "33A",
        "name": "김은지",
        "school": "계명대학교",
        "rounds": [
          333,
          345,
          326,
          343
        ],
        "total": 1347,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "20C",
        "name": "함지윤",
        "school": "목원대학교",
        "rounds": [
          331,
          337,
          327,
          351
        ],
        "total": 1346,
        "sourceRank": 13
      },
      {
        "rank": 13,
        "target": "26C",
        "name": "이주예",
        "school": "인천대학교",
        "rounds": [
          330,
          340,
          328,
          348
        ],
        "total": 1346,
        "sourceRank": 13
      },
      {
        "rank": 15,
        "target": "23A",
        "name": "원성윤",
        "school": "경희대학교",
        "rounds": [
          337,
          328,
          334,
          346
        ],
        "total": 1345,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "24B",
        "name": "윤수희",
        "school": "동서대학교",
        "rounds": [
          327,
          338,
          326,
          354
        ],
        "total": 1345,
        "sourceRank": 15
      },
      {
        "rank": 17,
        "target": "22A",
        "name": "강민진",
        "school": "경희대학교",
        "rounds": [
          324,
          340,
          334,
          346
        ],
        "total": 1344,
        "sourceRank": 17
      },
      {
        "rank": 17,
        "target": "21B",
        "name": "한주희",
        "school": "동서대학교",
        "rounds": [
          334,
          339,
          326,
          345
        ],
        "total": 1344,
        "sourceRank": 17
      },
      {
        "rank": 19,
        "target": "29B",
        "name": "한유진",
        "school": "광주여자대학교",
        "rounds": [
          333,
          329,
          327,
          354
        ],
        "total": 1343,
        "sourceRank": 19
      },
      {
        "rank": 19,
        "target": "27A",
        "name": "정승은",
        "school": "한국체육대학교",
        "rounds": [
          325,
          340,
          325,
          353
        ],
        "total": 1343,
        "sourceRank": 19
      },
      {
        "rank": 21,
        "target": "36A",
        "name": "연은서",
        "school": "계명대학교",
        "rounds": [
          326,
          336,
          330,
          350
        ],
        "total": 1342,
        "sourceRank": 21
      },
      {
        "rank": 22,
        "target": "32B",
        "name": "남지현",
        "school": "광주여자대학교",
        "rounds": [
          335,
          339,
          322,
          345
        ],
        "total": 1341,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "31A",
        "name": "조한이",
        "school": "한국체육대학교",
        "rounds": [
          327,
          341,
          329,
          343
        ],
        "total": 1340,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "23B",
        "name": "윤지희",
        "school": "동서대학교",
        "rounds": [
          328,
          331,
          334,
          346
        ],
        "total": 1339,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "29C",
        "name": "윤혜림",
        "school": "창원대학교",
        "rounds": [
          330,
          339,
          318,
          352
        ],
        "total": 1339,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "39B",
        "name": "김예빈",
        "school": "원광대학교",
        "rounds": [
          334,
          332,
          332,
          341
        ],
        "total": 1339,
        "sourceRank": 24
      },
      {
        "rank": 27,
        "target": "30C",
        "name": "박효빈",
        "school": "창원대학교",
        "rounds": [
          334,
          333,
          321,
          350
        ],
        "total": 1338,
        "sourceRank": 27
      },
      {
        "rank": 28,
        "target": "35A",
        "name": "신고은",
        "school": "계명대학교",
        "rounds": [
          333,
          335,
          321,
          348
        ],
        "total": 1337,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "38A",
        "name": "서희예",
        "school": "계명대학교",
        "rounds": [
          330,
          332,
          327,
          344
        ],
        "total": 1333,
        "sourceRank": 29
      },
      {
        "rank": 30,
        "target": "33B",
        "name": "서보은",
        "school": "순천대학교",
        "rounds": [
          321,
          338,
          324,
          349
        ],
        "total": 1332,
        "sourceRank": 30
      },
      {
        "rank": 30,
        "target": "35C",
        "name": "배윤진",
        "school": "국립경국대학교",
        "rounds": [
          321,
          338,
          328,
          345
        ],
        "total": 1332,
        "sourceRank": 30
      },
      {
        "rank": 32,
        "target": "23C",
        "name": "심민주",
        "school": "인천대학교",
        "rounds": [
          326,
          338,
          318,
          349
        ],
        "total": 1331,
        "sourceRank": 32
      },
      {
        "rank": 33,
        "target": "36C",
        "name": "이연우",
        "school": "국립경국대학교",
        "rounds": [
          323,
          338,
          324,
          345
        ],
        "total": 1330,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "29A",
        "name": "정다영",
        "school": "한국체육대학교",
        "rounds": [
          324,
          333,
          325,
          348
        ],
        "total": 1330,
        "sourceRank": 33
      },
      {
        "rank": 35,
        "target": "19C",
        "name": "김채현",
        "school": "목원대학교",
        "rounds": [
          322,
          340,
          320,
          347
        ],
        "total": 1329,
        "sourceRank": 35
      },
      {
        "rank": 35,
        "target": "27B",
        "name": "김하람",
        "school": "광주여자대학교",
        "rounds": [
          321,
          337,
          321,
          350
        ],
        "total": 1329,
        "sourceRank": 35
      },
      {
        "rank": 37,
        "target": "26A",
        "name": "안서윤",
        "school": "한국체육대학교",
        "rounds": [
          321,
          334,
          320,
          352
        ],
        "total": 1327,
        "sourceRank": 37
      },
      {
        "rank": 38,
        "target": "31B",
        "name": "김하은",
        "school": "광주여자대학교",
        "rounds": [
          329,
          331,
          317,
          349
        ],
        "total": 1326,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "38B",
        "name": "박가온",
        "school": "원광대학교",
        "rounds": [
          327,
          334,
          318,
          343
        ],
        "total": 1322,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "34A",
        "name": "이수현",
        "school": "계명대학교",
        "rounds": [
          326,
          331,
          316,
          348
        ],
        "total": 1321,
        "sourceRank": 40
      },
      {
        "rank": 40,
        "target": "40B",
        "name": "한소혜",
        "school": "원광대학교",
        "rounds": [
          328,
          341,
          320,
          332
        ],
        "total": 1321,
        "sourceRank": 40
      },
      {
        "rank": 42,
        "target": "21C",
        "name": "장보슬",
        "school": "목원대학교",
        "rounds": [
          313,
          336,
          321,
          347
        ],
        "total": 1317,
        "sourceRank": 42
      },
      {
        "rank": 43,
        "target": "28A",
        "name": "오정아",
        "school": "한국체육대학교",
        "rounds": [
          323,
          333,
          318,
          342
        ],
        "total": 1316,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "25C",
        "name": "이채영",
        "school": "인천대학교",
        "rounds": [
          308,
          336,
          328,
          343
        ],
        "total": 1315,
        "sourceRank": 44
      },
      {
        "rank": 45,
        "target": "22C",
        "name": "이율아",
        "school": "목원대학교",
        "rounds": [
          310,
          334,
          324,
          346
        ],
        "total": 1314,
        "sourceRank": 45
      },
      {
        "rank": 46,
        "target": "27C",
        "name": "이예진",
        "school": "창원대학교",
        "rounds": [
          329,
          331,
          305,
          345
        ],
        "total": 1310,
        "sourceRank": 46
      },
      {
        "rank": 46,
        "target": "28C",
        "name": "김보경",
        "school": "창원대학교",
        "rounds": [
          313,
          338,
          318,
          341
        ],
        "total": 1310,
        "sourceRank": 46
      },
      {
        "rank": 46,
        "target": "37B",
        "name": "장율리",
        "school": "순천대학교",
        "rounds": [
          317,
          329,
          318,
          346
        ],
        "total": 1310,
        "sourceRank": 46
      },
      {
        "rank": 49,
        "target": "36B",
        "name": "김시우",
        "school": "순천대학교",
        "rounds": [
          318,
          334,
          311,
          346
        ],
        "total": 1309,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "31C",
        "name": "이다영",
        "school": "창원대학교",
        "rounds": [
          318,
          334,
          311,
          345
        ],
        "total": 1308,
        "sourceRank": 50
      },
      {
        "rank": 50,
        "target": "24C",
        "name": "최한별",
        "school": "인천대학교",
        "rounds": [
          326,
          325,
          313,
          344
        ],
        "total": 1308,
        "sourceRank": 50
      },
      {
        "rank": 52,
        "target": "24A",
        "name": "박민지",
        "school": "경희대학교",
        "rounds": [
          316,
          317,
          324,
          348
        ],
        "total": 1305,
        "sourceRank": 52
      },
      {
        "rank": 53,
        "target": "39A",
        "name": "유수안",
        "school": "상지대학교",
        "rounds": [
          309,
          327,
          323,
          335
        ],
        "total": 1294,
        "sourceRank": 53
      },
      {
        "rank": 54,
        "target": "37C",
        "name": "정유정",
        "school": "국립경국대학교",
        "rounds": [
          310,
          322,
          322,
          338
        ],
        "total": 1292,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "32C",
        "name": "박채아",
        "school": "창원대학교",
        "rounds": [
          323,
          323,
          318,
          324
        ],
        "total": 1288,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "34B",
        "name": "김가은",
        "school": "순천대학교",
        "rounds": [
          318,
          330,
          304,
          331
        ],
        "total": 1283,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "19B",
        "name": "박해원",
        "school": "울산대학교",
        "rounds": [
          315,
          329,
          303,
          336
        ],
        "total": 1283,
        "sourceRank": 56
      },
      {
        "rank": 58,
        "target": "30B",
        "name": "남가형",
        "school": "광주여자대학교",
        "rounds": [
          305,
          313,
          311,
          347
        ],
        "total": 1276,
        "sourceRank": 58
      },
      {
        "rank": 59,
        "target": "34C",
        "name": "신효정",
        "school": "국립경국대학교",
        "rounds": [
          301,
          321,
          321,
          331
        ],
        "total": 1274,
        "sourceRank": 59
      },
      {
        "rank": 60,
        "target": "40A",
        "name": "김민솔",
        "school": "상지대학교",
        "rounds": [
          277,
          316,
          309,
          318
        ],
        "total": 1220,
        "sourceRank": 60
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar04w01q",
    "sheetLabel": "여자 리커브 대학부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "남",
    "division": "일반부",
    "rankingGroup": "일반부",
    "distances": [
      90,
      70,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "61C",
        "name": "박성철",
        "school": "공주시청",
        "rounds": [
          328,
          342,
          340,
          358
        ],
        "total": 1368,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "55B",
        "name": "이선재",
        "school": "국군체육부대",
        "rounds": [
          320,
          340,
          342,
          358
        ],
        "total": 1360,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "55C",
        "name": "구대한",
        "school": "청주시청",
        "rounds": [
          316,
          343,
          335,
          359
        ],
        "total": 1353,
        "sourceRank": 3
      },
      {
        "rank": 3,
        "target": "52C",
        "name": "김하준",
        "school": "사상구청",
        "rounds": [
          319,
          339,
          337,
          358
        ],
        "total": 1353,
        "sourceRank": 3
      },
      {
        "rank": 5,
        "target": "58C",
        "name": "황석민",
        "school": "울산남구청",
        "rounds": [
          314,
          344,
          338,
          356
        ],
        "total": 1352,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "58B",
        "name": "김선우",
        "school": "코오롱엑스텐보이즈",
        "rounds": [
          314,
          337,
          341,
          355
        ],
        "total": 1347,
        "sourceRank": 6
      },
      {
        "rank": 7,
        "target": "47B",
        "name": "김법민",
        "school": "대전시체육회",
        "rounds": [
          314,
          333,
          344,
          354
        ],
        "total": 1345,
        "sourceRank": 7
      },
      {
        "rank": 7,
        "target": "53C",
        "name": "장채환",
        "school": "사상구청",
        "rounds": [
          316,
          337,
          337,
          355
        ],
        "total": 1345,
        "sourceRank": 7
      },
      {
        "rank": 9,
        "target": "61B",
        "name": "최건태",
        "school": "코오롱엑스텐보이즈",
        "rounds": [
          307,
          336,
          343,
          355
        ],
        "total": 1341,
        "sourceRank": 9
      },
      {
        "rank": 9,
        "target": "53B",
        "name": "최현택",
        "school": "국군체육부대",
        "rounds": [
          305,
          343,
          338,
          355
        ],
        "total": 1341,
        "sourceRank": 9
      },
      {
        "rank": 9,
        "target": "55A",
        "name": "김종호",
        "school": "인천계양구청",
        "rounds": [
          312,
          337,
          338,
          354
        ],
        "total": 1341,
        "sourceRank": 9
      },
      {
        "rank": 9,
        "target": "47C",
        "name": "구본찬",
        "school": "현대제철",
        "rounds": [
          308,
          337,
          341,
          355
        ],
        "total": 1341,
        "sourceRank": 9
      },
      {
        "rank": 9,
        "target": "50A",
        "name": "이승신",
        "school": "서울시청",
        "rounds": [
          313,
          340,
          337,
          351
        ],
        "total": 1341,
        "sourceRank": 9
      },
      {
        "rank": 14,
        "target": "62C",
        "name": "김태민",
        "school": "공주시청",
        "rounds": [
          307,
          333,
          342,
          357
        ],
        "total": 1339,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "57C",
        "name": "원종혁",
        "school": "청주시청",
        "rounds": [
          304,
          343,
          338,
          352
        ],
        "total": 1337,
        "sourceRank": 15
      },
      {
        "rank": 16,
        "target": "56A",
        "name": "한종혁",
        "school": "인천계양구청",
        "rounds": [
          314,
          327,
          338,
          355
        ],
        "total": 1334,
        "sourceRank": 16
      },
      {
        "rank": 16,
        "target": "51C",
        "name": "이승일",
        "school": "사상구청",
        "rounds": [
          314,
          336,
          334,
          350
        ],
        "total": 1334,
        "sourceRank": 16
      },
      {
        "rank": 16,
        "target": "56B",
        "name": "이승욱",
        "school": "국군체육부대",
        "rounds": [
          312,
          332,
          337,
          353
        ],
        "total": 1334,
        "sourceRank": 16
      },
      {
        "rank": 19,
        "target": "56C",
        "name": "이한샘",
        "school": "청주시청",
        "rounds": [
          302,
          339,
          337,
          355
        ],
        "total": 1333,
        "sourceRank": 19
      },
      {
        "rank": 20,
        "target": "63A",
        "name": "박민범",
        "school": "대구중구청",
        "rounds": [
          303,
          333,
          339,
          355
        ],
        "total": 1330,
        "sourceRank": 20
      },
      {
        "rank": 20,
        "target": "60A",
        "name": "박은성",
        "school": "예천군청",
        "rounds": [
          306,
          344,
          333,
          347
        ],
        "total": 1330,
        "sourceRank": 20
      },
      {
        "rank": 22,
        "target": "57A",
        "name": "김강현",
        "school": "인천계양구청",
        "rounds": [
          302,
          336,
          340,
          351
        ],
        "total": 1329,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "63C",
        "name": "고태경",
        "school": "공주시청",
        "rounds": [
          307,
          335,
          333,
          353
        ],
        "total": 1328,
        "sourceRank": 23
      },
      {
        "rank": 24,
        "target": "49B",
        "name": "최재환",
        "school": "대전시체육회",
        "rounds": [
          304,
          329,
          340,
          354
        ],
        "total": 1327,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "65A",
        "name": "채진서",
        "school": "대구중구청",
        "rounds": [
          308,
          327,
          338,
          354
        ],
        "total": 1327,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "51B",
        "name": "송인준",
        "school": "국군체육부대",
        "rounds": [
          305,
          335,
          335,
          352
        ],
        "total": 1327,
        "sourceRank": 24
      },
      {
        "rank": 24,
        "target": "59A",
        "name": "장지호",
        "school": "예천군청",
        "rounds": [
          312,
          328,
          331,
          356
        ],
        "total": 1327,
        "sourceRank": 24
      },
      {
        "rank": 28,
        "target": "50B",
        "name": "김정훈",
        "school": "국군체육부대",
        "rounds": [
          302,
          332,
          334,
          358
        ],
        "total": 1326,
        "sourceRank": 28
      },
      {
        "rank": 29,
        "target": "59B",
        "name": "김예찬",
        "school": "코오롱엑스텐보이즈",
        "rounds": [
          301,
          331,
          336,
          357
        ],
        "total": 1325,
        "sourceRank": 29
      },
      {
        "rank": 29,
        "target": "54B",
        "name": "문균호",
        "school": "국군체육부대",
        "rounds": [
          307,
          331,
          332,
          355
        ],
        "total": 1325,
        "sourceRank": 29
      },
      {
        "rank": 31,
        "target": "59C",
        "name": "김민범",
        "school": "울산남구청",
        "rounds": [
          302,
          338,
          329,
          355
        ],
        "total": 1324,
        "sourceRank": 31
      },
      {
        "rank": 31,
        "target": "61A",
        "name": "손지원",
        "school": "예천군청",
        "rounds": [
          306,
          334,
          331,
          353
        ],
        "total": 1324,
        "sourceRank": 31
      },
      {
        "rank": 33,
        "target": "52A",
        "name": "이동민",
        "school": "서울시청",
        "rounds": [
          308,
          331,
          328,
          354
        ],
        "total": 1321,
        "sourceRank": 33
      },
      {
        "rank": 33,
        "target": "63B",
        "name": "이승윤",
        "school": "광주광역시남구청",
        "rounds": [
          311,
          329,
          329,
          352
        ],
        "total": 1321,
        "sourceRank": 33
      },
      {
        "rank": 35,
        "target": "58A",
        "name": "강현빈",
        "school": "인천계양구청",
        "rounds": [
          309,
          323,
          336,
          352
        ],
        "total": 1320,
        "sourceRank": 35
      },
      {
        "rank": 36,
        "target": "57B",
        "name": "최두희",
        "school": "국군체육부대",
        "rounds": [
          298,
          336,
          331,
          354
        ],
        "total": 1319,
        "sourceRank": 36
      },
      {
        "rank": 36,
        "target": "50C",
        "name": "김필중",
        "school": "현대제철",
        "rounds": [
          304,
          331,
          333,
          351
        ],
        "total": 1319,
        "sourceRank": 36
      },
      {
        "rank": 38,
        "target": "60C",
        "name": "김민재",
        "school": "울산남구청",
        "rounds": [
          296,
          332,
          333,
          356
        ],
        "total": 1317,
        "sourceRank": 38
      },
      {
        "rank": 39,
        "target": "49C",
        "name": "남유빈",
        "school": "현대제철",
        "rounds": [
          301,
          325,
          338,
          352
        ],
        "total": 1316,
        "sourceRank": 39
      },
      {
        "rank": 40,
        "target": "64C",
        "name": "이우주",
        "school": "공주시청",
        "rounds": [
          305,
          329,
          328,
          353
        ],
        "total": 1315,
        "sourceRank": 40
      },
      {
        "rank": 41,
        "target": "49A",
        "name": "박주영",
        "school": "서울시청",
        "rounds": [
          280,
          335,
          340,
          359
        ],
        "total": 1314,
        "sourceRank": 41
      },
      {
        "rank": 41,
        "target": "48B",
        "name": "곽동훈",
        "school": "대전시체육회",
        "rounds": [
          299,
          332,
          326,
          357
        ],
        "total": 1314,
        "sourceRank": 41
      },
      {
        "rank": 43,
        "target": "48C",
        "name": "허재우",
        "school": "현대제철",
        "rounds": [
          292,
          333,
          335,
          353
        ],
        "total": 1313,
        "sourceRank": 43
      },
      {
        "rank": 44,
        "target": "62B",
        "name": "정태영",
        "school": "코오롱엑스텐보이즈",
        "rounds": [
          285,
          340,
          335,
          351
        ],
        "total": 1311,
        "sourceRank": 44
      },
      {
        "rank": 44,
        "target": "51A",
        "name": "서준혁",
        "school": "서울시청",
        "rounds": [
          292,
          328,
          336,
          355
        ],
        "total": 1311,
        "sourceRank": 44
      },
      {
        "rank": 46,
        "target": "64A",
        "name": "김민재",
        "school": "대구중구청",
        "rounds": [
          298,
          329,
          320,
          356
        ],
        "total": 1303,
        "sourceRank": 46
      },
      {
        "rank": 47,
        "target": "62A",
        "name": "이동영",
        "school": "예천군청",
        "rounds": [
          281,
          332,
          338,
          345
        ],
        "total": 1296,
        "sourceRank": 47
      },
      {
        "rank": 48,
        "target": "64B",
        "name": "이진용",
        "school": "광주광역시남구청",
        "rounds": [
          297,
          324,
          325,
          347
        ],
        "total": 1293,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "47A",
        "name": "이용빈",
        "school": "전북원스포츠단(리)",
        "rounds": [
          277,
          334,
          332,
          349
        ],
        "total": 1292,
        "sourceRank": 49
      },
      {
        "rank": 49,
        "target": "65B",
        "name": "이원주",
        "school": "광주광역시남구청",
        "rounds": [
          286,
          329,
          327,
          350
        ],
        "total": 1292,
        "sourceRank": 49
      },
      {
        "rank": 51,
        "target": "54A",
        "name": "박규석",
        "school": "두산에너빌리티",
        "rounds": [
          300,
          326,
          316,
          346
        ],
        "total": 1288,
        "sourceRank": 51
      },
      {
        "rank": 52,
        "target": "48A",
        "name": "김민제",
        "school": "전북원스포츠단(리)",
        "rounds": [
          293,
          311,
          325,
          350
        ],
        "total": 1279,
        "sourceRank": 52
      },
      {
        "rank": 53,
        "target": "53A",
        "name": "진재왕",
        "school": "두산에너빌리티",
        "rounds": [
          282,
          324,
          320,
          347
        ],
        "total": 1273,
        "sourceRank": 53
      },
      {
        "rank": 54,
        "target": "65C",
        "name": "정유찬",
        "school": "라온양궁클럽(동)",
        "rounds": [
          127,
          185,
          240,
          311
        ],
        "total": 863,
        "sourceRank": 54
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar05m01q",
    "sheetLabel": "남자 리커브 일반부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  },
  {
    "gender": "여",
    "division": "일반부",
    "rankingGroup": "일반부",
    "distances": [
      70,
      60,
      50,
      30
    ],
    "rows": [
      {
        "rank": 1,
        "target": "43C",
        "name": "안산",
        "school": "광주은행 텐텐양궁단",
        "rounds": [
          343,
          347,
          341,
          353
        ],
        "total": 1384,
        "sourceRank": 1
      },
      {
        "rank": 2,
        "target": "55C",
        "name": "손서빈",
        "school": "여주시청",
        "rounds": [
          337,
          350,
          343,
          350
        ],
        "total": 1380,
        "sourceRank": 2
      },
      {
        "rank": 3,
        "target": "44A",
        "name": "임시현",
        "school": "현대모비스",
        "rounds": [
          346,
          350,
          332,
          350
        ],
        "total": 1378,
        "sourceRank": 3
      },
      {
        "rank": 4,
        "target": "41B",
        "name": "곽예지",
        "school": "대전시체육회",
        "rounds": [
          340,
          344,
          341,
          352
        ],
        "total": 1377,
        "sourceRank": 4
      },
      {
        "rank": 5,
        "target": "54A",
        "name": "임하나",
        "school": "청주시청",
        "rounds": [
          342,
          343,
          336,
          354
        ],
        "total": 1375,
        "sourceRank": 5
      },
      {
        "rank": 6,
        "target": "49B",
        "name": "박소민",
        "school": "LH",
        "rounds": [
          334,
          345,
          339,
          352
        ],
        "total": 1370,
        "sourceRank": 6
      },
      {
        "rank": 6,
        "target": "43B",
        "name": "이가현",
        "school": "대전시체육회",
        "rounds": [
          333,
          344,
          341,
          352
        ],
        "total": 1370,
        "sourceRank": 6
      },
      {
        "rank": 6,
        "target": "61B",
        "name": "김수린",
        "school": "대구서구청",
        "rounds": [
          339,
          345,
          333,
          353
        ],
        "total": 1370,
        "sourceRank": 6
      },
      {
        "rank": 9,
        "target": "49A",
        "name": "박세은",
        "school": "부산도시공사",
        "rounds": [
          334,
          348,
          336,
          350
        ],
        "total": 1368,
        "sourceRank": 9
      },
      {
        "rank": 10,
        "target": "53A",
        "name": "이세현",
        "school": "청주시청",
        "rounds": [
          330,
          344,
          336,
          356
        ],
        "total": 1366,
        "sourceRank": 10
      },
      {
        "rank": 10,
        "target": "52A",
        "name": "김소희",
        "school": "청주시청",
        "rounds": [
          339,
          341,
          333,
          353
        ],
        "total": 1366,
        "sourceRank": 10
      },
      {
        "rank": 12,
        "target": "51A",
        "name": "박은서",
        "school": "부산도시공사",
        "rounds": [
          333,
          343,
          334,
          354
        ],
        "total": 1364,
        "sourceRank": 12
      },
      {
        "rank": 13,
        "target": "46A",
        "name": "유시현",
        "school": "순천시청",
        "rounds": [
          339,
          343,
          327,
          353
        ],
        "total": 1362,
        "sourceRank": 13
      },
      {
        "rank": 14,
        "target": "47B",
        "name": "조아름",
        "school": "현대백화점",
        "rounds": [
          339,
          338,
          332,
          352
        ],
        "total": 1361,
        "sourceRank": 14
      },
      {
        "rank": 15,
        "target": "48B",
        "name": "김이안",
        "school": "현대백화점",
        "rounds": [
          334,
          337,
          333,
          356
        ],
        "total": 1360,
        "sourceRank": 15
      },
      {
        "rank": 15,
        "target": "46B",
        "name": "유수정",
        "school": "현대백화점",
        "rounds": [
          339,
          345,
          322,
          354
        ],
        "total": 1360,
        "sourceRank": 15
      },
      {
        "rank": 17,
        "target": "41C",
        "name": "최미선",
        "school": "광주은행 텐텐양궁단",
        "rounds": [
          336,
          343,
          334,
          346
        ],
        "total": 1359,
        "sourceRank": 17
      },
      {
        "rank": 18,
        "target": "45B",
        "name": "정다소미",
        "school": "현대백화점",
        "rounds": [
          334,
          343,
          332,
          349
        ],
        "total": 1358,
        "sourceRank": 18
      },
      {
        "rank": 19,
        "target": "54B",
        "name": "전훈영",
        "school": "인천광역시청",
        "rounds": [
          333,
          337,
          335,
          352
        ],
        "total": 1357,
        "sourceRank": 19
      },
      {
        "rank": 20,
        "target": "53B",
        "name": "홍수남",
        "school": "인천광역시청",
        "rounds": [
          338,
          333,
          335,
          350
        ],
        "total": 1356,
        "sourceRank": 20
      },
      {
        "rank": 20,
        "target": "61C",
        "name": "안희연",
        "school": "창원시청",
        "rounds": [
          331,
          344,
          329,
          352
        ],
        "total": 1356,
        "sourceRank": 20
      },
      {
        "rank": 22,
        "target": "43A",
        "name": "방현주",
        "school": "현대모비스",
        "rounds": [
          330,
          341,
          332,
          352
        ],
        "total": 1355,
        "sourceRank": 22
      },
      {
        "rank": 23,
        "target": "51B",
        "name": "김나리",
        "school": "서울시양궁협회",
        "rounds": [
          334,
          340,
          332,
          347
        ],
        "total": 1353,
        "sourceRank": 23
      },
      {
        "rank": 23,
        "target": "53C",
        "name": "한솔",
        "school": "홍성군청",
        "rounds": [
          337,
          339,
          327,
          350
        ],
        "total": 1353,
        "sourceRank": 23
      },
      {
        "rank": 25,
        "target": "59C",
        "name": "이나영",
        "school": "창원시청",
        "rounds": [
          332,
          339,
          332,
          349
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 25,
        "target": "59B",
        "name": "최지원",
        "school": "하이트진로",
        "rounds": [
          334,
          334,
          336,
          348
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 25,
        "target": "60B",
        "name": "최예지",
        "school": "대구서구청",
        "rounds": [
          335,
          343,
          327,
          347
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 25,
        "target": "55B",
        "name": "김서영",
        "school": "인천광역시청",
        "rounds": [
          334,
          345,
          326,
          347
        ],
        "total": 1352,
        "sourceRank": 25
      },
      {
        "rank": 29,
        "target": "42B",
        "name": "임해진",
        "school": "대전시체육회",
        "rounds": [
          331,
          341,
          327,
          351
        ],
        "total": 1350,
        "sourceRank": 29
      },
      {
        "rank": 29,
        "target": "58B",
        "name": "김영은",
        "school": "하이트진로",
        "rounds": [
          326,
          343,
          333,
          348
        ],
        "total": 1350,
        "sourceRank": 29
      },
      {
        "rank": 31,
        "target": "55A",
        "name": "박수빈",
        "school": "청주시청",
        "rounds": [
          333,
          340,
          328,
          348
        ],
        "total": 1349,
        "sourceRank": 31
      },
      {
        "rank": 32,
        "target": "46C",
        "name": "전인아",
        "school": "전북도청",
        "rounds": [
          333,
          340,
          325,
          350
        ],
        "total": 1348,
        "sourceRank": 32
      },
      {
        "rank": 32,
        "target": "47A",
        "name": "탁해윤",
        "school": "순천시청",
        "rounds": [
          337,
          338,
          325,
          348
        ],
        "total": 1348,
        "sourceRank": 32
      },
      {
        "rank": 32,
        "target": "63A",
        "name": "김세연",
        "school": "광주광역시청",
        "rounds": [
          324,
          339,
          334,
          351
        ],
        "total": 1348,
        "sourceRank": 32
      },
      {
        "rank": 35,
        "target": "48A",
        "name": "남수현",
        "school": "순천시청",
        "rounds": [
          340,
          337,
          328,
          341
        ],
        "total": 1346,
        "sourceRank": 35
      },
      {
        "rank": 35,
        "target": "49C",
        "name": "김예후",
        "school": "전북도청",
        "rounds": [
          334,
          333,
          331,
          348
        ],
        "total": 1346,
        "sourceRank": 35
      },
      {
        "rank": 35,
        "target": "62A",
        "name": "나민지",
        "school": "광주광역시청",
        "rounds": [
          325,
          339,
          332,
          350
        ],
        "total": 1346,
        "sourceRank": 35
      },
      {
        "rank": 38,
        "target": "50C",
        "name": "이은아",
        "school": "홍성군청",
        "rounds": [
          331,
          346,
          314,
          350
        ],
        "total": 1341,
        "sourceRank": 38
      },
      {
        "rank": 38,
        "target": "47C",
        "name": "신정화",
        "school": "전북도청",
        "rounds": [
          329,
          340,
          324,
          348
        ],
        "total": 1341,
        "sourceRank": 38
      },
      {
        "rank": 38,
        "target": "57C",
        "name": "김아현",
        "school": "여주시청",
        "rounds": [
          335,
          343,
          318,
          345
        ],
        "total": 1341,
        "sourceRank": 38
      },
      {
        "rank": 38,
        "target": "60A",
        "name": "이가영",
        "school": "광주광역시청",
        "rounds": [
          329,
          326,
          337,
          349
        ],
        "total": 1341,
        "sourceRank": 38
      },
      {
        "rank": 42,
        "target": "61A",
        "name": "정지서",
        "school": "광주광역시청",
        "rounds": [
          330,
          334,
          325,
          349
        ],
        "total": 1338,
        "sourceRank": 42
      },
      {
        "rank": 42,
        "target": "50A",
        "name": "조민서",
        "school": "부산도시공사",
        "rounds": [
          328,
          342,
          320,
          348
        ],
        "total": 1338,
        "sourceRank": 42
      },
      {
        "rank": 44,
        "target": "57A",
        "name": "조수빈",
        "school": "예천군청",
        "rounds": [
          335,
          336,
          322,
          344
        ],
        "total": 1337,
        "sourceRank": 44
      },
      {
        "rank": 44,
        "target": "60C",
        "name": "정다예나",
        "school": "창원시청",
        "rounds": [
          329,
          344,
          319,
          345
        ],
        "total": 1337,
        "sourceRank": 44
      },
      {
        "rank": 44,
        "target": "54C",
        "name": "김예림",
        "school": "여주시청",
        "rounds": [
          325,
          341,
          324,
          347
        ],
        "total": 1337,
        "sourceRank": 44
      },
      {
        "rank": 44,
        "target": "56C",
        "name": "전완서",
        "school": "여주시청",
        "rounds": [
          325,
          342,
          324,
          346
        ],
        "total": 1337,
        "sourceRank": 44
      },
      {
        "rank": 48,
        "target": "56B",
        "name": "최모경",
        "school": "하이트진로",
        "rounds": [
          324,
          334,
          327,
          350
        ],
        "total": 1335,
        "sourceRank": 48
      },
      {
        "rank": 49,
        "target": "58C",
        "name": "황재민",
        "school": "창원시청",
        "rounds": [
          329,
          333,
          322,
          350
        ],
        "total": 1334,
        "sourceRank": 49
      },
      {
        "rank": 50,
        "target": "42C",
        "name": "곽진영",
        "school": "광주은행 텐텐양궁단",
        "rounds": [
          330,
          333,
          329,
          341
        ],
        "total": 1333,
        "sourceRank": 50
      },
      {
        "rank": 51,
        "target": "52C",
        "name": "박소영",
        "school": "홍성군청",
        "rounds": [
          322,
          337,
          327,
          345
        ],
        "total": 1331,
        "sourceRank": 51
      },
      {
        "rank": 52,
        "target": "63B",
        "name": "임정민",
        "school": "대구서구청",
        "rounds": [
          322,
          340,
          321,
          345
        ],
        "total": 1328,
        "sourceRank": 52
      },
      {
        "rank": 52,
        "target": "44B",
        "name": "신서빈",
        "school": "대전시체육회",
        "rounds": [
          332,
          328,
          326,
          342
        ],
        "total": 1328,
        "sourceRank": 52
      },
      {
        "rank": 54,
        "target": "59A",
        "name": "심다정",
        "school": "예천군청",
        "rounds": [
          310,
          341,
          325,
          351
        ],
        "total": 1327,
        "sourceRank": 54
      },
      {
        "rank": 55,
        "target": "50B",
        "name": "임두나",
        "school": "LH",
        "rounds": [
          324,
          334,
          320,
          348
        ],
        "total": 1326,
        "sourceRank": 55
      },
      {
        "rank": 56,
        "target": "58A",
        "name": "강고은",
        "school": "예천군청",
        "rounds": [
          315,
          338,
          325,
          346
        ],
        "total": 1324,
        "sourceRank": 56
      },
      {
        "rank": 56,
        "target": "57B",
        "name": "박나원",
        "school": "하이트진로",
        "rounds": [
          331,
          327,
          324,
          342
        ],
        "total": 1324,
        "sourceRank": 56
      },
      {
        "rank": 58,
        "target": "48C",
        "name": "김아영",
        "school": "전북도청",
        "rounds": [
          329,
          328,
          318,
          345
        ],
        "total": 1320,
        "sourceRank": 58
      },
      {
        "rank": 58,
        "target": "51C",
        "name": "박재희",
        "school": "홍성군청",
        "rounds": [
          330,
          333,
          311,
          346
        ],
        "total": 1320,
        "sourceRank": 58
      },
      {
        "rank": 58,
        "target": "56A",
        "name": "이혜민",
        "school": "예천군청",
        "rounds": [
          322,
          340,
          314,
          344
        ],
        "total": 1320,
        "sourceRank": 58
      },
      {
        "rank": 61,
        "target": "62B",
        "name": "주혜빈",
        "school": "대구서구청",
        "rounds": [
          312,
          337,
          306,
          342
        ],
        "total": 1297,
        "sourceRank": 61
      },
      {
        "rank": 62,
        "target": "44C",
        "name": "최예진",
        "school": "광주은행 텐텐양궁단",
        "rounds": [
          318,
          316,
          302,
          342
        ],
        "total": 1278,
        "sourceRank": 62
      },
      {
        "rank": 63,
        "target": "45A",
        "name": "이은경",
        "school": "순천시청",
        "rounds": [
          26,
          0,
          0,
          0
        ],
        "total": 26,
        "sourceRank": 63
      }
    ],
    "id": "official_jongbyeol_2026_ar0012026ar001ar05w01q",
    "sheetLabel": "여자 리커브 일반부 개인",
    "competitionId": "official_jongbyeol_2026_yecheon",
    "competitionName": "제60회 전국 남여 양궁 종별선수권 대회",
    "date": "2026-05-02",
    "regionCity": "전국",
    "bowType": "리커브"
  }
];



const SCHOOL_NAME_ALIASES = {
  "천현초": "하남천현초등학교",
  "천현초등학교": "하남천현초등학교",
  "하남천현초": "하남천현초등학교",
  "안양서초": "안양서초등학교",
  "안양서초교": "안양서초등학교",
  // 공식 데이터 기준: 하성초/김포 하성초/김포하성초는 모두 같은 학교로 통일한다.
  "하성초": "김포하성초등학교",
  "하성초등학교": "김포하성초등학교",
  "김포하성초": "김포하성초등학교",
  "김포 하성초": "김포하성초등학교",
  "김포 하성초등학교": "김포하성초등학교",
};

function normalizeSchoolKey(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .replace(/[·ㆍ.]/g, "")
    .trim();
}

function getCanonicalSchoolName(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const compact = normalizeSchoolKey(raw);
  const direct = SCHOOL_NAME_ALIASES[raw] || SCHOOL_NAME_ALIASES[compact];
  return direct || raw;
}

function normalizeSchoolSearchKey(value) {
  const canonical = getCanonicalSchoolName(value);
  return normalizeSchoolKey(canonical)
    .replace(/초등학교/g, "초")
    .replace(/중학교/g, "중")
    .replace(/고등학교/g, "고")
    .replace(/대학교/g, "대")
    .replace(/학교/g, "")
    .replace(/양궁스포츠클럽/g, "양궁클럽")
    .replace(/\(동\)|\(클\)|\(리\)/g, "")
    .toLowerCase();
}

function schoolNameMatchesFilter(schoolName, filterValue) {
  if (!filterValue || filterValue === "all") return true;
  const schoolKey = normalizeSchoolSearchKey(schoolName);
  const filterKey = normalizeSchoolSearchKey(filterValue);
  if (!filterKey) return true;
  if (!schoolKey) return false;
  return schoolKey === filterKey || schoolKey.includes(filterKey) || filterKey.includes(schoolKey);
}

function withCanonicalSchool(row = {}) {
  const school = getCanonicalSchoolName(row.school || row.groupName || row.clubName || "");
  return {
    ...row,
    school,
    groupName: row.groupName ? getCanonicalSchoolName(row.groupName) : school,
    clubName: row.clubName ? getCanonicalSchoolName(row.clubName) : school,
  };
}

function makeSampleUserId(name, school) {
  const canonicalSchool = getCanonicalSchoolName(school);
  return `official_${canonicalSchool}_${name}`.replace(/[^a-zA-Z0-9가-힣_]/g, "_");
}

function buildPermanentSampleUsers() {
  const map = new Map();
  SAMPLE_SHEETS.forEach((sheet) => {
    sheet.rows.forEach((sourceRow) => {
      const row = withCanonicalSchool(sourceRow);
      // 공식 결과는 임의 학년 분산을 하지 않는다. 각 표의 대표 division만 사용한다.
      const assignedDivision = normalizeOfficialDivisionForDisplay(row.division || sheet.division, sheet.rankingGroup);
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
      .map((sourceRow) => {
        const row = withCanonicalSchool(sourceRow);
        // 이름/소속만 확인된 선수명단 행은 공식 선수 데이터로만 보관하고 랭킹 점수 산정에는 넣지 않는다.
        if (row.rosterOnly) return null;
        // 공식 결과는 임의 학년 분산을 하지 않는다. 각 표의 대표 division만 사용한다.
        const assignedDivision = normalizeOfficialDivisionForDisplay(row.division || sheet.division, sheet.rankingGroup);
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



// Firestore ranking_entries 구조 + 자동 반영 헬퍼
// 컬렉션: ranking_entries/{sessionId}_{distance}
// 목적: 세션 저장 후 거리별 랭킹 후보를 별도 컬렉션에 저장해 Firestore query 기반 랭킹으로 확장하기 위함.
function buildRankingEntriesFromSession(session, user = null) {
  const normalized = normalizeSessionShape(session, user);
  const profile = user || {};
  const base = {
    sessionId: normalized.id || normalized.sessionId || "",
    userId: normalized.userId || profile.id || profile.uid || "",
    name: profile.name || normalized.name || "",
    groupName: getCanonicalSchoolName(profile.groupName || normalized.groupName || normalized.clubName || ""),
    regionCity: profile.regionCity || normalized.regionCity || "전국",
    division: normalized.division || profile.division || "",
    gender: normalized.gender || profile.gender || "남",
    bowType: normalized.bowType || profile.bowType || "리커브",
    rankingGroup: getRankingGroup(normalized.division || profile.division, normalized.gender || profile.gender),
    sourceType: normalized.isSampleData ? "official_sample" : "user_session",
    competitionId: normalized.competitionId || "",
    competitionName: normalized.competitionName || "",
    sessionDate: normalized.sessionDate || getCurrentLocalDateString(),
    updatedAt: serverTimestamp(),
  };

  const rounds = Array.isArray(normalized.distanceRounds) && normalized.distanceRounds.length
    ? normalized.distanceRounds
    : [];

  return rounds
    .filter((round) => Number(round.distance) && Number.isFinite(Number(round.total)))
    .map((round) => ({
      ...base,
      distance: Number(round.distance),
      score: Number(round.total) || 0,
      arrows: Number(normalized.arrowsPerDistance) || 36,
      rankingKey: [base.rankingGroup || "unknown", base.gender || "unknown", Number(round.distance)].join("_"),
      entryId: `${base.sessionId || base.userId}_${Number(round.distance)}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_"),
    }));
}

async function upsertRankingEntriesForSession(db, session, user = null) {
  if (!db || !session) return [];
  const entries = buildRankingEntriesFromSession(session, user);
  if (!entries.length) return [];

  const batch = writeBatch(db);
  entries.forEach((entry) => {
    const ref = doc(db, "ranking_entries", entry.entryId);
    batch.set(ref, entry, { merge: true });
  });
  await batch.commit();
  return entries;
}

function getRankingQueryTarget(rankingFilters = {}, currentUser = null, options = {}) {
  const { useProfileFallback = true } = options;
  const selectedGroup = rankingFilters.rankingGroup && rankingFilters.rankingGroup !== "all"
    ? rankingFilters.rankingGroup
    : "all";
  const selectedGender = rankingFilters.gender && rankingFilters.gender !== "all"
    ? rankingFilters.gender
    : "all";

  // 초기 화면은 내 프로필 기준으로 가볍게 보여주고,
  // 검색 버튼을 누른 뒤에는 사용자가 선택한 조건 그대로 조회한다.
  // 즉, 구분/성별이 "전체"라면 전체 공식기록을 가져와야 한다.
  if (!useProfileFallback) {
    return { rankingGroup: selectedGroup, gender: selectedGender };
  }

  const profileGroup = getRankingGroup(currentUser?.division, currentUser?.gender);
  const rankingGroup = selectedGroup !== "all" ? selectedGroup : profileGroup || "all";
  const gender = selectedGender !== "all" ? selectedGender : currentUser?.gender || "all";
  return { rankingGroup, gender };
}

function getRankingQueryDistances(rankingType, rankingFilters = {}, rankingGroup = "") {
  const selected = rankingFilters.distance;
  if (selected && selected !== "all") return [Number(selected)].filter(Boolean);
  const required = getRequiredDistancesForRankingGroup(rankingGroup);
  if (rankingType === "total" || rankingType === "weeklyTotal") return required;
  return required.length ? required : [];
}


function normalizeOfficialDivisionForDisplay(rawDivision = "", rankingGroup = "") {
  const division = String(rawDivision || "").trim();
  const group = String(rankingGroup || "").trim();

  // 사용자가 직접 입력한 프로필 학년은 그대로 살린다. 공식 대회 결과에만 아래 정규화를 적용한다.
  if (group === "초등부(저학년)" && /^초등[1-4]$/.test(division)) return "초등부(저학년)";
  if (group === "초등부(고학년)" && /^초등[5-6]$/.test(division)) return "초등부(고학년)";
  if (group === "중등부" && /^중등[1-3]$/.test(division)) return "중등부";
  if ((group === "고등부(남)" || group === "고등부(여)" || group === "고등부") && /^고등[1-3]$/.test(division)) return "고등부";
  if (!division || division === "초1" || division === "초등1") return getDivisionFromRankingGroup(group);
  return division || getDivisionFromRankingGroup(group);
}

function normalizeRankingEntryData(docId, raw = {}) {
  const name = raw.name || raw.playerName || raw.player || "공식기록";
  const groupName = getCanonicalSchoolName(raw.groupName || raw.schoolName || raw.school || raw.team || "");
  const rankingGroup = raw.rankingGroup || raw.category || raw.divisionGroup || getRankingGroup(raw.division, raw.gender);
  const score = Number(raw.score ?? raw.totalScore ?? raw.total ?? 0);
  const sessionDate = raw.sessionDate || raw.date || raw.competitionDate || "";
  const sourceType = raw.sourceType || "";
  const isOfficialLike = raw.isSampleData || raw.isOfficialRecord || sourceType === "competition_result" || sourceType === "official_sample" || raw.competitionId;
  const normalizedDivision = isOfficialLike ? normalizeOfficialDivisionForDisplay(raw.division || "", rankingGroup) : (raw.division || "");
  return {
    id: docId,
    ...raw,
    entryId: raw.entryId || docId,
    name,
    playerName: name,
    groupName,
    schoolName: groupName,
    rankingGroup,
    category: raw.category || rankingGroup,
    gender: raw.gender || "남",
    distance: Number(raw.distance || raw.meter || raw.roundDistance || 0),
    score,
    totalScore: score,
    sessionDate,
    date: sessionDate,
    regionCity: raw.regionCity || raw.region || "전국",
    division: normalizedDivision,
    bowType: raw.bowType || "리커브",
    arrows: Number(raw.arrows || 36),
  };
}

function rankingEntryMatchesFilters(entry, { rankingGroup, gender, rankingFilters, distances, dateFilter, customDate }) {
  if (rankingGroup && rankingGroup !== "all" && !rankingGroupMatchesFilter(rankingGroup, entry.rankingGroup)) return false;
  if (gender && gender !== "all" && String(entry.gender || "") !== String(gender)) return false;
  if (rankingFilters?.regionCity && rankingFilters.regionCity !== "all" && String(entry.regionCity || "") !== String(rankingFilters.regionCity)) return false;
  if (rankingFilters?.groupName && rankingFilters.groupName !== "all" && !schoolNameMatchesFilter(entry.groupName || entry.schoolName || entry.school || "", rankingFilters.groupName)) return false;
  if (Array.isArray(distances) && distances.length && !distances.includes(Number(entry.distance))) return false;
  if (!isWithinDateFilter(entry.sessionDate || entry.date, dateFilter, customDate)) return false;
  return true;
}

async function fetchRankingEntriesForView(db, { rankingType, rankingFilters, currentUser, currentUserId, fullLoad = false, pageSize = 120, pageCursor = null }) {
  if (!db) return fullLoad ? { entries: [], nextCursor: null, hasMore: false, rawCount: 0 } : [];
  const { rankingGroup, gender } = getRankingQueryTarget(rankingFilters, currentUser, { useProfileFallback: !fullLoad });
  const distances = getRankingQueryDistances(rankingType, rankingFilters, rankingGroup);
  const dateFilter = rankingFilters?.dateFilter || "all";
  const customDate = rankingFilters?.customDate || "";
  const baseConstraints = [];

  if (rankingGroup && rankingGroup !== "all") baseConstraints.push(where("rankingGroup", "==", rankingGroup));
  if (gender && gender !== "all") baseConstraints.push(where("gender", "==", gender));
  if (rankingFilters?.regionCity && rankingFilters.regionCity !== "all") baseConstraints.push(where("regionCity", "==", rankingFilters.regionCity));

  // 검색 버튼을 누른 경우에도 전체 collection을 긁어오지 않는다.
  // Firestore에서 구분/성별/거리/지역을 먼저 줄이고, 학교명/날짜만 앱 내부에서 보정 필터링한다.
  if (fullLoad) {
    const constraints = [...baseConstraints];
    const selectedDistance = rankingFilters?.distance && rankingFilters.distance !== "all" ? Number(rankingFilters.distance) : null;
    if (selectedDistance) constraints.push(where("distance", "==", selectedDistance));

    const orderField = (rankingType === "total" || rankingType === "weeklyTotal") ? "totalScore" : "score";
    constraints.push(orderBy(orderField, "desc"));
    constraints.push(orderBy("sessionDate", "desc"));
    if (pageCursor) constraints.push(startAfter(pageCursor));
    constraints.push(limit(Number(pageSize) + 1));

    const snap = await getDocs(query(collection(db, "ranking_entries"), ...constraints));
    const docs = snap.docs || [];
    const hasMore = docs.length > Number(pageSize);
    const pageDocs = hasMore ? docs.slice(0, Number(pageSize)) : docs;
    const nextCursor = hasMore ? pageDocs[pageDocs.length - 1] : null;

    const entries = pageDocs
      .map((docSnap) => normalizeRankingEntryData(docSnap.id, docSnap.data()))
      .filter((entry) => rankingEntryMatchesFilters(entry, { rankingGroup, gender, rankingFilters, distances, dateFilter, customDate }))
      .sort((a, b) => {
        const primary = (rankingType === "total" || rankingType === "weeklyTotal")
          ? (Number(b.totalScore) || Number(b.score) || 0) - (Number(a.totalScore) || Number(a.score) || 0)
          : (Number(b.score) || 0) - (Number(a.score) || 0);
        if (primary !== 0) return primary;
        return String(b.sessionDate || b.date || "").localeCompare(String(a.sessionDate || a.date || ""));
      });

    return { entries, nextCursor, hasMore, rawCount: docs.length };
  }

  try {
    const distanceQueries = (distances.length ? distances : [null]).map((distance) => {
      const constraints = [...baseConstraints];
      if (distance) constraints.push(where("distance", "==", Number(distance)));
      constraints.push(orderBy("score", "desc"));
      constraints.push(orderBy("sessionDate", "desc"));
      constraints.push(limit(80));
      return getDocs(query(collection(db, "ranking_entries"), ...constraints));
    });

    const ownConstraints = [where("userId", "==", currentUserId || "__none__")];
    if (rankingGroup && rankingGroup !== "all") ownConstraints.push(where("rankingGroup", "==", rankingGroup));
    if (gender && gender !== "all") ownConstraints.push(where("gender", "==", gender));
    if (distances.length === 1) ownConstraints.push(where("distance", "==", Number(distances[0])));
    ownConstraints.push(limit(40));

    const snaps = await Promise.all([
      ...distanceQueries,
      currentUserId ? getDocs(query(collection(db, "ranking_entries"), ...ownConstraints)) : Promise.resolve({ docs: [] }),
    ]);

    const map = new Map();
    snaps.forEach((snap) => {
      (snap.docs || []).forEach((docSnap) => {
        const data = normalizeRankingEntryData(docSnap.id, docSnap.data());
        if (!rankingEntryMatchesFilters(data, { rankingGroup, gender, rankingFilters, distances, dateFilter, customDate })) return;
        const key = data.entryId || docSnap.id;
        map.set(key, data);
      });
    });
    return Array.from(map.values()).sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
  } catch (error) {
    console.warn("ranking_entries strict query failed; fallback to smaller client filtering", error);
    const snap = await getDocs(query(collection(db, "ranking_entries"), limit(600)));
    return (snap.docs || [])
      .map((docSnap) => normalizeRankingEntryData(docSnap.id, docSnap.data()))
      .filter((entry) => rankingEntryMatchesFilters(entry, { rankingGroup, gender, rankingFilters, distances, dateFilter, customDate }))
      .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
      .slice(0, 120);
  }
}

function buildUsersFromRankingEntries(entries = []) {
  const map = new Map();
  entries.forEach((entry) => {
    const id = entry.userId || makeSampleUserId(entry.name, entry.groupName);
    if (map.has(id)) return;
    map.set(id, {
      id,
      uid: id,
      name: entry.name || "공식기록",
      email: `${id}@ranking.local`,
      groupName: getCanonicalSchoolName(entry.groupName || entry.school || ""),
      clubName: getCanonicalSchoolName(entry.groupName || entry.school || ""),
      regionCity: entry.regionCity || "전국",
      division: entry.division || "",
      gender: entry.gender || "남",
      bowType: entry.bowType || "리커브",
      isSampleData: true,
      isOfficialRecordUser: true,
      sourceType: entry.sourceType || "official_firestore",
    });
  });
  return Array.from(map.values());
}

function buildSessionsFromRankingEntries(entries = []) {
  return entries.map((entry) => {
    const userId = entry.userId || makeSampleUserId(entry.name, entry.groupName);
    const distance = Number(entry.distance) || 0;
    const score = Number(entry.score) || 0;
    const arrows = Number(entry.arrows) || 36;
    return buildSampleDistanceSession({
      userId,
      date: entry.sessionDate || getCurrentLocalDateString(),
      title: `${entry.competitionName || "공식기록"} · ${entry.name || "선수"}`.trim(),
      division: entry.division || "",
      gender: entry.gender || "남",
      regionCity: entry.regionCity || "전국",
      bowType: entry.bowType || "리커브",
      clubName: getCanonicalSchoolName(entry.groupName || entry.school || ""),
      groupName: getCanonicalSchoolName(entry.groupName || entry.school || ""),
      distance,
      arrowsPerDistance: arrows,
      rounds: [{ distance, total: score }],
    });
  });
}

async function upsertOfficialCompetitionSheetToRankingEntries(db, sheet) {
  if (!db || !sheet?.rows?.length) return 0;
  const batch = writeBatch(db);
  let count = 0;
  sheet.rows.forEach((sourceRow) => {
    const row = withCanonicalSchool(sourceRow);
    const userId = makeSampleUserId(row.name, row.school);
    (sheet.distances || []).forEach((distance, idx) => {
      const score = Number(row.rounds?.[idx]);
      if (!Number.isFinite(score)) return;
      const entryId = `${sheet.competitionId || sheet.id}_${userId}_${distance}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
      batch.set(doc(db, "ranking_entries", entryId), {
        entryId,
        sessionId: `${sheet.id}_${userId}`,
        userId,
        name: row.name,
        groupName: row.school,
        regionCity: row.regionCity || sheet.regionCity || "전국",
        division: row.division || sheet.division || "",
        gender: row.gender || sheet.gender || "남",
        bowType: row.bowType || sheet.bowType || "리커브",
        rankingGroup: sheet.rankingGroup || getRankingGroup(row.division || sheet.division, row.gender || sheet.gender),
        sourceType: "competition_result",
        isOfficial: true,
        latestOnly: true,
        officialBatchId: sheet.competitionId || sheet.id,
        competitionId: sheet.competitionId || sheet.id,
        competitionName: sheet.competitionName || sheet.sheetLabel || "대회 결과",
        sessionDate: sheet.date || getCurrentLocalDateString(),
        distance: Number(distance),
        score,
        arrows: 36,
        sourceRank: row.sourceRank || row.rank || null,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      count += 1;
    });
  });
  await batch.commit();
  return count;
}

async function upsertOfficialCompetitionSheetsToRankingEntries(db, sheets = SAMPLE_SHEETS) {
  if (!db) throw new Error("Firestore DB 연결이 준비되지 않았다.");

  const writes = [];
  (sheets || []).forEach((sheet) => {
    if (!sheet?.rows?.length) return;
    sheet.rows.forEach((sourceRow) => {
      const row = withCanonicalSchool(sourceRow);
      const gender = row.gender || sheet.gender || "남";
      const canonicalDivision = normalizeDivisionLabel(row.division || sheet.division || sheet.rankingGroup || "", {
        id: sheet.id,
        sourceSheetId: sheet.id,
        sheetLabel: sheet.sheetLabel,
        rawDivision: sheet.division,
      });
      const canonicalGroup = canonicalRankingGroup(canonicalDivision, {
        id: sheet.id,
        sourceSheetId: sheet.id,
        sheetLabel: sheet.sheetLabel,
      });
      const userId = makeSampleUserId(row.name, row.school);
      (sheet.distances || []).forEach((distance, idx) => {
        const score = Number(row.rounds?.[idx]);
        if (!Number.isFinite(score)) return;
        const entryId = `${sheet.competitionId || sheet.id}_${canonicalGroup}_${gender}_${userId}_${Number(distance)}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
        const payload = normalizeOfficialRankingEntry({
          entryId,
          sessionId: `${sheet.id}_${canonicalGroup}_${gender}_${userId}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_"),
          userId,
          name: row.name,
          playerName: row.name,
          groupName: row.school,
          schoolName: row.school,
          regionCity: row.regionCity || sheet.regionCity || "전국",
          rawDivision: row.division || sheet.division || sheet.rankingGroup || "",
          division: canonicalDivision,
          gender,
          bowType: row.bowType || sheet.bowType || "리커브",
          rankingGroup: canonicalGroup,
          sourceType: "competition_result",
          isOfficial: true,
          latestOnly: true,
          officialBatchId: sheet.competitionId || sheet.id,
          competitionId: sheet.competitionId || sheet.id,
          sourceSheetId: sheet.id,
          sheetLabel: sheet.sheetLabel || "",
          competitionName: sheet.competitionName || sheet.sheetLabel || "대회 결과",
          sessionDate: sheet.date || getCurrentLocalDateString(),
          date: sheet.date || getCurrentLocalDateString(),
          distance: Number(distance),
          score,
          totalScore: Number(row.total) || 0,
          arrows: 36,
          sourceRank: row.sourceRank || row.rank || null,
          updatedAt: serverTimestamp(),
        });
        writes.push({ entryId, payload });
      });
    });
  });

  const chunkSize = 450;
  for (let i = 0; i < writes.length; i += chunkSize) {
    const batch = writeBatch(db);
    writes.slice(i, i + chunkSize).forEach((item) => {
      batch.set(doc(db, "ranking_entries", item.entryId), item.payload, { merge: true });
    });
    await batch.commit();
  }

  return { sheetCount: (sheets || []).length, writeCount: writes.length };
}


function splitOfficialUploadLine(line = "", delimiter = ",") {
  const out = [];
  let current = "";
  let quote = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"' && quote && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (ch === '"') {
      quote = !quote;
      continue;
    }
    if (ch === delimiter && !quote) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

function normalizeUploadHeader(value = "") {
  return String(value || "")
    .trim()
    .replace(/^\ufeff/, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function pickUploadValue(row = {}, aliases = []) {
  for (const key of aliases) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") return String(row[key]).trim();
  }
  return "";
}

function toUploadNumber(value) {
  const raw = String(value ?? "").replace(/[^0-9.-]/g, "");
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseOfficialRankingUploadText(text = "", fileName = "official_upload") {
  const trimmed = String(text || "").trim();
  if (!trimmed) return [];

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.rows)) return parsed.rows.map((row) => ({ ...row, competitionName: row.competitionName || parsed.competitionName, competitionId: row.competitionId || parsed.competitionId, date: row.date || parsed.date }));
    throw new Error("JSON은 배열 또는 { rows: [] } 형식이어야 한다.");
  }

  const lines = trimmed.split(/\r?\n/).filter((line) => String(line || "").trim());
  if (lines.length < 2) return [];
  const delimiter = lines[0].includes("\t") ? "\t" : ",";
  const headers = splitOfficialUploadLine(lines[0], delimiter).map(normalizeUploadHeader);
  return lines.slice(1).map((line) => {
    const values = splitOfficialUploadLine(line, delimiter);
    const row = { sourceFileName: fileName };
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    return row;
  });
}


async function loadXlsxParserFromCdn() {
  if (window.XLSX) return window.XLSX;
  await new Promise((resolve, reject) => {
    const exists = document.querySelector('script[data-xlsx="true"]');
    if (exists) {
      exists.addEventListener("load", resolve, { once: true });
      exists.addEventListener("error", () => reject(new Error("엑셀 분석 라이브러리를 불러오지 못했다.")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
    script.dataset.xlsx = "true";
    script.onload = resolve;
    script.onerror = () => reject(new Error("엑셀 분석 라이브러리를 불러오지 못했다. 네트워크 상태를 확인해줘."));
    document.head.appendChild(script);
  });
  if (!window.XLSX) throw new Error("엑셀 분석 라이브러리 초기화에 실패했다.");
  return window.XLSX;
}

async function parseOfficialRankingExcelFile(file) {
  const XLSX = await loadXlsxParserFromCdn();
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) throw new Error("엑셀 파일에서 시트를 찾지 못했다.");
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
  return rows
    .filter((row) => Object.values(row || {}).some((value) => String(value || "").trim()))
    .map((row) => ({ ...row, sourceFileName: file.name, sourceSheetName: sheetName }));
}

function extractGoogleSheetIdFromText(text = "") {
  const raw = String(text || "");
  try {
    const parsed = JSON.parse(raw);
    const candidates = [parsed.url, parsed.doc_id, parsed.docId, parsed.id, parsed.resource_id, parsed.resourceId].filter(Boolean);
    for (const item of candidates) {
      const found = extractGoogleSheetIdFromText(String(item));
      if (found) return found;
    }
  } catch {}
  const urlMatch = raw.match(/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (urlMatch?.[1]) return urlMatch[1];
  const idMatch = raw.match(/(?:doc_id|resource_id|id)["'\s:=]+([a-zA-Z0-9_-]{20,})/i);
  if (idMatch?.[1]) return idMatch[1];
  const loose = raw.match(/([a-zA-Z0-9_-]{30,})/);
  return loose?.[1] || "";
}

async function parseGoogleSheetShortcutFile(file) {
  const shortcutText = await file.text();
  const sheetId = extractGoogleSheetIdFromText(shortcutText);
  if (!sheetId) {
    throw new Error("구글 스프레드시트 바로가기(.gsheet)에서 문서 ID를 찾지 못했다. 스프레드시트를 CSV 또는 XLSX로 내려받아 올려줘.");
  }
  const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  let response;
  try {
    response = await fetch(exportUrl, { method: "GET", cache: "no-store" });
  } catch {
    throw new Error("구글 스프레드시트를 직접 불러오지 못했다. 비공개 문서이거나 브라우저 접근이 차단된 경우 XLSX/CSV로 내려받아 올려줘.");
  }
  if (!response.ok) {
    throw new Error("구글 스프레드시트 접근 권한이 없다. 링크 공유를 켜거나 XLSX/CSV로 내려받아 올려줘.");
  }
  const csvText = await response.text();
  const rows = parseOfficialRankingUploadText(csvText, `${file.name}.csv`);
  if (!rows.length) throw new Error("구글 스프레드시트는 열었지만 표 데이터를 찾지 못했다.");
  return rows.map((row) => ({ ...row, sourceFileName: file.name, sourceType: "google_sheet" }));
}

function inferDivisionFromUpload(rawDivision = "", rawRankingGroup = "", gender = "남") {
  const text = `${rawRankingGroup} ${rawDivision}`.replace(/\s+/g, "");
  if (/u-?11|저학년|초등부\(저학년\)|초등[1-4]/i.test(text)) return "초등부(저학년)";
  if (/고학년|초등부\(고학년\)|초등[5-6]/i.test(text)) return "초등부(고학년)";
  if (/중등|중학|중학교|중등부|중[1-3]/i.test(text)) return "중등부";
  if (/고등|고등부|고[1-3]/i.test(text)) return "고등부";
  if (/대학|일반/i.test(text)) return /여/.test(gender) ? "대학부" : "대학부";
  return String(rawDivision || rawRankingGroup || "").trim();
}

function buildOfficialEntriesFromUploadRows(rows = [], fallback = {}) {
  const nowKey = getCurrentLocalDateString();
  const normalizedRows = [];

  rows.forEach((raw, index) => {
    const row = Object.fromEntries(Object.entries(raw || {}).map(([k, v]) => [normalizeUploadHeader(k), v]));
    const name = pickUploadValue(row, ["선수명", "이름", "name", "playername", "player"]);
    const schoolRaw = pickUploadValue(row, ["소속", "학교", "학교명", "school", "schoolname", "team", "groupname"]);
    if (!name || !schoolRaw) return;

    const genderRaw = pickUploadValue(row, ["성별", "gender", "sex"]) || fallback.gender || "남";
    const gender = /여|f|w/i.test(genderRaw) ? "여" : "남";
    const divisionRaw = pickUploadValue(row, ["구분", "부문", "division", "category", "rankinggroup", "학년"]);
    const rankingGroupRaw = pickUploadValue(row, ["랭킹구분", "rankinggroup", "divisiongroup"]);
    const division = normalizeDivisionLabel(inferDivisionFromUpload(divisionRaw || fallback.division, rankingGroupRaw || fallback.rankingGroup, gender), {
      rawDivision: divisionRaw,
      sheetLabel: fallback.sheetLabel,
      sourceFileName: fallback.fileName,
      sourceSheetId: fallback.sourceSheetId,
    });
    const rankingGroup = canonicalRankingGroup(rankingGroupRaw || division, {
      rawDivision: divisionRaw,
      sheetLabel: fallback.sheetLabel,
      sourceFileName: fallback.fileName,
      sourceSheetId: fallback.sourceSheetId,
    });
    const schoolName = getCanonicalSchoolName(schoolRaw);
    const competitionName = pickUploadValue(row, ["대회명", "competition", "competitionname", "event", "eventname"]) || fallback.competitionName || "공식 업로드 기록";
    const competitionId = (pickUploadValue(row, ["대회id", "competitionid", "eventid"]) || fallback.competitionId || `${competitionName}_${fallback.fileName || "upload"}`)
      .replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
    const sessionDate = pickUploadValue(row, ["날짜", "date", "sessiondate", "competitiondate"]) || fallback.date || nowKey;
    const regionCity = pickUploadValue(row, ["지역", "region", "regioncity"]) || fallback.regionCity || "전국";
    const sourceRank = toUploadNumber(pickUploadValue(row, ["순위", "rank", "sourcerank"]));
    const totalScore = toUploadNumber(pickUploadValue(row, ["총점", "total", "totalscore", "sum"]));
    const distanceDirect = toUploadNumber(pickUploadValue(row, ["거리", "distance", "meter"]));
    const scoreDirect = toUploadNumber(pickUploadValue(row, ["점수", "score"]));

    const distanceScores = [];
    if (distanceDirect && scoreDirect !== null) {
      distanceScores.push({ distance: distanceDirect, score: scoreDirect });
    } else {
      Object.entries(row).forEach(([key, value]) => {
        const m = key.match(/^(\d{2,3})m?$/i) || key.match(/^(\d{2,3})미터$/i);
        if (!m) return;
        const score = toUploadNumber(value);
        if (score === null) return;
        distanceScores.push({ distance: Number(m[1]), score });
      });
    }

    if (!distanceScores.length) return;
    const userId = makeSampleUserId(name, schoolName);
    distanceScores.forEach(({ distance, score }) => {
      const entryId = `${competitionId}_${userId}_${distance}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_");
      normalizedRows.push(normalizeOfficialRankingEntry({
        entryId,
        sessionId: `${competitionId}_${userId}`.replace(/[^a-zA-Z0-9가-힣_-]/g, "_"),
        userId,
        name,
        playerName: name,
        groupName: schoolName,
        schoolName,
        regionCity,
        division: normalizeOfficialDivisionForDisplay(division, rankingGroup),
        gender,
        bowType: pickUploadValue(row, ["활종", "bowtype"]) || fallback.bowType || "리커브",
        rankingGroup,
        sourceType: "competition_result",
        competitionId,
        competitionName,
        sessionDate,
        date: sessionDate,
        distance: Number(distance),
        score: Number(score),
        totalScore: Number(totalScore || 0),
        arrows: 36,
        sourceRank: sourceRank || null,
        sourceFileName: fallback.fileName || raw.sourceFileName || "official_upload",
        sourceSheetId: fallback.sourceSheetId || fallback.fileName || "",
        sheetLabel: fallback.sheetLabel || "",
        updatedAt: serverTimestamp(),
      }));
    });
  });

  return normalizedRows;
}



function guessCompetitionInfoFromPdfText(text = "") {
  const compact = String(text || "").replace(/\s+/g, " ");
  const competitionName = (compact.match(/제\s*\d+\s*회[^\n]{0,80}?(?:선발|대회|선수권|경기결과)/)?.[0] || "PDF 공식 업로드 기록")
    .replace(/\s+/g, " ")
    .trim();
  const gender = /여자/.test(compact) ? "여" : "남자".test(compact) ? "남" : "남";
  let division = "";
  if (/U\s*-?\s*11|저학년/.test(compact)) division = "초등부(저학년)";
  else if (/초등부/.test(compact)) division = "초등부(고학년)";
  else if (/중등부|중학/.test(compact)) division = "중등부";
  else if (/고등부/.test(compact)) division = "고등부";
  else if (/대학/.test(compact)) division = "대학부";
  else if (/일반/.test(compact)) division = "일반부";
  const distances = [];
  [90, 70, 60, 50, 40, 35, 30, 25, 20].forEach((m) => {
    if (new RegExp(`${m}\\s*M`, "i").test(compact)) distances.push(m);
  });
  return { competitionName, gender, division, distances };
}

function parseOfficialRankingPdfText(text = "", fileName = "official_pdf") {
  const rawText = String(text || "").replace(/\u00a0/g, " ");
  const info = guessCompetitionInfoFromPdfText(rawText);
  const distances = info.distances.length ? info.distances : [35, 30, 25, 20];
  const rows = [];
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.replace(/,/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean);

  function parseRowLine(line) {
    if (/단체|합산|엔트리수|참가선수|순위\s+소속/.test(line)) return null;
    if (!/^\d{1,3}\s+[0-9A-Z]{1,4}\s+/i.test(line)) return null;
    const pairMatches = Array.from(line.matchAll(/(\d{1,3})\s*\/\s*(\d{1,3})/g));
    if (pairMatches.length < distances.length) return null;

    const prefix = line.slice(0, pairMatches[0].index).trim();
    const rest = line.slice(pairMatches[Math.min(distances.length, pairMatches.length) - 1].index + pairMatches[Math.min(distances.length, pairMatches.length) - 1][0].length).trim();
    const prefixMatch = prefix.match(/^(\d{1,3})\s+([0-9A-Z]{1,4})\s+(.+)$/i);
    if (!prefixMatch) return null;

    const [, rank, target, remainRaw] = prefixMatch;
    const remain = remainRaw.replace(/\s+[1-6]$/, "").trim();
    let name = "";
    let schoolName = "";
    const koreanNameMatch = remain.match(/^([가-힣]{1,5})\s+(.+)$/);
    if (koreanNameMatch) {
      name = koreanNameMatch[1];
      schoolName = koreanNameMatch[2];
    } else {
      const parts = remain.split(/\s+/).filter(Boolean);
      const schoolStart = parts.findIndex((part) => /[가-힣]/.test(part));
      if (schoolStart > 0) {
        name = parts.slice(0, schoolStart).join(" ");
        schoolName = parts.slice(schoolStart).join(" ");
      } else {
        name = parts[0] || "";
        schoolName = parts.slice(1).join(" ");
      }
    }
    if (!name || !schoolName) return null;

    const totalMatch = rest.match(/\b(\d{1,4})\b/);
    const row = {
      sourceFileName: fileName,
      순위: rank,
      타겟: target,
      선수명: name,
      소속: schoolName,
      대회명: info.competitionName,
      구분: info.division,
      성별: info.gender,
    };
    distances.forEach((distance, idx) => {
      row[`${distance}m`] = pairMatches[idx]?.[1] ?? "";
    });
    row["총점"] = totalMatch ? totalMatch[1] : "";
    return row;
  }

  for (const line of lines) {
    const row = parseRowLine(line);
    if (row) rows.push(row);
  }

  if (rows.length) return rows;

  const joined = lines.join(" ");
  const chunks = joined.split(/\s(?=\d{1,3}\s+[0-9A-Z]{1,4}\s+)/gi);
  for (const chunk of chunks) {
    const row = parseRowLine(chunk);
    if (row) rows.push(row);
  }

  return rows;
}

async function loadPdfJsFromCdn() {
  if (typeof window === "undefined") throw new Error("브라우저 환경에서만 PDF 분석을 지원한다.");
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-pdfjs="true"]');
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.dataset.pdfjs = "true";
    script.onload = resolve;
    script.onerror = () => reject(new Error("PDF 분석 라이브러리를 불러오지 못했다. 네트워크 상태를 확인해줘."));
    document.head.appendChild(script);
  });
  if (!window.pdfjsLib) throw new Error("PDF 분석 라이브러리 초기화에 실패했다.");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
}

async function extractTextFromPdfFile(file) {
  const pdfjsLib = await loadPdfJsFromCdn();
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];
  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo += 1) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();
    const items = (content.items || [])
      .map((item) => ({ str: item.str || "", x: item.transform?.[4] || 0, y: item.transform?.[5] || 0 }))
      .filter((item) => item.str.trim());
    const groups = new Map();
    items.forEach((item) => {
      const y = Math.round(item.y / 4) * 4;
      if (!groups.has(y)) groups.set(y, []);
      groups.get(y).push(item);
    });
    const pageLines = Array.from(groups.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([, rowItems]) => rowItems.sort((a, b) => a.x - b.x).map((item) => item.str).join(" "));
    pages.push(pageLines.join("\n"));
  }
  return pages.join("\n");
}


async function deleteExistingOfficialRankingEntries(db, options = {}) {
  if (!db) throw new Error("Firestore DB 연결이 준비되지 않았다.");
  const officialSourceTypes = [
    "competition_result",
    "official_upload",
    "pdf_official_extracted",
    "web_confirmed_official_record",
    "official_sample",
    "official_record_sample",
  ];
  const targets = new Map();

  async function collectRepeated(factory, maxLoops = 20) {
    for (let loop = 0; loop < maxLoops; loop += 1) {
      const snap = await getDocs(factory());
      if (!snap.docs?.length) break;
      (snap.docs || []).forEach((docSnap) => targets.set(docSnap.id, docSnap.ref));
      if (snap.docs.length < 500) break;
    }
  }

  await collectRepeated(() => query(collection(db, "ranking_entries"), where("isOfficial", "==", true), limit(500)));
  for (let i = 0; i < officialSourceTypes.length; i += 10) {
    const chunk = officialSourceTypes.slice(i, i + 10);
    await collectRepeated(() => query(collection(db, "ranking_entries"), where("sourceType", "in", chunk), limit(500)));
  }

  const refs = Array.from(targets.values());
  for (let i = 0; i < refs.length; i += 450) {
    const batch = writeBatch(db);
    refs.slice(i, i + 450).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }

  if (options.batchId) {
    await setDoc(doc(db, "official_ranking_meta", "current"), {
      activeBatchId: options.batchId,
      competitionName: options.competitionName || "최신 공식대회",
      competitionDate: options.competitionDate || getCurrentLocalDateString(),
      replacedOfficialCount: refs.length,
      updatedAt: serverTimestamp(),
      mode: "latest_only",
    }, { merge: true });
  }

  return refs.length;
}

async function upsertOfficialUploadRowsToRankingEntries(db, rows = [], fallback = {}) {
  if (!db) throw new Error("Firestore DB 연결이 준비되지 않았다.");
  const entries = buildOfficialEntriesFromUploadRows(rows, fallback);
  if (!entries.length) throw new Error("업로드 가능한 공식 기록을 찾지 못했다. CSV/JSON 헤더를 확인해줘.");

  const chunkSize = 450;
  for (let i = 0; i < entries.length; i += chunkSize) {
    const batch = writeBatch(db);
    entries.slice(i, i + chunkSize).forEach((entry) => {
      batch.set(doc(db, "ranking_entries", entry.entryId), { ...entry, isOfficial: true, officialBatchId: fallback.officialBatchId || fallback.fileName || "latest_official", sourceType: entry.sourceType || "official_upload", latestOnly: true }, { merge: true });
    });
    await batch.commit();
  }
  return { rowCount: rows.length, writeCount: entries.length, competitionCount: new Set(entries.map((e) => e.competitionId)).size };
}

async function migrateRankingEntryDivisionLabels(db) {
  if (!db) return { checked: 0, updated: 0 };
  const snap = await getDocs(query(collection(db, "ranking_entries"), limit(5000)));
  const updates = [];

  (snap.docs || []).forEach((docSnap) => {
    const raw = docSnap.data() || {};
    const rankingGroup = raw.rankingGroup || raw.category || raw.divisionGroup || getRankingGroup(raw.division, raw.gender);
    const normalizedDivision = normalizeOfficialDivisionForDisplay(raw.division || "", rankingGroup);
    const canonicalSchool = getCanonicalSchoolName(raw.groupName || raw.schoolName || raw.school || raw.team || "");

    const patch = {};
    if (normalizedDivision && normalizedDivision !== raw.division) patch.division = normalizedDivision;
    if (canonicalSchool && canonicalSchool !== raw.groupName) patch.groupName = canonicalSchool;
    if (canonicalSchool && canonicalSchool !== raw.schoolName) patch.schoolName = canonicalSchool;
    if (rankingGroup && rankingGroup !== raw.rankingGroup) patch.rankingGroup = rankingGroup;
    if (Object.keys(patch).length) {
      patch.updatedAt = serverTimestamp();
      updates.push({ id: docSnap.id, patch });
    }
  });

  const chunkSize = 450;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const batch = writeBatch(db);
    updates.slice(i, i + chunkSize).forEach((item) => {
      batch.set(doc(db, "ranking_entries", item.id), item.patch, { merge: true });
    });
    await batch.commit();
  }

  return { checked: snap.size || 0, updated: updates.length };
}

// Firestore 추천 인덱스
// ranking_entries: rankingGroup ASC, gender ASC, distance ASC, score DESC, sessionDate DESC
// ranking_entries: userId ASC, rankingGroup ASC, distance ASC, score DESC

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

function formatSessionDistanceSummary(session) {
  if (!session) return "";
  if (session.recordInputType === "distance" && Array.isArray(session.distanceRounds)) {
    const distances = Array.from(
      new Set(
        session.distanceRounds
          .filter((round) => Number(round.total) > 0 || Number(round.distance) > 0)
          .map((round) => Number(round.distance))
          .filter(Boolean)
      )
    ).sort((a, b) => a - b);

    if (distances.length) return `거리 ${distances.map((distance) => `${distance}m`).join(" / ")}`;
    return "거리 기록 없음";
  }

  return `${session.distance}m, 엔드 ${session.ends?.length || 0}개`;
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
    weather: draftSession.weather || buildDefaultSessionWeather(),
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
    weather: data.weather || buildDefaultSessionWeather(),
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
      const selectedRankingGroup = rankingFilters.rankingGroup || "all";
      // 초등 저학년/고학년은 엄격히 분리한다.
      // 사용자의 실제 프로필 학년(예: 초4)은 고학년 검색에 섞이면 안 된다.
      // 공식 기록은 division/rankingGroup 기준으로 이미 정규화되어 있으므로 동일 규칙을 적용한다.
      if (
        selectedRankingGroup &&
        selectedRankingGroup !== "all" &&
        selectedRankingGroup !== "초등부(통합)" &&
        profileRankingGroup &&
        !rankingGroupMatchesFilter(selectedRankingGroup, profileRankingGroup)
      ) {
        return null;
      }

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
      const selectedRankingGroup = rankingFilters.rankingGroup || "all";
      // 초등 저학년/고학년은 엄격히 분리한다.
      // 사용자의 실제 프로필 학년(예: 초4)은 고학년 검색에 섞이면 안 된다.
      // 공식 기록은 division/rankingGroup 기준으로 이미 정규화되어 있으므로 동일 규칙을 적용한다.
      if (
        selectedRankingGroup &&
        selectedRankingGroup !== "all" &&
        selectedRankingGroup !== "초등부(통합)" &&
        profileRankingGroup &&
        !rankingGroupMatchesFilter(selectedRankingGroup, profileRankingGroup)
      ) {
        return null;
      }

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
    <Card className="rounded-[28px] border-0 bg-white/95 shadow-xl ring-1 ring-slate-200/70">
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full lg:hidden">
          <TabsList className="grid h-auto w-full grid-cols-3 gap-2 rounded-3xl bg-slate-100 p-2">
            {navs.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger
                  key={item.key}
                  value={item.key}
                  className="flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center text-[12px] font-semibold leading-tight text-slate-700 transition sm:text-sm data-[state=active]:bg-white data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="block w-full truncate">{item.label}</span>
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
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] bg-slate-950 px-4 py-5 text-white shadow-2xl lg:flex lg:flex-col xl:w-[240px]">
      <div>
        <div className="text-lg font-black tracking-wide xl:text-xl">ARCHERY ANALYTICS</div>
        <div className="mt-1 text-[11px] leading-4 text-slate-400 xl:text-xs xl:leading-5">훈련이 데이터가 되고, 성과가 결과가 된다</div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-3xl bg-white/5 p-3">
        <ProfileAvatar user={user} size="md" />
        <div className="min-w-0">
          <div className="truncate font-black">{getDisplayName(user)}</div>
          <div className="truncate text-xs text-slate-400">{formatProfileDivisionLabel(user?.division || "") || user?.role || "선수"}</div>
        </div>
      </div>

      <nav className="mt-6 space-y-1.5 border-t border-white/10 pt-5">
        {navs.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-[13px] font-bold tracking-tight transition hover:bg-white/10 active:scale-[0.99] xl:px-4 xl:py-3.5 xl:text-sm ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30" : "text-slate-300"}`}
            >
              <span className="flex min-w-0 items-center gap-3"><Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{item.label}</span></span>
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
        <div className="rounded-3xl bg-white/10 p-3 text-[11px] leading-5 text-slate-300 xl:p-4 xl:text-xs">
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
  currentUser,
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
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");
  const [customVenues, setCustomVenues] = useState(() => readCustomWeatherVenues());
  const [customVenueName, setCustomVenueName] = useState("");
  const [customVenueSaving, setCustomVenueSaving] = useState(false);
  const userSchoolVenue = useMemo(() => getUserSchoolVenue(currentUser), [currentUser]);
  const venueOptions = useMemo(() => {
    const builtIn = userSchoolVenue ? [userSchoolVenue, ...ARCHERY_VENUES.filter((venue) => venue.id !== userSchoolVenue.id && venue.id !== "school_profile")] : ARCHERY_VENUES;
    const merged = [...builtIn, ...customVenues];
    const seen = new Set();
    return merged.filter((venue) => {
      const key = venue.id || venue.name;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [customVenues, userSchoolVenue]);

  useEffect(() => {
    if (!userSchoolVenue) return;
    const currentWeather = session.weather || {};
    const shouldApplySchoolDefault = !currentWeather.venueId || currentWeather.venueId === "yecheon_jinho" || currentWeather.venueId === "default_school";
    if (!shouldApplySchoolDefault) return;
    setSession((prev) => ({
      ...prev,
      weather: {
        ...(prev.weather || buildDefaultSessionWeatherForUser(currentUser)),
        venueId: userSchoolVenue.id,
        venueName: userSchoolVenue.name,
        region: userSchoolVenue.region,
        latitude: userSchoolVenue.latitude,
        longitude: userSchoolVenue.longitude,
        auto: null,
      },
    }));
  }, [currentUser, session.weather?.venueId, setSession, userSchoolVenue]);

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


  function applyVenueToSession(venue) {
    if (!venue) return;
    patchSession((prev) => ({
      ...prev,
      weather: {
        ...(prev.weather || buildDefaultSessionWeatherForUser(currentUser)),
        venueId: venue.id,
        venueName: venue.name,
        region: venue.region,
        latitude: Number.isFinite(Number(venue.latitude)) ? Number(venue.latitude) : null,
        longitude: Number.isFinite(Number(venue.longitude)) ? Number(venue.longitude) : null,
        type: venue.type || "경기장",
        auto: null,
      },
    }));
    setWeatherError("");
  }

  function registerCurrentLocationVenue() {
    const selectedCustom = customVenues.find((item) => item.id === session.weather?.venueId);
    const currentWeather = session.weather || buildDefaultSessionWeatherForUser(currentUser);
    const name = String(customVenueName || selectedCustom?.name || currentWeather?.venueName || "내 훈련장").trim();
    if (!name) {
      setWeatherError("등록할 장소 이름을 먼저 입력하세요.");
      return;
    }

    const sourceVenue = venueOptions.find((item) => item.id === currentWeather?.venueId) || currentWeather;
    const latitude = Number(sourceVenue?.latitude ?? currentWeather?.latitude);
    const longitude = Number(sourceVenue?.longitude ?? currentWeather?.longitude);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      setWeatherError("좌표가 있는 경기장 또는 프로필 학교 위치를 먼저 선택한 뒤 등록하세요. 위치 권한 요청 없이 선택한 장소 좌표를 저장합니다.");
      return;
    }

    setCustomVenueSaving(true);
    setWeatherError("");
    try {
      const existingByName = customVenues.find((item) => normalizeVenueNameKey(item.name) === normalizeVenueNameKey(name));
      const venueId = selectedCustom?.id || existingByName?.id || makeCustomVenueId(name);
      const venue = {
        id: venueId,
        name,
        region: sourceVenue?.region || currentWeather?.region || "사용자 등록 위치",
        latitude,
        longitude,
        type: "사용자 등록",
        registeredAt: selectedCustom?.registeredAt || existingByName?.registeredAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const nextVenues = [venue, ...customVenues.filter((item) => item.id !== venue.id && normalizeVenueNameKey(item.name) !== normalizeVenueNameKey(name))].slice(0, 30);
      setCustomVenues(nextVenues);
      writeCustomWeatherVenues(nextVenues);
      setCustomVenueName("");
      applyVenueToSession(venue);
      setWeatherError(selectedCustom || existingByName ? "등록 위치가 수정되었습니다. 선택한 장소 좌표 기준으로 바람을 조회합니다." : "위치가 등록되었습니다. 다음부터 장소 목록에서 바로 선택할 수 있습니다.");
    } catch {
      setWeatherError("위치 등록 중 오류가 발생했습니다. 다시 시도하세요.");
    } finally {
      setCustomVenueSaving(false);
    }
  }

  function deleteSelectedCustomVenue() {
    const selectedId = session.weather?.venueId;
    const selectedCustom = customVenues.find((item) => item.id === selectedId);
    if (!selectedCustom) {
      setWeatherError("삭제할 수 있는 사용자 등록 위치를 먼저 선택하세요. 기본 경기장과 프로필 학교 위치는 삭제할 수 없습니다.");
      return;
    }
    const nextVenues = customVenues.filter((item) => item.id !== selectedCustom.id);
    setCustomVenues(nextVenues);
    writeCustomWeatherVenues(nextVenues);
    const fallbackVenue = userSchoolVenue || ARCHERY_VENUES.find((venue) => venue.id !== "school_profile") || ARCHERY_VENUES[0];
    applyVenueToSession(fallbackVenue);
    setCustomVenueName("");
    setWeatherError("사용자 등록 위치가 삭제되었습니다.");
  }

  async function refreshAutoWeather() {
    const weather = session.weather || buildDefaultSessionWeather();
    if (!weather.latitude || !weather.longitude) {
      setWeatherError("선택한 장소의 좌표가 없습니다. 학교/클럽 위치를 한 번 등록하거나 좌표가 있는 경기장을 선택하세요.");
      return;
    }
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const auto = await fetchSessionWindWeather({
        latitude: weather.latitude,
        longitude: weather.longitude,
        sessionDate: session.sessionDate,
      });
      patchSession((prev) => ({
        ...prev,
        weather: {
          ...(prev.weather || buildDefaultSessionWeatherForUser(currentUser)),
          auto,
        },
      }));
    } catch (error) {
      setWeatherError(error?.message || "바람 정보를 불러오지 못했습니다.");
    } finally {
      setWeatherLoading(false);
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
      <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
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
              <div className="grid w-full grid-cols-1 gap-2 xl:grid-cols-[6rem_minmax(0,1fr)] xl:items-center xl:gap-3">
                <Label className="block text-sm font-semibold xl:w-24 xl:shrink-0">날짜</Label>
                <div className="w-full min-w-0">
                  <Input
                    className="h-11 w-full min-w-0 rounded-2xl bg-white text-center text-base tabular-nums xl:text-left"
                    type="date"
                    value={session.sessionDate}
                    onChange={(e) => patchSession((prev) => ({ ...prev, sessionDate: e.target.value, weather: { ...(prev.weather || buildDefaultSessionWeatherForUser(currentUser)), auto: null } }))}
                  />
                </div>
              </div>

              <div className="grid w-full grid-cols-1 gap-2 xl:grid-cols-[6rem_minmax(0,1fr)] xl:items-start xl:gap-3">
                <Label className="block text-sm font-semibold xl:w-24 xl:shrink-0 xl:pt-3">장소/바람</Label>
                <div className="w-full min-w-0 space-y-2 rounded-3xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1fr_auto]">
                    <select
                      className="h-11 w-full min-w-0 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                      value={session.weather?.venueId || buildDefaultSessionWeatherForUser(currentUser).venueId}
                      onChange={(event) => {
                        const venueId = event.target.value;
                        const venue = venueOptions.find((item) => item.id === venueId) || venueOptions[0] || ARCHERY_VENUES[0];
                        applyVenueToSession(venue);
                      }}
                    >
                      {venueOptions.map((venue) => (
                        <option key={venue.id} value={venue.id}>
                          {venue.name} · {venue.region}
                        </option>
                      ))}
                    </select>
                    <Button type="button" className="h-11 rounded-2xl bg-blue-900 text-white hover:bg-blue-800" onClick={refreshAutoWeather} disabled={weatherLoading}>
                      {weatherLoading ? "조회 중..." : "바람 자동조회"}
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-white p-2 xl:grid-cols-[1fr_auto_auto]">
                    <Input
                      className="h-10 rounded-xl bg-white text-sm"
                      value={customVenueName}
                      onChange={(e) => setCustomVenueName(e.target.value)}
                      placeholder="학교/경기장/클럽 이름 등록"
                    />
                    <Button type="button" variant="outline" className="h-10 rounded-xl bg-white text-slate-700" onClick={registerCurrentLocationVenue} disabled={customVenueSaving}>
                      {customVenueSaving ? "등록 중..." : "위치 등록/수정"}
                    </Button>
                    <Button type="button" variant="outline" className="h-10 rounded-xl bg-white text-red-600" onClick={deleteSelectedCustomVenue} disabled={customVenueSaving}>
                      선택 위치 삭제
                    </Button>
                    <div className="text-[11px] text-slate-500 xl:col-span-3">학교 위치는 프로필 학교/소속 위치를 선택해 사용하고, 클럽/동호회/개인 훈련장은 이름을 입력한 뒤 위치 등록/수정으로 저장하세요.</div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 xl:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-700">
                      <div className="font-bold text-slate-900">자동 기상 기준 · {session.weather?.venueName || "장소 미선택"}</div>
                      {session.weather?.auto ? (
                        <div>
                          풍속 {session.weather.auto.windSpeed ?? "-"}m/s · {session.weather.auto.windDirectionLabel || "-"}풍 · 돌풍 {session.weather.auto.windGust ?? "-"}m/s · 기준 {session.weather.auto.observedTime || "-"}
                        </div>
                      ) : (
                        <div>바람 자동조회를 누르면 장소/날짜 기준 기상 데이터가 저장됩니다.</div>
                      )}
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 text-xs text-slate-700">
                      <div className="mb-1 font-bold text-slate-900">체감 바람 선택 · 선택사항</div>
                      <div className="grid grid-cols-5 gap-1">
                        {["", "없음", "약함", "중간", "강함"].map((label) => (
                          <button
                            key={label || "auto"}
                            type="button"
                            className={`rounded-xl px-2 py-1 ${String(session.weather?.athleteWindFeel || "") === label ? "bg-blue-900 text-white" : "bg-slate-100 text-slate-700"}`}
                            onClick={() => patchSession((prev) => ({ ...prev, weather: { ...(prev.weather || buildDefaultSessionWeatherForUser(currentUser)), athleteWindFeel: label } }))}
                          >
                            {label || "자동"}
                          </button>
                        ))}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">체감 입력이 없으면 자동 기상 데이터 기준으로 분석합니다.</div>
                    </div>
                  </div>
                  {weatherError && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{weatherError}</div>}
                </div>
              </div>

              <div className="grid gap-2 xl:flex xl:items-start xl:gap-3">
                <Label className="text-sm font-semibold xl:w-24 xl:shrink-0 xl:pt-3">입력 방식</Label>
                <div className="grid w-full grid-cols-2 gap-2 xl:flex-1">
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
                <Input className="h-11 w-full xl:flex-1" value={session.division || ""} disabled />
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
                    className="h-11 w-full xl:flex-1"
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
              <div ref={quickPanelRef} className="sticky top-2 z-30 overflow-hidden rounded-[22px] border border-slate-200 bg-white/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-white/90">
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-2.5 md:p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-700">빠른 점수 입력</div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                      {quickPanelOptions.map((score) => (
                        <Button
                          type="button"
                          key={String(score)}
                          variant="outline"
                          className={`${getQuickButtonClass(score)} h-10 min-h-0 py-0 text-sm font-semibold ${
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
    const dailyState = readRoutineDailyState(currentUser?.id, today);
    const draft = readSessionStorageJSON(routineDraftKey, null);
    const baseItems = savedTodayRoutine?.items?.length
      ? savedTodayRoutine.items
      : dailyState?.items?.length
        ? dailyState.items
        : draft?.items?.length
          ? draft.items
          : storedRoutineItems.length
            ? storedRoutineItems
            : ROUTINE_TEMPLATE_ITEMS;
    return normalizeRoutineItems(baseItems);
  });
  const [newItemLabel, setNewItemLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(savedTodayRoutine ? "오늘 저장된 루틴을 불러왔다. 필요하면 체크 상태를 수정한 뒤 다시 저장하면 된다." : "");

  useEffect(() => {
    const dailyState = readRoutineDailyState(currentUser?.id, today);
    const draft = readSessionStorageJSON(routineDraftKey, null);
    const stored = readStoredRoutineItems(currentUser?.id);
    const currentSavedRoutine = getSavedRoutineForToday(currentUser?.id, existingRoutine, today);
    const baseItems = currentSavedRoutine?.items?.length
      ? currentSavedRoutine.items
      : dailyState?.items?.length
        ? dailyState.items
        : draft?.items?.length
          ? draft.items
          : stored.length
            ? stored
            : ROUTINE_TEMPLATE_ITEMS;
    setItems(normalizeRoutineItems(baseItems));
    if (currentSavedRoutine || dailyState) {
      setNotice("오늘 루틴 상태를 불러왔다. 필요하면 체크 상태를 수정한 뒤 다시 저장하면 된다.");
    }
  }, [currentUser?.id, existingRoutine?.id, existingRoutine?.completionRate, existingRoutine?.updatedAt, today, routineDraftKey]);

  useEffect(() => {
    if (!currentUser?.id) return;
    writeStoredRoutineItems(currentUser.id, items);
    writeRoutineDailyState(currentUser.id, today, items);
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
      writeRoutineDailyState(currentUser.id, today, normalizedStats.items);
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
  const todayRoutine = getSavedRoutineForToday(currentUser?.id, getRoutineForDate(routines, todayKey), todayKey);
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
                          {formatSessionDistanceSummary(session)}
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


function RankingBoard({ users, sessions, currentUser, currentUserId, officialClaims = [], onRequestOfficialClaim, appServices = null, isAdminUser = false }) {
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
  const [appliedRankingFilters, setAppliedRankingFilters] = useState({
    distance: "all",
    rankingGroup: initialRankingGroup,
    groupName: "all",
    regionCity: "all",
    gender: initialGender,
    dateFilter: "all",
    customDate: getCurrentLocalDateString(),
  });
  const [rankingSearchMode, setRankingSearchMode] = useState(false);
  const [hideOfficialRecords, setHideOfficialRecords] = useState(false);
  const [schoolSearchInput, setSchoolSearchInput] = useState("");
  const [showAllRankings, setShowAllRankings] = useState(false);
  const [officialResultsOpen, setOfficialResultsOpen] = useState(false);
  const [remoteRankingEntries, setRemoteRankingEntries] = useState([]);
  const [remoteRankingLoading, setRemoteRankingLoading] = useState(false);
  const [remoteRankingNotice, setRemoteRankingNotice] = useState("");
  const [remoteRankingPage, setRemoteRankingPage] = useState(1);
  const [remoteRankingPageSize] = useState(120);
  const [remoteRankingCursorStack, setRemoteRankingCursorStack] = useState([null]);
  const [remoteRankingNextCursor, setRemoteRankingNextCursor] = useState(null);
  const [remoteRankingHasMore, setRemoteRankingHasMore] = useState(false);
  const [showRankingQuickNav, setShowRankingQuickNav] = useState(false);
  const rankingListTopRef = useRef(null);
  const initialRankingAppliedRef = useRef(false);

  useEffect(() => {
    if (initialRankingAppliedRef.current || !currentUser?.id) return;
    initialRankingAppliedRef.current = true;
    const nextRankingGroup = getRankingGroup(currentUser.division || "", currentUser.gender || "남") || "all";
    setRankingType("total");
    const nextFilters = {
      distance: "all",
      rankingGroup: nextRankingGroup,
      gender: currentUser.gender || "all",
    };
    setRankingFilters((prev) => ({ ...prev, ...nextFilters }));
    setAppliedRankingFilters((prev) => ({ ...prev, ...nextFilters }));
    setRankingSearchMode(false);
  }, [currentUser?.id, currentUser?.division, currentUser?.gender]);

  useEffect(() => {
    if (hideOfficialRecords || !appServices?.db) {
      setRemoteRankingEntries([]);
      setRemoteRankingLoading(false);
      return;
    }
    let cancelled = false;
    setRemoteRankingLoading(true);
    fetchRankingEntriesForView(appServices.db, {
      rankingType,
      rankingFilters: appliedRankingFilters,
      currentUser,
      currentUserId,
      fullLoad: rankingSearchMode,
      pageSize: remoteRankingPageSize,
      pageCursor: rankingSearchMode ? remoteRankingCursorStack[remoteRankingPage - 1] || null : null,
    })
      .then((result) => {
        if (cancelled) return;
        const entries = Array.isArray(result) ? result : (result.entries || []);
        setRemoteRankingEntries(entries);
        if (rankingSearchMode && !Array.isArray(result)) {
          setRemoteRankingNextCursor(result.nextCursor || null);
          setRemoteRankingHasMore(Boolean(result.hasMore));
        } else {
          setRemoteRankingNextCursor(null);
          setRemoteRankingHasMore(false);
        }
        if (rankingSearchMode) {
          setRemoteRankingNotice(entries.length ? `검색 조건 기준 Firestore 공식기록 ${entries.length.toLocaleString()}건을 불러왔습니다.` : "검색 조건에 맞는 Firestore 공식기록이 없습니다. 조건/업로드 수/인덱스를 확인하세요.");
        } else {
          setRemoteRankingNotice(entries.length ? "첫 화면은 내 프로필 기준 공식기록 일부만 가볍게 불러옵니다. 조건 변경 후 검색을 누르면 서버 조건 쿼리로 빠르게 조회합니다." : "조건에 맞는 Firestore 공식기록이 없으면 사용자 기록만 표시됩니다.");
        }
      })
      .catch((error) => {
        if (cancelled) return;
        console.warn("ranking_entries query failed", error);
        setRemoteRankingEntries([]);
        setRemoteRankingNotice("ranking_entries 인덱스/권한이 없으면 공식기록을 불러올 수 없습니다.");
      })
      .finally(() => {
        if (!cancelled) setRemoteRankingLoading(false);
      });
    return () => { cancelled = true; };
  }, [appServices?.db, hideOfficialRecords, rankingType, appliedRankingFilters, rankingSearchMode, remoteRankingPage, remoteRankingPageSize, remoteRankingCursorStack, currentUser?.id, currentUser?.division, currentUser?.gender, currentUserId]);

  const remoteUsers = useMemo(() => buildUsersFromRankingEntries(remoteRankingEntries), [remoteRankingEntries]);
  const remoteSessions = useMemo(() => buildSessionsFromRankingEntries(remoteRankingEntries), [remoteRankingEntries]);

  const rankingUsers = useMemo(() => {
    const sourceUsers = hideOfficialRecords ? users : [...users, ...remoteUsers];
    const dedupedUsers = Array.from(new Map(sourceUsers.map((user) => [user.id, user])).values());
    const base = hideOfficialRecords ? dedupedUsers.filter((user) => !user.isSampleData && !user.isOfficialRecordUser) : dedupedUsers;
    if (hideOfficialRecords && currentUser?.id && !base.some((user) => user.id === currentUser.id)) {
      return [...base, currentUser];
    }
    return base;
  }, [users, remoteUsers, hideOfficialRecords, currentUser]);
  const rankingSessions = useMemo(() => {
    const sourceSessions = hideOfficialRecords ? sessions : [...sessions, ...remoteSessions];
    const dedupedSessions = Array.from(new Map(sourceSessions.map((session) => [session.id, session])).values());
    if (!hideOfficialRecords) return dedupedSessions;
    const allowedUserIds = new Set(rankingUsers.map((user) => user.id));
    return dedupedSessions.filter((session) => allowedUserIds.has(session.userId));
  }, [sessions, remoteSessions, rankingUsers, hideOfficialRecords]);
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
  const groupOptions = useMemo(() => {
    const map = new Map();
    effectiveRankingUsers.forEach((u) => {
      const canonical = getCanonicalSchoolName(u.groupName || u.schoolName || u.school || "");
      if (!canonical) return;
      const key = normalizeSchoolSearchKey(canonical);
      if (!map.has(key)) map.set(key, canonical);
    });
    return sortKoreanOptions(Array.from(map.values()));
  }, [effectiveRankingUsers, sortKoreanOptions]);
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
    setRemoteRankingPage(1);
    setRemoteRankingCursorStack([null]);
    setRemoteRankingNextCursor(null);
    setRemoteRankingHasMore(false);
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

  const officialRankingCount = useMemo(() => {
    const ids = new Set();
    effectiveRankingUsers.forEach((user) => {
      if (user?.isSampleData || user?.isOfficialRecordUser || user?.sourceType === "official") ids.add(user.id);
    });
    return ids.size;
  }, [effectiveRankingUsers]);

  const userRankingCount = useMemo(() => {
    const ids = new Set();
    effectiveRankingUsers.forEach((user) => {
      if (!user?.isSampleData && !user?.isOfficialRecordUser && user?.id) ids.add(user.id);
    });
    return ids.size;
  }, [effectiveRankingUsers]);
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
    const items = buildDistanceRankings(effectiveRankingUsers, rankingSessions, appliedRankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, appliedRankingFilters]);

  const totalRankings = useMemo(() => {
    const items = buildTotalRankings(effectiveRankingUsers, rankingSessions, appliedRankingFilters, { weekly: false });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, appliedRankingFilters]);

  const weeklyDistanceRankings = useMemo(() => {
    const items = buildDistanceRankings(effectiveRankingUsers, rankingSessions, appliedRankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, appliedRankingFilters]);

  const weeklyTotalRankings = useMemo(() => {
    const items = buildTotalRankings(effectiveRankingUsers, rankingSessions, appliedRankingFilters, { weekly: true });
    items.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return String(b.latestDate).localeCompare(String(a.latestDate));
    });
    return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [effectiveRankingUsers, rankingSessions, appliedRankingFilters]);

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

  useEffect(() => {
    const handleRankingScroll = () => {
      if (activeRankings.length <= 20) {
        setShowRankingQuickNav(false);
        return;
      }
      const twentiethCard = document.querySelector('[data-ranking-index="20"]');
      if (!twentiethCard) {
        setShowRankingQuickNav(false);
        return;
      }
      const rect = twentiethCard.getBoundingClientRect();
      setShowRankingQuickNav(rect.top < window.innerHeight * 0.82);
    };
    handleRankingScroll();
    window.addEventListener("scroll", handleRankingScroll, { passive: true });
    window.addEventListener("resize", handleRankingScroll);
    return () => {
      window.removeEventListener("scroll", handleRankingScroll);
      window.removeEventListener("resize", handleRankingScroll);
    };
  }, [activeRankings.length, visibleRankings.length]);

  const scrollToRankingTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToTop10 = useCallback(() => {
    rankingListTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const scrollToMyRank = useCallback(() => {
    const move = () => {
      const target = document.querySelector('[data-my-ranking-card="true"]');
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("ring-2", "ring-blue-400", "ring-offset-2");
        window.setTimeout(() => target.classList.remove("ring-2", "ring-blue-400", "ring-offset-2"), 1800);
      } else {
        rankingListTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    if (myRank && !visibleRankings.some((item) => item.userId === currentUserId)) {
      setShowAllRankings(true);
      window.setTimeout(move, 80);
      return;
    }
    move();
  }, [currentUserId, myRank, visibleRankings]);

  const myRankingGroup = myRank?.rankingGroup || getRankingGroup(currentUser?.division, currentUser?.gender) || rankingFilters.rankingGroup;
  const myRequiredDistances = myRank?.requiredDistances?.length
    ? myRank.requiredDistances
    : getRequiredDistancesForRankingGroup(myRankingGroup);
  const myDistanceRankRows = useMemo(() => {
    if (!currentUserId || !myRequiredDistances.length) return [];
    const weekly = rankingType === "weeklyDistance" || rankingType === "weeklyTotal";
    return myRequiredDistances.map((distance) => {
      const items = buildDistanceRankings(
        effectiveRankingUsers,
        rankingSessions,
        {
          ...appliedRankingFilters,
          distance: String(distance),
          rankingGroup: myRankingGroup || appliedRankingFilters.rankingGroup || "all",
        },
        { weekly }
      );
      items.sort((a, b) => {
        if (b.bestScore !== a.bestScore) return b.bestScore - a.bestScore;
        return String(b.latestDate).localeCompare(String(a.latestDate));
      });
      const ranked = items.map((item, idx) => ({ ...item, rank: idx + 1 }));
      const mine = ranked.find((item) => item.userId === currentUserId);
      return {
        distance,
        rank: mine?.rank || null,
        bestScore: mine?.bestScore || 0,
        totalCount: ranked.length,
        qualifiedSessions: mine?.qualifiedSessions || 0,
      };
    });
  }, [currentUserId, myRequiredDistances, rankingType, effectiveRankingUsers, rankingSessions, appliedRankingFilters, myRankingGroup]);

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



  const rankingTieGuide =
    rankingType === "distance" || rankingType === "weeklyDistance"
      ? "동점일 경우 최신 기록일이 더 최근인 선수가 앞 순위로 표시됩니다."
      : "동점일 경우 최근 기준거리 기록일이 더 최근인 선수가 앞 순위로 표시됩니다.";
  const officialResultSources = useMemo(() => {
    if (hideOfficialRecords) return [];
    return OFFICIAL_RESULT_SOURCES;
  }, [hideOfficialRecords]);

  const runRankingSearch = useCallback(() => {
    setAppliedRankingFilters({ ...rankingFilters });
    setRankingSearchMode(true);
    setShowAllRankings(true);
    setRemoteRankingPage(1);
    setRemoteRankingCursorStack([null]);
    setRemoteRankingNextCursor(null);
    setRemoteRankingHasMore(false);
    setRemoteRankingNotice("검색 조건 기준으로 Firestore 공식기록을 불러오는 중입니다.");
  }, [rankingFilters]);

  const resetToProfileRanking = useCallback(() => {
    const nextRankingGroup = getRankingGroup(currentUser?.division || "", currentUser?.gender || "남") || "all";
    const nextFilters = {
      distance: "all",
      rankingGroup: nextRankingGroup,
      groupName: "all",
      regionCity: "all",
      gender: currentUser?.gender || "all",
      dateFilter: "all",
      customDate: getCurrentLocalDateString(),
    };
    setRankingFilters(nextFilters);
    setAppliedRankingFilters(nextFilters);
    setRankingSearchMode(false);
    setShowAllRankings(false);
    setRemoteRankingPage(1);
    setRemoteRankingCursorStack([null]);
    setRemoteRankingNextCursor(null);
    setRemoteRankingHasMore(false);
  }, [currentUser?.division, currentUser?.gender]);



  const goNextRankingPage = useCallback(() => {
    if (!remoteRankingHasMore || !remoteRankingNextCursor || remoteRankingLoading) return;
    setRemoteRankingCursorStack((prev) => {
      const next = [...prev];
      next[remoteRankingPage] = remoteRankingNextCursor;
      return next;
    });
    setRemoteRankingPage((prev) => prev + 1);
  }, [remoteRankingHasMore, remoteRankingNextCursor, remoteRankingLoading, remoteRankingPage]);

  const goPrevRankingPage = useCallback(() => {
    if (remoteRankingLoading) return;
    setRemoteRankingPage((prev) => Math.max(1, prev - 1));
  }, [remoteRankingLoading]);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.72fr_1.28fr]">
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
              <div className="mt-2 font-semibold text-slate-700">동점 기준: {rankingTieGuide}</div>
            </div>
            {myRank ? (
              <div className="space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-blue-900 to-red-700 p-5 text-white shadow-lg">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
                        {rankingType === "distance" || rankingType === "weeklyDistance" ? "거리 랭킹" : "종합 랭킹"}
                      </div>
                      <div className="mt-1 text-5xl font-black leading-none">#{myRank.rank}</div>
                    </div>
                    <div className="text-right text-xs leading-relaxed opacity-90">
                      {rankingType === "distance" || rankingType === "weeklyDistance" ? (
                        <>
                          <div>{myRank.distanceLabel || `${myRank.distance}m`}</div>
                          <div>최고 {myRank.bestScore}점 · 인정 기록 {myRank.qualifiedSessions}개</div>
                        </>
                      ) : (
                        <>
                          <div>종합 {myRank.totalScore}점</div>
                          <div>기준 거리 {myRank.requiredDistances.join(" / ")}m</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {myDistanceRankRows.length ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-slate-900">거리별 내 랭킹</div>
                      <div className="text-xs text-slate-500">{myRankingGroup || "내 구분"}</div>
                    </div>
                    <div className="grid gap-2">
                      {myDistanceRankRows.map((row) => (
                        <div
                          key={row.distance}
                          className="grid grid-cols-[64px_1fr_auto] items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-sm"
                        >
                          <div className="font-bold text-slate-900">{row.distance}m</div>
                          <div className="text-slate-600">
                            {row.rank ? (
                              <>
                                <span className="font-semibold text-blue-700">#{row.rank}</span> / {row.totalCount}명
                              </>
                            ) : (
                              <span className="text-slate-400">기록 없음</span>
                            )}
                          </div>
                          <div className="text-right text-xs text-slate-500">
                            {row.bestScore ? `${row.bestScore}점` : "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                현재 선택한 조건에서 랭킹에 반영된 기록이 없다.
                {hideOfficialRecords && (rankingType === "total" || rankingType === "weeklyTotal") ? (
                  <div className="mt-2 text-xs text-slate-500">
                    종합 랭킹은 부문별 필수 4거리 기록이 모두 있어야 표시됩니다. 예: 남자 대학부/일반부는 90m·70m·50m·30m, 여자 대학부/일반부는 70m·60m·50m·30m 기록이 필요합니다.
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
            {isAdminUser ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                공식기록 {officialRankingCount.toLocaleString()}명 / 사용자기록 {userRankingCount.toLocaleString()}명
              </span>
            ) : null}
            <label className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900">
              <input
                type="checkbox"
                checked={hideOfficialRecords}
                onChange={(e) => setHideOfficialRecords(e.target.checked)}
                className="h-3.5 w-3.5"
              />
              공식기록 제거 후 보기
            </label>
            {isAdminUser && !hideOfficialRecords ? (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {remoteRankingLoading ? "Firestore 랭킹 불러오는 중" : rankingSearchMode ? `검색결과 ${remoteRankingEntries.length.toLocaleString()}건 · ${remoteRankingPage}p` : `Firestore ${remoteRankingEntries.length}건`}
              </span>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hideOfficialRecords && remoteRankingNotice ? (
            <div className="mb-3 rounded-2xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
              {remoteRankingNotice}
            </div>
          ) : null}
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
            <div className="mt-2 font-semibold text-slate-700">동점 기준: {rankingTieGuide}</div>
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

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Label className="w-16 shrink-0 text-sm">검색</Label>
              <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
                <div className="rounded-xl bg-blue-50 px-3 py-2 text-[11px] leading-relaxed text-blue-900">
                  조건을 바꾼 뒤 <b>검색</b>을 눌러야 Firestore 공식 결과를 전체 조건 기준으로 불러옵니다. 첫 화면은 내 프로필 기준 일부만 가볍게 표시합니다.
                </div>
                <Button
                  type="button"
                  className="h-10 rounded-xl px-5 text-sm font-bold"
                  onClick={runRankingSearch}
                  disabled={remoteRankingLoading}
                >
                  {remoteRankingLoading ? "검색 중" : "검색"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl px-4 text-xs"
                  onClick={resetToProfileRanking}
                >
                  내 기준 초기화
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {activeRankings.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                현재 조건에서 랭킹에 반영된 기록이 없다.
              </div>
            ) : (
              <div className="grid gap-3">
                <div ref={rankingListTopRef} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-600 scroll-mt-24">
                  {isAdminUser ? (
                    <span>
                      {showAllRankings
                        ? `전체 ${activeRankings.length.toLocaleString()}명 표시 중`
                        : `상위 ${Math.min(50, activeRankings.length).toLocaleString()}명 표시 중 · 전체 ${activeRankings.length.toLocaleString()}명`}
                    </span>
                  ) : (
                    <span>랭킹 결과</span>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
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
                </div>
                {visibleRankings.map((item, index) => (
                  <div
                    key={`${rankingType}_${item.userId}_${item.distance || item.distanceLabel || "total"}`}
                    data-ranking-index={index + 1}
                    data-my-ranking-card={item.userId === currentUserId ? "true" : undefined}
                    className={`rounded-2xl border px-3 py-2 transition ${
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
                              ? `${item.regionCity || "-"} · ${item.gender || "-"} · ${formatGroupDisplayName(item.groupName)} · ${formatRankingDivisionLabel(item)}`
                              : `${formatGroupDisplayName(item.groupName)} · ${item.regionCity || "-"} · ${item.gender || "-"} · ${formatRankingDivisionLabel(item)}`}
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <Archive className="h-4 w-4" /> 공식 파일 목록
              </div>
            </div>
            <div className="mt-2 rounded-2xl bg-white px-4 py-3 text-xs leading-relaxed text-slate-600">
              현재 앱 랭킹에 적용 중인 최신 공식 대회 기록 1개만 표시합니다. 새 공식 파일을 등록하면 이전 공식 파일 목록은 대체됩니다.
            </div>

            <div className="mt-4 grid gap-3">
              {officialResultSources.length === 0 ? (
                <div className="rounded-2xl bg-white p-4 text-sm text-slate-600">
                  현재 적용 중인 공식 파일이 없습니다.
                </div>
              ) : (
                officialResultSources.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="rounded-full bg-slate-900 text-white">{item.bowType}</Badge>
                      <Badge variant="outline" className="rounded-full">{item.region}</Badge>
                      <Badge variant="outline" className="rounded-full">최신 공식파일</Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-700">
                      <span className="font-medium">{item.notes}</span>
                    </div>
                    <div className="mt-2 text-sm leading-relaxed text-slate-600">
                      원본유형 {item.sourceType} · 상태 {item.status}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      {showRankingQuickNav && (
        <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+14px)] z-50 pointer-events-none px-4">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="pointer-events-auto h-10 rounded-full border-slate-200 bg-white/95 px-4 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur hover:bg-white hover:text-slate-700"
              onClick={scrollToMyRank}
            >
              내 순위 찾기
            </Button>
            <Button
              type="button"
              variant="outline"
              className="pointer-events-auto h-10 rounded-full border-slate-200 bg-white/95 px-4 text-xs font-semibold text-slate-500 shadow-sm backdrop-blur hover:bg-white hover:text-slate-700"
              onClick={scrollToTop10}
            >
              TOP10
            </Button>
            <Button
              type="button"
              variant="outline"
              className="pointer-events-auto h-10 w-10 rounded-full border-slate-200 bg-white/95 p-0 text-base font-semibold text-slate-500 shadow-sm backdrop-blur hover:bg-white hover:text-slate-700"
              onClick={scrollToRankingTop}
              aria-label="최상단으로 이동"
            >
              ↑
            </Button>
          </div>
        </div>
      )}
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


function buildLateCollapseDetail(sessions = []) {
  const completed = (sessions || [])
    .filter((session) => session?.isComplete && session.recordInputType !== "distance" && Array.isArray(session.ends) && session.ends.length >= 4);

  const collapsePoints = [];
  completed.forEach((session) => {
    const endAvgs = (session.ends || []).map((end, idx) => {
      const arrows = (end.arrows || []).filter((value) => value !== null && value !== undefined && String(value).trim() !== "");
      return {
        endNumber: idx + 1,
        avg: arrows.length ? Number((endTotal(end) / arrows.length).toFixed(2)) : null,
      };
    }).filter((item) => item.avg !== null);

    for (let i = 1; i < endAvgs.length; i += 1) {
      const drop = Number((endAvgs[i].avg - endAvgs[i - 1].avg).toFixed(2));
      if (drop <= -0.25) {
        collapsePoints.push({ endNumber: endAvgs[i].endNumber, drop, date: session.sessionDate || session.updatedAt || "" });
        break;
      }
    }
  });

  if (!collapsePoints.length) {
    return {
      ready: completed.length > 0,
      endNumber: null,
      label: "후반 붕괴 지점 미확인",
      message: completed.length ? "엔드별 평균이 급격히 무너지는 구간은 아직 뚜렷하지 않습니다." : "엔드별 기록이 쌓이면 몇 엔드부터 흔들리는지 자동으로 찾습니다.",
    };
  }

  const counts = collapsePoints.reduce((acc, item) => {
    acc[item.endNumber] = (acc[item.endNumber] || 0) + 1;
    return acc;
  }, {});
  const endNumber = Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
  const endDrops = collapsePoints.filter((item) => item.endNumber === endNumber).map((item) => item.drop);
  const avgDrop = Number(averageNumbers(endDrops).toFixed(2));

  return {
    ready: true,
    endNumber,
    avgDrop,
    label: `${endNumber}엔드부터 흔들림`,
    message: `최근 엔드별 기록에서 ${endNumber}엔드부터 평균 ${Math.abs(avgDrop)}점 하락 신호가 반복됩니다. 이 구간부터 호흡·손압·시선 루틴을 따로 체크해야 합니다.`,
  };
}

function buildDistanceGameDeclineInsight(sessions = []) {
  const rows = [];
  (sessions || []).forEach((session) => {
    if (!session?.isComplete || !Array.isArray(session.distanceRounds) || !session.distanceRounds.length) return;
    (session.distanceRounds || []).forEach((round) => {
      const distance = Number(round.distance);
      const total = Number(round.total);
      const arrows = Number(session.arrowsPerDistance || round.arrows || 36) || 36;
      if (!distance || !Number.isFinite(total)) return;
      rows.push({
        distance,
        date: session.sessionDate || session.updatedAt || "",
        avg: Number((total / arrows).toFixed(2)),
      });
    });
  });

  const byDistance = new Map();
  rows.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0)).forEach((row) => {
    if (!byDistance.has(row.distance)) byDistance.set(row.distance, []);
    byDistance.get(row.distance).push(row);
  });

  const declines = Array.from(byDistance.entries()).map(([distance, items]) => {
    if (items.length < 2) return null;
    const recent = items.slice(-3);
    const previous = items.slice(-6, -3);
    if (!previous.length) return null;
    const recentAvg = Number(averageNumbers(recent.map((item) => item.avg)).toFixed(2));
    const previousAvg = Number(averageNumbers(previous.map((item) => item.avg)).toFixed(2));
    const delta = Number((recentAvg - previousAvg).toFixed(2));
    return { distance, recentAvg, previousAvg, delta, count: items.length };
  }).filter(Boolean).sort((a, b) => a.delta - b.delta);

  if (!declines.length) {
    return {
      ready: false,
      label: "거리별 경기 하락 데이터 필요",
      message: "거리기반 기록이 같은 거리에서 최소 2~3회 이상 쌓이면 어느 경기·거리에서 하락했는지 분석합니다.",
      items: [],
    };
  }

  const worst = declines[0];
  return {
    ready: true,
    label: `${worst.distance}m 최근 하락`,
    message: `${worst.distance}m는 이전 구간 평균 ${worst.previousAvg}점에서 최근 ${worst.recentAvg}점으로 ${worst.delta}점 변화했습니다. 거리별 하락 구간을 경기 단위로 추적해야 합니다.`,
    items: declines.slice(0, 4),
  };
}

function buildTrainingChecklistItems(trainingPrescription = {}, lateCollapse = {}, distanceGameDecline = {}) {
  const strength = (trainingPrescription.strengthItems || []).slice(0, 2).map((item, idx) => ({
    id: `strength_${idx}_${item.part}`.replace(/\s+/g, "_"),
    label: `${item.part} 운동 완료`,
    detail: item.exercise,
  }));
  const cardio = (trainingPrescription.cardioItems || []).slice(0, 1).map((item, idx) => ({
    id: `cardio_${idx}`,
    label: "유산소 훈련 완료",
    detail: item,
  }));
  const mental = (trainingPrescription.mentalItems || []).slice(0, 1).map((item, idx) => ({
    id: `mental_${idx}`,
    label: lateCollapse?.endNumber ? `${lateCollapse.endNumber}엔드 전 멘탈 루틴 체크` : "실수 후 멘탈 루틴 체크",
    detail: item,
  }));
  const distance = distanceGameDecline?.ready ? [{
    id: "distance_decline_focus",
    label: `${distanceGameDecline.label} 보완 기록`,
    detail: distanceGameDecline.message,
  }] : [];
  return [...strength, ...cardio, ...mental, ...distance].slice(0, 6);
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

function getSessionDistanceLabelForReport(session) {
  if (!session) return "-";
  if (session.recordInputType === "distance" && Array.isArray(session.distanceRounds) && session.distanceRounds.length) {
    const labels = Array.from(new Set(session.distanceRounds.map((round) => `${Number(round.distance) || "-"}m`)));
    return labels.filter((label) => !label.includes("-m")).join(" / ") || "거리기반";
  }
  return Number(session.distance) ? `${Number(session.distance)}m` : "-";
}

function normalizeTextValue(value) {
  return String(value ?? "").trim();
}

function getSessionConditionObject(session) {
  return session?.condition || session?.conditions || session?.meta?.condition || session?.trainingCondition || {};
}

function getSessionConditionText(session, keys = []) {
  const condition = getSessionConditionObject(session);
  for (const key of keys) {
    const value = condition?.[key] ?? session?.[key];
    if (value !== null && value !== undefined && String(value).trim() !== "") return normalizeTextValue(value);
  }
  return "";
}

function getSessionConditionNumber(session, keys = []) {
  const raw = getSessionConditionText(session, keys);
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function buildWindMentalInsight(sessions = [], lateSetDropInsight = {}) {
  const completed = (sessions || []).filter((session) => session?.isComplete || session?.status === "completed");
  const windTagged = completed
    .map((session) => {
      const manualWind = getSessionConditionText(session, ["wind", "windLevel", "windStrength", "weatherWind", "바람"]);
      const effectiveWind = manualWind || getEffectiveWindLevel(session);
      return {
        wind: effectiveWind,
        source: session?.weather?.athleteWindFeel ? "체감" : (session?.weather?.auto ? "기상" : "수동"),
        avg: getSessionAverageForGrowth(session),
      };
    })
    .filter((item) => item.wind && item.wind !== "정보없음");

  const calmScores = windTagged.filter((item) => /없|약|low|calm|1|2/i.test(item.wind)).map((item) => item.avg);
  const windScores = windTagged.filter((item) => /강|중|high|wind|3|4|5/i.test(item.wind)).map((item) => item.avg);
  const calmAvg = calmScores.length ? Number(averageNumbers(calmScores).toFixed(2)) : null;
  const windAvg = windScores.length ? Number(averageNumbers(windScores).toFixed(2)) : null;
  const windGap = calmAvg !== null && windAvg !== null ? Number((calmAvg - windAvg).toFixed(2)) : null;

  const focusScores = completed
    .map((session) => getSessionConditionNumber(session, ["focus", "mental", "concentration", "집중", "멘탈"]))
    .filter((value) => value !== null);
  const fatigueScores = completed
    .map((session) => getSessionConditionNumber(session, ["fatigue", "tired", "피로", "피로도"]))
    .filter((value) => value !== null);
  const focusAvg = focusScores.length ? Number(averageNumbers(focusScores).toFixed(1)) : null;
  const fatigueAvg = fatigueScores.length ? Number(averageNumbers(fatigueScores).toFixed(1)) : null;

  const lateRisk = lateSetDropInsight?.label === "후반 하락";
  let mentalRiskLevel = "관찰";
  if (lateRisk || (focusAvg !== null && focusAvg <= 3) || (fatigueAvg !== null && fatigueAvg >= 4)) mentalRiskLevel = "주의";
  if (lateRisk && ((focusAvg !== null && focusAvg <= 2.5) || (fatigueAvg !== null && fatigueAvg >= 4.5))) mentalRiskLevel = "높음";

  const windMessage = windGap !== null
    ? `바람이 약한 조건 평균은 ${calmAvg}점, 바람 영향 조건 평균은 ${windAvg}점으로 ${windGap > 0 ? `${windGap}점 하락` : `${Math.abs(windGap)}점 개선`} 흐름입니다.`
    : "체감 바람 입력이 없어도 장소/날짜 기준 기상 데이터가 있으면 자동 바람 기준으로 분석합니다. 자동조회 기록이 부족하면 먼저 장소를 선택하고 바람 자동조회를 실행하세요.";

  const mentalMessage = lateRisk
    ? "후반 하락이 반복됩니다. 기술 문제로만 보면 안 됩니다. 경기 후반에는 조준이 아니라 루틴, 호흡, 판단 속도를 관리해야 합니다."
    : "후반 점수 차이는 아직 치명적이지 않습니다. 다만 대회 환경에서는 바람과 긴장으로 흔들릴 수 있으므로 사전 멘탈 루틴을 고정해야 합니다.";

  const coldDiagnosis = mentalRiskLevel === "높음"
    ? "점수 하락의 핵심 원인은 실력 부족보다 흔들린 상황에서 루틴을 회복하지 못하는 문제일 가능성이 큽니다. 즉시 멘탈 루틴을 훈련 항목으로 분리해야 합니다."
    : mentalRiskLevel === "주의"
      ? "기록 흐름은 유지 가능하지만 후반 집중력과 컨디션 변동 리스크가 있습니다. 실전에서는 바람 한 번, 실수 한 발 이후 회복 루틴이 승부를 가릅니다."
      : "현재 기록만 보면 큰 멘탈 붕괴 신호는 약합니다. 하지만 대회형 선수라면 바람 조건과 긴장 상황을 일부러 넣어 검증해야 합니다.";

  return {
    windTaggedCount: windTagged.length,
    calmAvg,
    windAvg,
    windGap,
    focusAvg,
    fatigueAvg,
    mentalRiskLevel,
    windMessage,
    mentalMessage,
    coldDiagnosis,
    coachingPlan: [
      "1발 루틴 고정: 발 위치 → 호흡 1회 → 조준 기준점 → 릴리즈 후 즉시 복기.",
      "바람 대응 기록: 바람 방향/강도를 기록하고 같은 거리에서 평균점수 변화를 비교.",
      "실수 후 회복 루틴: 8점 이하 한 발 뒤에는 바로 다음 화살을 쏘지 말고 호흡·시선·손압을 재설정.",
      "후반 2엔드 별도 훈련: 체력이 떨어진 상태에서 12발을 따로 기록해 후반 집중력만 추적.",
    ],
  };
}


function buildTrainingPrescriptionData({ completed = [], weakestDistance = null, strongestDistance = null, distanceGap = 0, stability = 0, lateSetDropInsight = {}, windMental = {} } = {}) {
  const weakLabel = weakestDistance?.label || "약점 거리";
  const lateDropRisk = lateSetDropInsight?.label === "후반 하락";
  const stabilityRisk = Number(stability) > 0 && Number(stability) < 70;
  const windRisk = Number(windMental?.windGap || 0) > 0.25 || ["주의", "높음"].includes(windMental?.mentalRiskLevel);
  const longDistanceRisk = /70|90|60|350/.test(String(weakLabel));

  const strengthItems = [];
  if (lateDropRisk || longDistanceRisk) {
    strengthItems.push({
      part: "하체·둔근",
      why: "후반 엔드와 장거리에서 하체 고정이 흔들리면 조준선이 무너진다.",
      exercise: "스쿼트 3세트 × 12회, 런지 3세트 × 10회, 월싯 40초 × 3회",
    });
  }
  if (stabilityRisk || Number(distanceGap) >= 1.2) {
    strengthItems.push({
      part: "코어",
      why: "좌우 흔들림과 릴리즈 순간 몸통 회전을 줄여 그룹핑을 안정화한다.",
      exercise: "플랭크 45~60초 × 3회, 데드버그 12회 × 3세트, 사이드 플랭크 30초 × 2회",
    });
  }
  strengthItems.push({
    part: "등·견갑 안정화",
    why: "활을 당긴 뒤 견갑을 고정하지 못하면 릴리즈 때 그룹이 퍼진다.",
    exercise: "밴드 로우 15회 × 3세트, 밴드 풀어파트 15회 × 3세트, Y-T-W 10회 × 2세트",
  });
  strengthItems.push({
    part: "어깨 회전근개",
    why: "어깨가 버티지 못하면 후반 화살에서 조준 유지 시간이 짧아진다.",
    exercise: "밴드 외회전 12회 × 3세트, 페이스풀 12회 × 3세트",
  });

  const cardioItems = lateDropRisk
    ? [
        "인터벌 러닝: 30초 빠르게 / 60초 걷기 × 8~10세트",
        "저강도 유산소: 20~30분 빠른 걷기 또는 실내자전거, 주 2회",
      ]
    : [
        "저강도 유산소: 20분 빠른 걷기 또는 조깅, 주 2회",
        "호흡 유지 훈련: 3분 코호흡 + 3분 박스호흡",
      ];

  const balanceItems = windRisk
    ? [
        "한발 서기 45초 × 좌우 2회: 바람이 있을 때 하체 기준점을 잃지 않기 위함",
        "눈 감고 균형 잡기 20초 × 2회: 흔들림 감지 능력 강화",
      ]
    : [
        "한발 서기 30초 × 좌우 2회",
        "발 위치 고정 루틴: 사대 진입 후 발 폭·무게중심 체크",
      ];

  const mentalItems = [
    "실수 직후 8초 루틴: 점수 확인 → 호흡 1회 → 시선 기준점 → 손압 재설정 → 다음 화살",
    "바람 있는 날 기록: 풍향/풍속 또는 체감 바람과 조준 보정 여부를 남긴다.",
    lateDropRisk ? "후반 2엔드 별도 기록: 체력이 떨어진 상태에서 12발만 따로 기록한다." : "같은 조건 3회 반복 기록: 기술 변화보다 안정성 변화를 먼저 본다.",
  ];

  const summary = lateDropRisk
    ? "후반 하락이 확인되므로 근력보다 먼저 지구력과 루틴 유지 능력을 같이 올려야 한다."
    : stabilityRisk
      ? "점수 기복이 있어 코어·견갑 안정화와 반복 루틴 고정이 우선이다."
      : "현재는 특정 약점 거리와 바람 조건을 기준으로 보강 운동을 붙이는 단계다.";

  return {
    weakLabel,
    summary,
    strengthItems: strengthItems.slice(0, 4),
    cardioItems,
    balanceItems,
    mentalItems,
  };
}

function buildParentAnalysisDataFromSessions(sessions = [], distancePerformance = [], parentGrowthSummary = {}, lateSetDropInsight = {}) {
  const completed = (sessions || [])
    .filter((session) => session?.isComplete || session?.status === "completed")
    .slice()
    .sort((a, b) => new Date(a.sessionDate || a.updatedAt || 0) - new Date(b.sessionDate || b.updatedAt || 0));

  const averages = completed
    .map((session) => Number(session.summary?.averageArrow ?? getAverageArrow(session)) || 0)
    .filter((value) => value > 0);

  const recentFive = completed.slice(-5);
  const previousFive = completed.slice(-10, -5);
  const recentAverage = averages.length ? Number(averageNumbers(recentFive.map(getSessionAverageForGrowth)).toFixed(2)) : 0;
  const previousAverage = previousFive.length
    ? Number(averageNumbers(previousFive.map(getSessionAverageForGrowth)).toFixed(2))
    : Number(parentGrowthSummary?.previousAverage || recentAverage || 0);
  const delta = Number((recentAverage - previousAverage).toFixed(2));
  const bestAverage = averages.length ? Number(Math.max(...averages).toFixed(2)) : 0;
  const variance = averages.length ? averageNumbers(averages.map((value) => Math.pow(value - averageNumbers(averages), 2))) : 0;
  const stability = Math.max(0, Math.min(100, Math.round(100 - Math.sqrt(variance) * 20)));

  const validDistances = (distancePerformance || []).filter((item) => Number(item.avgArrow) > 0);
  const weakestDistance = validDistances.length ? validDistances.slice().sort((a, b) => a.avgArrow - b.avgArrow)[0] : null;
  const strongestDistance = validDistances.length ? validDistances.slice().sort((a, b) => b.avgArrow - a.avgArrow)[0] : null;
  const weakDistanceLabel = weakestDistance?.label || "기록 필요";
  const strongDistanceLabel = strongestDistance?.label || "기록 필요";
  const distanceGap = weakestDistance && strongestDistance ? Number((strongestDistance.avgArrow - weakestDistance.avgArrow).toFixed(2)) : 0;

  const lastSession = completed[completed.length - 1] || null;
  const lastSessionScore = lastSession ? Number((Number(lastSession.summary?.averageArrow ?? getAverageArrow(lastSession)) || 0).toFixed(2)) : 0;
  const lastSessionDate = lastSession ? formatDateOnly(lastSession.sessionDate || lastSession.updatedAt || "") : "-";
  const lastSessionDistance = getSessionDistanceLabelForReport(lastSession);

  const trendLabel = delta >= 0.2 ? "상승" : delta <= -0.2 ? "하락" : "유지";
  const growthLevel = delta >= 0.4 ? "강한 상승" : delta >= 0.2 ? "상승" : delta <= -0.4 ? "주의" : delta <= -0.2 ? "하락" : "안정";
  const lateLabel = lateSetDropInsight?.label || "엔드별 기록 필요";
  const lateMessage = lateSetDropInsight?.message || "엔드별 기록이 쌓이면 후반 집중력 변화를 분석한다.";
  const windMental = buildWindMentalInsight(completed, lateSetDropInsight);
  const lateCollapse = buildLateCollapseDetail(completed);
  const distanceGameDecline = buildDistanceGameDeclineInsight(completed);
  const routineGuide = "루틴 완료율과 점수 상관관계는 루틴 저장 데이터가 누적되면 자동으로 연결된다.";

  const parentSummary = completed.length
    ? `최근 ${recentFive.length || completed.length}회 기준 평균은 ${recentAverage || "-"}점이며 이전 구간 대비 ${delta > 0 ? "+" : ""}${delta}점 ${trendLabel} 흐름입니다. 가장 약한 거리는 ${weakDistanceLabel}, 가장 안정적인 거리는 ${strongDistanceLabel}입니다. 바람과 멘탈 변수는 점수 변동을 크게 만들 수 있으므로 별도 관리가 필요합니다.`
    : "기록이 쌓이면 최근 평균, 성장 추세, 약점 거리, 후반 유지율을 부모용 문장으로 자동 변환합니다.";

  const parentRecommendation = completed.length
    ? `${weakDistanceLabel} 집중 훈련을 우선하고, ${lateLabel === "후반 하락" ? "후반 집중력 유지 루틴" : "동일 조건 반복 기록"}을 함께 관리하세요. 특히 바람이 있는 날과 실수 직후의 멘탈 회복 루틴을 기록해야 합니다.`
    : "동일 조건 기록을 3회 이상 저장하면 첫 부모용 리포트를 생성할 수 있습니다.";

  const trainingPrescription = buildTrainingPrescriptionData({
    completed,
    weakestDistance,
    strongestDistance,
    distanceGap,
    stability,
    lateSetDropInsight,
    windMental,
  });
  const trainingChecklist = buildTrainingChecklistItems(trainingPrescription, lateCollapse, distanceGameDecline);

  return {
    ready: completed.length >= 1,
    sessionCount: completed.length,
    recentAverage,
    previousAverage,
    delta,
    trendLabel,
    growthLevel,
    bestAverage,
    stability,
    weakDistanceLabel,
    strongDistanceLabel,
    distanceGap,
    lateLabel,
    lateMessage,
    lastSessionDate,
    lastSessionDistance,
    lastSessionScore,
    parentSummary,
    parentRecommendation,
    routineGuide,
    windMental,
    lateCollapse,
    distanceGameDecline,
    trainingPrescription,
    trainingChecklist,
    generatedAt: formatDateOnly(getCurrentLocalDateString()),
  };
}

function loadExternalScriptOnce(src, globalKey) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("브라우저 환경에서만 PDF를 생성할 수 있습니다."));
    if (globalKey && window[globalKey]) return resolve(window[globalKey]);
    const existing = Array.from(document.querySelectorAll("script")).find((script) => script.src === src);
    if (existing) {
      existing.addEventListener("load", () => resolve(globalKey ? window[globalKey] : true), { once: true });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(globalKey ? window[globalKey] : true);
    script.onerror = () => reject(new Error(`PDF 라이브러리 로드 실패: ${src}`));
    document.body.appendChild(script);
  });
}


function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCompactParentReportHtml({ reportData, playerName, divisionLabel, avgScore, tenRate, consistencyIndex, aiGrade, trendLabel, distanceWeaknessMessage, lateSetDropMessage }) {
  const windMental = reportData?.windMental || {};
  const coachingPlan = Array.isArray(windMental.coachingPlan) ? windMental.coachingPlan : [];
  const generatedAt = reportData?.generatedAt || formatDateOnly(getCurrentLocalDateString());
  const metricRows = [
    ["최근 평균", reportData?.recentAverage || "-", "최근 5회 또는 선택 조건 기준"],
    ["이전 대비", `${reportData?.delta > 0 ? "+" : ""}${reportData?.delta ?? 0}점`, reportData?.trendLabel || "-"],
    ["최고 평균", reportData?.bestAverage || "-", "개인 최고 흐름"],
    ["안정성", `${reportData?.stability || consistencyIndex || 0}%`, reportData?.growthLevel || "-"],
    ["약점 거리", reportData?.weakDistanceLabel || "-", `강점 거리: ${reportData?.strongDistanceLabel || "-"}`],
    ["후반 집중력", reportData?.lateLabel || "-", reportData?.lateMessage || "-"],
    ["바람 기록", windMental.windTaggedCount ? `${windMental.windTaggedCount}회` : "기록 부족", windMental.windGap !== null && windMental.windGap !== undefined ? `바람 영향 차이 ${windMental.windGap}점` : "바람 강도 기록 필요"],
    ["멘탈 위험도", windMental.mentalRiskLevel || "관찰", "실수 직후 회복 루틴 기준"],
  ];

  return `
  <div style="width:794px;background:#f8fafc;color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Noto Sans KR','Malgun Gothic',Arial,sans-serif;padding:28px;box-sizing:border-box;line-height:1.42;">
    <div style="background:#0f172a;color:white;border-radius:18px;padding:22px 24px;margin-bottom:14px;">
      <div style="font-size:12px;letter-spacing:.08em;color:#93c5fd;font-weight:800;">X-ANALYSIS PARENT REPORT</div>
      <div style="font-size:25px;font-weight:900;margin-top:4px;">부모용 성장 · 바람 · 멘탈 분석 리포트</div>
      <div style="display:flex;justify-content:space-between;gap:16px;margin-top:12px;font-size:12px;color:#cbd5e1;">
        <div>선수: <b style="color:white;">${escapeHtml(playerName || "선수")}</b> · 구분: ${escapeHtml(divisionLabel || "-")}</div>
        <div>생성일: ${escapeHtml(generatedAt)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px;">
      ${[
        ["평균", avgScore ? Number(avgScore).toFixed(2) : "-", "점수 흐름"],
        ["10점 비율", `${tenRate || 0}%`, "정확도"],
        ["AI 등급", aiGrade || "-", "종합 판단"],
        ["안정성", `${consistencyIndex || 0}%`, "기복 지표"],
      ].map(([k,v,s]) => `<div style="background:white;border:1px solid #e2e8f0;border-radius:14px;padding:12px;"><div style="font-size:11px;color:#64748b;font-weight:700;">${k}</div><div style="font-size:23px;font-weight:900;margin-top:2px;">${v}</div><div style="font-size:10px;color:#94a3b8;">${s}</div></div>`).join("")}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <section style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:14px;">
        <h2 style="margin:0 0 8px;font-size:15px;">1. 냉정한 종합 진단</h2>
        <p style="font-size:12px;margin:0;color:#334155;">${escapeHtml(reportData?.parentSummary || "기록이 부족합니다.")}</p>
        <p style="font-size:12px;margin:8px 0 0;color:#334155;"><b>판단:</b> ${escapeHtml(windMental.coldDiagnosis || "바람과 멘탈 데이터를 더 쌓아야 정확도가 올라갑니다.")}</p>
      </section>
      <section style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:14px;">
        <h2 style="margin:0 0 8px;font-size:15px;">2. 바로 해야 할 훈련</h2>
        <p style="font-size:12px;margin:0;color:#334155;">${escapeHtml(reportData?.parentRecommendation || "동일 조건 기록을 3회 이상 저장하세요.")}</p>
        <p style="font-size:12px;margin:8px 0 0;color:#334155;"><b>핵심:</b> 점수만 보지 말고 바람 조건, 실수 다음 화살, 후반 2엔드를 별도 관리해야 합니다.</p>
      </section>
    </div>

    <section style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:14px;margin-bottom:12px;">
      <h2 style="margin:0 0 8px;font-size:15px;">3. 주요 지표</h2>
      <table style="width:100%;border-collapse:collapse;font-size:11px;">
        <thead><tr style="background:#f1f5f9;color:#475569;"><th style="text-align:left;padding:7px;border:1px solid #e2e8f0;">항목</th><th style="text-align:left;padding:7px;border:1px solid #e2e8f0;">값</th><th style="text-align:left;padding:7px;border:1px solid #e2e8f0;">해석</th></tr></thead>
        <tbody>${metricRows.map(([a,b,c]) => `<tr><td style="padding:7px;border:1px solid #e2e8f0;font-weight:800;">${escapeHtml(a)}</td><td style="padding:7px;border:1px solid #e2e8f0;">${escapeHtml(b)}</td><td style="padding:7px;border:1px solid #e2e8f0;color:#475569;">${escapeHtml(c)}</td></tr>`).join("")}</tbody>
      </table>
    </section>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
      <section style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:16px;padding:14px;">
        <h2 style="margin:0 0 8px;font-size:15px;color:#1e3a8a;">4. 바람 대응 분석</h2>
        <p style="font-size:12px;margin:0;color:#1e3a8a;">${escapeHtml(windMental.windMessage || "바람 조건 기록이 필요합니다.")}</p>
        <ul style="font-size:11px;margin:8px 0 0 16px;padding:0;color:#1e40af;">
          <li>바람 강도: 없음/약함/중간/강함으로 기록</li>
          <li>거리별 바람 영향 점수 차이 추적</li>
          <li>바람 있는 날은 점수보다 조준 기준 유지 여부를 기록</li>
        </ul>
      </section>
      <section style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:14px;">
        <h2 style="margin:0 0 8px;font-size:15px;color:#9a3412;">5. 멘탈 코칭 분석</h2>
        <p style="font-size:12px;margin:0;color:#9a3412;">${escapeHtml(windMental.mentalMessage || "멘탈 루틴 기록이 필요합니다.")}</p>
        <ul style="font-size:11px;margin:8px 0 0 16px;padding:0;color:#9a3412;">
          <li>실수 직후 다음 화살 전 8초 호흡</li>
          <li>점수 확인보다 루틴 성공 여부를 먼저 체크</li>
          <li>후반 2엔드는 별도 집중력 지표로 관리</li>
        </ul>
      </section>
    </div>

    <section style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:14px;margin-bottom:12px;">
      <h2 style="margin:0 0 8px;font-size:15px;">6. 근력·유산소 처방</h2>
      <p style="font-size:11px;margin:0 0 8px;color:#475569;">${escapeHtml(reportData?.trainingPrescription?.summary || "기록이 쌓이면 필요한 근력·유산소 운동을 자동 추천합니다.")}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10.5px;">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:9px;"><b>근력</b><br/>${(reportData?.trainingPrescription?.strengthItems || []).map((item) => `${escapeHtml(item.part)}: ${escapeHtml(item.exercise)}`).join("<br/>")}</div>
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:9px;"><b>유산소·밸런스</b><br/>${[...(reportData?.trainingPrescription?.cardioItems || []), ...(reportData?.trainingPrescription?.balanceItems || [])].map(escapeHtml).join("<br/>")}</div>
      </div>
    </section>

    <section style="background:white;border-radius:16px;border:1px solid #e2e8f0;padding:14px;margin-bottom:12px;">
      <h2 style="margin:0 0 8px;font-size:15px;">7. 7일 실행 계획</h2>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:11px;">
        ${coachingPlan.map((item) => `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:9px;">${escapeHtml(item)}</div>`).join("")}
      </div>
    </section>

    <section style="background:#0f172a;color:white;border-radius:16px;padding:14px;">
      <h2 style="margin:0 0 8px;font-size:15px;">최종 코멘트</h2>
      <p style="font-size:12px;margin:0;color:#e2e8f0;">양궁은 바람과 멘탈의 싸움입니다. 기술이 좋아도 바람 조건에서 기준점을 잃거나, 한 발 실수 뒤 루틴이 무너지면 기록은 급격히 흔들립니다. 다음 리포트부터는 점수뿐 아니라 바람 강도, 실수 직후 회복, 후반 집중력까지 함께 기록해야 분석 정확도가 올라갑니다.</p>
    </section>
  </div>`;
}

async function downloadParentAnalysisReportAsPdf(reportPayload, filename = "x-analysis-parent-report.pdf") {
  if (typeof window === "undefined" || typeof document === "undefined") throw new Error("브라우저 환경에서만 PDF를 생성할 수 있습니다.");
  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-99999px";
  wrapper.style.top = "0";
  wrapper.style.zIndex = "-1";
  wrapper.innerHTML = renderCompactParentReportHtml(reportPayload);
  document.body.appendChild(wrapper);
  try {
    await downloadReportElementAsPdf(wrapper.firstElementChild, filename);
  } finally {
    document.body.removeChild(wrapper);
  }
}

async function downloadReportElementAsPdf(element, filename = "x-analysis-parent-report.pdf") {
  if (!element) throw new Error("PDF로 저장할 리포트 영역을 찾지 못했습니다.");
  await loadExternalScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", "html2canvas");
  await loadExternalScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", "jspdf");

  const jsPDFCtor = window.jspdf?.jsPDF;
  if (!jsPDFCtor) throw new Error("jsPDF 초기화에 실패했습니다.");

  // A4 문서 기준: 안전 여백을 두고, 섹션 단위로 페이지를 넘긴다.
  // 기존 방식은 긴 화면 전체를 하나의 이미지로 만든 뒤 잘라서 글자/박스가 페이지 경계에서 잘렸다.
  // 이 방식은 카드/섹션 하나가 중간에서 잘리지 않도록 다음 페이지로 넘긴다.
  const pdf = new jsPDFCtor("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 12;
  const marginTop = 12;
  const marginBottom = 14;
  const contentWidth = pageWidth - marginX * 2;
  const pageContentBottom = pageHeight - marginBottom;
  const sectionGap = 3;

  const sourceChildren = Array.from(element.children || []);
  const sections = sourceChildren.length ? sourceChildren : [element];
  let cursorY = marginTop;
  let hasContent = false;

  const addPageIfNeeded = (requiredHeight) => {
    if (!hasContent) return;
    if (cursorY + requiredHeight > pageContentBottom) {
      pdf.addPage();
      cursorY = marginTop;
    }
  };

  const addCanvasToPdf = (canvas) => {
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // 보통 섹션은 한 페이지 안에 들어간다. 들어가지 않을 때만 안전 슬라이스 처리.
    const maxHeight = pageContentBottom - marginTop;
    if (imgHeight <= maxHeight) {
      addPageIfNeeded(imgHeight);
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", marginX, cursorY, imgWidth, imgHeight);
      cursorY += imgHeight + sectionGap;
      hasContent = true;
      return;
    }

    // 예외적으로 아주 긴 섹션은 페이지 단위로 나누되, 상하 여백을 유지한다.
    const pxPerMm = canvas.width / imgWidth;
    const sliceHeightPx = Math.floor(maxHeight * pxPerMm);
    let y = 0;
    while (y < canvas.height) {
      if (hasContent) {
        pdf.addPage();
        cursorY = marginTop;
      }
      const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - y);
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = currentSliceHeight;
      const ctx = sliceCanvas.getContext("2d");
      ctx.drawImage(canvas, 0, y, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight);
      const sliceMmHeight = (currentSliceHeight * imgWidth) / canvas.width;
      pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", marginX, cursorY, imgWidth, sliceMmHeight);
      hasContent = true;
      y += currentSliceHeight;
    }
    cursorY = pageContentBottom;
  };

  for (const section of sections) {
    const canvas = await window.html2canvas(section, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth || 794,
    });
    addCanvasToPdf(canvas);
  }

  pdf.save(filename);
}


function AnalysisBoard({ currentUser, users, sessions, routines = [], appServices, onRoutineSaved, onNavigate }) {
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
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window === "undefined" ? 1024 : window.innerWidth));
  const [activeAnalysisTab, setActiveAnalysisTab] = useState(savedAnalysisState.activeAnalysisTab || "summary");
  const [activeSideMenu, setActiveSideMenu] = useState(savedAnalysisState.activeSideMenu || "분석 리포트");
  const [pdfBusy, setPdfBusy] = useState(false);
  const [tabletFullView, setTabletFullView] = useState(() => {
    try { return sessionStorage.getItem(`${analysisStateKey}_tablet_full_view`) === "true"; } catch { return false; }
  });
  const [trainingChecks, setTrainingChecks] = useState({});
  const summarySectionRef = useRef(null);
  const detailSectionRef = useRef(null);
  const compareSectionRef = useRef(null);
  const trendSectionRef = useRef(null);
  const reportSectionRef = useRef(null);
  const prescriptionRoutineSyncedRef = useRef("");
  const routineToastTimerRef = useRef(null);
  const [prescriptionRoutineStatus, setPrescriptionRoutineStatus] = useState("");
  const [routineSyncToast, setRoutineSyncToast] = useState("");
  const todayKeyForPrescription = getCurrentLocalDateString();
  const prescriptionRoutineId = currentUser?.id ? makeRoutineDocId(currentUser.id, todayKeyForPrescription) : "";

  const showRoutineSyncToast = useCallback((message) => {
    if (!message) return;
    setRoutineSyncToast(message);
    if (routineToastTimerRef.current) {
      clearTimeout(routineToastTimerRef.current);
    }
    routineToastTimerRef.current = setTimeout(() => {
      setRoutineSyncToast("");
      routineToastTimerRef.current = null;
    }, 2600);
  }, []);

  useEffect(() => () => {
    if (routineToastTimerRef.current) clearTimeout(routineToastTimerRef.current);
  }, []);

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

  useEffect(() => {
    try { sessionStorage.setItem(`${analysisStateKey}_tablet_full_view`, tabletFullView ? "true" : "false"); } catch {}
  }, [analysisStateKey, tabletFullView]);

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
  const isDesktopAnalysis = viewportWidth >= 1280;

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
  const parentReportData = useMemo(
    () => buildParentAnalysisDataFromSessions(filteredMine, distancePerformance, parentGrowthSummary, lateSetDropInsight),
    [filteredMine, distancePerformance, parentGrowthSummary, lateSetDropInsight]
  );

  const buildPrescriptionRoutineItems = useCallback((checks = trainingChecks) => {
    const checklist = parentReportData?.trainingChecklist || [];
    const existingRoutine = getRoutineForDate(routines, todayKeyForPrescription);
    const storedRoutine = readStoredRoutineRecord(currentUser?.id, todayKeyForPrescription);
    const existingItems = normalizeRoutineItems(existingRoutine?.items?.length ? existingRoutine.items : storedRoutine?.items || ROUTINE_TEMPLATE_ITEMS);
    const existingById = new Map(existingItems.map((item) => [item.id, item]));
    const existingPrescriptionIds = new Set(checklist.map((item) => `rx_${String(item.id).replace(/[^a-zA-Z0-9가-힣_-]/g, "_")}`));
    const baseItems = existingItems.filter((item) => !String(item.id || "").startsWith("rx_") || existingPrescriptionIds.has(item.id));
    const prescriptionItems = checklist.map((item) => {
      const id = `rx_${String(item.id).replace(/[^a-zA-Z0-9가-힣_-]/g, "_")}`;
      const existing = existingById.get(id);
      const checked = Object.prototype.hasOwnProperty.call(checks || {}, item.id) ? Boolean(checks[item.id]) : Boolean(existing?.checked);
      return {
        id,
        label: `처방 · ${item.label}`,
        checked,
      };
    });
    const mergedById = new Map();
    [...baseItems, ...prescriptionItems].forEach((item) => {
      if (!item?.id) return;
      mergedById.set(item.id, item);
    });
    return Array.from(mergedById.values());
  }, [currentUser?.id, parentReportData?.trainingChecklist, routines, todayKeyForPrescription, trainingChecks]);

  const savePrescriptionRoutine = useCallback(async (checks = trainingChecks, options = {}) => {
    const checklist = parentReportData?.trainingChecklist || [];
    if (!appServices?.db || !currentUser?.id || !checklist.length) return null;
    const mergedItems = buildPrescriptionRoutineItems(checks);
    const normalizedStats = calculateRoutineStats(mergedItems);
    const existingRoutine = getRoutineForDate(routines, todayKeyForPrescription);
    const payload = {
      userId: currentUser.id,
      date: todayKeyForPrescription,
      items: normalizedStats.items,
      completionRate: normalizedStats.completionRate,
      completedCount: normalizedStats.completedCount,
      totalCount: normalizedStats.totalCount,
      source: "routine_with_analysis_prescription",
      prescriptionUpdatedAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
      createdAt: existingRoutine?.createdAt || serverTimestamp(),
    };
    await setDoc(doc(appServices.db, "routines", prescriptionRoutineId), payload, { merge: true });
    const optimisticRoutine = {
      id: prescriptionRoutineId,
      ...payload,
      createdAt: existingRoutine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeStoredRoutineRecord(currentUser.id, optimisticRoutine);
    writeRoutineDailyState(currentUser.id, todayKeyForPrescription, normalizedStats.items);
    await onRoutineSaved?.(optimisticRoutine);
    if (options.showNotice !== false) {
      const hasExistingPrescription = Boolean((existingRoutine?.items || []).some((item) => String(item.id || "").startsWith("rx_")));
      const actionMessage = options.noticeMessage
        || (options.noticeType === "check"
          ? "선수 실행 체크가 수정되었습니다."
          : options.noticeType === "auto"
            ? "분석 처방이 오늘 루틴에 자동 동기화되었습니다."
            : hasExistingPrescription
              ? "분석 처방 루틴이 수정되었습니다."
              : "분석 처방이 오늘 루틴에 동기화되었습니다.");
      const statusMessage = `${actionMessage} 오늘 루틴 달성률 ${normalizedStats.completionRate}%`;
      setPrescriptionRoutineStatus(statusMessage);
      showRoutineSyncToast(statusMessage);
    }
    return optimisticRoutine;
  }, [appServices?.db, buildPrescriptionRoutineItems, currentUser?.id, onRoutineSaved, parentReportData?.trainingChecklist, prescriptionRoutineId, routines, showRoutineSyncToast, todayKeyForPrescription, trainingChecks]);

  const trainingChecklistKey = `x_training_prescription_checks_${currentUser?.id || currentUser?.uid || currentUser?.email || "guest"}_${getCurrentLocalDateString()}`;
  const prescriptionRoutineCompletion = useMemo(() => {
    const checklist = parentReportData.trainingChecklist || [];
    const done = checklist.filter((item) => Boolean(trainingChecks[item.id])).length;
    return {
      done,
      total: checklist.length,
      rate: checklist.length ? Math.round((done / checklist.length) * 100) : 0,
    };
  }, [parentReportData.trainingChecklist, trainingChecks]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(trainingChecklistKey);
      const storedChecks = raw ? JSON.parse(raw) : {};
      const existingRoutine = getRoutineForDate(routines, todayKeyForPrescription);
      const rxChecks = {};
      (existingRoutine?.items || []).forEach((item) => {
        if (!String(item.id || "").startsWith("rx_")) return;
        const original = (parentReportData.trainingChecklist || []).find((checkItem) => `rx_${String(checkItem.id).replace(/[^a-zA-Z0-9가-힣_-]/g, "_")}` === item.id);
        if (original) rxChecks[original.id] = Boolean(item.checked);
      });
      setTrainingChecks({ ...storedChecks, ...rxChecks });
    } catch {
      setTrainingChecks({});
    }
  }, [trainingChecklistKey, routines, parentReportData.trainingChecklist, todayKeyForPrescription]);

  useEffect(() => {
    const checklist = parentReportData.trainingChecklist || [];
    if (!checklist.length || !currentUser?.id || !appServices?.db) return;
    const syncKey = `${currentUser.id}_${todayKeyForPrescription}_${checklist.map((item) => item.id).join("|")}`;
    if (prescriptionRoutineSyncedRef.current === syncKey) return;
    prescriptionRoutineSyncedRef.current = syncKey;
    savePrescriptionRoutine(trainingChecks, { noticeType: "auto" })
      .catch((error) => {
        const message = String(error?.message || "처방 루틴 자동 추가 실패");
        setPrescriptionRoutineStatus(message);
        showRoutineSyncToast(message);
      });
  }, [appServices?.db, currentUser?.id, parentReportData.trainingChecklist, savePrescriptionRoutine, showRoutineSyncToast, todayKeyForPrescription, trainingChecks]);

  const toggleTrainingCheck = useCallback((id) => {
    setTrainingChecks((prev) => {
      const next = { ...prev, [id]: !prev?.[id] };
      try { localStorage.setItem(trainingChecklistKey, JSON.stringify(next)); } catch {}
      savePrescriptionRoutine(next, { noticeType: "check" }).catch((error) => {
        const message = String(error?.message || "루틴 체크 저장 실패");
        setPrescriptionRoutineStatus(message);
        showRoutineSyncToast(message);
      });
      return next;
    });
  }, [savePrescriptionRoutine, showRoutineSyncToast, trainingChecklistKey]);

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

  const handleDownloadParentReportPdf = useCallback(async () => {
    try {
      setPdfBusy(true);
      await downloadParentAnalysisReportAsPdf(
        {
          reportData: parentReportData,
          playerName: currentName,
          divisionLabel: currentDivision,
          avgScore,
          tenRate,
          consistencyIndex,
          aiGrade,
          trendLabel: trend?.label,
          distanceWeaknessMessage: distanceWeakness?.message,
          lateSetDropMessage: lateSetDropInsight?.message,
        },
        `X-Analysis_부모용_리포트_${String(currentName || "선수").replace(/\s+/g, "_")}_${getCurrentLocalDateString()}.pdf`
      );
    } catch (error) {
      alert(error?.message || "PDF 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPdfBusy(false);
    }
  }, [currentName, currentDivision, parentReportData, avgScore, tenRate, consistencyIndex, aiGrade, trend, distanceWeakness, lateSetDropInsight]);

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
            <div className="rounded-2xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">모바일은 기록 입력과 핵심 트렌드 확인용입니다. 후반 엔드 붕괴, 경기별 거리 하락, 부모용 PDF, 운동 처방 전체 분석은 PC/태블릿에서 확인하세요.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isTabletAnalysis && !tabletFullView) {
    return (
      <div className="grid gap-4">
        <Card className="rounded-[28px] border-0 bg-white shadow-xl">
          <CardContent className="grid gap-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-black text-slate-950">X-Analysis</div>
                <div className="text-sm text-slate-500">태블릿용 2열 성장 분석 리포트</div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">개발 중 전체 공개</Badge>
                <button type="button" onClick={() => setTabletFullView(true)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-sm active:scale-[0.98]">PC버전 전체보기</button>
              </div>
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
                  <div className="rounded-2xl bg-white p-3">{parentReportData.lateCollapse?.message}</div>
                  <div className="rounded-2xl bg-white p-3">{parentReportData.distanceGameDecline?.message}</div>
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
      {routineSyncToast ? (
        <div className="fixed bottom-6 left-1/2 z-[9999] w-[calc(100%-32px)] max-w-[440px] -translate-x-1/2 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 shadow-2xl">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs">✓</span>
            <span>{routineSyncToast}</span>
          </div>
        </div>
      ) : null}
      {isTabletAnalysis && tabletFullView ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
          <div><b>태블릿 PC버전 전체보기 사용 중</b><br />화면은 작게 보일 수 있지만 모든 분석 기능을 확인할 수 있습니다.</div>
          <button type="button" onClick={() => setTabletFullView(false)} className="rounded-full bg-white px-4 py-2 text-xs font-black text-blue-700 shadow-sm">태블릿 최적화로 돌아가기</button>
        </div>
      ) : null}
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

            <main className="min-w-0 p-3 sm:p-4 lg:p-4 xl:p-6">
              <div className="mb-5 grid gap-3 lg:flex lg:items-center lg:justify-between">
                <Tabs value={activeAnalysisTab} onValueChange={handleAnalysisTabChange} className="w-full lg:w-auto">
                  <TabsList className="grid h-11 grid-cols-5 rounded-2xl bg-white p-1 shadow-sm lg:w-[560px] xl:h-12 xl:w-[620px]">
                    <TabsTrigger value="summary" className="rounded-xl">종합 분석</TabsTrigger>
                    <TabsTrigger value="detail" className="rounded-xl">상세 분석</TabsTrigger>
                    <TabsTrigger value="compare" className="rounded-xl">비교 분석</TabsTrigger>
                    <TabsTrigger value="trend" className="rounded-xl">트렌드 분석</TabsTrigger>
                    <TabsTrigger value="report" className="rounded-xl">리포트</TabsTrigger>
                  </TabsList>
                </Tabs>
                <button type="button" onClick={handleDownloadParentReportPdf} disabled={pdfBusy} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60">{pdfBusy ? "PDF 생성 중..." : "부모용 PDF 다운로드"}</button>
              </div>

              <div className="mb-4 grid gap-2 rounded-[24px] bg-white p-3 shadow-sm lg:grid-cols-6 xl:gap-3 xl:p-4">
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
                {dateFilter === "custom" ? <Input type="date" value={customAnalysisDate} onChange={(e) => setCustomAnalysisDate(e.target.value)} className="h-11 rounded-2xl bg-white lg:col-span-2" /> : null}
              </div>

              <div ref={summarySectionRef} className="scroll-mt-6 grid gap-3 lg:grid-cols-5 xl:gap-4">
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

              <div className="mt-4 grid gap-4">
                <div className="grid gap-4 lg:grid-cols-[1.18fr_0.9fr]">
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
                  <div className="grid gap-4 sm:grid-cols-[190px_minmax(0,1fr)] lg:grid-cols-1 2lg:grid-cols-[190px_minmax(0,1fr)]">
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
                </div>

                <section className="grid gap-4">
                  <div ref={reportSectionRef} className="scroll-mt-6 rounded-[24px] bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-black">부모용 성장 분석 리포트</div>
                        <div className="text-xs text-slate-500">세션 기록을 자동 변환해 성장 추세, 약점 거리, 훈련 추천을 생성합니다.</div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">PDF 저장 가능</Badge>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        ["최근 평균", parentReportData.recentAverage || "-", `${parentReportData.delta > 0 ? "+" : ""}${parentReportData.delta || 0}점`],
                        ["최고 평균", parentReportData.bestAverage || "-", "개인 최고 흐름"],
                        ["안정성", `${parentReportData.stability || 0}%`, parentReportData.growthLevel],
                        ["약점 거리", parentReportData.weakDistanceLabel, `차이 ${parentReportData.distanceGap || 0}점`],
                      ].map(([label, value, sub]) => (
                        <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                          <div className="text-xs font-semibold text-slate-500">{label}</div>
                          <div className="mt-1 text-2xl font-black text-slate-950">{value}</div>
                          <div className="mt-1 text-xs text-slate-500">{sub}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-3">
                      <div className="rounded-3xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                        <div className="mb-1 font-black">성장 요약</div>
                        {parentReportData.parentSummary}
                      </div>
                      <div className="rounded-3xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                        <div className="mb-1 font-black">후반 집중력</div>
                        {parentReportData.lateMessage}
                      </div>
                      <div className="rounded-3xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
                        <div className="mb-1 font-black">훈련 추천</div>
                        {parentReportData.parentRecommendation}
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                        <div className="mb-1 font-black">경기별·엔드별 정밀 분석</div>
                        <div>{parentReportData.lateCollapse?.message}</div>
                        <div className="mt-2">{parentReportData.distanceGameDecline?.message}</div>
                      </div>
                      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
                        <div className="mb-1 font-black">바람 대응 분석</div>
                        {parentReportData.windMental?.windMessage || "바람 강도 기록이 쌓이면 바람 조건별 점수 변화를 분석합니다."}
                      </div>
                      <div className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm leading-6 text-orange-900">
                        <div className="mb-1 font-black">멘탈 코칭 진단</div>
                        {parentReportData.windMental?.coldDiagnosis || "실수 직후 회복 루틴과 후반 집중력 데이터를 기록해야 멘탈 분석 정확도가 올라갑니다."}
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl border border-indigo-100 bg-indigo-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-black text-indigo-950">필요 근력·유산소 처방</div>
                        <Badge className="bg-white text-indigo-700">부모/코치용 실행 과제</Badge>
                      </div>
                      <div className="mt-2 text-sm leading-6 text-indigo-900">{parentReportData.trainingPrescription?.summary}</div>
                      <div className="mt-3 grid gap-3 lg:grid-cols-2">
                        <div className="rounded-2xl bg-white/80 p-3 text-sm">
                          <div className="mb-2 font-black text-slate-900">근력 운동 부위</div>
                          <div className="space-y-2">
                            {(parentReportData.trainingPrescription?.strengthItems || []).map((item) => (
                              <div key={item.part} className="rounded-xl bg-slate-50 p-2">
                                <div className="font-bold text-slate-900">{item.part}</div>
                                <div className="text-xs leading-5 text-slate-600">이유: {item.why}</div>
                                <div className="mt-1 text-xs leading-5 text-indigo-700">운동: {item.exercise}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-3">
                          <div className="rounded-2xl bg-white/80 p-3 text-sm">
                            <div className="mb-2 font-black text-slate-900">유산소 운동</div>
                            <ul className="list-disc space-y-1 pl-5 text-xs leading-5 text-slate-700">
                              {(parentReportData.trainingPrescription?.cardioItems || []).map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                          <div className="rounded-2xl bg-white/80 p-3 text-sm">
                            <div className="mb-2 font-black text-slate-900">밸런스·멘탈 연결</div>
                            <ul className="list-disc space-y-1 pl-5 text-xs leading-5 text-slate-700">
                              {[...(parentReportData.trainingPrescription?.balanceItems || []), ...(parentReportData.trainingPrescription?.mentalItems || []).slice(0, 2)].map((item) => <li key={item}>{item}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-black text-slate-950">선수 실행 체크</div>
                          <div className="mt-1 text-xs leading-5 text-slate-500">분석에서 나온 처방 과제가 오늘 루틴에 자동 추가된다. 체크 결과는 오늘 루틴 달성률에 포함되고, 이후 운동 수행 vs 점수 변화 분석에 사용된다.</div>
                        </div>
                        <div className="flex flex-col items-end gap-2 text-right">
                          <Badge className="bg-emerald-100 text-emerald-700">오늘 수행 {prescriptionRoutineCompletion.done}/{prescriptionRoutineCompletion.total || 0}</Badge>
                          <Button type="button" size="sm" variant="outline" onClick={() => savePrescriptionRoutine(trainingChecks, { noticeType: "manual" })}>루틴에 추가/동기화</Button>
                        </div>
                      </div>
                      {prescriptionRoutineStatus ? <div className="mt-3 rounded-2xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{prescriptionRoutineStatus}</div> : null}
                      <div className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">오늘 루틴 달성률 포함: {prescriptionRoutineCompletion.rate}% · 이 데이터가 누적되면 처방 수행일과 미수행일의 평균 점수 차이를 비교한다.</div>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {(parentReportData.trainingChecklist || []).map((item) => (
                          <label key={item.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-3 text-sm transition ${trainingChecks[item.id] ? "border-emerald-200 bg-emerald-50" : "border-slate-100 bg-slate-50"}`}>
                            <input type="checkbox" checked={Boolean(trainingChecks[item.id])} onChange={() => toggleTrainingCheck(item.id)} className="mt-1 h-4 w-4 accent-emerald-600" />
                            <span>
                              <span className="block font-black text-slate-900">{item.label}</span>
                              <span className="mt-1 block text-xs leading-5 text-slate-600">{item.detail}</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
                      최근 기록: {parentReportData.lastSessionDate} · {parentReportData.lastSessionDistance} · 평균 {parentReportData.lastSessionScore || "-"}점 / {parentReportData.routineGuide}
                    </div>
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
                      <div className="rounded-2xl bg-blue-50 p-3 text-blue-800">2. 바람이 있는 날과 후반 세트에서 멘탈 루틴을 별도로 기록하세요.</div>
                      <div className="rounded-2xl bg-orange-50 p-3 text-orange-800">3. 실수 직후 다음 화살 전 8초 호흡·시선·손압 재설정 루틴을 고정하세요.</div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-4 grid gap-4">
                <section className="rounded-[24px] bg-white p-4 shadow-sm xl:p-5">
                  <div className="mb-3 text-lg font-black">컨디션별 성과 변화</div>
                  <div className="h-[210px] xl:h-[230px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={conditionChart} margin={{ top: 8, right: 18, left: -10, bottom: 0 }}>
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

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <section className="min-w-0 rounded-[24px] bg-white p-4 shadow-sm xl:p-5">
                    <div className="mb-3 text-lg font-black">시간대별/세트별 성과 분석</div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[420px] text-center text-sm">
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

                  <section className="min-w-0 overflow-hidden rounded-[24px] bg-white p-4 shadow-sm xl:p-5">
                    <div className="mb-3 flex items-center justify-between"><div className="text-lg font-black">최근 훈련 세션</div><span className="text-xs text-blue-600">전체 보기</span></div>
                    <div className="space-y-2">
                      {recentSessions.length ? recentSessions.map((item, idx) => (
                        <div key={`${item.date}-${idx}`} className="grid min-w-0 grid-cols-[76px_minmax(0,1fr)_48px_auto] items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm">
                          <span className="truncate text-slate-500">{item.date}</span><span className="truncate font-semibold">{item.distanceLabel}</span><span className="text-right">{item.avg}</span><Badge className={`shrink-0 whitespace-nowrap ${item.condition === "최상" ? "bg-green-100 text-green-700" : item.condition === "좋음" ? "bg-emerald-100 text-emerald-700" : item.condition === "보통" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>{item.condition}</Badge>
                        </div>
                      )) : <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">저장된 훈련 기록이 없습니다.</div>}
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
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

      <div className="grid gap-6 lg:grid-cols-3">
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
  const [rankingUploadLoading, setRankingUploadLoading] = useState(false);
  const [rankingUploadMessage, setRankingUploadMessage] = useState("");
  const [rankingMigrationLoading, setRankingMigrationLoading] = useState(false);
  const [rankingMigrationMessage, setRankingMigrationMessage] = useState("");
  const [officialUploadFile, setOfficialUploadFile] = useState(null);
  const [officialUploadRows, setOfficialUploadRows] = useState([]);
  const [officialUploadPreview, setOfficialUploadPreview] = useState([]);
  const [officialUploadFileMessage, setOfficialUploadFileMessage] = useState("");
  const [officialUploadRegisterLoading, setOfficialUploadRegisterLoading] = useState(false);

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

  async function uploadOfficialRankingSamples() {
    if (!appServices?.db) {
      alert("DB 연결이 준비되지 않았다.");
      return;
    }

    const ok = window.confirm("공식 기록은 최신 대회 1개만 유지된다. 기존 공식기록을 삭제하고 이번 공식 데이터로 교체할까? 사용자 개인 기록은 삭제되지 않는다.");
    if (!ok) return;

    try {
      setRankingUploadLoading(true);
      setRankingUploadMessage("기존 공식기록을 삭제하는 중........");
      const deletedCount = await deleteExistingOfficialRankingEntries(appServices.db, {
        batchId: "official_jongbyeol_2026_yecheon",
        competitionName: "제60회 전국 남여 양궁 종별선수권 대회",
        competitionDate: "2026-05-02",
      });
      setRankingUploadMessage("새 공식기록을 등록하는 중........");
      const result = await upsertOfficialCompetitionSheetsToRankingEntries(appServices.db, SAMPLE_SHEETS);
      const message = `공식기록 교체 완료: 기존 ${deletedCount.toLocaleString()}건 삭제 / ${result.sheetCount}개 부문 / ${result.writeCount.toLocaleString()}개 거리 기록 등록`;
      setRankingUploadMessage(message);
      alert(message);
      await onRefresh?.();
    } catch (error) {
      const message = error?.message || "공식 랭킹 업로드에 실패했다.";
      setRankingUploadMessage(message);
      alert(message);
    } finally {
      setRankingUploadLoading(false);
    }
  }

  async function migrateOfficialRankingDivisionData() {
    if (!appServices?.db) {
      alert("DB 연결이 준비되지 않았다.");
      return;
    }
    const ok = window.confirm("기존 ranking_entries의 임의 학년값을 원본 대회 부문 기준으로 정규화할까? 예: 초등1 → 초등부(저학년), 초등5 → 초등부(고학년)");
    if (!ok) return;
    try {
      setRankingMigrationLoading(true);
      setRankingMigrationMessage("정규화 중...");
      const result = await migrateRankingEntryDivisionLabels(appServices.db);
      const message = `정규화 완료: ${result.checked}건 확인 / ${result.updated}건 수정`;
      setRankingMigrationMessage(message);
      alert(message);
      await onRefresh?.();
    } catch (error) {
      const message = error?.message || "랭킹 데이터 정규화에 실패했다.";
      setRankingMigrationMessage(message);
      alert(message);
    } finally {
      setRankingMigrationLoading(false);
    }
  }

  async function handleOfficialUploadFileChange(event) {
    const file = event.target.files?.[0];
    setOfficialUploadFile(file || null);
    setOfficialUploadRows([]);
    setOfficialUploadPreview([]);
    setOfficialUploadFileMessage("");
    if (!file) return;

    const ext = String(file.name || "").split(".").pop()?.toLowerCase();
    if (!["csv", "tsv", "txt", "json", "pdf", "xlsx", "xls", "gsheet"].includes(ext || "")) {
      setOfficialUploadFileMessage("지원 형식은 PDF/엑셀(XLSX·XLS)/구글시트 바로가기(GSHEET)/CSV/TSV/JSON이다.");
      return;
    }

    try {
      setOfficialUploadFileMessage(ext === "pdf" ? "PDF에서 표 텍스트를 분석하는 중........" : ext === "xlsx" || ext === "xls" ? "엑셀 파일을 분석하는 중........" : ext === "gsheet" ? "구글 스프레드시트를 불러오는 중........" : "파일을 분석하는 중........");
      let rows = [];
      if (ext === "pdf") {
        const pdfText = await extractTextFromPdfFile(file);
        if (!pdfText || pdfText.replace(/\s+/g, "").length < 50) {
          throw new Error("PDF에서 텍스트를 읽지 못했다. 스캔/사진형 PDF라면 엑셀 또는 CSV로 변환해서 올려줘.");
        }
        rows = parseOfficialRankingPdfText(pdfText, file.name);
        if (!rows.length) {
          throw new Error("PDF 텍스트는 읽었지만 표를 자동 변환하지 못했다. 미리보기 없이 바로 등록하지 않고, CSV/엑셀 변환본을 사용해줘.");
        }
      } else if (ext === "xlsx" || ext === "xls") {
        rows = await parseOfficialRankingExcelFile(file);
        if (!rows.length) throw new Error("엑셀 파일에서 업로드 가능한 표 데이터를 찾지 못했다.");
      } else if (ext === "gsheet") {
        rows = await parseGoogleSheetShortcutFile(file);
      } else {
        const text = await file.text();
        rows = parseOfficialRankingUploadText(text, file.name);
      }
      const fallback = { fileName: file.name };
      const previewEntries = buildOfficialEntriesFromUploadRows(rows, fallback);
      setOfficialUploadRows(rows);
      setOfficialUploadPreview(previewEntries.slice(0, 8));
      setOfficialUploadFileMessage(`파일 분석 완료: 원본 ${rows.length.toLocaleString()}행 / 업로드 예정 ${previewEntries.length.toLocaleString()}개 거리 기록. 미리보기 확인 후 등록해줘.`);
    } catch (error) {
      setOfficialUploadFileMessage(error?.message || "파일 분석에 실패했다.");
    }
  }

  async function registerOfficialUploadFile() {
    if (!appServices?.db) {
      alert("DB 연결이 준비되지 않았다.");
      return;
    }
    if (!officialUploadRows.length) {
      alert("먼저 파일 찾기로 PDF/엑셀/구글시트/CSV/JSON 파일을 선택해줘.");
      return;
    }
    const ok = window.confirm("공식 기록은 최신 대회 1개만 유지된다. 기존 공식기록을 삭제하고 선택한 파일의 공식기록으로 교체할까? 사용자 개인 기록은 삭제되지 않는다.");
    if (!ok) return;

    try {
      setOfficialUploadRegisterLoading(true);
      setOfficialUploadFileMessage("기존 공식기록을 삭제하는 중........");
      const fileName = officialUploadFile?.name || "official_upload";
      const officialBatchId = `official_${Date.now()}_${String(fileName).replace(/[^a-zA-Z0-9가-힣_-]/g, "_")}`;
      const deletedCount = await deleteExistingOfficialRankingEntries(appServices.db, {
        batchId: officialBatchId,
        competitionName: fileName,
        competitionDate: getCurrentLocalDateString(),
      });
      setOfficialUploadFileMessage("새 공식기록을 Firestore에 등록하는 중........");
      const result = await upsertOfficialUploadRowsToRankingEntries(appServices.db, officialUploadRows, { fileName, officialBatchId });
      const message = `공식기록 교체 완료: 기존 ${deletedCount.toLocaleString()}건 삭제 / ${result.competitionCount}개 대회 / ${result.writeCount.toLocaleString()}개 거리 기록 등록`;
      setOfficialUploadFileMessage(message);
      alert(message);
      await onRefresh?.();
    } catch (error) {
      const message = error?.message || "공식 기록 등록에 실패했다.";
      setOfficialUploadFileMessage(message);
      alert(message);
    } finally {
      setOfficialUploadRegisterLoading(false);
    }
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
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          <CardTitle className="text-xl">공식 기록 파일 업로드</CardTitle>
          <DialogDescription>
            앞으로 공식 대회 기록은 관리자에서 파일을 선택한 뒤 <b>등록</b>한다. 등록 시 기존 공식기록은 삭제되고, <b>가장 최신 공식대회 데이터만</b> Firestore <b>ranking_entries</b>에 남는다. 사용자 개인 기록은 삭제되지 않는다.
          </DialogDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
            <div className="font-semibold">업로드 파일 형식</div>
            <div className="mt-1">PDF/엑셀(XLSX·XLS)/구글시트 바로가기(GSHEET)/CSV/TSV/JSON 지원. 구글시트는 공개·내보내기 가능한 문서만 직접 불러올 수 있다.</div>
            <div className="mt-1">권장 헤더: 대회명, 날짜, 구분, 성별, 선수명, 소속, 20m, 25m, 30m, 35m, 40m, 50m, 60m, 70m, 90m, 총점</div>
            <div className="mt-1">개인전만 등록하고 단체전은 파일에서 제외한다. 공식기록은 최신 파일 기준으로 교체되며, 이전 공식대회에 출전하지 않은 선수는 공식랭킹에서 사라진다.</div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0 text-sm text-emerald-900">
              <div className="font-semibold">제60회 전국 남여 양궁 종별선수권 공식기록 내장본</div>
              <div className="mt-1">현재 첨부된 12개 개인전 PDF 기준 10개 구분, 선수 1,251명, 거리 기록 5,004개를 최신 공식기록으로 교체 등록한다.</div>
              <div className="mt-1 text-xs text-emerald-700">등록 시 기존 공식기록은 삭제되고 사용자 개인 기록은 유지된다.</div>
            </div>
            <Button
              type="button"
              className="rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800"
              onClick={uploadOfficialRankingSamples}
              disabled={rankingUploadLoading}
            >
              {rankingUploadLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
              종별선수권 공식기록 등록
            </Button>
          </div>
          {rankingUploadMessage ? <div className="rounded-2xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-800">{rankingUploadMessage}</div> : null}

          <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-[1fr_auto] md:items-end">
            <div className="min-w-0">
              <Label className="text-sm font-semibold text-slate-700">파일 찾기</Label>
              <Input
                type="file"
                accept=".pdf,.xlsx,.xls,.gsheet,.csv,.tsv,.txt,.json"
                className="mt-2 rounded-2xl bg-white"
                onChange={handleOfficialUploadFileChange}
              />
              <div className="mt-2 text-xs text-slate-500">
                선택 파일: {officialUploadFile?.name || "아직 선택된 파일 없음"}
              </div>
            </div>
            <Button
              type="button"
              className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800"
              onClick={registerOfficialUploadFile}
              disabled={officialUploadRegisterLoading || !officialUploadRows.length}
            >
              {officialUploadRegisterLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Archive className="mr-2 h-4 w-4" />}
              등록
            </Button>
          </div>

          {officialUploadFileMessage ? (
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              {officialUploadFileMessage}
            </div>
          ) : null}

          {officialUploadPreview.length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">업로드 미리보기</div>
              <div className="max-h-72 overflow-auto">
                <table className="w-full min-w-[760px] text-left text-xs">
                  <thead className="bg-white text-slate-500">
                    <tr>
                      <th className="px-3 py-2">구분</th>
                      <th className="px-3 py-2">성별</th>
                      <th className="px-3 py-2">선수</th>
                      <th className="px-3 py-2">소속</th>
                      <th className="px-3 py-2">거리</th>
                      <th className="px-3 py-2">점수</th>
                      <th className="px-3 py-2">총점</th>
                      <th className="px-3 py-2">대회</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {officialUploadPreview.map((entry) => (
                      <tr key={entry.entryId}>
                        <td className="px-3 py-2">{entry.rankingGroup}</td>
                        <td className="px-3 py-2">{entry.gender}</td>
                        <td className="px-3 py-2 font-semibold">{entry.name}</td>
                        <td className="px-3 py-2">{entry.schoolName}</td>
                        <td className="px-3 py-2">{entry.distance}m</td>
                        <td className="px-3 py-2">{entry.score}</td>
                        <td className="px-3 py-2">{entry.totalScore || "-"}</td>
                        <td className="px-3 py-2">{entry.competitionName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-center">
            <div className="text-sm text-slate-500">
              기존 데이터에 임의 학년/학교명 오류가 있으면 정규화 버튼으로 보정한다.
              예: 하성초/김포 하성초 → 김포하성초등학교, 초등1 기본값 → 초등부(저학년)
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-2xl"
              onClick={migrateOfficialRankingDivisionData}
              disabled={rankingMigrationLoading}
            >
              {rankingMigrationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              기존 랭킹 학년/부문 정규화
            </Button>
          </div>
          {rankingMigrationMessage ? <div className="text-xs font-semibold text-blue-700">{rankingMigrationMessage}</div> : null}
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

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
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

          <div className="grid gap-6 lg:grid-cols-3">
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
        console.warn("Full routine list could not be loaded. Falling back to current user's routines.", routineError);
        if (activeUid) {
          try {
            const ownRoutinesSnap = await getDocs(query(collection(db, "routines"), where("userId", "==", activeUid)));
            const ownRoutines = ownRoutinesSnap.docs
              .map((snap) => fromFirestoreRoutine(snap))
              .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
            setRoutines(ownRoutines);
          } catch (ownRoutineError) {
            setRoutines([]);
            console.warn("Current user's routines could not be loaded. Check Firestore rules for routines.", ownRoutineError);
          }
        } else {
          setRoutines([]);
        }
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
          weather: payload.weather,
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
      <div className={`flex w-full flex-col ${currentUser ? "gap-3 md:gap-6 lg:pl-[220px] xl:pl-[240px]" : "gap-0"}`}>
        {currentUser ? <div className="lg:hidden"><Hero activeTab={ui.activeTab} /></div> : null}

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
            <div className="lg:hidden">
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
                      <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">오늘 루틴 {getTodayRoutineRateForUser(currentUser?.id, myRoutines)}% · {getRoutineReadinessMessage(getTodayRoutineRateForUser(currentUser?.id, myRoutines))} · 다음 목표 {postSaveInsight.nextTarget ?? "-"}점</div>
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
                  currentUser={currentUser}
                />
              )}
              {ui.activeTab === "dashboard" && <Dashboard sessions={mySessions} routines={myRoutines} currentUser={currentUser} loading={sessionsLoading} onEditSession={handleEditSession} onStartSession={() => setUi((prev) => ({ ...prev, activeTab: "record" }))} />}
              {ui.activeTab === "ranking" && <RankingBoard users={usersForDisplay} sessions={sessionsForDisplay} currentUser={currentUser} currentUserId={currentUser.id} officialClaims={officialClaims} onRequestOfficialClaim={handleRequestOfficialClaim} appServices={appServices} isAdminUser={isAdminUser} />}
              {ui.activeTab === "analysis" && <AnalysisBoard currentUser={currentUser} users={usersForDisplay} sessions={sessionsForDisplay} routines={myRoutines} appServices={appServices} onRoutineSaved={async (savedRoutine) => {
                setRoutines((prev) => {
                  const withoutSame = prev.filter((routine) => routine.id !== savedRoutine.id);
                  return [savedRoutine, ...withoutSame].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
                });
              }} onNavigate={(tab) => setUi((prev) => ({ ...prev, activeTab: normalizeAppTab(tab, prev.activeTab) }))} />}
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
