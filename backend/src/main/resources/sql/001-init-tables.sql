CREATE SCHEMA appointments;

CREATE TABLE appointments.scripts (
    filename character varying(255) NOT NULL,
    passed timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT scripts_pkey PRIMARY KEY (filename)
);

CREATE TYPE appointments.G_STATE AS ENUM (
    'OPEN',
    'SUSPENDED',
    'CLOSED',
    'DELETED'
);

CREATE TYPE appointments.A_STATE AS ENUM (
    'CREATED',
    'ACCEPTED',
    'REFUSED',
    'CANCELED'
);

CREATE TYPE appointments.DAY AS ENUM (
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY'
);

CREATE TABLE appointments.grid (
    id bigserial PRIMARY KEY,
    name varchar(255) NOT NULL,
    owner_id varchar(255) NOT NULL,
    structure_id varchar(255) NOT NULL,
    begin_date date NOT NULL,
    end_date date NOT NULL,
    creation_date timestamp NOT NULL,
    updating_date timestamp NOT NULL,
    color varchar(255) NOT NULL,
    duration interval NOT NULL,
    periodicity integer NOT NULL,
    target_public_list_id varchar(2000) NOT NULL,
    video_call_link varchar(255) NOT NULL,
    place varchar(255) NOT NULL,
    documents_ids varchar(255) NOT NULL,
    public_comment varchar(255) NOT NULL,
    state appointments.G_STATE NOT NULL
);

CREATE UNIQUE INDEX unique_name_owner_active_grid
ON appointments.grid (name, owner_id)
WHERE state NOT IN ('CLOSED', 'DELETED');


CREATE TABLE appointments.grid_state (
    id bigserial PRIMARY KEY,
    state appointments.G_STATE NOT NULL,
    grid_id bigint NOT NULL,
    date timestamp NOT NULL,
    CONSTRAINT fk_grid_id FOREIGN KEY(grid_id) REFERENCES appointments.grid(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE appointments.daily_slot (
    id bigserial PRIMARY KEY,
    day appointments.DAY NOT NULL,
    begin_time time NOT NULL,
    end_time time NOT NULL,
    grid_id bigint NOT NULL,
    CONSTRAINT fk_grid_id FOREIGN KEY(grid_id) REFERENCES appointments.grid(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE appointments.time_slot (
    id bigserial PRIMARY KEY,
    begin_date timestamp NOT NULL,
    end_date timestamp NOT NULL,
    grid_id bigint NOT NULL,
    CONSTRAINT fk_grid_id FOREIGN KEY(grid_id) REFERENCES appointments.grid(id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE appointments.appointment (
    id bigserial PRIMARY KEY,
    requester_id varchar(255) NOT NULL,
    time_slot_id bigint NOT NULL,
    state appointments.A_STATE NOT NULL,
    is_video_call boolean NOT NULL,
    CONSTRAINT fk_time_slot_id FOREIGN KEY (time_slot_id) REFERENCES appointments.time_slot (id) ON UPDATE NO ACTION ON DELETE CASCADE
);

CREATE TABLE appointments.appointment_state (
    id bigserial PRIMARY KEY,
    appointment_id bigint NOT NULL,
    state appointments.A_STATE NOT NULL,
    actor_id varchar(255) NOT NULL,
    date timestamp NOT NULL,
    CONSTRAINT fk_appointment_id FOREIGN KEY (appointment_id) REFERENCES appointments.appointment (id) ON UPDATE NO ACTION ON DELETE CASCADE
);


