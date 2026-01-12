// src/lib/socmm-schema.ts

// ============================================================================
// 1. "BUILDING BLOCKS" - The Types and Constants
// ============================================================================

export const QuestionType = {
  SELECT: 'select',
  CHECKBOX_GROUP: 'checkbox_group',
  TEXT: 'text',
  NUMBER: 'number',
} as const;

// A global constant for Importance levels
export const IMPORTANCE_LEVELS = [
  { value: 'none', label: 'None' },
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export type Question = {
  id: string;
  label: string;
  type: (typeof QuestionType)[keyof typeof QuestionType];
  options?: { value: string; label: string }[];
  hasImportance?: boolean;
  nistTag?: string;
  evidence?: {
    triggerValue: string | string[]; // The answer that shows the text field (e.g., '5')
    label: string;                   // The label for the text field
  };
};

export type Subdomain = {
  id: string;
  name: string;
  hasCompletenessIndicator?: boolean; // Toggles the progress bar for checkboxes
  questions: readonly Question[];
};

export type Domain = {
  id: string;
  name: string;
  subdomains: readonly Subdomain[];
  domainTooltipText?: string;
  domainLearnMoreUrl?: string;
};

// ============================================================================
// 2. THE GRAND SCHEMA - The Application's Source of Truth
// ============================================================================

export const assessmentModel: readonly Domain[] = [
  // #################### DOMAIN 1: BUSINESS ####################
  {
    id: 'business',
    name: 'Business',
    domainTooltipText: 'The Business domain assesses the alignment of the SOC with the organization\'s overall goals, strategic objectives, and governance structure.',
    subdomains: [
      // ----------------------------------------------------------------------
      // 1.1 Business Drivers
      // ----------------------------------------------------------------------
      {
        id: 'drivers',
        name: 'Business Drivers',
        questions: [
          {
            id: 'business.drivers.identified',
            label: 'Have you identified the main business drivers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Business drivers are unknown' },
              { value: '2', label: 'Partially: Document completed, approved and formally published' }, 
              // Note: Kept text exactly as provided in your list, though "Partially" usually implies incomplete.
              { value: '3', label: 'Averagely: Some business drivers have been identified' },
              { value: '4', label: 'Mostly: Most business drivers have been identified' },
              { value: '5', label: 'Fully: All business drivers are well known within the SOC' },
            ],
          },
          {
            id: 'business.drivers.documented',
            label: 'Have you documented the main business drivers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            // Added evidence field since it asks about documentation
            evidence: {
              triggerValue: ['2', '3', '4', '5'],
              label: 'Path to document (URL or file path):',
            },
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: No documentation in place' },
              { value: '2', label: 'Partially: Some ad-hoc information across documents' },
              { value: '3', label: 'Averagely: Basic documentation of business drivers' },
              { value: '4', label: 'Mostly: Single document, full description of business drivers' },
              { value: '5', label: 'Fully: Document completed, approved and formally published' },
            ],
          },
          {
            id: 'business.drivers.decisionMaking',
            label: 'Do you use business drivers in the decision making process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Business drivers are not part of decision making' },
              { value: '2', label: 'Partially: Business drivers are referred to on an ad-hoc basis' },
              { value: '3', label: 'Averagely: Business drivers are occasionally used in decisions' },
              { value: '4', label: 'Mostly: Business drivers are used in most decisions' },
              { value: '5', label: 'Fully: Business drivers are used in all relevant decisions' },
            ],
          },
          {
            id: 'business.drivers.alignment',
            label: 'Do you regularly check if the current service catalogue is aligned with business drivers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Service catalogue has not been checked for alignment' },
              { value: '2', label: 'Partially: Alignment is performed on an ad-hoc basis' },
              { value: '3', label: 'Averagely: Alignment was performed but not maintained' },
              { value: '4', label: 'Mostly: Alignment is performed and maintained regularly' },
              { value: '5', label: 'Fully: Every change in the catalogue is checked against drivers' },
            ],
          },
          {
            id: 'business.drivers.validation',
            label: 'Have the business drivers been validated with business stakeholders?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Business drivers have not been validated' },
              { value: '2', label: 'Partially: Basic awareness of SOC drivers exists among stakeholders' },
              { value: '3', label: 'Averagely: Stakeholders informally informed of business drivers' },
              { value: '4', label: 'Mostly: Alignment of SOC drivers with stakeholders is performed' },
              { value: '5', label: 'Fully: Business drivers are formally validated by stakeholders' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 1.2 Customers
      // ----------------------------------------------------------------------
      {
        id: 'customers',
        name: 'Customers',
        questions: [
          {
            id: 'business.customers.identified',
            label: 'Have you identified the SOC customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'No: SOC customers are not known' },
              { value: '2', label: 'Partially: Basic awareness of SOC customers' },
              { value: '3', label: 'Averagely: Some customers have been identified' },
              { value: '4', label: 'Mostly: Customers have mostly been identified' },
              { value: '5', label: 'Fully: All customers are identified, including relevance and context' },
            ],
          },
          {
            id: 'business.customers.list',
            label: 'Please specify your customer(s):',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'legal', label: 'Legal' },
              { value: 'audit', label: 'Audit' },
              { value: 'engineering', label: 'Engineering/R&D' },
              { value: 'it', label: 'IT' },
              { value: 'business', label: 'Business' },
              { value: 'external', label: 'External customers' },
              { value: 'management', label: 'Senior Management' },
            ],
          },
          {
            id: 'business.customers.other',
            label: 'Other customers (specify):',
            type: QuestionType.TEXT,
          },
          {
            id: 'business.customers.documented',
            label: 'Have you documented the main SOC customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            evidence: {
              triggerValue: ['2', '3', '4', '5'],
              label: 'Path to document:',
            },
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'No: No documentation in place' },
              { value: '2', label: 'Partially: Some ad-hoc information across documents' },
              { value: '3', label: 'Averagely: Basic documentation of SOC customers' },
              { value: '4', label: 'Mostly: Single document, full description of SOC customers' },
              { value: '5', label: 'Fully: Document completed, approved and formally published' },
            ],
          },
          {
            id: 'business.customers.differentiation',
            label: 'Do you differentiate output towards these specific customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'No: Output is the same for all customers' },
              { value: '2', label: 'Partially: Output is somewhat contextualized' },
              { value: '3', label: 'Averagely: Some customers receive differentiated output' },
              { value: '4', label: 'Mostly: All important customers receive differentiated output' },
              { value: '5', label: 'Fully: All customers receive specific output based on context and type' },
            ],
          },
          {
            id: 'business.customers.slas',
            label: 'Do you have service level agreements with these customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'No: Contractual agreements not in place' },
              { value: '2', label: 'Partially: No contract in place, ad-hoc agreements made' },
              { value: '3', label: 'Averagely: Basic contract in place, not formally signed of' },
              { value: '4', label: 'Mostly: Contract signed, but not regularly reviewed' },
              { value: '5', label: 'Fully: Contract signed, approved by- and regularly reviewed with customers' },
            ],
          },
          {
            id: 'business.customers.updates',
            label: 'Do you regularly send updates to your customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'Never: No updates sent to customers' },
              { value: '2', label: 'Sometimes: Ad-hoc updates sent to some customers' },
              { value: '3', label: 'Averagely: Frequent updates sent to most customers' },
              { value: '4', label: 'Mostly: Periodical updates sent to all customers' },
              { value: '5', label: 'Always: Periodical updates sent and discussed with all customers' },
            ],
          },
          {
            id: 'business.customers.satisfaction',
            label: 'Do you actively measure and manage customer satisfaction?',
            type: QuestionType.SELECT,
            nistTag: 'GV.OC-02',
            hasImportance: true,
            options: [
              { value: '1', label: 'Never: Customer satisfaction not measured or managed' },
              { value: '2', label: 'Sometimes: Customer satisfaction managed in ad-hoc fashion' },
              { value: '3', label: 'Averagely: Customer satisfaction metrics defined, not applied structurally' },
              { value: '4', label: 'Mostly: Customer satisfaction measured structurally, not actively managed' },
              { value: '5', label: 'Always: Customer satisfaction fully managed and improved over time' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 1.3 Charter
      // ----------------------------------------------------------------------
      {
        id: 'charter',
        name: 'Charter',
        hasCompletenessIndicator: true, // You requested completeness info here
        questions: [
          {
            id: 'business.charter.exists',
            label: 'Does the SOC have a formal charter document in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            evidence: {
              triggerValue: ['2', '3', '4', '5'],
              label: 'Path to charter:',
            },
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: No charter document in place' },
              { value: '2', label: 'Partially: Some ad-hoc information across documents' },
              { value: '3', label: 'Averagely: Basic charter document created' },
              { value: '4', label: 'Mostly: Single charter, full description of SOC strategic elements' },
              { value: '5', label: 'Fully: Charter completed, approved and formally published' },
            ],
          },
          {
            id: 'business.charter.elements',
            label: 'Please specify elements of the charter document:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'mission', label: 'Mission' },
              { value: 'vision', label: 'Vision' },
              { value: 'strategy', label: 'Strategy' },
              { value: 'scope', label: 'Service scope' },
              { value: 'deliverables', label: 'Deliverables' },
              { value: 'responsibilities', label: 'Responsibilities' },
              { value: 'accountability', label: 'Accountability' },
              { value: 'operationalHours', label: 'Operational hours' },
              { value: 'stakeholders', label: 'Stakeholders' },
              { value: 'goals', label: 'Objectives/goals' },
              { value: 'success', label: 'Statement of success' },
            ],
          },
          {
            id: 'business.charter.updated',
            label: 'Is the SOC charter document regularly updated?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'Never: Charter is never updated' },
              { value: '2', label: 'Sometimes: Charter is updated on ad-hoc basis' },
              { value: '3', label: 'Averagely: Charter is updated on major changes in business strategy' },
              { value: '4', label: 'Mostly: Charter is regularly updated' },
              { value: '5', label: 'Always: Charter periodically updated and realigned with business strategy' },
            ],
          },
          {
            id: 'business.charter.approved',
            label: 'Is The soc charter document approved by the business /CISO?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Charter is not approved' },
              { value: '2', label: 'Partially: Business / CISO has some awareness of the charter' },
              { value: '3', label: 'Averagely: Business / CISO has full awareness of the charter' },
              { value: '4', label: 'Mostly: Business / CISO approves the content, but not formally' },
              { value: '5', label: 'Fully: Charter is formally approved' },
            ],
          },
          {
            id: 'business.charter.stakeholders',
            label: 'Are all stakeholders familiar with the SOC Charter document contents?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-04',
            options: [
              { value: '1', label: 'No: Stakeholders are unfamiliar' },
              { value: '2', label: 'Partially: Some are aware of the charter' },
              { value: '3', label: 'Averagely: Some are aware of the charter and its contents' },
              { value: '4', label: 'Mostly: All stakeholders are aware, not all know its contents' },
              { value: '5', label: 'Fully: All stakeholders are aware of the charter and its contents' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 1.4 Governance
      // ----------------------------------------------------------------------
      {
        id: 'governance',
        name: 'Governance',
        hasCompletenessIndicator: true, // You requested completeness info here
        questions: [
          {
            id: 'business.governance.process',
            label: 'Does the soc have a governance process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.RM-01',
            options: [
              { value: '1', label: 'No: SOC governance process is not in place' },
              { value: '2', label: 'Partially: SOC governance is done in an ad hoc fashion' },
              { value: '3', label: 'Averagely: Several governance elemnts are in place, but not structurally' },
              { value: '4', label: 'Mostly: Formal Governance process is in place that covers most' },
              { value: '5', label: 'Fully: Formal governance process is in place and covers all SOC aspects.' },
            ],
          },
          {
            id: 'business.governance.identified',
            label: 'Have all governance elements been identified?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.PO-01',
            options: [
              { value: '1', label: 'No: No governance elements have been identified' },
              { value: '2', label: 'Partially: Some governenace elemtns are identified' },
              { value: '3', label: 'Averagely: some goevrnance elements are identified and governed actively' },
              { value: '4', label: 'Mostly: Most governenace elements are identified and governed actively' },
              { value: '5', label: 'Fully: All elements are identified and actively governed' },
            ],
          },
          {
            id: 'business.governance.elementsList',
            label: 'Please specify identified governance elements:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'alignment', label: 'Business alignment' },
              { value: 'accountability', label: 'Accountability' },
              { value: 'sponsorship', label: 'Sponsorship' },
              { value: 'mandate', label: 'Mandate' },
              { value: 'relationships', label: 'Relationships and third party management' },
              { value: 'vendor', label: 'Vendor engagement' },
              { value: 'commitment', label: 'Service commitment' },
              { value: 'projectMgmt', label: 'Project/program management' },
              { value: 'continuousImp', label: 'Continual improvement' },
              { value: 'spanOfControl', label: 'Span of control / federation governance' },
              { value: 'outsourced', label: 'Outsourced service management' },
              { value: 'kpis', label: 'SOC KPIs & metrics' },
              { value: 'risk', label: 'SOC Risk management' },
              { value: 'engagement', label: 'Customer engagement/satisfaction' },
            ],
          },
          {
            id: 'business.governance.costManagement',
            label: 'Is cost management in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No: Cost management is not in place' },
              { value: '2', label: 'Partially: Costs visible, basic budget allocation in place' },
              { value: '3', label: 'Averagely: Costs fully visible and mostly managed, forecasting in place' },
              { value: '4', label: 'Mostly: Costs fully managed, not formally aligned with business stakeholders' },
              { value: '5', label: 'Fully: Costs fully managed and formally aligned with business stakeholders' },
            ],
          },
          {
            id: 'business.governance.costElements',
            label: 'Please specify cost management elements:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'people', label: 'People cost' },
              { value: 'process', label: 'Process cost' },
              { value: 'technology', label: 'Technology cost' },
              { value: 'services', label: 'Services cost' },
              { value: 'facility', label: 'Facility cost' },
              { value: 'forecasting', label: 'Budget forecasting' },
              { value: 'alignment', label: 'Budget alignment' },
              { value: 'roi', label: 'Return on investment' },
            ],
          },
          {
            id: 'business.governance.documented',
            label: 'Are all governance elements formally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            evidence: {
              triggerValue: ['2', '3', '4', '5'],
              label: 'Path to governance documentation:',
            },
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'business.governance.meetings',
            label: 'Are SOC governance meetings regularly held?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'business.governance.reviewed',
            label: 'Is the governance process regularly reviewed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.PO-02',
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'business.governance.aligned',
            label: 'Is the governance process aligned with all stakeholders?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.PO-02',
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'business.governance.audited',
            label: 'Is the soc regularly audited or subjected to external assessments?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'ID.IM-01',
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'business.governance.cooperation',
            label: 'Is there an active cooperation with other socs? (external)?',
            type: QuestionType.SELECT,
            hasImportance: true,
            nistTag: 'GV.OC-02',
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
        ],
      },
    ],
  },
  // #################### DOMAIN 2: PEOPLE ####################
  {
    id: 'people',
    name: 'People',
    domainTooltipText: 'The People domain assesses the structure, roles, training, and management of SOC personnel.',
    subdomains: [
      // ----------------------------------------------------------------------
      // 2.1 Employees
      // ----------------------------------------------------------------------
      {
        id: 'employees',
        name: 'Employees',
        questions: [
          {
            id: 'people.employees.fteCount',
            label: "How many FTE's are in your SOC?",
            type: QuestionType.NUMBER,
          },
          {
            id: 'people.employees.external',
            label: 'Do you use external employees / contractors in your SOC?',
            type: QuestionType.SELECT,
            options: [
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ],
          },
          {
            id: 'people.employees.externalCount',
            label: "If yes, specify the number of external FTE's:",
            type: QuestionType.NUMBER,
          },
          {
            id: 'people.employees.fteReq',
            label: 'Does the current size of the SOC meet FTE requirements?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.fteRatio',
            label: 'Does the SOC meet requirements for internal to external employee FTE ratio?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.skillset',
            label: 'Does the SOC meet requirements for internal to external employee skillset?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.filled',
            label: 'Are all positions filled?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.recruitment',
            label: 'Do you have a recruitment process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.talent',
            label: 'Do you have talent acquisition in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.ksao',
            label: 'Do you have specific KSAOs established for SOC personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.employees.psychSafety',
            label: 'Do you actively seek to create a psychologically safe environment for SOC personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 2.2 Roles & Hierarchy
      // ----------------------------------------------------------------------
      {
        id: 'roles',
        name: 'Roles & Hierarchy',
        hasCompletenessIndicator: true, // For the role documentation checklist
        questions: [
          {
            id: 'people.roles.differentiate',
            label: 'Do you formally differentiate roles within the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Somewhat' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.list',
            label: 'Which of the following roles are present in your SOC?',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'analyst', label: 'Security Analyst' },
              { value: 'engineer', label: 'Security / Systems Engineer' },
              { value: 'forensic', label: 'Forensic Analyst' },
              { value: 'architect', label: 'Security Architect' },
              { value: 'threat', label: 'Threat Intelligence Analyst' },
              { value: 'dataScientist', label: 'Data Scientist' },
              { value: 'manager', label: 'SOC Manager' },
              { value: 'teamLead', label: 'Team Leader' },
              { value: 'incidentHandler', label: 'Incident Handler' },
              { value: 'incidentManager', label: 'Incident Manager' },
              { value: 'pentester', label: 'Penetration Tester' },
              { value: 'detectionEng', label: 'Detection Engineer' },
              { value: 'autoEng', label: 'Automation Engineer' },
            ],
          },
          {
            id: 'people.roles.other',
            label: 'Others, specify:',
            type: QuestionType.TEXT,
          },
          {
            id: 'people.roles.tiers',
            label: 'Do you differentiate tiers within these roles?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.staffed',
            label: 'Are all roles sufficiently staffed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.hierarchy',
            label: 'Is there a role-based hierarchy in your SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.documented',
            label: 'Have you formally documented all SOC roles?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.docElements',
            label: 'Please specify elements in the role documentation:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'desc', label: 'Role description' },
              { value: 'tasks', label: 'Role tasks' },
              { value: 'resp', label: 'Role responsibilities' },
              { value: 'expect', label: 'Role expectations' },
              { value: 'techSkills', label: 'Required technical skills' },
              { value: 'softSkills', label: 'Required soft skills' },
              { value: 'edu', label: 'Required educational level' },
              { value: 'certs', label: 'Required or preferred certifications' },
            ],
          },
          {
            id: 'people.roles.understood',
            label: 'Are responsibilities for each role understood?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.careerProg',
            label: 'Have you documented career progression requirements for each of these roles?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.roles.revise',
            label: 'Do you regularly revise or update the role descriptions?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 2.3 People Management
      // ----------------------------------------------------------------------
      {
        id: 'management',
        name: 'People Management',
        questions: [
          {
            id: 'people.mgmt.rotation',
            label: 'Do you have a job rotation plan in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.progression',
            label: 'Do you have a career progression process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.talent',
            label: 'Do you have a talent management process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.diversity',
            label: 'Do you have team diversity goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.teamGoals',
            label: 'Have you established team goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.indivGoals',
            label: 'Do you document and track individual team member goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.evaluate',
            label: 'Do you periodically evaluate SOC employees?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.newHire',
            label: 'Do you have a \'new hire\' process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.screening',
            label: 'Are all SOC employees subjected to screening?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.satisfaction',
            label: 'Do you measure employee satisfaction for improving the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'people.mgmt.teambuilding',
            label: 'Do you perform regular teambuilding exercises?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'people.mgmt.teambuildingExt',
            label: 'Do you perform regular teambuilding exercises with other teams relevant to the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.mgmt.teamPerf',
            label: 'Do you periodically evaluate team performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 2.4 Knowledge Management
      // ----------------------------------------------------------------------
      {
        id: 'knowledge',
        name: 'Knowledge Management',
        hasCompletenessIndicator: true, // For the skill matrix checklist
        questions: [
          {
            id: 'people.km.process',
            label: 'Do you have a formal knowledge management process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.km.matrix',
            label: 'Do you have a skill matrix in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.km.matrixElements',
            label: 'Please specify elements of the skill matrix:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'all', label: 'All SOC employees' },
              { value: 'hard', label: 'Hard skills' },
              { value: 'soft', label: 'Soft skills' },
              { value: 'levels', label: 'Skill levels (novice, intermediate, expert)' },
            ],
          },
          {
            id: 'people.km.use',
            label: 'Is the knowledge matrix actively used to determine training and education needs?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.km.abilities',
            label: 'Have you documented SOC team member abilities?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.km.revise',
            label: 'Do you regularly assess and revise the knowledge management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never, Documentation is never reviewed' },
              { value: '2', label: 'Sometimes, Documentation is reviewed ad-hoc, not using a structured approach' },
              { value: '3', label: 'Averagely, Documentation is reviewed ad-hoc, using a structured approach' },
              { value: '4', label: 'Mostly, Documentation is regularly and informally reviewed and updated' },
              { value: '5', label: 'Always, Documentation is regularly and formally reviewed and updated' },
            ],
          },
          {
            id: 'people.km.tooling',
            label: 'Is there effective tooling in place to support knowledge documentation and distribution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 2.5 Training & Education
      // ----------------------------------------------------------------------
      {
        id: 'training',
        name: 'Training and Education',
        hasCompletenessIndicator: true, // For training/certification checklists
        questions: [
          {
            id: 'people.train.program',
            label: 'Do you have a training program in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.train.elements',
            label: 'Please specify elements of the training program:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'job', label: 'Training on the Job' },
              { value: 'product', label: 'Product-specific training' },
              { value: 'internal', label: 'Internal company training' },
              { value: 'role', label: 'Role-based specific training' },
              { value: 'soft', label: 'Soft-skill training' },
              { value: 'formal', label: 'Formal education' },
            ],
          },
          {
            id: 'people.cert.program',
            label: 'Do you have a certification program in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.cert.elements',
            label: 'Please specify elements of the certification program:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'internal', label: 'Internal certification track' },
              { value: 'external', label: 'External certification track' },
              { value: 'recert', label: 'Re-certification track (continuous education)' },
            ],
          },
          {
            id: 'people.train.eval',
            label: 'Is the training and certification program connected to evaluation and career progression?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.train.budget',
            label: 'Is there a reserved budget for education and training?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.train.time',
            label: 'Is there a reserved amount of time for education and training?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.train.workshops',
            label: 'Do you have regular workshops for knowledge development?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'people.train.revise',
            label: 'Do you regularly revise and update the training and certification programs?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'people.train.comments',
            label: 'Specify rationale for chosen values or any additional comments:',
            type: QuestionType.TEXT,
          },
        ],
      },
    ],
  },
  // #################### DOMAIN 3: PROCESS ####################
  {
    id: 'process',
    name: 'Process',
    domainTooltipText: 'The Process domain evaluates the maturity of operational procedures, reporting, and engineering workflows.',
    subdomains: [
      // ----------------------------------------------------------------------
      // 3.1 SOC Management
      // ----------------------------------------------------------------------
      {
        id: 'socManagement',
        name: 'SOC Management',
        hasCompletenessIndicator: true, // For the management elements checklist
        questions: [
          {
            id: 'process.socManagement.processInPlace',
            label: 'Is there a SOC management process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.documented',
            label: 'Are SOC management elements formally identified and documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.elements',
            label: 'Please specify identified SOC management elements:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'internalRel', label: 'Internal relationship management' },
              { value: 'externalRel', label: 'External relationship management' },
              { value: 'vendorMgmt', label: 'Vendor management' },
              { value: 'csi', label: 'Continuous service improvement' },
              { value: 'projectMeth', label: 'Project methodology' },
              { value: 'procDoc', label: 'Process documentation and diagrams' },
              { value: 'raci', label: 'RACI matrix' },
              { value: 'serviceCat', label: 'Service Catalogue' },
              { value: 'onboarding', label: 'Service on-boarding procedure' },
              { value: 'offloading', label: 'Service off-loading procedure' },
            ],
          },
          {
            id: 'process.socManagement.reviewed',
            label: 'Is the SOC management process regularly reviewed?',
            type: QuestionType.SELECT,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.socManagement.aligned',
            label: 'Is the SOC management process aligned with all stakeholders?',
            type: QuestionType.SELECT,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.ciProcess',
            label: 'Have you implemented a process for continuous improvement (CI)?',
            type: QuestionType.SELECT,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.ciElements',
            label: 'Specify elements of the continuous improvement program:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'dailyTracking', label: 'Daily progress tracking' },
              { value: 'weeklyPlanning', label: 'Weekly planning' },
              { value: 'backlogMgmt', label: 'Backlog management' },
              { value: 'effortEst', label: 'Work item effort estimation' },
              { value: 'prioritization', label: 'Work item prioritization' },
              { value: 'refinement', label: 'Refinement' },
              { value: 'capacityChange', label: 'Capacity for change' },
            ],
          },
          {
            id: 'process.socManagement.qaProcess',
            label: 'Have you implemented a process to manage SOC quality assurance (QA)?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.qaElements',
            label: 'Please specify elements of the quality assurance program:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'ticketQa', label: 'Ticket quality assurance' },
              { value: 'incidentQa', label: 'Incident quality assurance' },
              { value: 'serviceQa', label: 'Service quality assurance' },
              { value: 'processQa', label: 'Process quality assurance' },
              { value: 'reportQa', label: 'Report quality assurance' },
            ],
          },
          {
            id: 'process.socManagement.archProcess',
            label: 'Have you implemented a SOC architecture process?',
            type: QuestionType.SELECT,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.socManagement.archElements',
            label: 'Please specify elements of the SOC architecture:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'procArch', label: 'SOC process architecture' },
              { value: 'techArch', label: 'SOC technology architecture' },
              { value: 'servArch', label: 'SOC service architecture' },
              { value: 'diagrams', label: 'Architecture diagrams' },
              { value: 'principles', label: 'Architecture principles' },
            ],
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 3.2 Operations & Facilities
      // ----------------------------------------------------------------------
      {
        id: 'operationsAndFacilities',
        name: 'Operations & Facilities',
        hasCompletenessIndicator: true,
        questions: [
          // 2.1 Security Operations Exercises
          {
            id: 'process.ops.exercisePlan',
            label: 'Do you have a documented exercise plan?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.exerciseTypes',
            label: 'Please specify types of exercises included in the plan:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'tabletop', label: 'Table-top exercises' },
              { value: 'drills', label: 'Playbook drills' },
              { value: 'cyberRange', label: 'Cyber range' },
              { value: 'ctf', label: 'CTF' },
              { value: 'teaming', label: 'Purple/Red/Black team exercises' },
              { value: 'public', label: 'Public exercises' },
            ],
          },
          {
            id: 'process.ops.exerciseRegularity',
            label: 'Do you perform security operations exercises regularly?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.ops.exerciseResults',
            label: 'Are the results from exercises documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.exerciseImprovement',
            label: 'Is the output from exercises actively used to improve security operations?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 2.2 Service Delivery Standardization
          {
            id: 'process.ops.sops',
            label: 'Do you have standard operating procedures?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.checklists',
            label: 'Do you use checklists for recurring activities?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.ops.workflows',
            label: 'Do you use documented workflows?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.ops.handbook',
            label: 'Do you have a SOC operational Handbook?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.opsec',
            label: 'Have you established an Operational Security (OPSEC) program?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 2.3 Process Integration
          {
            id: 'process.ops.configMgmt',
            label: 'Is the configuration management process integrated in the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.changeMgmt',
            label: 'Is the change management process integrated in the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.problemMgmt',
            label: 'Is the problem management process integrated in the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.incidentMgmt',
            label: 'Is the incident management process integrated in the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.assetMgmt',
            label: 'Is the asset management process integrated in the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 2.4 SOC Facilities
          {
            id: 'process.facilities.location',
            label: 'Do you have a dedicated physical SOC location?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.warRoom',
            label: 'Do you have a war room for the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.network',
            label: 'Do you have a dedicated network for the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.accessControl',
            label: 'Do you have physical access control to the SOC location?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.storage',
            label: 'Do you have a secure physical storage location?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.videoWall',
            label: 'Do you have a video wall for monitoring purposes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.callCenter',
            label: 'Do you have a call-center capability for the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.workstations',
            label: 'Do you have specialized analyst workstations?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.facilities.remoteWork',
            label: 'Have you optimized secure remote working capabilities for SOC employees?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 2.5 Operational Shifts
          {
            id: 'process.shifts.schedules',
            label: 'Do you use shift schedules?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.shifts.vigilance',
            label: 'Have schedules been created to optimize vigilance during shifts?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.shifts.log',
            label: 'Do you have a shift log?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.shifts.turnover',
            label: 'Do you have a formally described shift turnover procedure?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.shifts.standup',
            label: 'Do you have a daily SOC operational stand-up?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.shifts.standby',
            label: 'Do you have stand-by arrangements with employees within the SOC?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 2.6 Knowledge & Document Mgmt
          {
            id: 'process.knowledge.dms',
            label: 'Do you have a Document Management System in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.knowledge.platform',
            label: 'Do you have a knowledge & collaboration platform in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.ops.comments',
            label: 'Specify rationale for chosen values or any additional comments:',
            type: QuestionType.TEXT,
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 3.3 Reporting & Communication
      // ----------------------------------------------------------------------
      {
        id: 'reporting',
        name: 'Reporting & Communication',
        hasCompletenessIndicator: true,
        questions: [
          {
            id: 'process.reporting.regular',
            label: 'Do you regularly provide reports?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.reporting.tailored',
            label: 'Are these reports tailored to the recipients?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.approved',
            label: 'Are the report contents approved by or reviewed by the recipients?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.lines',
            label: 'Do you have established reporting lines within the organization?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.revise',
            label: 'Do you regularly revise and update the report templates?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.reporting.agreements',
            label: 'Do you have formal agreements with the recipients regarding reports?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.reporting.types',
            label: 'Do you provide different types of reports to your recipients?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'process.reporting.reportTypes',
            label: 'Please specify SOC report types:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'techSec', label: 'Technical Security reports' },
              { value: 'execSec', label: 'Executive security reports' },
              { value: 'ops', label: 'Operational reports' },
              { value: 'incident', label: 'Incident reports' },
              { value: 'newsletter', label: 'Newsletter or digest' },
              { value: 'kpi', label: 'KPI reports' },
              { value: 'trend', label: 'Trend reports' },
              { value: 'realtime', label: 'Real-time reporting dashboards' },
            ],
          },
          {
            id: 'process.reporting.diffMetrics',
            label: 'Do you use different types of metrics in your reports?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.metricTypes',
            label: 'Please specify SOC metric types:',
            type: QuestionType.CHECKBOX_GROUP,
            options: [
              { value: 'quant', label: 'Quantitative metrics' },
              { value: 'qual', label: 'Qualitative metrics' },
              { value: 'incident', label: 'Incident & case metrics' },
              { value: 'timing', label: 'Timing metrics' },
              { value: 'sla', label: 'SLA metrics' },
              { value: 'proactive', label: 'Proactive and reactive metrics' },
            ],
          },
          // 3.11 Advisories
          {
            id: 'process.reporting.advisories',
            label: 'Do you provide advisories to the organization regarding threats and vulnerabilities?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.advisoriesRisk',
            label: 'Do you perform risk / impact assessments of these advisories?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.advisoriesFollowup',
            label: 'Do you perform follow-up of these advisories?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 3.12 Education
          {
            id: 'process.reporting.edu',
            label: 'Do you provide education and security awareness to the organization?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.eduMeasure',
            label: 'Do you measure the effect of education and security awareness efforts?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 3.13 Communication
          {
            id: 'process.reporting.commTemplates',
            label: 'Do you use communication templates?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.commMatrix',
            label: 'Do you have a communication matrix in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.commTraining',
            label: 'Is communication training (verbal/written) available for SOC personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.commSkills',
            label: 'Are communication skills element of SOC role descriptions?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.reporting.comments',
            label: 'Specify rationale for chosen values or any additional comments:',
            type: QuestionType.TEXT,
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 3.4 Use Case Management
      // ----------------------------------------------------------------------
      {
        id: 'useCases',
        name: 'Use Case Management',
        questions: [
          {
            id: 'process.useCases.processInPlace',
            label: 'Is there a use case management process or framework in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.documented',
            label: 'Are use cases formally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.approved',
            label: 'Are use cases approved by relevant stakeholders?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.aligned',
            label: 'Is the use case management process aligned with other important processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.standardized',
            label: 'Are use cases created using a standardized process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.topDown',
            label: 'Are use cases created using a top-down approach?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.traceHighToLow',
            label: 'Can use cases be traced from high-level drivers to low-level implementation?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.traceLowToHigh',
            label: 'Can use cases be traced from low-level implementation to high-level drivers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.measured',
            label: 'Are use cases measured for implementation and effectiveness?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.prioritized',
            label: 'Are use cases scored and prioritized based on risk levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.updated',
            label: 'Are use cases regularly revised and updated?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          // 4.2 Mitre ATT&CK
          {
            id: 'process.useCases.mitreGap',
            label: 'Do you measure use cases against the MITRE ATT&CK® framework for gap analysis purposes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.mitreTagged',
            label: 'Are monitoring rules tagged with MITRE ATT&CK® framework identifiers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.mitreRiskProfile',
            label: 'Have you created a MITRE ATT&CK® risk profile for your organization?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.mitrePrioritized',
            label: 'Have you prioritized MITRE ATT&CK® techniques for relevance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.intelOutput',
            label: 'Is use case output (alerts) used in threat intelligence activities?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.intelInput',
            label: 'Is threat intelligence used for the creation and updates of use cases?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 4.3 Visibility
          {
            id: 'process.useCases.visibilityReqs',
            label: 'Do you determine and document visibility requirements for each use case?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.visibilityGap',
            label: 'Do you measure visibility status for your use cases for gap analysis purposes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.visibilityMitre',
            label: 'Do you map data source visibility to the MITRE ATT&CK® framework?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.useCases.comments',
            label: 'Specify rationale for chosen values or any additional comments:',
            type: QuestionType.TEXT,
          },
        ],
      },
      // ----------------------------------------------------------------------
      // 3.5 Detection Engineering
      // ----------------------------------------------------------------------
      {
        id: 'detectionEngineering',
        name: 'Detection Engineering',
        questions: [
          {
            id: 'process.detection.processInPlace',
            label: 'Do you have a detection engineering process in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.documented',
            label: 'Is the detection engineering process formally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.roles',
            label: 'Are there specific roles and requirements for detection engineers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.coopAnalysts',
            label: 'Is there active cooperation between the SOC analysts and the detection engineers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.coopIntel',
            label: 'Is there active cooperation between the Threat Intelligence analysts and detection engineers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.handover',
            label: 'Are there formal hand-over to the analyst team?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.testEnv',
            label: 'Is there a testing environment to test and validate detections before deploying them?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.releaseProcess',
            label: 'Is there a formal release process in place for new detections?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.versioning',
            label: 'Do you apply a versioning system to detections?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.rollback',
            label: 'Do you have a roll-back procedure in place in case of problems with detections?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          // 5.2 Detection Validation
          {
            id: 'process.detection.adversaryEmulation',
            label: 'Do you perform adversary emulation or automated detection testing?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.testMitre',
            label: 'Do you test for detection of MITRE ATT&CK® techniques?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.testAnalytics',
            label: 'Do you test detection analytics not directly associated with MITRE ATT&CK®?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.testPlaybooks',
            label: 'Do you test response playbooks?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.validationIntegrated',
            label: 'Is detection validation fully integrated in the detection engineering process / pipeline?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.validationOutput',
            label: 'Is the outcome from detection validation used as input into monitoring and detection engineering?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.monitorIngestion',
            label: 'Do you monitor the data ingestion status for data sources?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.measureCoverage',
            label: 'Do you actively measure and improve data source coverage?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'process.detection.comments',
            label: 'Specify rationale for chosen values or any additional comments:',
            type: QuestionType.TEXT,
          },
        ],
      },
    ],
  },
  // #################### DOMAIN 4: TECHNOLOGY ####################
  {
    id: 'technology',
    name: 'Technology',
    domainTooltipText: 'The Technology domain assesses the tools, infrastructure, and technical capabilities (specifically SIEM) supporting the SOC.',
    subdomains: [
      // ======================================================================
      // SUBDOMAIN 1: SIEM / UEBA (All 1.x questions go here)
      // ======================================================================
      {
        id: 'siem',
        name: 'SIEM / UEBA',
        questions: [
          // --- 1.1 Accountability ---
          {
            id: 'technology.siem.funcOwnership',
            // HEADER ADDED HERE
            label: '1.1 Accountability\n\n1.1.1 Has functional ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.techOwnership',
            label: '1.1.2 Has technical ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.2 Documentation ---
          {
            id: 'technology.siem.techDoc',
            // HEADER ADDED HERE
            label: '1.2 Documentation\n\n1.2.1 Has the solution been technically documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.funcDoc',
            label: '1.2.2 Has the solution been functionally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.3 Personnel & Support ---
          {
            id: 'technology.siem.personnel',
            // HEADER ADDED HERE
            label: '1.3 Personnel & Support\n\n1.3.1 Is there dedicated personnel for support?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.training',
            label: '1.3.2 Is the personnel for support formally trained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.certification',
            label: '1.3.3 Is the personnel for support certified?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.contract',
            label: '1.3.4 Is there a support contract for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.4 Maintenance ---
          {
            id: 'technology.siem.maintenance',
            // HEADER ADDED HERE
            label: '1.4 Maintenance & Configuration\n\n1.4.1 Is the system regularly maintained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.remoteMaint',
            label: '1.4.2 Is remote maintenance on the system managed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.changeMgmt',
            label: '1.4.3 Are maintenance & configuration updates executed through the change management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.windows',
            label: '1.4.4 Have you established maintenance windows?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.trustedTooling',
            label: '1.4.5 Is maintenance performed using authorised and trusted tooling?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.5 Availability ---
          {
            id: 'technology.siem.ha',
            // HEADER ADDED HERE
            label: '1.5 Availability & Integrity\n\n1.5.1 Is there high availability (HA) in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.dataBackup',
            label: '1.5.2 Is there data backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.configBackup',
            label: '1.5.3 Is there configuration backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.drPlan',
            label: '1.5.4 Is there a Disaster Recovery plan in place for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.drTesting',
            label: '1.5.5 Is the Disaster Recovery plan regularly tested?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'technology.siem.devEnv',
            label: '1.5.6 Is there a separate development / test environment for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.6 Access ---
          {
            id: 'technology.siem.authorizedAccess',
            // HEADER ADDED HERE
            label: '1.6 Access Management\n\n1.6.1 Is access to the solution limited to authorized personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.siem.accessReview',
            label: '1.6.2 Are access rights regularly reviewed and revoked if required?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'technology.siem.breakGlass',
            label: '1.6.3 Is a break glass procedure in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.7 Capabilities ---
          {
            id: 'technology.siem.subtleEvents',
            // HEADER ADDED HERE
            label: '1.7 Specify which technological capabilities and artefacts are present and implemented:\n\n1.7.1 Subtle event detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.autoAlerting',
            label: '1.7.2 Automated alerting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.alertAck',
            label: '1.7.3 Alert acknowledgement',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.caseMgmt',
            label: '1.7.4 Case management system',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.networkModel',
            label: '1.7.5 Network model',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.auditTrail',
            label: '1.7.6 Detailed audit trail of analyst activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.historicalDetect',
            label: '1.7.7 Historical activity detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.scalableArch',
            label: '1.7.8 Flexible and scalable architecture',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.mitreTagging',
            label: '1.7.9 MITRE ATT&CK® identifier tagging',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Data Ingestion ---
          {
            id: 'technology.siem.aggregation',
            // HEADER ADDED HERE
            label: 'DATA INGESTION & PROCESSING\n\n1.7.10 Aggregation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.normalisation',
            label: '1.7.11 Normalisation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.correlation',
            label: '1.7.12 Correlation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.multiStageCorr',
            label: '1.7.13 Multi-stage correlation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.customParsing',
            label: '1.7.14 Custom parsing',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.apiIntegration',
            label: '1.7.15 API integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.secureTransfer',
            label: '1.7.16 Secure Event Transfer',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.multipleTransfer',
            label: '1.7.17 Support for multiple event transfer technologies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Integrations ---
          {
            id: 'technology.siem.assetIntegration',
            // HEADER ADDED HERE
            label: 'INTEGRATIONS (TECHNICAL & PROCESS)\n\n1.7.18 Asset management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.businessContext',
            label: '1.7.19 Business context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.identityContext',
            label: '1.7.20 Identity context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.assetContext',
            label: '1.7.21 Asset context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.vulnContext',
            label: '1.7.22 Vulnerability context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.tiIntegration',
            label: '1.7.23 Threat intelligence integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.threatHunting',
            label: '1.7.24 Threat hunting integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.incidentMgmt',
            label: '1.7.25 Security incident management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.soarIntegration',
            label: '1.7.26 SOAR integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Rules ---
          {
            id: 'technology.siem.stdRules',
            // HEADER ADDED HERE
            label: 'RULE-BASED DETECTION\n\n1.7.27 Standard detection rules',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.customRules',
            label: '1.7.28 Custom detection rules',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Anomalies ---
          {
            id: 'technology.siem.userAnomalies',
            // HEADER ADDED HERE
            label: 'ANOMALY DETECTION\n\n1.7.29 User anomalies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.appAnomalies',
            label: '1.7.30 Application anomalies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.deviceAnomalies',
            label: '1.7.31 Device anomalies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.networkAnomalies',
            label: '1.7.32 Network anomalies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Visualisation ---
          {
            id: 'technology.siem.reporting',
            // HEADER ADDED HERE
            label: 'VISUALISATION AND OUTPUT\n\n1.7.33 Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.dashboards',
            label: '1.7.34 Dashboards',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.vizTechniques',
            label: '1.7.35 Data visualization techniques',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.drilldowns',
            label: '1.7.36 Data drilldowns',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.centralConsole',
            label: '1.7.37 Central analysis console',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.siem.advancedQuerying',
            label: '1.7.38 Advanced searching and querying',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          // --- Comments ---
          {
            id: 'technology.siem.comments',
            // HEADER ADDED HERE
            label: '1.8 Comments and/or remarks',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      
      // ======================================================================
      // SUBDOMAIN 2: NETWORK DETECTION & RESPONSE (NDR)
      // ======================================================================
      {
        id: 'ndr',
        name: 'Network Detection & Response (NDR)',
        questions: [
          // --- 2.1 Accountability ---
          {
            id: 'technology.ndr.funcOwnership', // 2.1.1
            // Header added to label
            label: '2.1 Accountability\n\n2.1.1 Has functional ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.techOwnership', // 2.1.2
            label: '2.1.2 Has technical ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.2 Documentation ---
          {
            id: 'technology.ndr.techDoc', // 2.2.1
            label: '2.2 Documentation\n\n2.2.1 Has the solution been technically documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.funcDoc', // 2.2.2
            label: '2.2.2 Has the solution been functionally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.3 Personnel & Support ---
          {
            id: 'technology.ndr.personnel', // 2.3.1
            label: '2.3 Personnel & Support\n\n2.3.1 Is there dedicated personnel for support?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.training', // 2.3.2
            label: '2.3.2 Is the personnel for support formally trained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.certification', // 2.3.3
            label: '2.3.3 Is the personnel for support certified?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.contract', // 2.3.4
            label: '2.3.4 Is there a support contract for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.4 Maintenance ---
          {
            id: 'technology.ndr.maintenance', // 2.4.1
            label: '2.4 Maintenance & Configuration\n\n2.4.1 Is the system regularly maintained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.remoteMaint', // 2.4.2
            label: '2.4.2 Is remote maintenance on the system managed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.changeMgmt', // 2.4.3
            label: '2.4.3 Are maintenance & configuration updates executed through the change management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.windows', // 2.4.4
            label: '2.4.4 Have you established maintenance windows?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.trustedTooling', // 2.4.5
            label: '2.4.5 Is maintenance performed using authorised and trusted tooling?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.5 Availability ---
          {
            id: 'technology.ndr.ha', // 2.5.1
            label: '2.5 Availability & Integrity\n\n2.5.1 Is there high availability (HA) in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.dataBackup', // 2.5.2
            label: '2.5.2 Is there data backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.configBackup', // 2.5.3
            label: '2.5.3 Is there configuration backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.drPlan', // 2.5.4
            label: '2.5.4 Is there a Disaster Recovery plan in place for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.drTesting', // 2.5.5
            label: '2.5.5 Is the Disaster Recovery plan regularly tested?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'Never' },
              { value: '2', label: 'Sometimes' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Always' },
            ],
          },
          {
            id: 'technology.ndr.devEnv', // 2.5.6
            label: '2.5.6 Is there a separate development / test environment for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.6 Access Management ---
          {
            id: 'technology.ndr.authorizedAccess', // 2.6.1
            label: '2.6 Access Management\n\n2.6.1 Is access to the solution limited to authorized personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.accessReview', // 2.6.2
            label: '2.6.2 Are access rights regularly reviewed and revoked if required?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.ndr.breakGlass', // 2.6.3
            label: '2.6.3 Is a break glass procedure in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.7 Capabilities ---
          {
            id: 'technology.ndr.encryptedTraffic', // 2.7.1
            label: '2.7 Specify which technological capabilities and artefacts are present and implemented:\n\n2.7.1 Encrypted traffic analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.idsSignature', // 2.7.2
            label: '2.7.2 IDS signature matching',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.supervisedML', // 2.7.3
            label: '2.7.3 Supervised machine learning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.unsupervisedML', // 2.7.4
            label: '2.7.4 Unsupervised machine learning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.trafficBlocking', // 2.7.5
            label: '2.7.5 Traffic blocking',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.unauthDevice', // 2.7.6
            label: '2.7.6 Unauthorised device detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.mitreTagging', // 2.7.7
            label: '2.7.7 MITRE ATT&CK® identifier tagging',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.deepPacket', // 2.7.8
            label: '2.7.8 Deep packet inspection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.correlation', // 2.7.9
            label: '2.7.9 Correlation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Data Ingestion ---
          {
            id: 'technology.ndr.fullPacket', // 2.7.10
            label: 'DATA INGESTION AND PROCESSING\n\n2.7.10 Full packet capture',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.flowData', // 2.7.11
            label: '2.7.11 Flow data ingestion',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Monitoring Capabilities ---
          {
            id: 'technology.ndr.northSouth', // 2.7.12
            label: 'MONITORING CAPABILITIES\n\n2.7.12 Monitoring north - south network traffic',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.eastWest', // 2.7.13
            label: '2.7.13 Monitoring east - west network traffic',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.classifiedSeg', // 2.7.14
            label: '2.7.14 Monitoring classified network segements',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.cloudEnv', // 2.7.15
            label: '2.7.15 Monitoring cloud environments',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.icsScada', // 2.7.16
            label: '2.7.16 Monitoring ICS/SCADA networks',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.dnsTraffic', // 2.7.17
            label: '2.7.17 Monitoring DNS traffic',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Integrations ---
          {
            id: 'technology.ndr.businessContext', // 2.7.18
            label: 'INTEGRATIONS (TECHNICAL & PROCESS)\n\n2.7.18 Business context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.identityContext', // 2.7.19
            label: '2.7.19 Identity context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.threatIntel', // 2.7.20
            label: '2.7.20 Threat Intelligence integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.threatHunting', // 2.7.21
            label: '2.7.21 Threat hunting integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.incidentMgmt', // 2.7.22
            label: '2.7.22 Security incident management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.siemIntegration', // 2.7.23
            label: '2.7.23 SIEM integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.sandboxIntegration', // 2.7.24
            label: '2.7.24 Malware sandbox integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Rule-based Detection ---
          {
            id: 'technology.ndr.stdRules', // 2.7.25
            label: 'RULE-BASED DETECTION\n\n2.7.25 Standard detection rules',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.customRules', // 2.7.26
            label: '2.7.26 Custom detection rules',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Anomaly Detection ---
          {
            id: 'technology.ndr.baselining', // 2.7.27
            label: 'ANOMALY DETECTION\n\n2.7.27 Traffic baselining',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.patternAnalysis', // 2.7.28
            label: '2.7.28 Pattern analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Visualisation ---
          {
            id: 'technology.ndr.reporting', // 2.7.29
            label: 'VISUALISATION AND OUTPUT\n\n2.7.29 Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.dashboards', // 2.7.30
            label: '2.7.30 Dashboards',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.vizTechniques', // 2.7.31
            label: '2.7.31 Data visualization techniques',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.drilldowns', // 2.7.32
            label: '2.7.32 Data drilldowns',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.centralConsole', // 2.7.33
            label: '2.7.33 Central analysis console',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.ndr.advancedQuerying', // 2.7.34
            label: '2.7.34 Advanced searching and querying',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- Comments ---
          {
            id: 'technology.ndr.comments',
            label: '2.8 Comments and/or remarks',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },

      // ======================================================================
      // SUBDOMAIN 3: ENDPOINT DETECTION & RESPONSE (EDR)
      // ======================================================================
      {
        id: 'edr',
        name: 'Endpoint Detection & Response (EDR)',
        questions: [
          // --- 3.1 Accountability ---
          {
            id: 'technology.edr.funcOwnership', // 3.1.1
            // Header added to label
            label: '3.1 Accountability\n\n3.1.1 Has functional ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.techOwnership', // 3.1.2
            label: '3.1.2 Has technical ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.2 Documentation ---
          {
            id: 'technology.edr.techDoc', // 3.2.1
            label: '3.2 Documentation\n\n3.2.1 Has the solution been technically documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.funcDoc', // 3.2.2
            label: '3.2.2 Has the solution been functionally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.3 Personnel & Support ---
          {
            id: 'technology.edr.personnel', // 3.3.1
            label: '3.3 Personnel & Support\n\n3.3.1 Is there dedicated personnel for support?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.training', // 3.3.2
            label: '3.3.2 Is the personnel for support formally trained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.certification', // 3.3.3
            label: '3.3.3 Is the personnel for support certified?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.contract', // 3.3.4
            label: '3.3.4 Is there a support contract for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.4 Maintenance ---
          {
            id: 'technology.edr.maintenance', // 3.4.1
            label: '3.4 Maintenance & Configuration\n\n3.4.1 Is the system regularly maintained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.remoteMaint', // 3.4.2
            label: '3.4.2 Is remote maintenance on the system managed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.changeMgmt', // 3.4.3
            label: '3.4.3 Are maintenance & configuration updates executed through the change management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.windows', // 3.4.4
            label: '3.4.4 Have you established maintenance windows?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.trustedTooling', // 3.4.5
            label: '3.4.5 Is maintenance performed using authorised and trusted tooling?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.5 Availability ---
          {
            id: 'technology.edr.ha', // 3.5.1
            label: '3.5 Availability & Integrity\n\n3.5.1 Is there high availability (HA) in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.dataBackup', // 3.5.2
            label: '3.5.2 Is there data backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.configBackup', // 3.5.3
            label: '3.5.3 Is there configuration backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.drPlan', // 3.5.4
            label: '3.5.4 Is there a Disaster Recovery plan in place for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.drTesting', // 3.5.5
            label: '3.5.5 Is the Disaster Recovery plan regularly tested?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.devEnv', // 3.5.6
            label: '3.5.6 Is there a separate development / test environment for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.6 Confidentiality / Access ---
          {
            id: 'technology.edr.authorizedAccess', // 3.6.1
            label: '3.6 Confidentiality\n\n3.6.1 Is access to the solution limited to authorized personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.accessReview', // 3.6.2
            label: '3.6.2 Are access rights regularly reviewed and revoked if required?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.edr.breakGlass', // 3.6.3
            label: '3.6.3 Is a break glass procedure in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.7 Capabilities: Technical ---
          {
            id: 'technology.edr.osSupport', // 3.7.1
            label: '3.7 Specify which technological capabilities and artefacts are present and implemented:\n\nTECHNICAL CAPABILITIES\n\n3.7.1 OS support',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.mobileSupport', // 3.7.2
            label: '3.7.2 Mobile device support',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.deployment', // 3.7.3
            label: '3.7.3 Physical, virtual & cloud deployment',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.vulnPatching', // 3.7.4
            label: '3.7.4 Vulnerability patching',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.forensicPreservation', // 3.7.5
            label: '3.7.5 Forensic information preservation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.historicData', // 3.7.6
            label: '3.7.6 Historic data retention',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.mitreTagging', // 3.7.7
            label: '3.7.7 MITRE ATT&CK® identifier tagging',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.memoryAnalysis', // 3.7.8
            label: '3.7.8 Memory analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.correlation', // 3.7.9
            label: '3.7.9 Correlation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Prevention ---
          {
            id: 'technology.edr.exploitPrev', // 3.7.10
            label: 'PREVENTION CAPABILITIES\n\n3.7.10 Exploit prevention',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.filelessProt', // 3.7.11
            label: '3.7.11 Fileless malware protection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.appAllowlisting', // 3.7.12
            label: '3.7.12 Application allowlisting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.ransomwareProt', // 3.7.13
            label: '3.7.13 Ransomware protection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.surfaceReduction', // 3.7.14
            label: '3.7.14 Attack surface reduction',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Detection ---
          {
            id: 'technology.edr.vulnDetection', // 3.7.15
            label: 'DETECTION CAPABILITIES\n\n3.7.15 Vulnerability detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.processMonitor', // 3.7.16
            label: '3.7.16 Process execution monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.fsMonitor', // 3.7.17
            label: '3.7.17 File system monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.serviceMonitor', // 3.7.18
            label: '3.7.18 Task & service monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.networkMonitor', // 3.7.19
            label: '3.7.19 Network connection monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.registryMonitor', // 3.7.20
            label: '3.7.20 Registry monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.userMonitor', // 3.7.21
            label: '3.7.21 User activity monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.configMonitor', // 3.7.22
            label: '3.7.22 Configuration monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.airgappedMonitor', // 3.7.23
            label: '3.7.23 Air-gaped end-point monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.fileReputation', // 3.7.24
            label: '3.7.24 File reputation service',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.deception', // 3.7.25
            label: '3.7.25 Deception techniques',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Remediation ---
          {
            id: 'technology.edr.urlFiltering', // 3.7.26
            label: 'REMEDIATION CAPABILITIES\n\n3.7.26 URL filtering / blocking',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.webFiltering', // 3.7.27
            label: '3.7.27 Web content filtering',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.isolation', // 3.7.28
            label: '3.7.28 Machine isolation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.processTerm', // 3.7.29
            label: '3.7.29 Process termination / suspension',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.fileDeletion', // 3.7.30
            label: '3.7.30 File / registry key deletion',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.forcedLogoff', // 3.7.31
            label: '3.7.31 Forced user logoff',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Integrations ---
          {
            id: 'technology.edr.threatIntel', // 3.7.32
            label: 'INTEGRATIONS\n\n3.7.32 Threat Intelligence integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.vulnIntel', // 3.7.33
            label: '3.7.33 Vulnerability intelligence integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.thTTPs', // 3.7.34
            label: '3.7.34 Threat hunting integration - TTPs',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.thTools', // 3.7.35
            label: '3.7.35 Threat hunting integration - Tools & artifacts',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.thIndicators', // 3.7.36
            label: '3.7.36 Threat hunting integration - Technical indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.incidentMgmt', // 3.7.37
            label: '3.7.37 Security incident management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.siemIntegration', // 3.7.38
            label: '3.7.38 SIEM integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.sandboxIntegration', // 3.7.39
            label: '3.7.39 Malware sandbox integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Rule-based ---
          {
            id: 'technology.edr.onlineSig', // 3.7.40
            label: 'RULE-BASED DETECTION\n\n3.7.40 Online signature-based detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.offlineSig', // 3.7.41
            label: '3.7.41 Offline signature-based detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.customRules', // 3.7.42
            label: '3.7.42 Custom rules',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Anomaly ---
          {
            id: 'technology.edr.behavioural', // 3.7.43
            label: 'ANOMALY DETECTION\n\n3.7.43 Behavioural detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.7 Capabilities: Visualisation ---
          {
            id: 'technology.edr.reporting', // 3.7.44
            label: 'VISUALISATION & OUTPUT\n\n3.7.44 Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.dashboards', // 3.7.45
            label: '3.7.45 Dashboards',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.vizTechniques', // 3.7.46
            label: '3.7.46 Data visualization techniques',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.drilldowns', // 3.7.47
            label: '3.7.47 Data drilldowns',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.centralConsole', // 3.7.48
            label: '3.7.48 Central analysis console',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.edr.advancedQuerying', // 3.7.49
            label: '3.7.49 Advanced searching and querying',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.8 Comments ---
          {
            id: 'technology.edr.comments', // 3.8
            label: '3.8 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },

      // ======================================================================
      // SUBDOMAIN 4: AUTOMATION & ORCHESTRATION (SOAR)
      // ======================================================================
      {
        id: 'soar',
        name: 'Automation & Orchestration (SOAR)',
        questions: [
          // --- 4.1 Accountability ---
          {
            id: 'technology.soar.funcOwnership', // 4.1.1
            // Header added to label
            label: '4.1 Accountability\n\n4.1.1 Has functional ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.techOwnership', // 4.1.2
            label: '4.1.2 Has technical ownership of the solution been formally assigned?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.2 Documentation ---
          {
            id: 'technology.soar.techDoc', // 4.2.1
            label: '4.2 Documentation\n\n4.2.1 Has the solution been technically documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.funcDoc', // 4.2.2
            label: '4.2.2 Has the solution been functionally documented?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.3 Personnel & Support ---
          {
            id: 'technology.soar.personnel', // 4.3.1
            label: '4.3 Personnel & support\n\n4.3.1 Is there dedicated personnel for support?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.training', // 4.3.2
            label: '4.3.2 Is the personnel for support formally trained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.certification', // 4.3.3
            label: '4.3.3 Is the personnel for support certified?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.contract', // 4.3.4
            label: '4.3.4 Is there a support contract for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.4 Maintenance ---
          {
            id: 'technology.soar.maintenance', // 4.4.1
            label: '4.4 Maintenance & configuration\n\n4.4.1 Is the system regularly maintained?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.remoteMaint', // 4.4.2
            label: '4.4.2 Is remote maintenance on the system managed?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.changeMgmt', // 4.4.3
            label: '4.4.3 Are maintenance & configuration updates executed through the change management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.windows', // 4.4.4
            label: '4.4.4 Have you established maintenance windows?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.trustedTooling', // 4.4.5
            label: '4.4.5 Is maintenance performed using authorised and trusted tooling?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.5 Availability ---
          {
            id: 'technology.soar.ha', // 4.5.1
            label: '4.5 Availability & Integrity\n\n4.5.1 Is there high availability (HA) in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.dataBackup', // 4.5.2
            label: '4.5.2 Is there data backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.configBackup', // 4.5.3
            label: '4.5.3 Is there configuration backup / replication in place for the solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.drPlan', // 4.5.4
            label: '4.5.4 Is there a Disaster Recovery plan in place for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.drTesting', // 4.5.5
            label: '4.5.5 Is the Disaster Recovery plan regularly tested?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.devEnv', // 4.5.6
            label: '4.5.6 Is there a separate development / test environment for this solution?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.6 Confidentiality ---
          {
            id: 'technology.soar.authorizedAccess', // 4.6.1
            label: '4.6 Confidentiality\n\n4.6.1 Is access to the solution limited to authorized personnel?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.accessReview', // 4.6.2
            label: '4.6.2 Are access rights regularly reviewed and revoked if required?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'technology.soar.breakGlass', // 4.6.3
            label: '4.6.3 Is a break glass procedure in place?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.7 Capabilities: Technical ---
          {
            id: 'technology.soar.histEventMatching', // 4.7.1
            label: '4.7 Specify which technological capabilities and artefacts are present and implemented:\n\nTECHNICAL CAPABILITIES\n\n4.7.1 Historical event matching',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.riskPrioritization', // 4.7.2
            label: '4.7.2 Risk-based event prioritization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.ticketWorkflow', // 4.7.3
            label: '4.7.3 Ticket workflow support',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.7 Capabilities: Data Integrations ---
          {
            id: 'technology.soar.siemIntegration', // 4.7.4
            label: 'DATA INTEGRATIONS\n\n4.7.4 SIEM data integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.threatIntel', // 4.7.5
            label: '4.7.5 Threat intelligence integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.assetContext', // 4.7.6
            label: '4.7.6 Asset context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.identityContext', // 4.7.7
            label: '4.7.7 Identity context integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.vulnMgmt', // 4.7.8
            label: '4.7.8 Vulnerability management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.7 Capabilities: Response Integrations ---
          {
            id: 'technology.soar.knowledgeBase', // 4.7.9
            label: 'RESPONSE INTEGRATIONS\n\n4.7.9 Knowledge base integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.fwIntegration', // 4.7.10
            label: '4.7.10 Firewall integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.ndrIntegration', // 4.7.11
            label: '4.7.11 NDR integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.edrIntegration', // 4.7.12
            label: '4.7.12 EDR integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.emailProt', // 4.7.13
            label: '4.7.13 Email protection integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.malwareProt', // 4.7.14
            label: '4.7.14 Malware protection integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.sandboxIntegration', // 4.7.15
            label: '4.7.15 Sandbox integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.iamIntegration', // 4.7.16
            label: '4.7.16 Active Directory / IAM integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.responseSiem', // 4.7.17 (Note: duplicate label in your list, but distinctive ID)
            label: '4.7.17 SIEM integration (Response)',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.7 Capabilities: Playbooks ---
          {
            id: 'technology.soar.stdPlaybooks', // 4.7.18
            label: 'PLAYBOOKS\n\n4.7.18 Standard playbooks',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.customPlaybooks', // 4.7.19
            label: '4.7.19 Customised playbooks',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.playbookAuto', // 4.7.20
            label: '4.7.20 Playbook automation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.playbookDev', // 4.7.21
            label: '4.7.21 Playbook development process',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.7 Capabilities: Visualisation ---
          {
            id: 'technology.soar.reporting', // 4.7.22
            label: 'VISUALISATION AND OUTPUT\n\n4.7.22 Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.dashboards', // 4.7.23
            label: '4.7.23 Dashboards',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'technology.soar.perfTracking', // 4.7.24
            label: '4.7.24 Performance tracking',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.8 Comments ---
          {
            id: 'technology.soar.comments',
            label: '4.8 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
    ],
  },
  {
    id: 'services',
    name: 'Services',
    domainTooltipText: 'The Services domain assesses the specific security services delivered by the SOC, starting with Security Monitoring.',
    subdomains: [
      // ======================================================================
      // SUBDOMAIN 1: SECURITY MONITORING
      // ======================================================================
      {
        id: 'security_monitoring',
        name: 'Security Monitoring',
        questions: [
          // --- 1.1 Maturity ---
          {
            id: 'services.monitoring.formalDescription', // 1.1
            // Header added
            label: 'MATURITY\n\n1.1 Have you formally described the security monitoring service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.2 Document Elements (Broken down for Yes/No) ---
          // The prompt asked for Yes/No options for these specific elements
          {
            id: 'services.monitoring.doc.kpi', // 1.2.1
            label: '1.2 Please specify elements of the security monitoring service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.quality', // 1.2.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.dependencies', // 1.2.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.sla', // 1.2.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.hours', // 1.2.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.stakeholders', // 1.2.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.purpose', // 1.2.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.input', // 1.2.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.output', // 1.2.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.activities', // 1.2.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.monitoring.doc.roles', // 1.2.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 1.3 - 1.15 Maturity Continued ---
          {
            id: 'services.monitoring.qualityMeasure', // 1.3
            label: '1.3 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.deliveryMeasure', // 1.4
            label: '1.4 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.stakeholderUpdate', // 1.5
            label: '1.5 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.contract', // 1.6
            label: '1.6 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.personnelAlloc', // 1.7
            label: '1.7 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.alignment', // 1.8
            label: '1.8 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.resolutionProcess', // 1.9
            label: '1.9 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.procedures', // 1.10
            label: '1.10 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.onboarding', // 1.11
            label: '1.11 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.bestPractices', // 1.12
            label: '1.12 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.useCases', // 1.13
            label: '1.13 Are use cases used in the security monitoring service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.prediction', // 1.14
            label: '1.14 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.monitoring.improvement', // 1.15
            label: '1.15 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 1.16 Capabilities ---
          {
            id: 'services.monitoring.earlyDetect', // 1.16.1
            // Header added
            label: 'CAPABILITY\n\n1.16 Please specify capabilities of the security monitoring service:\n\n1.16.1 Early detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.intrusionDetect', // 1.16.2
            label: '1.16.2 Intrusion detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.exfilDetect', // 1.16.3
            label: '1.16.3 Exfiltration detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.subtleDetect', // 1.16.4
            label: '1.16.4 Subtle event detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.malwareDetect', // 1.16.5
            label: '1.16.5 Malware detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.anomalyDetect', // 1.16.6
            label: '1.16.6 Anomaly detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.realtimeDetect', // 1.16.7
            label: '1.16.7 Real-time detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.alerting', // 1.16.8
            label: '1.16.8 Alerting & notification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.fpReduction', // 1.16.9
            label: '1.16.9 False-positive reduction',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.tuning', // 1.16.10
            label: '1.16.10 Continuous tuning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.coverage', // 1.16.11
            label: '1.16.11 Coverage management',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.status', // 1.16.12
            label: '1.16.12 Status monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.perimeter', // 1.16.13
            label: '1.16.13 Perimeter monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.host', // 1.16.14
            label: '1.16.14 Host monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.network', // 1.16.15
            label: '1.16.15 Network & traffic monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.access', // 1.16.16
            label: '1.16.16 Access & usage monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.identity', // 1.16.17
            label: '1.16.17 User / identity monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.application', // 1.16.18
            label: '1.16.18 Application & service monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.behavior', // 1.16.19
            label: '1.16.19 Behavior monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.database', // 1.16.20
            label: '1.16.20 Database monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.dataLoss', // 1.16.21
            label: '1.16.21 Data loss monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.deviceLoss', // 1.16.22
            label: '1.16.22 Device loss / theft monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.thirdParty', // 1.16.23
            label: '1.16.23 Third-party monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.physical', // 1.16.24
            label: '1.16.24 Physical environment monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.cloud', // 1.16.25
            label: '1.16.25 Cloud monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.mobile', // 1.16.26
            label: '1.16.26 Mobile device monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.monitoring.ot', // 1.16.27
            label: '1.16.27 OT monitoring',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 1.17 Comments ---
          {
            id: 'services.monitoring.comments',
            label: '1.17 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 2: SECURITY INCIDENT MANAGEMENT
      // ======================================================================
      {
        id: 'incident_management',
        name: 'Security Incident Management',
        questions: [
          // --- 2.1 Maturity Assessment ---
          {
            id: 'services.incident.maturityMethod', // 2.1
            // Header added
            label: 'MATURITY\n\n2.1 Have you adopted a maturity assessment methodology for Security Incident Management?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.methodologyName', // 2.1.1
            label: '2.1.1 If yes, please specify the methodology',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
          {
            id: 'services.incident.maturityLevel', // 2.1.2
            label: '2.1.2 If yes, please specify the maturity level (can have up to 2 digits)',
            type: QuestionType.TEXT,
            hasImportance: false,
          },

          // --- 2.2 - 2.3 Process & Standard ---
          {
            id: 'services.incident.standard', // 2.2
            label: '2.2 Have you adopted a standard for the Security Incident Management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.formalDescription', // 2.3
            label: '2.3 Have you formally described the security incident management process?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.4 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.incident.doc.def', // 2.4.1
            label: '2.4 Please specify elements of the security incident management document:\n\nSecurity incident definition',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.sla', // 2.4.2
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.workflow', // 2.4.3
            label: 'Workflow',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.decisionTree', // 2.4.4
            label: 'Decision tree',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.hours', // 2.4.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.stakeholders', // 2.4.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.purpose', // 2.4.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.input', // 2.4.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.output', // 2.4.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.activities', // 2.4.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.incident.doc.roles', // 2.4.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 2.5 - 2.16 Maturity Continued ---
          {
            id: 'services.incident.qualityMeasure', // 2.5
            label: '2.5 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.deliveryMeasure', // 2.6
            label: '2.6 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.stakeholderUpdate', // 2.7
            label: '2.7 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.contract', // 2.8
            label: '2.8 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.personnelAlloc', // 2.9
            label: '2.9 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.alignment', // 2.10
            label: '2.10 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.authActions', // 2.11
            label: '2.11 Is the incident response team authorized to perform (invasive) actions when required?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.onboarding', // 2.12
            label: '2.12 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.bestPractices', // 2.13
            label: '2.13 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.workflows', // 2.14
            label: '2.14 Is the service supported by predefined workflows or scenarios?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.prediction', // 2.15
            label: '2.15 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.incident.improvement', // 2.16
            label: '2.16 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 2.17 Capabilities ---
          {
            id: 'services.incident.logProc', // 2.17.1
            // Header added
            label: 'CAPABILITY\n\n2.17 Please specify capabilities and artefacts of the security incident management service:\n\n2.17.1 Incident logging procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.resProc', // 2.17.2
            label: '2.17.2 Incident resolution procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.invProc', // 2.17.3
            label: '2.17.3 Incident investigation procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.escProc', // 2.17.4
            label: '2.17.4 Escalation procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.evidenceProc', // 2.17.5
            label: '2.17.5 Evidence collection procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.containmentProc', // 2.17.6
            label: '2.17.6 Incident containment procedures',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.training', // 2.17.7
            label: '2.17.7 IR Training',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.tabletop', // 2.17.8
            label: '2.17.8 Table-top exercises',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.redBlueTeam', // 2.17.9
            label: '2.17.9 Red team / blue team exercises',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.raci', // 2.17.10
            label: '2.17.10 RACI matrix',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.auth', // 2.17.11
            label: '2.17.11 Response authorization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.template', // 2.17.12
            label: '2.17.12 Incident template',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.tracking', // 2.17.13
            label: '2.17.13 Incident tracking system',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.fpReduction', // 2.17.14
            label: '2.17.14 False-positive reduction',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.priority', // 2.17.15
            label: '2.17.15 Priority assignment',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.severity', // 2.17.16
            label: '2.17.16 Severity assignment',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.cat', // 2.17.17
            label: '2.17.17 Categorization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.bridge', // 2.17.18
            label: '2.17.18 Critical bridge',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.warroom', // 2.17.19
            label: '2.17.19 War room',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.commsPlan', // 2.17.20
            label: '2.17.20 Communication plan & email templates',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.backupComms', // 2.17.21
            label: '2.17.21 Backup communication technology',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.secureComms', // 2.17.22
            label: '2.17.22 Secure communication channels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.infoSharing', // 2.17.23
            label: '2.17.23 (dedicated) information sharing platform',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.changeMgmt', // 2.17.24
            label: '2.17.24 Change management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.malwareAnalysis', // 2.17.25
            label: '2.17.25 Malware extraction & analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.onsiteResp', // 2.17.26
            label: '2.17.26 On-site incident response',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.remoteResp', // 2.17.27
            label: '2.17.27 Remote incident response',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.thirdParty', // 2.17.28
            label: '2.17.28 Third-party escalation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.evalTemplate', // 2.17.29
            label: '2.17.29 Evaluation template',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.reportTemplate', // 2.17.30
            label: '2.17.30 Reporting template',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.closure', // 2.17.31
            label: '2.17.31 Incident closure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.lessons', // 2.17.32
            label: '2.17.32 Lessons learned extraction for process improvement',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.externalSupport', // 2.17.33
            label: '2.17.33 External security incident support agreements',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.exercises', // 2.17.34
            label: '2.17.34 Exercises with other incident response teams',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.rca', // 2.17.35
            label: '2.17.35 Root Cause Analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.incident.restore', // 2.17.36
            label: '2.17.36 Restore integrity verification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 2.18 Comments ---
          {
            id: 'services.incident.comments',
            label: '2.18 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 3: SECURITY ANALYSIS & FORENSICS
      // ======================================================================
      {
        id: 'security_analysis',
        name: 'Security Analysis & Forensics',
        questions: [
          // --- 3.1 Maturity ---
          {
            id: 'services.analysis.formalDescription', // 3.1
            // Header added
            label: 'MATURITY\n\n3.1 Have you formally described the security analysis & forensics service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.2 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.analysis.doc.kpi', // 3.2.1
            label: '3.2 Please specify elements of the security analysis service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.quality', // 3.2.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.dependencies', // 3.2.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.sla', // 3.2.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.hours', // 3.2.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.stakeholders', // 3.2.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.purpose', // 3.2.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.input', // 3.2.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.output', // 3.2.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.activities', // 3.2.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.analysis.doc.roles', // 3.2.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 3.3 - 3.15 Maturity Continued ---
          {
            id: 'services.analysis.qualityMeasure', // 3.3
            label: '3.3 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.deliveryMeasure', // 3.4
            label: '3.4 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.stakeholderUpdate', // 3.5
            label: '3.5 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.contract', // 3.6
            label: '3.6 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.personnelAlloc', // 3.7
            label: '3.7 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.alignment', // 3.8
            label: '3.8 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.resolutionProcess', // 3.9
            label: '3.9 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.procedures', // 3.10
            label: '3.10 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.onboarding', // 3.11
            label: '3.11 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.bestPractices', // 3.12
            label: '3.12 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.workflows', // 3.13
            label: '3.13 Is the service supported by predefined workflows or scenarios?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.prediction', // 3.14
            label: '3.14 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.analysis.improvement', // 3.15
            label: '3.15 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 3.16 Capabilities ---
          {
            id: 'services.analysis.cap.eventAnalysis', // 3.16.1
            // Header added
            label: 'CAPABILITY\n\n3.16 Please specify capabilities and artefacts of the security analysis process:\n\n3.16.1 Event analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.toolkit', // 3.16.2
            label: '3.16.2 Event analysis toolkit',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.trend', // 3.16.3
            label: '3.16.3 Trend analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.incident', // 3.16.4
            label: '3.16.4 Incident analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.visual', // 3.16.5
            label: '3.16.5 Visual analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.staticMalware', // 3.16.6
            label: '3.16.6 Static malware analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.dynamicMalware', // 3.16.7
            label: '3.16.7 Dynamic malware analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.tradecraft', // 3.16.8
            label: '3.16.8 Tradecraft analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.historic', // 3.16.9
            label: '3.16.9 Historic analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.network', // 3.16.10
            label: '3.16.10 Network analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.memory', // 3.16.11
            label: '3.16.11 Memory analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.mobile', // 3.16.12
            label: '3.16.12 Mobile device analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.volatileInfo', // 3.16.13
            label: '3.16.13 Volatile information collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.remoteEvidence', // 3.16.14
            label: '3.16.14 Remote evidence collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.hardwareToolkit', // 3.16.15
            label: '3.16.15 Forensic hardware toolkit',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.softwareToolkit', // 3.16.16
            label: '3.16.16 Forensic analysis software toolkit',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.workstations', // 3.16.17
            label: '3.16.17 Dedicated analysis workstations',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.handbook', // 3.16.18
            label: '3.16.18 Security analysis & forensics handbook',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.workflows', // 3.16.19
            label: '3.16.19 Security analysis & forensics workflows',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.caseMgmt', // 3.16.20
            label: '3.16.20 Case management system',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.reportTemplate', // 3.16.21
            label: '3.16.21 Report templates',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.evidenceSeizure', // 3.16.22
            label: '3.16.22 Evidence seizure procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.evidenceTransport', // 3.16.23
            label: '3.16.23 Evidence transport procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.analysis.cap.chainCustody', // 3.16.24
            label: '3.16.24 Chain of custody preservation procedure',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 3.17 Comments ---
          {
            id: 'services.analysis.comments',
            label: '3.17 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 4: THREAT INTELLIGENCE
      // ======================================================================
      {
        id: 'threat_intelligence',
        name: 'Threat Intelligence',
        questions: [
          // --- 4.1 Maturity ---
          {
            id: 'services.ti.formalDescription', // 4.1
            // Header added
            label: 'MATURITY\n\n4.1 Have you formally described the threat intelligence service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.2 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.ti.doc.kpi', // 4.2.1
            label: '4.2 Please specify elements of the threat intelligence service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.quality', // 4.2.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.dependencies', // 4.2.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.sla', // 4.2.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.hours', // 4.2.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.stakeholders', // 4.2.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.purpose', // 4.2.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.input', // 4.2.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.output', // 4.2.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.activities', // 4.2.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.ti.doc.roles', // 4.2.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 4.3 - 4.14 Maturity Continued ---
          {
            id: 'services.ti.qualityMeasure', // 4.3
            label: '4.3 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.deliveryMeasure', // 4.4
            label: '4.4 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.stakeholderUpdate', // 4.5
            label: '4.5 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.contract', // 4.6
            label: '4.6 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.personnelAlloc', // 4.7
            label: '4.7 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.alignment', // 4.8
            label: '4.8 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.resolutionProcess', // 4.9
            label: '4.9 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.procedures', // 4.10
            label: '4.10 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.onboarding', // 4.11
            label: '4.11 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.bestPractices', // 4.12
            label: '4.12 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.prediction', // 4.13
            label: '4.13 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.ti.improvement', // 4.14
            label: '4.14 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 4.15 Capabilities: Collection ---
          {
            id: 'services.ti.cap.continuous', // 4.15.1
            // Header added
            label: 'CAPABILITY\n\n4.15 Please specify capabilities and artefacts of the threat intelligence process:\n\nCOLLECTION\n\n4.15.1 Continuous intelligence gathering',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.automated', // 4.15.2
            label: '4.15.2 Automated intelligence gathering & processing',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.centralized', // 4.15.3
            label: '4.15.3 Centralized collection & distribution',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.osint', // 4.15.4
            label: '4.15.4 Intelligence collection from open / public sources',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.closed', // 4.15.5
            label: '4.15.5 Intelligence collection from closed communities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.provider', // 4.15.6
            label: '4.15.6 Intelligence collection from intelligence provider',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.partners', // 4.15.7
            label: '4.15.7 Intelligence collection from business partners',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.mailing', // 4.15.8
            label: '4.15.8 Intelligence collection from mailing lists',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.internal', // 4.15.9
            label: '4.15.9 Intelligence collection from internal sources',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.15 Capabilities: Processing ---
          {
            id: 'services.ti.cap.structured', // 4.15.10
            label: 'PROCESSING\n\n4.15.10 Structured data analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.unstructured', // 4.15.11
            label: '4.15.11 Unstructured data analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.pastIncidents', // 4.15.12
            label: '4.15.12 Past incident analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.trend', // 4.15.13
            label: '4.15.13 Trend analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.autoAlert', // 4.15.14
            label: '4.15.14 Automated alerting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.adversaryTracking', // 4.15.15
            label: '4.15.15 Adversary movement tracking',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.attackerId', // 4.15.16
            label: '4.15.16 Attacker identification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.threatId', // 4.15.17
            label: '4.15.17 Threat identification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.threatPrediction', // 4.15.18
            label: '4.15.18 Threat prediction',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.ttp', // 4.15.19
            label: '4.15.19 TTP extraction',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.deduplication', // 4.15.20
            label: '4.15.20 Deduplication',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.enrichment', // 4.15.21
            label: '4.15.21 Enrichment',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.context', // 4.15.22
            label: '4.15.22 Contextualization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.prioritization', // 4.15.23
            label: '4.15.23 Prioritization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.reporting', // 4.15.24
            label: '4.15.24 Threat intelligence reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.landscaping', // 4.15.25
            label: '4.15.25 Threat landscaping',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.forecasting', // 4.15.26
            label: '4.15.26 Forecasting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.15 Capabilities: Dissemination ---
          {
            id: 'services.ti.cap.shareInternal', // 4.15.27
            label: 'DISSEMINATION\n\n4.15.27 Sharing within the company',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.shareIndustry', // 4.15.28
            label: '4.15.28 Sharing with the industry',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.shareExternal', // 4.15.29
            label: '4.15.29 Sharing outside the industry',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.ti.cap.shareStandard', // 4.15.30
            label: '4.15.30 Sharing in standardized format (e.g. STIX)',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 4.15 Capabilities: Infrastructure ---
          {
            id: 'services.ti.cap.infraMgmt', // 4.15.31
            label: 'INFRASTRUCTURE MANAGEMENT\n\n4.15.31 Management of the CTI infrastructure (Threat Intelligence Platform)',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 5: THREAT HUNTING
      // ======================================================================
      {
        id: 'threat_hunting',
        name: 'Threat Hunting',
        questions: [
          // --- 5.1 Maturity ---
          {
            id: 'services.hunting.methodology', // 5.1
            // Header added
            label: 'MATURITY\n\n5.1 Do you use a standardized threat hunting methodology?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.formalDescription', // 5.2
            label: '5.2 Have you formally described the threat hunting service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 5.3 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.hunting.doc.kpi', // 5.3.1
            label: '5.3 Please specify elements of the threat hunting service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' }, // Mapping Yes/No to score 1/5
            ],
          },
          {
            id: 'services.hunting.doc.quality', // 5.3.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.dependencies', // 5.3.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.sla', // 5.3.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.hours', // 5.3.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.stakeholders', // 5.3.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.purpose', // 5.3.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.input', // 5.3.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.output', // 5.3.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.activities', // 5.3.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.hunting.doc.roles', // 5.3.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 5.4 - 5.15 Maturity Continued ---
          {
            id: 'services.hunting.qualityMeasure', // 5.4
            label: '5.4 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.deliveryMeasure', // 5.5
            label: '5.5 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.stakeholderUpdate', // 5.6
            label: '5.6 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.contract', // 5.7
            label: '5.7 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.personnelAlloc', // 5.8
            label: '5.8 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.alignment', // 5.9
            label: '5.9 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.resolutionProcess', // 5.10
            label: '5.10 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.procedures', // 5.11
            label: '5.11 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.onboarding', // 5.12
            label: '5.12 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.bestPractices', // 5.13
            label: '5.13 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.prediction', // 5.14
            label: '5.14 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.hunting.improvement', // 5.15
            label: '5.15 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 5.16 Capabilities ---
          {
            id: 'services.hunting.cap.hash', // 5.16.1
            // Header added
            label: 'CAPABILITY\n\n5.16 Please specify capabilities and artefacts of the threat hunting process:\n\n5.16.1 Hash value hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.ip', // 5.16.2
            label: '5.16.2 IP address hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.domain', // 5.16.3
            label: '5.16.3 Domain name hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.network', // 5.16.4
            label: '5.16.4 Network artefact hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.host', // 5.16.5
            label: '5.16.5 Host-based artefact hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.tools', // 5.16.6
            label: '5.16.6 Adversary tools hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.ttp', // 5.16.7
            label: '5.16.7 Adversary TTP hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.inbound', // 5.16.8
            label: '5.16.8 Inbound threat hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.outbound', // 5.16.9
            label: '5.16.9 Outbound threat hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.internal', // 5.16.10
            label: '5.16.10 Internal threat hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.outlier', // 5.16.11
            label: '5.16.11 Outlier detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.coverage', // 5.16.12
            label: '5.16.12 Hunting coverage',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.tooling', // 5.16.13
            label: '5.16.13 Leveraging of existing tooling',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.customScripts', // 5.16.14
            label: '5.16.14 Custom hunting scripts and tools',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.platform', // 5.16.15
            label: '5.16.15 Dedicated hunting platform',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.continuousData', // 5.16.16
            label: '5.16.16 Continuous hunting data collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.historic', // 5.16.17
            label: '5.16.17 Historic hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.hunting.cap.automated', // 5.16.18
            label: '5.16.18 Automated hunting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 5.17 Comments ---
          {
            id: 'services.hunting.comments',
            label: '5.17 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 6: VULNERABILITY MANAGEMENT
      // ======================================================================
      {
        id: 'vulnerability_management',
        name: 'Vulnerability Management',
        questions: [
          // --- 6.1 Maturity ---
          {
            id: 'services.vm.formalDescription', // 6.1
            // Header added
            label: 'MATURITY\n\n6.1 Have you formally described the vulnerability management service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 6.2 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.vm.doc.kpi', // 6.2.1
            label: '6.2 Please specify elements of the vulnerability management service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.quality', // 6.2.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.dependencies', // 6.2.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.sla', // 6.2.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.hours', // 6.2.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.stakeholders', // 6.2.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.purpose', // 6.2.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.input', // 6.2.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.output', // 6.2.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.activities', // 6.2.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.vm.doc.roles', // 6.2.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 6.3 - 6.14 Maturity Continued ---
          {
            id: 'services.vm.qualityMeasure', // 6.3
            label: '6.3 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.deliveryMeasure', // 6.4
            label: '6.4 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.stakeholderUpdate', // 6.5
            label: '6.5 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.contract', // 6.6
            label: '6.6 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.personnelAlloc', // 6.7
            label: '6.7 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.alignment', // 6.8
            label: '6.8 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.resolutionProcess', // 6.9
            label: '6.9 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.procedures', // 6.10
            label: '6.10 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.onboarding', // 6.11
            label: '6.11 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.bestPractices', // 6.12
            label: '6.12 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.prediction', // 6.13
            label: '6.13 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.vm.improvement', // 6.14
            label: '6.14 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 6.15 Capabilities ---
          {
            id: 'services.vm.cap.networkMapping', // 6.15.1
            // Header added
            label: 'CAPABILITY\n\n6.15 Please specify capabilities and artefacts of the vulnerability management process:\n\n6.15.1 Network mapping',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.vulnId', // 6.15.2
            label: '6.15.2 Vulnerability identification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.riskId', // 6.15.3
            label: '6.15.3 Risk identification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.riskAccept', // 6.15.4
            label: '6.15.4 Risk acceptance',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.baselineScan', // 6.15.5
            label: '6.15.5 Security baseline scanning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.authScan', // 6.15.6
            label: '6.15.6 Authenticated scanning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.incidentInteg', // 6.15.7
            label: '6.15.7 Incident management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.assetInteg', // 6.15.8
            label: '6.15.8 Asset management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.configInteg', // 6.15.9
            label: '6.15.9 Configuration management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.patchInteg', // 6.15.10
            label: '6.15.10 Patch management integration',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.trendId', // 6.15.11
            label: '6.15.11 Trend identification',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.repo', // 6.15.12
            label: '6.15.12 Enterprise vulnerability repository',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.appInventory', // 6.15.13
            label: '6.15.13 Enterprise application inventory',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.procedures', // 6.15.14
            label: '6.15.14 Vulnerability Management procedures',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.policyTuning', // 6.15.15
            label: '6.15.15 Scanning policy tuning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.detailedReport', // 6.15.16
            label: '6.15.16 Detailed Vulnerability Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.mgmtReport', // 6.15.17
            label: '6.15.17 Management Reporting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.scheduledScan', // 6.15.18
            label: '6.15.18 Scheduled scanning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.adhocScan', // 6.15.19
            label: '6.15.19 Ad-hoc specific scanning',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.vm.cap.infoGathering', // 6.15.20
            label: '6.15.20 Vulnerability information gathering & analysis',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 6.16 Comments ---
          {
            id: 'services.vm.comments',
            label: '6.16 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
      // ======================================================================
      // SUBDOMAIN 7: LOG MANAGEMENT
      // ======================================================================
      {
        id: 'log_management',
        name: 'Log Management',
        questions: [
          // --- 7.1 Maturity ---
          {
            id: 'services.log.formalDescription', // 7.1
            // Header added
            label: 'MATURITY\n\n7.1 Have you formally described the log management service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 7.2 Document Elements (Yes/No Breakdown) ---
          {
            id: 'services.log.doc.kpi', // 7.2.1
            label: '7.2 Please specify elements of the log management service document:\n\nKey performance indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.quality', // 7.2.2
            label: 'Quality indicators',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.dependencies', // 7.2.3
            label: 'Service dependencies',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.sla', // 7.2.4
            label: 'Service levels',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.hours', // 7.2.5
            label: 'Hours of operation',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.stakeholders', // 7.2.6
            label: 'Service customers and stakeholders',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.purpose', // 7.2.7
            label: 'Purpose',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.input', // 7.2.8
            label: 'Service input / triggers',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.output', // 7.2.9
            label: 'Service output / deliverables',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.activities', // 7.2.10
            label: 'Service activities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },
          {
            id: 'services.log.doc.roles', // 7.2.11
            label: 'Service roles & responsibilities',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '5', label: 'Yes' },
            ],
          },

          // --- 7.3 - 7.14 Maturity Continued ---
          {
            id: 'services.log.qualityMeasure', // 7.3
            label: '7.3 Is the service measured for quality?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.deliveryMeasure', // 7.4
            label: '7.4 Is the service measured for service delivery in accordance with service levels?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.stakeholderUpdate', // 7.5
            label: '7.5 Are customers and/or stakeholders regularly updated about the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.contract', // 7.6
            label: '7.6 Is there a contractual agreement between the SOC and the customers?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.personnelAlloc', // 7.7
            label: '7.7 Is sufficient personnel allocated to the process to ensure required service delivery?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.alignment', // 7.8
            label: '7.8 Is the service aligned with other relevant processes?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.resolutionProcess', // 7.9
            label: '7.9 Is there a incident resolution / service continuity process in place for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.procedures', // 7.10
            label: '7.10 Has a set of procedures been created for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.onboarding', // 7.11
            label: '7.11 Is there an onboarding and offloading procedure for this service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.bestPractices', // 7.12
            label: '7.12 Are best practices applied to the service?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.prediction', // 7.13
            label: '7.13 Is process data gathered for prediction of service performance?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },
          {
            id: 'services.log.improvement', // 7.14
            label: '7.14 Is the service continuously being improved based on improvement goals?',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
            ],
          },

          // --- 7.15 Capabilities ---
          {
            id: 'services.log.cap.endpoint', // 7.15.1
            // Header added
            label: 'CAPABILITY\n\n7.15 Please specify capabilities and artefacts of the log management process:\n\n7.15.1 End-point log collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.appLog', // 7.15.2
            label: '7.15.2 Application log collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.dbLog', // 7.15.3
            label: '7.15.3 Database log collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.networkFlow', // 7.15.4
            label: '7.15.4 Network flow data collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.networkDevice', // 7.15.5
            label: '7.15.5 Network device log collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.securityDevice', // 7.15.6
            label: '7.15.6 Security device log collection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.aggregation', // 7.15.7
            label: '7.15.7 Centralized aggregation and storage',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.retention', // 7.15.8
            label: '7.15.8 Multiple retention periods',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.secureTransfer', // 7.15.9
            label: '7.15.9 Secure log transfer',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.formats', // 7.15.10
            label: '7.15.10 Support for multiple log formats',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.transferTech', // 7.15.11
            label: '7.15.11 Support for multiple transfer techniques',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.normalization', // 7.15.12
            label: '7.15.12 Data normalization',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.searchFilter', // 7.15.13
            label: '7.15.13 Log searching and filtering',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.alerting', // 7.15.14
            label: '7.15.14 Alerting',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.dashboards', // 7.15.15
            label: '7.15.15 Reporting and dashboards',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.tampering', // 7.15.16
            label: '7.15.16 Log tampering detection',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.collectionPolicy', // 7.15.17
            label: '7.15.17 Log collection policy',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.loggingPolicy', // 7.15.18
            label: '7.15.18 Logging policy',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.retentionPolicy', // 7.15.19
            label: '7.15.19 Data retention policy',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },
          {
            id: 'services.log.cap.privacyPolicy', // 7.15.20
            label: '7.15.20 Privacy and Sensitive data handling policy',
            type: QuestionType.SELECT,
            hasImportance: true,
            options: [
              { value: '1', label: 'No' },
              { value: '2', label: 'Partially' },
              { value: '3', label: 'Averagely' },
              { value: '4', label: 'Mostly' },
              { value: '5', label: 'Fully' },
              { value: '6', label: 'Not Required' },
            ],
          },

          // --- 7.16 Comments ---
          {
            id: 'services.log.comments',
            label: '7.16 Specify rationale for chosen values or any additional comments',
            type: QuestionType.TEXT,
            hasImportance: false,
          },
        ],
      },
    ],
  },
];

// // src/lib/socmm-schema.ts

// // ============================================================================
// // 1. "BUILDING BLOCKS" - The Types and Constants
// // ============================================================================

// export const QuestionType = {
//   SELECT: 'select',
//   CHECKBOX_GROUP: 'checkbox_group',
//   TEXT: 'text',
//   NUMBER: 'number',
//   //COMPLETENESS_INDICATOR: 'completeness_indicator', // ADD THIS LINE
// } as const;

// // A global constant for Importance levels
// export const IMPORTANCE_LEVELS = [
//   { value: 'none', label: 'None' },
//   { value: 'low', label: 'Low' },
//   { value: 'normal', label: 'Normal' },
//   { value: 'high', label: 'High' },
//   { value: 'critical', label: 'Critical' },
// ];

// export type Question = {
//   id: string;
//   label: string;
//   type: (typeof QuestionType)[keyof typeof QuestionType];
//   options?: { value: string; label: string }[];
//   hasImportance?: boolean;
//   evidence?: {
//     triggerValue: string | string[];// The answer that shows the text field (e.g., '5')
//     label: string;      // The label for the text field (e.g., 'Path to document:')
//   };
// };

// export type Subdomain = {
//   id: string;
//   name: string;
//   hasCompletenessIndicator?: boolean;
//   questions: readonly Question[];
// };

// export type Domain = {
//   id: string;
//   name: string;
//   subdomains: readonly Subdomain[];
//   domainTooltipText?: string;   // ADD THIS LINE
//   domainLearnMoreUrl?: string; // ADD THIS LINE
// };

// // ============================================================================
// // 2. THE GRAND SCHEMA - The Application's Source of Truth
// // ============================================================================

// export const assessmentModel: readonly Domain[] = [
//   // #################### DOMAIN 1: BUSINESS ####################
//   {
//     id: 'business',
//     name: 'Business',
//     domainTooltipText: 'The Business domain assesses the alignment of the SOC with the organization\'s overall goals and strategic objectives.',
//     domainLearnMoreUrl: 'https://www.sans.org/white-papers/38197/',
//     subdomains: [
//       {
//         id: 'drivers',
//         name: 'Business Drivers',
//         questions: [
//           {
//             id: 'business.drivers.identified',
//             label: 'Have you identified the main business drivers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Business drivers are unknown' },
//               { value: '2', label: 'Partially: Some business drivers have been identified' },
//               { value: '3', label: 'Averagely: Most business drivers have been identified' },
//               { value: '4', label: 'Mostly: All business drivers are well known within the SOC' },
//               { value: '5', label: 'Fully: Document completed, approved and formally published' },
//             ],
//           },
//           {
//             id: 'business.drivers.documented',
//             label: 'Have you documented the main business drivers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             evidence: {
//               triggerValue: ['2', '3', '4', '5'],
//               label: 'Path to document (URL or file path):',
//             },
//             options: [
//               { value: '1', label: 'No: No documentation in place' },
//               { value: '2', label: 'Partially: Some ad-hoc information across documents' },
//               { value: '3', label: 'Averagely: Basic documentation of business drivers' },
//               { value: '4', label: 'Mostly: Single document, full description of business drivers' },
//               { value: '5', label: 'Fully: Document completed, approved and formally published' },
//             ],
//           },
//           {
//             id: 'business.drivers.decisionMaking',
//             label: 'Do you use business drivers in the decision making process?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Business drivers are not part of decision making' },
//               { value: '2', label: 'Partially: Business drivers are referred to on an ad-hoc basis' },
//               { value: '3', label: 'Averagely: Business drivers are occasionally used in decisions' },
//               { value: '4', label: 'Mostly: Business drivers are used in most decisions' },
//               { value: '5', label: 'Fully: Business drivers are used in all relevant decisions' },
//             ],
//           },
//           {
//             id: 'business.drivers.serviceCatalogueAlignment',
//             label: 'Do you regularly check if the current service catalogue is aligned with business drivers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Service catalogue has not been checked for alignment' },
//               { value: '2', label: 'Partially: Alignment is performed on an ad-hoc basis' },
//               { value: '3', label: 'Averagely: Alignment was performed but not maintained' },
//               { value: '4', label: 'Mostly: Alignment is performed and maintained regularly' },
//               { value: '5', label: 'Fully: Every change in the catalogue is checked against drivers' },
//             ],
//           },
//           {
//             id: 'business.drivers.stakeholderValidation',
//             label: 'Have the business drivers been validated with business stakeholders?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Business drivers have not been validated' },
//               { value: '2', label: 'Partially: Basic awareness of SOC drivers exists among stakeholders' },
//               { value: '3', label: 'Averagely: Stakeholders informally informed of business drivers' },
//               { value: '4', label: 'Mostly: Alignment of SOC drivers with stakeholders is performed' },
//               { value: '5', label: 'Fully: Business drivers are formally validated by stakeholders' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'customers',
//         name: 'Customers',
//         questions: [
//           {
//             id: 'business.customers.identified',
//             label: 'Have you identified the SOC customers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: SOC customers are not known' },
//               { value: '2', label: 'Partially: Basic awareness of SOC customers' },
//               { value: '3', label: 'Averagely: Some customers have been identified' },
//               { value: '4', label: 'Mostly: Customers have mostly been identified' },
//               { value: '5', label: 'Fully: All customers are identified, including relevance and context' },
//             ],
//           },
//           {
//             id: 'business.customers.customerTypes',
//             label: 'Please specify your customer(s):',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'legal', label: 'Legal' },
//               { value: 'audit', label: 'Audit' },
//               { value: 'engineeringRnd', label: 'Engineering/R&D' },
//               { value: 'it', label: 'IT' },
//               { value: 'business', label: 'Business' },
//               { value: 'external', label: 'External' },
//               { value: 'seniorManagement', label: 'Senior Management' },
//             ],
//           },
//           {
//             id: 'business.customers.other',
//             label: 'Other customers (specify)',
//             type: QuestionType.TEXT,
//           },
//           {
//             id: 'business.customers.documented',
//             label: 'Have you documented the main SOC customers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             evidence: {
//               triggerValue: ['2', '3', '4', '5'],
//               label: 'Path to document (URL or file path):',
//             },
//             options: [
//               { value: '1', label: 'No: No documentation in place' },
//               { value: '2', label: 'Partially: Some ad-hoc information across documents' },
//               { value: '3', label: 'Averagely: Basic documentation of SOC customers' },
//               { value: '4', label: 'Mostly: Single document, full description of SOC customers' },
//               { value: '5', label: 'Fully: Document completed, approved and formally published' },
//             ],
//           },
//           {
//             id: 'business.customers.differentiatedOutput',
//             label: 'Do you differentiate output towards these specific customers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Output is the same for all customers' },
//               { value: '2', label: 'Partially: Output is somewhat contextualized' },
//               { value: '3', label: 'Averagely: Some customers receive differentiated output' },
//               { value: '4', label: 'Mostly: All important customers receive differentiated output' },
//               { value: '5', label: 'Fully: All customers receive specific output based on context and type' },
//             ],
//           },
//           {
//             id: 'business.customers.slas',
//             label: 'Do you have service level agreements with these customers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Contractual agreements not in place' },
//               { value: '2', label: 'Partially: No contract in place, ad-hoc agreements made' },
//               { value: '3', label: 'Averagely: Basic contract in place, not formally signed off' },
//               { value: '4', label: 'Mostly: Contract signed, but not regularly reviewed' },
//               { value: '5', label: 'Fully: Contract signed, approved by- and regularly reviewed with customers' },
//             ],
//           },
//           {
//             id: 'business.customers.updates',
//             label: 'Do you regularly send updates to your customers?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never: No updates sent to customers' },
//               { value: '2', label: 'Sometimes: Ad-hoc updates sent to some customers' },
//               { value: '3', label: 'Averagely: Frequent updates sent to most customers' },
//               { value: '4', label: 'Mostly: Periodical updates sent to all customers' },
//               { value: '5', label: 'Always: Periodical updates sent and discussed with all customers' },
//             ],
//           },
//           {
//             id: 'business.customers.satisfaction',
//             label: 'Do you actively measure and manage customer satisfaction?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never: Customer satisfaction not measured or managed' },
//               { value: '2', label: 'Sometimes: Customer satisfaction managed in ad-hoc fashion' },
//               { value: '3', label: 'Averagely: Customer satisfaction metrics defined, not applied structurally' },
//               { value: '4', label: 'Mostly: Customer satisfaction measured structurally, not actively managed' },
//               { value: '5', label: 'Always: Customer satisfaction fully managed and improved over time' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'charter',
//         name: 'Charter',
//         // REMOVED: 'hasCompletenessIndicator' is no longer here.
//         questions: [
//           {
//             id: 'business.charter.exists',
//             label: 'Does the SOC have a formal charter document in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: No charter document in place' },
//               { value: '2', label: 'Partially: Some ad-hoc information across documents' },
//               { value: '3', label: 'Averagely: Basic charter document created' },
//               { value: '4', label: 'Mostly: Single charter, full description of SOC strategic elements' },
//               { value: '5', label: 'Fully: Charter completed, approved and formally published' },
//             ],
//           },
//           {
//             id: 'business.charter.elements',
//             label: 'Please specify elements of the charter document:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'mission', label: 'Mission' },
//               { value: 'vision', label: 'Vision' },
//               { value: 'strategy', label: 'Strategy' },
//               { value: 'serviceScope', label: 'Service Scope' },
//               { value: 'deliverables', label: 'Deliverables' },
//               { value: 'responsibilities', label: 'Responsibilities' },
//               { value: 'accountability', label: 'Accountability' },
//               { value: 'operationalHours', label: 'Operational Hours' },
//               { value: 'stakeholders', label: 'Stakeholders' },
//               { value: 'objectivesGoals', label: 'Objectives/Goals' },
//               { value: 'statementOfSuccess', label: 'Statement of Success' },
//             ],
//           },
//           {
//             id: 'business.charter.updated',
//             label: 'Is the SOC charter document regularly updated?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never: Charter is never updated' },
//               { value: '2', label: 'Sometimes: Charter is updated on ad-hoc basis' },
//               { value: '3', label: 'Averagely: Charter is updated on major changes in business strategy' },
//               { value: '4', label: 'Mostly: Charter is regularly updated' },
//               { value: '5', label: 'Always: Charter periodically updated and realigned with business strategy' },
//             ],
//           },
//           {
//             id: 'business.charter.approved',
//             label: 'Is The soc charter document approved by the business /CISO?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Charter is not approved' },
//               { value: '2', label: 'Partially: Business / CISO has some awareness of the charter' },
//               { value: '3', label: 'Averagely: Business / CISO has full awareness of the charter' },
//               { value: '4', label: 'Mostly: Business / CISO approves the content, but not formally' },
//               { value: '5', label: 'Fully: Charter is formally approved' },
//             ],
//           },
//           {
//             id: 'business.charter.stakeholdersFamiliar',
//             label: 'Are all stakeholders familiar with the SOC Charter document contents?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Stakeholders are unfamiliar' },
//               { value: '2', label: 'Partially: Some are aware of the charter' },
//               { value: '3', label: 'Averagely: Some are aware of the charter and its contents' },
//               { value: '4', label: 'Mostly: All stakeholders are aware, not all know its contents' },
//               { value: '5', label: 'Fully: All stakeholders are aware of the charter and its contents' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'governance',
//         name: 'Governance',
//         hasCompletenessIndicator: true,
//         questions: [
//           {
//             id: 'business.governance.processInPlace',
//             label: 'Does the soc have a governance process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: SOC governance process is not in place' },
//               { value: '2', label: 'Partially: SOC governance is done in an ad hoc fashion' },
//               { value: '3', label: 'Averagely: Several governance elements are in place, but not structurally' },
//               { value: '4', label: 'Mostly: Formal Governance process is in place that covers most' },
//               { value: '5', label: 'Fully: Formal governance process is in place and covers all SOC aspects.' },
//             ],
//           },
//           {
//             id: 'business.governance.elementsIdentified',
//             label: 'Have all governance elements been identified?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: No governance elements have been identified' },
//               { value: '2', label: 'Partially: Some governance elements are identified' },
//               { value: '3', label: 'Averagely: Some governance elements are identified and governed actively' },
//               { value: '4', label: 'Mostly: Most governance elements are identified and governed actively' },
//               { value: '5', label: 'Fully: All elements are identified and actively governed' },
//             ],
//           },
//           {
//             id: 'business.governance.elements',
//             label: 'Please specify identified governance elements:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'businessAlignment', label: 'Business alignment' },
//               { value: 'accountability', label: 'Accountability' },
//               { value: 'sponsorship', label: 'Sponsorship' },
//               { value: 'mandate', label: 'Mandate' },
//               { value: 'relationships', label: 'Relationships and third party management' },
//               { value: 'vendorEngagement', label: 'Vendor engagement' },
//               { value: 'serviceCommitment', label: 'Service commitment' },
//               { value: 'projectManagement', label: 'Project/program management' },
//               { value: 'continualImprovement', label: 'Continual improvement' },
//               { value: 'spanOfControl', label: 'Span of control / federation governance' },
//               { value: 'outsourcedService', label: 'Outsourced service management' },
//               { value: 'kpisMetrics', label: 'SOC KPIs & metrics' },
//               { value: 'riskManagement', label: 'SOC Risk management' },
//               { value: 'customerEngagement', label: 'Customer engagement/satisfaction' },
//             ],
//           },
//           {
//             id: 'business.governance.costManagement',
//             label: 'Is cost management in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No: Cost management is not in place' },
//               { value: '2', label: 'Partially: Costs visible, basic budget allocation in place' },
//               { value: '3', label: 'Averagely: Costs fully visible and mostly managed, forecasting in place' },
//               { value: '4', label: 'Mostly: Costs fully managed, not formally aligned with business stakeholders' },
//               { value: '5', label: 'Fully: Costs fully managed and formally aligned with business stakeholders' },
//             ],
//           },
//           {
//             id: 'business.governance.costElements',
//             label: 'Please specify cost management elements:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'people', label: 'People cost' },
//               { value: 'process', label: 'Process cost' },
//               { value: 'technology', label: 'Technology cost' },
//               { value: 'services', label: 'Services cost' },
//               { value: 'facility', label: 'Facility cost' },
//               { value: 'budgetForecasting', label: 'Budget forecasting' },
//               { value: 'budgetAlignment', label: 'Budget alignment' },
//               { value: 'roi', label: 'Return on investment' },
//             ],
//           },
//           {
//             id: 'business.governance.documented',
//             label: 'Are all governance elements formally documented?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'business.governance.meetings',
//             label: 'Are SOC governance meetings regularly held?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'business.governance.reviewed',
//             label: 'Is the governance process regularly reviewed?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'business.governance.aligned',
//             label: 'Is the governance process aligned with all stakeholders?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'business.governance.audited',
//             label: 'Is the soc regularly audited or subjected to external assessments?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'business.governance.cooperation',
//             label: 'Is there an active cooperation with other socs? (external)?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   // #################### DOMAIN 2: PEOPLE ####################
//   {
//     id: 'people',
//     name: 'People',
//     subdomains: [
//       {
//         id: 'employees',
//         name: 'Employees',
//         questions: [
//           {
//             id: 'people.employees.fteCount',
//             label: "How many FTE's are in your SOC?",
//             type: QuestionType.NUMBER,
//           },
//           {
//             id: 'people.employees.useExternal',
//             label: 'Do you use external employees / contractors in your SOC?',
//             type: QuestionType.SELECT,
//             options: [
//               { value: 'yes', label: 'Yes' },
//               { value: 'no', label: 'No' },
//             ],
//           },
//           {
//             id: 'people.employees.externalFteCount',
//             label: "If yes, specify the number of external FTE's:",
//             type: QuestionType.NUMBER,
//           },
//           {
//             id: 'people.employees.fteRequirements',
//             label: 'Does the current size of the SOC meet FTE requirements?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.fteRatio',
//             label: 'Does the SOC meet requirements for internal to external employee FTE ratio?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.skillsetRatio',
//             label: 'Does the SOC meet requirements for internal to external employee skillset?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.positionsFilled',
//             label: 'Are all positions filled?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.recruitmentProcess',
//             label: 'Do you have a recruitment process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.talentAcquisition',
//             label: 'Do you have talent acquisition in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.ksaos',
//             label: 'Do you have specific KSAOs established for SOC personnel?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.employees.psychologicallySafe',
//             label: 'Do you actively seek to create a psychologically safe environment for SOC personnel?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'roles',
//         name: 'Roles & Hierarchy',
//         hasCompletenessIndicator: true,
//         questions: [
//           {
//             id: 'people.roles.differentiate',
//             label: 'Do you formally differentiate roles within the SOC?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Somewhat' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.present',
//             label: 'Which of the following roles are present in your SOC?',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'securityAnalyst', label: 'Security Analyst' },
//               { value: 'securityEngineer', label: 'Security / Systems Engineer' },
//               { value: 'forensicAnalyst', label: 'Forensic Analyst' },
//               { value: 'securityArchitect', label: 'Security Architect' },
//               { value: 'threatIntelAnalyst', label: 'Threat Intelligence Analyst' },
//               { value: 'dataScientist', label: 'Data Scientist' },
//               { value: 'socManager', label: 'SOC Manager' },
//               { value: 'teamLeader', label: 'Team Leader' },
//               { value: 'incidentHandler', label: 'Incident Handler' },
//               { value: 'incidentManager', label: 'Incident Manager' },
//               { value: 'penTester', label: 'Penetration Tester' },
//               { value: 'detectionEngineer', label: 'Detection engineer' },
//               { value: 'automationEngineer', label: 'Automation engineer' },
//             ],
//           },
//           {
//             id: 'people.roles.otherRole',
//             label: 'Others, specify:',
//             type: QuestionType.TEXT,
//           },
//           {
//             id: 'people.roles.differentiateTiers',
//             label: 'Do you differentiate tiers within these roles?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.staffed',
//             label: 'Are all roles sufficiently staffed?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.hierarchy',
//             label: 'Is there a role-based hierarchy in your SOC?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.documented',
//             label: 'Have you formally documented all SOC roles?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.documentationElements',
//             label: 'Please specify elements in the role documentation:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'description', label: 'Role description' },
//               { value: 'tasks', label: 'Role tasks' },
//               { value: 'responsibilities', label: 'Role responsibilities' },
//               { value: 'expectations', label: 'Role expectations' },
//               { value: 'technicalSkills', label: 'Required technical skills' },
//               { value: 'softSkills', label: 'Required soft skills' },
//               { value: 'education', label: 'Required educational level' },
//               { value: 'certifications', label: 'Required or preferred certifications' },
//             ],
//           },
//           {
//             id: 'people.roles.responsibilitiesUnderstood',
//             label: 'Are responsibilities for each role understood?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.careerProgression',
//             label: 'Have you documented career progression requirements for each of these roles?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.roles.revise',
//             label: 'Do you regularly revise or update the role descriptions?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Sometimes' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Always' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'peopleManagement',
//         name: 'People Management',
//         questions: [
//           {
//             id: 'people.management.jobRotation',
//             label: 'Do you have a job rotation plan in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.careerProgression',
//             label: 'Do you have a career progression process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.talentManagement',
//             label: 'Do you have a talent management process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.diversityGoals',
//             label: 'Do you have team diversity goals?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.teamGoals',
//             label: 'Have you established team goals?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.individualGoals',
//             label: 'Do you document and track individual team member goals?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.evaluateEmployees',
//             label: 'Do you periodically evaluate SOC employees?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.newHireProcess',
//             label: 'Do you have a new hire process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.screening',
//             label: 'Are all SOC employees subjected to screening?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.satisfaction',
//             label: 'Do you measure employee satisfaction for improving the SOC?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never' },
//               { value: '2', label: 'Sometimes' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Always' },
//             ],
//           },
//           {
//             id: 'people.management.teambuilding',
//             label: 'Do you perform regular teambuilding exercises?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never' },
//               { value: '2', label: 'Sometimes' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Always' },
//             ],
//           },
//           {
//             id: 'people.management.externalTeambuilding',
//             label: 'Do you perform regular teambuilding exercises with other teams relevant to the SOC?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.management.evaluateTeam',
//             label: 'Do you periodically evaluate team performance?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//         ],
//       },
//       {
//         id: 'knowledgeManagement',
//         name: 'Knowledge Management',
//         hasCompletenessIndicator: true,
//         questions: [
//           {
//             id: 'people.knowledge.processInPlace',
//             label: 'Do you have a formal knowledge management process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.knowledge.skillMatrix',
//             label: 'Do you have a skill matrix in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.knowledge.skillMatrixElements',
//             label: 'Please specify elements of the skill matrix:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'allEmployees', label: 'All SOC employees' },
//               { value: 'hardSkills', label: 'Hard skills' },
//               { value: 'softSkills', label: 'Soft skills' },
//               { value: 'skillLevels', label: 'Skill levels (novice, intermediate, expert)' },
//             ],
//           },
//           {
//             id: 'people.knowledge.useOfMatrix',
//             label: 'Is the knowledge matrix actively used to determine training and education needs?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.knowledge.documentedAbilities',
//             label: 'Have you documented SOC team member abilities?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'people.knowledge.reviseProcess',
//             label: 'Do you regularly assess and revise the knowledge management process?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'Never: Documentation is never reviewed' },
//               { value: '2', label: 'Sometimes: Documentation is reviewed ad-hoc, not using a structured approach' },
//               { value: '3', label: 'Averagely: Documentation is reviewed ad-hoc, using a structured approach' },
//               { value: '4', label: 'Mostly: Documentation is regularly and informally reviewed and updated' },
//               { value: '5', label: 'Always: Documentation is regularly and formally reviewed and updated' },
//             ],
//           },
//           {
//             id: 'people.knowledge.tooling',
//             label: 'Is there effective tooling in place to support knowledge documentation and distribution?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   // #################### DOMAIN 3: PROCESS ####################
//   {
//     id: 'process',
//     name: 'Process',
//     subdomains: [
//       {
//         id: 'socManagement',
//         name: 'SOC Management',
//         hasCompletenessIndicator: true,
//         questions: [
//           {
//             id: 'process.socManagement.processInPlace',
//             label: 'Is there a SOC management process in place?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.elementsDocumented',
//             label: 'Are SOC management elements formally identified and documented?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.elements',
//             label: 'Please specify identified SOC management elements:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'internalRelations', label: 'Internal relationship management' },
//               { value: 'externalRelations', label: 'External relationship management' },
//               { value: 'vendorManagement', label: 'Vendor management' },
//               { value: 'csi', label: 'Continuous service improvement' },
//               { value: 'projectMethodology', label: 'Project methodology' },
//               { value: 'processDocumentation', label: 'Process documentation and diagrams' },
//               { value: 'raci', label: 'RACI matrix' },
//               { value: 'serviceCatalogue', label: 'Service Catalogue' },
//               { value: 'serviceOnboarding', label: 'Service on-boarding procedure' },
//               { value: 'serviceOffloading', label: 'Service off-loading procedure' },
//             ],
//           },
//           {
//             id: 'process.socManagement.reviewed',
//             label: 'Is the SOC management process regularly reviewed?',
//             type: QuestionType.SELECT,
//             options: [
//               { value: '1', label: 'Never' },
//               { value: '2', label: 'Sometimes' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Always' },
//             ],
//           },
//           {
//             id: 'process.socManagement.aligned',
//             label: 'Is the SOC management process aligned with all stakeholders?',
//             type: QuestionType.SELECT,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.ciProcess',
//             label: 'Have you implemented a process for continuous improvement (CI)?',
//             type: QuestionType.SELECT,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.ciElements',
//             label: 'Specify elements of the continuous improvement program:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'dailyTracking', label: 'Daily progress tracking' },
//               { value: 'weeklyPlanning', label: 'Weekly planning' },
//               { value: 'backlogManagement', label: 'Backlog management' },
//               { value: 'effortEstimation', label: 'Work item effort estimation' },
//               { value: 'prioritization', label: 'Work item prioritization' },
//               { value: 'refinement', label: 'Refinement' },
//               { value: 'capacityForChange', label: 'Capacity for change' },
//             ],
//           },
//           {
//             id: 'process.socManagement.qaProcess',
//             label: 'Have you implemented a process to manage SOC quality assurance (QA)?',
//             type: QuestionType.SELECT,
//             hasImportance: true,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.qaElements',
//             label: 'Please specify elements of the quality assurance program:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'ticketQa', label: 'Ticket quality assurance' },
//               { value: 'incidentQa', label: 'Incident quality assurance' },
//               { value: 'serviceQa', label: 'Service quality assurance' },
//               { value: 'processQa', label: 'Process quality assurance' },
//               { value: 'reportQa', label: 'Report quality assurance' },
//             ],
//           },
//           {
//             id: 'process.socManagement.architectureProcess',
//             label: 'Have you implemented a SOC architecture process?',
//             type: QuestionType.SELECT,
//             options: [
//               { value: '1', label: 'No' },
//               { value: '2', label: 'Partially' },
//               { value: '3', label: 'Averagely' },
//               { value: '4', label: 'Mostly' },
//               { value: '5', label: 'Fully' },
//             ],
//           },
//           {
//             id: 'process.socManagement.architectureElements',
//             label: 'Please specify elements of the SOC architecture:',
//             type: QuestionType.CHECKBOX_GROUP,
//             options: [
//               { value: 'processArchitecture', label: 'SOC process architecture' },
//               { value: 'technologyArchitecture', label: 'SOC technology architecture' },
//               { value: 'serviceArchitecture', label: 'SOC service architecture' },
//               { value: 'architectureDiagrams', label: 'Architecture diagrams' },
//               { value: 'architecturePrinciples', label: 'Architecture principles' },
//             ],
//           },
//         ],
//       },
//       // {
//       //   id: 'operationsAndFacilities',
//       //   name: 'Operations & Facilities',
//       //   questions: [ /* ... To be extracted ... */ ]
//       // },
//     ],
//   },
// ];