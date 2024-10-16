CREATE MIGRATION m1p7s3uzhavxjuqlkxa4gm3dgl6oesg4fkl2d345m2lr7s6ftwjkkq
    ONTO m1xdpvw7ak72ksumvsudyefrsyvy35l4aflrojd7yr5b2wg5yf5wqa
{
  ALTER TYPE default::Pet {
      CREATE REQUIRED PROPERTY age: std::int16 {
          SET REQUIRED USING (20);
      };
  };
  ALTER TYPE default::User {
      CREATE PROPERTY age: std::int16;
  };
};
