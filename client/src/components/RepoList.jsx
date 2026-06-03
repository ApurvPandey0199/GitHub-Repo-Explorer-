import RepoItem from './RepoItem';
import styles from './RepoList.module.css';

export default function RepoList({ repos, hasMore, onLoadMore }) {
  if (!repos || repos.length === 0) {
    return <div className={styles.emptyList}>No repositories found.</div>;
  }

  return (
    <div className={styles.repoListContainer}>
      <div className={styles.list}>
        {repos.map(repo => (
          <RepoItem key={repo.id} repo={repo} />
        ))}
      </div>
      
      {hasMore && (
        <button className={styles.loadMoreBtn} onClick={onLoadMore}>
          Load More
        </button>
      )}
    </div>
  );
}
