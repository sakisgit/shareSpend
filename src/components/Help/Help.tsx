
import Header from "../homepage/Header/Header";
import Footer from "../homepage/Footer/Footer";

const HelpPage = () => {
  return (
    <> 
    <Header/>
    <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold text-center mb-4">Help & Instructions</h1>
        <p className="text-lg text-gray-700">
          Welcome to <strong>ShareSpend</strong>! Here’s a guide to help you navigate and use the app efficiently.
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Navigation</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Home:</strong> Overview of the app features.</li>
            <li><strong>Log In / Log Out:</strong> Access your account securely.</li>
            <li><strong>Main Page:</strong> Add and track your expenses.</li>
            <li><strong>Stats Page:</strong> View charts and summaries of your spending.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Adding an Expense</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to the Main Page.</li>
            <li>Click <strong>"Add Expense"</strong>.</li>
            <li>Fill in the details (amount, category, description).</li>
            <li>Click <strong>"Submit"</strong> to save your expense.</li>
          </ol>
        </section>

        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">Contact Support</h2>
          <p className="text-gray-700">
            If you encounter any issues, please contact us at{" "}
            <a
              href="mailto:support@sharespend.com"
              className="text-blue-600 underline"
            >
              support@sharespend.com
            </a>.
          </p>
        </section>
      </div>
    <Footer/>
    </>

  );
};

export default HelpPage;
