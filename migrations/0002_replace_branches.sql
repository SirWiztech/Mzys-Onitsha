-- 0002_replace_branches.sql
-- 1) Repairs the live `branches` table, which was created WITHOUT the
--    auto_increment primary key / unique key (every other table matches
--    0001_init.sql). App INSERTs into branches would fail with
--    "Field 'row_id' doesn't have a default value". We drop and recreate the
--    table with the canonical schema — safe because all rows are replaced
--    with the official list below anyway.
-- 2) Replaces the old ad-hoc branch list with the official
--    15-branch / 4-district structure.
-- 3) Remaps member.branchId values that pointed at renamed or removed
--    branches so no member is orphaned.
--
-- ID mapping (carried-over ids keep existing references valid):
--   msan4mh6ll3pgb  Fegge Provincial HQ         -> kept, renamed "Fegge Provincial Headquarters Branch"
--   msan4mh1rsfec1  Inland Town District        -> kept, renamed "Inland Town Branch"
--   msan4mh531hlui  Ogbeumuonitsha              -> kept, renamed "Ogbe Umu Onicha Branch"
--   msan4mh6jkkaw1  Nkpor 3                     -> kept
--   msan4mh5gf73lp  Obosi Branch                -> kept
--   mrw0770jdowchx  Fegge Branch                -> Fegge Provincial Headquarters Branch
--   mrw0770jv822j5  Onitsha Main                -> Fegge Provincial Headquarters Branch
--   mrw0770joct3yp  GRA Branch                  -> Fegge Provincial Headquarters Branch
--   mrw0770jnz5rsb  Works Layout                -> Fegge Provincial Headquarters Branch
--   msan4mh5oeq043  ESOCS Mount of Miracle Obosi-> Obosi Branch
--   (any other non-empty unknown id)            -> Fegge Provincial Headquarters Branch

-- 1) Remap members that referenced branches being renamed or removed.
UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh6ll3pgb')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) = 'mrw0770jdowchx';

UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh6ll3pgb')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) = 'mrw0770jv822j5';

UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh6ll3pgb')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) = 'mrw0770joct3yp';

UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh6ll3pgb')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) = 'mrw0770jnz5rsb';

UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh5gf73lp')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) = 'msan4mh5oeq043';

-- 2) Safety net: any member still pointing at a branch that will no longer
--    exist (unknown id) goes to the Provincial Headquarters. Empty ids
--    (e.g. the admin account) are left untouched.
UPDATE `members` SET `data` = JSON_SET(`data`, '$.branchId', 'msan4mh6ll3pgb')
WHERE JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) <> ''
  AND JSON_UNQUOTE(JSON_EXTRACT(`data`, '$.branchId')) NOT IN ('msan4mh6ll3pgb','msan4mh1rsfec1','msan4mh531hlui','mzbrnsugbe000001','mzbrsanctgr000001','mzbrnkpor1000001','mzbrnkpor2000001','msan4mh6jkkaw1','mzbrogidi1000001','mzbrogidi2000001','mzbrogidi3000001','mzbrogidi4000001','mzbraawada000001','msan4mh5gf73lp','mzbralor0000001');

-- 3) Recreate `branches` with the canonical schema (the live table was missing
--    the auto_increment primary key and the unique key on `id`).
DROP TABLE IF EXISTS `branches`;
CREATE TABLE `branches` (
  `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id` VARCHAR(64) NOT NULL,
  `data` JSON NOT NULL,
  PRIMARY KEY (`row_id`),
  UNIQUE KEY `uk_branches_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4) Insert the official 15-branch / 4-district list.
INSERT INTO `branches` (`id`, `data`) VALUES
('msan4mh6ll3pgb', '{"id":"msan4mh6ll3pgb","name":"Fegge Provincial Headquarters Branch","location":"Fegge, Onitsha","leaderName":"","leaderPhone":"","createdAt":"2026-08-01T17:23:44.202Z","district":null}'),
('msan4mh1rsfec1', '{"id":"msan4mh1rsfec1","name":"Inland Town Branch","location":"Inland Town, Onitsha","leaderName":"","leaderPhone":"","createdAt":"2026-08-01T17:23:44.197Z","district":"Inland District"}'),
('msan4mh531hlui', '{"id":"msan4mh531hlui","name":"Ogbe Umu Onicha Branch","location":"Ogbe, Onitsha","leaderName":"","leaderPhone":"","createdAt":"2026-08-01T17:23:44.201Z","district":"Inland District"}'),
('mzbrnsugbe000001', '{"id":"mzbrnsugbe000001","name":"Nsugbe Branch","location":"Nsugbe, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Inland District"}'),
('mzbrsanctgr000001', '{"id":"mzbrsanctgr000001","name":"Sanctuary of Grace","location":"Onitsha, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Inland District"}'),
('mzbrnkpor1000001', '{"id":"mzbrnkpor1000001","name":"Nkpor 1","location":"Nkpor, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Nkpor District"}'),
('mzbrnkpor2000001', '{"id":"mzbrnkpor2000001","name":"Nkpor 2","location":"Nkpor, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Nkpor District"}'),
('msan4mh6jkkaw1', '{"id":"msan4mh6jkkaw1","name":"Nkpor 3","location":"Nkpor, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-08-01T17:23:44.202Z","district":"Nkpor District"}'),
('mzbrogidi1000001', '{"id":"mzbrogidi1000001","name":"Ogidi 1","location":"Ogidi, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Ogidi District"}'),
('mzbrogidi2000001', '{"id":"mzbrogidi2000001","name":"Ogidi 2","location":"Ogidi, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Ogidi District"}'),
('mzbrogidi3000001', '{"id":"mzbrogidi3000001","name":"Ogidi 3","location":"Ogidi, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Ogidi District"}'),
('mzbrogidi4000001', '{"id":"mzbrogidi4000001","name":"Ogidi 4","location":"Ogidi, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Ogidi District"}'),
('mzbraawada000001', '{"id":"mzbraawada000001","name":"Awada Branch","location":"Awada, Obosi","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Awada District"}'),
('msan4mh5gf73lp', '{"id":"msan4mh5gf73lp","name":"Obosi Branch","location":"Obosi, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-08-01T17:23:44.201Z","district":"Awada District"}'),
('mzbralor0000001', '{"id":"mzbralor0000001","name":"Alor Branch","location":"Alor, Anambra","leaderName":"","leaderPhone":"","createdAt":"2026-09-25T00:00:00.000Z","district":"Awada District"}');
