'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  ShieldAlert,
  FileText,
  BookOpen,
  Calculator,
  Download,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Target
} from 'lucide-react'

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

export interface ReappearPyqItem {
  id: string
  code: string
  name: string
  sem: number
  reappearType: string
  repeatScore: string
  papersCount: number
  solvedStatus: string
  topics: string[]
  sampleQuestion: string
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

export interface ReappearMaterialItem {
  id: string
  title: string
  code: string
  sem: number
  fileType: string
  pages: string
  size: string
  tag: string
  tagColor: string
  description: string
  highlights: string[]
}

// Complete Reappear Question Papers (PYQs) for All 8 Semesters
export const ALL_SEMESTER_REAPPEAR_PYQS: Record<number, ReappearPyqItem[]> = {
  1: [
    {
      id: 'r-pyq-1-1',
      code: '22MAT-101',
      name: 'Engineering Mathematics - I',
      sem: 1,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '94% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Full handwritten step derivations included',
      topics: ['Eigenvalues & Cayley Hamilton', 'Taylor & Maclaurin Series', 'Beta-Gamma Functions', 'Multiple Integrals'],
      sampleQuestion: '[Q3.a] Find Eigen values and verify Cayley-Hamilton theorem for matrix A=[[1,2,0],[0,2,1],[0,0,3]]',
      demoResource: {
        id: 'math1-remedial-2024',
        exam_year: 2024,
        original_filename: 'Engg_Maths_I_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - I', code: '22MAT-101', semester: 1 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-1-2',
      code: '22PHY-101',
      name: 'Engineering Physics',
      sem: 1,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '88% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Full laser cavity & fiber optics derivations',
      topics: ['He-Ne Laser Population Inversion', 'Numerical Aperture Step-Index Fiber', 'Schrodinger Wave Proof'],
      sampleQuestion: '[Q2.b] Derive the expression for numerical aperture and acceptance angle in an optical fiber.',
      demoResource: {
        id: 'phy1-remedial-2024',
        exam_year: 2024,
        original_filename: 'Physics_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Physics', code: '22PHY-101', semester: 1 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Physics Cell', username: 'prevu_phy', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-1-3',
      code: '22EE101',
      name: 'Basic Electrical & Electronics',
      sem: 1,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '86% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Step-by-step Norton & Thevenin solutions',
      topics: ['Thevenin Equivalent Circuit', 'Star-Delta Transformations', 'Transformer Voltage Regulation'],
      sampleQuestion: '[Q4.a] Find load current using Thevenin Theorem across RL=10 ohms with dependent voltage source.',
      demoResource: {
        id: 'ee1-remedial-2023',
        exam_year: 2023,
        original_filename: 'Electrical_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Basic Electrical Engineering', code: '22EE101', semester: 1 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu EE Lead', username: 'prevu_ee', cu_verified: true, role: 'admin' }
      }
    }
  ],
  2: [
    {
      id: 'r-pyq-2-1',
      code: '22MAT-102',
      name: 'Engineering Mathematics - II',
      sem: 2,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '93% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Laplace transforms & Fourier series with step proofs',
      topics: ['Laplace Transform of Unit Step Function', 'Fourier Series Half Range Expansions', 'First Order ODEs'],
      sampleQuestion: '[Q2.a] Find the Laplace transform of f(t) = t * e^(-2t) * sin(3t). Show integration steps.',
      demoResource: {
        id: 'math2-remedial-2024',
        exam_year: 2024,
        original_filename: 'Engg_Maths_II_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - II', code: '22MAT-102', semester: 2 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-2-2',
      code: '22CSH-102',
      name: 'OOP with C++',
      sem: 2,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '90% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Virtual destructors, pointer slicing & templates',
      topics: ['Virtual Functions & Abstract Base Classes', 'Operator Overloading (<< and +)', 'Exception Handling Try-Catch'],
      sampleQuestion: '[Q3.c] Explain why a base class destructor must be virtual. Provide code demonstrating memory leak.',
      demoResource: {
        id: 'cpp-remedial-2024',
        exam_year: 2024,
        original_filename: 'Cpp_OOP_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'OOP with C++', code: '22CSH-102', semester: 2 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Code Lab', username: 'prevu_cpp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-2-3',
      code: '22CHY-101',
      name: 'Engineering Chemistry',
      sem: 2,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '85% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Water hardness EDTA calculations with full formulas',
      topics: ['EDTA Titration Calculations', 'Corrosion Pilling-Bedworth Rule', 'Phase Rule Derivation for Water System'],
      sampleQuestion: '[Q1.b] 50ml of hard water consumed 20ml of 0.01M EDTA. Calculate temporary and permanent hardness in ppm.',
      demoResource: {
        id: 'chem-remedial-2023',
        exam_year: 2023,
        original_filename: 'Chemistry_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Chemistry', code: '22CHY-101', semester: 2 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Sciences', username: 'prevu_chem', cu_verified: true, role: 'admin' }
      }
    }
  ],
  3: [
    {
      id: 'r-pyq-3-1',
      code: '22CS201',
      name: 'Data Structures & Algorithms',
      sem: 3,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '91% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Full tree rotations & graph traces diagrammed',
      topics: ['AVL Tree Rotations (LL, RR, LR, RL)', 'Dijkstra Shortest Path Matrix', 'Binary Search Tree Deletion', 'Huffman Codes'],
      sampleQuestion: '[Q4.c] Construct an AVL tree by inserting keys: 21, 26, 30, 9, 4, 14, 28, 18. Show all balance factor rotations.',
      demoResource: {
        id: 'dsa-remedial-2024',
        exam_year: 2024,
        original_filename: 'DSA_22CS201_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Data Structures & Algorithms', code: '22CS201', semester: 3 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Code Lab', username: 'prevu_dsa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-3-2',
      code: '22MAT-201',
      name: 'Discrete Mathematics',
      sem: 3,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '89% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Recurrence relation proofs & graph representations',
      topics: ['Homogeneous Recurrence Relations', 'Euler & Hamiltonian Graph Criteria', 'Equivalence Relations & Partitions'],
      sampleQuestion: '[Q2.a] Solve the recurrence relation a_n - 7a_{n-1} + 10a_{n-2} = 0 with a_0=2 and a_1=7.',
      demoResource: {
        id: 'dm-remedial-2024',
        exam_year: 2024,
        original_filename: 'Discrete_Math_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Discrete Mathematics', code: '22MAT-201', semester: 3 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Math Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-3-3',
      code: '22EC201',
      name: 'Digital Electronics & Logic',
      sem: 3,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '87% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Full K-Map reduction and flip-flop timing diagrams',
      topics: ['4-Variable K-Map POS/SOP Minimization', 'JK to D Flip-Flop Conversion', 'Modulo-8 Synchronous Counter'],
      sampleQuestion: '[Q3.b] Convert a JK Flip-Flop into a T Flip-Flop. Show complete excitation table and K-map.',
      demoResource: {
        id: 'de-remedial-2023',
        exam_year: 2023,
        original_filename: 'Digital_Logic_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Digital Electronics', code: '22EC201', semester: 3 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu ECE Lead', username: 'prevu_ece', cu_verified: true, role: 'admin' }
      }
    }
  ],
  4: [
    {
      id: 'r-pyq-4-1',
      code: '23CSH-242',
      name: 'Operating Systems',
      sem: 4,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '89% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Step-by-step Gantt charts & algorithm traces',
      topics: ['Banker Algorithm Safety Check', 'SJF & Round Robin Scheduling', 'Page Replacement (FIFO/LRU)', 'Semaphores'],
      sampleQuestion: '[Q2.b] Using Banker algorithm with 5 processes and 3 resource types, determine if system is in safe state.',
      demoResource: {
        id: 'os-remedial-2024',
        exam_year: 2024,
        original_filename: 'Operating_Systems_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Operating Systems', code: '23CSH-242', semester: 4 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Systems Lab', username: 'prevu_os', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-4-2',
      code: '23CSH-243',
      name: 'Database Management Systems',
      sem: 4,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '86% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Step-by-step normal form decomposition verified',
      topics: ['3NF & BCNF Decomposition', 'Serializability Precedence Graph', 'SQL Complex Group By Queries', 'ACID Transactions'],
      sampleQuestion: '[Q3.a] Given R(A,B,C,D,E) and FDs {A->BC, CD->E, B->D, E->A}. Find candidate keys and decompose into BCNF.',
      demoResource: {
        id: 'dbms-remedial-2024',
        exam_year: 2024,
        original_filename: 'DBMS_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Database Management Systems', code: '23CSH-243', semester: 4 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Data Team', username: 'prevu_dbms', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-4-3',
      code: '23CSH-244',
      name: 'Computer Organization & Architecture',
      sem: 4,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '88% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Full Booth multiplication steps and cache mappings',
      topics: ['Booth Multiplication Algorithm', 'Set-Associative Cache Mapping', 'Pipelining Hazards & Branch Penalties'],
      sampleQuestion: '[Q4.b] Multiply (-7) by (+5) using Booth Algorithm. Show register states in tabular format.',
      demoResource: {
        id: 'coa-remedial-2023',
        exam_year: 2023,
        original_filename: 'COA_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Organization', code: '23CSH-244', semester: 4 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Hardware Cell', username: 'prevu_coa', cu_verified: true, role: 'admin' }
      }
    }
  ],
  5: [
    {
      id: 'r-pyq-5-1',
      code: '21CSH-311',
      name: 'Design & Analysis of Algorithms',
      sem: 5,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '92% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Complete dynamic programming matrices filled out',
      topics: ['0/1 Knapsack DP Table', 'Matrix Chain Multiplication Parenthesization', 'Bellman-Ford Algorithm Trace'],
      sampleQuestion: '[Q1.c] Find minimum scalar multiplications for matrices with dimensions <10, 20, 30, 40, 30>. Show m and s tables.',
      demoResource: {
        id: 'daa-remedial-2024',
        exam_year: 2024,
        original_filename: 'DAA_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Design and Analysis of Algorithms', code: '21CSH-311', semester: 5 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Algorithms Cell', username: 'prevu_daa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-5-2',
      code: '23CSH-312',
      name: 'Computer Networks',
      sem: 5,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '89% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Step-by-step CIDR subnet calculations',
      topics: ['VLSM / CIDR Subnetting Calculations', 'Distance Vector Routing Table Updates', 'TCP Window Flow Control'],
      sampleQuestion: '[Q3.b] An organization is granted 192.168.1.0/24. Allocate subnets for 60, 30, 14, and 2 hosts with network addresses.',
      demoResource: {
        id: 'cn-remedial-2024',
        exam_year: 2024,
        original_filename: 'Networks_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Networks', code: '23CSH-312', semester: 5 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Networks Team', username: 'prevu_cn', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-5-3',
      code: '23CST-314',
      name: 'Theory of Computation (TOC)',
      sem: 5,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '91% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Full DFA construction and Pumping Lemma proofs',
      topics: ['NFA to DFA Subset Construction', 'Pumping Lemma for Non-Regularity', 'Chomsky Hierarchy'],
      sampleQuestion: '[Q2.a] Prove using Pumping Lemma that L = {0^p | p is a prime} is not a regular language.',
      demoResource: {
        id: 'toc-remedial-2023',
        exam_year: 2023,
        original_filename: 'TOC_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Theory of Computation', code: '23CST-314', semester: 5 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_toc', cu_verified: true, role: 'admin' }
      }
    }
  ],
  6: [
    {
      id: 'r-pyq-6-1',
      code: '22CST-390',
      name: 'Theory of Computation (Automata)',
      sem: 6,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '88% Repeat Rate',
      papersCount: 4,
      solvedStatus: 'Full state transition diagrams & formal 5-tuples',
      topics: ['NFA to DFA Subset Construction', 'Pushdown Automata (PDA)', 'Turing Machine for 0^n 1^n 2^n', 'Undecidability'],
      sampleQuestion: '[Q1.b] Design a Turing Machine that accepts the language L = {0^n 1^n 2^n | n >= 1}. Write complete transition table.',
      demoResource: {
        id: 'automata-remedial-2024',
        exam_year: 2024,
        original_filename: 'Automata_TOC_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Theory of Computation', code: '22CST-390', semester: 6 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_automata', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-6-2',
      code: '23CST-304',
      name: 'Compiler Design',
      sem: 6,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '90% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Parsing tables and grammar conflict resolutions',
      topics: ['LL(1) First & Follow Sets', 'LR(0) and SLR(1) Item Generation', 'Three-Address Code Generation'],
      sampleQuestion: '[Q3.a] Check whether the grammar S->Aa | bAc, A->d is LL(1). Construct the parsing table.',
      demoResource: {
        id: 'compiler-remedial-2024',
        exam_year: 2024,
        original_filename: 'Compiler_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Compiler Design', code: '23CST-304', semester: 6 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Compilers Lead', username: 'prevu_compiler', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-6-3',
      code: '23CST-305',
      name: 'Cloud Computing Architecture',
      sem: 6,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '84% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Architecture flowcharts and virtualization models',
      topics: ['Virtualization Hypervisor Types', 'IaaS / PaaS / SaaS SLAs', 'AWS S3 & EC2 Security Groups'],
      sampleQuestion: '[Q2.c] Compare Full Virtualization vs Paravirtualization with architectural diagrams and performance trade-offs.',
      demoResource: {
        id: 'cloud-remedial-2023',
        exam_year: 2023,
        original_filename: 'Cloud_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cloud Computing', code: '23CST-305', semester: 6 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Cloud Cell', username: 'prevu_cloud', cu_verified: true, role: 'admin' }
      }
    }
  ],
  7: [
    {
      id: 'r-pyq-7-1',
      code: '22CST-354',
      name: 'Parallel & Distributed Computing',
      sem: 7,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '87% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Speedup derivations & MPI code blocks verified',
      topics: ['Amdahl Law Speedup Limits', 'OpenMP Parallel For Directives', 'Lamport Logical Timestamp Ordering'],
      sampleQuestion: '[Q3.a] An application has 80% parallelizable code. Calculate maximum speedup with 16 processors using Amdahl Law.',
      demoResource: {
        id: 'pdc-remedial-2024',
        exam_year: 2024,
        original_filename: 'PDC_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Parallel & Distributed Computing', code: '22CST-354', semester: 7 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Distributed Cell', username: 'prevu_dist', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-7-2',
      code: '23CST-401',
      name: 'Deep Learning & Neural Networks',
      sem: 7,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '89% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Backpropagation chain rule derivations with numericals',
      topics: ['Backpropagation Weight Update Steps', 'CNN Convolution & Pooling Dimensions', 'Vanishing Gradient Solutions'],
      sampleQuestion: '[Q2.b] Calculate output dimensions and parameters for 224x224x3 input passed through 64 filters of 7x7 with stride 2 and padding 3.',
      demoResource: {
        id: 'dl-remedial-2024',
        exam_year: 2024,
        original_filename: 'Deep_Learning_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Deep Learning', code: '23CST-401', semester: 7 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu DL Lab', username: 'prevu_dl', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-7-3',
      code: 'FSO-307',
      name: 'Cyber Security Essentials',
      sem: 7,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '85% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'RSA encryption and key exchange step calculations',
      topics: ['RSA Key Generation Numerical', 'Diffie-Hellman Key Exchange', 'Buffer Overflow Stack Smashing'],
      sampleQuestion: '[Q4.a] In an RSA cryptosystem, p=7, q=11, and e=13. Find the private key d and encrypt message m=5.',
      demoResource: {
        id: 'cyber-remedial-2023',
        exam_year: 2023,
        original_filename: 'Cybersec_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Security', code: 'FSO-307', semester: 7 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Security Cell', username: 'prevu_cyber', cu_verified: true, role: 'admin' }
      }
    }
  ],
  8: [
    {
      id: 'r-pyq-8-1',
      code: '23CST-405',
      name: 'Cyber Forensics & Incident Response',
      sem: 8,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '86% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Forensic evidence handling and registry parsing',
      topics: ['Chain of Custody Legal Procedures', 'Windows Registry Key Analysis (UserAssist)', 'Volatility Memory Dump Commands'],
      sampleQuestion: '[Q1.c] Explain the process of creating a forensically sound bitstream image using dd and validating SHA-256 hash.',
      demoResource: {
        id: 'forensics-remedial-2024',
        exam_year: 2024,
        original_filename: 'Cyber_Forensics_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Forensics', code: '23CST-405', semester: 8 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Forensics Lab', username: 'prevu_forensics', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-8-2',
      code: '23CST-406',
      name: 'Natural Language Processing',
      sem: 8,
      reappearType: 'EST Remedial 2024 Solved',
      repeatScore: '89% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Attention weight calculation and TF-IDF derivations',
      topics: ['Self-Attention Q, K, V Matrix Math', 'Word2Vec Negative Sampling Loss', 'Viterbi POS Tagging Algorithm'],
      sampleQuestion: '[Q2.a] Given queries Q and keys K, derive the scaled dot-product attention formula and explain why scaling by sqrt(d_k) is required.',
      demoResource: {
        id: 'nlp-remedial-2024',
        exam_year: 2024,
        original_filename: 'NLP_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Natural Language Processing', code: '23CST-406', semester: 8 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu NLP Lab', username: 'prevu_nlp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'r-pyq-8-3',
      code: '23CST-407',
      name: 'Blockchain Technologies',
      sem: 8,
      reappearType: 'EST Remedial 2023 Solved',
      repeatScore: '84% Repeat Rate',
      papersCount: 3,
      solvedStatus: 'Consensus mechanisms & smart contract vulnerability proofs',
      topics: ['Reentrancy Attack Prevention in Solidity', 'Proof of Work Target Difficulty', 'Merkle Tree Root Validation'],
      sampleQuestion: '[Q4.b] Write a vulnerable Solidity withdraw() function exhibiting reentrancy, and rewrite it using Checks-Effects-Interactions pattern.',
      demoResource: {
        id: 'blockchain-remedial-2023',
        exam_year: 2023,
        original_filename: 'Blockchain_EST_Remedial_Solved.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Blockchain Technologies', code: '23CST-407', semester: 8 },
        exam_types: { name: 'EST Remedial' },
        users: { name: 'Prevu Web3 Cell', username: 'prevu_crypto', cu_verified: true, role: 'admin' }
      }
    }
  ]
}

// Complete 80/20 Reappear Crash Materials for All 8 Semesters
export const ALL_SEMESTER_REAPPEAR_MATERIALS: Record<number, ReappearMaterialItem[]> = {
  1: [
    {
      id: 'rm-1-1',
      title: 'Engineering Mathematics-I: 80/20 Passing Formula & Derivation Guide',
      code: '22MAT-101',
      sem: 1,
      fileType: 'PDF Document',
      pages: '14 Pages',
      size: '2.1 MB',
      tag: 'Guaranteed Pass',
      tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'The top 6 derivations that repeat in 90% of remedial exams: Cayley-Hamilton proof, Taylor series, Beta-Gamma relationship.',
      highlights: ['Cayley-Hamilton Theorem & Inverse Verification', 'Maclaurin Expansion Formulas', 'Beta & Gamma Function Proofs']
    },
    {
      id: 'rm-1-2',
      title: 'Engineering Physics: Rapid Derivations & Lasers One-Night Sheet',
      code: '22PHY-101',
      sem: 1,
      fileType: 'PDF Document',
      pages: '12 Pages',
      size: '1.8 MB',
      tag: 'One-Night Lifesaver',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Covers only Unit 2 (Lasers) and Unit 4 (Fiber Optics) to secure 28+ marks in 4 hours of revision.',
      highlights: ['He-Ne Laser Population Inversion Rate', 'Numerical Aperture Equation', 'Schrodinger Time-Independent ODE']
    }
  ],
  2: [
    {
      id: 'rm-2-1',
      title: 'Engineering Mathematics-II: Laplace & Fourier 80/20 Crash Packet',
      code: '22MAT-102',
      sem: 2,
      fileType: 'PDF Document',
      pages: '16 Pages',
      size: '2.4 MB',
      tag: 'Guaranteed Pass',
      tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Master the 10 repeated Laplace transformations and half-range Fourier series to score 35+ marks easily.',
      highlights: ['Unit Step & Dirac Delta Laplace Rules', 'Fourier Half Range Sine/Cosine Expansions', 'Linear ODE with Constant Coefficients']
    },
    {
      id: 'rm-2-2',
      title: 'OOP with C++: Reappear Survival Workbook & 15 Repeated Viva/Code Qs',
      code: '22CSH-102',
      sem: 2,
      fileType: 'PDF Document',
      pages: '15 Pages',
      size: '2.2 MB',
      tag: 'High-Yield Code',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Complete working code snippets for operator overloading, virtual destructor proofs, and template classes.',
      highlights: ['Operator Overloading (+ and <<) Code', 'Virtual Functions & Abstract Base Class', 'Exception Handling Custom Hierarchy']
    }
  ],
  3: [
    {
      id: 'rm-3-1',
      title: 'Data Structures: Tree Rotations, Heaps & Dijkstra Solved Workbook',
      code: '22CS201',
      sem: 3,
      fileType: 'PDF Document',
      pages: '18 Pages',
      size: '2.7 MB',
      tag: 'High-Yield Visuals',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Visual step-by-step instructions for AVL rotations and graph matrix updates written for full step credit.',
      highlights: ['AVL Tree LL, RR, LR, RL Rotations', 'Dijkstra Matrix Tabulation Method', 'Binary Heap Insert and Delete Operations']
    },
    {
      id: 'rm-3-2',
      title: 'Discrete Mathematics: Recurrence Relations & Graph Criteria Sheet',
      code: '22MAT-201',
      sem: 3,
      fileType: 'PDF Document',
      pages: '14 Pages',
      size: '2.0 MB',
      tag: 'Formula Cheatsheet',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Solve homogeneous linear recurrence relations and verify Euler circuits in 3 steps without algebra mistakes.',
      highlights: ['Homogeneous Recurrence Characteristic Root Method', 'Eulerian & Hamiltonian Theorem Rules', 'Pigeonhole Principle Exam Applications']
    }
  ],
  4: [
    {
      id: 'rm-4-1',
      title: 'Operating Systems: 80/20 Passing Blueprint & Solved Gantt Worksheets',
      code: '23CSH-242',
      sem: 4,
      fileType: 'PDF Document',
      pages: '18 Pages',
      size: '2.6 MB',
      tag: 'Guaranteed 40+ Marks',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Covers CPU scheduling, Banker safety algorithm, and page replacement to guarantee 40+ marks on any remedial paper.',
      highlights: ['10 Solved Gantt Chart Scheduling Numericals', 'Banker Algorithm 4-Step Safety Method', 'Page Replacement (FIFO, LRU, Optimal)']
    },
    {
      id: 'rm-4-2',
      title: 'DBMS: Normalization Decomposition & SQL Group By Rapid Sheet',
      code: '23CSH-243',
      sem: 4,
      fileType: 'PDF Document',
      pages: '16 Pages',
      size: '2.3 MB',
      tag: 'Step-by-Step Proof',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Attribute closure method and BCNF/3NF decomposition algorithm guaranteed to get full marks on Section B.',
      highlights: ['Candidate Key Finding with Attribute Closure', 'Lossless Join & Dependency Preserving 3NF', 'Precedence Graph Serializability Test']
    }
  ],
  5: [
    {
      id: 'rm-5-1',
      title: 'DAA: Dynamic Programming Matrices & Greedy Proofs Cheat Sheet',
      code: '21CSH-311',
      sem: 5,
      fileType: 'PDF Document',
      pages: '20 Pages',
      size: '2.9 MB',
      tag: 'One-Night Lifesaver',
      tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      description: 'Pre-solved tables for 0/1 Knapsack, Matrix Chain Multiplication, and Floyd-Warshall shortest path.',
      highlights: ['0/1 Knapsack DP Matrix Formulation', 'Matrix Chain Multiplication M and S Tables', 'Bellman-Ford Negative Cycle Detection']
    },
    {
      id: 'rm-5-2',
      title: 'Computer Networks: 30-Second Subnetting & Protocol Architecture',
      code: '23CSH-312',
      sem: 5,
      fileType: 'PDF Document',
      pages: '15 Pages',
      size: '2.2 MB',
      tag: 'Fast-Track Formulas',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Fast subnet allocation formulas without binary conversion headaches and complete Distance Vector protocol traces.',
      highlights: ['VLSM Subnet Calculation 30-Sec Formula', 'Distance Vector Routing Table Updates', 'TCP 3-Way Handshake & Window Sizing']
    }
  ],
  6: [
    {
      id: 'rm-6-1',
      title: 'Automata Theory (TOC): 25 High-Probability State Diagrams & TM Guide',
      code: '22CST-390',
      sem: 6,
      fileType: 'PDF Document',
      pages: '16 Pages',
      size: '2.4 MB',
      tag: 'Visual Diagrams',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'Master the 5 standard languages that repeat on every remedial test: DFA, PDA, and Turing Machine state transitions.',
      highlights: ['NFA to DFA Subset Construction Method', 'Pumping Lemma 4-Step Contradiction Template', 'Turing Machine 0^n 1^n 2^n Step Guide']
    },
    {
      id: 'rm-6-2',
      title: 'Compiler Design: First & Follow Sets, LR Items & DAG Generation',
      code: '23CST-304',
      sem: 6,
      fileType: 'PDF Document',
      pages: '16 Pages',
      size: '2.3 MB',
      tag: 'Step-by-Step Proof',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Rules for calculating First and Follow sets without error, plus SLR(1) parsing table construction steps.',
      highlights: ['First & Follow Calculation Rules', 'LR(0) and SLR(1) Parsing Table Steps', 'Three-Address Code Generation Rules']
    }
  ],
  7: [
    {
      id: 'rm-7-1',
      title: 'PDC: Amdahl Law Speedup Numericals & OpenMP Directives Summary',
      code: '22CST-354',
      sem: 7,
      fileType: 'PDF Document',
      pages: '14 Pages',
      size: '2.1 MB',
      tag: 'Formula Cheatsheet',
      tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      description: 'Master Amdahl Law and Gustafson Law numericals and memorise the top 5 OpenMP parallel loops.',
      highlights: ['Amdahl Law vs Gustafson Law Formulas', 'MPI Broadcast & Scatter-Gather Primitives', 'Lamport Logical Clock Vector Rules']
    },
    {
      id: 'rm-7-2',
      title: 'Deep Learning: Backpropagation Chain Rule & CNN Architecture Sheet',
      code: '23CST-401',
      sem: 7,
      fileType: 'PDF Document',
      pages: '18 Pages',
      size: '2.6 MB',
      tag: 'High-Yield Math',
      tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      description: 'Backpropagation chain rule step derivations and CNN filter dimension formulas for Section C questions.',
      highlights: ['Backpropagation Output & Hidden Layer Gradients', 'CNN Output Dimension Calculation Formula', 'LSTM Gate Equations & Exploding Gradient Fix']
    }
  ],
  8: [
    {
      id: 'rm-8-1',
      title: 'Cyber Forensics: Incident Response Chain of Custody & Memory Guide',
      code: '23CST-405',
      sem: 8,
      fileType: 'PDF Document',
      pages: '15 Pages',
      size: '2.2 MB',
      tag: 'Field Handbook',
      tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      description: 'The standard legal chain of custody requirements and Volatility command cheat sheets for forensic examinations.',
      highlights: ['Chain of Custody 6-Step Protocol', 'Windows Registry Key Forensics (MRU & UserAssist)', 'Volatility Memory Analysis Commands']
    },
    {
      id: 'rm-8-2',
      title: 'NLP & Transformers: Attention Math & Word2Vec Negative Sampling',
      code: '23CST-406',
      sem: 8,
      fileType: 'PDF Document',
      pages: '16 Pages',
      size: '2.4 MB',
      tag: 'Transformer Blueprint',
      tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      description: 'Scaled dot-product attention derivation and step-by-step matrix multiplications for self-attention layers.',
      highlights: ['Self-Attention Scaled Dot-Product Math', 'Word2Vec Skip-Gram with Negative Sampling', 'BERT vs GPT Architecture Comparisons']
    }
  ]
}

export default function ReappearRescueSection() {
  const [selectedSem, setSelectedSem] = useState<number>(4)
  const [activeSubTab, setActiveSubTab] = useState<'pyqs' | 'materials'>('pyqs')
  const [previewResource, setPreviewResource] = useState<any | null>(null)

  const semesterPyqs = ALL_SEMESTER_REAPPEAR_PYQS[selectedSem] || []
  const semesterMaterials = ALL_SEMESTER_REAPPEAR_MATERIALS[selectedSem] || []

  return (
    <section id="reappear-rescue" className="py-14 sm:py-20 border-b border-[#30363d]/60 bg-[#090d13] font-mono relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[350px] bg-amber-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[350px] bg-rose-500/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-bold mb-3 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>REAPPEAR &amp; REMEDIAL RESCUE HUB // SEMESTERS 1 TO 8</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            Reappear PYQs &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-emerald-400">80/20 Crash Material</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#7d8590] max-w-2xl leading-relaxed">
            Specialized remedial question papers (PYQs), high-frequency repeated prompts, and concise one-night revision guides engineered to help you clear any semester backlog on the first attempt.
          </p>

          {/* Sub-Tab Selector: Reappear PYQs vs 80/20 Study Material */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1.5 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('pyqs')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'pyqs'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-extrabold'
                  : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reappear PYQs &amp; Solved Papers</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'pyqs' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                Sem {selectedSem}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('materials')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === 'materials'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 font-extrabold'
                  : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>80/20 Reappear Crash Material</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'materials' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                One-Night
              </span>
            </button>
          </div>
        </div>

        {/* Semester Selector Tabs (Sem 1 to Sem 8) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSem(sem)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedSem === sem
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow-lg shadow-amber-500/30'
                  : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white hover:border-[#7d8590]'
              }`}
            >
              <span>Semester {sem} Backlogs</span>
            </button>
          ))}
        </div>

        {/* CONTENT VIEW 1: REAPPEAR PYQS FOR SELECTED SEMESTER */}
        {activeSubTab === 'pyqs' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`reappear-pyqs-${selectedSem}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {semesterPyqs.map(paper => (
                <div
                  key={paper.id}
                  className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all flex flex-col justify-between group text-left relative"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {paper.repeatScore}
                      </span>
                      <span className="text-[10px] text-[#7d8590] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                        Sem {paper.sem} Remedial
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-xs text-amber-300 font-bold">{paper.code}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 line-clamp-1">
                        {paper.name}
                      </h3>
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="line-clamp-1">{paper.reappearType}</span>
                      </div>
                    </div>

                    {/* Repeated Exam Prompt */}
                    <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/80 text-[#e6edf3] text-xs leading-relaxed mb-4">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] mb-1 flex items-center justify-between">
                        <span>Frequent Exam Prompt</span>
                        <span className="text-amber-400">10 Marks</span>
                      </div>
                      <p className="text-[11px] text-[#c9d1d9] italic line-clamp-2">
                        &ldquo;{paper.sampleQuestion}&rdquo;
                      </p>
                    </div>

                    {/* Key Topics */}
                    <div className="space-y-1 mb-4">
                      <span className="text-[10px] text-[#7d8590] font-semibold uppercase tracking-wider block">
                        Guaranteed Modules:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {paper.topics.map(t => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(paper.demoResource)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Solved</span>
                    </button>

                    <Link
                      href={`/browse?search=${encodeURIComponent(paper.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>All Papers</span>
                      <ChevronRight className="w-3 h-3 text-amber-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* CONTENT VIEW 2: REAPPEAR STUDY MATERIAL FOR SELECTED SEMESTER */}
        {activeSubTab === 'materials' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`reappear-materials-${selectedSem}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {semesterMaterials.map(mat => (
                <div
                  key={mat.id}
                  className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all flex flex-col justify-between group text-left relative"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${mat.tagColor}`}>
                        {mat.tag}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#7d8590]">
                        <span>{mat.pages}</span>
                        <span>•</span>
                        <span>{mat.size}</span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="text-xs text-emerald-400 font-bold">{mat.code}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5 leading-snug">
                        {mat.title}
                      </h3>
                      <p className="text-xs text-[#7d8590] mt-2 leading-relaxed">
                        {mat.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/80 mb-4 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] block mb-1">
                        Must-Learn Units in this Crash Guide:
                      </span>
                      {mat.highlights.map(h => (
                        <div key={h} className="flex items-center gap-1.5 text-[11px] text-[#c9d1d9]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/study-material?search=${encodeURIComponent(mat.code)}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Crash Guide</span>
                    </Link>

                    <Link
                      href={`/browse?search=${encodeURIComponent(mat.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Pair with PYQ</span>
                      <ChevronRight className="w-3 h-3 text-emerald-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Global Footer Banner for Reappear */}
        <div className="mt-10 p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d8590]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block">Need a paper not in the Sem {selectedSem} Reappear Vault?</span>
              <span className="text-[11px] text-[#7d8590]">Request emergency peer solved papers with guaranteed senior verification within 24 hours.</span>
            </div>
          </div>
          <Link
            href="/requests"
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-amber-400 hover:text-amber-300 font-bold border border-amber-500/40 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Post Backlog Bounty</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Live PDF Preview Modal */}
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
