const bcrypt = require('bcryptjs');
const {
  User,
  Client,
  Project,
  Worker,
  ProjectPhase,
  Task,
  TaskAssignment,
  Supplier,
  Material,
  MaterialUsage,
  Equipment,
  Invoice
} = require('../models');

const seedData = async () => {
  try {
    const userCount = await User.count();
    if (userCount > 0) {
      console.log('ℹ Databaza tashmë ka të dhëna. Seeding u anashkalua.');
      return;
    }

    console.log('🌱 Duke filluar mbushjen e databazës me të dhëna testuese (Seeding)...');

    // 1. Users
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const managerPass = await bcrypt.hash('menaxher123', salt);
    const workerPass = await bcrypt.hash('punetor123', salt);

    await User.bulkCreate([
      { username: 'admin', email: 'admin@ndertimi.com', passwordHash: adminPass, role: 'Admin' },
      { username: 'menaxher', email: 'menaxher@ndertimi.com', passwordHash: managerPass, role: 'Menaxher' },
      { username: 'punetor', email: 'punetor@ndertimi.com', passwordHash: workerPass, role: 'Punëtor' }
    ]);
    console.log('✔ Përdoruesit u krijuan (admin/admin123, menaxher/menaxher123, punetor/punetor123).');

    // 2. Clients
    const clients = await Client.bulkCreate([
      { emri: 'Kastrati Group', kompania: 'Kastrati Sh.A.', email: 'info@kastrati.com', telefoni: '044111222', adresa: 'Prishtinë', lloji_klientit: 'Korporatë' },
      { emri: 'Standard Shpk', kompania: 'Standard Shpk', email: 'info@standard.com', telefoni: '049333444', adresa: 'Fushë Kosovë', lloji_klientit: 'Korporatë' },
      { emri: 'Bekim Gashi', kompania: 'Individual', email: 'bekim.g@gmail.com', telefoni: '045888999', adresa: 'Pejë', lloji_klientit: 'Individual' }
    ]);
    console.log('✔ Klientët u krijuan.');

    // 3. Projects
    const projects = await Project.bulkCreate([
      { emri: "Kompleksi Banesor 'Iliria'", përshkrimi: 'Ndërtimi i 3 blloqeve banesore me 12 kate.', klienti_id: clients[0].id, lokacioni: 'Prishtinë', buxheti: 2500000.00, data_fillimit: '2026-06-01' },
      { emri: "Qendra Tregtare 'Plaza'", përshkrimi: 'Ndërtimi i një qendre tregtare dy-katëshe.', klienti_id: clients[1].id, lokacioni: 'Gjilan', buxheti: 850000.00, data_fillimit: '2026-07-15' },
      { emri: "Shtëpi Familjare - Pejë", përshkrimi: 'Ndërtimi i një shtëpie private luksoze me pishinë.', klienti_id: clients[2].id, lokacioni: 'Pejë', buxheti: 180000.00, data_fillimit: '2026-08-01' }
    ]);
    console.log('✔ Projektet u krijuan.');

    // 4. Workers
    const workers = await Worker.bulkCreate([
      { emri: 'Agron', mbiemri: 'Krasniqi', email: 'agron@ndertimi.com', telefoni: '044555666', profesioni: 'Zidar', paga_ditore: 45.00, data_punesimit: '2024-01-10', statusi: 'Aktiv' },
      { emri: 'Blerim', mbiemri: 'Gashi', email: 'blerim@ndertimi.com', telefoni: '044777888', profesioni: 'Elektricist', paga_ditore: 50.00, data_punesimit: '2024-03-15', statusi: 'Aktiv' },
      { emri: 'Valon', mbiemri: 'Morina', email: 'valon@ndertimi.com', telefoni: '044999000', profesioni: 'Inxhinier Ndërtimi', paga_ditore: 80.00, data_punesimit: '2023-05-20', statusi: 'Aktiv' }
    ]);
    console.log('✔ Punëtorët u krijuan.');

    // 5. Project Phases
    const phases = await ProjectPhase.bulkCreate([
      { projekti_id: projects[0].id, emri: 'Punimet e Dheut & Gërmimi', përshkrimi: 'Hapja e gropës thithëse dhe gërmimet fillestare.', rendi: 1, data_fillimit: '2026-06-01', data_mbarimit: '2026-06-20', statusi: 'Kryer', përqindja: 100 },
      { projekti_id: projects[0].id, emri: 'Struktura & Betonimi', përshkrimi: 'Lidhja e armaturës dhe betonimi i shtyllave.', rendi: 2, data_fillimit: '2026-06-21', data_mbarimit: '2026-09-01', statusi: 'Në Proces', përqindja: 45 },
      { projekti_id: projects[1].id, emri: 'Projektimi & Lejet', përshkrimi: 'Aprovimi i projekteve arkitektonike dhe lejet komunale.', rendi: 1, data_fillimit: '2026-07-15', data_mbarimit: '2026-08-10', statusi: 'Në Pritje', përqindja: 0 }
    ]);
    console.log('✔ Fazat e projekteve u krijuan.');

    // 6. Tasks
    const tasks = await Task.bulkCreate([
      { faza_id: phases[0].id, emri: 'Gërmimi i gropës së themelit', përshkrimi: 'Gërmimi me ekskavator deri në 5 metra thellësi.', prioriteti: 'Lartë', data_fillimit: '2026-06-01', data_mbarimit: '2026-06-10', statusi: 'Përfunduar' },
      { faza_id: phases[0].id, emri: 'Transporti i dheut të tepërt', përshkrimi: 'Largimi i dheut jashtë zonës së ndërtimit.', prioriteti: 'Mesëm', data_fillimit: '2026-06-11', data_mbarimit: '2026-06-20', statusi: 'Përfunduar' },
      { faza_id: phases[1].id, emri: 'Montimi i armaturës së themelit', përshkrimi: 'Lidhja e hekurit sipas projektit statik.', prioriteti: 'Lartë', data_fillimit: '2026-06-21', data_mbarimit: '2026-07-10', statusi: 'Në Proces' }
    ]);
    console.log('✔ Detyrat u krijuan.');

    // 7. Task Assignments
    await TaskAssignment.bulkCreate([
      { detyra_id: tasks[0].id, punetori_id: workers[0].id, data_caktimit: '2026-06-02', orët_punuara: 45.00 },
      { detyra_id: tasks[1].id, punetori_id: workers[1].id, data_caktimit: '2026-06-12', orët_punuara: 30.00 },
      { detyra_id: tasks[2].id, punetori_id: workers[2].id, data_caktimit: '2026-06-22', orët_punuara: 15.00 }
    ]);
    console.log('✔ Caktimet e detyrave u kryen.');

    // 8. Suppliers
    const suppliers = await Supplier.bulkCreate([
      { emri: 'Shala Shpk', kontakti: 'Arben Shala', email: 'arben@shala.com', telefoni: '049111999', adresa: 'Pejë', specialiteti: 'Materiale Ndërtimore Kryesore' },
      { emri: 'Elkos Group', kontakti: 'Ramiz Kelmendi', email: 'info@elkos.com', telefoni: '049222888', adresa: 'Pejë', specialiteti: 'Vegla & Pajisje Elektro-Ujësjellës' }
    ]);
    console.log('✔ Furnitorët u krijuan.');

    // 9. Materials
    const materials = await Material.bulkCreate([
      { emri: 'Çimento 50kg', njësia_matëse: 'thasë', çmimi_njesi: 4.50, furnitori_id: suppliers[0].id, sasia_stokut: 500.00, kategoria: 'Lidhës' },
      { emri: 'Hekur Armature 12mm', njësia_matëse: 'kg', çmimi_njesi: 0.85, furnitori_id: suppliers[0].id, sasia_stokut: 12000.00, kategoria: 'Metale' },
      { emri: 'Kabull Elektrik 3x2.5', njësia_matëse: 'metër', çmimi_njesi: 1.20, furnitori_id: suppliers[1].id, sasia_stokut: 800.00, kategoria: 'Elektrikë' }
    ]);
    console.log('✔ Materialet u krijuan.');

    // 10. Material Usages
    await MaterialUsage.bulkCreate([
      { projekti_id: projects[0].id, materiali_id: materials[0].id, sasia: 150.00, data_perdorimit: '2026-06-05', faza_id: phases[0].id },
      { projekti_id: projects[0].id, materiali_id: materials[1].id, sasia: 4500.00, data_perdorimit: '2026-06-25', faza_id: phases[1].id }
    ]);
    console.log('✔ Përdorimi i materialeve u regjistrua.');

    // 11. Equipment
    await Equipment.bulkCreate([
      { emri: 'Ekskavator CAT 320', lloji: 'Rëndë', statusi: 'Në Përdorim', kosto_ditore: 150.00, data_blerjes: '2022-05-12' },
      { emri: 'Mikser Betoni 10m3', lloji: 'Transportues', statusi: 'Në Stok', kosto_ditore: 120.00, data_blerjes: '2023-08-22' }
    ]);
    console.log('✔ Pajisjet u krijuan.');

    // 12. Invoices
    await Invoice.bulkCreate([
      { projekti_id: projects[0].id, klienti_id: clients[0].id, shuma: 15000.00, përshkrimi: 'Avansi i parë për punimet e dheut.', data_fatures: '2026-06-02', data_pageses: '2026-06-05', statusi: 'Paguar' },
      { projekti_id: projects[0].id, klienti_id: clients[0].id, shuma: 35000.00, përshkrimi: 'Faturimi për përfundimin e gropës së themelit.', data_fatures: '2026-06-21', data_pageses: null, statusi: 'Në Pritje' }
    ]);
    console.log('✔ Faturat u krijuan.');

    console.log('🌱 Seeding përfundoi me sukses! Databaza është gati.');
  } catch (error) {
    console.error('❌ Gabim gjatë seeding:', error);
  }
};

module.exports = seedData;
