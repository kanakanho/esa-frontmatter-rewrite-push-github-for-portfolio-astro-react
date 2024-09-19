import { parse } from "yaml";
import type { request } from "../types/EsaWebhookRequest";
import type { Frontmatter, YamlParse } from "../types/Frontmatter";

function CreateFrontmatter(body: request): [Frontmatter, string] {
  const dirName = body.post.name.split(" #")[0];
  const tagStrs = body.post.name.split(" #").slice(1);
  const tags: string[] = tagStrs.map((tag) => {
    return tag.replace("#", "");
  });
  const title = dirName.split("/").slice(-1)[0];
  const parentDir = "posts/";
  const date = dirName.split("/").slice(0, -1).join("/").replace(parentDir, "");

  if (!body.post.body_md) {
    return [
      {
        isActive: false,
        number: body.post.number,
        title: title,
        date: date,
        tags: tags,
        options: {},
      },
      "",
    ];
  }

  // body.post.body_md の一番最初の codeblock ```yml ``` or ```yaml ```` を取得
  const codeblock = body.post.body_md.match(/```(yml|yaml)([\s\S]*?)```/)?.[0];

  if (!codeblock) {
    const frontmatter = beforeFormatParse(
      body.post.body_md,
      !body.post.wip,
      body.post.number,
      title,
      date,
      tags,
    );
    return [frontmatter, body.post.body_md];
  }

  // codeblock の中身を取得
  const codeblockContent = codeblock.split("```")[1].replace("yml", "").replace("yaml", "");
  const yaml: YamlParse = parse(codeblockContent) || {};

  // codeblock を削除
  const body_md_without_codeblock = body.post.body_md.replace(codeblock, "");

  return [
    {
      isActive: yaml.isActive ?? !body.post.wip,
      number: body.post.number,
      title: title,
      date: date,
      tags: yaml.tags ?? tags,
      options: {
        description: yaml.description,
        repository: yaml.repository,
        youtube: yaml.youtube,
        website: yaml.website,
        image: yaml.image,
      },
      works: {
        worksDisplay: yaml.worksDisplay,
        worksTitle: yaml.worksTitle,
        worksDescription: yaml.worksDescription,
        worksImage: yaml.worksImage,
      },
    },
    body_md_without_codeblock,
  ];
}

function beforeFormatParse(
  body_md: string,
  isActive: boolean,
  number: number,
  title: string,
  date: string,
  tags: string[],
): Frontmatter {
  const description = body_md.split("<!--more-->")[0];

  // 追加情報の取得
  const repoUrl = description.match(/<meta name="repo" content="(.+?)" \/>/)?.[0].split('"')[1];
  const youtubeUrl = description
    .match(/<meta name="youtube" content="(.+?)" \/>/)?.[0]
    .split('"')[1];
  const websiteUrl = description
    .match(/<meta name="website" content="(.+?)" \/>/)?.[0]
    .split('"')[1];

  // src="~" の ~ を取得
  const imageUrl = description.match(/src="(.+?)"/)?.[0].split('"')[1];

  // descriptionから画像を削除
  const descriptionMessage = description
    .replace(/<img.*>/, "")
    .replace(/<meta.*>/, "")
    .replace(/<meta.*>/, "")
    .replace(/<meta.*>/, "")
    .replace(/\r?\n/g, "")
    .replace("。", "");

  return {
    isActive: isActive,
    number: number,
    title: title,
    date: date,
    tags: tags,
    options: {
      description: descriptionMessage,
      repository: repoUrl,
      youtube: youtubeUrl,
      website: websiteUrl,
      image: imageUrl,
    },
  };
}

export default CreateFrontmatter;
