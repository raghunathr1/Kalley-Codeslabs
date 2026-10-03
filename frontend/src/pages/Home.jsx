import { useState } from "react";

import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import ConsultationForm from "../components/ConsultationForm";
import Footer from "../components/Footer";

function Home() {
  const [showConsultation, setShowConsultation] = useState(false);

  const services = [
    {
      icon: "zap",
      title: "Lightning Fast Development",
      description:
        "We create fast, responsive and scalable digital products using modern technologies, clean architecture and efficient development practices.",
    },
    {
      icon: "analytics",
      title: "AI-Powered Analytics",
      description:
        "Turn your business data into meaningful insights with intelligent analytics solutions that help you understand trends and make better decisions.",
    },
    {
      icon: "ai",
      title: "High Performance",
      description:
        "Our applications are designed for speed, reliability and smooth performance across devices, helping your business deliver a better user experience.",
    },
    {
      icon: "web",
      title: "Web Development",
      description:
        "From business websites to complex web applications, we build modern, responsive and user-friendly web experiences tailored to your requirements.",
    },
    {
      icon: "software",
      title: "Custom Software Solutions",
      description:
        "We develop customized software solutions that solve specific business problems and streamline your everyday operations.",
    },
    {
      icon: "consulting",
      title: "IT Consulting & AI Integration",
      description:
        "Get expert guidance on technology, automation and AI integration to improve your processes and build smarter digital solutions.",
    },
  ];

  return (
    <div className="home-page">
      {/* ================= NAVBAR ================= */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            🚀 Building Digital Experiences
          </div>

          <h1>
            AI Solutions.
            <br />

            <span>Web Solutions.</span>
            <br />

            Built for Growth.
          </h1>

          <p>
            We build powerful websites, custom software and
            AI-powered digital solutions that help businesses
            transform ideas into scalable and high-performance
            products.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => setShowConsultation(true)}
            >
              Get Started
            </button>

            <button
              className="secondary-btn"
              onClick={() => setShowConsultation(true)}
            >
              Give a Task
            </button>
          </div>

          <div className="hero-trust">
            <span>✓ Custom Solutions</span>
            <span>✓ Fast Development</span>
            <span>✓ Modern Technology</span>
          </div>
        </div>
      </main>

      {/* ================= SERVICES SECTION ================= */}
      <section className="services-section">
        <div className="section-heading">
          <span className="section-label">
            WHAT WE OFFER
          </span>

          <h2>
            Technology that helps
            <span> your business grow.</span>
          </h2>

          <p>
            From websites and custom software to AI-powered
            solutions, we combine modern technology with
            practical business thinking to build digital
            products that make an impact.
          </p>
        </div>

        {/* Service Cards */}
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </section>

      {/* ================= CONSULTATION MODAL ================= */}
      {showConsultation && (
        <ConsultationForm
          onClose={() => setShowConsultation(false)}
        />
      )}

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  );
}

export default Home;