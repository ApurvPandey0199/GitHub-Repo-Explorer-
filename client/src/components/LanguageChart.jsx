import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import styles from './LanguageChart.module.css';

const COLORS = ['#f1e05a', '#3178c6', '#3572A5', '#b07219', '#701516', '#00ADD8', '#8b949e'];

export default function LanguageChart({ repos }) {
  if (!repos || repos.length === 0) return null;

  // Aggregate languages
  const langCounts = {};
  repos.forEach((repo) => {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  if (sortedLangs.length === 0) return null;

  const topLangs = sortedLangs.slice(0, 6);
  const otherLangs = sortedLangs.slice(6);
  
  if (otherLangs.length > 0) {
    const otherCount = otherLangs.reduce((acc, curr) => acc + curr.value, 0);
    topLangs.push({ name: 'Other', value: otherCount });
  }

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.title}>Languages</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={topLangs}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {topLangs.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
