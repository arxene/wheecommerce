// Helps reduce try/catch for async functions
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
