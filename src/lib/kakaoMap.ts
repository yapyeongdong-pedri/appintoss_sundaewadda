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
  script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;

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

export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
  if (appKey == null || appKey.trim() === "" || address.trim() === "") {
    return null;
  }

  try {
    const kakao = await loadKakaoMapSdk(appKey);
    if (kakao?.maps?.services == null) {
      return null;
    }

    const geocoder = new kakao.maps.services.Geocoder();
    return await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result[0] != null) {
          resolve({
            latitude: Number(result[0].y),
            longitude: Number(result[0].x),
          });
          return;
        }

        resolve(null);
      });
    });
  } catch (error) {
    console.warn("Address geocode failed.", error);
    return null;
  }
}
