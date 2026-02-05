import { Link } from "react-router-dom";
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">SQL Studio</h1>
          <p className="hero-description">
            Master SQL with hands-on practice. Execute queries against real databases, 
            get intelligent hints, and track your progress through interactive assignments.
          </p>
          <Link 
            to="/assignments" 
            className="cta-button"
          >
            Start Practicing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;