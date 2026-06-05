import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/drivers", label: "Drivers" },
  { to: "/strategy-lab", label: "Strategy Lab" },
  { to: "/race-explainer", label: "Race Explainer" },
  { to: "/learn", label: "Learn" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#15151e] border-b border-white/8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-0 sm:px-6 lg:px-8">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 py-3">
          <div className="relative">
            <span className="grid h-9 w-9 place-items-center bg-racing text-sm font-black text-white">
              IQ
            </span>
          </div>
          <span className="text-[15px] font-black uppercase tracking-[0.15em] text-white hidden sm:block">
            PitWall IQ
          </span>
        </NavLink>

        {/* Nav links */}
        <div className="flex items-center gap-0">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `relative px-3 lg:px-4 py-4 text-[12px] lg:text-[13px] font-bold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-racing after:rounded-t"
                    : "text-white/50 hover:text-white"
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
