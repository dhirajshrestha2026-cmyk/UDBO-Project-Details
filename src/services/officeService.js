// Office Management Service
// Handles office CRUD operations and automatic section generation

export const OFFICE_SECTIONS = {
  NCB: 'ncb',
  SEALED_QUOTATIONS: 'sealed_quotations',
  USER_COMMITTEE: 'user_committee'
};

export const OFFICE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

const STORAGE_KEY = 'offices';

/**
 * Get all offices from storage
 * @returns {array} - Array of offices
 */
export const getAllOffices = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error fetching offices:', error);
    return [];
  }
};

/**
 * Get office by ID
 * @param {string} id - Office ID
 * @returns {object|null} - Office object or null
 */
export const getOfficeById = (id) => {
  if (!id) return null;
  const offices = getAllOffices();
  return offices.find(office => office.id === id) || null;
};

/**
 * Get office by district
 * @param {string} district - District name
 * @returns {array} - Array of offices in district
 */
export const getOfficesByDistrict = (district) => {
  if (!district) return [];
  const offices = getAllOffices();
  return offices.filter(office => office.district === district);
};

/**
 * Search offices by name
 * @param {string} query - Search query
 * @returns {array} - Matching offices
 */
export const searchOffices = (query) => {
  if (!query) return getAllOffices();
  const q = query.toLowerCase();
  const offices = getAllOffices();
  return offices.filter(office =>
    office.name.toLowerCase().includes(q) ||
    office.nameNp?.toLowerCase().includes(q) ||
    office.location?.toLowerCase().includes(q) ||
    office.email?.toLowerCase().includes(q)
  );
};

/**
 * Create new office with auto-generated sections
 * @param {object} officeData - Office data
 * @returns {object} - Created office
 */
export const createOffice = (officeData) => {
  if (!officeData.name) {
    throw new Error('Office name is required');
  }

  const offices = getAllOffices();

  const newOffice = {
    id: generateId(),
    name: officeData.name,
    nameNp: officeData.nameNp || '',
    location: officeData.location || '',
    district: officeData.district || '',
    phone: officeData.phone || '',
    email: officeData.email || '',
    website: officeData.website || '',
    address: officeData.address || '',
    addressNp: officeData.addressNp || '',

    // Auto-generated sections
    sections: [
      {
        id: generateId(),
        type: OFFICE_SECTIONS.NCB,
        name: 'NCB (National Competitive Bidding)',
        nameNp: 'NCB (राष्ट्रिय प्रतिस्पर्धात्मक बोली)',
        description: 'For large-scale projects with national and international competition',
        descriptionNp: 'राष्ट्रिय र अन्तर्राष्ट्रिय प्रतिस्पर्धा सहित ठूला परियोजनाहरूको लागि',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: generateId(),
        type: OFFICE_SECTIONS.SEALED_QUOTATIONS,
        name: 'Sealed Quotations (SQ)',
        nameNp: 'सिलबन्द उद्धृत (SQ)',
        description: 'For medium-scale projects with limited competition',
        descriptionNp: 'सीमित प्रतिस्पर्धा सहित मध्यम आकारका परियोजनाहरूको लागि',
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: generateId(),
        type: OFFICE_SECTIONS.USER_COMMITTEE,
        name: 'Consumer Committees',
        nameNp: 'उपभोक्ता समिति',
        description: 'Community-based projects with user participation',
        descriptionNp: 'उपभोक्ता भागीदारीसहको समुदायमा आधारित परियोजना',
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ],

    // Metadata
    status: officeData.status || OFFICE_STATUS.ACTIVE,
    createdAt: new Date().toISOString(),
    createdBy: officeData.createdBy || 'system',
    updatedAt: new Date().toISOString(),
    updatedBy: officeData.updatedBy || 'system',
    notes: officeData.notes || ''
  };

  offices.push(newOffice);
  saveOffices(offices);

  return newOffice;
};

/**
 * Update office details
 * @param {string} id - Office ID
 * @param {object} updateData - Data to update
 * @returns {object} - Updated office
 */
export const updateOffice = (id, updateData) => {
  if (!id) {
    throw new Error('Office ID is required');
  }

  const offices = getAllOffices();
  const index = offices.findIndex(office => office.id === id);

  if (index === -1) {
    throw new Error('Office not found');
  }

  offices[index] = {
    ...offices[index],
    name: updateData.name || offices[index].name,
    nameNp: updateData.nameNp !== undefined ? updateData.nameNp : offices[index].nameNp,
    location: updateData.location !== undefined ? updateData.location : offices[index].location,
    district: updateData.district !== undefined ? updateData.district : offices[index].district,
    phone: updateData.phone !== undefined ? updateData.phone : offices[index].phone,
    email: updateData.email !== undefined ? updateData.email : offices[index].email,
    website: updateData.website !== undefined ? updateData.website : offices[index].website,
    address: updateData.address !== undefined ? updateData.address : offices[index].address,
    addressNp: updateData.addressNp !== undefined ? updateData.addressNp : offices[index].addressNp,
    status: updateData.status || offices[index].status,
    notes: updateData.notes !== undefined ? updateData.notes : offices[index].notes,
    updatedAt: new Date().toISOString(),
    updatedBy: updateData.updatedBy || 'system'
  };

  saveOffices(offices);
  return offices[index];
};

/**
 * Delete office
 * @param {string} id - Office ID
 */
export const deleteOffice = (id) => {
  if (!id) {
    throw new Error('Office ID is required');
  }

  let offices = getAllOffices();
  const initialLength = offices.length;
  offices = offices.filter(office => office.id !== id);

  if (offices.length === initialLength) {
    throw new Error('Office not found');
  }

  saveOffices(offices);
};

/**
 * Get sections for an office
 * @param {string} officeId - Office ID
 * @returns {array} - Array of sections
 */
export const getOfficeSections = (officeId) => {
  if (!officeId) return [];
  const office = getOfficeById(officeId);
  return office ? office.sections : [];
};

/**
 * Get specific section by type for an office
 * @param {string} officeId - Office ID
 * @param {string} sectionType - Section type
 * @returns {object|null} - Section object or null
 */
export const getOfficeSection = (officeId, sectionType) => {
  if (!officeId || !sectionType) return null;
  const sections = getOfficeSections(officeId);
  return sections.find(section => section.type === sectionType) || null;
};

/**
 * Get project count per section for an office
 * @param {string} officeId - Office ID
 * @param {array} projects - All projects
 * @returns {object} - Count per section
 */
export const getProjectCountPerSection = (officeId, projects = []) => {
  if (!officeId) return {};

  const officeProjects = projects.filter(p => p.officeId === officeId);
  const counts = {};

  Object.values(OFFICE_SECTIONS).forEach(sectionType => {
    counts[sectionType] = officeProjects.filter(p => p.sectionType === sectionType).length;
  });

  return counts;
};

/**
 * Get office statistics
 * @param {string} officeId - Office ID
 * @param {array} projects - All projects
 * @returns {object} - Statistics
 */
export const getOfficeStatistics = (officeId, projects = []) => {
  if (!officeId) return null;

  const office = getOfficeById(officeId);
  if (!office) return null;

  const officeProjects = projects.filter(p => p.officeId === officeId);

  return {
    officeId,
    officeName: office.name,
    totalProjects: officeProjects.length,
    projectsBySection: getProjectCountPerSection(officeId, projects),
    totalBudget: officeProjects.reduce((sum, p) => sum + (p.costEstimate || 0), 0),
    totalContractAmount: officeProjects.reduce((sum, p) => sum + (p.contractAmount || 0), 0),
    completedProjects: officeProjects.filter(p => p.status === 'completed').length,
    runningProjects: officeProjects.filter(p => p.status === 'running').length,
    averageProgress: officeProjects.length > 0
      ? officeProjects.reduce((sum, p) => sum + (p.physicalProgress || 0), 0) / officeProjects.length
      : 0
  };
};

/**
 * Get active sections for an office
 * @param {string} officeId - Office ID
 * @returns {array} - Active sections
 */
export const getActiveSections = (officeId) => {
  if (!officeId) return [];
  const sections = getOfficeSections(officeId);
  return sections.filter(section => section.status === 'active');
};

/**
 * Check if office exists
 * @param {string} id - Office ID
 * @returns {boolean}
 */
export const officeExists = (id) => {
  return getOfficeById(id) !== null;
};

/**
 * Get offices count
 * @returns {number}
 */
export const getOfficesCount = () => {
  return getAllOffices().length;
};

/**
 * Get active offices
 * @returns {array}
 */
export const getActiveOffices = () => {
  const offices = getAllOffices();
  return offices.filter(office => office.status === OFFICE_STATUS.ACTIVE);
};

/**
 * Save offices to storage
 * @param {array} offices - Offices array
 */
const saveOffices = (offices) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(offices));
  } catch (error) {
    console.error('Error saving offices:', error);
    throw error;
  }
};

/**
 * Generate unique ID
 * @returns {string}
 */
const generateId = () => {
  return 'office_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Export all office-related functions
 */
export default {
  OFFICE_SECTIONS,
  OFFICE_STATUS,
  getAllOffices,
  getOfficeById,
  getOfficesByDistrict,
  searchOffices,
  createOffice,
  updateOffice,
  deleteOffice,
  getOfficeSections,
  getOfficeSection,
  getProjectCountPerSection,
  getOfficeStatistics,
  getActiveSections,
  officeExists,
  getOfficesCount,
  getActiveOffices
};
