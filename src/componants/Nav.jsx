import { Nav, NavItem, NavLink } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `d-flex align-items-center gap-3 px-4 py-3 mb-2 rounded text-decoration-none 
     ${isActive ? 'active-link' : 'inactive-link'}`;

  const logoutLinkClass = ({ isActive }) =>
    `d-flex align-items-center gap-3 px-4 py-3 rounded text-decoration-none 
     ${isActive ? 'active-logout' : 'inactive-logout'}`;

  return (
    <div
      className=" bg-white sidebar d-flex flex-column h-100 bg-light border-end "
      style={{ overflow: "hidden" }}
    >

      {/* Navigation Links (NO OVERFLOW) */}
      <div className="flex-grow-1" style={{ overflow: "hidden" }}>
        <Nav vertical className="mt-3 list-unstyled p-0">
          <NavItem>
            <NavLink tag={RRNavLink} to="/" className={linkClass} end>
              <i className="bi bi-house-door fs-5"></i>
              <span> Menu</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={RRNavLink} to="/categories" className={linkClass}>
              <i className="bi bi-folder fs-5"></i>
              <span> Orders</span>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink tag={RRNavLink} to="/menuAdmin" className={linkClass}>
              <i className="bi bi-folder fs-5"></i>
              <span> Menu Admin</span>
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Footer (ALWAYS VISIBLE) */}
      <div className="footer py-3 border-top">
        <Nav vertical className="list-unstyled p-0">
          <NavItem>
            <NavLink tag={RRNavLink} to="/logout" className={logoutLinkClass}>
              <i className="bi bi-box-arrow-right fs-5"></i>
              <span> Logout</span>
            </NavLink>
          </NavItem>
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;