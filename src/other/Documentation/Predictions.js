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

export const Predictions = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        REQUIRES TWITCH LOGIN TO WORK
      </Heading>
      <Heading marginTop={16} marginBottom={4}>
        How to use Predictions
      </Heading>
      <Paragraph>
        The predictions feature allows you to automatically send twitch
        predictions with the map info for the specified map. When submitting a
        prediction, it will <Strong>also</Strong> submit the score at the same
        time. This is why the scores feature is disabled when a prediction is
        active.
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Prediction States
      </Heading>
      <Heading size={400} marginTop={8} marginBottom={4}>
        Not yet created
      </Heading>
      <Text>Active if a prediction has not been created yet.</Text>
      <UnorderedList>
        <ListItem>
          <Strong>Map:</Strong> Input of the map you want to create a prediction
          for. Uses the map bans to get all information, so if your mapbans are
          not updated your prediction will be incorrect.
        </ListItem>
        <ListItem>
          <Strong>Prediction Time:</Strong> Input of the amount of time that
          viewers should be able to predict. There is a MAXIMUM VALUE of{" "}
          <Strong>1800 SECONDS</Strong>, if the value is higher than this the
          prediction will not be submitted.
        </ListItem>
      </UnorderedList>
      <Heading size={400} marginTop={8} marginBottom={4}>
        Created
      </Heading>
      <Text>Active if a prediction has been successfully submitted</Text>
      <UnorderedList>
        <ListItem>
          <Strong>Results Preview:</Strong> After the prediction window has
          closed, this will show the results of the prediction.
        </ListItem>
        <ListItem>
          <Strong>Scores:</Strong> Scores of the map that the prediction is for.
          These values are used to calculate the winner, and also submit to the
          scores feature.
        </ListItem>
        <ListItem>
          <Strong>Use Stream Delay:</Strong> If ticked, this will use the stream
          delay specified in the settings before submitting the prediction. If
          unticked it will <Strong>IMMEDIATELY</Strong> submit the prediction,
          so if you untick this, please make sure you know what will happen.
        </ListItem>
      </UnorderedList>
      <Heading size={400} marginTop={8} marginBottom={4}>
        Submission In Progress
      </Heading>
      <Text>
        Active if a prediction was submitted with stream delay, will go away
        after stream delay
      </Text>
      <UnorderedList>
        <ListItem>
          This state is unfinished, so you probably shouldn't touch anything on
          it. It will go away after the submission is done, don't worry.
        </ListItem>
      </UnorderedList>
      <Heading marginTop={16} marginBottom={4}>
        Views
      </Heading>
      <Heading size={400} marginTop={8} marginBottom={4}>
        predictions
      </Heading>
      <Text>
        The predictions view can be hidden or shown via the{" "}
        <Strong>"Show Predictions"</Strong> button in the Quick Actions
      </Text>
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
