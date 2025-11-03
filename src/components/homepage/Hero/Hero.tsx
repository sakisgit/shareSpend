
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-gray-200 p-4 sm:p-6 md:p-12 m-4 sm:m-6 md:m-12 rounded-lg shadow-lg relative flex flex-col md:flex-row items-center">
      <div className="flex-1">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Share your expenses easily, smartly, and fairly.
        </h1>
        <h2 className="text-base sm:text-lg md:text-xl mb-2">
          The <span className="text-yellow-500 align-middle">$</span>hare Sp
          <span className="text-blue-500 align-middle">€</span>nd helps you organize your expenses with friends, family, colleagues, or anyone you want to share with.
        </h2>
        <h2 className="text-base sm:text-lg md:text-xl mb-6">
            It's absolutely <span className="text-green-500">FREE 🎉</span>
        </h2>

        <Link 
          className="bg-yellow-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-2.5 rounded hover:bg-yellow-600 transition"
          to='/ShareSpend'
        >
          Start Now
        </Link>
      </div>

      {/* Image */}
      <div className="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
        <img 
          src="/assets/hands.png"
          alt="ShareSpendHands"
          className="h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full"
        />
      </div>
    </div>
  )
}

export default Hero;
