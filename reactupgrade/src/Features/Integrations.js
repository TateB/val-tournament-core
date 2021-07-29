import {
  Pane,
  TextInput,
  RefreshIcon,
  Text,
  Button,
  Strong,
  IconButton,
} from "evergreen-ui"
import { Component, useEffect, useState, Fragment } from "react"
import Layout from "./etc/Layout"
import db from "../db/db"
import { twitchIcon, nightbotIcon } from "../icons/icons"
import { twitch, convertMiliseconds } from "../apis/apis"
import { useLiveQuery } from "dexie-react-hooks"

const Integrations = (props) => {
  const twitchState = useLiveQuery(() => db.userSessions.get("twitch"))
  const nightbotState = useLiveQuery(() => db.userSessions.get("nightbot"))

  useEffect(() => {
    twitch.revalidateToken()
  }, [])

  if (!twitchState) return null

  const nightbotRedirect = () => {}

  return (
    <Layout
      name={props.name}
      openAppCallback={props.openAppCallback}
      openedApp={props.openedApp}
    >
      <Pane display="flex" flexDirection="column">
        <Pane
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginBottom={8}
        >
          <img
            src={twitchIcon}
            alt="Twitch Icon"
            style={{ padding: "8px", width: "16px", height: "16px" }}
          />
          <Text flexGrow="1" size={500}>
            Twitch
            {twitchState.authenticated ? (
              <Strong marginLeft={8} size={500}>
                Logged In as {twitchState.session.username} (
                {convertMiliseconds(twitchState.expiresAt - Date.now(), "d")}{" "}
                days left)
              </Strong>
            ) : (
              <Strong marginLeft={8} size={500}>
                Not Logged In
              </Strong>
            )}
          </Text>
          {twitchState.authenticated ? (
            <Fragment>
              <IconButton
                icon={RefreshIcon}
                onClick={twitch.generateLoginLink}
                intent="success"
              />
              <Button
                marginLeft={8}
                width={156}
                onClick={twitch.logout}
                intent="danger"
              >
                Logout of Twitch
              </Button>
            </Fragment>
          ) : (
            <Button width={156} onClick={twitch.generateLoginLink}>
              Login with Twitch
            </Button>
          )}
        </Pane>
        <Pane display="flex" flexDirection="row" alignItems="center">
          <img
            src={nightbotIcon}
            alt="Nightbot Icon"
            style={{ padding: "8px", width: "16px", height: "16px" }}
          />
          <Text flexGrow="1" size={500}>
            Nightbot
            <Strong marginLeft={8} size={500}>
              Not Logged In
            </Strong>
          </Text>
          <Button width={156} onClick={nightbotRedirect}>
            Login with Nightbot
          </Button>
        </Pane>
      </Pane>
    </Layout>
  )
}

export default Integrations
