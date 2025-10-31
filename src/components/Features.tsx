
const Features = () => {
  const features = [
    {
      icon: "💰",
      title: "Expense Tracking",
      description: "Add and track your expenses easily.",
      color: "from-yellow-400 to-yellow-200",
    },
    {
      icon: "👥",
      title: "Bill Splitting",
      description: "Share expenses with friends or roommates.",
      color: "from-blue-400 to-blue-200",
    },
    {
      icon: "📊",
      title: "Statistics & Reports",
      description: "View detailed insights with charts and tables.",
      color: "from-green-400 to-green-200",
    },
    {
      icon: "🔒",
      title: "Data Security",
      description: "Your data is safe and protected.",
      color: "from-red-400 to-red-200",
    },
  ];

  return (
    <section className="bg-gray-200 py-20 px-6 m-4">
      <h2 className="text-4xl font-bold text-center mb-16">Features 🚀</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300 text-center"
          >
            <div
              className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br ${feature.color} text-white text-3xl`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
