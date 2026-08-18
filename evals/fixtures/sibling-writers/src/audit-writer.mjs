export async function writeAudit(path, contents, filesystem) {
  const temporaryPath = `${path}.tmp`;
  await filesystem.writeFile(temporaryPath, contents);
  await filesystem.rename(temporaryPath, path);
}
