export interface CUCalendarItem {
  id: string
  dateDisplay: string
  dayDisplay: string
  startDate: string
  endDate?: string
  activity: string
  category: 'exam' | 'practical' | 'academic' | 'holiday' | 'result'
  batch: string
  practiceType?: 'MST1' | 'MST2' | 'EST'
}

export const OFFICIAL_CU_CALENDAR_2026: CUCalendarItem[] = [
  {
    id: '1',
    dateDisplay: '01.07.2026 to 13.07.2026',
    dayDisplay: 'Wed - Mon',
    startDate: '2026-07-01',
    endDate: '2026-07-13',
    activity: 'Start of Registration 2nd Year onwards Students [All Programs] for ODD Semester',
    category: 'academic',
    batch: 'Senior Batches'
  },
  {
    id: '2',
    dateDisplay: '14.07.2026',
    dayDisplay: 'Tue',
    startDate: '2026-07-14',
    activity: 'Start of Semester for 2nd Year and 4th Year (All Programs) except MBA 2nd Year',
    category: 'academic',
    batch: '2nd & 4th Year'
  },
  {
    id: '3',
    dateDisplay: '15.07.2026',
    dayDisplay: 'Wed',
    startDate: '2026-07-15',
    activity: 'Start of Semester for 3rd Year and 5th Year (All Programs)',
    category: 'academic',
    batch: '3rd & 5th Year'
  },
  {
    id: '4',
    dateDisplay: '20.07.2026 to 25.07.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-07-20',
    endDate: '2026-07-25',
    activity: 'Orientation & Induction 1st Year [All Programs] Batch I',
    category: 'academic',
    batch: '1st Year Batch I'
  },
  {
    id: '5',
    dateDisplay: '21.07.2026',
    dayDisplay: 'Tue',
    startDate: '2026-07-21',
    activity: 'Start of Semester - 1st Year [All Programs] Batch I',
    category: 'academic',
    batch: '1st Year Batch I'
  },
  {
    id: '6',
    dateDisplay: '24.08.2026 to 29.08.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-08-24',
    endDate: '2026-08-29',
    activity: 'In Semester Test 1 [IST-1 / MST-1] All Years [All Programs] and 1st Year Batch I',
    category: 'exam',
    batch: 'All Years',
    practiceType: 'MST1'
  },
  {
    id: '7',
    dateDisplay: '18.09.2026',
    dayDisplay: 'Fri',
    startDate: '2026-09-18',
    activity: "Fresher's Party - 2026 Intake [All Programs]",
    category: 'academic',
    batch: '1st Year'
  },
  {
    id: '8',
    dateDisplay: '28.09.2026 to 03.10.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-09-28',
    endDate: '2026-10-03',
    activity: 'Practical IST All Years [All Programs]',
    category: 'practical',
    batch: 'All Years'
  },
  {
    id: '9',
    dateDisplay: '05.10.2026 to 09.10.2026',
    dayDisplay: 'Mon - Fri',
    startDate: '2026-10-05',
    endDate: '2026-10-09',
    activity: 'Value Added Courses (VAC) Week',
    category: 'academic',
    batch: 'All Programs'
  },
  {
    id: '10',
    dateDisplay: '12.10.2026 to 17.10.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-10-12',
    endDate: '2026-10-17',
    activity: 'In Semester Test 2 [IST-2 / MST-2] All Years [All Programs]',
    category: 'exam',
    batch: 'All Years',
    practiceType: 'MST2'
  },
  {
    id: '11',
    dateDisplay: '09.11.2026 to 11.11.2026',
    dayDisplay: 'Mon - Wed',
    startDate: '2026-11-09',
    endDate: '2026-11-11',
    activity: 'Diwali Break for Students',
    category: 'holiday',
    batch: 'All Students'
  },
  {
    id: '12',
    dateDisplay: '13.11.2026',
    dayDisplay: 'Fri',
    startDate: '2026-11-13',
    activity: 'Last Teaching Day - All Years [All Programs, Except UID]',
    category: 'academic',
    batch: 'All Years'
  },
  {
    id: '13',
    dateDisplay: '16.11.2026 to 21.11.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-11-16',
    endDate: '2026-11-21',
    activity: 'End Sem. Practical Exam Regular & Reappear - All Years / End-Term Evaluation for Projects',
    category: 'practical',
    batch: 'All Years'
  },
  {
    id: '14',
    dateDisplay: '23.11.2026 to 19.12.2026',
    dayDisplay: 'Mon - Sat',
    startDate: '2026-11-23',
    endDate: '2026-12-19',
    activity: 'End Sem. Theory Exams (EST) - Regular & Reappear - All Years [All Programs Except UID]',
    category: 'exam',
    batch: 'All Years',
    practiceType: 'EST'
  },
  {
    id: '15',
    dateDisplay: '15.12.2026 to 28.12.2026',
    dayDisplay: 'Tue - Mon',
    startDate: '2026-12-15',
    endDate: '2026-12-28',
    activity: 'Winter Term 2026 / Winter Break',
    category: 'academic',
    batch: 'All Programs'
  },
  {
    id: '16',
    dateDisplay: '19.12.2026',
    dayDisplay: 'Sat',
    startDate: '2026-12-19',
    activity: 'End of Semester - All Years [All Programs]',
    category: 'academic',
    batch: 'All Programs'
  },
  {
    id: '17',
    dateDisplay: '21.12.2026 to 03.01.2027',
    dayDisplay: 'Mon - Sun',
    startDate: '2026-12-21',
    endDate: '2027-01-03',
    activity: 'Start of Registration for Even Semester - All Years [All Programs]',
    category: 'academic',
    batch: 'All Years'
  },
  {
    id: '18',
    dateDisplay: '02.01.2027',
    dayDisplay: 'Sat',
    startDate: '2027-01-02',
    activity: 'Announcement of Results (Odd Semester 2026-27)',
    category: 'result',
    batch: 'All Years'
  }
]
