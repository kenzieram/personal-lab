export type FocusTier = "Primary" | "Supporting";

export type FocusArea = {
  id: string;
  tier: FocusTier;
  category: string;
  badge?: string;
  summary: string;
  items: string[];
};

export type ProjectEntry = {
  index: string;
  name: string;
  context: string;
  description: string;
  stack: string[];
  href?: string;
  linkLabel?: string;
};

export type TerminalFile = {
  name: string;
  lines: string[];
};

export const portfolioData = {
  brand: "Kenzie.",
  domain: "https://kenzieram.my.id",
  email: "kenzie.ram@proton.me",
  githubProfileUrl: "https://github.com/kenzieram",
  githubRepoUrl: "https://github.com/kenzieram/personal-lab",
  navLinks: [
    { label: "Focus", href: "#focus" },
    { label: "About", href: "#about" },
    { label: "Work", href: "#work" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    headlineLines: ["BUILDING WITH CODE.", "EXPLORING WITH CURIOSITY."],
    description:
      "I'm Kenzie, a student developer focused on cloud computing, networking, and practical software engineering.",
    primaryAction: { label: "Explore technical focus", href: "#focus" },
    secondaryAction: { label: "Open terminal", href: "#terminal" },
  },
  primaryFocus: [
    {
      id: "networking",
      tier: "Primary",
      category: "Networking & Infrastructure",
      badge: "MTCNA: In Progress",
      summary:
        "Hands-on routing, switching, and network troubleshooting across Cisco and MikroTik environments.",
      items: [
        "Cisco networking & basic routing/switching",
        "MikroTik RouterOS configuration",
        "VLANs & network segmentation",
        "Network troubleshooting & IPv4 CIDR math",
        "Practical networking lab experiments",
      ],
    },
    {
      id: "cloud",
      tier: "Primary",
      category: "Cloud Computing",
      badge: "AWS & Automation",
      summary:
        "Practical exposure to AWS core services, containerized workloads, and declarative infrastructure.",
      items: [
        "AWS fundamentals (EC2, S3, IAM)",
        "VPC networking, Security Groups & RDS",
        "Docker container workflows",
        "Terraform & basic infrastructure automation",
        "Managed auth & PostgreSQL RLS (Supabase / Vercel)",
      ],
    },
  ] satisfies FocusArea[],
  supportingFocus: [
    {
      id: "software",
      tier: "Supporting",
      category: "Software Development",
      summary: "Building maintainable web interfaces and browser-based utilities.",
      items: ["JavaScript", "TypeScript", "React", "Next.js", "HTML/CSS", "SQL", "Git / GitHub"],
    },
    {
      id: "creative",
      tier: "Supporting",
      category: "Creative Technology",
      summary: "Visual observation, editorial layout systems, and typography.",
      items: [
        "Editorial web composition",
        "Accessible UI craft",
        "Photography & framing",
      ],
    },
  ] satisfies FocusArea[],
  about: {
    statement: "Curious about how systems hold together from packet to interface.",
    paragraphs: [
      "I am a student developer interested in how software, networks, and cloud infrastructure fit together in practice. Most of my time goes into configuring networks, experimenting with AWS services, and building small tools to understand systems from the ground up.",
      "On the networking side, I work hands-on with Cisco and MikroTik RouterOS setups, VLAN segmentation, and routing fundamentals while preparing for MikroTik MTCNA certification. In cloud computing, I focus on core AWS building blocks like EC2, VPC, IAM, S3, and RDS alongside Docker and Terraform.",
      "Outside of terminals and infrastructure labs, photography keeps me attentive to light, framing, and restraint. That same eye shapes how I approach layout and clarity on the web.",
    ],
  },
  selectedProjects: [
    {
      index: "01",
      name: "Cloud & Networking Lab Practice",
      context: "Ongoing Infrastructure Study",
      description:
        "Hands-on experiments with MikroTik RouterOS, Cisco switching, VLAN segmentation, and AWS core infrastructure (EC2, VPC, Security Groups, S3, RDS) paired with Docker and Terraform automation.",
      stack: ["Cisco", "MikroTik RouterOS", "AWS", "Docker", "Terraform"],
    },
    {
      index: "02",
      name: "IPv4 Subnetting & CIDR Utility",
      context: "Browser Networking Tool",
      description:
        "A client-side IPv4 subnet calculator handling network boundaries, broadcast addresses, usable host ranges, and /31 and /32 point-to-point conventions with unit-tested math.",
      stack: ["TypeScript", "Node Test Runner", "IPv4 / CIDR"],
      href: "https://github.com/kenzieram/personal-lab",
      linkLabel: "View implementation on GitHub ↗",
    },
    {
      index: "03",
      name: "Personal Lab",
      context: "Private Workspace",
      description:
        "My private web workspace for organizing technical notes, projects, and browser utilities behind Supabase session verification and PostgreSQL row-level security.",
      stack: ["Next.js", "React", "TypeScript", "Supabase RLS", "PostgreSQL"],
      href: "https://github.com/kenzieram/personal-lab",
      linkLabel: "Inspect repository ↗",
    },
  ] satisfies ProjectEntry[],
  creativeWork: {
    heading: "Photography & visual observation.",
    description:
      "Alongside technical work, I enjoy photography as a way to slow down and notice composition, contrast, and light. No stock galleries here; this space stays reserved for my own frames when I publish them.",
  },
  contact: {
    heading: "Get in touch.",
    description:
      "Have a project in mind, want to discuss technology, or simply want to connect? Feel free to reach out.",
  },
  labAccess: {
    label: "PERSONAL LAB",
    description:
      "A private workspace for my projects, technical notes, and ongoing experiments.",
    ctaLabel: "Enter Personal Lab",
    href: "/login",
  },
  terminal: {
    promptUser: "kenzie@portfolio",
    promptDir: "~",
    cwd: "/home/kenzie/portfolio",
    files: [
      {
        name: "about.md",
        lines: [
          "# Kenzie",
          "Student developer focused on cloud computing, networking, and practical software engineering.",
          "Contact: kenzie.ram@proton.me",
        ],
      },
      {
        name: "skills.md",
        lines: [
          "# Technical Focus",
          "Primary    Networking & Infrastructure: Cisco, MikroTik RouterOS, VLANs, routing/switching (MTCNA: In Progress)",
          "Primary    Cloud Computing: AWS (EC2, S3, IAM, VPC, Security Groups, RDS), Docker, Terraform",
          "Supporting Software: JavaScript, TypeScript, React, Next.js, HTML/CSS, SQL, Git/GitHub",
          "Supporting Creative: Editorial web layout, typography, photography",
        ],
      },
      {
        name: "projects.md",
        lines: [
          "# Selected Work",
          "01. Cloud & Networking Lab Practice (Cisco, MikroTik RouterOS, AWS, Docker, Terraform)",
          "02. IPv4 Subnetting & CIDR Utility (TypeScript, /31 and /32 support)",
          "03. Personal Lab (Private authenticated workspace at /login)",
        ],
      },
      {
        name: "interests.md",
        lines: [
          "# Beyond Code",
          "- Network architecture, VLAN segmentation, and MikroTik MTCNA study",
          "- Cloud infrastructure fundamentals and automation",
          "- Photography, framing, and high-contrast editorial design",
        ],
      },
    ] satisfies TerminalFile[],
    neofetch: [
      { key: "Name", value: "Kenzie" },
      { key: "Role", value: "Student Developer" },
      { key: "Primary", value: "Networking (Cisco, MikroTik / MTCNA in progress) & Cloud (AWS, Docker, Terraform)" },
      { key: "Supporting", value: "TypeScript, Next.js, React, SQL, Photography" },
      { key: "Contact", value: "kenzie.ram@proton.me" },
      { key: "Environment", value: "Interactive Portfolio Interpreter (Browser)" },
    ],
  },
} as const;
