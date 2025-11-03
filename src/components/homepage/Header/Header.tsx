
import NavBar from "./NavBar";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 bg-blue-600 text-white">
      {/* Logo + Brand */}
      <Link 
        className="flex items-center gap-7 mb-4 md:mb-0"
        to='/'
      >
        <img 
          src="/assets/sharespendLogo.png" 
          alt="Share Spend Logo" 
          className="h-16 w-16 rounded-full"
        />
        <h2 className="text-5xl">
          <span className="text-yellow-500 align-middle">$</span>hare Sp
          <span className="text-yellow-500 align-middle">€</span>nd
        </h2>
      </Link>

      {/* Navigation */}
      <NavBar />
    </header>
  )
}

export default Header;
