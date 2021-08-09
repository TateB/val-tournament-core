import { Table } from "evergreen-ui"
import { useEffect, useState } from "react"

const capitalize = (s) => (s && s[0].toUpperCase() + s.slice(1)) || ""

function Preview(props) {
  const [mapPicks, setMapPicks] = useState([
    {
      map: "Ascent",
      pickBan: "Ban",
      chosenBy: "Team A",
      oppositionStart: "None",
    },
    {
      map: "Icebox",
      pickBan: "Ban",
      chosenBy: "Team A",
      oppositionStart: "None",
    },
    {
      map: "Breeze",
      pickBan: "Pick",
      chosenBy: "Team B",
      oppositionStart: "Defence",
    },
    {
      map: "Bind",
      pickBan: "Pick",
      chosenBy: "Team B",
      oppositionStart: "Attack",
    },
    {
      map: "Haven",
      pickBan: "Pick",
      chosenBy: "Team B",
      oppositionStart: "Defence",
    },
    { map: "Split", pickBan: "Ban", chosenBy: "Auto", oppositionStart: "None" },
  ])

  useEffect(() => {
    setMapPicks(
      props.mapBans.map((m) => ({
        map: props.maps[m.map].name,
        pickBan: m.isBan === 0 ? "Pick" : "Ban",
        chosenBy: m.teamPick === 2 ? "Auto" : props.teams[m.teamPick].name,
        oppositionStart: ["Attack", "Defence", "None"][m.sidePick],
      }))
    )
  }, [props])

  if (props.teams[0] === undefined) return null

  return (
    <Table flexGrow="1" width="100%" marginLeft={32}>
      <Table.Head>
        <Table.TextHeaderCell>Map Name</Table.TextHeaderCell>
        <Table.TextHeaderCell>Pick/Ban</Table.TextHeaderCell>
        <Table.TextHeaderCell>Team</Table.TextHeaderCell>
        <Table.TextHeaderCell>Starting Side</Table.TextHeaderCell>
      </Table.Head>
      <Table.Body height={240}>
        {mapPicks.map((map) => (
          <Table.Row height={40} key={map.map}>
            <Table.TextCell>{capitalize(map.map)}</Table.TextCell>
            <Table.TextCell>{map.pickBan}</Table.TextCell>
            <Table.TextCell>{map.chosenBy}</Table.TextCell>
            <Table.TextCell>{map.oppositionStart}</Table.TextCell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default Preview
