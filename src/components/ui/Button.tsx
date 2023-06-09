import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import loading from '../../assets/loading.svg';
import Loading from 'src/components/ui/Loading';

export default function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    variant: 'primary' | 'secondary';
    selected?: boolean;
    isLoading?: boolean;
  }
) {
  return (
    <button
      {...props}
      className={twMerge(
        'rounded-lg drop-shadow-sm hover:drop-shadow-lg text-white py-2 px-3',
        classNames({
          'bg-gradient-to-r from-amber-500 to-amber-700':
            props.variant === 'primary' && !props.disabled,
          'bg-amber-900 text-slate-400':
            props.variant === 'primary' && props.disabled,
          'text-slate-400': props.variant === 'secondary' && !props.disabled,
          'text-slate-600': props.variant === 'secondary' && props.disabled,
          'border-2 border-lime-300': props.selected,
        }),
        props.className
      )}
    >
      {props.children}
      {props.isLoading && (
        <div className="absolute right-3 top-0 bottom-0 flex align-middle">
          {/* <div className="float-right"> */}
          <Loading className="w-4" />
        </div>
      )}
    </button>
  );
}
