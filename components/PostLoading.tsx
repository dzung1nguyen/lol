export default function PostSkeleton() {
  return (
    <div className="card border border-base-300 p-5">
      <div className="flex flex-col gap-3 w-full">
        <div className="flex w-full">
            <div className="skeleton h-3 w-20"></div>
            <div className="skeleton h-3 w-14 ml-auto"></div>
        </div>
        <div className="skeleton h-4 w-[80%]"></div>
        <div className="skeleton h-4 w-[70%]"></div>
        <div className="skeleton w-full aspect-[7/3]"></div>
        <div className="flex flex-row gap-4">
          <div className="skeleton h-4 w-14"></div>
          <div className="skeleton h-4 w-14"></div>
          <div className="skeleton h-4 w-14"></div>
          <div className="skeleton h-4 w-14"></div>
        </div>
        <div className="flex w-full gap-4">
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="flex-none ml-auto">
            <div className="skeleton h-4 w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
