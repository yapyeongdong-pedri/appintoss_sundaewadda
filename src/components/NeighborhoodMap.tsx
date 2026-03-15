import { getStatusLabel } from "../lib/status";
import type { VendorSummary } from "../types";
import { Badge } from "../ui";

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
  return (
    <section className="map-card">
      <div className="map-header">
        <div>
          <p className="section-eyebrow">{"\uB0B4 \uC8FC\uBCC0 \uC9C0\uB3C4"}</p>
          <h2 className="section-title">{"\uC815\uB989\uB3D9 \uBC18\uACBD 1km"}</h2>
        </div>
        <Badge variant="weak" color="elephant" size="small">
          {"\uD2B8\uB7ED "} {vendors.length}
        </Badge>
      </div>
      <div className="map-surface" aria-label="local truck map">
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
      </div>
      <div className="map-legend">
        <span>
          <i className="legend-dot legend-unknown" /> {"\uD655\uC778 \uC81C\uBCF4 \uC5C6\uC74C"}
        </span>
        <span>
          <i className="legend-dot legend-open" /> {"\uC601\uC5C5\uC911 \uAC00\uB2A5\uC131"}
        </span>
        <span>
          <i className="legend-dot legend-closed" /> {"\uC601\uC5C5\uC885\uB8CC \uAC00\uB2A5\uC131"}
        </span>
        <span>
          <i className="legend-dot legend-owner" /> {"\uC0AC\uC7A5\uB2D8 \uD655\uC778"}
        </span>
      </div>
    </section>
  );
}
