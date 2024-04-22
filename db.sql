-- ----------------------------
-- Table structure for attendance
-- ----------------------------
DROP TABLE IF EXISTS "public"."attendance";
CREATE TABLE "public"."attendance" (
  "id" int4 NOT NULL DEFAULT nextval('attendance_id_seq'::regclass),
  "session_id" int4 NOT NULL,
  "student_id" int4 NOT NULL,
  "join_date" date NOT NULL
)
;
ALTER TABLE "public"."attendance" OWNER TO "postgres";

-- ----------------------------
-- Table structure for course_student
-- ----------------------------
DROP TABLE IF EXISTS "public"."course_student";
CREATE TABLE "public"."course_student" (
  "id" int4 NOT NULL DEFAULT nextval('course_student_id_seq'::regclass),
  "course_id" int4 NOT NULL,
  "student_id" int4 NOT NULL
)
;
ALTER TABLE "public"."course_student" OWNER TO "postgres";

-- ----------------------------
-- Table structure for course_teacher
-- ----------------------------
DROP TABLE IF EXISTS "public"."course_teacher";
CREATE TABLE "public"."course_teacher" (
  "id" int4 NOT NULL DEFAULT nextval('course_teacher_id_seq'::regclass),
  "course_id" int4 NOT NULL,
  "teacher_id" int4 NOT NULL
)
;
ALTER TABLE "public"."course_teacher" OWNER TO "postgres";

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS "public"."courses";
CREATE TABLE "public"."courses" (
  "id" int4 NOT NULL DEFAULT nextval('courses_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."courses" OWNER TO "postgres";

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS "public"."roles";
CREATE TABLE "public"."roles" (
  "id" int4 NOT NULL DEFAULT nextval('roles_id_seq'::regclass),
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."roles" OWNER TO "postgres";

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS "public"."sessions";
CREATE TABLE "public"."sessions" (
  "id" int4 NOT NULL DEFAULT nextval('sessions_id_seq'::regclass),
  "course_id" int4 NOT NULL,
  "start_date" timestamp(6) NOT NULL,
  "end_date" timestamp(6) NOT NULL,
  "teacher_id" int4,
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "description" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."sessions" OWNER TO "postgres";

-- ----------------------------
-- Table structure for user_role
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_role";
CREATE TABLE "public"."user_role" (
  "id" int4 NOT NULL DEFAULT nextval('user_role_id_seq'::regclass),
  "user_id" int4 NOT NULL,
  "role_id" int4 NOT NULL
)
;
ALTER TABLE "public"."user_role" OWNER TO "postgres";

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "first_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "dob" date,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "phone_number" varchar(255) COLLATE "pg_catalog"."default",
  "blood_type" varchar(255) COLLATE "pg_catalog"."default",
  "password" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "user_name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;
ALTER TABLE "public"."users" OWNER TO "postgres";

-- ----------------------------
-- Uniques structure for table attendance
-- ----------------------------
ALTER TABLE "public"."attendance" ADD CONSTRAINT "Unique_Attendance" UNIQUE ("session_id", "student_id");

-- ----------------------------
-- Primary Key structure for table attendance
-- ----------------------------
ALTER TABLE "public"."attendance" ADD CONSTRAINT "attendance_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table course_student
-- ----------------------------
ALTER TABLE "public"."course_student" ADD CONSTRAINT "Course_Student_Unique" UNIQUE ("course_id", "student_id");

-- ----------------------------
-- Primary Key structure for table course_student
-- ----------------------------
ALTER TABLE "public"."course_student" ADD CONSTRAINT "course_student_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table course_teacher
-- ----------------------------
ALTER TABLE "public"."course_teacher" ADD CONSTRAINT "Course_Teacher_Unique" UNIQUE ("course_id", "teacher_id");

-- ----------------------------
-- Primary Key structure for table course_teacher
-- ----------------------------
ALTER TABLE "public"."course_teacher" ADD CONSTRAINT "course_teacher_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table courses
-- ----------------------------
ALTER TABLE "public"."courses" ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table roles
-- ----------------------------
ALTER TABLE "public"."roles" ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table user_role
-- ----------------------------
ALTER TABLE "public"."user_role" ADD CONSTRAINT "User_Role_Unique" UNIQUE ("user_id", "role_id");

-- ----------------------------
-- Primary Key structure for table user_role
-- ----------------------------
ALTER TABLE "public"."user_role" ADD CONSTRAINT "user_role_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "Email" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "Username" UNIQUE ("user_name");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "userfs_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table attendance
-- ----------------------------
ALTER TABLE "public"."attendance" ADD CONSTRAINT "Session" FOREIGN KEY ("session_id") REFERENCES "public"."sessions" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."attendance" ADD CONSTRAINT "Student" FOREIGN KEY ("student_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table course_student
-- ----------------------------
ALTER TABLE "public"."course_student" ADD CONSTRAINT "Course" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."course_student" ADD CONSTRAINT "Student" FOREIGN KEY ("student_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table course_teacher
-- ----------------------------
ALTER TABLE "public"."course_teacher" ADD CONSTRAINT "Course" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."course_teacher" ADD CONSTRAINT "Teacher" FOREIGN KEY ("teacher_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table sessions
-- ----------------------------
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "public"."users" ("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_role
-- ----------------------------
ALTER TABLE "public"."user_role" ADD CONSTRAINT "Role" FOREIGN KEY ("role_id") REFERENCES "public"."roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."user_role" ADD CONSTRAINT "User" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION;
