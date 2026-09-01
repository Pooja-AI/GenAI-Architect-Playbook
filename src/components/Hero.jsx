function Hero() {
  return (
    <section className="hero">

      {/* Background Effects */}
      <div className="hero-bg">
        <div className="glow glow1"></div>
        <div className="glow glow2"></div>
        <div className="grid"></div>
      </div>

      <div className="hero-content">

        <span className="badge">
          AI/ML • Generative AI • Agentic AI • RAG • LLMOps • MLOps
        </span>

        <h1>IntelliCatalyst AI Labs</h1>

        <h2>
          Engineering the Future of Intelligent Systems
        </h2>

        <p>
          IntelliCatalyst AI Labs is a premier AI innovation platform
          dedicated to building, exploring, and showcasing cutting-edge
          solutions in Artificial Intelligence, Machine Learning,
          Generative AI, Agentic AI, Multi-Agent Systems, and
          Enterprise AI Architecture.
        </p>

        <p>
          Discover real-world projects, scalable AI architectures,
          production-ready implementations, and modern engineering
          practices that transform innovative ideas into intelligent
          business solutions.
        </p>

        <div className="hero-buttons">

          <button className="primary-btn">
            Explore Projects
          </button>

          <button className="secondary-btn">
            Learn More
          </button>

        </div>

      </div>

    </section>
  );
}

export default Hero;