function init() {
  // Use standard light OpenStreetMap tiles for professional clarity
  map = L.map('map', { zoomControl: true }).setView([HUB.lat, HUB.lon], 9);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>', maxZoom: 19
  }).addTo(map);

  // Hub marker: simple square black H
  hubMarker = L.marker([HUB.lat, HUB.lon], {
    icon: L.divIcon({html: createSquareIcon('H', '#000'), className:'', iconSize:[18,18], iconAnchor:[9,9]})
  }).addTo(map).bindPopup('<div class="popup-header">Calgary Hub</div>250 Aero Link NE');

  let totalStops = 0, totalDist = 0, totalWeight = 0, totalPieces = 0, totalRun = 0, totalSvc = 0, totalVol = 0;

  ROUTES.forEach((r, i) => {
    const color = COLORS[i % COLORS.length];
    r.ui_color = color; // Store for table access
    visible[r.vehicle_id] = true;

    const lg = L.featureGroup().addTo(map);
    layerGroups[r.vehicle_id] = lg;

    let coords;
    if (r.geometry) {
      coords = decodePolyline(r.geometry);
    } else {
      coords = [[HUB.lat, HUB.lon]];
      r.stops.forEach(s => coords.push([s.lat, s.lon]));
      coords.push([HUB.lat, HUB.lon]);
    }
    
    // Thick solid line for professional routing
    L.polyline(coords, {color: '#000', weight: 5, opacity: 0.8 }).addTo(lg);
    L.polyline(coords, {color, weight: 3, opacity: 1.0 }).addTo(lg); 

    r.stops.forEach(s => {
      const marker = L.marker([s.lat, s.lon], {
        icon: L.divIcon({ html: createSquareIcon(s.seq, color), className:'', iconSize:[18,18], iconAnchor:[9,9] })
      }).addTo(lg);

      marker.bindPopup(`
        <div class="popup-header">Stop #${s.seq} — ${cleanName(s.name)}</div>
        <div class="popup-row"><span>Customer ID:</span> <b>${s.customer_id}</b></div>
        <div class="popup-row"><span>Address:</span> <b>${s.address}</b></div>
        <div class="popup-row"><span>Weight:</span> <b>${s.weight_kg} kg</b></div>
        <div class="popup-row"><span>Volume:</span> <b>${s.volume_m3} m³</b></div>
        <div class="popup-row"><span>Qty:</span> <b>${s.pieces}</b></div>
        <div class="popup-row"><span>Vehicle:</span> <b>V-${r.vehicle_id}</b></div>
      `);
    });

    totalStops += r.num_stops;
    totalDist += r.distance_km;
    totalWeight += r.total_weight_kg;
    totalPieces += r.total_pieces;
    totalRun += r.duration_min;
    totalSvc += r.service_min;
    totalVol += r.total_volume_m3;
  });

  // Unassigned markers: Red squares with X
  let uaLayer = L.layerGroup().addTo(map);
  UNASSIGNED.forEach(u => {
    if (u.lat == null || u.lon == null) return;
    const marker = L.marker([u.lat, u.lon], {
      icon: L.divIcon({ html: createSquareIcon('X', '#d9534f'), className: '', iconSize: [18, 18], iconAnchor: [9, 9] })
    }).addTo(uaLayer);
    
    marker.bindPopup(`
      <div class="popup-header" style="color:var(--danger)">Unassigned: ${cleanName(u.name) || 'Stop ' + u.id}</div>
      <div class="popup-row"><span>Reason:</span> <b>${u.reason}</b></div>
      <div class="popup-row"><span>Address:</span> <b>${u.address || 'N/A'}</b></div>
      <div class="popup-row"><span>Weight:</span> <b>${u.weight_kg} kg</b></div>
    `);
  });

  // Dashboard Metrics
  document.getElementById('valVehicles').innerText = ROUTES.length;
  document.getElementById('valStops').innerText = fmtNum(totalStops);
  document.getElementById('valDist').innerText = fmtNum(totalDist) + ' km';
  document.getElementById('valWeight').innerText = fmtNum(totalWeight) + ' kg';
  
  if (UNASSIGNED.length > 0) {
      document.getElementById('cardUnassigned').style.display = 'flex';
      document.getElementById('valUnassigned').innerText = UNASSIGNED.length;
  }
  
  // Table footer totals mapped to columns
  document.getElementById('routeTableFoot').innerHTML = `
    <tr style="background:var(--bg-main); font-weight:700; border-top:2px solid var(--accent); color:var(--text-primary);">
      <td colspan="5" style="text-align:right; padding-right:16px; border:none;">TOTALS</td>
      <td class="col-num" style="border:none;">${fmtNum(totalStops)}</td>
      <td class="col-num" style="border:none;">${fmtNum(totalDist)}</td>
      <td class="col-num" style="border:none;">${Math.floor((totalRun+totalSvc)/60)}h ${Math.round((totalRun+totalSvc)%60)}m</td>
      <td class="col-num" style="border:none;">${Math.floor(totalSvc/60)}h ${totalSvc%60}m</td>
      <td class="col-num" style="border:none;">${fmtNum(totalWeight)}</td>
      <td class="col-num" style="border:none;">${fmtNum(totalVol)}</td>
      <td class="col-num" style="border:none;">${fmtNum(totalPieces)}</td>
    </tr>
  `;
  document.getElementById('routeTotals').innerText = `Routes: ${ROUTES.length}`;
  document.getElementById('tabUaCount').innerText = UNASSIGNED.length;

  renderRouteTable();
  renderUnassignedTable();
  
  // Event listeners for Show all / Hide all
  document.getElementById('btnShowAll').addEventListener('click', function() {
      ROUTES.forEach(r => toggleRouteVisibility(r.vehicle_id, true));
      renderRouteTable();
  });
  document.getElementById('btnHideAll').addEventListener('click', function() {
      ROUTES.forEach(r => toggleRouteVisibility(r.vehicle_id, false));
      renderRouteTable();
  });

  if (ROUTES.length > 0) {
      setTimeout(() => zoomMapToAll(), 300);
      selectRoute(ROUTES[0].vehicle_id); // Auto-select first route
  }
}
