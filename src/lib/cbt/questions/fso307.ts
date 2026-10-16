import { CbtQuestion } from '../types'

/**
 * Mobile Application & Device Security (FSO-307)
 * Official CBT MCQ Bank | 51 Questions from Examination Revision Source
 * Includes Sections A-E across Parts 1, 2, 3, 5, and 6 with explanations.
 */
export const FSO307_QUESTIONS: CbtQuestion[] = [
  // -------------------------------------------------------------
  // PART 1: Mobile Application & Device Security (19 Questions)
  // -------------------------------------------------------------
  {
    id: 'fso-p1-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section A: Mobile Application Security Risks',
    question: 'Which of the following are major risks associated with mobile application security? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Weak server-side controls' },
      { id: 'B', text: 'Data leakage through unintended channels' },
      { id: 'C', text: 'Slow application performance' },
      { id: 'D', text: 'Limited functionality' },
      { id: 'E', text: 'Incorrect implementation of cryptography' },
      { id: 'F', text: 'Frequent application crashes' }
    ],
    correctAnswers: ['A', 'B', 'E'],
    explanation: 'Weak server-side authorization or validation can allow API abuse. Sensitive data may leak through logs, caches, clipboard use, or insecure IPC. Weak or incorrectly used cryptography can expose protected data. Performance problems and crashes are quality issues unless they create a specific security weakness.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section A: Mobile Application Security Risks',
    question: 'Which of the following represent common security vulnerabilities in mobile applications? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Improper certificate validation' },
      { id: 'B', text: 'Using any third-party library, regardless of its condition' },
      { id: 'C', text: 'Lack of encryption for sensitive local storage' },
      { id: 'D', text: 'Complex user interfaces' },
      { id: 'E', text: 'Presence of advertisements by itself' },
      { id: 'F', text: 'Excessive permissions requests' }
    ],
    correctAnswers: ['A', 'C', 'F'],
    explanation: 'Improper TLS certificate or hostname validation enables interception (MITM). Sensitive data in plaintext can be extracted if a device is compromised. Excessive permissions expand the blast radius. Third-party libraries are not inherently vulnerabilities unless unmaintained or untrusted.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section A: Mobile Application Security Risks',
    question: 'Which example best illustrates a server-side security failure?',
    type: 'single',
    options: [
      { id: 'A', text: 'A button takes two seconds to animate' },
      { id: 'B', text: 'The server trusts a user role sent by the mobile client without verifying it' },
      { id: 'C', text: 'The app uses a large font' },
      { id: 'D', text: 'The app offers dark mode' }
    ],
    correctAnswers: ['B'],
    explanation: 'Authorization must be enforced strictly on the server. Client-side checks can be modified, bypassed, or manipulated using proxy tools and must never be treated as the security boundary.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section B: Securing Mobile Devices',
    question: 'Which practices can improve mobile-device security? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Enabling two-factor authentication where supported' },
      { id: 'B', text: 'Reusing simple passwords' },
      { id: 'C', text: 'Ignoring security alerts' },
      { id: 'D', text: 'Installing operating-system and security updates' },
      { id: 'E', text: 'Disabling device encryption' },
      { id: 'F', text: 'Using biometric authentication with a secure fallback' }
    ],
    correctAnswers: ['A', 'D', 'F'],
    explanation: 'MFA reduces reliance on passwords alone. Operating system updates patch newly uncovered vulnerabilities. Biometrics backed by secure device hardware (Secure Enclave / TEE) and protected fallback improve defense in depth.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section B: Securing Mobile Devices',
    question: 'Which option is an authentication method rather than a general vulnerability-mitigation or data-protection measure?',
    type: 'single',
    options: [
      { id: 'A', text: 'Two-factor authentication' },
      { id: 'B', text: 'Regular software updates' },
      { id: 'C', text: 'Data encryption' },
      { id: 'D', text: 'Firewall configuration' }
    ],
    correctAnswers: ['A'],
    explanation: 'Two-factor authentication explicitly verifies an identity claim. Updates patch software flaws, encryption ensures confidentiality, and firewalls filter network traffic.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q6',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section B: Securing Mobile Devices',
    question: 'Which is the strongest general recommendation for device access?',
    type: 'single',
    options: [
      { id: 'A', text: 'Use a short, easily guessed PIN' },
      { id: 'B', text: 'Disable the lock screen' },
      { id: 'C', text: 'Use a strong passcode and enable supported biometric unlock' },
      { id: 'D', text: 'Share the unlock pattern with trusted friends' }
    ],
    correctAnswers: ['C'],
    explanation: 'A strong passcode combined with supported biometric unlock provides defense against casual and opportunistic unauthorized physical access.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q7',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section C: Integrity and Authentication',
    question: 'Which components help protect the integrity and security of mobile applications? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Data analytics tools alone' },
      { id: 'B', text: 'Code signing' },
      { id: 'C', text: 'Regular security updates' },
      { id: 'D', text: 'Access controls' },
      { id: 'E', text: 'User-interface styling alone' }
    ],
    correctAnswers: ['B', 'C', 'D'],
    explanation: 'Code signing guarantees publisher authenticity and tamper-detection. Security updates patch vulnerabilities, and access controls enforce least privilege.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q8',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section C: Integrity and Authentication',
    question: 'What does code signing primarily help verify?',
    type: 'single',
    options: [
      { id: 'A', text: 'That an app will never contain vulnerabilities' },
      { id: 'B', text: 'Publisher identity and whether the signed package has been altered' },
      { id: 'C', text: 'That an app will always run quickly' },
      { id: 'D', text: 'That the app collects no personal data' }
    ],
    correctAnswers: ['B'],
    explanation: 'Code signing creates a digital signature using cryptographic certificates to verify the publisher identity and confirm the application binary has not been tampered with or modified.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q9',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section C: Integrity and Authentication',
    question: 'Which method is generally more resistant to password-only account compromise?',
    type: 'single',
    options: [
      { id: 'A', text: 'Reusing one password everywhere' },
      { id: 'B', text: 'Disabling login alerts' },
      { id: 'C', text: 'Multi-factor authentication' },
      { id: 'D', text: 'Saving passwords in plain-text notes' }
    ],
    correctAnswers: ['C'],
    explanation: 'Multi-factor authentication requires multiple pieces of evidence (knowledge, possession, or inherence), drastically reducing the value of stolen passwords.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q10',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section C: Integrity and Authentication',
    question: 'Which statement about biometrics is most accurate?',
    type: 'single',
    options: [
      { id: 'A', text: 'Biometrics should never have a fallback method' },
      { id: 'B', text: 'Biometrics alone guarantee perfect security' },
      { id: 'C', text: 'Biometrics can be useful when integrated with secure device authentication and a protected fallback' },
      { id: 'D', text: 'Biometrics encrypt every file automatically' }
    ],
    correctAnswers: ['C'],
    explanation: 'Biometrics provide convenient local authentication but are not infallible. They must be coupled with hardware-backed key storage (TEE) and strong fallback passcodes.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q11',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section D: Secure Communications',
    question: 'Which protocol family is commonly used to protect communications between a mobile app and a server?',
    type: 'single',
    options: [
      { id: 'A', text: 'FTP' },
      { id: 'B', text: 'Plain HTTP' },
      { id: 'C', text: 'TLS' },
      { id: 'D', text: 'Telnet' }
    ],
    correctAnswers: ['C'],
    explanation: 'Transport Layer Security (TLS) is the industry standard cryptographic protocol that secures network communications between mobile clients and backend servers (underlying HTTPS).',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q12',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section D: Secure Communications',
    question: 'What can happen if an app disables TLS certificate or hostname validation?',
    type: 'single',
    options: [
      { id: 'A', text: 'Network requests become faster and therefore safer' },
      { id: 'B', text: 'An attacker may intercept or impersonate the server' },
      { id: 'C', text: 'Local files are automatically encrypted' },
      { id: 'D', text: 'The app gains stronger authentication' }
    ],
    correctAnswers: ['B'],
    explanation: 'Disabling certificate or hostname validation completely breaks the trust model, allowing man-in-the-middle (MITM) attackers to intercept, decrypt, and alter traffic.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q13',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section D: Secure Communications',
    question: 'Which is the best practice for sending sensitive information over a network?',
    type: 'single',
    options: [
      { id: 'A', text: 'Send it over plain HTTP' },
      { id: 'B', text: 'Use HTTPS with correct TLS validation' },
      { id: 'C', text: 'Put it in a URL query string and assume it is secret' },
      { id: 'D', text: 'Encode it with Base64 only' }
    ],
    correctAnswers: ['B'],
    explanation: 'HTTPS with strict certificate validation ensures end-to-end transport confidentiality and integrity. Base64 is only an encoding format, not encryption.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q14',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section D: Secure Communications',
    question: 'Which statement about FTP, SMTP, HTTP, and TLS is correct?',
    type: 'single',
    options: [
      { id: 'A', text: 'Every use of SMTP is encrypted automatically' },
      { id: 'B', text: 'Plain HTTP provides transport encryption by default' },
      { id: 'C', text: 'TLS can protect application protocols when configured correctly' },
      { id: 'D', text: 'FTP always provides end-to-end encryption' }
    ],
    correctAnswers: ['C'],
    explanation: 'TLS wraps and protects application layer protocols (HTTP into HTTPS, SMTP into STARTTLS/SMTPS). Plain HTTP and traditional FTP transmit plaintext by default.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q15',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section E: Malware Prevention and Permissions',
    question: 'Which practices help reduce the risk of mobile malware? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Increasing screen brightness' },
      { id: 'B', text: 'Using reputable mobile security protection where appropriate' },
      { id: 'C', text: 'Clearing cache as the main malware defense' },
      { id: 'D', text: 'Installing apps from trusted sources' },
      { id: 'E', text: 'Reviewing app permissions before installation' }
    ],
    correctAnswers: ['B', 'D', 'E'],
    explanation: 'Installing from trusted stores, reviewing requested app permissions against actual functionality, and utilizing reputable security tooling together minimize malware infection risk.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q16',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section E: Malware Prevention and Permissions',
    question: 'A basic calculator app requests SMS access and continuous background microphone access. What is the best response?',
    type: 'single',
    options: [
      { id: 'A', text: 'Grant every permission so the app works' },
      { id: 'B', text: 'Review the app\'s legitimacy and deny unnecessary permissions' },
      { id: 'C', text: 'Turn off device encryption' },
      { id: 'D', text: 'Ignore the request because all apps need these permissions' }
    ],
    correctAnswers: ['B'],
    explanation: 'Permissions must strictly correspond to an app\'s core functionality (principle of least privilege). A calculator requesting SMS and microphone indicates malicious spyware intent.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p1-q17',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section E: Malware Prevention and Permissions',
    question: 'Which statement about official app stores is most accurate?',
    type: 'single',
    options: [
      { id: 'A', text: 'Every app in an official store is guaranteed harmless' },
      { id: 'B', text: 'Official stores can reduce risk, but users should still review apps and permissions' },
      { id: 'C', text: 'Official stores eliminate the need for updates' },
      { id: 'D', text: 'App permissions never matter if the app has ratings' }
    ],
    correctAnswers: ['B'],
    explanation: 'Store curation and scanning significantly lower exposure, but malicious or compromised apps occasionally bypass review. Users must remain vigilant regarding permissions and reviews.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q18',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section E: Malware Prevention and Permissions',
    question: 'Which item is generally a quality concern rather than a direct security vulnerability on its own?',
    type: 'single',
    options: [
      { id: 'A', text: 'Plaintext storage of access tokens' },
      { id: 'B', text: 'Disabled certificate validation' },
      { id: 'C', text: 'Frequent application crashes' },
      { id: 'D', text: 'An exposed administrative API' }
    ],
    correctAnswers: ['C'],
    explanation: 'Crashes are generally stability or software quality issues unless they can be purposefully triggered to cause buffer overflows, memory corruption, or DoS.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p1-q19',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 1: Mobile Application & Device Security',
    sectionName: 'Section E: Malware Prevention and Permissions',
    question: 'Why should mobile apps request only permissions they need?',
    type: 'single',
    options: [
      { id: 'A', text: 'It increases the app\'s attack surface' },
      { id: 'B', text: 'It follows least privilege and limits potential data exposure' },
      { id: 'C', text: 'It guarantees malware cannot run' },
      { id: 'D', text: 'It removes the need for authentication' }
    ],
    correctAnswers: ['B'],
    explanation: 'Applying the principle of least privilege ensures that even if an app is compromised or exploited, the adversary cannot access unauthorized device sensors or data.',
    difficulty: 'easy',
    status: 'approved'
  },

  // -------------------------------------------------------------
  // PART 2: Mobile Application Security (8 Questions)
  // -------------------------------------------------------------
  {
    id: 'fso-p2-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 1: Core Mobile Security Practices',
    question: 'Which practices enhance mobile application security? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Ignoring permissions requested by third-party libraries' },
      { id: 'B', text: 'Implementing strong encryption protocols' },
      { id: 'C', text: 'Conducting thorough code reviews' },
      { id: 'D', text: 'Regularly updating libraries and dependencies' },
      { id: 'E', text: 'Using hard-coded credentials within the application' }
    ],
    correctAnswers: ['B', 'C', 'D'],
    explanation: 'Strong encryption, thorough peer code reviews, and dependency patching enhance security. Hardcoding credentials and ignoring library permissions create severe vulnerabilities.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p2-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 1: Core Mobile Security Practices',
    question: 'What are effective methods for securing data at rest on mobile devices? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Employing secure container solutions' },
      { id: 'B', text: 'Disabling automatic backups in every situation' },
      { id: 'C', text: 'Utilizing device encryption' },
      { id: 'D', text: 'Storing sensitive data in plain-text files' },
      { id: 'E', text: 'Ensuring secure boot processes' }
    ],
    correctAnswers: ['A', 'C', 'E'],
    explanation: 'Secure app sandboxes/containers, hardware device encryption, and authenticated secure boot verify system integrity and prevent unauthorized offline reading of data.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p2-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 1: Core Mobile Security Practices',
    question: 'Which strategies help protect sensitive information transmitted over mobile networks? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Sending data without authentication' },
      { id: 'B', text: 'Using a VPN on untrusted networks when appropriate' },
      { id: 'C', text: 'Avoiding public Wi-Fi for sensitive transactions when a safer connection is available' },
      { id: 'D', text: 'Using end-to-end encryption where suitable' },
      { id: 'E', text: 'Relying solely on network firewalls' }
    ],
    correctAnswers: ['B', 'C', 'D'],
    explanation: 'VPNs encrypt traffic on hostile networks, E2EE guarantees only end recipients can decipher messages, and avoiding open Wi-Fi minimizes rogue access point eavesdropping.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p2-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 2: Implementation & Access Control',
    question: 'Which measures are effective for securing mobile applications? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Implementing secure coding practices' },
      { id: 'B', text: 'Applying least-privilege permissions' },
      { id: 'C', text: 'Disabling all application logging' },
      { id: 'D', text: 'Encrypting sensitive data at rest and in transit' },
      { id: 'E', text: 'Conducting security audits and vulnerability assessments' }
    ],
    correctAnswers: ['A', 'B', 'D', 'E'],
    explanation: 'Secure coding, least privilege, cryptographic protections, and regular vulnerability audits provide defense in depth. Logging should be sanitized rather than eliminated entirely.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p2-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 2: Implementation & Access Control',
    question: 'What is the primary role of code obfuscation in mobile security?',
    type: 'single',
    options: [
      { id: 'A', text: 'Making reverse engineering and code comprehension more difficult' },
      { id: 'B', text: 'Guaranteeing that the app has no vulnerabilities' },
      { id: 'C', text: 'Replacing encryption for stored data' },
      { id: 'D', text: 'Ensuring compatibility across every device' }
    ],
    correctAnswers: ['A'],
    explanation: 'Code obfuscation renames identifiers, flattens control flow, and encrypts strings to raise the cost and complexity of static decompilation and reverse engineering.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p2-q6',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 2: Implementation & Access Control',
    question: 'What is the role of biometric authentication, such as fingerprint scanning or facial recognition?',
    type: 'single',
    options: [
      { id: 'A', text: 'Improving battery efficiency during app execution' },
      { id: 'B', text: 'Verifying a user through physiological or behavioral characteristics' },
      { id: 'C', text: 'Enhancing Bluetooth connectivity' },
      { id: 'D', text: 'Automatically encrypting every file on the device' }
    ],
    correctAnswers: ['B'],
    explanation: 'Biometric systems verify human identity through biological traits (fingerprints, retina, facial features) to unlock authentication credentials.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p2-q7',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 2: Implementation & Access Control',
    question: 'Which practices help prevent data leakage in mobile applications? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Disabling all device security features' },
      { id: 'B', text: 'Storing sensitive data in plaintext' },
      { id: 'C', text: 'Encrypting sensitive data appropriately' },
      { id: 'D', text: 'Conducting regular security audits' },
      { id: 'E', text: 'Using secure coding practices' }
    ],
    correctAnswers: ['C', 'D', 'E'],
    explanation: 'Encryption, secure implementation, platform sandbox controls, and routine auditing stop leaks across IPC channels, logs, caches, and screenshots.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p2-q8',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 2: Mobile Application Security',
    sectionName: 'Section 2: Implementation & Access Control',
    question: 'How can geofencing contribute to mobile security?',
    type: 'single',
    options: [
      { id: 'A', text: 'Restricting certain application or enterprise-resource access based on location' },
      { id: 'B', text: 'Accelerating battery charging' },
      { id: 'C', text: 'Improving Bluetooth connectivity' },
      { id: 'D', text: 'Automatically preventing all remote attacks' }
    ],
    correctAnswers: ['A'],
    explanation: 'Geofencing establishes virtual geographic parameters so that enterprise apps or confidential records can only be decrypted or accessed when inside verified physical premises.',
    difficulty: 'medium',
    status: 'approved'
  },

  // -------------------------------------------------------------
  // PART 3: Malware Protection & Secure Development (8 Questions)
  // -------------------------------------------------------------
  {
    id: 'fso-p3-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 1: Malware Protection & Secure Development Lifecycle',
    question: 'Which techniques help protect mobile devices and applications against malware? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Using outdated encryption methods' },
      { id: 'B', text: 'Installing regular software updates' },
      { id: 'C', text: 'Rooting the device as a routine security measure' },
      { id: 'D', text: 'Monitoring network traffic for suspicious activity' },
      { id: 'E', text: 'Using application sandboxing' }
    ],
    correctAnswers: ['B', 'D', 'E'],
    explanation: 'Updates patch known OS exploits, network monitoring identifies suspicious C2 traffic, and application sandboxing stops cross-app compromise. Rooting weakens security boundaries.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p3-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 1: Malware Protection & Secure Development Lifecycle',
    question: 'Which measures can help safeguard user data on mobile devices? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Enabling remote lock or wipe where supported' },
      { id: 'B', text: 'Using device and data encryption' },
      { id: 'C', text: 'Disabling two-factor authentication' },
      { id: 'D', text: 'Leaving Bluetooth discoverable when not needed' },
      { id: 'E', text: 'Using supported biometric authentication' }
    ],
    correctAnswers: ['A', 'B', 'E'],
    explanation: 'Remote wipe limits exposure after theft, hardware-backed encryption renders data unreadable without keys, and biometrics secure local device unlocking.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p3-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 1: Malware Protection & Secure Development Lifecycle',
    question: 'Which practices support mobile application security during development? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Conducting regular security reviews and testing' },
      { id: 'B', text: 'Ignoring library vulnerabilities' },
      { id: 'C', text: 'Using code obfuscation as a defense-in-depth measure' },
      { id: 'D', text: 'Hardcoding passwords or API secrets' },
      { id: 'E', text: 'Following secure coding practices' }
    ],
    correctAnswers: ['A', 'C', 'E'],
    explanation: 'Static/dynamic security testing (SAST/DAST), defense-in-depth obfuscation, and secure coding practices identify and mitigate vulnerabilities prior to production release.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p3-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 2: Transmission, Sandboxing & Session Security',
    question: 'Which methods can help protect data transmission in mobile applications? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Regularly clearing app cache as the main network defense' },
      { id: 'B', text: 'Using appropriate modern cryptographic algorithms' },
      { id: 'C', text: 'Reducing app permissions alone' },
      { id: 'D', text: 'Using TLS with correct certificate validation' },
      { id: 'E', text: 'Using a VPN when appropriate' }
    ],
    correctAnswers: ['B', 'D', 'E'],
    explanation: 'Modern authenticated ciphers (e.g. AES-GCM, ChaCha20-Poly1305), properly validated TLS tunnels, and VPNs safeguard packets in transit across public infrastructure.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p3-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 2: Transmission, Sandboxing & Session Security',
    question: 'What best describes sandboxing in mobile security?',
    type: 'single',
    options: [
      { id: 'A', text: 'Automating application updates' },
      { id: 'B', text: 'Improving performance through memory optimization' },
      { id: 'C', text: 'Generating user analytics' },
      { id: 'D', text: 'Isolating applications to limit unauthorized interaction' }
    ],
    correctAnswers: ['D'],
    explanation: 'Sandboxing isolates each application into a unique UID process container, restricting unauthorized access to files, hardware, and other apps\' memory space.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p3-q6',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 2: Transmission, Sandboxing & Session Security',
    question: 'What is the principle of least privilege in mobile security?',
    type: 'single',
    options: [
      { id: 'A', text: 'Allow all permissions by default' },
      { id: 'B', text: 'Grant only the permissions needed for required functions' },
      { id: 'C', text: 'Remove all access controls to improve speed' },
      { id: 'D', text: 'Prevent users from accessing the app' }
    ],
    correctAnswers: ['B'],
    explanation: 'Least privilege dictates granting an app or user only the minimal permissions strictly necessary to perform its intended job.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p3-q7',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 2: Transmission, Sandboxing & Session Security',
    question: 'Which can be security issues associated with session management or web content in mobile apps? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Fast application launch' },
      { id: 'B', text: 'Efficient memory usage' },
      { id: 'C', text: 'Cross-site scripting in a vulnerable embedded WebView' },
      { id: 'D', text: 'Session fixation' },
      { id: 'E', text: 'Session hijacking' }
    ],
    correctAnswers: ['C', 'D', 'E'],
    explanation: 'XSS in embedded WebViews allows attackers to extract cookies or tokens. Session hijacking misuses stolen tokens, and fixation occurs when a victim authenticates using an attacker-specified identifier.',
    difficulty: 'hard',
    status: 'approved'
  },
  {
    id: 'fso-p3-q8',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 3: Malware Protection & Secure Development',
    sectionName: 'Set 2: Transmission, Sandboxing & Session Security',
    question: 'What is a central role of cryptography in mobile security?',
    type: 'single',
    options: [
      { id: 'A', text: 'Facilitating social-media integration' },
      { id: 'B', text: 'Protecting sensitive data and supporting integrity and authenticity' },
      { id: 'C', text: 'Guaranteeing faster app execution' },
      { id: 'D', text: 'Designing intuitive interfaces' }
    ],
    correctAnswers: ['B'],
    explanation: 'Cryptography provides confidentiality (ciphers), integrity (hashes & MACs), and non-repudiation/authenticity (digital signatures and certificates).',
    difficulty: 'easy',
    status: 'approved'
  },

  // -------------------------------------------------------------
  // PART 5: Mobile Security Study Notes (13 Questions)
  // -------------------------------------------------------------
  {
    id: 'fso-p5-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 1: Transmission Security & Access Control',
    question: 'In mobile security, what are common methods used to protect data during transmission over a network? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Using strong passwords' },
      { id: 'B', text: 'Secure VPN connections' },
      { id: 'C', text: 'Encryption protocols such as TLS' },
      { id: 'D', text: 'Firewall configurations' },
      { id: 'E', text: 'Data masking techniques' }
    ],
    correctAnswers: ['B', 'C'],
    explanation: 'TLS encrypts application payload data in transit. VPNs tunnel and encrypt packets between the device and gateway. Passwords authenticate users and firewalls filter packets, but neither encrypts the transmission stream itself.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 1: Transmission Security & Access Control',
    question: 'Which practices help secure a mobile app against unauthorized access? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Using supported biometric authentication' },
      { id: 'B', text: 'Reviewing and limiting app permissions' },
      { id: 'C', text: 'Implementing two-factor or multi-factor authentication where appropriate' },
      { id: 'D', text: 'Encrypting sensitive app data' },
      { id: 'E', text: 'Disabling automatic app updates' }
    ],
    correctAnswers: ['A', 'B', 'C', 'D'],
    explanation: 'Biometrics, permission sandboxing, MFA verification, and storage encryption defend against unauthorized data retrieval. Disabling updates is unsafe.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 1: Transmission Security & Access Control',
    question: 'Which strategies help mitigate risks associated with mobile device theft? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Enabling remote lock or wipe where supported' },
      { id: 'B', text: 'Keeping reliable backups for recovery' },
      { id: 'C', text: 'Installing antivirus software as the only defense' },
      { id: 'D', text: 'Using a strong screen lock and supported biometrics' },
      { id: 'E', text: 'Enabling device location features where appropriate' }
    ],
    correctAnswers: ['A', 'B', 'D', 'E'],
    explanation: 'Remote wipe prevents data extraction after physical theft, backups ensure recovery, strong lockouts stop physical brute forcing, and device locator tools help retrieve hardware.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q4',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 2: Anti-Reverse Engineering & Cryptographic Primitives',
    question: 'Which measures can make mobile applications harder to reverse engineer? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Binary packing or protection' },
      { id: 'B', text: 'Code obfuscation' },
      { id: 'C', text: 'Regular software updates alone' },
      { id: 'D', text: 'String obfuscation or encryption' },
      { id: 'E', text: 'User authentication alone' }
    ],
    correctAnswers: ['A', 'B', 'D'],
    explanation: 'Binary packing, identifier/control flow obfuscation, and string encryption significantly increase the friction and time required to decompile and inspect compiled binaries.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q5',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 2: Anti-Reverse Engineering & Cryptographic Primitives',
    question: 'What is a primary advantage of using a VPN on a mobile device?',
    type: 'single',
    options: [
      { id: 'A', text: 'Guaranteed faster internet' },
      { id: 'B', text: 'Encrypting traffic between the device and the VPN endpoint' },
      { id: 'C', text: 'Increasing device storage' },
      { id: 'D', text: 'Extending battery life' }
    ],
    correctAnswers: ['B'],
    explanation: 'A Virtual Private Network creates an encrypted tunnel between the mobile device and the VPN server, preventing local Wi-Fi eavesdropping.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q6',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 2: Anti-Reverse Engineering & Cryptographic Primitives',
    question: 'What is a primary benefit of biometric authentication on mobile devices?',
    type: 'single',
    options: [
      { id: 'A', text: 'Reducing device weight' },
      { id: 'B', text: 'Verifying access using a biological characteristic' },
      { id: 'C', text: 'Improving network connectivity' },
      { id: 'D', text: 'Automatically encrypting every file' }
    ],
    correctAnswers: ['B'],
    explanation: 'Biometric authentication uses unique biological characteristics (such as fingerprints or facial geometry) for fast, user-friendly authentication.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q7',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 2: Anti-Reverse Engineering & Cryptographic Primitives',
    question: 'Which technology is a widely used symmetric encryption standard for protecting data?',
    type: 'single',
    options: [
      { id: 'A', text: 'NFC' },
      { id: 'B', text: 'AES' },
      { id: 'C', text: 'VPN' },
      { id: 'D', text: 'HTTP' }
    ],
    correctAnswers: ['B'],
    explanation: 'Advanced Encryption Standard (AES) is the NIST-standardized symmetric key cipher widely used across mobile OSes (AES-128, AES-256 in GCM or CBC mode).',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q8',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 2: Anti-Reverse Engineering & Cryptographic Primitives',
    question: 'Which practice can directly introduce a mobile application security vulnerability?',
    type: 'single',
    options: [
      { id: 'A', text: 'Encrypting sensitive data appropriately' },
      { id: 'B', text: 'Hardcoding credentials or private keys in the app' },
      { id: 'C', text: 'Using secure communication channels' },
      { id: 'D', text: 'Performing regular security audits' }
    ],
    correctAnswers: ['B'],
    explanation: 'Hardcoding API secrets, private keys, or credentials inside client binaries allows attackers to extract them using basic decompilers like jadx or apktool.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q9',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 3: Threat Mitigation & Malware Detection',
    question: 'Which of the following is a potential mobile security threat?',
    type: 'single',
    options: [
      { id: 'A', text: 'Malware' },
      { id: 'B', text: 'Screen brightness settings' },
      { id: 'C', text: 'Battery level alone' },
      { id: 'D', text: 'Cloud storage quota limits' }
    ],
    correctAnswers: ['A'],
    explanation: 'Mobile malware (spyware, banking trojans, ransomware) directly threatens device integrity, user privacy, and sensitive credentials.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q10',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 3: Threat Mitigation & Malware Detection',
    question: 'Which strategies can help mitigate mobile security risks? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Applying operating-system and app security updates' },
      { id: 'B', text: 'Using strong, unique passwords and MFA where available' },
      { id: 'C', text: 'Extending battery life' },
      { id: 'D', text: 'Using a high-resolution display' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Patching known vulnerabilities through updates and enforcing strong passwords combined with MFA directly mitigate security risks.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p5-q11',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 3: Threat Mitigation & Malware Detection',
    question: 'What is a common technique for detecting malicious mobile applications?',
    type: 'single',
    options: [
      { id: 'A', text: 'Adjusting screen brightness' },
      { id: 'B', text: 'Behavioral analysis' },
      { id: 'C', text: 'Redesigning the user interface' },
      { id: 'D', text: 'Compressing files' }
    ],
    correctAnswers: ['B'],
    explanation: 'Behavioral analysis monitors runtime actions (suspicious socket connections, background recording, unexpected privilege escalation) to identify zero-day malware.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q12',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 3: Threat Mitigation & Malware Detection',
    question: 'Which practices contribute to mobile application security? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Decreasing screen resolution' },
      { id: 'B', text: 'Encrypting sensitive data' },
      { id: 'C', text: 'Using code obfuscation as a supporting measure' },
      { id: 'D', text: 'Reducing app features regardless of risk' },
      { id: 'E', text: 'Applying security updates' }
    ],
    correctAnswers: ['B', 'C', 'E'],
    explanation: 'Encryption, obfuscation as defense in depth, and rapid deployment of security patches fortify application resistance.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p5-q13',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 5: Mobile Security Study Notes',
    sectionName: 'Section 3: Threat Mitigation & Malware Detection',
    question: 'Which components or controls are important to mobile security? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Push notifications in every app' },
      { id: 'B', text: 'Sound encryption algorithms and key management' },
      { id: 'C', text: 'Graphical user-interface layouts alone' },
      { id: 'D', text: 'Secure biometric authentication systems where appropriate' }
    ],
    correctAnswers: ['B', 'D'],
    explanation: 'Cryptographic algorithms, robust key lifecycle management, and hardware-backed biometric authentication systems form the pillars of mobile device defense.',
    difficulty: 'medium',
    status: 'approved'
  },

  // -------------------------------------------------------------
  // PART 6: Mobile Security & Cyber Defense (3 Questions)
  // -------------------------------------------------------------
  {
    id: 'fso-p6-q1',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 6: Mobile Security & Cyber Defense',
    sectionName: 'Mobile Security & Cyber Defense MCQs',
    question: 'Reflecting on key mobile security concepts, which statements are correct? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Encryption is important for securing mobile communications.' },
      { id: 'B', text: 'Multi-factor authentication can improve mobile security.' },
      { id: 'C', text: 'Regular software updates prevent every possible security threat.' },
      { id: 'D', text: 'Mobile devices are immune to malware.' },
      { id: 'E', text: 'Physical security is irrelevant to a device\'s overall security.' }
    ],
    correctAnswers: ['A', 'B'],
    explanation: 'Encryption secures data in transit and at rest, and MFA adds a critical layer beyond passwords. Updates patch known defects but cannot prevent zero-days, and mobile devices are subject to physical and software attack vectors.',
    difficulty: 'medium',
    status: 'approved'
  },
  {
    id: 'fso-p6-q2',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 6: Mobile Security & Cyber Defense',
    sectionName: 'Mobile Security & Cyber Defense MCQs',
    question: 'Which are useful next steps for further education in cyber defense? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Join a cyber defense social media group and treat every post as verified' },
      { id: 'B', text: 'Read only fictional books about hacking' },
      { id: 'C', text: 'Attend workshops and seminars on mobile security' },
      { id: 'D', text: 'Follow reputable cybersecurity journals and publications' },
      { id: 'E', text: 'Participate in technical forums and communities while verifying claims' },
      { id: 'F', text: 'Consider a relevant cybersecurity certification or structured training program' }
    ],
    correctAnswers: ['C', 'D', 'E', 'F'],
    explanation: 'Workshops, reputable peer-reviewed journals, verified technical forums, and structured certifications (e.g. CEH, CompTIA Security+, OSCP) build accredited cyber defense skills.',
    difficulty: 'easy',
    status: 'approved'
  },
  {
    id: 'fso-p6-q3',
    subjectCode: 'FSO-307',
    subjectName: 'Mobile Application & Device Security',
    semester: 7,
    category: 'open-elective',
    partName: 'Part 6: Mobile Security & Cyber Defense',
    sectionName: 'Mobile Security & Cyber Defense MCQs',
    question: 'Which practices help secure mobile devices? (Select all that apply)',
    type: 'multiple',
    options: [
      { id: 'A', text: 'Disable screen-lock security for convenience' },
      { id: 'B', text: 'Enable remote lock or wipe where supported' },
      { id: 'C', text: 'Install applications from trusted sources and review permissions' },
      { id: 'D', text: 'Use public Wi-Fi for sensitive activity without protection' },
      { id: 'E', text: 'Avoid passwords because they are inconvenient' },
      { id: 'F', text: 'Keep the operating system and apps updated' }
    ],
    correctAnswers: ['B', 'C', 'F'],
    explanation: 'Remote wipe limits exposure upon device loss, trusted app sources mitigate trojanized binaries, and system updates patch security flaws.',
    difficulty: 'easy',
    status: 'approved'
  }
]
