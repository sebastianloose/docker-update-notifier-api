import { getRepository } from "../api/dockerHubApi";

const doesRepositoryExist = async (
  organization: string,
  repository: string
): Promise<boolean> => {
  const res = await getRepository(organization, repository);
  return res["name"] === "latest";
};

export { doesRepositoryExist };
