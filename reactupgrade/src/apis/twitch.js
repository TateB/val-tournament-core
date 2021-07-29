import db from "../db/db"
import IdTokenVerifier from "idtoken-verifier"
import crypto from "crypto"

const authCheck = async () => {
  const errorQuery = new URLSearchParams(window.location.search).get("error")
  const twitchHashes = window.location.hash.substring(1)
  const resObj = Object.fromEntries(new URLSearchParams(twitchHashes).entries())
  console.log(resObj)

  if (errorQuery) return console.error("couldn't get twitch")

  const verifier = new IdTokenVerifier({
    issuer: "https://id.twitch.tv/oauth2",
    audience: process.env.REACT_APP_TWITCH_KEY,
    jwksURI: "https://id.twitch.tv/oauth2/keys",
  })

  const nonce = await db.userSessions.get("twitch").nonce

  const tryVerify = await verifier.verify(
    resObj.id_token,
    nonce,
    (err, payload) => {
      console.log(payload)
      if (err) return console.error(err)
      db.userSessions
        .update("twitch", {
          session: {
            accessToken: resObj.access_token,
            userId: payload.sub,
            username: payload.preferred_username,
          },
          nonce: "",
          authenticated: true,
        })
        .then(() => {
          revalidateToken()
          window.location.hash = ""
          window.history.replaceState("", "", "/")
        })
    }
  )
}

const revalidateToken = async () => {
  const twitchDb = await db.userSessions.get("twitch")
  if (!twitchDb.authenticated) return
  const token = twitchDb.session.accessToken
  console.log(twitchDb)

  fetch("https://id.twitch.tv/oauth2/validate", {
    method: "GET",
    headers: {
      Authorization: "OAuth " + token,
    },
  })
    .then((res) => res.json())
    .then((json) => {
      return db.userSessions.update("twitch", {
        expiresAt: Date.now() + json.expires_in * 1000,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const logout = async () => {
  const twitchDb = await db.userSessions.get("twitch")
  if (!twitchDb.authenticated) return
  const token = twitchDb.session.accessToken
  console.log("logging out")

  fetch(
    "https://id.twitch.tv/oauth2/revoke?client_id=" +
      process.env.REACT_APP_TWITCH_KEY +
      "&token=" +
      token,
    {
      method: "POST",
    }
  )
    .then((res) => {
      if (res.status === 200) return
      if (res.status === 400) throw res.status
    })
    .then(() => {
      return db.userSessions.update("twitch", {
        session: {
          accessToken: "",
          userId: "",
          username: "",
        },
        nonce: "",
        authenticated: false,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

const generateLoginLink = () => {
  const nonce = crypto.randomBytes(16).toString("base64")
  const params = new URLSearchParams({
    client_id: process.env.REACT_APP_TWITCH_KEY,
    redirect_uri: process.env.REACT_APP_URL + "twitch/",
    response_type: "token id_token",
    scope: "channel:manage:predictions openid",
    nonce: nonce,
  })

  db.userSessions.update("twitch", { nonce: nonce }).then((upd) => {
    window.location.href =
      "https://id.twitch.tv/oauth2/authorize?" +
      decodeURIComponent(params.toString())
  })
}

const allFunctions = { authCheck, generateLoginLink, revalidateToken, logout }

export default allFunctions
