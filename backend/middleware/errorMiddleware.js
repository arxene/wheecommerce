// Called if no other middleware handles the request and sets status to 404 Not Found
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Change to an error code if status currently set to 200 OK
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Check for MongooseDB invalid ObjectID cast error
    if (err.name === "CastError" && err.kind === "ObjectId") {
        message = "Resource not found.";
        statusCode = 404;
    }

    res.status(statusCode).json({
        message,
        // don't show stack trace in prod
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};

export {notFound, errorHandler};
