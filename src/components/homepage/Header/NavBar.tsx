
import { useState } from "react";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = ["HomePage", "ShareSpend", "Stats", "Contact"];

  return (
    <nav className="relative w-full md:w-auto">
      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-6 text-lg font-medium text-white justify-end">
        {navItems.map((item) => (
          <li
            key={item}
            className="relative cursor-pointer
                       before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5
                       before:bg-yellow-500 before:transition-all before:duration-300
                       hover:before:w-full"
          >
            {item}
          </li>
        ))}
      </ul>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Items */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-blue-600 flex flex-col py-2">
          {navItems.map((item) => (
            <li
              key={item}
              className="w-full text-center py-3 cursor-pointer relative
                         before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5
                         before:bg-yellow-500 before:transition-all before:duration-300
                         active:before:w-full"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
