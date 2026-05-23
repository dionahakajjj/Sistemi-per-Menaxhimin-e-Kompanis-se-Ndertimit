import React from 'react';
import GenericCRUD from '../components/GenericCRUD';

// 1. Users Page
export const UsersPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false, hiddenInTable: false },
    { name: 'username', label: 'Përdoruesi (Username)', type: 'text', required: true },
    { name: 'email', label: 'Email Adresa', type: 'email', required: true },
    { name: 'password', label: 'Fjalëkalimi', type: 'password', required: true, hiddenInTable: true },
    { 
      name: 'role', 
      label: 'Roli', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Menaxher', label: 'Menaxher' },
        { value: 'Punëtor', label: 'Punëtor' }
      ]
    }
  ];

  return <GenericCRUD entityName="users" title="Menaxhimi i Përdoruesve" fields={fields} />;
};

// 2. Clients Page
export const ClientsPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri i Klientit', type: 'text', required: true },
    { name: 'kompania', label: 'Kompania', type: 'text', required: false },
    { name: 'email', label: 'Email', type: 'email', required: false },
    { name: 'telefoni', label: 'Telefoni', type: 'text', required: false },
    { name: 'adresa', label: 'Adresa', type: 'text', required: false },
    { name: 'lloji_klientit', label: 'Lloji i Klientit', type: 'text', required: false }
  ];

  return <GenericCRUD entityName="clients" title="Menaxhimi i Klientëve" fields={fields} />;
};

// 3. Projects Page
export const ProjectsPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri i Projektit', type: 'text', required: true },
    { name: 'përshkrimi', label: 'Përshkrimi', type: 'textarea', required: false, hiddenInTable: true },
    { 
      name: 'klienti_id', 
      label: 'Klienti', 
      type: 'relation', 
      required: true,
      relation: { entity: 'clients', labelField: 'emri', idField: 'id' }
    },
    { name: 'lokacioni', label: 'Lokacioni', type: 'text', required: false },
    { 
      name: 'buxheti', 
      label: 'Buxheti', 
      type: 'number', 
      required: false,
      displayFormatter: (item) => item.buxheti ? `${parseFloat(item.buxheti).toLocaleString('de-DE')} €` : '-'
    },
    { name: 'data_fillimit', label: 'Data e Fillimit', type: 'date', required: false }
  ];

  return <GenericCRUD entityName="projects" title="Menaxhimi i Projekteve Ndërtimore" fields={fields} />;
};

// 4. Workers Page
export const WorkersPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri', type: 'text', required: true },
    { name: 'mbiemri', label: 'Mbiemri', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: false },
    { name: 'telefoni', label: 'Telefoni', type: 'text', required: false },
    { name: 'profesioni', label: 'Profesioni', type: 'text', required: false },
    { 
      name: 'paga_ditore', 
      label: 'Paga Ditore', 
      type: 'number', 
      required: false,
      displayFormatter: (item) => item.paga_ditore ? `${parseFloat(item.paga_ditore).toFixed(2)} €` : '-'
    },
    { name: 'data_punesimit', label: 'Data e Punësimit', type: 'date', required: false },
    { 
      name: 'statusi', 
      label: 'Statusi', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Aktiv', label: 'Aktiv' },
        { value: 'Joaktiv', label: 'Joaktiv' },
        { value: 'Në Pushim', label: 'Në Pushim' }
      ]
    }
  ];

  return <GenericCRUD entityName="workers" title="Menaxhimi i Punëtorëve" fields={fields} />;
};

// 5. Project Phases Page
export const ProjectPhasesPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { 
      name: 'projekti_id', 
      label: 'Projekti', 
      type: 'relation', 
      required: true,
      relation: { entity: 'projects', labelField: 'emri', idField: 'id' }
    },
    { name: 'emri', label: 'Emri i Fazës', type: 'text', required: true },
    { name: 'përshkrimi', label: 'Përshkrimi', type: 'textarea', required: false, hiddenInTable: true },
    { name: 'rendi', label: 'Rendi (Renditja)', type: 'number', required: false },
    { name: 'data_fillimit', label: 'Data e Fillimit', type: 'date', required: false },
    { name: 'data_mbarimit', label: 'Data e Mbarimit', type: 'date', required: false },
    { 
      name: 'statusi', 
      label: 'Statusi', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Në Pritje', label: 'Në Pritje' },
        { value: 'Në Proces', label: 'Në Proces' },
        { value: 'Kryer', label: 'Kryer' },
        { value: 'Pezulluar', label: 'Pezulluar' }
      ]
    },
    { 
      name: 'përqindja', 
      label: 'Progresi (%)', 
      type: 'number', 
      required: false,
      displayFormatter: (item) => (
        <div className="d-flex align-items-center gap-2" style={{ minWidth: '100px' }}>
          <div className="progress w-100 bg-dark" style={{ height: '6px' }}>
            <div className="progress-bar bg-info" style={{ width: `${item.përqindja || 0}%` }}></div>
          </div>
          <span className="small">{item.përqindja || 0}%</span>
        </div>
      )
    }
  ];

  return <GenericCRUD entityName="project-phases" title="Fazat e Projektit" fields={fields} />;
};

// 6. Tasks Page
export const TasksPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { 
      name: 'faza_id', 
      label: 'Faza e Projektit', 
      type: 'relation', 
      required: true,
      relation: { entity: 'project-phases', labelField: 'emri', idField: 'id' }
    },
    { name: 'emri', label: 'Emri i Detyrës', type: 'text', required: true },
    { name: 'përshkrimi', label: 'Përshkrimi', type: 'textarea', required: false, hiddenInTable: true },
    { 
      name: 'prioriteti', 
      label: 'Prioriteti', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Ulët', label: 'Ulët' },
        { value: 'Mesëm', label: 'Mesëm' },
        { value: 'Lartë', label: 'Lartë' }
      ]
    },
    { name: 'data_fillimit', label: 'Data e Fillimit', type: 'date', required: false },
    { name: 'data_mbarimit', label: 'Data e Mbarimit', type: 'date', required: false },
    { 
      name: 'statusi', 
      label: 'Statusi', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Pa Filluar', label: 'Pa Filluar' },
        { value: 'Në Proces', label: 'Në Proces' },
        { value: 'Përfunduar', label: 'Përfunduar' },
        { value: 'Bllokuar', label: 'Bllokuar' }
      ]
    }
  ];

  return <GenericCRUD entityName="tasks" title="Detyrat e Fazave" fields={fields} />;
};

// 7. Task Assignments Page
export const TaskAssignmentsPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { 
      name: 'detyra_id', 
      label: 'Detyra', 
      type: 'relation', 
      required: true,
      relation: { entity: 'tasks', labelField: 'emri', idField: 'id' }
    },
    { 
      name: 'punetori_id', 
      label: 'Punëtori i Caktuar', 
      type: 'relation', 
      required: true,
      relation: { entity: 'workers', labelField: 'emri', idField: 'id' },
      displayFormatter: (item) => item.worker ? `${item.worker.emri} ${item.worker.mbiemri}` : '-'
    },
    { name: 'data_caktimit', label: 'Data e Caktimit', type: 'date', required: false },
    { name: 'orët_punuara', label: 'Orët e Punuara', type: 'number', required: false }
  ];

  return <GenericCRUD entityName="task-assignments" title="Caktimi i Detyrave për Punëtorët" fields={fields} />;
};

// 8. Materials Page
export const MaterialsPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri i Materialit', type: 'text', required: true },
    { name: 'njësia_matëse', label: 'Njësia Matëse', type: 'text', required: false },
    { 
      name: 'çmimi_njesi', 
      label: 'Çmimi për Njësi', 
      type: 'number', 
      required: false,
      displayFormatter: (item) => item.çmimi_njesi ? `${parseFloat(item.çmimi_njesi).toFixed(2)} €` : '-'
    },
    { 
      name: 'furnitori_id', 
      label: 'Furnitori', 
      type: 'relation', 
      required: false,
      relation: { entity: 'suppliers', labelField: 'emri', idField: 'id' }
    },
    { name: 'sasia_stokut', label: 'Sasia në Stok', type: 'number', required: false },
    { name: 'kategoria', label: 'Kategoria', type: 'text', required: false }
  ];

  return <GenericCRUD entityName="materials" title="Menaxhimi i Materialeve (Stoku)" fields={fields} />;
};

// 9. Material Usages Page
export const MaterialUsagesPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { 
      name: 'projekti_id', 
      label: 'Projekti', 
      type: 'relation', 
      required: true,
      relation: { entity: 'projects', labelField: 'emri', idField: 'id' }
    },
    { 
      name: 'materiali_id', 
      label: 'Materiali', 
      type: 'relation', 
      required: true,
      relation: { entity: 'materials', labelField: 'emri', idField: 'id' }
    },
    { name: 'sasia', label: 'Sasia e Përdorur', type: 'number', required: true },
    { name: 'data_perdorimit', label: 'Data e Përdorimit', type: 'date', required: false },
    { 
      name: 'faza_id', 
      label: 'Faza e Projektit', 
      type: 'relation', 
      required: false,
      relation: { entity: 'project-phases', labelField: 'emri', idField: 'id' }
    }
  ];

  return <GenericCRUD entityName="material-usages" title="Konsumi i Materialeve në Projekte" fields={fields} />;
};

// 10. Suppliers Page
export const SuppliersPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri i Furnitorit', type: 'text', required: true },
    { name: 'kontakti', label: 'Personi Kontaktues', type: 'text', required: false },
    { name: 'email', label: 'Email', type: 'email', required: false },
    { name: 'telefoni', label: 'Telefoni', type: 'text', required: false },
    { name: 'adresa', label: 'Adresa', type: 'text', required: false },
    { name: 'specialiteti', label: 'Specialiteti (Materialet)', type: 'text', required: false }
  ];

  return <GenericCRUD entityName="suppliers" title="Menaxhimi i Furnitorëve" fields={fields} />;
};

// 11. Equipment Page
export const EquipmentPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { name: 'emri', label: 'Emri i Pajisjes', type: 'text', required: true },
    { name: 'lloji', label: 'Lloji i Pajisjes', type: 'text', required: false },
    { 
      name: 'statusi', 
      label: 'Statusi', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Në Përdorim', label: 'Në Përdorim' },
        { value: 'Në Stok', label: 'Në Stok' },
        { value: 'Në Riparim', label: 'Në Riparim' },
        { value: 'Jashtë Shërbimit', label: 'Jashtë Shërbimit' }
      ]
    },
    { 
      name: 'kosto_ditore', 
      label: 'Kosto Ditore (€)', 
      type: 'number', 
      required: false,
      displayFormatter: (item) => item.kosto_ditore ? `${parseFloat(item.kosto_ditore).toFixed(2)} €` : '-'
    },
    { name: 'data_blerjes', label: 'Data e Blerjes', type: 'date', required: false }
  ];

  return <GenericCRUD entityName="equipment" title="Menaxhimi i Pajisjeve dhe Makinerisë" fields={fields} />;
};

// 12. Invoices Page
export const InvoicesPage = () => {
  const fields = [
    { name: 'id', label: 'ID', type: 'number', required: false },
    { 
      name: 'projekti_id', 
      label: 'Projekti', 
      type: 'relation', 
      required: true,
      relation: { entity: 'projects', labelField: 'emri', idField: 'id' }
    },
    { 
      name: 'klienti_id', 
      label: 'Klienti', 
      type: 'relation', 
      required: true,
      relation: { entity: 'clients', labelField: 'emri', idField: 'id' }
    },
    { 
      name: 'shuma', 
      label: 'Shuma e Faturës', 
      type: 'number', 
      required: true,
      displayFormatter: (item) => item.shuma ? `${parseFloat(item.shuma).toLocaleString('de-DE')} €` : '-'
    },
    { name: 'përshkrimi', label: 'Përshkrimi/Detaje', type: 'textarea', required: false, hiddenInTable: true },
    { name: 'data_fatures', label: 'Data e Faturimit', type: 'date', required: false },
    { name: 'data_pageses', label: 'Data e Pagesës', type: 'date', required: false },
    { 
      name: 'statusi', 
      label: 'Statusi', 
      type: 'select', 
      required: false,
      options: [
        { value: 'Në Pritje', label: 'Në Pritje' },
        { value: 'Paguar', label: 'Paguar' },
        { value: 'Anuluar', label: 'Anuluar' }
      ]
    }
  ];

  return <GenericCRUD entityName="invoices" title="Faturat dhe Pagesat" fields={fields} />;
};
