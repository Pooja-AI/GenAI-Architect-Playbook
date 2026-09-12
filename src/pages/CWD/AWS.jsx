import CookbookApp from "../../components/CookbookApp";


const AWS = [
   
];

export default function CWDPage() {
  return (
    <CookbookApp
      data={AWS}
      title="AWS Communication Cookbook"
      subtitle="Complete Workflow Design"
      icon="🧩"
      patternLabel="Topics"
    />
  );
}