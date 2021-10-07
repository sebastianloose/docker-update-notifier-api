import {
  getAllEmailsListeningOnRepository,
  getAllRepositories,
  getRepositoryById,
} from "./db";
import { isNewVersionAvailable } from "./dockerHub";
import { sendUpdateAvailableEmail } from "./email";

const initRepositoryWatcher = () => {
  const interval = parseInt(process.env["UPDATE_INTERVAL"] as string) || 30;
  console.log(`Looking for new versions every ${interval} minutes`);
  watchForNewVersions();
  setInterval(() => watchForNewVersions(), interval * 60000);
};

const watchForNewVersions = async () => {
  console.log(`Looking for new versions...`);
  const repositories = getAllRepositories();
  const repositoriesVersionStatus = await Promise.all(
    repositories.map((repository) => isNewVersionAvailable(repository))
  );
  const repositoriesWithNewVersion = repositoriesVersionStatus.filter(
    (repository) => repository.newVersionAvailable
  );
  for (const repository of repositoriesWithNewVersion) {
    await notifyUser(repository.id);
  }
};

const notifyUser = async (repositoryId: number) => {
  const repository = getRepositoryById(repositoryId);
  console.log(
    `New version available for ${repository.organization}/${repository.repository}`
  );
  const emails = getAllEmailsListeningOnRepository(repositoryId);

  // await to prevent concurrent connections
  await sendUpdateAvailableEmail(emails, repository);
};

export { initRepositoryWatcher };
