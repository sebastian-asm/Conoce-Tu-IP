(() => {
  const d = document;
  d.addEventListener('DOMContentLoaded', app);

  // Inicializando la app
  function app() {
    d.querySelector('#fecha').textContent = new Date().getFullYear();
    getIp();
  }

  // Obteniendo la IP
  async function getIp() {
    const apiKey = 'at_v5TukPUOGypoMaW2ol5vAaxQSh6r4';
    const apiUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}`;

    try {
      const resp = await fetch(apiUrl);
      const { ip, isp, location } = await resp.json();
      const { lat, lng, city, region } = location;

      d.querySelector('input').value = ip;
      d.querySelector('#isp').textContent = isp;
      d.querySelector('#ciudad').textContent = `${city}, ${region}`;
      d.querySelector('#lat').textContent = lat;
      d.querySelector('#lng').textContent = lng;

      // Mostrando el contenedor principal
      d.querySelector('#container').classList.remove('hidden');

      makeMap(lat, lng); // Mapa
      d.querySelector('button').addEventListener('click', copyIP); // Portapapeles
    } catch {
      error();
    }

    d.querySelector('#loading').remove();
  }

  // Creación del mapa
  function makeMap(lat, lng) {
    const map = L.map('mapid').setView([lat, lng], 17);
    const layer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(layer).addTo(map);
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`Latitud: ${lat} - Longitud: ${lng}`)
      .openPopup();
  }

  // Copiando la ip al portapapeles
  function copyIP() {
    d.querySelector('input').focus();
    d.execCommand('selectAll');
    d.execCommand('copy');

    const p = d.createElement('p');
    p.id = 'alert';
    p.classList.add('alert');
    p.textContent = '¡IP copiada en el portapapeles!';

    if (!d.querySelector('#alert')) {
      d.querySelector('#section-ip').insertBefore(p, d.querySelector('button'));
      setTimeout(() => p.remove(), 3000);
    }
  }

  function error() {
    const div = d.querySelector('#error');
    const p = d.createElement('p');

    div.classList.remove('hidden');
    p.textContent =
      'Lamentablemente ocurrió un problema al obtener la información solicitada, vuelva a intentar por favor.';

    div.appendChild(p);
  }
})();
