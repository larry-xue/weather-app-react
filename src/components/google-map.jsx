export default function GoogleMap({ coordinates }) {
  return (
  <div className="w-full h-full p-2">
    <iframe
      width="100%"
      height="600"
      loading="lazy"
      allowFullScreen={true}
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_MAP_API_KEY}&center=${coordinates.latitude},${coordinates.longitude}&zoom=18&maptype=satellite`}>
    </iframe>
  </div>  
  )
}
