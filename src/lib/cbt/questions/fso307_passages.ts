import { CbtQuestion } from '../types'

const PASSAGE_1 = `[CASE PASSAGE 1 • LIVE INCIDENT RESPONSE & DISK FORENSICS]
Corporate R&D Insider Exfiltration Investigation

At 2:15 AM, an automated Security Information and Event Management (SIEM) system flagged unusual outbound data transfers from a senior engineer's Windows workstation to an unrecognized external IP address. When the incident response team arrived at the desk, the workstation was still powered on, and an external USB flash drive was connected. Before disconnecting the power cable, the lead analyst acquired a live RAM dump and captured active network socket logs. Once powered down, the analyst removed the internal NVMe SSD, attached it to a hardware write-blocker, created a bit-stream forensic image, and generated a SHA-256 hash. Subsequent examination revealed confidential CAD blueprints emptied from the Recycle Bin, while hidden timestamps in file metadata showed the files were staged just minutes before the outbound transfer.`

const PASSAGE_2 = `[CASE PASSAGE 2 • NETWORK FORENSICS & RANSOMWARE INTRUSION]
Hospital Network Breach & Lateral Movement Analysis

A regional hospital suffered a ransomware attack that encrypted clinical scheduling servers overnight. Network security engineers provided forensic investigators with full packet capture (PCAP) logs recorded at the perimeter firewall and core switches over the preceding 48 hours. Using Wireshark, investigators filtered TCP/IP traffic and identified an initial spear-phishing email attachment downloaded via HTTP on a reception PC. Within 20 minutes of the download, the compromised host initiated rapid SMB and RDP scans across internal subnets, followed by an outbound DNS tunneling session to a command-and-control (C2) domain. By correlating firewall timestamps with server authentication logs, analysts traced the exact patient zero host and isolated the affected VLAN.`

const PASSAGE_3 = `[CASE PASSAGE 3 • MOBILE DEVICE FORENSICS & EVIDENCE HANDLING]
Seized Smartphone Analysis in a Financial Fraud Case

During a warrant execution in an online investment fraud investigation, law enforcement officers seized a suspect's unlocked Android smartphone. To prevent remote wipe commands over cellular or Wi-Fi networks, the first responder immediately placed the device into Airplane Mode and stored it inside a radio-frequency (RF) shielding Faraday bag. At the digital forensics laboratory, examiners documented every transfer of the phone on a chain-of-custody log. Technicians first performed a logical extraction to capture active SMS messages, call logs, and installed app lists, followed by a physical extraction to obtain a complete bit-for-bit image of the flash storage, recovering deleted SQLite chat databases and cached banking screenshots. The SIM card was also cloned to inspect subscriber identity data without altering the original card.`

const PASSAGE_4 = `[CASE PASSAGE 4 • STEGANOGRAPHY & STORAGE CALCULATION FORENSICS]
Covert Intellectual Property Smuggling via Image Files

An internal audit at a defense contractor revealed that an employee was uploading high-resolution JPEG product photos to a personal cloud blog every Friday evening. Although the images appeared normal visually, forensic analysts ran steganography detection tools and discovered encrypted source-code archives embedded inside the least significant bits (LSBs) of the image pixels. On the suspect's workstation, investigators located a hidden partition formatted with a 4 KB block size containing 2,048 allocated blocks of staged archives, alongside a master evidence container file measuring 3.5 GB. Following agency redundancy policy, examiners had to create four separate forensic duplicates of the 3.5 GB container on verified clean media and document every step in the final forensic report.`

const PASSAGE_5 = `[CASE PASSAGE 5 • AI IN CYBERSECURITY: ANOMALY DETECTION & INSIDER THREATS]
Behavioral Analytics & Unsupervised Clustering in Banking Security

A multinational bank deployed an AI-driven Security Operations Center (SOC) platform to monitor millions of daily employee login events, database queries, and file transfers. Because zero-day insider misuse rarely matches known attack signatures, security architects trained unsupervised K-Means clustering models on six months of historical employee activity to establish baseline behavioral profiles. One Tuesday at 3:40 AM, the User and Entity Behavior Analytics (UEBA) engine flagged an operations clerk whose account suddenly queried 14,000 customer credit records from an unusual internal subnet and exported them to a local staging folder. Real-time analytics immediately triggered an automated session lock, alerting SOC analysts to intervene before external exfiltration occurred.`

const PASSAGE_6 = `[CASE PASSAGE 6 • AI IN CYBERSECURITY: NLP, SUPERVISED LEARNING & THREAT INTELLIGENCE]
Automated Phishing Defense & Threat Intelligence Pipeline

A global e-commerce enterprise faced a surge in targeted spear-phishing emails impersonating executive leadership and payment vendors. To defend its 40,000 employees, the cybersecurity team built a multi-stage AI email filtering and threat intelligence pipeline. First, a Natural Language Processing (NLP) engine analyzed email subject lines, urgent linguistic cues, and unstructured threat feeds from dark-web forums. Next, a supervised Random Forest classifier—trained on 500,000 labeled benign and malicious emails after careful feature selection—scored incoming messages in milliseconds. Finally, a reinforcement learning agent dynamically adjusted quarantine thresholds based on feedback from SOC analyst verifications and false-positive reports.`

const PASSAGE_7 = `[CASE PASSAGE 7 • AI ETHICS, BIAS & DEPLOYMENT CHALLENGES]
Auditing an AI Automated Intrusion Prevention System

A telecommunications provider deployed a deep learning neural network to automatically detect malware binaries and block suspicious customer connections in real time. While the deep learning model excelled at automated feature extraction from raw executable files, operational teams encountered three major hurdles: GPU cluster expenses caused high computational costs, regional customers using non-standard browsers experienced disproportionate false-positive account lockouts due to biased training data, and regulators demanded clear explanations whenever legitimate business traffic was blocked. To comply with governance standards, the provider introduced explainable AI auditing, privacy-preserving data anonymization, and regular bias testing.`

const PASSAGE_8 = `[CASE PASSAGE 8 • MOBILE SECURITY: MALICIOUS APPS & BANKING TROJANS]
Android Overlay Trojan & Mobile Malware Forensics

Several customers of a mobile wallet application reported unauthorized fund transfers shortly after installing a third-party PDF scanner app from an unofficial website. Mobile security researchers obtained the suspicious .apk package and executed it inside an instrumented Android sandbox environment. Static analysis of the app's manifest revealed excessive permissions, including Accessibility Services and SYSTEM_ALERT_WINDOW. Dynamic behavioral analysis showed that whenever the legitimate mobile wallet app launched, the malicious app drew an invisible screen overlay to capture login PINs and intercepted incoming SMS one-time passwords (OTPs) before forwarding them to a remote server.`

const PASSAGE_9 = `[CASE PASSAGE 9 • MOBILE SECURITY: WIRELESS ATTACKS & DEVICE ARCHITECTURE]
Public Wi-Fi Man-in-the-Middle & Jailbreak Risk Assessment

While traveling at an international airport, a corporate executive connected a company-issued smartphone to an unencrypted public hotspot named "Airport_Free_VIP." Unknown to the executive, an attacker had configured a rogue Evil Twin access point to intercept traffic via a Man-in-the-Middle (MitM) attack. Because the executive had previously jailbroken the device to install unauthorized tweaks—disabling operating system sandboxing and code-signing protections—a malicious configuration profile was silently installed, redirecting corporate webmail traffic through an attacker-controlled proxy. Endpoint Mobile Device Management (MDM) software detected the compromised integrity state and immediately revoked corporate VPN certificates.`

const PASSAGE_10 = `[CASE PASSAGE 10 • INTEGRATED FORENSICS, AI & CLOUD INCIDENT INVESTIGATION]
Multi-Vector Cloud Credential Theft & Automated Malware Triage

A healthcare SaaS provider experienced an automated credential-stuffing wave targeting clinician portals, followed by suspicious API calls exporting patient records. Security engineers fed authentication logs and binary payloads into an AI-driven threat detection system combining Support Vector Machines (SVMs), decision trees, and automated malware analysis. The AI models flagged compromised sessions originating from anonymized proxy nodes and identified a trojanized browser extension used to harvest session tokens. Digital forensic investigators subsequently preserved cloud audit trails, verified log integrity using SHA-256 hashes, and reconstructed the attacker's complete activity timeline to satisfy regulatory breach-notification requirements.`

/**
 * Unseen Case Study Passages (10 Cases • 50 Sequential MCQs)
 * Part of Digital Cyber Forensics & Mobile Device Security (FSO-307)
 */
export const FSO307_PASSAGE_QUESTIONS: CbtQuestion[] = [
  // CASE PASSAGE 1 (Q31 - Q35)
  {
    id: 'fso-case1-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 1: Live Incident Response & Disk Forensics',
    passage: PASSAGE_1,
    question: 'Why did the lead analyst capture a RAM dump and active socket logs before unplugging the workstation?',
    type: 'single',
    options: [
      { id: 'A', text: 'To compress the file system prior to SSD removal' },
      { id: 'B', text: 'To preserve volatile evidence that would be lost once power is disconnected' },
      { id: 'C', text: "To disable the workstation's BIOS boot password" },
      { id: 'D', text: 'To format the connected external USB flash drive safely' }
    ],
    correctAnswers: ['B'],
    explanation: 'Memory contents, running processes, and active network connections reside in volatile RAM and vanish immediately upon power loss.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case1-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 1: Live Incident Response & Disk Forensics',
    passage: PASSAGE_1,
    question: 'What is the combined purpose of using a hardware write-blocker and generating a SHA-256 hash on the NVMe SSD?',
    type: 'single',
    options: [
      { id: 'A', text: 'To decrypt hidden partitions and accelerate cloning speed' },
      { id: 'B', text: 'To prevent any modification to the original drive and prove bit-for-bit integrity' },
      { id: 'C', text: 'To isolate malicious executables from spreading across the lab network' },
      { id: 'D', text: 'To convert proprietary CAD files into readable text logs' }
    ],
    correctAnswers: ['B'],
    explanation: 'A write-blocker blocks write commands to the suspect medium, while SHA-256 verifies that the forensic image is an exact, unaltered copy.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case1-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 1: Live Incident Response & Disk Forensics',
    passage: PASSAGE_1,
    question: 'Which forensic technique should be applied to recover the CAD blueprints emptied from the Recycle Bin if file system pointers were overwritten?',
    type: 'single',
    options: [
      { id: 'A', text: 'SIM card cloning' },
      { id: 'B', text: 'Packet payload sniffing' },
      { id: 'C', text: 'File carving' },
      { id: 'D', text: 'Steganography extraction' }
    ],
    correctAnswers: ['C'],
    explanation: 'File carving scans raw unallocated disk blocks for known file headers and footers to reconstruct deleted files without file system metadata.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case1-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 1: Live Incident Response & Disk Forensics',
    passage: PASSAGE_1,
    question: 'Which framework is best suited for analyzing the acquired Windows live RAM dump to inspect running processes and network sockets?',
    type: 'single',
    options: [
      { id: 'A', text: 'Wireshark' },
      { id: 'B', text: 'Volatility' },
      { id: 'C', text: 'Nmap' },
      { id: 'D', text: 'Cain & Abel' }
    ],
    correctAnswers: ['B'],
    explanation: 'Volatility is the industry-standard open-source framework for analyzing volatile memory dumps and extracting active process and socket artifacts.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case1-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 1: Live Incident Response & Disk Forensics',
    passage: PASSAGE_1,
    question: 'How did the hidden file metadata assist investigators in reconstructing the sequence of events?',
    type: 'single',
    options: [
      { id: 'A', text: 'It encrypted the outbound network packets for legal review' },
      { id: 'B', text: 'It provided creation and modification timestamps establishing when the files were staged' },
      { id: 'C', text: 'It blocked the external IP address from reconnecting' },
      { id: 'D', text: 'It automatically restored the emptied Recycle Bin directory' }
    ],
    correctAnswers: ['B'],
    explanation: 'Metadata timestamps establish a chronological timeline linking user activity to the exfiltration window.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 2 (Q36 - Q40)
  {
    id: 'fso-case2-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 2: Network Forensics & Ransomware Intrusion',
    passage: PASSAGE_2,
    question: 'Which tool was utilized by investigators to inspect the perimeter PCAP logs and filter TCP/IP traffic?',
    type: 'single',
    options: [
      { id: 'A', text: 'FTK Imager' },
      { id: 'B', text: 'Autopsy' },
      { id: 'C', text: 'Wireshark' },
      { id: 'D', text: 'EnCase' }
    ],
    correctAnswers: ['C'],
    explanation: 'Wireshark is a specialized network protocol analyzer used to inspect PCAP captures and filter packet flows.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case2-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 2: Network Forensics & Ransomware Intrusion',
    passage: PASSAGE_2,
    question: 'Which network forensic indicator revealed that the reception PC was scanning internal hospital subnets?',
    type: 'single',
    options: [
      { id: 'A', text: 'Physical disk sector fragmentation' },
      { id: 'B', text: 'Unusual traffic patterns and rapid source-to-destination IP requests' },
      { id: 'C', text: 'Corrupted BIOS firmware checksums' },
      { id: 'D', text: 'Increased physical cable latency' }
    ],
    correctAnswers: ['B'],
    explanation: 'Tracking source/destination IPs and spotting abnormal connection bursts reveal internal reconnaissance and lateral movement.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case2-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 2: Network Forensics & Ransomware Intrusion',
    passage: PASSAGE_2,
    question: 'Why was correlating firewall timestamps with server authentication logs essential in this investigation?',
    type: 'single',
    options: [
      { id: 'A', text: 'To compress the 48-hour PCAP file for archival' },
      { id: 'B', text: 'To establish a chronological timeline identifying the initial entry point and lateral spread' },
      { id: 'C', text: 'To decrypt the ransomware payload without a private key' },
      { id: 'D', text: 'To permanently erase compromised user credentials' }
    ],
    correctAnswers: ['B'],
    explanation: 'Cross-referencing timestamps across logs constructs an accurate sequence of attacker actions from initial access to encryption.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case2-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 2: Network Forensics & Ransomware Intrusion',
    passage: PASSAGE_2,
    question: 'Inspecting the contents of the HTTP and DNS packets to uncover the C2 domain is an example of which network forensic activity?',
    type: 'single',
    options: [
      { id: 'A', text: 'Hardware write-blocking' },
      { id: 'B', text: 'Logical disk imaging' },
      { id: 'C', text: 'Packet payload analysis' },
      { id: 'D', text: 'Registry hive carving' }
    ],
    correctAnswers: ['C'],
    explanation: 'Packet payload analysis examines the data carried inside network packets to uncover malicious commands, URLs, or exfiltrated data.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case2-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 2: Network Forensics & Ransomware Intrusion',
    passage: PASSAGE_2,
    question: 'Which challenge most directly hindered immediate recovery of the encrypted clinical scheduling files?',
    type: 'single',
    options: [
      { id: 'A', text: 'Oversupply of forensic packet analyzers' },
      { id: 'B', text: 'Encryption of files and data restricting unauthorized access' },
      { id: 'C', text: 'Absence of network switch logs' },
      { id: 'D', text: 'Excessive physical memory on the reception PC' }
    ],
    correctAnswers: ['B'],
    explanation: 'Strong encryption prevents investigators and administrators from reading locked data without the corresponding decryption keys.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 3 (Q41 - Q45)
  {
    id: 'fso-case3-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 3: Mobile Device Forensics & Evidence Handling',
    passage: PASSAGE_3,
    question: 'Why did the first responder place the seized smartphone in Airplane Mode and inside a Faraday bag?',
    type: 'single',
    options: [
      { id: 'A', text: 'To recharge the battery safely during transport' },
      { id: 'B', text: 'To isolate the device from wireless signals and prevent remote wiping or data alteration' },
      { id: 'C', text: 'To unlock encrypted bootloader partitions automatically' },
      { id: 'D', text: 'To accelerate logical extraction speed at the crime scene' }
    ],
    correctAnswers: ['B'],
    explanation: 'RF shielding blocks cellular, Wi-Fi, and Bluetooth signals so attackers cannot remotely wipe or modify evidence.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case3-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 3: Mobile Device Forensics & Evidence Handling',
    passage: PASSAGE_3,
    question: 'What was the primary difference between the logical extraction and the physical extraction performed in the lab?',
    type: 'single',
    options: [
      { id: 'A', text: 'Logical extraction requires desoldering the memory chip, whereas physical extraction uses Bluetooth' },
      { id: 'B', text: 'Logical extraction captures OS-visible active data, while physical extraction creates a full bit-stream copy capable of recovering deleted data' },
      { id: 'C', text: 'Logical extraction only reads the SIM card, while physical extraction only reads the SD card' },
      { id: 'D', text: 'Logical extraction encrypts the phone, while physical extraction formats the storage' }
    ],
    correctAnswers: ['B'],
    explanation: 'Physical extraction accesses raw unallocated storage where deleted SQLite records and cached artifacts still reside.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case3-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 3: Mobile Device Forensics & Evidence Handling',
    passage: PASSAGE_3,
    question: "Why did technicians clone the suspect's SIM card before analyzing it?",
    type: 'single',
    options: [
      { id: 'A', text: "To bypass the smartphone's screen lock PIN" },
      { id: 'B', text: 'To examine SIM card data safely without altering the original evidence' },
      { id: 'C', text: 'To intercept live incoming phone calls from accomplices' },
      { id: 'D', text: 'To increase the storage capacity of the mobile device' }
    ],
    correctAnswers: ['B'],
    explanation: 'SIM cloning allows forensic examination on a working copy while preserving the integrity of the original card.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case3-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 3: Mobile Device Forensics & Evidence Handling',
    passage: PASSAGE_3,
    question: 'Recording every handover of the smartphone from seizure to laboratory examination satisfies which legal requirement?',
    type: 'single',
    options: [
      { id: 'A', text: 'Steganography verification' },
      { id: 'B', text: 'Chain of custody' },
      { id: 'C', text: 'Data carving protocol' },
      { id: 'D', text: 'Heuristic malware triage' }
    ],
    correctAnswers: ['B'],
    explanation: 'Maintaining an unbroken chain of custody proves accountability, traceability, and evidence integrity in court.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case3-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 3: Mobile Device Forensics & Evidence Handling',
    passage: PASSAGE_3,
    question: 'Which artifact recovered during the physical extraction provided deleted messaging evidence?',
    type: 'single',
    options: [
      { id: 'A', text: 'BIOS configuration tables' },
      { id: 'B', text: 'Deleted SQLite chat databases' },
      { id: 'C', text: 'Perimeter firewall PCAP files' },
      { id: 'D', text: 'Network router routing tables' }
    ],
    correctAnswers: ['B'],
    explanation: 'Mobile messaging applications store conversations in SQLite databases, whose deleted records can be recovered from raw flash images.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 4 (Q46 - Q50)
  {
    id: 'fso-case4-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 4: Steganography & Storage Calculation Forensics',
    passage: PASSAGE_4,
    question: 'Which forensic technique uncovered the encrypted source-code archives hidden inside the JPEG product photos?',
    type: 'single',
    options: [
      { id: 'A', text: 'Memory forensics' },
      { id: 'B', text: 'Steganography analysis' },
      { id: 'C', text: 'Packet sniffing' },
      { id: 'D', text: 'SIM card cloning' }
    ],
    correctAnswers: ['B'],
    explanation: 'Steganography analysis detects covert data concealed within carrier files such as images, audio, or video.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case4-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 4: Steganography & Storage Calculation Forensics',
    passage: PASSAGE_4,
    question: 'Based on the passage, what is the total size in MB of the 2,048 allocated blocks on the hidden partition (where 1 block = 4 KB)?',
    type: 'single',
    options: [
      { id: 'A', text: '4 MB' },
      { id: 'B', text: '8 MB' },
      { id: 'C', text: '16 MB' },
      { id: 'D', text: '2 MB' }
    ],
    correctAnswers: ['B'],
    explanation: '2,048 blocks × 4 KB = 8,192 KB; dividing 8,192 KB by 1,024 KB/MB yields 8 MB.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case4-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 4: Steganography & Storage Calculation Forensics',
    passage: PASSAGE_4,
    question: 'How much total storage space in GB is required to store the four forensic duplicates of the 3.5 GB master evidence container?',
    type: 'single',
    options: [
      { id: 'A', text: '7.0 GB' },
      { id: 'B', text: '10.5 GB' },
      { id: 'C', text: '14.0 GB' },
      { id: 'D', text: '17.5 GB' }
    ],
    correctAnswers: ['C'],
    explanation: 'Multiplying 3.5 GB by 4 required duplicates equals 14.0 GB of storage.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case4-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 4: Steganography & Storage Calculation Forensics',
    passage: PASSAGE_4,
    question: 'Which command-line utility or forensic tool could examiners use to create bit-stream forensic duplicates of the hidden partition?',
    type: 'single',
    options: [
      { id: 'A', text: 'Wireshark' },
      { id: 'B', text: 'dd or FTK Imager' },
      { id: 'C', text: 'Nmap' },
      { id: 'D', text: 'Adobe Photoshop' }
    ],
    correctAnswers: ['B'],
    explanation: "Both the 'dd' utility and FTK Imager are standard tools for generating bit-level forensic disk and partition images.",
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case4-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 4: Steganography & Storage Calculation Forensics',
    passage: PASSAGE_4,
    question: 'Which step of the digital forensic process ensures that all findings, tools used, and procedures followed are clearly recorded for legal proceedings?',
    type: 'single',
    options: [
      { id: 'A', text: 'Data carving' },
      { id: 'B', text: 'Documentation of findings' },
      { id: 'C', text: 'Random sampling' },
      { id: 'D', text: 'File compression' }
    ],
    correctAnswers: ['B'],
    explanation: 'Thorough documentation ensures reproducibility, transparency, and admissibility of forensic results in court.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 5 (Q51 - Q55)
  {
    id: 'fso-case5-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 5: AI Anomaly Detection & Insider Threats',
    passage: PASSAGE_5,
    question: "Why did the bank's security architects use unsupervised K-Means clustering instead of relying solely on static rules?",
    type: 'single',
    options: [
      { id: 'A', text: 'Static rules require too much GPU computing power' },
      { id: 'B', text: 'Clustering groups normal behavioral data points to detect novel anomalies and outliers without pre-labeled attack signatures' },
      { id: 'C', text: 'K-Means clustering automatically encrypts customer credit records' },
      { id: 'D', text: 'Static rules cannot log timestamps on Windows servers' }
    ],
    correctAnswers: ['B'],
    explanation: 'Unsupervised clustering excels at spotting previously unseen deviations from baseline activity.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case5-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 5: AI Anomaly Detection & Insider Threats',
    passage: PASSAGE_5,
    question: 'How did User and Entity Behavior Analytics (UEBA) identify the operations clerk as a potential insider threat?',
    type: 'single',
    options: [
      { id: 'A', text: "By checking the clerk's physical badge swipe at the cafeteria" },
      { id: 'B', text: 'By analyzing user activity patterns and flagging extreme deviations from normal query volume, timing, and subnet usage' },
      { id: 'C', text: 'By blocking all internal database queries across the entire bank' },
      { id: 'D', text: 'By replacing human SOC analysts completely' }
    ],
    correctAnswers: ['B'],
    explanation: 'Behavioral analytics detects insider threats by comparing current actions against established user baselines.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case5-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 5: AI Anomaly Detection & Insider Threats',
    passage: PASSAGE_5,
    question: 'Which component of an AI-driven cybersecurity framework enabled the immediate session lock at 3:40 AM?',
    type: 'single',
    options: [
      { id: 'A', text: 'Traditional perimeter firewalls' },
      { id: 'B', text: 'Real-time analytics' },
      { id: 'C', text: 'Manual weekly threat hunting' },
      { id: 'D', text: 'Offline tape backups' }
    ],
    correctAnswers: ['B'],
    explanation: 'Real-time analytics processes streaming events instantaneously to enable immediate threat detection and automated containment.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case5-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 5: AI Anomaly Detection & Insider Threats',
    passage: PASSAGE_5,
    question: 'In the context of AI for cybersecurity, what is the primary function of anomaly detection illustrated in this case?',
    type: 'single',
    options: [
      { id: 'A', text: 'Improving database query execution speed' },
      { id: 'B', text: 'Identifying unusual patterns that deviate from normal behavior and may indicate malicious activity' },
      { id: 'C', text: 'Generating cryptographic keys for customer accounts' },
      { id: 'D', text: 'Compressing historical log files in data lakes' }
    ],
    correctAnswers: ['B'],
    explanation: 'Anomaly detection isolates statistically abnormal behavior indicative of security breaches or insider abuse.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case5-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 5: AI Anomaly Detection & Insider Threats',
    passage: PASSAGE_5,
    question: 'Where would the bank store six months of massive historical login and query logs required to train its AI models?',
    type: 'single',
    options: [
      { id: 'A', text: 'Browser cookies' },
      { id: 'B', text: 'Data lakes and repositories' },
      { id: 'C', text: 'CPU cache registers' },
      { id: 'D', text: 'SIM card memory' }
    ],
    correctAnswers: ['B'],
    explanation: 'Data lakes and centralized repositories store vast volumes of structured and unstructured security telemetry for AI training and analysis.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 6 (Q56 - Q60)
  {
    id: 'fso-case6-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 6: NLP, Supervised Learning & Threat Intelligence',
    passage: PASSAGE_6,
    question: "What role did Natural Language Processing (NLP) play in the enterprise's defense pipeline?",
    type: 'single',
    options: [
      { id: 'A', text: 'Managing server hardware cooling and bandwidth' },
      { id: 'B', text: 'Analyzing human text in emails and unstructured threat feeds to detect phishing cues and extract threat intelligence' },
      { id: 'C', text: 'Encrypting outgoing vendor invoices' },
      { id: 'D', text: 'Performing physical disk imaging on employee laptops' }
    ],
    correctAnswers: ['B'],
    explanation: 'NLP enables AI systems to parse linguistic patterns, urgency indicators, and unstructured text reports.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case6-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 6: NLP, Supervised Learning & Threat Intelligence',
    passage: PASSAGE_6,
    question: "Why is the Random Forest email classifier categorized as 'supervised learning'?",
    type: 'single',
    options: [
      { id: 'A', text: 'It operates without any historical training data' },
      { id: 'B', text: 'It was trained using labeled datasets of known benign and malicious emails to classify new messages' },
      { id: 'C', text: 'It requires a human analyst to manually approve every email' },
      { id: 'D', text: 'It only inspects encrypted network packets' }
    ],
    correctAnswers: ['B'],
    explanation: 'Supervised learning relies on annotated input-output pairs to learn classification boundaries.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case6-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 6: NLP, Supervised Learning & Threat Intelligence',
    passage: PASSAGE_6,
    question: "How did 'feature selection' improve the performance of the email classification model?",
    type: 'single',
    options: [
      { id: 'A', text: 'By increasing physical network cable speed' },
      { id: 'B', text: 'By focusing the model on the most relevant attributes, improving classification accuracy and efficiency' },
      { id: 'C', text: 'By eliminating the need for email authentication protocols' },
      { id: 'D', text: 'By storing duplicate copies of every attachment' }
    ],
    correctAnswers: ['B'],
    explanation: 'Selecting high-value features removes noise and enhances predictive accuracy.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case6-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 6: NLP, Supervised Learning & Threat Intelligence',
    passage: PASSAGE_6,
    question: "What function did 'reinforcement learning' serve in the final stage of the pipeline?",
    type: 'single',
    options: [
      { id: 'A', text: 'Carving deleted emails from local hard drives' },
      { id: 'B', text: 'Optimizing quarantine threshold decisions dynamically based on environmental feedback from analyst verifications' },
      { id: 'C', text: 'Generating cryptographic hashes for attachments' },
      { id: 'D', text: 'Grouping unlabeled IP addresses into clusters' }
    ],
    correctAnswers: ['B'],
    explanation: 'Reinforcement learning adapts policies over time using reward/penalty feedback signals.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case6-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 6: NLP, Supervised Learning & Threat Intelligence',
    passage: PASSAGE_6,
    question: 'Which broader capability does ingesting dark-web forums via NLP and data mining provide to the security team?',
    type: 'single',
    options: [
      { id: 'A', text: 'Proactive threat intelligence by extracting actionable insights from vast unstructured data' },
      { id: 'B', text: 'Guaranteed 100% elimination of all hardware failures' },
      { id: 'C', text: 'Automatic patching of legacy operating systems' },
      { id: 'D', text: 'Physical security monitoring of server rooms' }
    ],
    correctAnswers: ['A'],
    explanation: 'Combining data mining and NLP converts raw external chatter into timely threat intelligence.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 7 (Q61 - Q65)
  {
    id: 'fso-case7-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 7: AI Ethics, Bias & Deployment Challenges',
    passage: PASSAGE_7,
    question: 'Why did the telecommunications provider select deep learning for analyzing raw malware binaries?',
    type: 'single',
    options: [
      { id: 'A', text: 'Deep learning requires minimal hardware resources' },
      { id: 'B', text: 'Deep learning automatically performs complex feature extraction from raw data without manual rule engineering' },
      { id: 'C', text: 'Deep learning guarantees zero false positives' },
      { id: 'D', text: 'Deep learning replaces data privacy regulations' }
    ],
    correctAnswers: ['B'],
    explanation: 'Multi-layer neural networks excel at discovering intricate representations directly from raw inputs.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case7-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 7: AI Ethics, Bias & Deployment Challenges',
    passage: PASSAGE_7,
    question: 'Which operational challenge caused disproportionate false-positive lockouts for regional customers?',
    type: 'single',
    options: [
      { id: 'A', text: 'Excessive network bandwidth' },
      { id: 'B', text: 'Bias in AI algorithms stemming from unrepresentative training data' },
      { id: 'C', text: 'Overuse of hardware write-blockers' },
      { id: 'D', text: 'Lack of SHA-256 hashing' }
    ],
    correctAnswers: ['B'],
    explanation: 'Algorithmic bias occurs when skewed training datasets cause unfair or inaccurate predictions for specific user groups.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case7-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 7: AI Ethics, Bias & Deployment Challenges',
    passage: PASSAGE_7,
    question: 'Which resource challenge was highlighted by the GPU cluster expenses needed to run the deep learning system?',
    type: 'single',
    options: [
      { id: 'A', text: 'Simplified network infrastructure' },
      { id: 'B', text: 'High computational cost required to train and operate AI models' },
      { id: 'C', text: 'Inability to process large data volumes' },
      { id: 'D', text: 'Elimination of human oversight' }
    ],
    correctAnswers: ['B'],
    explanation: 'Deep neural networks demand substantial processing power and infrastructure investment.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case7-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 7: AI Ethics, Bias & Deployment Challenges',
    passage: PASSAGE_7,
    question: 'Regulators demanding clear explanations for blocked traffic reflects which ethical requirement in AI cybersecurity?',
    type: 'single',
    options: [
      { id: 'A', text: 'Increasing hardware clock speed' },
      { id: 'B', text: 'Maintaining transparency of AI decisions' },
      { id: 'C', text: 'Building colorful user interfaces' },
      { id: 'D', text: 'Deleting all historical audit logs' }
    ],
    correctAnswers: ['B'],
    explanation: 'Decision transparency ensures accountability, regulatory compliance, and trust in automated security actions.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case7-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 7: AI Ethics, Bias & Deployment Challenges',
    passage: PASSAGE_7,
    question: 'Introducing data anonymization before training models on customer traffic addresses which key AI challenge?',
    type: 'single',
    options: [
      { id: 'A', text: 'Data privacy concerns when handling sensitive user telemetry' },
      { id: 'B', text: 'Packet fragmentation on fiber-optic links' },
      { id: 'C', text: 'BIOS firmware corruption' },
      { id: 'D', text: 'SIM card cloning vulnerabilities' }
    ],
    correctAnswers: ['A'],
    explanation: 'Protecting personally identifiable and sensitive customer data is a primary ethical and legal requirement in AI security.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 8 (Q66 - Q70)
  {
    id: 'fso-case8-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 8: Android Overlay Trojan & Mobile Malware Forensics',
    passage: PASSAGE_8,
    question: "What was the primary attack vector that allowed the malicious PDF scanner onto victims' devices?",
    type: 'single',
    options: [
      { id: 'A', text: 'Hardware SIM card cloning at a retail store' },
      { id: 'B', text: 'Sideloading an untrusted application package (.apk) from an unofficial third-party source' },
      { id: 'C', text: 'Physical JTAG extraction by a repair technician' },
      { id: 'D', text: 'Compromised cellular base station firmware' }
    ],
    correctAnswers: ['B'],
    explanation: 'Installing apps outside vetted official stores bypasses automated store security screening.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case8-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 8: Android Overlay Trojan & Mobile Malware Forensics',
    passage: PASSAGE_8,
    question: 'How did the malware steal customer login PINs during runtime?',
    type: 'single',
    options: [
      { id: 'A', text: "By cracking SHA-256 hashes on the bank's mainframe" },
      { id: 'B', text: 'By abusing screen overlay permissions to draw a fake interface over the legitimate banking app' },
      { id: 'C', text: "By physically removing the device's flash storage chip" },
      { id: 'D', text: 'By performing DNS cache poisoning on the home router' }
    ],
    correctAnswers: ['B'],
    explanation: 'Overlay attacks trick users into entering credentials into a malicious window layered atop a trusted app.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case8-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 8: Android Overlay Trojan & Mobile Malware Forensics',
    passage: PASSAGE_8,
    question: 'Why did researchers observe the app inside an instrumented sandbox environment?',
    type: 'single',
    options: [
      { id: 'A', text: 'To safely perform dynamic behavioral analysis and observe runtime actions without infecting production networks' },
      { id: 'B', text: 'To increase the battery life of the test smartphone' },
      { id: 'C', text: "To permanently delete the suspect's cloud backup" },
      { id: 'D', text: 'To format the Android system partition' }
    ],
    correctAnswers: ['A'],
    explanation: 'Sandboxing isolates malware so analysts can safely monitor network calls, permissions abuse, and file modifications.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case8-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 8: Android Overlay Trojan & Mobile Malware Forensics',
    passage: PASSAGE_8,
    question: 'Inspecting the Android manifest file for excessive permissions prior to running the app is an example of:',
    type: 'single',
    options: [
      { id: 'A', text: 'Static analysis' },
      { id: 'B', text: 'Memory carving' },
      { id: 'C', text: 'Packet sniffing' },
      { id: 'D', text: 'Logical SIM cloning' }
    ],
    correctAnswers: ['A'],
    explanation: 'Static analysis examines code structure, permissions, and metadata without executing the binary.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case8-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 8: Android Overlay Trojan & Mobile Malware Forensics',
    passage: PASSAGE_8,
    question: 'How did the trojan bypass SMS-based two-factor authentication (2FA)?',
    type: 'single',
    options: [
      { id: 'A', text: "By disabling the phone's cellular radio" },
      { id: 'B', text: 'By intercepting incoming SMS OTP messages and exfiltrating them to a remote server' },
      { id: 'C', text: "By brute-forcing the carrier's core database" },
      { id: 'D', text: "By modifying the device's IMEI hardware number" }
    ],
    correctAnswers: ['B'],
    explanation: 'Malicious SMS permissions allow trojans to read and forward one-time passcodes silently.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 9 (Q71 - Q75)
  {
    id: 'fso-case9-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 9: Public Wi-Fi MitM & Jailbreak Risk Assessment',
    passage: PASSAGE_9,
    question: 'What type of wireless attack did the attacker execute using the "Airport_Free_VIP" hotspot?',
    type: 'single',
    options: [
      { id: 'A', text: 'Ransomware file carving' },
      { id: 'B', text: 'Rogue Evil Twin access point enabling a Man-in-the-Middle (MitM) attack' },
      { id: 'C', text: 'Cold-boot RAM extraction' },
      { id: 'D', text: 'SIM card physical cloning' }
    ],
    correctAnswers: ['B'],
    explanation: 'Attackers mimic legitimate public Wi-Fi SSIDs to intercept and inspect unencrypted or downgraded user communications.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case9-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 9: Public Wi-Fi MitM & Jailbreak Risk Assessment',
    passage: PASSAGE_9,
    question: 'How did jailbreaking the smartphone increase its vulnerability during this incident?',
    type: 'single',
    options: [
      { id: 'A', text: 'It physically damaged the Wi-Fi antenna' },
      { id: 'B', text: 'It bypassed built-in OS security controls such as app sandboxing and mandatory code-signing' },
      { id: 'C', text: 'It forced the phone to use 2G cellular towers only' },
      { id: 'D', text: "It disabled the device's hardware write-blocker" }
    ],
    correctAnswers: ['B'],
    explanation: 'Removing OS privilege boundaries allows untrusted profiles and payloads to modify core system behavior.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-case9-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 9: Public Wi-Fi MitM & Jailbreak Risk Assessment',
    passage: PASSAGE_9,
    question: "How did the organization's Mobile Device Management (MDM) system limit corporate data exposure once compromise was detected?",
    type: 'single',
    options: [
      { id: 'A', text: "By formatting the airport's Wi-Fi routers" },
      { id: 'B', text: 'By detecting the jailbroken integrity state and immediately revoking corporate VPN certificates' },
      { id: 'C', text: 'By sending a phishing email to the attacker' },
      { id: 'D', text: 'By disabling cellular voice calls permanently' }
    ],
    correctAnswers: ['B'],
    explanation: 'MDM enforces device compliance policies and cuts off enterprise access when device integrity fails.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case9-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 9: Public Wi-Fi MitM & Jailbreak Risk Assessment',
    passage: PASSAGE_9,
    question: 'Which security control best protects corporate mobile data transmitted over untrusted public Wi-Fi networks?',
    type: 'single',
    options: [
      { id: 'A', text: 'Disabling screen auto-lock' },
      { id: 'B', text: 'Enforcing an encrypted Virtual Private Network (VPN) and strict TLS certificate validation' },
      { id: 'C', text: 'Enabling open Bluetooth file sharing' },
      { id: 'D', text: 'Storing passwords in plain-text notes' }
    ],
    correctAnswers: ['B'],
    explanation: 'End-to-end encryption prevents rogue hotspot operators from reading or tampering with traffic in transit.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case9-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 9: Public Wi-Fi MitM & Jailbreak Risk Assessment',
    passage: PASSAGE_9,
    question: 'In mobile operating system architecture, what is the primary purpose of application sandboxing?',
    type: 'single',
    options: [
      { id: 'A', text: 'To speed up graphics rendering in mobile games' },
      { id: 'B', text: "To isolate each app's data and execution environment so one app cannot access another app's sensitive files" },
      { id: 'C', text: 'To compress photos automatically before cloud upload' },
      { id: 'D', text: 'To share contacts freely across all installed applications' }
    ],
    correctAnswers: ['B'],
    explanation: 'Sandboxing enforces strict privilege separation between applications and the core OS.',
    difficulty: 'easy',
    status: 'approved'
  },

  // CASE PASSAGE 10 (Q76 - Q80)
  {
    id: 'fso-case10-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 10: Integrated Forensics, AI & Cloud Investigation',
    passage: PASSAGE_10,
    question: 'Which combination of AI techniques helped classify malicious sessions and suspicious binaries in this investigation?',
    type: 'single',
    options: [
      { id: 'A', text: 'Augmented reality and 3D modeling' },
      { id: 'B', text: 'Support Vector Machines (SVMs), decision trees, and automated malware analysis' },
      { id: 'C', text: 'Content management systems and graphic design' },
      { id: 'D', text: 'Manual password hashing and network segmentation' }
    ],
    correctAnswers: ['B'],
    explanation: 'SVMs and decision trees excel at classification tasks, while automated malware analysis rapidly evaluates suspicious payloads.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case10-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 10: Integrated Forensics, AI & Cloud Investigation',
    passage: PASSAGE_10,
    question: 'Why did forensic investigators compute SHA-256 hashes on the preserved cloud audit logs?',
    type: 'single',
    options: [
      { id: 'A', text: 'To compress the logs so they fit onto a USB drive' },
      { id: 'B', text: 'To prove the audit logs remained intact and unaltered for regulatory and legal scrutiny' },
      { id: 'C', text: 'To decrypt stolen clinician passwords' },
      { id: 'D', text: 'To block future API calls from proxy nodes' }
    ],
    correctAnswers: ['B'],
    explanation: 'Cryptographic hashes provide mathematical verification of evidence integrity.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case10-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 10: Integrated Forensics, AI & Cloud Investigation',
    passage: PASSAGE_10,
    question: 'Reconstructing the exact sequence of API calls and session hijack events relies primarily on which forensic artifact?',
    type: 'single',
    options: [
      { id: 'A', text: 'Printed user manuals' },
      { id: 'B', text: 'Server and cloud audit log files with accurate timestamps' },
      { id: 'C', text: 'Hardware cooling fan speeds' },
      { id: 'D', text: 'Unallocated SIM card sectors' }
    ],
    correctAnswers: ['B'],
    explanation: 'Timestamped server logs provide an authoritative chronological record of user and API actions.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case10-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 10: Integrated Forensics, AI & Cloud Investigation',
    passage: PASSAGE_10,
    question: "How did AI enhance the SaaS provider's threat detection and response capabilities during the attack?",
    type: 'single',
    options: [
      { id: 'A', text: 'By guaranteeing 100% prevention of all future cyber attacks' },
      { id: 'B', text: 'By analyzing vast authentication logs and payloads rapidly to detect anomalies and accelerate containment' },
      { id: 'C', text: 'By eliminating the need for encryption across patient databases' },
      { id: 'D', text: 'By replacing all regulatory compliance officers' }
    ],
    correctAnswers: ['B'],
    explanation: 'AI processes high-volume telemetry at machine speed to detect and respond to active intrusions.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-case10-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    category: 'open-elective',
    topic: 'unseen-passages',
    topicName: 'Unseen Case Study Passages (Forensics, AI & Mobile)',
    partName: 'Part II: Unseen Case Study Passages',
    sectionName: 'Case 10: Integrated Forensics, AI & Cloud Investigation',
    passage: PASSAGE_10,
    question: 'What is the overarching goal of combining AI detection with rigorous digital forensics in a regulated breach investigation?',
    type: 'single',
    options: [
      { id: 'A', text: 'To design faster consumer web interfaces' },
      { id: 'B', text: 'To rapidly detect and contain threats while preserving legally admissible evidence that establishes root cause and scope' },
      { id: 'C', text: 'To reduce physical server rack space' },
      { id: 'D', text: 'To permanently delete all compromised user accounts without documentation' }
    ],
    correctAnswers: ['B'],
    explanation: 'AI accelerates detection and response, while forensic rigor ensures accurate attribution, compliance, and legal admissibility.',
    difficulty: 'easy',
    status: 'approved'
  }
]
