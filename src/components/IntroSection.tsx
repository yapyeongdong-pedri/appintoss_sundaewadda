import { Button } from "../ui";

interface IntroSectionProps {
  onStart: () => void;
}

export function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <section className="hero-card hero-card-intro">
      <div className="hero-copy">
        <h1 className="hero-title">{"\uC21C\uB300\uC640\uB530"}</h1>
        <p className="hero-description">{"'\uC624\uB298 \uC9D1 \uC55E\uC5D0 \uACF1\uCC3D \uD2B8\uB7ED \uC654\uB098?'"}</p>
      </div>

      <div className="hero-feature-list">
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDCCD"}</span>
          <div>
            <strong>{"\uC8FC\uBCC0 \uC21C\uB300/\uACF1\uCC3D \uD2B8\uB7ED \uD655\uC778"}</strong>
            <p>{"\uC9C0\uB3C4\uC5D0\uC11C \uADFC\uCC98 \uB9DB\uC9D1 \uD2B8\uB7ED \uD655\uC778\uD574\uC694"}</p>
          </div>
        </article>
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDCF8"}</span>
          <div>
            <strong>{"\uC21C\uB300/\uACF1\uCC3D \uD2B8\uB7ED \uC2E4\uC2DC\uAC04 \uC81C\uBCF4"}</strong>
            <p>{"\uB9DB\uC9D1 \uD2B8\uB7ED \uC601\uC5C5 \uC2DC\uC791 \uBC0F \uC885\uB8CC \uC81C\uBCF4\uD574\uC694"}</p>
          </div>
        </article>
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDE9A"}</span>
          <div>
            <strong>{"\uC0C8\uB85C \uC0DD\uAE34 \uB9DB\uC9D1 \uD2B8\uB7ED \uB4F1\uB85D"}</strong>
            <p>{"\uB098\uB9CC \uC544\uB294 \uB9DB\uC9D1 \uD2B8\uB7ED \uD568\uAED8 \uACF5\uC720\uD574\uC694"}</p>
          </div>
        </article>
      </div>

      <Button color="primary" variant="fill" size="xlarge" display="full" onClick={onStart}>
        {"\uC6B0\uB9AC \uB3D9\uB124 \uACF1\uCC3D/\uC21C\uB300 \uD2B8\uB7ED \uBCF4\uB7EC \uAC00\uAE30"}
      </Button>
    </section>
  );
}
