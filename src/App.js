import React, { Component } from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL, { GeoJsonLayer } from 'deck.gl'
import data from './uf.json'
import 'mapbox-gl/dist/mapbox-gl.css'

const INITIAL_VIEW_STATE = {
  latitude: -13.796818,
  longitude: -38.190109,
  zoom: 3.2,
  maxZoom: 16,
  pitch: 45,
  bearing: 10
}

const COLOR_SCALE = [
  [254,240,217],
  [253,212,158],
  [253,187,132],
  [252,141,89],
  [227,74,51],
  [179,0,0]
];



function colorScale(densidade, prop='1') {
  if(densidade <= 9) {
    return  prop === 'color' ? COLOR_SCALE[0] : 100
  }
  if(densidade <= 24) {
    return prop === 'color' ? COLOR_SCALE[1] : 200
  }
  if(densidade <= 49) {
    return prop === 'color' ? COLOR_SCALE[2] : 300
  }
  if(densidade <= 99) {
    return prop === 'color' ? COLOR_SCALE[3] : 400
  }
  if(densidade <= 299) {
    return prop === 'color' ? COLOR_SCALE[4] : 500
  }
  if(densidade >= 300) {
    return prop === 'color' ? COLOR_SCALE[5] : 600
  }
}

class App extends Component {

  state = {
    x: 0,
    y: 0,
    hoveredObject: null
  }

  componentDidMount() {
    console.log(data)
  }

  _renderLayer = () => {
    return  new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: true,
      filled: true,
      fp64: true,
      extruded: true,
      wireframe: true,
      elevationScale: 1000,
      getFillColor: d => colorScale(d.properties.densidade, 'color'),
      getElevation: d =>  Math.round(colorScale(d.properties.densidade)),
      onHover: this._onHover
    
    });
  }

  _onHover = ({x, y, object}) => {
    this.setState({x, y, hoveredObject: object});
  }

  _renderTooltip = () => {
    const {x, y, hoveredObject} = this.state;
    return (
      hoveredObject && (
        <div className="tooltip" style={{top: y, left: x}}>
          <div>
            <b>{`${hoveredObject.properties.NOME_UF} - ${hoveredObject.properties.UF_05}`}</b>
          </div>
          <div>
              {`Densidade: ${hoveredObject.properties.densidade}`}
          </div>
        </div>
      )
    );
  }
  render() {
    return (
      <DeckGL 
        initialViewState={INITIAL_VIEW_STATE}
        layers={[this._renderLayer()]} 
        controller>
        <StaticMap 
          mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v9"/>
          {this._renderTooltip}
      </DeckGL>
    )
  }
}

export default App
