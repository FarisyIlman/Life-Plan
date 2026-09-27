import "dotenv/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const seedDate = (value: string) => new Date(`${value}T00:00:00+07:00`);

const eras = [
  {
    id: "seed-era-2026",
    slug: "2026",
    title: "Galaxy Journey",
    theme: "GALAXY" as const,
    startYear: 2026,
    endYear: 2026,
    description:
      "A year of internship, organizational transition, academic momentum, and the first steps toward an AI-focused thesis.",
    thesis:
      "Build enough momentum in 2026 to finish the current chapter with clarity and enter the final year of study prepared.",
    tradeOff:
      "Every commitment competes for the same limited time, so progress depends on choosing the next useful step.",
    successIndicators:
      "Complete the internship, close the BPA HMIF chapter responsibly, protect academic performance, and establish a realistic financial habit.",
    order: 1,
  },
  {
    id: "seed-era-2027",
    slug: "2027",
    title: "A Year in Motion",
    theme: "MONTHLY" as const,
    startYear: 2027,
    endYear: 2027,
    description:
      "A month-by-month route through the final semester, thesis work, graduation, and the first professional step.",
    thesis:
      "Turn the final year of university into a sequence of deliberate monthly milestones instead of one overwhelming finish line.",
    tradeOff:
      "The calendar will be busy, so the plan leaves room to adjust while keeping the graduation and thesis path visible.",
    successIndicators:
      "Complete the final semester, defend the bachelor thesis, graduate, and move into the next professional chapter.",
    order: 2,
  },
];

type SeedBlock = {
  id: string;
  eraId: string;
  type: string;
  title: string;
  subtitle: string;
  data: Prisma.InputJsonValue;
  deadline?: Date;
  isCompleted: boolean;
  order: number;
};

const publicData = (data: {
  description: string;
  why: string;
  nextAction: string;
  techStack?: string;
  responsibilities?: string;
}) => ({
  ...data,
  visibility: "PUBLIC",
});

const galaxyBlocks: SeedBlock[] = [
  {
    id: "seed-2026-internship",
    eraId: "seed-era-2026",
    type: "card",
    title: "Internship at PT Dirgantara Indonesia",
    subtitle: "A practical orbit around engineering, teamwork, and delivery.",
    data: publicData({
      description:
        "Use the internship to turn academic knowledge into work that can be explained, reviewed, and shipped.",
      why: "This is the closest 2026 signal to real production engineering experience.",
      nextAction:
        "Document the project, responsibilities, and lessons learned after each meaningful milestone.",
      techStack: "To be updated from the internship work.",
      responsibilities:
        "Project contribution, collaboration, and professional delivery.",
    }),
    deadline: seedDate("2026-08-15"),
    isCompleted: false,
    order: 1,
  },
  {
    id: "seed-2026-bpa-transition",
    eraId: "seed-era-2026",
    type: "card",
    title: "BPA HMIF Demisioner",
    subtitle: "Close the Secretary General chapter with a clean handover.",
    data: publicData({
      description:
        "The transition starts on 3 August and continues through 15 September 2026.",
      why: "A responsible handover protects the organization and makes room for the next chapter.",
      nextAction:
        "Complete documentation, transfer responsibilities, and finish the demisioner process.",
      responsibilities: "Secretary General of BPA HMIF.",
    }),
    deadline: seedDate("2026-09-15"),
    isCompleted: false,
    order: 2,
  },
  {
    id: "seed-2026-semester-7",
    eraId: "seed-era-2026",
    type: "card",
    title: "Semester 7 Launch",
    subtitle: "Twelve credits and a deliberate academic reset.",
    data: publicData({
      description:
        "Begin the seventh semester on 21 September with a manageable course load and space for deeper technical work.",
      why: "The final academic years need consistency more than heroic bursts of effort.",
      nextAction:
        "Settle the semester schedule and evaluate the opportunity to become a multimedia engineering lab assistant.",
      responsibilities:
        "12 SKS, course planning, and possible multimedia engineering lab assistance.",
    }),
    deadline: seedDate("2026-09-21"),
    isCompleted: false,
    order: 3,
  },
  {
    id: "seed-2026-academic-goals",
    eraId: "seed-era-2026",
    type: "card",
    title: "Academic North Star",
    subtitle:
      "Protect the degree path while choosing a meaningful thesis direction.",
    data: publicData({
      description:
        "Aim for an IPK above 3.5, complete the kerja praktik defence, and begin a bachelor thesis around LLM or ML/DL.",
      why: "The academic foundation determines how much freedom the next technical chapter can have.",
      nextAction:
        "Narrow the thesis question and map the prerequisites for the selected research direction.",
      responsibilities:
        "IPK target, kerja praktik defence, and thesis preparation.",
    }),
    deadline: seedDate("2026-12-31"),
    isCompleted: false,
    order: 4,
  },
  {
    id: "seed-2026-financial-foundation",
    eraId: "seed-era-2026",
    type: "card",
    title: "Financial Foundation",
    subtitle: "Start tracking saving and investment as a long-term system.",
    data: publicData({
      description:
        "Build a repeatable habit around saving, stock investment, and understanding the financial runway needed for future study.",
      why: "The 2030 scholarship and moving-abroad goals begin with small, visible habits now.",
      nextAction:
        "Record the first baseline and review the saving and investment plan every month.",
      responsibilities:
        "Saving, stock investment, and financial goal tracking.",
    }),
    deadline: seedDate("2026-12-31"),
    isCompleted: false,
    order: 5,
  },
  {
    id: "seed-2026-thesis-direction",
    eraId: "seed-era-2026",
    type: "card",
    title: "Thesis Signal",
    subtitle: "Move from broad interest to a researchable AI direction.",
    data: publicData({
      description:
        "Explore whether the bachelor thesis should focus on LLM, machine learning, or deep learning through a small literature and project review.",
      why: "A focused research direction will make the final academic year calmer and more credible.",
      nextAction:
        "Compare three candidate topics and write a short problem statement for each.",
      techStack: "LLM, ML, and DL exploration.",
    }),
    deadline: seedDate("2026-11-30"),
    isCompleted: false,
    order: 6,
  },
];

const monthlyPlans = [
  [
    "January",
    "Final Semester Exam",
    "Close the previous semester and start the final-year rhythm.",
    "Prepare an exam and thesis calendar.",
  ],
  [
    "February",
    "Semester 8 Begins",
    "Start semester 8 with four credits for thesis and two for Cloud Computing.",
    "Confirm the thesis supervisor, scope, and semester deliverables.",
  ],
  [
    "March",
    "Ramadan and Eid al-Fitr",
    "Keep the academic plan humane while making space for Ramadan and Eid.",
    "Rebalance weekly commitments around the holiday period.",
  ],
  [
    "April",
    "Mid-Semester Review",
    "Use the mid-semester checkpoint to catch problems before they compound.",
    "Review thesis progress, course standing, and remaining risks.",
  ],
  [
    "May",
    "Thesis Development",
    "Turn the selected research direction into a working academic project.",
    "Build the next thesis milestone and record the result.",
  ],
  [
    "June",
    "Research and Iteration",
    "Strengthen the method, experiment, or implementation behind the thesis.",
    "Run the next experiment and document what changed.",
  ],
  [
    "July",
    "Thesis Review",
    "Prepare the work for feedback and formal academic review.",
    "Collect feedback and close the most important gaps.",
  ],
  [
    "August",
    "Final Academic Push",
    "Protect focused time for writing, revision, and graduation requirements.",
    "Lock the submission checklist and remaining deadlines.",
  ],
  [
    "September",
    "Defence Preparation",
    "Turn the thesis into a clear story that can be defended with confidence.",
    "Practice the presentation and prepare responses to likely questions.",
  ],
  [
    "October",
    "Bachelor Graduation",
    "Graduate and mark the end of the undergraduate journey.",
    "Complete graduation administration and begin the job transition.",
  ],
  [
    "November",
    "First Professional Step",
    "Move from graduation into the first full-time professional opportunity.",
    "Review opportunities and choose the next learning environment deliberately.",
  ],
  [
    "December",
    "Year Reflection",
    "Close the year by preserving lessons and setting the next horizon.",
    "Write the 2027 retrospective and define the 2028 work and finance targets.",
  ],
] as const;

const monthlyBlocks: SeedBlock[] = monthlyPlans.map(
  ([monthName, title, description, nextAction], index) => ({
    id: `seed-2027-${String(index + 1).padStart(2, "0")}`,
    eraId: "seed-era-2027",
    type: "monthly-card",
    title,
    subtitle: monthName,
    data: {
      visibility: "PUBLIC",
      month: index + 1,
      description,
      why: "A visible monthly milestone keeps the final academic year practical and navigable.",
      nextAction,
    },
    deadline: seedDate(`2027-${String(index + 1).padStart(2, "0")}-28`),
    isCompleted: false,
    order: index + 1,
  }),
);

const seedBlocks = [...galaxyBlocks, ...monthlyBlocks];

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL!;
  const password = process.env.SEED_ADMIN_PASSWORD!;
  const name = process.env.SEED_ADMIN_NAME || "Farisy";

  const existingAdmin = await prisma.admin.findFirst({
    where: { OR: [{ email }, { username: "farisy" }] },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { email, username: "farisy", passwordHash, name },
    });
    console.log("Admin created:", email);
  } else {
    console.log("Admin already exists, keeping existing credentials.");
  }

  const eraIds = new Map<string, string>();

  for (const era of eras) {
    const seededEra = await prisma.era.upsert({
      where: { slug: era.slug },
      update: {
        title: era.title,
        theme: era.theme,
        startYear: era.startYear,
        endYear: era.endYear,
        description: era.description,
        thesis: era.thesis,
        tradeOff: era.tradeOff,
        successIndicators: era.successIndicators,
        isPublished: true,
        order: era.order,
        deletedAt: null,
      },
      create: { ...era, isPublished: true },
    });
    eraIds.set(era.id, seededEra.id);
  }

  for (const block of seedBlocks) {
    const eraId = eraIds.get(block.eraId);
    if (!eraId) throw new Error(`Missing seeded era for ${block.eraId}`);

    await prisma.contentBlock.upsert({
      where: { id: block.id },
      update: {
        eraId,
        type: block.type,
        title: block.title,
        subtitle: block.subtitle,
        data: block.data,
        deadline: block.deadline,
        order: block.order,
        isPublished: true,
        isCompleted: block.isCompleted,
        deletedAt: null,
      },
      create: {
        ...block,
        eraId,
        isPublished: true,
      },
    });
  }

  console.log(
    `Seeded ${eras.length} eras and ${seedBlocks.length} MVP content blocks.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
