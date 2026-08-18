export async function writeSessionCache(path, contents, filesystem) {
  const temporaryPath = `${path}.tmp`;
  await filesystem.writeFile(path, "");
  await filesystem.writeFile(temporaryPath, contents);
  await filesystem.rename(temporaryPath, path);
}
