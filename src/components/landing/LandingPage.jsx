// src/components/landing/LandingPage.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../custom.css"; // keep your styles
import {
  Calendar,
  Trophy,
  BookOpen,
  Users,
  Zap,
  ChevronRight,
  Star,
  Rocket,
} from "lucide-react";
import AuthModal from "./AuthModal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import FeatureCard from "./FeatureCard";
import StatsGrid from "./StatsGrid";

const features = [
  {
    icon: Calendar,
    title: "Daily Challenges",
    description:
      "Real-world problems that test creativity and practical skills, not just textbook knowledge",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "Tech Stories",
    description:
      "Learn from tech history and explore future innovations with curated content",
    color: "purple",
  },
  {
    icon: Trophy,
    title: "College Leaderboards",
    description:
      "Compete with peers, showcase your skills, and build your academic reputation",
    color: "warning",
  },
  {
    icon: Users,
    title: "Professional Network",
    description:
      "Connect with students, professors, and industry mentors in your field",
    color: "success",
  },
];

const stats = [
  { number: "10K+", label: "Active Students", icon: Users },
  { number: "500+", label: "Daily Challenges", icon: Calendar },
  { number: "100+", label: "Partner Colleges", icon: Trophy },
  { number: "95%", label: "Career Success", icon: Star },
];

const getFeatureClass = (color) => {
  const styles = {
    primary: "bg-primary text-white",
    purple: "bg-purple text-white",
    warning: "bg-warning text-dark",
    success: "bg-success text-white",
  };
  return styles[color] || styles.primary;
};

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // or 'register'

  return (
    <div className="bg-dark text-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <Zap className="me-2 floating-animation" /> Teckspark Daily
          </a>
          <div>
            <button
              className="btn btn-outline-light me-2"
              onClick={() => {
                setAuthMode("login");
                setShowAuth(true);
              }}
            >
              Login
            </button>
            <button
              className="btn btn-gradient"
              onClick={() => {
                setAuthMode("register");
                setShowAuth(true);
              }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero-section text-center py-5 container">
          <div className="hero-animation">
            <div className="hero-badge">
              <Star size={16} /> Join 10,000+ Tech Enthusiasts
            </div>
            <h1 className="display-4 fw-bold mb-4">
              Build Your <span className="text-gradient">Tech Future</span>
              <br />
              One Challenge at a Time
            </h1>
            <p
              className="lead mb-5 text-light-50"
              style={{ maxWidth: 800, margin: "0 auto" }}
            >
              Join thousands of students solving real-world problems, reading
              tech stories, and competing on college leaderboards. Transform
              your learning into career success.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <button
                className="btn btn-gradient btn-lg d-flex align-items-center px-4"
                onClick={() => {
                  setAuthMode("register");
                  setShowAuth(true);
                }}
              >
                Start Your Journey{" "}
                <Rocket className="ms-2 floating-animation" />
              </button>
              <button className="btn btn-outline-light btn-lg d-flex align-items-center px-4">
                Watch Demo <ChevronRight className="ms-2" />
              </button>
            </div>
          </div>
        </section>

        <section className="container py-5">
          <StatsGrid stats={stats} />
        </section>

        <section className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">
              Why Choose Teckspark Daily?
            </h2>
            <p
              className="lead text-light-50"
              style={{ maxWidth: 600, margin: "0 auto" }}
            >
              Experience learning that prepares you for real-world success
            </p>
          </div>

          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-3">
                <FeatureCard
                  Icon={f.icon}
                  title={f.title}
                  description={f.description}
                  styleClass={getFeatureClass(f.color)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient py-5">
          <div className="container text-center py-4">
            <h2 className="display-6 fw-bold mb-4">
              Ready to Transform Your Tech Journey?
            </h2>
            <p
              className="lead mb-4"
              style={{ maxWidth: 700, margin: "0 auto" }}
            >
              Join thousands of students who are already building their careers
              through daily challenges and tech stories.
            </p>
            <button
              className="btn btn-light btn-lg d-inline-flex align-items-center px-4"
              onClick={() => {
                setAuthMode("register");
                setShowAuth(true);
              }}
            >
              Join Teckspark Daily <Star className="ms-2 floating-animation" />
            </button>
          </div>
        </section>
      </main>

      <footer className="bg-dark text-muted py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <div className="d-flex align-items-center">
                <Zap className="me-2 floating-animation" />
                <span className="fw-bold">Teckspark Daily</span>
              </div>
            </div>
            <div className="col-md-6 text-md-end">
              <small className="text-light-50">
                © {new Date().getFullYear()} Teckspark Daily. Empowering the
                next generation of tech leaders.
              </small>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        show={showAuth}
        onClose={() => setShowAuth(false)}
        title={authMode === "login" ? "Welcome Back" : "Join Teckspark"}
      >
        {authMode === "login" ? <LoginForm /> : <RegisterForm />}
      </AuthModal>
    </div>
  );
};

export default LandingPage;
