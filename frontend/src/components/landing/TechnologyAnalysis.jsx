import "../../styles/landing/TechnologyAnalysis.css";

const technologies = [
  ["JavaScript", "JS"],
  ["Python", "PY"],
  ["PHP", "PHP"],
  ["React", "RE"],
  ["Node.js", "ND"],
  ["Java", "JV"],
  ["Go", "GO"],
  ["Ruby", "RB"],
  ["TypeScript", "TS"],
  ["Laravel", "LV"],
  ["Django", "DJ"],
  ["Next.js", "NX"],
  ["Vue.js", "VU"],
  ["Angular", "NG"],
  ["WordPress", "WP"],
];

function TechnologyCard({ name, short }) {
  return (
    <div className="technology-card">
      <div className="technology-icon">
        {short}
      </div>

      <div className="technology-info">
        <strong>{name}</strong>
        <span>Detected technology</span>
      </div>
    </div>
  );
}

function TechnologyColumn({ items, className }) {
  // duplicatin the list so the marque can loop seamlessly
  const duplicatedItems = [...items, ...items];

  return (
    <div className={`technology-column ${className}`}>
      <div className="technology-track">
        {duplicatedItems.map(([name, short], index) => (
          <TechnologyCard
            key={`${name}-${index}`}
            name={name}
            short={short}
          />
        ))}
      </div>
    </div>
  );
}

export default function TechnologyAnalysis() {
  return (
    <section className="technology-analysis">



      <div className="technology-showcase">
        <div className="technology-columns">

          <TechnologyColumn
            className="column-one"
            items={[
              technologies[0],
              technologies[1],
              technologies[2],
              technologies[3],
              technologies[4],
            ]}
          />

          <TechnologyColumn
            className="column-two"
            items={[
              technologies[5],
              technologies[6],
              technologies[7],
              technologies[8],
              technologies[9],
            ]}
          />

          <TechnologyColumn
            className="column-three"
            items={[
              technologies[10],
              technologies[11],
              technologies[12],
              technologies[13],
              technologies[14],
            ]}
          />

        </div>
      </div>




      <div className="technology-content">

        <div className="technology-eyebrow">
          TECHNOLOGY_DETECTION
        </div>

        <h2>
          Know what
          <br />
          powers the
          <br />
          website.
        </h2>

        <p>
          CYALYSIS analyzes the technologies exposed by a
          website and identifies the frameworks, libraries,
          languages, servers, and platforms behind it.
        </p>

        <div className="technology-features">

          <div className="technology-feature">
            <span>01</span>

            <div>
              <strong>Identify technologies</strong>

              <p>
                Detect frameworks, libraries, CMS platforms,
                web servers, and other technologies.
              </p>
            </div>
          </div>

          <div className="technology-feature">
            <span>02</span>

            <div>
              <strong>Map the technology stack</strong>

              <p>
                Build a clearer picture of the technologies
                exposed across the target.
              </p>
            </div>
          </div>

          <div className="technology-feature">
            <span>03</span>

            <div>
              <strong>Find exposed versions</strong>

              <p>
                Identify version information when it is
                publicly disclosed by the target.
              </p>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}

