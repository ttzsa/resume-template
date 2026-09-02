import { ResumeWorkbench } from '@/src/editor/resume-workbench';
import { createExampleResume } from '@/src/schema/example';

export default function Home() {
  return <ResumeWorkbench initialResume={createExampleResume()} />;
}
