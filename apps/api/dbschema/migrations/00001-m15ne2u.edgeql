CREATE MIGRATION m15ne2u2j6czzrdghuczdtvxztfpfjxkezxepv7ossw3wowf7zl34a
    ONTO initial
{
  CREATE TYPE default::Pet {
      CREATE REQUIRED PROPERTY name: std::str;
  };
};
