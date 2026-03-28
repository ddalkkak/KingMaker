/**
 * Vite는 `public/`만 사이트 루트(/)로 제공합니다.
 * mp3는 `public/sounds/때리기.mp3`, `public/sounds/엉뚱.mp3` 에 두세요.
 * (프로젝트 바깥 루트에만 있으면 브라우저에서 절대 로드되지 않습니다.)
 */
const HIT_URLS = ["/sounds/때리기.mp3", "/때리기.mp3"];
const KING_URLS = ["/sounds/엉뚱.mp3", "/엉뚱.mp3"];

export const SFX = {
  hit: HIT_URLS[0],
  king: KING_URLS[0],
};

function playUrlList(urls, volume) {
  const tryAt = (i) => {
    if (i >= urls.length) return;
    const url = encodeURI(urls[i]);
    try {
      const a = new Audio(url);
      a.volume = volume;
      void a.play().catch(() => tryAt(i + 1));
    } catch {
      tryAt(i + 1);
    }
  };
  tryAt(0);
}

/**
 * @param {"hit"|"king"|string} key - SFX 키 또는 `/`로 시작하는 절대 경로
 * @param {number} [volume=0.88]
 */
export function playSfx(key, volume = 0.88) {
  if (typeof key === "string" && key.startsWith("/")) {
    playUrlList([key], volume);
    return;
  }
  if (key === "hit") playUrlList(HIT_URLS, volume);
  else if (key === "king") playUrlList(KING_URLS, volume);
}
