import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.container}>
      <Link to="/login" className={styles.link}>
        Acceso administrador
      </Link>
      <span className={styles.text}>Aplicación creada con Chat-Link</span>
    </footer>
  );
};

export default Footer;
