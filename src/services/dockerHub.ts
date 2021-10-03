import { getRepository } from "../api/dockerHubApi";

const doesRepositoryExist = async (
  organization: string,
  repository: string
): Promise<boolean> => {
  const res = await getRepository(organization, repository);
  return res["name"] === "latest";
};

const isNewVersionAvailable = async ({
  id,
  organization,
  repository,
}: Repository) => {
  const repo = await getRepository(organization, repository);
  if (repo["name"] !== "latest") {
    return { id, newVersionAvailable: false };
  }

  const lastCheck = new Date(new Date().getTime() + 5 * 60000);
  const lastUpdate = new Date(repo["tag_last_pushed"]);
  return { id, newVersionAvailable: lastCheck > lastUpdate };
};

export { doesRepositoryExist, isNewVersionAvailable };
