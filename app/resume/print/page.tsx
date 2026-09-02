import { PrintResumePage } from '@/src/pdf/print-page';
import { createExampleResume } from '@/src/schema/example';

export default function ResumePrintRoute() {
  return <PrintResumePage initialResume={createExampleResume()} />;
}
