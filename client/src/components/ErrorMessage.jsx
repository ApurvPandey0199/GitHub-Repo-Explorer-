import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ error, onRetry }) {
  if (!error) return null;

  let title = 'Oops!';
  let message = error.message || 'Something went wrong';
  let showRetry = true;

  if (error.status === 404) {
    title = 'User Not Found';
    message = `User '${error.username || 'requested'}' not found`;
    showRetry = false;
  } else if (error.status === 403 || error.status === 429) {
    title = 'Rate Limit Reached';
    message = 'GitHub rate limit reached. Please try again later or add a GITHUB_TOKEN.';
  }

  return (
    <div className={styles.errorContainer}>
      <span className={styles.icon} role="img" aria-label="error">
        ⚠️
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {showRetry && onRetry && (
        <button className={styles.retryBtn} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
