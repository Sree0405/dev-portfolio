import DocumentationPage from '@/components/projects/documents/Documentationpage';
import data from '@/data/lifeadmin.json';

export default function LifeAdmin(): JSX.Element {
  return <DocumentationPage isMobile={true} data={data} />;
}