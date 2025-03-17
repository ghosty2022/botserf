import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [logo, setLogo] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, "settings", "site");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLogo(docSnap.data().logo);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const changeLanguage = (e) => {
    const newLanguage = e.target.value;
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('i18nextLng', newLanguage); // Save the selected language
    setIsOpen(false);
  };

  return (
    <header className="header">
      <nav className="navbar">
        {/* Logo Section */}
        <Link to="/" className="logo">
          {logo ? (
            <img src={logo} alt="Botserf Logo" />
          ) : (
            <h2>Botserf PTY LTD</h2>
          )}
        </Link>

        {/* Mobile Menu Button */}
        <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation Links */}
        <ul className={`nav-list ${isOpen ? "open" : ""}`}>
          {["home", "about", "services", "projects", "news", "contact"].map(
            (item) => (
              <li key={item}>
                <Link
                  to={item === "home" ? "/" : `/${item}`} // Adjusted for home routing
                  onClick={() => setIsOpen(false)}
                >
                  {t(item)}
                </Link>
              </li>
            )
          )}

          {/* Admin Link */}
          <li>
            <Link
              to="/admin/login"
              className="admin-link"
              onClick={() => setIsOpen(false)}
            >
              {t("admin")}
            </Link>
          </li>

          {/* Language Switcher */}
          <li>
            <select
              className="lang-select"
              onChange={changeLanguage}
              value={i18n.language}
            >
              <option value="en">English</option>
              <option value="sw">Swahili</option>
            </select>
          </li>
        </ul>
      </nav>

      {/* Responsive Styling */}
      <style>
        {`
          .header {
            position: sticky;
            top: 0;
            width: 100%;
            background: #0d253f;
            padding: 1rem 2rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
          }

          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
          }

          .logo img {
            max-height: 60px;
            transition: transform 0.3s ease-in-out;
          }

          .logo img:hover {
            transform: scale(1.05);
          }

          .nav-list {
            list-style: none;
            display: flex;
            gap: 2rem;
            margin: 0;
            padding: 0;
            align-items: center;
          }

          .nav-list li a {
            color: white;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: background 0.3s ease-in-out;
          }

          .nav-list li a:hover {
            background: rgba(255, 215, 0, 0.2);
          }

          .admin-link {
            color: white;
            font-weight: bold;
            background: #FFD700;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            transition: background 0.3s ease-in-out;
          }

          .admin-link:hover {
            background: #FFCC00;
          }

          .lang-select {
            background: #1a4d7d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
          }

          .lang-select:hover {
            background: #0d253f;
          }

          .menu-btn {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            display: none;
          }

          /* Mobile Styling */
          @media (max-width: 768px) {
            .menu-btn {
              display: block;
            }

            .nav-list {
              display: none;
              flex-direction: column;
              position: absolute;
              top: 100%;
              left: 0;
              right: 0;
              background: #0d253f;
              padding: 2rem;
              gap: 1rem;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
              transition: all 0.3s ease-in-out;
            }

            .nav-list.open {
              display: flex;
            }

            .nav-list li {
              text-align: center;
              width: 100%;
            }

            .nav-list li a {
              display: block;
              width: 100%;
            }

            .lang-select {
              width: 100%;
              text-align: center;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;