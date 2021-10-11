import {
  Code,
  Heading,
  ListItem,
  Paragraph,
  Strong,
  Text,
  UnorderedList,
} from "evergreen-ui"
import { Fragment } from "react"

export const Timer = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Timer
      </Heading>
      <Paragraph>
        The timer feature provides a stream timer (e.g. for a break screen or
        starting soon screen). The following buttons are available within the
        timer:
      </Paragraph>
      <UnorderedList>
        <ListItem>
          <Strong>Timer Amount:</Strong> The amount of time in seconds that you
          want the timer to go for
        </ListItem>
        <ListItem>
          <Strong>Submit:</Strong> The submit button submits the new time to the
          OBS view, as well as to the database as the default value.{" "}
          <Strong>HOWEVER</Strong>, on submission, the timer will not
          automatically reset.
        </ListItem>
        <ListItem>
          <Strong>Play:</Strong> The play button starts the timer.
        </ListItem>
        <ListItem>
          <Strong>Stop:</Strong> The stop button stops/pauses the timer, but
          keeps the state within the OBS view so it can be played again.
        </ListItem>
        <ListItem>
          <Strong>Reset:</Strong> The reset button will reset the timer, if
          there is a new value since the timer was previously started, then the
          new value will be used.
        </ListItem>
      </UnorderedList>
      <Heading marginTop={16} marginBottom={4}>
        Views
      </Heading>
      <Heading size={400} marginTop={8} marginBottom={4}>
        timer
      </Heading>
      <Text>
        <Strong>OBS Values:</Strong>
      </Text>
      <UnorderedList>
        <ListItem>
          <Strong>Width:</Strong> <Code>any</Code>
        </ListItem>
        <ListItem>
          <Strong>Height:</Strong> <Code>any</Code>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
