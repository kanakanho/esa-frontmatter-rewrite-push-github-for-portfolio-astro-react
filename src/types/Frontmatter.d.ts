export type Frontmatter = {
  isActive: boolean;
  number: number;
  title: string;
  date: string;
  tags: string[];
  options?: options;
  works?: works;
};

export type options = {
  description?: string;
  repository?: string;
  youtube?: string;
  website?: string;
  image?: string;
};

export type works = {
  worksDisplay: boolean;
  worksTitle: string;
  worksDescription: string;
  worksImage: string;
};

export type YamlParse = {
  isActive: boolean;
  tags: string[];
} & options &
  works;
