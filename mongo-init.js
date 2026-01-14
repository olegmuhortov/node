db.createUser({
  user: "user_service_admin",
  pwd: "service_password",
  roles: [
    {
      role: "readWrite",
      db: "user_service"
    }
  ]
});

db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ status: 1 });
db.users.createIndex({ role: 1 });
db.users.createIndex({ createdAt: -1 });
