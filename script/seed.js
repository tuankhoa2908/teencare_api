/**
 * Seed script – Tạo dữ liệu mẫu
 * Chạy: node script/seed.js
 */
const db = require("../app/models/index.model");

const seedData = async () => {
  try {
    // Sync database (force: true sẽ drop & tạo lại bảng)
    await db.sequelize.sync({ force: true });
    console.log("✅ Database synced (tables created)");

    // === PARENTS ===
    const parent1 = await db.parents.create({
      name: "Nguyễn Văn An",
      phone: "0901234567",
      email: "nguyenvanan@gmail.com",
      created_at: Math.floor(Date.now() / 1000),
    });

    const parent2 = await db.parents.create({
      name: "Trần Thị Bích",
      phone: "0912345678",
      email: "tranthibich@gmail.com",
      created_at: Math.floor(Date.now() / 1000),
    });

    console.log("✅ Created 2 parents");

    // === STUDENTS ===
    const student1 = await db.students.create({
      name: "Nguyễn Minh Tuấn",
      dob: "2010-03-15",
      gender: "male",
      current_grade: "10",
      parent_id: parent1.id,
      created_at: Math.floor(Date.now() / 1000),
    });

    const student2 = await db.students.create({
      name: "Nguyễn Thanh Hà",
      dob: "2012-07-22",
      gender: "female",
      current_grade: "8",
      parent_id: parent1.id,
      created_at: Math.floor(Date.now() / 1000),
    });

    const student3 = await db.students.create({
      name: "Trần Đức Minh",
      dob: "2011-01-10",
      gender: "male",
      current_grade: "9",
      parent_id: parent2.id,
      created_at: Math.floor(Date.now() / 1000),
    });

    console.log("✅ Created 3 students");

    // === CLASSES ===
    const class1 = await db.classes.create({
      name: "Toán nâng cao",
      subject: "Toán",
      day_of_week: "Monday",
      time_slot: "08:00-09:30",
      teacher_name: "Thầy Trần Văn Khoa",
      max_students: 5,
      created_at: Math.floor(Date.now() / 1000),
    });

    const class2 = await db.classes.create({
      name: "Tiếng Anh giao tiếp",
      subject: "Tiếng Anh",
      day_of_week: "Wednesday",
      time_slot: "14:00-15:30",
      teacher_name: "Cô Lê Thị Mai",
      max_students: 10,
      created_at: Math.floor(Date.now() / 1000),
    });

    const class3 = await db.classes.create({
      name: "Vật lý cơ bản",
      subject: "Vật lý",
      day_of_week: "Friday",
      time_slot: "10:00-11:30",
      teacher_name: "Thầy Phạm Quốc Hùng",
      max_students: 8,
      created_at: Math.floor(Date.now() / 1000),
    });

    console.log("✅ Created 3 classes");

    // === SUBSCRIPTIONS ===
    await db.subscriptions.create({
      student_id: student1.id,
      package_name: "Gói Cơ bản",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      total_sessions: 20,
      used_sessions: 2,
      created_at: Math.floor(Date.now() / 1000),
    });

    await db.subscriptions.create({
      student_id: student2.id,
      package_name: "Gói Nâng cao",
      start_date: "2026-01-01",
      end_date: "2026-06-30",
      total_sessions: 30,
      used_sessions: 5,
      created_at: Math.floor(Date.now() / 1000),
    });

    await db.subscriptions.create({
      student_id: student3.id,
      package_name: "Gói Cơ bản",
      start_date: "2026-02-01",
      end_date: "2026-12-31",
      total_sessions: 15,
      used_sessions: 0,
      created_at: Math.floor(Date.now() / 1000),
    });

    console.log("✅ Created 3 subscriptions");

    // === CLASS REGISTRATIONS ===
    await db.class_registrations.create({
      class_id: class1.id,
      student_id: student1.id,
      registered_at: new Date(),
    });

    await db.class_registrations.create({
      class_id: class2.id,
      student_id: student2.id,
      registered_at: new Date(),
    });

    console.log("✅ Created 2 class registrations");

    console.log("\n🎉 Seed data completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
};

seedData();
