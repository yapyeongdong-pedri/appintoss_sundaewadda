import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMapSdk } from "../lib/kakaoMap";
import { getStatusLabel } from "../lib/status";
import type { VendorSummary } from "../types";

interface NeighborhoodMapProps {
  vendors: VendorSummary[];
  selectedVendorId?: string;
  onSelect: (vendorId: string) => void;
}

export function NeighborhoodMap({
  vendors,
  selectedVendorId,
  onSelect,
}: NeighborhoodMapProps) {
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRefs = useRef<Map<string, any>>(new Map());
  const [mapMode, setMapMode] = useState<"loading" | "live" | "fallback">(() =>
    import.meta.env.VITE_KAKAO_MAP_APP_KEY ? "loading" : "fallback",
  );
  const [mapNotice, setMapNotice] = useState<string>();

  const mapVendors = useMemo(
    () =>
      vendors.map((vendor) => ({
        ...vendor,
        latitude: vendor.position.latitude,
        longitude: vendor.position.longitude,
      })),
    [vendors],
  );

  useEffect(() => {
    const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY;
    if (appKey == null || appKey.trim() === "") {
      setMapMode("fallback");
      setMapNotice("\uCE74\uCE74\uC624\uB9F5 \uD0A4 \uC5F0\uACB0 \uC804 \uBBF8\uB9AC\uBCF4\uAE30 \uC9C0\uB3C4\uC608\uC694.");
      return;
    }

    let disposed = false;

    async function setupMap() {
      try {
        const kakao = await loadKakaoMapSdk(appKey);
        if (disposed || mapElementRef.current == null) {
          return;
        }

        const center = new kakao.maps.LatLng(37.6063, 127.0186);
        const map = new kakao.maps.Map(mapElementRef.current, {
          center,
          level: 5,
        });

        mapInstanceRef.current = map;
        setMapMode("live");
        setMapNotice(undefined);
      } catch (error) {
        console.warn("Kakao map unavailable. Using fallback surface.", error);
        if (!disposed) {
          setMapMode("fallback");
          setMapNotice("\uC9C0\uB3C4 \uB85C\uB529\uC774 \uC548 \uB418\uC5B4 \uAE30\uBCF8 \uC9C0\uB3C4\uB85C \uBCF4\uC5EC\uC8FC\uACE0 \uC788\uC5B4\uC694.");
        }
      }
    }

    setupMap();

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (mapMode !== "live" || mapInstanceRef.current == null) {
      return;
    }

    let disposed = false;

    async function renderMarkers() {
      const kakao = (window as Window & { kakao?: any }).kakao;
      if (kakao?.maps == null) {
        setMapMode("fallback");
        return;
      }

      const map = mapInstanceRef.current;
      const geocoder = new kakao.maps.services.Geocoder();
      const bounds = new kakao.maps.LatLngBounds();

      markerRefs.current.forEach((marker) => marker.setMap(null));
      markerRefs.current.clear();

      const resolved = await Promise.all(
        mapVendors.map(async (vendor) => {
          if (vendor.latitude != null && vendor.longitude != null) {
            return { vendor, latitude: vendor.latitude, longitude: vendor.longitude };
          }

          const geocoded = await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
            geocoder.addressSearch(vendor.position.address, (result: any[], status: string) => {
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

          if (geocoded != null) {
            return { vendor, ...geocoded };
          }

          return {
            vendor,
            latitude: 37.598 + vendor.position.y * 0.00018,
            longitude: 127.0 + vendor.position.x * 0.00018,
          };
        }),
      );

      if (disposed) {
        return;
      }

      resolved.forEach(({ vendor, latitude, longitude }) => {
        const position = new kakao.maps.LatLng(latitude, longitude);
        bounds.extend(position);

        const isSelected = vendor.id === selectedVendorId;
        const marker = new kakao.maps.Marker({
          map,
          position,
          title: vendor.name,
          zIndex: isSelected ? 10 : 1,
          image: new kakao.maps.MarkerImage(
            buildMarkerImage(vendor.status, isSelected),
            new kakao.maps.Size(isSelected ? 30 : 24, isSelected ? 42 : 34),
            { offset: new kakao.maps.Point(isSelected ? 15 : 12, isSelected ? 42 : 34) },
          ),
        });

        kakao.maps.event.addListener(marker, "click", () => onSelect(vendor.id));
        markerRefs.current.set(vendor.id, marker);
      });

      if (resolved.length > 0) {
        map.setBounds(bounds, 44, 24, 24, 24);
      }

      const selected = resolved.find(({ vendor }) => vendor.id === selectedVendorId);
      if (selected != null) {
        map.panTo(new kakao.maps.LatLng(selected.latitude, selected.longitude));
      }
    }

    renderMarkers();

    return () => {
      disposed = true;
    };
  }, [mapMode, mapVendors, onSelect, selectedVendorId]);

  return (
    <section className="map-card">
      <div className={`map-surface ${mapMode === "live" ? "map-surface-live" : ""}`} aria-label="local truck map">
        {mapMode !== "fallback" ? <div ref={mapElementRef} className="kakao-map-canvas" /> : null}
        {mapMode !== "live" ? (
          <>
            <div className="street street-horizontal" />
            <div className="street street-vertical" />
            {vendors.map((vendor) => (
              <button
                key={vendor.id}
                type="button"
                className={`pin pin-${vendor.status} ${selectedVendorId === vendor.id ? "pin-selected" : ""}`}
                style={{ left: `${vendor.position.x}%`, top: `${vendor.position.y}%` }}
                onClick={() => onSelect(vendor.id)}
                aria-label={`${vendor.name}, ${getStatusLabel(vendor.status)}`}
              >
                <span className="pin-dot" />
                <span className="pin-label">{vendor.name}</span>
              </button>
            ))}
          </>
        ) : null}

        {mapMode === "loading" ? (
          <div className="map-overlay-note">
            {"\uCE74\uCE74\uC624\uB9F5\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC774\uC5D0\uC694."}
          </div>
        ) : null}

        {mapNotice ? <div className="map-overlay-note">{mapNotice}</div> : null}
      </div>
      <div className="map-legend">
        <span>
          <i className="legend-dot legend-open" /> {"\uC601\uC5C5\uC911"}
        </span>
        <span>
          <i className="legend-dot legend-closed" /> {"\uC601\uC5C5\uC885\uB8CC"}
        </span>
        <span>
          <i className="legend-dot legend-unknown" /> {"\uD655\uC778 \uC81C\uBCF4 \uD544\uC694"}
        </span>
      </div>
    </section>
  );
}

function buildMarkerImage(status: VendorSummary["status"], selected: boolean) {
  const fill =
    status === "likelyClosed"
      ? "#d95c5c"
      : status === "unknown"
        ? "#9aa4b2"
        : "#3182f6";

  const stroke = selected ? "#191f28" : "#ffffff";
  const svg = `
    <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 43C16 43 30 26.5 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 26.5 16 43 16 43Z" fill="${fill}" stroke="${stroke}" stroke-width="${selected ? 3 : 2}"/>
      <circle cx="16" cy="16" r="5" fill="white"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
