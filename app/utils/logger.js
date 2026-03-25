const { existsSync, mkdirSync } = require("fs");
const path = require("path");
const moment = require("moment");
const { inspect } = require("util");
const { format, transports, createLogger } = require("winston");
require("winston-daily-rotate-file");

const { combine, colorize, align, splat, simple, printf, errors } = format;

const dirLogPath = "./logs";

if (!existsSync(dirLogPath)) {
	mkdirSync(dirLogPath);
}

const formatLocalTimezone = () => moment().format("YYYY-MM-DD HH:mm:ss");
const filterLevelOnly = (level) =>
	format((info) => (info.level === level ? info : false))();

// ========== FORMATTERS ==========
const utilLogFormat = combine(
	align(),
	splat(),
	simple(),
	errors({ stack: true }),
);

const consoleLogFormat = combine(
	colorize({
		colors: { info: "blue", error: "red", warn: "yellow", debug: "green" },
	}),
	printf((info) => {
		if (info?.stack) {
			return `${formatLocalTimezone()} ${info.level}: ${info.message}\n${info.stack}\n  error:${inspect(
				info.error,
				{ depth: null, colors: true },
			)}\n  status:${info.status}\n  metadata:${inspect(info.metadata, { depth: null, colors: true })}`;
		}
		return `${formatLocalTimezone()} ${info.level}: ${info.message}`;
	}),
);

const fileInfoFormat = combine(
	filterLevelOnly("info"),
	printf((info) => `${formatLocalTimezone()} ${info.level}: ${info.message}`),
);

const fileErrorFormat = combine(
	filterLevelOnly("error"),
	printf((info) => {
		if (info?.stack) {
			return `${formatLocalTimezone()} ${info.level}: ${info.message}\n${info.stack}\n  error:${inspect(
				info.error,
				{ depth: null },
			)}\n  status:${info.status}\n  metadata:${inspect(info.metadata, { depth: null })}`;
		}
		return `${formatLocalTimezone()} ${info.level}: ${info.message}`;
	}),
);

// ========== TRANSPORTS ==========
const transportInfo = new transports.DailyRotateFile({
	filename: `${dirLogPath}/info.log`,
	maxsize: "20m",
	maxFiles: "14d",
	json: false,
	handleExceptions: true,
	humanReadableUnhandledException: true,
	level: "info",
	datePattern: "YYYY-MM-DD",
	format: fileInfoFormat,
});

const transportError = new transports.File({
	filename: `${dirLogPath}/error.log`,
	maxsize: 30000000,
	maxFiles: 10,
	json: false,
	handleExceptions: true,
	humanReadableUnhandledException: true,
	level: "error",
	format: fileErrorFormat,
});

const transportConsole = new transports.Console({
	json: false,
	format: consoleLogFormat,
	handleExceptions: true,
	humanReadableUnhandledException: true,
	colorize: true,
	level: "info",
});

// ========== LOGGER ==========
const logger = createLogger({
	format: utilLogFormat,
	transports: [transportConsole, transportInfo, transportError],
	exitOnError: false,
});

// Hàm lấy tên file của caller tự động
const getCallerFile = () => {
	const originalFunc = Error.prepareStackTrace;
	let callerfile;
	try {
		const err = new Error();
		Error.prepareStackTrace = (err, stack) => stack;
		const currentfile = err.stack.shift().getFileName();
		while (err.stack.length) {
			callerfile = err.stack.shift().getFileName();
			if (currentfile !== callerfile) break;
		}
	} catch {
		callerfile = "unknown";
	}
	Error.prepareStackTrace = originalFunc;
	return callerfile;
};

const formatLogArguments = (filename, ...args) => {
	const newArgs = [...args];
	const args0 = newArgs[0];
	if (args0 instanceof Error) {
		// vẫn giữ nguyên Error, không convert sang string
		newArgs[0].message = `${filename} - ${args0.message}`;
	} else if (typeof args0 === "string") {
		newArgs[0] = `${filename} - ${args0}`;
	} else {
		newArgs[0] = `${filename} - ${inspect(args0, { depth: null })}`;
	}
	return newArgs;
};

module.exports = {
	info: (...args) => {
		const filename = path.relative(process.cwd(), getCallerFile());
		logger.info(...formatLogArguments(filename, ...args));
	},
	debug: (...args) => {
		const filename = path.relative(process.cwd(), getCallerFile());
		logger.debug(...formatLogArguments(filename, ...args));
	},
	warn: (...args) => {
		const filename = path.relative(process.cwd(), getCallerFile());
		logger.warn(...formatLogArguments(filename, ...args));
	},
	error: (...args) => {
		const filename = path.relative(process.cwd(), getCallerFile());
		logger.error(...formatLogArguments(filename, ...args));
	},
};
