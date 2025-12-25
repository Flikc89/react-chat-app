function MessagesLoadingSkeleton() {
  return (
    <div className="max-w-3xl px-3 md:px-6 pt-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? 'chat-start' : 'chat-end'} animate-pulse`}
        >
          <div className={`chat-bubble bg-gray-800 text-white w-32 h-12`}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;
