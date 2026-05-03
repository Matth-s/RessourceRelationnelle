type ResourceMediaContentProps = {
  mediaType: string | null;
  mediaUrl: string | null;
};

const ResourceMediaContent = ({
  mediaType,
  mediaUrl,
}: ResourceMediaContentProps) => {
  if (!mediaType || !mediaUrl) return;

  return (
    <div
      className={`flex h-96 w-full items-center justify-center overflow-hidden rounded-xl`}
    >
      {mediaType === "image" && (
        <img
          src={mediaUrl}
          className="h-full w-full object-contain"
          alt="preview"
        />
      )}

      {mediaType === "video" && (
        <video
          src={mediaUrl}
          controls
          className="h-full w-full object-contain"
        />
      )}

      {mediaType === "audio" && (
        <audio src={mediaUrl} controls className="w-full max-w-md" />
      )}

      {mediaType === "pdf" && (
        <iframe src={mediaUrl} className="h-full w-full" title="pdf-preview" />
      )}

      {mediaType === "other" && (
        <p className="text-sm text-gray-500">Type de fichier non supporté</p>
      )}
    </div>
  );
};

export default ResourceMediaContent;
