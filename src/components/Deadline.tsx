import { useDeadline } from 'src/lib/useDeadline';

export default function Deadline() {
  const { deadline } = useDeadline();
  return <>{deadline ? deadline.format('D MMMM').toLowerCase() : '...'}</>;
}
