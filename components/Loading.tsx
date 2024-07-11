'use client';

type Props = {
    fixed: boolean;
};

export default function Loading({fixed}: Props) {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} top-0 left-0 w-full h-full z-[99] flex items-center justify-center bg-black bg-opacity-50`}>
        <span className="loader"></span>
    </div>
  );
}
