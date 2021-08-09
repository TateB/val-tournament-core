const log = (...msgs) => {
  if (process.env.NODE_ENV === "development") console.log(...msgs)
}

global.log = log
