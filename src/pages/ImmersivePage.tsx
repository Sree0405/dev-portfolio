import Navigation from '@/components/Navigation';
import ImmersiveScene from '@/components/ImmersiveScene';

const ImmersivePage = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Navigation />
      <ImmersiveScene />
    </div>
  );
};

export default ImmersivePage;
