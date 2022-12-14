import * as ROT from 'rot-js';
import Tile from './tile';
import Entity from './entity';

class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.map = new Array(this.width);
    for (let i = 0; i < this.map.length; i++) {
      this.map[i] = new Array(this.height);
    }
    this.freeTiles = {};
  }

  // create map, generate tiles, and track free tiles
  createMap() {
    const digger = new ROT.Map.Digger(this.width, this.height);
    this.freeTiles = {};
    const diggerCallback = (x, y, value) => {
      this.map[x][y] = (value === 0) ? new Tile(x, y, 'floor') : new Tile(x, y, 'wall');
      if (!value) {
        this.freeTiles[`${x}x${y}`] = this.map[x][y];
      }
    };
    digger.create(diggerCallback);
  };

  // generate jsx for map tiles
  drawMap() {
    let rows = [];
    let row;
    for (let y = 0; y < this.height; y++) {
      row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(<span className={`tile ${this.map[x][y].tileClass}`} key={x}></span>);
      }
      rows.push(<div className='row' key={y}>{row}</div>);
    }
    return (rows);
  };

  // construct a map from a 2d array
  static constructMap(map) {
    let tempMap = { ...map };
    map = new Map(tempMap.width, tempMap.height);
    for (let x = 0; x < map.width; x++) {
      for (let y = 0; y < map.height; y++) {
        switch (tempMap.map[x][y].tileClass) {
          case 'player': case 'health': case 'enemy': case 'exit': {
            map.map[x][y] = new Entity(tempMap.map[x][y].x,
              tempMap.map[x][y].y, tempMap.map[x][y].tileClass,
              tempMap.map[x][y].entityName, tempMap.map[x][y].attributes);
            break;
          }
          case 'wall': case 'floor': {
            map.map[x][y] = new Tile(tempMap.map[x][y].x,
              tempMap.map[x][y].y, tempMap.map[x][y].tileClass);
            break;
          }
          default:
            break;
        }
      }
    }
    map.freeTiles = tempMap.freeTiles;
    return map;
  }

}

export default Map;