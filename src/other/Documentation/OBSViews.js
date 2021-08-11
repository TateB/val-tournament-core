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

export const OBSViews = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        Important Information
      </Heading>
      <Text>
        Using OBS Views requires that your browser is open while streaming,
        otherwise your OBS View will lose connection, and not work properly.
      </Text>
      <Heading marginTop={16} marginBottom={4}>
        How to add to OBS
      </Heading>
      <Paragraph>
        Adding to OBS is pretty simple. The features that have OBS views will
        show dots next to them on the main page, which contains information
        about them. For all views, you can hover over the button, click to copy
        the URL to your clipboard, and paste it into a Browser Source in OBS.
        All OBS views <Strong>should</Strong> update automatically, and live.
        However, in the case that you encounter a bug or issue, refreshing the
        main dashboard will attempt to reconnect all OBS views which should fix
        your issue.
      </Paragraph>
      <Heading marginTop={16} marginBottom={4}>
        Browser source settings
      </Heading>
      <UnorderedList>
        <ListItem>
          Width and height are specified within the other tabs in this
          documentation
        </ListItem>
        <ListItem>
          Shutdown source when not visible should be set to{" "}
          <Code>unticked</Code>
        </ListItem>
        <ListItem>
          Refresh browser when scene becomes active should be set to{" "}
          <Code>unticked</Code>
        </ListItem>
      </UnorderedList>
    </Fragment>
  )
}
