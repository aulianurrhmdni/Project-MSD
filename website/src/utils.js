export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n)
export const waktu = (iso) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Makassar',
  }).format(new Date(iso))
export const photo = (src) =>
  /^(https?:|data:image\/)/i.test(src || '')
    ? src
    : '/' + (src || 'assets/img/pasar-depan.jpg').replace(/^\/+/, '')
export const whatsapp = (k, text = '') =>
  'https://wa.me/' +
  String(k?.wa || '')
    .replace(/\D/g, '')
    .replace(/^0/, '62') +
  '?text=' +
  encodeURIComponent(text)
export function readPhoto(file, max = 1000) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(jpeg|png|webp|gif)$/.test(file.type) || file.size > 8 * 1024 * 1024)
      return reject(new Error('Pilih foto JPG, PNG, WebP, atau GIF maksimal 8 MB.'))
    const image = new Image()
    const url = URL.createObjectURL(file)
    image.onload = () => {
      const scale = Math.min(1, max / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Foto tidak bisa dibaca.'))
    }
    image.src = url
  })
}
