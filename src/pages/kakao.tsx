import { useEffect, useRef, useState } from 'react'

declare global {
 
}

export default function KakaoMapPage() {
  const mapRef = useRef<HTMLDivElement>(null)
  const [keyword, setKeyword] = useState('맛집')

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return

    window.kakao.maps.load(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 4,
          }

          const map = new window.kakao.maps.Map(mapRef.current!, mapOption)

          const ps = new window.kakao.maps.services.Places()

          ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              for (const place of data) {
                const marker = new window.kakao.maps.Marker({
                  map,
                  position: new window.kakao.maps.LatLng(Number(place.y), Number(place.x)),
                })

                const infowindow = new window.kakao.maps.InfoWindow({
                  content: `<div style="padding:5px;font-size:13px;">${place.place_name}</div>`,
                })

                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                  infowindow.open(map, marker)
                })

                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                  infowindow.close()
                })
              }
            }
          })
        },
        () => {
          alert('위치 정보를 가져올 수 없습니다.')
        }
      )
    })
  }, [keyword])

  return (
    <main style={{ padding: '1rem' }}>
      <h1>📍 내 주변 맛집 검색</h1>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력하세요 (예: 떡볶이)"
      />
      <div ref={mapRef} style={{ width: '100%', height: '500px', marginTop: '1rem' }} />
    </main>
  )
}