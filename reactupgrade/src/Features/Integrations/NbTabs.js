import {
  Pane,
  Text,
  SelectField,
  Card,
  Strong,
  TextInput,
  IconButton,
  PlusIcon,
  DeleteIcon,
  RemoveIcon,
  MinusIcon,
} from "evergreen-ui"
import { Fragment, useEffect, useState } from "react"

export const Commands = (props) => {
  return (
    <Pane
      key={props.index}
      id="panel-commands"
      role="tabpanel"
      aria-labelledby="commands"
      aria-hidden={props.index !== props.selectedIndex}
      display={props.index === props.selectedIndex ? "flex" : "none"}
      width="100%"
      alignItems="center"
      flexDirection="column"
    >
      {props.settings.commands.map((command, inx) => (
        <Card
          background="tint2"
          marginY={8}
          key={command.name}
          display="flex"
          alignItems="center"
          flexDirection="row"
          width="100%"
          elevation={1}
        >
          <Pane paddingLeft={16} flexDirection="column" flexGrow="1">
            <Strong>
              {command.name.replace(/\b[a-z]/gi, (char) => char.toUpperCase())}
            </Strong>
            <br />
            <Text>{command.example}</Text>
          </Pane>
          <Pane paddingRight={16} flexDirection="column">
            <SelectField
              marginTop={16}
              value={command.id}
              onChange={(e) => props.setCommand(inx, e.target.value)}
            >
              {props.nightbotCommands.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </SelectField>
          </Pane>
        </Card>
      ))}
    </Pane>
  )
}

export const Casters = (props) => {
  const defaultCaster = {
    name: "Streamer",
    infoVals: [
      { name: "Username", value: "" },
      { name: "URL", value: "" },
    ],
  }
  const [newCaster, _setNewCaster] = useState(defaultCaster)

  const setNewCaster = (inx, newVal) => {
    _setNewCaster((prevState) => {
      const prevSettings = { ...prevState }
      prevSettings.infoVals[inx].value = newVal
      return prevSettings
    })
  }

  const intAddNewCaster = () => {
    props.addNewCaster(newCaster)
    _setNewCaster(defaultCaster)
  }

  return (
    <Pane
      key={props.index}
      id="panel-commands"
      role="tabpanel"
      aria-labelledby="commands"
      aria-hidden={props.index !== props.selectedIndex}
      display={props.index === props.selectedIndex ? "flex" : "none"}
      width="100%"
      alignItems="center"
      flexDirection="column"
    >
      <Card
        background="tint2"
        marginTop={8}
        marginBottom={4}
        padding={8}
        display="flex"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-evenly"
        width="100%"
        elevation={1}
      >
        <Strong marginLeft="30px" width="50%" textAlign="center">
          Username
        </Strong>
        <Strong width="50%" textAlign="center">
          URL
        </Strong>
      </Card>
      {props.settings.casters.map((caster, inx) => (
        <Card
          background="tint2"
          marginY={8}
          padding={8}
          key={inx}
          display="flex"
          alignItems="center"
          flexDirection="row"
          width="100%"
          elevation={1}
        >
          {inx > 0 ? (
            <IconButton
              icon={MinusIcon}
              intent="danger"
              onClick={() => props.removeCaster(inx)}
            />
          ) : (
            <IconButton icon={MinusIcon} intent="danger" disabled />
          )}
          {caster.infoVals.map((item, ii) => (
            <TextInput
              marginX={4}
              placeholder={item.name}
              onChange={(e) => props.setOther("casters", ii, item.value)}
              value={item.value}
            />
          ))}
        </Card>
      ))}
      <Card
        background="tint2"
        marginY={8}
        padding={8}
        display="flex"
        alignItems="center"
        flexDirection="row"
        width="100%"
        elevation={1}
      >
        <IconButton
          icon={PlusIcon}
          intent="success"
          onClick={() => intAddNewCaster()}
          disabled={
            newCaster.infoVals[0].value === "" ||
            newCaster.infoVals[1].value === ""
          }
        />
        {newCaster.infoVals.map((item, ii) => (
          <TextInput
            marginX={4}
            placeholder={item.name}
            onChange={(e) => setNewCaster(ii, e.target.value)}
            value={item.value}
          />
        ))}
      </Card>
    </Pane>
  )
}

export const MatchInfo = (props) => {
  return (
    <Pane
      key={props.index}
      id="panel-commands"
      role="tabpanel"
      aria-labelledby="commands"
      aria-hidden={props.index !== props.selectedIndex}
      display={props.index === props.selectedIndex ? "flex" : "none"}
      width="100%"
      alignItems="center"
      flexDirection="column"
    >
      {props.settings.matchInformation.map((info, inx) => (
        <Card
          background="tint2"
          marginY={8}
          key={info.name}
          display="flex"
          alignItems="center"
          flexDirection="row"
          width="100%"
          elevation={1}
        >
          <Pane paddingLeft={16} flexDirection="column" flexGrow="1">
            <Strong>
              {info.name.replace(/\b[a-z]/gi, (char) => char.toUpperCase())}
            </Strong>
          </Pane>
          <Pane paddingRight={16} flexDirection="column">
            {info.infoVals.map((item, ii) => (
              <Pane
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Text width="50px">{item.name}</Text>
                <TextInput
                  marginY={4}
                  placeholder={item.name}
                  onChange={(e) =>
                    props.setOther("matchInformation", inx, ii, e.target.value)
                  }
                  value={item.value}
                />
              </Pane>
            ))}
          </Pane>
        </Card>
      ))}
    </Pane>
  )
}

export const NbTabs = [
  { name: "Commands", dbRef: "commands", element: Commands },
  { name: "Casters", dbRef: "casters", element: Casters },
  { name: "Match Info", dbRef: "matchInformation", element: MatchInfo },
]
