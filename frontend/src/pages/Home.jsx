import NavbarPublic from "../components/NavbarPublic";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";

import {
  Camera,
  Brain,
  Bell,
  TrendingUp,
  MessageCircle,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <>
      {/* NAVBAR */}  

      {/* HERO SECTION */}
      <section className="min-h-[80vh] bg-gradient-to-r from-indigo-900 via-blue-800 to-sky-700 text-white flex items-center justify-center text-center px-6">
        
        <div className="space-y-6 max-w-5xl">
          
          <h1 className="text-6xl md:text-6xl font-bold leading-tight">
            Track spending automatically.
            <br />
            <span className="text-sky-300">
              Understand your money with AI.
            </span>
          </h1>

          <p className="text-white/80 max-w-xl mx-auto text-xl">
            Your intelligent financial companion that learns from your habits
            and helps you make smarter money decisions.
          </p>

          <div className="flex justify-center gap-4">

            <button className="bg-white text-blue-700 font-medium px-6 py-3 rounded-lg hover:bg-slate-100">
              Get Started Free
            </button>

            <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
              Sign In
            </button>

          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16 bg-slate-50">
        
        <div className="max-w-5xl mx-auto text-center space-y-10">

          <div>
            <h2 className="text-4xl font-bold text-black">
              Powerful Features for Smart Finance
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Everything you need to take control of your financial future
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">

            <FeatureCard
              icon={<Camera />}
              title="AI Receipt Scanner"
              desc="Snap a photo of any receipt and let AI extract details automatically."
            />

            <FeatureCard
              icon={<Brain />}
              title="Smart Categorization"
              desc="AI automatically classifies spending patterns."
            />

            <FeatureCard
              icon={<Bell />}
              title="Budget Alerts"
              desc="Get notified before you exceed budget limits."
            />

            <FeatureCard
              icon={<TrendingUp />}
              title="Financial Forecasting"
              desc="Predict spending trends and plan confidently."
            />

            <FeatureCard
              icon={<MessageCircle />}
              title="AI Financial Coach"
              desc="Get personalised advice based on your data."
            />

            <FeatureCard
              icon={<Shield />}
              title="Secure & Private"
              desc="Your data is encrypted using secure practices."
            />

          </div>

        </div>
      </section>
    </>
  );
}
