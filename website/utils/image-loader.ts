import { ImageLoader } from "next/image";

// Docs: https://www.contentful.com/developers/docs/references/images-api/
export const contentfulLoader: ImageLoader = ({ src, width, quality }) => {
  const url = new URL(src);

  url.searchParams.set("w", width.toString());

  return url.href;
};
