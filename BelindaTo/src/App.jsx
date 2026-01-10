import React, { useState, useEffect, useRef } from "react";
import "./app.css";

export default function DesignerLandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [reveal, setReveal] = useState(0);
  const slideStageRef = useRef(null);

  // CARD ORDER
  const [cards, setCards] = useState([
    { id: "a", className: "card-a" },
    { id: "b", className: "card-b" },
    { id: "c", className: "card-c" },
    { id: "d", className: "card-d" },
  ]);

  // LOAD ANIMATION FLAG
  const [loaded, setLoaded] = useState(false);

  const SPEED = 0.010;

  /* HERO PARALLAX */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

   /* SET PAGE TITLE */
   useEffect(() => {
    document.title = "Belinda To - Portfolio";
  }, []);

  /* LOAD ANIMATIONS */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  /* SLIDE SCROLL CONTROL (FIXED) */
  useEffect(() => {
    const onWheel = (e) => {
      if (!slideStageRef.current) return;

      const rect = slideStageRef.current.getBoundingClientRect();
      const inZone = rect.top <= 0 && rect.bottom >= window.innerHeight;
      if (!inZone) return;

      const dir = Math.sign(e.deltaY);

      // ✅ ALLOW NORMAL SCROLL BACK TO HERO
      if (dir < 0 && reveal === 0) return;

      // CONTROL SLIDES ONLY
      e.preventDefault();

      setReveal((r) =>
        dir > 0
          ? Math.min(r + SPEED, 2)
          : Math.max(r - SPEED, 0)
      );
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [reveal]);

  /* CARD CLICK → SEND TOP CARD TO BACK */
  const handleCardClick = (e) => {
    e.stopPropagation();
    console.log("TOP CARD CLICKED!");
    setCards((prev) => {
      const topCard = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [topCard, ...rest];
    });
  };

  return (
    <>
      {/* NAV */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">BEL</div>
          <div className={`nav-links ${loaded ? "nav-loaded" : ""}`}>
            <button className="nav-link">HOME</button>
            <button className="nav-link">PROJECTS</button>
            <button className="nav-link">ABOUT ME</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="container">
          {/* CREDIT */}
          <div className="credit">
            <p className="typewriter">
              <span className="line line-1">
                HEY👋, SINCE YOU'RE HERE,
                <span className="cursor" />
              </span>
              <br />
              <span className="line line-2">
                TAKE A LOOK AROUND!
                <span className="cursor" />
              </span>
            </p>
          </div>

          {/* HERO TEXT - MOVED BEFORE CARDS */}
          <div className="hero-text">
            <h1>
              <div className="word">
                {"DIGITAL".split("").map((c, i) => (
                  <span
                    key={i}
                    className="letter"
                    data-char={c}
                    style={{ animationDelay: `${i * 0.09}s` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="word">
                {"DESIGNER".split("").map((c, i) => (
                  <span
                    key={i}
                    className="letter"
                    data-char={c}
                    style={{ animationDelay: `${(i + 7) * 0.09}s` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </h1>
          </div>

          {/* CARD STACK - MOVED AFTER TEXT */}
          <div className={`card-stack ${loaded ? "loaded" : ""}`}>
            {cards.map((card, index) => {
              const isTopCard = index === cards.length - 1;
              return (
                <div
                  key={card.id}
                  className={`stack-card ${card.className}`}
                  style={{ 
                    zIndex: index + 10,
                    pointerEvents: isTopCard ? 'auto' : 'none',
                    cursor: isTopCard ? 'pointer' : 'default'
                  }}
                  onClick={isTopCard ? handleCardClick : undefined}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* SLIDES */}
      <section className="slide-stage" ref={slideStageRef}>
        <div className="slide-pin">
          {/* SLIDE 1 */}
          <section className="stack-slide slide-about-intro">
            <div className="about-intro-layout">
              <p className="about-intro-label">01 — WHO I AM</p>
              <p className="about-intro-text">
                I'M BELINDA TO, A DIGITAL DESIGNER AND DEVELOPER.
                <br />
                I BRIDGE <span className="highlight">IDEAS</span> AND{" "}
                <span className="highlight">DESIGN</span> TO BRING
                <br />
                DIGITAL EXPERIENCES TO LIFE.
              </p>
            </div>
          </section>

          {/* SLIDE 2 */}
          <section
            className="stack-slide slide-about"
            style={{
              transform: `translateY(${100 - Math.min(reveal, 1) * 100}%)`,
            }}
          >
            <div className="projects-container">
              <div className="projects-header">
                <h2 className="projects-label">02 — FEATURED PROJECTS</h2>
                <button className="view-more-btn">VIEW MORE</button>
              </div>
              
              <div className="projects-grid">
                <div className="project-card">
                  <div className="project-image"></div>
                  <h3 className="project-title">SCAFFOLD</h3>
                </div>
                <div className="project-card">
                  <div className="project-image"></div>
                  <h3 className="project-title">PICKI</h3>
                </div>
                <div className="project-card">
                  <div className="project-image"></div>
                  <h3 className="project-title">DRESS-UP DARLING</h3>
                </div>
              </div>
            </div>
          </section>

          {/* SLIDE 3 */}
          <section
            className="stack-slide slide-third"
            style={{
              transform: `translateY(${100 - Math.max(reveal - 1, 0) * 100}%)`,
            }}
          >
            <h2>CONTACT</h2>
          </section>
        </div>
      </section>
    </>
  );
}