import CookbookApp from "../../components/CookbookApp";
import AboutMe from "../../assets/CWD/docs/AboutMe.md?raw";
import AboutRole from "../../assets/CWD/docs/AboutRole.md?raw";
import Project from "../../assets/CWD/docs/Project.md?raw";


const AboutPooja = [
  // =====================================================
  // 09. A2A COMMUNICATION
  // =====================================================
  {
    id: "AboutMe",
    category: "Pooja",
    title: "Pooja self Intro",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Tell me about your self",
  concept: AboutMe,
    },
    {
    id: "AboutRole",
    category: "Pooja",
    title: "AboutRole",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Tell me about your self",
  concept: AboutRole,
    },
    {
    id: "Project",
    category: "Pooja",
    title: "Project",
    difficulty: "Advanced",
    time: "~60 min",
    description:
      "Tell me about your self",
  concept: Project,
    },
      
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={AboutPooja}
      title="AboutPooja Communication Cookbook"
      subtitle="AboutPooja"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}