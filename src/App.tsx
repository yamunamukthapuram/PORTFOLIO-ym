import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import CustomCursor from "./CustomCursor";
import "./App.css";

type Theme = "light" | "dark";

type Skill = {
  name: string;
  icon: ReactNode;
};

type SkillCategory = {
  title: string;
  skills: Skill[];
};

const DI = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

function BrandIcon({
  src,
  alt,
  invertDark = false,
}: {
  src: string;
  alt: string;
  invertDark?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={`skill-icon${invertDark ? " skill-icon--invert" : ""}`}
      width={28}
      height={28}
      loading="lazy"
    />
  );
}

function di(path: string, name: string, invertDark = false) {
  return <BrandIcon src={`${DI}/${path}`} alt={name} invertDark={invertDark} />;
}

function SvgIcon({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span className="skill-icon skill-icon-svg" style={{ color }} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        {children}
      </svg>
    </span>
  );
}

const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: [
      { name: "Java", icon: di("java/java-original.svg", "Java") },
      { name: "Python", icon: di("python/python-original.svg", "Python") },
      { name: "JavaScript", icon: di("javascript/javascript-original.svg", "JavaScript") },
      { name: "SQL", icon: di("mysql/mysql-original.svg", "SQL") },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React.js", icon: di("react/react-original.svg", "React.js") },
      { name: "HTML5", icon: di("html5/html5-original.svg", "HTML5") },
      { name: "CSS3", icon: di("css3/css3-original.svg", "CSS3") },
      { name: "Tailwind CSS", icon: di("tailwindcss/tailwindcss-original.svg", "Tailwind CSS") },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: di("nodejs/nodejs-original.svg", "Node.js") },
      { name: "Express.js", icon: di("express/express-original.svg", "Express.js", true) },
      {
        name: "REST APIs",
        icon: (
          <SvgIcon color="#2563EB">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v4h4v2h-4v4h-2v-4H7v-2h4V7h2z" />
          </SvgIcon>
        ),
      },
    ],
  },
  {
    title: "AI & Machine Learning",
    skills: [
      {
        name: "Artificial Intelligence",
        icon: (
          <SvgIcon color="#06B6D4">
            <path d="M12 2a4 4 0 00-4 4v1.05A5.5 5.5 0 006.5 12.5V15a3.5 3.5 0 003.5 3.5H11V21h2v-2.5h1a3.5 3.5 0 003.5-3.5v-2.5a5.5 5.5 0 00-1.5-5.45V6a4 4 0 00-4-4zm-2.25 9.25a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0zm4 0a1.25 1.25 0 112.5 0 1.25 1.25 0 01-2.5 0z" />
          </SvgIcon>
        ),
      },
      { name: "Machine Learning", icon: di("tensorflow/tensorflow-original.svg", "Machine Learning") },
    ],
  },
  {
    title: "Databases",
    skills: [{ name: "MongoDB", icon: di("mongodb/mongodb-original.svg", "MongoDB") }],
  },
  {
    title: "Tools",
    skills: [
      { name: "Git", icon: di("git/git-original.svg", "Git") },
      { name: "GitHub", icon: di("github/github-original.svg", "GitHub", true) },
      { name: "VS Code", icon: di("vscode/vscode-original.svg", "VS Code") },
      { name: "Vercel", icon: di("vercel/vercel-original.svg", "Vercel", true) },
      { name: "Netlify", icon: di("netlify/netlify-original.svg", "Netlify") },
    ],
  },
  {
    title: "Cloud",
    skills: [
      {
        name: "AWS",
        icon: di("amazonwebservices/amazonwebservices-plain-wordmark.svg", "AWS", true),
      },
      { name: "Oracle Cloud Infrastructure", icon: di("oracle/oracle-original.svg", "Oracle Cloud") },
    ],
  },
];

const featuredProjects = [
  {
    id: 1,
    name: "PizzaFiesta",
    tags: ["Reactjs", "Nodejs", "Expressjs", "MongoDB", "JWT", "RESTAPI", "Netlify"],
    image: "/projects/pizzafiesta.png",
    images: ["/projects/pizzafiesta.png"],
    description:
      "Online pizza ordering platform with secure auth and REST APIs. Built using Reactjs, Nodejs, Expressjs, MongoDB, JWT and deployed on Netlify.",
    source: "https://github.com/yamunamukthapuram/PizzaFiesta",
    live: "https://pizza-fiesta-app.netlify.app/",
    accent: "#F59E0B",
  },
  {
    id: 2,
    name: "OptiCrop",
    tags: ["Reactjs", "Python", "Flask", "Scikit-learn", "MachineLearning", "AI", "Render"],
    image: "/projects/opticrop.png",
    images: ["/projects/opticrop.png"],
    description:
      "AI-powered crop recommendation app that turns soil and environment data into farming decisions. Made using Reactjs, Python, Flask, Scikit-learn and Render.",
    source: "https://github.com/yamunamukthapuram/OptiCrop",
    live: "https://opticrop-avzh.onrender.com/",
    accent: "#2563EB",
  },
  {
    id: 3,
    name: "MBUGO",
    tags: ["Reactjs", "Nodejs", "Expressjs", "MongoDB", "JWT", "RESTAPI", "Vercel"],
    image: "/projects/mbugo.png",
    images: ["/projects/mbugo.png"],
    description:
      "Campus auto-ride booking dashboard for MBU & Tirupati. Built using Reactjs, Nodejs, Expressjs, MongoDB, JWT, REST APIs and Vercel.",
    source: "https://github.com/yamunamukthapuram/MBUGO",
    live: "https://mbugo.vercel.app/",
    accent: "#06B6D4",
  },
] as const;

const moreProjects = [
  {
    id: 4,
    name: "Frostella Delights",
    tags: ["Reactjs", "Nodejs", "Expressjs", "MongoDB", "TailwindCSS", "Netlify"],
    image: "/projects/frostella.png",
    images: ["/projects/frostella.png"],
    description:
      "Modern ice cream e-commerce platform with product browsing, cart management, and responsive UI. Built using Reactjs, Nodejs, Expressjs, MongoDB, TailwindCSS, and deployed on Netlify.",
    source: "https://github.com/yamunamukthapuram/Frostella",
    live: "https://frostella-delights.netlify.app/",
    accent: "#E68A40",
  },
  {
    id: 5,
    name: "Recipe Pantry",
    tags: ["Reactjs", "Nextjs", "TailwindCSS", "Gemini AI", "Material UI", "Vercel"],
    image: "/projects/recipe-pantry.png",
    images: ["/projects/recipe-pantry.png"],
    description:
      "Smart recipe recommendation platform that suggests recipes based on available pantry ingredients. Built using Reactjs, Nextjs, TailwindCSS, Gemini AI, Material UI, and deployed on Vercel.",
    source: "https://github.com/yamunamukthapuram/ReceipePantry",
    live: "https://receipepantry.vercel.app/",
    accent: "#C45C26",
  },
  {
    id: 6,
    name: "Wildfire Smoke Detection",
    tags: ["Python", "Flask", "TensorFlow", "Reactjs", "TailwindCSS", "Vercel"],
    image: "/projects/wildfire.png",
    images: ["/projects/wildfire.png"],
    description:
      "AI-powered wildfire smoke detection system that identifies smoke from images using deep learning and computer vision. Built using Python, Flask, TensorFlow, Reactjs, TailwindCSS, and deployed on Vercel.",
    source: "https://github.com/yamunamukthapuram/Wildfire-Smoke-Detection",
    live: "https://wildfire-smoke-detection.vercel.app/",
    accent: "#EF4444",
  },
] as const;

const allProjects = [...featuredProjects, ...moreProjects];

type Project = (typeof allProjects)[number];

const certifications = [
  {
    id: 1,
    title: "ServiceNow Virtual Internship Program",
    issuer: "ServiceNow University • AICTE • SmartBridge",
    date: "25 May, 2026",
    skills: ["ServiceNow", "Workflow Automation", "Flow Designer", "Agentic AI", "ATF"],
    image: "/certs/servicenow.png",
    credentialUrl: undefined as string | undefined,
  },
  {
    id: 2,
    title: "AWS Academy Graduate – Cloud Foundations",
    issuer: "AWS Academy",
    date: "03 Feb, 2026",
    skills: ["AWS Cloud", "Cloud Computing", "Cloud Foundations", "AWS Services"],
    image: "/certs/aws.png",
    credentialUrl: "https://www.credly.com/go/RpgmTyst",
  },
  {
    id: 3,
    title: "Oracle Cloud Infrastructure 2025 – Generative AI Professional",
    issuer: "Oracle University",
    date: "31 Oct, 2025",
    skills: ["Oracle Cloud Infrastructure", "Generative AI", "AI Services", "Cloud Computing"],
    image: "/certs/oracle.png",
    credentialUrl:
      "https://catalog-education.oracle.com/pls/certview/sharebadge?id=B054219EFD06A9846D5FCD31EBBC96E14D00D9F0BFCA7B4D7F7F94DED50B5659",
  },
  {
    id: 4,
    title: "CampusCrew – 100K Milestone Honor",
    issuer: "CampusCrew",
    date: "26 Jun, 2026",
    skills: ["Community Leadership", "Student Engagement", "Collaboration", "Recognition"],
    image: "/certs/campuscrew.png",
    credentialUrl: undefined as string | undefined,
  },
];

type Certification = (typeof certifications)[number];

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v11" strokeLinecap="round" />
      <path d="M8 12l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function CertModal({
  cert,
  onClose,
}: {
  cert: Certification;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const fileName = cert.image.split("/").pop() ?? "certificate.png";

  return createPortal(
    <div className="cert-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="cert-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cert-modal-header">
          <div className="cert-modal-heading">
            <h2 id="cert-modal-title">{cert.title}</h2>
            <div className="cert-modal-tags">
              {cert.skills.map((skill) => (
                <span key={skill} className="cert-modal-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <button type="button" className="cert-modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="cert-modal-preview">
          <img src={cert.image} alt={`${cert.title} certificate`} className="cert-modal-image" />
        </div>

        <div className="cert-modal-footer">
          <p className="cert-modal-meta">
            {cert.issuer} • {cert.date}
          </p>
          <a href={cert.image} download={fileName} className="cert-modal-download">
            <DownloadIcon />
            Download Certificate
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ProjectPreview({ src, name }: { src: string; name: string }) {
  return (
    <div className="preview-frame">
      <img src={src} alt={`${name} preview`} className="preview-image" loading="lazy" />
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L20 4" strokeLinecap="round" />
      <path d="M20 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1h5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      {dir === "left" ? (
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function ProjectGalleryCard({
  project,
}: {
  project: Project;
}) {
  const [slide, setSlide] = useState(0);
  const total = project.images.length;

  const prev = () => setSlide((s) => (s - 1 + total) % total);
  const next = () => setSlide((s) => (s + 1) % total);

  return (
    <article className="gallery-card">
      <div className="gallery-mockup">
        <img
          src={project.images[slide]}
          alt={`${project.name} screenshot`}
          className="gallery-image"
          loading="lazy"
        />
      </div>

      <div className="gallery-controls">
        <button type="button" className="gallery-nav" onClick={prev} aria-label="Previous image">
          <ChevronIcon dir="left" />
        </button>
        <div className="gallery-dots">
          {project.images.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`gallery-dot${slide === i ? " gallery-dot--active" : ""}`}
              onClick={() => setSlide(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
        <button type="button" className="gallery-nav" onClick={next} aria-label="Next image">
          <ChevronIcon dir="right" />
        </button>
      </div>

      <div className="gallery-body">
        <h3 className="gallery-title">
          <span className="gallery-title-icon" style={{ background: project.accent }} />
          {project.name}
        </h3>
        <p className="gallery-desc">{project.description}</p>
        <div className="gallery-actions">
          <a href={project.source} target="_blank" rel="noreferrer" className="gallery-link">
            <GithubIcon />
            Source code
          </a>
          <a href={project.live} target="_blank" rel="noreferrer" className="gallery-link">
            <ExternalLinkIcon />
            Live
          </a>
        </div>
      </div>
    </article>
  );
}

function ArrowCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoIcon({ theme }: { theme: Theme }) {
  const src = theme === "dark" ? "/logo-ym-dark.png?v=6" : "/logo-ym.png?v=4";
  return <img src={src} alt="YM" className="logo-img" width={104} height={104} />;
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 7 9-7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2.01-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

type ContactForm = {
  email: string;
  name: string;
  subject: string;
  message: string;
};

const CONTACT_EMAIL = "yammunamukthapuram@gmail.com";

const experiences = [
  {
    role: "AI & Machine Learning Intern",
    company: "APSCHE Skill Wallet",
    meta: "2026 | Remote",
    description:
      "Worked on machine learning projects using Python and Scikit-learn, focusing on data preprocessing, model training, and prediction.",
  },
  {
    role: "ServiceNow Virtual Intern",
    company: "ServiceNow University",
    meta: "2026 | Remote",
    description:
      "Learned ServiceNow Administration, Workflow Automation, Flow Designer, Reporting, and built enterprise workflow solutions using the ServiceNow platform.",
  },
] as const;

const education = [
  {
    role: "Bachelor of Technology",
    company: "Mohan Babu University",
    meta: "2023 – 2027 | Tirupati, Andhra Pradesh",
    description:
      "Pursuing B.Tech in Computer Science and Engineering with a CGPA of 9.2. Focused on Full Stack Development, Artificial Intelligence, Machine Learning, and Data Structures & Algorithms.",
  },
  {
    role: "Intermediate (MPC)",
    company: "Narayana Junior College",
    meta: "2021 – 2023 | Vijayawada, Andhra Pradesh",
    description: "Completed Intermediate (MPC) with 97%.",
  },
  {
    role: "Secondary School (SSC)",
    company: "PCMR English Medium High School",
    meta: "Passed Out: 2021 | Sri Sathya Sai, Andhra Pradesh",
    description: "Completed SSC with 100%.",
  },
] as const;

type TimelineItem = {
  role: string;
  company: string;
  meta: string;
  description: string;
};

function TimelineMilestone({
  progress,
  threshold,
}: {
  progress: MotionValue<number>;
  threshold: number;
}) {
  const start = Math.max(0, threshold - 0.08);
  const fill = useTransform(progress, [start, threshold], [0, 1], { clamp: true });
  const scale = useSpring(fill, {
    stiffness: 120,
    damping: 20,
    mass: 0.45,
    restDelta: 0.001,
  });
  const coreOpacity = useTransform(fill, [0, 0.55, 1], [1, 0.35, 0]);

  return (
    <span className="experience-marker" aria-hidden="true">
      <span className="experience-marker-ring" />
      <motion.span className="experience-marker-core" style={{ opacity: coreOpacity }} />
      <motion.span className="experience-marker-fill" style={{ scale }} />
    </span>
  );
}

function ScrollTimeline({ items }: { items: readonly TimelineItem[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.75", "end 0.4"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.35,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(progress, [0, 1], ["0%", "100%"]);

  const count = items.length;
  const thresholds = items.map((_, i) => (count <= 1 ? 0.35 : i / Math.max(count - 1, 1)));

  return (
    <div className="experience-timeline-wrap" ref={wrapRef}>
      <div className="experience-line" aria-hidden="true">
        <span className="experience-track" />
        <motion.span className="experience-progress" style={{ height: progressHeight }} />
      </div>

      <ol className="experience-timeline">
        {items.map((item, index) => (
          <li key={`${item.role}-${item.company}`} className="experience-item">
            <TimelineMilestone progress={progress} threshold={thresholds[index]} />
            <div className="experience-body">
              <h3 className="experience-role">
                {item.role}{" "}
                <span className="experience-at">@{item.company}</span>
              </h3>
              <p className="experience-meta">{item.meta}</p>
              <p className="experience-desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p className="footer-copy">©2026 Yamuna Mukthapuram</p>
      <div className="footer-socials">
        <a
          href="https://github.com/yamunamukthapuram/"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <GithubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/yamunamukthapuram/"
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
        >
          <LinkedInIcon />
        </a>
      </div>
    </footer>
  );
}

function ContactSection({
  onSendMessage,
  id,
  showFooter = true,
}: {
  onSendMessage: () => void;
  id?: string;
  showFooter?: boolean;
}) {
  return (
    <section id={id} className={`contact${showFooter ? "" : " contact--compact"}`}>
      <div className="contact-card">
        <span className="contact-badge">GET IN TOUCH</span>
        <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </a>
        <button type="button" className="contact-btn" onClick={onSendMessage}>
          <MailIcon />
          Send Message
        </button>
      </div>

      {showFooter && <SiteFooter />}
    </section>
  );
}

function ContactModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ContactForm>({
    email: "",
    name: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setForm({ email: "", name: "", subject: "", message: "" });
    }
  }, [open]);

  if (!open) return null;

  const update = (field: keyof ContactForm) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Name: form.name,
          Email: form.email,
          Subject: form.subject,
          Message: [
            "Hello Yamuna,",
            "",
            "You received a new message from your portfolio website.",
            "",
            "────────────────────────────",
            `Name     : ${form.name}`,
            `Email    : ${form.email}`,
            `Subject  : ${form.subject}`,
            "────────────────────────────",
            "",
            "Message:",
            form.message,
            "",
            "────────────────────────────",
            "Reply directly to this sender's email.",
            "Yamuna Mukthapuram · Portfolio",
          ].join("\n"),
          _subject: `✦ Portfolio Contact · ${form.name} · ${form.subject}`,
          _template: "box",
          _captcha: "false",
          _replyto: form.email,
        }),
      });

      const result = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
      const ok =
        response.ok &&
        (result == null || result.success === true || result.success === "true" || result.success === undefined);

      if (!ok) throw new Error("Failed to send");

      setStatus("success");
      setForm({ email: "", name: "", subject: "", message: "" });
      window.setTimeout(() => onClose(), 700);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <MailIcon />
            <h2 id="contact-modal-title">Send Message</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="modal-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={form.email}
              onChange={update("email")}
              disabled={status === "sending"}
            />
          </label>

          <label className="modal-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              value={form.name}
              onChange={update("name")}
              disabled={status === "sending"}
            />
          </label>

          <label className="modal-field">
            <span>Subject</span>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={update("subject")}
              disabled={status === "sending"}
            />
          </label>

          <label className="modal-field">
            <span>Message</span>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              required
              value={form.message}
              onChange={update("message")}
              disabled={status === "sending"}
            />
          </label>

          {status === "success" && (
            <p className="modal-status modal-status--success">Sent! Closing…</p>
          )}
          {status === "error" && (
            <p className="modal-status modal-status--error">
              Could not send. Please try again or email {CONTACT_EMAIL}.
            </p>
          )}

          <button type="submit" className="modal-submit" disabled={status === "sending" || status === "success"}>
            {status === "sending" ? "Sending..." : status === "success" ? "Sent" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? "light" : getInitialTheme(),
  );
  const [active, setActive] = useState("home");
  const [activeProject, setActiveProject] = useState(0);
  const [view, setView] = useState<"home" | "all-projects" | "about" | "certifications">("home");
  const [showFab, setShowFab] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (view === "all-projects" || view === "certifications") {
      setShowFab(false);
      return;
    }

    const updateFab = () => {
      const contactEl = document.getElementById("contact");
      const contactTop = contactEl?.getBoundingClientRect().top ?? Infinity;
      const nearContact = contactTop < window.innerHeight * 0.85;

      if (view === "home") {
        const projectsEl = document.getElementById("projects");
        const projectsBottom = projectsEl?.getBoundingClientRect().bottom ?? Infinity;
        const pastProjects = projectsBottom <= 80 || nearContact;
        setShowFab(!pastProjects);
        return;
      }

      // About: hide mail FAB when Get in Touch card enters view
      setShowFab(!nearContact);
    };

    const frame = window.requestAnimationFrame(updateFab);
    window.addEventListener("scroll", updateFab, { passive: true });
    window.addEventListener("resize", updateFab);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateFab);
      window.removeEventListener("resize", updateFab);
    };
  }, [view]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  const goHome = () => {
    setView("home");
    setActive("home");
  };

  const goAbout = () => {
    setView("about");
    setActive("about");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goProjects = () => {
    setView("all-projects");
    setActive("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goCertifications = () => {
    setView("certifications");
    setActive("certifications");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page">
      <CustomCursor />
      <header className="header">
        <a
          href="#home"
          className="logo"
          aria-label="Home"
          onClick={(e) => {
            e.preventDefault();
            goHome();
          }}
        >
          <LogoIcon theme={theme} />
        </a>

        <nav className="nav" aria-label="Primary">
          <a
            href="#home"
            className={`nav-link${view === "home" && active === "home" ? " nav-link--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              goHome();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Home
          </a>
          <a
            href="#about"
            className={`nav-link${view === "about" || (view === "home" && active === "about") ? " nav-link--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              goAbout();
            }}
          >
            About
          </a>
          <a
            href="#projects"
            className={`nav-link${view === "all-projects" ? " nav-link--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              goProjects();
            }}
          >
            Projects
          </a>
          <a
            href="#certifications"
            className={`nav-link${view === "certifications" ? " nav-link--active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              goCertifications();
            }}
          >
            Certifications
          </a>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </nav>
      </header>

      {view === "all-projects" ? (
        <main className="all-projects">
          <h1 className="all-projects-title">Projects</h1>
          <p className="all-projects-subtitle">Here are some of the projects I&apos;d like to share.</p>

          <div className="gallery-grid">
            {allProjects.map((project) => (
              <ProjectGalleryCard key={project.id} project={project} />
            ))}
          </div>

          <button type="button" className="all-projects-back" onClick={goHome}>
            ← Back to home
          </button>
        </main>
      ) : view === "certifications" ? (
        <main className="certifications-page">
          <h1 className="certifications-title">Certifications</h1>
          <p className="certifications-subtitle">
            Professional credentials that support my work in AI, cloud, and software development.
          </p>

          <div className="cert-timeline" aria-label="Certifications timeline">
            {certifications.map((cert, index) => {
              const side = index % 2 === 0 ? "left" : "right";
              return (
                <div
                  key={cert.id}
                  className={`cert-timeline-item cert-timeline-item--${side}`}
                >
                  <article
                    className="cert-flip"
                    role="button"
                    tabIndex={0}
                    aria-label={`Open ${cert.title} certificate`}
                    onClick={() => setSelectedCert(cert)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedCert(cert);
                      }
                    }}
                  >
                    <div className="cert-flip-inner">
                      <div className="cert-flip-face cert-flip-front">
                        <img
                          src={cert.image}
                          alt={`${cert.title} certificate`}
                          className="cert-flip-image"
                          loading="lazy"
                        />
                      </div>

                      <div className="cert-flip-face cert-flip-back">
                        <div className="cert-flip-back-top">
                          <p className="cert-issuer">{cert.issuer}</p>
                          <h2 className="cert-name">{cert.title}</h2>
                          <p className="cert-meta">{cert.date}</p>
                        </div>

                        <div className="cert-skills">
                          {cert.skills.map((skill) => (
                            <span key={skill} className="cert-skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="cert-flip-footer">
                          <span className="cert-footer-note">Hover then click</span>
                          <span className="cert-link">Click to see</span>
                        </div>
                      </div>
                    </div>
                  </article>

                  <div className="cert-timeline-marker" aria-hidden="true">
                    <span className="cert-timeline-ring" />
                    <span className="cert-timeline-dot" />
                  </div>
                </div>
              );
            })}
          </div>

          <button type="button" className="all-projects-back" onClick={goHome}>
            ← Back to home
          </button>
        </main>
      ) : view === "about" ? (
        <main className="about-page">
          <div className="about-layout">
            <div className="about-portrait">
              <img
                className="about-portrait-art"
                src="/about-portrait.png?v=hd3"
                alt="Yamuna Mukthapuram"
                width={560}
                height={747}
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="about-content">
              <h1 className="about-heading">
                Hi, I&apos;m{" "}
                <span className="about-heading-name">Yamuna Mukthapuram</span>
              </h1>
              <p className="about-subtitle">Software Developer | AI/ML Enthusiast</p>
              <p className="about-text">
                I&apos;m a Software Developer who enjoys building modern web applications and exploring
                the possibilities of Artificial Intelligence and Machine Learning. I love turning ideas
                into practical solutions by creating responsive, scalable, and user-friendly
                applications with modern technologies.
              </p>
              <p className="about-text">
                I&apos;m always eager to learn, take on new challenges, and improve my skills through
                real-world projects.
              </p>
              <p className="about-location">
                <span className="about-flag" aria-hidden="true">
                  <svg viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                    <rect width="30" height="20" rx="3.5" fill="#fff" />
                    <path fill="#FF9933" d="M0 0h30v6.67H0z" />
                    <path fill="#fff" d="M0 6.67h30v6.66H0z" />
                    <path fill="#138808" d="M0 13.33h30V20H0z" />
                    <circle cx="15" cy="10" r="2.35" fill="none" stroke="#0606A8" strokeWidth="0.7" />
                    <circle cx="15" cy="10" r="0.35" fill="#0606A8" />
                    <g stroke="#0606A8" strokeWidth="0.35">
                      <line x1="15" y1="7.75" x2="15" y2="12.25" />
                      <line x1="12.75" y1="10" x2="17.25" y2="10" />
                      <line x1="13.4" y1="8.4" x2="16.6" y2="11.6" />
                      <line x1="16.6" y1="8.4" x2="13.4" y2="11.6" />
                    </g>
                  </svg>
                </span>
                Tirupati, India
              </p>
            </div>
          </div>

          <section className="experience" aria-labelledby="experience-title">
            <h2 id="experience-title" className="experience-title">
              Experience
            </h2>
            <ScrollTimeline items={experiences} />
          </section>

          <section className="experience education" aria-labelledby="education-title">
            <h2 id="education-title" className="experience-title">
              Education
            </h2>
            <ScrollTimeline items={education} />
          </section>

          <ContactSection id="contact" onSendMessage={() => setShowContactModal(true)} />
        </main>
      ) : (
      <main>
        <section id="home" className="hero">
          <h1 className="hero-name">Yamuna Mukthapuram</h1>
          <h2 className="hero-role">Software Developer | AI/ML Enthusiast</h2>
          <p className="hero-bio">
            <span className="hero-bio-line">
              I am passionate about developing modern web applications and AI-powered
            </span>
            <br />
            solutions. I specialize in <span className="tech">Full Stack Development</span> and{" "}
            <span className="tech">AI/ML</span>, creating scalable, efficient, and user-friendly
            software.
          </p>
        </section>

        <section id="skills" className="skills">
          <h2 className="skills-title">Skills</h2>

          <div className="skills-groups">
            {skillCategories.map((category, groupIndex) => (
              <motion.div
                key={category.title}
                className="skills-group"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                variants={{
                  hidden: {},
                  show: {
                    transition: {
                      staggerChildren: 0.07,
                      delayChildren: groupIndex * 0.08,
                    },
                  },
                }}
              >
                <motion.h3
                  className="skills-group-title"
                  variants={{
                    hidden: { opacity: 0, x: -36 },
                    show: {
                      opacity: 1,
                      x: 0,
                      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  {category.title}
                </motion.h3>
                <ul className="skills-list">
                  {category.skills.map((skill) => (
                    <motion.li
                      key={skill.name}
                      className="skill-chip"
                      variants={{
                        hidden: { opacity: 0, x: -48 },
                        show: {
                          opacity: 1,
                          x: 0,
                          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                        },
                      }}
                      whileHover={{ y: -2 }}
                    >
                      <span className="skill-icon-wrap">{skill.icon}</span>
                      <span>{skill.name}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="projects" className="projects">
          <h2 className="projects-title">My projects</h2>

          <div className="projects-layout">
            <div className="projects-list">
              {featuredProjects.map((project, index) => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-item${activeProject === index ? " project-item--active" : ""}`}
                  onMouseEnter={() => setActiveProject(index)}
                  onFocus={() => setActiveProject(index)}
                  onClick={() => setActiveProject(index)}
                >
                  <span className="project-name">
                    {project.id}. {project.name}
                  </span>
                  <span className="project-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </span>
                </button>
              ))}

              <button
                type="button"
                className="projects-more"
                onClick={() => {
                  goProjects();
                }}
              >
                See more projects
                <span className="projects-more-icon">
                  <ArrowCircleIcon />
                </span>
              </button>
            </div>

            <div className="projects-preview" key={featuredProjects[activeProject].id}>
              <ProjectPreview
                src={featuredProjects[activeProject].image}
                name={featuredProjects[activeProject].name}
              />
            </div>
          </div>
        </section>

        <ContactSection id="contact" onSendMessage={() => setShowContactModal(true)} />
      </main>
      )}

      {showFab && (
        <button type="button" className="fab" onClick={() => setShowContactModal(true)} aria-label="Send email">
          <MailIcon />
        </button>
      )}

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      {selectedCert ? (
        <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      ) : null}
    </div>
  );
}
