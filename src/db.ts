import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Subscription } from "./types/subscriptionType";

const db = new Database("main.db");

const initDb = () => {
  db.exec(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, mail STRING NOT NULL UNIQUE, uuid STRING NOT NULL UNIQUE, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INT NOT NULL, repositoryId INT NOT NULL)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS repository (id INTEGER PRIMARY KEY AUTOINCREMENT, organization STRING NOT NULL, repository STRING NOT NULL)"
  );
};

const addSubscription = ({ mail, organization, repository }: Subscription) => {
  if (!doesUserExist(mail)) {
    db.prepare("INSERT INTO user (mail, uuid) VALUES (?, ?)").run(
      mail,
      uuidv4()
    );
    console.log(`Created user ${mail}`);
  }

  if (!doesRepositoryExist(organization, repository)) {
    db.prepare(
      "INSERT INTO repository (organization, repository) VALUES (?, ?)"
    ).run(organization, repository);
    console.log(`Created repository ${organization}/${repository}`);
  }

  const userId = getUserId(mail);
  const repositoryId = getRepositoryId(organization, repository);

  if (doesSubscriptionExist(userId, repositoryId)) {
    console.log(
      `Subscription does already exist - ${mail} ${organization}/${repository}`
    );
    return;
  }

  db.prepare(
    "INSERT INTO subscription (userId, repositoryId) VALUES (?, ?)"
  ).run(userId, repositoryId);
  console.log(`Added subscription - ${mail} ${organization}/${repository}`);
};

const doesUserExist = (mail: string): boolean => {
  const { counter } = db
    .prepare("SELECT COUNT(*) AS counter FROM user WHERE mail = ?")
    .get(mail);
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

const getUserId = (mail: string): number => {
  const { id } = db.prepare("SELECT id FROM user WHERE mail = ?").get(mail);
  return id;
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

export { initDb, addSubscription };
