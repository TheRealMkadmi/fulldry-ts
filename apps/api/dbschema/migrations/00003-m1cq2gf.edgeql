CREATE MIGRATION m1cq2gfheld6ma4j4rb3ce5wi57ytbqpis37gerqvz34yufoa3xp3q
    ONTO m1keaz2npq6o7e5ob5ym5uplajcf5z2tllzxbfurgvtasqjsr4m27q
{
  ALTER TYPE default::Pet {
      ALTER PROPERTY name {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::User {
      CREATE MULTI LINK pets: default::Pet;
      CREATE REQUIRED PROPERTY email: std::str;
      CREATE REQUIRED PROPERTY name: std::str;
      CREATE REQUIRED PROPERTY password: std::str;
  };
};
