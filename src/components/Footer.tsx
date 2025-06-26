import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <button className={styles.adminBtn} onClick={() => navigate("/login")}>
          Acceso administrador
        </button>
      </div>

      <div className={styles.right}>
        <small>
          Aplicación creada con{" "}
          <a
            href="https://wa.me/5492616093134"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Chat-Link
          </a>
        </small>
      </div>
    </footer>
  );
};

export default Footer;



