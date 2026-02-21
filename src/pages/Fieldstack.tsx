import DocumentationPage from '@/components/projects/documents/Documentationpage';
import data from '@/data/fieldStack.json';

export default function Fieldstack(): JSX.Element {
  return <DocumentationPage data={data} />;
}