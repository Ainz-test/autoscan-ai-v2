export const SEVERITY_COLOR = { high: '#E63946', medium: '#F59E0B', low: '#2DD4BF' }
export const SEVERITY_BG    = { high: 'rgba(230,57,70,0.08)', medium: 'rgba(245,158,11,0.08)', low: 'rgba(45,212,191,0.08)' }
export const SEVERITY_BD    = { high: 'rgba(230,57,70,0.25)',  medium: 'rgba(245,158,11,0.25)', low: 'rgba(45,212,191,0.25)' }

export const ZONE_LABELS = {
  engine_bay:        { en: 'Engine Bay',         ar: 'حجرة المحرك' },
  front_left_wheel:  { en: 'Front Left Wheel',   ar: 'الإطار الأمامي الأيسر' },
  front_right_wheel: { en: 'Front Right Wheel',  ar: 'الإطار الأمامي الأيمن' },
  rear_left_wheel:   { en: 'Rear Left Wheel',    ar: 'الإطار الخلفي الأيسر' },
  rear_right_wheel:  { en: 'Rear Right Wheel',   ar: 'الإطار الخلفي الأيمن' },
  underbody_front:   { en: 'Underbody Front',    ar: 'قاع المقدمة' },
  underbody_rear:    { en: 'Underbody Rear',      ar: 'قاع المؤخرة' },
  cabin_dashboard:   { en: 'Cabin / Dashboard',  ar: 'المقصورة / لوحة القيادة' },
  battery_electrical:{ en: 'Battery / Electrical', ar: 'البطارية / الكهرباء' },
  fuel_system:       { en: 'Fuel System',        ar: 'نظام الوقود' },
}

export const MAKES = ['Toyota','Lexus','Honda','Nissan','Hyundai','Kia','Ford','BMW','Mercedes-Benz','Audi','Volkswagen','Chevrolet','GMC','Jeep','Land Rover','Mitsubishi','Mazda','Subaru','Infiniti','Other']

export const MODELS_MAP = {
  Toyota:  ['Land Cruiser','Camry','Corolla','RAV4','Hilux','Prado','Yaris','Fortuner','Rush','Avalon'],
  Lexus:   ['LX 570','GX 460','RX 350','ES 350','LS 500','IS 300','UX 200','NX 300'],
  Honda:   ['Accord','Civic','CR-V','Pilot','Odyssey','HR-V','Ridgeline'],
  Nissan:  ['Patrol','Altima','Sentra','X-Trail','Maxima','Sunny','Armada','Navara'],
  Hyundai: ['Sonata','Elantra','Tucson','Santa Fe','Accent','Kona','Palisade'],
  Kia:     ['Sportage','Sorento','Optima','Rio','Stinger','Telluride','Carnival'],
  Ford:    ['F-150','Mustang','Explorer','Expedition','Edge','Escape','Ranger'],
  BMW:     ['3 Series','5 Series','7 Series','X3','X5','X7','M3','M5'],
  'Mercedes-Benz': ['C-Class','E-Class','S-Class','GLE','GLS','G-Class','AMG GT'],
  Audi:    ['A4','A6','A8','Q5','Q7','Q8','RS6','e-tron'],
  default: ['Select Model'],
}

export const AVATARS = [
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Nora&backgroundColor=c0aede',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Milo&backgroundColor=ffd5dc',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Zara&backgroundColor=d1d4f9',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Rex&backgroundColor=b6e3f4',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Aria&backgroundColor=ffdfbf',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Kai&backgroundColor=c0aede',
  'https://api.dicebear.com/8.x/avataaars/svg?seed=Nova&backgroundColor=ffd5dc',
]

export const FEATURES = [
  { icon: '🔍', en: 'AI Diagnostics',     ar: 'تشخيص ذكي',        sub: 'Claude AI reads every fault from your inspection sheet',   subAr: 'يقرأ الذكاء الاصطناعي كل عطل من ورقة الفحص' },
  { icon: '📷', en: 'Camera Scan',        ar: 'مسح بالكاميرا',     sub: 'Capture inspection sheets instantly with your camera',    subAr: 'التقط أوراق الفحص فوراً بكاميرتك' },
  { icon: '🗺️', en: 'Vehicle Schematic', ar: 'مخطط السيارة',      sub: 'Faults mapped to real zones on an interactive diagram',   subAr: 'الأعطال موضحة على مخطط تفاعلي' },
  { icon: '⚡', en: 'Instant Results',    ar: 'نتائج فورية',       sub: 'Full report in seconds — not hours',                     subAr: 'تقرير كامل في ثوانٍ وليس ساعات' },
  { icon: '💰', en: 'Repair Costs',       ar: 'تكاليف الإصلاح',    sub: 'Estimated cost range for every identified fault',         subAr: 'نطاق التكلفة المقدرة لكل عطل' },
  { icon: '🌐', en: 'Arabic & English',   ar: 'عربي وإنجليزي',     sub: 'Full bilingual support across the entire app',           subAr: 'دعم ثنائي اللغة في التطبيق بالكامل' },
]

export function buildDiagnosisPrompt(make, model, year) {
  return "CRITICAL TASK: You are an expert automotive diagnostic engineer. Analyze this vehicle inspection sheet image COMPLETELY."
    + " Read and extract EVERY SINGLE fault, issue, check mark, X mark, circled item, handwritten note, and any indication of a problem."
    + " DO NOT skip any fault. DO NOT summarize multiple faults into one. List EACH fault as a SEPARATE item."
    + " Your response must be ONLY a raw JSON array starting with [ and ending with ]."
    + " No markdown, no code blocks, no explanation, no text before or after the JSON array."
    + ` Vehicle: ${make} ${model} ${year}.`
    + " Each fault object MUST have ALL these fields:"
    + " id (string, e.g. F001),"
    + " severity (MUST be exactly: high OR medium OR low),"
    + " zone (MUST be exactly one of: engine_bay, front_left_wheel, front_right_wheel, rear_left_wheel, rear_right_wheel, underbody_front, underbody_rear, cabin_dashboard, battery_electrical, fuel_system),"
    + " code (OBD2 DTC code string if present, otherwise null),"
    + " nameEn (English: component name + fault description, be specific and complete),"
    + " nameAr (Arabic: TRANSLATE nameEn to Arabic completely),"
    + " fn (English: one sentence explaining what this component does),"
    + " fnAr (Arabic: TRANSLATE fn to Arabic),"
    + " immediate (English: immediate risk if not repaired now),"
    + " immediateAr (Arabic: TRANSLATE immediate to Arabic),"
    + " longterm (English: long-term consequences and cost if ignored),"
    + " longtermAr (Arabic: TRANSLATE longterm to Arabic),"
    + " steps (array of English repair step strings, 3-5 steps),"
    + " stepsAr (array of Arabic repair step strings, TRANSLATE steps to Arabic),"
    + " cost (repair cost range, e.g. $150-$400)."
    + " Severity rules: high=safety critical do not drive, medium=repair within 2-4 weeks, low=cosmetic or minor."
    + " If no faults found or this is not an inspection sheet, return exactly: []"
    + " IMPORTANT: Return ALL faults. Do not skip any. Start response with [ end with ] ONLY."
}
