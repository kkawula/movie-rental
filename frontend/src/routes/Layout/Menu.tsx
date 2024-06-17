import { UnstyledButton } from "@mantine/core";
import { NavLink } from "react-router-dom";
import classes from "./Layout.module.css";

interface MenuProps {
  onClick?: () => void;
}

export default function Menu({ onClick }: MenuProps) {
  return (
    <>
      {/* <NavLink
        className={({ isActive }) =>
          isActive ? classes.control_active : classes.control
        }
        to={"/"}
        onClick={onClick ? onClick : undefined}
      >
        <UnstyledButton>Home</UnstyledButton>
      </NavLink> */}
      <NavLink
        className={({ isActive }) =>
          isActive ? classes.control_active : classes.control
        }
        to={"/users"}
        onClick={onClick ? onClick : undefined}
      >
        <UnstyledButton>Clients</UnstyledButton>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? classes.control_active : classes.control
        }
        to={"/movies"}
        onClick={onClick ? onClick : undefined}
      >
        <UnstyledButton>Movies</UnstyledButton>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? classes.control_active : classes.control
        }
        to={"/rentals"}
        onClick={onClick ? onClick : undefined}
      >
        <UnstyledButton>Rentals</UnstyledButton>
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? classes.control_active : classes.control
        }
        to={"/reports"}
        onClick={onClick ? onClick : undefined}
      >
        <UnstyledButton>Reports</UnstyledButton>
      </NavLink>
    </>
  );
}
