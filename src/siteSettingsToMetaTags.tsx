import { SiteSettingMap } from "./apiClient";
import ImageUploader from "./imageUploader";

export default function(
  { author, description, sitename, favicon }: SiteSettingMap,
  imageUploader: ImageUploader,
  { titlePrefix = "" }: { titlePrefix?: string } = {}
) {
  return [
    author && <meta name="author" content={author}></meta>,
    description && <meta name="description" content={description}></meta>,
    description && (
      <meta property="og:description" content={description}></meta>
    ),
    sitename && <meta name="name" content={sitename}></meta>,
    sitename && <meta property="og:title" content={sitename} />,
    <meta property="og:type" content="website" />,
    <title>{titlePrefix + (sitename || "")}</title>,
    <meta
      name="generator"
      content="https://github.com/ManhwaDurae/fullcards"
    ></meta>
  ].concat(
    favicon
      ? [
          <link rel="icon" href={imageUploader.idToImageUrl(favicon)}></link>,
          <link
            rel="shortcut icon"
            href={imageUploader.idToImageUrl(favicon)}
          ></link>,
          <meta
            property="og:image"
            content={imageUploader.idToImageUrl(favicon)}
          />
        ]
      : []
  );
}
