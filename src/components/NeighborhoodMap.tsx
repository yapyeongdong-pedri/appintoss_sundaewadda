import { useEffect, useMemo, useRef, useState } from "react";
import { loadKakaoMapSdk } from "../lib/kakaoMap";
import { getStatusLabel } from "../lib/status";
import type { VendorSummary } from "../types";
import { BottomSheet, Button } from "../ui";

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
  const currentLocationMarkerRef = useRef<any>(null);
  const shouldFocusCurrentLocationRef = useRef(false);
  const [mapMode, setMapMode] = useState<"loading" | "live" | "fallback">(() =>
    import.meta.env.VITE_KAKAO_MAP_APP_KEY ? "loading" : "fallback",
  );
  const [mapNotice, setMapNotice] = useState<string>();
  const [locationConsentOpen, setLocationConsentOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);

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

      if (resolved.length > 0 && !shouldFocusCurrentLocationRef.current) {
        map.setBounds(bounds, 44, 24, 24, 24);
      }

      const selected = resolved.find(({ vendor }) => vendor.id === selectedVendorId);
      if (selected != null) {
        map.panTo(new kakao.maps.LatLng(selected.latitude, selected.longitude));
      }

      if (currentLocation != null) {
        const currentPosition = new kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
        if (currentLocationMarkerRef.current == null) {
          currentLocationMarkerRef.current = new kakao.maps.Marker({
            map,
            position: currentPosition,
            title: "\uD604\uC7AC \uC704\uCE58",
            zIndex: 20,
            image: new kakao.maps.MarkerImage(
              buildCurrentLocationImage(),
              new kakao.maps.Size(18, 18),
              { offset: new kakao.maps.Point(9, 9) },
            ),
          });
        } else {
          currentLocationMarkerRef.current.setMap(map);
          currentLocationMarkerRef.current.setPosition(currentPosition);
        }

        if (shouldFocusCurrentLocationRef.current) {
          map.panTo(currentPosition);
          if (typeof map.setLevel === "function") {
            map.setLevel(3);
          }
          shouldFocusCurrentLocationRef.current = false;
        }
      } else if (currentLocationMarkerRef.current != null) {
        currentLocationMarkerRef.current.setMap(null);
      }
    }

    renderMarkers();

    return () => {
      disposed = true;
    };
  }, [currentLocation, mapMode, mapVendors, onSelect, selectedVendorId]);

  const handleLocateMe = () => {
    setLocationConsentOpen(true);
  };

  const requestCurrentLocation = async () => {
    if (!("geolocation" in navigator)) {
      setMapNotice("\uD604\uC7AC \uAE30\uAE30\uC5D0\uC11C \uC704\uCE58 \uD655\uC778\uC744 \uC9C0\uC6D0\uD558\uC9C0 \uC54A\uC544\uC694.");
      setLocationConsentOpen(false);
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        shouldFocusCurrentLocationRef.current = true;
        setCurrentLocation(nextLocation);
        setLocationConsentOpen(false);
        setIsLocating(false);
        setMapNotice("\uD604\uC7AC \uC704\uCE58\uB85C \uC774\uB3D9\uD588\uC5B4\uC694.");
      },
      () => {
        setIsLocating(false);
        setLocationConsentOpen(false);
        setMapNotice(
          "\uC704\uCE58 \uAD8C\uD55C\uC774 \uAC70\uBD80\uB418\uC5C8\uAC70\uB098 \uD604\uC7AC \uC704\uCE58\uB97C \uAC00\uC838\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    );
  };

  return (
    <section className="map-card">
      <div className={`map-surface ${mapMode === "live" ? "map-surface-live" : ""}`} aria-label="local truck map">
        <div className="map-toolbar">
          <Button
            color="light"
            variant="fill"
            size="medium"
            display="inline"
            onClick={handleLocateMe}
          >
            {"\uB0B4 \uC704\uCE58"}
          </Button>
        </div>
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

      <BottomSheet
        open={locationConsentOpen}
        onClose={() => {
          if (!isLocating) {
            setLocationConsentOpen(false);
          }
        }}
        header={<BottomSheet.Header>{"\uD604\uC7AC \uC704\uCE58 \uD655\uC778"}</BottomSheet.Header>}
        headerDescription={
          <BottomSheet.HeaderDescription>
            {
              "\uB0B4 \uC8FC\uBCC0 \uD2B8\uB7ED\uC744 \uB354 \uC815\uD655\uD788 \uBCF4\uAE30 \uC704\uD574 \uD604\uC7AC \uC704\uCE58 \uC815\uBCF4\uB97C \uD55C \uBC88 \uC0AC\uC6A9\uD574\uC694."
            }
          </BottomSheet.HeaderDescription>
        }
        cta={
          <BottomSheet.DoubleCTA
            leftButton={
              <Button
                color="light"
                variant="weak"
                size="large"
                display="full"
                onClick={() => setLocationConsentOpen(false)}
                disabled={isLocating}
              >
                {"\uB2E4\uC74C\uC5D0"}
              </Button>
            }
            rightButton={
              <Button
                color="primary"
                variant="fill"
                size="large"
                display="full"
                onClick={requestCurrentLocation}
                disabled={isLocating}
              >
                {isLocating ? "\uC704\uCE58 \uD655\uC778 \uC911" : "\uD604\uC7AC \uC704\uCE58 \uC0AC\uC6A9"}
              </Button>
            }
          />
        }
      >
        <div className="sheet-content">
          <div className="hint-card">
            <p className="section-label">{"\uC0AC\uC6A9 \uBAA9\uC801"}</p>
            <p className="muted-text">
              {"\uB0B4 \uC8FC\uBCC0 \uD2B8\uB7ED \uC704\uCE58 \uD655\uC778 \uBC0F \uC9C0\uB3C4 \uC911\uC2EC \uC774\uB3D9"}
            </p>
          </div>
        </div>
      </BottomSheet>
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

function buildCurrentLocationImage() {
  const svg = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" fill="#ffffff" fill-opacity="0.88"/>
      <circle cx="9" cy="9" r="5" fill="#3182f6"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
