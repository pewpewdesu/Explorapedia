/**
 * Centralized error handling middleware
 * Wraps route handlers to catch and format errors consistently
 */
function catchAsyncErrors(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            console.error(error);
            res.status(error.status || 500).json({
                message: error.message || 'Internal server error'
            });
        });
    };
}

module.exports = catchAsyncErrors;
