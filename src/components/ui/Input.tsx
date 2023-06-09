import { twMerge } from 'tailwind-merge';

export default function Input({
  className,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <>
      <input
        className={twMerge(
          'bg-amber-700 rounded-md border border-amber-900 text-gray-200 placeholder:text-amber-500 placeholder:italic px-2 py-1',
          className
        )}
        {...props}
      />
    </>
  );
}
