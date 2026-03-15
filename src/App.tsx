import { useEffect, useMemo, useState } from "react";
import { IntroSection } from "./components/IntroSection";
import { NeighborhoodMap } from "./components/NeighborhoodMap";
import { RegistrationSheet } from "./components/RegistrationSheet";
import { RequestsScreen } from "./components/RequestsScreen";
import { SettingsScreen } from "./components/SettingsScreen";
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

type AppTab = "requests" | "map" | "settings";

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
  const [activeTab, setActiveTab] = useState<AppTab>("map");

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
      {started || isBootstrapping ? (
        <section className="top-summary top-summary-compact">
          <div>
            <p className="app-name">{"\uC21C\uB300\uC640\uB530"}</p>
            <p className="app-caption">
              {"\uC624\uB298 \uC6B0\uB9AC \uB3D9\uB124 \uC21C\uB300\uD2B8\uB7ED, \uACF1\uCC3D\uD2B8\uB7ED \uC654\uB294\uC9C0 \uD655\uC778\uD574\uC694"}
            </p>
          </div>
        </section>
      ) : null}

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
        <section className="app-body">
          <div className="screen-container">
            {activeTab === "map" ? (
              <div className="tab-screen">
                <NeighborhoodMap
                  vendors={vendorSummaries}
                  selectedVendorId={selectedVendorId}
                  onSelect={(vendorId) => setSelectedVendorId(vendorId)}
                />
              </div>
            ) : null}
            {activeTab === "requests" ? (
              <RequestsScreen
                registrationRequests={registrationRequests}
                updateRequests={updateRequests}
                onOpenRegistration={() => setRegistrationOpen(true)}
              />
            ) : null}
            {activeTab === "settings" ? <SettingsScreen /> : null}
          </div>

          <nav className="bottom-nav" aria-label="main navigation">
            <button
              type="button"
              className={`bottom-nav-item bottom-nav-item-side ${
                activeTab === "requests" ? "bottom-nav-item-active" : ""
              }`}
              onClick={() => setActiveTab("requests")}
            >
              <span className="bottom-nav-icon">{"\u2795"}</span>
              <span>{"\uD2B8\uB7ED \uCD94\uAC00"}</span>
            </button>
            <button
              type="button"
              className={`bottom-nav-item bottom-nav-item-center ${
                activeTab === "map" ? "bottom-nav-item-active" : ""
              }`}
              onClick={() => setActiveTab("map")}
            >
              <span className="bottom-nav-icon">{"\uD83D\uDCCD"}</span>
              <span>{"\uC9C0\uB3C4 \uBCF4\uAE30"}</span>
            </button>
            <button
              type="button"
              className={`bottom-nav-item bottom-nav-item-side ${
                activeTab === "settings" ? "bottom-nav-item-active" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="bottom-nav-icon">{"\u2699\uFE0F"}</span>
              <span>{"\uC124\uC815"}</span>
            </button>
          </nav>
        </section>
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
