import { Pane, Text } from "evergreen-ui"
import { Component } from "react"
import Layout from "./etc/Layout"

class Timer extends Component {
  render() {
    return (
      <Layout
        name={this.props.name}
        openAppCallback={this.props.openAppCallback}
        openedApp={this.props.openedApp}
      >
        <Pane>
          <Text>
            Eos ea sunt velit sint et voluptatem eius dolor. Aut voluptatem non
            ducimus dolorem. Inventore consequatur ratione aliquam molestias
            provident est aperiam. Mollitia qui libero quas perspiciatis. Dicta
            at nam voluptas et. Vero illo nihil numquam culpa est minima eaque
            quia. Nisi fugiat rerum modi aut. Delectus repellendus nihil
            tempore.
          </Text>
        </Pane>
      </Layout>
    )
  }
}

export default Timer
