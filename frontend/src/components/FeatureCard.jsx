export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md space-y-3 hover:shadow-lg">
      
      <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-lg text-white">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-black">{title}</h3>

      <p className="text-gray-600 text-sm">
        {desc}
      </p>

    </div>
  );
}
