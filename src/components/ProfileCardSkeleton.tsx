export function ProfileCardSkeleton() {
  return (
    <div className="p-5 bg-black border border-white flex flex-col justify-between w-full h-[230px] animate-pulse">
      {/* Row 1: Avatar & Button */}
      <div className="flex justify-between items-start">
        <div className="w-14 h-14 bg-zinc-900 border border-zinc-800" />
        <div className="w-16 h-8 bg-zinc-900 border border-zinc-800" />
      </div>

      {/* Row 2: Username & Name */}
      <div className="text-left mt-3 space-y-2">
        <div className="h-4 w-2/3 bg-zinc-900" />
        <div className="h-3 w-1/2 bg-zinc-900" />
      </div>

      {/* Row 3: Reach stats */}
      <div className="border-t border-white/20 pt-3 mt-3 flex justify-between items-center">
        <div className="h-3 w-1/3 bg-zinc-900" />
        <div className="h-4 w-1/4 bg-zinc-900" />
      </div>
    </div>
  );
}
