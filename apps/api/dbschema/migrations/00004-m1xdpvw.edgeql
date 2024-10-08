CREATE MIGRATION m1xdpvw7ak72ksumvsudyefrsyvy35l4aflrojd7yr5b2wg5yf5wqa
    ONTO m1cq2gfheld6ma4j4rb3ce5wi57ytbqpis37gerqvz34yufoa3xp3q
{
  ALTER TYPE default::User {
      DROP PROPERTY name;
  };
};
