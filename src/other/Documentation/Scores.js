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

export const Scores = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Scores
      </Heading>
      <Paragraph>
        The scores feature controls the scores for all of the scoreboard OBS
        views, and is based on the final map score of each map. Icons for the
        scores Views can be set within the settings. If a custom icon is not set
        in the settings, the dashboard will attempt to fetch the logos from
        various databases, otherwise it will display the default valorant logo
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Views
      </Heading>
      <Heading size={400} marginTop={8} marginBottom={4}>
        scores
      </Heading>
      <Text>
        A view for scores while in a valorant game. The colour of this is based
        on the colour specified in the settings. Shows the map scores, the best
        of number (e.g. Bo3), and team icons.
      </Text>
      <Text>
        <Strong>OBS Values:</Strong>
      </Text>
      <UnorderedList>
        <ListItem>
          <Strong>Width:</Strong> <Code>1920</Code>
        </ListItem>
        <ListItem>
          <Strong>Height:</Strong> <Code>1080</Code>
        </ListItem>
      </UnorderedList>
      <Heading size={400} marginTop={8} marginBottom={4}>
        scores_start
      </Heading>
      <Text>
        A view for scores <Strong>before</Strong> starting a game, and provides
        a Team A <Strong>VS</Strong> Team B format. Doesn't display any map
        scores as both should be set to 0 at that point.
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
      <Heading size={400} marginTop={8} marginBottom={4}>
        scores_break
      </Heading>
      <Text>
        A view for scores during a break, or a scoreboard for various other OBS
        scenes that aren't the main game.
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
      <Heading size={400} marginTop={8} marginBottom={4}>
        scores_characterselect
      </Heading>
      <Text>
        A view for scores during the character select stage of a valorant game.
        Data is positioned specifically for a <Code>1920x1080</Code> resolution.
        If using another resolution, it could break.
      </Text>
      <Text>
        <Strong>OBS Values:</Strong>
      </Text>
      <UnorderedList>
        <ListItem>
          <Strong>Width:</Strong> <Code>1920</Code>
        </ListItem>
        <ListItem>
          <Strong>Height:</Strong> <Code>1080</Code>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
