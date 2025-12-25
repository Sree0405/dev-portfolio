import Navigation from '@/components/Navigation';
import ImmersiveScene from '@/components/ImmersiveScene';

const ImmersivePage = () => {
  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-background">
      {/* Navigation hidden for immersive experience */}
      {/* <Navigation /> */}
      <ImmersiveScene />
    </div>
  );
};

export default ImmersivePage;
