import type { Context, Env } from "hono";
import { env } from "hono/adapter";
import type { BlankInput } from "hono/types";
import type { request } from "../types/EsaWebhookRequest";
import CreateContent from "./CreateContent";
import CreateFrontmatter from "./CreateFrontmatter";
import GitCommit from "./GitCommit";

async function Webhook(c: Context<Env, "/", BlankInput>) {
  const { GITHUB_ACCESS_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } = env<{
    GITHUB_ACCESS_TOKEN: string;
    GITHUB_OWNER: string;
    GITHUB_REPO: string;
    GITHUB_BRANCH: string;
  }>(c);
  const body = await c.req.json<request>();

  const [frontmatter, body_md] = CreateFrontmatter(body);

  if (body.kind === "post_archive" || body.kind === "post_delete") {
    frontmatter.isActive = false;
  }

  const content = CreateContent(frontmatter, body_md);

  const ok = await GitCommit(
    GITHUB_ACCESS_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH,
    frontmatter,
    content,
    body.post.message as string,
  );

  if (!ok) {
    return c.json(
      {
        status: "error",
      },
      400,
    );
  }
  return c.json(
    {
      status: "ok",
    },
    201,
  );
}

export default Webhook;
