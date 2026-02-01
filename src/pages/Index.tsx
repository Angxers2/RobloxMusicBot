import { Header } from "@/components/Header";
import { BotGrid } from "@/components/BotGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Header />
        <BotGrid />
      </div>
    </div>
  );
};

export default Index;
