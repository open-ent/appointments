ALTER TABLE appointments.appointment ADD COLUMN comment VARCHAR(255);
ALTER TABLE appointments.appointment ADD COLUMN commentator_id VARCHAR(255);
ALTER TABLE appointments.appointment ADD CONSTRAINT check_comment_infos_nullity CHECK ((comment IS NULL) = (commentator_id IS NULL));