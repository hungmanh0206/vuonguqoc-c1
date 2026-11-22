import { ContentState } from './content-state';

export function ModulePlaceholder({ title, description, stateHeading, stateDescription }: {
  title: string;
  description: string;
  stateHeading: string;
  stateDescription: string;
}) {
  return (
    <div className="page">
      <h1>{title}</h1>
      <p className="page-intro">{description}</p>
      <ContentState variant="empty" heading={stateHeading} description={stateDescription} />
    </div>
  );
}
