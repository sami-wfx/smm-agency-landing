/** Путь к файлу из /public с учётом basePath (нужно для GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const asset = (path: string) =>
  /^(https?:)?\/\//.test(path) || path.startsWith("data:")
    ? path
    : `${BASE_PATH}/${path.replace(/^\//, "")}`;
