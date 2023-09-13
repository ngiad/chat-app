import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import styles from "@/styles/layoutStyles/NavbarVertical.module.css";
import {
  AiFillMessage,
  AiOutlineCloud,
  AiOutlineSetting,
  AiOutlineUserAdd,
  AiOutlineUsergroupAdd,
  AiFillCloseCircle,
} from "react-icons/ai";
import { TiContacts } from "react-icons/ti";
import { BsCheck2Square } from "react-icons/bs";
import { PiToolboxDuotone } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";

const NavBarVertical = () => {
  return (
    <>
      <div className={styles.NavBar}>
        <div className={styles.avatar}>
          <img
            src="https://picture.vn/wp-content/uploads/2020/10/chan-dung-nam2.jpg"
            alt=""
          />
        </div>
        <div>
          <div className={styles.icon}>
            <AiFillMessage className={styles.AiFillMessage} />
          </div>
          <div className={styles.icon}>
            <TiContacts className={styles.AiFillMessage} />
          </div>
          <div className={styles.icon}>
            <BsCheck2Square className={styles.AiFillMessage} />
          </div>
        </div>
        <div className={styles.setting}>
          <div className={styles.icon}>
            <AiOutlineCloud className={styles.AiFillMessage} />
          </div>
          <div className={styles.icon}>
            <PiToolboxDuotone className={styles.AiFillMessage} />
          </div>
          <div className={styles.icon}>
            <AiOutlineSetting className={styles.AiFillMessage} />
          </div>
        </div>
      </div>
      <div className={styles.search}>
        <div className={styles.inputSearch}>
          <i>
            <CiSearch />
          </i>
          <input type="text" placeholder="Tìm kiếm" />
          <i className={styles.close}>
            <AiFillCloseCircle />
          </i>
        </div>
        <div className={styles.add}>
          <AiOutlineUserAdd />
        </div>
        <div className={styles.add}>
          <AiOutlineUsergroupAdd />
        </div>
      </div>
    </>
  );
};

export default NavBarVertical;
