import { createExampleResume } from '@/src/schema/example';
import { ResumeWorkbench } from '@/src/editor/resume-workbench';

export default function ResumeEditRoute() {
  return <ResumeWorkbench initialResume={createExampleResume()} />;
}
