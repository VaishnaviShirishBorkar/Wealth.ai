import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/transactions", label: "Transactions" },
  { to: "/insights", label: "Insights" },
  { to: "/ai-chat", label: "AI Coach" },
];

export default function Sidebar() {
  return (
    <div className="w-52 bg-[#0B1220] border-r border-slate-700 p-4 space-y-3">
      {links.map(l => (
        <NavLink
          key={l.to}
          to={l.to}
          className="block text-slate-300 hover:text-sky-400"
        >
          {l.label}
        </NavLink>
      ))}
    </div>
  );
}
