import styles from "./CreateScreen.module.css";

export default function CreateScreen({ state, onSetName, onConfirm }) {
  function handleConfirm() {
    if (!state.name.trim()) { alert("이름을 입력하세요!"); return; }
    onConfirm();
  }

  return (
    <div className={`${styles.wrap} screen-enter`}>
      <div className={styles.panel}>
        <h2 className={styles.heading}>캐릭터 생성</h2>
        <div className={styles.formGroup}>
          <label className={styles.label}>왕의 이름</label>
          <input
            className={styles.input}
            type="text"
            placeholder="이름 입력..."
            maxLength={8}
            value={state.name}
            onChange={(e) => onSetName(e.target.value)}
          />
        </div>
        <p className={styles.hint}>
          ※ 능력치는 없습니다.<br />
          당신의 선택이 곧 왕의 그릇입니다.
        </p>
        <button className={styles.startBtn} onClick={handleConfirm}>
          ▶ 시작하기
        </button>
      </div>
    </div>
  );
}
