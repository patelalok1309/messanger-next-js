const Loading = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                {/* Placeholder for logo */}
                <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Title */}
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-700">
                    Sign in to your account
                </h2>

                {/* Email field */}
                <div className="mb-4">
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                {/* Password field */}
                <div className="mb-4">
                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                </div>

                {/* Sign-in button */}
                <div className="mb-4">
                    <div className="h-12 bg-blue-200 rounded w-full animate-pulse"></div>
                </div>

                {/* Or continue with */}
                <div className="text-center text-gray-500 mb-4">
                    Or continue with
                </div>

                {/* GitHub and Google buttons */}
                <div className="flex justify-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Create account link */}
                <div className="mt-6 text-center">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;