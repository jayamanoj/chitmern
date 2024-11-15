module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (process.env.NODE_ENV === "development") {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV === "production") {
        let message = err.message;

        if (err.name === "ValidationError") {
            message = "Validation failed. Please check your input.";
            err.statusCode = 400;
        }

        res.status(err.statusCode).json({
            success: false,
            message: message
        });
    }
};

