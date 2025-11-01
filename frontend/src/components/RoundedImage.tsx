import Image from "next/image";

import styles from "./roundedImage.module.css";

function RoundedImage({ src, alt, width }) {
  return (
    <Image
      className={`${styles.roundedImage} ${styles[width]}`}
      src={src}
      alt={alt}
      width={0}
      height={0}
      priority
      unoptimized
    />
  );
}

export { RoundedImage };
