import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SettingsModal from "./SettingsModal";
import Logo from "../img/archivelogo.png";
import SearchModal from "./SearchModal";
import { API_BASE } from "../config";

const Header = ({ onSearch }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (query) => {
    if (!query) {
      setShowResults(false);
      setSearchResults([]);
      return;
    }
    const res = await fetch(
      `${API_BASE}/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    setSearchResults(data);
    setShowResults(true);
  };

  useEffect(() => {
    const updateUser = () => setUser(JSON.parse(localStorage.getItem("user")));
    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between relative">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src={Logo} alt="Logo" className="h-8" />
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-lg mx-4">
        <SearchBar onSearch={handleSearch} />
        <SearchModal
          results={searchResults}
          show={showResults}
          onClose={() => setShowResults(false)}
        />
      </div>
      {/* Auth / Settings Button */}
      <div>
        {!user ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        ) : (
          <>
            <button
              onClick={() => setModalOpen(true)}
              className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0a1.505 1.505 0 002.021.87c.89-.364 1.86.425 1.496 1.315a1.505 1.505 0 00.87 2.021c.921.3.921 1.603 0 1.902a1.505 1.505 0 00-.87 2.021c.364.89-.425 1.86-1.315 1.496a1.505 1.505 0 00-2.021.87c-.3.921-1.603.921-1.902 0a1.505 1.505 0 00-2.021-.87c-.89.364-1.86-.425-1.496-1.315a1.505 1.505 0 00-.87-2.021c-.921-.3-.921-1.603 0-1.902a1.505 1.505 0 00.87-2.021c-.364-.89.425-1.86 1.315-1.496a1.505 1.505 0 002.021-.87z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <SettingsModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onLogout={handleLogout}
            />
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
