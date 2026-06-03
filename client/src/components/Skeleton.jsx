import styles from './Skeleton.module.css';

export default function Skeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.profileSkeleton}>
        <div className={styles.avatar}></div>
        <div className={styles.line} style={{ width: '60%', height: '24px' }}></div>
        <div className={styles.line} style={{ width: '40%' }}></div>
        <div className={styles.line} style={{ width: '80%' }}></div>
        <div className={styles.stats}>
          <div className={styles.statBox}></div>
          <div className={styles.statBox}></div>
          <div className={styles.statBox}></div>
        </div>
      </div>
      
      <div className={styles.listSkeleton}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.repoSkeleton}>
            <div className={styles.line} style={{ width: '50%', height: '20px' }}></div>
            <div className={styles.line} style={{ width: '90%' }}></div>
            <div className={styles.footer}>
              <div className={styles.line} style={{ width: '20%' }}></div>
              <div className={styles.line} style={{ width: '20%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
