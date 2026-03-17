import type { RegistrationRequest, UpdateRequest } from "../types";
import { formatVisitRules } from "../lib/visitRules";
import { Badge, Button } from "../ui";

interface RequestsScreenProps {
  registrationRequests: RegistrationRequest[];
  updateRequests: UpdateRequest[];
  onOpenRegistration: () => void;
}

function formatTimeLabel(isoString: string) {
  const date = new Date(isoString);
  return `${date.getMonth() + 1}.${date.getDate()} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function getRegistrationStatus(request: RegistrationRequest) {
  return request.duplicateCandidateIds.length > 0
    ? { label: "\uC911\uBCF5 \uD655\uC778 \uC911", tone: "yellow" as const }
    : { label: "\uC811\uC218 \uC644\uB8CC", tone: "blue" as const };
}

function getUpdateFieldLabel(field: UpdateRequest["field"]) {
  switch (field) {
    case "menu":
    case "menuBoard":
      return "\uBA54\uB274\uD310 \uAD50\uCCB4";
    case "visitPattern":
      return "\uC6B4\uC601 \uC694\uC77C";
    case "businessHours":
      return "\uC601\uC5C5\uC2DC\uAC04";
    case "location":
      return "\uC704\uCE58";
    case "phone":
      return "\uC804\uD654\uBC88\uD638";
    case "closedNotice":
      return "\uD3D0\uC5C5\uC2E0\uACE0";
    default:
      return "\uC815\uBCF4";
  }
}

function getUpdatePreview(request: UpdateRequest) {
  if (request.field === "menuBoard") {
    const photoCount = request.menuBoardPhotos?.length ?? 0;
    return `${request.value} / \uBA54\uB274\uD310 ${photoCount}\uC7A5`;
  }

  if (request.field === "menu") {
    return request.value;
  }

  return request.value;
}

export function RequestsScreen({
  registrationRequests,
  updateRequests,
  onOpenRegistration,
}: RequestsScreenProps) {
  const recentRegistrations = registrationRequests.slice(0, 2);
  const recentUpdates = updateRequests.slice(0, 2);

  return (
    <section className="tab-screen">
      <section className="summary-card requests-card">
        <div className="screen-header">
          <div>
            <p className="section-eyebrow">{"\uD2B8\uB7ED \uCD94\uAC00"}</p>
            <h2 className="section-title">{"\uC2E0\uADDC \uB4F1\uB85D / \uC218\uC815 \uC694\uCCAD \uD604\uD669"}</h2>
          </div>
          <Badge variant="weak" color="blue" size="small">
            {"\uC694\uCCAD "} {registrationRequests.length + updateRequests.length}
          </Badge>
        </div>

        <div className="requests-hero">
          <Button color="primary" variant="fill" size="xlarge" display="full" onClick={onOpenRegistration}>
            {"\uC2E0\uADDC \uD2B8\uB7ED \uB4F1\uB85D \uC694\uCCAD\uD558\uAE30"}
          </Button>
        </div>

        <div className="request-section">
          <div className="request-section-head">
            <p className="section-label">{"\uC2E0\uADDC \uB4F1\uB85D \uC694\uCCAD"}</p>
            <span className="muted-text">{recentRegistrations.length || 0}</span>
          </div>
          {recentRegistrations.length === 0 ? (
            <div className="request-empty-card">
              <strong>{"\uC544\uC9C1 \uC694\uCCAD\uD55C \uD2B8\uB7ED\uC774 \uC5C6\uC5B4\uC694."}</strong>
            </div>
          ) : (
            <div className="request-list">
              {recentRegistrations.map((request) => {
                const status = getRegistrationStatus(request);

                return (
                  <article className="request-card" key={request.id}>
                    <div className="request-card-head">
                      <div>
                        <strong>{request.name}</strong>
                        <p>{request.location}</p>
                      </div>
                      <Badge color={status.tone} variant="weak" size="small">
                        {status.label}
                      </Badge>
                    </div>
                    <div className="request-meta-row">
                      <span>{formatVisitRules(request.visitRules, request.visitPattern)}</span>
                      <span>{request.businessHours}</span>
                    </div>
                    <div className="request-meta-row">
                      <span>{formatTimeLabel(request.submittedAt)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div className="request-section">
          <div className="request-section-head">
            <p className="section-label">{"\uC815\uBCF4 \uC218\uC815 \uC694\uCCAD"}</p>
            <span className="muted-text">{recentUpdates.length || 0}</span>
          </div>
          {recentUpdates.length === 0 ? (
            <div className="request-empty-card">
              <strong>{"\uC544\uC9C1 \uC218\uC815 \uC694\uCCAD\uC740 \uC5C6\uC5B4\uC694."}</strong>
            </div>
          ) : (
            <div className="request-list">
              {recentUpdates.map((request) => (
                <article className="request-card" key={request.id}>
                  <div className="request-card-head">
                    <div>
                      <strong>{getUpdateFieldLabel(request.field)}</strong>
                      <p>{getUpdatePreview(request)}</p>
                    </div>
                    <Badge color="blue" variant="weak" size="small">
                      {"\uC811\uC218 \uC644\uB8CC"}
                    </Badge>
                  </div>
                  <div className="request-meta-row">
                    <span>{"\uAE30\uC874 \uD2B8\uB7ED \uC815\uBCF4 \uC218\uC815"}</span>
                    <span>{formatTimeLabel(request.submittedAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}
