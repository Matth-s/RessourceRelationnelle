type CreateResourcePreviewProps = {
  file: File;
};

const CreateResourcePreview = ({ file }: CreateResourcePreviewProps) => {
  if (!file) return undefined;

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={url}
        className="h-full max-h-96 w-full max-w-4xl rounded-lg object-contain"
        alt="preview"
      />
    );
  }

  if (file.type.startsWith("video/")) {
    return (
      <video
        src={url}
        controls
        className="h-full max-h-96 w-full max-w-4xl rounded-lg object-contain"
      />
    );
  }

  if (file.type.startsWith("audio/")) {
    return (
      <audio
        src={url}
        controls
        className="h-full max-h-96 w-full max-w-4xl rounded-lg object-contain"
      />
    );
  }

  if (file.type === "application/pdf") {
    return (
      <iframe
        src={url}
        className="h-full max-h-96 w-full max-w-4xl rounded-lg object-contain"
        title="pdf-preview"
      />
    );
  }

  return <p>Type de fichier non supporté</p>;
};

export default CreateResourcePreview;
