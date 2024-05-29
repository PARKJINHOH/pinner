export interface Traveler {
  email: string;
  nickname: string;
  accessToken: string;
  refreshToken: string;
  signupServices: string;
}

export interface Travel {
  id: number;
  orderKey: number;
  title: string;
  journeys: Journey[];
  sharedInfo: SharedInfo;
}

export interface Journey {
  id: number;
  orderKey: number;
  date: string;
  hashtags: string[];
  photos: Photo[];
  geoLocationDto: geoLocationDto;
}

export interface Photo {
  id: number;
  src: string;
  fileSize: number;
  width: number;
  height: number;
}

export interface geoLocationDto {
  lat: number;
  lng: number;
  name: string;
  countryCd: string;
}

export interface Point {
  lat: number;
  lng: number;
}

export interface SharedInfo {
  expiredAt: string;
  hostId: number;
  hostNickname: string;
}

export interface Place {
  formatted_address: string;
  geometry: Geometry;
  name: string;
}

export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface Location {}

export interface Viewport {
  Ua: Ua;
  Ga: Ia;
}

export interface Ua {
  lo: number;
  hi: number;
}

export interface Ia {
  lo: number;
  hi: number;
}
