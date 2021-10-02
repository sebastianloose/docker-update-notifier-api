import Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import { Subscription } from "../types/subscriptionType";

const db = new Database("main.db");

const initDb = () => {
  db.exec(
    "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, email STRING NOT NULL UNIQUE, uuid STRING NOT NULL UNIQUE, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS subscription (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INT NOT NULL, repositoryId INT NOT NULL)"
  );
  db.exec(
    "CREATE TABLE IF NOT EXISTS repository (id INTEGER PRIMARY KEY AUTOINCREMENT, organization STRING NOT NULL, repository STRING NOT NULL)"
  );
};

const addSubscription = ({ email, organization, repository }: Subscription) => {
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
