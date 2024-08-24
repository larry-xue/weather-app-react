export default function GoogleMap({ coordinates }) {
  return (
    <iframe
      width="400"
      height="400"
      className="random-region-map"
      loading="lazy"
      allowFullScreen={true}
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_MAP_API_KEY}&center=${coordinates.latitude},${coordinates.longitude}&zoom=18&maptype=satellite`}>
    </iframe>)
}
