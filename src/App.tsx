import { useEffect, useMemo, useState } from "react";
import { IntroSection } from "./components/IntroSection";
import { NeighborhoodMap } from "./components/NeighborhoodMap";
import { RegistrationSheet } from "./components/RegistrationSheet";
import { UpdateSheet } from "./components/UpdateSheet";
import { VendorSheet } from "./components/VendorSheet";
import { findDuplicateCandidates } from "./lib/duplicates";
import {
  createLiveReport,
  createRegistrationRequest,
  createUpdateRequest,
  loadAppData,
} from "./lib/repository";
import { buildVendorSummary } from "./lib/status";
import type { LiveReport, RegistrationRequest, UpdateRequest, Vendor } from "./types";
import { Badge, Button } from "./ui";

function App() {
  const [started, setStarted] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => []);
  const [reports, setReports] = useState<LiveReport[]>(() => []);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(() => []);
  const [updateRequests, setUpdateRequests] = useState<UpdateRequest[]>(() => []);
  const [selectedVendorId, setSelectedVendorId] = useState<string>();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      const bundle = await loadAppData();
      if (!mounted) {
        return;
      }

      setVendors(bundle.vendors);
      setReports(bundle.reports);
      setRegistrationRequests(bundle.registrationRequests);
      setUpdateRequests(bundle.updateRequests);
      setIsBootstrapping(false);
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const vendorSummaries = useMemo(
    () => vendors.map((vendor) => buildVendorSummary(vendor, reports)),
    [vendors, reports],
  );

  const selectedVendor = vendorSummaries.find((vendor) => vendor.id === selectedVendorId);

  const handleReport = async (vendorId: string, type: "open" | "notYet" | "closed") => {
    const nextReport: LiveReport = {
      id: crypto.randomUUID(),
      vendorId,
      type,
      createdAt: new Date().toISOString(),
      reporterId: "guest-device",
    };
    const nextReports = [nextReport, ...reports];
    setReports(nextReports);
    await createLiveReport(nextReport);
    setFeedbackMessage("\uC2E4\uC2DC\uAC04 \uC81C\uBCF4\uAC00 \uBC18\uC601\uB410\uC5B4\uC694.");
  };

  const handleSubmitRegistration = async (
    draft: Omit<RegistrationRequest, "id" | "submittedAt" | "duplicateCandidateIds">,
  ) => {
    const duplicates = findDuplicateCandidates(vendors, { name: draft.name, location: draft.location });
    const nextRequest = {
      ...draft,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      duplicateCandidateIds: duplicates.map((candidate) => candidate.id),
    };
    const nextRequests = [nextRequest, ...registrationRequests];

    setRegistrationRequests(nextRequests);
    await createRegistrationRequest(nextRequest);
    setRegistrationOpen(false);
    setFeedbackMessage(
      duplicates.length > 0
        ? "\uC911\uBCF5 \uD6C4\uBCF4\uC640 \uD568\uAED8 \uB4F1\uB85D \uC694\uCCAD\uC744 \uC800\uC7A5\uD588\uC5B4\uC694."
        : "\uB4F1\uB85D \uC694\uCCAD\uC774 \uC811\uC218\uB410\uC5B4\uC694.",
    );
  };

  const handleSubmitUpdate = async (draft: Omit<UpdateRequest, "id" | "submittedAt">) => {
    const nextRequest = {
      ...draft,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    };
    const nextRequests = [nextRequest, ...updateRequests];
    setUpdateRequests(nextRequests);
    await createUpdateRequest(nextRequest);
    setUpdateOpen(false);
    setFeedbackMessage("\uC218\uC815 \uC694\uCCAD\uC774 \uC811\uC218\uB410\uC5B4\uC694.");
  };

  return (
    <main className="app-shell">
      <section className="top-summary">
        <div>
          <p className="app-name">{"\uC21C\uB300\uC640\uB530"}</p>
          <p className="app-caption">
            {"\uC624\uB298 \uC6B0\uB9AC \uB3D9\uB124 \uC21C\uB300\uD2B8\uB7ED, \uACF1\uCC3D\uD2B8\uB7ED \uC654\uB294\uC9C0 \uD655\uC778\uD574\uC694"}
          </p>
        </div>
        <Badge variant="weak" color="blue" size="small">
          {"\uC694\uCCAD "} {registrationRequests.length + updateRequests.length}
        </Badge>
      </section>

      {feedbackMessage ? (
        <section className="feedback-banner" role="status">
          <span>{feedbackMessage}</span>
          <button type="button" onClick={() => setFeedbackMessage(undefined)}>
            {"\uB2EB\uAE30"}
          </button>
        </section>
      ) : null}

      {isBootstrapping ? (
        <section className="hero-card">
          <p className="hero-description">{"\uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC624\uB294 \uC911\uC774\uC5D0\uC694."}</p>
        </section>
      ) : !started ? (
        <IntroSection onStart={() => setStarted(true)} />
      ) : (
        <>
          <NeighborhoodMap
            vendors={vendorSummaries}
            selectedVendorId={selectedVendorId}
            onSelect={(vendorId) => setSelectedVendorId(vendorId)}
          />

          <section className="request-summary">
            <div className="summary-card">
              <p className="section-eyebrow">{"\uAC80\uC218 \uB300\uAE30 \uB370\uC774\uD130"}</p>
              <h2 className="section-title">{"\uC694\uCCAD \uD750\uB984 \uBD84\uB9AC"}</h2>
              <p className="muted-text">
                {
                  "\uCD5C\uC885 \uD2B8\uB7ED DB\uB294 \uBC14\uB85C \uBC14\uB00C\uC9C0 \uC54A\uACE0, \uB4F1\uB85D/\uC218\uC815 \uC694\uCCAD\uC774 \uB530\uB85C \uC313\uC5EC\uC694."
                }
              </p>
              <div className="summary-grid">
                <div>
                  <strong>{registrationRequests.length}</strong>
                  <span>{"\uB4F1\uB85D \uC694\uCCAD"}</span>
                </div>
                <div>
                  <strong>{updateRequests.length}</strong>
                  <span>{"\uC218\uC815 \uC694\uCCAD"}</span>
                </div>
                <div>
                  <strong>{reports.length}</strong>
                  <span>{"\uC2E4\uC2DC\uAC04 \uC81C\uBCF4"}</span>
                </div>
              </div>
              <Button
                color="primary"
                variant="weak"
                size="large"
                display="full"
                onClick={() => setRegistrationOpen(true)}
              >
                {"\uC2E0\uADDC \uD2B8\uB7ED \uB4F1\uB85D \uC694\uCCAD"}
              </Button>
            </div>
          </section>
        </>
      )}

      <VendorSheet
        vendor={selectedVendor}
        open={selectedVendor != null}
        onClose={() => setSelectedVendorId(undefined)}
        onReport={handleReport}
        onOpenRegistration={() => setRegistrationOpen(true)}
        onOpenUpdate={(vendorId) => {
          setSelectedVendorId(vendorId);
          setUpdateOpen(true);
        }}
      />

      <RegistrationSheet
        open={registrationOpen}
        vendors={vendors}
        onClose={() => setRegistrationOpen(false)}
        onSubmit={handleSubmitRegistration}
        onCheckDuplicates={(name, location) => findDuplicateCandidates(vendors, { name, location })}
      />

      <UpdateSheet
        open={updateOpen}
        vendorId={selectedVendorId}
        onClose={() => setUpdateOpen(false)}
        onSubmit={handleSubmitUpdate}
      />
    </main>
  );
}

export default App;
