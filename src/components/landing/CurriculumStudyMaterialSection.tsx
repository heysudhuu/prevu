'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  CheckCircle2,
  Eye,
  ArrowRight,
  Filter,
  Download,
  FileCheck,
  Star,
  Layers,
  Sparkles,
  ChevronRight,
  GraduationCap,
  Search
} from 'lucide-react'

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

export interface SemesterStudyNoteItem {
  id: string
  code: string
  name: string
  title: string
  category: 'handwritten' | 'formula' | 'lab' | 'summary'
  pages: string
  size: string
  author: string
  rating: number
  keyUnits: string[]
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

// Complete Study Material Repository for All 8 Semesters
export const ALL_SEMESTER_STUDY_MATERIALS: Record<number, SemesterStudyNoteItem[]> = {
  1: [
    {
      id: 'note-1-1',
      code: '22MAT-101',
      name: 'Engineering Mathematics - I',
      title: 'Complete Handwritten Notes: Matrices, Calculus & Beta-Gamma',
      category: 'handwritten',
      pages: '48 Pages',
      size: '5.2 MB',
      author: 'Senior Scholar (9.8 CGPA Topper)',
      rating: 4.9,
      keyUnits: ['Cayley-Hamilton Proofs', 'Maclaurin Expansion', 'Double Integrals', 'Beta-Gamma Formulas'],
      demoResource: {
        id: 'math1-notes-demo',
        exam_year: 2024,
        original_filename: 'Engg_Maths_I_Handwritten_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - I', code: '22MAT-101', semester: 1 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-1-2',
      code: '22PHY-101',
      name: 'Engineering Physics',
      title: 'Quick Derivation Sheet: Lasers, Fiber Optics & Quantum Packet',
      category: 'formula',
      pages: '18 Pages',
      size: '2.1 MB',
      author: 'Physics Honors Lead',
      rating: 4.8,
      keyUnits: ['He-Ne Laser Derivation', 'Numerical Aperture Formula', 'Schrodinger Wave Equation'],
      demoResource: {
        id: 'phy-notes-demo',
        exam_year: 2024,
        original_filename: 'Physics_Derivations_CheatSheet.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Physics', code: '22PHY-101', semester: 1 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Physics Cell', username: 'prevu_phy', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-1-3',
      code: '22CS101',
      name: 'Programming for Problem Solving (C)',
      title: 'C Programming Lab Manual & 50 Most Repeated Viva Questions',
      category: 'lab',
      pages: '32 Pages',
      size: '3.4 MB',
      author: 'Coding Lab Mentor',
      rating: 4.7,
      keyUnits: ['Pointers & Dynamic Memory', 'Structures & Unions', 'File Handling Functions'],
      demoResource: {
        id: 'c-notes-demo',
        exam_year: 2024,
        original_filename: 'C_Programming_Lab_Manual.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Programming for Problem Solving', code: '22CS101', semester: 1 },
        exam_types: { name: 'Lab Manual' },
        users: { name: 'Prevu Code Lab', username: 'prevu_cse', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-1-4',
      code: '22EE101',
      name: 'Basic Electrical & Electronics',
      title: 'All Circuit Theorems & AC Analysis Formula Summary',
      category: 'formula',
      pages: '22 Pages',
      size: '2.6 MB',
      author: 'EE Gold Medalist',
      rating: 4.8,
      keyUnits: ['Thevenin & Norton Steps', 'Star-Delta Conversion', 'Transformer Phasor Diagrams'],
      demoResource: {
        id: 'ee-notes-demo',
        exam_year: 2024,
        original_filename: 'EE_Formula_CheatSheet.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Basic Electrical & Electronics', code: '22EE101', semester: 1 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu EE Lead', username: 'prevu_ee', cu_verified: true, role: 'admin' }
      }
    }
  ],
  2: [
    {
      id: 'note-2-1',
      code: '22MAT-102',
      name: 'Engineering Mathematics - II',
      title: 'Laplace & Fourier Master Workbook with 40 Solved Problems',
      category: 'handwritten',
      pages: '52 Pages',
      size: '5.8 MB',
      author: 'CU Math Dept Senior',
      rating: 4.9,
      keyUnits: ['Laplace Unit Step Shift', 'Fourier Half Range Expansions', 'First Order ODEs'],
      demoResource: {
        id: 'math2-notes-demo',
        exam_year: 2024,
        original_filename: 'Maths_II_Laplace_Fourier_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Mathematics - II', code: '22MAT-102', semester: 2 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Academic Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-2-2',
      code: '22CSH-102',
      name: 'OOP with C++',
      title: 'Complete C++ OOPs Blueprint: Concepts, Diagrams & Code',
      category: 'summary',
      pages: '36 Pages',
      size: '3.9 MB',
      author: 'C++ Systems Programmer',
      rating: 4.8,
      keyUnits: ['Polymorphism & V-Tables', 'Exception Handling', 'Templates & STL Vectors/Maps'],
      demoResource: {
        id: 'cpp-notes-demo',
        exam_year: 2024,
        original_filename: 'OOP_Cpp_Complete_Blueprint.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'OOP with C++', code: '22CSH-102', semester: 2 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Code Lab', username: 'prevu_cpp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-2-3',
      code: '22CHY-101',
      name: 'Engineering Chemistry',
      title: 'Engineering Chemistry Crash Summary & Water Hardness Numericals',
      category: 'formula',
      pages: '24 Pages',
      size: '2.8 MB',
      author: 'Science Team Senior',
      rating: 4.7,
      keyUnits: ['EDTA Hardness Calculations', 'Polymer Synthesis', 'Corrosion Prevention Methods'],
      demoResource: {
        id: 'chem-notes-demo',
        exam_year: 2024,
        original_filename: 'Chemistry_Formula_Guide.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Chemistry', code: '22CHY-101', semester: 2 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Sciences', username: 'prevu_chem', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-2-4',
      code: '22ME101',
      name: 'Engineering Graphics & Design',
      title: 'AutoCAD & Manual Drawing Projection Principles Guide',
      category: 'lab',
      pages: '28 Pages',
      size: '4.2 MB',
      author: 'CAD Society President',
      rating: 4.6,
      keyUnits: ['Projection of Solids', 'Sectional Views', 'Isometric Drawing Shortcuts'],
      demoResource: {
        id: 'cad-notes-demo',
        exam_year: 2024,
        original_filename: 'Graphics_Projection_Manual.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Engineering Graphics', code: '22ME101', semester: 2 },
        exam_types: { name: 'Lab Manual' },
        users: { name: 'Prevu CAD Lead', username: 'prevu_cad', cu_verified: true, role: 'admin' }
      }
    }
  ],
  3: [
    {
      id: 'note-3-1',
      code: '22CS201',
      name: 'Data Structures & Algorithms',
      title: 'Visual DSA Guide: Trees, Rotations, Graphs & Sorting Complexity',
      category: 'handwritten',
      pages: '56 Pages',
      size: '6.4 MB',
      author: 'Senior Coding Lead (9.9 CGPA)',
      rating: 4.95,
      keyUnits: ['AVL Tree Rotations', 'Dijkstra & Prim-Kruskal', 'Red-Black Tree Insertion', 'B-Tree Splitting'],
      demoResource: {
        id: 'dsa-notes-demo',
        exam_year: 2024,
        original_filename: 'DSA_Visual_Handwritten_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Data Structures & Algorithms', code: '22CS201', semester: 3 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Code Lab', username: 'prevu_dsa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-3-2',
      code: '22CSH-201',
      name: 'Java OOPs & Design Patterns',
      title: 'Java Master Class: Collections, Concurrency & Design Patterns',
      category: 'summary',
      pages: '42 Pages',
      size: '4.5 MB',
      author: 'Java Backend Architect',
      rating: 4.9,
      keyUnits: ['Singleton & Factory Pattern', 'Custom Exceptions', 'ExecutorService & ThreadPools'],
      demoResource: {
        id: 'java-notes-demo',
        exam_year: 2024,
        original_filename: 'Java_OOPs_Design_Patterns.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Java OOPs & Design Patterns', code: '22CSH-201', semester: 3 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Java Lead', username: 'prevu_java', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-3-3',
      code: '22MAT-201',
      name: 'Discrete Mathematics',
      title: 'Discrete Math Complete Theorems & Graph Algorithms Sheet',
      category: 'formula',
      pages: '26 Pages',
      size: '2.9 MB',
      author: 'Discrete Math Honors',
      rating: 4.8,
      keyUnits: ['Pigeonhole Principle', 'Euler & Hamiltonian Graphs', 'Recurrence Relations'],
      demoResource: {
        id: 'dm-notes-demo',
        exam_year: 2024,
        original_filename: 'Discrete_Math_Theorems.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Discrete Mathematics', code: '22MAT-201', semester: 3 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Math Cell', username: 'prevu_math', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-3-4',
      code: '22EC201',
      name: 'Digital Electronics & Logic',
      title: 'Digital Logic Gate Simplification & Flip-Flop Conversion Notes',
      category: 'handwritten',
      pages: '34 Pages',
      size: '3.7 MB',
      author: 'Hardware Lead Senior',
      rating: 4.7,
      keyUnits: ['4-Variable K-Map Minimization', 'Synchronous Counter Design', 'Master-Slave JK Flip-Flop'],
      demoResource: {
        id: 'de-notes-demo',
        exam_year: 2024,
        original_filename: 'Digital_Logic_Design_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Digital Electronics', code: '22EC201', semester: 3 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu ECE Lead', username: 'prevu_ece', cu_verified: true, role: 'admin' }
      }
    }
  ],
  4: [
    {
      id: 'note-4-1',
      code: '23CSH-242',
      name: 'Operating Systems',
      title: 'Operating Systems Ultimate Revision Guide & All Solved Numericals',
      category: 'handwritten',
      pages: '54 Pages',
      size: '6.1 MB',
      author: 'Linux Kernel Contributor (CSE Topper)',
      rating: 4.95,
      keyUnits: ['Banker Algorithm Steps', 'CPU Scheduling Gantt Charts', 'LRU/FIFO Paging', 'Disk Head Algorithms'],
      demoResource: {
        id: 'os-notes-demo',
        exam_year: 2024,
        original_filename: 'Operating_Systems_Ultimate_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Operating Systems', code: '23CSH-242', semester: 4 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Systems Lab', username: 'prevu_os', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-4-2',
      code: '23CSH-243',
      name: 'Database Management Systems',
      title: 'DBMS Normalization & Relational Algebra Step-by-Step Blueprint',
      category: 'summary',
      pages: '44 Pages',
      size: '4.8 MB',
      author: 'Database Administrator Scholar',
      rating: 4.9,
      keyUnits: ['BCNF & 3NF Lossless Testing', 'Precedence Graphs for Concurrency', 'ER-to-Relational Mapping'],
      demoResource: {
        id: 'dbms-notes-demo',
        exam_year: 2024,
        original_filename: 'DBMS_Normalization_Blueprint.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Database Management Systems', code: '23CSH-243', semester: 4 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Data Team', username: 'prevu_dbms', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-4-3',
      code: '23CSH-244',
      name: 'Computer Organization & Architecture',
      title: 'COA Cache Mapping, Pipelining Hazard & Booth Algorithm Sheets',
      category: 'formula',
      pages: '30 Pages',
      size: '3.5 MB',
      author: 'Computer Architecture Lead',
      rating: 4.8,
      keyUnits: ['Set Associative Cache Numericals', 'Direct vs Associative Mapping', 'Booth Multiplication Table'],
      demoResource: {
        id: 'coa-notes-demo',
        exam_year: 2024,
        original_filename: 'COA_Architecture_Formulas.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Organization', code: '23CSH-244', semester: 4 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Hardware Cell', username: 'prevu_coa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-4-4',
      code: '23CST-247',
      name: 'Agile Software Engineering',
      title: 'Agile Scrum Artifacts, Sprint Ceremonies & Testing QA Guide',
      category: 'summary',
      pages: '32 Pages',
      size: '3.6 MB',
      author: 'Agile Certified Practitioner Senior',
      rating: 4.7,
      keyUnits: ['Scrum Framework & Roles', 'User Stories & Story Points', 'Whitebox vs Blackbox Testing'],
      demoResource: {
        id: 'agile-notes-demo',
        exam_year: 2024,
        original_filename: 'Agile_Engineering_Summary.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Agile Software Engineering', code: '23CST-247', semester: 4 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu DevOps Team', username: 'prevu_agile', cu_verified: true, role: 'admin' }
      }
    }
  ],
  5: [
    {
      id: 'note-5-1',
      code: '21CSH-311',
      name: 'Design & Analysis of Algorithms',
      title: 'DAA Master Derivations: Dynamic Programming & Greedy Proofs',
      category: 'handwritten',
      pages: '62 Pages',
      size: '7.1 MB',
      author: 'Competitive Programming Lead',
      rating: 4.95,
      keyUnits: ['0/1 Knapsack & Matrix Chain Multiplication', 'Bellman-Ford & Floyd-Warshall', 'NP-Completeness Proofs'],
      demoResource: {
        id: 'daa-notes-demo',
        exam_year: 2024,
        original_filename: 'DAA_Master_Notes_Algorithms.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Design and Analysis of Algorithms', code: '21CSH-311', semester: 5 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Algorithms Cell', username: 'prevu_daa', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-5-2',
      code: '23CSH-312',
      name: 'Computer Networks',
      title: 'Subnetting Cheat Sheet & Complete Protocol Architecture Packet',
      category: 'formula',
      pages: '38 Pages',
      size: '4.1 MB',
      author: 'Cisco Certified Senior Scholar',
      rating: 4.9,
      keyUnits: ['VLSM Subnetting 30-Sec Formula', 'Distance Vector vs Link State', 'TCP Slow Start Congestion'],
      demoResource: {
        id: 'cn-notes-demo',
        exam_year: 2024,
        original_filename: 'Computer_Networks_Protocols_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Computer Networks', code: '23CSH-312', semester: 5 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Networks Team', username: 'prevu_cn', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-5-3',
      code: '23CSH-313',
      name: 'Web Technologies & Full Stack',
      title: 'Modern Full-Stack Notes: React 18, Express, Node.js & MongoDB',
      category: 'summary',
      pages: '45 Pages',
      size: '4.9 MB',
      author: 'Full-Stack Developer Lead',
      rating: 4.8,
      keyUnits: ['React Component Lifecycle & Hooks', 'JWT Authentication Flow', 'Mongoose Schema Validation'],
      demoResource: {
        id: 'web-notes-demo',
        exam_year: 2024,
        original_filename: 'Web_Technologies_FullStack.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Web Technologies', code: '23CSH-313', semester: 5 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Web Lab', username: 'prevu_web', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-5-4',
      code: '23CST-314',
      name: 'Theory of Computation (TOC)',
      title: 'Automata Design Blueprint: 25 Standard Language DFA & CFGs',
      category: 'handwritten',
      pages: '40 Pages',
      size: '4.4 MB',
      author: 'TOC Honors Scholar',
      rating: 4.85,
      keyUnits: ['NFA to DFA Subset Construction', 'Chomsky Normal Form Conversion', 'Pushdown Automata Transitions'],
      demoResource: {
        id: 'toc-notes-demo',
        exam_year: 2024,
        original_filename: 'TOC_Automata_Design_Guide.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Theory of Computation', code: '23CST-314', semester: 5 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_toc', cu_verified: true, role: 'admin' }
      }
    }
  ],
  6: [
    {
      id: 'note-6-1',
      code: '22CST-390',
      name: 'Automata Theory & Computability',
      title: 'Advanced TOC: Turing Machines, Halting Problem & Undecidability',
      category: 'handwritten',
      pages: '46 Pages',
      size: '5.1 MB',
      author: 'Senior Theory Researcher',
      rating: 4.9,
      keyUnits: ['Turing Machine Transition Diagrams', 'Pumping Lemma Contradiction Guide', 'Post Correspondence Problem'],
      demoResource: {
        id: 'automata-notes-demo',
        exam_year: 2024,
        original_filename: 'Advanced_Automata_Computability.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Automata Theory', code: '22CST-390', semester: 6 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Theory Cell', username: 'prevu_automata', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-6-2',
      code: '23CST-304',
      name: 'Compiler Design',
      title: 'Compiler Construction: Parsing Tables, LR Items & DAG Generation',
      category: 'summary',
      pages: '44 Pages',
      size: '4.8 MB',
      author: 'Systems Compiler Lead',
      rating: 4.85,
      keyUnits: ['First & Follow Sets Calculation', 'LR(0), SLR(1), CLR(1) Parsing', 'Three-Address Code Generation'],
      demoResource: {
        id: 'compiler-notes-demo',
        exam_year: 2024,
        original_filename: 'Compiler_Design_Complete_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Compiler Design', code: '23CST-304', semester: 6 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Compilers Lead', username: 'prevu_compiler', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-6-3',
      code: '23CST-305',
      name: 'Cloud Computing Architecture',
      title: 'Cloud Architecture Cheatsheet: AWS, Azure & Docker Kubernetes',
      category: 'formula',
      pages: '32 Pages',
      size: '3.7 MB',
      author: 'AWS Solutions Architect Senior',
      rating: 4.8,
      keyUnits: ['Cloud Service & Deployment Models', 'Hypervisor Type-1 vs Type-2', 'Containerization & Kubernetes Pods'],
      demoResource: {
        id: 'cloud-notes-demo',
        exam_year: 2024,
        original_filename: 'Cloud_Computing_Architecture.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cloud Computing', code: '23CST-305', semester: 6 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Cloud Cell', username: 'prevu_cloud', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-6-4',
      code: '23CSH-306',
      name: 'Artificial Intelligence & ML',
      title: 'AI Search Algorithms & Supervised Learning Math Summary',
      category: 'summary',
      pages: '42 Pages',
      size: '4.6 MB',
      author: 'AI Research Scholar',
      rating: 4.9,
      keyUnits: ['A* Search Heuristics Proof', 'Alpha-Beta Pruning Walkthrough', 'Linear & Logistic Regression Cost'],
      demoResource: {
        id: 'aiml-notes-demo',
        exam_year: 2024,
        original_filename: 'AI_ML_Algorithms_Notes.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Artificial Intelligence', code: '23CSH-306', semester: 6 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu AI Team', username: 'prevu_ai', cu_verified: true, role: 'admin' }
      }
    }
  ],
  7: [
    {
      id: 'note-7-1',
      code: '22CST-354',
      name: 'Parallel & Distributed Computing',
      title: 'Parallel Computing: OpenMP, MPI & Multi-Core Programming Guide',
      category: 'handwritten',
      pages: '38 Pages',
      size: '4.3 MB',
      author: 'HPC Research Assistant',
      rating: 4.85,
      keyUnits: ['Flynn Taxonomy Architectures', 'Amdahl Law vs Gustafson Law', 'MPI Send/Recv Point-to-Point'],
      demoResource: {
        id: 'pdc-notes-demo',
        exam_year: 2024,
        original_filename: 'Parallel_Distributed_Computing.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Parallel & Distributed Computing', code: '22CST-354', semester: 7 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Distributed Cell', username: 'prevu_dist', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-7-2',
      code: '23CST-401',
      name: 'Deep Learning & Neural Networks',
      title: 'Deep Learning Visual Guide: CNN, RNN, Transformers & Backprop',
      category: 'summary',
      pages: '50 Pages',
      size: '5.6 MB',
      author: 'Deep Learning Lead',
      rating: 4.95,
      keyUnits: ['Gradient Descent & Optimizers (Adam)', 'Convolution Pooling Math', 'Self-Attention Mechanism'],
      demoResource: {
        id: 'dl-notes-demo',
        exam_year: 2024,
        original_filename: 'Deep_Learning_Neural_Networks.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Deep Learning', code: '23CST-401', semester: 7 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu DL Lab', username: 'prevu_dl', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-7-3',
      code: 'FSO-307',
      name: 'Cyber Security Essentials',
      title: 'Cybersecurity Cheat Sheet: Cryptography, Exploits & Defenses',
      category: 'formula',
      pages: '30 Pages',
      size: '3.4 MB',
      author: 'Certified Ethical Hacker Senior',
      rating: 4.8,
      keyUnits: ['RSA Key Generation Math', 'Diffie-Hellman Key Exchange', 'SQL Injection & XSS Mitigations'],
      demoResource: {
        id: 'cyber-notes-demo',
        exam_year: 2024,
        original_filename: 'Cybersecurity_Essentials_CheatSheet.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Security Essentials', code: 'FSO-307', semester: 7 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Security Cell', username: 'prevu_cyber', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-7-4',
      code: '23CST-403',
      name: 'Distributed Systems',
      title: 'Distributed Systems Consensus: Paxos, Raft & Vector Clocks',
      category: 'summary',
      pages: '36 Pages',
      size: '4.1 MB',
      author: 'Distributed Systems Architect',
      rating: 4.85,
      keyUnits: ['CAP Theorem Proof & PACELC', 'Raft Leader Election States', 'Consistent Hashing in Ring'],
      demoResource: {
        id: 'ds-notes-demo',
        exam_year: 2024,
        original_filename: 'Distributed_Systems_Consensus.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Distributed Systems', code: '23CST-403', semester: 7 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Systems Lab', username: 'prevu_ds', cu_verified: true, role: 'admin' }
      }
    }
  ],
  8: [
    {
      id: 'note-8-1',
      code: '23CST-405',
      name: 'Cyber Forensics & Threat Hunting',
      title: 'Digital Forensics Field Manual: Evidence Chain, Tools & Registry',
      category: 'summary',
      pages: '42 Pages',
      size: '4.7 MB',
      author: 'Forensic Investigator Scholar',
      rating: 4.85,
      keyUnits: ['Chain of Custody Legal Rules', 'Windows Registry Forensics', 'Memory Artifact Analysis'],
      demoResource: {
        id: 'forensics-notes-demo',
        exam_year: 2024,
        original_filename: 'Cyber_Forensics_Field_Manual.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Cyber Forensics', code: '23CST-405', semester: 8 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu Forensics Lab', username: 'prevu_forensics', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-8-2',
      code: '23CST-406',
      name: 'Natural Language Processing',
      title: 'NLP & LLM Architectures: Word2Vec, BERT & Generative Pre-training',
      category: 'summary',
      pages: '48 Pages',
      size: '5.3 MB',
      author: 'Senior NLP Researcher',
      rating: 4.9,
      keyUnits: ['TF-IDF & N-gram Language Models', 'Word2Vec Skip-gram Math', 'BERT Masked Language Modeling'],
      demoResource: {
        id: 'nlp-notes-demo',
        exam_year: 2024,
        original_filename: 'NLP_Architectures_Handbook.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Natural Language Processing', code: '23CST-406', semester: 8 },
        exam_types: { name: 'Topper Notes' },
        users: { name: 'Prevu NLP Lab', username: 'prevu_nlp', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-8-3',
      code: '23CST-407',
      name: 'Blockchain Technologies',
      title: 'Solidity Smart Contracts & Cryptographic Consensus Guide',
      category: 'formula',
      pages: '34 Pages',
      size: '3.8 MB',
      author: 'Web3 Protocol Engineer Senior',
      rating: 4.8,
      keyUnits: ['EVM Opcodes & Gas Optimization', 'ERC-20 & ERC-721 Standards', 'Proof of Stake vs PoW'],
      demoResource: {
        id: 'blockchain-notes-demo',
        exam_year: 2024,
        original_filename: 'Blockchain_Solidity_Guide.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Blockchain Technologies', code: '23CST-407', semester: 8 },
        exam_types: { name: 'Formula Sheet' },
        users: { name: 'Prevu Web3 Cell', username: 'prevu_crypto', cu_verified: true, role: 'admin' }
      }
    },
    {
      id: 'note-8-4',
      code: '23CAP-408',
      name: 'Major Capstone Project Defense',
      title: 'Senior Capstone Survival Blueprint: Viva Questions & Rubric Sheet',
      category: 'lab',
      pages: '26 Pages',
      size: '3.0 MB',
      author: 'Capstone Committee Senior',
      rating: 4.95,
      keyUnits: ['Top 30 Examiner Viva Questions', 'Software Architecture Diagrams', 'Deployment & Evaluation Metrics'],
      demoResource: {
        id: 'capstone-notes-demo',
        exam_year: 2024,
        original_filename: 'Capstone_Defense_Viva_Guide.pdf',
        file_type: 'application/pdf',
        subjects: { name: 'Major Capstone Project', code: '23CAP-408', semester: 8 },
        exam_types: { name: 'Lab Manual' },
        users: { name: 'Prevu Capstone Team', username: 'prevu_capstone', cu_verified: true, role: 'admin' }
      }
    }
  ]
}

export default function CurriculumStudyMaterialSection() {
  const [selectedSem, setSelectedSem] = useState<number>(3)
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [previewResource, setPreviewResource] = useState<any | null>(null)

  const semesterMaterials = ALL_SEMESTER_STUDY_MATERIALS[selectedSem] || []

  const filteredMaterials = semesterMaterials.filter(item => {
    const matchesFilter = categoryFilter === 'ALL' || item.category === categoryFilter
    const matchesSearch = searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <section id="curriculum-study-material" className="py-14 sm:py-20 border-b border-[#30363d]/60 bg-[#0d1117] font-mono relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute right-1/4 top-0 w-[500px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#161b22] border border-cyan-500/30 text-cyan-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>CURATED ACADEMIC REPOSITORY // SEMESTERS 1 TO 8</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Study Material &amp; Topper Notes
            </h2>
            <p className="text-xs sm:text-sm text-[#7d8590] mt-1 max-w-2xl">
              Handwritten summaries, formula cheatsheets, and unit-wise blueprints authored by 9.5+ CGPA senior scholars and verified by department toppers.
            </p>
          </div>

          <Link
            href={`/study-material?sem=${selectedSem}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-white px-4 py-2 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 transition-all shrink-0 cursor-pointer"
          >
            <span>Explore Sem {selectedSem} Notes</span>
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
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                  : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white hover:border-[#7d8590]'
                }`}
            >
              <span>Semester {sem}</span>
            </button>
          ))}
        </div>

        {/* Controls Bar: Category Filter & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#161b22] border border-[#30363d] mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-hide text-xs">
            <span className="text-[11px] text-[#7d8590] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Type:
            </span>
            {[
              { id: 'ALL', label: 'All Notes' },
              { id: 'handwritten', label: 'Handwritten' },
              { id: 'formula', label: 'Formula Sheets' },
              { id: 'summary', label: 'Unit Summaries' },
              { id: 'lab', label: 'Lab & Viva' }
            ].map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setCategoryFilter(type.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${categoryFilter === type.id
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-[#0d1117] text-[#7d8590] hover:text-white border border-[#30363d]'
                  }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#7d8590] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search Sem ${selectedSem} notes...`}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#7d8590] focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Study Materials Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedSem}-${categoryFilter}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)] transition-all flex flex-col justify-between group text-left relative"
              >
                <div>
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#30363d]/60">
                    <span className="text-[11px] font-bold text-cyan-400">
                      {mat.code}
                    </span>
                    <span className="text-[10px] text-[#7d8590]">
                      {mat.pages} • {mat.size}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2 leading-snug">
                    {mat.title}
                  </h3>

                  <div className="text-[11px] text-[#7d8590] mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{mat.author}</span>
                  </div>

                  {/* Highlights */}
                  <div className="p-2.5 rounded-xl bg-[#0d1117] border border-[#30363d]/60 mb-4 space-y-1">
                    <span className="text-[9px] uppercase tracking-wider text-[#7d8590] font-bold block mb-1">
                      Key Highlights:
                    </span>
                    {mat.keyUnits.slice(0, 3).map((u, i) => (
                      <div key={i} className="text-[10px] text-[#c9d1d9] flex items-center gap-1 truncate">
                        <CheckCircle2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{u}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#7d8590] mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {mat.rating} / 5.0
                    </span>
                    <span className="text-cyan-400 text-[10px] font-bold">Verified PDF</span>
                  </div>

                  <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewResource(mat.demoResource)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-600/30 font-mono"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read Notes</span>
                    </button>

                    <Link
                      href={`/study-material?search=${encodeURIComponent(mat.code)}`}
                      className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                    >
                      <span>Vault</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#161b22] border border-[#30363d] text-[#7d8590]">
            <BookOpen className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No study materials matching this filter.</p>
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

