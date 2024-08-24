import { X } from 'lucide-react'
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'

const defaultRegions = [
  {
    name: 'Sydney',
    latitude: -33.8567844,
    longitude: 151.2152969
  },
  {
    name: 'Beijing',
    latitude: 39.904211,
    longitude: 116.407395
  },
  {
    name: 'New York',
    latitude: 40.712776,
    longitude: -74.005974
  },
  {
    name: 'Paris',
    latitude: 48.856613,
    longitude: 2.352222
  },
  {
    name: 'Berlin',
    latitude: 52.520008,
    longitude: 13.404954
  },
  {
    name: 'Tokyo',
    latitude: 35.689487,
    longitude: 139.691711
  },
  {
    name: 'London',
    latitude: 51.5073998,
    longitude: -0.1277583
  }
]

const CURRENT_REGION_KEY = 'currentRegion'
const REGIONS_KEY = 'regions'

export default forwardRef(function RegionCollection({ setCoordinates }, ref) {
  const [regions, setRegions] = useState(defaultRegions)
  const [currentRegion, setCurrentRegion] = useState(null)

  useEffect(() => {
    // get region from local storage
    const regions = localStorage.getItem(REGIONS_KEY)
    if (regions) {
      const parsedRegions = JSON.parse(regions)
      if (Array.isArray(parsedRegions) && parsedRegions.length > 0) {
        setRegions(parsedRegions)
      }
    }

    // get current region from local storage
    const currentRegion = localStorage.getItem(CURRENT_REGION_KEY)
    if (currentRegion) {
      console.log('in useEffect, currentRegion = ', currentRegion)
      setCurrentRegion(JSON.parse(currentRegion))
    }
  }, [])

  const handleSetCurrentRegion = (region) => {
    if (currentRegion === region) {
      return;
    }

    setCurrentRegion(region)
    localStorage.setItem(CURRENT_REGION_KEY, JSON.stringify(region))

    setCoordinates({
      longitude: region.longitude,
      latitude: region.latitude
    })
  }

  const handleRemoveRegion = (e, region) => {
    e.stopPropagation()
    const newRegions = regions.filter((r) => r !== region)
    setRegions(newRegions)
    localStorage.setItem(REGIONS_KEY, JSON.stringify(newRegions))
  }

  const isSameRegion = (region1, region2) => {
    return region1 && region2 && region1.name === region2.name && region1.latitude === region2.latitude && region1.longitude === region2.longitude
  }

  useImperativeHandle(ref, () => ({
    handleAddRegion(name, coordinates) {
      const newRegion = { name, latitude: coordinates.latitude, longitude: coordinates.longitude }
      const isDuplicate = regions.some(region => isSameRegion(region, newRegion))
      if (isDuplicate) {
        throw new Error('Region already exists')
      }

      setCurrentRegion(newRegion)
      setRegions([...regions, newRegion])
      localStorage.setItem(REGIONS_KEY, JSON.stringify([...regions, newRegion]))
    }
  }))

  return (
    <div className="flex gap-2 flex-wrap w-full items-center justify-start px-6">
      {regions.map((region) => (
        <button
          className={`bg-gray-200 p-2 rounded-md ${isSameRegion(currentRegion, region) ? 'bg-green-400' : ''}`}
          key={region.name}
          onClick={() => handleSetCurrentRegion(region)}
        >
          <div className='flex items-center justify-between gap-2'>
            {region.name}
            <X className='cursor-pointer hover:text-gray-400' size={16} onClick={(e) => handleRemoveRegion(e, region)} />
          </div>
        </button>
      ))}
    </div>
  )
})
