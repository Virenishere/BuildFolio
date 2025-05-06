declare module 'webp-converter' {
  function cwebp(
    inputPath: string,
    outputPath: string,
    options: string
  ): Promise<{ status: string; message: string }>;

  export { cwebp };
}