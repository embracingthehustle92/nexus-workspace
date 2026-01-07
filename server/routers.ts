import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { notes, contacts, companies, deals, content, projects, tasks, emails, codeFiles, workspaces, activities } from "../drizzle/schema";
import { eq, desc, and, like } from "drizzle-orm";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // Notes Module
  notes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(notes).where(eq(notes.userId, ctx.user.id)).orderBy(desc(notes.updatedAt));
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const result = await db.select().from(notes).where(and(eq(notes.id, input.id), eq(notes.userId, ctx.user.id))).limit(1);
        return result[0] || null;
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().default("Untitled"),
        content: z.any().optional(),
        parentId: z.number().optional(),
        icon: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(notes).values({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          parentId: input.parentId,
          icon: input.icon,
        });
        return { id: result[0].insertId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.any().optional(),
        icon: z.string().optional(),
        isFavorite: z.boolean().optional(),
        isArchived: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...updates } = input;
        await db.update(notes).set(updates).where(and(eq(notes.id, id), eq(notes.userId, ctx.user.id)));
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(notes).where(and(eq(notes.id, input.id), eq(notes.userId, ctx.user.id)));
        return { success: true };
      }),
    
    aiAssist: protectedProcedure
      .input(z.object({
        content: z.string(),
        action: z.enum(["expand", "summarize", "improve", "translate"]),
      }))
      .mutation(async ({ input }) => {
        const prompts: Record<string, string> = {
          expand: "Expand on the following text with more details and examples:",
          summarize: "Summarize the following text concisely:",
          improve: "Improve the writing quality of the following text:",
          translate: "Translate the following text to English (if not already) or improve its clarity:",
        };
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a helpful writing assistant." },
            { role: "user", content: `${prompts[input.action]}\n\n${input.content}` },
          ],
        });
        
        return { result: response.choices[0]?.message?.content || "" };
      }),
  }),

  // CRM Module
  crm: router({
    contacts: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(contacts).where(eq(contacts.userId, ctx.user.id)).orderBy(desc(contacts.updatedAt));
      }),
      
      create: protectedProcedure
        .input(z.object({
          firstName: z.string(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          company: z.string().optional(),
          jobTitle: z.string().optional(),
          status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
          notes: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const result = await db.insert(contacts).values({
            userId: ctx.user.id,
            ...input,
          });
          return { id: result[0].insertId };
        }),
      
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().optional(),
          phone: z.string().optional(),
          company: z.string().optional(),
          jobTitle: z.string().optional(),
          status: z.enum(["lead", "prospect", "customer", "inactive"]).optional(),
          notes: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const { id, ...updates } = input;
          await db.update(contacts).set(updates).where(and(eq(contacts.id, id), eq(contacts.userId, ctx.user.id)));
          return { success: true };
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          await db.delete(contacts).where(and(eq(contacts.id, input.id), eq(contacts.userId, ctx.user.id)));
          return { success: true };
        }),
    }),
    
    companies: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(companies).where(eq(companies.userId, ctx.user.id)).orderBy(desc(companies.updatedAt));
      }),
      
      create: protectedProcedure
        .input(z.object({
          name: z.string(),
          domain: z.string().optional(),
          industry: z.string().optional(),
          size: z.string().optional(),
          revenue: z.string().optional(),
          description: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const result = await db.insert(companies).values({
            userId: ctx.user.id,
            ...input,
          });
          return { id: result[0].insertId };
        }),
    }),
    
    deals: router({
      list: protectedProcedure.query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(deals).where(eq(deals.userId, ctx.user.id)).orderBy(desc(deals.updatedAt));
      }),
      
      create: protectedProcedure
        .input(z.object({
          title: z.string(),
          value: z.number().optional(),
          stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
          contactId: z.number().optional(),
          companyId: z.number().optional(),
          probability: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const result = await db.insert(deals).values({
            userId: ctx.user.id,
            ...input,
          });
          return { id: result[0].insertId };
        }),
      
      updateStage: protectedProcedure
        .input(z.object({
          id: z.number(),
          stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          await db.update(deals).set({ stage: input.stage }).where(and(eq(deals.id, input.id), eq(deals.userId, ctx.user.id)));
          return { success: true };
        }),
    }),
    
    aiInsights: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { insights: [] };
      
      const contactsList = await db.select().from(contacts).where(eq(contacts.userId, ctx.user.id)).limit(10);
      const dealsList = await db.select().from(deals).where(eq(deals.userId, ctx.user.id)).limit(10);
      
      if (contactsList.length === 0 && dealsList.length === 0) {
        return { insights: ["Add contacts and deals to get AI-powered insights"] };
      }
      
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are a CRM analyst. Provide 3-5 brief, actionable insights based on the data." },
          { role: "user", content: `Analyze this CRM data and provide insights:\nContacts: ${JSON.stringify(contactsList)}\nDeals: ${JSON.stringify(dealsList)}` },
        ],
      });
      
      const content = response.choices[0]?.message?.content;
      return { insights: typeof content === 'string' ? content.split("\n").filter(Boolean) : [] };
    }),
  }),

  // Content Module
  content: router({
    list: protectedProcedure
      .input(z.object({
        category: z.string().optional(),
        type: z.enum(["document", "image", "video", "file", "link"]).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(content).where(eq(content.userId, ctx.user.id)).orderBy(desc(content.updatedAt));
      }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        type: z.enum(["document", "image", "video", "file", "link"]).optional(),
        content: z.any().optional(),
        fileUrl: z.string().optional(),
        category: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(content).values({
          userId: ctx.user.id,
          ...input,
        });
        return { id: result[0].insertId };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.any().optional(),
        category: z.string().optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { id, ...updates } = input;
        await db.update(content).set(updates).where(and(eq(content.id, id), eq(content.userId, ctx.user.id)));
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.delete(content).where(and(eq(content.id, input.id), eq(content.userId, ctx.user.id)));
        return { success: true };
      }),
  }),

  // Projects Module
  projects: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(projects).where(eq(projects.userId, ctx.user.id)).orderBy(desc(projects.updatedAt));
    }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        color: z.string().optional(),
        status: z.enum(["active", "on_hold", "completed", "cancelled"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(projects).values({
          userId: ctx.user.id,
          ...input,
        });
        return { id: result[0].insertId };
      }),
    
    tasks: router({
      list: protectedProcedure
        .input(z.object({ projectId: z.number().optional() }).optional())
        .query(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) return [];
          if (input?.projectId) {
            return db.select().from(tasks).where(and(eq(tasks.userId, ctx.user.id), eq(tasks.projectId, input.projectId))).orderBy(tasks.position);
          }
          return db.select().from(tasks).where(eq(tasks.userId, ctx.user.id)).orderBy(tasks.position);
        }),
      
      create: protectedProcedure
        .input(z.object({
          title: z.string(),
          description: z.string().optional(),
          projectId: z.number().optional(),
          status: z.enum(["backlog", "todo", "in_progress", "review", "done"]).optional(),
          priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
          dueDate: z.date().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const result = await db.insert(tasks).values({
            userId: ctx.user.id,
            ...input,
          });
          return { id: result[0].insertId };
        }),
      
      updateStatus: protectedProcedure
        .input(z.object({
          id: z.number(),
          status: z.enum(["backlog", "todo", "in_progress", "review", "done"]),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          await db.update(tasks).set({ status: input.status }).where(and(eq(tasks.id, input.id), eq(tasks.userId, ctx.user.id)));
          return { success: true };
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          await db.delete(tasks).where(and(eq(tasks.id, input.id), eq(tasks.userId, ctx.user.id)));
          return { success: true };
        }),
    }),
    
    aiSuggest: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return { suggestions: [] };
        
        const project = await db.select().from(projects).where(and(eq(projects.id, input.projectId), eq(projects.userId, ctx.user.id))).limit(1);
        const projectTasks = await db.select().from(tasks).where(and(eq(tasks.projectId, input.projectId), eq(tasks.userId, ctx.user.id)));
        
        if (!project[0]) return { suggestions: [] };
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are a project management assistant. Suggest 3-5 tasks that could help complete this project." },
            { role: "user", content: `Project: ${project[0].name}\nDescription: ${project[0].description || "N/A"}\nExisting tasks: ${projectTasks.map(t => t.title).join(", ") || "None"}` },
          ],
        });
        
        const suggestContent = response.choices[0]?.message?.content;
        return { suggestions: typeof suggestContent === 'string' ? suggestContent.split("\n").filter(Boolean) : [] };
      }),
  }),

  // Email Module
  emails: router({
    list: protectedProcedure
      .input(z.object({ folder: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(emails).where(eq(emails.userId, ctx.user.id)).orderBy(desc(emails.createdAt));
      }),
    
    create: protectedProcedure
      .input(z.object({
        toAddresses: z.array(z.string()),
        subject: z.string().optional(),
        body: z.string().optional(),
        folder: z.enum(["inbox", "sent", "drafts", "trash", "archive", "spam"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(emails).values({
          userId: ctx.user.id,
          fromAddress: ctx.user.email || "user@nexus.app",
          ...input,
        });
        return { id: result[0].insertId };
      }),
    
    markRead: protectedProcedure
      .input(z.object({ id: z.number(), isRead: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.update(emails).set({ isRead: input.isRead }).where(and(eq(emails.id, input.id), eq(emails.userId, ctx.user.id)));
        return { success: true };
      }),
    
    aiCompose: protectedProcedure
      .input(z.object({
        prompt: z.string(),
        context: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are an email writing assistant. Write professional, clear, and concise emails." },
            { role: "user", content: `Write an email based on this request: ${input.prompt}${input.context ? `\n\nContext: ${input.context}` : ""}` },
          ],
        });
        
        return { email: response.choices[0]?.message?.content || "" };
      }),
  }),

  // Code Module
  code: router({
    files: router({
      list: protectedProcedure
        .input(z.object({ projectId: z.number().optional() }).optional())
        .query(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) return [];
          return db.select().from(codeFiles).where(eq(codeFiles.userId, ctx.user.id)).orderBy(codeFiles.path);
        }),
      
      create: protectedProcedure
        .input(z.object({
          name: z.string(),
          type: z.enum(["file", "folder"]).optional(),
          language: z.string().optional(),
          content: z.string().optional(),
          path: z.string().optional(),
          parentId: z.number().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const result = await db.insert(codeFiles).values({
            userId: ctx.user.id,
            ...input,
          });
          return { id: result[0].insertId };
        }),
      
      update: protectedProcedure
        .input(z.object({
          id: z.number(),
          content: z.string().optional(),
          name: z.string().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          const { id, ...updates } = input;
          await db.update(codeFiles).set(updates).where(and(eq(codeFiles.id, id), eq(codeFiles.userId, ctx.user.id)));
          return { success: true };
        }),
      
      delete: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
          const db = await getDb();
          if (!db) throw new Error("Database not available");
          await db.delete(codeFiles).where(and(eq(codeFiles.id, input.id), eq(codeFiles.userId, ctx.user.id)));
          return { success: true };
        }),
    }),
    
    aiAssist: protectedProcedure
      .input(z.object({
        code: z.string(),
        language: z.string(),
        action: z.enum(["explain", "debug", "optimize", "document", "complete"]),
      }))
      .mutation(async ({ input }) => {
        const prompts: Record<string, string> = {
          explain: "Explain this code in detail:",
          debug: "Find and fix any bugs in this code:",
          optimize: "Optimize this code for better performance:",
          document: "Add comprehensive documentation to this code:",
          complete: "Complete this code snippet:",
        };
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `You are an expert ${input.language} developer and code assistant.` },
            { role: "user", content: `${prompts[input.action]}\n\n\`\`\`${input.language}\n${input.code}\n\`\`\`` },
          ],
        });
        
        return { result: response.choices[0]?.message?.content || "" };
      }),
    
    terminal: protectedProcedure
      .input(z.object({ command: z.string() }))
      .mutation(async ({ input }) => {
        // Simulate terminal commands (in a real app, this would execute in a sandbox)
        const safeCommands: Record<string, string> = {
          "help": "Available commands: help, ls, pwd, echo, date, whoami",
          "ls": "src/  package.json  README.md  .env  node_modules/",
          "pwd": "/home/user/project",
          "whoami": "nexus-user",
          "date": new Date().toISOString(),
        };
        
        const cmd = input.command.split(" ")[0];
        if (cmd === "echo") {
          return { output: input.command.replace("echo ", "") };
        }
        
        return { output: safeCommands[cmd] || `Command not found: ${cmd}` };
      }),
  }),

  // Activity Feed
  activities: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        return db.select().from(activities).where(eq(activities.userId, ctx.user.id)).orderBy(desc(activities.createdAt)).limit(input?.limit || 50);
      }),
    
    create: protectedProcedure
      .input(z.object({
        entityType: z.string(),
        entityId: z.number(),
        action: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        await db.insert(activities).values({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
