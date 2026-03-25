/**
 * Class custom Error
 * @extends Error
 */
class APIError extends Error {
	/**
	 * Error message
	 * @type {string}
	 */
	message;

	/**
	 * HTTP status code of error
	 * @type {number}
	 */
	status;

	name = "APIError";

	/**
	 * Detailed error message
	 * @type {any}
	 */
	error;

	/**
	 * Metadata of error
	 * @type {any}
	 */
	metadata;

	/**
	 *
	 * @param {string} message Error message
	 * @param {number} status HTTP status code of error
	 * @param {any} error Detailed error message
	 * @param {string | undefined} stack Stack error
	 */

	constructor(
		message,
		status = 500,
		error = undefined,
		metadata = undefined,
		stack = undefined,
	) {
		super(message);
		this.name = "APIError";
		this.message = message;
		this.status = status;
		this.error = error;
		this.metadata = metadata;
		if (stack) {
			this.stack = stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

module.exports = APIError;
