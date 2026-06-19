import { ArrowLeft, CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    credits: "100 Credits",
    description: "Perfect for beginners starting interview preparation.",
    badge: "Default",
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Limited History Tracking",
    ],
    buttonText: "Current Plan",
    highlighted: false,
  },
  {
    name: "Starter Pack",
    price: "₹100",
    credits: "150 Credits",
    description: "Great for focused practice and skill improvement.",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
    buttonText: "Proceed to Pay",
    highlighted: true,
  },
  {
    name: "Pro Pack",
    price: "₹500",
    credits: "650 Credits",
    description: "Best value for serious job preparation.",
    badge: "Best Value",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
    buttonText: "Select Plan",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-[#F4FBF8] px-6 py-12">
      {/* Back Button */}
      <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
        <ArrowLeft size={18} />
      </button>

      {/* Heading */}
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Choose Your Plan
        </h1>
        <p className="text-gray-500 mt-2">
          Flexible pricing to match your interview preparation goals.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto mt-12 grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-white rounded-3xl p-8 shadow-sm border transition-all duration-300
            ${
              plan.highlighted
                ? "border-green-400 scale-105 shadow-xl"
                : "border-gray-100"
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="flex justify-end mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    plan.badge === "Best Value"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {plan.badge}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-semibold">{plan.name}</h2>

            <div className="mt-4">
              <h3 className="text-4xl font-bold text-green-600">
                {plan.price}
              </h3>
              <p className="text-gray-500 mt-1">{plan.credits}</p>
            </div>

            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              {plan.description}
            </p>

            <ul className="mt-6 space-y-4">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <CheckCircle
                    size={18}
                    className="text-green-500 mt-0.5"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full mt-8 py-3 rounded-xl font-medium transition
              ${
                plan.highlighted
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}