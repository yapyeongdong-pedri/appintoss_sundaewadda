import { useMemo, useState } from "react";
import type { RegistrationRequest, Vendor } from "../types";
import { BottomSheet, Button } from "../ui";

interface RegistrationSheetProps {
  open: boolean;
  vendors: Vendor[];
  onClose: () => void;
  onSubmit: (draft: Omit<RegistrationRequest, "id" | "submittedAt" | "duplicateCandidateIds">) => void;
  onCheckDuplicates: (name: string, location: string) => Vendor[];
}

export function RegistrationSheet({
  open,
  vendors,
  onClose,
  onSubmit,
  onCheckDuplicates,
}: RegistrationSheetProps) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [visitPattern, setVisitPattern] = useState("");
  const [businessCardPhoto, setBusinessCardPhoto] = useState("");
  const [menuBoardPhoto, setMenuBoardPhoto] = useState("");

  const candidates = useMemo(() => onCheckDuplicates(name, location), [location, name, onCheckDuplicates]);

  const handleSubmit = () => {
    onSubmit({ name, location, visitPattern, businessCardPhoto, menuBoardPhoto });
    setName("");
    setLocation("");
    setVisitPattern("");
    setBusinessCardPhoto("");
    setMenuBoardPhoto("");
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      hasTextField
      expandBottomSheet
      header={<BottomSheet.Header>{"\uC2E0\uADDC \uD2B8\uB7ED \uB4F1\uB85D \uC694\uCCAD"}</BottomSheet.Header>}
      headerDescription={
        <BottomSheet.HeaderDescription>
          {"\uAE30\uC874 \uD2B8\uB7ED\uC778\uC9C0 \uBA3C\uC800 \uD655\uC778\uD558\uACE0 \uC694\uCCAD\uC744 \uB0A8\uACA8\uC8FC\uC138\uC694."}
        </BottomSheet.HeaderDescription>
      }
      cta={
        <BottomSheet.CTA>
          <Button
            color="primary"
            variant="fill"
            size="xlarge"
            display="full"
            onClick={handleSubmit}
            disabled={!name || !location || !visitPattern}
          >
            {"\uB4F1\uB85D \uC694\uCCAD \uBCF4\uB0B4\uAE30"}
          </Button>
        </BottomSheet.CTA>
      }
    >
      <div className="sheet-content">
        <label className="field">
          <span>{"\uD2B8\uB7ED \uC774\uB984"}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="\uC608: \uCCAD\uCD98 \uC21C\uB300\uD2B8\uB7ED"
          />
        </label>
        <label className="field">
          <span>{"\uD2B8\uB7ED \uC704\uCE58"}</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="\uC608: \uC815\uB989\uC2DC\uC7A5 \uC785\uAD6C \uC55E"
          />
        </label>
        <label className="field">
          <span>{"\uC624\uB294 \uC8FC\uAE30"}</span>
          <input
            value={visitPattern}
            onChange={(event) => setVisitPattern(event.target.value)}
            placeholder="\uC608: \uD654/\uBAA9/\uD1A0 \uC800\uB141"
          />
        </label>
        <label className="field">
          <span>{"\uBA85\uD568 \uC0AC\uC9C4 \uC124\uBA85"}</span>
          <input
            value={businessCardPhoto}
            onChange={(event) => setBusinessCardPhoto(event.target.value)}
            placeholder="\uC608: \uBA85\uD568 \uC55E\uBA74 \uC0AC\uC9C4"
          />
        </label>
        <label className="field">
          <span>{"\uBA54\uB274\uD310 \uC0AC\uC9C4 \uC124\uBA85"}</span>
          <input
            value={menuBoardPhoto}
            onChange={(event) => setMenuBoardPhoto(event.target.value)}
            placeholder="\uC608: \uBA54\uB274\uD310 \uC804\uCCB4 \uC0AC\uC9C4"
          />
        </label>

        <div className="hint-card">
          <p className="section-label">{"\uAE30\uC874 \uD2B8\uB7ED \uD6C4\uBCF4"}</p>
          {candidates.length === 0 ? (
            <p className="muted-text">
              {vendors.length > 0
                ? "\uBE44\uC2B7\uD55C \uD6C4\uBCF4\uAC00 \uC5C6\uC5B4\uC694."
                : "\uB4F1\uB85D\uB41C \uD2B8\uB7ED\uC774 \uC544\uC9C1 \uC5C6\uC5B4\uC694."}
            </p>
          ) : (
            candidates.map((candidate) => (
              <div className="duplicate-row" key={candidate.id}>
                <strong>{candidate.name}</strong>
                <span>{candidate.position.address}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
