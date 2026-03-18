let currentSortCol = null;
let currentSortDir = 'asc';

function timeToMins(t) {
    if (!t || t === 'N/A') return 0;
    const parts = t.match(/(\d+):(\d+)\s+(AM|PM)/);
    if (!parts) return 0;
    let h = parseInt(parts[1], 10);
    const m = parseInt(parts[2], 10);
    if (parts[3] === 'PM' && h < 12) h += 12;
    if (parts[3] === 'AM' && h === 12) h = 0;
    return h * 60 + m;
}

function sortTable(col) {
    if (currentSortCol === col) {
        currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortCol = col;
        currentSortDir = 'asc';
    }
    
    document.querySelectorAll('#routeTable th').forEach(th => {
        th.classList.remove('sorted-col');
        const arrow = th.querySelector('.sort-arrow');
        if (arrow) arrow.innerText = '↕';
    });
    const header = document.querySelector(`th[data-col="${col}"]`);
    if (header) {
        header.classList.add('sorted-col');
        let arrowEl = header.querySelector('.sort-arrow');
        if (arrowEl) arrowEl.innerText = currentSortDir === 'asc' ? '▲' : '▼';
    }
    
    ROUTES.sort((a, b) => {
        let valA, valB;
        switch(col) {
            case 'id': valA = a.vehicle_id; valB = b.vehicle_id; break;
            case 'start': valA = timeToMins(a.start_time); valB = timeToMins(b.start_time); break;
            case 'end': valA = timeToMins(a.end_time); valB = timeToMins(b.end_time); break;
            case 'stops': valA = a.num_stops; valB = b.num_stops; break;
            case 'dist': valA = a.distance_km; valB = b.distance_km; break;
            case 'runtime': valA = a.duration_min; valB = b.duration_min; break;
            case 'svc': valA = a.service_min; valB = b.service_min; break;
            case 'weight': valA = a.total_weight_kg; valB = b.total_weight_kg; break;
            case 'vol': valA = a.total_volume_m3; valB = b.total_volume_m3; break;
            case 'pieces': valA = a.total_pieces; valB = b.total_pieces; break;
        }
        
        if (valA < valB) return currentSortDir === 'asc' ? -1 : 1;
        if (valA > valB) return currentSortDir === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderRouteTable();
}

function toggleAccordion(event, vehicle_id) {
    event.stopPropagation();
    const detailsRow = document.getElementById(`details-row-${vehicle_id}`);
    const chev = document.getElementById(`chev-${vehicle_id}`);
    
    if (detailsRow.classList.contains('open')) {
        detailsRow.classList.remove('open');
        chev.innerText = '▶';
    } else {
        detailsRow.classList.add('open');
        chev.innerText = '▼';
        selectRoute(vehicle_id);
    }
}

function selectRoute(vehicle_id) {
    if (selectedRouteId !== vehicle_id) {
        // Close old visually
        if (selectedRouteId) {
            const oldRow = document.getElementById(`route-row-${selectedRouteId}`);
            const oldDetails = document.getElementById(`details-row-${selectedRouteId}`);
            const oldChev = document.getElementById(`chev-${selectedRouteId}`);
            if(oldRow) oldRow.classList.remove('selected', 'active-map-route');
            if(oldDetails) oldDetails.classList.remove('open');
            if(oldChev) oldChev.innerText = '▶';
        }
        
        // Open new visually
        selectedRouteId = vehicle_id;
        const newRow = document.getElementById(`route-row-${selectedRouteId}`);
        const newDetails = document.getElementById(`details-row-${selectedRouteId}`);
        const newChev = document.getElementById(`chev-${selectedRouteId}`);
        
        if(newRow) newRow.classList.add('selected', 'active-map-route');
        if(newDetails) newDetails.classList.add('open');
        if(newChev) newChev.innerText = '▼';
    } else {
        // Toggle open/close when clicking the already-selected row
        const currentDetails = document.getElementById(`details-row-${selectedRouteId}`);
        const currentChev = document.getElementById(`chev-${selectedRouteId}`);
        if (currentDetails) {
            if (currentDetails.classList.contains('open')) {
                currentDetails.classList.remove('open');
                if(currentChev) currentChev.innerText = '▶';
            } else {
                currentDetails.classList.add('open');
                if(currentChev) currentChev.innerText = '▼';
            }
        }
    }
    
    // Only focus map on route bounds if map is expanded
    const isExpanded = document.querySelector('.split-container').classList.contains('map-expanded');
    if(visible[vehicle_id] && isExpanded) {
        const lg = layerGroups[vehicle_id];
        if (lg) map.fitBounds(lg.getBounds().pad(0.1));
    }
}

function toggleMapExpand() {
  const container = document.querySelector('.split-container');
  container.classList.toggle('map-expanded');
  const btn = document.getElementById('btnExpandMap');
  
  if (container.classList.contains('map-expanded')) {
      btn.innerHTML = 'Collapse Map &raquo;';
  } else {
      btn.innerHTML = '&laquo; Expand Map';
  }
  // Delay slightly to allow CSS transition to finish before invalidating map size
  setTimeout(() => { if(map) map.invalidateSize(); }, 400);
}

function handleRowClick(event, vehicle_id) {
    // Chevron uses stopPropagation, so this runs only when clicking the row (not chevron)
    const show = !visible[vehicle_id];
    toggleRouteVisibility(vehicle_id, show);
    renderRouteTable();
}

function switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    
    // Show active tab
    const selectedTabEl = Array.from(document.querySelectorAll('.tab')).find(t => t.innerText.toLowerCase().includes(tabId.toLowerCase()));
    if(selectedTabEl) selectedTabEl.classList.add('active');
    
    const panel = document.getElementById(`tab-${tabId}`);
    if(panel) panel.classList.add('active');
}

function toggleRouteVisibility(vid, show) {
    visible[vid] = show;
    if (show) {
        layerGroups[vid].addTo(map);
    } else {
        map.removeLayer(layerGroups[vid]);
    }
}

function zoomMapToAll() {
  const allCoords = [[HUB.lat, HUB.lon]];
  ROUTES.forEach(r => r.stops.forEach(s => allCoords.push([s.lat, s.lon])));
  UNASSIGNED.forEach(u => { if (u.lat != null) allCoords.push([u.lat, u.lon]); });
  if (allCoords.length > 1) {
    map.fitBounds(L.latLngBounds(allCoords).pad(0.05));
  }
}

function zoomMapHub() {
    map.setView([HUB.lat, HUB.lon], 13);
}

