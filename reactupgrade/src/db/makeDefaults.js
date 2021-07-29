import db from "./db"

const makeDefaults = async () => {
  await db.maps.bulkPut([
    { id: 0, name: "ascent" },
    { id: 1, name: "bind" },
    { id: 2, name: "breeze" },
    { id: 3, name: "haven" },
    { id: 4, name: "icebox" },
    { id: 5, name: "split" },
  ])
  await db.sides.bulkPut([
    { id: 0, name: "attack" },
    { id: 1, name: "defence" },
    { id: 2, name: "none" },
  ])
  await db.mapbans.bulkPut([
    { id: 0, map: 0, isBan: true, teamPick: 0, sidePick: 2, isShowing: true },
    { id: 1, map: 1, isBan: true, teamPick: 1, sidePick: 2, isShowing: true },
    { id: 2, map: 2, isBan: false, teamPick: 0, sidePick: 0, isShowing: true },
    { id: 3, map: 3, isBan: false, teamPick: 1, sidePick: 1, isShowing: true },
    { id: 4, map: 4, isBan: false, teamPick: 0, sidePick: 1, isShowing: true },
    { id: 5, map: 5, isBan: true, teamPick: 2, sidePick: 2, isShowing: true },
  ])
  await db.teams.bulkPut([
    { id: 0, name: "Team A", short: "TEMA", iconLink: "", score: 0 },
    { id: 1, name: "Team B", short: "TEMB", iconLink: "", score: 0 },
    { id: 2, name: "Auto", short: "AUTO", iconLink: "", score: 0 },
  ])
  await db.settings.bulkPut([
    {
      name: "scores",
      settings: {
        reversed: false,
        bestOf: 3,
      },
    },
    {
      name: "timer",
      settings: {
        seconds: 600,
        sendReset: false,
      },
    },
    {
      name: "general",
      settings: {
        streamDelay: 180,
        useVOTColours: true,
        customColour: "",
        isLowerCase: false,
        nightbotDelay: true,
      },
    },
    {
      name: "predictions",
      settings: {
        available: false,
        id: "",
        teamIds: [],
        showing: false,
      },
    },
    {
      name: "nightbot",
      settings: {
        commands: {},
      },
    },
  ])
  await db.userSessions.bulkPut([
    {
      name: "twitch",
      authenticated: false,
      session: {
        accessToken: "",
        userId: "",
        expiresAt: 0,
      },
    },
    {
      name: "nightbot",
      authenticated: false,
      session: {
        accessToken: "",
        userId: "",
        expiresAt: 0,
      },
    },
  ])
}

export default makeDefaults
