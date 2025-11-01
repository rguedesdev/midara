"use client";

import { DiscussionEmbed } from "disqus-react";

interface CommentsProps {
  url: string;
  identifier: string | number;
  title: string;
}

function Comments({ url, identifier, title }: CommentsProps) {
  const disqusConfig = {
    url: `https://midara.ink${url}`, // garante que seja absoluto
    identifier: String(identifier),
    title,
    language: "pt_BR",
  };

  return <DiscussionEmbed shortname="midara" config={disqusConfig} />;
}

export { Comments };
