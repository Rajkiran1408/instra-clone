const PostSkeleton = () => {
	return (
		<div className="flex flex-col gap-4 w-full p-4">
			{/* Avatar + Name */}
			<div className="flex gap-4 items-center">
				<div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse shrink-0"></div>
				<div className="flex flex-col gap-2">
					<div className="h-2 w-12 rounded-full bg-gray-300 animate-pulse"></div>
					<div className="h-2 w-24 rounded-full bg-gray-300 animate-pulse"></div>
				</div>
			</div>

			{/* Post Image */}
			<div className="h-40 w-full rounded-lg bg-gray-300 animate-pulse"></div>
		</div>
	);
};

export default PostSkeleton;
