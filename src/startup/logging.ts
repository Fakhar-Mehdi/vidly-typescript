import winston from "winston";
import w from "winston-mongodb";

const logger = () => {
  winston.configure({
    transports: [
      new w.MongoDB({ db: "mongodb://localhost/vidly" }),
      new winston.transports.File({
        filename: "vidly.log",
        //False because we want to exit the process
        // handleExceptions: true,
        // handleRejections: true,
      }),
      new winston.transports.File({
        filename: "unhandledExceptions",
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: "unhandledRejections",
        handleRejections: true,
      }),
      new winston.transports.Console({
        handleExceptions: true,
        handleRejections: true,
      }),
    ],
  });

  //   process.on("uncaughtException", () => {
  //     winston.error("Uncaught Exception is caught here");
  //     process.exit(1);
  //   });

  //   process.on("unhandledRejection", () => {
  //     winston.error("Unhandled Rejection is caught here");
  //     process.exit(1);
  //   });
};

export default logger;
