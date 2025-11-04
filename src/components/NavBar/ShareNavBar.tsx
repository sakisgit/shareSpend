

import { Link } from "react-router-dom";
import { useState } from "react";

const navItems = [
  { name: "HomePage", path: "/" },
  { name: "Stats", path: "/stats" },
  { name: "Contact", path: "/contact" },
  // { name: "Login", path: "/Login" },
];

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative w-full md:w-auto">
      {/* Desktop Menu */}
      <div className="hidden md:flex justify-end">
        <ul className="flex items-center gap-6 text-lg font-medium text-white">
          {navItems.map((item) => (
            <li
              key={item.name}
              className="relative cursor-pointer
                         before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5
                         before:bg-yellow-500 before:transition-all before:duration-300
                         hover:before:w-full"
            >
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? "×" : "≡"}
        </button>
      </div>

      {/* Mobile Dropdown Menu (Modern) */}
      {isOpen && (
        <div className="md:hidden absolute top-full right-4 mt-2 w-48 z-50">
          <ul className="bg-white rounded-lg shadow-lg overflow-hidden">
            {navItems.map((item, index) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-yellow-500 transition-colors duration-200 ${
                    index < navItems.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
