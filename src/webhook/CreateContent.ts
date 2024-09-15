import type { Frontmatter } from "../types/Frontmatter";

function CreateContent(frontmatter: Frontmatter, body_md: string): string {
  // frontmatter を作成
  const frontmatterStr = `---
isActive: ${frontmatter.isActive}
number: ${frontmatter.number}
title: ${frontmatter.title}
date: ${frontmatter.date}
tags: ${frontmatter.tags}
options:
  description: ${frontmatter.options?.description}
  repository: ${frontmatter.options?.repository}
  youtube: ${frontmatter.options?.youtube}
  website: ${frontmatter.options?.website}
  image: ${frontmatter.options?.image}
works:
  worksDisplay: ${frontmatter.works?.worksDisplay}
  title: ${frontmatter.works?.worksTitle}
  description: ${frontmatter.works?.worksDescription}
  image: ${frontmatter.works?.worksImage}
---
`;

  return frontmatterStr + body_md;
}

export default CreateContent;
