import { createExampleResume } from '@/src/schema/example';
import { PaginatedResumeRenderer } from '@/src/pagination/paginated-resume';

export default function ResumeRenderRoute() {
  return <main className="standalone-resume"><PaginatedResumeRenderer resume={createExampleResume()} mode="print" /></main>;
}
