export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        /**
         * SDK 로더 호출(지도를 쓸 준비가 되면 콜백 실행)
         */
        load(callback: () => void): void;

        services: {
          /**
           * 장소 검색 서비스
           */
          Places: new () => PlacesService;

          /**
           * 검색 상태 코드
           */
          Status: {
            OK: string;
            ERROR: string;
            ZERO_RESULT: string;
          };
        };

        /**
         * 지도 인스턴스 생성자
         */
        Map: new (container: HTMLElement, options: MapOptions) => KakaoMap;

        /**
         * 위도/경도 객체
         */
        LatLng: new (lat: number, lng: number) => LatLng;

        /**
         * 지도 마커
         */
        Marker: new (options: MarkerOptions) => KakaoMarker;

        /**
         * 정보창
         */
        InfoWindow: new (options: InfoWindowOptions) => KakaoInfoWindow;

        /**
         * 이벤트 리스너 등록
         */
        event: {
          addListener(
            instance: KakaoMap | KakaoMarker | KakaoInfoWindow,
            eventName: string,
            handler: () => void
          ): void;
        };
      };
    };
  }
}

/**  
 * 카카오 장소 검색 결과 객체 타입  
 */
export interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  phone: string;
  category_name: string;
  place_url: string;
  x: string;
  y: string;
}

/**
 * 장소 검색 서비스 인터페이스
 */
export interface PlacesService {
  keywordSearch(
    keyword: string,
    callback: (result: KakaoPlace[], status: string) => void
  ): void;
}

/**
 * 지도 옵션
 */
export interface MapOptions {
  center: LatLng;
  level: number;
}

/**
 * 마커 옵션
 */
export interface MarkerOptions {
  map: KakaoMap;
  position: LatLng;
}

/**
 * 정보창 옵션
 */
export interface InfoWindowOptions {
  content: string;
}

/**
 * Kakao LatLng 클래스 (위도/경도 객체)
 */
export class LatLng {
  constructor(lat: number, lng: number);
}

/**
 * Kakao Map 클래스
 */
export class KakaoMap {
  constructor(container: HTMLElement, options: MapOptions);
}

/**
 * Kakao Marker 클래스
 */
export class KakaoMarker {
  constructor(options: MarkerOptions);
}

/**
 * Kakao InfoWindow 클래스
 */
export class KakaoInfoWindow {
  constructor(options: InfoWindowOptions);
  open(map: KakaoMap, marker: KakaoMarker): void;
  close(): void;
}
