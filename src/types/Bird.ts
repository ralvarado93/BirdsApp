export interface Bird {
  uid:    string;
  name:   Name;
  images: Images;
  _links: Links;
  sort:   number;
}

export interface Links {
  self:   string;
  parent: string;
}

export interface Images {
  main:  string;
  full:  string;
  thumb: string;
}

export interface Name {
  spanish: string;
  english: string;
  latin:   string;
}


export interface BirdInfo {
  uid:        string;
  name:       Name;
  map:        Map;
  iucn:       Iucn;
  habitat:    string;
  didyouknow: string;
  migration:  boolean;
  dimorphism: boolean;
  size:       string;
  order:      string;
  species:    string;
  images:     Images;
  audio:      Audio;
  _links:     Links;
  sort:       number;
}

export interface Links {
  self:   string;
  parent: string;
}

export interface Audio {
}

export interface Images {
  main:    string;
  gallery: Gallery[];
}

export interface Gallery {
  url: string;
}

export interface Iucn {
  title:       string;
  description: string;
}

export interface Map {
  image: string;
  title: string;
}

export interface Name {
  spanish: string;
  english: string;
  latin:   string;
}
