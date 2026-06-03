import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/drivers", label: "Drivers" },
  { to: "/strategy-lab", label: "Strategy Lab" },
  { to: "/learn", label: "Learn" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-carbon/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center border border-racing/50 bg-racing/15 text-sm font-black text-white shadow-glow">
            IQ
          </span>
          <span className="text-lg font-black uppercase tracking-[0.18em] text-white">PitWall IQ</span>
        </NavLink>
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-racing bg-racing text-white shadow-glow"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
