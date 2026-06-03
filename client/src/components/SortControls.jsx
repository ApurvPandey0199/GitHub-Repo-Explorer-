import styles from './SortControls.module.css';

export default function SortControls({ sort, onChange }) {
  const options = [
    { value: 'updated', label: 'Last Updated' },
    { value: 'stars', label: 'Stars' },
    { value: 'name', label: 'Name' }
  ];

  return (
    <div className={styles.sortContainer}>
      <span className={styles.label}>Sort by:</span>
      <select 
        className={styles.select} 
        value={sort} 
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
