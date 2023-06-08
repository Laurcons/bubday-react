import { twMerge } from 'tailwind-merge';

export default function BubdayLogo({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        'leading-tight tracking-tight text-right text-xl text-amber-600 font-semibold',
        className
      )}
    >
      Bubday
      <br />
      2023
    </div>
  );
}
