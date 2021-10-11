import {
  Code,
  Heading,
  ListItem,
  OrderedList,
  Paragraph,
  Strong,
  Text,
  UnorderedList,
} from "evergreen-ui"
import { Fragment } from "react"

export const MapBans = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Map Bans
      </Heading>
      <Text>
        The map bans feature is pretty simple, and the UI is mostly
        self-explanatory.
      </Text>
      <Heading marginTop={16} marginBottom={4}>
        Veto Log Input
      </Heading>
      <Paragraph>
        The veto log input (the massive text input on the left side of the
        dashboard) accepts a paragraph of text which contains all of the map
        vetos (picks/bans). Entries are accepted <Strong>per line</Strong>,
        meaning there should only be <Strong>ONE</Strong> map on each line. The
        data should be processed no matter what the input is, but in the case
        that it isn't working for you the format is as follows:
      </Paragraph>
      <OrderedList>
        <ListItem>
          The team name/tag of the team <Strong>choosing</Strong> the map, this
          value can also be AUTO if the map is autopicked/banned
        </ListItem>
        <ListItem>
          A word for the pick/ban (should accept most variants, e.g. picks,
          pick, picked)
        </ListItem>
        <ListItem>The map name which is being focused for the veto</ListItem>
        <ListItem>
          <Strong>For Picks:</Strong> The chosen side of the opposing team, if
          the team pick value was AUTO, this will automatically be selected
        </ListItem>
      </OrderedList>
      <Heading marginTop={16} marginBottom={4}>
        Manual Input
      </Heading>
      <Paragraph>
        The manual input provides manual selection of each of the variables for
        a map, however please remember you <Strong>NEED</Strong> to still submit
        the map with the main submit button. Otherwise the changes will not be
        processed.
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Views
      </Heading>
      <Heading size={400} marginTop={8} marginBottom={4}>
        mapbans
      </Heading>
      <Text>
        <Strong>OBS Values:</Strong>
      </Text>
      <UnorderedList>
        <ListItem>
          <Strong>Width:</Strong> <Code>1500</Code>
        </ListItem>
        <ListItem>
          <Strong>Height:</Strong> <Code>720</Code>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
