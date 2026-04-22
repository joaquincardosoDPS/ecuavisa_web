export interface ProgramDetails {
  title: string;
  image: string;
  fondo_imagen: string;
  tid: string;
  config_id: string;
  description: string;
  slug: string;
  on_air: string;
  video_key?: string;
  imagen_vertical: string;
}

export interface ProgramChapter {
  id: string;
  key: string;
  title: string;
  image: string;
  link: string;
  duration?: string;
  restriction: string;
  packs?: string[];
  description?: string;
  initialSeconds?: number;
}

export interface CategoriesVOD {
  name: string;
}

export interface ProgramDetailsAlternative {
  title: string;
  image: string;
  fondo_imagen: string;
  config_id: string;
  description: string;
  facebook: string;
  google_analytics: string;
  instagram: string;
  twitter: string;
  link: string;
  slug: string;
  on_air: string;
  video_key?: string;
}
