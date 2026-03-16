export async function readFilesAsDataUrls(files: FileList | File[]): Promise<string[]> {
  const fileArray = Array.from(files).filter((file) => file.type.startsWith("image/"));

  return Promise.all(
    fileArray.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
          reader.onerror = () => reject(new Error("Image read failed."));
          reader.readAsDataURL(file);
        }),
    ),
  );
}

export function isImageSource(source: string) {
  return (
    source.startsWith("data:image/") ||
    source.startsWith("blob:") ||
    source.startsWith("http://") ||
    source.startsWith("https://")
  );
}
