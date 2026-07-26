import { buildResumeDocument } from "./supportedPackages.js";

const DEFAULT_RESUME_BODY = String.raw`%================ HEADER =================
\begin{center}
{\Large \textbf{Sreekanth S H}} \\[2pt]
\small
Frontend SDE | React \& Next.js | Full Stack Developer \\[4pt]

\faGithub\ \href{https://github.com/sree0405}{github.com/sree0405} \quad
\faLinkedin\ \href{https://linkedin.com/in/sreekanth04052005}{linkedin.com/in/sreekanth04052005} \quad
\faGlobe\ \href{https://sreefolio.vercel.app}{sreefolio.vercel.app} \\[4pt]

\faEnvelope\ \href{mailto:sreekanth04052005@gmail.com}{sreekanth04052005@gmail.com} \quad
\faMobile\ +91-9363965927
\end{center}

\vspace{4pt}
\hrule
\vspace{6pt}

%================ SUMMARY =================
\section{Summary}
Frontend-focused Full Stack Developer with professional experience building scalable web applications and SaaS platforms. Experienced in end-to-end project delivery, from requirement analysis and development to deployment and maintenance, with a focus on performance, user experience, and maintainable software architecture.

%================ SKILLS =================
\section{Skills}

\textbf{Frontend:} React, Next.js, React Native, Redux Toolkit, Tailwind CSS \\
\textbf{Backend:} Node.js, Express.js, PostgreSQL, Directus, REST APIs \\
\textbf{Languages:} JavaScript (ES6+), TypeScript, Java and SQL(Fundamental Level) \\
\textbf{Tools \& Deployment:} AWS EC2, Nginx, PM2, Docker, Git, Linux

%================ EXPERIENCE =================
\section{Experience}

\textbf{Junior Software Developer — EWall Solutions Pvt. Ltd.} \hfill Aug 2025 – Present
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Developed and maintained production software applications using React, Next.js, TypeScript, Node.js and Express.js
\item Built reusable UI components, custom hooks, and REST API integrations to accelerate feature development
\item Implemented authentication, role-based access control, and state management for multi-tenant SaaS platforms
\item Optimized application performance by reducing unnecessary re-renders using memoization, lazy loading, and code splitting, improving page load speed and responsiveness
\item Deployed and maintained production applications on AWS EC2 using Nginx, PM2, SSL, and Linux
\end{itemize}

\textbf{Software Developer Intern — EWall Solutions Pvt. Ltd.} \hfill May 2025 – Aug 2025
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Assisted in frontend development, API integration, and responsive UI implementation using React and TypeScript
\item Contributed to backend customization, bug fixes, and reusable component development
\end{itemize}

\textbf{Freelance Full Stack Developer (Part-time)} \hfill Nov 2024 – May 2025
\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Delivered 6+ client projects including dashboards, business websites, and SaaS applications using React, Next.js, Node.js, and PostgreSQL for real-world business use cases
\item Collaborated directly with clients to design, develop, deploy, and maintain full-stack products based on client requirements
\end{itemize}

%================ PROJECTS =================
\section{Projects}
\textit{Selected client and personal projects. Additional work samples: \href{https://sreefolio.vercel.app/projects}{sreefolio.vercel.app/projects}}

\textbf{SkelArmor Dashboard — Freelance SaaS Project} \hfill
\href{https://dashboard.skelarmor.com/}{Live} |
\href{https://skelarmor.com/software/}{Docs}

\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Collaborated directly with the client to analyze requirements and design tenant-based SaaS workflows
\item Developed dashboard modules using React, Next.js, and TypeScript with role-based access control for multiple user roles
\item Integrated APIs and managed asynchronous data handling for real-time dashboard operations
\end{itemize}

\textbf{SkelArmor Platform — Freelance Full Stack Project} \hfill
\href{https://www.skelarmor.com/}{Live}

\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Gathered business requirements and contributed to developing a SaaS platform tailored to client needs
\item Built responsive and SEO-friendly interfaces using Next.js with a focus on performance and maintainability
\item Contributed to backend APIs, deployment workflows, and production server configuration
\end{itemize}

\textbf{My3DUI — UI Component Library} \hfill
\href{https://my3dui.vercel.app/}{Live} |
\href{https://my3dui.vercel.app/docs}{Docs}

\begin{itemize}[leftmargin=*, itemsep=1pt]
\item Built reusable 3D UI components using React Three Fiber and TypeScript for interactive web applications
\item Designed composable component architecture and custom hooks for reusable animation behavior
\item Improved developer experience by abstracting complex 3D rendering logic into reusable UI primitives
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
