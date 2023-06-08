import { twMerge } from 'tailwind-merge';

export default function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  return (
    <select
      {...props}
      className={twMerge(
        'rounded-lg w-full text-white bg-amber-700 py-2 px-3',
        props.className
      )}
    >
      {props.children}
    </select>
  );
}
