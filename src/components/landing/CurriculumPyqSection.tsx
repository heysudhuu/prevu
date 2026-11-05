'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  CheckCircle2,
  Eye,
  ArrowRight,
  Filter,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search
} from 'lucide-react'

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

export interface SemesterPyqItem {
  id: string
  code: string
  name: string
  examType: 'EST' | 'MST-1' | 'MST-2' | 'EST Remedial'
  year: number
  solved: boolean
  upvotes: number
  questionsCount: string
  verifiedBy: string
  downloadUrl?: string
  demoResource: {
    id: string
    exam_year: number
    original_filename: string
    file_type: string
    subjects: { name: string; code: string; semester: number }
    exam_types: { name: string }
    users: { name: string; username: string; cu_verified: boolean; role: string }
  }
}

// Complete PYQ Repository for All 8 Semesters
export const ALL_SEMESTER_PYQS: Record<number, SemesterPyqItem[]> = {
  1: [
    {
      id: 'pyq-1-1',
      code: '22MAT-101',
      name: 'Engineering Mathematics - I',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 84,
      questionsCount: 'Section A (10 Qs) + Section B & C (Solved)',
      verifiedBy: 'Senior Academic Topper (9.7 CGPA)',
      demoResource: {
        id: 'math1-est-2024',
        exam_year: 2024,
        original_filename: 'Engg_Maths_I_22MAT101_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - I', code: '22MAT-101', semester: 1 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-1-2',
      code: '22PHY-101',
      name: 'Engineering Physics',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 62,
      questionsCount: 'Full Derivations on Lasers & Fiber Optics',
      verifiedBy: 'Senior Physics Lead',
      demoResource: {
        id: 'phy-est-2024',
        exam_year: 2024,
        original_filename: 'Physics_22PHY101_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Physics', code: '22PHY-101', semester: 1 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Physics Cell', username: 'prevu_phy', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-1-3',
      code: '22CS101',
      name: 'Programming for Problem Solving (C)',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 71,
      questionsCount: 'Pointers, Arrays & Recursion Programs',
      verifiedBy: 'CSE Coding Mentor',
      demoResource: {
        id: 'c-mst-2024',
        exam_year: 2024,
        original_filename: 'C_Programming_22CS101_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Programming for Problem Solving', code: '22CS101', semester: 1 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Code Lab', username: 'prevu_cse', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-1-4',
      code: '22EE101',
      name: 'Basic Electrical & Electronics',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 49,
      questionsCount: 'Thevenin, Norton & AC Circuits Numericals',
      verifiedBy: 'EE Dept Senior',
      demoResource: {
        id: 'ee-mst2-2023',
        exam_year: 2023,
        original_filename: 'Electrical_Engg_22EE101_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Basic Electrical & Electronics', code: '22EE101', semester: 1 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu EE Lead', username: 'prevu_ee', cu_verified: true, role: 'admin' }
      }
    }
  ],
  2: [
    {
      id: 'pyq-2-1',
      code: '22MAT-102',
      name: 'Engineering Mathematics - II',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 92,
      questionsCount: 'Laplace, Fourier & Partial Differential Equations',
      verifiedBy: 'Senior Math Faculty Review',
      demoResource: {
        id: 'math2-est-2024',
        exam_year: 2024,
        original_filename: 'Engg_Maths_II_22MAT102_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - II', code: '22MAT-102', semester: 2 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-2-2',
      code: '22CSH-102',
      name: 'OOP with C++',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 68,
      questionsCount: 'Virtual Functions, Polymorphism & STL',
      verifiedBy: 'CSE Academic Team',
      demoResource: {
        id: 'cpp-est-2024',
        exam_year: 2024,
        original_filename: 'OOP_Cpp_22CSH102_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'OOP with C++', code: '22CSH-102', semester: 2 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Code Lab', username: 'prevu_cpp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-2-3',
      code: '22CHY-101',
      name: 'Engineering Chemistry',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 53,
      questionsCount: 'Spectroscopy, Water Treatment & Polymers',
      verifiedBy: 'Chemistry Senior Scholar',
      demoResource: {
        id: 'chem-mst1-2024',
        exam_year: 2024,
        original_filename: 'Chemistry_22CHY101_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Chemistry', code: '22CHY-101', semester: 2 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Sciences', username: 'prevu_chem', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-2-4',
      code: '22ME101',
      name: 'Engineering Graphics & Design',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 41,
      questionsCount: 'Orthographic Projections & Isometric Scales',
      verifiedBy: 'Design Mentor',
      demoResource: {
        id: 'cad-mst2-2023',
        exam_year: 2023,
        original_filename: 'Graphics_22ME101_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Graphics & Design', code: '22ME101', semester: 2 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu CAD Lead', username: 'prevu_cad', cu_verified: true, role: 'admin' }
      }
    }
  ],
  3: [
    {
      id: 'pyq-3-1',
      code: '22CS201',
      name: 'Data Structures & Algorithms',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 114,
      questionsCount: 'AVL Trees, Graph Traversals, Heap Sort (Full Key)',
      verifiedBy: 'Senior DSA Specialist',
      demoResource: {
        id: 'dsa-est-2024',
        exam_year: 2024,
        original_filename: 'DSA_22CS201_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Data Structures & Algorithms', code: '22CS201', semester: 3 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Code Lab', username: 'prevu_dsa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-3-2',
      code: '22CSH-201',
      name: 'Java OOPs & Design Patterns',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 88,
      questionsCount: 'Multithreading, Collections Framework & JDBC',
      verifiedBy: 'Java Mentor',
      demoResource: {
        id: 'java-est-2024',
        exam_year: 2024,
        original_filename: 'Java_OOP_22CSH201_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Java OOPs & Design Patterns', code: '22CSH-201', semester: 3 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Java Lead', username: 'prevu_java', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-3-3',
      code: '22MAT-201',
      name: 'Discrete Mathematics',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 65,
      questionsCount: 'Propositional Logic, Graph Theory & Relations',
      verifiedBy: 'Discrete Math Lead',
      demoResource: {
        id: 'dm-mst1-2024',
        exam_year: 2024,
        original_filename: 'Discrete_Math_22MAT201_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Discrete Mathematics', code: '22MAT-201', semester: 3 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Math Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-3-4',
      code: '22EC201',
      name: 'Digital Electronics & Logic',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 56,
      questionsCount: 'K-Maps, Multiplexers & Flip Flop Conversion',
      verifiedBy: 'ECE Dept Senior',
      demoResource: {
        id: 'de-mst2-2023',
        exam_year: 2023,
        original_filename: 'Digital_Electronics_22EC201_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Digital Electronics', code: '22EC201', semester: 3 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu ECE Lead', username: 'prevu_ece', cu_verified: true, role: 'admin' }
      }
    }
  ],
  4: [
    {
      id: 'pyq-4-1',
      code: '23CSH-242',
      name: 'Operating Systems',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 128,
      questionsCount: 'CPU Scheduling, Banker Algorithm, Paging & Inodes',
      verifiedBy: 'Operating Systems Lead',
      demoResource: {
        id: 'os-est-2024',
        exam_year: 2024,
        original_filename: 'Operating_Systems_23CSH242_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Operating Systems', code: '23CSH-242', semester: 4 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Systems Lab', username: 'prevu_os', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-4-2',
      code: '23CSH-243',
      name: 'Database Management Systems',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 104,
      questionsCount: 'Normalization (BCNF/3NF), ACID, Serializability',
      verifiedBy: 'DBMS Senior Specialist',
      demoResource: {
        id: 'dbms-est-2024',
        exam_year: 2024,
        original_filename: 'DBMS_23CSH243_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Database Management Systems', code: '23CSH-243', semester: 4 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Data Team', username: 'prevu_dbms', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-4-3',
      code: '23CSH-244',
      name: 'Computer Organization & Architecture',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 77,
      questionsCount: 'Booth Algorithm, Pipelining Hazard & Cache Mapping',
      verifiedBy: 'COA Academic Mentor',
      demoResource: {
        id: 'coa-mst1-2024',
        exam_year: 2024,
        original_filename: 'COA_23CSH244_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Organization', code: '23CSH-244', semester: 4 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Hardware Cell', username: 'prevu_coa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-4-4',
      code: '23CST-247',
      name: 'Agile Software Engineering',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 61,
      questionsCount: 'Scrum Sprints, CI/CD Pipelines, Testing Models',
      verifiedBy: 'Software Dev Mentor',
      demoResource: {
        id: 'agile-mst2-2023',
        exam_year: 2023,
        original_filename: 'Agile_Dev_23CST247_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Agile Software Engineering', code: '23CST-247', semester: 4 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu DevOps Team', username: 'prevu_agile', cu_verified: true, role: 'admin' }
      }
    }
  ],
  5: [
    {
      id: 'pyq-5-1',
      code: '21CSH-311',
      name: 'Design & Analysis of Algorithms',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 119,
      questionsCount: 'Dynamic Programming, Greedy, NP-Complete Proofs',
      verifiedBy: 'Senior Algorithmist (9.8 CGPA)',
      demoResource: {
        id: 'daa-est-2024',
        exam_year: 2024,
        original_filename: 'DAA_21CSH311_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Design and Analysis of Algorithms', code: '21CSH-311', semester: 5 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Algorithms Cell', username: 'prevu_daa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-5-2',
      code: '23CSH-312',
      name: 'Computer Networks',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 97,
      questionsCount: 'Subnetting VLSM, TCP Congestion & Distance Vector',
      verifiedBy: 'Networks Lead',
      demoResource: {
        id: 'cn-est-2024',
        exam_year: 2024,
        original_filename: 'Computer_Networks_23CSH312_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Networks', code: '23CSH-312', semester: 5 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Networks Team', username: 'prevu_cn', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-5-3',
      code: '23CSH-313',
      name: 'Web Technologies & Full Stack',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 74,
      questionsCount: 'React Hooks, Node.js Async/Await, REST APIs',
      verifiedBy: 'Full-Stack Lead',
      demoResource: {
        id: 'web-mst1-2024',
        exam_year: 2024,
        original_filename: 'Web_Tech_23CSH313_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Web Technologies', code: '23CSH-313', semester: 5 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Web Lab', username: 'prevu_web', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-5-4',
      code: '23CST-314',
      name: 'Theory of Computation (TOC)',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 82,
      questionsCount: 'NFA to DFA Subset Construction & Pumping Lemma',
      verifiedBy: 'Automata Mentor',
      demoResource: {
        id: 'toc-mst2-2023',
        exam_year: 2023,
        original_filename: 'TOC_23CST314_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Theory of Computation', code: '23CST-314', semester: 5 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_toc', cu_verified: true, role: 'admin' }
      }
    }
  ],
  6: [
    {
      id: 'pyq-6-1',
      code: '22CST-390',
      name: 'Automata Theory & Computability',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 108,
      questionsCount: 'PDA to CFG Conversion, Turing Machine & Rice Theorem',
      verifiedBy: 'Automata Dept Senior',
      demoResource: {
        id: 'automata-est-2024',
        exam_year: 2024,
        original_filename: 'Automata_22CST390_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Automata Theory', code: '22CST-390', semester: 6 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_automata', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-6-2',
      code: '23CST-304',
      name: 'Compiler Design',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 89,
      questionsCount: 'LL(1) Parsing Table, SLR/LR(1) Items & 3AC Code Gen',
      verifiedBy: 'Compiler Engineering Specialist',
      demoResource: {
        id: 'compiler-est-2024',
        exam_year: 2024,
        original_filename: 'Compiler_Design_23CST304_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Compiler Design', code: '23CST-304', semester: 6 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Compilers Lead', username: 'prevu_compiler', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-6-3',
      code: '23CST-305',
      name: 'Cloud Computing Architecture',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 67,
      questionsCount: 'IaaS/PaaS Models, Virtualization & AWS Architecture',
      verifiedBy: 'Cloud DevOps Scholar',
      demoResource: {
        id: 'cloud-mst1-2024',
        exam_year: 2024,
        original_filename: 'Cloud_Computing_23CST305_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cloud Computing', code: '23CST-305', semester: 6 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Cloud Cell', username: 'prevu_cloud', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-6-4',
      code: '23CSH-306',
      name: 'Artificial Intelligence & ML',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 94,
      questionsCount: 'A* Search, Minimax Alpha-Beta, Decision Trees',
      verifiedBy: 'AI Lab Senior',
      demoResource: {
        id: 'aiml-mst2-2023',
        exam_year: 2023,
        original_filename: 'AIML_23CSH306_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Artificial Intelligence', code: '23CSH-306', semester: 6 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu AI Team', username: 'prevu_ai', cu_verified: true, role: 'admin' }
      }
    }
  ],
  7: [
    {
      id: 'pyq-7-1',
      code: '22CST-354',
      name: 'Parallel & Distributed Computing',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 85,
      questionsCount: 'MPI Broadcasts, OpenMP Threads, Lamport Clocks',
      verifiedBy: 'Distributed Systems Senior',
      demoResource: {
        id: 'pdc-est-2024',
        exam_year: 2024,
        original_filename: 'PDC_22CST354_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Parallel & Distributed Computing', code: '22CST-354', semester: 7 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Distributed Cell', username: 'prevu_dist', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-7-2',
      code: '23CST-401',
      name: 'Deep Learning & Neural Networks',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 102,
      questionsCount: 'CNN Convolutions, Backpropagation & LSTM Architecture',
      verifiedBy: 'DL Senior Researcher',
      demoResource: {
        id: 'dl-est-2024',
        exam_year: 2024,
        original_filename: 'Deep_Learning_23CST401_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Deep Learning', code: '23CST-401', semester: 7 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu DL Lab', username: 'prevu_dl', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-7-3',
      code: 'FSO-307',
      name: 'Cyber Security Essentials',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 59,
      questionsCount: 'AES, RSA Cryptography & Firewalls / IDS',
      verifiedBy: 'Cybersec Team Lead',
      demoResource: {
        id: 'cyber-mst1-2024',
        exam_year: 2024,
        original_filename: 'Cybersec_FSO307_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Security Essentials', code: 'FSO-307', semester: 7 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Security Cell', username: 'prevu_cyber', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-7-4',
      code: '23CST-403',
      name: 'Distributed Systems',
      examType: 'MST-2',
      year: 2023,
      solved: true,
      upvotes: 66,
      questionsCount: 'Raft Consensus, Vector Clocks, Chord DHT',
      verifiedBy: 'Senior Cloud Architect',
      demoResource: {
        id: 'ds-mst2-2023',
        exam_year: 2023,
        original_filename: 'Distributed_Systems_23CST403_MST2_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Distributed Systems', code: '23CST-403', semester: 7 },
        exam_types: { name: 'MST-2' },
        users: { name: 'Prevu Systems Lab', username: 'prevu_ds', cu_verified: true, role: 'admin' }
      }
    }
  ],
  8: [
    {
      id: 'pyq-8-1',
      code: '23CST-405',
      name: 'Cyber Forensics & Incident Response',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 78,
      questionsCount: 'Volatility Memory Dumps, EnCase, Disk Imaging',
      verifiedBy: 'Forensics Specialist',
      demoResource: {
        id: 'forensics-est-2024',
        exam_year: 2024,
        original_filename: 'Cyber_Forensics_23CST405_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Forensics', code: '23CST-405', semester: 8 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Forensics Lab', username: 'prevu_forensics', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-8-2',
      code: '23CST-406',
      name: 'Natural Language Processing',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 93,
      questionsCount: 'Transformers, BERT Attention Weights & Tokenization',
      verifiedBy: 'NLP Senior Scholar',
      demoResource: {
        id: 'nlp-est-2024',
        exam_year: 2024,
        original_filename: 'NLP_23CST406_EST_2024_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Natural Language Processing', code: '23CST-406', semester: 8 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu NLP Lab', username: 'prevu_nlp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-8-3',
      code: '23CST-407',
      name: 'Blockchain Technologies',
      examType: 'MST-1',
      year: 2024,
      solved: true,
      upvotes: 81,
      questionsCount: 'Solidity Smart Contracts, Proof of Work, Merkle Trees',
      verifiedBy: 'Blockchain Mentor',
      demoResource: {
        id: 'blockchain-mst1-2024',
        exam_year: 2024,
        original_filename: 'Blockchain_23CST407_MST1_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Blockchain Technologies', code: '23CST-407', semester: 8 },
        exam_types: { name: 'MST-1' },
        users: { name: 'Prevu Web3 Cell', username: 'prevu_crypto', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'pyq-8-4',
      code: '23CAP-408',
      name: 'Major Capstone Project Defense',
      examType: 'EST',
      year: 2024,
      solved: true,
      upvotes: 112,
      questionsCount: 'Defense Rubrics, Architecture Diagrams & Viva Questions',
      verifiedBy: 'Academic Capstone Jury',
      demoResource: {
        id: 'capstone-est-2024',
        exam_year: 2024,
        original_filename: 'Capstone_Defense_Viva_Guide_2024.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Major Capstone Project', code: '23CAP-408', semester: 8 },
        exam_types: { name: 'EST' },
        users: { name: 'Prevu Capstone Team', username: 'prevu_capstone', cu_verified: true, role: 'admin' }
      }
    }
  ]
}

export default function CurriculumPyqSection() {
  const [selectedSem, setSelectedSem] = useState<number>(3)
  const [examTypeFilter, setExamTypeFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [previewResource, setPreviewResource] = useState<any | null>(null)

  const semesterPapers = ALL_SEMESTER_PYQS[selectedSem] || []

  const filteredPapers = semesterPapers.filter(paper => {
    const matchesFilter = examTypeFilter === 'ALL' || paper.examType.includes(examTypeFilter)
    const matchesSearch = searchQuery.trim() === '' ||
      paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.code.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <section id="curriculum-pyqs" className="py-14 sm:py-20 border-b border-[#30363d]/60 bg-[#010409] font-mono relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute left-1/4 top-0 w-[500px] h-[300px] bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#161b22] border border-emerald-500/30 text-emerald-400 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>OFFICIAL UNIVERSITY PYQ VAULT // SEMESTERS 1 TO 8</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Previous Year Question Papers (PYQs)
            </h2>
            <p className="text-xs sm:text-sm text-[#7d8590] mt-1 max-w-2xl">
              Authentic Chandigarh University endterm (EST) and midterm (MST-1 & MST-2) past question papers with step-by-step solved student answer keys.
            </p>
          </div>

          <Link
            href={`/browse?sem=${selectedSem}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-white px-4 py-2 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 transition-all shrink-0 cursor-pointer"
          >
            <span>Browse Sem {selectedSem} Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Semester Selector Tabs (Sem 1 to Sem 8) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSem(sem)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${selectedSem === sem
                  ? 'bg-[#238636] text-white border-[#2ea44f] shadow-lg shadow-[#238636]/30'
                  : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white hover:border-[#7d8590]'
                }`}
            >
              <span>Semester {sem}</span>
            </button>
          ))}
        </div>

        {/* Controls Bar: Exam Type Filter & Course Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#161b22] border border-[#30363d] mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-hide text-xs">
            <span className="text-[11px] text-[#7d8590] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-emerald-400" /> Exam:
            </span>
            {['ALL', 'EST', 'MST-1', 'MST-2'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setExamTypeFilter(type)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${examTypeFilter === type
                    ? 'bg-[#238636] text-white font-bold'
                    : 'bg-[#0d1117] text-[#7d8590] hover:text-white border border-[#30363d]'
                  }`}
              >
                {type === 'ALL' ? 'All Exams' : type}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#7d8590] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Filter Sem ${selectedSem} courses...`}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#7d8590] focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>

        {/* Question Papers Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSem}-${examTypeFilter}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredPapers.map(paper => (
              <div
                key={paper.id}
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(35,134,54,0.12)] transition-all flex flex-col justify-between group text-left relative"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#30363d]/60">
                    <span className="text-[11px] font-bold text-emerald-400">
                      {paper.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0d1117] text-white border border-[#30363d]">
                      {paper.examType} {paper.year}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-2">
                    {paper.name}
                  </h3>

                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Verified Answer Key</span>
                  </div>

                  <p className="text-xs text-[#7d8590] leading-relaxed line-clamp-2 mb-4 bg-[#0d1117] p-2.5 rounded-xl border border-[#30363d]/60">
                    {paper.questionsCount}
                  </p>
                </div>

                <div>
                  <div className="text-[10px] text-[#7d8590] mb-3 flex items-center justify-between">
                    <span className="truncate">Audited: {paper.verifiedBy}</span>
                    <span className="text-emerald-400 shrink-0 font-bold">▲ {paper.upvotes}</span>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(paper.demoResource)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea44f] text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-[#238636]/30 font-mono"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Solved</span>
                    </button>

                    <Link
                      href={`/browse?search=${encodeURIComponent(paper.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Vault</span>
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-[#7d8590]">
            <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No question papers matching this filter.</p>
          </div>
        )}

      </div>

      {/* PDF Modal */}
      {previewResource && (
        <PDFViewerModal
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
          resource={previewResource}
        />
      )}

    </section>
  )
}

