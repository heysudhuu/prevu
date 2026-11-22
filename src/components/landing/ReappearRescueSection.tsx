'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
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
  Target,
  Upload
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

// Complete Reappear Question Bank for All 8 Semesters
export interface ReappearQuestionItem {
  id: string
  code: string
  name: string
  sem: number
  marks: string
  repeatScore: string
  topic: string
  questionText: string
  solutionSummary: string
  yearHistory: string[]
}

export const ALL_SEMESTER_REAPPEAR_QUESTIONS: Record<number, ReappearQuestionItem[]> = {
  1: [
    {
      id: 'rq-1-1',
      code: '22MAT-101',
      name: 'Engineering Mathematics - I',
      sem: 1,
      marks: '10 Marks',
      repeatScore: '94% Repeat Rate',
      topic: 'Matrices & Eigenvalues',
      questionText: 'State and prove Cayley-Hamilton Theorem. Verify it for matrix A = [[2, -1, 1], [-1, 2, -1], [1, -1, 2]] and compute A^(-1) and A^4.',
      solutionSummary: 'Step 1: Write characteristic equation det(A - λI) = 0. Step 2: Show matrix A satisfies λ^3 - tr(A)λ^2 + ... = 0. Step 3: Multiply by A^(-1) to isolate A^(-1).',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved', 'EST 2022 Archive']
    },
    {
      id: 'rq-1-2',
      code: '22PHY-101',
      name: 'Engineering Physics',
      sem: 1,
      marks: '10 Marks',
      repeatScore: '90% Repeat Rate',
      topic: 'Fiber Optics & Lasers',
      questionText: 'Derive expression for Numerical Aperture (NA) and Acceptance Angle of a step-index optical fiber in terms of core and cladding refractive indices (n1, n2).',
      solutionSummary: 'Step 1: Apply Snell Law at launching face. Step 2: Critical angle condition at core-cladding boundary sin(θc) = n2/n1. Step 3: NA = sqrt(n1^2 - n2^2).',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    },
    {
      id: 'rq-1-3',
      code: '22EE101',
      name: 'Basic Electrical Engineering',
      sem: 1,
      marks: '10 Marks',
      repeatScore: '86% Repeat Rate',
      topic: 'Network Theorems',
      questionText: 'State and prove Thevenin Theorem. Find the load current flowing through resistor RL = 10 ohms for the given circuit having dependent voltage source.',
      solutionSummary: 'Step 1: Calculate Open-Circuit Voltage Voc across terminals AB. Step 2: Find Rth by deactivating independent sources. Step 3: IL = Vth / (Rth + RL).',
      yearHistory: ['EST 2023 Solved', 'EST 2022 Archive']
    }
  ],
  2: [
    {
      id: 'rq-2-1',
      code: '22MAT-102',
      name: 'Engineering Mathematics - II',
      sem: 2,
      marks: '10 Marks',
      repeatScore: '93% Repeat Rate',
      topic: 'Laplace Transforms',
      questionText: 'Find the Laplace transform of f(t) = t * e^(-2t) * sin(3t). Evaluate the integral from 0 to infinity of e^(-2t) * sin(3t) / t dt.',
      solutionSummary: 'Use First Shifting Theorem together with frequency differentiation property: L{t * g(t)} = -d/ds[G(s)].',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved', 'EST 2022 Archive']
    },
    {
      id: 'rq-2-2',
      code: '22CHY-101',
      name: 'Engineering Chemistry',
      sem: 2,
      marks: '10 Marks',
      repeatScore: '88% Repeat Rate',
      topic: 'Fuels & Combustion',
      questionText: 'Explain the difference between Proximate and Ultimate analysis of coal. Give complete experimental formulas for calculating % Moisture, % Volatile Matter, and % Carbon.',
      solutionSummary: 'Proximate analysis gives physical constituents (moisture at 105C, VM at 925C, Ash at 750C); Ultimate analysis determines elemental C, H, N, S, O percentages.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  3: [
    {
      id: 'rq-3-1',
      code: '21CSH-201',
      name: 'Data Structures & Algorithms',
      sem: 3,
      marks: '10 Marks',
      repeatScore: '92% Repeat Rate',
      topic: 'AVL Trees & Self-Balancing',
      questionText: 'Explain the 4 AVL Tree rotation cases (LL, RR, LR, RL) with balance factors. Construct an AVL tree by inserting [14, 17, 11, 7, 53, 4, 13, 12] sequentially showing every rotation.',
      solutionSummary: 'Step-by-step balance factor checking after each insertion. LR requires Left rotation on child followed by Right rotation on parent node.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved', 'EST 2022 Archive']
    },
    {
      id: 'rq-3-2',
      code: '22ECH-203',
      name: 'Digital Electronics & Logic Design',
      sem: 3,
      marks: '10 Marks',
      repeatScore: '89% Repeat Rate',
      topic: 'K-Map Minimization',
      questionText: 'Minimize the Boolean function F(A,B,C,D) = Σm(0, 1, 2, 4, 5, 6, 8, 9, 12, 13, 14) + d(3, 7, 11, 15) using Karnaugh Map and realize using minimum NAND gates.',
      solutionSummary: 'Draw 4x4 Gray code map, group octets and quads incorporating don\'t-cares to achieve 2-term sum of products, then apply double inversion for NAND-NAND logic.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  4: [
    {
      id: 'rq-4-1',
      code: '22CSH-204',
      name: 'Operating Systems',
      sem: 4,
      marks: '10 Marks',
      repeatScore: '95% Repeat Rate',
      topic: 'Deadlocks & Safety Algorithm',
      questionText: 'Consider a system with 5 processes (P0-P4) and 3 resource types (A, B, C). Verify whether the system is in safe state using Banker Algorithm. Find safe sequence and evaluate if Request (1,0,2) by P1 can be granted.',
      solutionSummary: 'Calculate Need = Max - Allocation. Check Need <= Work sequentially to obtain safe sequence <P1, P3, P4, P0, P2>. Verify request condition and update state matrices.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved', 'EST 2022 Archive']
    },
    {
      id: 'rq-4-2',
      code: '23CSH-243',
      name: 'Database Management Systems',
      sem: 4,
      marks: '10 Marks',
      repeatScore: '92% Repeat Rate',
      topic: 'Normalization & 3NF/BCNF',
      questionText: 'Given relation R(A, B, C, D, E) and FDs {A->BC, CD->E, B->D, E->A}. Find candidate keys using attribute closure. Decompose R into BCNF and check whether it is lossless and dependency preserving.',
      solutionSummary: 'Compute attribute closures: (A)+ = ABCDE -> A is candidate key. (E)+ = EABCD -> E is candidate key. Check violations of BCNF where LHS is not superkey and decompose.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  5: [
    {
      id: 'rq-5-1',
      code: '21CSH-311',
      name: 'Design & Analysis of Algorithms',
      sem: 5,
      marks: '10 Marks',
      repeatScore: '94% Repeat Rate',
      topic: 'Dynamic Programming',
      questionText: 'Solve 0/1 Knapsack problem for n=4 items with values [10, 40, 30, 50] and weights [5, 4, 6, 3] with max capacity W=10 using DP table. Show full recurrence relation and backtrack the included items.',
      solutionSummary: 'Table K[i][w] = max(val[i-1] + K[i-1][w-wt[i-1]], K[i-1][w]). Fill table from i=0..4, w=0..10. Backtrack from K[4][10] to find items {4, 2}. Max profit = 90.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    },
    {
      id: 'rq-5-2',
      code: '23CSH-312',
      name: 'Computer Networks',
      sem: 5,
      marks: '10 Marks',
      repeatScore: '91% Repeat Rate',
      topic: 'Subnetting & Routing',
      questionText: 'An ISP has IP block 192.168.10.0/24. Subnet it using VLSM for 4 departments needing 60, 28, 14, and 6 hosts. Provide subnet mask, network address, valid host range, and broadcast address for each.',
      solutionSummary: 'Sort descending by host count: Subnet A (/26, 62 hosts), Subnet B (/27, 30 hosts), Subnet C (/28, 14 hosts), Subnet D (/29, 6 hosts). Compute network and broadcast IPs.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  6: [
    {
      id: 'rq-6-1',
      code: '22CST-390',
      name: 'Theory of Computation',
      sem: 6,
      marks: '10 Marks',
      repeatScore: '92% Repeat Rate',
      topic: 'Turing Machines',
      questionText: 'Design a deterministic Turing Machine for accepting the context-sensitive language L = {a^n b^n c^n | n >= 1}. Write state transition table, instantaneous descriptions for input "aabbcc", and state diagram.',
      solutionSummary: 'Mark "a" with X, move right matching first "b" with Y, move right matching first "c" with Z. Rewind left to X and repeat until all characters are verified.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved', 'EST 2022 Archive']
    },
    {
      id: 'rq-6-2',
      code: '23CST-304',
      name: 'Compiler Design',
      sem: 6,
      marks: '10 Marks',
      repeatScore: '89% Repeat Rate',
      topic: 'Parsing & Grammars',
      questionText: 'Given grammar S -> Aa | bAc | Bc | bBa, A -> d, B -> d. Compute First and Follow sets for all non-terminals. Check if the grammar is LL(1) and construct the predictive parsing table.',
      solutionSummary: 'Calculate First(S), First(A), First(B). For Follow sets, trace appearances of A and B on RHS. Check First conflict at entry M[S, d] to establish if grammar is LL(1).',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  7: [
    {
      id: 'rq-7-1',
      code: '22CST-354',
      name: 'Parallel & Distributed Computing',
      sem: 7,
      marks: '10 Marks',
      repeatScore: '88% Repeat Rate',
      topic: 'Clock Synchronization',
      questionText: 'Explain Lamport Logical Clocks and Vector Clocks. Prove how vector clocks overcome the limitation of Lamport clocks in distinguishing causally related events from concurrent events.',
      solutionSummary: 'Lamport clock e1 -> e2 implies C(e1) < C(e2), but reverse does not hold. Vector clock V(e1) < V(e2) iff e1 causally precedes e2, enabling exact concurrency detection.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    },
    {
      id: 'rq-7-2',
      code: '22CST-355',
      name: 'Information Security',
      sem: 7,
      marks: '10 Marks',
      repeatScore: '90% Repeat Rate',
      topic: 'Public Key Cryptography',
      questionText: 'Execute RSA algorithm for primes p = 7 and q = 17. Choose public key e = 5. Find private key d, encrypt message M = 19, and decrypt ciphertext C back to M.',
      solutionSummary: 'n = 7 * 17 = 119. φ(n) = 6 * 16 = 96. Compute d = e^(-1) mod φ(n) -> 5d ≡ 1 mod 96 -> d = 77. C = M^e mod n = 19^5 mod 119. M = C^d mod 119.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ],
  8: [
    {
      id: 'rq-8-1',
      code: '23CST-405',
      name: 'Digital Forensics & Incident Response',
      sem: 8,
      marks: '10 Marks',
      repeatScore: '87% Repeat Rate',
      topic: 'Evidence Chain of Custody',
      questionText: 'Detail the 6-step Chain of Custody process required in court-admissible digital evidence collection. Explain how MD5/SHA-256 write-blocker verification ensures non-repudiation.',
      solutionSummary: 'Steps: Identification, Preservation (forensic bit-stream clone with write-blockers), Analysis, Documentation, Custody Transfer Log, Courtroom Presentation with dual hash match.',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    },
    {
      id: 'rq-8-2',
      code: '23CST-407',
      name: 'Blockchain Technologies',
      sem: 8,
      marks: '10 Marks',
      repeatScore: '89% Repeat Rate',
      topic: 'Smart Contract Vulnerabilities',
      questionText: 'Explain the Reentrancy Attack in Ethereum Solidity smart contracts with the famous DAO exploit example. Write vulnerable contract code and rewrite it securely using Checks-Effects-Interactions pattern.',
      solutionSummary: 'Vulnerability occurs when contract makes external call before updating user balance mapping. Fix: change user balance to 0 BEFORE sending ether with call{value: ...}("").',
      yearHistory: ['EST 2024 Remedial', 'EST 2023 Solved']
    }
  ]
}

// Complete Reappear Syllabus & Passing Blueprint for All 8 Semesters
export interface ReappearSyllabusItem {
  id: string
  code: string
  name: string
  sem: number
  estPassingMarks: string
  totalPassingMarks: string
  mustPassUnits: Array<{ unit: string; name: string; weight: string; expectedQuestions: string }>
  highYieldStrategy: string
  passingConfidence: string
}

export const ALL_SEMESTER_REAPPEAR_SYLLABUS: Record<number, ReappearSyllabusItem[]> = {
  1: [
    {
      id: 'rs-1-1',
      code: '22MAT-101',
      name: 'Engineering Mathematics - I',
      sem: 1,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '96% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Matrices, Eigenvalues & Cayley-Hamilton', weight: '18 Marks', expectedQuestions: 'Cayley-Hamilton proof & inverse, Diagonalization of symmetric matrix' },
        { unit: 'Unit 3', name: 'Beta-Gamma Functions & Double Integrals', weight: '16 Marks', expectedQuestions: 'Relation between Beta and Gamma functions, Area evaluation using double integrals' }
      ],
      highYieldStrategy: 'Master only Unit 1 (Matrices) and Unit 3 (Beta-Gamma). These two units account for 34 marks in EST. You only need 24 marks to clear the paper.'
    },
    {
      id: 'rs-1-2',
      code: '22PHY-101',
      name: 'Engineering Physics',
      sem: 1,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '94% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Lasers & He-Ne Rate Equations', weight: '16 Marks', expectedQuestions: 'Population inversion, Einstein coefficients A & B, He-Ne laser construction' },
        { unit: 'Unit 4', name: 'Fiber Optics & Optical Communication', weight: '16 Marks', expectedQuestions: 'Numerical aperture derivation, Acceptance angle, Step-index vs Graded-index' }
      ],
      highYieldStrategy: 'Unit 2 and Unit 4 have zero calculus derivations. Preparing these guarantees 32 marks in EST without touching complex wave equations.'
    }
  ],
  2: [
    {
      id: 'rs-2-1',
      code: '22MAT-102',
      name: 'Engineering Mathematics - II',
      sem: 2,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '95% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Laplace Transforms & Shifting Theorems', weight: '18 Marks', expectedQuestions: 'Laplace of unit step & Dirac delta, Inverse Laplace using Partial Fractions' },
        { unit: 'Unit 2', name: 'Fourier Series & Half-Range Expansions', weight: '16 Marks', expectedQuestions: 'Euler coefficients a0, an, bn for odd/even functions, Dirichlet conditions' }
      ],
      highYieldStrategy: 'Laplace and Fourier series are standard plug-and-chug integration topics. Practicing 8 solved numericals guarantees 34 marks.'
    },
    {
      id: 'rs-2-2',
      code: '22CHY-101',
      name: 'Engineering Chemistry',
      sem: 2,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '92% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Water Technology & Hardness Calculation', weight: '16 Marks', expectedQuestions: 'EDTA titration method, Zeolite & Ion-exchange process, Boiler corrosion' },
        { unit: 'Unit 3', name: 'Fuels & Combustion Calorific Values', weight: '16 Marks', expectedQuestions: 'Bomb calorimeter numerical, Proximate & Ultimate coal analysis formulas' }
      ],
      highYieldStrategy: 'Water technology and Coal proximate analysis repeat verbatim in 90% of remedial tests. Memorize the 4 standard diagrams.'
    }
  ],
  3: [
    {
      id: 'rs-3-1',
      code: '21CSH-201',
      name: 'Data Structures & Algorithms',
      sem: 3,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '97% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Trees, BST & AVL Balance Rotations', weight: '20 Marks', expectedQuestions: 'AVL Tree insertion with rotations (LL, RR, LR, RL), Tree traversals (In, Pre, Post)' },
        { unit: 'Unit 3', name: 'Graphs & Shortest Path Algorithms', weight: '16 Marks', expectedQuestions: 'Dijkstra single-source algorithm step table, Prim and Kruskal MST algorithms' }
      ],
      highYieldStrategy: 'Trees and Graphs carry 36 marks out of 60 in EST. Drawing clear step-by-step tree rebalances guarantees full marks on Section B.'
    },
    {
      id: 'rs-3-2',
      code: '22ECH-203',
      name: 'Digital Logic & Circuit Design',
      sem: 3,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '93% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Boolean Algebra, K-Maps & Logic Gates', weight: '18 Marks', expectedQuestions: '4-variable & 5-variable K-Map minimization with don\'t cares, Universal NAND/NOR' },
        { unit: 'Unit 2', name: 'Sequential Circuits & Flip-Flop Conversions', weight: '16 Marks', expectedQuestions: 'JK to D flip-flop excitation table conversion, 3-bit Synchronous Counter design' }
      ],
      highYieldStrategy: 'K-Maps and Flip-Flop excitation conversion tables have fixed algorithmic steps. Practice the 6 standard conversion templates.'
    }
  ],
  4: [
    {
      id: 'rs-4-1',
      code: '22CSH-204',
      name: 'Operating Systems',
      sem: 4,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '98% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'CPU Scheduling & Banker Safety Algorithm', weight: '20 Marks', expectedQuestions: 'Round Robin & SJF Gantt charts with average waiting time, Banker deadlock safety' },
        { unit: 'Unit 3', name: 'Virtual Memory & Page Replacement', weight: '18 Marks', expectedQuestions: 'FIFO, LRU, Optimal page fault counting with 3 frames, Belady anomaly explanation' }
      ],
      highYieldStrategy: 'Unit 2 and Unit 3 contain purely numerical questions (Gantt charts, Banker matrices, Page replacement). Solved numericals guarantee 38 marks.'
    },
    {
      id: 'rs-4-2',
      code: '23CSH-243',
      name: 'Database Management Systems',
      sem: 4,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '95% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Relational Model, Normalization (3NF/BCNF)', weight: '20 Marks', expectedQuestions: 'Attribute closure method, 3NF synthesis, BCNF lossless decomposition' },
        { unit: 'Unit 3', name: 'Transaction Management & ACID Properties', weight: '16 Marks', expectedQuestions: 'Two-Phase Locking (2PL), Conflict serializability precedence graph test' }
      ],
      highYieldStrategy: 'Normalization attribute closure and Precedence Graph serializability tests appear in every remedial paper without exception.'
    }
  ],
  5: [
    {
      id: 'rs-5-1',
      code: '21CSH-311',
      name: 'Design & Analysis of Algorithms',
      sem: 5,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '94% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Dynamic Programming (Knapsack & MCM)', weight: '20 Marks', expectedQuestions: '0/1 Knapsack matrix filling & backtracking, Matrix Chain Multiplication table' },
        { unit: 'Unit 1', name: 'Divide & Conquer and Master Theorem', weight: '16 Marks', expectedQuestions: 'Master theorem cases with recurrence relations, QuickSort worst-case analysis' }
      ],
      highYieldStrategy: 'Master Theorem (Unit 1) gives an easy 8 marks. 0/1 Knapsack & Matrix Chain (Unit 2) give 20 marks. Combined: 28 marks with 3 hours prep.'
    },
    {
      id: 'rs-5-2',
      code: '23CSH-312',
      name: 'Computer Networks',
      sem: 5,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '93% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'IP Addressing, Subnetting & Routing', weight: '20 Marks', expectedQuestions: 'VLSM Subnet division calculation, Distance Vector vs Link State routing' },
        { unit: 'Unit 3', name: 'Transport Layer Protocols (TCP/UDP)', weight: '16 Marks', expectedQuestions: 'TCP 3-way handshake diagram, Congestion control (Slow start, Congestion avoidance)' }
      ],
      highYieldStrategy: 'Subnetting numericals and the TCP 3-way handshake state diagram account for over 30 marks on every remedial exam.'
    }
  ],
  6: [
    {
      id: 'rs-6-1',
      code: '22CST-390',
      name: 'Theory of Computation',
      sem: 6,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '96% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Finite Automata (DFA, NFA & Subset Construction)', weight: '20 Marks', expectedQuestions: 'NFA with ε-moves to DFA conversion table, Regular Expression to DFA' },
        { unit: 'Unit 3', name: 'Turing Machines & Decidability', weight: '18 Marks', expectedQuestions: 'Turing Machine for 0^n 1^n 2^n design, Halting Problem proof by contradiction' }
      ],
      highYieldStrategy: 'Subset construction method (Unit 1) is a mechanical conversion table. Turing Machine (Unit 3) uses standard rewind logic. Easy 38 marks.'
    },
    {
      id: 'rs-6-2',
      code: '23CST-304',
      name: 'Compiler Design',
      sem: 6,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '91% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Syntax Analysis & LL(1) / LR Parsers', weight: '22 Marks', expectedQuestions: 'First & Follow calculation, LL(1) parsing table construction, LR(0) items' },
        { unit: 'Unit 4', name: 'Code Generation & Optimization', weight: '14 Marks', expectedQuestions: 'Three-Address Code (TAC) Quadruples and Triples, Basic Blocks DAG representation' }
      ],
      highYieldStrategy: 'First & Follow set calculation and Three-Address Code generation are guaranteed 20+ marks. Practice 4 grammar examples.'
    }
  ],
  7: [
    {
      id: 'rs-7-1',
      code: '22CST-354',
      name: 'Parallel & Distributed Computing',
      sem: 7,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '92% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Distributed Clocks & Mutual Exclusion', weight: '18 Marks', expectedQuestions: 'Lamport logical clocks and Vector clocks, Ricart-Agrawala mutual exclusion' },
        { unit: 'Unit 3', name: 'Distributed Transactions & Consensus', weight: '16 Marks', expectedQuestions: 'Two-Phase Commit (2PC) protocol state diagrams, Paxos consensus overview' }
      ],
      highYieldStrategy: 'Vector clocks numerical tracing and Two-Phase Commit message exchange flowcharts appear in 88% of remedial papers.'
    },
    {
      id: 'rs-7-2',
      code: '22CST-355',
      name: 'Information Security & Cryptography',
      sem: 7,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '94% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Public Key Cryptography & RSA', weight: '20 Marks', expectedQuestions: 'RSA algorithm key generation numerical, Diffie-Hellman Key Exchange steps' },
        { unit: 'Unit 3', name: 'Message Authentication & Digital Signatures', weight: '16 Marks', expectedQuestions: 'SHA-256 vs MD5 hash construction, HMAC operation and digital signature verification' }
      ],
      highYieldStrategy: 'RSA encryption/decryption numerical and Diffie-Hellman key exchange are guaranteed 20 marks in Section B.'
    }
  ],
  8: [
    {
      id: 'rs-8-1',
      code: '23CST-405',
      name: 'Digital Forensics',
      sem: 8,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '90% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 1', name: 'Forensic Investigation & Chain of Custody', weight: '18 Marks', expectedQuestions: 'Legal Chain of Custody 6-step protocol, Bit-stream image acquisition with write-blockers' },
        { unit: 'Unit 3', name: 'Operating System & Memory Forensics', weight: '16 Marks', expectedQuestions: 'Volatility framework analysis commands, Windows Registry forensic artifacts' }
      ],
      highYieldStrategy: 'Chain of Custody and Volatility CLI commands repeat on every paper. Memorize the 6 legal custody protocol steps.'
    },
    {
      id: 'rs-8-2',
      code: '23CST-407',
      name: 'Blockchain Technologies',
      sem: 8,
      estPassingMarks: '24 / 60 Marks in EST',
      totalPassingMarks: '40 / 100 Overall',
      passingConfidence: '92% Pass Probability with 2 Units',
      mustPassUnits: [
        { unit: 'Unit 2', name: 'Smart Contracts & Security Vulnerabilities', weight: '20 Marks', expectedQuestions: 'Reentrancy attack analysis and fix, Gas optimization in Solidity functions' },
        { unit: 'Unit 1', name: 'Distributed Ledgers & Consensus Mechanisms', weight: '16 Marks', expectedQuestions: 'Proof of Work vs Proof of Stake comparison, Merkle tree verification' }
      ],
      highYieldStrategy: 'Smart contract reentrancy vulnerability explanation and PoW vs PoS comparison guarantee 36 marks.'
    }
  ]
}

interface ReappearRescueSectionProps {
  initialTab?: 'pyqs' | 'notes' | 'questions' | 'syllabus'
  initialSem?: number
  isStandalonePage?: boolean
}

export default function ReappearRescueSection({
  initialTab = 'pyqs',
  initialSem = 4,
  isStandalonePage = false
}: ReappearRescueSectionProps) {
  const searchParams = useSearchParams()

  const [selectedSem, setSelectedSem] = useState<number>(initialSem)
  const [activeSubTab, setActiveSubTab] = useState<'pyqs' | 'notes' | 'questions' | 'syllabus'>(initialTab)
  const [previewResource, setPreviewResource] = useState<any | null>(null)

  // 1. Sync from URL Query Parameters
  useEffect(() => {
    if (!searchParams) return
    const tabParam = searchParams.get('tab')
    if (tabParam === 'pyqs') setActiveSubTab('pyqs')
    else if (tabParam === 'notes' || tabParam === 'materials') setActiveSubTab('notes')
    else if (tabParam === 'questions') setActiveSubTab('questions')
    else if (tabParam === 'syllabus') setActiveSubTab('syllabus')

    const semParam = searchParams.get('semester') || searchParams.get('sem')
    if (semParam && !isNaN(parseInt(semParam))) {
      setSelectedSem(parseInt(semParam))
    }
  }, [searchParams])

  // 2. Sync active semester from SemesterSwitcherPill
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prevu_active_semester')
      if (stored && !isNaN(parseInt(stored))) {
        setSelectedSem(parseInt(stored))
      }
    } catch {
      // ignore
    }

    const handleSemChange = (e: Event) => {
      const custom = e as CustomEvent<{ semester: number }>
      if (custom.detail?.semester) {
        setSelectedSem(custom.detail.semester)
      }
    }
    window.addEventListener('prevu_semester_change', handleSemChange)
    return () => window.removeEventListener('prevu_semester_change', handleSemChange)
  }, [])

  // 3. Listen to Reappear Tab Change Custom Event from HeaderNav
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const custom = e as CustomEvent<{ tab: 'pyqs' | 'notes' | 'questions' | 'syllabus' }>
      if (custom.detail?.tab) {
        setActiveSubTab(custom.detail.tab)
      }
    }
    window.addEventListener('prevu_reappear_tab_change', handleTabChange)
    return () => window.removeEventListener('prevu_reappear_tab_change', handleTabChange)
  }, [])

  // 4. Smooth scroll on hash anchor #reappear-rescue
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#reappear-rescue') {
      const el = document.getElementById('reappear-rescue')
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 150)
      }
    }
  }, [])

  const semesterPyqs = ALL_SEMESTER_REAPPEAR_PYQS[selectedSem] || []
  const semesterMaterials = ALL_SEMESTER_REAPPEAR_MATERIALS[selectedSem] || []
  const semesterQuestions = ALL_SEMESTER_REAPPEAR_QUESTIONS[selectedSem] || []
  const semesterSyllabus = ALL_SEMESTER_REAPPEAR_SYLLABUS[selectedSem] || []

  return (
    <section id="reappear-rescue" className="scroll-mt-16 sm:scroll-mt-20 py-14 sm:py-20 border-b border-[#30363d]/60 bg-[#090d13] font-mono relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[350px] bg-amber-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[350px] bg-rose-500/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] relative z-10">

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
            Specialized remedial question papers (PYQs), high-frequency repeated questions bank, passing blueprints, and concise one-night revision guides engineered to help you clear any semester backlog on the first attempt.
          </p>

          {/* 4 Primary Sub-Tabs: PYQs, 80/20 Notes, Question Bank, Syllabus & Passing Plan */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6">
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
              
              {/* Tab 1: Reappear PYQs */}
              <button
                type="button"
                onClick={() => setActiveSubTab('pyqs')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'pyqs'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-extrabold'
                    : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Reappear PYQs</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'pyqs' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                  Sem {selectedSem}
                </span>
              </button>

              {/* Tab 2: 80/20 Crash Notes */}
              <button
                type="button"
                onClick={() => setActiveSubTab('notes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'notes'
                    ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 font-extrabold'
                    : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>80/20 Crash Notes</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'notes' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                  One-Night
                </span>
              </button>

              {/* Tab 3: Reappear Questions Bank */}
              <button
                type="button"
                onClick={() => setActiveSubTab('questions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'questions'
                    ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30 font-extrabold'
                    : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Questions Bank</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'questions' ? 'bg-white/20 text-white' : 'bg-[#21262d] text-[#7d8590]'}`}>
                  High-Yield
                </span>
              </button>

              {/* Tab 4: Reappear Syllabus & Passing Plan */}
              <button
                type="button"
                onClick={() => setActiveSubTab('syllabus')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeSubTab === 'syllabus'
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 font-extrabold'
                    : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Syllabus &amp; Passing Plan</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeSubTab === 'syllabus' ? 'bg-white/20 text-white' : 'bg-[#21262d] text-[#7d8590]'}`}>
                  Blueprint
                </span>
              </button>
            </div>

            {/* Direct Upload Reappear Resource Action Button */}
            <Link
              href={`/upload?category=reappear&semester=${selectedSem}`}
              className="px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/25 border border-amber-300/40 cursor-pointer"
              title="Upload Reappear Question Papers, Notes, or Syllabi"
            >
              <Upload className="w-4 h-4 text-black" />
              <span>Upload Reappear Resource</span>
            </Link>
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

        {/* VIEW 1: REAPPEAR PYQS */}
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

                    {/* Verification Ribbon */}
                    <div className="mt-3 mb-2 p-2 rounded-xl bg-[#0d1117] border border-[#30363d]/60 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {paper.code[0]?.toUpperCase() || 'R'}
                        </div>
                        <div className="truncate">
                          <span className="text-white font-semibold truncate">
                            @{paper.demoResource?.users?.username || 'cu_remedial_topper'}
                          </span>
                          <span className="ml-1 text-[9px] text-amber-400 font-bold" title="CU Verified Scholar">✓</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        Remedial Key
                      </span>
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

        {/* VIEW 2: 80/20 REAPPEAR CRASH NOTES */}
        {activeSubTab === 'notes' && (
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

                    {/* Contributor Ribbon */}
                    <div className="mt-3 mb-2 p-2 rounded-xl bg-[#0d1117] border border-[#30363d]/60 flex items-center justify-between text-[11px] font-mono">
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {mat.code[0]?.toUpperCase() || 'M'}
                        </div>
                        <div className="truncate">
                          <span className="text-white font-semibold truncate">
                            @cu_topper_notes
                          </span>
                          <span className="ml-1 text-[9px] text-emerald-400 font-bold" title="CU Verified Scholar">✓</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        80/20 Guide
                      </span>
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

        {/* VIEW 3: REAPPEAR QUESTIONS BANK */}
        {activeSubTab === 'questions' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`reappear-questions-${selectedSem}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {semesterQuestions.map(q => (
                <div
                  key={q.id}
                  className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.12)] transition-all flex flex-col justify-between group text-left relative"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                      <span className="text-[10px] font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-purple-400" />
                        {q.repeatScore}
                      </span>
                      <span className="text-[10px] text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                        {q.marks}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-400 font-bold">{q.code}</span>
                        <span className="text-[10px] font-mono text-[#7d8590]">• {q.topic}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition-colors mt-0.5 leading-snug">
                        {q.name}
                      </h3>
                    </div>

                    {/* Question Prompt */}
                    <div className="p-3.5 rounded-xl bg-[#0d1117] border border-purple-500/20 text-[#e6edf3] text-xs leading-relaxed mb-4">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Repeated Exam Problem</span>
                      </div>
                      <p className="text-xs text-[#c9d1d9] font-sans font-medium">
                        &ldquo;{q.questionText}&rdquo;
                      </p>
                    </div>

                    {/* Solution Key Outline */}
                    <div className="p-3 rounded-xl bg-[#0d1117]/80 border border-[#30363d]/70 text-xs mb-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] block mb-1">
                        Passing Solution Outline:
                      </span>
                      <p className="text-[11px] text-[#8b949e] leading-relaxed">
                        {q.solutionSummary}
                      </p>
                    </div>

                    {/* Repetition History Tags */}
                    <div className="space-y-1 mb-2">
                      <span className="text-[10px] text-[#7d8590] font-semibold uppercase tracking-wider block">
                        Verified Exam Appearances:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {q.yearHistory.map(y => (
                          <span key={y} className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-amber-300/90 border border-amber-500/20">
                            {y}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/browse?search=${encodeURIComponent(q.code)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Solved Papers</span>
                    </Link>

                    <Link
                      href={`/study-material?search=${encodeURIComponent(q.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Study Notes</span>
                      <ChevronRight className="w-3 h-3 text-purple-400" />
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* VIEW 4: REAPPEAR SYLLABUS & PASSING PLAN */}
        {activeSubTab === 'syllabus' && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`reappear-syllabus-${selectedSem}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {semesterSyllabus.map(syl => (
                <div
                  key={syl.id}
                  className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-rose-500/50 hover:shadow-[0_0_25px_rgba(244,63,94,0.12)] transition-all flex flex-col justify-between group text-left relative"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                      <span className="text-[10px] font-bold text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-rose-400" />
                        {syl.passingConfidence}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                        EST Pass: {syl.estPassingMarks}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="text-xs text-rose-400 font-bold">{syl.code}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors mt-0.5 leading-snug">
                        {syl.name}
                      </h3>
                      <div className="text-[11px] text-[#7d8590] mt-1">
                        Minimum Passing Threshold: <span className="text-white font-semibold">{syl.totalPassingMarks}</span>
                      </div>
                    </div>

                    {/* Must-Pass Priority Units */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] block">
                        Priority 1 Passing Units (Guaranteed High-Yield):
                      </span>
                      {syl.mustPassUnits.map((u, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#0d1117] border border-rose-500/20 text-xs space-y-1">
                          <div className="flex items-center justify-between text-white font-bold">
                            <span className="text-rose-300">{u.unit}: {u.name}</span>
                            <span className="text-amber-400 font-mono text-[11px]">{u.weight}</span>
                          </div>
                          <p className="text-[11px] text-[#8b949e]">
                            Expected Prompts: {u.expectedQuestions}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* High Yield Strategy */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent border border-rose-500/25 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block mb-1 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-rose-400" />
                        80/20 One-Night Passing Strategy:
                      </span>
                      <p className="text-xs text-[#c9d1d9] leading-relaxed">
                        {syl.highYieldStrategy}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <Link
                      href={`/study-material?search=${encodeURIComponent(syl.code)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Passing Notes</span>
                    </Link>

                    <Link
                      href={`/browse?search=${encodeURIComponent(syl.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Practice PYQs</span>
                      <ChevronRight className="w-3 h-3 text-rose-400" />
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
              <span className="text-white font-bold block">Need a paper or passing key not in the Sem {selectedSem} Vault?</span>
              <span className="text-[11px] text-[#7d8590]">Request emergency peer solved papers with guaranteed senior verification within 24 hours.</span>
            </div>
          </div>
          <Link
            href="/requests"
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-amber-400 hover:text-amber-300 font-bold border border-amber-500/40 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
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
