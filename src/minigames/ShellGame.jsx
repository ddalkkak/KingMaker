import { useState, useEffect, useRef } from "react";
import { Cup } from "../art/BadKing";
import styles from "./ShellGame.module.css";

const TOTAL_ROUNDS = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 삼각형 꼭짓점 위치 (각도, 반지름)
// 0: 위, 1: 왼쪽 아래, 2: 오른쪽 아래
const BASE_ANGLES = [270, 30, 150]; // 도(degree)
const ORBIT_R = 90;
const CENTER_X = 130;
const CENTER_Y = 120;
const CUP_W = 80;

function getCupPos(slotIdx, extraDeg) {
  const deg = BASE_ANGLES[slotIdx] + extraDeg;
  const rad = (deg * Math.PI) / 180;
  return {
    x: CENTER_X + ORBIT_R * Math.cos(rad) - CUP_W / 2,
    y: CENTER_Y + ORBIT_R * Math.sin(rad) - 40,
  };
}

const RESULT_MSGS = {
  win:  ["충신입니다! 역시 안목이 있으십니다!", "정답! 이 충신이 그대를 믿습니다!", "맞혔습니다! 호오... 제법이네요."],
  lose: ["간신이었습니다. 이 표정 보이시죠?", "틀렸습니다. 간신이 싱글벙글 웃고 있습니다.", "아 하필 이놈이... 간신이네요 ㅎ"],
};

export default function ShellGame({ name, onComplete }) {
  const [slots, setSlots] = useState(() => shuffle(["loyal", "traitor", "traitor"]));
  const [phase, setPhase] = useState("intro");
  const [openSlots, setOpenSlots] = useState([false, false, false]);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [round, setRound] = useState(1);
  const [wins, setWins] = useState(0);
  const [resultMsg, setResultMsg] = useState("");
  // 삼각형 회전 각도 (0 = 정방향)
  const [spinDeg, setSpinDeg] = useState(0);
  const timerRef = useRef(null);
  const spinRef = useRef(null);

  function clearAllTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (spinRef.current) clearInterval(spinRef.current);
  }

  // 스핀 시작
  function startSpin() {
    if (spinRef.current) clearInterval(spinRef.current);
    spinRef.current = setInterval(() => {
      setSpinDeg((d) => d + 4);
    }, 30);
  }

  // 스핀 정지
  function stopSpin() {
    if (spinRef.current) clearInterval(spinRef.current);
    spinRef.current = null;
  }

  function startRound(roundNum) {
    const newSlots = shuffle(["loyal", "traitor", "traitor"]);
    setSlots(newSlots);
    setOpenSlots([true, true, true]);
    setChosenSlot(null);
    setSpinDeg(0);
    setPhase("peek");

    timerRef.current = setTimeout(() => {
      setOpenSlots([false, false, false]);
      timerRef.current = setTimeout(() => doShuffle(newSlots), 400);
    }, 2200);
  }

  function doShuffle(currentSlots) {
    setPhase("shuffle");
    startSpin();

    let cur = [...currentSlots];
    const swapCount = 6 + Math.floor(Math.random() * 4);
    let done = 0;

    function doSwap() {
      if (done >= swapCount) {
        stopSpin();
        setSlots([...cur]);
        setPhase("choose");
        return;
      }
      let i = Math.floor(Math.random() * 3);
      let j = Math.floor(Math.random() * 2);
      if (j >= i) j++;
      [cur[i], cur[j]] = [cur[j], cur[i]];
      setSlots([...cur]);
      done++;
      timerRef.current = setTimeout(doSwap, 380);
    }
    timerRef.current = setTimeout(doSwap, 200);
  }

  function handleChoose(idx) {
    if (phase !== "choose") return;
    clearAllTimers();
    const isWin = slots[idx] === "loyal";
    const newWins = wins + (isWin ? 1 : 0);
    setWins(newWins);
    setChosenSlot(idx);
    setOpenSlots((prev) => prev.map((_, i) => i === idx));
    const msgs = isWin ? RESULT_MSGS.win : RESULT_MSGS.lose;
    setResultMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    setPhase("result");

    timerRef.current = setTimeout(() => {
      setOpenSlots([true, true, true]);
      setPhase("roundresult");
    }, 1200);
  }

  function handleNextRound() {
    clearAllTimers();
    if (round < TOTAL_ROUNDS) {
      setRound((r) => r + 1);
      startRound(round + 1);
    } else {
      setPhase("done");
    }
  }

  useEffect(() => () => clearAllTimers(), []);

  // 인트로
  if (phase === "intro") {
    return (
      <div className={styles.wrap}>
        <div className={styles.introBox}>
          <div className={styles.introTitle}>야바위 충신 고르기</div>
          <p className={styles.introDesc}>
            세 명의 신하 중 단 한 명만이 충신입니다.<br />
            컵이 열릴 때 위치를 기억하고,<br />
            삼각형이 빙글빙글 돌고 나면 충신을 찾으세요!
            <span className={styles.introSub}>총 {TOTAL_ROUNDS}라운드 · 못 고르면 간신에게 농락당합니다</span>
          </p>
          <button className={styles.btn} onClick={() => startRound(1)}>시작!</button>
        </div>
      </div>
    );
  }

  // 완료
  if (phase === "done") {
    return (
      <div className={styles.wrap}>
        <div className={styles.introBox}>
          <div className={styles.introTitle}>결과</div>
          <p className={styles.resultSummary}>
            {TOTAL_ROUNDS}라운드 중 <b style={{ color: "#cc2200" }}>{wins}번</b> 충신을 찾았습니다.
          </p>
          <p className={styles.resultFlavor}>
            {wins === 3 && "완벽합니다! 당신의 안목은 타의 추종을 불허합니다."}
            {wins === 2 && "제법입니다. 충신이 두 명이나 있으니 든든하네요."}
            {wins === 1 && "음... 그나마 한 명은 있네요. 위험합니다."}
            {wins === 0 && "간신들만 남았습니다. 이제 망했습니다."}
          </p>
          <button className={styles.btn} onClick={() => onComplete(wins)}>
            다음 단계로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      {/* 상단 정보 */}
      <div className={styles.header}>
        <span className={styles.roundBadge}>{round} / {TOTAL_ROUNDS} 라운드</span>
        <span className={styles.winsText}>충신 발견: {wins}명</span>
        <span className={styles.phaseHint}>
          {phase === "peek"        && "위치를 기억하세요!"}
          {phase === "shuffle"     && "빙글빙글 섞는 중..."}
          {phase === "choose"      && "충신을 고르세요!"}
          {(phase === "result" || phase === "roundresult") && (slots[chosenSlot] === "loyal" ? "충신!" : "간신!")}
        </span>
      </div>

      {/* 삼각형 컵 배치 */}
      <div
        className={styles.triangleWrap}
        style={{ width: CENTER_X * 2, height: CENTER_Y * 2 + 40 }}
      >
        {[0, 1, 2].map((idx) => {
          const pos = getCupPos(idx, spinDeg);
          return (
            <button
              key={idx}
              className={`${styles.cupBtn} ${chosenSlot === idx ? styles.chosen : ""}`}
              style={{ left: pos.x, top: pos.y, width: CUP_W }}
              onClick={() => handleChoose(idx)}
              disabled={phase !== "choose"}
            >
              <Cup
                isOpen={openSlots[idx]}
                content={openSlots[idx] ? slots[idx] : null}
                isHighlighted={phase === "peek" && slots[idx] === "loyal"}
                size={70}
              />
              <div className={styles.slotLabel}>
                {phase === "peek" && slots[idx] === "loyal" && (
                  <span className={styles.loyalTag}>★ 충신</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 결과 텍스트 */}
      {(phase === "result" || phase === "roundresult") && (
        <div className={`${styles.resultBox} ${slots[chosenSlot] === "loyal" ? styles.win : styles.lose}`}>
          <p>{resultMsg}</p>
        </div>
      )}

      {/* 다음 라운드 버튼 */}
      {phase === "roundresult" && (
        <button className={styles.btn} onClick={handleNextRound}>
          {round < TOTAL_ROUNDS ? `${round + 1}라운드 시작` : "결과 보기"}
        </button>
      )}
    </div>
  );
}
