import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        <a href="/login" className={styles.link}>
          Acceso administrador
        </a>
      </div>
      <div className={styles.right}>
        Aplicación creada con{" "}
        <a
          href="https://wa.me/5492616093134"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.chatlink}
        >
          Chat-Link
        </a>
      </div>
    </footer>
  );
};

export default Footer;

