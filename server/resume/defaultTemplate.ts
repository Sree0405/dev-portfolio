import { buildResumeDocument } from "./supportedPackages.js";

const DEFAULT_RESUME_BODY = String.raw`%================ HEADER =================
\begin{center}
{\Large \textbf{Sreekanth S H}} \\[2pt]
\small
Frontend SDE | React \& Next.js | Full Stack Developer \\[4pt]

\faGithub\ \href{https://github.com/sree0405}{github.com/sree0405} \quad
\faLinkedin\ \href{https://linkedin.com/in/sreekanth04052005}{linkedin.com/in/sreekanth04052005} \quad
\faGlobe\ \href{https://www.sreekanth.pro}{www.sreekanth.pro} \\[4pt]

\faEnvelope\ \href{mailto:sreekanth04052005@gmail.com}{sreekanth04052005@gmail.com} \quad
\faMobile\ +91-9363965927
\end{center}

\vspace{4pt}
\hrule
\vspace{6pt}

%================ SUMMARY =================
\section{Summary}
Frontend-focused full-stack engineer. At EWall I own production platform modules end to end — React/Next.js UI, Node APIs, auth edges, and Linux releases. Outside work I ship named client sites and open-source systems with public demos and GitHub.

%================ SKILLS =================
\section{Skills}

\textbf{Frontend:} React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS \\
\textbf{Backend:} Node.js, Express.js, NestJS (building), PostgreSQL, Prisma, Directus, REST APIs \\
\textbf{Tools \& Deployment:} Git, Linux, Nginx, PM2, Vercel, Docker \\
\textit{Depth labels on portfolio skills page: Daily / Production / Building.}

%================ EXPERIENCE =================
\section{Experience}

\textbf{Junior Software Developer — EWall Solutions Pvt. Ltd.} \hfill Aug 2025 – Present
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Own platform modules end to end — Kitchen, Voting, Contract \& Location, Timezone, and Campaign paths wired to ScreenCloud/Print
\item Ship React/Next.js admin UI with Node/Express API contracts and shared Auth/RBAC edges for tenant-scoped data
\item Optimize dense admin views with memoization, lazy routes, and code splitting under real production data
\item Release to Linux via Nginx + PM2; mentor freshers through code review on production modules
\end{itemize}

\textbf{Software Developer Intern — EWall Solutions Pvt. Ltd.} \hfill May 2025 – Aug 2025
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Shipped React/TypeScript platform UI slices and REST integrations (including early Kitchen/location flows) under review
\item Delivered responsive admin layouts aligned with the platform design system; wrote HLD/LLD notes before coding shared modules
\end{itemize}

\textbf{Freelance Full Stack Developer (Part-time)} \hfill Nov 2024 – May 2025
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Delivered two named production sites — Sri Thanigai Garments (CMS-backed company site) and GB Fitness (Vercel deploy)
\item Owned discovery through deploy and post-launch fixes for both clients
\end{itemize}

%================ PROJECTS =================
\section{Projects}
\textit{Case studies: \href{https://www.sreekanth.pro/projects}{www.sreekanth.pro/projects}}

\textbf{Sree Dev Tool — Personal ops platform} \hfill
\href{https://www.sreekanth.pro/project/sree-dev-tool}{Docs} |
\href{https://github.com/Sree0405/dev-portfolio}{GitHub}
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Sole owner — React UI, Express APIs, Prisma/PostgreSQL, session auth, modular domains
\item Built into a portfolio monorepo designed to scale from day one — multi-tenant-capable modules without a second stack; demo isolates private ops data
\end{itemize}

\textbf{My3DUI — Open-source 3D UI library} \hfill
\href{https://my3dui.vercel.app/}{Live} |
\href{https://github.com/Sree0405/my3dui}{GitHub}
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item TypeScript-first React Three Fiber primitives with public playground and docs
\item Tree-shakable library entry separate from the docs/playground app
\end{itemize}

\textbf{Fieldstack — Open-source CMS/admin} \hfill
\href{https://fieldstack.onrender.com/}{Demo} |
\href{https://github.com/Sree0405/fieldstack}{GitHub}
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item NestJS + Prisma with JWT/RBAC and collection-driven REST; early-stage open source, honest demo scale
\end{itemize}

%================ EDUCATION =================
\section{Education}

\textbf{B.Sc. Computer Science} \hfill 2022 -- 2025

S.A. College of Arts \& Science`;

export const DEFAULT_RESUME_LATEX = buildResumeDocument(DEFAULT_RESUME_BODY);

const DEMO_RESUME_BODY = String.raw`%================ HEADER =================
\begin{center}
{\Large \textbf{Alex Developer}} \\[2pt]
\small
Full Stack Developer | React \& Next.js \\[4pt]

\faGithub\ \href{https://github.com/username}{github.com/username} \quad
\faLinkedin\ \href{https://linkedin.com/in/username}{linkedin.com/in/username} \quad
\faGlobe\ \href{https://example.com}{example.com} \\[4pt]

\faEnvelope\ \href{mailto:you@example.com}{you@example.com} \quad
\faMobile\ +00-0000000000
\end{center}

\vspace{4pt}
\hrule
\vspace{6pt}

\section{Summary}
Write a concise professional summary highlighting your experience and strengths.

\section{Skills}
\textbf{Frontend:} React, Next.js, TypeScript \\
\textbf{Backend:} Node.js, PostgreSQL, REST APIs

\section{Experience}
\textbf{Company Name — Job Title} \hfill 2024 -- Present
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Describe a key achievement or responsibility.
\item Highlight measurable impact where possible.
\end{itemize}

\section{Education}
\textbf{Degree} \hfill Year \\
University Name`;

export const DEMO_RESUME_LATEX = buildResumeDocument(DEMO_RESUME_BODY);
