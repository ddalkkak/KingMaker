import { useState, useEffect } from "react";
import styles from "./TitleScreen.module.css";

export default function TitleScreen({ onStart }) {
  const [showBlink, setShowBlink] = useState(true);

  return (
    <div className={`${styles.wrap} screen-enter`}>
      <div className={styles.inner}>
        <span className={styles.crownIcon}>♛</span>
        <h1 className={styles.title}>KING<br />MAKER</h1>
        <p className={styles.subtitle}>왕좌를 향한 여정</p>
        <p className={styles.blinkText}>▶ PRESS START ◀</p>
        <button className={styles.startBtn} onClick={onStart}>
          새 게임 시작
        </button>
      </div>
    </div>
  );
}
