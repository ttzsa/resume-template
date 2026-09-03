import { z } from 'zod';
import type { ContentBlock, Resume } from '@/src/schema/types';

const uuid = z.string().uuid();
const richTextSchema = z
  .object({
    type: z.string().optional(),
    text: z.string().optional(),
    attrs: z.record(z.string(), z.unknown()).optional(),
    marks: z.array(z.unknown()).optional(),
    content: z.array(z.unknown()).optional(),
  })
  .passthrough();

const blockStyleSchema = z
  .object({
    fontSize: z.number().positive().optional(),
    color: z.string().optional(),
    lineHeight: z.number().positive().optional(),
    marginTop: z.number().optional(),
    marginBottom: z.number().optional(),
  })
  .optional();

const contentBlockSchema: z.ZodType<ContentBlock> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.object({
      id: uuid,
      type: z.literal('paragraph'),
      content: richTextSchema,
      style: blockStyleSchema,
      children: z.array(contentBlockSchema).optional(),
    }),
    z.object({
      id: uuid,
      type: z.literal('list'),
      style: z.enum(['circle', 'disc', 'decimal']),
      blockStyle: blockStyleSchema,
      items: z.array(
        z.object({
          id: uuid,
          content: richTextSchema,
          children: z.array(contentBlockSchema).optional(),
        }),
      ),
    }),
    z.object({
      id: uuid,
      type: z.literal('keyValue'),
      key: richTextSchema,
      value: richTextSchema,
      keyBold: z.boolean().optional(),
      keyWidth: z.number().positive().optional(),
      gap: z.number().positive().optional(),
      style: blockStyleSchema,
      children: z.array(contentBlockSchema).optional(),
    }),
    z.object({
      id: uuid,
      type: z.literal('group'),
      children: z.array(contentBlockSchema),
      style: blockStyleSchema,
    }),
  ]),
);

function blockDepth(block: ContentBlock, depth = 1): number {
  const childGroups: ContentBlock[][] = [];
  if ('children' in block && block.children) childGroups.push(block.children);
  if (block.type === 'list') {
    for (const item of block.items) if (item.children) childGroups.push(item.children);
  }
  if (childGroups.length === 0) return depth;
  return Math.max(depth, ...childGroups.flat().map((child) => blockDepth(child, depth + 1)));
}

const dateFields = {
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
};

const entryHeaderSchema = z
  .object({
    visible: z.boolean().optional(),
    layout: z.enum(['single-line', 'wrap']).optional(),
    fontSize: z.number().positive().optional(),
    separator: z.enum(['dot', 'dash', 'none']).optional(),
    fieldGap: z.number().nonnegative().optional(),
    primaryVisible: z.boolean().optional(),
    secondaryVisible: z.boolean().optional(),
    tertiaryVisible: z.boolean().optional(),
    otherInfoVisible: z.boolean().optional(),
    dateVisible: z.boolean().optional(),
  })
  .optional();

const projectSchema = z.object({
  id: uuid,
  name: richTextSchema,
  role: richTextSchema.optional(),
  otherInfo: richTextSchema.optional(),
  ...dateFields,
  blocks: z.array(contentBlockSchema),
  header: entryHeaderSchema,
});

const moduleStyleSchema = z
  .object({
    fontFamily: z.string().optional(),
    fontSize: z.number().positive().optional(),
    color: z.string().optional(),
    lineHeight: z.number().positive().optional(),
    paragraphGap: z.number().nonnegative().optional(),
    sectionGap: z.number().nonnegative().optional(),
    entryGap: z.number().nonnegative().optional(),
  })
  .optional();

const baseModule = {
  id: uuid,
  visible: z.boolean(),
  title: z.string().optional(),
  style: moduleStyleSchema,
};

const moduleSchema = z.discriminatedUnion('type', [
  z.object({
    ...baseModule,
    type: z.literal('profile'),
    name: richTextSchema,
    targetRole: richTextSchema.optional(),
    phone: z.object({ value: z.string(), content: richTextSchema.optional(), visible: z.boolean() }),
    email: z.object({ value: z.string(), content: richTextSchema.optional(), visible: z.boolean() }),
    github: z.object({ value: z.string(), content: richTextSchema.optional(), visible: z.boolean() }).optional(),
    customFields: z.array(
      z.object({ id: uuid, label: z.string(), value: richTextSchema, visible: z.boolean() }),
    ),
    photo: z
      .object({
        src: z.string(),
        visible: z.boolean(),
        width: z.number().positive(),
        height: z.number().positive(),
        borderRadius: z.number().nonnegative(),
        objectPosition: z.string().optional(),
        offsetX: z.number().optional(),
        offsetY: z.number().optional(),
      })
      .optional(),
  }),
  z.object({
    ...baseModule,
    type: z.literal('education'),
    entries: z.array(
      z.object({
        id: uuid,
        school: richTextSchema,
        degree: richTextSchema.optional(),
        major: richTextSchema.optional(),
        otherInfo: richTextSchema.optional(),
        ...dateFields,
        blocks: z.array(contentBlockSchema),
        header: entryHeaderSchema,
      }),
    ),
  }),
  z.object({
    ...baseModule,
    type: z.literal('internship'),
    entries: z.array(
      z.object({
        id: uuid,
        company: richTextSchema,
        role: richTextSchema.optional(),
        otherInfo: richTextSchema.optional(),
        ...dateFields,
        blocks: z.array(contentBlockSchema).optional(),
        projects: z.array(projectSchema),
        header: entryHeaderSchema,
      }),
    ),
  }),
  z.object({ ...baseModule, type: z.literal('project'), projects: z.array(projectSchema) }),
  z.object({
    ...baseModule,
    type: z.literal('free'),
    title: z.string().min(1),
    blocks: z.array(contentBlockSchema),
  }),
]);

const themeSchema = z.object({
  page: z.object({
    marginTop: z.number().nonnegative(),
    marginRight: z.number().nonnegative(),
    marginBottom: z.number().nonnegative(),
    marginLeft: z.number().nonnegative(),
  }),
  fontFamily: z.string(),
  fontSize: z.number().positive(),
  color: z.string(),
  lineHeight: z.number().positive(),
  paragraphGap: z.number().nonnegative(),
  sectionGap: z.number().nonnegative(),
  entryGap: z.number().nonnegative(),
  sectionTitle: z.object({
    fontSize: z.number().positive(),
    fontWeight: z.number(),
    color: z.string(),
    marginBottom: z.number().nonnegative(),
    showRule: z.boolean(),
    ruleWidth: z.number().nonnegative(),
    ruleColor: z.string(),
    ruleGap: z.number().nonnegative(),
  }),
  entryHeader: z.object({
    fontSize: z.number().positive(),
    fontWeight: z.number(),
    fieldGap: z.number().nonnegative(),
    dateAlignRight: z.boolean(),
    dateColor: z.string().optional(),
    separator: z.enum(['dot', 'dash', 'none']).optional(),
  }),
  bullet: z.object({
    style: z.enum(['circle', 'disc', 'decimal']),
    size: z.number().positive(),
    indent: z.number().min(-30),
    textGap: z.number().nonnegative(),
    itemGap: z.number().nonnegative(),
    color: z.string(),
  }),
  link: z.object({ color: z.string(), underline: z.boolean(), fontWeight: z.number() }),
  photo: z.object({
    width: z.number().positive(),
    height: z.number().positive(),
    borderRadius: z.number().nonnegative(),
    objectFit: z.enum(['cover', 'contain']),
    objectPosition: z.string(),
  }),
});

export const ResumeSchema: z.ZodType<Resume> = z
  .object({
    version: z.literal(1),
    metadata: z.object({
      id: uuid,
      title: z.string().min(1),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    theme: themeSchema,
    modules: z.array(moduleSchema),
  })
  .superRefine((resume, context) => {
    if (resume.modules.filter((module) => module.type === 'profile').length > 1) {
      context.addIssue({ code: 'custom', message: '个人信息模块只能存在一个', path: ['modules'] });
    }

    const inspect = (blocks: ContentBlock[], path: (string | number)[]) => {
      blocks.forEach((block, index) => {
        if (blockDepth(block) > 3) {
          context.addIssue({
            code: 'custom',
            message: '内容块最多允许嵌套三层',
            path: [...path, index],
          });
        }
      });
    };

    resume.modules.forEach((module, moduleIndex) => {
      if (module.type === 'free') inspect(module.blocks, ['modules', moduleIndex, 'blocks']);
      if (module.type === 'education') {
        module.entries.forEach((entry, entryIndex) =>
          inspect(entry.blocks, ['modules', moduleIndex, 'entries', entryIndex, 'blocks']),
        );
      }
      if (module.type === 'project') {
        module.projects.forEach((project, projectIndex) =>
          inspect(project.blocks, ['modules', moduleIndex, 'projects', projectIndex, 'blocks']),
        );
      }
      if (module.type === 'internship') {
        module.entries.forEach((entry, entryIndex) => {
          inspect(entry.blocks ?? [], ['modules', moduleIndex, 'entries', entryIndex, 'blocks']);
          entry.projects.forEach((project, projectIndex) =>
            inspect(project.blocks, [
              'modules',
              moduleIndex,
              'entries',
              entryIndex,
              'projects',
              projectIndex,
              'blocks',
            ]),
          );
        });
      }
    });
  });

export { contentBlockSchema as ContentBlockSchema, moduleSchema as ModuleSchema };
