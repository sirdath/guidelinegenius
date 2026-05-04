// Hand-crafted demo question bank. Each question links to a real article
// in our library — answering the question opens that article side-by-side
// in the review pane (Amboss-style learning loop).

export type AnswerOption = {
  id: "A" | "B" | "C" | "D" | "E";
  text: string;
  correct: boolean;
  // Per-option explanation: why this is right or wrong, briefly.
  rationale: string;
};

export type Question = {
  id: string;
  // Short stem so the demo is readable; real Qbank stems are longer.
  stem: string;
  vignette?: string; // Clinical case context shown above the stem
  options: AnswerOption[];
  // Slug of the related article from articles.json — opens in the right pane
  // after the user submits.
  articleSlug: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  // Anchor headline from the linked article so the right pane shows the
  // most relevant section first.
  articleAnchor?: string;
};

export const DEMO_QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "Cardiovascular",
    difficulty: "easy",
    vignette:
      "A 72-year-old man attends his GP for a routine check. On examination, he is found to have a pulsatile abdominal mass. He is asymptomatic and haemodynamically stable.",
    stem: "What is the most appropriate first-line investigation?",
    options: [
      {
        id: "A",
        text: "CT angiography",
        correct: false,
        rationale:
          "CT angiography is reserved for symptomatic patients, surgical planning, or to assess complications. It is not the first-line in a stable, asymptomatic patient.",
      },
      {
        id: "B",
        text: "Abdominal ultrasound",
        correct: true,
        rationale:
          "Abdominal ultrasound is the screening and first-line investigation for AAA. It is non-invasive, sensitive, and the basis of the NHS AAA Screening Programme.",
      },
      {
        id: "C",
        text: "MRI abdomen",
        correct: false,
        rationale:
          "MRI is rarely used as a first-line investigation for AAA — it is slower, more expensive, and offers no advantage over ultrasound for screening.",
      },
      {
        id: "D",
        text: "Plain abdominal X-ray",
        correct: false,
        rationale:
          "AXR may show calcification of the aortic wall but cannot reliably measure the aneurysm diameter — it is not a screening tool.",
      },
      {
        id: "E",
        text: "Refer immediately for surgical repair",
        correct: false,
        rationale:
          "Surgical referral depends on aneurysm size and rate of growth, both of which require imaging confirmation first.",
      },
    ],
    articleSlug: "abdominal-aortic-aneurysm-aaa",
    articleAnchor: "Investigations",
  },
  {
    id: "q2",
    category: "Endocrine and Metabolic",
    difficulty: "easy",
    vignette:
      "A 54-year-old woman with a 5-year history of poorly controlled type 2 diabetes (HbA1c 73 mmol/mol) presents to her GP. She has no contraindications.",
    stem: "What is the recommended first-line pharmacological treatment?",
    options: [
      {
        id: "A",
        text: "Sulfonylurea (gliclazide)",
        correct: false,
        rationale:
          "Sulfonylureas are typically added as a second-line agent if monotherapy fails or metformin is contraindicated.",
      },
      {
        id: "B",
        text: "SGLT2 inhibitor (empagliflozin)",
        correct: false,
        rationale:
          "SGLT2 inhibitors are first-line in patients with established CV disease, heart failure, or CKD, but not in this otherwise uncomplicated patient.",
      },
      {
        id: "C",
        text: "Metformin",
        correct: true,
        rationale:
          "Metformin is the recommended first-line therapy per NICE NG28 in the absence of contraindications. It is weight-neutral, has CV benefits, and is inexpensive.",
      },
      {
        id: "D",
        text: "Insulin",
        correct: false,
        rationale:
          "Insulin is reserved for advanced disease or when oral agents fail to achieve glycaemic targets.",
      },
      {
        id: "E",
        text: "DPP-4 inhibitor (sitagliptin)",
        correct: false,
        rationale:
          "DPP-4 inhibitors are second- or third-line — typically added when metformin alone is insufficient.",
      },
    ],
    articleSlug: "type-2-diabetes-t2dm",
    articleAnchor: "Management",
  },
  {
    id: "q3",
    category: "Respiratory",
    difficulty: "medium",
    vignette:
      "A 19-year-old tall, thin male presents with sudden-onset right-sided pleuritic chest pain. He is haemodynamically stable. CXR shows a 3cm rim of air on the right side.",
    stem: "What is the most appropriate immediate management?",
    options: [
      {
        id: "A",
        text: "Conservative management with discharge and outpatient follow-up",
        correct: false,
        rationale:
          "BTS guidelines now favour conservative management for primary spontaneous pneumothorax in select cases, but with a 3cm rim ≥2cm and patient symptomatic, intervention is preferred. Conservative is for asymptomatic minimal pneumothorax.",
      },
      {
        id: "B",
        text: "Needle aspiration",
        correct: true,
        rationale:
          "Per BTS, primary spontaneous pneumothorax >2cm or symptomatic should have needle aspiration as first intervention. Chest drain is reserved if aspiration fails.",
      },
      {
        id: "C",
        text: "Immediate chest drain insertion",
        correct: false,
        rationale:
          "Chest drain is reserved if needle aspiration fails or in secondary pneumothorax/tension. Step-up from aspiration is preferred for primary cases.",
      },
      {
        id: "D",
        text: "Urgent surgical referral for pleurodesis",
        correct: false,
        rationale:
          "Surgical pleurodesis is for recurrent or persistent pneumothorax, not first presentation.",
      },
      {
        id: "E",
        text: "High-flow oxygen alone",
        correct: false,
        rationale:
          "Oxygen reduces partial pressure of nitrogen and accelerates resolution but is adjunct, not the primary intervention for a symptomatic ≥2cm pneumothorax.",
      },
    ],
    articleSlug: "pneumothorax",
    articleAnchor: "Management",
  },
  {
    id: "q4",
    category: "Acute and Emergency",
    difficulty: "medium",
    vignette:
      "A 68-year-old man with COPD presents with worsening shortness of breath and productive cough for 3 days. His CRB-65 score is 2.",
    stem: "Which combination of features contributes to the CRB-65 score?",
    options: [
      {
        id: "A",
        text: "Confusion · Respiratory rate ≥30 · Blood pressure (systolic <90 or diastolic ≤60) · Age ≥65",
        correct: true,
        rationale:
          "CRB-65 stands for Confusion, Respiratory rate ≥30, BP <90 systolic or ≤60 diastolic, age ≥65. Each scores 1 point. CRB-65 ≥2 indicates intermediate to high mortality risk and hospital admission should be considered.",
      },
      {
        id: "B",
        text: "Confusion · Urea >7 · Respiratory rate ≥30 · Age ≥65",
        correct: false,
        rationale:
          "That's CURB-65 (with urea), not CRB-65. CURB-65 is the hospital-based score; CRB-65 is the community/GP score that omits urea.",
      },
      {
        id: "C",
        text: "Cyanosis · Respiratory rate ≥30 · BP <90 · Age ≥65",
        correct: false,
        rationale:
          "Cyanosis isn't part of CRB-65. The first letter stands for Confusion.",
      },
      {
        id: "D",
        text: "Comorbidities · Respiratory rate ≥30 · BP <90 · Age ≥65",
        correct: false,
        rationale:
          "Comorbidities aren't a scoring item in CRB-65. The C is for Confusion.",
      },
      {
        id: "E",
        text: "Confusion · Respiratory rate ≥20 · BP <100 · Age ≥60",
        correct: false,
        rationale:
          "The thresholds are wrong: respiratory rate ≥30, BP <90 systolic or ≤60 diastolic, and age ≥65.",
      },
    ],
    articleSlug: "pneumonia",
    articleAnchor: "Severity Assessment",
  },
  {
    id: "q5",
    category: "Cardiovascular",
    difficulty: "easy",
    vignette:
      "A 72-year-old woman is diagnosed with chronic heart failure with reduced ejection fraction (HFrEF). She has no contraindications.",
    stem: "Which of the following is the recommended first-line drug class?",
    options: [
      {
        id: "A",
        text: "Calcium channel blockers (e.g. amlodipine)",
        correct: false,
        rationale:
          "Non-dihydropyridine CCBs (verapamil, diltiazem) are contraindicated in HFrEF. Amlodipine is neutral but not disease-modifying.",
      },
      {
        id: "B",
        text: "Loop diuretics (e.g. furosemide)",
        correct: false,
        rationale:
          "Loop diuretics relieve symptoms but do not improve mortality. They are used alongside disease-modifying therapy.",
      },
      {
        id: "C",
        text: "ACE inhibitor + beta blocker",
        correct: true,
        rationale:
          "Per NICE NG106, the first-line therapy for HFrEF is an ACE inhibitor (or ARB if intolerant) PLUS a beta blocker licensed for HF. These are the foundation of disease-modifying therapy.",
      },
      {
        id: "D",
        text: "Digoxin",
        correct: false,
        rationale:
          "Digoxin is reserved for symptomatic patients still in sinus rhythm despite optimal therapy, or for rate control in concomitant AF.",
      },
      {
        id: "E",
        text: "Ivabradine",
        correct: false,
        rationale:
          "Ivabradine is added if heart rate remains ≥75 bpm despite maximally tolerated beta blocker — it's a later-line agent.",
      },
    ],
    articleSlug: "chronic-heart-failure",
    articleAnchor: "Management",
  },
  {
    id: "q6",
    category: "Cancer",
    difficulty: "easy",
    vignette:
      "A 58-year-old smoker presents with painless visible haematuria. Imaging reveals a 4cm right renal mass.",
    stem: "What is the most likely histological type?",
    options: [
      {
        id: "A",
        text: "Transitional cell carcinoma",
        correct: false,
        rationale:
          "TCC arises from the urothelium of the renal pelvis, ureter, or bladder — not from the renal parenchyma.",
      },
      {
        id: "B",
        text: "Clear cell renal cell carcinoma",
        correct: true,
        rationale:
          "Clear cell RCC accounts for ~75% of renal cell carcinomas and is the most common renal malignancy in adults.",
      },
      {
        id: "C",
        text: "Papillary renal cell carcinoma",
        correct: false,
        rationale:
          "Papillary RCC is the second most common subtype (10-15%) but less common than clear cell.",
      },
      {
        id: "D",
        text: "Wilms tumour",
        correct: false,
        rationale:
          "Wilms tumour (nephroblastoma) is the most common renal tumour in children, very rare in adults.",
      },
      {
        id: "E",
        text: "Renal angiomyolipoma",
        correct: false,
        rationale:
          "Angiomyolipoma is a benign mass typically associated with tuberous sclerosis. It is uncommon and usually asymptomatic.",
      },
    ],
    articleSlug: "renal-cancer",
    articleAnchor: "Pathology",
  },
  {
    id: "q7",
    category: "Obstetric and Gynaecology",
    difficulty: "medium",
    vignette:
      "A 32-year-old woman and her partner have been trying to conceive for 12 months without success. She has regular menstrual cycles. He is otherwise well.",
    stem: "Which of the following is the most appropriate initial investigation in primary care?",
    options: [
      {
        id: "A",
        text: "Refer to fertility specialist immediately",
        correct: false,
        rationale:
          "Specialist referral is appropriate after baseline investigations, or if there are red-flag features. NICE recommends initial investigations in primary care first.",
      },
      {
        id: "B",
        text: "Mid-luteal progesterone (day 21) and semen analysis",
        correct: true,
        rationale:
          "Per NICE, the basic baseline workup for couples with infertility (12+ months trying, regular cycles) is mid-luteal progesterone (to confirm ovulation) for the woman PLUS semen analysis for the man.",
      },
      {
        id: "C",
        text: "Pelvic MRI",
        correct: false,
        rationale:
          "Pelvic MRI is not part of the initial workup. Pelvic ultrasound may be done in selected cases.",
      },
      {
        id: "D",
        text: "Hysteroscopy",
        correct: false,
        rationale:
          "Hysteroscopy is reserved for women with suspected uterine cavity pathology after initial investigations.",
      },
      {
        id: "E",
        text: "Anti-mullerian hormone (AMH) only",
        correct: false,
        rationale:
          "AMH may be used to assess ovarian reserve in selected cases but is not the primary first-line test in basic infertility workup.",
      },
    ],
    articleSlug: "infertility-subfertility",
    articleAnchor: "Investigations",
  },
  {
    id: "q8",
    category: "Acute and Emergency",
    difficulty: "hard",
    vignette:
      "A 65-year-old man presents to the emergency department with a regular tachycardia of 180 bpm. He is haemodynamically stable but has severe chest pain.",
    stem: "According to Resus Council UK guidelines, the presence of severe chest pain in this scenario classifies him as having which adverse feature?",
    options: [
      {
        id: "A",
        text: "Shock",
        correct: false,
        rationale:
          "Shock is defined by hypotension (systolic BP <90), pallor, sweating, or impaired conscious level — not chest pain alone.",
      },
      {
        id: "B",
        text: "Syncope",
        correct: false,
        rationale:
          "Syncope refers to transient loss of consciousness. Chest pain is a separate adverse feature.",
      },
      {
        id: "C",
        text: "Heart failure",
        correct: false,
        rationale:
          "Heart failure as an adverse feature implies pulmonary oedema or raised JVP — not isolated chest pain.",
      },
      {
        id: "D",
        text: "Myocardial ischaemia",
        correct: true,
        rationale:
          "Myocardial ischaemia is the adverse feature represented by chest pain (typical of ischaemia) or ECG evidence of ischaemia. Presence of any adverse feature mandates synchronised cardioversion in a tachyarrhythmia.",
      },
      {
        id: "E",
        text: "None — patient is stable",
        correct: false,
        rationale:
          "Severe chest pain in a tachyarrhythmia is an adverse feature representing myocardial ischaemia, even if BP is preserved.",
      },
    ],
    articleSlug: "peri-arrest-tachycardia",
    articleAnchor: "Management",
  },
];

export function getQuestionById(id: string): Question | undefined {
  return DEMO_QUESTIONS.find((q) => q.id === id);
}
