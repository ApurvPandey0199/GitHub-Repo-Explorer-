import styles from './Organizations.module.css';

export default function Organizations({ orgs }) {
  if (!orgs || orgs.length === 0) return null;

  return (
    <div className={styles.orgsContainer}>
      <h3 className={styles.title}>Organizations</h3>
      <div className={styles.orgList}>
        {orgs.map(org => (
          <a 
            key={org.id} 
            href={`https://github.com/${org.login}`}
            target="_blank" 
            rel="noopener noreferrer"
            title={org.login}
            className={styles.orgLink}
          >
            <img 
              src={org.avatar_url} 
              alt={`${org.login} logo`} 
              className={styles.orgAvatar} 
            />
          </a>
        ))}
      </div>
    </div>
  );
}
