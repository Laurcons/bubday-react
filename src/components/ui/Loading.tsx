import loading from 'src/assets/loading.svg';

export default function Loading({ className }: { className: string }) {
  return <img src={loading} className={className} />;
}
