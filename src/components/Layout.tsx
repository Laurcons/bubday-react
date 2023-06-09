import { PropsWithChildren } from 'react';
import Loading from 'src/components/ui/Loading';

export default function Layout({
  children,
  isLoading,
}: { isLoading?: boolean } & PropsWithChildren) {
  return (
    <div className="h-full scrollbar flex flex-col text-slate-400 bg-gradient-to-b from-slate-700 to-slate-900">
      <div className="flex-grow overflow-auto pb-72">
        <div className="md:max-w-md md:mx-auto flex-grow min-h-2">
          <div className="flex-grow px-4 py-5">
            {!isLoading && children}
            {isLoading && <Loading className="w-14 mx-auto" />}
          </div>
        </div>
      </div>
      <div className="w-full md:max-w-md md:mx-auto">
        <div className="flex-shrink-0 border-t border-slate-600 text-center py-4 mx-4">
          Bubday 2023 ❤️
        </div>
      </div>
    </div>
  );
}
