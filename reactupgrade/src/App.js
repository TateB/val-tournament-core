import "./App.css"
import features from "./Features/etc/Features"

const renderFeatures = features.map((feature) => (
  <div className="Feature" key={feature.name}>
    <feature.element />
  </div>
))

function App() {
  return <div className="App">{renderFeatures}</div>
}

export default App
