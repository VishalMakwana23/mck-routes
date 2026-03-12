function decodePolyline(encoded) {
  const points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0;
    result = 0;
    do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

function fmtNum(n) {
  return n.toLocaleString('en-US');
}

function cleanName(n) {
  if (!n) return '';
  return n.replace(/^.*?-/, '').trim();
}

function createSquareIcon(text, bgColor) {
  return `<div style="
      background-color: ${bgColor};
      color: ${bgColor === '#FFFF99' ? '#000' : '#FFF'};
      border: 2px solid rgba(255,255,255,0.85);
      font-weight: 800; font-size: 10px; font-family: 'Manrope', sans-serif;
      width: 22px; height: 22px; line-height: 18px;
      text-align: center;
      border-radius: 8px;
      box-shadow: 0 10px 18px rgba(16,33,29,0.28);
  ">${text}</div>`;
}
