
import Footer from "../homepage/Footer/Footer";
import Header from "../homepage/Header/Header";

const ContactPage: React.FC = () => {
  return (
    <>
        <Header/>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
            Contact Us
            </h1>
            <p className="text-gray-600 text-center mb-10">
            Have a question or feedback? We'd love to hear from you.
            </p>

            <form className="space-y-6">
            <div>
                <label className="block text-gray-700 font-semibold mb-2">
                Full Name
                </label>
                <input
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-2">
                Email Address
                </label>
                <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-semibold mb-2">
                Message
                </label>
                <textarea
                rows={5}
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
            </div>

            <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
            >
                Send Message
            </button>
            </form>

            <div className="text-center text-sm text-gray-500 mt-10">
            <p>or reach us at <a href="mailto:support@sharespend.com" className="text-blue-600 hover:underline">support@sharespend.com</a></p>
            </div>
        </div>
        </div>
        <Footer/>
    </>
  );
};

export default ContactPage;
