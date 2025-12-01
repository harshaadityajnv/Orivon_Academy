// src/components/Quiz.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  // Prefer selecting by title when available (keeps behavior robust if only title is passed).
  courseId?: number; // expected 1..6 (matches your courses table ids)
  courseTitle?: string; // optional human-readable course title
  onSubmit: (score: number, totalQuestions: number) => void;
}

/**
 * Quiz.tsx
 * - 6 banks of 60 questions each (hardcoded from your provided banks)
 * - 90 minute timer (5400s) with auto-submit at 0
 * - Save per-question (visual state)
 * - Computes score using the provided correct answers
 *
 * Notes:
 * - If your course IDs differ, update `courseBankMap`.
 * - Comparison for answers is done case-insensitive & trimmed.
 */

/* ---------------------------
   BANKS: questions + answers
   (All banks are included below — bank1 .. bank6)
   --------------------------- */

/* ---------- Bank 1 ---------- */
const bank1_questions: QuizQuestion[] = [
  { id: 1, question: 'LLM stands for:', options: ['Large Language Model', 'Long Logic Machine', 'Low Latency Model', 'Layered Learning Model'] },
  { id: 2, question: 'GPT models are examples of:', options: ['RNNs', 'Transformers', 'CNNs', 'SVMs'] },
  { id: 3, question: 'Tokenization converts text into:', options: ['HTML', 'Numbers (tokens)', 'Images', 'Audio'] },
  { id: 4, question: 'Prompt engineering involves:', options: ['Training LLMs', 'Crafting effective inputs', 'Writing SQL', 'Fixing networks'] },
  { id: 5, question: 'Which is a popular embedding model?', options: ['ResNet', 'Word2Vec', 'YOLO', 'CNNNet'] },
  { id: 6, question: 'Temperature in LLMs controls:', options: ['Speed', 'Randomness', 'Memory', 'Accuracy'] },
  { id: 7, question: 'A dataset used to fine-tune LLMs must be:', options: ['Unlabeled', 'Clean & structured', 'Encrypted', 'HTML-based'] },
  { id: 8, question: 'LLMs are mainly trained using:', options: ['Supervised only', 'Reinforcement only', 'A mix of supervised + unsupervised', 'Audio data only'] },
  { id: 9, question: 'A decoder-only transformer predicts:', options: ['Next token', 'Image', 'Sound', 'Video'] },
  { id: 10, question: 'Which library is used for LLMs?', options: ['NumPy', 'Transformers (HuggingFace)', 'Bootstrap', 'Matplotlib'] },
  { id: 11, question: 'Embeddings represent text as:', options: ['2D images', 'Vectors', 'Colors', 'Tables'] },
  { id: 12, question: 'Fine-tuning means:', options: ['Training from scratch', 'Adjusting a pre-trained model', 'Compressing file', 'Saving prompt'] },
  { id: 13, question: 'RAG stands for:', options: ['Retrieval Augmented Generation', 'Random Access Generation', 'Rapid AI Generator', 'Real-time Auto Generator'] },
  { id: 14, question: 'LLM hallucination means:', options: ['High accuracy', 'Wrong confident output', 'No response', 'Syntax error'] },
  { id: 15, question: 'Which file stores model weights?', options: ['JSON', '.bin', '.txt', '.css'] },
  { id: 16, question: 'Zero-shot learning means:', options: ['Training without data', 'Model answers unseen tasks', 'GPU disabled', 'Removing layers'] },
  { id: 17, question: 'Which framework helps deploy LLMs?', options: ['Flask', 'LangChain', 'WordPress', 'Figma'] },
  { id: 18, question: 'The main unit of text processed by LLMs is:', options: ['Paragraph', 'Word', 'Token', 'HTML'] },
  { id: 19, question: 'RLHF stands for:', options: ['Reinforcement Learning from Human Feedback', 'Realtime Layered Human Feedback', 'Random Learning from History Files', 'Restricted Learning for Humans'] },
  { id: 20, question: 'Transformers use:', options: ['Convolutions', 'Attention', 'Pooling', 'Images'] },
  { id: 21, question: 'RAG requires a:', options: ['Vector database', 'Browser', 'Antivirus', 'WiFi extender'] },
  { id: 22, question: 'Popular vector DB:', options: ['MySQL', 'Pinecone', 'MongoDB', 'Redis UI'] },
  { id: 23, question: 'Embedding similarity uses:', options: ['Euclidean or cosine similarity', 'Colors', 'Ports', 'Images'] },
  { id: 24, question: 'To reduce hallucination, use:', options: ['Higher temperature', 'RAG', 'Random prompts', 'Disable memory'] },
  { id: 25, question: 'Fine-tuning improves:', options: ['Server cost', 'Domain-specific accuracy', 'UI color', 'Line spacing'] },
  { id: 26, question: 'A dataset for fine-tuning must include:', options: ['Questions + ideal answers', 'Images only', 'Emojis', 'CSS code'] },
  { id: 27, question: 'LoRA makes fine-tuning:', options: ['Slower', 'Cheaper & lightweight', 'Impossible', 'Multi-modal'] },
  { id: 28, question: 'Chat models are optimized for:', options: ['Single-word outputs', 'Dialogue', 'Images', 'Databases'] },
  { id: 29, question: 'H100 refers to:', options: ['Disk', 'GPU', 'Router', 'Browser'] },
  { id: 30, question: "Transformer's attention focuses on:", options: ['Current token only', 'Relationships between tokens', 'Random data', 'System logs'] },
  { id: 31, question: 'A system prompt controls:', options: ['GPU', 'Model behavior', 'Browser', 'API headers'] },
  { id: 32, question: 'An embedding model is used for:', options: ['Data storage', 'Text similarity', 'HTML formatting', 'UI design'] },
  { id: 33, question: 'LangChain Helps:', options: ['Connect LLMs with tools', 'Build games', 'Host videos', 'Compress ZIP files'] },
  { id: 34, question: 'Which improves prompt results?', options: ['Fewer instructions', 'Clear structured prompts', 'Random text', 'Large HTML files'] },
  { id: 35, question: 'LLM inference means:', options: ['Training', 'Model answering', 'Editing prompts', 'Running HTML'] },
  { id: 36, question: 'GPU is preferred because:', options: ['Cheaper', 'Parallel processing', 'Low power', 'No heat'] },
  { id: 37, question: 'A long prompt may cause:', options: ['Training', 'Token overflow', 'Browser crash', '3D animation'] },
  { id: 38, question: 'Model quantization:', options: ['Increases size', 'Reduces size & speeds inference', 'Corrupts data', 'Disables GPU'] },
  { id: 39, question: 'A base model is the:', options: ['UI', 'Pre-trained foundation model', 'CSS file', 'Optimizer'] },
  { id: 40, question: 'LLM APIs typically return:', options: ['JSON', 'MP3', 'JPG', 'PDF'] },
  { id: 41, question: 'Chain-of-thought refers to:', options: ['GPU signals', 'Step-by-step reasoning', 'Memory leak', 'Error stack'] },
  { id: 42, question: 'To use RAG, you must first:', options: ['Vectorize documents', 'Run HTML', 'Host DNS', 'Install antivirus'] },
  { id: 43, question: 'LLM memory stores:', options: ['All prompts forever', 'Short conversation context', 'Images', 'Videos'] },
  { id: 44, question: 'LLM drift means:', options: ['Server restart', 'Model responses degrade', 'Browser update', 'Increased accuracy'] },
  { id: 45, question: 'Prompt chaining means:', options: ['Deleting prompts', 'Combining multiple prompts', 'Compressing text', 'Slowing inference'] },
  { id: 46, question: 'Your LLM makes up facts. You should use:', options: ['Higher temperature', 'RAG', 'Smaller model', 'Hidden prompt'] },
  { id: 47, question: 'You need instant similarity search for documents:', options: ['MySQL', 'Pinecone / FAISS', 'Excel', 'PDFs only'] },
  { id: 48, question: 'User asks questions outside your dataset; model answers wrong. Fix:', options: ['Block user', 'Add retrieval step', 'Increase tokens', 'Lower accuracy'] },
  { id: 49, question: 'Response is repetitive and dull. You should:', options: ['Lower temperature', 'Increase temperature', 'Remove prompt', 'Disable model'] },
  { id: 50, question: 'Your fine-tuned model responds off-topic. Reason:', options: ['Wrong GPU', 'Bad training data', 'Low internet', 'HTML issue'] },
  { id: 51, question: 'Output contains sensitive data from previous conversations. Issue:', options: ['System prompt', 'Bad memory handling', 'GPU overheating', 'DNS error'] },
  { id: 52, question: 'LLM is slow when deployed. Fix:', options: ['Larger prompt', 'Quantize model', 'Remove GPU', 'Add CSS'] },
  { id: 53, question: 'You need to explain model decisions. Use:', options: ['XAI tools', 'PNG', 'HTML docs', 'VPN'] },
  { id: 54, question: 'App must handle huge traffic for inference. Use:', options: ['Single CPU', 'GPU autoscaling', 'Shared WiFi', 'Local browser'] },
  { id: 55, question: 'RAG retrieval returns irrelevant chunks. Fix:', options: ['Add noise', 'Improve chunking', 'Convert to JPG', 'Disable search'] },
  { id: 56, question: 'You must limit user queries to prevent abuse. Use:', options: ['Rate limiting', 'HTML button', 'Border-radius', 'PNG'] },
  { id: 57, question: 'Prompt includes sensitive instructions that user should not see. Use:', options: ['Public prompt', 'System prompt', 'User prompt', 'Empty prompt'] },
  { id: 58, question: 'You want the model to follow rules STRICTLY. Do:', options: ['Add more jokes', 'Strong system prompt', 'Change theme', 'Add emojis'] },
  { id: 59, question: "Document embeddings aren't updating. Issue likely in:", options: ['Vector DB ingestion', 'CSS', 'UI', 'Chatbox'] },
  { id: 60, question: 'You want to combine tools + LLM + APIs in a pipeline:', options: ['Photoshop', 'LangChain', 'Video editor', 'Notepad'] },
];

const bank1_answers: Record<number, string> = {
  1: 'Large Language Model',
  2: 'Transformers',
  3: 'Numbers (tokens)',
  4: 'Crafting effective inputs',
  5: 'Word2Vec',
  6: 'Randomness',
  7: 'Clean & structured',
  8: 'A mix of supervised + unsupervised',
  9: 'Next token',
  10: 'Transformers (HuggingFace)',
  11: 'Vectors',
  12: 'Adjusting a pre-trained model',
  13: 'Retrieval Augmented Generation',
  14: 'Wrong confident output',
  15: '.bin',
  16: 'Model answers unseen tasks',
  17: 'LangChain',
  18: 'Token',
  19: 'Reinforcement Learning from Human Feedback',
  20: 'Attention',
  21: 'Vector database',
  22: 'Pinecone',
  23: 'Euclidean or cosine similarity',
  24: 'RAG',
  25: 'Domain-specific accuracy',
  26: 'Questions + ideal answers',
  27: 'Cheaper & lightweight',
  28: 'Dialogue',
  29: 'GPU',
  30: 'Relationships between tokens',
  31: 'Model behavior',
  32: 'Text similarity',
  33: 'Connect LLMs with tools',
  34: 'Clear structured prompts',
  35: 'Model answering',
  36: 'Parallel processing',
  37: 'Token overflow',
  38: 'Reduces size & speeds inference',
  39: 'Pre-trained foundation model',
  40: 'JSON',
  41: 'Step-by-step reasoning',
  42: 'Vectorize documents',
  43: 'Short conversation context',
  44: 'Model responses degrade',
  45: 'Combining multiple prompts',
  46: 'RAG',
  47: 'Pinecone / FAISS',
  48: 'Add retrieval step',
  49: 'Increase temperature',
  50: 'Bad training data',
  51: 'Bad memory handling',
  52: 'Quantize model',
  53: 'XAI tools',
  54: 'GPU autoscaling',
  55: 'Improve chunking',
  56: 'Rate limiting',
  57: 'System prompt',
  58: 'Strong system prompt',
  59: 'Vector DB ingestion',
  60: 'LangChain',
};

/* ---------- Bank 2 ---------- */
const bank2_questions: QuizQuestion[] = [
  { id: 1, question: 'A firewall is used to:', options: ['Speed up internet', 'Block unauthorized access', 'Store data', 'Build APIs'] },
  { id: 2, question: 'Malware stands for:', options: ['Malfunctioned software', 'Malicious software', 'Managed ware', 'Machine ware'] },
  { id: 3, question: 'Which is a strong password example?', options: ['password123', 'Admin@123', 'qwerty', '000000'] },
  { id: 4, question: 'Phishing attacks mainly use:', options: ['Emails', 'Cameras', 'Servers', 'Routers'] },
  { id: 5, question: 'Encryption converts data into:', options: ['Plain text', 'Cipher text', 'Images', 'Binary'] },
  { id: 6, question: 'Which protocol secures websites?', options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'] },
  { id: 7, question: 'VPN is used for:', options: ['Faster browsing', 'Private network access', 'Hardware backup', 'UI design'] },
  { id: 8, question: 'SQL Injection targets:', options: ['Storage', 'Database', 'Browser', 'RAM'] },
  { id: 9, question: 'A brute force attack tries:', options: ['One password', 'Random passwords repeatedly', 'Encrypt file', 'Monitor logs'] },
  { id: 10, question: 'Which is a hashing algorithm?', options: ['SHA-256', 'HTML', 'CSS', 'DHCP'] },
  { id: 11, question: 'Antivirus detects:', options: ['UI bugs', 'Malware', 'HTML errors', 'Internet speed'] },
  { id: 12, question: 'Ransomware mainly:', options: ['Deletes OS', 'Locks files', 'Speeds up PC', 'Installs drivers'] },
  { id: 13, question: 'Port 22 is used for:', options: ['FTP', 'SSH', 'Mail', 'DNS'] },
  { id: 14, question: 'Social engineering exploits:', options: ['Networks', 'People', 'URLs', 'Logs'] },
  { id: 15, question: 'The principle of least privilege means:', options: ['Grant full access', 'Minimum required access', 'Block all access', 'No one can use a system'] },
  { id: 16, question: 'A DoS attack causes:', options: ['Faster traffic', 'Website slowdown', 'Better performance', 'Encrypted backups'] },
  { id: 17, question: 'HTTPS uses which protocol for security?', options: ['DNS', 'TLS/SSL', 'FTP', 'ICMP'] },
  { id: 18, question: 'A vulnerability is:', options: ['Fix', 'Security weakness', 'Hardware', 'Backup'] },
  { id: 19, question: 'Two-factor authentication uses:', options: ['Only password', 'Password + OTP', 'Only fingerprint', 'Only email'] },
  { id: 20, question: 'IDS stands for:', options: ['Internal Data Storage', 'Intrusion Detection System', 'Internet Data Server', 'Input Data Security'] },
  { id: 21, question: 'Kali Linux is used for:', options: ['Gaming', 'Penetration testing', 'Video editing', 'Blogging'] },
  { id: 22, question: 'Nmap is a tool for:', options: ['Password saving', 'Network scanning', 'Coding', 'Drawing'] },
  { id: 23, question: 'Metasploit is mainly for:', options: ['Social media', 'Exploitation', 'Emails', 'DNS'] },
  { id: 24, question: 'Hydra is used for:', options: ['Image editing', 'Brute force attacks', 'Encryption', 'Logging'] },
  { id: 25, question: 'Burp Suite is used to test:', options: ['Hardware', 'Web applications', 'Mobile batteries', 'Network cables'] },
  { id: 26, question: 'Wireshark captures:', options: ['Photos', 'Network packets', 'Passwords only', 'Logs'] },
  { id: 27, question: 'SQL injection affects:', options: ['CSS', 'UI', 'Database queries', 'Emails'] },
  { id: 28, question: 'Which command scans open ports?', options: ['netport', 'nmap', 'port-scan', 'metascan'] },
  { id: 29, question: 'A botnet is:', options: ['Social media', 'Network of infected systems', 'Cloud server', 'Container'] },
  { id: 30, question: 'XSS stands for:', options: ['Cross-Site Scripting', 'Cross Server Security', 'Extra Secure Script', 'XML Site Scan'] },
  { id: 31, question: 'Hash cracking tool:', options: ['Hashcat', 'Chrome', 'Paint', 'Blender'] },
  { id: 32, question: 'The default SSH port is:', options: ['80', '22', '443', '53'] },
  { id: 33, question: 'John the Ripper is used for:', options: ['Password cracking', 'Scanning networks', 'DNS lookups', 'Creating malware'] },
  { id: 34, question: 'OWASP Top 10 lists:', options: ['UI designs', 'Web vulnerabilities', 'Cloud services', 'Firewalls'] },
  { id: 35, question: 'A honeypot is:', options: ['Fake vulnerable system', 'Password manager', 'Router', 'VPN'] },
  { id: 36, question: 'VPN hides:', options: ['Website color', 'IP address', 'Storage', 'CPU speed'] },
  { id: 37, question: 'MITM attack means:', options: ['Man-in-the-Middle', 'Machine-in-the-Mode', 'Malware-in-the-Memory', 'Monitor-in-the-Mesh'] },
  { id: 38, question: 'Two common hash types:', options: ['GIF, JPEG', 'SHA, MD5', 'HTML, CSS', 'I/O, CPU'] },
  { id: 39, question: 'Sudo gives:', options: ['User-level access', 'Root privileges', 'No access', 'Cloud access'] },
  { id: 40, question: 'A keylogger records:', options: ['Mouse clicks', 'Keystrokes', 'Photos', 'Code'] },
  { id: 41, question: 'DoS stands for:', options: ['Data Operating System', 'Denial of Service', 'Domain of Security', 'Device Over Scan'] },
  { id: 42, question: 'A secure hash is:', options: ['Reversible', 'Irreversible', 'Hidden text', 'Image-based'] },
  { id: 43, question: 'Default HTTP port:', options: ['80', '21', '22', '8080'] },
  { id: 44, question: 'Rainbow tables are used for:', options: ['Encryption', 'Hash cracking', 'Drawing graphs', 'Access logs'] },
  { id: 45, question: 'Nikto scans:', options: ['Websites for vulnerabilities', 'Mobile phones', 'Hardware devices', 'Password strength'] },
  { id: 46, question: 'A user receives an email asking for bank details. You identify this as:', options: ['Worm', 'Phishing', 'DDoS', 'DoS'] },
  { id: 47, question: 'Your company server is getting millions of fake requests. This is:', options: ['XSS', 'DDoS attack', 'SQL injection', 'Bot login'] },
  { id: 48, question: 'You find strange outbound traffic from a PC. Possible cause:', options: ['Malware infection', 'DNS update', 'Sleep mode', 'UI refresh'] },
  { id: 49, question: 'A user reports browser redirects to unknown sites. Likely:', options: ['Keylogger', 'Browser hijacker', 'Backup failure', 'VPN issue'] },
  { id: 50, question: 'Your web app exposes user emails publicly. This is:', options: ['Good UX', 'Vulnerability', 'Optimization', 'Cache issue'] },
  { id: 51, question: 'API is revealing data without authentication. Issue?', options: ['Slow network', 'Broken access control', 'Logging error', 'CSS bug'] },
  { id: 52, question: 'You see unusual login attempts from multiple countries.', options: ['Normal', 'Password spraying', 'DevOps issue', 'UI bug'] },
  { id: 53, question: 'Database queries behave strangely after user input. Likely:', options: ['CSS bug', 'SQL Injection', 'Font issue', 'HTML comment'] },
  { id: 54, question: 'Your Wi-Fi is slow and unknown devices appear. Reason:', options: ['Malware', 'Unauthorized access', 'Router wallpaper', 'ISP promotion'] },
  { id: 55, question: 'You detect an attacker between client & server capturing data:', options: ['DoS', 'MITM', 'Sniffing', 'Scripting'] },
  { id: 56, question: 'Password hashes are leaked. Immediate action:', options: ['Ignore', 'Force password reset', 'Delete website', 'Restart system'] },
  { id: 57, question: 'A junior dev commits API keys to GitHub. You should:', options: ['Like the commit', 'Rotate keys', 'Ban GitHub', 'Reboot router'] },
  { id: 58, question: 'Your site gets spam form submissions. Prevent using:', options: ['CAPTCHA', 'CSS', 'Logs', 'Localhost'] },
  { id: 59, question: 'A user logs in without OTP even though enabled:', options: ['Strong login', 'Broken MFA', 'UI glitch', 'Normal'] },
  { id: 60, question: 'Ransomware hits a system. First step:', options: ['Pay ransom', 'Isolate system', 'Delete OS', 'Refresh browser'] },
];

const bank2_answers: Record<number, string> = {
  1: 'Block unauthorized access',
  2: 'Malicious software',
  3: 'Admin@123',
  4: 'Emails',
  5: 'Cipher text',
  6: 'HTTPS',
  7: 'Private network access',
  8: 'Database',
  9: 'Random passwords repeatedly',
  10: 'SHA-256',
  11: 'Malware',
  12: 'Locks files',
  13: 'SSH',
  14: 'People',
  15: 'Minimum required access',
  16: 'Website slowdown',
  17: 'TLS/SSL',
  18: 'Security weakness',
  19: 'Password + OTP',
  20: 'Intrusion Detection System',
  21: 'Penetration testing',
  22: 'Network scanning',
  23: 'Exploitation',
  24: 'Brute force attacks',
  25: 'Web applications',
  26: 'Network packets',
  27: 'Database queries',
  28: 'nmap',
  29: 'Network of infected systems',
  30: 'Cross-Site Scripting',
  31: 'Hashcat',
  32: '22',
  33: 'Password cracking',
  34: 'Web vulnerabilities',
  35: 'Fake vulnerable system',
  36: 'IP address',
  37: 'Man-in-the-Middle',
  38: 'SHA, MD5',
  39: 'Root privileges',
  40: 'Keystrokes',
  41: 'Denial of Service',
  42: 'Irreversible',
  43: '80',
  44: 'Hash cracking',
  45: 'Websites for vulnerabilities',
  46: 'Phishing',
  47: 'DDoS attack',
  48: 'Malware infection',
  49: 'Browser hijacker',
  50: 'Vulnerability',
  51: 'Broken access control',
  52: 'Password spraying',
  53: 'SQL Injection',
  54: 'Unauthorized access',
  55: 'MITM',
  56: 'Force password reset',
  57: 'Rotate keys',
  58: 'CAPTCHA',
  59: 'Broken MFA',
  60: 'Isolate system',
};

/* ---------- Bank 3 ---------- */
const bank3_questions: QuizQuestion[] = [
  { id: 1, question: 'No-code tools allow you to build apps without:', options: ['Internet', 'Coding', 'UI', 'Database'] },
  { id: 2, question: 'Zapier is used for:', options: ['Image editing', 'Automation workflows', 'Video calls', 'Antivirus'] },
  { id: 3, question: 'Make.com is also known as:', options: ['Integromat', 'OpenAI', 'Firebase', 'Canva'] },
  { id: 4, question: 'Which tool builds internal dashboards?', options: ['Retool', 'Photoshop', 'Blender', 'GitHub'] },
  { id: 5, question: 'Webhooks are used for:', options: ['Sending emails', 'Triggering events', 'Changing HTML', 'Editing photos'] },
  { id: 6, question: 'API stands for:', options: ['Application Programming Interface', 'Automated Process Integration', 'App Performance Index', 'Advanced Processing Input'] },
  { id: 7, question: 'The trigger in a workflow means:', options: ['The output', 'The starting event', 'The failure', 'The timeout'] },
  { id: 8, question: 'No-code apps store data using:', options: ['Databases', 'Images', 'HTML', 'DNS'] },
  { id: 9, question: 'Airtable is a:', options: ['Video tool', 'Spreadsheet-style database', 'Social media site', 'Router tool'] },
  { id: 10, question: 'LLM stands for:', options: ['Large Language Model', 'Local Logic Machine', 'Long Layer Model', 'Label Learning Model'] },
  { id: 11, question: 'The purpose of automation is to:', options: ['Increase manual work', 'Reduce repetitive tasks', 'Slow systems', 'Remove UI'] },
  { id: 12, question: 'Which is a popular no-code website builder?', options: ['Django', 'Wix', 'Express', 'React'] },
  { id: 13, question: 'A bot flow is:', options: ['Hardware chip', 'Conversation logic', 'CSS file', 'Storage drive'] },
  { id: 14, question: 'Email automation uses:', options: ['Triggers + actions', 'HTML only', 'Printing', 'Bluetooth'] },
  { id: 15, question: 'Which is NOT a no-code tool?', options: ['Bubble', 'Webflow', 'Figma', 'Kubernetes'] },
  { id: 16, question: 'A workflow stops working due to missing data. This is called:', options: ['Error', 'Loop', 'Styling', 'Rendering'] },
  { id: 17, question: 'No-code databases mainly store:', options: ['Videos', 'Tables', 'Tokens', '3D models'] },
  { id: 18, question: 'Which connector is used in automation tools?', options: ['API connector', 'HDMI', 'VGA', 'USB'] },
  { id: 19, question: 'A bot replying automatically is called:', options: ['Chatflow', 'Webflow', 'Pageflow', 'Picflow'] },
  { id: 20, question: 'Automation tools rely on:', options: ['Manual scripts', 'Event triggers', 'Random predictions', 'Browser cache'] },
  { id: 21, question: 'LLM responses are generated using:', options: ['Tokens', 'HTML tags', 'Screenshots', 'Browsers'] },
  { id: 22, question: 'Webhook POST request means:', options: ['Receive data', 'Send data', 'Upload photos', 'Delete logs'] },
  { id: 23, question: 'Which tool builds WhatsApp automation?', options: ['Twilio', 'MS Paint', 'ZBrush', 'Pixar'] },
  { id: 24, question: 'JSON is used to:', options: ['Style UI', 'Transfer structured data', 'Draw images', 'Train models'] },
  { id: 25, question: 'An AI agent uses:', options: ['Only CSS', 'Prompts + tools', 'Screens', 'Firewalls'] },
  { id: 26, question: 'Large workflows should be:', options: ['Modular', 'One giant step', 'Hard-coded', 'Untested'] },
  { id: 27, question: 'Which can automate Google Sheets?', options: ['WhatsApp', 'Zapier', 'Figma', 'Docker'] },
  { id: 28, question: 'A conversation state helps chatbots:', options: ['Change color', 'Remember previous messages', 'Install OS', 'Delete API'] },
  { id: 29, question: 'API authentication often uses:', options: ['Tokens / API keys', 'Paper forms', 'Pic files', 'Emojis'] },
  { id: 30, question: 'To avoid infinite loops in workflows, use:', options: ['Fast CPU', 'Filters', 'Bigger monitor', 'Many triggers'] },
  { id: 31, question: 'LLM hallucination can be reduced using:', options: ['Correct prompts', 'More CSS', 'Random text', 'HTML scripts'] },
  { id: 32, question: 'A flow that runs every day is:', options: ['Conditional', 'Scheduled', 'Manual', 'Broken'] },
  { id: 33, question: 'Webhook URLs must be:', options: ['Private', 'Public', 'Colorful', 'Animated'] },
  { id: 34, question: 'Airtable views help:', options: ['Change color', 'Organize data', 'Install drivers', 'Delete API'] },
  { id: 35, question: 'LLM prompts should be:', options: ['Clear & structured', 'Random', 'Extra long', 'Repeated manually'] },
  { id: 36, question: 'OAuth is used for:', options: ['Authentication', 'Drawing', 'Styling', 'Encryption'] },
  { id: 37, question: 'A chatbot fallback triggers when:', options: ['User speaks clearly', 'Bot fails to understand', 'Internet is fast', 'UI loads'] },
  { id: 38, question: 'Automations should fail with:', options: ['Hidden errors', 'Clear error logs', 'No logs', 'Reboots'] },
  { id: 39, question: 'AI actions in workflows usually call:', options: ['APIs', 'PNGs', 'HTML docs', 'DNS'] },
  { id: 40, question: 'Workflow latency increases with:', options: ['Fewer steps', 'Too many tasks', 'Clean code', 'GPU'] },
  { id: 41, question: 'Google App Script is used to:', options: ['Draw art', 'Automate Google products', 'Play audio', 'Scan ports'] },
  { id: 42, question: 'No-code chatbots mostly function via:', options: ['CSS', 'Flow diagrams', 'Download pages', 'Network shapes'] },
  { id: 43, question: 'Multi-step automations require:', options: ['Many triggers', 'Trigger → Actions → Conditions', 'HTML + CSS', 'Video animations'] },
  { id: 44, question: 'AI automation replaces:', options: ['Creative thinking', 'Repetitive manual work', 'Human decisions', 'Coding frameworks'] },
  { id: 45, question: 'API rate limits prevent:', options: ['UI loading', 'Too many requests', 'GPU crash', 'CSS styling'] },
  { id: 46, question: 'A user submits a form; you want Slack notification. Automation step?', options: ['VPN', 'Trigger: Form submission', 'Delete workflow', 'Play audio'] },
  { id: 47, question: 'You want the bot to reply differently based on user mood. Use:', options: ['Color filter', 'LLM sentiment detection', 'HTML tags', 'Random generator'] },
  { id: 48, question: 'Your automation keeps looping endlessly. Why?', options: ['Circular trigger', 'Wrong CSS', 'GPU overheated', 'Missing plugin'] },
  { id: 49, question: 'You need to send daily reports automatically. Choose:', options: ['Manual flow', 'Scheduled trigger', 'CSS class', 'Storage bucket'] },
  { id: 50, question: 'Leads entered in Google Forms must reach CRM. Use:', options: ['WhatsApp', 'Sheet → CRM integration', 'MS Word', 'Firewall'] },
  { id: 51, question: 'A user types “help” in chatbot; bot must show support page. Use:', options: ['Image', 'Intent mapping', 'DNS', 'Excel'] },
  { id: 52, question: 'A webhook does not fire. Check first:', options: ['URL is public', 'Color theme', 'Folder name', 'Laptop brightness'] },
  { id: 53, question: 'You want to summarize long text automatically. Use:', options: ['RAG', 'LLM summarize action', 'PNG', 'SID'] },
  { id: 54, question: 'An automation fails because API key is invalid. Fix:', options: ['Restart app', 'Update API key', 'Change color', 'Open Figma'] },
  { id: 55, question: 'Chatbot continuously replies wrong. Likely issue:', options: ['Bad prompt', 'Good flow', 'Laptop charger', 'Window size'] },
  { id: 56, question: 'User attachment must be stored automatically. Use:', options: ['File upload → Cloud storage', 'Browser history', 'DNS record', 'HTML table'] },
  { id: 57, question: 'You want to block spam messages. Add:', options: ['CAPTCHA', 'Extra CSS', 'More text', 'Video'] },
  { id: 58, question: 'An email automation sends twice. Reason:', options: ['Looping trigger', 'Low battery', 'Missing CSS', 'Fast WiFi'] },
  { id: 59, question: 'Bot must provide invoice when asked. You should:', options: ['Restart bot', 'Add conditional logic', 'Delete data', 'Turn off triggers'] },
  { id: 60, question: 'A workflow stops midway. First diagnostic step:', options: ['Check error logs', 'Change wallpaper', 'Restart router', 'Upgrade CSS'] },
];

const bank3_answers: Record<number, string> = {
  1: 'Coding',
  2: 'Automation workflows',
  3: 'Integromat',
  4: 'Retool',
  5: 'Triggering events',
  6: 'Application Programming Interface',
  7: 'The starting event',
  8: 'Databases',
  9: 'Spreadsheet-style database',
  10: 'Large Language Model',
  11: 'Reduce repetitive tasks',
  12: 'Wix',
  13: 'Conversation logic',
  14: 'Triggers + actions',
  15: 'Kubernetes',
  16: 'Error',
  17: 'Tables',
  18: 'API connector',
  19: 'Chatflow',
  20: 'Event triggers',
  21: 'Tokens',
  22: 'Send data',
  23: 'Twilio',
  24: 'Transfer structured data',
  25: 'Prompts + tools',
  26: 'Modular',
  27: 'Zapier',
  28: 'Remember previous messages',
  29: 'Tokens / API keys',
  30: 'Filters',
  31: 'Correct prompts',
  32: 'Scheduled',
  33: 'Public',
  34: 'Organize data',
  35: 'Clear & structured',
  36: 'Authentication',
  37: 'Bot fails to understand',
  38: 'Clear error logs',
  39: 'APIs',
  40: 'Too many tasks',
  41: 'Automate Google products',
  42: 'Flow diagrams',
  43: 'Trigger → Actions → Conditions',
  44: 'Repetitive manual work',
  45: 'Too many requests',
  46: 'Trigger: Form submission',
  47: 'LLM sentiment detection',
  48: 'Circular trigger',
  49: 'Scheduled trigger',
  50: 'Sheet → CRM integration',
  51: 'Intent mapping',
  52: 'URL is public',
  53: 'LLM summarize action',
  54: 'Update API key',
  55: 'Bad prompt',
  56: 'File upload → Cloud storage',
  57: 'CAPTCHA',
  58: 'Looping trigger',
  59: 'Add conditional logic',
  60: 'Check error logs',
};

/* ---------- Bank 4 ---------- */
const bank4_questions: QuizQuestion[] = [
  { id: 1, question: 'Which language is used to structure content on web pages?', options: ['Java', 'HTML', 'Python', 'PHP'] },
  { id: 2, question: 'Which tag is used to display the largest heading?', options: ['<h6>', '<h3>', '<h1>', '<h5>'] },
  { id: 3, question: 'CSS is mainly used for:', options: ['Logic building', 'Page structure', 'Styling web pages', 'Database work'] },
  { id: 4, question: 'Which property sets the text color in CSS?', options: ['font', 'color', 'text-style', 'text-color'] },
  { id: 5, question: 'JavaScript runs in:', options: ['Browser', 'Server only', 'Compiler only', 'Database'] },
  { id: 6, question: 'Which keyword declares a variable in JS?', options: ['var', 'const', 'let', 'All of the above'] },
  { id: 7, question: 'Which symbol is used for comments in JS?', options: ['#', '//', '<!--', '**'] },
  { id: 8, question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Method', 'Desktop Object Manager', 'Document Oriented Module'] },
  { id: 9, question: 'Which method selects an element by ID?', options: ['getElement()', 'selectByID()', 'getElementById()', 'query()'] },
  { id: 10, question: 'Which HTTP method retrieves data?', options: ['POST', 'PUT', 'GET', 'PATCH'] },
  { id: 11, question: 'JSON stands for:', options: ['Java Source Object Notation', 'JavaScript Object Notation', 'Java Standard Object Name', 'JavaScript Online Node'] },
  { id: 12, question: 'Which symbol accesses object properties in JS?', options: [':', '.', '@', '#'] },
  { id: 13, question: 'Which tag creates a hyperlink?', options: ['<p>', '<a>', '<link>', '<href>'] },
  { id: 14, question: 'Flexbox is used for:', options: ['Database queries', 'Responsive layouts', 'API routing', 'Encryption'] },
  { id: 15, question: 'Which command initializes a Node.js project?', options: ['node init', 'npm install', 'npm init', 'npm start'] },
  { id: 16, question: 'Node.js uses which language?', options: ['Python', 'JavaScript', 'C#', 'PHP'] },
  { id: 17, question: 'Express is used for:', options: ['CSS styling', 'Creating APIs', 'Graphic design', 'Database creation'] },
  { id: 18, question: 'Which database is document-based?', options: ['MySQL', 'MongoDB', 'Oracle', 'SQLite'] },
  { id: 19, question: 'SQL is used for:', options: ['Styling', 'Server-side logic', 'Database queries', 'APIs'] },
  { id: 20, question: 'Which attribute is required in the <img> tag?', options: ['src', 'type', 'class', 'href'] },
  { id: 21, question: 'CSS stands for:', options: ['Creative Style Sheet', 'Cascading Style Sheets', 'Colorful Style Sheet', 'Computer Style System'] },
  { id: 22, question: 'JS function keyword:', options: ['fun', 'function', 'method', 'def'] },
  { id: 23, question: 'Which layout is mobile-friendly?', options: ['Table layout', 'Fixed layout', 'Responsive layout', 'None'] },
  { id: 24, question: 'React is used for:', options: ['Backend', 'Frontend UI', 'Networking', 'Databases'] },
  { id: 25, question: 'JSX stands for:', options: ['Java Syntax XML', 'JavaScript XML', 'JavaScript eXtension', 'Java Standard XML'] },
  { id: 26, question: 'Which hook is used for state in React?', options: ['useFetch', 'useState', 'useCall', 'useDOM'] },
  { id: 27, question: 'Which command creates a React app?', options: ['create-react-project', 'npm install react', 'npx create-react-app', 'react-init'] },
  { id: 28, question: 'Which tag is self-closing?', options: ['<div>', '<span>', '<br>', '<p>'] },
  { id: 29, question: 'A promise in JS represents:', options: ['Styling', 'Event', 'Future value', 'Error'] },
  { id: 30, question: 'Which operator compares without type conversion?', options: ['==', '=', '===', ':='] },
  { id: 31, question: 'Which command runs a Node file?', options: ['run app.js', 'node app.js', 'execute app.js', 'npm app.js'] },
  { id: 32, question: 'Express route method:', options: ['app.make()', 'app.route()', 'app.get()', 'app.start()'] },
  { id: 33, question: 'Which file stores Node dependencies?', options: ['node.json', 'package.json', 'project.config', 'dependencies.json'] },
  { id: 34, question: 'Which HTTP status means OK?', options: ['404', '200', '500', '403'] },
  { id: 35, question: 'HTML comments use:', options: ['//', '#', '<!-- -->', '**'] },
  { id: 36, question: 'Box model does NOT include:', options: ['Margin', 'Border', 'Variable', 'Padding'] },
  { id: 37, question: 'Which creates a list?', options: ['<lst>', '<ul>', '<div>', '<grid>'] },
  { id: 38, question: 'Which CSS property sets background color?', options: ['bg', 'color', 'background-color', 'border-color'] },
  { id: 39, question: 'Which function parses JSON?', options: ['JSON.parse()', 'JSON.decode()', 'JSON.convert()', 'JSON.read()'] },
  { id: 40, question: 'React components must return:', options: ['String', 'Number', 'JSX', 'CSS'] },
  { id: 41, question: 'Which is a JS array?', options: ['{1,2,3}', '(1,2,3)', '[1,2,3]', '<1,2,3>'] },
  { id: 42, question: 'Which tag defines a form?', options: ['<input>', '<form>', '<data>', '<enter>'] },
  { id: 43, question: 'Which command installs a package?', options: ['npm get', 'npm add', 'npm install', 'node install'] },
  { id: 44, question: 'Which stores key-value pairs?', options: ['Array', 'Object', 'Loop', 'String'] },
  { id: 45, question: 'Which defines a CSS class?', options: ['#', '.', '@', '%'] },
  { id: 46, question: 'MongoDB stores data as:', options: ['Tables', 'Documents', 'Rows', 'Files'] },
  { id: 47, question: 'Which is a valid API format?', options: ['CSV', 'XML', 'EXE', 'PPT'] },
  { id: 48, question: 'Which method sends data?', options: ['GET', 'POST', 'VIEW', 'OPEN'] },
  { id: 49, question: 'Which keyword stops a loop?', options: ['stop', 'end', 'break', 'halt'] },
  { id: 50, question: 'npm stands for:', options: ['Node Package Manager', 'New Program Maker', 'Node Project Model', 'None'] },
  { id: 51, question: 'Which is a relational DB?', options: ['MongoDB', 'MySQL', 'Firebase', 'Redis'] },
  { id: 52, question: 'Which tag creates a table row?', options: ['<tr>', '<td>', '<row>', '<trow>'] },
  { id: 53, question: 'Which is a frontend framework?', options: ['Laravel', 'Django', 'React', 'Flask'] },
  { id: 54, question: 'CSS padding adds space:', options: ['Outside element', 'Inside element', 'To the border', 'To the margin'] },
  { id: 55, question: 'Which is NOT a JS datatype?', options: ['Boolean', 'Integer', 'String', 'Object'] },
  { id: 56, question: 'Which command starts React dev server?', options: ['npm serve', 'npm test', 'npm run dev', 'npm start'] },
  { id: 57, question: 'Which loop runs at least once?', options: ['for', 'while', 'do…while', 'foreach'] },
  { id: 58, question: 'Which tag inserts a line?', options: ['<line>', '<break>', '<hr>', '<bar>'] },
  { id: 59, question: 'Which method updates state in React?', options: ['setState', 'updateState', 'setHook', 'changeState'] },
  { id: 60, question: 'Which tool manages Node packages?', options: ['Git', 'Docker', 'npm', 'Yarn'] },
];

const bank4_answers: Record<number, string> = {
  1: 'HTML',
  2: '<h1>',
  3: 'Styling web pages',
  4: 'color',
  5: 'Browser',
  6: 'All of the above',
  7: '//',
  8: 'Document Object Model',
  9: 'getElementById()',
  10: 'GET',
  11: 'JavaScript Object Notation',
  12: '.',
  13: '<a>',
  14: 'Responsive layouts',
  15: 'npm init',
  16: 'JavaScript',
  17: 'Creating APIs',
  18: 'MongoDB',
  19: 'Database queries',
  20: 'src',
  21: 'Cascading Style Sheets',
  22: 'function',
  23: 'Responsive layout',
  24: 'Frontend UI',
  25: 'JavaScript XML',
  26: 'useState',
  27: 'npx create-react-app',
  28: '<br>',
  29: 'Future value',
  30: '===',
  31: 'node app.js',
  32: 'app.get()',
  33: 'package.json',
  34: '200',
  35: '<!-- -->',
  36: 'Variable',
  37: '<ul>',
  38: 'background-color',
  39: 'JSON.parse()',
  40: 'JSX',
  41: '[1,2,3]',
  42: '<form>',
  43: 'npm install',
  44: 'Object',
  45: '.',
  46: 'Documents',
  47: 'XML',
  48: 'POST',
  49: 'break',
  50: 'Node Package Manager',
  51: 'MySQL',
  52: '<tr>',
  53: 'React',
  54: 'Inside element',
  55: 'Integer',
  56: 'npm start',
  57: 'do…while',
  58: '<hr>',
  59: 'setState',
  60: 'npm',
};

/* ---------- Bank 5 ---------- */
const bank5_questions: QuizQuestion[] = [
  { id: 1, question: 'CI stands for:', options: ['Cloud Integration', 'Continuous Integration', 'Code Injection', 'Container Init'] },
  { id: 2, question: 'CD in DevOps means:', options: ['Continuous Delivery/Deployment', 'Code Distribution', 'Cloud Development', 'Container Deployment'] },
  { id: 3, question: 'Docker is used for:', options: ['Testing', 'Virtualization', 'Containerization', 'Encryption'] },
  { id: 4, question: 'Kubernetes is mainly for:', options: ['Managing containers', 'Designing UI', 'Writing APIs', 'Monitoring logs'] },
  { id: 5, question: 'AWS EC2 is a:', options: ['Storage service', 'Compute service', 'Database', 'Messaging service'] },
  { id: 6, question: 'Which service stores objects?', options: ['EC2', 'S3', 'Lambda', 'RDS'] },
  { id: 7, question: 'Infrastructure as Code tool:', options: ['Git', 'Terraform', 'Figma', 'Node.js'] },
  { id: 8, question: 'CI/CD pipelines automate:', options: ['HTML', 'Deployment', 'Photo editing', 'Marketing'] },
  { id: 9, question: 'Dockerfile is used to:', options: ['Run a VM', 'Build an image', 'Create a UI', 'Connect to DB'] },
  { id: 10, question: 'Git command to clone repo:', options: ['git copy', 'git clone', 'git pull', 'git fetch'] },
  { id: 11, question: 'Which tool monitors logs?', options: ['Prometheus', 'VS Code', 'Docker', 'React'] },
  { id: 12, question: 'AWS Lambda is:', options: ['Serverless compute', 'AI service', 'Email service', 'Storage'] },
  { id: 13, question: 'CI/CD helps in:', options: ['Slowing releases', 'Automating deployments', 'Increasing manual work', 'Removing tests'] },
  { id: 14, question: 'YAML is commonly used in:', options: ['HTML', 'Docker', 'Kubernetes configs', 'Python UI'] },
  { id: 15, question: 'Which tool is used for version control?', options: ['Postman', 'Git', 'Firebase', 'Docker'] },
  { id: 16, question: 'RDS provides:', options: ['Managed databases', 'DNS', 'Containers', 'Compute instances'] },
  { id: 17, question: 'A Docker container is:', options: ['Process', 'Virtual machine', 'Lightweight environment', 'Kernel'] },
  { id: 18, question: 'Jenkins is a:', options: ['Monitoring tool', 'CI/CD tool', 'Container engine', 'API tester'] },
  { id: 19, question: 'Kubernetes pod contains:', options: ['Git repos', 'Containers', 'HTML files', 'DB tables'] },
  { id: 20, question: 'GitHub Actions is for:', options: ['Testing apps', 'Creating pipelines', 'Designing UI', 'Storing images'] },
  { id: 21, question: 'AWS VPC is for:', options: ['Logging', 'Virtual networking', 'File storage', 'Databases'] },
  { id: 22, question: 'CI/CD reduces:', options: ['Errors', 'Automation', 'Speed', 'Collaboration'] },
  { id: 23, question: 'NodePort is used in Kubernetes to:', options: ['Expose a service', 'Delete pods', 'Create clusters', 'Scale deployment'] },
  { id: 24, question: 'Docker Compose manages:', options: ['Multi-container apps', 'Images', 'Logs', 'CI pipelines'] },
  { id: 25, question: 'Which AWS service is serverless compute?', options: ['Lambda', 'S3', 'EC2', 'SNS'] },
  { id: 26, question: 'Helm is used for:', options: ['API testing', 'Kubernetes package management', 'Monitoring', 'Git commits'] },
  { id: 27, question: 'Kubernetes master node runs:', options: ['User apps', 'Control plane', 'Frontend', 'Database'] },
  { id: 28, question: 'Auto Scaling helps with:', options: ['UI design', 'Adjusting compute capacity', 'Building images', 'Encryption'] },
  { id: 29, question: 'Which AWS service is NoSQL DB?', options: ['RDS', 'DynamoDB', 'Aurora', 'Redshift'] },
  { id: 30, question: 'DevOps focuses on:', options: ['UI Design', 'Collaboration and automation', 'Video editing', 'Manual workflows'] },
  { id: 31, question: 'Git command to view changes:', options: ['git track', 'git status', 'git show', 'git commit'] },
  { id: 32, question: 'A CI pipeline usually starts with:', options: ['Testing', 'Deployment', 'Code push', 'Monitoring'] },
  { id: 33, question: 'Which is a container registry?', options: ['GitHub', 'Docker Hub', 'VS Code', 'Gmail'] },
  { id: 34, question: 'Kubernetes Deployment ensures:', options: ['Zero replicas', 'Desired pod count', 'No scaling', 'Manual updates'] },
  { id: 35, question: 'Terraform files end with:', options: ['.json', '.yaml', '.tf', '.cfg'] },
  { id: 36, question: 'Route53 provides:', options: ['DNS', 'Storage', 'Compute', 'Logs'] },
  { id: 37, question: 'Kubernetes Service maintains:', options: ['Pod design', 'Networking', 'UI mapping', 'Logging'] },
  { id: 38, question: 'S3 buckets store:', options: ['Videos only', 'Any objects', 'Code only', 'Logs only'] },
  { id: 39, question: 'DevOps cycle is:', options: ['Plan → Build → Test → Deploy → Monitor', 'Code → Delete → Retry', 'Create → Break → Fix', 'None'] },
  { id: 40, question: 'IAM controls:', options: ['Identity & access', 'App UI', 'Docker images', 'Pod logs'] },
  { id: 41, question: 'A Docker image is:', options: ['Running app', 'Blueprint for containers', 'Database', 'Deployment'] },
  { id: 42, question: 'Git branching helps:', options: ['Backup', 'Collaboration', 'Isolation of features', 'All'] },
  { id: 43, question: 'Which is NOT a CI/CD tool?', options: ['GitLab CI', 'Jenkins', 'CircleCI', 'MS Paint'] },
  { id: 44, question: 'Kubernetes cluster consists of:', options: ['One VM', 'Master + Worker nodes', 'HTML + CSS', 'Code + DB'] },
  { id: 45, question: 'Docker volume stores:', options: ['Temporary logs', 'Persistent data', 'Images', 'Ports'] },
  { id: 46, question: 'Your app needs to scale automatically based on traffic. Which service?', options: ['Route53', 'Auto Scaling', 'IAM', 'S3'] },
  { id: 47, question: 'You want to deploy code automatically when pushed to GitHub. Use:', options: ['Jenkins', 'Figma', 'Docker', 'MySQL'] },
  { id: 48, question: 'App files must be stored cheaply and accessed anywhere. Choose:', options: ['EC2', 'Lambda', 'S3', 'RDS'] },
  { id: 49, question: 'A container keeps restarting in Kubernetes. What do you check first?', options: ['DNS', 'Logs', 'Region', 'IAM'] },
  { id: 50, question: 'Two containers need to talk internally. You use:', options: ['Kubernetes Service', 'S3', 'VPC', 'IAM'] },
  { id: 51, question: 'You want to avoid manual server management. Choose:', options: ['EC2', 'Lambda', 'Docker', 'RDS'] },
  { id: 52, question: 'A developer overwrote main branch code. You should:', options: ['Delete repo', 'Use git revert', 'Format system', 'Restart VS Code'] },
  { id: 53, question: 'You need environment-specific deployments. Use:', options: ['Kubernetes namespaces', 'HTML forms', 'Docker Hub', 'Route53'] },
  { id: 54, question: 'To store logs centrally, use:', options: ['CloudWatch', 'S3', 'Dockerfile', 'EC2'] },
  { id: 55, question: 'App goes down when pods reach high load. Fix?', options: ['Increase logs', 'Add HPA (Horizontal Pod Autoscaler)', 'Change CSS', 'Delete node'] },
  { id: 56, question: 'Your DB password should NOT be inside code. Use:', options: ['Hardcoding', 'ConfigMap', 'Secrets', 'README'] },
  { id: 57, question: 'You need predictable, repeatable infrastructure setup.', options: ['Terraform', 'Paint', 'VS Code', 'Slack'] },
  { id: 58, question: 'Deployment failed in CI/CD. First step?', options: ['Restart internet', 'Check pipeline logs', 'Rebuild PC', 'Delete code'] },
  { id: 59, question: 'You need low-latency global CDN. Choose:', options: ['EC2', 'CloudFront', 'RDS', 'DynamoDB'] },
  { id: 60, question: 'Your pod needs persistent storage. Pick:', options: ['ConfigMap', 'Secret', 'PersistentVolume', 'LoadBalancer'] },
];

const bank5_answers: Record<number, string> = {
  1: 'Continuous Integration',
  2: 'Continuous Delivery/Deployment',
  3: 'Containerization',
  4: 'Managing containers',
  5: 'Compute service',
  6: 'S3',
  7: 'Terraform',
  8: 'Deployment',
  9: 'Build an image',
  10: 'git clone',
  11: 'Prometheus',
  12: 'Serverless compute',
  13: 'Automating deployments',
  14: 'Kubernetes configs',
  15: 'Git',
  16: 'Managed databases',
  17: 'Lightweight environment',
  18: 'CI/CD tool',
  19: 'Containers',
  20: 'Creating pipelines',
  21: 'Virtual networking',
  22: 'Errors',
  23: 'Expose a service',
  24: 'Multi-container apps',
  25: 'Lambda',
  26: 'Kubernetes package management',
  27: 'Control plane',
  28: 'Adjusting compute capacity',
  29: 'DynamoDB',
  30: 'Collaboration and automation',
  31: 'git status',
  32: 'Code push',
  33: 'Docker Hub',
  34: 'Desired pod count',
  35: '.tf',
  36: 'DNS',
  37: 'Networking',
  38: 'Any objects',
  39: 'Plan → Build → Test → Deploy → Monitor',
  40: 'Identity & access',
  41: 'Blueprint for containers',
  42: 'All',
  43: 'MS Paint',
  44: 'Master + Worker nodes',
  45: 'Persistent data',
  46: 'Auto Scaling',
  47: 'Jenkins',
  48: 'S3',
  49: 'Logs',
  50: 'Kubernetes Service',
  51: 'Lambda',
  52: 'Use git revert',
  53: 'Kubernetes namespaces',
  54: 'CloudWatch',
  55: 'Add HPA (Horizontal Pod Autoscaler)',
  56: 'Secrets',
  57: 'Terraform',
  58: 'Check pipeline logs',
  59: 'CloudFront',
  60: 'PersistentVolume',
};

/* ---------- Bank 6 ---------- */
const bank6_questions: QuizQuestion[] = [
  { id: 1, question: 'Data used for analysis is called:', options: ['Sample', 'Dataset', 'Function', 'Module'] },
  { id: 2, question: 'Which language is most common in data analysis?', options: ['C', 'Python', 'PHP', 'Ruby'] },
  { id: 3, question: 'Pandas is used for:', options: ['Graphics', 'Data manipulation', 'Web design', 'Machine learning'] },
  { id: 4, question: 'Which function reads a CSV in pandas?', options: ['readFile()', 'read_csv()', 'open_csv()', 'load()'] },
  { id: 5, question: 'Which library is used for visualization?', options: ['TensorFlow', 'Matplotlib', 'Pandas', 'NumPy'] },
  { id: 6, question: 'NumPy mainly deals with:', options: ['Images', 'Arrays', 'Audio', 'HTML'] },
  { id: 7, question: 'AI stands for:', options: ['Advanced Information', 'Artificial Intelligence', 'Automated Instruction', 'Algorithm Integration'] },
  { id: 8, question: 'Which type of learning uses labeled data?', options: ['Reinforcement', 'Supervised', 'Unsupervised', 'Transfer'] },
  { id: 9, question: 'K-Means is a ______ algorithm.', options: ['Regression', 'Clustering', 'Classification', 'Search'] },
  { id: 10, question: 'CSV stands for:', options: ['Comma Separated Values', 'Complete System Values', 'Computer Stored Variables', 'Column Separated View'] },
  { id: 11, question: 'Mean is also called:', options: ['Middle value', 'Common value', 'Average', 'Highest value'] },
  { id: 12, question: 'Which is a Python plotting library?', options: ['Flask', 'Matplotlib', 'Django', 'Express'] },
  { id: 13, question: 'SQL is used to:', options: ['Train models', 'Query databases', 'Create images', 'Build APIs'] },
  { id: 14, question: 'Which SQL command fetches data?', options: ['INSERT', 'SELECT', 'UPDATE', 'DELETE'] },
  { id: 15, question: 'Which is a supervised algorithm?', options: ['K-Means', 'Linear Regression', 'PCA', 'Apriori'] },
  { id: 16, question: 'A row in a dataset is a:', options: ['Column', 'Record', 'Feature', 'Label'] },
  { id: 17, question: 'A column in a dataset is a:', options: ['Feature', 'Sample', 'Group', 'Model'] },
  { id: 18, question: 'Which metric measures model accuracy?', options: ['Loss', 'Accuracy score', 'Gradient', 'Step size'] },
  { id: 19, question: 'Outliers are:', options: ['Missing values', 'Extreme values', 'Normal values', 'Random text'] },
  { id: 20, question: 'Which library is used for ML?', options: ['Scikit-learn', 'Bootstrap', 'React', 'Tailwind'] },
  { id: 21, question: 'Missing values in pandas are shown as:', options: ['missing', 'null', 'NaN', '0'] },
  { id: 22, question: 'Which command shows top rows of DataFrame?', options: ['head()', 'top()', 'first()', 'take()'] },
  { id: 23, question: 'Logistic Regression predicts:', options: ['Images', 'Classes', 'Documents', 'Colors'] },
  { id: 24, question: 'Which of these is a data type?', options: ['Model', 'Feature', 'Integer', 'Train'] },
  { id: 25, question: 'AI systems learn from:', options: ['Fonts', 'Data', 'Pages', 'Colors'] },
  { id: 26, question: 'Which term means “cleaning data”?', options: ['Data modeling', 'Data mining', 'Data preprocessing', 'Data joining'] },
  { id: 27, question: 'Pie chart is used for:', options: ['Classification', 'Proportion', 'Sorting', 'Regression'] },
  { id: 28, question: 'Correlation measures:', options: ['Accuracy', 'Relationship', 'Length', 'Noise'] },
  { id: 29, question: 'Which method removes duplicates?', options: ['remove_dups()', 'drop_duplicates()', 'del_repeat()', 'clear_copy()'] },
  { id: 30, question: 'A bar chart compares:', options: ['Labels', 'Colors', 'Categories', 'Accuracy'] },
  { id: 31, question: 'ML model training uses:', options: ['Training data', 'HTML', 'CSS', 'JavaScript'] },
  { id: 32, question: 'PCA is used for:', options: ['Clustering', 'Dimensionality reduction', 'Regression', 'Data cleaning'] },
  { id: 33, question: 'A scatter plot shows:', options: ['Lines', 'Points', 'Text', 'Images'] },
  { id: 34, question: 'In SQL, WHERE is used for:', options: ['Sorting', 'Filtering', 'Grouping', 'Joining'] },
  { id: 35, question: 'A label is the:', options: ['Input', 'Output', 'Column name', 'Missing value'] },
  { id: 36, question: 'Confusion matrix is used for:', options: ['Regression', 'Classification', 'Clustering', 'Sampling'] },
  { id: 37, question: 'Python indentation uses:', options: ['{}', '()', 'Tabs/spaces', '<>'] },
  { id: 38, question: 'Feature scaling uses:', options: ['Sorting', 'Normalization', 'Grouping', 'Filtering'] },
  { id: 39, question: 'SQL JOIN combines:', options: ['Two functions', 'Two datasets', 'Two tables', 'Two models'] },
  { id: 40, question: 'Which is a Python IDE?', options: ['VS Code', 'Word', 'Excel', 'Camera'] },
  { id: 41, question: 'Regression predicts:', options: ['Categories', 'Numbers', 'Images', 'Colors'] },
  { id: 42, question: 'Which method shows DataFrame info?', options: ['info()', 'show()', 'details()', 'summary()'] },
  { id: 43, question: 'Histogram shows:', options: ['Sequence', 'Distribution', 'Labels', 'Colors'] },
  { id: 44, question: 'AI model decisions depend on:', options: ['UI', 'Data', 'Page color', 'Browser'] },
  { id: 45, question: 'SQL ORDER BY is used for:', options: ['Filtering', 'Sorting', 'Joining', 'Removing'] },
  { id: 46, question: 'KNN uses:', options: ['Distance', 'Color', 'Noise', 'Images'] },
  { id: 47, question: 'Which represents training + testing split?', options: ['100–0', '10–10', '80–20', '5–5'] },
  { id: 48, question: 'AI chatbots use:', options: ['HTML', 'NLP', 'CSS', 'RGB'] },
  { id: 49, question: 'Pandas DataFrame is like a:', options: ['Table', 'Image', 'Sound', 'Video'] },
  { id: 50, question: 'ML models improve using:', options: ['Code styling', 'More data', 'HTML', 'Images'] },
  { id: 51, question: 'Which is a clustering algorithm?', options: ['SVM', 'K-Means', 'Linear Regression', 'KNN'] },
  { id: 52, question: 'Mode represents:', options: ['Largest value', 'Most frequent value', 'Average value', 'Middle value'] },
  { id: 53, question: 'Machine can learn patterns using:', options: ['Data', 'Light', 'Fonts', 'Network cables'] },
  { id: 54, question: 'SQL GROUP BY is used for:', options: ['Aggregation', 'Coding', 'Styling', 'Filtering UI'] },
  { id: 55, question: 'AI models use:', options: ['Features', 'Stickers', 'Fonts', 'Colors'] },
  { id: 56, question: 'Python files end with:', options: ['.txt', '.py', '.pt', '.js'] },
  { id: 57, question: 'Which command shows top rows of DataFrame?', options: ['head()', 'first()', 'take()', 'top()'] },
  { id: 58, question: 'Which method removes duplicates?', options: ['drop_duplicates()', 'remove_dups()', 'del_repeat()', 'clear_copy()'] },
  { id: 59, question: 'Which library is used for ML?', options: ['Scikit-learn', 'Bootstrap', 'React', 'Tailwind'] },
  { id: 60, question: 'Which function parses JSON?', options: ['JSON.parse()', 'JSON.read()', 'JSON.decode()', 'JSON.convert()'] },
];

const bank6_answers: Record<number, string> = {
  1: 'Dataset',
  2: 'Python',
  3: 'Data manipulation',
  4: 'read_csv()',
  5: 'Matplotlib',
  6: 'Arrays',
  7: 'Artificial Intelligence',
  8: 'Supervised',
  9: 'Clustering',
  10: 'Comma Separated Values',
  11: 'Average',
  12: 'Matplotlib',
  13: 'Query databases',
  14: 'SELECT',
  15: 'Linear Regression',
  16: 'Record',
  17: 'Feature',
  18: 'Accuracy score',
  19: 'Extreme values',
  20: 'Scikit-learn',
  21: 'NaN',
  22: 'head()',
  23: 'Classes',
  24: 'Integer',
  25: 'Data',
  26: 'Data preprocessing',
  27: 'Proportion',
  28: 'Relationship',
  29: 'drop_duplicates()',
  30: 'Categories',
  31: 'Training data',
  32: 'Dimensionality reduction',
  33: 'Points',
  34: 'Filtering',
  35: 'Output',
  36: 'Classification',
  37: 'Tabs/spaces',
  38: 'Normalization',
  39: 'Two tables',
  40: 'VS Code',
  41: 'Numbers',
  42: 'info()',
  43: 'Distribution',
  44: 'Data',
  45: 'Sorting',
  46: 'Distance',
  47: '80–20',
  48: 'NLP',
  49: 'Table',
  50: 'More data',
  51: 'K-Means',
  52: 'Most frequent value',
  53: 'Data',
  54: 'Aggregation',
  55: 'Features',
  56: '.py',
  57: 'head()',
  58: 'drop_duplicates()',
  59: 'Scikit-learn',
  60: 'JSON.parse()',
};

/* ------------------ courseId -> bank mapping ------------------ */
const courseBankMap: Record<number, { questions: QuizQuestion[]; answers: Record<number, string> }> = {
  1: { questions: bank1_questions, answers: bank1_answers },
  2: { questions: bank6_questions, answers: bank6_answers }, // note: mapping follows your list (you said ids 1..6 correspond to those titles)
  3: { questions: bank3_questions, answers: bank3_answers },
  4: { questions: bank5_questions, answers: bank5_answers }, // cloud/devops bank (you can reorder if needed)
  5: { questions: bank2_questions, answers: bank2_answers },
  6: { questions: bank4_questions, answers: bank4_answers },
};

/* ------------------ course title -> id mapping ------------------ */
const courseTitleToId: Record<string, number> = {
  'orivon certified generative ai & llm engineer': 1,
  'orivon certified ai & data analyst – foundation': 2,
  'orivon certified ai automation & no-code engineer': 3,
  'orivon certified cloud & devops architect': 4,
  'orivon certified cybersecurity & ethical hacking specialist': 5,
  'orivon certified full stack developer – foundation': 6,
};

/* ------------------ UI + Timer ------------------ */
const SECONDS_TOTAL = 90 * 60; // 90 minutes -> 5400 seconds

const formatTime = (seconds: number) => {
  if (seconds < 0) seconds = 0;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const normalize = (s?: string) => (s ?? '').toString().trim().toLowerCase();

const Quiz: React.FC<QuizProps> = ({ courseId, courseTitle, onSubmit }) => {
  // pick bank by title first (if provided), otherwise by id; fallback to bank1
  const { questions, answers: correctAnswers } = useMemo(() => {
    let id: number | undefined = undefined;
    if (courseTitle) {
      const key = courseTitle.toString().trim().toLowerCase();
      id = courseTitleToId[key];
    }
    if (!id && typeof courseId === 'number') id = courseId;
    return courseBankMap[id ?? 1] ?? courseBankMap[1];
  }, [courseId, courseTitle]);

  const total = questions.length;

  // states
  const [answersState, setAnswersState] = useState<Record<number, string>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // timer
  const [remaining, setRemaining] = useState<number>(SECONDS_TOTAL);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // submitted flag
  const submittedRef = useRef<boolean>(false);

  // reset quiz when courseId changes
  useEffect(() => {
    setAnswersState({});
    setSaved({});
    setCurrentIndex(0);
    setRemaining(SECONDS_TOTAL);
    submittedRef.current = false;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // start timer
    intervalRef.current = setInterval(() => {
      setRemaining((r) => r - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // auto-submit when time reaches 0
  useEffect(() => {
    if (remaining <= 0 && !submittedRef.current) {
      submittedRef.current = true;
      // ensure interval cleared
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      handleAutoSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  const handleOptionChange = (questionId: number, option: string) => {
    setAnswersState((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSave = (questionId: number) => {
    const ans = answersState[questionId];
    if (!ans) return;
    setSaved((prev) => ({ ...prev, [questionId]: true }));
  };

  const goTo = (index: number) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  // check if every question has a non-empty answer
  const isAllAnswered = questions.every((q) => {
    const a = answersState[q.id];
    return typeof a === 'string' && a.trim().length > 0;
  });

  const computeScore = () => {
    let score = 0;
    for (const q of questions) {
      const user = answersState[q.id];
      if (!user) continue;
      const correct = correctAnswers[q.id];
      if (!correct) continue;
      if (normalize(user) === normalize(correct)) score++;
    }
    return score;
  };

  const submitExam = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const score = computeScore();
    onSubmit(score, total);
  };

  const handleAutoSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    try {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (_) {}
    const score = computeScore();
    onSubmit(score, total);
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = questions.reduce((acc, q) => (answersState[q.id] ? acc + 1 : acc), 0);
  const savedCount = Object.keys(saved).filter((k) => saved[Number(k)]).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Exam — {`Course ${courseId}`}</h2>
          <div className="text-sm text-slate-600">Time remaining</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-3 py-2 bg-white border rounded-lg shadow-sm">
            <div className="text-xs text-gray-500">Timer</div>
            <div className="text-xl font-mono font-semibold text-red-600">{formatTime(remaining)}</div>
          </div>

          <div className="px-3 py-2 bg-white border rounded-lg shadow-sm text-right">
            <div className="text-xs text-gray-500">Progress</div>
            <div className="text-sm font-semibold">{answeredCount}/{total} answered</div>
            <div className="text-xs text-gray-400">{savedCount} saved</div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: question + controls */}
        <div className="flex-1 bg-gradient-to-b from-white to-slate-50 rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Question {currentIndex + 1} <span className="text-sm font-medium text-slate-500">/ {total}</span></h3>
              <div className="text-xs text-slate-500 mt-1">Progress: {answeredCount}/{total} answered • {savedCount} saved</div>
            </div>

            <div className="flex items-center gap-3">
              {saved[currentQuestion.id] ? (
                <span className="text-sm font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">Saved</span>
              ) : (
                <span className="text-sm font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">
                  {answersState[currentQuestion.id] ? 'Answered' : 'Not answered'}
                </span>
              )}
            </div>
          </div>

          {/* progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all"
              style={{ width: `${(answeredCount / total) * 100}%` }}
            />
          </div>

          <p className="font-semibold text-lg text-slate-800 mb-4">{currentQuestion.question}</p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const inputId = `q-${currentQuestion.id}-opt-${option.replace(/\s+/g, '-').slice(0, 20)}`;
              const checked = answersState[currentQuestion.id] === option;
              return (
                <label
                  key={option}
                  htmlFor={inputId}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-shadow ${
                    checked ? 'bg-indigo-50 border-indigo-300 shadow-sm' : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <input
                    id={inputId}
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={checked}
                    onChange={() => handleOptionChange(currentQuestion.id, option)}
                    className="form-radio h-5 w-5"
                  />
                  <span className="ml-3 text-slate-700">{option}</span>
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 mt-6">
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-white border border-gray-200 rounded hover:shadow-sm disabled:opacity-50"
              >
                Previous
              </button>

              <button
                onClick={() => handleSave(currentQuestion.id)}
                disabled={!answersState[currentQuestion.id]}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Save
              </button>

              <button
                onClick={() => { handleSave(currentQuestion.id); handleNext(); }}
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
              >
                Save & Next
              </button>
            </div>

            <div className="flex gap-2">
              {currentIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900">
                  Next
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (answersState[currentQuestion.id]) setSaved((s) => ({ ...s, [currentQuestion.id]: true }));
                    submitExam();
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded shadow-md"
                >
                  Finish & Submit
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: question list + quick preview */}
        <div className="w-96 space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h4 className="font-semibold text-slate-700 mb-3">Questions</h4>
            <div className="grid grid-cols-6 gap-3">
              {questions.map((q, idx) => {
                const answered = !!answersState[q.id];
                const isSaved = !!saved[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`flex flex-col items-center justify-center py-2 px-2 rounded-md text-sm font-medium border transition transform ${
                      isCurrent ? 'bg-indigo-50 border-indigo-300 scale-105' :
                        isSaved ? 'bg-green-50 border-green-200' :
                          answered ? 'bg-yellow-50 border-yellow-200' :
                            'bg-white border-gray-100 hover:shadow-sm'
                    }`}
                    title={`Question ${idx + 1} — ${isSaved ? 'Saved' : answered ? 'Answered' : 'Not answered'}`}
                  >
                    <div className="text-xs text-slate-600">Q{idx + 1}</div>
                    <div className={`mt-1 text-[11px] px-2 py-0.5 rounded-full ${
                      isSaved ? 'bg-green-100 text-green-800' :
                        answered ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-500'
                    }`}>
                      {isSaved ? 'Saved' : answered ? 'Answered' : 'Empty'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <h4 className="font-semibold text-slate-700 mb-3">Quick Preview</h4>
            <div className="space-y-3 max-h-60 overflow-auto">
              {questions.map((q, idx) => {
                const ans = answersState[q.id];
                const isSaved = !!saved[q.id];
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={q.id}
                    onClick={() => goTo(idx)}
                    className={`p-2 rounded cursor-pointer border flex items-start gap-3 ${isCurrent ? 'bg-indigo-50 border-indigo-200' : 'border-gray-100'}`}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                      isSaved ? 'bg-green-100 text-green-800' : ans ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700">Q{idx + 1}</div>
                      <div className="text-xs text-slate-500">{ans ?? 'Not answered'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Submit area */}
      <div className="pt-6 border-t mt-4">
        <button
          onClick={submitExam}
          disabled={!isAllAnswered}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:scale-[1.01] disabled:opacity-50"
        >
          {isAllAnswered ? 'Submit Exam' : 'Answer all questions to submit'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
