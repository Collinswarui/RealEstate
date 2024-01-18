// Middleware to handle errors
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error details
    console.error(`Error: ${message}`);
    console.error(err.stack);

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

export {
    errorHandler
};
