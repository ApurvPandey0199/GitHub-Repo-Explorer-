export default function ErrorMessage({ message }) {
  return <div className="error">{message || 'An error occurred'}</div>;
}
