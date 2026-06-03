import styles from './ProfileCard.module.css';

export default function ProfileCard({ user }) {
  if (!user) return null;

  return (
    <div className={styles.card}>
      <img src={user.avatar_url} alt={`${user.login}'s avatar`} className={styles.avatar} />
      <h2 className={styles.name}>{user.name || user.login}</h2>
      <p className={styles.login}>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
          @{user.login}
        </a>
      </p>
      {user.bio && <p className={styles.bio}>{user.bio}</p>}
      
      <div className={styles.stats}>
        <div className={styles.statTile}>
          <span className={styles.statValue}>{user.followers}</span>
          <span className={styles.statLabel}>followers</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statValue}>{user.following}</span>
          <span className={styles.statLabel}>following</span>
        </div>
        <div className={styles.statTile}>
          <span className={styles.statValue}>{user.public_repos}</span>
          <span className={styles.statLabel}>repos</span>
        </div>
      </div>
      
      <a href={user.html_url} target="_blank" rel="noopener noreferrer" className={styles.profileLink}>
        View on GitHub
      </a>
    </div>
  );
}
