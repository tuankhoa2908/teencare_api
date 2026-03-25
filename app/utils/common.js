const returnError = (code, message, data = {}) => {
    return { success: false, code, message, data };
};

const returnSuccess = (code, message, data = {}) => {
    return { success: true, code, message, data };
};

module.exports = {
    returnError,
    returnSuccess,
};
