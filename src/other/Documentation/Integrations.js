import {
  Heading,
  ListItem,
  Pane,
  Paragraph,
  Strong,
  Text,
  UnorderedList,
} from "evergreen-ui"
import { Fragment } from "react"

export const Integrations = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Integrations
      </Heading>
      <Paragraph>
        The integrations feature allows you to login to Twitch and Nightbot, to
        add functionality to all other features.
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Twitch
      </Heading>
      <Text>
        The twitch integration allows the prediction feature to work. More
        coming soon...
      </Text>
      <Heading marginTop={16} marginBottom={4}>
        Nightbot
      </Heading>
      <Text>
        The nightbot integration allows various commands for your channel to
        automatically be set when each respective value is updated. The command
        used for each feature can be set within the{" "}
        <Strong>Nightbot Settings</Strong>. The current casters and match info
        can also be set via this.
      </Text>
      <Text>Available commands:</Text>
      <UnorderedList>
        <ListItem>
          <Pane display="flex" flexDirection="column">
            <Text>
              <Strong>Bracket:</Strong> Command for getting the current bracket
              (specified in Nightbot Settings).
            </Text>
            <Text>
              <Strong>Format:</Strong> @User, The bracket for this tournament
              is: https://example.com
            </Text>
          </Pane>
        </ListItem>
        <ListItem>
          <Pane display="flex" flexDirection="column">
            <Text>
              <Strong>Caster:</Strong> Command for getting the current
              caster/casters (specified in Nightbot Settings).
            </Text>
            <Text>
              <Strong>Format:</Strong> @User, Your caster for today is: Streamer
            </Text>
          </Pane>
        </ListItem>
        <ListItem>
          <Pane display="flex" flexDirection="column">
            <Text>
              <Strong>Delay:</Strong> Command for getting the current stream
              delay (specified in general settings).
            </Text>
            <Text>
              <Strong>Format:</Strong> @User, Stream delay is set to 3 minutes
            </Text>
          </Pane>
        </ListItem>
        <ListItem>
          <Pane display="flex" flexDirection="column">
            <Text>
              <Strong>Maps:</Strong> Command for getting the current{" "}
              <Strong>PICKED</Strong> maps, data is from the mapbans feature.
            </Text>
            <Text>
              <Strong>Format:</Strong> @User, TEMA picks ASCENT (TEMB DEF)
            </Text>
          </Pane>
        </ListItem>
        <ListItem>
          <Pane display="flex" flexDirection="column">
            <Text>
              <Strong>Score:</Strong> Command for getting the current score,
              data is from the scores feature.
            </Text>
            <Text>
              <Strong>Format:</Strong> @User, TEMA wins ASCENT (12 - 5)
            </Text>
          </Pane>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
