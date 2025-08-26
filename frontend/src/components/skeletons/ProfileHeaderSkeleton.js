const ProfileHeaderSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full my-2 p-4 animate-pulse">
      <div className="flex gap-2 items-center">
        <div className="flex flex-1 gap-1">
          <div className="flex flex-col gap-1 w-full">
            {/* Username */}
            <div className="h-4 w-12 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-16 bg-gray-300 rounded-full"></div>

            {/* Cover image */}
            <div className="h-40 w-full bg-gray-300 relative rounded-md">
              {/* Profile image */}
              <div className="h-20 w-20 bg-gray-300 rounded-full border-4 border-gray-100 absolute -bottom-10 left-3"></div>
            </div>

            {/* Button */}
            <div className="h-6 mt-4 w-24 ml-auto bg-gray-300 rounded-full"></div>

            {/* Info */}
            <div className="h-4 w-14 bg-gray-300 rounded-full mt-4"></div>
            <div className="h-4 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
