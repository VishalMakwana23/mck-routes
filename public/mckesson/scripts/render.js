function generateStopsTableHTML(r) {
    let rows = r.stops.map(s => {
        return `
            <tr>
                <td class="col-center" style="width: 40px">${s.seq}</td>
                <td title="${s.name}">${cleanName(s.name)}</td>
                <td title="${s.address}">${s.address}</td>
                <td class="col-num" style="width: 60px">${s.weight_kg}</td>
                <td class="col-num" style="width: 60px">${fmtNum(s.volume_in3)}</td>
                <td class="col-num" style="width: 50px">${s.pieces}</td>
                <td class="col-num" style="width: 60px">${s.service_min}</td>
            </tr>
        `;
    }).join('');
    
    return `
        <div class="details-container">
            <h4 style="margin-bottom: 4px; color: var(--accent); font-weight: 600;">Stop Sequence for Vehicle ${r.vehicle_id}</h4>
            <table class="stops-table">
                <thead>
                    <tr>
                        <th style="width: 40px" class="col-center">Seq</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th style="width: 60px" class="col-right">Weight</th>
                        <th style="width: 60px" class="col-right">Volume</th>
                        <th style="width: 50px" class="col-right">Pieces</th>
                        <th style="width: 60px" class="col-right">Svc Min</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

// Render the main master-detail accordion grid
function renderRouteTable() {
    const tbody = document.getElementById('routeTableBody');
    
    // Preserve currently expanded rows across re-renders (like sorting)
    let expandedIds = new Set();
    document.querySelectorAll('.details-row.open').forEach(row => {
        const idStr = row.id.replace('details-row-', '');
        if (idStr) expandedIds.add(Number(idStr));
    });
    
    let html = '';
    ROUTES.forEach(r => {
        const isSelected = selectedRouteId === r.vehicle_id;
        const swatchClass = visible[r.vehicle_id] ? '' : 'hidden';
        const activeClass = isSelected ? 'selected active-map-route' : '';
        
        // Use preserved expand state if it existed, otherwise default to closed
        // selectRoute() will visually open it subsequent to initial rendering
        const isOpen = expandedIds.has(r.vehicle_id);
        const chevron = isOpen ? '▼' : '▶';
        const openClass = isOpen ? 'open' : '';
        
        // Master Row - entire row click toggles map visibility; chevron expands/collapses
        html += `
            <tr class="route-row ${activeClass}" id="route-row-${r.vehicle_id}" onclick="handleRowClick(event, ${r.vehicle_id})">
                <td class="col-center"><span class="expand-btn" id="chev-${r.vehicle_id}" onclick="toggleAccordion(event, ${r.vehicle_id})">${chevron}</span></td>
                <td class="col-center">
                    <div class="color-swatch swatch-toggle ${swatchClass}" style="background-color: ${r.ui_color}" title="Click row to show/hide on map" aria-label="Route V-${r.vehicle_id} ${visible[r.vehicle_id] ? 'visible' : 'hidden'} on map"></div>
                </td>
                <td>V-${r.vehicle_id}</td>
                <td class="hide-on-expand">${r.start_time}</td>
                <td class="hide-on-expand">${r.end_time}</td>
                <td class="col-num">${r.num_stops}</td>
                <td class="col-num">${fmtNum(r.distance_km)}</td>
                <td class="col-num hide-on-expand">${Math.floor((r.duration_min+r.service_min)/60)}h ${Math.round((r.duration_min+r.service_min)%60)}m</td>
                <td class="col-num hide-on-expand">${Math.floor(r.service_min/60)}h ${r.service_min%60}m</td>
                <td class="col-num">${fmtNum(r.total_weight_kg)}</td>
                <td class="col-num hide-on-expand">${fmtNum(r.total_volume_in3)}</td>
                <td class="col-num">${r.total_pieces}</td>
            </tr>
        `;
        
        // Detail (Accordion) Row
        html += `
            <tr class="details-row ${openClass}" id="details-row-${r.vehicle_id}">
                <td colspan="12" style="padding: 0;">
                    ${generateStopsTableHTML(r)}
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

function renderUnassignedTable() {
    const tbody = document.getElementById('unassignedTableBody');
    if (!UNASSIGNED.length) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:10px; color:#999;">All orders assigned</td></tr>';
        return;
    }
    
    let uw=0, uv=0, up=0;
    tbody.innerHTML = UNASSIGNED.map(u => {
        uw += (u.weight_kg || 0);
        uv += (u.volume_in3 || 0);
        up += (u.pieces || 0);
        return `
            <tr title="${u.address || 'No address'}" style="cursor: pointer;" onclick="${u.lat != null ? `map.setView([${u.lat},${u.lon}], 16)` : ''}">
                <td>${u.id}</td>
                <td title="${u.name || ''}">${cleanName(u.name) || ''}</td>
                <td title="${u.address || ''}">${u.address || ''}</td>
                <td class="col-num">${u.weight_kg}</td>
                <td class="col-num">${u.volume_in3 || 0}</td>
                <td class="col-num">${u.pieces || 0}</td>
            </tr>
        `;
    }).join('');

    const tfoot = document.getElementById('unassignedTableFoot');
    if (tfoot) {
        tfoot.innerHTML = `
        <tr style="background:var(--bg-surface); font-weight:600; border-top:1px solid var(--accent); color:var(--accent);">
          <td colspan="3" style="text-align:right; padding-right:16px; border:none;">TOTALS</td>
          <td class="col-num" style="border:none;">${fmtNum(uw)}</td>
          <td class="col-num" style="border:none;">${fmtNum(uv)}</td>
          <td class="col-num" style="border:none;">${fmtNum(up)}</td>
        </tr>
      `;
    }
}

