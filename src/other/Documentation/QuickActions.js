import {
  Heading,
  ListItem,
  Paragraph,
  Strong,
  UnorderedList,
} from "evergreen-ui"
import { Fragment } from "react"

export const QuickActions = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Quick Actions
      </Heading>
      <Paragraph>
        Quick actions are the buttons that are above all of the feature panels.
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Available Buttons
      </Heading>
      <UnorderedList>
        <ListItem>
          <Strong>Swap Teams:</Strong> Swap the teams on the scores and
          scores_characterselect OBS views.
        </ListItem>
        <ListItem>
          <Strong>Show Predictions:</Strong> Show the predictions on the
          predictions OBS view.
        </ListItem>
        <ListItem>
          <Strong>More coming soon...</Strong>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
