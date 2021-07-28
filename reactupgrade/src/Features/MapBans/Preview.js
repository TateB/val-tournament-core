import { Table } from "evergreen-ui"
import { useState } from "react"

function Preview() {
  const [mapPicks] = useState([
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
          <Table.Row
            height={40}
            key={map.map}
            isSelectable
            onSelect={() => alert(map.map)}
          >
            <Table.TextCell>{map.map}</Table.TextCell>
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
