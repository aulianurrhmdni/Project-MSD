<template>
  <footer class="site-footer">
    <div class="frame footer-grid">
      <div>
        <RouterLink
          class="brand"
          to="/"
        >
          <span>Pasar Inpress</span>
          <strong>Kebun Sayur</strong>
        </RouterLink>
        <p>
          Oleh-oleh Kalimantan,
          <br />
          langsung dari kiosnya.
        </p>
      </div>
      <div>
        <h2>Jelajahi pasar</h2>
        <RouterLink to="/katalog">Katalog oleh-oleh</RouterLink>
        <RouterLink to="/denah">Denah & lokasi</RouterLink>
      </div>
      <div>
        <h2>Belanjamu</h2>
        <RouterLink to="/keranjang">Keranjang</RouterLink>
        <RouterLink to="/pesanan">Pesanan saya</RouterLink>
        <RouterLink to="/penjual">Login sebagai penjual</RouterLink>
      </div>
      <div>
        <h2>Jalan ke Pasar Inpress</h2>
        <iframe
          class="footer-map"
          title="Google Maps Pasar Inpress Kebun Sayur, Balikpapan"
          src="https://www.google.com/maps?q=Pasar+Inpres+Kebun+Sayur+Balikpapan&output=embed"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=Pasar+Inpres+Kebun+Sayur+Balikpapan"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buka rute di Google Maps ↗
        </a>
      </div>
    </div>
    <div class="frame footer-bottom">
      © {{ new Date().getFullYear() }} Pasar Inpress Kebun Sayur · Balikpapan
    </div>
  </footer>
</template>

<style scoped>
.footer-map {
  display: block;
  width: 100%;
  height: 180px;
  margin-bottom: 12px;
  border: 0;
  border-radius: 4px;
}
</style>
