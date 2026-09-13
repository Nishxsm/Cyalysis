import "../../styles/landing/SecurityProblem.css";

function SecurityProblem() {
  return (
    <section className="security-problem">
      {/* LEFT */}
      <div className="problem-content">
        <div className="problem-eyebrow">
          THE_PROBLEM
        </div>

        <h2>
          Your security surface
          <br />
          is larger than
          <br />
          you think.
        </h2>

        <p className="problem-description">
          Every website exposes information through its
          infrastructure, configuration, technologies, and
          application behavior. CYALYSIS brings these
          signals together to identify potential weaknesses.
        </p>

        <div className="problem-points">
          <div className="problem-point">
            <div className="point-icon point-icon-red">
              !
            </div>

            <div>
              <h3>Misconfigured security controls</h3>
              <p>
                Missing headers, weak TLS configuration,
                unsafe cookies, and permissive policies.
              </p>
            </div>
          </div>

          <div className="problem-point">
            <div className="point-icon point-icon-yellow">
              ◉
            </div>

            <div>
              <h3>Exposed information</h3>
              <p>
                Server details, technologies, versions,
                verbose errors, and other metadata.
              </p>
            </div>
          </div>

          <div className="problem-point">
            <div className="point-icon point-icon-green">
              ✓
            </div>

            <div>
              <h3>CYALYSIS finds what stands out</h3>
              <p>
                57 non-destructive security checks across
                your website's exposed surface.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="security-dashboard">
        <div className="dashboard-header">
          <span>DASHBOARD</span>

          <div className="dashboard-dots">
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="dashboard-body">

          {/* SCORE */}
          <div className="dashboard-alert">
            <div className="score">
              <strong>72</strong>
              <span>MEDIUM RISK</span>
            </div>

            <div className="alert-copy">
              <strong>
                Security weaknesses detected.
              </strong>

              <p>
                We found 57 checks across your target,
                including 8 potential issues requiring
                attention.
              </p>
            </div>
          </div>

          {/* STATS */}
          <div className="dashboard-stats">
            <div>
              <strong>57</strong>
              <span>Checks</span>
            </div>

            <div>
              <strong className="stat-red">8</strong>
              <span>Findings</span>
            </div>

            <div>
              <strong className="stat-green">42</strong>
              <span>Passed</span>
            </div>

            <div>
              <strong>7</strong>
              <span>Review</span>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="dashboard-section">
            <div className="dashboard-label">
              ANALYSIS CATEGORIES
            </div>

            <div className="category-list">
              <span>DNS</span>
              <span>HTTP</span>
              <span>TLS</span>
              <span>Headers</span>
              <span>Cookies</span>
              <span>CORS</span>
              <span>Technology</span>
            </div>
          </div>

          {/* FINDINGS */}
          <div className="dashboard-section">
            <div className="dashboard-label">
              RECENT FINDINGS
            </div>

            <div className="finding">
              <div className="finding-icon">
                !
              </div>

              <div className="finding-copy">
                <strong>
                  Content-Security-Policy
                </strong>

                <span>
                  Missing security header
                </span>
              </div>

              <span className="severity medium">
                MEDIUM
              </span>
            </div>

            <div className="finding">
              <div className="finding-icon">
                !
              </div>

              <div className="finding-copy">
                <strong>
                  Server Information Disclosure
                </strong>

                <span>
                  Server version exposed
                </span>
              </div>

              <span className="severity low">
                LOW
              </span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default SecurityProblem;