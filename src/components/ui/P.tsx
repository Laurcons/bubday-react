import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export default function P({
  className,
  children,
}: { className?: string } & PropsWithChildren) {
  return <p className={twMerge('mb-3', className)}>{children}</p>;
}
