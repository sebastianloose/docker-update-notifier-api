import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { SubscriptionRequest } from "../types/subscriptionRequestType";
import { Subscription } from "../types/subscriptionType";
import { User } from "../types/userType";

const db = new Database("main.db");

const initDb = () => {
  db.exec(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email STRING NOT NULL UNIQUE, uuid STRING NOT NULL UNIQUE, verified INTEGER DEFAULT 0, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, repositoryId INTEGER NOT NULL, active INTEGER DEFAULT 1)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS repository (id INTEGER PRIMARY KEY AUTOINCREMENT, organization STRING NOT NULL, repository STRING NOT NULL)"
  );
};

const addSubscription = ({
  email,
  organization,
  repository,
}: SubscriptionRequest) => {
  if (!doesUserExist(email)) {
    db.prepare("INSERT INTO user (email, uuid) VALUES (?, ?)").run(
      email,
      uuidv4()
    );
    console.log(`Created user ${email}`);
  }

  if (!doesRepositoryExist(organization, repository)) {
    db.prepare(
      "INSERT INTO repository (organization, repository) VALUES (?, ?)"
    ).run(organization, repository);
    console.log(`Created repository ${organization}/${repository}`);
  }

  const userId = getUserId(email);
  const repositoryId = getRepositoryId(organization, repository);

  if (doesSubscriptionExist(userId, repositoryId)) {
    console.log(
      `Subscription does already exist - ${email} ${organization}/${repository}`
    );
    return;
  }

  db.prepare(
    "INSERT INTO subscription (userId, repositoryId) VALUES (?, ?)"
  ).run(userId, repositoryId);
  console.log(`Added subscription - ${email} ${organization}/${repository}`);
};

const getUserByEmail = (email: string): User | undefined => {
  const res = db.prepare("SELECT * FROM user WHERE email = ?").get(email);
  if (!res) {
    return undefined;
  }
  return {
    id: res.id,
    email: res.email,
    uuid: res.uuid,
    verified: res.verified == 1,
    timestamp: res.timestamp,
  };
};

const getUserByUuid = (uuid: string): User | undefined => {
  const res = db.prepare("SELECT * FROM user WHERE uuid = ?").get(uuid);
  if (!res) {
    return undefined;
  }
  return {
    id: res.id,
    email: res.email,
    uuid: res.uuid,
    verified: res.verified == 1,
    timestamp: res.timestamp,
  };
};

const getSubscriptionsByEmail = (email: string): Subscription[] => {
  const userId = getUserId(email);
  const res = db
    .prepare(
      "SELECT organization, repository, active FROM repository INNER JOIN subscription ON repository.id=subscription.repositoryId WHERE subscription.userId = ?"
    )
    .all(userId);
  if (!res) {
    return [];
  }
  return res.map((subscription) => {
    subscription.active = subscription.active === 1;
    return subscription;
  });
};

const verifyUserEmail = (uuid: string) => {
  db.prepare("UPDATE user SET verified = 1 WHERE uuid = ?").run(uuid);
};

const getAllRepositories = (): Repository[] => {
  const res = db.prepare("SELECT * FROM repository").all();
  return res;
};

const getAllEmailsListeningOnRepository = (repositoryId: number): string[] => {
  const res = db
    .prepare(
      "SELECT email FROM user INNER JOIN subscription ON user.id=subscription.userId WHERE repositoryId = ? AND verified = 1"
    )
    .all(repositoryId);
  return res.map((element) => element.email);
};

const doesUserExist = (email: string): boolean => {
  const { counter } = db
    .prepare("SELECT COUNT(*) AS counter FROM user WHERE email = ?")
    .get(email);
  return counter > 0;
};

const doesRepositoryExist = (
  organization: string,
  repository: string
): boolean => {
  const { counter } = db
    .prepare(
      "SELECT COUNT(*) AS counter FROM repository WHERE organization = ? AND repository = ?"
    )
    .get(organization, repository);
  return counter > 0;
};

const getUserId = (email: string): number => {
  const { id } = db.prepare("SELECT id FROM user WHERE email = ?").get(email);
  return id;
};

const getRepositoryById = (id: number): Repository => {
  const res = db.prepare("SELECT * FROM repository WHERE id = ?").get(id);
  return res;
};

const getRepositoryId = (organization: string, repository: string): number => {
  const { id } = db
    .prepare(
      "SELECT id FROM repository WHERE organization = ? AND repository = ?"
    )
    .get(organization, repository);
  return id;
};

const doesSubscriptionExist = (
  userId: number,
  repositoryId: number
): boolean => {
  const { counter } = db
    .prepare(
      "SELECT COUNT(*) AS counter FROM subscription WHERE userId = ? AND repositoryId = ?"
    )
    .get(userId, repositoryId);
  return counter > 0;
};

export {
  initDb,
  addSubscription,
  getAllRepositories,
  getAllEmailsListeningOnRepository,
  getRepositoryById,
  getUserByEmail,
  getUserByUuid,
  verifyUserEmail,
  getSubscriptionsByEmail,
};
