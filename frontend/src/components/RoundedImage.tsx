import styles from "./roundedImage.module.css";

function RoundedImage({ src, alt, width }) {
	return (
		<img
			className={`${styles.roundedImage} ${styles[width]}`}
			src={src}
			alt={alt}
		/>
	);
}

export { RoundedImage };
