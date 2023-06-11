import { twMerge } from 'tailwind-merge';

export default function A({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  return <a className={twMerge('text-amber-400 underline')} {...props}></a>;
}
