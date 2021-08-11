import { useLiveQuery } from "dexie-react-hooks"
import { Dialog, HelpIcon, IconButton, Pane, Tab, Tablist } from "evergreen-ui"
import { Fragment, useEffect, useState } from "react"
import db from "../db/db"
import { tabs } from "./Documentation/DocumentationFiles"

export const Documentation = () => {
  const needsIntro = useLiveQuery(() =>
    db.settings.get("general").then((obj) => obj.settings.needsIntro)
  )
  const [isShowing, setIsShowing] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (!needsIntro) return
    setIsShowing(true)
    db.settings
      .where("name")
      .equals("general")
      .modify({ "settings.needsIntro": false })
  }, [needsIntro])

  return (
    <Fragment>
      <Dialog
        isShown={isShowing}
        title="How to use"
        onCloseComplete={() => setIsShowing(false)}
        hasFooter={false}
        width="70%"
      >
        <Tablist>
          {tabs.map((tab, index) => (
            <Tab
              key={tab.name}
              id={tab.name}
              onSelect={() => setSelectedIndex(index)}
              isSelected={index === selectedIndex}
            >
              {tab.name}
            </Tab>
          ))}
        </Tablist>
        <Pane padding={16}>
          {tabs.map((tab, index) => (
            <Pane
              display={index === selectedIndex ? "flex" : "none"}
              key={tab.name}
              flexDirection="column"
            >
              <tab.Element />
            </Pane>
          ))}
        </Pane>
      </Dialog>

      <IconButton
        icon={HelpIcon}
        appearance="minimal"
        borderRadius="100%"
        width={32}
        height={32}
        marginTop={8}
        marginRight={8}
        onClick={() => setIsShowing(true)}
      />
    </Fragment>
  )
}
