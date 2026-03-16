import { useEffect, useRef, useState } from "react";
import { geocodeAddress, loadKakaoMapSdk } from "../lib/kakaoMap";

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
          setMapMessage("\uC120\uD0DD\uD55C \uD540 \uC704\uCE58\uB97C \uC800\uC7A5\uD560\uAC8C\uC694.");
        });

        setMapStatus("ready");
        setMapMessage("\uC9C0\uB3C4\uB97C \uD074\uB9AD\uD574 \uC815\uD655\uD55C \uD540 \uC704\uCE58\uB97C \uC9D1\uC5B4\uC8FC\uC138\uC694.");
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

  const handleFindPinFromDescription = async () => {
    const geocoded = await geocodeAddress(description);
    if (geocoded == null) {
      setMapMessage("\uC124\uBA85\uC73C\uB85C \uC704\uCE58\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC9C0\uB3C4\uC5D0\uC11C \uC9C1\uC811 \uD540\uC744 \uCC0D\uC5B4\uC8FC\uC138\uC694.");
      return;
    }

    onPinChange(geocoded);
    setMapMessage("\uC124\uBA85 \uAE30\uC900\uC73C\uB85C \uD540 \uC704\uCE58\uB97C \uC62E\uACA8\uC5D0 \uB193\uC558\uC5B4\uC694.");
  };

  return (
    <div className="location-picker">
      <label className="field">
        <span>{"\uC704\uCE58 \uC124\uBA85"}</span>
        <input
          value={description}
          onChange={(event) => onDescriptionChange(event.target.value)}
          placeholder="\uC608: \uC815\uB989\uC2DC\uC7A5 \uC785\uAD6C \uC55E"
        />
      </label>

      <ButtonRow onFindPinFromDescription={handleFindPinFromDescription} disabled={description.trim() === ""} />

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

      <div className="hint-card">
        <p className="section-label">{"\uC120\uD0DD\uD55C \uD540 \uC704\uCE58"}</p>
        <p className="muted-text">
          {latitude != null && longitude != null
            ? `Lat ${latitude.toFixed(5)} / Lng ${longitude.toFixed(5)}`
            : "\uC544\uC9C1 \uD540 \uC704\uCE58\uB97C \uACE0\uB974\uC9C0 \uC54A\uC558\uC5B4\uC694."}
        </p>
      </div>
    </div>
  );
}

interface ButtonRowProps {
  onFindPinFromDescription: () => void;
  disabled: boolean;
}

function ButtonRow({ onFindPinFromDescription, disabled }: ButtonRowProps) {
  return (
    <div className="location-picker-actions">
      <button
        type="button"
        className="field-chip location-picker-action"
        onClick={onFindPinFromDescription}
        disabled={disabled}
      >
        {"\uC124\uBA85\uC73C\uB85C \uD540 \uCC3E\uAE30"}
      </button>
    </div>
  );
}
