export interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  difficulty: string;
  readTime: string;
  author: string;
  category: string;
  featured: boolean;
  rating: number;
  reviews: number;
  tags: string[];
}

export const guidesData: Guide[] = [
  {
    id: "1",
    title: "Starting Your First Garden: A Complete Beginner's Guide",
    description:
      "Everything you need to know to start your gardening journey, from choosing the right location to planting your first seeds.",
    content:
      "Introduction\nSetting goals for your first garden and understanding your space.\n\n1) Site selection\n- Sun hours: track sunlight for a week.\n- Wind and drainage checks.\n- Access to water.\n\n2) Soil prep\n- Quick jar test for texture.\n- Add 3–5 cm compost; avoid over-tilling.\n\n3) What to plant\n- Easy starters: lettuce, basil, marigold, cherry tomato.\n- Planting calendar for your zone.\n\n4) Planting basics\n- Spacing, depth, and watering-in.\n- Mulch to retain moisture and block weeds.\n\n5) Care routine\n- Weekly checklist: water, weed, inspect pests, harvest.\n\n6) Common mistakes\n- Overwatering, crowding, skipping mulch.\n\nConclusion\nStart small, observe, iterate. Your first harvest is your best teacher.",
    image: "/images/beginners guide.png",
    difficulty: "Beginner",
    readTime: "8 min read",
    author: "Sarah Johnson",
    category: "Getting Started",
    featured: true,
    rating: 4.8,
    reviews: 127,
    tags: ["Beginner", "Complete Guide", "Garden Setup"],
  },
  {
    id: "2",
    title: "Master the Art of Starting Seeds Indoors",
    description:
      "Learn professional techniques for starting seeds indoors to get a head start on the growing season.",
    content:
      "Checklist\n- Seed-starting mix vs. garden soil.\n- Clean trays or cell packs with drainage.\n- Bottom heat (20–24°C) improves germination.\n\nSteps\n1) Moisten mix until it clumps when squeezed.\n2) Fill cells and firm lightly.\n3) Sow at 1–2× seed thickness; mist.\n4) Cover to maintain humidity; vent daily.\n5) Provide strong light: 14–16 h/day under LEDs 5–8 cm above leaves.\n6) Bottom water when surface lightens.\n7) Air movement to prevent damping-off.\n8) Pot up at 2–3 true leaves; feed at 1/4 strength.\n\nHardening off\n- 7–10 days of gradual outdoor exposure before transplant.",
    image: "/images/gardening-guide.png",
    difficulty: "Intermediate",
    readTime: "12 min read",
    author: "Mike Chen",
    category: "Seed Starting",
    featured: true,
    rating: 4.6,
    reviews: 89,
    tags: ["Indoor Growing", "Seed Starting", "Techniques"],
  },
  {
    id: "3",
    title: "Essential Tools Every Gardener Should Own",
    description:
      "Discover the must-have tools that will make your gardening tasks easier and more efficient.",
    content:
      "Core kit\n- Hand trowel, transplanter, pruning shears (bypass), hand fork, hori-hori, gloves.\n- Watering can with rose + hose nozzle with shower pattern.\n\nUpgrades\n- Stirrup hoe for fast weeding.\n- Loppers + folding saw for woody stems.\n- Wheelbarrow or garden cart.\n\nMaintenance\n- Clean and dry after use.\n- Sharpen blades every few weeks; oil pivots.\n- Store out of sun and rain.\n\nBuying tips\n- Choose forged steel, replaceable parts, and comfortable grips.\n- Prioritize tools you’ll use weekly over niche gadgets.",
    image: "/images/seeds indoor.png",
    difficulty: "Beginner",
    readTime: "6 min read",
    author: "Emma Davis",
    category: "Tools & Equipment",
    featured: true,
    rating: 4.7,
    reviews: 156,
    tags: ["Tools", "Equipment", "Essential"],
  },
];


