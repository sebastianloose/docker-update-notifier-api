import {
  getAllEmailsListeningOnRepository,
  getAllRepositories,
  getRepositoryById,
} from "./db";
import { isNewVersionAvailable } from "./dockerHub";
import { sendUpdateAvailableMail } from "./mail";

const initRepositoryWatcher = () => {
  watchForNewVersions();
  setInterval(() => watchForNewVersions(), 1 * 60000);
};

const watchForNewVersions = async () => {
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
  const emails = getAllEmailsListeningOnRepository(repositoryId);

  // await to prevent concurrent connections
  await sendUpdateAvailableMail(emails, repository);
};

export { initRepositoryWatcher };
