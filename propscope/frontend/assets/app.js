/**
 * PropScope — 카카오맵 + API 연동 메인 스크립트
 */

// ── 설정 ─────────────────────────────────────────────────────
const API_BASE = 'http://localhost:8000/api';

// 카카오맵 초기 중심: 서울 시청
const DEFAULT_CENTER = { lat: 37.5665, lng: 126.9780 };
const DEFAULT_LEVEL = 7;

// ── 전역 상태 ─────────────────────────────────────────────────
let kakaoMap = null;
let markers = [];
let currentRegion = null;
let lastSearchResult = null;
let isLoading = false;

// ── 카카오맵 초기화 ──────────────────────────────────────────
function initMap() {
  const container = document.getElementById('kakao-map');
  const options = {
    center: new kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
    level: DEFAULT_LEVEL,
  };
  kakaoMap = new kakao.maps.Map(container, options);

  // 지도 컨트롤
  const zoomControl = new kakao.maps.ZoomControl();
  kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

  const mapTypeControl = new kakao.maps.MapTypeControl();
  kakaoMap.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
}

// ── 주소 검색 (카카오 주소 API) ──────────────────────────────
function searchAddress() {
  const query = document.getElementById('region-input').value.trim();
  if (!query) return;

  const places = new kakao.maps.services.Places();
  places.keywordSearch(query, (result, status) => {
    if (status === kakao.maps.services.Status.OK && result.length > 0) {
      const place = result[0];
      const lat = parseFloat(place.y);
      const lng = parseFloat(place.x);

      currentRegion = {
        name: place.address_name || place.place_name,
        lat,
        lng,
        code: '',
      };

      // 지역 코드 조회
      fetchRegionCode(currentRegion.name).then(code => {
        if (code) currentRegion.code = code;
      });

      // 지도 이동
      const latlng = new kakao.maps.LatLng(lat, lng);
      kakaoMap.setCenter(latlng);
      kakaoMap.setLevel(5);

      // 결과 표시
      const resultEl = document.getElementById('region-result');
      resultEl.textContent = `📍 ${currentRegion.name}`;
      resultEl.classList.add('visible');

      showToast(`${currentRegion.name} 선택됨`, 'success');
    } else {
      showToast('검색 결과가 없습니다.', 'error');
    }
  });
}

async function fetchRegionCode(region) {
  try {
    const resp = await fetch(`${API_BASE}/region-code?region=${encodeURIComponent(region)}`);
    if (resp.ok) {
      const data = await resp.json();
      return data.code || '';
    }
  } catch (e) {
    console.warn('지역코드 조회 실패:', e);
  }
  return '';
}

// ── 매물 조회 ─────────────────────────────────────────────────
async function searchProperties() {
  if (isLoading) return;

  if (!currentRegion) {
    showToast('먼저 지역을 검색해 주세요.', 'error');
    return;
  }

  const types = getSelectedTypes();
  if (types.length === 0) {
    showToast('매물 유형을 하나 이상 선택해 주세요.', 'error');
    return;
  }

  const payload = buildPayload(types);
  setLoading(true);

  try {
    const resp = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ detail: resp.statusText }));
      throw new Error(err.detail || '서버 오류');
    }

    const data = await resp.json();
    lastSearchResult = data;

    renderMarkers(data.items);
    renderStats(data.stats, data);
    renderList(data.items);

    showToast(`총 ${data.total}건 수집 완료 (네이버 ${data.naver_count} / 직방 ${data.zigbang_count})`, 'success');

  } catch (e) {
    showToast(`조회 실패: ${e.message}`, 'error');
    console.error(e);
  } finally {
    setLoading(false);
  }
}

function buildPayload(types) {
  return {
    region:      currentRegion.name,
    region_code: currentRegion.code || '',
    lat:         currentRegion.lat,
    lng:         currentRegion.lng,
    types,
    price_min:   getIntVal('price-min') || null,
    price_max:   getIntVal('price-max') || null,
    area_min:    getFloatVal('area-min') || null,
    area_max:    getFloatVal('area-max') || null,
    floor_min:   getIntVal('floor-min') || null,
    build_year:  getIntVal('build-year') || null,
  };
}

// ── 마커 렌더링 ────────────────────────────────────────────────
function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

function renderMarkers(items) {
  clearMarkers();

  items.forEach(item => {
    if (!item.lat || !item.lng) return;

    const isNaver = item.source === 'naver';
    const color = isNaver ? '#03c75a' : '#ff6e30';
    const label = isNaver ? 'N' : 'Z';

    const content = `
      <div style="
        position: relative;
        display: inline-block;
        cursor: pointer;
      ">
        <div style="
          background: ${color};
          color: #fff;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          border: 2px solid rgba(255,255,255,0.4);
        ">
          <span style="opacity:0.8;margin-right:3px;">${label}</span>${item.price}
        </div>
        <div style="
          width: 0; height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 6px solid ${color};
          margin: 0 auto;
          width: 10px;
        "></div>
      </div>`;

    const position = new kakao.maps.LatLng(item.lat, item.lng);
    const overlay = new kakao.maps.CustomOverlay({
      position,
      content,
      yAnchor: 1.1,
    });

    overlay.setMap(kakaoMap);

    // 클릭 시 인포윈도우 표시
    const div = overlay.getContent();
    if (div && div.addEventListener) {
      div.addEventListener('click', () => showItemInfo(item, position));
    }

    markers.push(overlay);
  });
}

let infoWindow = null;

function showItemInfo(item, position) {
  if (infoWindow) infoWindow.setMap(null);

  const srcLabel = item.source === 'naver' ? '네이버부동산' : '직방';
  const srcColor = item.source === 'naver' ? '#03c75a' : '#ff6e30';

  const content = `
    <div style="
      background: #1a1d27;
      border: 1px solid #2e3451;
      border-radius: 8px;
      padding: 12px 14px;
      min-width: 200px;
      color: #e8eaf0;
      font-family: 'Noto Sans KR', sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    ">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;">
        <span style="
          background: ${srcColor}22;
          color: ${srcColor};
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: 700;
        ">${srcLabel}</span>
        <span style="font-weight:700;">${item.property_type}</span>
      </div>
      <div style="font-weight:700;font-size:14px;color:#e2b04a;margin-bottom:4px;">${item.price}</div>
      <div style="color:#9ca3af;margin-bottom:2px;">${item.name}</div>
      <div style="color:#6b7280;font-size:11px;">${item.address}</div>
      <div style="
        display:flex;gap:8px;margin-top:8px;
        font-size:11px;color:#9ca3af;
      ">
        <span>📐 ${item.area}</span>
        <span>🏢 ${item.floor}층</span>
        <span>📅 ${item.build_year}</span>
      </div>
      ${item.url ? `<a href="${item.url}" target="_blank" style="
        display:block;margin-top:8px;
        color:#4f70d0;font-size:11px;text-decoration:none;
      ">상세보기 →</a>` : ''}
    </div>`;

  infoWindow = new kakao.maps.CustomOverlay({
    position,
    content,
    yAnchor: 0,
    zIndex: 999,
  });

  infoWindow.setMap(kakaoMap);
}

// ── 통계 패널 렌더링 ──────────────────────────────────────────
function renderStats(stats, data) {
  const panel = document.getElementById('stats-overlay');
  panel.classList.add('visible');

  setText('stat-total',   `${data.total}건`);
  setText('stat-avg',     stats.avg_price_str);
  setText('stat-min',     stats.min_price_str);
  setText('stat-max',     stats.max_price_str);
  setText('stat-naver',   stats.naver_avg_str);
  setText('stat-zigbang', stats.zigbang_avg_str);
  setText('stat-gap',     stats.gap_note);
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── 매물 목록 렌더링 ──────────────────────────────────────────
function renderList(items) {
  const tbody = document.getElementById('list-body');
  const count = document.getElementById('list-count-val');

  if (count) count.textContent = items.length;

  if (!items.length) {
    tbody.innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          <div class="empty-icon">🏠</div>
          <div class="empty-text">검색 결과가 없습니다.</div>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = items.map((item, i) => `
    <tr onclick="highlightMarker(${i})" data-lat="${item.lat}" data-lng="${item.lng}">
      <td>${i + 1}</td>
      <td><span class="src-badge ${item.source}">${item.source === 'naver' ? '네이버' : '직방'}</span></td>
      <td>${item.property_type}</td>
      <td>${escHtml(item.name)}</td>
      <td>${escHtml(item.address)}</td>
      <td class="price-cell">${escHtml(item.price)}</td>
      <td>${escHtml(item.area)}</td>
      <td>${escHtml(item.floor)}층</td>
      <td>${escHtml(item.build_year)}</td>
    </tr>
  `).join('');

  // 목록 패널 열기
  openListPanel();
}

function highlightMarker(index) {
  // 해당 매물 위치로 지도 이동
  const rows = document.querySelectorAll('#list-body tr');
  const row = rows[index];
  if (!row) return;

  const lat = parseFloat(row.dataset.lat);
  const lng = parseFloat(row.dataset.lng);
  if (lat && lng) {
    kakaoMap.setCenter(new kakao.maps.LatLng(lat, lng));
    kakaoMap.setLevel(3);
  }
}

// ── PDF 다운로드 ──────────────────────────────────────────────
async function downloadPDF() {
  if (!currentRegion) {
    showToast('먼저 매물을 검색해 주세요.', 'error');
    return;
  }

  showToast('PDF 생성 중...', '');

  const types = getSelectedTypes();
  const payload = buildPayload(types);

  try {
    const resp = await fetch(`${API_BASE}/report/pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) throw new Error(resp.statusText);

    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    a.href = url;
    a.download = `PropScope_${currentRegion.name}_${dateStr}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('PDF 다운로드 완료!', 'success');
  } catch (e) {
    showToast(`PDF 생성 실패: ${e.message}`, 'error');
  }
}

// ── 목록 패널 토글 ────────────────────────────────────────────
function toggleListPanel() {
  const panel = document.getElementById('list-panel');
  panel.classList.toggle('open');
}

function openListPanel() {
  document.getElementById('list-panel').classList.add('open');
}

// ── 필터 UI 헬퍼 ──────────────────────────────────────────────
function getSelectedTypes() {
  return [...document.querySelectorAll('.type-toggle.active')]
    .map(el => el.dataset.type);
}

function getIntVal(id) {
  const val = parseInt(document.getElementById(id)?.value || '');
  return isNaN(val) ? null : val;
}

function getFloatVal(id) {
  const val = parseFloat(document.getElementById(id)?.value || '');
  return isNaN(val) ? null : val;
}

function updateRangeDisplay(id, displayId, unit = '') {
  const val = document.getElementById(id)?.value;
  const el = document.getElementById(displayId);
  if (el) el.textContent = val ? `${Number(val).toLocaleString()}${unit}` : '-';
}

// ── 로딩 상태 ────────────────────────────────────────────────
function setLoading(val) {
  isLoading = val;
  const btn = document.getElementById('search-btn');
  if (val) {
    btn.classList.add('loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// ── 토스트 알림 ───────────────────────────────────────────────
function showToast(msg, type = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  });
}

// ── XSS 방지 ─────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── 이벤트 바인딩 ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 카카오맵 초기화 (SDK 로드 완료 후 호출됨)
  // initMap()은 HTML의 onload 콜백에서 호출

  // 유형 토글
  document.querySelectorAll('.type-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
    });
  });

  // 슬라이더 변경 시 표시값 업데이트
  document.getElementById('price-min-range')?.addEventListener('input', e => {
    document.getElementById('price-min').value = e.target.value;
    updateRangeDisplay('price-min-range', 'price-min-display', '만원');
  });

  document.getElementById('price-max-range')?.addEventListener('input', e => {
    document.getElementById('price-max').value = e.target.value;
    updateRangeDisplay('price-max-range', 'price-max-display', '만원');
  });

  document.getElementById('area-min-range')?.addEventListener('input', e => {
    document.getElementById('area-min').value = e.target.value;
    updateRangeDisplay('area-min-range', 'area-min-display', '㎡');
  });

  document.getElementById('area-max-range')?.addEventListener('input', e => {
    document.getElementById('area-max').value = e.target.value;
    updateRangeDisplay('area-max-range', 'area-max-display', '㎡');
  });

  document.getElementById('floor-min-range')?.addEventListener('input', e => {
    document.getElementById('floor-min').value = e.target.value;
    updateRangeDisplay('floor-min-range', 'floor-min-display', '층');
  });

  document.getElementById('build-year-range')?.addEventListener('input', e => {
    document.getElementById('build-year').value = e.target.value;
    updateRangeDisplay('build-year-range', 'build-year-display', '년');
  });

  // 지역 검색 엔터키
  document.getElementById('region-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchAddress();
  });
});
