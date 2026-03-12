// Shared runtime state for the hardcoded dashboard
const COLORS = [
  '#E31A1C', '#1F78B4', '#33A02C', '#FF7F00', '#6A3D9A',
  '#B15928', '#A6CEE3', '#B2DF8A', '#FB9A99', '#FDBF6F',
  '#CAB2D6', '#FFFF99', '#8DD3C7', '#BEBADA', '#FB8072',
  '#80B1D3', '#FDB462', '#B3DE69', '#FCCDE5', '#D9D9D9'
];

let map, hubMarker;
let layerGroups = {};   
let visible = {};       
let selectedRouteId = null;
