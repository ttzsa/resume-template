import { linkedText, richText } from '@/src/schema/richtext';
import type { ContentBlock, ExperienceProject, Resume } from '@/src/schema/types';
import { defaultTheme } from '@/src/themes/theme';

const id = () => crypto.randomUUID();

const list = (items: string[]): ContentBlock => ({
  id: id(),
  type: 'list',
  style: 'circle',
  items: items.map((item) => ({ id: id(), content: richText(item) })),
});

const keyValue = (key: string, value: string): ContentBlock => ({
  id: id(),
  type: 'keyValue',
  key: richText(key),
  value: richText(value),
  keyBold: true,
});

const project = (
  name: string,
  role: string,
  linkLabel: string,
  href: string,
  bullets: string[],
): ExperienceProject => ({
  id: id(),
  name: richText(name),
  role: richText(role),
  otherInfo: linkedText(linkLabel, href),
  startDate: '2026-05',
  endDate: '2026-09',
  blocks: [
    keyValue('技术栈', 'Python / FastAPI / LangGraph / React / TypeScript'),
    list(bullets),
  ],
});

export function createExampleResume(): Resume {
  const now = new Date().toISOString();
  return {
    version: 1,
    metadata: { id: id(), title: '姓名 · 意向岗位简历', createdAt: now, updatedAt: now },
    theme: structuredClone(defaultTheme),
    modules: [
      {
        id: id(),
        type: 'profile',
        visible: true,
        name: richText('姓名'),
        targetRole: richText('意向岗位'),
        phone: { value: '138 0000 0000', visible: true },
        email: { value: 'name@example.com', visible: true },
        github: { value: 'github.com/username', content: linkedText('github.com/username', 'https://github.com/username'), visible: true },
        customFields: [
          { id: id(), label: '作品集', value: linkedText('portfolio.example.com', 'https://example.com/portfolio'), visible: true },
          { id: id(), label: '所在地', value: richText('城市'), visible: true },
        ],
      },
      {
        id: id(),
        type: 'education',
        title: '教育背景',
        visible: true,
        entries: [
          {
            id: id(),
            school: richText('学校名'),
            degree: richText('学位'),
            major: richText('专业'),
            otherInfo: linkedText('其他信息', 'https://example.com/school'),
            startDate: '2024-09',
            endDate: '2027-04',
            blocks: [
              list([
                '研究方向、主修课程或成绩等教育经历说明。',
                '奖项、荣誉或校园活动等补充信息。',
              ]),
            ],
          },
        ],
      },
      {
        id: id(),
        type: 'internship',
        title: '实习经历',
        visible: true,
        entries: [
          {
            id: id(),
            company: richText('公司名'),
            role: richText('岗位'),
            otherInfo: linkedText('其他信息', 'https://example.com/company'),
            startDate: '2026-07',
            endDate: '2026-09',
            projects: [
              project(
                '项目名',
                '职责',
                '项目链接',
                'https://example.com/demo',
                [
                  '使用动作、任务和结果描述第一条工作成果。',
                  '使用可量化指标描述第二条工作成果。',
                ],
              ),
            ],
          },
        ],
      },
      {
        id: id(),
        type: 'project',
        title: '项目经历',
        visible: true,
        projects: [
          project(
            '项目名',
            '职责',
            '项目链接',
            'https://github.com',
            [
              '描述项目背景、采用的方案和个人贡献。',
              '使用数据或业务结果说明项目成效。',
            ],
          ),
        ],
      },
      {
        id: id(),
        type: 'free',
        title: '科研经历',
        visible: true,
        blocks: [
          keyValue('研究主题', '研究课题或论文名称'),
          list(['描述研究方法、实验过程与阶段性成果。']),
        ],
      },
      {
        id: id(),
        type: 'free',
        title: '专业技能',
        visible: true,
        blocks: [
          keyValue('技能分类', '技能一、技能二、技能三'),
          keyValue('工具分类', '工具一、工具二、工具三'),
          keyValue('其他能力', '语言、证书或其他专业能力'),
        ],
      },
    ],
  };
}
