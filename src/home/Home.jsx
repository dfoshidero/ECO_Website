import React, { useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaRandom, FaSyncAlt } from "react-icons/fa";
import emailjs from "emailjs-com";
import EcoAnimatedText from "../components/AnimatedText/EcoAnimatedText";
import { Button, Card, Input, Textarea } from "../components/ui";
import { homeExamples, insightExampleInputs } from "../data/examples";
import { paperUrl } from "../data/docs";
import { partners } from "../data/partners";
import { useTheme } from "../context/ThemeContext";
import "./HomePage.scss";

const steps = [
  {
    title: "Describe",
    body: "Enter a natural-language description of your early-stage building concept.",
  },
  {
    title: "Extract",
    body: "ECO uses NLP to pull materials, structure, and dimensions from your text.",
  },
  {
    title: "Predict",
    body: "A gradient-boosting model returns embodied carbon in kgCO₂e/m².",
  },
];

const stats = [
  { value: "150K", label: "Synthetic buildings" },
  { value: "95%", label: "Regression accuracy" },
  { value: "30+", label: "Material classes" },
];

const getRandomExamples = (arr, num) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, num);
};

const animatedExamples = homeExamples.map((e) => e.text);

const HomePage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const logoSrc = `${process.env.PUBLIC_URL}/assets/images/${
    theme === "dark" ? "logo-white.png" : "logo-dark.png"
  }`;
  const [heroInput, setHeroInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [heroExamples, setHeroExamples] = useState(() =>
    getRandomExamples(insightExampleInputs, 3)
  );
  const chipsRef = useRef(null);
  const rowFitAttemptsRef = useRef(0);
  const MAX_ROW_FIT_ATTEMPTS = 20;

  useLayoutEffect(() => {
    const container = chipsRef.current;
    if (!container) return;
    const chips = Array.from(
      container.querySelectorAll(".home-hero__chip")
    );
    if (chips.length === 0) return;

    const rowTops = new Set(chips.map((c) => c.offsetTop));
    if (rowTops.size > 2 && rowFitAttemptsRef.current < MAX_ROW_FIT_ATTEMPTS) {
      rowFitAttemptsRef.current += 1;
      setHeroExamples(getRandomExamples(insightExampleInputs, 3));
    } else {
      rowFitAttemptsRef.current = 0;
    }
  }, [heroExamples]);

  const shuffleHeroExamples = () => {
    rowFitAttemptsRef.current = 0;
    setHeroExamples((current) => {
      let next = getRandomExamples(insightExampleInputs, 3);
      if (
        next.length === current.length &&
        next.every((s, i) => s === current[i])
      ) {
        next = getRandomExamples(insightExampleInputs, 3);
      }
      return next;
    });
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const goToInsight = (text) => {
    const trimmed = String(text).trim();
    if (trimmed) {
      navigate("/quickview", {
        state: { description: trimmed, autoRun: true },
      });
    } else {
      navigate("/quickview");
    }
  };

  const handleHeroKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      goToInsight(heroInput);
    }
  };

  const pickRandomExample = () => {
    const pool = insightExampleInputs.filter((s) => s !== heroInput);
    const next = pool[Math.floor(Math.random() * pool.length)];
    setHeroInput(next);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_USER_ID
      )
      .then(() => {
        setEmailSent(true);
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setError("Failed to send message. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="home">
      <section className="home-hero">
        <img src={logoSrc} alt="ECO" className="home-hero__logo" />
        <p className="home-hero__eyebrow">Early-stage Carbon Observer</p>
        <h1 className="home-hero__title">
          Predict embodied carbon,
          <br />
          <span className="home-hero__accent">from a sentence.</span>
        </h1>
        <p className="home-hero__subtitle">
          Machine learning for architects — translate design descriptions into
          realistic carbon grounding at concept stage.
        </p>

        <div className="home-hero__input-wrap">
          {!heroInput && !isFocused && (
            <EcoAnimatedText examples={animatedExamples} />
          )}
          <textarea
            className="home-hero__textarea"
            value={heroInput}
            onChange={(e) => setHeroInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleHeroKeyDown}
            placeholder=""
            rows={3}
            aria-label="Building description"
          />
          <button
            type="button"
            className="home-hero__submit"
            onClick={() => goToInsight(heroInput)}
            aria-label="Try ECO"
          >
            Try ECO <FaArrowRight />
          </button>
        </div>

        <div className="home-hero__examples">
          <div className="home-hero__chips" ref={chipsRef}>
            {heroExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                className="home-hero__chip"
                onClick={() => setHeroInput(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="home-hero__shuffle"
            onClick={shuffleHeroExamples}
            aria-label="Shuffle examples"
            title="Shuffle examples"
          >
            <FaSyncAlt />
          </button>
        </div>

        <button
          type="button"
          className="home-hero__random"
          onClick={pickRandomExample}
        >
          <FaRandom /> Try an example
        </button>

        <p className="home-hero__secondary">
          <Link to="/support">Read the project documentation</Link>
        </p>
      </section>

      <section className="home-stats">
        {stats.map(({ value, label }) => (
          <Card key={label} padding="sm" className="home-stats__card">
            <span className="home-stats__value">{value}</span>
            <span className="home-stats__label">{label}</span>
          </Card>
        ))}
      </section>

      <section className="home-steps">
        <h2 className="home-section-title">How it works</h2>
        <div className="home-steps__grid">
          {steps.map(({ title, body }, i) => (
            <Card key={title} padding="sm" className="home-steps__card">
              <span className="home-steps__num">{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="home-partners">
        <h2 className="home-section-title">Backed by</h2>
        <ul className="home-partners__list">
          {partners.map(({ name, href, logoLight, logoDark, invertInDarkMode }) => (
            <li key={name} className="home-partners__item">
              <a href={href} target="_blank" rel="noreferrer" aria-label={name}>
                <img
                  className="home-partners__logo home-partners__logo--light"
                  src={logoLight}
                  alt={name}
                  loading="lazy"
                />
                <img
                  className={`home-partners__logo home-partners__logo--dark${
                    invertInDarkMode ? " home-partners__logo--invert" : ""
                  }`}
                  src={logoDark}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-about">
        <div className="home-about__text">
          <h2 className="home-section-title">About ECO</h2>
          <p>
            ECO turns a one-line building description into an embodied carbon
            estimate — so designers can compare concepts at the moment ideas
            form, not weeks later.
          </p>
          <p className="home-about__links">
            <Link to="/support">Read the v1 documentation</Link>
            {" · "}
            <a href={paperUrl} target="_blank" rel="noreferrer">
              Read the paper
            </a>
          </p>
        </div>
        <Card padding="md" className="home-about__form-card">
          <h2 className="home-section-title">Collaborate</h2>
          {emailSent ? (
            <p className="home-about__success">
              Thanks — your message was sent successfully.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="home-about__form">
              <Input
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@studio.com"
              />
              <Textarea
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about your project or feedback…"
              />
              {error && <p className="home-about__error">{error}</p>}
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Sending…" : "Send message"}
              </Button>
            </form>
          )}
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
