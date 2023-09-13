import React from "react";
import NavBarVertical from "./NavBarVertical";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import styles from "@/styles/layoutStyles/Default.module.css";

const DefaultLayout = ({ children }: any) => {
  return (
    <div className="d-flex">
      <NavBarVertical />
      {children}
    </div>
  );
};

export default DefaultLayout;
