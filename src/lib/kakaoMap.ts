const KAKAO_MAP_SCRIPT_ID = "kakao-map-sdk";

function getKakaoWindow() {
  return window as Window & {
    kakao?: any;
  };
}

export async function loadKakaoMapSdk(appKey: string): Promise<any> {
  const kakaoWindow = getKakaoWindow();
  if (kakaoWindow.kakao?.maps != null) {
    await new Promise<void>((resolve) => {
      kakaoWindow.kakao.maps.load(() => resolve());
    });
    return kakaoWindow.kakao;
  }

  const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript != null) {
    await new Promise<void>((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Kakao map script failed.")), {
        once: true,
      });
    });

    if (kakaoWindow.kakao?.maps == null) {
      throw new Error("Kakao map SDK unavailable after script load.");
    }

    await new Promise<void>((resolve) => {
      kakaoWindow.kakao.maps.load(() => resolve());
    });

    return kakaoWindow.kakao;
  }

  const script = document.createElement("script");
  script.id = KAKAO_MAP_SCRIPT_ID;
  script.async = true;
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;

  await new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Kakao map script failed.")), { once: true });
    document.head.appendChild(script);
  });

  if (kakaoWindow.kakao?.maps == null) {
    throw new Error("Kakao map SDK unavailable after script injection.");
  }

  await new Promise<void>((resolve) => {
    kakaoWindow.kakao.maps.load(() => resolve());
  });

  return kakaoWindow.kakao;
}
