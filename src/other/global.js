const log = (...msgs) => {
  if (true) console.log(...msgs) // process.env.NODE_ENV === "development"
}

global.log = log
