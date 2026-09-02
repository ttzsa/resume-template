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
    metadata: { id: id(), title: '林墨 · AI 应用工程师简历', createdAt: now, updatedAt: now },
    theme: structuredClone(defaultTheme),
    modules: [
      {
        id: id(),
        type: 'profile',
        visible: true,
        name: richText('林墨'),
        targetRole: richText('AI 应用 / 全栈工程师'),
        phone: { value: '+86 138 0000 0000', visible: true },
        email: { value: 'linmo@example.com', visible: true },
        customFields: [
          { id: id(), label: '作品集', value: linkedText('linmo.dev', 'https://example.com'), visible: true },
          { id: id(), label: 'GitHub', value: linkedText('github.com/linmo', 'https://github.com'), visible: true },
          { id: id(), label: '所在地', value: richText('南京'), visible: true },
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
            school: richText('南京航空航天大学'),
            degree: richText('硕士'),
            major: richText('软件工程'),
            otherInfo: linkedText('学校官网', 'https://www.nuaa.edu.cn'),
            startDate: '2024-09',
            endDate: '2027-04',
            blocks: [
              list([
                '研究方向：多模态大模型、视觉语言模型与智能文档理解',
                'GPA 3.8 / 4.0，主修机器学习、分布式系统与高级算法设计',
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
            company: richText('澜光科技（南京）有限责任公司'),
            role: richText('Agent 核心开发'),
            otherInfo: linkedText('公司主页', 'https://example.com/company'),
            startDate: '2026-07',
            endDate: '2026-09',
            projects: [
              project(
                '工业报告智能文档 Agent',
                '核心开发',
                '在线 Demo',
                'https://example.com/demo',
                [
                  '从 0 到 1 设计可追溯的文档解析流水线，覆盖表格、图像与跨页语义结构。',
                  '处理 2000+ 页工业资料，以混合检索和证据回链降低幻觉并提升交付可信度。',
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
            'Globex 电商售后 Agent',
            'AI Agent 开发',
            'GitHub',
            'https://github.com',
            [
              '设计 Hybrid RAG、Session Memory 与人工审核节点，使复杂售后流程可解释、可恢复。',
              '构建 React 所见即所得运营台，支持流式响应、工具调用轨迹和多轮会话管理。',
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
          keyValue('论文', '面向低照度工业场景的结构保持图像增强方法（在投）'),
          list(['构建 12 万对合成与真实图像训练集，提出结构一致性损失并完成消融实验。']),
        ],
      },
      {
        id: id(),
        type: 'free',
        title: '专业技能',
        visible: true,
        blocks: [
          keyValue('前端', 'React、TypeScript、Vite、Zustand、Tiptap'),
          keyValue('后端 / AI', 'Python、FastAPI、Playwright、LangGraph、RAG、VLM'),
          keyValue('工程化', 'Docker、GitHub Actions、Linux、可观测性与自动化测试'),
        ],
      },
    ],
  };
}
