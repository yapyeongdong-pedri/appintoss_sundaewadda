import { Badge, Button } from "../ui";

interface IntroSectionProps {
  onStart: () => void;
}

export function IntroSection({ onStart }: IntroSectionProps) {
  return (
    <section className="hero-card hero-card-intro">
      <Badge variant="weak" color="blue" size="small">
        {"\uC2E4\uC2DC\uAC04 \uB3D9\uB124 \uD2B8\uB7ED \uD655\uC778"}
      </Badge>
      <div className="hero-copy">
        <h1 className="hero-title">{"\uC21C\uB300\uC640\uB530"}</h1>
        <p className="hero-description">
          {
            "\uC624\uB298 \uC6B0\uB9AC \uB3D9\uB124 \uC21C\uB300\uD2B8\uB7ED, \uACF1\uCC3D\uD2B8\uB7ED \uC654\uB294\uC9C0 \uD655\uC778\uD574\uC694."
          }
        </p>
      </div>

      <div className="hero-feature-list">
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDCCD"}</span>
          <div>
            <strong>{"\uAC00\uAE4C\uC6B4 \uD2B8\uB7ED\uB9CC \uBC14\uB85C \uBCF4\uAE30"}</strong>
            <p>{"\uB3D9\uB124 \uC9C0\uB3C4\uC5D0\uC11C \uC624\uB298 \uC628 \uD2B8\uB7ED\uC744 \uD55C\uB208\uC5D0 \uD655\uC778\uD574\uC694."}</p>
          </div>
        </article>
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDCF8"}</span>
          <div>
            <strong>{"\uC2E4\uC2DC\uAC04 \uC81C\uBCF4\uB85C \uC624\uB298 \uC0C1\uD0DC \uD655\uC778"}</strong>
            <p>{"\uC601\uC5C5\uC911, \uC544\uC9C1 \uC548 \uC634, \uC601\uC5C5\uC885\uB8CC \uC81C\uBCF4\uB97C \uBC14\uB85C \uBC18\uC601\uD574\uC694."}</p>
          </div>
        </article>
        <article className="hero-feature-card">
          <span className="hero-emoji">{"\uD83D\uDE9A"}</span>
          <div>
            <strong>{"\uC0C8 \uD2B8\uB7ED\uB3C4 \uC694\uCCAD\uC73C\uB85C \uCD94\uAC00"}</strong>
            <p>{"\uBA54\uB274\uD310\uACFC \uBA85\uD568 \uC815\uBCF4\uB97C \uBAA8\uC544 \uB354 \uC815\uD655\uD55C \uB3D9\uB124 DB\uB97C \uB9CC\uB4E4\uC5B4\uC694."}</p>
          </div>
        </article>
      </div>

      <Button color="primary" variant="fill" size="xlarge" display="full" onClick={onStart}>
        {"\uC6B0\uB9AC \uB3D9\uB124 \uC21C\uB300 \uD2B8\uB7ED \uBCF4\uB7EC \uAC00\uAE30"}
      </Button>
    </section>
  );
}
