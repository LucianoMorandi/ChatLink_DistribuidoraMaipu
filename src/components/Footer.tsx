import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
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
      <div className={styles.right}>
        <small>© {new Date().getFullYear()} Distribuidora Maipú</small>
      </div>
    </footer>
  );
};

export default Footer;


