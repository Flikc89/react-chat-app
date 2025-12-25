const UsersLoadingSkeleton = () => {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-violet-500/10 p-3 md:p-4 rounded-lg animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gray-700"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-48 md:w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-32 md:w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersLoadingSkeleton;
