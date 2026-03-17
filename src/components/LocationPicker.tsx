import { useEffect, useRef, useState } from "react";
import { loadKakaoMapSdk } from "../lib/kakaoMap";

interface LocationPickerProps {
  description: string;
  latitude?: number;
  longitude?: number;
  onDescriptionChange: (next: string) => void;
  onPinChange: (next: { latitude?: number; longitude?: number }) => void;
}

export function LocationPicker({
  description,
  latitude,
  longitude,
  onDescriptionChange,
  onPinChange,
}: LocationPickerProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "fallback">(() =>
    import.meta.env.VITE_KAKAO_MAP_APP_KEY ? "loading" : "fallback",
  );
  const [mapMessage, setMapMessage] = useState<string>();

  useEffect(() => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
    if (appKey == null || appKey.trim() === "") {
      setMapStatus("fallback");
      setMapMessage("\uCE74\uCE74\uC624\uB9F5 \uD0A4\uAC00 \uC5C6\uC5B4 \uD540 \uC120\uD0DD \uC9C0\uB3C4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.");
      return;
    }

    let disposed = false;

    async function setupMap() {
      try {
        const kakao = await loadKakaoMapSdk(appKey);
        if (disposed || mapElementRef.current == null) {
          return;
        }

        const center = new kakao.maps.LatLng(latitude ?? 37.6063, longitude ?? 127.0186);
        const map = new kakao.maps.Map(mapElementRef.current, {
          center,
          level: 4,
        });

        mapInstanceRef.current = map;
        kakao.maps.event.addListener(map, "click", (mouseEvent: any) => {
          const latLng = mouseEvent.latLng;
          onPinChange({
            latitude: latLng.getLat(),
            longitude: latLng.getLng(),
          });
          setMapMessage("\uD540 \uC704\uCE58\uB97C \uC800\uC7A5\uD588\uC5B4\uC694.");
        });

        setMapStatus("ready");
        setMapMessage("\uC9C0\uB3C4\uC5D0\uC11C \uD540\uC744 \uBA3C\uC800 \uC120\uD0DD\uD574\uC8FC\uC138\uC694.");
      } catch (error) {
        console.warn("Location picker map unavailable.", error);
        if (!disposed) {
          setMapStatus("fallback");
          setMapMessage("\uC9C0\uB3C4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD574 \uC704\uCE58 \uC124\uBA85\uB9CC \uC800\uC7A5\uD574\uC694.");
        }
      }
    }

    setupMap();

    return () => {
      disposed = true;
    };
  }, [onPinChange]);

  useEffect(() => {
    if (mapStatus !== "ready" || mapInstanceRef.current == null) {
      return;
    }

    const kakao = (window as Window & { kakao?: any }).kakao;
    if (kakao?.maps == null) {
      return;
    }

    if (latitude == null || longitude == null) {
      if (markerRef.current != null) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      return;
    }

    const position = new kakao.maps.LatLng(latitude, longitude);
    if (markerRef.current == null) {
      markerRef.current = new kakao.maps.Marker({
        map: mapInstanceRef.current,
        position,
      });
    } else {
      markerRef.current.setPosition(position);
      markerRef.current.setMap(mapInstanceRef.current);
    }

    mapInstanceRef.current.panTo(position);
  }, [latitude, longitude, mapStatus]);

  return (
    <div className="location-picker">
      <div className="field">
        <span>{"\uD540 \uC120\uD0DD"}</span>
      </div>

      <div className="location-picker-map-shell">
        {mapStatus !== "fallback" ? <div ref={mapElementRef} className="location-picker-map" /> : null}
        {mapStatus === "fallback" ? (
          <div className="location-picker-fallback">
            {"\uC9C0\uB3C4 \uBBF8\uB9AC\uBCF4\uAE30\uAC00 \uC5C6\uC5B4\uC11C \uC124\uBA85\uACFC \uC88C\uD45C\uB9CC \uC800\uC7A5\uD560 \uC218 \uC788\uC5B4\uC694."}
          </div>
        ) : null}
        {mapStatus === "loading" ? <div className="location-picker-note">{"\uC9C0\uB3C4 \uBD88\uB7EC\uC624\uB294 \uC911"}</div> : null}
        {mapMessage ? <div className="location-picker-note">{mapMessage}</div> : null}
      </div>

      <label className="field">
        <span>{"\uC704\uCE58 \uC124\uBA85"}</span>
        <input
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="(ex) GS25 \uC55E \uC2E0\uD638\uB4F1"
        />
      </label>
    </div>
  );
}
