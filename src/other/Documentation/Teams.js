import { Heading, Paragraph } from "evergreen-ui"
import { Fragment } from "react"

export const Teams = () => {
  return (
    <Fragment>
      <Heading marginTop={16} marginBottom={4}>
        How to use Teams
      </Heading>
      <Paragraph>
        The teams feature is probably the most simple to use out of them all.
        Enter teams, as well as team tags, into the inputs provided. On
        submission, if any OBS views are open then they should be automatically
        updated. In the situation where a view does not update, a refresh should
        work to fix it.
      </Paragraph>
    </Fragment>
  )
}
