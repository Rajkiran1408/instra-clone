const LoadingSpinner = ({ size = 12 }) => {
	return (
		<div className="flex justify-center items-center">
			<div
				className={`relative w-${size} h-${size} flex items-center justify-center`}
			>
				{/* White Center */}
				<div className="absolute w-full h-full bg-blue-400 rounded-full"></div>

				{/* Blue Ring */}
				<div
					className={`absolute w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin`}
				></div>
			</div>
		</div>
	);
};

export default LoadingSpinner;
