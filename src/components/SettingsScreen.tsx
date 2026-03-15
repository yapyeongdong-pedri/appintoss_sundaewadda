import { Badge } from "../ui";

export function SettingsScreen() {
  return (
    <section className="tab-screen">
      <section className="summary-card settings-card">
        <div className="screen-header">
          <div>
            <p className="section-eyebrow">{"\uC124\uC815"}</p>
            <h2 className="section-title">{"\uC21C\uB300\uC640\uB530 \uC124\uC815\uC740 \uC5EC\uAE30\uC11C \uACE0\uBBFC\uD574\uC694"}</h2>
          </div>
          <Badge variant="weak" color="elephant" size="small">
            {"coming soon"}
          </Badge>
        </div>

        <div className="settings-stack">
          <article className="settings-card-item">
            <strong>{"\uB2E4\uC74C\uC5D0 \uB123\uACE0 \uC2F6\uC740 \uD56D\uBAA9"}</strong>
            <p>{"\uC54C\uB9BC \uC635\uC158, \uC9C0\uC5ED \uC124\uC815, \uC81C\uBCF4 \uAE30\uC900 \uC548\uB0B4 \uAC19\uC740 \uAC83\uC744 \uCC28\uB840\uB300\uB85C \uB123\uC5B4\uBCFC \uC218 \uC788\uC5B4\uC694."}</p>
          </article>
          <article className="settings-card-item">
            <strong>{"\uC9C0\uAE08 \uD1A4"}</strong>
            <p>{"\uC6B0\uC120\uC740 \uC9C0\uB3C4\uC640 \uD2B8\uB7ED \uCD94\uAC00 \uD750\uB984\uC5D0 \uC9D1\uC911\uD558\uACE0, \uC124\uC815 \uD0ED\uC740 \uAC04\uB2E8\uD55C \uC548\uB0B4 \uD654\uBA74\uC73C\uB85C \uB450\uC5C8\uC5B4\uC694."}</p>
          </article>
        </div>
      </section>
    </section>
  );
}
