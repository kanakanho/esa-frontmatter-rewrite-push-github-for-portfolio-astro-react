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
    return [{
      isActive: false,
      number: body.post.number,
      title: title,
      date: date,
      tags: tags,
      options: {},
    }, body.post.body_md];
  }

  // codeblock の中身を取得
  const codeblockContent = codeblock.split("```")[1].replace("yml", "").replace("yaml", "");
  const yaml: YamlParse = parse(codeblockContent) || {};

  // codeblock を削除
  const body_md_without_codeblock = body.post.body_md.replace(codeblock, "");

  const extendTags = yaml.tags ? Array.from(new Set([...yaml.tags, ...tags])) : tags;
  extendTags.sort((a, b) => {
    // 文字列の長さが短い順にソート
    return a.length - b.length;
  });
  return [
    {
      isActive: yaml.isActive ?? !body.post.wip,
      number: body.post.number,
      title: title,
      date: date,
      tags: extendTags,
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
        worksLink: yaml.worksLink,
        worksDescription: yaml.worksDescription,
        worksImage: yaml.worksImage,
      },
    },
    body_md_without_codeblock,
  ];
}

export default CreateFrontmatter;
