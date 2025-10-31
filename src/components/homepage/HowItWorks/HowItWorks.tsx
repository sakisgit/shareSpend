
interface StepProps {
  title: string;
  description: string;
  imageUrl: string;
}

// Each step card (uniform size + clean style)
const Step: React.FC<StepProps> = ({ title, description, imageUrl }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all w-full md:w-80 h-[380px]">
      <img src={imageUrl} alt={title} className="w-40 h-40 mb-4 object-contain" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Main HowItWorks section
const HowItWorks: React.FC = () => {
  const steps: StepProps[] = [
    {
      title: "Step 1",
      description:
        "Create a group for your participants and define the number of members in your group.",
      imageUrl: "/assets/unDrawImages/undraw_filter_v54h.png",
    },
    {
      title: "Step 2",
      description:
        "Easily add friends, roommates, or family members to your group and assign nicknames.",
      imageUrl: "/assets/unDrawImages/undraw_selecting-team_zehd.png",
    },
    {
      title: "Step 3",
      description: "Track your expenses and instantly see who owes what.",
      imageUrl: "/assets/unDrawImages/undraw_personal-finance_xpqg.png",
    },
  ];

  return (
    <section className="py-16 bg-gray-100 m-4">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works ⚙️</h2>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
